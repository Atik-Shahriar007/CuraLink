import { prisma } from "./prisma";
import { getRuleDefinition } from "./maintenance";

/**
 * Automated remediations.
 *
 * Only rules whose fix is *deterministic* get a fixer here. The bar is: the
 * correct repair can be derived entirely from data already in the database,
 * with no judgement call and no invention. "This paid payment has consultation
 * metadata, so create the consultation it should have created" qualifies.
 * "This catalogue row has no dosage text, so write some" does not, and is
 * deliberately absent — a wrong dosage in a medical app is worse than a blank.
 *
 * Every fixer returns a plain report and never throws; the caller turns it into
 * an incident note so the action is auditable.
 */

export interface FixOutcome {
  ok: boolean;
  /** Human summary written into the incident's actionTaken field. */
  summary: string;
  /** Records touched, so the admin can spot-check the work. */
  affectedIds: string[];
}

export interface FixerDefinition {
  ruleKey: string;
  label: string;
  description: string;
  run: () => Promise<FixOutcome>;
}

// ---------------------------------------------------------------------------
// Consultations
// ---------------------------------------------------------------------------

async function fixStaleConsultations(): Promise<FixOutcome> {
  const cutoff = new Date(Date.now() - 60 * 60 * 1000);

  const stale = await prisma.consultation.findMany({
    where: { status: { in: ["PENDING", "IN_PROGRESS"] }, date: { lte: cutoff } },
    select: { id: true, patientId: true, doctorId: true, payment: { select: { id: true } } },
  });

  if (stale.length === 0) {
    return { ok: true, summary: "No stale consultations to close out.", affectedIds: [] };
  }

  await prisma.consultation.updateMany({
    where: { id: { in: stale.map((c) => c.id) } },
    data: {
      status: "CANCELED",
      canceledAt: new Date(),
      cancellationReason: "Auto-closed by maintenance: consultation never started.",
      canceledByRole: "ADMIN",
    },
  });

  // Note on money: a stale PENDING consultation was never joined, so the patient
  // is owed a refund. We deliberately do NOT call Stripe here — issuing money
  // movements from a background maintenance sweep is not something an operator
  // should discover after the fact. Instead the refund is queued for a human by
  // leaving the paid consultation visible in the refund-owed count below.
  const paid = stale.filter((c) => c.payment).length;

  return {
    ok: true,
    summary:
      `Auto-closed ${stale.length} stale consultation(s) that never started.` +
      (paid > 0
        ? ` ${paid} of them were paid and now need a manual refund — review the Payments area.`
        : ""),
    affectedIds: stale.map((c) => c.id),
  };
}

// ---------------------------------------------------------------------------
// Payments
// ---------------------------------------------------------------------------

async function fixPaidWithoutConsultation(): Promise<FixOutcome> {
  const orphans = await prisma.payment.findMany({
    where: { status: "PAID", consultationId: null },
    take: 100,
  });

  if (orphans.length === 0) {
    return {
      ok: true,
      summary: "No orphaned paid payments found.",
      affectedIds: [],
    };
  }

  const repaired: string[] = [];
  const skipped: string[] = [];

  for (const payment of orphans) {
    // The payment row carries doctorId/patientId as real columns; only the
    // consultation date lives in metadata (written at checkout). A PAID payment
    // with no consultation means the Stripe webhook died between creating the
    // consultation and linking it — so the row has everything needed to finish
    // that job, and nothing has to be guessed.
    const meta = (payment.metadata ?? {}) as Record<string, unknown>;
    const rawDate = typeof meta.consultationDate === "string" ? meta.consultationDate : null;
    const date = rawDate ? new Date(rawDate) : null;

    if (!date || Number.isNaN(date.getTime())) {
      skipped.push(payment.id);
      continue;
    }

    // The doctor or patient may have been deleted since; verify both still exist
    // before writing a foreign key.
    const [doctor, patient] = await Promise.all([
      prisma.doctor.findUnique({ where: { id: payment.doctorId }, select: { id: true } }),
      prisma.patient.findUnique({ where: { id: payment.patientId }, select: { id: true } }),
    ]);

    if (!doctor || !patient) {
      skipped.push(payment.id);
      continue;
    }

    // The consultation may have been created after the payment row was read.
    const already = await prisma.payment.findUnique({
      where: { id: payment.id },
      select: { consultationId: true },
    });
    if (already?.consultationId) {
      repaired.push(payment.id);
      continue;
    }

    await prisma.$transaction(async (tx) => {
      const consultation = await tx.consultation.create({
        data: {
          doctorId: payment.doctorId,
          patientId: payment.patientId,
          date,
          status: "PENDING",
        },
      });
      await tx.payment.update({
        where: { id: payment.id },
        data: { consultationId: consultation.id },
      });
    });

    repaired.push(payment.id);
  }

  return {
    ok: true,
    summary:
      `Created the missing consultation for ${repaired.length} paid payment(s).` +
      (skipped.length > 0
        ? ` ${skipped.length} payment(s) could not be repaired automatically — their metadata is missing or the doctor/patient no longer exists. These need a manual refund or booking.`
        : ""),
    affectedIds: repaired,
  };
}

