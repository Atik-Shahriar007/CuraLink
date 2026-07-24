import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  // Simple shared-secret check so this endpoint can't be triggered by anyone
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const now = new Date();

  const dueConsultations = await prisma.consultation.findMany({
    where: {
      status: "PENDING",
      date: { lte: now },
    },
  });

  if (dueConsultations.length === 0) {
    return NextResponse.json({ started: 0 });
  }

  await prisma.consultation.updateMany({
    where: {
      id: { in: dueConsultations.map((c) => c.id) },
    },
    data: { status: "IN_PROGRESS" },
  });

  console.log(`Started ${dueConsultations.length} consultation(s)`);

  return NextResponse.json({ started: dueConsultations.length, ids: dueConsultations.map((c) => c.id) });
}