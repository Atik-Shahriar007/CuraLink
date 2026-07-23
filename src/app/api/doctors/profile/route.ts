import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const scheduleSchema = z.record(
  z.string(),
  z.array(z.object({ start: z.string(), end: z.string() }))
);

const profileSchema = z.object({
  firstName: z.string().min(1).optional(),
  lastName: z.string().min(1).optional(),
  phone: z.string().optional(),
  description: z.string().optional(),
  hospital: z.string().optional(),
  specialty: z.string().optional(),
  price: z.number().positive().optional(),
  degrees: z.array(z.string()).optional(),
  certifications: z.array(z.string()).optional(),
  experienceLevel: z
    .enum(["LESS_THAN_ONE", "ONE_TO_FIVE", "FIVE_PLUS"])
    .optional(),
  schedule: scheduleSchema.optional(),
  photoBase64: z.string().optional(), // data:image/...;base64,... string from frontend
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doctor = await prisma.doctor.findUnique({
    where: { accountId: account.id },
  });

  return NextResponse.json({ account, doctor });
}

export async function PATCH(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR") {
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
      photoBase64,
      ...doctorFields
    } = parsed.data;

    let photoUrl: string | undefined;
    if (photoBase64) {
      photoUrl = await uploadImage(photoBase64);
    }

    // Update Account fields (name/phone) if provided
    if (firstName || lastName || phone) {
      await prisma.account.update({
        where: { id: account.id },
        data: { firstName, lastName, phone },
      });
    }

    const updatedDoctor = await prisma.doctor.update({
      where: { accountId: account.id },
      data: {
        ...doctorFields,
        ...(photoUrl ? { photoUrl } : {}),
      },
    });

    // Mark profile as completed once core fields are filled in
    const isNowComplete = Boolean(
      updatedDoctor.specialty &&
        updatedDoctor.hospital &&
        updatedDoctor.price &&
        updatedDoctor.photoUrl
    );

    if (isNowComplete && !account.isProfileCompleted) {
      await prisma.account.update({
        where: { id: account.id },
        data: { isProfileCompleted: true },
      });
    }

    return NextResponse.json({ doctor: updatedDoctor, isProfileCompleted: isNowComplete });
  } catch (err) {
    console.error("Update doctor profile error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}