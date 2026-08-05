"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Star, MapPin } from "lucide-react";

interface Doctor {
  id: string;
  specialty: string | null;
  hospital: string | null;
  price: number | null;
  photoUrl: string | null;
  experienceLevel: string | null;
  avgRating: number | null;
  reviewCount: number;
  account: { firstName: string | null; lastName: string | null };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (specialty) params.set("specialty", specialty);
    if (maxPrice) params.set("maxPrice", maxPrice);
    params.set("sortBy", sortBy);

    const res = await fetch(`/api/doctors?${params.toString()}`);
    const data = await res.json();
    setDoctors(data);
    setLoading(false);
  }, [search, specialty, maxPrice, sortBy]);

  useEffect(() => {
    const timeout = setTimeout(fetchDoctors, 300);
    return () => clearTimeout(timeout);
  }, [fetchDoctors]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-display mb-2">Find a Doctor</h1>
      <p className="text-stone-500 mb-8">Browse verified, admin-approved doctors and book a consultation.</p>

      <div className="bg-white border border-stone-200 rounded-2xl p-4 mb-10 flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[220px]">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search by name, specialty, hospital..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full border border-stone-200 rounded-lg pl-9 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/10"
          />
        </div>
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="">All Specialties</option>
          <option value="Cardiology">Cardiology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pediatrics">Pediatrics</option>
          <option value="General Medicine">General Medicine</option>
          <option value="Psychiatry">Psychiatry</option>
        </select>
        <input
          type="number"
          placeholder="Max price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-28 border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        />
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm"
        >
          <option value="newest">Newest</option>
          <option value="rating">Highest Rated</option>
          <option value="experience">Most Experienced</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {loading ? (
        <p className="text-stone-400">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-stone-400">No doctors found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Link
              key={doc.id}
              href={`/doctors/${doc.id}`}
              className="group border border-stone-200 rounded-2xl p-5 bg-white hover:shadow-lg hover:border-teal-800/30 transition-all"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-stone-100 overflow-hidden flex-shrink-0">
                  {doc.photoUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={doc.photoUrl} alt="" className="w-full h-full object-cover" />
                  )}
                </div>
                <div className="min-w-0">
                  <h2 className="font-semibold group-hover:text-teal-900 transition-colors truncate">
                    Dr. {doc.account.firstName} {doc.account.lastName}
                  </h2>
                  <p className="text-stone-500 text-sm truncate">{doc.specialty || "General Practice"}</p>
                </div>
              </div>

              <div className="flex items-center gap-1.5 text-stone-400 text-xs mb-1">
                <MapPin size={13} />
                <span className="truncate">{doc.hospital || "Hospital not listed"}</span>
              </div>

              {doc.avgRating !== null && (
                <div className="flex items-center gap-1 text-sm text-amber-500 mb-3">
                  <Star size={14} fill="currentColor" />
                  {doc.avgRating.toFixed(1)}
                  <span className="text-stone-400">({doc.reviewCount})</span>
                </div>
              )}

              <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                <span className="text-[var(--color-copper)] font-semibold">
                  {doc.price ? `$${doc.price}` : "—"}
                </span>
                <span className="text-xs text-stone-400">per consultation</span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}