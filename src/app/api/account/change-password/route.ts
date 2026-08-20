import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { hashPassword, verifyPassword, PASSWORD_MIN_LENGTH } from "@/lib/auth";
import { sendEmail, notificationTemplates, wrapEmail } from "@/lib/notifications";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(PASSWORD_MIN_LENGTH, `New password must be at least ${PASSWORD_MIN_LENGTH} characters`),
});

export async function PATCH(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = changePasswordSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const { currentPassword, newPassword } = parsed.data;

    const isValid = await verifyPassword(currentPassword, account.password);
    if (!isValid) {
      return NextResponse.json({ error: "Current password is incorrect" }, { status: 400 });
    }

    if (currentPassword === newPassword) {
      return NextResponse.json(
        { error: "New password must be different from current password" },
        { status: 400 }
      );
    }

    const hashed = await hashPassword(newPassword);
    await prisma.account.update({
      where: { id: account.id },
      data: { password: hashed },
    });

    // Security notice — sent regardless of notification preferences, since
    // this is an account-security event rather than an activity update.
    const tpl = notificationTemplates.passwordChanged();
    void sendEmail(account.email, tpl.subject, wrapEmail(tpl.subject, tpl.emailBodyHtml));

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Change password error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
