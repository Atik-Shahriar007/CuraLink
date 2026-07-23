import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { stripe } from "@/lib/stripe";

const checkoutSchema = z.object({
  doctorId: z.string(),
  date: z.string(), // ISO datetime string
});

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();

  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = checkoutSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { doctorId, date } = parsed.data;

    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId, approvalStatus: "APPROVED" },
    });

    if (!doctor || !doctor.price) {
      return NextResponse.json(
        { error: "Doctor not available for booking" },
        { status: 404 }
      );
    }

    const consultationDate = new Date(date);
    if (consultationDate.getTime() <= Date.now()) {
      return NextResponse.json(
        { error: "Consultation date must be in the future" },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: `Consultation with Dr. ${doctor.id}`,
              description: `Scheduled for ${consultationDate.toLocaleString()}`,
            },
            unit_amount: Math.round(doctor.price * 100), // cents
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/patient/consultations?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/doctors/${doctorId}?canceled=true`,
      metadata: {
        doctorId,
        patientId: account.patient.id,
        consultationDate: consultationDate.toISOString(),
      },
    });

    // Store a pending Payment record now, so the webhook can find/update it later
    await prisma.payment.create({
      data: {
        checkoutSessionId: session.id,
        amount: doctor.price,
        currency: "usd",
        status: "PENDING",
        doctorId: doctor.id,
        patientId: account.patient.id,
        metadata: { consultationDate: consultationDate.toISOString() },
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Checkout error:", err);
    return NextResponse.json(
      { error: "Something went wrong creating checkout session" },
      { status: 500 }
    );
  }
}