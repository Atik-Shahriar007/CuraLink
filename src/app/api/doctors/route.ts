import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const specialty = searchParams.get("specialty") || "";
    const maxPrice = searchParams.get("maxPrice");

    const doctors = await prisma.doctor.findMany({
      where: {
        approvalStatus: "APPROVED",
        ...(specialty ? { specialty } : {}),
        ...(maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {}),
        ...(search
          ? {
              OR: [
                { specialty: { contains: search, mode: "insensitive" } },
                { hospital: { contains: search, mode: "insensitive" } },
                {
                  account: {
                    OR: [
                      { firstName: { contains: search, mode: "insensitive" } },
                      { lastName: { contains: search, mode: "insensitive" } },
                    ],
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        account: {
          select: { firstName: true, lastName: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(doctors);
  } catch (err) {
    console.error("List doctors error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}