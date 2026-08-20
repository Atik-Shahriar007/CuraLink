"use client";

import { useState, useEffect } from "react";

interface DayHours {
  enabled: boolean;
  start: string;
  end: string;
}

type Schedule = Record<string, DayHours>;

const DAYS = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const defaultSchedule: Schedule = DAYS.reduce((acc, d) => {
  acc[d.key] = { enabled: false, start: "09:00", end: "17:00" };
  return acc;
}, {} as Schedule);

export default function DoctorSchedulePage() {
  const [schedule, setSchedule] = useState<Schedule>(defaultSchedule);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/doctor/schedule")
      .then((res) => res.json())
      .then((data) => {
        if (data.schedule) {
          setSchedule({ ...defaultSchedule, ...data.schedule });
        }
      })
      .finally(() => setLoading(false));
  }, []);

  function updateDay(day: string, changes: Partial<DayHours>) {
    setSchedule((prev) => ({ ...prev, [day]: { ...prev[day], ...changes } }));
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const res = await fetch("/api/doctor/schedule", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(schedule),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save schedule");
        return;
      }

      setMessage("Schedule saved.");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <p className="max-w-2xl mx-auto px-4 py-8">Loading...</p>;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Weekly Availability</h1>
      <p className="text-gray-500 mb-6">
        Patients can only book consultations within these hours, in 30-minute slots.
      </p>

      <div className="space-y-3">
        {DAYS.map(({ key, label }) => {
          const day = schedule[key];
          return (
            <div
              key={key}
              className="flex items-center gap-4 border rounded-lg px-4 py-3"
            >
              <label className="flex items-center gap-2 w-32 flex-shrink-0">
                <input
                  type="checkbox"
                  checked={day.enabled}
                  onChange={(e) => updateDay(key, { enabled: e.target.checked })}
                />
                <span className="font-medium text-sm">{label}</span>
              </label>

              {day.enabled ? (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={day.start}
                    onChange={(e) => updateDay(key, { start: e.target.value })}
                    className="border rounded-lg px-3 py-1.5 text-sm"
                  />
                  <span className="text-gray-400 text-sm">to</span>
                  <input
                    type="time"
                    value={day.end}
                    onChange={(e) => updateDay(key, { end: e.target.value })}
                    className="border rounded-lg px-3 py-1.5 text-sm"
                  />
                </div>
              ) : (
                <span className="text-gray-400 text-sm">Unavailable</span>
              )}
            </div>
          );
        })}
      </div>

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
      {message && <p className="text-green-700 text-sm mt-4">{message}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Schedule"}
      </button>
    </div>
  );
}