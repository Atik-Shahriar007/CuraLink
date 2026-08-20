"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { FileText, AlertCircle } from "lucide-react";

interface MedicalDocument {
  id: string;
  title: string;
  category: string;
  fileUrl: string;
  notes: string | null;
  createdAt: string;
}

interface PatientSummary {
  allergies: string[];
  chronicConditions: string[];
  currentMedications: string[];
  bloodType: string | null;
  account: { firstName: string | null; lastName: string | null };
}

const categoryLabels: Record<string, string> = {
  LAB_REPORT: "Lab Report",
  PRESCRIPTION: "Prescription",
  IMAGING: "Imaging",
  VACCINATION: "Vaccination",
  OTHER: "Other",
};

export default function DoctorPatientRecordsPage() {
  const { patientId } = useParams<{ patientId: string }>();
  const [documents, setDocuments] = useState<MedicalDocument[]>([]);
  const [patient, setPatient] = useState<PatientSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/doctor/patients/${patientId}/medical-records`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Could not load records");
        setDocuments(data.documents);
        setPatient(data.patient);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [patientId]);

  if (loading) return <p className="max-w-3xl mx-auto px-4 py-8 text-stone-400">Loading...</p>;
  if (error) return <p className="max-w-3xl mx-auto px-4 py-8 text-red-600">{error}</p>;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-1">
        {patient?.account.firstName} {patient?.account.lastName}&rsquo;s Records
      </h1>
      <p className="text-stone-500 text-sm mb-6">Read-only — shared because you have a consultation with this patient.</p>

      <div className="border rounded-xl p-5 bg-white mb-6">
        <h2 className="font-semibold mb-3">Health Summary</h2>
        <div className="grid sm:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Blood Type</p>
            <p>{patient?.bloodType?.replace("_", " ") || "—"}</p>
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Allergies</p>
            <p>{patient?.allergies?.length ? patient.allergies.join(", ") : "None reported"}</p>
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Chronic Conditions</p>
            <p>{patient?.chronicConditions?.length ? patient.chronicConditions.join(", ") : "None reported"}</p>
          </div>
          <div>
            <p className="text-stone-400 text-xs uppercase tracking-wide mb-1">Current Medications</p>
            <p>{patient?.currentMedications?.length ? patient.currentMedications.join(", ") : "None reported"}</p>
          </div>
        </div>
      </div>

      <h2 className="font-semibold mb-3">Uploaded Documents</h2>
      {documents.length === 0 ? (
        <p className="text-stone-400 text-sm flex items-center gap-2">
          <AlertCircle size={16} /> This patient hasn&rsquo;t uploaded any documents yet.
        </p>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => (
            <a
              key={doc.id}
              href={doc.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 border rounded-xl p-4 bg-white hover:border-teal-800/30 hover:shadow-sm transition-all"
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
          ))}
        </div>
      )}
    </div>
  );
}
