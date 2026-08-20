import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { stripe } from "@/lib/stripe";
import { notifyAccount, notificationTemplates } from "@/lib/notifications";

const cancelSchema = z.object({
  reason: z.string().max(1000).optional(),
});

/**
 * Cancellation & refund policy
 * -----------------------------------------------------------------------
 * - Only a PENDING consultation (not yet started) can be canceled here.
 *   Once a call is IN_PROGRESS or COMPLETED, this endpoint refuses — that's
 *   handled by the normal consult/complete flow instead.
 * - If the DOCTOR or an ADMIN cancels, the patient gets a full refund
 *   regardless of timing (it's not the patient's fault).
 * - If the PATIENT cancels, the refund is prorated by how much notice they
 *   gave relative to the scheduled time:
 *     - 24h+ notice  -> 100% refund
 *     - 2h–24h notice -> 50% refund
 *     - <2h notice    -> no refund
 */
const FULL_REFUND_WINDOW_HOURS = 24;
const PARTIAL_REFUND_WINDOW_HOURS = 2;
const PARTIAL_REFUND_RATE = 0.5;

function computeRefundRate(hoursUntilAppointment: number): number {
  if (hoursUntilAppointment >= FULL_REFUND_WINDOW_HOURS) return 1;
  if (hoursUntilAppointment >= PARTIAL_REFUND_WINDOW_HOURS) return PARTIAL_REFUND_RATE;
  return 0;
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = cancelSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const consultation = await prisma.consultation.findUnique({
    where: { id },
    include: { payment: true },
  });

  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  const isPatient = account.role === "PATIENT" && account.patient?.id === consultation.patientId;
  const isDoctor = account.role === "DOCTOR" && account.doctor?.id === consultation.doctorId;
  const isAdmin = account.role === "ADMIN";

  if (!isPatient && !isDoctor && !isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (consultation.status !== "PENDING") {
    return NextResponse.json(
      { error: "Only an upcoming (not yet started) consultation can be canceled" },
      { status: 400 }
    );
  }

  const hoursUntilAppointment =
    (consultation.date.getTime() - Date.now()) / (1000 * 60 * 60);

  const refundRate = isPatient ? computeRefundRate(hoursUntilAppointment) : 1;

  const payment = consultation.payment;
  let refundAmount = 0;
  let stripeRefundId: string | null = null;

  if (payment && payment.status === "PAID" && refundRate > 0) {
    refundAmount = Math.round(payment.amount * refundRate * 100) / 100;

    if (payment.paymentIntentId) {
      try {
        const refund = await stripe.refunds.create({
          payment_intent: payment.paymentIntentId,
          amount: Math.round(refundAmount * 100), // Stripe expects the smallest currency unit
        });
        stripeRefundId = refund.id;
      } catch (err) {
        console.error("Stripe refund error:", err);
        return NextResponse.json(
          { error: "Could not process the refund. Please try again or contact support." },
          { status: 502 }
        );
      }
    }
  }

  const [updatedConsultation] = await prisma.$transaction([
    prisma.consultation.update({
      where: { id },
      data: {
        status: "CANCELED",
        canceledAt: new Date(),
        cancellationReason: parsed.data.reason,
        canceledByRole: account.role,
      },
    }),
    ...(payment
      ? [
          prisma.payment.update({
            where: { id: payment.id },
            data: {
              status: refundAmount >= payment.amount ? "REFUNDED" : payment.status,
              refundAmount: refundAmount > 0 ? refundAmount : payment.refundAmount,
              refundReason: refundAmount > 0 ? parsed.data.reason || "Consultation canceled" : payment.refundReason,
              refundedAt: refundAmount > 0 ? new Date() : payment.refundedAt,
              stripeRefundId: stripeRefundId || payment.stripeRefundId,
            },
          }),
        ]
      : []),
  ]);

  // Notify whichever side didn't initiate the cancellation.
  const [patient, doctor] = await Promise.all([
    prisma.patient.findUnique({
      where: { id: consultation.patientId },
      include: { account: { select: { firstName: true, lastName: true } } },
    }),
    prisma.doctor.findUnique({
      where: { id: consultation.doctorId },
      include: { account: { select: { firstName: true, lastName: true } } },
    }),
  ]);

  const dateStr = consultation.date.toLocaleString();
  const doctorName = `Dr. ${doctor?.account.firstName ?? ""} ${doctor?.account.lastName ?? ""}`.trim();
  const patientName = `${patient?.account.firstName ?? ""} ${patient?.account.lastName ?? ""}`.trim();

  if (!isPatient && patient) {
    void notifyAccount(
      patient.accountId,
      notificationTemplates.consultationCanceled(doctorName, dateStr, false)
    );
  }
  if (!isDoctor && doctor) {
    void notifyAccount(
      doctor.accountId,
      notificationTemplates.consultationCanceled(patientName || "the patient", dateStr, true)
    );
  }
  if (refundAmount > 0 && patient) {
    void notifyAccount(
      patient.accountId,
      notificationTemplates.refundIssued(refundAmount, payment?.currency || "usd")
    );
  }

  return NextResponse.json({
    consultation: updatedConsultation,
    refundAmount,
    refundRate,
  });
}
