import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();

  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const consultations = await prisma.consultation.findMany({
    where: { doctorId: account.doctor.id },
    include: {
      patient: {
        include: {
          account: { select: { firstName: true, lastName: true } },
        },
      },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json(consultations);
}