// ---------------------------------------------------------------------------
// Doctors
// ---------------------------------------------------------------------------

async function fixApprovedUnverified(): Promise<FixOutcome> {
  const doctors = await prisma.doctor.findMany({
    where: {
      approvalStatus: "APPROVED",
      verificationStatus: { in: ["UNVERIFIED", "REJECTED"] },
      createdAt: { lte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
    },
    select: { id: true, licenseDocumentUrl: true },
  });

  if (doctors.length === 0) {
    return { ok: true, summary: "No overdue verifications.", affectedIds: [] };
  }

  // Only doctors who actually uploaded a licence document can be pushed into the
  // review queue. Moving someone with no document to PENDING would create a
  // review task that nobody can complete.
  const submittable = doctors.filter((d) => Boolean(d.licenseDocumentUrl));

  if (submittable.length > 0) {
    await prisma.doctor.updateMany({
      where: { id: { in: submittable.map((d) => d.id) } },
      data: { verificationStatus: "PENDING" },
    });
  }

  const withoutDocument = doctors.length - submittable.length;

  return {
    ok: true,
    summary:
      `Moved ${submittable.length} doctor(s) with an uploaded licence into the verification queue.` +
      (withoutDocument > 0
        ? ` ${withoutDocument} doctor(s) have no licence document on file and were left alone — they need to be contacted directly.`
        : ""),
    affectedIds: submittable.map((d) => d.id),
  };
}

// ---------------------------------------------------------------------------
// Catalogue
// ---------------------------------------------------------------------------

async function fixCatalogGaps(): Promise<FixOutcome> {
  const missing = await prisma.medicine.findMany({
    where: { OR: [{ description: null }, { dosage: null }, { imageUrl: null }] },
    select: { id: true },
    take: 200,
  });

  if (missing.length === 0) {
    return { ok: true, summary: "No catalogue gaps found.", affectedIds: [] };
  }

  // Unlike the other fixers this one changes no data. Clinical text and product
  // images cannot be derived from what we hold, and fabricating either would
  // put invented medical information in front of patients. The honest "fix" is
  // to tell the operator exactly how much work the catalogue import still needs.
  return {
    ok: true,
    summary: `${missing.length} catalogue entry(s) are missing clinical text or an image. These need the import/enrichment script re-run or manual entry — nothing was changed automatically, because the missing values cannot be derived from existing data.`,
    affectedIds: missing.map((m) => m.id),
  };
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------

export const FIXERS: FixerDefinition[] = [
  {
    ruleKey: "stale_consultations",
    label: "Close out consultations that never started",
    description:
      "Marks them canceled and explains why in the cancellation reason. Any that were paid are flagged for a manual refund rather than refunded automatically.",
    run: fixStaleConsultations,
  },
  {
    ruleKey: "paid_without_consultation",
    label: "Create the missing consultations",
    description:
      "Rebuilds the booking from the payment's Stripe metadata. Payments whose metadata is incomplete are left for a person.",
    run: fixPaidWithoutConsultation,
  },
  {
    ruleKey: "approved_unverified_30d",
    label: "Queue overdue licence checks",
    description:
      "Moves doctors who have uploaded a licence document into the verification queue.",
    run: fixApprovedUnverified,
  },
  {
    ruleKey: "catalog_gaps",
    label: "Report catalogue gaps",
    description:
      "Inspects the catalogue and reports how many entries need attention. Changes no data.",
    run: fixCatalogGaps,
  },
];

export function getFixer(ruleKey: string): FixerDefinition | undefined {
  return FIXERS.find((f) => f.ruleKey === ruleKey);
}

export function isFixable(ruleKey: string): boolean {
  return Boolean(getFixer(ruleKey)) && Boolean(getRuleDefinition(ruleKey)?.fixable);
}
