import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consultations = await prisma.consultation.findMany({
    where: { patientId: account.patient.id },
    include: { payment: true },
  });

  const uniqueDoctors = new Set(consultations.map((c) => c.doctorId));
  const totalSpent = consultations.reduce(
    (sum, c) => sum + (c.payment?.status === "PAID" ? c.payment.amount : 0),
    0
  );
  const upcoming = consultations.filter(
    (c) => c.status === "PENDING" || c.status === "IN_PROGRESS"
  ).length;

  const byMonth: Record<string, number> = {};
  for (const c of consultations) {
    const key = monthKey(c.createdAt);
    byMonth[key] = (byMonth[key] || 0) + 1;
  }
  const months = Object.keys(byMonth).sort();
  const consultationsSeries = months.map((m) => ({ month: m, count: byMonth[m] }));

  const statusCounts: Record<string, number> = {};
  for (const c of consultations) {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  }

  return NextResponse.json({
    totals: {
      consultations: consultations.length,
      upcoming,
      doctorsMet: uniqueDoctors.size,
      totalSpent,
    },
    consultationsSeries,
    statusCounts,
  });
}