import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patient = await prisma.patient.findUnique({
    where: { accountId: account.id },
    include: {
      account: true,
      consultations: {
        include: {
          doctor: { include: { account: true } },
          prescription: { include: { items: true } },
        },
        orderBy: { date: "desc" },
      },
      prescriptions: { include: { items: true } },
    },
  });

  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const totalConsultations = patient.consultations.length;
  const completed = patient.consultations.filter((c) => c.status === "COMPLETED").length;
  const canceled = patient.consultations.filter((c) => c.status === "CANCELED").length;

  const doctorIds = [...new Set(patient.consultations.map((c) => c.doctorId))];

  const topDoctors = patient.consultations
    .reduce((acc, c) => {
      const key = c.doctorId;
      if (!acc[key]) acc[key] = { doctor: c.doctor, count: 0 };
      acc[key].count++;
      return acc;
    }, {} as Record<string, any>);

  return NextResponse.json({
    patient,
    stats: {
      totalConsultations,
      completed,
      canceled,
      uniqueDoctors: doctorIds.length,
      totalPrescriptions: patient.prescriptions.length,
    },
    topDoctors: Object.values(topDoctors)
      .sort((a: any, b: any) => b.count - a.count)
      .slice(0, 3),
  });
}
