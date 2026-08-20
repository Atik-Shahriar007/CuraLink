import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Powers the directory's Form / Category dropdowns. The catalog import added
// many more of both than the original hardcoded lists carried, so the options
// are read from the data instead.
export async function GET() {
  try {
    const [forms, categories] = await Promise.all([
      prisma.medicine.findMany({
        distinct: ["form"],
        select: { form: true },
        orderBy: { form: "asc" },
      }),
      prisma.medicine.findMany({
        distinct: ["therapeuticCategory"],
        select: { therapeuticCategory: true },
        orderBy: { therapeuticCategory: "asc" },
      }),
    ]);

    return NextResponse.json({
      forms: forms.map((f) => f.form),
      categories: categories.map((c) => c.therapeuticCategory),
    });
  } catch (err) {
    console.error("Medicine filters error:", err);
    return NextResponse.json({ forms: [], categories: [] }, { status: 500 });
  }
}
