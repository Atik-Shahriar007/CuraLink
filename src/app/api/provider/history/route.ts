import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import prisma from "@/lib/prisma";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "AMBULANCE_PROVIDER") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const provider = await prisma.ambulanceProvider.findUnique({ where: { accountId: session.accountId } });
  if (!provider) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = 20;
  const search = searchParams.get("search") || "";
  const range = searchParams.get("range") || "all";

  let dateFilter: { gte?: Date } | undefined;
  if (range !== "all") {
    const d = new Date();
    if (range === "today") d.setHours(0, 0, 0, 0);
    else if (range === "week") d.setDate(d.getDate() - 7);
    else if (range === "month") d.setMonth(d.getMonth() - 1);
    dateFilter = { gte: d };
  }

  const where: any = {
    providerId: provider.id,
    status: status && status !== "ALL" ? { in: status === "COMPLETED" ? ["COMPLETED"] : ["CANCELED"] } : { in: ["COMPLETED", "CANCELED"] },
    ...(dateFilter ? { createdAt: dateFilter } : {}),
    ...(search ? { OR: [{ address: { contains: search, mode: "insensitive" } }, { situationDescription: { contains: search, mode: "insensitive" } }] } : {}),
  };

  const [total, requests] = await Promise.all([
    prisma.ambulanceRequest.count({ where }),
    prisma.ambulanceRequest.findMany({
      where,
      include: { patient: { include: { account: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
  ]);

  return NextResponse.json({ requests, total, page, totalPages: Math.ceil(total / limit) });
}
