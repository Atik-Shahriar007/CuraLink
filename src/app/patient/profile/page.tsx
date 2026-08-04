"use client";

import { useState, useEffect } from "react";
import {
  User, Mail, Phone, MapPin, Calendar, HeartPulse, Ruler, Weight, Droplet,
  AlertTriangle, Activity, Pill, ShieldAlert, Pencil,
} from "lucide-react";

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-100 last:border-0">
      <Icon size={18} className="text-stone-400 flex-shrink-0" />
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-wide">{label}</p>
        <p className="text-stone-900">{value || "—"}</p>
      </div>
    </div>
  );
}

function MedTile({ icon: Icon, value, label }: { icon: any; value: string; label: string }) {
  return (
    <div className="bg-stone-50 rounded-xl px-4 py-5 text-center">
      <Icon size={18} className="text-teal-800 mx-auto mb-2" />
      <p className="font-semibold text-stone-900">{value || "—"}</p>
      <p className="text-xs text-stone-400 uppercase tracking-wide mt-1">{label}</p>
    </div>
  );
}

function ListField({ icon: Icon, label, items }: { icon: any; label: string; items: string[] }) {
  return (
    <div>
      <p className="flex items-center gap-2 text-sm font-medium text-stone-700 mb-1">
        <Icon size={15} className="text-stone-400" /> {label}
      </p>
      <p className="text-sm text-stone-500">
        {items.length > 0 ? items.join(", ") : "None reported"}
      </p>
    </div>
  );
}

export default function PatientProfilePage() {
  const [account, setAccount] = useState<any>(null);
  const [patient, setPatient] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editingBasic, setEditingBasic] = useState(false);
  const [editingMedical, setEditingMedical] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", age: "", address: "", city: "", zipCode: "",
    weight: "", height: "", gender: "MALE", bloodType: "O_POS",
    allergies: "", chronicConditions: "", currentMedications: "",
    emergencyContactName: "", emergencyContactPhone: "",
  });

  useEffect(() => {
    fetch("/api/patient/profile")
      .then((res) => res.json())
      .then(({ account, patient }: { account: any; patient: any }) => {
        setAccount(account);
        setPatient(patient);
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

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const payload = {
        firstName: form.firstName, lastName: form.lastName, phone: form.phone,
        age: form.age ? parseInt(form.age) : undefined,
        address: form.address, city: form.city, zipCode: form.zipCode,
        weight: form.weight ? parseFloat(form.weight) : undefined,
        height: form.height ? parseFloat(form.height) : undefined,
        gender: form.gender, bloodType: form.bloodType,
        allergies: form.allergies.split(",").map((s) => s.trim()).filter(Boolean),
        chronicConditions: form.chronicConditions.split(",").map((s) => s.trim()).filter(Boolean),
        currentMedications: form.currentMedications.split(",").map((s) => s.trim()).filter(Boolean),
        emergencyContactName: form.emergencyContactName,
        emergencyContactPhone: form.emergencyContactPhone,
      };
      const res = await fetch("/api/patient/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("Profile updated.");
        setEditingBasic(false);
        setEditingMedical(false);
        // refetch to reflect saved state
        const refreshed = await fetch("/api/patient/profile").then((r) => r.json());
        setAccount(refreshed.account);
        setPatient(refreshed.patient);
      }
    } finally {
      setSaving(false);
    }
  }

  if (loading || !account || !patient) return <p className="text-stone-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <h1 className="text-2xl font-bold font-display mb-6">Profile</h1>

      {/* Basic info card */}
      <div className="border border-stone-200 rounded-2xl bg-white p-6 mb-6">
        {!editingBasic ? (
          <>
            <InfoRow icon={User} label="Full name" value={`${account.firstName || ""} ${account.lastName || ""}`.trim()} />
            <InfoRow icon={Mail} label="Email" value={account.email} />
            <InfoRow icon={Phone} label="Phone" value={account.phone} />
            <InfoRow icon={MapPin} label="Address" value={[account.address, account.city, account.zipCode].filter(Boolean).join(", ")} />
            <InfoRow icon={Calendar} label="Member since" value={new Date(account.createdAt).toLocaleDateString()} />
            <button
              onClick={() => setEditingBasic(true)}
              className="mt-4 flex items-center gap-2 bg-teal-950 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-900"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Age" value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <input placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Zip code" value={form.zipCode} onChange={(e) => setForm({ ...form, zipCode: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditingBasic(false)} className="text-stone-500 text-sm px-3">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {/* Medical info card */}
      <div className="border border-stone-200 rounded-2xl bg-white p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="flex items-center gap-2 font-semibold">
            <HeartPulse size={18} className="text-teal-800" /> Medical Information
          </h2>
          {!editingMedical && (
            <button
              onClick={() => setEditingMedical(true)}
              className="flex items-center gap-1 text-sm border border-stone-300 px-3 py-1.5 rounded-lg hover:bg-stone-50"
            >
              <Pencil size={13} /> Edit
            </button>
          )}
        </div>

        {!editingMedical ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
              <MedTile icon={User} value={patient.gender || "—"} label="Gender" />
              <MedTile icon={Ruler} value={patient.height ? `${patient.height} cm` : "—"} label="Height" />
              <MedTile icon={Weight} value={patient.weight ? `${patient.weight} kg` : "—"} label="Weight" />
              <MedTile icon={Droplet} value={patient.bloodType?.replace("_", " ") || "—"} label="Blood Type" />
            </div>
            <div className="grid sm:grid-cols-3 gap-4 mb-4">
              <ListField icon={AlertTriangle} label="Allergies" items={patient.allergies || []} />
              <ListField icon={Activity} label="Chronic Conditions" items={patient.chronicConditions || []} />
              <ListField icon={Pill} label="Current Medications" items={patient.currentMedications || []} />
            </div>
            <div className="flex items-center gap-2 text-sm text-stone-500 pt-3 border-t border-stone-100">
              <ShieldAlert size={15} className="text-stone-400" />
              Emergency contact: {patient.emergencyContactName || "—"}
              {patient.emergencyContactPhone && ` · ${patient.emergencyContactPhone}`}
            </div>
          </>
        ) : (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <input type="number" placeholder="Weight (kg)" value={form.weight} onChange={(e) => setForm({ ...form, weight: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
              <input type="number" placeholder="Height (cm)" value={form.height} onChange={(e) => setForm({ ...form, height: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <select value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              <select value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} className="border rounded-lg px-3 py-2 text-sm">
                {["A_POS","A_NEG","B_POS","B_NEG","AB_POS","AB_NEG","O_POS","O_NEG"].map((bt) => (
                  <option key={bt} value={bt}>{bt.replace("_", " ")}</option>
                ))}
              </select>
            </div>
            <input placeholder="Allergies (comma separated)" value={form.allergies} onChange={(e) => setForm({ ...form, allergies: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <input placeholder="Chronic conditions (comma separated)" value={form.chronicConditions} onChange={(e) => setForm({ ...form, chronicConditions: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <input placeholder="Current medications (comma separated)" value={form.currentMedications} onChange={(e) => setForm({ ...form, currentMedications: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <div className="grid grid-cols-2 gap-3">
              <input placeholder="Emergency contact name" value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Emergency contact phone" value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditingMedical(false)} className="text-stone-500 text-sm px-3">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {message && <p className="text-sm text-green-700 mt-4">{message}</p>}
    </div>
  );
}