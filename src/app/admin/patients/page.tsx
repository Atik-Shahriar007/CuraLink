"use client";

import { useState, useEffect } from "react";

interface Patient {
  id: string;
  account: {
    email: string;
    firstName: string | null;
    lastName: string | null;
    createdAt: string;
  };
  consultations: { id: string }[];
}

export default function AdminPatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/patients")
      .then((res) => res.json())
      .then(setPatients)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : patients.length === 0 ? (
        <p className="text-gray-500">No patients yet.</p>
      ) : (
        <div className="space-y-3">
          {patients.map((p) => (
            <div
              key={p.id}
              className="border rounded-xl p-4 flex items-center justify-between bg-white"
            >
              <div>
                <p className="font-medium">
                  {p.account.firstName || "—"} {p.account.lastName || ""}
                </p>
                <p className="text-sm text-gray-500">{p.account.email}</p>
                <p className="text-sm text-gray-400">
                  Joined {new Date(p.account.createdAt).toLocaleDateString()}
                </p>
              </div>
              <span className="text-sm text-gray-600">
                {p.consultations.length} consultation
                {p.consultations.length !== 1 ? "s" : ""}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}