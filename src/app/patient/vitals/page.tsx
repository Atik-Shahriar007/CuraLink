"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Heart, Activity, Thermometer, Droplet, TrendingUp, Scale,
  Plus, Trash2, ChevronDown,
} from "lucide-react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import DashboardCard from "@/app/components/DashboardCard";

type VitalType = "bp" | "heartRate" | "weight" | "glucose" | "temperature" | "spo2";

interface VitalReading {
  id: string;
  type: VitalType;
  value: number;
  value2?: number; // diastolic for BP
  notes: string;
  timestamp: string;
}

const VITAL_CONFIG: Record<
  VitalType,
  {
    label: string;
    unit: string;
    icon: React.ElementType;
    color: string;
    normal: [number, number];
    warning: [number, number];
    dataKey: string;
  }
> = {
  bp: {
    label: "Blood Pressure",
    unit: "mmHg",
    icon: Heart,
    color: "#0F3D3E",
    normal: [90, 120],
    warning: [120, 140],
    dataKey: "Systolic",
  },
  heartRate: {
    label: "Heart Rate",
    unit: "bpm",
    icon: Activity,
    color: "#B5541B",
    normal: [60, 100],
    warning: [100, 120],
    dataKey: "BPM",
  },
  weight: {
    label: "Weight",
    unit: "kg",
    icon: Scale,
    color: "#2E7D32",
    normal: [50, 90],
    warning: [90, 110],
    dataKey: "kg",
  },
  glucose: {
    label: "Blood Glucose",
    unit: "mg/dL",
    icon: Droplet,
    color: "#8A6D00",
    normal: [70, 100],
    warning: [100, 125],
    dataKey: "mg/dL",
  },
  temperature: {
    label: "Temperature",
    unit: "°C",
    icon: Thermometer,
    color: "#7B1FA2",
    normal: [36.1, 37.2],
    warning: [37.2, 38.0],
    dataKey: "°C",
  },
  spo2: {
    label: "SpO2",
    unit: "%",
    icon: TrendingUp,
    color: "#1565C0",
    normal: [95, 100],
    warning: [90, 95],
    dataKey: "%",
  },
};

const TABS: VitalType[] = ["bp", "heartRate", "weight", "glucose", "temperature", "spo2"];

function getStatusColor(type: VitalType, value: number): string {
  const cfg = VITAL_CONFIG[type];
  if (value >= cfg.normal[0] && value <= cfg.normal[1]) return "text-green-700 bg-green-50";
  if (value >= cfg.warning[0] && value <= cfg.warning[1]) return "text-amber-700 bg-amber-50";
  return "text-red-700 bg-red-50";
}

function getStatusLabel(type: VitalType, value: number): string {
  const cfg = VITAL_CONFIG[type];
  if (value >= cfg.normal[0] && value <= cfg.normal[1]) return "Normal";
  if (value >= cfg.warning[0] && value <= cfg.warning[1]) return "Warning";
  return "Danger";
}

const LS_KEY = "curalink_vitals";

function loadReadings(): VitalReading[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || "[]");
  } catch {
    return [];
  }
}

function saveReadings(readings: VitalReading[]) {
  localStorage.setItem(LS_KEY, JSON.stringify(readings));
}

