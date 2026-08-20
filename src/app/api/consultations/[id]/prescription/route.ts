import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentAccount } from "@/lib/session";
import { pusherServer } from "@/lib/pusher";
import { isInCatalog } from "@/lib/medicineCatalog";
import { notifyAccount, notificationTemplates } from "@/lib/notifications";

const itemSchema = z.object({
  name: z.string().trim().min(1).max(200),
  genericName: z.string().trim().max(200).nullish(),
  strengthForm: z.string().trim().max(100).nullish(),
  category: z.string().trim().max(100).nullish(),
  dosage: z.string().trim().min(1).max(500),
});

const prescriptionSchema = z.object({
  items: z.array(itemSchema).min(1).max(50),
  advice: z.string().trim().max(2000).nullish(),
});

const include = {
  items: { orderBy: { sortOrder: "asc" } },
} as const;

async function loadConsultation(id: string) {
  return prisma.consultation.findUnique({
    where: { id },
    include: {
      doctor: {
        include: { account: { select: { firstName: true, lastName: true } } },
      },
    },
  });
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
  const consultation = await loadConsultation(id);

  if (!consultation) {
    return NextResponse.json(
      { error: "Consultation not found" },
      { status: 404 }
    );
  }

  const isDoctor =
    account.role === "DOCTOR" && account.doctor?.id === consultation.doctorId;
  const isPatient =
    account.role === "PATIENT" && account.patient?.id === consultation.patientId;

  if (!isDoctor && !isPatient) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const prescription = await prisma.prescription.findUnique({
    where: { consultationId: id },
    include,
  });

  return NextResponse.json({
    prescription,
    consultationStatus: consultation.status,
    // The doctor may only start a prescription while the call is live.
    canEdit: isDoctor && (consultation.status === "IN_PROGRESS" || !!prescription),
    doctorName: `Dr. ${consultation.doctor.account.firstName ?? ""} ${
      consultation.doctor.account.lastName ?? ""
    }`.trim(),
  });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const account = await getCurrentAccount();
  if (!account || account.role !== "DOCTOR" || !account.doctor) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const consultation = await loadConsultation(id);

  if (!consultation) {
    return NextResponse.json(
      { error: "Consultation not found" },
      { status: 404 }
    );
  }

  if (account.doctor.id !== consultation.doctorId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const existing = await prisma.prescription.findUnique({
    where: { consultationId: id },
    select: { id: true, revision: true },
  });

  // Writing a new prescription requires an active call with this patient.
  // Editing one stays open afterwards so the doctor can correct it.
  if (!existing && consultation.status !== "IN_PROGRESS") {
    return NextResponse.json(
      {
        error:
          "A prescription can only be written while you are in the call with this patient.",
      },
      { status: 400 }
    );
  }

  if (
    existing &&
    consultation.status !== "IN_PROGRESS" &&
    consultation.status !== "COMPLETED"
  ) {
    return NextResponse.json(
      { error: "This consultation can no longer be prescribed for." },
      { status: 400 }
    );
  }

  const parsed = prescriptionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Every medicine needs a name and dosage instruction." },
      { status: 400 }
    );
  }

  const items = await Promise.all(
    parsed.data.items.map(async (item, index) => ({
      name: item.name,
      genericName: item.genericName || null,
      strengthForm: item.strengthForm || null,
      category: item.category || null,
      dosage: item.dosage,
      // Derived server-side so the flag always reflects the real catalog.
      collectFromElsewhere: !(await isInCatalog(item.name)),
      sortOrder: index,
    }))
  );

  const advice = parsed.data.advice || null;

  const prescription = await prisma.$transaction(async (tx) => {
    if (existing) {
      await tx.prescriptionItem.deleteMany({
        where: { prescriptionId: existing.id },
      });
      return tx.prescription.update({
        where: { id: existing.id },
        data: {
          advice,
          revision: { increment: 1 },
          items: { create: items },
        },
        include,
      });
    }

    return tx.prescription.create({
      data: {
        consultationId: id,
        doctorId: consultation.doctorId,
        patientId: consultation.patientId,
        advice,
        items: { create: items },
      },
      include,
    });
  });

  const isUpdate = Boolean(existing);
  const doctorName = `Dr. ${consultation.doctor.account.firstName ?? ""} ${
    consultation.doctor.account.lastName ?? ""
  }`.trim();

  if (!isUpdate) {
    const patient = await prisma.patient.findUnique({ where: { id: consultation.patientId } });
    if (patient) {
      void notifyAccount(patient.accountId, notificationTemplates.prescriptionReady(doctorName));
    }
  }

  const event = {
    consultationId: id,
    revision: prescription.revision,
    isUpdate,
    doctorName,
    itemCount: prescription.items.length,
    updatedAt: prescription.updatedAt.toISOString(),
  };

  // Notify the consultation room, plus the patient's own channel so they are
  // told about an edit even when they are not in the call.
  try {
    await Promise.all([
      pusherServer.trigger(`consultation-${id}`, "prescription-updated", event),
      pusherServer.trigger(
        `patient-${consultation.patientId}`,
        "prescription-updated",
        event
      ),
    ]);
  } catch (err) {
    // A realtime hiccup must not fail the write — the prescription is saved.
    console.error("Pusher prescription notification failed:", err);
  }

  return NextResponse.json({ prescription, isUpdate });
}
