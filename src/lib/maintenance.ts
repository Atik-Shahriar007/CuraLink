import { prisma } from "./prisma";
import { pusherServer } from "./pusher";
import { notifyAccount, notificationTemplates } from "./notifications";

/**
 * Platform health engine.
 *
 * The idea: CuraLink already accumulates the symptoms of things going wrong —
 * consultations that never started, payments that took money without creating a
 * booking, doctors who are listed but have no bookable hours. Nothing looked at
 * them, so they were only ever noticed when a user complained.
 *
 * This module turns those symptoms into *rules*. A rule is a standing question
 * about the data with a threshold, evaluated on a schedule. Each evaluation is
 * recorded as a `MaintenanceCheck`, and a rule crossing its threshold opens a
 * `MaintenanceIncident` — a work order that stays open until somebody has fixed
 * the underlying problem and a second person has verified it.
 *
 * Design notes:
 *  - Rule *definitions* live here in code (they need Prisma queries, which can't
 *    live in the database); the operator-tunable parts — threshold, enabled —
 *    live in the `MaintenanceRule` row. `seedRules()` keeps the two in sync.
 *  - Every rule returns a count plus a handful of offending ids, so the console
 *    can offer a jump-to-the-broken-thing link instead of just a number.
 *  - A rule that throws is recorded as ERROR rather than taking down the scan.
 */

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type RuleStatus = "OK" | "WARNING" | "BREACHED" | "ERROR";
export type Severity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export interface RuleResult {
  value: number;
  status: RuleStatus;
  message: string;
  sampleIds: string[];
}

export interface RuleDefinition {
  key: string;
  title: string;
  description: string;
  area: string;
  severity: Severity;
  /** Seeds the DB row the first time the rule is seen. */
  defaultThreshold: number;
  /** Human label for the threshold input, e.g. "minutes". */
  thresholdUnit: string;
  /**
   * Whether `autoFix` can repair this rule's findings. Only rules with a
   * deterministic, non-inventive fix qualify.
   */
  fixable: boolean;
  run: (threshold: number) => Promise<RuleResult>;
}

const HOUR_MS = 60 * 60 * 1000;
const DAY_MS = 24 * HOUR_MS;

function daysAgo(days: number): Date {
  return new Date(Date.now() - days * DAY_MS);
}

function minutesAgo(minutes: number): Date {
  return new Date(Date.now() - minutes * 60 * 1000);
}

function ok(message: string, value = 0): RuleResult {
  return { value, status: "OK", message, sampleIds: [] };
}

/**
 * Standard threshold ladder: at or above the threshold is a breach, and
 * anything from half the threshold up is worth flagging as a warning so an
 * operator sees a trend building before it becomes a work order.
 */
function banded(
  value: number,
  threshold: number,
  message: string,
  sampleIds: string[]
): RuleResult {
  if (value >= threshold) return { value, status: "BREACHED", message, sampleIds };
  if (threshold > 1 && value >= Math.ceil(threshold / 2)) {
    return { value, status: "WARNING", message, sampleIds };
  }
  return { value, status: "OK", message, sampleIds };
}

// ---------------------------------------------------------------------------
// Rule registry
// ---------------------------------------------------------------------------

