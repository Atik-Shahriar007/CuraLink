import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";

const replySchema = z.object({
  message: z.string().min(1),
});

const statusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

async function canAccess(ticketCreatedById: string, account: any) {
  const isStaff = account.role === "SUPPORT_AGENT" || account.role === "ADMIN";
  return isStaff || account.id === ticketCreatedById;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await prisma.supportTicket.findUnique({
    where: { id },
    include: {
      createdBy: { select: { firstName: true, lastName: true, email: true, role: true } },
      assignedAgent: { select: { firstName: true, lastName: true } },
      messages: {
        include: { sender: { select: { firstName: true, lastName: true, role: true } } },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!(await canAccess(ticket.createdById, account))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  return NextResponse.json(ticket);
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const ticket = await prisma.supportTicket.findUnique({ where: { id } });

  if (!ticket) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (!(await canAccess(ticket.createdById, account))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const parsed = replySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const isStaff = account.role === "SUPPORT_AGENT" || account.role === "ADMIN";

  const message = await prisma.supportMessage.create({
    data: { ticketId: id, senderId: account.id, body: parsed.data.message },
    include: { sender: { select: { firstName: true, lastName: true, role: true } } },
  });

  await prisma.supportTicket.update({
    where: { id },
    data: {
      updatedAt: new Date(),
      ...(isStaff && ticket.status === "OPEN" ? { status: "IN_PROGRESS" } : {}),
      ...(isStaff && !ticket.assignedAgentId ? { assignedAgentId: account.id } : {}),
    },
  });

  await pusherServer.trigger(`support-ticket-${id}`, "new-message", message);

  return NextResponse.json(message);
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || (account.role !== "SUPPORT_AGENT" && account.role !== "ADMIN")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const updated = await prisma.supportTicket.update({
    where: { id },
    data: { status: parsed.data.status },
  });

  await pusherServer.trigger(`support-ticket-${id}`, "status-update", updated);

  return NextResponse.json(updated);
}