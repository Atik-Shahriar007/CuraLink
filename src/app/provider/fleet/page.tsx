"use client";

import { useState, useEffect } from "react";
import { 
  Truck, 
  Plus, 
  Trash2, 
  Edit3, 
  CheckCircle, 
  AlertTriangle, 
  Wrench, 
  User, 
  Phone, 
  Hash, 
  Shield 
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";
import StatCard from "@/app/components/StatCard";

interface Vehicle {
  id: string;
  callSign: string;
  type: "Advanced Life Support (ALS)" | "Basic Life Support (BLS)" | "Patient Transport" | "Rapid Response";
  licensePlate: string;
  driverName: string;
  driverPhone: string;
  paramedicCount: number;
  status: "AVAILABLE" | "ON_DISPATCH" | "MAINTENANCE";
  equipmentNotes: string;
  lastInspection: string;
}

const DEFAULT_FLEET: Vehicle[] = [
  {
    id: "v-1",
    callSign: "Medic-01 (Rapid Care)",
    type: "Advanced Life Support (ALS)",
    licensePlate: "MED-9021",
    driverName: "Rahim Chowdhury",
    driverPhone: "+880 1711-234567",
    paramedicCount: 2,
    status: "AVAILABLE",
    equipmentNotes: "Equipped with cardiac defibrillator, oxygen ventilator, and emergency trauma kit.",
    lastInspection: "2026-10-15",
  },
  {
    id: "v-2",
    callSign: "Rescue-04 (Trauma)",
    type: "Basic Life Support (BLS)",
    licensePlate: "AMB-4412",
    driverName: "Kabir Hossain",
    driverPhone: "+880 1819-876543",
    paramedicCount: 1,
    status: "ON_DISPATCH",
    equipmentNotes: "Full stretcher, oxygen supply, splinting apparatus, and first-aid replenishment.",
    lastInspection: "2026-10-20",
  },
  {
    id: "v-3",
    callSign: "CityCare-02",
    type: "Patient Transport",
    licensePlate: "AMB-1088",
    driverName: "Tariqul Islam",
    driverPhone: "+880 1912-345678",
    paramedicCount: 1,
    status: "MAINTENANCE",
    equipmentNotes: "Wheelchair hydraulic lift, secondary stretcher, minor vitals monitor.",
    lastInspection: "2026-09-30",
  }
];

export default function ProviderFleetPage() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form State
  const [callSign, setCallSign] = useState("");
  const [type, setType] = useState<Vehicle["type"]>("Basic Life Support (BLS)");
  const [licensePlate, setLicensePlate] = useState("");
  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [paramedicCount, setParamedicCount] = useState(1);
  const [status, setStatus] = useState<Vehicle["status"]>("AVAILABLE");
  const [equipmentNotes, setEquipmentNotes] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("curalink_provider_fleet");
      if (stored) {
        setVehicles(JSON.parse(stored));
      } else {
        setVehicles(DEFAULT_FLEET);
        localStorage.setItem("curalink_provider_fleet", JSON.stringify(DEFAULT_FLEET));
      }
    } catch {
      setVehicles(DEFAULT_FLEET);
    }
  }, []);

  function saveFleet(list: Vehicle[]) {
    setVehicles(list);
    try {
      localStorage.setItem("curalink_provider_fleet", JSON.stringify(list));
    } catch (e) {
      console.error("Storage error", e);
    }
  }

  function handleSaveVehicle(e: React.FormEvent) {
    e.preventDefault();
    if (!callSign || !licensePlate || !driverName) return;

    if (editingId) {
      const updated = vehicles.map((v) =>
        v.id === editingId
          ? {
              ...v,
              callSign,
              type,
              licensePlate,
              driverName,
              driverPhone,
              paramedicCount,
              status,
              equipmentNotes,
            }
          : v
      );
      saveFleet(updated);
      setEditingId(null);
    } else {
      const newVehicle: Vehicle = {
        id: `v-${Date.now()}`,
        callSign,
        type,
        licensePlate,
        driverName,
        driverPhone,
        paramedicCount,
        status,
        equipmentNotes,
        lastInspection: new Date().toISOString().slice(0, 10),
      };
      saveFleet([newVehicle, ...vehicles]);
    }

    resetForm();
  }

  function handleEdit(v: Vehicle) {
    setEditingId(v.id);
    setCallSign(v.callSign);
    setType(v.type);
    setLicensePlate(v.licensePlate);
    setDriverName(v.driverName);
    setDriverPhone(v.driverPhone);
    setParamedicCount(v.paramedicCount);
    setStatus(v.status);
    setEquipmentNotes(v.equipmentNotes);
    setIsAdding(true);
  }

  function handleDelete(id: string) {
    if (confirm("Are you sure you want to retire this vehicle from your fleet?")) {
      saveFleet(vehicles.filter((v) => v.id !== id));
    }
  }

  function resetForm() {
    setIsAdding(false);
    setEditingId(null);
    setCallSign("");
    setType("Basic Life Support (BLS)");
    setLicensePlate("");
    setDriverName("");
    setDriverPhone("");
    setParamedicCount(1);
    setStatus("AVAILABLE");
    setEquipmentNotes("");
  }

  const availableCount = vehicles.filter((v) => v.status === "AVAILABLE").length;
  const onDispatchCount = vehicles.filter((v) => v.status === "ON_DISPATCH").length;
  const maintenanceCount = vehicles.filter((v) => v.status === "MAINTENANCE").length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-stone-900">Fleet & Crew Management</h1>
          <p className="text-stone-500 text-sm mt-1">Configure emergency ambulances, paramedic staffing, and readiness status.</p>
        </div>
        <button
          onClick={() => {
            resetForm();
            setIsAdding(!isAdding);
          }}
          className="flex items-center gap-2 bg-stone-900 hover:bg-stone-800 text-white px-4 py-2 rounded-xl text-sm font-medium shadow-sm transition-colors"
        >
          <Plus size={16} />
          {isAdding ? "Close Panel" : "Register Ambulance"}
        </button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          label="Total Fleet"
          value={vehicles.length}
          icon={Truck}
          iconColor="#0F3D3E"
          iconBg="#E7F1F0"
        />
        <StatCard
          label="Ready & Available"
          value={availableCount}
          icon={CheckCircle}
          iconColor="#16A34A"
          iconBg="#DCFCE7"
        />
        <StatCard
          label="On Active Run"
          value={onDispatchCount}
          icon={AlertTriangle}
          iconColor="#EA580C"
          iconBg="#FFEDD5"
        />
        <StatCard
          label="In Maintenance"
          value={maintenanceCount}
          icon={Wrench}
          iconColor="#6B7280"
          iconBg="#F3F4F6"
        />
      </div>

      {isAdding && (
        <DashboardCard title={editingId ? "Edit Vehicle Credentials" : "Add Vehicle to Active Fleet"}>
          <form onSubmit={handleSaveVehicle} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Callsign / Unit Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Unit-05 (North Ward)"
                  value={callSign}
                  onChange={(e) => setCallSign(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Ambulance Tier</label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as any)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                >
                  <option value="Advanced Life Support (ALS)">Advanced Life Support (ALS)</option>
                  <option value="Basic Life Support (BLS)">Basic Life Support (BLS)</option>
                  <option value="Patient Transport">Patient Transport</option>
                  <option value="Rapid Response">Rapid Response</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">License Plate No.</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DHA-11-2045"
                  value={licensePlate}
                  onChange={(e) => setLicensePlate(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Primary Driver / Pilot</label>
                <input
                  type="text"
                  required
                  placeholder="Full legal name"
                  value={driverName}
                  onChange={(e) => setDriverName(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Direct Driver Phone</label>
                <input
                  type="tel"
                  required
                  placeholder="+880..."
                  value={driverPhone}
                  onChange={(e) => setDriverPhone(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Paramedic Staff Count</label>
                <input
                  type="number"
                  min={1}
                  max={5}
                  value={paramedicCount}
                  onChange={(e) => setParamedicCount(parseInt(e.target.value, 10))}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Operational State</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600 bg-white"
                >
                  <option value="AVAILABLE">Available / Ready</option>
                  <option value="ON_DISPATCH">On Active Dispatch</option>
                  <option value="MAINTENANCE">Maintenance / Out of Service</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-stone-700 mb-1">Medical Equipment & Onboard Kit</label>
                <input
                  type="text"
                  placeholder="e.g. Ventilator, automated defibrillator, vacuum mattress"
                  value={equipmentNotes}
                  onChange={(e) => setEquipmentNotes(e.target.value)}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-stone-200 text-stone-600 rounded-xl text-sm hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-teal-700 text-white rounded-xl text-sm font-medium hover:bg-teal-800 transition"
              >
                {editingId ? "Update Vehicle Record" : "Save to Fleet"}
              </button>
            </div>
          </form>
        </DashboardCard>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {vehicles.map((v) => {
          const statusColors = {
            AVAILABLE: "bg-green-100 text-green-800 border-green-200",
            ON_DISPATCH: "bg-amber-100 text-amber-800 border-amber-200",
            MAINTENANCE: "bg-stone-100 text-stone-800 border-stone-200",
          }[v.status];

          return (
            <div
              key={v.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow relative flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <h3 className="font-semibold text-stone-900 text-base">{v.callSign}</h3>
                    <span className="text-xs font-medium text-stone-500">{v.type}</span>
                  </div>
                  <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border ${statusColors}`}>
                    {v.status.replace("_", " ")}
                  </span>
                </div>

                <div className="space-y-2 text-xs text-stone-600 my-3">
                  <div className="flex items-center gap-2">
                    <Hash size={13} className="text-stone-400" />
                    <span>Plate: <strong className="text-stone-800">{v.licensePlate}</strong></span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User size={13} className="text-stone-400" />
                    <span>Driver: {v.driverName}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone size={13} className="text-stone-400" />
                    <span>Contact: {v.driverPhone}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Shield size={13} className="text-stone-400" />
                    <span>Paramedics Assigned: {v.paramedicCount}</span>
                  </div>
                  {v.equipmentNotes && (
                    <div className="p-2.5 bg-stone-50 rounded-xl text-stone-500 mt-2 text-[11px]">
                      {v.equipmentNotes}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-stone-100 mt-2">
                <span className="text-[11px] text-stone-400">
                  Inspected: {v.lastInspection}
                </span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleEdit(v)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 hover:bg-stone-100 rounded-lg transition"
                    title="Edit vehicle"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(v.id)}
                    className="p-1.5 text-stone-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                    title="Remove vehicle"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
