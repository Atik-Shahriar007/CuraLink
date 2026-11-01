import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";

  if (q.trim().length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results: {
    type: string;
    id: string;
    title: string;
    subtitle: string;
    href: string;
  }[] = [];

  // Search doctors (for all roles)
  if (["PATIENT", "ADMIN", "DOCTOR"].includes(session.role)) {
    const doctors = await prisma.doctor.findMany({
      where: {
        approvalStatus: "APPROVED",
        account: {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
          ],
        },
      },
      include: { account: true },
      take: 5,
    });

    for (const d of doctors) {
      results.push({
        type: "doctor",
        id: d.id,
        title: `Dr. ${d.account.firstName || ""} ${d.account.lastName || ""}`.trim(),
        subtitle: `${d.specialty || "General"} · ${d.hospital || ""}`,
        href: `/doctors/${d.id}`,
      });
    }
  }

  // Search medicines
  const medicines = await prisma.medicine.findMany({
    where: {
      OR: [
        { brandName: { contains: q, mode: "insensitive" } },
        { genericName: { contains: q, mode: "insensitive" } },
      ],
    },
    take: 5,
  });

  for (const m of medicines) {
    results.push({
      type: "medicine",
      id: m.id,
      title: m.brandName,
      subtitle: `${m.genericName} · ${m.form} · ${m.strength}`,
      href: `/medicines/${m.id}`,
    });
  }

  // Search patients (admin only)
  if (session.role === "ADMIN") {
    const patients = await prisma.patient.findMany({
      where: {
        account: {
          OR: [
            { firstName: { contains: q, mode: "insensitive" } },
            { lastName: { contains: q, mode: "insensitive" } },
            { email: { contains: q, mode: "insensitive" } },
          ],
        },
      },
      include: { account: true },
      take: 5,
    });

    for (const p of patients) {
      results.push({
        type: "patient",
        id: p.id,
        title: `${p.account.firstName || ""} ${p.account.lastName || ""}`.trim(),
        subtitle: p.account.email,
        href: `/admin/patients`,
      });
    }
  }

  return NextResponse.json({ results: results.slice(0, 10) });
}
