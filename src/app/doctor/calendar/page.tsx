"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Calendar, Clock, User } from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";

type ConsultationStatus = "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELED";

interface CalendarConsultation {
  id: string;
  date: string;
  status: ConsultationStatus;
  notes: string | null;
  patient: { id: string; account: { firstName: string; lastName: string } };
}

interface CalendarData {
  consultations: CalendarConsultation[];
  weekStart: string;
}

const STATUS_COLORS: Record<ConsultationStatus, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  IN_PROGRESS: "bg-blue-100 text-blue-700 border-blue-200",
  COMPLETED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELED: "bg-red-100 text-red-700 border-red-200",
};

const STATUS_LABEL: Record<ConsultationStatus, string> = {
  PENDING: "Pending",
  IN_PROGRESS: "In Progress",
  COMPLETED: "Completed",
  CANCELED: "Canceled",
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOUR_LABELS = Array.from({ length: 14 }, (_, i) => i + 7); // 7 AM – 8 PM

function getWeekDates(weekStart: Date): Date[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(d.getDate() + i);
    return d;
  });
}

function getMondayOfWeek(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

export default function DoctorCalendarPage() {
  const [data, setData] = useState<CalendarData | null>(null);
  const [loading, setLoading] = useState(true);
  const [weekStart, setWeekStart] = useState<Date>(() => getMondayOfWeek(new Date()));
  const [selected, setSelected] = useState<CalendarConsultation | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch(`/api/doctor/calendar?weekStart=${weekStart.toISOString()}`)
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [weekStart]);

  const goToPrevWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 7);
      return d;
    });
  };

  const goToNextWeek = () => {
    setWeekStart((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 7);
      return d;
    });
  };

  const goToToday = () => {
    setWeekStart(getMondayOfWeek(new Date()));
  };

  const weekDates = getWeekDates(weekStart);

  const formatWeekRange = () => {
    const end = new Date(weekDates[6]);
    const startStr = weekDates[0].toLocaleDateString(undefined, { month: "short", day: "numeric" });
    const endStr = end.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
    return `${startStr} – ${endStr}`;
  };

  // Map consultations to day+hour slots
  const getConsultationsForSlot = (day: Date, hour: number) => {
    if (!data) return [];
    return data.consultations.filter((c) => {
      const d = new Date(c.date);
      return (
        d.getFullYear() === day.getFullYear() &&
        d.getMonth() === day.getMonth() &&
        d.getDate() === day.getDate() &&
        d.getHours() === hour
      );
    });
  };

  const today = new Date();
  const isToday = (d: Date) =>
    d.getFullYear() === today.getFullYear() &&
    d.getMonth() === today.getMonth() &&
    d.getDate() === today.getDate();

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-950 to-teal-800 text-white rounded-2xl p-6 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-display font-semibold">Appointment Calendar</h1>
          <p className="text-teal-100 text-sm mt-1">Weekly view of your upcoming consultations.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={goToPrevWeek}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Previous week"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={goToToday}
            className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm font-medium"
          >
            Today
          </button>
          <button
            onClick={goToNextWeek}
            className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Next week"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Week label */}
      <div className="flex items-center gap-2 mb-4">
        <Calendar size={16} className="text-teal-700" />
        <p className="text-stone-600 font-medium text-sm">{formatWeekRange()}</p>
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Loading calendar...</p>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          {/* Calendar grid */}
          <div className="md:col-span-2">
            <DashboardCard>
              <div className="overflow-x-auto">
                <div className="min-w-[600px]">
                  {/* Day headers */}
                  <div className="grid grid-cols-8 mb-2">
                    <div className="text-xs text-stone-400 font-medium pr-2" />
                    {weekDates.map((d, i) => (
                      <div
                        key={i}
                        className={`text-center px-1 py-1 rounded-lg text-xs font-semibold ${
                          isToday(d)
                            ? "bg-teal-700 text-white"
                            : "text-stone-500"
                        }`}
                      >
                        <div>{DAY_NAMES[i]}</div>
                        <div className={`text-base font-bold ${isToday(d) ? "text-white" : "text-stone-800"}`}>
                          {d.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Time slots */}
                  {HOUR_LABELS.map((hour) => (
                    <div key={hour} className="grid grid-cols-8 border-t border-stone-100">
                      {/* Time label */}
                      <div className="text-xs text-stone-400 pr-2 pt-1 text-right">
                        {hour % 12 === 0 ? 12 : hour % 12}
                        {hour < 12 ? "am" : "pm"}
                      </div>
                      {weekDates.map((day, di) => {
                        const slotConsultations = getConsultationsForSlot(day, hour);
                        return (
                          <div
                            key={di}
                            className={`min-h-[40px] px-0.5 py-0.5 ${
                              isToday(day) ? "bg-teal-50/40" : ""
                            }`}
                          >
                            {slotConsultations.map((c) => (
                              <button
                                key={c.id}
                                onClick={() => setSelected(c)}
                                className={`w-full text-left rounded-md px-1.5 py-1 text-xs border mb-0.5 transition-opacity hover:opacity-80 ${STATUS_COLORS[c.status]}`}
                              >
                                <div className="font-semibold truncate">
                                  {c.patient.account.firstName} {c.patient.account.lastName}
                                </div>
                                <div className="opacity-70">
                                  {new Date(c.date).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                  })}
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </DashboardCard>
          </div>

          {/* Detail panel */}
          <div>
            <DashboardCard title="Consultation Detail">
              {!selected ? (
                <div className="text-center py-8">
                  <Calendar size={36} className="mx-auto text-stone-200 mb-2" />
                  <p className="text-stone-400 text-sm">
                    Click a consultation block to see details.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2.5 py-0.5 rounded-full font-medium border ${STATUS_COLORS[selected.status]}`}
                    >
                      {STATUS_LABEL[selected.status]}
                    </span>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <User size={16} className="text-teal-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">
                        {selected.patient.account.firstName}{" "}
                        {selected.patient.account.lastName}
                      </p>
                      <p className="text-xs text-stone-400">Patient</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Calendar size={14} className="text-teal-600" />
                    <span>
                      {new Date(selected.date).toLocaleDateString(undefined, {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-stone-600">
                    <Clock size={14} className="text-teal-600" />
                    <span>
                      {new Date(selected.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>

                  {selected.notes && (
                    <div className="bg-stone-50 rounded-xl p-3">
                      <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                        Notes
                      </p>
                      <p className="text-sm text-stone-600 leading-relaxed">{selected.notes}</p>
                    </div>
                  )}

                  <button
                    onClick={() => setSelected(null)}
                    className="w-full text-center text-xs text-stone-400 hover:text-stone-600 mt-2"
                  >
                    Close
                  </button>
                </div>
              )}
            </DashboardCard>

            {/* This week summary */}
            <DashboardCard title="This Week" className="mt-4">
              {!data || data.consultations.length === 0 ? (
                <p className="text-stone-400 text-sm">No consultations this week.</p>
              ) : (
                <div className="space-y-2">
                  {data.consultations.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => setSelected(c)}
                      className={`w-full text-left flex items-start gap-2 p-2 rounded-lg border transition-colors hover:bg-stone-50 ${
                        selected?.id === c.id ? "border-teal-300 bg-teal-50" : "border-stone-100"
                      }`}
                    >
                      <div
                        className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${
                          c.status === "COMPLETED"
                            ? "bg-emerald-500"
                            : c.status === "PENDING"
                            ? "bg-amber-400"
                            : c.status === "IN_PROGRESS"
                            ? "bg-blue-500"
                            : "bg-red-400"
                        }`}
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-stone-700 truncate">
                          {c.patient.account.firstName} {c.patient.account.lastName}
                        </p>
                        <p className="text-xs text-stone-400">
                          {new Date(c.date).toLocaleDateString(undefined, {
                            weekday: "short",
                            month: "short",
                            day: "numeric",
                          })}{" "}
                          at{" "}
                          {new Date(c.date).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </DashboardCard>
          </div>
        </div>
      )}
    </div>
  );
}
