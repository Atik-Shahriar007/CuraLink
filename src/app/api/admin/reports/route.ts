import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/guards";
import { findReportClusters, reportInboxCounts, resolveReportContext } from "@/lib/reports";

/**
 * The triage inbox.
 *
 * Returns the filtered report list, the counts that head the page, and the
 * repeat-report clusters — all in one response, because an operator opening the
 * queue needs to see "this same consultation has been reported six times"
 * *at the same moment* as the list, not after a second round trip.
 */
export async function GET(req: NextRequest) {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  const severity = params.get("severity");
  const category = params.get("category");
  const source = params.get("source");
  const assignee = params.get("assignee");
  const search = params.get("search");
  const page = Math.max(1, Number(params.get("page") ?? 1));
  const pageSize = Math.min(100, Math.max(5, Number(params.get("pageSize") ?? 25)));

  const where: Record<string, unknown> = {};

  if (status && status !== "ALL") where.status = status;
  if (severity && severity !== "ALL") where.severity = severity;
  if (category && category !== "ALL") where.category = category;
  if (source && source !== "ALL") where.source = source;
  if (assignee === "unassigned") where.assignedToId = null;
  else if (assignee === "me") where.assignedToId = guard.account.id;
  else if (assignee && assignee !== "ALL") where.assignedToId = assignee;

  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
      { contextPath: { contains: search, mode: "insensitive" } },
      { reporter: { email: { contains: search, mode: "insensitive" } } },
    ];
  }

  const [reports, total, counts, clusters] = await Promise.all([
    prisma.issueReport.findMany({
      where,
      orderBy: [{ severity: "asc" }, { createdAt: "desc" }],
      skip: (page - 1) * pageSize,
      take: pageSize,
      include: {
        reporter: { select: { firstName: true, lastName: true, email: true, role: true } },
        assignedTo: { select: { id: true, firstName: true, lastName: true } },
        _count: { select: { events: true } },
      },
    }),
    prisma.issueReport.count({ where }),
    reportInboxCounts(),
    findReportClusters(),
  ]);

  // Resolve the deep-link label for each row so the list shows what the report
  // is actually about rather than a raw entity id.
  const withContext = await Promise.all(
    reports.map(async (report) => ({
      ...report,
      context: await resolveReportContext(report.contextEntity, report.contextEntityId),
    }))
  );

  // Staff picker options for the assign dropdown.
  const agents = await prisma.account.findMany({
    where: { role: { in: ["ADMIN", "SUPPORT_AGENT"] }, isActive: true },
    select: { id: true, firstName: true, lastName: true, email: true, role: true },
    orderBy: { firstName: "asc" },
  });

  return NextResponse.json({
    reports: withContext,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
    counts,
    clusters,
    agents,
  });
}