export default function VitalsPage() {
  const [activeTab, setActiveTab] = useState<VitalType>("bp");
  const [readings, setReadings] = useState<VitalReading[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ value: "", value2: "", notes: "" });

  useEffect(() => {
    setReadings(loadReadings());
  }, []);

  const currentReadings = readings
    .filter((r) => r.type === activeTab)
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, 10);

  const chartData = [...currentReadings].reverse().map((r) => ({
    time: new Date(r.timestamp).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    value: r.value,
  }));

  const handleAdd = useCallback(() => {
    if (!form.value) return;
    const newReading: VitalReading = {
      id: Date.now().toString(),
      type: activeTab,
      value: parseFloat(form.value),
      value2: form.value2 ? parseFloat(form.value2) : undefined,
      notes: form.notes,
      timestamp: new Date().toISOString(),
    };
    const updated = [newReading, ...readings];
    setReadings(updated);
    saveReadings(updated);
    setForm({ value: "", value2: "", notes: "" });
    setShowForm(false);
  }, [activeTab, form, readings]);

  const handleDelete = useCallback(
    (id: string) => {
      const updated = readings.filter((r) => r.id !== id);
      setReadings(updated);
      saveReadings(updated);
    },
    [readings]
  );

  const cfg = VITAL_CONFIG[activeTab];
  const Icon = cfg.icon;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold font-display mb-1">Health Vitals</h1>
          <p className="text-stone-500">Track and monitor your vital signs over time.</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-teal-950 text-white px-4 py-2.5 rounded-xl text-sm font-medium hover:bg-teal-900"
        >
          <Plus size={16} /> Add Reading
        </button>
      </div>

      {/* Tab Switcher */}
      <div className="flex flex-wrap gap-2 mb-6">
        {TABS.map((tab) => {
          const TabIcon = VITAL_CONFIG[tab].icon;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                activeTab === tab
                  ? "bg-teal-950 text-white border-teal-950"
                  : "bg-white text-stone-600 border-stone-200 hover:bg-stone-50"
              }`}
            >
              <TabIcon size={15} />
              {VITAL_CONFIG[tab].label}
            </button>
          );
        })}
      </div>

      {/* Add Reading Form */}
      {showForm && (
        <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-6">
          <h2 className="font-semibold text-stone-900 mb-4 flex items-center gap-2">
            <Icon size={18} className="text-teal-800" /> Add {cfg.label} Reading
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">
                {activeTab === "bp" ? "Systolic (mmHg)" : `Value (${cfg.unit})`}
              </label>
              <input
                type="number"
                placeholder={activeTab === "bp" ? "e.g. 120" : `e.g. ${cfg.normal[0]}`}
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
            {activeTab === "bp" && (
              <div>
                <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">
                  Diastolic (mmHg)
                </label>
                <input
                  type="number"
                  placeholder="e.g. 80"
                  value={form.value2}
                  onChange={(e) => setForm({ ...form, value2: e.target.value })}
                  className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-stone-500 uppercase tracking-wide mb-1 block">
                Notes (optional)
              </label>
              <input
                type="text"
                placeholder="Any notes..."
                value={form.notes}
                onChange={(e) => setForm({ ...form, notes: e.target.value })}
                className="border border-stone-300 rounded-lg px-3 py-2 text-sm w-full"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900"
            >
              Save Reading
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="text-stone-500 text-sm px-3"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Chart */}
      <DashboardCard
        title={`${cfg.label} — Last ${Math.min(10, currentReadings.length)} readings`}
        className="mb-6"
      >
        {chartData.length === 0 ? (
          <div className="text-center py-10 text-stone-400">
            <Icon size={40} className="mx-auto mb-2 opacity-30" />
            <p>No readings yet. Add your first {cfg.label.toLowerCase()} reading above.</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="time" fontSize={12} />
              <YAxis fontSize={12} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke={cfg.color}
                strokeWidth={2}
                dot={{ r: 4 }}
                name={cfg.dataKey}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </DashboardCard>

      {/* Range Reference */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-xs text-green-700 font-medium uppercase tracking-wide">Normal</p>
          <p className="text-sm font-semibold text-green-800">
            {cfg.normal[0]}–{cfg.normal[1]} {cfg.unit}
          </p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-center">
          <p className="text-xs text-amber-700 font-medium uppercase tracking-wide">Warning</p>
          <p className="text-sm font-semibold text-amber-800">
            {cfg.warning[0]}–{cfg.warning[1]} {cfg.unit}
          </p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-center">
          <p className="text-xs text-red-700 font-medium uppercase tracking-wide">Danger</p>
          <p className="text-sm font-semibold text-red-800">
            &gt;{cfg.warning[1]} {cfg.unit}
          </p>
        </div>
      </div>

      {/* Reading History */}
      <DashboardCard title="Reading History">
        {currentReadings.length === 0 ? (
          <p className="text-stone-400 text-sm">No readings recorded.</p>
        ) : (
          <div className="space-y-3">
            {currentReadings.map((r) => (
              <div
                key={r.id}
                className="flex items-center justify-between p-3 bg-stone-50 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <Icon size={18} className="text-stone-400" />
                  <div>
                    <p className="font-semibold text-stone-900">
                      {r.value}
                      {r.value2 ? `/${r.value2}` : ""} {cfg.unit}
                    </p>
                    <p className="text-xs text-stone-400">
                      {new Date(r.timestamp).toLocaleString()}
                      {r.notes && ` · ${r.notes}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(
                      activeTab,
                      r.value
                    )}`}
                  >
                    {getStatusLabel(activeTab, r.value)}
                  </span>
                  <button
                    onClick={() => handleDelete(r.id)}
                    className="text-stone-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </DashboardCard>
    </div>
  );
}
