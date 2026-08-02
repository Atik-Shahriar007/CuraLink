import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const requests = await prisma.ambulanceRequest.findMany({
    where: { patientId: account.patient.id },
    include: {
      provider: {
        include: { account: { select: { firstName: true, lastName: true, phone: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(requests);
}