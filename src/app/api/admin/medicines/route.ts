import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const medicineSchema = z.object({
  brandName: z.string().min(1),
  genericName: z.string().min(1),
  form: z.string().min(1),
  therapeuticCategory: z.string().min(1),
  manufacturer: z.string().min(1),
  strength: z.string().min(1),
  unit: z.string().min(1),
  price: z.number().positive(),
  prescriptionRequired: z.boolean(),
  description: z.string().min(1),
  dosage: z.string().min(1),
  sideEffects: z.string().min(1),
  photoBase64: z.string().optional(),
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const medicines = await prisma.medicine.findMany({ orderBy: { brandName: "asc" } });
  return NextResponse.json(medicines);
}

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = medicineSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { photoBase64, ...data } = parsed.data;

  let imageUrl: string | undefined;
  if (photoBase64) {
    imageUrl = await uploadImage(photoBase64);
  }

  const medicine = await prisma.medicine.create({
    data: { ...data, ...(imageUrl ? { imageUrl } : {}) },
  });

  return NextResponse.json(medicine);
}