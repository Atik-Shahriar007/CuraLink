"use client";

import { useState, useEffect } from "react";

export default function ProviderProfilePage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    organizationName: "", vehicleInfo: "", serviceArea: "",
  });
  const [approvalStatus, setApprovalStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/provider/profile")
      .then((res) => res.json())
      .then(({ account, provider }: { account: any; provider: any }) => {
        setForm({
          firstName: account.firstName || "",
          lastName: account.lastName || "",
          phone: account.phone || "",
          organizationName: provider.organizationName || "",
          vehicleInfo: provider.vehicleInfo || "",
          serviceArea: provider.serviceArea || "",
        });
        setApprovalStatus(provider.approvalStatus);
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/provider/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      setMessage("Profile saved.");
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-8">Loading...</p>;

  const statusStyles: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    APPROVED: "bg-emerald-100 text-emerald-800",
    REJECTED: "bg-red-100 text-red-700",
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Ambulance Provider Profile</h1>
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusStyles[approvalStatus]}`}>
          {approvalStatus}
        </span>
      </div>

      {approvalStatus === "PENDING" && (
        <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-lg px-4 py-3 mb-6 text-sm">
          Your account is awaiting admin approval. You won't receive requests until approved.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border rounded-lg px-4 py-2" />
          <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border rounded-lg px-4 py-2" />
        </div>
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Organization / Hospital Name" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Vehicle Info (e.g. plate number, type)" value={form.vehicleInfo} onChange={(e) => setForm({ ...form, vehicleInfo: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Service Area (e.g. Dhaka North)" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}