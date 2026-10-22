"use client";

import { useEffect, useMemo, useState } from "react";
import { AlertTriangle, X, CheckCircle2, Paperclip, Upload } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";
import {
  REPORT_CATEGORIES, reportCategoryLabel, SEVERITY_HELP, severityClasses,
  classNames,
} from "@/lib/formatters";

/**
 * "Report a problem" dialog.
 *
 * Built as a drop-in control so it can be attached to any record in any portal.
 * Three things make it work as a *bug report* rather than a vague complaint:
 *
 *  1. It captures context automatically — the route the user is on, the record
 *     they are looking at, and their viewport/user agent. Asking someone to
 *     describe where they were is how reports die.
 *  2. Severity is phrased in consequences ("blocks me completely"), not in
 *     engineering terms, because the reporter is a patient.
 *  3. It reports back a reference number and promises a reply, so filing one
 *     feels like it went somewhere.
 */

export type ReportVariant = "icon" | "inline" | "card" | "block";

export interface ReportProblemButtonProps {
  /** Machine name of the record being reported, e.g. "Consultation". */
  contextEntity?: string;
  contextEntityId?: string | null;
  defaultCategory?: string;
  defaultTitle?: string;
  /** Prompt shown above the button, used by the card/block variants. */
  label?: string;
  variant?: ReportVariant;
  className?: string;
}

/** Categories offered per role — mirrors the server's allow-list. */
const CATEGORIES_BY_ROLE: Record<string, string[]> = {
  PATIENT: REPORT_CATEGORIES,
  DOCTOR: [
    "BUG_GLITCH",
    "WRONG_INFORMATION",
    "CONSULTATION_PROBLEM",
    "MEDICINE_CATALOG_PROBLEM",
    "PAYMENT_PROBLEM",
    "OTHER",
  ],
  AMBULANCE_PROVIDER: ["BUG_GLITCH", "AMBULANCE_PROBLEM", "WRONG_INFORMATION", "OTHER"],
};

