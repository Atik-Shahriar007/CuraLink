import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [
    pendingDoctors, totalDoctors, totalPatients, pendingProviders,
    openTickets, totalMedicines, pendingBlogPosts,
  ] = await Promise.all([
    prisma.doctor.count({ where: { approvalStatus: "PENDING" } }),
    prisma.doctor.count(),
    prisma.patient.count(),
    prisma.ambulanceProvider.count({ where: { approvalStatus: "PENDING" } }),
    prisma.supportTicket.count({ where: { status: "OPEN" } }),
    prisma.medicine.count(),
    prisma.blogPost.count({ where: { status: "PENDING_REVIEW" } }),
  ]);

  return NextResponse.json({
    pendingDoctors, totalDoctors, totalPatients, pendingProviders,
    openTickets, totalMedicines, pendingBlogPosts,
  });
}