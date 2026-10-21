import { prisma } from "./prisma";
import { pusherServer } from "./pusher";
import { notifyAccount, notificationTemplates } from "./notifications";
import { adminAccountIds, displayName } from "./guards";

/**
 * User-filed problem reports.
 *
 * A report is a bug report, not a support conversation — the distinction that
 * matters is that reports carry *context*: the route the reporter was on and the
 * record they were looking at. That is what lets the ops team see "six people
 * reported a problem on this exact consultation" instead of six unrelated
 * complaints.
 */

export type ReportSeverity = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ReportStatus = "NEW" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";

/**
 * Which categories make sense for which portal. A patient has no way to spot a
 * catalogue administration problem, and a doctor has no reason to file a
 * payment complaint; offering the wrong options just produces miscategorised
 * reports that are expensive to route.
 */
export const CATEGORIES_BY_ROLE: Record<string, string[]> = {
  PATIENT: [
    "BUG_GLITCH",
    "WRONG_INFORMATION",
    "PAYMENT_PROBLEM",
    "CONSULTATION_PROBLEM",
    "AMBULANCE_PROBLEM",
    "MEDICINE_CATALOG_PROBLEM",
    "MEDICAL_RECORD_PROBLEM",
    "OTHER",
  ],
  DOCTOR: [
    "BUG_GLITCH",
    "WRONG_INFORMATION",
    "CONSULTATION_PROBLEM",
    "MEDICINE_CATALOG_PROBLEM",
    "PAYMENT_PROBLEM",
    "OTHER",
  ],
  AMBULANCE_PROVIDER: ["BUG_GLITCH", "AMBULANCE_PROBLEM", "WRONG_INFORMATION", "OTHER"],
  SUPPORT_AGENT: ["BUG_GLITCH", "WRONG_INFORMATION", "OTHER"],
  ADMIN: ["BUG_GLITCH", "WRONG_INFORMATION", "OTHER"],
};

export function sourceForRole(role: string): "PATIENT" | "DOCTOR" | "PROVIDER" | "SYSTEM" {
  if (role === "DOCTOR") return "DOCTOR";
  if (role === "AMBULANCE_PROVIDER") return "PROVIDER";
  if (role === "PATIENT") return "PATIENT";
  return "SYSTEM";
}

export function categoriesForRole(role: string): string[] {
  return CATEGORIES_BY_ROLE[role] ?? CATEGORIES_BY_ROLE.PATIENT;
}

// ---------------------------------------------------------------------------
// Creating a report
// ---------------------------------------------------------------------------

export interface CreateReportInput {
  reporterId: string;
  reporterRole: string;
  title: string;
  description: string;
  category: string;
  severity: ReportSeverity;
  contextPath?: string | null;
  contextEntity?: string | null;
  contextEntityId?: string | null;
  browserInfo?: string | null;
  attachmentUrl?: string | null;
}

export async function createReport(input: CreateReportInput) {
  const report = await prisma.issueReport.create({
    data: {
      title: input.title,
      description: input.description,
      category: input.category as never,
      severity: input.severity as never,
      source: sourceForRole(input.reporterRole) as never,
      contextPath: input.contextPath ?? null,
      contextEntity: input.contextEntity ?? null,
      contextEntityId: input.contextEntityId ?? null,
      browserInfo: input.browserInfo ?? null,
      attachmentUrl: input.attachmentUrl ?? null,
      reporterId: input.reporterId,
      events: {
        create: {
          authorId: input.reporterId,
          kind: "COMMENT",
          body: input.description,
        },
      },
    },
  });

  // Confirm to the reporter with a quotable reference number.
  void notifyAccount(input.reporterId, notificationTemplates.issueReportReceived(report.reference));

  // Alert everyone who can triage. Deliberately no assignment here — a person
  // picks it up, which is what makes the "unassigned" count meaningful.
  const admins = await adminAccountIds();
  const agents = await prisma.account.findMany({
    where: { role: "SUPPORT_AGENT", isActive: true },
    select: { id: true },
  });

  await pusherServer
    .trigger("admin-health", "report-filed", {
      reportId: report.id,
      reference: report.reference,
      severity: report.severity,
      category: report.category,
      title: report.title,
      source: report.source,
    })
    .catch(() => {});

  void Promise.allSettled(
    [...admins, ...agents.map((a) => a.id)].map((id) =>
      notifyAccount(id, {
        subject: `New ${report.severity.toLowerCase()} report #${report.reference}`,
        emailBodyHtml: `<p><strong>${report.title}</strong></p><p>Filed by a ${report.source.toLowerCase()}${
          input.contextEntity ? ` from <code>${input.contextPath}</code> against ${input.contextEntity} ${input.contextEntityId}` : ""
        }.</p><p>${input.description}</p>`,
      })
    )
  );

  return report;
}

