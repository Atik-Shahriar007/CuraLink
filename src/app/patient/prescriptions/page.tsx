"use client";

import { useState, useEffect } from "react";
import {
  FileText, Download, ChevronDown, ChevronUp, Search, Printer, Pill,
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";

interface PrescriptionItem {
  id: string;
  name: string;
  genericName?: string;
  strengthForm?: string;
  dosage?: string;
  category?: string;
}

interface Prescription {
  id: string;
  createdAt: string;
  advice?: string;
  revision: number;
  doctor: {
    account: { firstName: string; lastName: string };
    specialty?: string;
  };
  consultation?: { status: string };
  items: PrescriptionItem[];
}

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetch("/api/patient/prescriptions")
      .then((res) => res.json())
      .then(({ prescriptions }) => setPrescriptions(prescriptions || []))
      .catch(() => setPrescriptions([]))
      .finally(() => setLoading(false));
  }, []);

  const filtered = prescriptions.filter((p) => {
    const q = search.toLowerCase();
    const doctorName = `${p.doctor.account.firstName} ${p.doctor.account.lastName}`.toLowerCase();
    const medNames = p.items.map((i) => i.name.toLowerCase()).join(" ");
    return doctorName.includes(q) || medNames.includes(q);
  });

  const toggle = (id: string) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handlePrint = (p: Prescription) => {
    const doctorName = `Dr. ${p.doctor.account.firstName} ${p.doctor.account.lastName}`;
    const items = p.items
      .map(
        (i) =>
          `<tr>
            <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.name}${i.genericName ? ` (${i.genericName})` : ""}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.strengthForm || "—"}</td>
            <td style="padding:6px 12px;border-bottom:1px solid #eee">${i.dosage || "—"}</td>
          </tr>`
      )
      .join("");

    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(`
      <html><head><title>Prescription</title>
      <style>body{font-family:sans-serif;padding:40px;max-width:700px;margin:auto}
      h1{font-size:22px;margin-bottom:4px}
      .meta{color:#666;font-size:14px;margin-bottom:20px}
      table{width:100%;border-collapse:collapse}
      th{background:#f5f5f5;padding:8px 12px;text-align:left;font-size:13px}
      .advice{margin-top:20px;background:#f9f9f9;padding:12px;border-radius:8px;font-size:14px}
      </style></head><body>
      <h1>Prescription</h1>
      <div class="meta">Issued by ${doctorName} · ${p.doctor.specialty || ""} · ${new Date(p.createdAt).toLocaleDateString()}</div>
      <table>
        <thead><tr><th>Medicine</th><th>Strength/Form</th><th>Dosage</th></tr></thead>
        <tbody>${items}</tbody>
      </table>
      ${p.advice ? `<div class="advice"><strong>Advice:</strong> ${p.advice}</div>` : ""}
      </body></html>
    `);
    win.document.close();
    win.print();
  };

  const statusColor: Record<string, string> = {
    COMPLETED: "text-green-700 bg-green-50",
    PENDING: "text-amber-700 bg-amber-50",
    CANCELED: "text-red-700 bg-red-50",
    IN_PROGRESS: "text-blue-700 bg-blue-50",
  };

  if (loading) return <p className="text-stone-500">Loading prescriptions...</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display mb-1">Prescription History</h1>
          <p className="text-stone-500">View and download all your prescriptions.</p>
        </div>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400" />
        <input
          type="text"
          placeholder="Search by doctor or medicine name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full border border-stone-200 rounded-xl pl-9 pr-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-900/20"
        />
      </div>

      {filtered.length === 0 ? (
        <DashboardCard>
          <div className="text-center py-12 text-stone-400">
            <FileText size={48} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium text-stone-600">No prescriptions found</p>
            <p className="text-sm mt-1">Prescriptions from consultations will appear here.</p>
          </div>
        </DashboardCard>
      ) : (
        <div className="space-y-4">
          {filtered.map((p) => {
            const isOpen = expanded.has(p.id);
            const doctorName = `Dr. ${p.doctor.account.firstName} ${p.doctor.account.lastName}`;
            return (
              <div
                key={p.id}
                className="bg-white border border-stone-200 rounded-2xl overflow-hidden"
              >
                {/* Header */}
                <div className="flex items-center justify-between p-5">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-teal-50 rounded-xl flex items-center justify-center">
                      <FileText size={18} className="text-teal-800" />
                    </div>
                    <div>
                      <p className="font-semibold text-stone-900">{doctorName}</p>
                      <p className="text-sm text-stone-500">
                        {p.doctor.specialty && `${p.doctor.specialty} · `}
                        {new Date(p.createdAt).toLocaleDateString()} · {p.items.length} medicine
                        {p.items.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.revision > 1 && (
                      <span className="text-xs font-medium px-2 py-1 rounded-full bg-blue-50 text-blue-700">
                        Updated (v{p.revision})
                      </span>
                    )}
                    {p.consultation?.status && (
                      <span
                        className={`text-xs font-medium px-2 py-1 rounded-full ${
                          statusColor[p.consultation.status] || "bg-stone-100 text-stone-600"
                        }`}
                      >
                        {p.consultation.status}
                      </span>
                    )}
                    <button
                      onClick={() => handlePrint(p)}
                      className="p-2 text-stone-400 hover:text-teal-800 hover:bg-stone-50 rounded-lg transition-colors"
                      title="Print prescription"
                    >
                      <Printer size={16} />
                    </button>
                    <button
                      onClick={() => toggle(p.id)}
                      className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-50 rounded-lg transition-colors"
                    >
                      {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div className="border-t border-stone-100 p-5">
                    {p.advice && (
                      <div className="bg-teal-50 border border-teal-100 rounded-xl p-3 mb-4 text-sm text-teal-900">
                        <strong>Doctor&apos;s Advice:</strong> {p.advice}
                      </div>
                    )}
                    <div className="space-y-3">
                      {p.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start gap-3 p-3 bg-stone-50 rounded-xl"
                        >
                          <Pill size={16} className="text-stone-400 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-stone-900 text-sm">{item.name}</p>
                            {item.genericName && (
                              <p className="text-xs text-stone-400">Generic: {item.genericName}</p>
                            )}
                            <div className="flex flex-wrap gap-2 mt-1">
                              {item.strengthForm && (
                                <span className="text-xs bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                                  {item.strengthForm}
                                </span>
                              )}
                              {item.dosage && (
                                <span className="text-xs bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                                  {item.dosage}
                                </span>
                              )}
                              {item.category && (
                                <span className="text-xs bg-white border border-stone-200 text-stone-600 px-2 py-0.5 rounded-full">
                                  {item.category}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <button
                      onClick={() => handlePrint(p)}
                      className="mt-4 flex items-center gap-2 text-sm text-teal-800 hover:text-teal-900 font-medium"
                    >
                      <Download size={15} /> Download / Print
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
