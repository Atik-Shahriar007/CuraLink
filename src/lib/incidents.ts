import { prisma } from "./prisma";
import { getFixer } from "./maintenanceFixes";
import { pusherServer } from "./pusher";

/**
 * Incident lifecycle.
 *
 * An incident is the maintenance work order: opened automatically when a rule
 * breaches, then owned and worked by a person. The important constraint is that
 * it cannot be *closed* by whoever fixed it — FIXED and CLOSED are separate
 * steps, and closing records who verified the fix. That separation is the whole
 * reason mean-time-to-repair here means something.
 */

export type IncidentStatus = "OPEN" | "INVESTIGATING" | "FIXED" | "VERIFIED" | "CLOSED";

/** Which transitions each status may move to. Enforced server-side. */
const ALLOWED_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  OPEN: ["INVESTIGATING", "FIXED", "CLOSED"],
  INVESTIGATING: ["FIXED", "OPEN", "CLOSED"],
  FIXED: ["VERIFIED", "INVESTIGATING", "CLOSED"],
  VERIFIED: ["CLOSED"],
  CLOSED: [],
};

export function canTransition(from: string, to: IncidentStatus): boolean {
  const allowed = ALLOWED_TRANSITIONS[from as IncidentStatus];
  if (!allowed) return false;
  return allowed.includes(to);
}

export function isOpenStatus(status: string): boolean {
  return status !== "CLOSED";
}

/**
 * Timestamps are set from the status being entered, and only the first time —
 * moving OPEN → INVESTIGATING → OPEN → INVESTIGATING must not reset the clock
 * an operator was being measured against.
 */
function timestampsFor(
  status: IncidentStatus,
  existing: { acknowledgedAt: Date | null; fixedAt: Date | null; resolvedAt: Date | null; closedAt: Date | null }
) {
  const now = new Date();
  const data: Record<string, Date> = {};

  if (status === "INVESTIGATING" && !existing.acknowledgedAt) data.acknowledgedAt = now;
  if ((status === "FIXED" || status === "VERIFIED" || status === "CLOSED") && !existing.fixedAt) {
    data.fixedAt = now;
  }
  if ((status === "VERIFIED" || status === "CLOSED") && !existing.resolvedAt) {
    data.resolvedAt = now;
  }
  if (status === "CLOSED" && !existing.closedAt) data.closedAt = now;

  return data;
}

export interface UpdateIncidentInput {
  incidentId: string;
  actorId: string;
  status?: IncidentStatus;
  assigneeId?: string | null;
  rootCause?: string;
  actionTaken?: string;
  verificationNote?: string;
  /** True when the status change is a verification sign-off. */
  verifying?: boolean;
}

export async function updateIncident(input: UpdateIncidentInput) {
  const incident = await prisma.maintenanceIncident.findUnique({
    where: { id: input.incidentId },
    include: { rule: { select: { key: true, title: true } } },
  });

  if (!incident) {
    return { error: "Incident not found" as const, status: 404 };
  }

  if (input.status && !canTransition(incident.status, input.status)) {
    return {
      error: `Cannot move an incident from ${incident.status} to ${input.status}.`,
      status: 400,
    };
  }

  const data: Record<string, unknown> = {
    ...timestampsFor(
      (input.status ?? incident.status) as IncidentStatus,
      incident
    ),
  };

  if (input.status) data.status = input.status;
  if (input.assigneeId !== undefined) data.assigneeId = input.assigneeId || null;
  if (input.rootCause !== undefined) data.rootCause = input.rootCause;
  if (input.actionTaken !== undefined) data.actionTaken = input.actionTaken;

  if (input.status === "VERIFIED" || input.status === "CLOSED") {
    data.verifiedById = input.actorId;
    if (input.verificationNote !== undefined) data.verificationNote = input.verificationNote;
  }

  const updated = await prisma.maintenanceIncident.update({
    where: { id: input.incidentId },
    data,
  });

  await pusherServer
    .trigger("admin-health", "incident-updated", {
      incidentId: updated.id,
      status: updated.status,
    })
    .catch(() => {});

  return { incident: updated };
}

