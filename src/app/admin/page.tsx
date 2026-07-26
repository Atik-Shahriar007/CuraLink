"use client";

import { useState, useEffect } from "react";

interface Doctor {
  id: string;
  specialty: string | null;
  hospital: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  account: {
    email: string;
    firstName: string | null;
    lastName: string | null;
  };
}

export default function AdminDashboardPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function fetchDoctors() {
    setLoading(true);
    fetch("/api/admin/doctors")
      .then((res) => res.json())
      .then(setDoctors)
      .finally(() => setLoading(false));
  }

  useEffect(fetchDoctors, []);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/doctors/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: status }),
      });
      fetchDoctors();
    } finally {
      setUpdatingId(null);
    }
  }

  const pending = doctors.filter((d) => d.approvalStatus === "PENDING");
  const others = doctors.filter((d) => d.approvalStatus !== "PENDING");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <h2 className="text-lg font-semibold mb-3">
        Pending Approval ({pending.length})
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pending.length === 0 ? (
        <p className="text-gray-500 mb-8">No doctors awaiting approval.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((d) => (
            <div
              key={d.id}
              className="border rounded-xl p-4 flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-medium">
                  Dr. {d.account.firstName} {d.account.lastName}
                </p>
                <p className="text-sm text-gray-500">{d.account.email}</p>
                <p className="text-sm text-gray-500">
                  {d.specialty} · {d.hospital}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(d.id, "APPROVED")}
                  disabled={updatingId === d.id}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                >
                  Approve
                </button>
                <button
                  onClick={() => updateStatus(d.id, "REJECTED")}
                  disabled={updatingId === d.id}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
                >
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">All Doctors</h2>
      {others.length === 0 ? (
        <p className="text-gray-500">No other doctors yet.</p>
      ) : (
        <div className="space-y-3">
          {others.map((d) => (
            <div
              key={d.id}
              className="border rounded-xl p-4 flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-medium">
                  Dr. {d.account.firstName} {d.account.lastName}
                </p>
                <p className="text-sm text-gray-500">{d.account.email}</p>
              </div>
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${
                  d.approvalStatus === "APPROVED"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {d.approvalStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}