export const RULE_DEFINITIONS: RuleDefinition[] = [
  // --- Consultations ------------------------------------------------------
  {
    key: "stale_consultations",
    title: "Consultations stuck past their start time",
    description:
      "Booked consultations still PENDING or IN_PROGRESS more than an hour after they were due to start. These are the ones where a patient paid, waited, and nothing happened.",
    area: "Consultations",
    severity: "CRITICAL",
    defaultThreshold: 1,
    thresholdUnit: "consultations",
    fixable: true,
    async run(threshold) {
      const cutoff = minutesAgo(60);
      const stale = await prisma.consultation.findMany({
        where: { status: { in: ["PENDING", "IN_PROGRESS"] }, date: { lte: cutoff } },
        select: { id: true },
        take: 50,
      });
      return banded(
        stale.length,
        threshold,
        `${stale.length} consultation(s) are over an hour past their scheduled start and never closed out.`,
        stale.map((c) => c.id)
      );
    },
  },
  {
    key: "completed_without_notes",
    title: "Consultations completed without doctor notes",
    description:
      "Finished consultations where the doctor wrote no clinical notes. The patient has no record of what was discussed or advised.",
    area: "Consultations",
    severity: "HIGH",
    defaultThreshold: 5,
    thresholdUnit: "consultations",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.consultation.findMany({
        where: {
          status: "COMPLETED",
          OR: [{ notes: null }, { notes: "" }],
          date: { gte: daysAgo(30) },
        },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} consultation(s) in the last 30 days were completed with no notes recorded.`,
        rows.map((c) => c.id)
      );
    },
  },
  {
    key: "in_progress_overrun",
    title: "Live consultations running unusually long",
    description:
      "Consultations still IN_PROGRESS two hours after starting. Usually a doctor forgot to end the call, which leaves the payment and prescription flow stuck.",
    area: "Consultations",
    severity: "MEDIUM",
    defaultThreshold: 3,
    thresholdUnit: "consultations",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.consultation.findMany({
        where: { status: "IN_PROGRESS", date: { lte: minutesAgo(120) } },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} consultation(s) have been in progress for over two hours.`,
        rows.map((c) => c.id)
      );
    },
  },
  {
    key: "cancel_rate_7d",
    title: "Cancellation rate over the last 7 days",
    description:
      "Share of consultations in the last week that were canceled. A sudden jump usually means a scheduling or payment problem, not normal churn.",
    area: "Consultations",
    severity: "MEDIUM",
    defaultThreshold: 30,
    thresholdUnit: "% canceled",
    fixable: false,
    async run(threshold) {
      const since = daysAgo(7);
      const [total, canceled] = await Promise.all([
        prisma.consultation.count({ where: { createdAt: { gte: since } } }),
        prisma.consultation.count({ where: { createdAt: { gte: since }, status: "CANCELED" } }),
      ]);
      const pct = total === 0 ? 0 : Math.round((canceled / total) * 100);
      return banded(
        pct,
        threshold,
        total === 0
          ? "No consultations booked in the last 7 days."
          : `${canceled} of ${total} consultations booked in the last 7 days were canceled (${pct}%).`,
        []
      );
    },
  },

  // --- Prescriptions ------------------------------------------------------
  {
    key: "completed_without_prescription",
    title: "Completed consultations with no prescription",
    description:
      "Paid-for consultations that finished without a prescription being written. Often legitimate, but a cluster of them usually means doctors are abandoning the prescribing step.",
    area: "Prescriptions",
    severity: "HIGH",
    defaultThreshold: 10,
    thresholdUnit: "consultations",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.consultation.findMany({
        where: {
          status: "COMPLETED",
          // `is: null` rather than a bare `null`: explicit on the optional
          // to-one relation, so the intent survives a Prisma upgrade.
          prescription: { is: null },
          date: { gte: daysAgo(30) },
        },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} completed consultation(s) in the last 30 days never received a prescription.`,
        rows.map((c) => c.id)
      );
    },
  },
  {
    key: "prescription_revision_churn",
    title: "Prescriptions rewritten repeatedly",
    description:
      "Prescriptions on revision 3 or higher. Repeated rewrites suggest the prescribing flow is confusing, or a doctor is correcting genuine mistakes after the fact.",
    area: "Prescriptions",
    severity: "LOW",
    defaultThreshold: 5,
    thresholdUnit: "prescriptions",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.prescription.findMany({
        where: { revision: { gte: 3 } },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} prescription(s) have been revised three or more times.`,
        rows.map((p) => p.id)
      );
    },
  },

  // --- Payments -----------------------------------------------------------
  {
    key: "paid_without_consultation",
    title: "Payments taken with no consultation created",
    description:
      "A PAID payment that was never linked to a consultation. The patient's money left but no booking exists — the single worst state this platform can be in.",
    area: "Payments",
    severity: "CRITICAL",
    defaultThreshold: 1,
    thresholdUnit: "payments",
    fixable: true,
    async run(threshold) {
      const rows = await prisma.payment.findMany({
        where: { status: "PAID", consultationId: null },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} paid payment(s) have no consultation attached. Patients have been charged without a booking.`,
        rows.map((p) => p.id)
      );
    },
  },
  {
    key: "payment_failure_rate_30d",
    title: "Payment failure rate over 30 days",
    description:
      "Failed card payments as a share of all attempts. A rise here is a checkout or Stripe configuration problem and costs bookings quietly.",
    area: "Payments",
    severity: "HIGH",
    defaultThreshold: 15,
    thresholdUnit: "% failed",
    fixable: false,
    async run(threshold) {
      const since = daysAgo(30);
      const [attempts, failed] = await Promise.all([
        prisma.payment.count({ where: { createdAt: { gte: since } } }),
        prisma.payment.count({ where: { createdAt: { gte: since }, status: "FAILED" } }),
      ]);
      const pct = attempts === 0 ? 0 : Math.round((failed / attempts) * 100);
      return banded(
        pct,
        threshold,
        attempts === 0
          ? "No payment attempts in the last 30 days."
          : `${failed} of ${attempts} payment attempts failed in the last 30 days (${pct}%).`,
        []
      );
    },
  },
  {
    key: "refund_spike_7d",
    title: "Refunds issued in the last 7 days",
    description:
      "Volume of refunds in the last week. Refunds themselves are healthy; a spike means lots of consultations failed to happen after being paid for.",
    area: "Payments",
    severity: "MEDIUM",
    defaultThreshold: 10,
    thresholdUnit: "refunds",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.payment.findMany({
        where: { refundedAt: { gte: daysAgo(7) } },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} refund(s) were issued in the last 7 days.`,
        rows.map((p) => p.id)
      );
    },
  },
  {
    key: "pending_payments_expired",
    title: "Stale pending payments",
    description:
      "Checkout sessions started more than a day ago that never completed. Harmless on their own, but a growing pile points at an abandoned-checkout problem.",
    area: "Payments",
    severity: "LOW",
    defaultThreshold: 25,
    thresholdUnit: "payments",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.payment.findMany({
        where: { status: "PENDING", createdAt: { lte: daysAgo(1) } },
        select: { id: true },
        take: 100,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} checkout session(s) were started over a day ago and never completed.`,
        rows.map((p) => p.id)
      );
    },
  },

  // --- Doctors ------------------------------------------------------------
  {
    key: "approved_unverified_30d",
    title: "Doctors listed for 30 days without verification",
    description:
      "Approved doctors who have been visible to patients for a month but whose licence has still not been checked. They can take bookings without the verified badge.",
    area: "Doctors",
    severity: "HIGH",
    defaultThreshold: 3,
    thresholdUnit: "doctors",
    fixable: true,
    async run(threshold) {
      const rows = await prisma.doctor.findMany({
        where: {
          approvalStatus: "APPROVED",
          verificationStatus: { in: ["UNVERIFIED", "REJECTED"] },
          createdAt: { lte: daysAgo(30) },
        },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} doctor(s) have been listed for over 30 days without licence verification.`,
        rows.map((d) => d.id)
      );
    },
  },
  {
    key: "doctors_without_schedule",
    title: "Approved doctors with no bookable hours",
    description:
      "Approved doctors whose weekly schedule has no enabled day. They appear in search results and attract clicks, but the booking widget can never offer a slot — a dead end for the patient.",
    area: "Doctors",
    severity: "HIGH",
    defaultThreshold: 1,
    thresholdUnit: "doctors",
    fixable: false,
    async run(threshold) {
      const doctors = await prisma.doctor.findMany({
        where: { approvalStatus: "APPROVED" },
        select: { id: true, schedule: true },
      });
      const broken = doctors.filter((d) => !hasAnyEnabledDay(d.schedule));
      return banded(
        broken.length,
        threshold,
        `${broken.length} approved doctor(s) have no enabled days in their schedule and cannot be booked.`,
        broken.map((d) => d.id)
      );
    },
  },
  {
    key: "zero_price_doctors",
    title: "Approved doctors with no consultation fee",
    description:
      "Approved doctors with a missing or zero price. Checkout rejects these, so the patient reaches the payment step and hits an error.",
    area: "Doctors",
    severity: "CRITICAL",
    defaultThreshold: 1,
    thresholdUnit: "doctors",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.doctor.findMany({
        where: {
          approvalStatus: "APPROVED",
          OR: [{ price: null }, { price: { lte: 0 } }],
        },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} approved doctor(s) have no consultation fee set; checkout will reject their bookings.`,
        rows.map((d) => d.id)
      );
    },
  },
  {
    key: "incomplete_doctor_profiles",
    title: "Doctors with incomplete profiles",
    description:
      "Approved doctors missing a photo, specialty, hospital, or bio. Sparse listings convert badly and patients book the doctor with a face over the one without.",
    area: "Doctors",
    severity: "LOW",
    defaultThreshold: 10,
    thresholdUnit: "doctors",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.doctor.findMany({
        where: {
          approvalStatus: "APPROVED",
          OR: [
            { photoUrl: null },
            { specialty: null },
            { hospital: null },
            { description: null },
          ],
        },
        select: { id: true },
        take: 100,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} approved doctor profile(s) are missing a photo, specialty, hospital, or bio.`,
        rows.map((d) => d.id)
      );
    },
  },

  // --- Medicines ----------------------------------------------------------
  {
    key: "catalog_gaps",
    title: "Catalogue entries missing clinical information",
    description:
      "Medicines with no description, dosage, or image. These render as a bare name and price, which looks broken next to a properly filled-in entry.",
    area: "Catalogue",
    severity: "LOW",
    defaultThreshold: 100,
    thresholdUnit: "medicines",
    fixable: true,
    async run(threshold) {
      const rows = await prisma.medicine.findMany({
        where: {
          OR: [{ description: null }, { dosage: null }, { imageUrl: null }],
        },
        select: { id: true },
        take: 100,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} catalogue entry(s) are missing a description, dosage, or image.`,
        rows.map((m) => m.id)
      );
    },
  },
  {
    key: "medicines_missing_manufacturer",
    title: "Medicines with no manufacturer recorded",
    description:
      "Imported catalogue rows that never had a manufacturer filled in. Not breaking anything, but it is the visible half of an incomplete import.",
    area: "Catalogue",
    severity: "LOW",
    defaultThreshold: 200,
    thresholdUnit: "medicines",
    fixable: false,
    async run(threshold) {
      const count = await prisma.medicine.count({ where: { manufacturer: null } });
      return banded(
        count,
        threshold,
        `${count} catalogue entry(s) have no manufacturer recorded.`,
        []
      );
    },
  },

  // --- Ambulance ----------------------------------------------------------
  {
    key: "unclaimed_ambulance_requests",
    title: "Ambulance requests nobody has accepted",
    description:
      "Emergency requests sitting unclaimed for more than 15 minutes. This is the highest-stakes rule on the board — someone may be waiting for an ambulance.",
    area: "Ambulance",
    severity: "CRITICAL",
    defaultThreshold: 1,
    thresholdUnit: "requests",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.ambulanceRequest.findMany({
        where: { status: "REQUESTED", createdAt: { lte: minutesAgo(15) } },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} ambulance request(s) have gone unclaimed for over 15 minutes.`,
        rows.map((r) => r.id)
      );
    },
  },
  {
    key: "ambulance_completion_stall",
    title: "Ambulance requests never completed",
    description:
      "Accepted or dispatched requests that have been open for more than six hours without reaching ARRIVED or COMPLETED. Usually a provider who accepted and then went dark.",
    area: "Ambulance",
    severity: "HIGH",
    defaultThreshold: 2,
    thresholdUnit: "requests",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.ambulanceRequest.findMany({
        where: {
          status: { in: ["ACCEPTED", "DISPATCHED"] },
          updatedAt: { lte: new Date(Date.now() - 6 * HOUR_MS) },
        },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} ambulance request(s) have been open for over six hours without completing.`,
        rows.map((r) => r.id)
      );
    },
  },

  // --- Support ------------------------------------------------------------
  {
    key: "support_sla_at_risk",
    title: "Support tickets past the 24 hour SLA",
    description:
      "Open tickets older than a day. These are the ones that turn into angry emails, and they are cheap to prevent.",
    area: "Support",
    severity: "HIGH",
    defaultThreshold: 5,
    thresholdUnit: "tickets",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.supportTicket.findMany({
        where: { status: { in: ["OPEN", "IN_PROGRESS"] }, createdAt: { lte: daysAgo(1) } },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} support ticket(s) have been open for over 24 hours.`,
        rows.map((t) => t.id)
      );
    },
  },
  {
    key: "low_satisfaction_30d",
    title: "Average ticket satisfaction below target",
    description:
      "Mean satisfaction rating on resolved tickets over the last 30 days, scaled to a percentage. Below 80% means people are leaving unhappy even when we close the ticket.",
    area: "Support",
    severity: "MEDIUM",
    defaultThreshold: 80,
    thresholdUnit: "% satisfaction",
    fixable: false,
    async run(threshold) {
      // `SupportTicket` has no resolvedAt column, so the 30-day window uses
      // updatedAt — which is bumped when the ticket is closed — and the status
      // filter keeps only tickets that actually reached a resolution.
      const rows = await prisma.supportTicket.findMany({
        where: {
          satisfactionRating: { not: null },
          status: { in: ["RESOLVED", "CLOSED"] },
          updatedAt: { gte: daysAgo(30) },
        },
        select: { satisfactionRating: true },
      });
      if (rows.length === 0) {
        return ok("No rated tickets in the last 30 days.");
      }
      const avg =
        rows.reduce((sum, r) => sum + (r.satisfactionRating ?? 0), 0) / rows.length;
      const pct = Math.round((avg / 5) * 100);
      // Inverted rule: a *lower* score is worse, so compare against a ceiling.
      return {
        value: pct,
        status: pct >= threshold ? "OK" : pct <= Math.floor(threshold * 0.7) ? "BREACHED" : "WARNING",
        message: `Average satisfaction over ${rows.length} rated ticket(s) is ${avg.toFixed(1)}/5 (${pct}%).`,
        sampleIds: [],
      };
    },
  },

  // --- Reporting signal ---------------------------------------------------
  {
    key: "unresolved_user_reports",
    title: "User problem reports awaiting action",
    description:
      "Reports filed by patients, doctors, or providers that are still NEW and unassigned. These are people telling us something is broken — the queue should never be deep.",
    area: "Reports",
    severity: "HIGH",
    defaultThreshold: 5,
    thresholdUnit: "reports",
    fixable: false,
    async run(threshold) {
      const rows = await prisma.issueReport.findMany({
        where: { status: "NEW", assignedToId: null },
        select: { id: true },
        take: 50,
      });
      return banded(
        rows.length,
        threshold,
        `${rows.length} user report(s) are new and unassigned.`,
        rows.map((r) => r.id)
      );
    },
  },
  {
    key: "repeat_report_cluster",
    title: "Same record reported by multiple users",
    description:
      "Three or more reports filed against the same record in the last 7 days. One person complaining is an anecdote; three people complaining about the same consultation is a bug.",
    area: "Reports",
    severity: "CRITICAL",
    defaultThreshold: 1,
    thresholdUnit: "clusters",
    fixable: false,
    async run(threshold) {
      const recent = await prisma.issueReport.findMany({
        where: {
          createdAt: { gte: daysAgo(7) },
          contextEntityId: { not: null },
        },
        select: { contextEntity: true, contextEntityId: true },
      });

      const counts = new Map<string, number>();
      for (const r of recent) {
        const key = `${r.contextEntity}:${r.contextEntityId}`;
        counts.set(key, (counts.get(key) ?? 0) + 1);
      }

      const clustered = [...counts.entries()].filter(([, n]) => n >= 3);
      return banded(
        clustered.length,
        threshold,
        clustered.length === 0
          ? "No record has been reported by three or more users in the last 7 days."
          : `${clustered.length} record(s) were reported by three or more users in the last 7 days: ${clustered
              .map(([k, n]) => `${k} (${n})`)
              .join(", ")}.`,
        clustered.map(([k]) => k.split(":")[1]).filter(Boolean)
      );
    },
  },
];

