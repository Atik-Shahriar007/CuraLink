import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doctorId = account.doctor.id;

  const [consultations, payments] = await Promise.all([
    prisma.consultation.findMany({
      where: { doctorId },
      include: {
        patient: { include: { account: { select: { firstName: true, lastName: true } } } },
        payment: true,
      },
      orderBy: { date: "desc" },
    }),
    prisma.payment.findMany({ where: { doctorId, status: "PAID" }, select: { amount: true } }),
  ]);

  const now = new Date();
  const thisMonthKey = monthKey(now);
  const consultationsThisMonth = consultations.filter((c) => monthKey(c.createdAt) === thisMonthKey).length;

  const uniquePatients = new Set(consultations.map((c) => c.patientId));

  const byMonth: Record<string, { canceled: number; completed: number; pending: number }> = {};
  for (const c of consultations) {
    const key = monthKey(c.date);
    if (!byMonth[key]) byMonth[key] = { canceled: 0, completed: 0, pending: 0 };
    if (c.status === "CANCELED") byMonth[key].canceled += 1;
    else if (c.status === "COMPLETED") byMonth[key].completed += 1;
    else byMonth[key].pending += 1;
  }
  const months = Object.keys(byMonth).sort();
  const consultationsSeries = months.map((m) => ({ month: m, ...byMonth[m] }));

  const statusCounts: Record<string, number> = {};
  for (const c of consultations) {
    statusCounts[c.status] = (statusCounts[c.status] || 0) + 1;
  }

  const tableRows = consultations.map((c) => ({
    id: c.id,
    patientName: `${c.patient.account.firstName || ""} ${c.patient.account.lastName || ""}`.trim() || "—",
    date: c.date,
    status: c.status,
    price: c.payment?.amount ?? null,
    paymentStatus: c.payment?.status ?? "—",
    createdAt: c.createdAt,
    updatedAt: c.updatedAt,
  }));

  return NextResponse.json({
    totals: {
      consultationsThisMonth,
      totalPatients: uniquePatients.size,
      totalConsultations: consultations.length,
      pending: statusCounts.PENDING || 0,
      canceled: statusCounts.CANCELED || 0,
      completed: statusCounts.COMPLETED || 0,
      totalEarnings: payments.reduce((s, p) => s + p.amount, 0),
    },
    consultationsSeries,
    statusCounts,
    tableRows,
  });
}