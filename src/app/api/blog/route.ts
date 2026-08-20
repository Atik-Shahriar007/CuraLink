import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || "";

    const posts = await prisma.blogPost.findMany({
      where: {
        status: "PUBLISHED",
        ...(category ? { category } : {}),
      },
      include: {
        doctor: {
          include: { account: { select: { firstName: true, lastName: true } } },
        },
      },
      orderBy: { publishedAt: "desc" },
    });

    return NextResponse.json(posts);
  } catch (err) {
    console.error("List blog posts error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}