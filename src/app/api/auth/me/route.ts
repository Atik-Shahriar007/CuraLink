import { NextResponse } from "next/server";
import { getCurrentAccount } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { password, ...safeAccount } = account;
  return NextResponse.json(safeAccount);
}