// ---------------------------------------------------------------------------
// Context resolution
// ---------------------------------------------------------------------------

/**
 * Turn a stored `(entity, id)` pair into something clickable. An admin reading
 * "Consultation cku8f2…" learns nothing; "Consultation with Dr. Ahmed on 3 Aug"
 * plus a link to the exact page is what makes triage fast.
 */
export async function resolveReportContext(
  entity: string | null,
  entityId: string | null
): Promise<{ label: string; href: string | null } | null> {
  if (!entity || !entityId) return null;

  try {
    switch (entity) {
      case "Consultation": {
        const c = await prisma.consultation.findUnique({
          where: { id: entityId },
          include: {
            doctor: { include: { account: { select: { firstName: true, lastName: true, email: true } } } },
            patient: { include: { account: { select: { firstName: true, lastName: true, email: true } } } },
          },
        });
        if (!c) return { label: "Consultation (no longer exists)", href: null };
        const doctor = `Dr. ${displayName(c.doctor.account)}`;
        const patient = displayName(c.patient.account);
        return {
          label: `Consultation — ${doctor} with ${patient}, ${c.date.toLocaleDateString()} (${c.status})`,
          href: `/consultation/${c.id}/notes`,
        };
      }

      case "Prescription": {
        const p = await prisma.prescription.findUnique({
          where: { id: entityId },
          include: { consultation: { select: { id: true } }, items: { select: { name: true } } },
        });
        if (!p) return { label: "Prescription (no longer exists)", href: null };
        return {
          label: `Prescription (revision ${p.revision}) — ${p.items.map((i) => i.name).join(", ") || "no items"}`,
          href: p.consultation ? `/consultation/${p.consultation.id}/notes` : null,
        };
      }

      case "Medicine": {
        const m = await prisma.medicine.findUnique({
          where: { id: entityId },
          select: { brandName: true, genericName: true, strength: true },
        });
        if (!m) return { label: "Medicine (no longer exists)", href: null };
        return {
          label: `${m.brandName} (${m.genericName}) ${m.strength}`,
          href: `/medicines/${entityId}`,
        };
      }

      case "Doctor": {
        const d = await prisma.doctor.findUnique({
          where: { id: entityId },
          include: { account: { select: { firstName: true, lastName: true, email: true } } },
        });
        if (!d) return { label: "Doctor (no longer exists)", href: null };
        return {
          label: `Doctor profile — Dr. ${displayName(d.account)} (${d.approvalStatus})`,
          href: `/doctors/${entityId}`,
        };
      }

      case "AmbulanceRequest": {
        const r = await prisma.ambulanceRequest.findUnique({
          where: { id: entityId },
          select: { address: true, status: true, createdAt: true },
        });
        if (!r) return { label: "Ambulance request (no longer exists)", href: null };
        return {
          label: `Ambulance request to "${r.address}" (${r.status})`,
          href: `/ambulance/status`,
        };
      }

      case "MedicalDocument": {
        const doc = await prisma.medicalDocument.findUnique({
          where: { id: entityId },
          select: { title: true, category: true },
        });
        if (!doc) return { label: "Medical document (no longer exists)", href: null };
        return {
          label: `Medical record — ${doc.title} (${doc.category})`,
          href: `/patient/medical-records`,
        };
      }

      case "BlogPost": {
        const post = await prisma.blogPost.findUnique({
          where: { id: entityId },
          select: { title: true, status: true },
        });
        if (!post) return { label: "Article (no longer exists)", href: null };
        return { label: `Article — ${post.title} (${post.status})`, href: `/blog/${entityId}` };
      }

      default:
        return { label: `${entity} ${entityId}`, href: null };
    }
  } catch {
    return { label: `${entity} ${entityId}`, href: null };
  }
}

