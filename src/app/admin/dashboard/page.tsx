"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Stethoscope, Users, Truck, LifeBuoy, Pill, Newspaper, Activity, Wrench, AlertOctagon,
} from "lucide-react";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";
import HealthRing from "@/app/components/ops/HealthRing";
import { SeverityChip } from "@/app/components/ops/OpsPrimitives";
import { healthScoreLabel } from "@/lib/formatters";

interface Stats {
  pendingDoctors: number; totalDoctors: number; totalPatients: number;
  pendingProviders: number; openTickets: number; totalMedicines: number; pendingBlogPosts: number;
  openReports: number; unassignedReports: number; criticalReports: number;
  healthScore: number;
  breachedRules: Array<{
    key: string; title: string; severity: string; lastRunMessage: string | null; lastValue: number | null;
  }>;
  openIncidents: number;
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
    // Operations first: these are the ones where someone is waiting on us.
    {
      label: "Breached platform checks",
      count: stats.breachedRules.length,
      href: "/health",
      tone: "critical" as const,
    },
    {
      label: "Problem reports nobody has picked up",
      count: stats.unassignedReports,
      href: "/admin/reports",
      tone: "critical" as const,
    },
    {
      label: "Critical reports still open",
      count: stats.criticalReports,
      href: "/admin/reports?severity=CRITICAL",
      tone: "critical" as const,
    },
    { label: "Doctors pending approval", count: stats.pendingDoctors, href: "/admin/doctors" },
    { label: "Providers pending approval", count: stats.pendingProviders, href: "/admin/providers" },
    { label: "Open support tickets", count: stats.openTickets, href: "/support/tickets" },
    { label: "Articles pending review", count: stats.pendingBlogPosts, href: "/admin/blog" },
    { label: "Open incidents", count: stats.openIncidents, href: "/admin/incidents" },
    { label: "Reports awaiting triage", count: stats.openReports, href: "/admin/reports" },
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

      {/* System health + what is breaching, side by side with attention items. */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <DashboardCard className="flex flex-col items-center justify-center py-6">
          <HealthRing score={stats.healthScore} size={120} strokeWidth={10} />
          <p className="text-xs text-stone-500 mt-3 text-center">
            Platform health score
          </p>
          <Link
            href="/health"
            className="text-xs font-semibold text-teal-900 hover:underline mt-2"
          >
            Open System Health →
          </Link>
        </DashboardCard>

        <DashboardCard
          title="Checks that are breaching"
          className="lg:col-span-2"
          action={
            <Link href="/health" className="text-xs font-semibold text-teal-900 hover:underline">
              All checks →
            </Link>
          }
        >
          {stats.breachedRules.length === 0 ? (
            <div className="py-4">
              <p className="text-sm text-stone-600">
                Nothing is breaching right now — the platform is{" "}
                <span className="font-medium">{healthScoreLabel(stats.healthScore).toLowerCase()}</span>.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {stats.breachedRules.map((rule) => (
                <Link
                  key={rule.key}
                  href="/health"
                  className="flex items-start justify-between gap-3 border border-red-200 bg-red-50 rounded-xl px-4 py-3 hover:bg-red-100 transition-colors"
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-medium text-red-900">{rule.title}</span>
                      <SeverityChip severity={rule.severity} size="xs" />
                    </div>
                    <p className="text-xs text-red-800 mt-1 line-clamp-2">
                      {rule.lastRunMessage}
                    </p>
                  </div>
                  <span className="text-lg font-bold text-red-900 tabular-nums shrink-0">
                    {rule.lastValue ?? "—"}
                  </span>
                </Link>
              ))}
              {stats.openIncidents > 0 && (
                <Link
                  href="/admin/incidents"
                  className="flex items-center gap-2 text-xs font-semibold text-red-900 pt-1 hover:underline"
                >
                  <Wrench size={13} />
                  {stats.openIncidents} open work order{stats.openIncidents === 1 ? "" : "s"} in
                  Incidents →
                </Link>
              )}
            </div>
          )}
        </DashboardCard>
      </div>

      {attentionItems.length > 0 && (
        <DashboardCard title="Needs Your Attention" className="mb-6">
          <div className="space-y-2">
            {attentionItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors text-sm ${
                  item.tone === "critical"
                    ? "bg-red-50 hover:bg-red-100"
                    : "bg-amber-50 hover:bg-amber-100"
                }`}
              >
                <span
                  className={`font-medium ${
                    item.tone === "critical" ? "text-red-900" : "text-amber-900"
                  }`}
                >
                  {item.label}
                </span>
                <span
                  className={`text-white text-xs font-bold px-2 py-0.5 rounded-full ${
                    item.tone === "critical" ? "bg-red-600" : "bg-amber-500"
                  }`}
                >
                  {item.count}
                </span>
              </Link>
            ))}
          </div>
        </DashboardCard>
      )}

      <div className="grid md:grid-cols-3 gap-4">
        <Link href="/health" className="border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
          <Activity className="mb-2 text-teal-950" size={22} />
          <p className="font-medium">System Health</p>
          <p className="text-sm text-stone-500 mt-1">
            Standing checks on consultations, payments, providers and support
          </p>
        </Link>
        <Link href="/admin/reports" className="border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
          <AlertOctagon className="mb-2 text-teal-950" size={22} />
          <p className="font-medium">Problem Reports</p>
          <p className="text-sm text-stone-500 mt-1">
            What patients and doctors told us was broken
          </p>
        </Link>
        <Link href="/admin/incidents" className="border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-md transition-shadow">
          <Wrench className="mb-2 text-teal-950" size={22} />
          <p className="font-medium">Incidents</p>
          <p className="text-sm text-stone-500 mt-1">
            Work orders opened by breached checks, with repair times
          </p>
        </Link>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mt-4">
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
