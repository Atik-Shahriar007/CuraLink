"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { getPusherClient } from "@/lib/pusherClient";

const LocationMap = dynamic(() => import("@/app/components/LocationMap"), { ssr: false });

interface AmbRequest {
  id: string;
  status: string;
  address: string;
  situationDescription: string;
  contactPhone: string;
  latitude: number | null;
  longitude: number | null;
  patient: { account: { firstName: string | null; lastName: string | null } };
}

const nextAction: Record<string, { action: string; label: string } | null> = {
  ACCEPTED: { action: "DISPATCHED", label: "Mark Dispatched" },
  DISPATCHED: { action: "ARRIVED", label: "Mark Arrived" },
  ARRIVED: { action: "COMPLETED", label: "Mark Completed" },
};

export default function ProviderRequestsPage() {
  const [unclaimed, setUnclaimed] = useState<AmbRequest[]>([]);
  const [mine, setMine] = useState<AmbRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busyId, setBusyId] = useState<string | null>(null);

  function fetchRequests() {
    fetch("/api/provider/requests")
      .then((res) => res.json())
      .then((data) => {
        setUnclaimed(data.unclaimed || []);
        setMine(data.mine || []);
      })
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchRequests();
    const pusher = getPusherClient();
    const channel = pusher.subscribe("ambulance-requests");
    channel.bind("new-request", () => fetchRequests());
    return () => {
      channel.unbind_all();
      pusher.unsubscribe("ambulance-requests");
    };
  }, []);

  async function handleAction(id: string, action: string) {
    setBusyId(id);
    try {
      const res = await fetch(`/api/provider/requests/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Could not update request");
      }
      fetchRequests();
    } finally {
      setBusyId(null);
    }
  }

  if (loading) return <p className="max-w-4xl mx-auto px-4 py-8">Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Ambulance Requests</h1>

      <h2 className="text-lg font-semibold mb-3">New Requests ({unclaimed.length})</h2>
      {unclaimed.length === 0 ? (
        <p className="text-gray-500 mb-8">No unclaimed requests right now.</p>
      ) : (
        <div className="space-y-4 mb-8">
          {unclaimed.map((r) => (
            <div key={r.id} className="border-2 border-red-200 rounded-xl p-4 bg-red-50">
              <p className="font-medium">
                {r.patient.account.firstName} {r.patient.account.lastName} · {r.contactPhone}
              </p>
              <p className="text-sm text-gray-700 mt-1">{r.situationDescription}</p>
              <p className="text-sm text-gray-500 mt-1">{r.address}</p>
              {r.latitude && r.longitude && (
                <div className="mt-3">
                  <LocationMap latitude={r.latitude} longitude={r.longitude} label="Patient location" />
                </div>
              )}
              <button
                onClick={() => handleAction(r.id, "ACCEPT")}
                disabled={busyId === r.id}
                className="mt-3 bg-red-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-red-700 disabled:opacity-50"
              >
                Accept Request
              </button>
            </div>
          ))}
        </div>
      )}

      <h2 className="text-lg font-semibold mb-3">My Active Requests ({mine.length})</h2>
      {mine.length === 0 ? (
        <p className="text-gray-500">No active requests.</p>
      ) : (
        <div className="space-y-4">
          {mine.map((r) => (
            <div key={r.id} className="border rounded-xl p-4 bg-white">
              <div className="flex items-center justify-between">
                <p className="font-medium">
                  {r.patient.account.firstName} {r.patient.account.lastName} · {r.contactPhone}
                </p>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-blue-100 text-blue-800">
                  {r.status}
                </span>
              </div>
              <p className="text-sm text-gray-500 mt-1">{r.address}</p>
              {r.latitude && r.longitude && (
                <div className="mt-3">
                  <LocationMap latitude={r.latitude} longitude={r.longitude} label="Patient location" />
                </div>
              )}
              <div className="flex gap-2 mt-3">
                {nextAction[r.status] && (
                  <button
                    onClick={() => handleAction(r.id, nextAction[r.status]!.action)}
                    disabled={busyId === r.id}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
                  >
                    {nextAction[r.status]!.label}
                  </button>
                )}
                <button
                  onClick={() => handleAction(r.id, "CANCELED")}
                  disabled={busyId === r.id}
                  className="text-red-600 text-sm hover:underline"
                >
                  Cancel
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}