"use client";

import { useState, useEffect } from "react";
import {
  CalendarDays, Users, FileText, Clock, XCircle, CheckCircle2, DollarSign,
} from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";
import TabbedConsultationTable from "@/app/components/TabbedConsultationTable";
import { useAuth } from "@/lib/AuthContext";

interface Stats {
  totals: {
    consultationsThisMonth: number; totalPatients: number; totalConsultations: number;
    pending: number; canceled: number; completed: number; totalEarnings: number;
  };
  consultationsSeries: { month: string; canceled: number; completed: number; pending: number }[];
  statusCounts: Record<string, number>;
  tableRows: any[];
}

const COLORS: Record<string, string> = {
  PENDING: "#C9A227",
  IN_PROGRESS: "#0F3D3E",
  COMPLETED: "#2E7D32",
  CANCELED: "#B5541B",
};

export default function DoctorDashboardPage() {
  const { account } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctor/dashboard-stats")
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <p className="text-stone-500">Loading dashboard...</p>;

  const pieData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <div className="bg-gradient-to-br from-teal-950 to-teal-800 text-white rounded-2xl p-6 mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-display">
            Hello, Dr. {account?.lastName || account?.firstName || ""} 👋
          </h1>
          <p className="text-teal-100 text-sm mt-1">Here's what's happening with your practice today.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <StatCard label="This Month" value={stats.totals.consultationsThisMonth} icon={CalendarDays} iconColor="#0F3D3E" iconBg="#E7F1F0" />
        <StatCard label="Total Patients" value={stats.totals.totalPatients} icon={Users} iconColor="#0F3D3E" iconBg="#E7F1F0" />
        <StatCard label="Total Consultations" value={stats.totals.totalConsultations} icon={FileText} iconColor="#0F3D3E" iconBg="#E7F1F0" />
        <StatCard label="Pending" value={stats.totals.pending} icon={Clock} iconColor="#8A6D00" iconBg="#FFF8E1" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <StatCard label="Canceled" value={stats.totals.canceled} icon={XCircle} iconColor="#B5541B" iconBg="#FBEFE6" />
        <StatCard label="Completed" value={stats.totals.completed} icon={CheckCircle2} iconColor="#2E7D32" iconBg="#E8F5E9" />
        <StatCard label="Total Earnings" value={`$${stats.totals.totalEarnings.toFixed(2)}`} icon={DollarSign} iconColor="#8A6D00" iconBg="#FFF8E1" />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        <DashboardCard title="Consultations Over Time">
          {stats.consultationsSeries.length === 0 ? (
            <p className="text-sm text-stone-400">No consultations yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.consultationsSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="pending" stroke="#C9A227" strokeWidth={2} />
                <Line type="monotone" dataKey="completed" stroke="#2E7D32" strokeWidth={2} />
                <Line type="monotone" dataKey="canceled" stroke="#B5541B" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>

        <DashboardCard title="Status Breakdown">
          {pieData.length === 0 ? (
            <p className="text-sm text-stone-400">No consultations yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={COLORS[entry.name] || "#999"} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>
      </div>

      <TabbedConsultationTable rows={stats.tableRows} />
    </div>
  );
}