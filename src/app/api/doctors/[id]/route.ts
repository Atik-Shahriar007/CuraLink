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
      },
    });

    if (!doctor) {
      return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
    }

    return NextResponse.json(doctor);
  } catch (err) {
    console.error("Get doctor error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}