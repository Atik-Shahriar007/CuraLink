"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, ShieldAlert } from "lucide-react";

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
  imageUrl: string | null;
}

function MedicinesContent() {
  const searchParams = useSearchParams();
  const [medicines, setMedicines] = useState<Medicine[]>([]);
  const [search, setSearch] = useState("");
  const [form, setForm] = useState("");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchMedicines = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (form) params.set("form", form);
    if (category) params.set("category", category);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const res = await fetch(`/api/medicines?${params.toString()}`);
    const data = await res.json();
    setMedicines(data);
    setLoading(false);
  }, [search, form, category, minPrice, maxPrice]);

  useEffect(() => {
    const timeout = setTimeout(fetchMedicines, 300);
    return () => clearTimeout(timeout);
  }, [fetchMedicines]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display mb-2">Medicine Directory</h1>
      <p className="text-stone-500 mb-8">
        Search by brand or generic name, and filter by form, category, or price.
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-10 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by brand or generic name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/10"
          />
        </div>
        <select value={form} onChange={(e) => setForm(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
          <option value="">All Forms</option>
          <option value="Tablet">Tablet</option>
          <option value="Capsule">Capsule</option>
        </select>
        <select value={category} onChange={(e) => setCategory(e.target.value)} className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm">
          <option value="">All Categories</option>
          <option value="Analgesic & Antipyretic">Analgesic & Antipyretic</option>
          <option value="Proton Pump Inhibitor">Proton Pump Inhibitor</option>
          <option value="Antihistamine">Antihistamine</option>
          <option value="Anti-Allergic">Anti-Allergic</option>
          <option value="Antibiotic">Antibiotic</option>
          <option value="Antidiabetic">Antidiabetic</option>
          <option value="Antihypertensive">Antihypertensive</option>
          <option value="Vitamin Supplement">Vitamin Supplement</option>
          <option value="Mineral Supplement">Mineral Supplement</option>
        </select>
        <input type="number" placeholder="Min price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} className="w-24 border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
        <input type="number" placeholder="Max price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-24 border border-stone-200 rounded-lg px-3 py-2.5 text-sm" />
      </div>

      {loading ? (
        <p className="text-stone-400">Loading medicines...</p>
      ) : medicines.length === 0 ? (
        <p className="text-stone-400">No medicines found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicines.map((med) => (
            <Link
              key={med.id}
              href={`/medicines/${med.id}`}
              className="group border border-stone-200 rounded-2xl overflow-hidden hover:shadow-lg hover:border-teal-800/30 transition-all bg-white"
            >
              <div className="w-full h-40 bg-stone-100">
                {med.imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={med.imageUrl} alt={med.brandName} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="p-4">
                <h2 className="font-semibold group-hover:text-teal-900 transition-colors">{med.brandName}</h2>
                <p className="text-stone-500 text-sm">{med.genericName} · {med.strength}</p>
                <p className="text-stone-400 text-xs mt-1">{med.form} · {med.therapeuticCategory}</p>
                <div className="flex items-center justify-between mt-3 pt-3 border-t border-stone-100">
                  <span className="text-[var(--color-copper)] font-semibold">
                    ${med.price.toFixed(2)} <span className="text-xs text-stone-400 font-normal">{med.unit}</span>
                  </span>
                  {med.prescriptionRequired && (
                    <span className="flex items-center gap-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded-full">
                      <ShieldAlert size={11} /> Rx
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

export default function MedicinesPage() {
  return (
    <Suspense fallback={<div className="max-w-6xl mx-auto px-6 py-12 text-stone-400">Loading...</div>}>
      <MedicinesContent />
    </Suspense>
  );
}