import { NextRequest, NextResponse } from "next/server";
import { runFullScan } from "@/lib/maintenance";

/**
 * Scheduled platform health scan.
 *
 * Runs every six hours. Each rule is evaluated, recorded as a MaintenanceCheck,
 * and any rule crossing its threshold opens a maintenance incident and alerts
 * the admins. Safe to call repeatedly: one open incident per rule at a time.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const summary = await runFullScan();

    console.log(
      `[maintenance] scan complete — score ${summary.score} (${summary.band}), ` +
        `${summary.breached} breached, ${summary.warnings} warning, ${summary.errors} errored, ` +
        `${summary.openedIncidents} incident(s) opened in ${summary.durationMs}ms`
    );

    return NextResponse.json(summary);
  } catch (err) {
    console.error("[maintenance] scan failed:", err);
    return NextResponse.json({ error: "Scan failed" }, { status: 500 });
  }
}
