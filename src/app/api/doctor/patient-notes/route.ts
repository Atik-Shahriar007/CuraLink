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
  const search = searchParams.get("search") || "";

  const consultations = await prisma.consultation.findMany({
    where: {
      doctorId: doctor.id,
      status: "COMPLETED",
      notes: { not: null },
      patient: search
        ? {
            account: {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
              ],
            },
          }
        : undefined,
    },
    include: {
      patient: { include: { account: true } },
      prescription: { include: { items: true } },
    },
    orderBy: { date: "desc" },
  });

  return NextResponse.json({ consultations });
}
