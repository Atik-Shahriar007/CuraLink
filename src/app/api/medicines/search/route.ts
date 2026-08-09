import { NextRequest, NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/session";
import { searchCatalog } from "@/lib/medicineCatalog";

// Type-ahead for the prescription writer. Backed by the Medicine table, so it
// only ever offers medicines that actually exist.
export async function GET(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const q = req.nextUrl.searchParams.get("q") ?? "";
  const limitParam = Number(req.nextUrl.searchParams.get("limit"));
  const limit =
    Number.isFinite(limitParam) && limitParam > 0 ? Math.min(limitParam, 25) : 8;

  return NextResponse.json({ results: await searchCatalog(q, limit) });
}
