import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { notifyAccount, notificationTemplates } from "@/lib/notifications";

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

  const isDoctor = account.doctor?.id === consultation.doctorId;
  if (!isDoctor) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (consultation.status !== "IN_PROGRESS") {
    return NextResponse.json(
      { error: "Only an in-progress consultation can be marked completed" },
      { status: 400 }
    );
  }

  const updated = await prisma.consultation.update({
    where: { id },
    data: { status: "COMPLETED" },
  });

  const [patient, doctorAccount] = await Promise.all([
    prisma.patient.findUnique({ where: { id: consultation.patientId } }),
    prisma.account.findUnique({ where: { id: account.id }, select: { firstName: true, lastName: true } }),
  ]);
  const doctorName = `${doctorAccount?.firstName ?? ""} ${doctorAccount?.lastName ?? ""}`.trim();
  if (patient) {
    void notifyAccount(patient.accountId, notificationTemplates.consultationCompleted(doctorName));
  }

  return NextResponse.json(updated);
}