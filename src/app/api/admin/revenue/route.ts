import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const range = searchParams.get("range") || "30";
  const days = parseInt(range);
  const since = new Date();
  since.setDate(since.getDate() - days);

  const payments = await prisma.payment.findMany({
    where: { status: "PAID", createdAt: { gte: since } },
    include: {
      doctor: { include: { account: true } },
      patient: { include: { account: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const totalRevenue = payments.reduce((sum, p) => sum + p.amount, 0);
  const avgPerConsultation =
    payments.length > 0 ? totalRevenue / payments.length : 0;

  // Group by month
  const byMonth: Record<string, number> = {};
  for (const p of payments) {
    const key = p.createdAt.toISOString().slice(0, 7);
    byMonth[key] = (byMonth[key] || 0) + p.amount;
  }
  const series = Object.entries(byMonth)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, amount]) => ({ month, amount }));

  return NextResponse.json({
    totalRevenue,
    avgPerConsultation,
    paymentsCount: payments.length,
    series,
    payments,
  });
}
