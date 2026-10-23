"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ExternalLink, Send, Paperclip, TicketCheck, X } from "lucide-react";
import {
  SeverityChip, ReportStatusChip,
} from "@/app/components/ops/OpsPrimitives";
import {
  formatDateTime, formatRelative, reportCategoryLabel, ISSUE_SOURCE_LABELS, classNames,
} from "@/lib/formatters";

/**
 * Triage drawer for a single report.
 *
 * The layout is deliberate: what the user saw and where they were comes first,
 * the conversation second, and the triage controls last. An admin opening this
 * should be able to decide what happened before touching anything.
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

interface ReportDetail {
  id: string;
  reference: number;
  title: string;
  description: string;
  category: string;
  severity: string;
  status: string;
  source: string;
  contextPath: string | null;
  contextEntity: string | null;
  contextEntityId: string | null;
  browserInfo: string | null;
  attachmentUrl: string | null;
  resolutionNote: string | null;
  createdAt: string;
  resolvedAt: string | null;
  reporter: {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string;
    role: string;
    phone?: string | null;
  };
  assignedTo: { id: string; firstName: string | null; lastName: string | null } | null;
  events: ReportEvent[];
  context: { label: string; href: string | null } | null;
}

interface Agent {
  id: string;
  firstName: string | null;
  lastName: string | null;
  email: string;
  role: string;
}

const STATUS_OPTIONS = [
  { value: "ACKNOWLEDGED", label: "Seen — we're looking at it" },
  { value: "INVESTIGATING", label: "Investigating" },
  { value: "RESOLVED", label: "Resolved" },
  { value: "DISMISSED", label: "Close without action" },
];

function personName(p: { firstName: string | null; lastName: string | null } | null): string {
  if (!p) return "Unassigned";
  return [p.firstName, p.lastName].filter(Boolean).join(" ") || "Unnamed";
}

export default function ReportDetailDrawer({
  reportId,
  agents,
  onClose,
  onChanged,
}: {
  reportId: string;
  agents: Agent[];
  onClose: () => void;
  onChanged: () => Promise<void>;
}) {
  const [report, setReport] = useState<ReportDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [comment, setComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [resolutionNote, setResolutionNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function load() {
    setLoading(true);
    try {
      const res = await fetch(`/api/reports/${reportId}`);
      if (!res.ok) throw new Error("Could not load this report.");
      setReport(await res.json());
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not load this report.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reportId]);

  async function postComment() {
    if (!comment.trim()) return;
    setPosting(true);
    try {
      const res = await fetch(`/api/reports/${reportId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body: comment }),
      });
      if (res.ok) {
        setComment("");
        await load();
        await onChanged();
      } else {
        const data = await res.json();
        setNotice(data.error ?? "Could not post the comment.");
      }
    } finally {
      setPosting(false);
    }
  }

  async function triage(body: Record<string, unknown>, successMessage: string) {
    setBusy(true);
    setNotice(null);
    try {
      const res = await fetch(`/api/reports/${reportId}/triage`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setNotice(data.error ?? "Could not update this report.");
        return;
      }
      setNotice(successMessage);
      setPendingStatus("");
      setResolutionNote("");
      await load();
      await onChanged();
    } catch {
      setNotice("Could not update this report — the request did not complete.");
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return (
      <div className="border border-stone-200 rounded-2xl bg-white p-5">
        <p className="text-stone-500 text-sm">Loading report...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <div className="border border-red-200 bg-red-50 rounded-2xl p-5">
        <p className="text-sm text-red-800">{error ?? "Report unavailable."}</p>
        <button onClick={onClose} className="mt-3 text-sm font-semibold text-red-800 underline">
          Close
        </button>
      </div>
    );
  }

  const isClosed = report.status === "RESOLVED" || report.status === "DISMISSED";
  const needsNote = pendingStatus === "RESOLVED" || pendingStatus === "DISMISSED";

  return (
    <div className="border border-stone-200 rounded-2xl bg-white flex flex-col max-h-[80vh]">
      {/* Header */}
      <div className="px-5 py-4 border-b border-stone-100">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap mb-1.5">
              <span className="text-xs font-bold text-stone-400">#{report.reference}</span>
              <ReportStatusChip status={report.status} />
              <SeverityChip severity={report.severity} size="xs" />
              <span className="text-[11px] text-stone-500">
                {ISSUE_SOURCE_LABELS[report.source] ?? report.source}
              </span>
            </div>
            <h3 className="font-semibold text-stone-900 leading-snug">{report.title}</h3>
            <p className="text-xs text-stone-500 mt-1">
              {personName(report.reporter)} · {report.reporter.email}
              {report.reporter.phone && ` · ${report.reporter.phone}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-stone-700 transition-colors shrink-0"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="overflow-y-auto flex-1 px-5 py-4 space-y-5">
        {/* Where it came from — the single most useful block for triage. */}
        <div className="border border-stone-200 rounded-xl p-3 bg-stone-50">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold mb-1.5">
            Where this happened
          </p>
          {report.context && (
            <div className="flex items-start gap-1.5 mb-1.5">
              <p className="text-sm text-stone-800">{report.context.label}</p>
              {report.context.href && (
                <Link
                  href={report.context.href}
                  target="_blank"
                  className="text-teal-900 hover:text-teal-700 shrink-0 mt-0.5"
                  title="Open the record in a new tab"
                >
                  <ExternalLink size={13} />
                </Link>
              )}
            </div>
          )}
          {report.contextPath && (
            <p className="text-xs text-stone-600 font-mono break-all">{report.contextPath}</p>
          )}
          <p className="text-[11px] text-stone-500 mt-1.5">
            Category: {reportCategoryLabel(report.category)} · filed{" "}
            {formatRelative(report.createdAt)}
          </p>
          {report.browserInfo && (
            <p className="text-[11px] text-stone-400 mt-1 break-all">{report.browserInfo}</p>
          )}
        </div>

        {/* What they said */}
        <div>
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold mb-1.5">
            What they reported
          </p>
          <p className="text-sm text-stone-800 whitespace-pre-wrap leading-relaxed">
            {report.description}
          </p>
          {report.attachmentUrl && (
            <a
              href={report.attachmentUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-900 hover:underline mt-2"
            >
              <Paperclip size={13} /> View attachment
            </a>
          )}
        </div>

        {/* Thread */}
        <div>
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold mb-2">
            History
          </p>
          <div className="space-y-3">
            {report.events.map((event) => {
              const fromStaff =
                event.author.role === "ADMIN" || event.author.role === "SUPPORT_AGENT";
              const isSystemNote = event.kind !== "COMMENT";

              return (
                <div
                  key={event.id}
                  className={classNames(
                    "rounded-xl px-3 py-2.5 text-sm",
                    isSystemNote
                      ? "bg-stone-50 border border-stone-200"
                      : fromStaff
                        ? "bg-teal-50 border border-teal-100"
                        : "bg-white border border-stone-200"
                  )}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-semibold text-stone-700">
                      {isSystemNote
                        ? "System"
                        : `${personName(event.author)}${fromStaff ? " (team)" : ""}`}
                    </span>
                    <span className="text-[11px] text-stone-400">
                      {formatDateTime(event.createdAt)}
                    </span>
                  </div>
                  <p className="text-stone-700 whitespace-pre-wrap leading-relaxed">{event.body}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Reply */}
        <div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
            placeholder="Reply to the reporter, or leave a note for the next person..."
            className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm resize-y"
          />
          <div className="flex items-center justify-between mt-2">
            <p className="text-[11px] text-stone-500">
              First reply assigns this to you and marks it seen.
            </p>
            <button
              onClick={postComment}
              disabled={posting || !comment.trim()}
              className="flex items-center gap-1.5 bg-teal-950 hover:bg-teal-900 text-white text-sm font-semibold px-3 py-1.5 rounded-lg transition-colors disabled:opacity-50"
            >
              <Send size={13} />
              {posting ? "Sending..." : "Send reply"}
            </button>
          </div>
        </div>

        {/* Triage */}
        <div className="border-t border-stone-200 pt-4 space-y-3">
          <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
            Triage
          </p>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-stone-600">Assigned to</span>
            <select
              value={report.assignedTo?.id ?? ""}
              onChange={(e) =>
                triage({ assignedToId: e.target.value || null }, "Assignment updated.")
              }
              disabled={busy}
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

          <div className="flex flex-wrap gap-2">
            <select
              value={report.severity}
              onChange={(e) => triage({ severity: e.target.value }, "Severity updated.")}
              disabled={busy}
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((s) => (
                <option key={s} value={s}>
                  Severity: {s.toLowerCase()}
                </option>
              ))}
            </select>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs text-stone-600">Change status</span>
            <select
              value={pendingStatus}
              onChange={(e) => setPendingStatus(e.target.value)}
              disabled={busy}
              className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              <option value="">Keep as {report.status.toLowerCase()}</option>
              {STATUS_OPTIONS.filter((o) => o.value !== report.status).map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          {needsNote && (
            <label className="flex flex-col gap-1">
              <span className="text-xs text-stone-600">
                What was done (sent to the reporter)
              </span>
              <textarea
                value={resolutionNote}
                onChange={(e) => setResolutionNote(e.target.value)}
                rows={3}
                placeholder="Required — the reporter will read this."
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm resize-y"
              />
            </label>
          )}

          {pendingStatus && (
            <button
              onClick={() =>
                triage(
                  { status: pendingStatus, resolutionNote: resolutionNote || undefined },
                  "Status updated and the reporter notified."
                )
              }
              disabled={busy || (needsNote && !resolutionNote.trim())}
              className="text-sm font-semibold bg-teal-950 hover:bg-teal-900 text-white rounded-lg px-4 py-2 transition-colors disabled:opacity-50"
            >
              {busy ? "Updating..." : "Apply status change"}
            </button>
          )}

          {report.resolutionNote && isClosed && (
            <div className="border border-stone-200 rounded-lg px-3 py-2 bg-stone-50">
              <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
                Resolution
              </p>
              <p className="text-sm text-stone-700 mt-1 whitespace-pre-wrap">
                {report.resolutionNote}
              </p>
            </div>
          )}

          <button
            onClick={() =>
              triage({ convertToTicket: true }, "Escalated to the support queue.")
            }
            disabled={busy}
            className="flex items-center gap-1.5 text-sm font-semibold border border-stone-300 rounded-lg px-3 py-2 bg-white hover:bg-stone-50 transition-colors disabled:opacity-50"
          >
            <TicketCheck size={14} /> Escalate to support queue
          </button>

          {notice && (
            <div className="border border-teal-200 bg-teal-50 rounded-lg px-3 py-2 text-sm text-teal-900">
              {notice}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
