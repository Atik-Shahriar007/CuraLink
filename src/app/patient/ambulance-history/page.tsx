"use client";

import { useState, useEffect } from "react";
import { Truck, MapPin, Phone, Clock, CheckCircle, XCircle } from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";

type AmbulanceStatus =
  | "REQUESTED"
  | "ACCEPTED"
  | "DISPATCHED"
  | "ARRIVED"
  | "COMPLETED"
  | "CANCELED";

interface AmbulanceRequest {
  id: string;
  createdAt: string;
  status: AmbulanceStatus;
  address: string;
  situationDescription?: string;
  contactPhone?: string;
  latitude?: number;
  longitude?: number;
  provider?: {
    account: { firstName: string; lastName: string };
  };
}

const STATUS_STEPS: AmbulanceStatus[] = [
  "REQUESTED",
  "ACCEPTED",
  "DISPATCHED",
  "ARRIVED",
  "COMPLETED",
];

const STATUS_LABELS: Record<AmbulanceStatus, string> = {
  REQUESTED: "Requested",
  ACCEPTED: "Accepted",
  DISPATCHED: "Dispatched",
  ARRIVED: "Arrived",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

const STATUS_BADGE: Record<AmbulanceStatus, string> = {
  REQUESTED: "bg-amber-50 text-amber-700",
  ACCEPTED: "bg-blue-50 text-blue-700",
  DISPATCHED: "bg-teal-50 text-teal-700",
  ARRIVED: "bg-purple-50 text-purple-700",
  COMPLETED: "bg-green-50 text-green-700",
  CANCELED: "bg-red-50 text-red-700",
};

function StatusTimeline({ status }: { status: AmbulanceStatus }) {
  if (status === "CANCELED") {
    return (
      <div className="flex items-center gap-2 text-red-500 text-sm">
        <XCircle size={16} /> Request was canceled
      </div>
    );
  }

  const currentIdx = STATUS_STEPS.indexOf(status);

  return (
    <div className="flex items-center gap-1 flex-wrap mt-3">
      {STATUS_STEPS.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        return (
          <div key={step} className="flex items-center gap-1">
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                isCurrent
                  ? "bg-teal-950 text-white"
                  : isCompleted
                  ? "bg-green-100 text-green-700"
                  : "bg-stone-100 text-stone-400"
              }`}
            >
              {isCompleted ? <CheckCircle size={12} /> : null}
              {STATUS_LABELS[step]}
            </div>
            {idx < STATUS_STEPS.length - 1 && (
              <div
                className={`w-4 h-0.5 ${
                  idx < currentIdx ? "bg-green-300" : "bg-stone-200"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function AmbulanceHistoryPage() {
  const [requests, setRequests] = useState<AmbulanceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/ambulance-history")
      .then((res) => res.json())
      .then(({ requests }) => setRequests(requests || []))
      .catch(() => setRequests([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-stone-500">Loading ambulance history...</p>;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display mb-1">Ambulance History</h1>
        <p className="text-stone-500">Track all your past and active ambulance requests.</p>
      </div>

      {requests.length === 0 ? (
        <DashboardCard>
          <div className="text-center py-12 text-stone-400">
            <Truck size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-stone-600">No ambulance requests</p>
            <p className="text-sm mt-1">Your emergency request history will appear here.</p>
          </div>
        </DashboardCard>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req.id}
              className="bg-white border border-stone-200 rounded-2xl p-5"
            >
              {/* Top row */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Truck size={18} className="text-red-500" />
                  </div>
                  <div>
                    <p className="font-semibold text-stone-900">
                      Emergency Request
                    </p>
                    <p className="text-xs text-stone-400 flex items-center gap-1">
                      <Clock size={12} />
                      {new Date(req.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                <span
                  className={`text-xs font-medium px-2.5 py-1 rounded-full flex-shrink-0 ${
                    STATUS_BADGE[req.status]
                  }`}
                >
                  {STATUS_LABELS[req.status]}
                </span>
              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <div className="flex items-start gap-2 text-sm text-stone-600">
                  <MapPin size={14} className="text-stone-400 mt-0.5 flex-shrink-0" />
                  <span>{req.address || "—"}</span>
                </div>
                {req.contactPhone && (
                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Phone size={14} className="text-stone-400 flex-shrink-0" />
                    <span>{req.contactPhone}</span>
                  </div>
                )}
                {req.situationDescription && (
                  <div className="sm:col-span-2 text-sm text-stone-500 bg-stone-50 rounded-lg p-2.5">
                    <strong className="text-stone-700">Situation: </strong>
                    {req.situationDescription}
                  </div>
                )}
                {req.provider && (
                  <div className="text-sm text-stone-600">
                    <span className="text-stone-400">Provider: </span>
                    {req.provider.account.firstName} {req.provider.account.lastName}
                  </div>
                )}
                {req.latitude && req.longitude && (
                  <div className="text-sm text-stone-400 flex items-center gap-1">
                    <MapPin size={12} />
                    {req.latitude.toFixed(4)}, {req.longitude.toFixed(4)}
                  </div>
                )}
              </div>

              {/* Status Timeline */}
              <StatusTimeline status={req.status} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
