"use client";

import { useState } from "react";

type TimeRange = { start: string; end: string };
type Schedule = Record<string, TimeRange[]>;

const DAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Monday" },
  { key: "tuesday", label: "Tuesday" },
  { key: "wednesday", label: "Wednesday" },
  { key: "thursday", label: "Thursday" },
  { key: "friday", label: "Friday" },
  { key: "saturday", label: "Saturday" },
  { key: "sunday", label: "Sunday" },
];

const DEFAULT_RANGE: TimeRange = { start: "09:00", end: "17:00" };

function normalizeSchedule(input: unknown): Schedule {
  const schedule: Schedule = {};
  if (input && typeof input === "object") {
    for (const day of DAYS) {
      const ranges = (input as Record<string, unknown>)[day.key];
      if (Array.isArray(ranges)) {
        schedule[day.key] = ranges
          .filter(
            (r): r is TimeRange =>
              typeof r === "object" && r !== null && "start" in r && "end" in r
          )
          .map((r) => ({ start: String(r.start), end: String(r.end) }));
      }
    }
  }
  return schedule;
}

export default function ScheduleEditor({
  initialSchedule,
}: {
  initialSchedule: unknown;
}) {
  const [schedule, setSchedule] = useState<Schedule>(() => normalizeSchedule(initialSchedule));
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  function toggleDay(dayKey: string, enabled: boolean) {
    setSchedule((prev) => {
      const next = { ...prev };
      if (enabled) {
        next[dayKey] = [{ ...DEFAULT_RANGE }];
      } else {
        delete next[dayKey];
      }
      return next;
    });
  }

  function updateRange(dayKey: string, index: number, field: keyof TimeRange, value: string) {
    setSchedule((prev) => {
      const ranges = [...(prev[dayKey] || [])];
      ranges[index] = { ...ranges[index], [field]: value };
      return { ...prev, [dayKey]: ranges };
    });
  }

  function addRange(dayKey: string) {
    setSchedule((prev) => ({
      ...prev,
      [dayKey]: [...(prev[dayKey] || []), { ...DEFAULT_RANGE }],
    }));
  }

  function removeRange(dayKey: string, index: number) {
    setSchedule((prev) => {
      const ranges = (prev[dayKey] || []).filter((_, i) => i !== index);
      const next = { ...prev };
      if (ranges.length === 0) {
        delete next[dayKey];
      } else {
        next[dayKey] = ranges;
      }
      return next;
    });
  }

  function validate(): string | null {
    for (const day of DAYS) {
      const ranges = schedule[day.key];
      if (!ranges) continue;
      for (const range of ranges) {
        if (!range.start || !range.end) {
          return `${day.label}: start and end time are required.`;
        }
        if (range.start >= range.end) {
          return `${day.label}: end time must be after start time.`;
        }
      }
    }
    return null;
  }

  async function handleSave() {
    setMessage(null);
    const validationError = validate();
    if (validationError) {
      setMessage({ type: "error", text: validationError });
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ schedule }),
      });

      if (!res.ok) throw new Error("Failed to save");

      setMessage({ type: "success", text: "Availability saved." });
    } catch {
      setMessage({ type: "error", text: "Something went wrong saving your availability." });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <h2 className="font-semibold text-lg mb-1">Weekly Availability</h2>
      <p className="text-sm text-gray-500 mb-4">
        Toggle the days you&apos;re available and set one or more time ranges per day.
        Patients will only be able to book consultations within these hours.
      </p>

      <div className="space-y-3">
        {DAYS.map((day) => {
          const ranges = schedule[day.key];
          const enabled = Boolean(ranges);
          return (
            <div key={day.key} className="border rounded-lg p-4">
              <label className="flex items-center gap-3 font-medium mb-2">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={(e) => toggleDay(day.key, e.target.checked)}
                  className="w-4 h-4"
                />
                {day.label}
              </label>

              {enabled && (
                <div className="space-y-2 pl-7">
                  {ranges!.map((range, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <input
                        type="time"
                        value={range.start}
                        onChange={(e) => updateRange(day.key, i, "start", e.target.value)}
                        className="border rounded-lg px-3 py-1.5"
                      />
                      <span className="text-gray-400">to</span>
                      <input
                        type="time"
                        value={range.end}
                        onChange={(e) => updateRange(day.key, i, "end", e.target.value)}
                        className="border rounded-lg px-3 py-1.5"
                      />
                      <button
                        type="button"
                        onClick={() => removeRange(day.key, i)}
                        className="text-red-500 hover:text-red-700 text-sm px-2"
                        aria-label={`Remove range ${i + 1} for ${day.label}`}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => addRange(day.key)}
                    className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                  >
                    + Add another time range
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={handleSave}
        disabled={saving}
        className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? "Saving..." : "Save Availability"}
      </button>

      {message && (
        <p className={`text-sm mt-3 ${message.type === "error" ? "text-red-600" : "text-green-600"}`}>
          {message.text}
        </p>
      )}
    </div>
  );
}
