"use client";

import { useState, useMemo } from "react";
import {
  ClipboardList, Filter, Download, ChevronLeft, ChevronRight, ShieldCheck,
} from "lucide-react";

interface AuditEntry {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  actionType: string;
  target: string;
  details: string;
}

const MOCK_AUDIT_LOG: AuditEntry[] = [
  { id: "1",  timestamp: "2026-10-31T14:32:00Z", admin: "Admin User", action: "APPROVE_DOCTOR",    actionType: "Doctor",    target: "Dr. Sarah Chen",          details: "Approved doctor registration and profile" },
  { id: "2",  timestamp: "2026-10-31T13:15:00Z", admin: "Admin User", action: "REJECT_PROVIDER",   actionType: "Provider",  target: "FastAid Ambulance Co.",    details: "Rejected due to missing license documents" },
  { id: "3",  timestamp: "2026-10-31T11:50:00Z", admin: "Admin User", action: "UPDATE_MEDICINE",   actionType: "Medicine",  target: "Amoxicillin 500mg",        details: "Updated price from $12.00 to $10.50" },
  { id: "4",  timestamp: "2026-10-30T16:45:00Z", admin: "Admin User", action: "DELETE_REVIEW",     actionType: "Review",    target: "Review #4821",             details: "Removed inappropriate review content" },
  { id: "5",  timestamp: "2026-10-30T15:20:00Z", admin: "Admin User", action: "APPROVE_BLOG",      actionType: "Blog",      target: "\"Managing Diabetes\"",     details: "Approved blog post for publication" },
  { id: "6",  timestamp: "2026-10-30T14:10:00Z", admin: "Admin User", action: "APPROVE_DOCTOR",    actionType: "Doctor",    target: "Dr. James Okafor",         details: "Approved doctor after document review" },
  { id: "7",  timestamp: "2026-10-29T10:05:00Z", admin: "Admin User", action: "REJECT_DOCTOR",     actionType: "Doctor",    target: "Dr. Pending User",         details: "Rejected - credentials could not be verified" },
  { id: "8",  timestamp: "2026-10-29T09:30:00Z", admin: "Admin User", action: "APPROVE_PROVIDER",  actionType: "Provider",  target: "City Emergency Services",  details: "Approved after thorough background check" },
  { id: "9",  timestamp: "2026-10-28T17:00:00Z", admin: "Admin User", action: "ADD_MEDICINE",      actionType: "Medicine",  target: "Ibuprofen 200mg",          details: "Added new medicine to the formulary" },
  { id: "10", timestamp: "2026-10-28T16:00:00Z", admin: "Admin User", action: "REJECT_BLOG",       actionType: "Blog",      target: "\"Quick Cures\"",          details: "Rejected - contains unverified medical claims" },
  { id: "11", timestamp: "2026-10-27T13:22:00Z", admin: "Admin User", action: "DELETE_MEDICINE",   actionType: "Medicine",  target: "Expired Supplement XZ",    details: "Removed discontinued product" },
  { id: "12", timestamp: "2026-10-27T11:10:00Z", admin: "Admin User", action: "APPROVE_DOCTOR",    actionType: "Doctor",    target: "Dr. Priya Nair",           details: "Approved after credential verification" },
  { id: "13", timestamp: "2026-10-26T15:45:00Z", admin: "Admin User", action: "UPDATE_MEDICINE",   actionType: "Medicine",  target: "Paracetamol 500mg",        details: "Updated stock quantity and description" },
  { id: "14", timestamp: "2026-10-26T14:00:00Z", admin: "Admin User", action: "APPROVE_BLOG",      actionType: "Blog",      target: "\"Heart Health Tips\"",     details: "Approved post after medical review" },
  { id: "15", timestamp: "2026-10-25T10:30:00Z", admin: "Admin User", action: "REJECT_PROVIDER",   actionType: "Provider",  target: "QuickRide Medical",        details: "Rejected - failed compliance check" },
  { id: "16", timestamp: "2026-10-25T09:00:00Z", admin: "Admin User", action: "APPROVE_PROVIDER",  actionType: "Provider",  target: "MediFleet Solutions",      details: "All documents verified and approved" },
  { id: "17", timestamp: "2026-10-24T16:20:00Z", admin: "Admin User", action: "APPROVE_DOCTOR",    actionType: "Doctor",    target: "Dr. Omar Hassan",          details: "Approved cardiologist profile" },
  { id: "18", timestamp: "2026-10-24T14:55:00Z", admin: "Admin User", action: "DELETE_REVIEW",     actionType: "Review",    target: "Review #3390",             details: "Spam review removed" },
  { id: "19", timestamp: "2026-10-23T11:40:00Z", admin: "Admin User", action: "ADD_MEDICINE",      actionType: "Medicine",  target: "Vitamin D3 1000IU",        details: "Added supplement to catalog" },
  { id: "20", timestamp: "2026-10-23T10:15:00Z", admin: "Admin User", action: "REJECT_BLOG",       actionType: "Blog",      target: "\"Miracle Weight Loss\"",  details: "Rejected - unsubstantiated health claims" },
  { id: "21", timestamp: "2026-10-22T17:10:00Z", admin: "Admin User", action: "APPROVE_BLOG",      actionType: "Blog",      target: "\"Flu Season Guide\"",      details: "Approved for seasonal health section" },
  { id: "22", timestamp: "2026-10-22T15:30:00Z", admin: "Admin User", action: "APPROVE_DOCTOR",    actionType: "Doctor",    target: "Dr. Mei Lin",              details: "Approved pediatrician credentials" },
];

