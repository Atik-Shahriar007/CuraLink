"use client";

import { useState } from "react";

interface Row {
  id: string;
  patientName: string;
  date: string;
  status: string;
  price: number | null;
  paymentStatus: string;
  createdAt: string;
  updatedAt: string;
}

const TABS = [
  { key: "PENDING", label: "Pending" },
  { key: "CANCELED", label: "Canceled" },
  { key: "COMPLETED", label: "Completed" },
  { key: "ALL", label: "All" },
];

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  COMPLETED: "bg-emerald-100 text-emerald-800",
  CANCELED: "bg-red-100 text-red-700",
};

export default function TabbedConsultationTable({ rows }: { rows: Row[] }) {
  const [tab, setTab] = useState("PENDING");

  const filtered = tab === "ALL" ? rows : rows.filter((r) => r.status === tab);

  return (
    <div className="border border-stone-200 rounded-2xl bg-white overflow-hidden">
      <div className="flex border-b border-stone-200">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`px-5 py-3 text-sm font-medium transition-colors ${
              tab === t.key
                ? "text-teal-950 border-b-2 border-teal-950"
                : "text-stone-500 hover:text-stone-800"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-stone-500 border-b border-stone-100">
              <th className="px-5 py-3 font-medium">Patient</th>
              <th className="px-5 py-3 font-medium">Date</th>
              <th className="px-5 py-3 font-medium">Status</th>
              <th className="px-5 py-3 font-medium">Price</th>
              <th className="px-5 py-3 font-medium">Payment</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-5 py-8 text-center text-stone-400">
                  No data to display
                </td>
              </tr>
            ) : (
              filtered.map((r) => (
                <tr key={r.id} className="border-b border-stone-50 last:border-0">
                  <td className="px-5 py-3">{r.patientName}</td>
                  <td className="px-5 py-3 text-stone-500">{new Date(r.date).toLocaleString()}</td>
                  <td className="px-5 py-3">
                    <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusStyles[r.status]}`}>
                      {r.status.replace("_", " ")}
                    </span>
                  </td>
                  <td className="px-5 py-3">{r.price !== null ? `$${r.price.toFixed(2)}` : "—"}</td>
                  <td className="px-5 py-3 text-stone-500">{r.paymentStatus}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}