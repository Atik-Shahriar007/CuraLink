import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { getOrCreateRoom, createMeetingToken } from "@/lib/daily";

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
    include: {
      doctor: { include: { account: true } },
      patient: { include: { account: true } },
    },
  });

  if (!consultation) {
    return NextResponse.json({ error: "Consultation not found" }, { status: 404 });
  }

  // Confirm this account is actually one of the two participants
  const isDoctor =
    account.role === "DOCTOR" && account.doctor?.id === consultation.doctorId;
  const isPatient =
    account.role === "PATIENT" && account.patient?.id === consultation.patientId;

  if (!isDoctor && !isPatient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Only allow joining once it's actually live
  if (consultation.status !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "This consultation is not currently active" },
      { status: 400 }
    );
  }

  try {
    const roomName = await getOrCreateRoom(consultation.id);

    const userName = isDoctor
      ? `Dr. ${consultation.doctor.account.firstName || ""} ${consultation.doctor.account.lastName || ""}`.trim()
      : `${consultation.patient.account.firstName || ""} ${consultation.patient.account.lastName || ""}`.trim() ||
        "Patient";

    const token = await createMeetingToken(roomName, userName, isDoctor);

    return NextResponse.json({
      roomName,
      token,
      dailyDomain: process.env.DAILY_DOMAIN, // we'll add this env var next
    });
  } catch (err) {
    console.error("Room token error:", err);
    return NextResponse.json(
      { error: "Could not create room access" },
      { status: 500 }
    );
  }
}