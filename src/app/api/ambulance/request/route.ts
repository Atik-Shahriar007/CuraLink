import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";

const requestSchema = z.object({
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  address: z.string().min(3),
  situationDescription: z.string().min(3),
  contactPhone: z.string().min(5),
});

export async function POST(req: NextRequest) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "PATIENT" || !account.patient) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = requestSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input" }, { status: 400 });
  }

  const request = await prisma.ambulanceRequest.create({
    data: {
      ...parsed.data,
      patientId: account.patient.id,
      status: "REQUESTED",
    },
  });

  // Notify all providers in real time that a new request came in
  await pusherServer.trigger("ambulance-requests", "new-request", {
    id: request.id,
  });

  return NextResponse.json(request);
}