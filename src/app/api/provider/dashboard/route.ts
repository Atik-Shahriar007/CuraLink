import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "AMBULANCE_PROVIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await prisma.ambulanceProvider.findUnique({ where: { accountId: session.accountId } });
  if (!provider) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const allRequests = await prisma.ambulanceRequest.findMany({
    where: { providerId: provider.id },
    include: { patient: { include: { account: true } } },
    orderBy: { createdAt: "desc" },
  });

  const now = new Date();
  const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  const totalAccepted = allRequests.length;
  const completedToday = allRequests.filter(r => r.status === "COMPLETED" && r.updatedAt >= startOfDay).length;
  const active = allRequests.filter(r => ["ACCEPTED", "DISPATCHED", "ARRIVED"].includes(r.status)).length;
  const completed = allRequests.filter(r => r.status === "COMPLETED").length;
  const canceled = allRequests.filter(r => r.status === "CANCELED").length;

  const series: { date: string; completed: number; canceled: number }[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = d.toISOString().slice(0, 10);
    const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);
    series.push({
      date: dateStr,
      completed: allRequests.filter(r => r.status === "COMPLETED" && r.updatedAt >= dayStart && r.updatedAt < dayEnd).length,
      canceled: allRequests.filter(r => r.status === "CANCELED" && r.updatedAt >= dayStart && r.updatedAt < dayEnd).length,
    });
  }

  return NextResponse.json({
    stats: { totalAccepted, completedToday, active, completed, canceled },
    series,
    recentRequests: allRequests.slice(0, 5),
  });
}
