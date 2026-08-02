import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const review = await prisma.review.findUnique({ where: { consultationId: id } });

  return NextResponse.json(review);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const consultation = await prisma.consultation.findUnique({ where: { id } });

  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  if (consultation.patientId !== account.patient.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (consultation.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "You can only review a completed consultation" },
      { status: 400 }
    );
  }

  const existing = await prisma.review.findUnique({ where: { consultationId: id } });
  if (existing) {
    return NextResponse.json(
      { error: "You've already reviewed this consultation" },
      { status: 409 }
    );
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const review = await prisma.review.create({
    data: {
      ...parsed.data,
      consultationId: id,
      doctorId: consultation.doctorId,
      patientId: consultation.patientId,
    },
  });

  return NextResponse.json(review);
}