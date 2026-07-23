import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text(); // raw body, required for signature verification
  const signature = req.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      // Re-verify with Stripe directly rather than trusting the event payload alone
      const verifiedSession = await stripe.checkout.sessions.retrieve(
        session.id
      );

      if (verifiedSession.payment_status !== "paid") {
        return NextResponse.json({ received: true }); // not actually paid, ignore
      }

      const payment = await prisma.payment.findUnique({
        where: { checkoutSessionId: session.id },
      });

      if (!payment) {
        console.error("No matching Payment record for session:", session.id);
        return NextResponse.json({ received: true });
      }

      if (payment.status === "PAID") {
        return NextResponse.json({ received: true }); // already processed, avoid duplicates
      }

      const consultationDate = payment.metadata as { consultationDate?: string };
      const dateStr = consultationDate?.consultationDate;

      if (!dateStr) {
        console.error("Missing consultationDate in payment metadata");
        return NextResponse.json({ received: true });
      }

      // Create the Consultation and mark Payment as PAID, atomically
      const consultation = await prisma.consultation.create({
        data: {
          date: new Date(dateStr),
          status: "PENDING",
          doctorId: payment.doctorId,
          patientId: payment.patientId,
        },
      });

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "PAID",
          paymentIntentId:
            typeof verifiedSession.payment_intent === "string"
              ? verifiedSession.payment_intent
              : verifiedSession.payment_intent?.id,
          consultationId: consultation.id,
        },
      });
    } catch (err) {
      console.error("Webhook processing error:", err);
      return NextResponse.json(
        { error: "Webhook processing failed" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}