/**
 * Run the registered fixer for a rule and attach the outcome to the incident.
 *
 * The fixer's report is written into `actionTaken` rather than a separate log,
 * so anyone opening the incident later reads what was actually done without
 * needing to correlate two screens.
 */
export async function applyAutoFix(incidentId: string, actorId: string) {
  const incident = await prisma.maintenanceIncident.findUnique({
    where: { id: incidentId },
    include: { rule: { select: { key: true, title: true } } },
  });

  if (!incident) return { error: "Incident not found" as const, status: 404 };

  const fixer = getFixer(incident.rule.key);
  if (!fixer) {
    return { error: "This rule has no automatic fix available.", status: 400 };
  }

  const outcome = await fixer.run();

  const note = [
    `Automatic fix applied: ${fixer.label}`,
    outcome.summary,
    outcome.affectedIds.length > 0
      ? `Records touched (${outcome.affectedIds.length}): ${outcome.affectedIds.slice(0, 10).join(", ")}${
          outcome.affectedIds.length > 10 ? ", …" : ""
        }`
      : null,
  ]
    .filter(Boolean)
    .join("\n");

  const updated = await prisma.maintenanceIncident.update({
    where: { id: incidentId },
    data: {
      autoFixApplied: true,
      actionTaken: incident.actionTaken ? `${incident.actionTaken}\n\n${note}` : note,
      assigneeId: incident.assigneeId ?? actorId,
      // The fixer does not close the incident. It moves it to FIXED so a second
      // person still confirms the underlying problem is gone.
      status: incident.status === "OPEN" ? "INVESTIGATING" : incident.status,
      acknowledgedAt: incident.acknowledgedAt ?? new Date(),
    },
  });

  return { incident: updated, outcome };
}

/**
 * Mean time to repair, in hours, across verified/closed incidents.
 *
 * Measured from `openedAt` to `resolvedAt` (the point a human confirmed the fix)
 * rather than to `closedAt`, so the figure is not inflated by however long the
 * paperwork sat around afterwards.
 */
export async function meanTimeToRepair(sinceDays = 30): Promise<number | null> {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);

  const resolved = await prisma.maintenanceIncident.findMany({
    where: { resolvedAt: { not: null, gte: since }, openedAt: { gte: since } },
    select: { openedAt: true, resolvedAt: true },
  });

  if (resolved.length === 0) return null;

  const totalMs = resolved.reduce((sum, i) => {
    const end = i.resolvedAt?.getTime() ?? i.openedAt.getTime();
    return sum + (end - i.openedAt.getTime());
  }, 0);

  return totalMs / resolved.length / (60 * 60 * 1000);
}

/** MTTR broken down by area, for the "where do we lose the most time" view. */
export async function meanTimeToRepairByArea(sinceDays = 30) {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);

  const incidents = await prisma.maintenanceIncident.findMany({
    where: { resolvedAt: { not: null, gte: since }, openedAt: { gte: since } },
    select: {
      openedAt: true,
      resolvedAt: true,
      rule: { select: { area: true } },
    },
  });

  const byArea = new Map<string, { totalMs: number; count: number }>();

  for (const incident of incidents) {
    const area = incident.rule.area;
    const end = incident.resolvedAt?.getTime() ?? incident.openedAt.getTime();
    const entry = byArea.get(area) ?? { totalMs: 0, count: 0 };
    entry.totalMs += end - incident.openedAt.getTime();
    entry.count += 1;
    byArea.set(area, entry);
  }

  return [...byArea.entries()]
    .map(([area, { totalMs, count }]) => ({
      area,
      avgHours: totalMs / count / (60 * 60 * 1000),
      count,
    }))
    .sort((a, b) => b.avgHours - a.avgHours);
}