const ACTION_TYPES = ["ALL", "Doctor", "Provider", "Medicine", "Blog", "Review"];

const ACTION_BADGE: Record<string, string> = {
  APPROVE_DOCTOR:   "bg-emerald-100 text-emerald-700",
  REJECT_DOCTOR:    "bg-red-100 text-red-700",
  APPROVE_PROVIDER: "bg-emerald-100 text-emerald-700",
  REJECT_PROVIDER:  "bg-red-100 text-red-700",
  APPROVE_BLOG:     "bg-blue-100 text-blue-700",
  REJECT_BLOG:      "bg-red-100 text-red-700",
  UPDATE_MEDICINE:  "bg-amber-100 text-amber-700",
  ADD_MEDICINE:     "bg-teal-100 text-teal-700",
  DELETE_MEDICINE:  "bg-stone-100 text-stone-600",
  DELETE_REVIEW:    "bg-stone-100 text-stone-600",
};

const PAGE_SIZE = 10;

function formatAction(action: string) {
  return action.replace(/_/g, " ");
}

export default function AuditLogPage() {
  const [filterType, setFilterType] = useState("ALL");
  const [filterDate, setFilterDate] = useState("");
  const [page, setPage] = useState(1);

  const filtered = useMemo(() => {
    return MOCK_AUDIT_LOG.filter((entry) => {
      const typeMatch = filterType === "ALL" || entry.actionType === filterType;
      const dateMatch = !filterDate || entry.timestamp.startsWith(filterDate);
      return typeMatch && dateMatch;
    });
  }, [filterType, filterDate]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function handleFilterChange(type: string) {
    setFilterType(type);
    setPage(1);
  }

  function handleDateChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFilterDate(e.target.value);
    setPage(1);
  }

  function exportCSV() {
    const header = ["Timestamp", "Admin", "Action", "Target", "Details"];
    const rows = filtered.map((e) => [
      new Date(e.timestamp).toLocaleString(),
      e.admin,
      formatAction(e.action),
      e.target,
      e.details,
    ]);
    const csv = [header, ...rows].map((r) => r.map((v) => `"${v}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audit-log-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2.5 rounded-xl">
            <ClipboardList className="text-teal-800" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Audit Log</h1>
            <p className="text-stone-500 text-sm mt-0.5">Track all admin actions on the platform</p>
          </div>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Download size={15} />
          Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-stone-500 shrink-0" />
          <span className="text-sm font-medium text-stone-600 shrink-0">Filter by:</span>
          <div className="flex flex-wrap gap-2">
            {ACTION_TYPES.map((t) => (
              <button
                key={t}
                onClick={() => handleFilterChange(t)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  filterType === t
                    ? "bg-teal-700 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-sm text-stone-500 shrink-0">Date:</span>
            <input
              type="date"
              value={filterDate}
              onChange={handleDateChange}
              className="border border-stone-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500"
            />
            {filterDate && (
              <button
                onClick={() => { setFilterDate(""); setPage(1); }}
                className="text-xs text-stone-400 hover:text-stone-600 px-2 py-1 rounded"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-700" />
            <span className="font-semibold text-stone-800">Admin Actions</span>
          </div>
          <span className="text-sm text-stone-500">{filtered.length} entries</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-stone-50 border-b border-stone-100">
              <tr>
                <th className="text-left px-6 py-3 text-stone-500 font-medium whitespace-nowrap">Timestamp</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Admin</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Action</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Target</th>
                <th className="text-left px-4 py-3 text-stone-500 font-medium">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-50">
              {paginated.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-stone-400">
                    No audit entries match your filters.
                  </td>
                </tr>
              ) : (
                paginated.map((entry) => (
                  <tr key={entry.id} className="hover:bg-stone-50 transition-colors">
                    <td className="px-6 py-3.5 text-stone-500 whitespace-nowrap">
                      {new Date(entry.timestamp).toLocaleString()}
                    </td>
                    <td className="px-4 py-3.5 font-medium text-stone-800">{entry.admin}</td>
                    <td className="px-4 py-3.5">
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold whitespace-nowrap ${
                          ACTION_BADGE[entry.action] ?? "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {formatAction(entry.action)}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-stone-700">{entry.target}</td>
                    <td className="px-4 py-3.5 text-stone-500 max-w-xs truncate">{entry.details}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-stone-100 flex items-center justify-between">
          <span className="text-sm text-stone-500">
            Page {page} of {totalPages} ({filtered.length} entries)
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
              .reduce<(number | "...")[]>((acc, p, idx, arr) => {
                if (idx > 0 && typeof arr[idx - 1] === "number" && (p as number) - (arr[idx - 1] as number) > 1) {
                  acc.push("...");
                }
                acc.push(p);
                return acc;
              }, [])
              .map((p, i) =>
                p === "..." ? (
                  <span key={`ellipsis-${i}`} className="px-1 text-stone-400 text-sm">…</span>
                ) : (
                  <button
                    key={p}
                    onClick={() => setPage(p as number)}
                    className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                      page === p
                        ? "bg-teal-700 text-white"
                        : "border border-stone-200 text-stone-600 hover:bg-stone-100"
                    }`}
                  >
                    {p}
                  </button>
                )
              )}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="p-1.5 rounded-lg border border-stone-200 text-stone-600 hover:bg-stone-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
