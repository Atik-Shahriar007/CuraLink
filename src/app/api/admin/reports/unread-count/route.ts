import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireStaff } from "@/lib/guards";

/**
 * Badge count for the Reports nav entry. Deliberately counts only NEW reports
 * nobody has picked up — an inbox that stays red while someone is actively
 * working a report trains people to ignore it.
 */
export async function GET() {
  const guard = await requireStaff();
  if ("error" in guard) return guard.error;

  const [unseen, critical] = await Promise.all([
    prisma.issueReport.count({ where: { status: "NEW" } }),
    prisma.issueReport.count({
      where: { severity: "CRITICAL", status: { notIn: ["RESOLVED", "DISMISSED"] } },
    }),
  ]);

  return NextResponse.json({ count: unseen, critical });
}
