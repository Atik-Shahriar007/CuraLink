"use client";

import { useState, useEffect } from "react";
import {
  Settings, Save, ToggleLeft, ToggleRight, AlertTriangle, CheckCircle,
} from "lucide-react";

interface SystemSettings {
  platformName: string;
  supportEmail: string;
  requireDoctorVerification: boolean;
  allowPatientSelfRegistration: boolean;
  emailNotificationsEnabled: boolean;
  maintenanceModeWarning: boolean;
}

const LS_KEY = "curalink_system_settings";

const DEFAULTS: SystemSettings = {
  platformName: "CuraLink",
  supportEmail: "support@curalink.health",
  requireDoctorVerification: true,
  allowPatientSelfRegistration: true,
  emailNotificationsEnabled: true,
  maintenanceModeWarning: false,
};

function loadSettings(): SystemSettings {
  if (typeof window === "undefined") return DEFAULTS;
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : DEFAULTS;
  } catch {
    return DEFAULTS;
  }
}

function Toggle({
  enabled,
  onToggle,
  label,
  description,
  danger,
}: {
  enabled: boolean;
  onToggle: () => void;
  label: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-6 py-4 border-b border-stone-100 last:border-0">
      <div>
        <p className={`font-medium text-sm ${danger ? "text-red-700" : "text-stone-800"}`}>{label}</p>
        <p className="text-xs text-stone-500 mt-0.5">{description}</p>
      </div>
      <button
        onClick={onToggle}
        className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
          enabled
            ? danger
              ? "bg-red-100 text-red-700 hover:bg-red-200"
              : "bg-teal-100 text-teal-700 hover:bg-teal-200"
            : "bg-stone-100 text-stone-500 hover:bg-stone-200"
        }`}
        aria-pressed={enabled}
      >
        {enabled ? <ToggleRight size={18} /> : <ToggleLeft size={18} />}
        {enabled ? "On" : "Off"}
      </button>
    </div>
  );
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<SystemSettings>(DEFAULTS);
  const [saved, setSaved] = useState(false);
  const [dirty, setDirty] = useState(false);

  useEffect(() => {
    setSettings(loadSettings());
  }, []);

  function update<K extends keyof SystemSettings>(key: K, value: SystemSettings[K]) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setDirty(true);
    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(LS_KEY, JSON.stringify(settings));
    setSaved(true);
    setDirty(false);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-teal-100 p-2.5 rounded-xl">
            <Settings className="text-teal-800" size={22} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900">System Settings</h1>
            <p className="text-stone-500 text-sm mt-0.5">Configure platform-wide preferences</p>
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={!dirty}
          className="flex items-center gap-2 bg-teal-700 hover:bg-teal-800 disabled:bg-stone-300 disabled:cursor-not-allowed text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors"
        >
          <Save size={15} />
          Save Changes
        </button>
      </div>

      {/* Success toast */}
      {saved && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl mb-5 text-sm">
          <CheckCircle size={16} />
          Settings saved successfully!
        </div>
      )}

      {/* Maintenance mode banner */}
      {settings.maintenanceModeWarning && (
        <div className="flex items-center gap-3 bg-amber-50 border border-amber-300 text-amber-800 px-5 py-3 rounded-xl mb-5">
          <AlertTriangle size={18} className="shrink-0" />
          <div>
            <p className="font-semibold text-sm">Maintenance Mode Warning Active</p>
            <p className="text-xs mt-0.5">Users will see a maintenance banner across the platform.</p>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* General Settings */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-stone-800 mb-4 flex items-center gap-2">
            <Settings size={17} className="text-teal-700" />
            General
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Platform Name
              </label>
              <input
                type="text"
                value={settings.platformName}
                onChange={(e) => update("platformName", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-stone-700 mb-1">
                Support Email
              </label>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => update("supportEmail", e.target.value)}
                className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
              />
              <p className="text-xs text-stone-400 mt-1">
                Used for automated platform emails and support inquiries.
              </p>
            </div>
          </div>
        </div>

        {/* Feature Toggles */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <h2 className="font-semibold text-stone-800 mb-2 flex items-center gap-2">
            <ToggleRight size={17} className="text-teal-700" />
            Feature Toggles
          </h2>
          <Toggle
            enabled={settings.requireDoctorVerification}
            onToggle={() => update("requireDoctorVerification", !settings.requireDoctorVerification)}
            label="Require doctor verification before approval"
            description="Doctors must upload credentials before being approved to practice."
          />
          <Toggle
            enabled={settings.allowPatientSelfRegistration}
            onToggle={() => update("allowPatientSelfRegistration", !settings.allowPatientSelfRegistration)}
            label="Allow patient self-registration"
            description="Patients can sign up independently without admin approval."
          />
          <Toggle
            enabled={settings.emailNotificationsEnabled}
            onToggle={() => update("emailNotificationsEnabled", !settings.emailNotificationsEnabled)}
            label="Email notifications enabled"
            description="Send automated email notifications for appointments, approvals, and alerts."
          />
        </div>

        {/* Danger zone */}
        <div className="bg-white border border-red-200 rounded-2xl p-6 shadow-sm md:col-span-2">
          <h2 className="font-semibold text-red-700 mb-2 flex items-center gap-2">
            <AlertTriangle size={17} />
            Danger Zone
          </h2>
          <p className="text-xs text-stone-500 mb-3">
            These settings may impact platform availability and user experience.
          </p>
          <Toggle
            enabled={settings.maintenanceModeWarning}
            onToggle={() => update("maintenanceModeWarning", !settings.maintenanceModeWarning)}
            label="Enable maintenance mode warning banner"
            description="Displays a site-wide banner warning users of upcoming or ongoing maintenance."
            danger
          />
        </div>
      </div>

      {/* Save footer hint */}
      {dirty && (
        <div className="mt-4 flex items-center justify-end gap-3 text-sm text-stone-500">
          <span>You have unsaved changes.</span>
          <button
            onClick={handleSave}
            className="flex items-center gap-1.5 bg-teal-700 hover:bg-teal-800 text-white px-4 py-1.5 rounded-lg font-medium transition-colors"
          >
            <Save size={14} />
            Save now
          </button>
        </div>
      )}
    </div>
  );
}