// ---------------------------------------------------------------------------
// Pattern detection
// ---------------------------------------------------------------------------

export interface ReportCluster {
  contextEntity: string | null;
  contextEntityId: string | null;
  label: string;
  href: string | null;
  count: number;
  severity: string;
  latestAt: Date;
  reportIds: string[];
}

/**
 * Cluster recent reports by the record they point at.
 *
 * One person having a bad time is noise. Three people reporting the same
 * consultation is a bug, and it is the single most useful signal this whole
 * feature produces — so it gets computed on every inbox load rather than waiting
 * for the six-hourly scan.
 */
export async function findReportClusters(sinceDays = 7, minCount = 3): Promise<ReportCluster[]> {
  const since = new Date(Date.now() - sinceDays * 24 * 60 * 60 * 1000);

  const reports = await prisma.issueReport.findMany({
    where: { createdAt: { gte: since }, contextEntityId: { not: null }, status: { not: "DISMISSED" } },
    select: {
      id: true,
      severity: true,
      contextEntity: true,
      contextEntityId: true,
      createdAt: true,
    },
    orderBy: { createdAt: "desc" },
  });

  const groups = new Map<string, typeof reports>();
  for (const report of reports) {
    const key = `${report.contextEntity}:${report.contextEntityId}`;
    const bucket = groups.get(key) ?? [];
    bucket.push(report);
    groups.set(key, bucket);
  }

  const clusters: ReportCluster[] = [];

  for (const [, bucket] of groups) {
    if (bucket.length < minCount) continue;

    const first = bucket[0];
    const resolved = await resolveReportContext(first.contextEntity, first.contextEntityId);

    // Rank by the worst severity in the cluster, not the most recent one.
    const worst = bucket.reduce((acc, r) => {
      const order = ["LOW", "MEDIUM", "HIGH", "CRITICAL"];
      return order.indexOf(r.severity) > order.indexOf(acc) ? r.severity : acc;
    }, "LOW");

    clusters.push({
      contextEntity: first.contextEntity,
      contextEntityId: first.contextEntityId,
      label: resolved?.label ?? "Unknown record",
      href: resolved?.href ?? null,
      count: bucket.length,
      severity: worst,
      latestAt: first.createdAt,
      reportIds: bucket.map((r) => r.id),
    });
  }

  return clusters.sort(
    (a, b) => b.count - a.count || b.latestAt.getTime() - a.latestAt.getTime()
  );
}

// ---------------------------------------------------------------------------
// Inbox aggregation
// ---------------------------------------------------------------------------

export async function reportInboxCounts() {
  const [unassigned, newCount, investigating, resolvedThisWeek] = await Promise.all([
    prisma.issueReport.count({ where: { assignedToId: null, status: { not: "DISMISSED" } } }),
    prisma.issueReport.count({ where: { status: "NEW" } }),
    prisma.issueReport.count({ where: { status: "INVESTIGATING" } }),
    prisma.issueReport.count({
      where: {
        status: "RESOLVED",
        resolvedAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
      },
    }),
  ]);

  return { unassigned, newCount, investigating, resolvedThisWeek };
}
