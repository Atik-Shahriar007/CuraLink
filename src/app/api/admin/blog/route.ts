import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const posts = await prisma.blogPost.findMany({
    include: {
      doctor: {
        include: { account: { select: { firstName: true, lastName: true } } },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(posts);
}