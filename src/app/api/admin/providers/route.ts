import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const providers = await prisma.ambulanceProvider.findMany({
    include: { account: { select: { email: true, firstName: true, lastName: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(providers);
}