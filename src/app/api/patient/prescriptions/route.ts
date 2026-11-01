import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patient = await prisma.patient.findUnique({ where: { accountId: account.id } });
  if (!patient) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const prescriptions = await prisma.prescription.findMany({
    where: { patientId: patient.id },
    include: {
      doctor: { include: { account: true } },
      items: { orderBy: { sortOrder: "asc" } },
      consultation: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ prescriptions });
}
