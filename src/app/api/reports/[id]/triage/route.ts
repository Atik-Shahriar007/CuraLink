import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/guards";
import { pusherServer } from "@/lib/pusher";
import { notifyAccount, notificationTemplates } from "@/lib/notifications";

const patchSchema = z.object({
  status: z.enum(["NEW", "ACKNOWLEDGED", "INVESTIGATING", "RESOLVED", "DISMISSED"]).optional(),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).optional(),
  assignedToId: z.string().nullable().optional(),
  resolutionNote: z.string().max(4000).optional(),
  /** When true, also post the resolution note as a comment the reporter can read. */
  notifyReporter: z.boolean().optional(),
  /** Convert this report into a support ticket for the existing queue. */
  convertToTicket: z.boolean().optional(),
});

const STATUS_LABELS: Record<string, string> = {
  NEW: "reopened",
  ACKNOWLEDGED: "acknowledged",
  INVESTIGATING: "under investigation",
  RESOLVED: "resolved",
  DISMISSED: "closed",
};

/**
 * Triage a report. Staff only — the reporter cannot change their own report's
 * status, or "resolved" would stop meaning anything.
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;
  const { account } = guard;

  const { id } = await params;
  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const existing = await prisma.issueReport.findUnique({
    where: { id },
    select: {
      id: true,
      reference: true,
      status: true,
      severity: true,
      assignedToId: true,
      title: true,
      description: true,
      category: true,
      reporterId: true,
      reporter: { select: { firstName: true, lastName: true, email: true, role: true } },
    },
  });

  if (!existing) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  // Resolving or dismissing without saying what was done leaves the reporter
  // (and the next engineer) with nothing. Required, not optional.
  const resolvingStatus =
    parsed.data.status === "RESOLVED" || parsed.data.status === "DISMISSED";

  if (resolvingStatus && !parsed.data.resolutionNote) {
    return NextResponse.json(
      { error: "A resolution note is required when resolving or closing a report." },
      { status: 400 }
    );
  }

  const data: Record<string, unknown> = {};
  const events: Array<{
    kind: string;
    body: string;
    fromValue?: string;
    toValue?: string;
  }> = [];

  if (parsed.data.status && parsed.data.status !== existing.status) {
    data.status = parsed.data.status;
    data.resolvedAt = resolvingStatus ? new Date() : null;
    if (parsed.data.resolutionNote) data.resolutionNote = parsed.data.resolutionNote;

    events.push({
      kind: "STATUS_CHANGE",
      body: parsed.data.resolutionNote
        ? `Status changed to ${parsed.data.status}: ${parsed.data.resolutionNote}`
        : `Status changed to ${parsed.data.status}.`,
      fromValue: existing.status,
      toValue: parsed.data.status,
    });
  } else if (parsed.data.resolutionNote) {
    data.resolutionNote = parsed.data.resolutionNote;
  }

  if (parsed.data.severity && parsed.data.severity !== existing.severity) {
    data.severity = parsed.data.severity;
    events.push({
      kind: "SEVERITY_CHANGE",
      body: `Severity changed from ${existing.severity} to ${parsed.data.severity}.`,
      fromValue: existing.severity,
      toValue: parsed.data.severity,
    });
  }

  if (parsed.data.assignedToId !== undefined && parsed.data.assignedToId !== existing.assignedToId) {
    data.assignedToId = parsed.data.assignedToId || null;

    let assigneeName = "nobody";
    if (parsed.data.assignedToId) {
      const assignee = await prisma.account.findUnique({
        where: { id: parsed.data.assignedToId },
        select: { firstName: true, lastName: true, email: true },
      });
      assigneeName = assignee
        ? [assignee.firstName, assignee.lastName].filter(Boolean).join(" ") || assignee.email
        : "an unknown account";
    }

    events.push({
      kind: "ASSIGNMENT",
      body: parsed.data.assignedToId
        ? `Assigned to ${assigneeName}.`
        : "Unassigned.",
    });
  }

  const updated = await prisma.$transaction(async (tx) => {
    const report = await tx.issueReport.update({ where: { id }, data });

    if (events.length > 0) {
      await tx.issueReportEvent.createMany({
        data: events.map((e) => ({
          reportId: id,
          authorId: account.id,
          kind: e.kind,
          body: e.body,
          fromValue: e.fromValue ?? null,
          toValue: e.toValue ?? null,
        })),
      });
    }

    if (parsed.data.status && parsed.data.notifyReporter !== false) {
      await tx.issueReportEvent.create({
        data: {
          reportId: id,
          authorId: account.id,
          kind: "COMMENT",
          body:
            parsed.data.resolutionNote ??
            `Your report is now ${STATUS_LABELS[parsed.data.status] ?? parsed.data.status.toLowerCase()}.`,
        },
      });
    }

    return report;
  });

  // Support ticket hand-off. Kept explicit rather than automatic: most reports
  // are bugs the engineering side should see, not conversations support should
  // own, and auto-creating tickets for all of them would flood the queue.
  let createdTicketId: string | null = null;
  if (parsed.data.convertToTicket) {
    const ticket = await prisma.supportTicket.create({
      data: {
        subject: `Report #${existing.reference}: ${existing.title}`,
        category: "TECHNICAL_ISSUE",
        createdById: existing.reporterId,
        messages: {
          create: {
            senderId: account.id,
            body: `Escalated from problem report #${existing.reference}.\n\n${existing.description}`,
          },
        },
      },
    });
    createdTicketId = ticket.id;

    await prisma.issueReportEvent.create({
      data: {
        reportId: id,
        authorId: account.id,
        kind: "COMMENT",
        body: `Escalated to the support queue as ticket ${ticket.ticketNumber}.`,
      },
    });
  }

  if (parsed.data.status) {
    void notifyAccount(
      existing.reporterId,
      notificationTemplates.issueReportStatusChanged(
        existing.reference,
        parsed.data.status,
        parsed.data.resolutionNote
      )
    );
  }

  await pusherServer
    .trigger(`report-${id}`, "status-update", { reportId: id, status: updated.status })
    .catch(() => {});

  return NextResponse.json({ ...updated, createdTicketId });
}

