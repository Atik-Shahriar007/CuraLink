"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Inbox, AlertOctagon, Download, RefreshCw, Layers, ChevronLeft, ChevronRight,
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";
import ReportDetailDrawer from "@/app/components/ops/ReportDetailDrawer";
import {
  PageHeader, LoadingBlock, ErrorBlock, EmptyState, SeverityChip, ReportStatusChip,
  FilterSelect, SearchInput,
} from "@/app/components/ops/OpsPrimitives";
import {
  REPORT_CATEGORIES, reportCategoryLabel, REPORT_STATUS_LABELS, formatAge,
  toCsv, downloadCsv, classNames,
} from "@/lib/formatters";

/**
 * Report triage inbox.
 *
 * Read alongside the System Health console: reports are what users noticed, the
 * health checks are what we noticed about ourselves. The overlap — reports
 * clustering on a record that a check is also flagging — is where the real
 * problems are, which is why the cluster banner sits above the list.
 */

interface ReportRow {
  id: string;
  reference: number;
  title: string;
  category: string;
  severity: string;
  status: string;
  source: string;
  createdAt: string;
  updatedAt: string;
  contextPath: string | null;
  reporter: { firstName: string | null; lastName: string | null; email: string; role: string };
  assignedTo: { id: string; firstName: string | null; lastName: string | null } | null;
  _count: { events: number };
  context: { label: string; href: string | null } | null;
}

interface Cluster {
  contextEntity: string | null;
  contextEntityId: string | null;
  label: string;
  href: string | null;
  count: number;
  severity: string;
  latestAt: string;
  reportIds: string[];
}

interface Payload {
  reports: ReportRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  counts: { unassigned: number; newCount: number; investigating: number; resolvedThisWeek: number };
  clusters: Cluster[];
  agents: Array<{ id: string; firstName: string | null; lastName: string | null; email: string; role: string }>;
}

function personName(p: { firstName: string | null; lastName: string | null } | null): string {
  if (!p) return "Unassigned";
  return [p.firstName, p.lastName].filter(Boolean).join(" ") || "Unnamed";
}

