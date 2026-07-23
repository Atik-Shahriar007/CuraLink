"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

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
  account: { firstName: string | null; lastName: string | null };
}

export default function DoctorProfilePage() {
  const { id } = useParams<{ id: string }>();
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

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

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-8">Loading...</p>;
  if (notFound || !doctor)
    return <p className="max-w-3xl mx-auto px-4 py-8">Doctor not found.</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex gap-6 items-start">
        <div className="w-28 h-28 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
          {doctor.photoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={doctor.photoUrl}
              alt="Doctor"
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div>
          <h1 className="text-2xl font-bold">
            Dr. {doctor.account.firstName} {doctor.account.lastName}
          </h1>
          <p className="text-gray-600">{doctor.specialty}</p>
          <p className="text-gray-500">{doctor.hospital}</p>
          <p className="text-blue-600 font-semibold mt-2">
            {doctor.price ? `$${doctor.price} / consultation` : ""}
          </p>
        </div>
      </div>

      {doctor.description && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">About</h2>
          <p className="text-gray-700">{doctor.description}</p>
        </div>
      )}

      {doctor.degrees.length > 0 && (
        <div className="mt-6">
          <h2 className="font-semibold text-lg mb-2">Education</h2>
          <ul className="list-disc list-inside text-gray-700">
            {doctor.degrees.map((d, i) => (
              <li key={i}>{d}</li>
            ))}
          </ul>
        </div>
      )}

      <button className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700">
        Book Consultation
      </button>
    </div>
  );
}