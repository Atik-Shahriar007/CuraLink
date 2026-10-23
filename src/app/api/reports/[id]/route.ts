import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAccount } from "@/lib/guards";
import { resolveReportContext } from "@/lib/reports";

/**
 * A single report with its full timeline. Visible to the person who filed it and
 * to staff — nobody else, which is why the access check compares the reporter id
 * rather than trusting the caller's role alone.
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const guard = await requireAccount();
  if ("error" in guard) return guard.error;
  const { account } = guard;

  const { id } = await params;
  const isStaff = account.role === "ADMIN" || account.role === "SUPPORT_AGENT";

  const report = await prisma.issueReport.findUnique({
    where: { id },
    include: {
      reporter: {
        select: { id: true, firstName: true, lastName: true, email: true, role: true, phone: true },
      },
      assignedTo: { select: { id: true, firstName: true, lastName: true } },
      events: {
        orderBy: { createdAt: "asc" },
        include: {
          author: { select: { id: true, firstName: true, lastName: true, role: true } },
        },
      },
    },
  });

  if (!report) {
    return NextResponse.json({ error: "Report not found" }, { status: 404 });
  }

  if (!isStaff && report.reporterId !== account.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // The reporter's account is reduced to what they are allowed to know about
  // themselves; staff get the contact details so they can follow up directly.
  const context = await resolveReportContext(report.contextEntity, report.contextEntityId);

  return NextResponse.json({
    ...report,
    context,
    reporter: isStaff
      ? report.reporter
      : {
          id: report.reporter.id,
          firstName: report.reporter.firstName,
          lastName: report.reporter.lastName,
          email: report.reporter.email,
          role: report.reporter.role,
        },
  });
}
