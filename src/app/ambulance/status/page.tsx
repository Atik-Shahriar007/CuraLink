"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { getPusherClient } from "@/lib/pusherClient";

const LocationMap = dynamic(() => import("@/app/components/LocationMap"), { ssr: false });

interface AmbRequest {
  id: string;
  status: string;
  address: string;
  latitude: number | null;
  longitude: number | null;
  provider: {
    organizationName: string | null;
    account: { firstName: string | null; lastName: string | null; phone: string | null };
  } | null;
}

const statusSteps = ["REQUESTED", "ACCEPTED", "DISPATCHED", "ARRIVED", "COMPLETED"];
const statusLabels: Record<string, string> = {
  REQUESTED: "Request Sent",
  ACCEPTED: "Accepted by Provider",
  DISPATCHED: "Ambulance Dispatched",
  ARRIVED: "Ambulance Arrived",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

export default function AmbulanceStatusPage() {
  const [requests, setRequests] = useState<AmbRequest[]>([]);
  const [loading, setLoading] = useState(true);

  function fetchRequests() {
    fetch("/api/ambulance/my-requests")
      .then((res) => res.json())
      .then(setRequests)
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    if (requests.length === 0) return;
    const pusher = getPusherClient();
    const channels = requests
      .filter((r) => !["COMPLETED", "CANCELED"].includes(r.status))
      .map((r) => {
        const channel = pusher.subscribe(`ambulance-request-${r.id}`);
        channel.bind("status-update", () => fetchRequests());
        return channel;
      });
    return () => {
      channels.forEach((c) => {
        c.unbind_all();
        pusher.unsubscribe(c.name);
      });
    };
  }, [requests.length]);

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-8">Loading...</p>;

  const active = requests.filter((r) => !["COMPLETED", "CANCELED"].includes(r.status));
  const past = requests.filter((r) => ["COMPLETED", "CANCELED"].includes(r.status));

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Ambulance Requests</h1>
        <Link href="/ambulance/request" className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700">
          + New Request
        </Link>
      </div>

      {active.length === 0 && (
        <p className="text-gray-500 mb-8">No active requests right now.</p>
      )}

      {active.map((r) => (
        <div key={r.id} className="border-2 border-red-200 rounded-xl p-5 bg-red-50 mb-6">
          <div className="flex gap-2 mb-4">
            {statusSteps.map((step) => {
              const currentIndex = statusSteps.indexOf(r.status);
              const stepIndex = statusSteps.indexOf(step);
              const isDone = stepIndex <= currentIndex;
              return (
                <div
                  key={step}
                  className={`flex-1 h-2 rounded-full ${isDone ? "bg-red-600" : "bg-red-100"}`}
                />
              );
            })}
          </div>
          <p className="font-semibold text-lg">{statusLabels[r.status]}</p>
          <p className="text-sm text-gray-600 mt-1">{r.address}</p>

          {r.provider && (
            <div className="mt-3 bg-white rounded-lg p-3 text-sm">
              <p className="font-medium">
                {r.provider.organizationName || `${r.provider.account.firstName} ${r.provider.account.lastName}`}
              </p>
              {r.provider.account.phone && <p className="text-gray-500">{r.provider.account.phone}</p>}
            </div>
          )}

          {r.latitude && r.longitude && (
            <div className="mt-3">
              <LocationMap latitude={r.latitude} longitude={r.longitude} label="Your reported location" />
            </div>
          )}
        </div>
      ))}

      {past.length > 0 && (
        <>
          <h2 className="text-lg font-semibold mb-3">Past Requests</h2>
          <div className="space-y-2">
            {past.map((r) => (
              <div key={r.id} className="border rounded-lg p-3 flex items-center justify-between bg-white">
                <p className="text-sm">{r.address}</p>
                <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                  {statusLabels[r.status]}
                </span>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}