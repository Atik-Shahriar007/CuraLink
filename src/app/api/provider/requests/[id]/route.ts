import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";

const updateSchema = z.object({
  action: z.enum(["ACCEPT", "DISPATCHED", "ARRIVED", "COMPLETED", "CANCELED"]),
});

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "AMBULANCE_PROVIDER" || !account.ambulanceProvider) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (account.ambulanceProvider.approvalStatus !== "APPROVED") {
    return NextResponse.json({ error: "Not yet approved" }, { status: 403 });
  }

  const { id } = await params;
  const existing = await prisma.ambulanceRequest.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const body = await req.json();
  const parsed = updateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const { action } = parsed.data;

  if (action === "ACCEPT") {
    if (existing.providerId) {
      return NextResponse.json({ error: "Already claimed by another provider" }, { status: 409 });
    }
    const updated = await prisma.ambulanceRequest.update({
      where: { id },
      data: { status: "ACCEPTED", providerId: account.ambulanceProvider.id },
    });
    await pusherServer.trigger(`ambulance-request-${id}`, "status-update", updated);
    return NextResponse.json(updated);
  }

  // All other actions require this provider to already own the request
  if (existing.providerId !== account.ambulanceProvider.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const statusMap: Record<string, string> = {
    DISPATCHED: "DISPATCHED",
    ARRIVED: "ARRIVED",
    COMPLETED: "COMPLETED",
    CANCELED: "CANCELED",
  };

  const updated = await prisma.ambulanceRequest.update({
    where: { id },
    data: { status: statusMap[action] as any },
  });

  await pusherServer.trigger(`ambulance-request-${id}`, "status-update", updated);

  return NextResponse.json(updated);
}