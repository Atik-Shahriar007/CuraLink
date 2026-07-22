import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { hashPassword, signToken } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/session";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  role: z.enum(["PATIENT", "DOCTOR"]), // admins are never self-registered
  firstName: z.string().optional(),
  lastName: z.string().optional(),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password, role, firstName, lastName } = parsed.data;

    const existing = await prisma.account.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "An account with this email already exists" },
        { status: 409 }
      );
    }

    const hashedPassword = await hashPassword(password);

    const account = await prisma.account.create({
      data: {
        email,
        password: hashedPassword,
        role,
        firstName,
        lastName,
        ...(role === "DOCTOR" ? { doctor: { create: {} } } : {}),
        ...(role === "PATIENT" ? { patient: { create: {} } } : {}),
      },
      include: { doctor: true, patient: true },
    });

    const token = signToken({ accountId: account.id, role: account.role });

    const response = NextResponse.json({
      id: account.id,
      email: account.email,
      role: account.role,
      isProfileCompleted: account.isProfileCompleted,
    });

    response.cookies.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("Register error:", err);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}