import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doctor = await prisma.doctor.findUnique({ where: { accountId: session.accountId } });
  if (!doctor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const rangeParam = searchParams.get("range");
  const range = rangeParam ? parseInt(rangeParam) : 30;

  const since = new Date();
  if (range > 0) {
    since.setDate(since.getDate() - range);
  } else {
    since.setFullYear(2000); // "All time"
  }

  const payments = await prisma.payment.findMany({
    where: { doctorId: doctor.id, createdAt: { gte: since } },
    include: { patient: { include: { account: true } }, consultation: true },
    orderBy: { createdAt: "desc" },
  });

  const allPayments = await prisma.payment.findMany({ where: { doctorId: doctor.id } });
  const totalEarnings = allPayments
    .filter((p) => p.status === "PAID")
    .reduce((s, p) => s + p.amount, 0);

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const thisMonthEarnings = allPayments
    .filter((p) => p.status === "PAID" && p.createdAt >= startOfMonth)
    .reduce((s, p) => s + p.amount, 0);

  const paidPayments = allPayments.filter((p) => p.status === "PAID");
  const avgPerConsultation =
    paidPayments.length > 0 ? totalEarnings / paidPayments.length : 0;

  const pendingPayout = allPayments
    .filter((p) => p.status === "PENDING")
    .reduce((s, p) => s + p.amount, 0);

  const byMonth: Record<string, number> = {};
  for (const p of allPayments.filter((x) => x.status === "PAID")) {
    const key = p.createdAt.toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] || 0) + p.amount;
  }
  const series = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));

  return NextResponse.json({
    totalEarnings,
    thisMonthEarnings,
    avgPerConsultation,
    pendingPayout,
    series,
    payments,
  });
}
