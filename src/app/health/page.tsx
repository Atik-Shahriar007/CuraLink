"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Activity, AlertTriangle, CheckCircle2, Download, RefreshCw, Play, ChevronDown,
  ChevronRight, Wrench, Clock, Database, ShieldCheck,
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";
import HealthRing from "@/app/components/ops/HealthRing";
import RuleSparkline from "@/app/components/ops/RuleSparkline";
import {
  PageHeader, LoadingBlock, ErrorBlock, EmptyState, SeverityChip, RuleStatusChip,
  IncidentStatusChip,
} from "@/app/components/ops/OpsPrimitives";
import {
  formatAge, formatRelative, formatDateTime, formatDuration, toCsv, downloadCsv,
  severityRank, classNames, RULE_STATUS_TEXT,
} from "@/lib/formatters";

// ---------------------------------------------------------------------------

interface Rule {
  id: string;
  key: string;
  title: string;
  description: string;
  area: string;
  severity: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  threshold: number;
  isEnabled: boolean;
  lastRunAt: string | null;
  lastValue: number | null;
  lastStatus: string | null;
  lastRunMessage: string | null;
  history: Array<{ value: number; status: string; at: string }>;
}

interface Incident {
  id: string;
  status: string;
  severity: string;
  title: string;
  openedValue: number;
  peakValue: number;
  autoFixApplied: boolean;
  openedAt: string;
  fixedAt: string | null;
  rule: { key: string; title: string; area: string };
  assignee: { id: string; firstName: string | null; lastName: string | null } | null;
}

interface Health {
  score: number;
  band: "HEALTHY" | "ATTENTION" | "AT_RISK";
  rules: Rule[];
  areas: Array<{ area: string; rules: number; breached: number; warnings: number; errors: number; worst: string }>;
  openIncidents: Incident[];
  recentIncidents: Array<{
    id: string; title: string; status: string; severity: string;
    openedAt: string; resolvedAt: string | null; autoFixApplied: boolean;
    rule: { key: string; area: string };
  }>;
  mttrHours: number | null;
  mttrByArea: Array<{ area: string; avgHours: number; count: number }>;
  vitals: {
    accounts: number;
    consultations: number;
    medicines: number;
    documents: number;
    reports: number;
    lastScanAt: string | null;
    oldestOpenConsultation: { id: string; date: string; status: string } | null;
    oldestUnansweredReport: { id: string; reference: number; createdAt: string; title: string } | null;
  };
}

interface ScanResult {
  score: number;
  band: string;
  evaluated: number;
  breached: number;
  warnings: number;
  errors: number;
  openedIncidents: number;
  durationMs: number;
}

// ---------------------------------------------------------------------------

