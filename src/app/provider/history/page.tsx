"use client";

import { useState, useEffect } from "react";
import { 
  History, 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  ChevronLeft, 
  ChevronRight,
  Phone,
  MapPin,
  CheckCircle,
  XCircle
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";
import { StatusBadge } from "@/app/components/UIComponents";

interface AmbRequest {
  id: string;
  status: string;
  address: string;
  situationDescription: string;
  contactPhone: string;
  createdAt: string;
  updatedAt: string;
  patient: { account: { firstName: string | null; lastName: string | null; email: string | null } };
}

export default function ProviderHistoryPage() {
  const [requests, setRequests] = useState<AmbRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [rangeFilter, setRangeFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  function fetchHistory() {
    setLoading(true);
    const params = new URLSearchParams({
      page: page.toString(),
      status: statusFilter,
      range: rangeFilter,
      search: search.trim(),
    });

    fetch(`/api/provider/history?${params.toString()}`)
      .then((res) => res.json())
      .then((data) => {
        setRequests(data.requests || []);
        setTotal(data.total || 0);
        setTotalPages(data.totalPages || 1);
      })
      .catch((err) => console.error("Error fetching history:", err))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchHistory();
  }, [page, statusFilter, rangeFilter]);

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  }

  function exportCSV() {
    if (requests.length === 0) return;
    const headers = ["ID", "Patient", "Phone", "Address", "Situation", "Status", "Date Requested", "Date Completed"];
    const rows = requests.map((r) => [
      r.id,
      `"${r.patient?.account?.firstName || ""} ${r.patient?.account?.lastName || ""}"`,
      `"${r.contactPhone}"`,
      `"${r.address.replace(/"/g, '""')}"`,
      `"${r.situationDescription.replace(/"/g, '""')}"`,
      r.status,
      new Date(r.createdAt).toLocaleString(),
      new Date(r.updatedAt).toLocaleString(),
    ]);

    const csvContent = [headers.join(","), ...rows.map((row) => row.join(","))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ambulance-dispatch-history-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-stone-900">Request Archives & History</h1>
          <p className="text-stone-500 text-sm mt-1">Review finalized dispatches, resolution logs, and service records.</p>
        </div>
        <button
          onClick={exportCSV}
          disabled={requests.length === 0}
          className="flex items-center gap-2 border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
        >
          <Download size={16} />
          Export CSV Report
        </button>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <form onSubmit={handleSearchSubmit} className="flex-1 w-full flex items-center gap-2">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
            <input
              type="text"
              placeholder="Search by address or situation keywords..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 focus:border-teal-600"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition"
          >
            Search
          </button>
        </form>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
            <Filter size={14} />
            Status:
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="border border-stone-200 rounded-xl px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="ALL">All Outcomes</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELED">Canceled</option>
          </select>

          <select
            value={rangeFilter}
            onChange={(e) => {
              setRangeFilter(e.target.value);
              setPage(1);
            }}
            className="border border-stone-200 rounded-xl px-3 py-1.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-600"
          >
            <option value="all">All Times</option>
            <option value="today">Today</option>
            <option value="week">Past Week</option>
            <option value="month">Past Month</option>
          </select>
        </div>
      </div>

      <DashboardCard title={`Archived Requests (${total})`}>
        {loading ? (
          <div className="py-16 text-center text-stone-400">Loading history logs...</div>
        ) : requests.length === 0 ? (
          <div className="py-16 text-center text-stone-400">
            <History size={36} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No historical requests found matching your filter criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-xs text-left uppercase">
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Patient Details</th>
                  <th className="py-3 px-4">Address / Destination</th>
                  <th className="py-3 px-4">Situation Overview</th>
                  <th className="py-3 px-4">Final Outcome</th>
                  <th className="py-3 px-4">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {requests.map((r) => {
                  const reqDate = new Date(r.createdAt);
                  const finDate = new Date(r.updatedAt);
                  const diffMinutes = Math.max(1, Math.round((finDate.getTime() - reqDate.getTime()) / (1000 * 60)));

                  return (
                    <tr key={r.id} className="hover:bg-stone-50">
                      <td className="py-3 px-4 text-stone-600 whitespace-nowrap text-xs">
                        <div className="font-semibold text-stone-800">{reqDate.toLocaleDateString()}</div>
                        <div>{reqDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-900">
                          {r.patient?.account ? `${r.patient.account.firstName || ""} ${r.patient.account.lastName || ""}` : "Emergency Caller"}
                        </div>
                        <div className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                          <Phone size={11} />
                          {r.contactPhone}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs text-xs">
                        <div className="flex items-start gap-1">
                          <MapPin size={12} className="text-stone-400 mt-0.5 shrink-0" />
                          <span>{r.address}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-stone-600 max-w-xs text-xs line-clamp-2">
                        {r.situationDescription}
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <StatusBadge status={r.status} />
                      </td>
                      <td className="py-3 px-4 text-stone-500 text-xs whitespace-nowrap">
                        ~{diffMinutes} mins
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-stone-100 mt-4">
            <span className="text-xs text-stone-500">
              Showing page {page} of {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 transition"
              >
                <ChevronLeft size={16} />
              </button>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-stone-200 rounded-lg hover:bg-stone-50 disabled:opacity-40 transition"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
