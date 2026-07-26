"use client";

import { useState, useEffect } from "react";

export default function PatientProfilePage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    age: "",
    address: "",
    city: "",
    zipCode: "",
    weight: "",
    height: "",
    gender: "MALE",
    bloodType: "O_POS",
    allergies: "",
    chronicConditions: "",
    currentMedications: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/patient/profile")
      .then((res) => res.json())
      .then(({ account, patient }: { account: any; patient: any }) => {
        setForm({
          firstName: account.firstName || "",
          lastName: account.lastName || "",
          phone: account.phone || "",
          age: account.age?.toString() || "",
          address: account.address || "",
          city: account.city || "",
          zipCode: account.zipCode || "",
          weight: patient.weight?.toString() || "",
          height: patient.height?.toString() || "",
          gender: patient.gender || "MALE",
          bloodType: patient.bloodType || "O_POS",
          allergies: patient.allergies?.join(", ") || "",
          chronicConditions: patient.chronicConditions?.join(", ") || "",
          currentMedications: patient.currentMedications?.join(", ") || "",
          emergencyContactName: patient.emergencyContactName || "",
          emergencyContactPhone: patient.emergencyContactPhone || "",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      const payload = {
        firstName: form.firstName,
        lastName: form.lastName,
        phone: form.phone,
        age: form.age ? parseInt(form.age) : undefined,
        address: form.address,
        city: form.city,
        zipCode: form.zipCode,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        gender: form.gender,
        bloodType: form.bloodType,
        allergies: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        chronicConditions: form.chronicConditions
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        currentMedications: form.currentMedications
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
      };

      const res = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      const data = await res.json();
      setMessage(
        data.isProfileCompleted
          ? "Profile saved and marked complete!"
          : "Profile saved."
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
      <h1 className="text-2xl font-bold mb-6">My Profile & Health Info</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="font-semibold text-lg pt-2">Personal Information</h2>
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
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="Age"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>
        <input
          placeholder="Address"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="City"
            value={form.city}
            onChange={(e) => setForm({ ...form, city: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            placeholder="Zip code"
            value={form.zipCode}
            onChange={(e) => setForm({ ...form, zipCode: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>

        <h2 className="font-semibold text-lg pt-4">Health Information</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            placeholder="Weight (kg)"
            value={form.weight}
            onChange={(e) => setForm({ ...form, weight: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            type="number"
            placeholder="Height (cm)"
            value={form.height}
            onChange={(e) => setForm({ ...form, height: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <select
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
          <select
            value={form.bloodType}
            onChange={(e) => setForm({ ...form, bloodType: e.target.value })}
            className="border rounded-lg px-4 py-2"
          >
            {["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"].map((bt) => (
              <option key={bt} value={bt}>{bt.replace("_", " ")}</option>
            ))}
          </select>
        </div>
        <input
          placeholder="Allergies (comma separated)"
          value={form.allergies}
          onChange={(e) => setForm({ ...form, allergies: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />
        <input
          placeholder="Chronic conditions (comma separated)"
          value={form.chronicConditions}
          onChange={(e) => setForm({ ...form, chronicConditions: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />
        <input
          placeholder="Current medications (comma separated)"
          value={form.currentMedications}
          onChange={(e) => setForm({ ...form, currentMedications: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <h2 className="font-semibold text-lg pt-4">Emergency Contact</h2>
        <div className="grid grid-cols-2 gap-4">
          <input
            placeholder="Contact name"
            value={form.emergencyContactName}
            onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
          <input
            placeholder="Contact phone"
            value={form.emergencyContactPhone}
            onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
            className="border rounded-lg px-4 py-2"
          />
        </div>

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