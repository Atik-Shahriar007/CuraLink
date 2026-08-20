"use client";

import { useState, useEffect } from "react";
import { FileText, Upload, Trash2, X } from "lucide-react";

interface MedicalDocument {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  notes: string | null;
  createdAt: string;
}

const categoryLabels: Record<string, string> = {
  LAB_REPORT: "Lab Report",
  PRESCRIPTION: "Prescription",
  IMAGING: "Imaging",
  VACCINATION: "Vaccination",
  OTHER: "Other",
};

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function PatientMedicalRecordsPage() {
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("LAB_REPORT");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);

  function load() {
    setLoading(true);
    fetch("/api/patient/medical-records")
      .then((res) => res.json())
      .then((d) => setDocuments(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  }

  useEffect(load, []);

  async function handleUpload() {
    setError("");
    if (!title.trim() || !file) {
      setError("Please provide a title and choose a file.");
      return;
    }
    setUploading(true);
    try {
      const fileBase64 = await fileToBase64(file);
      const res = await fetch("/api/patient/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, category, notes, fileBase64 }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Could not upload document.");
        return;
      }
      setTitle("");
      setNotes("");
      setFile(null);
      setCategory("LAB_REPORT");
      setShowUpload(false);
      load();
    } finally {
      setUploading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this document? This can't be undone.")) return;
    setDeletingId(id);
    try {
      await fetch(`/api/patient/medical-records/${id}`, { method: "DELETE" });
      load();
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-stone-500 text-sm">
            Lab reports, imaging, old prescriptions — kept here so any doctor you consult can review them.
          </p>
        </div>
        <button
          onClick={() => setShowUpload(true)}
          className="flex items-center gap-2 bg-teal-950 text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-900 flex-shrink-0"
        >
          <Upload size={14} /> Upload
        </button>
      </div>

      {showUpload && (
        <div className="border border-stone-200 rounded-2xl bg-white p-5 mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Upload a document</h2>
            <button onClick={() => setShowUpload(false)} className="text-stone-400 hover:text-stone-600">
              <X size={18} />
            </button>
          </div>
          <div className="space-y-3">
            <input
              placeholder="Title (e.g. Blood test — Jan 2026)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            >
              {Object.entries(categoryLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
            <textarea
              placeholder="Notes (optional)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full h-20"
            />
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="text-sm"
            />
            {error && <p className="text-red-600 text-sm">{error}</p>}
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900 disabled:opacity-50"
            >
              {uploading ? "Uploading..." : "Save"}
            </button>
          </div>
        </div>
      )}

      {loading ? (
        <p className="text-stone-400">Loading...</p>
      ) : documents.length === 0 ? (
        <p className="text-stone-400">No documents uploaded yet.</p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <div
              key={doc.id}
              className="flex items-center gap-3 border rounded-xl p-4 bg-white"
            >
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 flex-1 min-w-0 hover:text-teal-900"
              >
                <FileText size={20} className="text-teal-800 flex-shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{doc.title}</p>
                  <p className="text-xs text-stone-400">
                    {categoryLabels[doc.category] || doc.category} · {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                  {doc.notes && <p className="text-sm text-stone-600 mt-1">{doc.notes}</p>}
                </div>
              </a>
              <button
                onClick={() => handleDelete(doc.id)}
                disabled={deletingId === doc.id}
                className="text-stone-400 hover:text-red-600 flex-shrink-0 disabled:opacity-50"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
