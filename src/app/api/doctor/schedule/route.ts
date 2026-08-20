import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";

const dayScheduleSchema = z.object({
  enabled: z.boolean(),
  start: z.string().regex(/^\d{2}:\d{2}$/),
  end: z.string().regex(/^\d{2}:\d{2}$/),
});

const scheduleSchema = z.object({
  monday: dayScheduleSchema,
  tuesday: dayScheduleSchema,
  wednesday: dayScheduleSchema,
  thursday: dayScheduleSchema,
  friday: dayScheduleSchema,
  saturday: dayScheduleSchema,
  sunday: dayScheduleSchema,
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ schedule: account.doctor.schedule });
}

export async function PATCH(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = scheduleSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid schedule", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  // Basic sanity check: start must be before end for enabled days
  for (const [day, hours] of Object.entries(parsed.data)) {
    if (hours.enabled && hours.start >= hours.end) {
      return NextResponse.json(
        { error: `${day}: start time must be before end time` },
        { status: 400 }
      );
    }
  }

  const updated = await prisma.doctor.update({
    where: { accountId: account.id },
    data: { schedule: parsed.data },
  });

  return NextResponse.json({ schedule: updated.schedule });
}