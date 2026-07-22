import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/auth";

const COOKIE_NAME = "curalink_token";

const roleProtectedPrefixes: Record<string, "ADMIN" | "DOCTOR" | "PATIENT"> = {
  "/admin": "ADMIN",
  "/doctor": "DOCTOR",
  "/patient": "PATIENT",
};

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const matchedPrefix = Object.keys(roleProtectedPrefixes).find((prefix) =>
    pathname.startsWith(prefix)
  );

  if (!matchedPrefix) return NextResponse.next();

  const token = req.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  const requiredRole = roleProtectedPrefixes[matchedPrefix];
  if (payload.role !== requiredRole) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/doctor/:path*", "/patient/:path*"],
};