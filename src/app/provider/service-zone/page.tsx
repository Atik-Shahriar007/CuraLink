"use client";

import { useState, useEffect } from "react";
import { 
  MapPin, 
  Clock, 
  Save, 
  Globe, 
  ShieldCheck, 
  AlertCircle, 
  Navigation, 
  Check, 
  Plus, 
  Trash2 
} from "lucide-react";
import DashboardCard from "@/app/components/DashboardCard";

interface ServiceZoneData {
  primaryCity: string;
  maxDistanceKm: number;
  coverageDistricts: string[];
  is24x7Emergency: boolean;
  baseFare: number;
  perKmRate: number;
  operatingNotes: string;
}

const DEFAULT_ZONE_DATA: ServiceZoneData = {
  primaryCity: "Dhaka Central & Greater Metropolitan",
  maxDistanceKm: 35,
  coverageDistricts: ["Dhanmondi", "Gulshan", "Banani", "Uttara", "Mirpur", "Mohammadpur", "Motijheel"],
  is24x7Emergency: true,
  baseFare: 1200,
  perKmRate: 45,
  operatingNotes: "Specialized rapid transit corridors used during heavy traffic hours. Direct priority route coordination with metropolitan traffic control.",
};

export default function ProviderServiceZonePage() {
  const [data, setData] = useState<ServiceZoneData>(DEFAULT_ZONE_DATA);
  const [newDistrict, setNewDistrict] = useState("");
  const [savedMessage, setSavedMessage] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("curalink_provider_service_zone");
      if (stored) {
        setData(JSON.parse(stored));
      } else {
        localStorage.setItem("curalink_provider_service_zone", JSON.stringify(DEFAULT_ZONE_DATA));
      }
    } catch {
      setData(DEFAULT_ZONE_DATA);
    }
  }, []);

  function handleSave() {
    setSaving(true);
    setSavedMessage("");
    try {
      localStorage.setItem("curalink_provider_service_zone", JSON.stringify(data));
      // Also update the provider profile serviceArea if possible
      fetch("/api/provider/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          serviceArea: `${data.primaryCity} (${data.coverageDistricts.join(", ")})`,
        }),
      }).catch((e) => console.log("Profile patch sync silently skipped", e));

      setTimeout(() => {
        setSaving(false);
        setSavedMessage("Coverage perimeter and dispatch zone settings updated successfully.");
      }, 500);
    } catch (e) {
      setSaving(false);
      console.error(e);
    }
  }

  function addDistrict(e: React.FormEvent) {
    e.preventDefault();
    if (!newDistrict.trim()) return;
    if (data.coverageDistricts.includes(newDistrict.trim())) return;
    setData({
      ...data,
      coverageDistricts: [...data.coverageDistricts, newDistrict.trim()],
    });
    setNewDistrict("");
  }

  function removeDistrict(district: string) {
    setData({
      ...data,
      coverageDistricts: data.coverageDistricts.filter((d) => d !== district),
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-stone-900">Service Coverage & Dispatch Radius</h1>
          <p className="text-stone-500 text-sm mt-1">Configure your active operational boundaries, metropolitan sectors, and emergency tariffs.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 text-white px-5 py-2.5 rounded-xl text-sm font-medium shadow-sm transition-colors disabled:opacity-50"
        >
          <Save size={16} />
          {saving ? "Saving..." : "Save Coverage Map"}
        </button>
      </div>

      {savedMessage && (
        <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded-2xl flex items-center gap-3 text-sm">
          <Check size={18} className="text-green-600 shrink-0" />
          <span>{savedMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <DashboardCard title="Metropolitan & Regional Reach">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Primary Base / Hub City</label>
                <div className="relative">
                  <Globe size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                  <input
                    type="text"
                    value={data.primaryCity}
                    onChange={(e) => setData({ ...data, primaryCity: e.target.value })}
                    className="w-full pl-9 pr-4 py-2 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">
                  Maximum Service Dispatch Radius: <strong className="text-teal-700">{data.maxDistanceKm} KM</strong>
                </label>
                <input
                  type="range"
                  min={5}
                  max={100}
                  step={5}
                  value={data.maxDistanceKm}
                  onChange={(e) => setData({ ...data, maxDistanceKm: parseInt(e.target.value, 10) })}
                  className="w-full accent-teal-700 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-stone-400 mt-1">
                  <span>5 km (Ultra-Local)</span>
                  <span>50 km (Metro)</span>
                  <span>100 km (Inter-District)</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-2">Active Service Sectors & Wards</label>
                <div className="flex flex-wrap gap-2 mb-3">
                  {data.coverageDistricts.map((d) => (
                    <span
                      key={d}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-teal-50 text-teal-800 border border-teal-200"
                    >
                      <MapPin size={12} className="text-teal-600" />
                      {d}
                      <button
                        type="button"
                        onClick={() => removeDistrict(d)}
                        className="text-teal-400 hover:text-teal-900 ml-1"
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>

                <form onSubmit={addDistrict} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add ward or zone (e.g. Uttara Sector 4)..."
                    value={newDistrict}
                    onChange={(e) => setNewDistrict(e.target.value)}
                    className="flex-1 border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-stone-900 text-white rounded-xl text-sm font-medium hover:bg-stone-800 transition flex items-center gap-1"
                  >
                    <Plus size={15} />
                    Add
                  </button>
                </form>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Transit Protocols & Special Instructions</label>
                <textarea
                  rows={3}
                  value={data.operatingNotes}
                  onChange={(e) => setData({ ...data, operatingNotes: e.target.value })}
                  className="w-full border border-stone-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                  placeholder="Notes for dispatch routing..."
                />
              </div>
            </div>
          </DashboardCard>

          <DashboardCard title="Tariff & Fare Matrix">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Emergency Base Fare ($ or Local BDT)</label>
                <input
                  type="number"
                  value={data.baseFare}
                  onChange={(e) => setData({ ...data, baseFare: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <span className="text-[11px] text-stone-400">Includes initial dispatch & paramedic readiness.</span>
              </div>

              <div>
                <label className="block text-xs font-medium text-stone-700 mb-1">Per Kilometer Transit Surcharge</label>
                <input
                  type="number"
                  value={data.perKmRate}
                  onChange={(e) => setData({ ...data, perKmRate: parseFloat(e.target.value) || 0 })}
                  className="w-full border border-stone-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-600"
                />
                <span className="text-[11px] text-stone-400">Calculated via live GPS odometer tracker.</span>
              </div>
            </div>
          </DashboardCard>
        </div>

        <div className="space-y-6">
          <DashboardCard title="Readiness Status">
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 flex items-start gap-3">
                <ShieldCheck size={24} className="text-teal-700 mt-0.5 shrink-0" />
                <div>
                  <h4 className="text-sm font-semibold text-teal-900">24/7 Priority Emergency Channel</h4>
                  <p className="text-xs text-teal-700 mt-1">
                    Your ambulance units are published on the emergency patient portal for direct high-priority calls.
                  </p>
                  <label className="flex items-center gap-2 mt-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={data.is24x7Emergency}
                      onChange={(e) => setData({ ...data, is24x7Emergency: e.target.checked })}
                      className="rounded accent-teal-700"
                    />
                    <span className="text-xs font-medium text-teal-900">Accept 24/7 Midnight Dispatches</span>
                  </label>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="text-xs font-semibold uppercase text-stone-500 mb-2">Coverage Summary</h4>
                <ul className="space-y-1.5 text-xs text-stone-600">
                  <li className="flex justify-between">
                    <span>Base Hub:</span>
                    <strong className="text-stone-800">{data.primaryCity}</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Max Perimeter:</span>
                    <strong className="text-stone-800">{data.maxDistanceKm} KM</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Active Sectors:</span>
                    <strong className="text-stone-800">{data.coverageDistricts.length} Wards</strong>
                  </li>
                  <li className="flex justify-between">
                    <span>Estimated Call-to-Scene:</span>
                    <strong className="text-teal-700 font-semibold">12 - 18 mins</strong>
                  </li>
                </ul>
              </div>
            </div>
          </DashboardCard>
        </div>
      </div>
    </div>
  );
}
