"use client";

import { ReactNode } from "react";
import {
  SeverityKey,
  SEVERITY_LABELS,
  severityClasses,
  INCIDENT_STATUS_LABELS,
  REPORT_STATUS_LABELS,
  RULE_STATUS_LABELS,
  incidentStatusClasses,
  reportStatusClasses,
  ruleStatusClasses,
  classNames,
} from "@/lib/formatters";

/**
 * Status and severity chips, plus the filter bar controls the three operations
 * consoles share. Centralised so "Breached" looks identical on the health page
 * and in an incident row — an operator moving between them should never have to
 * re-learn what a colour means.
 */

// ---------------------------------------------------------------------------
// Chips
// ---------------------------------------------------------------------------

export function SeverityChip({
  severity,
  size = "sm",
}: {
  severity: string;
  size?: "sm" | "xs";
}) {
  const label = SEVERITY_LABELS[severity as SeverityKey] ?? severity;
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full font-semibold whitespace-nowrap",
        severityClasses(severity),
        size === "xs" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-xs"
      )}
    >
      {label}
    </span>
  );
}

export function RuleStatusChip({ status }: { status: string | null }) {
  const key = status ?? "OK";
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        ruleStatusClasses(key)
      )}
    >
      {RULE_STATUS_LABELS[key as keyof typeof RULE_STATUS_LABELS] ?? key}
    </span>
  );
}

export function IncidentStatusChip({ status }: { status: string }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        incidentStatusClasses(status)
      )}
    >
      {INCIDENT_STATUS_LABELS[status as keyof typeof INCIDENT_STATUS_LABELS] ?? status}
    </span>
  );
}

export function ReportStatusChip({ status }: { status: string }) {
  return (
    <span
      className={classNames(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap",
        reportStatusClasses(status)
      )}
    >
      {REPORT_STATUS_LABELS[status as keyof typeof REPORT_STATUS_LABELS] ?? status}
    </span>
  );
}

// ---------------------------------------------------------------------------
// Page furniture
// ---------------------------------------------------------------------------

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-stone-900">{title}</h1>
        {subtitle && <p className="text-stone-500 mt-1 text-sm">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function EmptyState({
  title,
  hint,
  icon,
}: {
  title: string;
  hint?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="text-center py-10 px-4">
      {icon && <div className="flex justify-center mb-3 text-stone-300">{icon}</div>}
      <p className="font-medium text-stone-700">{title}</p>
      {hint && <p className="text-sm text-stone-500 mt-1 max-w-md mx-auto">{hint}</p>}
    </div>
  );
}

export function LoadingBlock({ label = "Loading..." }: { label?: string }) {
  return (
    <div className="flex items-center gap-3 text-stone-500 py-10">
      <span className="w-4 h-4 border-2 border-stone-300 border-t-teal-900 rounded-full animate-spin" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function ErrorBlock({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="border border-red-200 bg-red-50 rounded-2xl p-5">
      <p className="font-medium text-red-800 text-sm">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 text-sm font-semibold text-red-800 underline hover:no-underline"
        >
          Try again
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Filter controls
// ---------------------------------------------------------------------------

export interface SelectOption {
  value: string;
  label: string;
}

export function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
}) {
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white text-stone-800 focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Search...",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="flex flex-col gap-1 flex-1 min-w-[180px]">
      <span className="text-[11px] font-semibold uppercase tracking-wide text-stone-500">
        Search
      </span>
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="border border-stone-300 rounded-lg px-3 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-900/20 focus:border-teal-900"
      />
    </label>
  );
}