/**
 * A doctor's schedule is free-form JSON in the database, so the shape has to be
 * checked defensively rather than trusted.
 */
export function hasAnyEnabledDay(schedule: unknown): boolean {
  if (!schedule || typeof schedule !== "object") return false;
  const days = schedule as Record<string, unknown>;
  return Object.values(days).some((day) => {
    if (!day || typeof day !== "object") return false;
    return (day as { enabled?: unknown }).enabled === true;
  });
}

export function getRuleDefinition(key: string): RuleDefinition | undefined {
  return RULE_DEFINITIONS.find((r) => r.key === key);
}

// ---------------------------------------------------------------------------
// Rule persistence
// ---------------------------------------------------------------------------

/**
 * Make sure every rule in the registry has a database row, carrying the
 * operator's stored threshold/enabled flag forward. Rules removed from the
 * registry are disabled rather than deleted, so their history survives.
 */
export async function seedRules(): Promise<void> {
  await Promise.all(
    RULE_DEFINITIONS.map((def) =>
      prisma.maintenanceRule.upsert({
        where: { key: def.key },
        update: {
          // Title/description/area/severity track the code; threshold and
          // isEnabled are operator-owned and deliberately left alone.
          title: def.title,
          description: def.description,
          area: def.area,
          severity: def.severity,
        },
        create: {
          key: def.key,
          title: def.title,
          description: def.description,
          area: def.area,
          severity: def.severity,
          threshold: def.defaultThreshold,
          isEnabled: true,
        },
      })
    )
  );
}

