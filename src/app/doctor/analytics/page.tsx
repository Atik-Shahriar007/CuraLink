"use client";

import { useState, useEffect } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  Legend, ResponsiveContainer,
} from "recharts";

interface Analytics {
  consultationsSeries: { month: string; booked: number; completed: number }[];
  earningsSeries: { month: string; earnings: number }[];
  ratingSeries: { month: string; rating: number | null }[];
  totals: {
    totalEarnings: number;
    totalConsultations: number;
    completedConsultations: number;
    avgRating: number | null;
    reviewCount: number;
  };
}

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="border rounded-xl p-4 bg-white">
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-2xl font-bold mt-1">{value}</p>
    </div>
  );
}

export default function DoctorAnalyticsPage() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/doctor/analytics")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="max-w-4xl mx-auto px-4 py-8">Loading analytics...</p>;
  if (!data) return <p className="max-w-4xl mx-auto px-4 py-8">Could not load analytics.</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Analytics</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Earnings" value={`$${data.totals.totalEarnings.toFixed(2)}`} />
        <StatCard label="Total Consultations" value={data.totals.totalConsultations} />
        <StatCard label="Completed" value={data.totals.completedConsultations} />
        <StatCard
          label="Average Rating"
          value={data.totals.avgRating ? `★ ${data.totals.avgRating.toFixed(1)} (${data.totals.reviewCount})` : "No reviews yet"}
        />
      </div>

      <div className="border rounded-xl p-5 bg-white mb-8">
        <h2 className="font-semibold mb-4">Earnings Over Time</h2>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={data.earningsSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Line type="monotone" dataKey="earnings" stroke="#B5541B" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-5 bg-white mb-8">
        <h2 className="font-semibold mb-4">Consultations Over Time</h2>
        <ResponsiveContainer width="100%" height={240}>
          <BarChart data={data.consultationsSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" fontSize={12} />
            <YAxis fontSize={12} />
            <Tooltip />
            <Legend />
            <Bar dataKey="booked" fill="#0F3D3E" />
            <Bar dataKey="completed" fill="#B5541B" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="border rounded-xl p-5 bg-white">
        <h2 className="font-semibold mb-4">Rating Trend</h2>
        {data.totals.reviewCount === 0 ? (
          <p className="text-sm text-gray-500">No reviews yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={data.ratingSeries}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" fontSize={12} />
              <YAxis domain={[0, 5]} fontSize={12} />
              <Tooltip />
              <Line type="monotone" dataKey="rating" stroke="#C9A227" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}