import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const isStaff = account.role === "SUPPORT_AGENT" || account.role === "ADMIN";

  if (isStaff) {
    const count = await prisma.supportTicket.count({
      where: { status: "OPEN" },
    });
    return NextResponse.json({ count });
  }

  const myTickets = await prisma.supportTicket.findMany({
    where: { createdById: account.id, status: { not: "CLOSED" } },
    select: { updatedAt: true, lastViewedByCreatorAt: true },
  });

  const count = myTickets.filter(
    (t) => !t.lastViewedByCreatorAt || t.updatedAt > t.lastViewedByCreatorAt
  ).length;

  return NextResponse.json({ count });
}