import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

// Read-only access for a doctor to a patient's uploaded medical records.
// Gated on there being at least one consultation between the two — a
// doctor can only see records for patients they've actually treated (or
// are scheduled to).
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ patientId: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { patientId } = await params;

  const sharedConsultation = await prisma.consultation.findFirst({
    where: { doctorId: account.doctor.id, patientId },
  });

  if (!sharedConsultation) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const [documents, patient] = await Promise.all([
    prisma.medicalDocument.findMany({
      where: { patientId },
      orderBy: { createdAt: "desc" },
    }),
    prisma.patient.findUnique({
      where: { id: patientId },
      select: {
        allergies: true,
        chronicConditions: true,
        currentMedications: true,
        bloodType: true,
        account: { select: { firstName: true, lastName: true } },
      },
    }),
  ]);

  return NextResponse.json({ documents, patient });
}
