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
    orderBy: { createdAt: "asc" },
  });

  const total = allRequests.length;
  const completed = allRequests.filter(r => r.status === "COMPLETED").length;
  const canceled = allRequests.filter(r => r.status === "CANCELED").length;
  const active = allRequests.filter(r => ["ACCEPTED", "DISPATCHED", "ARRIVED"].includes(r.status)).length;

  const completionRate = total > 0 ? (completed / total) * 100 : 0;
  const cancellationRate = total > 0 ? (canceled / total) * 100 : 0;

  const series: { month: string; completed: number; canceled: number }[] = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(d.getMonth() - i);
    const monthStr = d.toISOString().slice(0, 7);
    series.push({
      month: monthStr,
      completed: allRequests.filter(r => r.status === "COMPLETED" && r.createdAt.toISOString().startsWith(monthStr)).length,
      canceled: allRequests.filter(r => r.status === "CANCELED" && r.createdAt.toISOString().startsWith(monthStr)).length,
    });
  }

  return NextResponse.json({ stats: { total, completed, canceled, active, completionRate, cancellationRate }, series });
}