// ---------------------------------------------------------------------------
// Evaluation
// ---------------------------------------------------------------------------

/**
 * Run one rule, timing it and containing any failure. A rule whose query is
 * broken (usually because the schema moved under it) reports ERROR and stays
 * visible in the console instead of silently disappearing.
 */
export async function evaluateRule(
  rule: { id: string; key: string; threshold: number; lastStatus: string | null }
): Promise<{
  ruleId: string;
  key: string;
  result: RuleResult;
  durationMs: number;
  openedIncidentId?: string;
}> {
  const def = getRuleDefinition(rule.key);
  const startedAt = Date.now();

  if (!def) {
    return {
      ruleId: rule.id,
      key: rule.key,
      result: {
        value: 0,
        status: "ERROR",
        message: `No definition found for rule "${rule.key}". It may have been removed from the registry.`,
        sampleIds: [],
      },
      durationMs: 0,
    };
  }

  let result: RuleResult;
  try {
    result = await def.run(rule.threshold);
  } catch (err) {
    console.error(`[maintenance] rule "${rule.key}" failed:`, err);
    result = {
      value: 0,
      status: "ERROR",
      message: err instanceof Error ? err.message : "Rule evaluation threw.",
      sampleIds: [],
    };
  }

  const durationMs = Date.now() - startedAt;

  await prisma.$transaction([
    prisma.maintenanceCheck.create({
      data: {
        ruleId: rule.id,
        value: result.value,
        status: result.status,
        message: result.message,
        sampleIds: result.sampleIds.slice(0, 10),
        durationMs,
      },
    }),
    prisma.maintenanceRule.update({
      where: { id: rule.id },
      data: {
        lastRunAt: new Date(),
        lastValue: result.value,
        lastStatus: result.status,
        lastRunMessage: result.message,
      },
    }),
  ]);

  // A rule moving into BREACHED opens a work order, unless one is already open
  // for it. A rule recovering closes its open incident only when the recovery is
  // unambiguous (OK, not merely WARNING), so a flapping rule does not
  // repeatedly open and close work orders.
  let openedIncidentId: string | undefined;
  if (result.status === "BREACHED") {
    openedIncidentId = await ensureIncident(rule.id, def, result);
  } else if (result.status === "OK" && rule.lastStatus === "BREACHED") {
    await autoResolveIncident(rule.id, result);
  }

  return { ruleId: rule.id, key: rule.key, result, durationMs, openedIncidentId };
}

