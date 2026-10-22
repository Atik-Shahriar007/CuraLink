"use client";

import { useCallback, useEffect, useState } from "react";
import { AlertTriangle, Plus, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";
import ReportProblemButton from "@/app/components/ReportProblemButton";
import {
  PageHeader, LoadingBlock, ErrorBlock, EmptyState, ReportStatusChip, SeverityChip,
} from "@/app/components/ops/OpsPrimitives";
import {
  formatAge, formatDateTime, reportCategoryLabel, classNames,
} from "@/lib/formatters";

/**
 * "My reports" — the reporter's side of the problem-reporting flow.
 *
 * The reason this page exists rather than just a dialog: a report a user never
 * hears back about is worse than no button at all. Showing the status, the
 * team's replies, and the resolution note is what makes people bother reporting
 * the next problem instead of quietly leaving.
 */

interface ReportEvent {
  id: string;
  kind: string;
  body: string;
  fromValue: string | null;
  toValue: string | null;
  createdAt: string;
  author: { id: string; firstName: string | null; lastName: string | null; role: string };
}

interface ReportThread {
  id: string;
  reference: number;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  resolutionNote: string | null;
  createdAt: string;
  updatedAt: string;
  resolvedAt: string | null;
  contextPath: string | null;
  attachmentUrl: string | null;
  events: ReportEvent[];
  context: { label: string; href: string | null } | null;
}

interface ReportRow {
  id: string;
  reference: number;
  title: string;
  category: string;
  severity: string;
  status: string;
  createdAt: string;
  updatedAt: string;
  resolutionNote: string | null;
  contextPath: string | null;
  _count: { events: number };
}

function ReportThreadCard({ reportId, onReplied }: { reportId: string; onReplied: () => Promise<void> }) {
  const [thread, setThread] = useState<ReportThread | null>(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (res.ok) setThread(await res.json());
    } finally {
      setLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    load();
  }, [load]);

  async function reply() {
    if (!comment.trim()) return;
    setPosting(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/reports/${reportId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: comment }),
      });
      if (res.ok) {
        setComment("");
        await load();
        await onReplied();
      } else {
        const data = await res.json();
        setNotice(data.error ?? "Could not send that reply.");
      }
    } catch {
      setNotice("Could not send that reply — please check your connection.");
    } finally {
      setPosting(false);
    }
  }

  if (loading) return <p className="text-sm text-stone-500 py-4">Loading thread...</p>;
  if (!thread) return <p className="text-sm text-red-700 py-4">Could not load this report.</p>;

  const isClosed = thread.status === "RESOLVED" || thread.status === "DISMISSED";

  return (
    <div className="space-y-3 pt-3">
      {thread.context && (
        <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
            This report is about
          </p>
          <p className="text-sm text-stone-700 mt-0.5">{thread.context.label}</p>
        </div>
      )}

      {thread.resolutionNote && isClosed && (
        <div className="border border-teal-200 bg-teal-50 rounded-xl px-3 py-2.5">
          <p className="text-[11px] uppercase tracking-wide text-teal-800 font-semibold">
            What we did
          </p>
          <p className="text-sm text-teal-900 mt-1 whitespace-pre-wrap">
            {thread.resolutionNote}
          </p>
        </div>
      )}

      <div className="space-y-2.5">
        {thread.events.map((event) => {
          const fromStaff =
            event.author.role === "ADMIN" || event.author.role === "SUPPORT_AGENT";
          const isSystem = event.kind !== "COMMENT";

          return (
            <div
              key={event.id}
              className={classNames(
                "rounded-xl px-3 py-2.5",
                isSystem
                  ? "bg-stone-50 border border-stone-200"
                  : fromStaff
                    ? "bg-teal-50 border border-teal-100"
                    : "bg-white border border-stone-200"
              )}
            >
              <div className="flex items-center justify-between gap-2 mb-1">
                <span className="text-xs font-semibold text-stone-700">
                  {isSystem ? "Update" : fromStaff ? "CuraLink team" : "You"}
                </span>
                <span className="text-[11px] text-stone-400">
                  {formatDateTime(event.createdAt)}
                </span>
              </div>
              <p className="text-sm text-stone-700 whitespace-pre-wrap leading-relaxed">
                {event.body}
              </p>
            </div>
          );
        })}
      </div>

      <div>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
          placeholder={
            isClosed
              ? "Still having this problem? Reply and we'll reopen it..."
              : "Add anything that might help..."
          }
          className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-y"
        />
        <div className="flex items-center justify-between mt-2">
          <p className="text-[11px] text-stone-500">
            {isClosed
              ? "Replying reopens this report."
              : "We'll email you when the team replies."}
          </p>
          <button
            onClick={reply}
            disabled={posting || !comment.trim()}
            className="bg-teal-950 hover:bg-teal-900 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
          >
            {posting ? "Sending..." : "Send"}
          </button>
        </div>
        {notice && (
          <p className="text-xs text-red-700 mt-2">{notice}</p>
        )}
      </div>
    </div>
  );
}