const SEVERITIES = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function ReportProblemButton({
  contextEntity,
  contextEntityId,
  defaultCategory,
  defaultTitle,
  label,
  variant = "icon",
  className,
}: ReportProblemButtonProps) {
  const { account } = useAuth();
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState<number | null>(null);

  const availableCategories = useMemo(() => {
    const role = account?.role ?? "PATIENT";
    return CATEGORIES_BY_ROLE[role] ?? CATEGORIES_BY_ROLE.PATIENT;
  }, [account?.role]);

  const [title, setTitle] = useState(defaultTitle ?? "");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(defaultCategory ?? availableCategories[0]);
  const [severity, setSeverity] = useState<(typeof SEVERITIES)[number]>("MEDIUM");
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Keep the category valid if the role resolves after first render.
  useEffect(() => {
    if (!availableCategories.includes(category)) {
      setCategory(availableCategories[0]);
    }
  }, [availableCategories, category]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    try {
      const payload: Record<string, unknown> = {
        title: title.trim(),
        description: description.trim(),
        category,
        severity,
        contextPath: window.location.pathname + window.location.search,
        contextEntity,
        contextEntityId: contextEntityId ?? undefined,
        browserInfo: `${navigator.userAgent} · ${window.innerWidth}x${window.innerHeight}`,
      };

      if (file) {
        payload.attachmentBase64 = await fileToBase64(file);
      }

      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "We couldn't send that. Please try again.");
        return;
      }

      setSubmitted(data.reference);
    } catch {
      setError("We couldn't send that. Please check your connection and try again.");
    } finally {
      setBusy(false);
    }
  }

  function close() {
    setOpen(false);
    // Reset only after the dialog is out of sight, so the success state does not
    // flash the empty form on the way out.
    setTimeout(() => {
      setSubmitted(null);
      setDescription("");
      setFile(null);
      setError(null);
      setSeverity("MEDIUM");
      setTitle(defaultTitle ?? "");
    }, 200);
  }

  const triggerClass =
    variant === "inline"
      ? "text-xs font-semibold text-stone-500 hover:text-stone-900 underline underline-offset-2"
      : variant === "card"
        ? "w-full flex items-center gap-2 border border-stone-200 rounded-xl px-4 py-3 bg-white hover:bg-stone-50 text-sm font-medium text-stone-700 transition-colors"
        : variant === "block"
          ? "w-full flex items-center justify-center gap-2 border border-dashed border-stone-300 rounded-xl px-4 py-3 bg-stone-50 hover:bg-stone-100 text-sm font-medium text-stone-600 transition-colors"
          : "flex items-center gap-1.5 text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors";

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={classNames(triggerClass, className)}
        title="Report a problem with this"
      >
        <AlertTriangle size={variant === "icon" ? 13 : 15} />
        {variant === "icon" ? "Report a problem" : (label ?? "Report a problem")}
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center bg-stone-900/40 p-4 overflow-y-auto"
          onClick={close}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-lg my-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-start justify-between px-5 py-4 border-b border-stone-100">
              <div>
                <h2 className="font-semibold text-stone-900">
                  {submitted ? "Report sent" : "Report a problem"}
                </h2>
                {!submitted && (
                  <p className="text-xs text-stone-500 mt-0.5">
                    Tell us what went wrong. We&apos;ll email you when there&apos;s an update.
                  </p>
                )}
              </div>
              <button
                onClick={close}
                className="text-stone-400 hover:text-stone-700 transition-colors"
                aria-label="Close"
              >
                <X size={18} />
              </button>
            </div>

            {submitted ? (
              <div className="px-5 py-8 text-center">
                <CheckCircle2 size={40} className="mx-auto text-teal-800 mb-3" />
                <p className="font-medium text-stone-900">
                  Thanks — your report is #{submitted}
                </p>
                <p className="text-sm text-stone-600 mt-2 max-w-sm mx-auto">
                  Our team reviews every report. We&apos;ve emailed you a confirmation, and
                  you&apos;ll hear from us as soon as there&apos;s news. You can follow the thread
                  from your reports page.
                </p>
                <button
                  onClick={close}
                  className="mt-5 bg-teal-950 hover:bg-teal-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full transition-colors"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="px-5 py-4 space-y-4 max-h-[70vh] overflow-y-auto">
                {/* What was captured automatically, shown so the user can see we
                    know where they are — and so they do not feel they have to
                    re-explain it. */}
                {contextEntity && (
                  <div className="bg-stone-50 border border-stone-200 rounded-xl px-3 py-2">
                    <p className="text-[11px] uppercase tracking-wide text-stone-500 font-semibold">
                      We&apos;ll include automatically
                    </p>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {contextEntity} reference and the page you&apos;re on
                      {contextEntityId ? ` (${contextEntityId.slice(0, 8)}…)` : ""}
                    </p>
                  </div>
                )}

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-stone-700">
                    What went wrong?
                  </span>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    minLength={5}
                    maxLength={150}
                    placeholder="Short summary, e.g. “Prescription won't open”"
                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-stone-700">
                    Tell us more
                  </span>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    required
                    minLength={10}
                    maxLength={5000}
                    rows={4}
                    placeholder="What did you expect to happen, and what happened instead?"
                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900"
                  />
                </label>

                <label className="flex flex-col gap-1">
                  <span className="text-xs font-semibold text-stone-700">
                    What kind of problem is it?
                  </span>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white"
                  >
                    {availableCategories.map((value) => (
                      <option key={value} value={value}>
                        {reportCategoryLabel(value)}
                      </option>
                    ))}
                  </select>
                </label>

                <div>
                  <span className="text-xs font-semibold text-stone-700">
                    How much is it affecting you?
                  </span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    {SEVERITIES.map((value) => (
                      <button
                        key={value}
                        type="button"
                        onClick={() => setSeverity(value)}
                        className={classNames(
                          "text-left rounded-xl px-3 py-2 border transition-colors",
                          severity === value
                            ? "border-teal-900 ring-1 ring-teal-900/20 bg-teal-50/50"
                            : "border-stone-200 hover:bg-stone-50"
                        )}
                      >
                        <span
                          className={classNames(
                            "inline-block text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded",
                            severityClasses(value)
                          )}
                        >
                          {value}
                        </span>
                        <span className="block text-[11px] text-stone-600 mt-1 leading-snug">
                          {SEVERITY_HELP[value]}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-xs font-semibold text-stone-700">
                    Screenshot (optional)
                  </span>
                  <label className="mt-1.5 flex items-center gap-2 border border-dashed border-stone-300 rounded-xl px-3 py-2.5 cursor-pointer hover:bg-stone-50 transition-colors">
                    <Upload size={15} className="text-stone-400" />
                    <span className="text-sm text-stone-600 truncate">
                      {file ? file.name : "Attach a screenshot or file"}
                    </span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      className="hidden"
                      onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                    />
                  </label>
                  <p className="text-[11px] text-stone-500 mt-1">
                    A picture of the problem saves us a lot of guessing.
                  </p>
                </div>

                {error && (
                  <div className="border border-red-200 bg-red-50 rounded-lg px-3 py-2 text-sm text-red-800">
                    {error}
                  </div>
                )}

                <div className="flex items-center justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={close}
                    className="text-sm font-semibold text-stone-600 hover:text-stone-900 px-3 py-2"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={busy || title.trim().length < 5 || description.trim().length < 10}
                    className="flex items-center gap-1.5 bg-teal-950 hover:bg-teal-900 text-white text-sm font-semibold px-4 py-2 rounded-full transition-colors disabled:opacity-50"
                  >
                    {file && <Paperclip size={13} />}
                    {busy ? "Sending..." : "Send report"}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
