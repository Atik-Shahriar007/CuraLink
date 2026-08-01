import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { uploadImage } from "@/lib/cloudinary";

const CATEGORIES = [
  "General Health", "Mental Health", "Child Health", "Nutrition & Diet",
  "Heart Health", "Women's Health", "Skin Care", "Diabetes & Endocrine Health",
  "Elderly Care", "Preventive Care & Wellness",
];

const updateSchema = z.object({
  title: z.string().min(3).optional(),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(50).optional(),
  category: z.enum(CATEGORIES as [string, ...string[]]).optional(),
  coverImageBase64: z.string().optional(),
  submitForReview: z.boolean().optional(),
});

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post || post.doctorId !== account.doctor.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(post);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const existing = await prisma.blogPost.findUnique({ where: { id } });

  if (!existing || existing.doctorId !== account.doctor.id) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (existing.status === "PUBLISHED") {
    return NextResponse.json(
      { error: "Published posts cannot be edited here" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { coverImageBase64, submitForReview, ...data } = parsed.data;

  let coverImageUrl: string | undefined;
  if (coverImageBase64) {
    coverImageUrl = await uploadImage(coverImageBase64);
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data: {
      ...data,
      ...(coverImageUrl ? { coverImageUrl } : {}),
      ...(data.content ? { readTimeMinutes: estimateReadTime(data.content) } : {}),
      ...(submitForReview ? { status: "PENDING_REVIEW", rejectionReason: null } : {}),
    },
  });

  return NextResponse.json(updated);
}