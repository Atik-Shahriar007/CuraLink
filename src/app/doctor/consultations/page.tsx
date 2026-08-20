"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Consultation {
  id: string;
  date: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  patient: {
    id: string;
    account: { firstName: string | null; lastName: string | null };
  };
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELED: "bg-red-100 text-red-700",
};

export default function DoctorConsultationsPage() {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelResult, setCancelResult] = useState("");

  const load = useCallback(
    () =>
      fetch("/api/doctor/consultations")
        .then((res) => res.json())
        .then((d) => setConsultations(Array.isArray(d) ? d : [])),
    []
  );

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  async function handleCancel(id: string) {
    if (
      !confirm(
        "Cancel this consultation? Since you're canceling (not the patient), the patient will receive a full refund."
      )
    )
      return;

    setCancelingId(id);
    setCancelResult("");
    try {
      const res = await fetch(`/api/consultations/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Canceled by doctor" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelResult(data.error || "Could not cancel this consultation.");
      } else {
        setCancelResult("Consultation canceled and the patient has been refunded in full.");
        load();
      }
    } finally {
      setCancelingId(null);
    }
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Consultations</h1>

      {cancelResult && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-lg px-4 py-3 mb-6">
          {cancelResult}
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : consultations.length === 0 ? (
        <p className="text-gray-500">You have no consultations yet.</p>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-medium">
                  {c.patient.account.firstName} {c.patient.account.lastName}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(c.date).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[c.status]}`}
                >
                  {c.status.replace("_", " ")}
                </span>
                {(c.status === "IN_PROGRESS" || c.status === "COMPLETED") && (
                  <Link
                    href={`/doctor/patients/${c.patient.id}/records`}
                    className="border border-stone-300 text-stone-700 text-sm px-4 py-2 rounded-lg hover:bg-stone-50"
                  >
                    Patient Records
                  </Link>
                )}
                {c.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(c.id)}
                    disabled={cancelingId === c.id}
                    className="border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {cancelingId === c.id ? "Canceling..." : "Cancel"}
                  </button>
                )}
                {c.status === "IN_PROGRESS" && (
                  <Link
                    href={`/consultation/${c.id}`}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Join
                  </Link>
                )}
                {c.status === "COMPLETED" && (
                  <Link
                    href={`/consultation/${c.id}/notes`}
                    className="bg-teal-950 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-900"
                  >
                    Add Notes
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
