import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";
import { uploadImage } from "@/lib/cloudinary";

const replySchema = z.object({
  message: z.string().min(1),
  attachmentBase64: z.string().optional(),
});

const statusSchema = z.object({
  status: z.enum(["OPEN", "IN_PROGRESS", "RESOLVED", "CLOSED"]),
});

const ratingSchema = z.object({
  satisfactionRating: z.number().int().min(1).max(5),
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

  // If the creator is viewing their own ticket, mark it as seen
  if (account.id === ticket.createdById) {
    await prisma.supportTicket.update({
      where: { id },
      data: { lastViewedByCreatorAt: new Date() },
    });
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

  let attachmentUrl: string | undefined;
  if (parsed.data.attachmentBase64) {
    attachmentUrl = await uploadImage(parsed.data.attachmentBase64);
  }

  const message = await prisma.supportMessage.create({
    data: { ticketId: id, senderId: account.id, body: parsed.data.message, attachmentUrl },
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

export async function PUT(
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

  if (ticket.createdById !== account.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  if (ticket.status !== "RESOLVED" && ticket.status !== "CLOSED") {
    return NextResponse.json(
      { error: "You can only rate a resolved or closed ticket" },
      { status: 400 }
    );
  }

  if (ticket.satisfactionRating) {
    return NextResponse.json({ error: "Already rated" }, { status: 409 });
  }

  const body = await req.json();
  const parsed = ratingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid rating" }, { status: 400 });
  }

  const updated = await prisma.supportTicket.update({
    where: { id },
    data: { satisfactionRating: parsed.data.satisfactionRating },
  });

  return NextResponse.json(updated);
}