export default function AdminReportsPage() {
  const [data, setData] = useState<Payload | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [status, setStatus] = useState("ALL");
  const [severity, setSeverity] = useState("ALL");
  const [category, setCategory] = useState("ALL");
  const [source, setSource] = useState("ALL");
  const [assignee, setAssignee] = useState("ALL");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  const load = useCallback(async () => {
    try {
      setError(null);
      const params = new URLSearchParams({
        status,
        severity,
        category,
        source,
        assignee,
        page: String(page),
      });
      if (search.trim()) params.set("search", search.trim());

      const res = await fetch(`/api/admin/reports?${params}`);
      if (!res.ok) throw new Error("Could not load reports.");
      setData(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load reports.");
    } finally {
      setLoading(false);
    }
  }, [status, severity, category, source, assignee, search, page]);

  useEffect(() => {
    load();
  }, [load]);

  // Any filter change invalidates the page number; staying on page 5 of a
  // 2-page result shows an empty list and reads as a bug.
  useEffect(() => {
    setPage(1);
  }, [status, severity, category, source, assignee, search]);

  const activeFilterCount = useMemo(
    () =>
      [status, severity, category, source, assignee].filter((v) => v !== "ALL").length +
      (search.trim() ? 1 : 0),
    [status, severity, category, source, assignee, search]
  );

  function exportReports() {
    if (!data) return;
    const rows = data.reports.map((r) => ({
      reference: r.reference,
      title: r.title,
      category: r.category,
      severity: r.severity,
      status: r.status,
      source: r.source,
      reporter: `${personName(r.reporter)} <${r.reporter.email}>`,
      reporter_role: r.reporter.role,
      assigned_to: personName(r.assignedTo),
      context: r.context?.label ?? "",
      context_path: r.contextPath ?? "",
      filed_at: r.createdAt,
      comments: r._count.events,
    }));
    if (rows.length === 0) return;
    downloadCsv(`curalink-reports-${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
  }

  if (loading && !data) return <LoadingBlock label="Loading reports..." />;
  if (error && !data) return <ErrorBlock message={error} onRetry={load} />;
  if (!data) return <ErrorBlock message="No report data." onRetry={load} />;

  const { counts, clusters } = data;

  return (
    <div>
      <PageHeader
        title="Problem Reports"
        subtitle="Things users told us were wrong, with the page and record they were on. Health checks catch what we notice ourselves; these catch the rest."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={exportReports}
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

      {/* Counts */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Untriaged", value: counts.newCount, tone: "bg-red-50 text-red-800" },
          { label: "Unassigned", value: counts.unassigned, tone: "bg-amber-50 text-amber-800" },
          { label: "Investigating", value: counts.investigating, tone: "bg-sky-50 text-sky-800" },
          {
            label: "Resolved this week",
            value: counts.resolvedThisWeek,
            tone: "bg-teal-50 text-teal-900",
          },
        ].map((card) => (
          <div key={card.label} className={classNames("rounded-xl px-4 py-3", card.tone)}>
            <p className="text-2xl font-bold tabular-nums">{card.value}</p>
            <p className="text-xs font-medium">{card.label}</p>
          </div>
        ))}
      </div>

      {/* Repeat-report clusters — the highest-signal thing on the page. */}
      {clusters.length > 0 && (
        <div className="mb-6 border border-red-200 bg-red-50 rounded-2xl p-4">
          <p className="text-sm font-semibold text-red-900 flex items-center gap-2">
            <Layers size={15} />
            The same record was reported by several people in the last 7 days
          </p>
          <p className="text-xs text-red-800 mt-1">
            One complaint is an anecdote. Several on the same record is almost always a real bug.
          </p>
          <div className="space-y-2 mt-3">
            {clusters.map((cluster) => (
              <div
                key={`${cluster.contextEntity}-${cluster.contextEntityId}`}
                className="flex items-center justify-between gap-3 bg-white border border-red-200 rounded-xl px-3 py-2.5"
              >
                <div className="min-w-0">
                  <p className="text-sm text-stone-900 truncate">{cluster.label}</p>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {cluster.count} reports · latest {formatAge(cluster.latestAt)} ago
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <SeverityChip severity={cluster.severity} size="xs" />
                  {cluster.href && (
                    <Link
                      href={cluster.href}
                      target="_blank"
                      className="text-xs font-semibold text-red-900 underline hover:no-underline whitespace-nowrap"
                    >
                      Open record
                    </Link>
                  )}
                  <button
                    onClick={() => setSelectedId(cluster.reportIds[0])}
                    className="text-xs font-semibold text-red-900 underline hover:no-underline whitespace-nowrap"
                  >
                    Review
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)] gap-6">
        {/* List */}
        <div>
          <div className="flex flex-wrap gap-3 mb-3 items-end">
            <FilterSelect
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "ALL", label: "Any status" },
                ...Object.entries(REPORT_STATUS_LABELS).map(([value, label]) => ({ value, label })),
              ]}
            />
            <FilterSelect
              label="Severity"
              value={severity}
              onChange={setSeverity}
              options={[
                { value: "ALL", label: "Any severity" },
                { value: "CRITICAL", label: "Critical" },
                { value: "HIGH", label: "High" },
                { value: "MEDIUM", label: "Medium" },
                { value: "LOW", label: "Low" },
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
            <FilterSelect
              label="Source"
              value={source}
              onChange={setSource}
              options={[
                { value: "ALL", label: "All sources" },
                { value: "PATIENT", label: "Patients" },
                { value: "DOCTOR", label: "Doctors" },
                { value: "PROVIDER", label: "Providers" },
              ]}
            />
          </div>

          <div className="flex flex-wrap gap-3 mb-4 items-end">
            <FilterSelect
              label="Category"
              value={category}
              onChange={setCategory}
              options={[
                { value: "ALL", label: "All categories" },
                ...REPORT_CATEGORIES.map((c) => ({ value: c, label: reportCategoryLabel(c) })),
              ]}
            />
            <SearchInput
              value={search}
              onChange={setSearch}
              placeholder="Title, description, path, or email..."
            />
          </div>

          {data.reports.length === 0 ? (
            <DashboardCard>
              <EmptyState
                title={activeFilterCount > 0 ? "No reports match these filters" : "No reports yet"}
                hint={
                  activeFilterCount > 0
                    ? "Try clearing a filter."
                    : "Reports filed from the patient, doctor, and provider portals land here."
                }
                icon={<Inbox size={28} />}
              />
            </DashboardCard>
          ) : (
            <div className="space-y-2">
              {data.reports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedId(report.id)}
                  className={classNames(
                    "w-full text-left border rounded-xl px-4 py-3 transition-colors",
                    selectedId === report.id
                      ? "border-teal-900 bg-teal-50/60 ring-1 ring-teal-900/20"
                      : report.severity === "CRITICAL" && report.status === "NEW"
                        ? "border-red-200 bg-red-50/40 hover:bg-red-50"
                        : "border-stone-200 bg-white hover:bg-stone-50"
                  )}
                >
                  <div className="flex items-center gap-2 flex-wrap mb-1">
                    <span className="text-[11px] font-bold text-stone-400">
                      #{report.reference}
                    </span>
                    <ReportStatusChip status={report.status} />
                    <SeverityChip severity={report.severity} size="xs" />
                    <span className="text-[11px] text-stone-500">
                      {report.reporter.role.toLowerCase()}
                    </span>
                  </div>
                  <p className="text-sm font-medium text-stone-900 leading-snug">{report.title}</p>
                  <p className="text-xs text-stone-500 mt-1 truncate">
                    {report.context?.label ?? reportCategoryLabel(report.category)}
                  </p>
                  <p className="text-xs text-stone-400 mt-1">
                    {formatAge(report.createdAt)} ago · {personName(report.assignedTo)} ·{" "}
                    {report._count.events} message{report._count.events === 1 ? "" : "s"}
                  </p>
                </button>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data.totalPages > 1 && (
            <div className="flex items-center justify-between mt-4">
              <p className="text-xs text-stone-500">
                {data.total} report{data.total === 1 ? "" : "s"} · page {data.page} of{" "}
                {data.totalPages}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.page <= 1}
                  className="p-1.5 rounded-lg border border-stone-300 bg-white disabled:opacity-40 hover:bg-stone-50"
                  aria-label="Previous page"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={data.page >= data.totalPages}
                  className="p-1.5 rounded-lg border border-stone-300 bg-white disabled:opacity-40 hover:bg-stone-50"
                  aria-label="Next page"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Drawer */}
        <div>
          {selectedId ? (
            <ReportDetailDrawer
              reportId={selectedId}
              agents={data.agents}
              onClose={() => setSelectedId(null)}
              onChanged={load}
            />
          ) : (
            <DashboardCard>
              <EmptyState
                title="Select a report"
                hint="Pick a report on the left to see where it came from, what the user saw, and to triage it."
                icon={<AlertOctagon size={28} />}
              />
            </DashboardCard>
          )}
        </div>
      </div>
    </div>
  );
}
