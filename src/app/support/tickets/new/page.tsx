"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  { value: "BILLING_AND_PAYMENTS", label: "Billing & Payments" },
  { value: "TECHNICAL_ISSUE", label: "Technical Issue" },
  { value: "APPOINTMENT_PROBLEM", label: "Appointment Problem" },
  { value: "AMBULANCE_ISSUE", label: "Ambulance Issue" },
  { value: "ACCOUNT_VERIFICATION", label: "Account Verification" },
  { value: "PRESCRIPTION_ISSUE", label: "Prescription Issue" },
  { value: "GENERAL_INQUIRY", label: "General Inquiry" },
  { value: "OTHER", label: "Other" },
];

export default function NewTicketPage() {
  const router = useRouter();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0].value);
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/support/tickets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subject, category, message }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not create ticket");
        return;
      }

      router.push(`/support/tickets/${data.id}`);
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">New Support Ticket</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          required
          placeholder="Subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        >
          {CATEGORIES.map((c) => (
            <option key={c.value} value={c.value}>{c.label}</option>
          ))}
        </select>
        <textarea
          required
          placeholder="Describe your issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="border rounded-lg px-4 py-3 w-full h-40"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-teal-950 text-white px-6 py-3 rounded-lg font-medium hover:bg-teal-900 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Ticket"}
        </button>
      </form>
    </div>
  );
}