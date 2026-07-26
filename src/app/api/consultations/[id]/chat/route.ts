import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";

const messageSchema = z.object({
  text: z.string().min(1).max(1000),
});

export async function POST(
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

  const body = await req.json();
  const parsed = messageSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid message" }, { status: 400 });
  }

  const senderName = isDoctor
    ? `Dr. ${account.firstName || ""} ${account.lastName || ""}`.trim()
    : `${account.firstName || ""} ${account.lastName || ""}`.trim() || "Patient";

  const message = {
    text: parsed.data.text,
    senderName,
    senderRole: account.role,
    timestamp: new Date().toISOString(),
  };

  await pusherServer.trigger(`consultation-${id}`, "new-message", message);

  return NextResponse.json({ success: true });
}