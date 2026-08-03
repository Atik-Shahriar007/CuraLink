import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";

const CATEGORIES = [
  "BILLING_AND_PAYMENTS", "TECHNICAL_ISSUE", "APPOINTMENT_PROBLEM",
  "AMBULANCE_ISSUE", "ACCOUNT_VERIFICATION", "PRESCRIPTION_ISSUE",
  "GENERAL_INQUIRY", "OTHER",
];

const createSchema = z.object({
  subject: z.string().min(3).max(150),
  category: z.enum(CATEGORIES as [string, ...string[]]),
  message: z.string().min(5),
});

export async function GET() {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Support agents/admins see everything; everyone else sees only their own
  const isStaff = account.role === "SUPPORT_AGENT" || account.role === "ADMIN";

  const tickets = await prisma.supportTicket.findMany({
    where: isStaff ? {} : { createdById: account.id },
    include: {
      createdBy: { select: { firstName: true, lastName: true, email: true, role: true } },
      assignedAgent: { select: { firstName: true, lastName: true } },
      messages: { orderBy: { createdAt: "desc" }, take: 1 },
    },
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const ticket = await prisma.supportTicket.create({
    data: {
      subject: parsed.data.subject,
      category: parsed.data.category as any,
      createdById: account.id,
      messages: {
        create: { body: parsed.data.message, senderId: account.id },
      },
    },
    include: { messages: true },
  });

  await pusherServer.trigger("support-tickets", "new-ticket", { id: ticket.id });

  return NextResponse.json(ticket);
}