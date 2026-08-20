"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/AuthContext";
import { getPusherClient } from "@/lib/pusherClient";

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
  prescription: { id: string; revision: number; updatedAt: string } | null;
}

interface PrescriptionAlert {
  consultationId: string;
  isUpdate: boolean;
  doctorName: string;
}

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  IN_PROGRESS: "bg-green-100 text-green-800",
  COMPLETED: "bg-gray-100 text-gray-700",
  CANCELED: "bg-red-100 text-red-700",
};

function PatientConsultationsContent() {
  const searchParams = useSearchParams();
  const justPaid = searchParams.get("success") === "true";

  const { account } = useAuth();
  const patientId = account?.patient?.id;

  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<PrescriptionAlert | null>(null);
  const [cancelingId, setCancelingId] = useState<string | null>(null);
  const [cancelResult, setCancelResult] = useState<string>("");

  const load = useCallback(
    () =>
      fetch("/api/patient/consultations")
        .then((res) => res.json())
        .then((d) => setConsultations(Array.isArray(d) ? d : [])),
    []
  );

  useEffect(() => {
    load().finally(() => setLoading(false));
  }, [load]);

  function refundNoteFor(dateStr: string): string {
    const hours = (new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60);
    if (hours >= 24) return "Canceling now qualifies for a full refund.";
    if (hours >= 2) return "Canceling now qualifies for a 50% refund (less than 24h notice).";
    return "Canceling now is not eligible for a refund (less than 2h notice).";
  }

  async function handleCancel(id: string, dateStr: string) {
    const note = refundNoteFor(dateStr);
    if (!confirm(`Cancel this consultation?\n\n${note}`)) return;

    setCancelingId(id);
    setCancelResult("");
    try {
      const res = await fetch(`/api/consultations/${id}/cancel`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: "Canceled by patient" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCancelResult(data.error || "Could not cancel this consultation.");
      } else {
        setCancelResult(
          data.refundAmount > 0
            ? `Consultation canceled. A refund of $${data.refundAmount.toFixed(2)} has been issued.`
            : "Consultation canceled. No refund was due based on the cancellation policy."
        );
        load();
      }
    } finally {
      setCancelingId(null);
    }
  }

  // Live notice when the doctor writes or edits a prescription.
  useEffect(() => {
    if (!patientId) return;

    const pusher = getPusherClient();
    const channel = pusher.subscribe(`patient-${patientId}`);

    channel.bind("prescription-updated", (data: PrescriptionAlert) => {
      setAlert(data);
      load();
    });

    return () => {
      channel.unbind_all();
      pusher.unsubscribe(`patient-${patientId}`);
    };
  }, [patientId, load]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">My Consultations</h1>

      {justPaid && (
        <div className="bg-green-50 border border-green-200 text-green-800 rounded-lg px-4 py-3 mb-6">
          Payment successful! Your consultation has been booked.
        </div>
      )}

      {cancelResult && (
        <div className="bg-teal-50 border border-teal-200 text-teal-900 rounded-lg px-4 py-3 mb-6">
          {cancelResult}
        </div>
      )}

      {alert && (
        <div className="bg-blue-50 border border-blue-200 text-blue-800 rounded-lg px-4 py-3 mb-6 flex items-center justify-between gap-4">
          <span>
            {alert.doctorName}{" "}
            {alert.isUpdate
              ? "updated your prescription."
              : "sent you a prescription."}
          </span>
          <Link
            href={`/consultation/${alert.consultationId}/notes`}
            className="font-medium hover:underline flex-shrink-0"
          >
            View
          </Link>
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
              <div className="flex items-center gap-3">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[c.status]}`}
                >
                  {c.status.replace("_", " ")}
                </span>
                {c.status === "IN_PROGRESS" && (
                  <Link
                    href={`/consultation/${c.id}`}
                    className="bg-green-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-green-700"
                  >
                    Join
                  </Link>
                )}
                {c.status === "PENDING" && (
                  <button
                    onClick={() => handleCancel(c.id, c.date)}
                    disabled={cancelingId === c.id}
                    className="border border-red-300 text-red-700 text-sm px-4 py-2 rounded-lg hover:bg-red-50 disabled:opacity-50"
                  >
                    {cancelingId === c.id ? "Canceling..." : "Cancel"}
                  </button>
                )}
                {c.status === "COMPLETED" && (
                  <>
                    <Link
                      href={`/consultation/${c.id}/notes`}
                      className="bg-teal-950 text-white text-sm px-4 py-2 rounded-lg hover:bg-teal-900"
                    >
                      View Notes
                    </Link>
                    <Link
                      href={`/consultation/${c.id}/review`}
                      className="bg-amber-500 text-white text-sm px-4 py-2 rounded-lg hover:bg-amber-600"
                    >
                      Rate Doctor
                    </Link>
                  </>
                )}
                {c.prescription && (
                  <Link
                    href={`/consultation/${c.id}/notes`}
                    className="bg-blue-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-blue-700"
                  >
                    {c.prescription.revision > 1
                      ? "Prescription (updated)"
                      : "Prescription"}
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

export default function PatientConsultationsPage() {
  return (
    <Suspense fallback={<div className="text-stone-400">Loading...</div>}>
      <PatientConsultationsContent />
    </Suspense>
  );
}