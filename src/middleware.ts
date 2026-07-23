import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "curalink_token";
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

const roleProtectedPrefixes: Record<string, "ADMIN" | "DOCTOR" | "PATIENT"> = {
  "/admin": "ADMIN",
  "/doctor": "DOCTOR",
  "/patient": "PATIENT",
};

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedPrefix = Object.keys(roleProtectedPrefixes).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchedPrefix) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    const role = payload.role as string;

    const requiredRole = roleProtectedPrefixes[matchedPrefix];
    if (role !== requiredRole) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  } catch {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};