/** One expandable rule row: status, trend, threshold control, re-check. */
function RuleRow({
  rule,
  onRecheck,
  onUpdate,
  busy,
}: {
  rule: Rule;
  onRecheck: (id: string) => Promise<void>;
  onUpdate: (id: string, data: { threshold?: number; isEnabled?: boolean }) => Promise<void>;
  busy: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [threshold, setThreshold] = useState(rule.threshold);
  const [savingThreshold, setSavingThreshold] = useState(false);

  const dirty = threshold !== rule.threshold;

  // Sort worst-first inside a rule list so an operator scrolling the page meets
  // the fire before the tidy-up.
  return (
    <div
      className={classNames(
        "border rounded-xl bg-white overflow-hidden",
        rule.lastStatus === "BREACHED" ? "border-red-200" : "border-stone-200",
        !rule.isEnabled && "opacity-60"
      )}
    >
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-start gap-3 p-4 text-left hover:bg-stone-50 transition-colors"
      >
        <span className="mt-0.5 text-stone-400">
          {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
        </span>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-stone-900 text-sm">{rule.title}</span>
            <RuleStatusChip status={rule.lastStatus} />
            <SeverityChip severity={rule.severity} size="xs" />
            {!rule.isEnabled && (
              <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                Disabled
              </span>
            )}
          </div>
          <p className="text-xs text-stone-500 mt-1 line-clamp-1">{rule.lastRunMessage}</p>
        </div>

        <div className="text-right shrink-0">
          <p
            className={classNames(
              "text-lg font-bold tabular-nums",
              RULE_STATUS_TEXT[rule.lastStatus as keyof typeof RULE_STATUS_TEXT] ?? "text-stone-700"
            )}
          >
            {rule.lastValue ?? "—"}
          </p>
          <p className="text-[11px] text-stone-400">
            {rule.lastRunAt ? formatAge(rule.lastRunAt) + " ago" : "never run"}
          </p>
        </div>
      </button>

      {open && (
        <div className="border-t border-stone-100 px-4 py-4 bg-stone-50/60">
          <p className="text-sm text-stone-600 leading-relaxed">{rule.description}</p>

          <div className="mt-4">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 mb-2">
              Last {rule.history.length} reading{rule.history.length === 1 ? "" : "s"}
            </p>
            <RuleSparkline
              data={rule.history.map((h) => ({ value: h.value, status: h.status }))}
              threshold={rule.threshold}
              height={56}
            />
          </div>

          <div className="grid sm:grid-cols-3 gap-3 mt-4">
            <div className="bg-white border border-stone-200 rounded-lg p-3">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
                Threshold
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <input
                  type="number"
                  min={0}
                  value={threshold}
                  onChange={(e) => setThreshold(Number(e.target.value))}
                  className="w-20 border border-stone-300 rounded-md px-2 py-1 text-sm"
                />
                {dirty && (
                  <button
                    onClick={async () => {
                      setSavingThreshold(true);
                      await onUpdate(rule.id, { threshold });
                      setSavingThreshold(false);
                    }}
                    disabled={savingThreshold}
                    className="text-xs font-semibold text-teal-900 hover:underline disabled:opacity-50"
                  >
                    {savingThreshold ? "Saving..." : "Save"}
                  </button>
                )}
              </div>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-3">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
                Last checked
              </p>
              <p className="text-sm text-stone-800 mt-1.5">
                {rule.lastRunAt ? formatRelative(rule.lastRunAt) : "Never"}
              </p>
            </div>

            <div className="bg-white border border-stone-200 rounded-lg p-3">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
                Rule key
              </p>
              <p className="text-xs text-stone-600 mt-1.5 font-mono break-all">{rule.key}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={() => onRecheck(rule.id)}
              disabled={busy}
              className="flex items-center gap-1.5 text-xs font-semibold border border-stone-300 rounded-lg px-3 py-1.5 bg-white hover:bg-stone-100 transition-colors disabled:opacity-50"
            >
              <RefreshCw size={13} className={busy ? "animate-spin" : ""} />
              Re-check now
            </button>

            <button
              onClick={() => onUpdate(rule.id, { isEnabled: !rule.isEnabled })}
              className="text-xs font-semibold text-stone-600 hover:text-stone-900"
            >
              {rule.isEnabled ? "Disable this check" : "Enable this check"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function SystemHealthPage() {
  const [health, setHealth] = useState<Health | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [busyRuleId, setBusyRuleId] = useState<string | null>(null);
  const [areaFilter, setAreaFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [showAllRules, setShowAllRules] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/admin/health");
      if (!res.ok) throw new Error("Could not load platform health.");
      setHealth(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load platform health.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function runScan() {
    setScanning(true);
    setScanResult(null);
    try {
      const res = await fetch("/api/admin/health/scan", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setScanResult(data);
        await load();
      } else {
        setError(data.error ?? "Scan failed.");
      }
    } catch {
      setError("Scan failed — the request did not complete.");
    } finally {
      setScanning(false);
    }
  }

  async function recheckRule(id: string) {
    setBusyRuleId(id);
    try {
      await fetch(`/api/admin/health/rules/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "recheck" }),
      });
      await load();
    } finally {
      setBusyRuleId(null);
    }
  }

  async function updateRule(id: string, data: { threshold?: number; isEnabled?: boolean }) {
    await fetch(`/api/admin/health/rules/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    await load();
  }

  const filteredRules = useMemo(() => {
    if (!health) return [];
    return health.rules
      .filter((r) => (areaFilter === "ALL" ? true : r.area === areaFilter))
      .filter((r) => {
        if (statusFilter === "ALL") return true;
        if (statusFilter === "PROBLEMS") {
          return r.lastStatus === "BREACHED" || r.lastStatus === "ERROR";
        }
        return r.lastStatus === statusFilter;
      })
      .sort((a, b) => {
        const rank = ["BREACHED", "ERROR", "WARNING", "OK"];
        const statusDiff = rank.indexOf(a.lastStatus ?? "OK") - rank.indexOf(b.lastStatus ?? "OK");
        if (statusDiff !== 0) return statusDiff;
        return severityRank(a.severity) - severityRank(b.severity);
      });
  }, [health, areaFilter, statusFilter]);

  /** Only breached rules by default — the console opens on what needs doing. */
  const visibleRules = showAllRules
    ? filteredRules
    : filteredRules.filter((r) => r.lastStatus && r.lastStatus !== "OK");

  const areaOptions = useMemo(() => {
    if (!health) return [];
    return [...new Set(health.rules.map((r) => r.area))].sort();
  }, [health]);

  function exportHistory() {
    if (!health) return;
    const rows = health.rules.flatMap((rule) =>
      rule.history.map((point) => ({
        rule: rule.key,
        area: rule.area,
        severity: rule.severity,
        status: point.status,
        value: point.value,
        threshold: rule.threshold,
        measured_at: point.at,
      }))
    );
    if (rows.length === 0) return;
    downloadCsv(
      `curalink-health-${new Date().toISOString().slice(0, 10)}.csv`,
      toCsv(rows)
    );
  }

  if (loading) return <LoadingBlock label="Reading platform health..." />;
  if (error && !health) return <ErrorBlock message={error} onRetry={load} />;
  if (!health) return <ErrorBlock message="No health data available." onRetry={load} />;

  const breached = health.rules.filter((r) => r.lastStatus === "BREACHED");
  const criticalBreaches = breached.filter((r) => r.severity === "CRITICAL");

  return (
    <div>
      <PageHeader
        title="System Health"
        subtitle="Standing checks on the data underneath the platform. Anything breaching has a work order waiting in Incidents."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportHistory}
              className="flex items-center gap-1.5 text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 bg-white hover:bg-stone-50 transition-colors"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={runScan}
              disabled={scanning}
              className="flex items-center gap-2 bg-teal-950 hover:bg-teal-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-60"
            >
              {scanning ? <RefreshCw size={15} className="animate-spin" /> : <Play size={15} />}
              {scanning ? "Scanning..." : "Run scan now"}
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorBlock message={error} />
        </div>
      )}

      {scanResult && (
        <div className="mb-6 border border-teal-200 bg-teal-50 rounded-2xl px-5 py-4 flex items-start gap-3">
          <CheckCircle2 size={18} className="text-teal-800 mt-0.5 shrink-0" />
          <div className="text-sm text-teal-900">
            <p className="font-semibold">
              Scan finished in {(scanResult.durationMs / 1000).toFixed(1)}s — {scanResult.evaluated} checks run.
            </p>
            <p className="mt-0.5">
              {scanResult.breached} breached, {scanResult.warnings} on watch,{" "}
              {scanResult.errors} could not run.
              {scanResult.openedIncidents > 0 &&
                ` ${scanResult.openedIncidents} new incident(s) opened.`}
            </p>
          </div>
        </div>
      )}

      {/* --- Headline ------------------------------------------------------ */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <DashboardCard className="flex flex-col items-center justify-center py-8">
          <HealthRing
            score={health.score}
            label={
              health.vitals.lastScanAt
                ? `Last full scan ${formatRelative(health.vitals.lastScanAt)}`
                : "No scan recorded yet"
            }
          />
        </DashboardCard>

        <DashboardCard title="What needs doing" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <div className="rounded-xl bg-red-50 px-3 py-3">
              <p className="text-2xl font-bold text-red-800 tabular-nums">{breached.length}</p>
              <p className="text-xs font-medium text-red-700">Breaching</p>
            </div>
            <div className="rounded-xl bg-amber-50 px-3 py-3">
              <p className="text-2xl font-bold text-amber-800 tabular-nums">
                {health.rules.filter((r) => r.lastStatus === "WARNING").length}
              </p>
              <p className="text-xs font-medium text-amber-700">On watch</p>
            </div>
            <div className="rounded-xl bg-teal-50 px-3 py-3">
              <p className="text-2xl font-bold text-teal-900 tabular-nums">
                {health.openIncidents.length}
              </p>
              <p className="text-xs font-medium text-teal-800">Open incidents</p>
            </div>
            <div className="rounded-xl bg-stone-100 px-3 py-3">
              <p className="text-2xl font-bold text-stone-800 tabular-nums">
                {formatDuration(health.mttrHours)}
              </p>
              <p className="text-xs font-medium text-stone-600">Avg. repair (30d)</p>
            </div>
          </div>

          {criticalBreaches.length > 0 ? (
            <div className="border border-red-200 bg-red-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-red-900 flex items-center gap-2">
                <AlertTriangle size={15} /> Critical checks are breaching
              </p>
              <ul className="mt-2 space-y-1">
                {criticalBreaches.map((rule) => (
                  <li key={rule.id} className="text-sm text-red-800">
                    {rule.title} — <span className="font-medium">{rule.lastRunMessage}</span>
                  </li>
                ))}
              </ul>
              <Link
                href="/admin/incidents"
                className="inline-block mt-3 text-sm font-semibold text-red-900 underline hover:no-underline"
              >
                Open the incident queue →
              </Link>
            </div>
          ) : (
            <div className="border border-teal-200 bg-teal-50 rounded-xl p-4">
              <p className="text-sm font-semibold text-teal-900 flex items-center gap-2">
                <ShieldCheck size={15} /> No critical checks are breaching
              </p>
              <p className="text-sm text-teal-800 mt-1">
                {breached.length === 0
                  ? "Every standing check is currently within its threshold."
                  : `${breached.length} non-critical check(s) need attention — see below.`}
              </p>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* --- Areas --------------------------------------------------------- */}
      <DashboardCard title="By area" className="mb-6">
        {health.areas.length === 0 ? (
          <EmptyState
            title="No checks registered"
            hint="Run a scan to populate the check registry."
            icon={<Database size={28} />}
          />
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {health.areas.map((area) => (
              <button
                key={area.area}
                onClick={() => {
                  setAreaFilter(area.area);
                  setStatusFilter("ALL");
                }}
                className={classNames(
                  "text-left border rounded-xl p-3 transition-colors",
                  area.breached > 0
                    ? "border-red-200 bg-red-50 hover:bg-red-100"
                    : "border-stone-200 bg-white hover:bg-stone-50",
                  areaFilter === area.area && "ring-2 ring-teal-900/30"
                )}
              >
                <p className="font-medium text-sm text-stone-900">{area.area}</p>
                <p className="text-[11px] text-stone-500 mt-0.5">{area.rules} checks</p>
                <div className="flex items-center gap-2 mt-2">
                  {area.breached > 0 && (
                    <span className="text-[11px] font-bold text-red-700">{area.breached} breaching</span>
                  )}
                  {area.warnings > 0 && (
                    <span className="text-[11px] font-bold text-amber-700">{area.warnings} watch</span>
                  )}
                  {area.errors > 0 && (
                    <span className="text-[11px] font-bold text-stone-600">{area.errors} failed</span>
                  )}
                  {area.breached === 0 && area.warnings === 0 && area.errors === 0 && (
                    <span className="text-[11px] font-bold text-teal-700">All clear</span>
                  )}
                </div>
              </button>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* --- Rule list ----------------------------------------------------- */}
      <DashboardCard
        title="Standing checks"
        className="mb-6"
        action={
          <div className="flex items-center gap-3">
            <select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value)}
              className="border border-stone-300 rounded-lg px-2 py-1.5 text-xs bg-white"
            >
              <option value="ALL">All areas</option>
              {areaOptions.map((area) => (
                <option key={area} value={area}>
                  {area}
                </option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="border border-stone-300 rounded-lg px-2 py-1.5 text-xs bg-white"
            >
              <option value="ALL">Any status</option>
              <option value="PROBLEMS">Problems only</option>
              <option value="BREACHED">Breaching</option>
              <option value="WARNING">On watch</option>
              <option value="OK">Healthy</option>
              <option value="ERROR">Failed to run</option>
            </select>
            <button
              onClick={() => setShowAllRules((v) => !v)}
              className="text-xs font-semibold text-teal-900 hover:underline whitespace-nowrap"
            >
              {showAllRules ? "Show problems only" : `Show all ${health.rules.length}`}
            </button>
          </div>
        }
      >
        {visibleRules.length === 0 ? (
          <EmptyState
            title={showAllRules ? "No checks match these filters" : "Nothing is breaching"}
            hint={
              showAllRules
                ? "Try clearing the area or status filter."
                : "Every standing check is within its threshold. Switch to “Show all” to review the full set."
            }
            icon={<CheckCircle2 size={28} />}
          />
        ) : (
          <div className="space-y-2">
            {visibleRules.map((rule) => (
              <RuleRow
                key={rule.id}
                rule={rule}
                onRecheck={recheckRule}
                onUpdate={updateRule}
                busy={busyRuleId === rule.id}
              />
            ))}
          </div>
        )}
      </DashboardCard>

      {/* --- Open incidents ------------------------------------------------ */}
      <DashboardCard
        title="Open work orders"
        className="mb-6"
        action={
          <Link href="/admin/incidents" className="text-xs font-semibold text-teal-900 hover:underline">
            View all incidents →
          </Link>
        }
      >
        {health.openIncidents.length === 0 ? (
          <EmptyState
            title="No open work orders"
            hint="Incidents open automatically when a check breaches."
            icon={<Wrench size={28} />}
          />
        ) : (
          <div className="space-y-2">
            {health.openIncidents.map((incident) => (
              <Link
                key={incident.id}
                href={`/admin/incidents?focus=${incident.id}`}
                className="flex items-center justify-between gap-3 border border-stone-200 rounded-xl px-4 py-3 hover:bg-stone-50 transition-colors"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-medium text-stone-900 truncate">
                      {incident.title}
                    </span>
                    <IncidentStatusChip status={incident.status} />
                    <SeverityChip severity={incident.severity} size="xs" />
                    {incident.autoFixApplied && (
                      <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
                        auto-fixed
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-stone-500 mt-1">
                    {incident.rule.area} · opened {formatAge(incident.openedAt)} ago
                    {incident.assignee
                      ? ` · ${[incident.assignee.firstName, incident.assignee.lastName].filter(Boolean).join(" ") || "assigned"}`
                      : " · unassigned"}
                  </p>
                </div>
                <span className="text-xs text-stone-400 whitespace-nowrap shrink-0">
                  {incident.openedValue} → {incident.peakValue}
                </span>
              </Link>
            ))}
          </div>
        )}
      </DashboardCard>

      {/* --- Vitals + MTTR ------------------------------------------------- */}
      <div className="grid md:grid-cols-2 gap-6">
        <DashboardCard title="Platform vitals">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Accounts", value: health.vitals.accounts },
              { label: "Consultations", value: health.vitals.consultations },
              { label: "Medicines", value: health.vitals.medicines },
              { label: "Medical records", value: health.vitals.documents },
              { label: "Problem reports", value: health.vitals.reports },
              { label: "Open incidents", value: health.openIncidents.length },
            ].map((row) => (
              <div key={row.label} className="border border-stone-200 rounded-xl px-3 py-2.5">
                <p className="text-lg font-bold text-stone-900 tabular-nums">
                  {row.value.toLocaleString()}
                </p>
                <p className="text-[11px] text-stone-500">{row.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 space-y-2">
            {health.vitals.oldestOpenConsultation && (
              <p className="text-xs text-stone-600 flex items-center gap-1.5">
                <Clock size={12} />
                Oldest open consultation: {formatDateTime(health.vitals.oldestOpenConsultation.date)} (
                {health.vitals.oldestOpenConsultation.status})
              </p>
            )}
            {health.vitals.oldestUnansweredReport && (
              <p className="text-xs text-stone-600 flex items-center gap-1.5">
                <Activity size={12} />
                Oldest unanswered report: #{health.vitals.oldestUnansweredReport.reference} —{" "}
                {health.vitals.oldestUnansweredReport.title} (
                {formatAge(health.vitals.oldestUnansweredReport.createdAt)} ago)
              </p>
            )}
          </div>
        </DashboardCard>

        <DashboardCard title="Where repairs take longest">
          {health.mttrByArea.length === 0 ? (
            <EmptyState
              title="No repair history yet"
              hint="Once incidents are verified, average repair time per area appears here."
            />
          ) : (
            <div className="space-y-3">
              {health.mttrByArea.map((row) => {
                const max = Math.max(...health.mttrByArea.map((r) => r.avgHours), 1);
                return (
                  <div key={row.area}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <span className="text-stone-700">{row.area}</span>
                      <span className="text-stone-500 text-xs">
                        {formatDuration(row.avgHours)} avg · {row.count} incident{row.count === 1 ? "" : "s"}
                      </span>
                    </div>
                    <div className="h-2 rounded-full bg-stone-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-teal-900/70"
                        style={{ width: `${Math.max(4, (row.avgHours / max) * 100)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}
