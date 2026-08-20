import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadDocument } from "@/lib/cloudinary";

const uploadSchema = z.object({
  title: z.string().min(1).max(150),
  category: z
    .enum(["LAB_REPORT", "PRESCRIPTION", "IMAGING", "VACCINATION", "OTHER"])
    .default("OTHER"),
  notes: z.string().max(1000).optional(),
  fileBase64: z.string().min(1),
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const documents = await prisma.medicalDocument.findMany({
    where: { patientId: account.patient.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(documents);
}

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const parsed = uploadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  try {
    const fileUrl = await uploadDocument(parsed.data.fileBase64, "curalink/medical-records");

    const document = await prisma.medicalDocument.create({
      data: {
        patientId: account.patient.id,
        title: parsed.data.title,
        category: parsed.data.category,
        notes: parsed.data.notes,
        fileUrl,
      },
    });

    return NextResponse.json(document, { status: 201 });
  } catch (err) {
    console.error("Upload medical document error:", err);
    return NextResponse.json({ error: "Could not upload document" }, { status: 500 });
  }
}
