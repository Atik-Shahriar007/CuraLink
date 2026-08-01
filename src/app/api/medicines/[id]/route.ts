import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const medicine = await prisma.medicine.findUnique({
      where: { id },
    });

    if (!medicine) {
      return NextResponse.json({ error: "Medicine not found" }, { status: 404 });
    }

    return NextResponse.json(medicine);
  } catch (err) {
    console.error("Get medicine error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}