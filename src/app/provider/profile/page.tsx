"use client";

import { useState, useEffect } from "react";
import { Camera } from "lucide-react";
import AccountSettingsCard from "@/app/components/AccountSettingsCard";

export default function ProviderProfilePage() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "",
    organizationName: "", vehicleInfo: "", serviceArea: "",
    licenseNumber: "", operatingHours: "",
  });
  const [approvalStatus, setApprovalStatus] = useState("PENDING");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
          licenseNumber: provider.licenseNumber || "",
          operatingHours: provider.operatingHours || "",
        });
        setPhotoPreview(provider.photoUrl || null);
        setApprovalStatus(provider.approvalStatus);
      })
      .finally(() => setLoading(false));
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload: any = { ...form };
      if (photoFile) payload.photoBase64 = await fileToBase64(photoFile);

      const res = await fetch("/api/provider/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong.");
      setMessage("Profile saved.");
      setPhotoFile(null);
      if (data.provider?.photoUrl) setPhotoPreview(data.provider.photoUrl);
    } catch (err: any) {
      setMessage(err.message || "Something went wrong.");
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
    <div className="max-w-2xl">
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
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-stone-100 overflow-hidden flex-shrink-0">
            {photoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="" className="w-full h-full object-cover" />
            )}
          </div>
          <label className="flex items-center gap-2 text-sm border border-stone-300 px-3 py-2 rounded-lg cursor-pointer hover:bg-stone-50">
            <Camera size={14} /> Change photo
            <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
          </label>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border rounded-lg px-4 py-2" />
          <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border rounded-lg px-4 py-2" />
        </div>
        <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Organization / Hospital Name" value={form.organizationName} onChange={(e) => setForm({ ...form, organizationName: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Vehicle Info (e.g. plate number, type)" value={form.vehicleInfo} onChange={(e) => setForm({ ...form, vehicleInfo: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Service Area (e.g. Dhaka North)" value={form.serviceArea} onChange={(e) => setForm({ ...form, serviceArea: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="License / Registration Number" value={form.licenseNumber} onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />
        <input placeholder="Operating Hours (e.g. 24/7, or 8am-8pm)" value={form.operatingHours} onChange={(e) => setForm({ ...form, operatingHours: e.target.value })} className="border rounded-lg px-4 py-2 w-full" />

        <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50">
          {saving ? "Saving..." : "Save Profile"}
        </button>
        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>

      <AccountSettingsCard />
    </div>
  );
}
