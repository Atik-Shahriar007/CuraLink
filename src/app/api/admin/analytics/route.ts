import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

function monthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [payments, consultations, accounts, doctors, tickets, ambulanceRequests] =
    await Promise.all([
      prisma.payment.findMany({ where: { status: "PAID" }, select: { amount: true, createdAt: true } }),
      prisma.consultation.findMany({ select: { status: true, createdAt: true, doctorId: true } }),
      prisma.account.findMany({ select: { role: true, createdAt: true } }),
      prisma.doctor.findMany({
        include: {
          account: { select: { firstName: true, lastName: true } },
          reviews: { select: { rating: true } },
          consultations: { select: { id: true, status: true } },
        },
      }),
      prisma.supportTicket.findMany({ select: { status: true, createdAt: true, updatedAt: true } }),
      prisma.ambulanceRequest.findMany({ select: { status: true } }),
    ]);

  // Revenue by month
  const revenueByMonth: Record<string, number> = {};
  for (const p of payments) {
    const key = monthKey(p.createdAt);
    revenueByMonth[key] = (revenueByMonth[key] || 0) + p.amount;
  }

  // Consultations by month + status
  const consultationsByMonth: Record<string, { booked: number; completed: number; canceled: number }> = {};
  for (const c of consultations) {
    const key = monthKey(c.createdAt);
    if (!consultationsByMonth[key]) consultationsByMonth[key] = { booked: 0, completed: 0, canceled: 0 };
    consultationsByMonth[key].booked += 1;
    if (c.status === "COMPLETED") consultationsByMonth[key].completed += 1;
    if (c.status === "CANCELED") consultationsByMonth[key].canceled += 1;
  }

  // Signups by month + role
  const signupsByMonth: Record<string, { patients: number; doctors: number }> = {};
  for (const a of accounts) {
    if (a.role !== "PATIENT" && a.role !== "DOCTOR") continue;
    const key = monthKey(a.createdAt);
    if (!signupsByMonth[key]) signupsByMonth[key] = { patients: 0, doctors: 0 };
    if (a.role === "PATIENT") signupsByMonth[key].patients += 1;
    if (a.role === "DOCTOR") signupsByMonth[key].doctors += 1;
  }

  // Top-rated & most active doctors
  const doctorStats = doctors.map((d) => ({
    id: d.id,
    name: `Dr. ${d.account.firstName || ""} ${d.account.lastName || ""}`.trim(),
    avgRating: d.reviews.length > 0 ? d.reviews.reduce((s, r) => s + r.rating, 0) / d.reviews.length : 0,
    reviewCount: d.reviews.length,
    consultationCount: d.consultations.length,
    completedCount: d.consultations.filter((c) => c.status === "COMPLETED").length,
  }));

  const topRated = [...doctorStats]
    .filter((d) => d.reviewCount > 0)
    .sort((a, b) => b.avgRating - a.avgRating)
    .slice(0, 5);

  const mostActive = [...doctorStats]
    .sort((a, b) => b.consultationCount - a.consultationCount)
    .slice(0, 5);

  // Support tickets
  const ticketsByStatus: Record<string, number> = {};
  let totalResolutionHours = 0;
  let resolvedCount = 0;
  for (const t of tickets) {
    ticketsByStatus[t.status] = (ticketsByStatus[t.status] || 0) + 1;
    if (t.status === "RESOLVED" || t.status === "CLOSED") {
      totalResolutionHours += (t.updatedAt.getTime() - t.createdAt.getTime()) / (1000 * 60 * 60);
      resolvedCount += 1;
    }
  }
  const avgResolutionHours = resolvedCount > 0 ? totalResolutionHours / resolvedCount : null;

  // Ambulance requests
  const ambulanceByStatus: Record<string, number> = {};
  for (const r of ambulanceRequests) {
    ambulanceByStatus[r.status] = (ambulanceByStatus[r.status] || 0) + 1;
  }

  // Convert month-keyed objects to sorted arrays for charting
  const allMonths = Array.from(
    new Set([
      ...Object.keys(revenueByMonth),
      ...Object.keys(consultationsByMonth),
      ...Object.keys(signupsByMonth),
    ])
  ).sort();

  const revenueSeries = allMonths.map((m) => ({ month: m, revenue: revenueByMonth[m] || 0 }));
  const consultationsSeries = allMonths.map((m) => ({
    month: m,
    booked: consultationsByMonth[m]?.booked || 0,
    completed: consultationsByMonth[m]?.completed || 0,
    canceled: consultationsByMonth[m]?.canceled || 0,
  }));
  const signupsSeries = allMonths.map((m) => ({
    month: m,
    patients: signupsByMonth[m]?.patients || 0,
    doctors: signupsByMonth[m]?.doctors || 0,
  }));

  return NextResponse.json({
    revenueSeries,
    consultationsSeries,
    signupsSeries,
    topRated,
    mostActive,
    ticketsByStatus,
    avgResolutionHours,
    ambulanceByStatus,
    totals: {
      totalRevenue: payments.reduce((s, p) => s + p.amount, 0),
      totalConsultations: consultations.length,
      totalPatients: accounts.filter((a) => a.role === "PATIENT").length,
      totalDoctors: accounts.filter((a) => a.role === "DOCTOR").length,
    },
  });
}