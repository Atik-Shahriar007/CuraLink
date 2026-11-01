"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Truck, 
  CheckCircle, 
  Clock, 
  Activity, 
  AlertCircle, 
  MapPin, 
  Phone, 
  ArrowRight,
  TrendingUp,
  ShieldCheck
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";
import { StatusBadge } from "@/app/components/UIComponents";

interface ProviderStats {
  totalAccepted: number;
  completedToday: number;
  active: number;
  completed: number;
  canceled: number;
}

interface RecentRequest {
  id: string;
  status: string;
  address: string;
  situationDescription: string;
  contactPhone: string;
  createdAt: string;
  patient: { account: { firstName: string | null; lastName: string | null } };
}

interface DashboardData {
  stats: ProviderStats;
  series: { date: string; completed: number; canceled: number }[];
  recentRequests: RecentRequest[];
}

export default function ProviderDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/provider/dashboard")
      .then((r) => r.json())
      .then(setData)
      .catch((err) => console.error("Error fetching provider dashboard", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return (
      <div className="space-y-4">
        <div className="h-8 bg-stone-200 animate-pulse rounded w-48" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-stone-100 animate-pulse rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const { stats, series, recentRequests } = data;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-stone-900">Ambulance Fleet Dashboard</h1>
          <p className="text-stone-500 text-sm mt-1">Real-time status, dispatch oversight, and daily response metrics.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/provider/requests"
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors"
          >
            <Truck size={16} />
            Live Dispatch Dispatcher
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Active Dispatches"
          value={stats.active}
          icon={Activity}
          iconColor="#DC2626"
          iconBg="#FEF2F2"
        />
        <StatCard
          label="Completed Today"
          value={stats.completedToday}
          icon={CheckCircle}
          iconColor="#16A34A"
          iconBg="#DCFCE7"
        />
        <StatCard
          label="Total Handled"
          value={stats.totalAccepted}
          icon={Truck}
          iconColor="#0F3D3E"
          iconBg="#E7F1F0"
        />
        <StatCard
          label="Total Canceled"
          value={stats.canceled}
          icon={AlertCircle}
          iconColor="#EA580C"
          iconBg="#FFEDD5"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="Dispatch Activity (Past 7 Days)">
            {series.length === 0 ? (
              <p className="text-sm text-stone-400 py-12 text-center">No dispatch metrics recorded yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="date" fontSize={12} tick={{ fill: "#64748b" }} />
                  <YAxis fontSize={12} tick={{ fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Completed" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="canceled" name="Canceled" fill="#DC2626" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </DashboardCard>
        </div>

        <div>
          <DashboardCard title="Operations Overview">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-medium text-stone-700">Completion Rate</span>
                  <span className="text-sm font-bold text-green-700">
                    {stats.totalAccepted > 0 ? Math.round((stats.completed / stats.totalAccepted) * 100) : 100}%
                  </span>
                </div>
                <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-green-600 h-full rounded-full" 
                    style={{ width: `${stats.totalAccepted > 0 ? (stats.completed / stats.totalAccepted) * 100 : 100}%` }}
                  />
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 text-teal-800 rounded-lg">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-stone-800">Verified Service Provider</h4>
                    <p className="text-xs text-stone-500">Official ambulance dispatch link active</p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href="/provider/history"
                  className="flex items-center justify-between text-sm text-teal-700 font-medium hover:text-teal-900 transition-colors"
                >
                  <span>View comprehensive request archive</span>
                  <ArrowRight size={16} />
                </Link>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>

      <DashboardCard title="Recent Dispatch Activity">
        {recentRequests.length === 0 ? (
          <p className="text-sm text-stone-400 py-8 text-center">No recent dispatches logged.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500 text-xs text-left uppercase">
                  <th className="py-3 px-4">Patient</th>
                  <th className="py-3 px-4">Contact</th>
                  <th className="py-3 px-4">Address</th>
                  <th className="py-3 px-4">Situation</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {recentRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-stone-50">
                    <td className="py-3 px-4 font-medium text-stone-800">
                      {req.patient?.account ? `${req.patient.account.firstName || ""} ${req.patient.account.lastName || ""}` : "Emergency Caller"}
                    </td>
                    <td className="py-3 px-4 text-stone-600 flex items-center gap-1.5">
                      <Phone size={13} className="text-stone-400" />
                      {req.contactPhone}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate" title={req.address}>
                      {req.address}
                    </td>
                    <td className="py-3 px-4 text-stone-600 max-w-xs truncate">
                      {req.situationDescription}
                    </td>
                    <td className="py-3 px-4">
                      <StatusBadge status={req.status} />
                    </td>
                    <td className="py-3 px-4 text-stone-400 text-xs">
                      {new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
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
