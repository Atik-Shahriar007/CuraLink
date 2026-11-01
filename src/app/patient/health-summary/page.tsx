"use client";

import { useState, useEffect } from "react";
import {
  Heart, User, Clipboard, AlertTriangle, Phone, FileText,
  Activity, Pill, Printer, Pencil,
} from "lucide-react";
import Link from "next/link";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";

interface HealthSummaryData {
  patient: {
    account: {
      firstName: string;
      lastName: string;
      email: string;
      phone?: string;
      age?: number;
    };
    gender?: string;
    bloodType?: string;
    weight?: number;
    height?: number;
    allergies?: string[];
    chronicConditions?: string[];
    currentMedications?: string[];
    emergencyContactName?: string;
    emergencyContactPhone?: string;
  };
  stats: {
    totalConsultations: number;
    completed: number;
    canceled: number;
    uniqueDoctors: number;
    totalPrescriptions: number;
  };
  topDoctors: { doctor: { account: { firstName: string; lastName: string }; specialty?: string }; count: number }[];
}

function bmi(weight?: number, height?: number): string {
  if (!weight || !height) return "—";
  const bmiVal = weight / Math.pow(height / 100, 2);
  return bmiVal.toFixed(1);
}

function bmiCategory(weight?: number, height?: number): string {
  if (!weight || !height) return "";
  const b = weight / Math.pow(height / 100, 2);
  if (b < 18.5) return "Underweight";
  if (b < 25) return "Normal";
  if (b < 30) return "Overweight";
  return "Obese";
}

function bmiColor(weight?: number, height?: number): string {
  if (!weight || !height) return "text-stone-400";
  const b = weight / Math.pow(height / 100, 2);
  if (b < 18.5) return "text-blue-600";
  if (b < 25) return "text-green-600";
  if (b < 30) return "text-amber-600";
  return "text-red-600";
}

function formatBloodType(bt?: string) {
  return bt?.replace("_", " ") || "—";
}

