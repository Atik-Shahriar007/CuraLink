import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const notificationsSchema = z.object({
  emailNotifications: z.boolean().optional(),
  smsNotifications: z.boolean().optional(),
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    emailNotifications: account.emailNotifications,
    smsNotifications: account.smsNotifications,
  });
}

export async function PATCH(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = notificationsSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const updated = await prisma.account.update({
      where: { id: account.id },
      data: parsed.data,
    });

    return NextResponse.json({
      emailNotifications: updated.emailNotifications,
      smsNotifications: updated.smsNotifications,
    });
  } catch (err) {
    console.error("Update notification preferences error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
