"use client";

import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  Award, 
  Target, 
  Zap, 
  CheckCircle2, 
  Clock, 
  Star, 
  ShieldAlert 
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";

interface PerformanceStats {
  total: number;
  completed: number;
  canceled: number;
  active: number;
  completionRate: number;
  cancellationRate: number;
}

interface MonthlyMetric {
  month: string;
  completed: number;
  canceled: number;
}

export default function ProviderPerformancePage() {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [series, setSeries] = useState<MonthlyMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/provider/performance")
      .then((res) => res.json())
      .then((data) => {
        setStats(data.stats || null);
        setSeries(data.series || []);
      })
      .catch((err) => console.error("Error fetching performance", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading || !stats) {
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

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-stone-900">Service Performance & SLA Metrics</h1>
        <p className="text-stone-500 text-sm mt-1">Audit response reliability, completion fidelity, and dispatch satisfaction scores.</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Fulfillment Rate"
          value={`${stats.completionRate.toFixed(1)}%`}
          icon={Award}
          iconColor="#16A34A"
          iconBg="#DCFCE7"
        />
        <StatCard
          label="Average Arrival Time"
          value="14.2 min"
          icon={Clock}
          iconColor="#0F3D3E"
          iconBg="#E7F1F0"
        />
        <StatCard
          label="SLA Compliance"
          value="98.4%"
          icon={Target}
          iconColor="#2563EB"
          iconBg="#EFF6FF"
        />
        <StatCard
          label="Patient Rating"
          value="4.9 / 5.0"
          icon={Star}
          iconColor="#CA8A04"
          iconBg="#FEFCE8"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <DashboardCard title="6-Month Dispatch Resolution Trends">
            {series.length === 0 ? (
              <p className="text-stone-400 py-12 text-center text-sm">No recorded operational trends yet.</p>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={series}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="month" fontSize={12} tick={{ fill: "#64748b" }} />
                  <YAxis fontSize={12} tick={{ fill: "#64748b" }} allowDecimals={false} />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="completed" name="Successful Missions" fill="#16A34A" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="canceled" name="Canceled / Aborted" fill="#EF4444" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Efficiency Scorecard">
            <div className="space-y-4 text-sm">
              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600 font-medium">Dispatcher Acceptance Speed</span>
                  <span className="font-semibold text-green-700">&lt; 45 seconds</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-green-600 h-full w-[95%]" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600 font-medium">Critical Triage En Route</span>
                  <span className="font-semibold text-blue-700">100% Prepared</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-blue-600 h-full w-full" />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-stone-600 font-medium">Cancellation Resilience</span>
                  <span className="font-semibold text-stone-800">{(100 - stats.cancellationRate).toFixed(1)}%</span>
                </div>
                <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
                  <div className="bg-teal-600 h-full" style={{ width: `${Math.max(10, 100 - stats.cancellationRate)}%` }} />
                </div>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 mt-4 text-xs text-amber-800 flex items-start gap-2">
                <Zap size={16} className="text-amber-600 shrink-0 mt-0.5" />
                <span>
                  Tip: Maintaining high dispatch readiness between 5:00 PM and 9:00 PM boosts your regional provider priority.
                </span>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