export default function HealthSummaryPage() {
  const [data, setData] = useState<HealthSummaryData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/patient/health-summary")
      .then((res) => res.json())
      .then(setData)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-stone-500">Loading health summary...</p>;
  if (!data) return <p className="text-red-500">Failed to load health summary.</p>;

  const { patient, stats, topDoctors } = data;
  const fullName = `${patient.account.firstName} ${patient.account.lastName}`;
  const bmiVal = bmi(patient.weight, patient.height);
  const bmiCat = bmiCategory(patient.weight, patient.height);
  const bmiCls = bmiColor(patient.weight, patient.height);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display mb-1">Health Summary</h1>
          <p className="text-stone-500">Your comprehensive personal health profile.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-stone-300 px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-50"
          >
            <Printer size={15} /> Print
          </button>
          <Link
            href="/patient/profile"
            className="flex items-center gap-2 bg-teal-950 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-teal-900"
          >
            <Pencil size={14} /> Edit Profile
          </Link>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <StatCard
          label="Consultations"
          value={stats.totalConsultations}
          icon={Activity}
          iconColor="#0F3D3E"
          iconBg="#E7F1F0"
        />
        <StatCard
          label="Completed"
          value={stats.completed}
          icon={FileText}
          iconColor="#2E7D32"
          iconBg="#E8F5E9"
        />
        <StatCard
          label="Canceled"
          value={stats.canceled}
          icon={AlertTriangle}
          iconColor="#B5541B"
          iconBg="#FBEFE6"
        />
        <StatCard
          label="Doctors Met"
          value={stats.uniqueDoctors}
          icon={User}
          iconColor="#8A6D00"
          iconBg="#FFF8E1"
        />
        <StatCard
          label="Prescriptions"
          value={stats.totalPrescriptions}
          icon={Pill}
          iconColor="#7B1FA2"
          iconBg="#F3E5F5"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Personal Info */}
        <DashboardCard
          title="Personal Information"
          action={
            <User size={18} className="text-teal-800" />
          }
        >
          <div className="space-y-3">
            <InfoRow label="Full Name" value={fullName} />
            <InfoRow label="Email" value={patient.account.email} />
            <InfoRow label="Phone" value={patient.account.phone || "—"} />
            {patient.account.age && <InfoRow label="Age" value={`${patient.account.age} years`} />}
            <InfoRow label="Gender" value={patient.gender || "—"} />
          </div>
        </DashboardCard>

        {/* Vitals */}
        <DashboardCard
          title="Physical Measurements"
          action={<Heart size={18} className="text-teal-800" />}
        >
          <div className="grid grid-cols-2 gap-4">
            <MeasureTile label="Blood Type" value={formatBloodType(patient.bloodType)} />
            <MeasureTile
              label="Weight"
              value={patient.weight ? `${patient.weight} kg` : "—"}
            />
            <MeasureTile
              label="Height"
              value={patient.height ? `${patient.height} cm` : "—"}
            />
            <div className="bg-stone-50 rounded-xl px-3 py-3 text-center">
              <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">BMI</p>
              <p className={`text-xl font-bold ${bmiCls}`}>{bmiVal}</p>
              {bmiCat && <p className={`text-xs font-medium ${bmiCls}`}>{bmiCat}</p>}
            </div>
          </div>
        </DashboardCard>
      </div>

      {/* Medical History */}
      <DashboardCard
        title="Medical History"
        className="mb-6"
        action={<Clipboard size={18} className="text-teal-800" />}
      >
        <div className="grid sm:grid-cols-3 gap-6">
          <MedList
            icon={AlertTriangle}
            label="Allergies"
            items={patient.allergies || []}
            color="text-red-500"
          />
          <MedList
            icon={Activity}
            label="Chronic Conditions"
            items={patient.chronicConditions || []}
            color="text-amber-500"
          />
          <MedList
            icon={Pill}
            label="Current Medications"
            items={patient.currentMedications || []}
            color="text-blue-500"
          />
        </div>
      </DashboardCard>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Top Doctors */}
        <DashboardCard title="Most Consulted Doctors">
          {topDoctors.length === 0 ? (
            <p className="text-sm text-stone-400">No consultations yet.</p>
          ) : (
            <div className="space-y-3">
              {topDoctors.map(({ doctor, count }, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-stone-900 text-sm">
                      Dr. {doctor.account.firstName} {doctor.account.lastName}
                    </p>
                    {doctor.specialty && (
                      <p className="text-xs text-stone-400">{doctor.specialty}</p>
                    )}
                  </div>
                  <span className="text-xs text-teal-800 bg-teal-50 px-2 py-1 rounded-full font-medium">
                    {count} visit{count !== 1 ? "s" : ""}
                  </span>
                </div>
              ))}
            </div>
          )}
        </DashboardCard>

        {/* Emergency Contact */}
        <DashboardCard
          title="Emergency Contact"
          action={<Phone size={18} className="text-teal-800" />}
        >
          {patient.emergencyContactName || patient.emergencyContactPhone ? (
            <div className="space-y-3">
              <InfoRow label="Contact Name" value={patient.emergencyContactName || "—"} />
              <InfoRow label="Contact Phone" value={patient.emergencyContactPhone || "—"} />
            </div>
          ) : (
            <div className="text-sm text-stone-400 py-4 text-center">
              <Phone size={32} className="mx-auto mb-2 opacity-30" />
              <p>No emergency contact on file.</p>
              <Link
                href="/patient/profile"
                className="text-teal-800 hover:underline text-sm"
              >
                Add emergency contact →
              </Link>
            </div>
          )}
        </DashboardCard>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center py-2 border-b border-stone-100 last:border-0">
      <span className="text-sm text-stone-400">{label}</span>
      <span className="text-sm font-medium text-stone-900">{value}</span>
    </div>
  );
}

function MeasureTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-stone-50 rounded-xl px-3 py-3 text-center">
      <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">{label}</p>
      <p className="font-bold text-stone-900">{value}</p>
    </div>
  );
}

function MedList({
  icon: Icon,
  label,
  items,
  color,
}: {
  icon: React.ElementType;
  label: string;
  items: string[];
  color: string;
}) {
  return (
    <div>
      <p className={`flex items-center gap-2 text-sm font-semibold mb-2 ${color}`}>
        <Icon size={15} /> {label}
      </p>
      {items.length === 0 ? (
        <p className="text-sm text-stone-400">None reported</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {items.map((item, i) => (
            <span
              key={i}
              className="text-xs bg-stone-100 text-stone-700 px-2 py-1 rounded-full"
            >
              {item}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
