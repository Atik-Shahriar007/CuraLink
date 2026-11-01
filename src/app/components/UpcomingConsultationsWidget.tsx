"use client";

import { useState, useEffect } from "react";
import { Clock, CalendarDays, CheckCircle2, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

interface Consultation {
  id: string;
  date: string;
  status: string;
  doctor?: { account: { firstName: string | null; lastName: string | null }; specialty: string | null };
  patient?: { account: { firstName: string | null; lastName: string | null } };
}

const statusConfig: Record<string, { label: string; color: string }> = {
  PENDING: { label: "Pending", color: "bg-amber-100 text-amber-800" },
  IN_PROGRESS: { label: "In Progress", color: "bg-blue-100 text-blue-800" },
  COMPLETED: { label: "Completed", color: "bg-green-100 text-green-700" },
  CANCELED: { label: "Canceled", color: "bg-red-100 text-red-700" },
};

interface UpcomingConsultationCardProps {
  consultation: Consultation;
  viewAs: "patient" | "doctor";
}

function UpcomingConsultationCard({ consultation, viewAs }: UpcomingConsultationCardProps) {
  const date = new Date(consultation.date);
  const isToday = new Date().toDateString() === date.toDateString();
  const isPast = date < new Date();
  const config = statusConfig[consultation.status] || { label: consultation.status, color: "bg-stone-100 text-stone-700" };

  const name = viewAs === "patient"
    ? `Dr. ${consultation.doctor?.account.firstName || ""} ${consultation.doctor?.account.lastName || ""}`.trim()
    : `${consultation.patient?.account.firstName || ""} ${consultation.patient?.account.lastName || ""}`.trim();

  const sub = viewAs === "patient"
    ? consultation.doctor?.specialty || "General"
    : "Patient";

  return (
    <div className={`border rounded-xl p-4 flex items-center gap-4 bg-white transition-shadow hover:shadow-sm ${isToday ? "border-teal-300 bg-teal-50/30" : "border-stone-200"}`}>
      <div className={`w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0 ${isToday ? "bg-teal-700 text-white" : "bg-stone-100 text-stone-600"}`}>
        <span className="text-xs font-medium">{date.toLocaleDateString("en", { month: "short" })}</span>
        <span className="text-lg font-bold leading-none">{date.getDate()}</span>
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p className="font-medium text-stone-800 truncate">{name}</p>
          {isToday && <span className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">Today</span>}
        </div>
        <p className="text-xs text-stone-500 mt-0.5">{sub}</p>
        <div className="flex items-center gap-3 mt-1">
          <span className="text-xs text-stone-500 flex items-center gap-1">
            <Clock size={10} /> {date.toLocaleTimeString("en", { hour: "2-digit", minute: "2-digit" })}
          </span>
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${config.color}`}>{config.label}</span>
        </div>
      </div>
      {!isPast && consultation.status === "PENDING" && (
        <Link
          href={viewAs === "patient" ? "/patient/consultations" : "/doctor/consultations"}
          className="flex-shrink-0 p-2 text-teal-700 hover:bg-teal-50 rounded-lg transition-colors"
        >
          <ArrowRight size={16} />
        </Link>
      )}
    </div>
  );
}

interface UpcomingConsultationsWidgetProps {
  apiUrl: string;
  viewAs: "patient" | "doctor";
  limit?: number;
}

export default function UpcomingConsultationsWidget({ apiUrl, viewAs, limit = 3 }: UpcomingConsultationsWidgetProps) {
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(apiUrl)
      .then((r) => r.json())
      .then((data) => {
        const upcoming = (data.consultations || data.tableRows || [])
          .filter((c: Consultation) => ["PENDING", "IN_PROGRESS"].includes(c.status))
          .slice(0, limit);
        setConsultations(upcoming);
      })
      .finally(() => setLoading(false));
  }, [apiUrl, limit]);

  if (loading) return <div className="animate-pulse h-24 bg-stone-100 rounded-xl" />;

  return (
    <div className="space-y-3">
      {consultations.length === 0 ? (
        <div className="text-center py-6 text-stone-400">
          <CalendarDays size={24} className="mx-auto mb-2 opacity-40" />
          <p className="text-sm">No upcoming consultations</p>
        </div>
      ) : (
        consultations.map((c) => (
          <UpcomingConsultationCard key={c.id} consultation={c} viewAs={viewAs} />
        ))
      )}
    </div>
  );
}
