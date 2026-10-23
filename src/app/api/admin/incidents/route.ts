import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/guards";
import { updateIncident, applyAutoFix, meanTimeToRepair } from "@/lib/incidents";
import { getFixer, isFixable } from "@/lib/maintenanceFixes";
import { getRuleDefinition } from "@/lib/maintenance";

/**
 * The incident work-order queue.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const params = req.nextUrl.searchParams;
  const status = params.get("status");
  const area = params.get("area");
  const severity = params.get("severity");
  const assignee = params.get("assignee");

  const where: Record<string, unknown> = {};
  if (status && status !== "ALL") {
    where.status = status === "OPEN_ALL" ? { not: "CLOSED" } : status;
  }
  if (severity && severity !== "ALL") where.severity = severity;
  if (area && area !== "ALL") where.rule = { area };
  if (assignee === "unassigned") where.assigneeId = null;
  else if (assignee === "me") where.assigneeId = guard.account.id;
  else if (assignee && assignee !== "ALL") where.assigneeId = assignee;

  const [incidents, counts, mttr, agents, areas] = await Promise.all([
    prisma.maintenanceIncident.findMany({
      where,
      orderBy: [{ status: "asc" }, { openedAt: "desc" }],
      take: 100,
      include: {
        rule: { select: { id: true, key: true, title: true, area: true, threshold: true, lastValue: true, lastStatus: true } },
        assignee: { select: { id: true, firstName: true, lastName: true } },
        verifiedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    }),
    prisma.maintenanceIncident.groupBy({ by: ["status"], _count: { _all: true } }),
    meanTimeToRepair(30),
    prisma.account.findMany({
      where: { role: "ADMIN", isActive: true },
      select: { id: true, firstName: true, lastName: true, email: true },
      orderBy: { firstName: "asc" },
    }),
    prisma.maintenanceRule.findMany({ select: { area: true }, distinct: ["area"] }),
  ]);

  const statusCounts: Record<string, number> = {};
  for (const row of counts) statusCounts[row.status] = row._count._all;

  return NextResponse.json({
    incidents: incidents.map((incident) => ({
      ...incident,
      rule: {
        ...incident.rule,
        fixable: isFixable(incident.rule.key),
        fixLabel: getFixer(incident.rule.key)?.label ?? null,
        definition: getRuleDefinition(incident.rule.key)?.description ?? null,
        thresholdUnit: getRuleDefinition(incident.rule.key)?.thresholdUnit ?? null,
      },
    })),
    statusCounts,
    mttrHours: mttr,
    agents,
    areas: areas.map((a) => a.area).sort(),
  });
}

const patchSchema = z.object({
  status: z.enum(["OPEN", "INVESTIGATING", "FIXED", "VERIFIED", "CLOSED"]).optional(),
  assigneeId: z.string().nullable().optional(),
  rootCause: z.string().max(4000).optional(),
  actionTaken: z.string().max(4000).optional(),
  verificationNote: z.string().max(4000).optional(),
  /** Run the registered automatic fixer for this incident's rule. */
  runAutoFix: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  const body = await req.json().catch(() => ({}));
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const incidentId = req.nextUrl.searchParams.get("id");
  if (!incidentId) {
    return NextResponse.json({ error: "Missing incident id" }, { status: 400 });
  }

  if (parsed.data.runAutoFix) {
    const result = await applyAutoFix(incidentId, guard.account.id);
    if ("error" in result) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    return NextResponse.json(result);
  }

  const result = await updateIncident({
    incidentId,
    actorId: guard.account.id,
    status: parsed.data.status,
    assigneeId: parsed.data.assigneeId,
    rootCause: parsed.data.rootCause,
    actionTaken: parsed.data.actionTaken,
    verificationNote: parsed.data.verificationNote,
  });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json(result);
}
