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

  const [consultations, payments, reviews] = await Promise.all([
    prisma.consultation.findMany({
      where: { doctorId },
      select: { status: true, createdAt: true },
    }),
    prisma.payment.findMany({
      where: { doctorId, status: "PAID" },
      select: { amount: true, createdAt: true },
    }),
    prisma.review.findMany({
      where: { doctorId },
      select: { rating: true, createdAt: true },
    }),
  ]);

  const consultationsByMonth: Record<string, { booked: number; completed: number }> = {};
  for (const c of consultations) {
    const key = monthKey(c.createdAt);
    if (!consultationsByMonth[key]) consultationsByMonth[key] = { booked: 0, completed: 0 };
    consultationsByMonth[key].booked += 1;
    if (c.status === "COMPLETED") consultationsByMonth[key].completed += 1;
  }

  const earningsByMonth: Record<string, number> = {};
  for (const p of payments) {
    const key = monthKey(p.createdAt);
    earningsByMonth[key] = (earningsByMonth[key] || 0) + p.amount;
  }

  // Cumulative average rating over time (running average as reviews came in, by month)
  const sortedReviews = [...reviews].sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());
  const ratingByMonth: Record<string, number> = {};
  let runningSum = 0;
  let runningCount = 0;
  for (const r of sortedReviews) {
    runningSum += r.rating;
    runningCount += 1;
    const key = monthKey(r.createdAt);
    ratingByMonth[key] = runningSum / runningCount;
  }

  const allMonths = Array.from(
    new Set([
      ...Object.keys(consultationsByMonth),
      ...Object.keys(earningsByMonth),
      ...Object.keys(ratingByMonth),
    ])
  ).sort();

  const consultationsSeries = allMonths.map((m) => ({
    month: m,
    booked: consultationsByMonth[m]?.booked || 0,
    completed: consultationsByMonth[m]?.completed || 0,
  }));
  const earningsSeries = allMonths.map((m) => ({ month: m, earnings: earningsByMonth[m] || 0 }));

  // Forward-fill rating so the line doesn't drop to 0 in months without new reviews
  let lastKnownRating: number | null = null;
  const ratingSeries = allMonths.map((m) => {
    if (ratingByMonth[m] !== undefined) lastKnownRating = ratingByMonth[m];
    return { month: m, rating: lastKnownRating };
  });

  return NextResponse.json({
    consultationsSeries,
    earningsSeries,
    ratingSeries,
    totals: {
      totalEarnings: payments.reduce((s, p) => s + p.amount, 0),
      totalConsultations: consultations.length,
      completedConsultations: consultations.filter((c) => c.status === "COMPLETED").length,
      avgRating: reviews.length > 0 ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : null,
      reviewCount: reviews.length,
    },
  });
}