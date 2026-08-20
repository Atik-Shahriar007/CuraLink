import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const post = await prisma.blogPost.findUnique({
      where: { id, status: "PUBLISHED" },
      include: {
        doctor: {
          include: { account: { select: { firstName: true, lastName: true } } },
        },
      },
    });

    if (!post) {
      return NextResponse.json({ error: "Article not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch (err) {
    console.error("Get blog post error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}