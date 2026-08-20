import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const DEFAULT_PAGE_SIZE = 12;
const MAX_PAGE_SIZE = 60;

function toPositiveInt(value: string | null, fallback: number) {
  const parsed = Number.parseInt(value ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const form = searchParams.get("form") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const page = toPositiveInt(searchParams.get("page"), 1);
    const pageSize = Math.min(
      toPositiveInt(searchParams.get("pageSize"), DEFAULT_PAGE_SIZE),
      MAX_PAGE_SIZE
    );

    const where: Prisma.MedicineWhereInput = {
      ...(form ? { form } : {}),
      ...(category ? { therapeuticCategory: category } : {}),
      ...(minPrice || maxPrice
        ? {
            price: {
              ...(minPrice ? { gte: parseFloat(minPrice) } : {}),
              ...(maxPrice ? { lte: parseFloat(maxPrice) } : {}),
            },
          }
        : {}),
      ...(search
        ? {
            OR: [
              { brandName: { contains: search, mode: "insensitive" } },
              { genericName: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    };

    const [total, items] = await prisma.$transaction([
      prisma.medicine.count({ where }),
      prisma.medicine.findMany({
        where,
        orderBy: { brandName: "asc" },
        skip: (page - 1) * pageSize,
        take: pageSize,
      }),
    ]);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (err) {
    console.error("List medicines error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
