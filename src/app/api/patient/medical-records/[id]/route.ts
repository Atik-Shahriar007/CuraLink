import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const document = await prisma.medicalDocument.findUnique({ where: { id } });
  if (!document || document.patientId !== account.patient.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  await prisma.medicalDocument.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