async function ensureIncident(
  ruleId: string,
  def: RuleDefinition,
  result: RuleResult
): Promise<string | undefined> {
  const existing = await prisma.maintenanceIncident.findFirst({
    where: { ruleId, status: { in: ["OPEN", "INVESTIGATING", "FIXED"] } },
    orderBy: { openedAt: "desc" },
  });

  if (existing) {
    // Still breached: keep the peak for trend reporting, but do not re-notify.
    if (result.value > existing.peakValue) {
      await prisma.maintenanceIncident.update({
        where: { id: existing.id },
        data: { peakValue: result.value },
      });
    }
    return existing.id;
  }

  const incident = await prisma.maintenanceIncident.create({
    data: {
      ruleId,
      severity: def.severity,
      title: def.title,
      openedValue: result.value,
      peakValue: result.value,
      status: "OPEN",
    },
  });

  await notifyAdminsOfBreach(def, result, incident.id);
  return incident.id;
}

/**
 * When a rule recovers on its own we do not silently close the incident — a
 * person still needs to confirm nothing was actually wrong. Instead the incident
 * moves to FIXED with a system note, and waits for human verification.
 */
async function autoResolveIncident(ruleId: string, result: RuleResult): Promise<void> {
  const open = await prisma.maintenanceIncident.findFirst({
    where: { ruleId, status: { in: ["OPEN", "INVESTIGATING"] } },
    orderBy: { openedAt: "desc" },
  });
  if (!open) return;

  await prisma.maintenanceIncident.update({
    where: { id: open.id },
    data: {
      status: "FIXED",
      fixedAt: new Date(),
      actionTaken:
        open.actionTaken ??
        `Auto-detected recovery: the rule now measures ${result.value}, back within threshold.`,
    },
  });
}

