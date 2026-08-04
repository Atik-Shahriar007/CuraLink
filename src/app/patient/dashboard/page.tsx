"use client";

import { useState, useEffect } from "react";
import { Activity, CalendarCheck, Users, DollarSign } from "lucide-react";
import {
  LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";
import { useAuth } from "@/lib/AuthContext";

interface Stats {
  totals: { consultations: number; upcoming: number; doctorsMet: number; totalSpent: number };
  consultationsSeries: { month: string; count: number }[];
  statusCounts: Record<string, number>;
}

const COLORS: Record<string, string> = {
  PENDING: "#C9A227",
  IN_PROGRESS: "#0F3D3E",
  COMPLETED: "#2E7D32",
  CANCELED: "#B5541B",
};

export default function PatientDashboardPage() {
  const { account } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/dashboard-stats")
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <p className="text-stone-500">Loading dashboard...</p>;

  const pieData = Object.entries(stats.statusCounts).map(([name, value]) => ({ name, value }));

  return (
    <div>
      <h1 className="text-2xl font-bold font-display mb-1">
        Welcome back{account?.firstName ? `, ${account.firstName}` : ""}
      </h1>
      <p className="text-stone-500 mb-6">Here's an overview of your care.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Consultations" value={stats.totals.consultations} icon={Activity} iconColor="#0F3D3E" iconBg="#E7F1F0" />
        <StatCard label="Upcoming" value={stats.totals.upcoming} icon={CalendarCheck} iconColor="#2E7D32" iconBg="#E8F5E9" />
        <StatCard label="Doctors Met" value={stats.totals.doctorsMet} icon={Users} iconColor="#B5541B" iconBg="#FBEFE6" />
        <StatCard label="Total Spent" value={`$${stats.totals.totalSpent.toFixed(2)}`} icon={DollarSign} iconColor="#8A6D00" iconBg="#FFF8E1" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <DashboardCard title="Consultations per Month">
          {stats.consultationsSeries.length === 0 ? (
            <p className="text-sm text-stone-400">No consultations yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={stats.consultationsSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} />
                <YAxis fontSize={12} allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="count" stroke="#0F3D3E" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </DashboardCard>

        <DashboardCard title="Status Breakdown">
          {pieData.length === 0 ? (
            <p className="text-sm text-stone-400">No data yet.</p>
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
    </div>
  );
}