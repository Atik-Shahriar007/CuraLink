"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";
import { MapPin, Star, GraduationCap, Clock } from "lucide-react";

interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  patient: { account: { firstName: string | null; lastName: string | null } };
}

interface Doctor {
  id: string;
  specialty: string | null;
  hospital: string | null;
  price: number | null;
  photoUrl: string | null;
  description: string | null;
  experienceLevel: string | null;
  degrees: string[];
  certifications: string[];
  avgRating: number | null;
  reviewCount: number;
  reviews: Review[];
  account: { firstName: string | null; lastName: string | null };
}

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { account } = useAuth();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [availableSlots, setAvailableSlots] = useState<string[]>([]);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [booking, setBooking] = useState(false);
  const [bookingError, setBookingError] = useState("");

  useEffect(() => {
    fetch(`/api/doctors/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Not found");
        return res.json();
      })
      .then(setDoctor)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!selectedDate) {
      setAvailableSlots([]);
      return;
    }
    setSlotsLoading(true);
    setSelectedTime("");
    fetch(`/api/doctors/${id}/slots?date=${selectedDate}`)
      .then((res) => res.json())
      .then((data) => setAvailableSlots(data.slots || []))
      .finally(() => setSlotsLoading(false));
  }, [selectedDate, id]);

  async function handleBook() {
    setBookingError("");

    if (!account) {
      setBookingError("Please log in as a patient to book a consultation.");
      return;
    }
    if (account.role !== "PATIENT") {
      setBookingError("Only patients can book consultations.");
      return;
    }
    if (!selectedDate || !selectedTime) {
      setBookingError("Please choose a date and time.");
      return;
    }

    const combinedDate = new Date(`${selectedDate}T${selectedTime}`);
    if (combinedDate.getTime() <= Date.now()) {
      setBookingError("Please choose a future date and time.");
      return;
    }

    setBooking(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorId: id, date: combinedDate.toISOString() }),
      });

      const data = await res.json();

      if (!res.ok) {
        setBookingError(data.error || "Could not start checkout");
        setBooking(false);
        return;
      }

      window.location.href = data.url;
    } catch {
      setBookingError("Something went wrong. Please try again.");
      setBooking(false);
    }
  }

  if (loading) return <p className="max-w-4xl mx-auto px-6 py-12 text-stone-400">Loading...</p>;
  if (notFound || !doctor)
    return <p className="max-w-4xl mx-auto px-6 py-12 text-stone-400">Doctor not found.</p>;

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex flex-col sm:flex-row gap-8 mb-8">
        <div className="w-28 h-28 rounded-2xl bg-stone-100 overflow-hidden flex-shrink-0">
          {doctor.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={doctor.photoUrl} alt="Doctor" className="w-full h-full object-cover" />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-display">
            Dr. {doctor.account.firstName} {doctor.account.lastName}
          </h1>
          <p className="text-teal-800 font-medium">{doctor.specialty}</p>
          <div className="flex items-center gap-1.5 text-stone-400 text-sm mt-1">
            <MapPin size={14} /> {doctor.hospital}
          </div>
          {doctor.avgRating !== null && (
            <div className="flex items-center gap-1 text-amber-500 text-sm mt-2">
              <Star size={14} fill="currentColor" />
              {doctor.avgRating.toFixed(1)}
              <span className="text-stone-400">({doctor.reviewCount} reviews)</span>
            </div>
          )}
          <p className="text-[var(--color-copper)] font-semibold text-lg mt-2">
            {doctor.price ? `$${doctor.price}` : ""} <span className="text-sm text-stone-400 font-normal">/ consultation</span>
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {doctor.description && (
            <section>
              <h2 className="font-semibold mb-2">About</h2>
              <p className="text-stone-600 text-sm leading-relaxed">{doctor.description}</p>
            </section>
          )}

          {doctor.degrees.length > 0 && (
            <section>
              <h2 className="flex items-center gap-2 font-semibold mb-3">
                <GraduationCap size={17} className="text-teal-800" /> Education
              </h2>
              <ul className="space-y-1">
                {doctor.degrees.map((d, i) => (
                  <li key={i} className="text-stone-600 text-sm">{d}</li>
                ))}
              </ul>
            </section>
          )}

          {doctor.experienceLevel && (
            <section>
              <h2 className="flex items-center gap-2 font-semibold mb-2">
                <Clock size={17} className="text-teal-800" /> Experience
              </h2>
              <p className="text-stone-600 text-sm">{doctor.experienceLevel.replace(/_/g, " ")}</p>
            </section>
          )}

          {doctor.reviews.length > 0 && (
            <section>
              <h2 className="font-semibold mb-3">Patient Reviews</h2>
              <div className="space-y-3">
                {doctor.reviews.map((r) => (
                  <div key={r.id} className="border border-stone-200 rounded-xl p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-amber-500 text-sm">
                        {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                      </span>
                      <span className="text-xs text-stone-400">
                        {new Date(r.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm text-stone-500 mt-1">
                      {r.patient.account.firstName} {r.patient.account.lastName}
                    </p>
                    {r.comment && <p className="text-sm text-stone-700 mt-1.5">{r.comment}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        <div className="md:col-span-1">
          <div className="border border-stone-200 rounded-2xl p-5 bg-white sticky top-8">
            <h2 className="font-semibold mb-4">Book a Consultation</h2>

            <input
              type="date"
              value={selectedDate}
              min={new Date().toISOString().split("T")[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="border border-stone-200 rounded-lg px-3 py-2.5 text-sm mb-4 w-full"
            />

            {selectedDate && (
              <div className="mb-4">
                {slotsLoading ? (
                  <p className="text-sm text-stone-400">Loading available times...</p>
                ) : availableSlots.length === 0 ? (
                  <p className="text-sm text-stone-400">No available slots. Try another day.</p>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {availableSlots.map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setSelectedTime(slot)}
                        className={`px-3 py-1.5 rounded-lg text-xs border transition-colors ${
                          selectedTime === slot
                            ? "bg-teal-950 text-white border-teal-950"
                            : "border-stone-200 hover:border-teal-700"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}

            {bookingError && <p className="text-red-600 text-xs mb-3">{bookingError}</p>}

            <button
              onClick={handleBook}
              disabled={booking}
              className="w-full bg-[var(--color-copper)] hover:bg-[var(--color-copper-light)] text-white py-2.5 rounded-lg font-medium text-sm transition-colors disabled:opacity-50"
            >
              {booking ? "Redirecting..." : "Book Consultation"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}