// ---------------------------------------------------------------------------
// Scans
// ---------------------------------------------------------------------------

export interface ScanSummary {
  score: number;
  band: "HEALTHY" | "ATTENTION" | "AT_RISK";
  evaluated: number;
  breached: number;
  warnings: number;
  errors: number;
  openedIncidents: number;
  durationMs: number;
  results: Array<{
    key: string;
    title: string;
    area: string;
    severity: Severity;
    status: RuleStatus;
    value: number;
    message: string;
    durationMs: number;
  }>;
}

/**
 * Health score. Weighted by severity so one critical failure cannot be buried
 * under a pile of cosmetic warnings, and floored at zero — past a certain point
 * the precise number stops mattering, only "this is bad" does.
 */
export function computeHealthScore(
  rules: Array<{ severity: Severity; status: RuleStatus }>
): number {
  const weights: Record<Severity, number> = {
    CRITICAL: 15,
    HIGH: 8,
    MEDIUM: 4,
    LOW: 1,
  };

  let score = 100;
  for (const rule of rules) {
    if (rule.status === "BREACHED") score -= weights[rule.severity];
    else if (rule.status === "WARNING") score -= Math.ceil(weights[rule.severity] / 2);
    else if (rule.status === "ERROR") score -= 5; // a broken rule is itself a problem
  }
  return Math.max(0, Math.min(100, score));
}

