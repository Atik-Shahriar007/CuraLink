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

const postSchema = z.object({
  title: z.string().min(3),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(50),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  coverImageBase64: z.string().optional(),
  submitForReview: z.boolean().default(false),
});

function estimateReadTime(content: string): number {
  const words = content.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    where: { doctorId: account.doctor.id },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = postSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { coverImageBase64, submitForReview, ...data } = parsed.data;

  let coverImageUrl: string | undefined;
  if (coverImageBase64) {
    coverImageUrl = await uploadImage(coverImageBase64);
  }

  const post = await prisma.blogPost.create({
    data: {
      ...data,
      coverImageUrl,
      readTimeMinutes: estimateReadTime(data.content),
      status: submitForReview ? "PENDING_REVIEW" : "DRAFT",
      doctorId: account.doctor.id,
    },
  });

  return NextResponse.json(post);
}