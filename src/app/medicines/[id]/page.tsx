"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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

export default function MedicineDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [medicine, setMedicine] = useState<Medicine | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    fetch(`/api/medicines/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setMedicine)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-8">Loading...</p>;
  if (notFound || !medicine)
    return <p className="max-w-3xl mx-auto px-4 py-8">Medicine not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-start flex-wrap">
        <div className="w-40 h-40 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
          {medicine.imageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={medicine.imageUrl}
              alt={medicine.brandName}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold font-display">{medicine.brandName}</h1>
          <p className="text-gray-500">{medicine.genericName} · {medicine.strength}</p>
          <p className="text-gray-400 text-sm mt-1">{medicine.manufacturer}</p>
          <p className="text-gray-400 text-sm">{medicine.form} · {medicine.therapeuticCategory}</p>
          <div className="flex items-center gap-3 mt-3">
            <span className="text-[var(--color-copper)] font-semibold text-lg">
              ৳{medicine.price.toFixed(2)} <span className="text-sm text-gray-400 font-normal">{medicine.unit}</span>
            </span>
            {medicine.prescriptionRequired ? (
              <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                Prescription Required
              </span>
            ) : (
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full">
                Over the Counter
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-6">
        <div>
          <h2 className="font-semibold text-lg mb-2">Description</h2>
          <p className="text-gray-700">{medicine.description}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Dosage</h2>
          <p className="text-gray-700">{medicine.dosage}</p>
        </div>
        <div>
          <h2 className="font-semibold text-lg mb-2">Side Effects</h2>
          <p className="text-gray-700">{medicine.sideEffects}</p>
        </div>
      </div>

      <div className="mt-8 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-sm text-amber-800">
        This information is for reference only and does not replace professional medical advice. Consult a doctor before taking any medication, especially if it requires a prescription.
      </div>
    </div>
  );
}