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
  age: z.number().int().positive().optional(),
  address: z.string().optional(),
  city: z.string().optional(),
  zipCode: z
    .string()
    .regex(/^[A-Za-z0-9\- ]{3,10}$/, "Enter a valid zip/postal code")
    .optional()
    .or(z.literal("")),
  weight: z.number().positive().optional(),
  height: z.number().positive().optional(),
  gender: z.enum(["MALE", "FEMALE", "OTHER"]).optional(),
  bloodType: z
    .enum(["A_POS", "A_NEG", "B_POS", "B_NEG", "AB_POS", "AB_NEG", "O_POS", "O_NEG"])
    .optional(),
  allergies: z.array(z.string()).optional(),
  chronicConditions: z.array(z.string()).optional(),
  currentMedications: z.array(z.string()).optional(),
  emergencyContactName: z.string().optional(),
  emergencyContactPhone: z.string().optional(),
  photoBase64: z.string().optional(), // data:image/...;base64,... string from frontend
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const patient = await prisma.patient.findUnique({
    where: { accountId: account.id },
  });

  return NextResponse.json({ account, patient });
}

export async function PATCH(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const {
      firstName,
      lastName,
      phone,
      age,
      address,
      city,
      zipCode,
      photoBase64,
      ...patientFields
    } = parsed.data;

    if (firstName || lastName || phone || age || address || city || zipCode) {
      await prisma.account.update({
        where: { id: account.id },
        data: { firstName, lastName, phone, age, address, city, zipCode },
      });
    }

    let photoUrl: string | undefined;
    if (photoBase64) {
      photoUrl = await uploadImage(photoBase64, "curalink/patients");
    }

    const updatedPatient = await prisma.patient.update({
      where: { accountId: account.id },
      data: { ...patientFields, ...(photoUrl ? { photoUrl } : {}) },
    });

    // Mark profile completed once core identifying info is filled in
    const isNowComplete = Boolean(
      (firstName || account.firstName) &&
        (lastName || account.lastName) &&
        updatedPatient.emergencyContactName &&
        updatedPatient.emergencyContactPhone
    );

    if (isNowComplete && !account.isProfileCompleted) {
      await prisma.account.update({
        where: { id: account.id },
        data: { isProfileCompleted: true },
      });
    }

    return NextResponse.json({ patient: updatedPatient, isProfileCompleted: isNowComplete });
  } catch (err) {
    console.error("Update patient profile error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}