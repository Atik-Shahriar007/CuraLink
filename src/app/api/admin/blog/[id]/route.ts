import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const reviewSchema = z.object({
  action: z.enum(["PUBLISH", "REJECT"]),
  rejectionReason: z.string().optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const post = await prisma.blogPost.findUnique({ where: { id } });

  if (!post) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (post.status !== "PENDING_REVIEW") {
    return NextResponse.json(
      { error: "Only posts pending review can be reviewed" },
      { status: 400 }
    );
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.blogPost.update({
    where: { id },
    data:
      parsed.data.action === "PUBLISH"
        ? { status: "PUBLISHED", publishedAt: new Date(), rejectionReason: null }
        : { status: "REJECTED", rejectionReason: parsed.data.rejectionReason || "Not specified" },
  });

  return NextResponse.json(updated);
}