import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { notifyAccount, notificationTemplates } from "@/lib/notifications";

const verifySchema = z.object({
  verificationStatus: z.enum(["VERIFIED", "REJECTED"]),
  verificationNote: z.string().max(1000).optional(),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "ADMIN") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const body = await req.json().catch(() => ({}));
  const parsed = verifySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const doctor = await prisma.doctor.update({
    where: { id },
    data: {
      verificationStatus: parsed.data.verificationStatus,
      verificationNote: parsed.data.verificationNote,
      verifiedAt: parsed.data.verificationStatus === "VERIFIED" ? new Date() : null,
    },
  });

  if (parsed.data.verificationStatus === "VERIFIED") {
    void notifyAccount(doctor.accountId, notificationTemplates.doctorVerified());
  } else {
    void notifyAccount(
      doctor.accountId,
      notificationTemplates.doctorVerificationRejected(parsed.data.verificationNote)
    );
  }

  return NextResponse.json(doctor);
}
