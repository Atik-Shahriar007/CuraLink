import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || "";
    const specialty = searchParams.get("specialty") || "";
    const maxPrice = searchParams.get("maxPrice");
    const sortBy = searchParams.get("sortBy") || "newest";

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
        reviews: {
          select: { rating: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const withRatings = doctors.map((doc) => {
      const { reviews, ...rest } = doc;
      const avgRating =
        reviews.length > 0
          ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
          : null;
      return { ...rest, avgRating, reviewCount: reviews.length };
    });

    const experienceOrder: Record<string, number> = {
      FIVE_PLUS: 3,
      ONE_TO_FIVE: 2,
      LESS_THAN_ONE: 1,
    };

    withRatings.sort((a, b) => {
      switch (sortBy) {
        case "rating":
          return (b.avgRating ?? -1) - (a.avgRating ?? -1);
        case "experience":
          return (experienceOrder[b.experienceLevel || ""] || 0) - (experienceOrder[a.experienceLevel || ""] || 0);
        case "priceLow":
          return (a.price ?? Infinity) - (b.price ?? Infinity);
        case "priceHigh":
          return (b.price ?? -Infinity) - (a.price ?? -Infinity);
        default:
          return 0; // "newest" — already ordered by createdAt desc from the query
      }
    });

    return NextResponse.json(withRatings);
  } catch (err) {
    console.error("List doctors error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}