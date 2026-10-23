import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { seedRules } from "@/lib/maintenance";
import { meanTimeToRepair, meanTimeToRepairByArea } from "@/lib/incidents";

/**
 * The health console payload.
 *
 * Everything the System Health page renders comes from this one call: rule state,
 * the trend series behind each rule, open work orders, MTTR, and platform vitals.
 * Rendering the page from a single snapshot avoids the "half the numbers are
 * stale" problem you get when a dashboard fires six requests on mount.
 */
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  await seedRules();

  const [rules, openIncidents, recentIncidents, mttr, mttrByArea] = await Promise.all([
    prisma.maintenanceRule.findMany({
      orderBy: [{ area: "asc" }, { title: "asc" }],
      include: {
        checks: {
          orderBy: { createdAt: "desc" },
          take: 20,
          select: { value: true, status: true, createdAt: true },
        },
      },
    }),
    prisma.maintenanceIncident.findMany({
      where: { status: { not: "CLOSED" } },
      orderBy: [{ severity: "asc" }, { openedAt: "desc" }],
      include: {
        rule: { select: { key: true, title: true, area: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
      },
      take: 50,
    }),
    prisma.maintenanceIncident.findMany({
      orderBy: { openedAt: "desc" },
      take: 20,
      select: {
        id: true,
        title: true,
        status: true,
        severity: true,
        openedAt: true,
        resolvedAt: true,
        autoFixApplied: true,
        rule: { select: { key: true, area: true } },
      },
    }),
    meanTimeToRepair(30),
    meanTimeToRepairByArea(30),
  ]);

  // Vitals: cheap counts that tell an operator whether the platform underneath
  // is even alive before they start reading rule results.
  const [
    accounts,
    consultations,
    medicines,
    documents,
    reports,
    oldestConsultation,
    oldestReport,
    lastScan,
  ] = await Promise.all([
    prisma.account.count(),
    prisma.consultation.count(),
    prisma.medicine.count(),
    prisma.medicalDocument.count(),
    prisma.issueReport.count(),
    prisma.consultation.findFirst({
      where: { status: { in: ["PENDING", "IN_PROGRESS"] } },
      orderBy: { date: "asc" },
      select: { id: true, date: true, status: true },
    }),
    prisma.issueReport.findFirst({
      where: { status: "NEW" },
      orderBy: { createdAt: "asc" },
      select: { id: true, reference: true, createdAt: true, title: true },
    }),
    prisma.maintenanceRule.findFirst({
      where: { lastRunAt: { not: null } },
      orderBy: { lastRunAt: "desc" },
      select: { lastRunAt: true },
    }),
  ]);

  const activeRules = rules.filter((r) => r.isEnabled);

  const weights: Record<string, number> = { CRITICAL: 15, HIGH: 8, MEDIUM: 4, LOW: 1 };
  let score = 100;
  for (const rule of activeRules) {
    const status = rule.lastStatus ?? "OK";
    if (status === "BREACHED") score -= weights[rule.severity] ?? 4;
    else if (status === "WARNING") score -= Math.ceil((weights[rule.severity] ?? 4) / 2);
    else if (status === "ERROR") score -= 5;
  }
  score = Math.max(0, Math.min(100, score));

  const byArea = new Map<
    string,
    { area: string; rules: number; breached: number; warnings: number; errors: number; worst: string }
  >();

  for (const rule of activeRules) {
    const entry =
      byArea.get(rule.area) ??
      { area: rule.area, rules: 0, breached: 0, warnings: 0, errors: 0, worst: "OK" };
    entry.rules += 1;
    if (rule.lastStatus === "BREACHED") entry.breached += 1;
    if (rule.lastStatus === "WARNING") entry.warnings += 1;
    if (rule.lastStatus === "ERROR") entry.errors += 1;

    const rank = ["OK", "WARNING", "ERROR", "BREACHED"];
    if (rank.indexOf(rule.lastStatus ?? "OK") > rank.indexOf(entry.worst)) {
      entry.worst = rule.lastStatus ?? "OK";
    }
    byArea.set(rule.area, entry);
  }

  return NextResponse.json({
    score,
    band: score >= 85 ? "HEALTHY" : score >= 60 ? "ATTENTION" : "AT_RISK",
    rules: rules.map((rule) => ({
      id: rule.id,
      key: rule.key,
      title: rule.title,
      description: rule.description,
      area: rule.area,
      severity: rule.severity,
      threshold: rule.threshold,
      isEnabled: rule.isEnabled,
      lastRunAt: rule.lastRunAt,
      lastValue: rule.lastValue,
      lastStatus: rule.lastStatus,
      lastRunMessage: rule.lastRunMessage,
      // Oldest-first so the sparkline reads left to right.
      history: [...rule.checks].reverse().map((c) => ({
        value: c.value,
        status: c.status,
        at: c.createdAt,
      })),
    })),
    areas: [...byArea.values()].sort((a, b) => b.breached - a.breached || a.area.localeCompare(b.area)),
    openIncidents,
    recentIncidents,
    mttrHours: mttr,
    mttrByArea,
    vitals: {
      accounts,
      consultations,
      medicines,
      documents,
      reports,
      lastScanAt: lastScan?.lastRunAt ?? null,
      oldestOpenConsultation: oldestConsultation,
      oldestUnansweredReport: oldestReport,
    },
  });
}
