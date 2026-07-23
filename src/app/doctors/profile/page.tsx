"use client";

import { useState, useEffect } from "react";

interface DoctorData {
  photoUrl: string | null;
  description: string | null;
  hospital: string | null;
  specialty: string | null;
  price: number | null;
  degrees: string[];
  certifications: string[];
  experienceLevel: string | null;
}

export default function DoctorProfileEditPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    description: "",
    hospital: "",
    specialty: "",
    price: "",
    degrees: "",
    certifications: "",
    experienceLevel: "LESS_THAN_ONE",
  });
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/doctor/profile")
      .then((res) => res.json())
      .then(({ account, doctor }: { account: any; doctor: DoctorData }) => {
        setForm({
          firstName: account.firstName || "",
          lastName: account.lastName || "",
          phone: account.phone || "",
          description: doctor.description || "",
          hospital: doctor.hospital || "",
          specialty: doctor.specialty || "",
          price: doctor.price?.toString() || "",
          degrees: doctor.degrees?.join(", ") || "",
          certifications: doctor.certifications?.join(", ") || "",
          experienceLevel: doctor.experienceLevel || "LESS_THAN_ONE",
        });
        setPhotoPreview(doctor.photoUrl);
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
      const payload: any = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        description: form.description,
        hospital: form.hospital,
        specialty: form.specialty,
        price: form.price ? parseFloat(form.price) : undefined,
        degrees: form.degrees
          .split(",")
          .map((d) => d.trim())
          .filter(Boolean),
        certifications: form.certifications
          .split(",")
          .map((c) => c.trim())
          .filter(Boolean),
        experienceLevel: form.experienceLevel,
      };

      if (photoFile) {
        payload.photoBase64 = await fileToBase64(photoFile);
      }

      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      setMessage(
        data.isProfileCompleted
          ? "Profile saved and marked complete!"
          : "Profile saved. Fill in all fields to mark it complete."
      );
    } catch {
      setMessage("Something went wrong saving your profile.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-8">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Your Profile</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 rounded-full bg-gray-200 overflow-hidden">
            {photoPreview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
            )}
          </div>
          <input type="file" accept="image/*" onChange={handlePhotoChange} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="First name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            placeholder="Last name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <input
          placeholder="Phone"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <input
          placeholder="Specialty (e.g. Cardiology)"
          value={form.specialty}
          onChange={(e) => setForm({ ...form, specialty: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <input
          placeholder="Hospital"
          value={form.hospital}
          onChange={(e) => setForm({ ...form, hospital: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <input
          type="number"
          placeholder="Price per consultation ($)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <select
          value={form.experienceLevel}
          onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        >
          <option value="LESS_THAN_ONE">Less than 1 year</option>
          <option value="ONE_TO_FIVE">1–5 years</option>
          <option value="FIVE_PLUS">5+ years</option>
        </select>

        <textarea
          placeholder="Description / bio"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full h-24"
        />

        <input
          placeholder="Degrees (comma separated, e.g. MBBS, MD)"
          value={form.degrees}
          onChange={(e) => setForm({ ...form, degrees: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <input
          placeholder="Certifications (comma separated)"
          value={form.certifications}
          onChange={(e) => setForm({ ...form, certifications: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <button
          type="submit"
          disabled={saving}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Profile"}
        </button>

        {message && <p className="text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}