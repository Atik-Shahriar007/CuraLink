import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doctor = await prisma.doctor.findUnique({ where: { accountId: session.accountId } });
  if (!doctor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const reviews = await prisma.review.findMany({
    where: { doctorId: doctor.id },
    include: {
      patient: { include: { account: true } },
      consultation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const avgRating =
    reviews.length > 0
      ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
      : 0;

  const distribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  reviews.forEach((r) => {
    distribution[r.rating] = (distribution[r.rating] || 0) + 1;
  });

  const fiveStarCount = distribution[5] ?? 0;
  const oneStarCount = distribution[1] ?? 0;

  return NextResponse.json({
    reviews,
    avgRating,
    distribution,
    totalCount: reviews.length,
    fiveStarCount,
    oneStarCount,
  });
}
