import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "AMBULANCE_PROVIDER" || !account.ambulanceProvider) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (account.ambulanceProvider.approvalStatus !== "APPROVED") {
    return NextResponse.json({ error: "Not yet approved" }, { status: 403 });
  }

  // Unclaimed requests (anyone approved can see and accept these)
  const unclaimed = await prisma.ambulanceRequest.findMany({
    where: { status: "REQUESTED", providerId: null },
    include: { patient: { include: { account: { select: { firstName: true, lastName: true } } } } },
    orderBy: { createdAt: "asc" },
  });

  // This provider's own claimed/active requests
  const mine = await prisma.ambulanceRequest.findMany({
    where: { providerId: account.ambulanceProvider.id, status: { notIn: ["COMPLETED", "CANCELED"] } },
    include: { patient: { include: { account: { select: { firstName: true, lastName: true } } } } },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ unclaimed, mine });
}