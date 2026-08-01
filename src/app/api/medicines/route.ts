import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const form = searchParams.get("form") || "";
    const category = searchParams.get("category") || "";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const medicines = await prisma.medicine.findMany({
      where: {
        ...(form ? { form } : {}),
        ...(category ? { therapeuticCategory: category } : {}),
        ...(minPrice ? { price: { gte: parseFloat(minPrice) } } : {}),
        ...(maxPrice ? { price: { lte: parseFloat(maxPrice) } } : {}),
        ...(search
          ? {
              OR: [
                { brandName: { contains: search, mode: "insensitive" } },
                { genericName: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { brandName: "asc" },
    });

    return NextResponse.json(medicines);
  } catch (err) {
    console.error("List medicines error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}