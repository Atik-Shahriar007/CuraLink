"use client";

import { useState, useEffect } from "react";
import {
  DollarSign, TrendingUp, CreditCard, Calendar, AlertCircle,
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

type RangeOption = "7" | "30" | "90" | "all";

interface Payment {
  id: string;
  amount: number;
  status: string;
  createdAt: string;
  doctor: { account: { name: string } };
  patient: { account: { name: string } };
}

interface RevenueData {
  totalRevenue: number;
  avgPerConsultation: number;
  paymentsCount: number;
  series: { month: string; amount: number }[];
  payments: Payment[];
}

const RANGE_OPTIONS: { label: string; value: RangeOption }[] = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "all" },
];

function StatCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  sub,
}: {
  label: string;
  value: string;
  icon: React.ElementType;
  iconBg: string;
  iconColor: string;
  sub?: string;
}) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm text-stone-500 font-medium">{label}</span>
        <div className="p-2 rounded-lg" style={{ background: iconBg }}>
          <Icon size={18} style={{ color: iconColor }} />
        </div>
      </div>
      <p className="text-2xl font-bold text-stone-900">{value}</p>
      {sub && <p className="text-xs text-stone-400 mt-1">{sub}</p>}
    </div>
  );
}

export default function RevenuePage() {
  const [range, setRange] = useState<RangeOption>("30");
  const [data, setData] = useState<RevenueData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    const param = range === "all" ? "36500" : range;
    fetch(`/api/admin/revenue?range=${param}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then(setData)
      .catch(() => setError("Could not load revenue data. Please try again."))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2.5 rounded-xl">
            <DollarSign className="text-teal-800" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Revenue Dashboard</h1>
            <p className="text-stone-500 text-sm mt-0.5">Monitor platform earnings and payment activity</p>
          </div>
        </div>
        {/* Date range filter */}
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
          <Calendar size={15} className="text-stone-400 ml-2" />
          {RANGE_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRange(opt.value)}
              className={`text-sm px-3 py-1.5 rounded-lg font-medium transition-colors ${
                range === opt.value
                  ? "bg-teal-700 text-white"
                  : "text-stone-600 hover:bg-stone-100"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 flex flex-col items-center text-stone-400 shadow-sm">
          <TrendingUp size={36} className="animate-pulse mb-3" />
          <p>Loading revenue data...</p>
        </div>
      ) : error ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 flex flex-col items-center text-red-500 shadow-sm">
          <AlertCircle size={36} className="mb-3" />
          <p>{error}</p>
        </div>
      ) : data ? (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <StatCard
              label="Total Revenue"
              value={`$${data.totalRevenue.toFixed(2)}`}
              icon={DollarSign}
              iconBg="#E7F1F0"
              iconColor="#0F3D3E"
              sub={`From ${data.paymentsCount} paid consultations`}
            />
            <StatCard
              label="This Period Revenue"
              value={`$${data.totalRevenue.toFixed(2)}`}
              icon={TrendingUp}
              iconBg="#FBEFE6"
              iconColor="#B5541B"
              sub={RANGE_OPTIONS.find((o) => o.value === range)?.label}
            />
            <StatCard
              label="Avg. per Consultation"
              value={`$${data.avgPerConsultation.toFixed(2)}`}
              icon={CreditCard}
              iconBg="#FFF8E1"
              iconColor="#8A6D00"
              sub="Average payment amount"
            />
          </div>

          {/* Bar chart */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6 shadow-sm">
            <h2 className="font-semibold text-stone-800 mb-4">Monthly Revenue Breakdown</h2>
            {data.series.length === 0 ? (
              <div className="h-52 flex items-center justify-center text-stone-400">
                <p>No revenue data available for this period</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={data.series} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
                  <XAxis dataKey="month" fontSize={12} tick={{ fill: "#78716c" }} />
                  <YAxis
                    fontSize={12}
                    tick={{ fill: "#78716c" }}
                    tickFormatter={(v) => `$${v}`}
                  />
                  <Tooltip
                    formatter={(v: number) => [`$${v.toFixed(2)}`, "Revenue"]}
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e7e5e4",
                      fontSize: "13px",
                    }}
                  />
                  <Bar dataKey="amount" fill="#0F3D3E" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Recent payments table */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-stone-100 flex items-center justify-between">
              <h2 className="font-semibold text-stone-800">Recent Payments</h2>
              <span className="text-sm text-stone-500">{data.payments.length} payments</span>
            </div>
            {data.payments.length === 0 ? (
              <div className="flex flex-col items-center py-12 text-stone-400">
                <CreditCard size={36} className="mb-3 opacity-40" />
                <p>No payments in this period</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-stone-50 border-b border-stone-100">
                    <tr>
                      <th className="text-left px-6 py-3 text-stone-500 font-medium">Doctor</th>
                      <th className="text-left px-4 py-3 text-stone-500 font-medium">Patient</th>
                      <th className="text-left px-4 py-3 text-stone-500 font-medium">Amount</th>
                      <th className="text-left px-4 py-3 text-stone-500 font-medium">Date</th>
                      <th className="text-left px-4 py-3 text-stone-500 font-medium">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-50">
                    {data.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50 transition-colors">
                        <td className="px-6 py-3.5 font-medium text-stone-800">
                          {p.doctor.account.name}
                        </td>
                        <td className="px-4 py-3.5 text-stone-600">{p.patient.account.name}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-semibold text-emerald-700">
                            ${p.amount.toFixed(2)}
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-stone-500 whitespace-nowrap">
                          {new Date(p.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-4 py-3.5">
                          <span className="text-xs px-2.5 py-1 rounded-full font-semibold bg-emerald-100 text-emerald-700">
                            {p.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      ) : null}
    </div>
  );
}
