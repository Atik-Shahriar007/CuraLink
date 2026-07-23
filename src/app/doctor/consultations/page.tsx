"use client";

import { useState, useEffect } from "react";

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

  useEffect(() => {
    fetch("/api/doctor/consultations")
      .then((res) => res.json())
      .then(setConsultations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Consultations</h1>

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
              <span
                className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[c.status]}`}
              >
                {c.status.replace("_", " ")}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}