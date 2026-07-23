import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();

  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consultations = await prisma.consultation.findMany({
    where: { patientId: account.patient.id },
    include: {
      doctor: {
        include: {
          account: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(consultations);
}