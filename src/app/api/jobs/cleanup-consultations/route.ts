import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const STALE_GRACE_PERIOD_MINUTES = 60; // consultations older than this past their start time get canceled

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const staleThreshold = new Date(
    Date.now() - STALE_GRACE_PERIOD_MINUTES * 60 * 1000
  );

  const staleConsultations = await prisma.consultation.findMany({
    where: {
      status: { in: ["PENDING", "IN_PROGRESS"] },
      date: { lte: staleThreshold },
    },
  });

  if (staleConsultations.length === 0) {
    return NextResponse.json({ canceled: 0 });
  }

  await prisma.consultation.updateMany({
    where: {
      id: { in: staleConsultations.map((c) => c.id) },
    },
    data: { status: "CANCELED" },
  });

  console.log(`Canceled ${staleConsultations.length} stale consultation(s)`);

  return NextResponse.json({
    canceled: staleConsultations.length,
    ids: staleConsultations.map((c) => c.id),
  });
}