export default function MyReportsPage() {
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      const res = await fetch("/api/reports");
      if (!res.ok) throw new Error("Could not load your reports.");
      const data = await res.json();
      setReports(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load your reports.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  if (loading) return <LoadingBlock label="Loading your reports..." />;

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Report a Problem"
        subtitle="Found something wrong? Tell us what you were doing and we'll look into it. Every report is read by a person."
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={load}
              className="flex items-center gap-1.5 text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 bg-white hover:bg-stone-50 transition-colors"
            >
              <RefreshCw size={15} /> Refresh
            </button>
            <ReportProblemButton
              variant="card"
              className="!w-auto"
              label="New report"
              defaultCategory="OTHER"
            />
          </div>
        }
      />

      {error && (
        <div className="mb-4">
          <ErrorBlock message={error} onRetry={load} />
        </div>
      )}

      {reports.length === 0 ? (
        <DashboardCard>
          <EmptyState
            title="You haven't reported anything yet"
            hint="If a page breaks, a payment looks wrong, or your prescription has the wrong medicine on it — report it here and it goes straight to our team."
            icon={<AlertTriangle size={28} />}
          />
        </DashboardCard>
      ) : (
        <div className="space-y-3">
          {reports.map((report) => {
            const open = openId === report.id;
            return (
              <div
                key={report.id}
                className={classNames(
                  "border rounded-2xl bg-white overflow-hidden",
                  open ? "border-teal-900" : "border-stone-200"
                )}
              >
                <button
                  onClick={() => setOpenId(open ? null : report.id)}
                  className="w-full text-left px-4 py-3.5 hover:bg-stone-50 transition-colors"
                >
                  <div className="flex items-start gap-3">
                    <span className="mt-1 text-stone-400 shrink-0">
                      {open ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-bold text-stone-400">
                          #{report.reference}
                        </span>
                        <ReportStatusChip status={report.status} />
                        <SeverityChip severity={report.severity} size="xs" />
                      </div>
                      <p className="font-medium text-stone-900 text-sm leading-snug">
                        {report.title}
                      </p>
                      <p className="text-xs text-stone-500 mt-1">
                        {reportCategoryLabel(report.category)} · filed {formatAge(report.createdAt)}{" "}
                        ago · {report._count.events} message
                        {report._count.events === 1 ? "" : "s"}
                        {report.updatedAt !== report.createdAt &&
                          ` · updated ${formatAge(report.updatedAt)} ago`}
                      </p>
                    </div>
                  </div>
                </button>

                {open && (
                  <div className="border-t border-stone-100 px-4 pb-4 bg-stone-50/50">
                    <ReportThreadCard reportId={report.id} onReplied={load} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 border border-stone-200 rounded-2xl bg-white p-5">
        <p className="font-semibold text-stone-900 text-sm flex items-center gap-2">
          <Plus size={15} /> Not sure what to report?
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-stone-600 list-disc pl-5">
          <li>A page that won&apos;t load, or a button that does nothing.</li>
          <li>Medicine information that looks wrong — this one matters most.</li>
          <li>A payment that went through but no consultation appeared.</li>
          <li>Someone else&apos;s record showing up in your account.</li>
        </ul>
        <p className="text-xs text-stone-500 mt-3">
          The CuraLink team reads every report and will email you when there&apos;s news.
        </p>
      </div>
    </div>
  );
}
