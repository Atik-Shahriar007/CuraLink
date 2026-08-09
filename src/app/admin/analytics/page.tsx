"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

interface Analytics {
  revenueSeries: { month: string; revenue: number }[];
  consultationsSeries: { month: string; booked: number; completed: number; canceled: number }[];
  signupsSeries: { month: string; patients: number; doctors: number }[];
  topRated: { id: string; name: string; avgRating: number; reviewCount: number }[];
  mostActive: { id: string; name: string; consultationCount: number; completedCount: number }[];
  ticketsByStatus: Record<string, number>;
  avgResolutionHours: number | null;
  ambulanceByStatus: Record<string, number>;
  totals: { totalRevenue: number; totalConsultations: number; totalPatients: number; totalDoctors: number };
}

const COLORS = ["#0F3D3E", "#B5541B", "#D97B3F", "#8A9A9A", "#C9A227"];

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="max-w-6xl mx-auto px-4 py-8">Loading analytics...</p>;
  if (!data) return <p className="max-w-6xl mx-auto px-4 py-8">Could not load analytics.</p>;

  const ticketPieData = Object.entries(data.ticketsByStatus).map(([name, value]) => ({ name, value }));
  const ambulancePieData = Object.entries(data.ambulanceByStatus).map(([name, value]) => ({ name, value }));

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Platform Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Revenue" value={`$${data.totals.totalRevenue.toFixed(2)}`} />
        <StatCard label="Total Consultations" value={data.totals.totalConsultations} />
        <StatCard label="Total Patients" value={data.totals.totalPatients} />
        <StatCard label="Total Doctors" value={data.totals.totalDoctors} />
      </div>

      <div className="border rounded-xl p-5 bg-white mb-8">
        <h2 className="font-semibold mb-4">Revenue Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.revenueSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#B5541B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-5 bg-white mb-8">
        <h2 className="font-semibold mb-4">Consultations Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={data.consultationsSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="booked" fill="#0F3D3E" />
            <Bar dataKey="completed" fill="#B5541B" />
            <Bar dataKey="canceled" fill="#C9A227" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-5 bg-white mb-8">
        <h2 className="font-semibold mb-4">New Signups Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={data.signupsSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="patients" stroke="#0F3D3E" strokeWidth={2} />
            <Line type="monotone" dataKey="doctors" stroke="#B5541B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-semibold mb-4">Top-Rated Doctors</h2>
          {data.topRated.length === 0 ? (
            <p className="text-sm text-gray-500">No rated doctors yet.</p>
          ) : (
            <div className="space-y-2">
              {data.topRated.map((d) => (
                <div key={d.id} className="flex justify-between text-sm">
                  <span>{d.name}</span>
                  <span className="text-amber-500">★ {d.avgRating.toFixed(1)} ({d.reviewCount})</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-semibold mb-4">Most Active Doctors</h2>
          {data.mostActive.length === 0 ? (
            <p className="text-sm text-gray-500">No data yet.</p>
          ) : (
            <div className="space-y-2">
              {data.mostActive.map((d) => (
                <div key={d.id} className="flex justify-between text-sm">
                  <span>{d.name}</span>
                  <span className="text-gray-500">{d.consultationCount} consultations</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-semibold mb-4">
            Support Tickets
            {data.avgResolutionHours !== null && (
              <span className="text-sm text-gray-400 font-normal ml-2">
                (avg resolution: {data.avgResolutionHours.toFixed(1)}h)
              </span>
            )}
          </h2>
          {ticketPieData.length === 0 ? (
            <p className="text-sm text-gray-500">No tickets yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ticketPieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {ticketPieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="border rounded-xl p-5 bg-white">
          <h2 className="font-semibold mb-4">Ambulance Requests</h2>
          {ambulancePieData.length === 0 ? (
            <p className="text-sm text-gray-500">No requests yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={ambulancePieData} dataKey="value" nameKey="name" outerRadius={80} label>
                  {ambulancePieData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}