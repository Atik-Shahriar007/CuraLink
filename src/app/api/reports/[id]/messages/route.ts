import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAccount } from "@/lib/guards";
import { pusherServer } from "@/lib/pusher";
import { notifyAccount, notificationTemplates } from "@/lib/notifications";
import { uploadDocument } from "@/lib/cloudinary";

const messageSchema = z.object({
  body: z.string().min(1).max(4000),
  attachmentBase64: z.string().optional(),
});

/**
 * Add a comment to a report thread.
 *
 * Both the reporter and staff post here. The first staff reply auto-assigns the
 * report to that agent and moves NEW → ACKNOWLEDGED, mirroring how the support
 * ticket flow claims a ticket — the difference is that this is recorded as an
 * event, so the reporter sees "your report was picked up by X" in the timeline.
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAccount();
  if ("error" in guard) return guard.error;
  const { account } = guard;

  const { id } = await params;
  const isStaff = account.role === "ADMIN" || account.role === "SUPPORT_AGENT";

  const report = await prisma.issueReport.findUnique({
    where: { id },
    select: {
      id: true,
      reference: true,
      reporterId: true,
      status: true,
      assignedToId: true,
      title: true,
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (!isStaff && report.reporterId !== account.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  let attachmentUrl: string | null = null;
  if (parsed.data.attachmentBase64) {
    try {
      attachmentUrl = await uploadDocument(parsed.data.attachmentBase64, "curalink/reports");
    } catch (err) {
      console.error("[reports] comment attachment upload failed:", err);
    }
  }

  const [event] = await prisma.$transaction([
    prisma.issueReportEvent.create({
      data: {
        reportId: id,
        authorId: account.id,
        kind: "COMMENT",
        // Events have no attachment column, so an uploaded file is appended to
        // the comment body as a link. Dropping it silently would lose the one
        // piece of evidence the reporter bothered to provide.
        body: attachmentUrl
          ? `${parsed.data.body}\n\nAttachment: ${attachmentUrl}`
          : parsed.data.body,
      },
      include: {
        author: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    }),
    prisma.issueReport.update({
      where: { id },
      data: {
        updatedAt: new Date(),
        // Staff involvement is what moves a report out of the untouched pile.
        ...(isStaff
          ? {
              assignedToId: report.assignedToId ?? account.id,
              status: report.status === "NEW" ? "ACKNOWLEDGED" : report.status,
            }
          : {}),
        // A reporter replying to a resolved report reopens it: the problem
        // evidently is not fixed, and burying that would be dishonest.
        ...(!isStaff && (report.status === "RESOLVED" || report.status === "DISMISSED")
          ? { status: "NEW", resolvedAt: null }
          : {}),
      },
    }),
  ]);

  await pusherServer
    .trigger(`report-${id}`, "new-message", { reportId: id, eventId: event.id })
    .catch(() => {});

  // Notify the other side only. Telling an agent about their own comment is noise.
  if (isStaff) {
    void notifyAccount(
      report.reporterId,
      notificationTemplates.issueReportComment(report.reference, true)
    );
  } else {
    const targets = await prisma.account.findMany({
      where: {
        OR: [{ role: "ADMIN" }, { id: report.assignedToId ?? "" }],
        isActive: true,
      },
      select: { id: true },
    });
    void Promise.allSettled(
      targets.map((t) =>
        notifyAccount(t.id, notificationTemplates.issueReportComment(report.reference, false))
      )
    );
  }

  return NextResponse.json(event);
}


