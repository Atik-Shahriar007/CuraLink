import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "DOCTOR") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const doctor = await prisma.doctor.findUnique({ where: { accountId: session.accountId } });
  if (!doctor) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const weekStart = searchParams.get("weekStart");

  const start = weekStart ? new Date(weekStart) : new Date();
  // Adjust to start of week (Monday)
  const day = start.getDay();
  const diff = start.getDate() - day + (day === 0 ? -6 : 1);
  start.setDate(diff);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  const consultations = await prisma.consultation.findMany({
    where: {
      doctorId: doctor.id,
      date: { gte: start, lt: end },
      status: { notIn: ["CANCELED"] },
    },
    include: { patient: { include: { account: true } } },
    orderBy: { date: "asc" },
  });

  return NextResponse.json({ consultations, weekStart: start.toISOString() });
}
