"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, HeartOff, Search, Star, Stethoscope, ExternalLink } from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/app/components/DashboardCard";

const LS_KEY = "curalink_favorite_doctors";

interface Doctor {
  id: string;
  photoUrl?: string;
  specialty?: string;
  hospital?: string;
  price?: number;
  avgRating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  account: { firstName: string; lastName: string };
}

function loadFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveFavorites(ids: string[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(ids));
}

export default function FavoriteDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const favIds = loadFavorites();
    setFavorites(favIds);

    fetch("/api/doctors")
      .then((res) => res.json())
      .then((data: Doctor[]) => setDoctors(Array.isArray(data) ? data : []))
      .catch(() => setDoctors([]))
      .finally(() => setLoading(false));
  }, []);

  const removeFavorite = useCallback(
    (id: string) => {
      const updated = favorites.filter((f) => f !== id);
      setFavorites(updated);
      saveFavorites(updated);
    },
    [favorites]
  );

  const favoriteDoctors = doctors.filter((d) => favorites.includes(d.id));

  const filtered = favoriteDoctors.filter((d) => {
    const q = search.toLowerCase();
    const name = `${d.account.firstName} ${d.account.lastName}`.toLowerCase();
    return name.includes(q) || (d.specialty || "").toLowerCase().includes(q);
  });

  if (loading) return <p className="text-stone-500">Loading...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display mb-1">Favorite Doctors</h1>
          <p className="text-stone-500">Your saved doctors for quick access.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search by name or specialty..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-900/20"
        />
      </div>

      {filtered.length === 0 ? (
        <DashboardCard>
          <div className="text-center py-12 text-stone-400">
            <Heart size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-stone-600">
              {favorites.length === 0 ? "No favorite doctors yet" : "No results found"}
            </p>
            <p className="text-sm mt-1 mb-4">
              {favorites.length === 0
                ? "Add doctors to favorites from the doctor listings page."
                : "Try a different search term."}
            </p>
            {favorites.length === 0 && (
              <Link
                href="/doctors"
                className="inline-flex items-center gap-2 bg-teal-950 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-900"
              >
                <Stethoscope size={15} /> Browse Doctors
              </Link>
            )}
          </div>
        </DashboardCard>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doctor) => {
            const name = `Dr. ${doctor.account.firstName} ${doctor.account.lastName}`;
            return (
              <div
                key={doctor.id}
                className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col"
              >
                {/* Photo & name */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-14 h-14 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
                    {doctor.photoUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={doctor.photoUrl}
                        alt={name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Stethoscope size={24} className="text-stone-300" />
                      </div>
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-stone-900 truncate">{name}</p>
                    {doctor.specialty && (
                      <p className="text-sm text-teal-800 truncate">{doctor.specialty}</p>
                    )}
                    {doctor.hospital && (
                      <p className="text-xs text-stone-400 truncate">{doctor.hospital}</p>
                    )}
                  </div>
                </div>

                {/* Rating & price */}
                <div className="flex items-center gap-3 mb-4">
                  {doctor.avgRating != null && (
                    <span className="flex items-center gap-1 text-sm text-amber-600">
                      <Star size={14} fill="currentColor" />
                      {doctor.avgRating.toFixed(1)}
                      <span className="text-stone-400">({doctor.reviewCount})</span>
                    </span>
                  )}
                  {doctor.price != null && (
                    <span className="text-sm text-stone-600 ml-auto font-medium">
                      \${doctor.price}
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-auto">
                  <Link
                    href={`/doctors/${doctor.id}`}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-teal-950 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-teal-900"
                  >
                    <ExternalLink size={13} /> Book
                  </Link>
                  <button
                    onClick={() => removeFavorite(doctor.id)}
                    className="flex items-center gap-1.5 border border-red-200 text-red-500 px-3 py-2 rounded-xl text-sm hover:bg-red-50 transition-colors"
                    title="Remove from favorites"
                  >
                    <HeartOff size={14} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
