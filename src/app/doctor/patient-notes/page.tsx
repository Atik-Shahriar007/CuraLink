"use client";

import { useState, useEffect, useCallback } from "react";
import { FileText, Search, User, ChevronDown, ChevronUp, Eye } from "lucide-react";
import Link from "next/link";
import DashboardCard from "@/app/components/DashboardCard";

interface PrescriptionItem {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  duration: string;
}

interface Prescription {
  id: string;
  advice: string | null;
  items: PrescriptionItem[];
}

interface ConsultationWithNotes {
  id: string;
  date: string;
  notes: string;
  patient: {
    id: string;
    account: { firstName: string; lastName: string; email: string };
  };
  prescription: Prescription | null;
}

export default function DoctorPatientNotesPage() {
  const [consultations, setConsultations] = useState<ConsultationWithNotes[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const fetchNotes = useCallback((q: string) => {
    setLoading(true);
    fetch(`/api/doctor/patient-notes?search=${encodeURIComponent(q)}`)
      .then((res) => res.json())
      .then((data) => setConsultations(data.consultations ?? []))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    fetchNotes("");
  }, [fetchNotes]);

  // Debounced search
  useEffect(() => {
    const t = setTimeout(() => fetchNotes(search), 350);
    return () => clearTimeout(t);
  }, [search, fetchNotes]);

  const toggleExpanded = (id: string) => {
    setExpandedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Group by patient
  const grouped = consultations.reduce<Record<string, ConsultationWithNotes[]>>((acc, c) => {
    const key = c.patient.id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-950 to-teal-800 text-white rounded-2xl p-6 mb-6">
        <h1 className="text-xl font-display font-semibold">Patient Notes</h1>
        <p className="text-teal-100 text-sm mt-1">
          Clinical notes from completed consultations.
        </p>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search by patient name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 bg-white"
        />
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Loading notes...</p>
      ) : Object.keys(grouped).length === 0 ? (
        <div className="text-center py-16">
          <FileText size={40} className="mx-auto text-stone-300 mb-3" />
          <p className="text-stone-500">No clinical notes found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(grouped).map(([, patientConsultations]) => {
            const patient = patientConsultations[0].patient;
            const fullName = `${patient.account.firstName} ${patient.account.lastName}`;
            return (
              <DashboardCard key={patient.id}>
                {/* Patient header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-teal-100 flex items-center justify-center shrink-0">
                      <User size={16} className="text-teal-700" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-800">{fullName}</p>
                      <p className="text-xs text-stone-400">{patient.account.email}</p>
                    </div>
                  </div>
                  <Link
                    href={`/doctor/patients/${patient.id}/records`}
                    className="flex items-center gap-1.5 text-teal-700 hover:text-teal-800 text-sm font-medium"
                  >
                    <Eye size={14} />
                    View Records
                  </Link>
                </div>

                {/* Consultations */}
                <div className="space-y-3">
                  {patientConsultations.map((c) => {
                    const isExpanded = expandedIds.has(c.id);
                    return (
                      <div
                        key={c.id}
                        className="border border-stone-100 rounded-xl overflow-hidden"
                      >
                        {/* Note header */}
                        <button
                          onClick={() => toggleExpanded(c.id)}
                          className="w-full flex items-center justify-between px-4 py-3 hover:bg-stone-50 transition-colors text-left"
                        >
                          <span className="text-sm text-stone-700 font-medium">
                            Consultation on{" "}
                            {new Date(c.date).toLocaleDateString(undefined, {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </span>
                          {isExpanded ? (
                            <ChevronUp size={16} className="text-stone-400" />
                          ) : (
                            <ChevronDown size={16} className="text-stone-400" />
                          )}
                        </button>

                        {/* Expanded content */}
                        {isExpanded && (
                          <div className="border-t border-stone-100 px-4 py-4 bg-stone-50 space-y-4">
                            {/* Clinical note */}
                            <div>
                              <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-1">
                                Clinical Note
                              </p>
                              <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-wrap">
                                {c.notes}
                              </p>
                            </div>

                            {/* Prescription */}
                            {c.prescription && (
                              <div>
                                <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
                                  Prescription
                                </p>
                                {c.prescription.advice && (
                                  <p className="text-sm text-stone-600 mb-2 italic">
                                    {c.prescription.advice}
                                  </p>
                                )}
                                {c.prescription.items.length > 0 ? (
                                  <div className="overflow-x-auto">
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="text-stone-500 border-b border-stone-200">
                                          <th className="pb-1.5 text-left font-medium">Medicine</th>
                                          <th className="pb-1.5 text-left font-medium">Dosage</th>
                                          <th className="pb-1.5 text-left font-medium">Frequency</th>
                                          <th className="pb-1.5 text-left font-medium">Duration</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {c.prescription.items.map((item) => (
                                          <tr key={item.id} className="border-b border-stone-100 last:border-0">
                                            <td className="py-1.5 text-stone-700 font-medium">{item.name}</td>
                                            <td className="py-1.5 text-stone-600">{item.dosage}</td>
                                            <td className="py-1.5 text-stone-600">{item.frequency}</td>
                                            <td className="py-1.5 text-stone-600">{item.duration}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                ) : (
                                  <p className="text-xs text-stone-400">No items in prescription.</p>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </DashboardCard>
            );
          })}
        </div>
      )}
    </div>
  );
}
