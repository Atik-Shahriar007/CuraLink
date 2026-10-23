import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/guards";
import { RULE_DEFINITIONS } from "@/lib/maintenance";
import { FIXERS } from "@/lib/maintenanceFixes";

/**
 * Rule catalogue + auto-fix registry.
 *
 * Exposed so the incidents UI can render "what does this rule actually check"
 * and "what would the automatic fix do" without duplicating the wording in the
 * client bundle. The description text is the honest version: it says what a
 * human would conclude from the number, not just what SQL ran.
 */
export async function GET() {
  const guard = await requireAdmin();
  if ("error" in guard) return guard.error;

  return NextResponse.json({
    rules: RULE_DEFINITIONS.map((rule) => ({
      key: rule.key,
      title: rule.title,
      description: rule.description,
      area: rule.area,
      severity: rule.severity,
      defaultThreshold: rule.defaultThreshold,
      thresholdUnit: rule.thresholdUnit,
      fixable: rule.fixable,
    })),
    fixers: FIXERS.map((fixer) => ({
      ruleKey: fixer.ruleKey,
      label: fixer.label,
      description: fixer.description,
    })),
  });
}