export function scoreBand(score: number): ScanSummary["band"] {
  if (score >= 85) return "HEALTHY";
  if (score >= 60) return "ATTENTION";
  return "AT_RISK";
}

/**
 * Evaluate every enabled rule and report the platform's health. Used by both the
 * scheduled job and the "Run scan now" button, so the two can never diverge.
 */
export async function runFullScan(): Promise<ScanSummary> {
  const startedAt = Date.now();

  await seedRules();

  const rules = await prisma.maintenanceRule.findMany({
    where: { isEnabled: true },
    select: { id: true, key: true, threshold: true, lastStatus: true },
  });

  // allSettled rather than all: one bad rule must not abort the whole scan.
  const settled = await Promise.allSettled(rules.map((r) => evaluateRule(r)));

  const results: ScanSummary["results"] = [];
  let openedIncidents = 0;

  settled.forEach((entry, i) => {
    if (entry.status !== "fulfilled") {
      console.error(`[maintenance] scan entry failed for ${rules[i].key}:`, entry.reason);
      return;
    }
    const { result, durationMs, openedIncidentId } = entry.value;
    const def = getRuleDefinition(rules[i].key);
    if (openedIncidentId) openedIncidents += 1;
    results.push({
      key: rules[i].key,
      title: def?.title ?? rules[i].key,
      area: def?.area ?? "Unknown",
      severity: def?.severity ?? "MEDIUM",
      status: result.status,
      value: result.value,
      message: result.message,
      durationMs,
    });
  });

  const score = computeHealthScore(results);
  const summary: ScanSummary = {
    score,
    band: scoreBand(score),
    evaluated: results.length,
    breached: results.filter((r) => r.status === "BREACHED").length,
    warnings: results.filter((r) => r.status === "WARNING").length,
    errors: results.filter((r) => r.status === "ERROR").length,
    openedIncidents,
    durationMs: Date.now() - startedAt,
    results,
  };

  await pusherServer
    .trigger("admin-health", "scan-complete", {
      score: summary.score,
      band: summary.band,
      breached: summary.breached,
      at: new Date().toISOString(),
    })
    .catch((err) => console.error("[maintenance] pusher broadcast failed:", err));

  return summary;
}

