"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

interface Doctor {
  id: string;
  specialty: string | null;
  hospital: string | null;
  price: number | null;
  photoUrl: string | null;
  experienceLevel: string | null;
  account: { firstName: string | null; lastName: string | null };
}

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchDoctors = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (specialty) params.set("specialty", specialty);
    if (maxPrice) params.set("maxPrice", maxPrice);

    const res = await fetch(`/api/doctors?${params.toString()}`);
    const data = await res.json();
    setDoctors(data);
    setLoading(false);
  }, [search, specialty, maxPrice]);

  useEffect(() => {
    const timeout = setTimeout(fetchDoctors, 300); // debounce
    return () => clearTimeout(timeout);
  }, [fetchDoctors]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Find a Doctor</h1>

      <div className="flex flex-wrap gap-3 mb-8">
        <input
          type="text"
          placeholder="Search by name, specialty, hospital..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 min-w-[240px] border rounded-lg px-4 py-2"
        />
        <select
          value={specialty}
          onChange={(e) => setSpecialty(e.target.value)}
          className="border rounded-lg px-4 py-2"
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
          className="w-32 border rounded-lg px-4 py-2"
        />
      </div>

      {loading ? (
        <p className="text-gray-500">Loading doctors...</p>
      ) : doctors.length === 0 ? (
        <p className="text-gray-500">No doctors found matching your criteria.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {doctors.map((doc) => (
            <Link
              key={doc.id}
              href={`/doctors/${doc.id}`}
              className="border rounded-xl p-5 hover:shadow-lg transition-shadow bg-white"
            >
              <div className="w-16 h-16 rounded-full bg-gray-200 mb-3 overflow-hidden">
                {doc.photoUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={doc.photoUrl}
                    alt="Doctor"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <h2 className="font-semibold text-lg">
                Dr. {doc.account.firstName} {doc.account.lastName}
              </h2>
              <p className="text-gray-600">{doc.specialty || "General Practice"}</p>
              <p className="text-gray-500 text-sm">{doc.hospital}</p>
              <p className="text-blue-600 font-semibold mt-2">
                {doc.price ? `$${doc.price} / consultation` : "Price not set"}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}