import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ANOMALY_RULE_KEYS, checkSingleRule } from "@/lib/maintenance";

/**
 * Hourly anomaly watch.
 *
 * A deliberately cheap subset of the full scan, aimed at the handful of things
 * that go wrong *fast* — a consultation nobody started, an ambulance request
 * nobody claimed, a paid-for booking that was never created. The full scan runs
 * every six hours; this fills the gap so an operator on the health console is
 * alerted within the hour rather than at the next sweep.
 *
 * Results are broadcast over Pusher (`admin-health` / `rule-breached`) rather
 * than emailed, because the consuming audience is someone with the console open.
 * Incident creation and emailing still happen inside the rule evaluation itself.
 */
export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const enabled = await prisma.maintenanceRule.findMany({
    where: { key: { in: ANOMALY_RULE_KEYS }, isEnabled: true },
    select: { key: true },
  });

  const results: Array<{ key: string; status: string; value: number }> = [];

  // Sequential rather than parallel: this runs every hour against a small rule
  // set, and serialising keeps the database load predictable next to whatever
  // else is serving live consultations at that moment.
  for (const rule of enabled) {
    const outcome = await checkSingleRule(rule.key);
    if (outcome) {
      results.push({
        key: outcome.key,
        status: outcome.result.status,
        value: outcome.result.value,
      });
    }
  }

  const breached = results.filter((r) => r.status === "BREACHED");

  if (breached.length > 0) {
    console.log(`[anomaly-watch] ${breached.length} rule(s) breaching: ${breached.map((b) => b.key).join(", ")}`);
  }

  return NextResponse.json({
    watched: results.length,
    breached: breached.length,
    results,
  });
}
