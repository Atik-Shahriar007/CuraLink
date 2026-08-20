import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadDocument } from "@/lib/cloudinary";

const verificationSchema = z.object({
  licenseNumber: z.string().min(3).max(100),
  // data:...;base64,... string from the frontend — required the first time,
  // optional on resubmission if they're only fixing the license number.
  licenseDocumentBase64: z.string().optional(),
});

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = verificationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const existing = await prisma.doctor.findUnique({ where: { id: account.doctor.id } });
  if (!existing) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  if (existing.verificationStatus === "VERIFIED") {
    return NextResponse.json({ error: "You're already verified" }, { status: 400 });
  }

  if (!parsed.data.licenseDocumentBase64 && !existing.licenseDocumentUrl) {
    return NextResponse.json(
      { error: "Please upload your license document" },
      { status: 400 }
    );
  }

  let licenseDocumentUrl = existing.licenseDocumentUrl ?? undefined;
  if (parsed.data.licenseDocumentBase64) {
    licenseDocumentUrl = await uploadDocument(
      parsed.data.licenseDocumentBase64,
      "curalink/doctor-licenses"
    );
  }

  const updated = await prisma.doctor.update({
    where: { id: account.doctor.id },
    data: {
      licenseNumber: parsed.data.licenseNumber,
      licenseDocumentUrl,
      verificationStatus: "PENDING",
      verificationNote: null,
    },
  });

  return NextResponse.json({ doctor: updated });
}
