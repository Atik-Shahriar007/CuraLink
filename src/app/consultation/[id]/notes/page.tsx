"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function ConsultationNotesPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { account, loading: authLoading } = useAuth();

  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const isDoctor = account?.role === "DOCTOR";

  useEffect(() => {
    if (authLoading) return;
    if (!account) {
      router.push("/login");
      return;
    }

    fetch(`/api/consultations/${id}/notes`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
          setError(data.error || "Could not load notes");
          return;
        }
        setNotes(data.notes || "");
      })
      .finally(() => setLoading(false));
  }, [id, account, authLoading, router]);

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch(`/api/consultations/${id}/notes`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ notes }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save notes");
        return;
      }

      setMessage("Notes saved.");
    } catch {
      setError("Something went wrong saving notes.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-8">Loading...</p>;

  if (error && !notes) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">
        {isDoctor ? "Consultation Notes / Prescription" : "Notes from Your Doctor"}
      </h1>
      <p className="text-gray-500 mb-6">
        {isDoctor
          ? "Add advice, diagnosis, or prescription details for the patient to see."
          : "Advice and prescription details left by your doctor after this consultation."}
      </p>

      {isDoctor ? (
        <>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="e.g. Diagnosis, medication and dosage, follow-up advice..."
            className="w-full border rounded-lg px-4 py-3 h-64 text-sm"
          />
          <button
            onClick={handleSave}
            disabled={saving}
            className="mt-4 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Notes"}
          </button>
          {message && <p className="text-sm text-green-700 mt-3">{message}</p>}
          {error && <p className="text-sm text-red-600 mt-3">{error}</p>}
        </>
      ) : (
        <div className="border rounded-xl p-5 bg-gray-50 whitespace-pre-wrap text-sm text-gray-800 min-h-[120px]">
          {notes || "No notes have been added yet for this consultation."}
        </div>
      )}
    </div>
  );
}