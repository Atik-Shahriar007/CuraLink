import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const medicineUpdateSchema = z.object({
  brandName: z.string().min(1).optional(),
  genericName: z.string().min(1).optional(),
  form: z.string().min(1).optional(),
  therapeuticCategory: z.string().min(1).optional(),
  manufacturer: z.string().min(1).optional(),
  strength: z.string().min(1).optional(),
  unit: z.string().min(1).optional(),
  price: z.number().positive().optional(),
  prescriptionRequired: z.boolean().optional(),
  description: z.string().min(1).optional(),
  dosage: z.string().min(1).optional(),
  sideEffects: z.string().min(1).optional(),
  photoBase64: z.string().optional(),
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
  const parsed = medicineUpdateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { photoBase64, ...data } = parsed.data;

  let imageUrl: string | undefined;
  if (photoBase64) {
    imageUrl = await uploadImage(photoBase64);
  }

  const medicine = await prisma.medicine.update({
    where: { id },
    data: { ...data, ...(imageUrl ? { imageUrl } : {}) },
  });

  return NextResponse.json(medicine);
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  await prisma.medicine.delete({ where: { id } });

  return NextResponse.json({ success: true });
}