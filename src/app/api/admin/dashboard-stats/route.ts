import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { seedRules } from "@/lib/maintenance";

/**
 * Admin dashboard headline numbers.
 *
 * Beyond the approval counts this now includes the two operations signals that
 * belong on a landing page: how many user reports are sitting untouched, and
 * whether any standing check is currently breaching. Both are deliberately
 * *actionable* counts rather than totals — a dashboard that only shows "you have
 * 4,000 patients" tells an admin nothing about what to do next.
 */
export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    pendingDoctors, totalDoctors, totalPatients, pendingProviders,
    openTickets, totalMedicines, pendingBlogPosts,
    openReports, unassignedReports, criticalReports,
  ] = await Promise.all([
    prisma.doctor.count({ where: { approvalStatus: "PENDING" } }),
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.ambulanceProvider.count({ where: { approvalStatus: "PENDING" } }),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.medicine.count(),
    prisma.blogPost.count({ where: { status: "PENDING_REVIEW" } }),
    prisma.issueReport.count({ where: { status: { notIn: ["RESOLVED", "DISMISSED"] } } }),
    prisma.issueReport.count({ where: { status: "NEW", assignedToId: null } }),
    prisma.issueReport.count({
      where: { severity: "CRITICAL", status: { notIn: ["RESOLVED", "DISMISSED"] } },
    }),
  ]);

  // Health score mirrors the /api/admin/health calculation so the dashboard card
  // and the full console never disagree. Seeded first so the numbers exist even
  // on a fresh deployment that has not run a scan yet.
  await seedRules();

  const rules = await prisma.maintenanceRule.findMany({
    where: { isEnabled: true },
    select: { severity: true, lastStatus: true },
  });

  const weights: Record<string, number> = { CRITICAL: 15, HIGH: 8, MEDIUM: 4, LOW: 1 };
  let healthScore = 100;
  for (const rule of rules) {
    if (rule.lastStatus === "BREACHED") healthScore -= weights[rule.severity] ?? 4;
    else if (rule.lastStatus === "WARNING") healthScore -= Math.ceil((weights[rule.severity] ?? 4) / 2);
    else if (rule.lastStatus === "ERROR") healthScore -= 5;
  }
  healthScore = Math.max(0, Math.min(100, healthScore));

  const breachedRules = await prisma.maintenanceRule.findMany({
    where: { isEnabled: true, lastStatus: "BREACHED" },
    orderBy: { severity: "asc" },
    take: 3,
    select: { key: true, title: true, severity: true, lastRunMessage: true, lastValue: true },
  });

  const openIncidents = await prisma.maintenanceIncident.count({
    where: { status: { not: "CLOSED" } },
  });

  return NextResponse.json({
    pendingDoctors, totalDoctors, totalPatients, pendingProviders,
    openTickets, totalMedicines, pendingBlogPosts,
    openReports, unassignedReports, criticalReports,
    healthScore,
    breachedRules,
    openIncidents,
  });
}
