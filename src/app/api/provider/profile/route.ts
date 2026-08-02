import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const profileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  organizationName: z.string().optional(),
  vehicleInfo: z.string().optional(),
  serviceArea: z.string().optional(),
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "AMBULANCE_PROVIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await prisma.ambulanceProvider.findUnique({
    where: { accountId: account.id },
  });

  return NextResponse.json({ account, provider });
}

export async function PATCH(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "AMBULANCE_PROVIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = profileSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { firstName, lastName, phone, ...providerFields } = parsed.data;

  if (firstName || lastName || phone) {
    await prisma.account.update({
      where: { id: account.id },
      data: { firstName, lastName, phone },
    });
  }

  const updated = await prisma.ambulanceProvider.update({
    where: { accountId: account.id },
    data: providerFields,
  });

  return NextResponse.json(updated);
}