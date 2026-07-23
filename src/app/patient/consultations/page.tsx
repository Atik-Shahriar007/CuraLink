"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Consultation {
  id: string;
  date: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";
  doctor: {
    id: string;
    specialty: string | null;
    photoUrl: string | null;
    account: { firstName: string | null; lastName: string | null };
  };
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELED: "bg-red-100 text-red-700",
};

export default function PatientConsultationsPage() {
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("success") === "true";

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/consultations")
      .then((res) => res.json())
      .then(setConsultations)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">My Consultations</h1>

      {justPaid && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 mb-6">
          Payment successful! Your consultation has been booked.
        </div>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : consultations.length === 0 ? (
        <p className="text-gray-500">
          You have no consultations yet.{" "}
          <Link href="/doctors" className="text-blue-600 hover:underline">
            Find a doctor
          </Link>
        </p>
      ) : (
        <div className="space-y-4">
          {consultations.map((c) => (
            <div
              key={c.id}
              className="border rounded-xl p-4 flex items-center justify-between bg-white"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                  {c.doctor.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={c.doctor.photoUrl}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div>
                  <p className="font-medium">
                    Dr. {c.doctor.account.firstName} {c.doctor.account.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{c.doctor.specialty}</p>
                  <p className="text-sm text-gray-500">
                    {new Date(c.date).toLocaleString()}
                  </p>
                </div>
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