import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAccount } from "@/lib/guards";
import { uploadDocument } from "@/lib/cloudinary";
import { createReport, categoriesForRole } from "@/lib/reports";

const createSchema = z.object({
  title: z.string().min(5).max(150),
  description: z.string().min(10).max(5000),
  category: z.string().min(1).max(50),
  severity: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]).default("MEDIUM"),
  contextPath: z.string().max(500).optional(),
  contextEntity: z.string().max(50).optional(),
  contextEntityId: z.string().max(100).optional(),
  browserInfo: z.string().max(500).optional(),
  attachmentBase64: z.string().optional(),
});

/**
 * Any authenticated user can file a problem report. This is the entry point for
 * the "something is wrong here" button scattered across the portals.
 */
export async function POST(req: NextRequest) {
  const guard = await requireAccount();
  if ("error" in guard) return guard.error;
  const { account } = guard;

  const body = await req.json().catch(() => ({}));
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", issues: parsed.error.issues.map((i) => i.message) },
      { status: 400 }
    );
  }

  // Only accept categories that make sense for this portal, so a doctor cannot
  // file a category that no one on the ops side expects from them.
  const allowed = categoriesForRole(account.role);
  if (!allowed.includes(parsed.data.category)) {
    return NextResponse.json(
      { error: "That category is not available for your account type." },
      { status: 400 }
    );
  }

  let attachmentUrl: string | null = null;
  if (parsed.data.attachmentBase64) {
    try {
      // Documents rather than images: a screenshot of an error is often a PDF or
      // a full-page capture, which the square avatar crop would destroy.
      attachmentUrl = await uploadDocument(parsed.data.attachmentBase64, "curalink/reports");
    } catch (err) {
      console.error("[reports] attachment upload failed:", err);
      // A failed screenshot must not cost the user their report.
      attachmentUrl = null;
    }
  }

  const report = await createReport({
    reporterId: account.id,
    reporterRole: account.role,
    title: parsed.data.title,
    description: parsed.data.description,
    category: parsed.data.category,
    severity: parsed.data.severity,
    contextPath: parsed.data.contextPath,
    contextEntity: parsed.data.contextEntity,
    contextEntityId: parsed.data.contextEntityId,
    browserInfo: parsed.data.browserInfo,
    attachmentUrl,
  });

  return NextResponse.json({
    id: report.id,
    reference: report.reference,
    status: report.status,
    attachmentSaved: Boolean(attachmentUrl),
  });
}

/**
 * List reports. Everyone sees their own; staff additionally see the whole queue
 * when they pass `?scope=all`, which is what backs the admin inbox.
 */
export async function GET(req: NextRequest) {
  const guard = await requireAccount();
  if ("error" in guard) return guard.error;
  const { account } = guard;

  const scope = req.nextUrl.searchParams.get("scope");
  const isStaff = account.role === "ADMIN" || account.role === "SUPPORT_AGENT";
  const wantsAll = scope === "all" && isStaff;

  const reports = await prisma.issueReport.findMany({
    where: wantsAll ? {} : { reporterId: account.id },
    orderBy: { createdAt: "desc" },
    take: 100,
    select: {
      id: true,
      reference: true,
      title: true,
      category: true,
      severity: true,
      status: true,
      source: true,
      createdAt: true,
      updatedAt: true,
      resolvedAt: true,
      resolutionNote: true,
      contextEntity: true,
      contextEntityId: true,
      contextPath: true,
      reporter: { select: { firstName: true, lastName: true, email: true, role: true } },
      assignedTo: { select: { firstName: true, lastName: true } },
      _count: { select: { events: true } },
    },
  });

  return NextResponse.json(reports);
}
