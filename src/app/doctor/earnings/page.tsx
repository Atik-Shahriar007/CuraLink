"use client";

import { useState, useEffect } from "react";
import { DollarSign, TrendingUp, Calendar, Download, CreditCard, Filter } from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";
import { StatusBadge } from "@/app/components/UIComponents";

interface Payment {
  id: string;
  patientName: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  consultationId?: string;
}

interface EarningsData {
  totalEarnings: number;
  thisMonthEarnings: number;
  avgPerConsultation: number;
  series: { month: string; amount: number }[];
  payments: Array<{
    id: string;
    amount: number;
    status: string;
    createdAt: string;
    patient: { account: { firstName: string | null; lastName: string | null } };
    consultation: { date: string } | null;
  }>;
}

const RANGES = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "3650" },
];

export default function DoctorEarningsPage() {
  const [data, setData] = useState<EarningsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");

  useEffect(() => {
    setLoading(true);
    fetch(`/api/doctor/earnings?range=${range}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [range]);

  function exportCSV() {
    if (!data) return;
    const rows = [
      ["Date", "Patient", "Amount", "Currency", "Status"],
      ...data.payments.map((p) => [
        new Date(p.createdAt).toLocaleDateString(),
        `${p.patient.account.firstName || ""} ${p.patient.account.lastName || ""}`.trim(),
        p.amount.toFixed(2),
        p.currency.toUpperCase(),
        p.status,
      ]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `earnings-${range}days.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-stone-200 animate-pulse rounded w-48" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => <div key={i} className="h-24 bg-stone-100 animate-pulse rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Earnings</h1>
          <p className="text-stone-500 text-sm mt-1">Track your revenue and payment history</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 border border-stone-200 rounded-xl p-1 bg-white">
            {RANGES.map((r) => (
              <button
                key={r.value}
                onClick={() => setRange(r.value)}
                className={`text-xs px-3 py-1.5 rounded-lg transition-colors ${
                  range === r.value ? "bg-teal-700 text-white" : "text-stone-600 hover:bg-stone-100"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 border border-stone-200 bg-white text-stone-600 px-4 py-2 rounded-xl text-sm hover:bg-stone-50 transition-colors"
          >
            <Download size={14} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard
          label="Total Earnings"
          value={`$${data.totalEarnings.toFixed(2)}`}
          icon={DollarSign}
          iconColor="#2E7D32"
          iconBg="#E8F5E9"
        />
        <StatCard
          label="This Month"
          value={`$${data.thisMonthEarnings.toFixed(2)}`}
          icon={Calendar}
          iconColor="#0F3D3E"
          iconBg="#E7F1F0"
        />
        <StatCard
          label="Avg Per Consultation"
          value={`$${data.avgPerConsultation.toFixed(2)}`}
          icon={TrendingUp}
          iconColor="#8A6D00"
          iconBg="#FFF8E1"
        />
      </div>

      <DashboardCard title="Monthly Revenue" className="mb-6">
        {data.series.length === 0 ? (
          <p className="text-sm text-stone-400 text-center py-8">No earnings data yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.series}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" fontSize={12} tick={{ fill: "#78716c" }} />
              <YAxis fontSize={12} tick={{ fill: "#78716c" }} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]} />
              <Legend />
              <Line type="monotone" dataKey="amount" name="Revenue ($)" stroke="#0F3D3E" strokeWidth={2} dot={{ fill: "#0F3D3E", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </DashboardCard>

      <DashboardCard title="Payment History">
        {data.payments.length === 0 ? (
          <div className="text-center py-8 text-stone-400">
            <CreditCard size={32} className="mx-auto mb-2 opacity-30" />
            <p className="text-sm">No payments in this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-100">
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 uppercase tracking-wide">Patient</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 uppercase tracking-wide">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 uppercase tracking-wide">Amount</th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-stone-500 uppercase tracking-wide">Status</th>
                </tr>
              </thead>
              <tbody>
                {data.payments.map((p) => (
                  <tr key={p.id} className="border-b border-stone-50 hover:bg-stone-50 transition-colors">
                    <td className="py-3 px-4 text-stone-700">
                      {p.patient.account.firstName} {p.patient.account.lastName}
                    </td>
                    <td className="py-3 px-4 text-stone-500">
                      {new Date(p.createdAt).toLocaleDateString("en", { year: "numeric", month: "short", day: "numeric" })}
                    </td>
                    <td className="py-3 px-4 font-medium text-stone-800">
                      ${p.amount.toFixed(2)}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={p.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
