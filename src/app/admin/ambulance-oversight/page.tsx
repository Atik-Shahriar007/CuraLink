"use client";

import { useState, useEffect } from "react";
import { Truck, Filter, MapPin, Phone, Clock, AlertCircle } from "lucide-react";

type AmbulanceStatus =
  | "ALL"
  | "REQUESTED"
  | "ACCEPTED"
  | "DISPATCHED"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELED";

interface AmbulanceRequest {
  id: string;
  status: string;
  address: string;
  situation: string;
  createdAt: string;
  patient: {
    account: { name: string; phone?: string | null };
  };
  provider: {
    account: { name: string; phone?: string | null };
  } | null;
}

const STATUS_LIST: AmbulanceStatus[] = [
  "ALL",
  "REQUESTED",
  "ACCEPTED",
  "DISPATCHED",
  "ARRIVED",
  "COMPLETED",
  "CANCELED",
];

const STATUS_BADGE: Record<string, string> = {
  REQUESTED:  "bg-blue-100 text-blue-700",
  ACCEPTED:   "bg-teal-100 text-teal-700",
  DISPATCHED: "bg-amber-100 text-amber-700",
  ARRIVED:    "bg-purple-100 text-purple-700",
  COMPLETED:  "bg-emerald-100 text-emerald-700",
  CANCELED:   "bg-red-100 text-red-700",
};

function timeSince(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

export default function AmbulanceOversightPage() {
  const [requests, setRequests] = useState<AmbulanceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<AmbulanceStatus>("ALL");

  useEffect(() => {
    setLoading(true);
    setError("");
    const url =
      status === "ALL"
        ? "/api/admin/ambulance-oversight"
        : `/api/admin/ambulance-oversight?status=${status}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((data) => setRequests(data.requests ?? []))
      .catch(() => setError("Could not load ambulance requests. Please try again."))
      .finally(() => setLoading(false));
  }, [status]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="bg-teal-100 p-2.5 rounded-xl">
          <Truck className="text-teal-800" size={22} />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Ambulance Oversight</h1>
          <p className="text-stone-500 text-sm mt-0.5">Monitor all emergency ambulance requests</p>
        </div>
      </div>

      {/* Status Filter */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-5 shadow-sm">
        <div className="flex flex-wrap items-center gap-3">
          <Filter size={16} className="text-stone-500 shrink-0" />
          <span className="text-sm font-medium text-stone-600 shrink-0">Status:</span>
          <div className="flex flex-wrap gap-2">
            {STATUS_LIST.map((s) => (
              <button
                key={s}
                onClick={() => setStatus(s)}
                className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                  status === s
                    ? "bg-teal-700 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {s === "ALL" ? "All Requests" : s.charAt(0) + s.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 flex flex-col items-center text-stone-400 shadow-sm">
          <Truck size={36} className="animate-pulse mb-3" />
          <p>Loading requests...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-12 flex flex-col items-center text-red-500 shadow-sm">
          <AlertCircle size={36} className="mb-3" />
          <p>{error}</p>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
            <h2 className="font-semibold text-stone-800">Requests</h2>
            <span className="text-sm text-stone-500">{requests.length} found</span>
          </div>

          {requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-stone-400">
              <Truck size={40} className="mb-3 opacity-40" />
              <p className="font-medium">No requests found</p>
              <p className="text-sm mt-1">Try a different status filter</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 border-b border-stone-100">
                  <tr>
                    <th className="text-left px-6 py-3 text-stone-500 font-medium">Patient</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Provider</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Address</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Situation</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Status</th>
                    <th className="text-left px-4 py-3 text-stone-500 font-medium">Time</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {requests.map((req) => (
                    <tr key={req.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-stone-800">{req.patient.account.name}</p>
                        {req.patient.account.phone && (
                          <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                            <Phone size={10} />
                            {req.patient.account.phone}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        {req.provider ? (
                          <div>
                            <p className="font-medium text-stone-700">{req.provider.account.name}</p>
                            {req.provider.account.phone && (
                              <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                                <Phone size={10} />
                                {req.provider.account.phone}
                              </p>
                            )}
                          </div>
                        ) : (
                          <span className="text-stone-400 text-xs italic">Unassigned</span>
                        )}
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-stone-600 flex items-start gap-1 max-w-[180px]">
                          <MapPin size={13} className="shrink-0 mt-0.5 text-stone-400" />
                          <span className="truncate">{req.address}</span>
                        </p>
                      </td>
                      <td className="px-4 py-4">
                        <p className="text-stone-600 max-w-[200px] truncate">{req.situation}</p>
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                            STATUS_BADGE[req.status] ?? "bg-stone-100 text-stone-600"
                          }`}
                        >
                          {req.status}
                        </span>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-1 text-stone-400 text-xs whitespace-nowrap">
                          <Clock size={12} />
                          {timeSince(req.createdAt)}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
