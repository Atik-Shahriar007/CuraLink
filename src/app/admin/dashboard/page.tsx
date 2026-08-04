"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Stethoscope, Users, Truck, LifeBuoy, Pill, Newspaper } from "lucide-react";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";

interface Stats {
  pendingDoctors: number; totalDoctors: number; totalPatients: number;
  pendingProviders: number; openTickets: number; totalMedicines: number; pendingBlogPosts: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/dashboard-stats")
      .then((res) => res.json())
      .then(setStats)
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) return <p className="text-stone-500">Loading dashboard...</p>;

  const attentionItems = [
    { label: "Doctors pending approval", count: stats.pendingDoctors, href: "/admin/doctors" },
    { label: "Providers pending approval", count: stats.pendingProviders, href: "/admin/providers" },
    { label: "Open support tickets", count: stats.openTickets, href: "/support/tickets" },
    { label: "Articles pending review", count: stats.pendingBlogPosts, href: "/admin/blog" },
  ].filter((i) => i.count > 0);

  return (
    <div>
      <h1 className="text-2xl font-bold font-display mb-1">Admin Overview</h1>
      <p className="text-stone-500 mb-6">Platform status at a glance.</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard label="Total Doctors" value={stats.totalDoctors} icon={Stethoscope} iconColor="#0F3D3E" iconBg="#E7F1F0" />
        <StatCard label="Total Patients" value={stats.totalPatients} icon={Users} iconColor="#0F3D3E" iconBg="#E7F1F0" />
        <StatCard label="Medicines Listed" value={stats.totalMedicines} icon={Pill} iconColor="#B5541B" iconBg="#FBEFE6" />
        <StatCard label="Open Tickets" value={stats.openTickets} icon={LifeBuoy} iconColor="#8A6D00" iconBg="#FFF8E1" />
      </div>

      {attentionItems.length > 0 && (
        <DashboardCard title="Needs Your Attention" className="mb-6">
          <div className="space-y-2">
            {attentionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="flex items-center justify-between px-4 py-3 rounded-lg bg-amber-50 hover:bg-amber-100 transition-colors text-sm"
              >
                <span className="font-medium text-amber-900">{item.label}</span>
                <span className="bg-amber-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </DashboardCard>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/admin/doctors" className="border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
          <Stethoscope className="mb-2 text-teal-950" size={22} />
          <p className="font-medium">Manage Doctors</p>
          <p className="text-sm text-stone-500 mt-1">Approve profiles, view listings</p>
        </Link>
        <Link href="/admin/analytics" className="border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
          <Newspaper className="mb-2 text-teal-950" size={22} />
          <p className="font-medium">Analytics</p>
          <p className="text-sm text-stone-500 mt-1">Revenue, growth, performance</p>
        </Link>
        <Link href="/admin/providers" className="border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
          <Truck className="mb-2 text-teal-950" size={22} />
          <p className="font-medium">Ambulance Providers</p>
          <p className="text-sm text-stone-500 mt-1">Review and approve providers</p>
        </Link>
      </div>
    </div>
  );
}