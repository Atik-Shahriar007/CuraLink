/**
 * Shared presentation helpers for the operations consoles.
 *
 * These exist because the health, incident and report screens all render the
 * same four things — an age, a severity chip, a status chip, and a list of
 * class names — and getting them inconsistent between pages makes an operations
 * UI feel unreliable exactly when someone is trying to trust it under pressure.
 */

export function classNames(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Age / time
// ---------------------------------------------------------------------------

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

/** Compact elapsed time: "just now", "12m", "3h 20m", "5d". */
export function formatAge(from: Date | string | number, now: Date = new Date()): string {
  const then = new Date(from).getTime();
  const diff = now.getTime() - then;

  if (diff < 0) return "in the future";
  if (diff < MINUTE) return "just now";
  if (diff < HOUR) return `${Math.floor(diff / MINUTE)}m`;

  if (diff < DAY) {
    const hours = Math.floor(diff / HOUR);
    const minutes = Math.floor((diff % HOUR) / MINUTE);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  }

  const days = Math.floor(diff / DAY);
  if (days < 30) return `${days}d`;
  return `${Math.floor(days / 30)}mo`;
}

/** Long form, for detail panels: "2 hours ago". */
export function formatRelative(from: Date | string | number, now: Date = new Date()): string {
  const diff = now.getTime() - new Date(from).getTime();
  if (diff < MINUTE) return "just now";

  const units: Array<[number, string]> = [
    [DAY, "day"],
    [HOUR, "hour"],
    [MINUTE, "minute"],
  ];

  for (const [size, label] of units) {
    if (diff >= size) {
      const n = Math.floor(diff / size);
      return `${n} ${label}${n === 1 ? "" : "s"} ago`;
    }
  }
  return "just now";
}

export function formatDateTime(value: Date | string | number | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatDate(value: Date | string | number | null | undefined): string {
  if (!value) return "—";
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/** Hours as a readable duration, for MTTR and SLA figures. */
export function formatDuration(hours: number | null | undefined): string {
  if (hours === null || hours === undefined || Number.isNaN(hours)) return "—";
  if (hours < 1) return `${Math.round(hours * 60)}m`;
  if (hours < 24) return `${hours.toFixed(1)}h`;
  return `${(hours / 24).toFixed(1)}d`;
}

// ---------------------------------------------------------------------------
// Severity
// ---------------------------------------------------------------------------

export type SeverityKey = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export const SEVERITY_LABELS: Record<SeverityKey, string> = {
  LOW: "Low",
  MEDIUM: "Medium",
  HIGH: "High",
  CRITICAL: "Critical",
};

/**
 * Plain-language descriptions shown to whoever is picking the severity, since
 * the person filing a report is a patient, not an incident manager.
 */
export const SEVERITY_HELP: Record<SeverityKey, string> = {
  LOW: "Cosmetic — annoying but everything works.",
  MEDIUM: "Something is wrong, but I found a way around it.",
  HIGH: "A core feature is broken for me.",
  CRITICAL: "Blocks me completely, or involves money or safety.",
};

export const SEVERITY_TEXT: Record<SeverityKey, string> = {
  LOW: "text-stone-700",
  MEDIUM: "text-sky-800",
  HIGH: "text-amber-800",
  CRITICAL: "text-red-800",
};

export const SEVERITY_BG: Record<SeverityKey, string> = {
  LOW: "bg-stone-100",
  MEDIUM: "bg-sky-100",
  HIGH: "bg-amber-100",
  CRITICAL: "bg-red-100",
};

export const SEVERITY_BORDER: Record<SeverityKey, string> = {
  LOW: "border-stone-200",
  MEDIUM: "border-sky-200",
  HIGH: "border-amber-300",
  CRITICAL: "border-red-300",
};

export function severityClasses(severity: string): string {
  const key = (severity as SeverityKey) in SEVERITY_BG ? (severity as SeverityKey) : "MEDIUM";
  return classNames(SEVERITY_BG[key], SEVERITY_TEXT[key]);
}

/** Sort weight so the worst thing is always first in a list. */
export const SEVERITY_ORDER: Record<SeverityKey, number> = {
  CRITICAL: 0,
  HIGH: 1,
  MEDIUM: 2,
  LOW: 3,
};

export function severityRank(severity: string): number {
  return SEVERITY_ORDER[severity as SeverityKey] ?? 9;
}

// ---------------------------------------------------------------------------
// Rule / incident / report status
// ---------------------------------------------------------------------------

export type RuleStatusKey = "OK" | "WARNING" | "BREACHED" | "ERROR";

export const RULE_STATUS_LABELS: Record<RuleStatusKey, string> = {
  OK: "Healthy",
  WARNING: "Watch",
  BREACHED: "Breached",
  ERROR: "Check failed",
};

export const RULE_STATUS_TEXT: Record<RuleStatusKey, string> = {
  OK: "text-emerald-700",
  WARNING: "text-amber-700",
  BREACHED: "text-red-700",
  ERROR: "text-stone-600",
};

export const RULE_STATUS_BG: Record<RuleStatusKey, string> = {
  OK: "bg-emerald-50",
  WARNING: "bg-amber-50",
  BREACHED: "bg-red-50",
  ERROR: "bg-stone-100",
};

export function ruleStatusClasses(status: string): string {
  const key = (status as RuleStatusKey) in RULE_STATUS_BG ? (status as RuleStatusKey) : "ERROR";
  return classNames(RULE_STATUS_BG[key], RULE_STATUS_TEXT[key]);
}

export type IncidentStatusKey = "OPEN" | "INVESTIGATING" | "FIXED" | "VERIFIED" | "CLOSED";

export const INCIDENT_STATUS_LABELS: Record<IncidentStatusKey, string> = {
  OPEN: "Open",
  INVESTIGATING: "Investigating",
  FIXED: "Awaiting verification",
  VERIFIED: "Verified",
  CLOSED: "Closed",
};

export const INCIDENT_STATUS_BG: Record<IncidentStatusKey, string> = {
  OPEN: "bg-red-50 text-red-700",
  INVESTIGATING: "bg-amber-50 text-amber-800",
  FIXED: "bg-sky-50 text-sky-800",
  VERIFIED: "bg-teal-50 text-teal-800",
  CLOSED: "bg-stone-100 text-stone-600",
};

export function incidentStatusClasses(status: string): string {
  const key =
    (status as IncidentStatusKey) in INCIDENT_STATUS_BG ? (status as IncidentStatusKey) : "OPEN";
  return INCIDENT_STATUS_BG[key];
}

export type ReportStatusKey = "NEW" | "ACKNOWLEDGED" | "INVESTIGATING" | "RESOLVED" | "DISMISSED";

export const REPORT_STATUS_LABELS: Record<ReportStatusKey, string> = {
  NEW: "New",
  ACKNOWLEDGED: "Seen",
  INVESTIGATING: "Investigating",
  RESOLVED: "Resolved",
  DISMISSED: "Closed",
};

export const REPORT_STATUS_BG: Record<ReportStatusKey, string> = {
  NEW: "bg-red-50 text-red-700",
  ACKNOWLEDGED: "bg-sky-50 text-sky-800",
  INVESTIGATING: "bg-amber-50 text-amber-800",
  RESOLVED: "bg-emerald-50 text-emerald-700",
  DISMISSED: "bg-stone-100 text-stone-600",
};

export function reportStatusClasses(status: string): string {
  const key = (status as ReportStatusKey) in REPORT_STATUS_BG ? (status as ReportStatusKey) : "NEW";
  return REPORT_STATUS_BG[key];
}

// ---------------------------------------------------------------------------
// Report categories (labels written for humans, not engineers)
// ---------------------------------------------------------------------------

export const REPORT_CATEGORY_LABELS: Record<string, string> = {
  BUG_GLITCH: "Something is broken or glitchy",
  WRONG_INFORMATION: "The information shown is wrong",
  PAYMENT_PROBLEM: "A payment problem",
  CONSULTATION_PROBLEM: "An issue with a consultation",
  AMBULANCE_PROBLEM: "An issue with an ambulance request",
  MEDICINE_CATALOG_PROBLEM: "Wrong medicine information",
  MEDICAL_RECORD_PROBLEM: "A problem with my medical records",
  OTHER: "Something else",
};

export const REPORT_CATEGORIES = Object.keys(REPORT_CATEGORY_LABELS);

export function reportCategoryLabel(category: string): string {
  return REPORT_CATEGORY_LABELS[category] ?? category;
}

export const ISSUE_SOURCE_LABELS: Record<string, string> = {
  PATIENT: "Patient",
  DOCTOR: "Doctor",
  PROVIDER: "Ambulance provider",
  SYSTEM: "Automatic",
};

// ---------------------------------------------------------------------------
// Health score
// ---------------------------------------------------------------------------

export function healthScoreColor(score: number): string {
  if (score >= 85) return "#0F3D3E";
  if (score >= 60) return "#C9A227";
  return "#B91C1C";
}

export function healthScoreLabel(score: number): string {
  if (score >= 85) return "Healthy";
  if (score >= 60) return "Needs attention";
  return "At risk";
}

export function healthScoreBg(score: number): string {
  if (score >= 85) return "bg-teal-50 border-teal-200";
  if (score >= 60) return "bg-amber-50 border-amber-200";
  return "bg-red-50 border-red-200";
}

// ---------------------------------------------------------------------------
// CSV
// ---------------------------------------------------------------------------

/**
 * Minimal RFC-4180 CSV writer. Hand-rolled rather than pulled from a library
 * because the export surfaces are small and a dependency for string quoting is
 * not worth the supply-chain surface area.
 */
export function toCsv(rows: Array<Record<string, unknown>>, columns?: string[]): string {
  if (rows.length === 0) return "";

  const headers = columns ?? Object.keys(rows[0]);

  const escape = (value: unknown): string => {
    if (value === null || value === undefined) return "";
    const text = value instanceof Date ? value.toISOString() : String(value);
    return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
  };

  return [
    headers.map(escape).join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ].join("\r\n");
}

/** Trigger a client-side download of an already-built CSV string. */
export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
