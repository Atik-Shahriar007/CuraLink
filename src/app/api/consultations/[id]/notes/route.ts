import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const notesSchema = z.object({
  notes: z.string().max(5000),
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

  const consultation = await prisma.consultation.findUnique({
    where: { id },
  });

  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  const isDoctor = account.role === "DOCTOR" && account.doctor?.id === consultation.doctorId;
  const isPatient = account.role === "PATIENT" && account.patient?.id === consultation.patientId;

  if (!isDoctor && !isPatient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json({ notes: consultation.notes, status: consultation.status });
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const consultation = await prisma.consultation.findUnique({
    where: { id },
  });

  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  if (account.doctor?.id !== consultation.doctorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (consultation.status !== "COMPLETED") {
    return NextResponse.json(
      { error: "Notes can only be added to a completed consultation" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = notesSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.consultation.update({
    where: { id },
    data: { notes: parsed.data.notes },
  });

  return NextResponse.json({ notes: updated.notes, status: updated.status });
}