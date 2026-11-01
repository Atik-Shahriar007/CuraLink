"use client";

import { useState, useEffect } from "react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

interface QuickStatBadgeProps {
  current: number;
  previous: number;
  suffix?: string;
  label?: string;
}

export function QuickStatBadge({ current, previous, suffix = "", label }: QuickStatBadgeProps) {
  const diff = previous > 0 ? ((current - previous) / previous) * 100 : 0;
  const isUp = diff > 0;
  const isDown = diff < 0;

  return (
    <span className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-full ${
      isUp ? "bg-green-100 text-green-700" :
      isDown ? "bg-red-100 text-red-700" :
      "bg-stone-100 text-stone-600"
    }`}>
      {isUp ? <TrendingUp size={10} /> : isDown ? <TrendingDown size={10} /> : <Minus size={10} />}
      {Math.abs(diff).toFixed(1)}% {label || (isUp ? "up" : isDown ? "down" : "same")}
    </span>
  );
}

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  color?: string;
}

export function ProgressBar({ value, max, label, color = "bg-teal-600" }: ProgressBarProps) {
  const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0;
  return (
    <div className="w-full">
      {label && <div className="flex justify-between text-xs text-stone-500 mb-1"><span>{label}</span><span>{value}/{max}</span></div>}
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div className={`h-full ${color} rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

interface AvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Avatar({ name, imageUrl, size = "md", className = "" }: AvatarProps) {
  const sizeClass = size === "sm" ? "w-8 h-8 text-xs" : size === "lg" ? "w-14 h-14 text-lg" : "w-10 h-10 text-sm";
  const initials = name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return imageUrl ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={imageUrl} alt={name} className={`${sizeClass} rounded-full object-cover flex-shrink-0 ${className}`} />
  ) : (
    <div className={`${sizeClass} rounded-full bg-teal-100 text-teal-800 font-bold flex items-center justify-center flex-shrink-0 ${className}`}>
      {initials || "?"}
    </div>
  );
}

interface StatusBadgeProps {
  status: string;
}

const statusMap: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-green-100 text-green-700",
  CANCELED: "bg-red-100 text-red-700",
  APPROVED: "bg-green-100 text-green-700",
  REJECTED: "bg-red-100 text-red-700",
  REQUESTED: "bg-yellow-100 text-yellow-800",
  ACCEPTED: "bg-cyan-100 text-cyan-800",
  DISPATCHED: "bg-indigo-100 text-indigo-800",
  ARRIVED: "bg-violet-100 text-violet-800",
  ACTIVE: "bg-green-100 text-green-700",
  INACTIVE: "bg-stone-100 text-stone-600",
  OPEN: "bg-amber-100 text-amber-800",
  RESOLVED: "bg-green-100 text-green-700",
  CLOSED: "bg-stone-100 text-stone-600",
  PAID: "bg-green-100 text-green-700",
  FAILED: "bg-red-100 text-red-700",
  REFUNDED: "bg-purple-100 text-purple-800",
  VERIFIED: "bg-teal-100 text-teal-800",
  UNVERIFIED: "bg-stone-100 text-stone-600",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const color = statusMap[status] || "bg-stone-100 text-stone-600";
  const label = status.replace(/_/g, " ");
  return (
    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${color}`}>
      {label}
    </span>
  );
}

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}

export function EmptyState({ icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      {icon && <div className="mb-4 text-stone-300">{icon}</div>}
      <h3 className="text-base font-semibold text-stone-600 mb-1">{title}</h3>
      {description && <p className="text-sm text-stone-400 max-w-xs mb-4">{description}</p>}
      {action}
    </div>
  );
}

interface LoadingSkeletonProps {
  rows?: number;
  className?: string;
}

export function LoadingSkeleton({ rows = 3, className = "" }: LoadingSkeletonProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="animate-pulse flex gap-3">
          <div className="w-10 h-10 bg-stone-200 rounded-full flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-3 bg-stone-200 rounded w-3/4" />
            <div className="h-3 bg-stone-100 rounded w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}

interface DataTableProps<T> {
  columns: { key: keyof T | string; label: string; render?: (row: T) => React.ReactNode }[];
  data: T[];
  keyField: keyof T;
  emptyMessage?: string;
  loading?: boolean;
}

export function DataTable<T>({ columns, data, keyField, emptyMessage = "No data available", loading }: DataTableProps<T>) {
  if (loading) return <LoadingSkeleton rows={5} />;

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-100">
            {columns.map((col) => (
              <th key={String(col.key)} className="text-left py-3 px-4 text-xs font-medium text-stone-500 uppercase tracking-wide">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className="py-8 text-center text-stone-400 text-sm">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={String(row[keyField])} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                {columns.map((col) => (
                  <td key={String(col.key)} className="py-3 px-4 text-stone-700">
                    {col.render ? col.render(row) : String((row as Record<string, unknown>)[String(col.key)] ?? "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      <button
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
        className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50 transition-colors"
      >
        Previous
      </button>
      <span className="text-sm text-stone-600">
        Page {page} of {totalPages}
      </span>
      <button
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-3 py-1.5 text-sm border border-stone-200 rounded-lg disabled:opacity-40 hover:bg-stone-50 transition-colors"
      >
        Next
      </button>
    </div>
  );
}

export function RatingStars({ rating, max = 5, size = 16 }: { rating: number; max?: number; size?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <svg
          key={i}
          width={size}
          height={size}
          viewBox="0 0 24 24"
          fill={i < Math.round(rating) ? "#F59E0B" : "none"}
          stroke={i < Math.round(rating) ? "#F59E0B" : "#D1D5DB"}
          strokeWidth={2}
        >
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" />
        </svg>
      ))}
    </div>
  );
}
