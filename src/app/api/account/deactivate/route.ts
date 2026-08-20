import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { verifyPassword } from "@/lib/auth";
import { COOKIE_NAME } from "@/lib/session";
import { sendEmail, notificationTemplates, wrapEmail } from "@/lib/notifications";

const deactivateSchema = z.object({
  password: z.string().min(1, "Password is required to deactivate your account"),
});

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const parsed = deactivateSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message || "Invalid input" },
        { status: 400 }
      );
    }

    const isValid = await verifyPassword(parsed.data.password, account.password);
    if (!isValid) {
      return NextResponse.json({ error: "Incorrect password" }, { status: 400 });
    }

    await prisma.account.update({
      where: { id: account.id },
      data: { isActive: false, deactivatedAt: new Date() },
    });

    const tpl = notificationTemplates.accountDeactivated();
    void sendEmail(account.email, tpl.subject, wrapEmail(tpl.subject, tpl.emailBodyHtml));

    const response = NextResponse.json({ success: true });
    response.cookies.set(COOKIE_NAME, "", { maxAge: 0, path: "/" });
    return response;
  } catch (err) {
    console.error("Deactivate account error:", err);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
