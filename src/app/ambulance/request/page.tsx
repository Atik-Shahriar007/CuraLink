"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const LocationMap = dynamic(() => import("@/app/components/LocationMap"), { ssr: false });

export default function RequestAmbulancePage() {
  const router = useRouter();
  const [coords, setCoords] = useState<{ lat: number; lng: number } | null>(null);
  const [address, setAddress] = useState("");
  const [situation, setSituation] = useState("");
  const [phone, setPhone] = useState("");
  const [locating, setLocating] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  function detectLocation() {
    if (!navigator.geolocation) {
      setError("Your browser doesn't support location detection. Please enter your address manually.");
      return;
    }
    setLocating(true);
    setError("");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocating(false);
      },
      () => {
        setError("Could not detect your location. Please enter your address manually below.");
        setLocating(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!address.trim()) {
      setError("Please provide an address or location detail.");
      return;
    }
    if (!phone.trim()) {
      setError("Please provide a contact phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/ambulance/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude: coords?.lat,
          longitude: coords?.lng,
          address,
          situationDescription: situation,
          contactPhone: phone,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit request");
        return;
      }

      router.push("/ambulance/status");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <div className="bg-red-50 border-2 border-red-300 rounded-xl px-5 py-4 mb-6">
        <p className="text-red-800 font-semibold text-sm">
          For a real medical emergency, call 999 immediately.
        </p>
        <p className="text-red-700 text-sm mt-1">
          This feature connects you with CuraLink's registered ambulance partners, but response time
          is not guaranteed. Do not rely on this instead of calling emergency services directly.
        </p>
      </div>

      <h1 className="text-2xl font-bold mb-6">Request an Ambulance</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <button
            type="button"
            onClick={detectLocation}
            disabled={locating}
            className="border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
          >
            {locating ? "Detecting location..." : "📍 Detect My Location"}
          </button>
          {coords && (
            <div className="mt-3">
              <LocationMap latitude={coords.lat} longitude={coords.lng} label="Detected location" />
            </div>
          )}
        </div>

        <textarea
          required
          placeholder="Address / location details (edit if the detected location isn't accurate, or enter manually)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full h-20"
        />

        <textarea
          required
          placeholder="Briefly describe the situation"
          value={situation}
          onChange={(e) => setSituation(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full h-20"
        />

        <input
          required
          type="tel"
          placeholder="Contact phone number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50 w-full"
        >
          {submitting ? "Submitting..." : "Request Ambulance"}
        </button>
      </form>
    </div>
  );
}