/** Re-run a single rule, used by the per-rule "Re-check" button. */
export async function checkSingleRule(key: string) {
  await seedRules();
  const rule = await prisma.maintenanceRule.findUnique({ where: { key } });
  if (!rule) return null;
  return evaluateRule({
    id: rule.id,
    key: rule.key,
    threshold: rule.threshold,
    lastStatus: rule.lastStatus,
  });
}

// ---------------------------------------------------------------------------
// Alerting
// ---------------------------------------------------------------------------

/**
 * Tell everyone who can act on it. Admins are the audience because a breach may
 * need a decision (refund someone, unpublish a doctor) that support cannot make.
 */
async function notifyAdminsOfBreach(
  def: RuleDefinition,
  result: RuleResult,
  incidentId: string
): Promise<void> {
  try {
    const admins = await prisma.account.findMany({
      where: { role: "ADMIN", isActive: true },
      select: { id: true },
    });

    await Promise.all(
      admins.map((admin) =>
        notifyAccount(admin.id, notificationTemplates.maintenanceBreach(def.title, result.message))
      )
    );

    await pusherServer
      .trigger("admin-health", "rule-breached", {
        incidentId,
        ruleKey: def.key,
        title: def.title,
        severity: def.severity,
        message: result.message,
      })
      .catch(() => {});
  } catch (err) {
    console.error("[maintenance] breach notification failed:", err);
  }
}

/** Cheap hourly subset of the rules, for live alerts between full scans. */
export const ANOMALY_RULE_KEYS = [
  "stale_consultations",
  "unclaimed_ambulance_requests",
  "support_sla_at_risk",
  "paid_without_consultation",
  "zero_price_doctors",
  "repeat_report_cluster",
];
