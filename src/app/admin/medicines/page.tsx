"use client";

import { useState, useEffect } from "react";

interface Medicine {
  id: string;
  brandName: string;
  genericName: string;
  form: string;
  therapeuticCategory: string;
  manufacturer: string;
  strength: string;
  unit: string;
  price: number;
  prescriptionRequired: boolean;
  description: string;
  dosage: string;
  sideEffects: string;
  imageUrl: string | null;
}

const emptyForm = {
  brandName: "", genericName: "", form: "Tablet", therapeuticCategory: "",
  manufacturer: "", strength: "", unit: "", price: "", prescriptionRequired: false,
  description: "", dosage: "", sideEffects: "",
};

export default function AdminMedicinesPage() {
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  function fetchMedicines() {
    setLoading(true);
    fetch("/api/admin/medicines")
      .then((res) => res.json())
      .then(setMedicines)
      .finally(() => setLoading(false));
  }

  useEffect(fetchMedicines, []);

  function startAdd() {
    setEditingId(null);
    setForm(emptyForm);
    setPhotoFile(null);
    setShowForm(true);
  }

  function startEdit(med: Medicine) {
    setEditingId(med.id);
    setForm({
      brandName: med.brandName,
      genericName: med.genericName,
      form: med.form,
      therapeuticCategory: med.therapeuticCategory,
      manufacturer: med.manufacturer,
      strength: med.strength,
      unit: med.unit,
      price: med.price.toString(),
      prescriptionRequired: med.prescriptionRequired,
      description: med.description,
      dosage: med.dosage,
      sideEffects: med.sideEffects,
    });
    setPhotoFile(null);
    setShowForm(true);
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

    try {
      const payload: any = {
        ...form,
        price: parseFloat(form.price),
      };
      if (photoFile) {
        payload.photoBase64 = await fileToBase64(photoFile);
      }

      const url = editingId ? `/api/admin/medicines/${editingId}` : "/api/admin/medicines";
      const method = editingId ? "PATCH" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Failed to save");

      setShowForm(false);
      fetchMedicines();
    } catch {
      alert("Something went wrong saving this medicine.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this medicine entry? This cannot be undone.")) return;
    await fetch(`/api/admin/medicines/${id}`, { method: "DELETE" });
    fetchMedicines();
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Manage Medicines</h1>
        <button
          onClick={startAdd}
          className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm hover:bg-teal-900"
        >
          + Add Medicine
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="border rounded-xl p-5 mb-8 bg-gray-50 space-y-3">
          <h2 className="font-semibold">{editingId ? "Edit Medicine" : "New Medicine"}</h2>
          <div className="grid grid-cols-2 gap-3">
            <input required placeholder="Brand Name" value={form.brandName} onChange={(e) => setForm({ ...form, brandName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="Generic Name" value={form.genericName} onChange={(e) => setForm({ ...form, genericName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="Form (e.g. Tablet)" value={form.form} onChange={(e) => setForm({ ...form, form: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="Therapeutic Category" value={form.therapeuticCategory} onChange={(e) => setForm({ ...form, therapeuticCategory: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="Manufacturer" value={form.manufacturer} onChange={(e) => setForm({ ...form, manufacturer: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="Strength (e.g. 500 mg)" value={form.strength} onChange={(e) => setForm({ ...form, strength: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required placeholder="Unit (e.g. Per Tablet)" value={form.unit} onChange={(e) => setForm({ ...form, unit: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            <input required type="number" step="0.01" placeholder="Price (BDT)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.prescriptionRequired} onChange={(e) => setForm({ ...form, prescriptionRequired: e.target.checked })} />
            Prescription required
          </label>
          <textarea required placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full h-16" />
          <textarea required placeholder="Dosage" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full h-16" />
          <textarea required placeholder="Side Effects" value={form.sideEffects} onChange={(e) => setForm({ ...form, sideEffects: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full h-16" />
          <div>
            <label className="text-sm text-gray-600 block mb-1">Photo {editingId && "(leave blank to keep current)"}</label>
            <input type="file" accept="image/*" onChange={(e) => setPhotoFile(e.target.files?.[0] || null)} />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50">
              {saving ? "Saving..." : "Save"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 text-sm">
              Cancel
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : (
        <div className="space-y-2">
          {medicines.map((med) => (
            <div key={med.id} className="border rounded-lg p-3 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded bg-gray-100 overflow-hidden flex-shrink-0">
                  {med.imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={med.imageUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm">{med.brandName}</p>
                  <p className="text-xs text-gray-500">{med.genericName} · ৳{med.price.toFixed(2)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={() => startEdit(med)} className="text-xs text-blue-600 hover:underline">Edit</button>
                <button onClick={() => handleDelete(med.id)} className="text-xs text-red-600 hover:underline">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}