"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  Wrench, Download, RefreshCw, Zap, ShieldCheck, Clock, Search,
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";
import {
  PageHeader, LoadingBlock, ErrorBlock, EmptyState, SeverityChip, IncidentStatusChip,
  FilterSelect,
} from "@/app/components/ops/OpsPrimitives";
import {
  formatAge, formatDateTime, formatDuration, toCsv, downloadCsv, severityRank,
  incidentStatusClasses, classNames,
} from "@/lib/formatters";

// ---------------------------------------------------------------------------

interface Incident {
  id: string;
  status: string;
  severity: string;
  title: string;
  openedValue: number;
  peakValue: number;
  rootCause: string | null;
  actionTaken: string | null;
  autoFixApplied: boolean;
  verificationNote: string | null;
  openedAt: string;
  acknowledgedAt: string | null;
  fixedAt: string | null;
  resolvedAt: string | null;
  closedAt: string | null;
  rule: {
    id: string;
    key: string;
    title: string;
    area: string;
    threshold: number;
    lastValue: number | null;
    lastStatus: string | null;
    fixable: boolean;
    fixLabel: string | null;
    definition: string | null;
    thresholdUnit: string | null;
  };
  assignee: { id: string; firstName: string | null; lastName: string | null } | null;
  verifiedBy: { id: string; firstName: string | null; lastName: string | null } | null;
}

interface Payload {
  incidents: Incident[];
  statusCounts: Record<string, number>;
  mttrHours: number | null;
  agents: Array<{ id: string; firstName: string | null; lastName: string | null; email: string }>;
  areas: string[];
}

const STATUS_OPTIONS = [
  { value: "OPEN_ALL", label: "Open (all active)" },
  { value: "OPEN", label: "Just opened" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "FIXED", label: "Awaiting verification" },
  { value: "VERIFIED", label: "Verified" },
  { value: "CLOSED", label: "Closed" },
  { value: "ALL", label: "Everything" },
];

function personName(person: { firstName: string | null; lastName: string | null } | null): string {
  if (!person) return "Unassigned";
  return [person.firstName, person.lastName].filter(Boolean).join(" ") || "Unnamed";
}

// ---------------------------------------------------------------------------

/** The next legal move for an incident, described in plain language. */
function nextActions(status: string): Array<{ to: string; label: string; hint: string }> {
  switch (status) {
    case "OPEN":
      return [
        { to: "INVESTIGATING", label: "Start investigating", hint: "Claim it and begin work." },
        { to: "FIXED", label: "Mark fixed", hint: "The underlying problem is resolved." },
      ];
    case "INVESTIGATING":
      return [
        { to: "FIXED", label: "Mark fixed", hint: "The underlying problem is resolved." },
        { to: "OPEN", label: "Put back in the queue", hint: "Not actionable right now." },
      ];
    case "FIXED":
      return [
        { to: "VERIFIED", label: "Verify the fix", hint: "Confirmed with your own eyes." },
        { to: "INVESTIGATING", label: "Send back", hint: "The fix did not hold." },
      ];
    case "VERIFIED":
      return [{ to: "CLOSED", label: "Close it out", hint: "Archive this work order." }];
    default:
      return [];
  }
}

// ---------------------------------------------------------------------------

