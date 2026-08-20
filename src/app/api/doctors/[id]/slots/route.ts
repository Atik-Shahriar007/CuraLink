import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const DAY_NAMES = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const SLOT_MINUTES = 30;

interface DayHours {
  enabled: boolean;
  start: string;
  end: string;
}

type WeekSchedule = {
  [day: string]: DayHours;
};

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { searchParams } = new URL(req.url);
  const dateParam = searchParams.get("date"); // expected format: YYYY-MM-DD

  if (!dateParam) {
    return NextResponse.json({ error: "Date is required" }, { status: 400 });
  }

  const doctor = await prisma.doctor.findUnique({
    where: { id, approvalStatus: "APPROVED" },
  });

  if (!doctor) {
    return NextResponse.json({ error: "Doctor not found" }, { status: 404 });
  }

  const schedule = doctor.schedule as WeekSchedule | null;

  const [year, month, day] = dateParam.split("-").map(Number);
  const dateObj = new Date(year, month - 1, day);
  const dayName = DAY_NAMES[dateObj.getDay()];

  const dayHours = schedule?.[dayName];

  if (!dayHours || !dayHours.enabled) {
    return NextResponse.json({ slots: [] });
  }

  // Generate candidate slots
  const [startH, startM] = dayHours.start.split(":").map(Number);
  const [endH, endM] = dayHours.end.split(":").map(Number);

  const slots: string[] = [];
  let current = new Date(year, month - 1, day, startH, startM);
  const end = new Date(year, month - 1, day, endH, endM);

  while (current < end) {
    slots.push(
      `${String(current.getHours()).padStart(2, "0")}:${String(current.getMinutes()).padStart(2, "0")}`
    );
    current = new Date(current.getTime() + SLOT_MINUTES * 60 * 1000);
  }

  // Find existing bookings for this doctor on this date (excluding canceled)
  const dayStart = new Date(year, month - 1, day, 0, 0, 0);
  const dayEnd = new Date(year, month - 1, day, 23, 59, 59);

  const existing = await prisma.consultation.findMany({
    where: {
      doctorId: id,
      date: { gte: dayStart, lte: dayEnd },
      status: { not: "CANCELED" },
    },
    select: { date: true },
  });

  const bookedTimes = new Set(
    existing.map(
      (c) => `${String(c.date.getHours()).padStart(2, "0")}:${String(c.date.getMinutes()).padStart(2, "0")}`
    )
  );

  const now = new Date();
  const availableSlots = slots.filter((time) => {
    if (bookedTimes.has(time)) return false;

    const [h, m] = time.split(":").map(Number);
    const slotDateTime = new Date(year, month - 1, day, h, m);
    return slotDateTime > now;
  });

  return NextResponse.json({ slots: availableSlots });
}