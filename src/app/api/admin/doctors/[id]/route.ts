import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const updateSchema = z.object({
  approvalStatus: z.enum(["APPROVED", "REJECTED", "PENDING"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();

  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: { approvalStatus: parsed.data.approvalStatus },
  });

  return NextResponse.json(doctor);
}