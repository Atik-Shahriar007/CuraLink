import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const profileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z
    .string()
    .regex(/^[0-9+\-()\s]{7,20}$/, "Enter a valid phone number")
    .optional()
    .or(z.literal("")),
  organizationName: z.string().optional(),
  vehicleInfo: z.string().optional(),
  serviceArea: z.string().optional(),
  licenseNumber: z.string().optional(),
  operatingHours: z.string().optional(),
  photoBase64: z.string().optional(), // data:image/...;base64,... string from frontend
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

  const { firstName, lastName, phone, photoBase64, ...providerFields } = parsed.data;

  if (firstName || lastName || phone) {
    await prisma.account.update({
      where: { id: account.id },
      data: { firstName, lastName, phone },
    });
  }

  let photoUrl: string | undefined;
  if (photoBase64) {
    photoUrl = await uploadImage(photoBase64, "curalink/providers");
  }

  const updated = await prisma.ambulanceProvider.update({
    where: { accountId: account.id },
    data: { ...providerFields, ...(photoUrl ? { photoUrl } : {}) },
  });

  // Mark profile as completed once core identifying info is filled in
  const isNowComplete = Boolean(
    (firstName || account.firstName) &&
      (lastName || account.lastName) &&
      updated.organizationName &&
      updated.vehicleInfo &&
      updated.serviceArea
  );

  if (isNowComplete && !account.isProfileCompleted) {
    await prisma.account.update({
      where: { id: account.id },
      data: { isProfileCompleted: true },
    });
  }

  return NextResponse.json({ provider: updated, isProfileCompleted: isNowComplete });
}