function IncidentDetail({
  incident,
  agents,
  onRefresh,
}: {
  incident: Incident;
  agents: Payload["agents"];
  onRefresh: () => Promise<void>;
}) {
  const [rootCause, setRootCause] = useState(incident.rootCause ?? "");
  const [actionTaken, setActionTaken] = useState(incident.actionTaken ?? "");
  const [verificationNote, setVerificationNote] = useState(incident.verificationNote ?? "");
  const [saving, setSaving] = useState(false);
  const [fixing, setFixing] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Reset the editable fields whenever the panel switches to another incident,
  // otherwise an edit in progress leaks onto the next record opened.
  useEffect(() => {
    setRootCause(incident.rootCause ?? "");
    setActionTaken(incident.actionTaken ?? "");
    setVerificationNote(incident.verificationNote ?? "");
    setMessage(null);
  }, [incident.id, incident.rootCause, incident.actionTaken, incident.verificationNote]);

  async function patch(body: Record<string, unknown>, successMessage: string) {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/incidents?id=${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Update failed.");
        return;
      }
      setMessage(successMessage);
      await onRefresh();
    } catch {
      setMessage("Update failed — the request did not complete.");
    } finally {
      setSaving(false);
    }
  }

  async function runAutoFix() {
    if (
      !confirm(
        `Run the automatic fix for "${incident.rule.title}"?\n\n${incident.rule.fixLabel}\n\nThis changes data and is recorded on the incident.`
      )
    ) {
      return;
    }
    setFixing(true);
    setMessage(null);
    try {
      const res = await fetch(`/api/admin/incidents?id=${incident.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ runAutoFix: true }),
      });
      const data = await res.json();
      if (!res.ok) {
        setMessage(data.error ?? "Automatic fix failed.");
        return;
      }
      setMessage(`Fix applied. ${data.outcome?.summary ?? ""}`);
      await onRefresh();
    } catch {
      setMessage("Automatic fix failed — the request did not complete.");
    } finally {
      setFixing(false);
    }
  }

  const actions = nextActions(incident.status);

  // Time spent in each stage, derived from the timestamps rather than stored, so
  // the panel cannot drift from the record.
  const stages = [
    { label: "Opened", at: incident.openedAt },
    { label: "Acknowledged", at: incident.acknowledgedAt },
    { label: "Fixed", at: incident.fixedAt },
    { label: "Verified", at: incident.resolvedAt },
    { label: "Closed", at: incident.closedAt },
  ].filter((s) => s.at);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 flex-wrap mb-2">
          <IncidentStatusChip status={incident.status} />
          <SeverityChip severity={incident.severity} size="xs" />
          <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
            {incident.rule.area}
          </span>
          {incident.autoFixApplied && (
            <span className="text-[11px] font-semibold text-teal-800 bg-teal-50 px-2 py-0.5 rounded-full">
              auto-fix applied
            </span>
          )}
        </div>
        <h2 className="text-lg font-semibold text-stone-900">{incident.title}</h2>
        <p className="text-sm text-stone-600 mt-2 leading-relaxed">{incident.rule.definition}</p>
      </div>

      {/* Measurement */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="border border-stone-200 rounded-lg px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">At open</p>
          <p className="text-lg font-bold text-stone-900 tabular-nums">{incident.openedValue}</p>
        </div>
        <div className="border border-stone-200 rounded-lg px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">Peak</p>
          <p className="text-lg font-bold text-stone-900 tabular-nums">{incident.peakValue}</p>
        </div>
        <div className="border border-stone-200 rounded-lg px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">Threshold</p>
          <p className="text-lg font-bold text-stone-900 tabular-nums">{incident.rule.threshold}</p>
          <p className="text-[10px] text-stone-400">{incident.rule.thresholdUnit}</p>
        </div>
        <div className="border border-stone-200 rounded-lg px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">Now</p>
          <p
            className={classNames(
              "text-lg font-bold tabular-nums",
              incident.rule.lastStatus === "OK" ? "text-teal-800" : "text-stone-900"
            )}
          >
            {incident.rule.lastValue ?? "—"}
          </p>
          <p className="text-[10px] text-stone-400">{incident.rule.lastStatus ?? "not measured"}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="border border-stone-200 rounded-xl p-3">
        <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold mb-2">
          Timeline
        </p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          {stages.map((stage) => (
            <div key={stage.label} className="text-xs">
              <span className="text-stone-500">{stage.label}: </span>
              <span className="text-stone-800">{formatDateTime(stage.at)}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-stone-500 mt-2 flex items-center gap-1.5">
          <Clock size={12} />
          Open for {formatAge(incident.openedAt)}
          {incident.resolvedAt && ` · repaired in ${formatDuration(
            (new Date(incident.resolvedAt).getTime() - new Date(incident.openedAt).getTime()) / 3_600_000
          )}`}
        </p>
      </div>

      {/* Assignment */}
      <div className="border border-stone-200 rounded-xl p-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
            Assigned to
          </span>
          <select
            value={incident.assignee?.id ?? ""}
            onChange={(e) =>
              patch({ assigneeId: e.target.value || null }, "Assignment updated.")
            }
            disabled={saving}
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white"
          >
            <option value="">Unassigned</option>
            {agents.map((agent) => (
              <option key={agent.id} value={agent.id}>
                {personName(agent) || agent.email}
              </option>
            ))}
          </select>
        </label>
        <p className="text-xs text-stone-500 mt-2">
          Currently: {personName(incident.assignee)}
          {incident.verifiedBy && ` · verified by ${personName(incident.verifiedBy)}`}
        </p>
      </div>

      {/* Notes */}
      <div className="space-y-3">
        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
            Root cause
          </span>
          <textarea
            value={rootCause}
            onChange={(e) => setRootCause(e.target.value)}
            rows={3}
            placeholder="Why did this happen? What was actually wrong?"
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full resize-y"
          />
        </label>

        <label className="flex flex-col gap-1">
          <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
            What was done
          </span>
          <textarea
            value={actionTaken}
            onChange={(e) => setActionTaken(e.target.value)}
            rows={4}
            placeholder="The fix, and anything the next person should know."
            className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full resize-y font-mono text-xs"
          />
        </label>

        {(incident.status === "FIXED" || rootCause || actionTaken) && (
          <label className="flex flex-col gap-1">
            <span className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
              Verification note
            </span>
            <textarea
              value={verificationNote}
              onChange={(e) => setVerificationNote(e.target.value)}
              rows={2}
              placeholder="How did you confirm the problem is actually gone?"
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full resize-y"
            />
          </label>
        )}

        <button
          onClick={() => patch({ rootCause, actionTaken, verificationNote }, "Notes saved.")}
          disabled={saving}
          className="text-sm font-semibold border border-stone-300 rounded-lg px-4 py-2 bg-white hover:bg-stone-50 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save notes"}
        </button>
      </div>

      {/* Auto fix */}
      {incident.rule.fixable && incident.rule.fixLabel && (
        <div className="border border-amber-200 bg-amber-50 rounded-xl p-3">
          <p className="text-sm font-semibold text-amber-900 flex items-center gap-2">
            <Zap size={14} /> Automatic repair available
          </p>
          <p className="text-xs text-amber-800 mt-1">{incident.rule.fixLabel}</p>
          <button
            onClick={runAutoFix}
            disabled={fixing}
            className="mt-2 text-sm font-semibold bg-amber-900 hover:bg-amber-800 text-white rounded-lg px-3 py-1.5 transition-colors disabled:opacity-60"
          >
            {fixing ? "Applying..." : "Run automatic fix"}
          </button>
          <p className="text-[11px] text-amber-800 mt-1.5">
            Runs the fix, records what it changed, and moves the incident to Awaiting verification —
            it will not close it for you.
          </p>
        </div>
      )}

      {/* Transitions */}
      {actions.length > 0 && (
        <div className="border-t border-stone-200 pt-4">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold mb-2">
            Move this work order
          </p>
          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <button
                key={action.to}
                onClick={() =>
                  patch(
                    {
                      status: action.to,
                      rootCause,
                      actionTaken,
                      verificationNote,
                    },
                    `Moved to ${action.label.toLowerCase()}.`
                  )
                }
                disabled={saving || (action.to === "VERIFIED" && !verificationNote.trim())}
                title={
                  action.to === "VERIFIED" && !verificationNote.trim()
                    ? "Add a verification note first"
                    : action.hint
                }
                className={classNames(
                  "text-sm font-semibold rounded-lg px-3 py-2 transition-colors disabled:opacity-50",
                  action.to === "VERIFIED" || action.to === "CLOSED"
                    ? "bg-teal-950 hover:bg-teal-900 text-white"
                    : "border border-stone-300 bg-white hover:bg-stone-50"
                )}
              >
                {action.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-stone-500 mt-2">
            {incident.status === "FIXED"
              ? "Verifying records who signed off, which is what makes repair times meaningful."
              : "Each move is timestamped."}
          </p>
        </div>
      )}

      {message && (
        <div className="border border-teal-200 bg-teal-50 rounded-lg px-3 py-2 text-sm text-teal-900">
          {message}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------

export default function IncidentsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-6xl">
          <h1 className="text-2xl font-bold font-display mb-1">Maintenance Incidents</h1>
          <p className="text-stone-400">Loading incidents...</p>
        </div>
      }
    >
      <IncidentsContent />
    </Suspense>
  );
}

function IncidentsContent() {
  const searchParams = useSearchParams();
  const focusId = searchParams.get("focus");

  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(focusId);
  const [status, setStatus] = useState("OPEN_ALL");
  const [area, setArea] = useState("ALL");
  const [assignee, setAssignee] = useState("ALL");
  const [search, setSearch] = useState("");

  const load = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({ status, area, assignee });
      const res = await fetch(`/api/admin/incidents?${params}`);
      if (!res.ok) throw new Error("Could not load incidents.");
      const payload: Payload = await res.json();
      setData(payload);
      setSelectedId((current) => {
        if (current && payload.incidents.some((i) => i.id === current)) return current;
        return focusId && payload.incidents.some((i) => i.id === focusId)
          ? focusId
          : payload.incidents[0]?.id ?? null;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load incidents.");
    } finally {
      setLoading(false);
    }
  }, [status, area, assignee, focusId]);

  useEffect(() => {
    load();
  }, [load]);

  const visible = useMemo(() => {
    if (!data) return [];
    const term = search.trim().toLowerCase();
    return data.incidents
      .filter((i) => !term || i.title.toLowerCase().includes(term) || i.rule.key.includes(term))
      .sort((a, b) => {
        const openDiff =
          (a.status === "CLOSED" ? 1 : 0) - (b.status === "CLOSED" ? 1 : 0);
        if (openDiff !== 0) return openDiff;
        return (
          severityRank(a.severity) - severityRank(b.severity) ||
          new Date(b.openedAt).getTime() - new Date(a.openedAt).getTime()
        );
      });
  }, [data, search]);

  const selected = visible.find((i) => i.id === selectedId) ?? visible[0] ?? null;

  function exportIncidents() {
    if (!data) return;
    const rows = data.incidents.map((i) => ({
      id: i.id,
      title: i.title,
      rule: i.rule.key,
      area: i.rule.area,
      severity: i.severity,
      status: i.status,
      opened_at: i.openedAt,
      opened_value: i.openedValue,
      peak_value: i.peakValue,
      assignee: personName(i.assignee),
      verified_by: i.verifiedBy ? personName(i.verifiedBy) : "",
      fixed_at: i.fixedAt ?? "",
      resolved_at: i.resolvedAt ?? "",
      closed_at: i.closedAt ?? "",
      auto_fix_applied: i.autoFixApplied,
      root_cause: i.rootCause ?? "",
    }));
    if (rows.length === 0) return;
    downloadCsv(`curalink-incidents-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  if (loading) return <LoadingBlock label="Loading work orders..." />;
  if (error && !data) return <ErrorBlock message={error} onRetry={load} />;
  if (!data) return <ErrorBlock message="No incident data." onRetry={load} />;

  const openCount = Object.entries(data.statusCounts)
    .filter(([key]) => key !== "CLOSED")
    .reduce((sum, [, n]) => sum + n, 0);

  return (
    <div>
      <PageHeader
        title="Incidents"
        subtitle="Work orders opened automatically when a standing check breaches. Nothing closes without someone verifying the fix."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportIncidents}
              className="flex items-center gap-1.5 text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 bg-white hover:bg-stone-50 transition-colors"
            >
              <Download size={15} /> Export CSV
            </button>
            <button
              onClick={load}
              className="flex items-center gap-1.5 text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 bg-white hover:bg-stone-50 transition-colors"
            >
              <RefreshCw size={15} /> Refresh
            </button>
          </div>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorBlock message={error} />
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Active work orders", value: openCount, tone: "bg-red-50 text-red-800" },
          {
            label: "Awaiting verification",
            value: data.statusCounts.FIXED ?? 0,
            tone: "bg-sky-50 text-sky-800",
          },
          {
            label: "Closed",
            value: data.statusCounts.CLOSED ?? 0,
            tone: "bg-stone-100 text-stone-700",
          },
          {
            label: "Avg. repair (30d)",
            value: formatDuration(data.mttrHours),
            tone: "bg-teal-50 text-teal-900",
          },
        ].map((card) => (
          <div key={card.label} className={classNames("rounded-xl px-4 py-3", card.tone)}>
            <p className="text-2xl font-bold tabular-nums">{card.value}</p>
            <p className="text-xs font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)] gap-6">
        {/* List */}
        <div>
          <div className="flex flex-wrap gap-3 mb-4 items-end">
            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={STATUS_OPTIONS}
            />
            <FilterSelect
              label="Area"
              value={area}
              onChange={setArea}
              options={[
                { value: "ALL", label: "All areas" },
                ...data.areas.map((a) => ({ value: a, label: a })),
              ]}
            />
            <FilterSelect
              label="Assignee"
              value={assignee}
              onChange={setAssignee}
              options={[
                { value: "ALL", label: "Anyone" },
                { value: "unassigned", label: "Unassigned" },
                { value: "me", label: "Mine" },
              ]}
            />
          </div>

          <div className="relative mb-3">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search incidents..."
              className="w-full border border-stone-300 rounded-lg pl-9 pr-3 py-2 text-sm bg-white"
            />
          </div>

          {visible.length === 0 ? (
            <DashboardCard>
              <EmptyState
                title="No incidents here"
                hint={
                  status === "OPEN_ALL"
                    ? "Nothing is currently breaching. That is the good outcome."
                    : "Try widening the filters."
                }
                icon={<Wrench size={28} />}
              />
            </DashboardCard>
          ) : (
            <div className="space-y-2 max-h-[70vh] overflow-y-auto pr-1">
              {visible.map((incident) => (
                <button
                  key={incident.id}
                  onClick={() => setSelectedId(incident.id)}
                  className={classNames(
                    "w-full text-left border rounded-xl px-4 py-3 transition-colors",
                    selected?.id === incident.id
                      ? "border-teal-900 bg-teal-50/60 ring-1 ring-teal-900/20"
                      : "border-stone-200 bg-white hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className={classNames("text-[11px] font-semibold uppercase tracking-wide px-2 py-0.5 rounded-full", incidentStatusClasses(incident.status))}>
                      {incident.status.replace(/_/g, " ").toLowerCase()}
                    </span>
                    <SeverityChip severity={incident.severity} size="xs" />
                    <span className="text-[11px] text-stone-500">{incident.rule.area}</span>
                  </div>
                  <p className="text-sm font-medium text-stone-900 leading-snug">{incident.title}</p>
                  <p className="text-xs text-stone-500 mt-1">
                    opened {formatAge(incident.openedAt)} ago · {personName(incident.assignee)}
                    {incident.rule.lastStatus === "OK" && (
                      <span className="text-teal-700"> · check is clear again</span>
                    )}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Detail */}
        <div>
          {selected ? (
            <DashboardCard>
              <IncidentDetail incident={selected} agents={data.agents} onRefresh={load} />
            </DashboardCard>
          ) : (
            <DashboardCard>
              <EmptyState
                title="Select an incident"
                hint="Pick a work order on the left to see its history and next steps."
                icon={<ShieldCheck size={28} />}
              />
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}
