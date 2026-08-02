import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const doctor = await prisma.doctor.findUnique({
      where: { id, approvalStatus: "APPROVED" },
      include: {
        account: {
          select: { firstName: true, lastName: true },
        },
        reviews: {
          include: {
            patient: { include: { account: { select: { firstName: true, lastName: true } } } },
          },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    const avgRating =
      doctor.reviews.length > 0
        ? doctor.reviews.reduce((sum, r) => sum + r.rating, 0) / doctor.reviews.length
        : null;

    return NextResponse.json({ ...doctor, avgRating, reviewCount: doctor.reviews.length });
  } catch (err) {
    console.error("Get doctor error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}