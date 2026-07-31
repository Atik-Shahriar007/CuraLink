import { NextResponse } from "next/server";
import { getCurrentAccount, COOKIE_NAME } from "@/lib/session";

export async function GET() {
  const account = await getCurrentAccount();

  if (!account) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  if (!account.isActive) {
    const response = NextResponse.json(
      { error: "This account has been deactivated" },
      { status: 401 }
    );
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return response;
  }

  const { password, ...safeAccount } = account;
  return NextResponse.json(safeAccount);
}