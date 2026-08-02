"use client";

import { useState, useEffect } from "react";

interface Provider {
  id: string;
  organizationName: string | null;
  serviceArea: string | null;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  account: { email: string; firstName: string | null; lastName: string | null };
}

export default function AdminProvidersPage() {
  const [providers, setProviders] = useState<Provider[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  function fetchProviders() {
    setLoading(true);
    fetch("/api/admin/providers")
      .then((res) => res.json())
      .then(setProviders)
      .finally(() => setLoading(false));
  }

  useEffect(fetchProviders, []);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    setUpdatingId(id);
    try {
      await fetch(`/api/admin/providers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approvalStatus: status }),
      });
      fetchProviders();
    } finally {
      setUpdatingId(null);
    }
  }

  const pending = providers.filter((p) => p.approvalStatus === "PENDING");
  const others = providers.filter((p) => p.approvalStatus !== "PENDING");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ambulance Provider Approval</h1>

      <h2 className="text-lg font-semibold mb-3">Pending Approval ({pending.length})</h2>
      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : pending.length === 0 ? (
        <p className="text-gray-500 mb-8">No providers awaiting approval.</p>
      ) : (
        <div className="space-y-3 mb-8">
          {pending.map((p) => (
            <div key={p.id} className="border rounded-xl p-4 flex items-center justify-between bg-white">
              <div>
                <p className="font-medium">{p.organizationName || "Unnamed Provider"}</p>
                <p className="text-sm text-gray-500">{p.account.email}</p>
                <p className="text-sm text-gray-500">{p.serviceArea}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => updateStatus(p.id, "APPROVED")} disabled={updatingId === p.id} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 disabled:opacity-50">
                  Approve
                </button>
                <button onClick={() => updateStatus(p.id, "REJECTED")} disabled={updatingId === p.id} className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50">
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">All Providers</h2>
      {others.length === 0 ? (
        <p className="text-gray-500">No other providers yet.</p>
      ) : (
        <div className="space-y-2">
          {others.map((p) => (
            <div key={p.id} className="border rounded-lg p-3 flex items-center justify-between bg-white">
              <p className="text-sm font-medium">{p.organizationName || p.account.email}</p>
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${p.approvalStatus === "APPROVED" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}`}>
                {p.approvalStatus}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}