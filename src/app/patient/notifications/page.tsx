"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Mail, MessageSquare, BellOff, Save, Check } from "lucide-react";

interface NotificationSettings {
  emailNotifications: boolean;
  smsNotifications: boolean;
}

interface ToggleCardProps {
  icon: React.ElementType;
  title: string;
  description: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  iconColor?: string;
  iconBg?: string;
}

function ToggleCard({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
  iconColor = "#0F3D3E",
  iconBg = "#E7F1F0",
}: ToggleCardProps) {
  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-5 flex items-start gap-4">
      <div
        className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: iconBg }}
      >
        <Icon size={20} style={{ color: iconColor }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-stone-900">{title}</p>
        <p className="text-sm text-stone-500 mt-0.5">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        className={`relative flex-shrink-0 w-11 h-6 rounded-full transition-colors duration-200 ${
          checked ? "bg-teal-950" : "bg-stone-200"
        }`}
        aria-pressed={checked}
      >
        <span
          className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${
            checked ? "translate-x-5" : "translate-x-0"
          }`}
        />
      </button>
    </div>
  );
}

export default function NotificationsPage() {
  const [settings, setSettings] = useState<NotificationSettings>({
    emailNotifications: false,
    smsNotifications: false,
  });
  // Local-only preferences (no backend)
  const [localPrefs, setLocalPrefs] = useState({
    appointmentReminder24h: false,
    appointmentReminder1h: false,
    newsletter: false,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetch("/api/account/notifications")
      .then((res) => res.json())
      .then((data) => {
        setSettings({
          emailNotifications: data.emailNotifications ?? false,
          smsNotifications: data.smsNotifications ?? false,
        });
      })
      .catch(() => {})
      .finally(() => setLoading(false));

    // Load local prefs
    try {
      const stored = JSON.parse(localStorage.getItem("curalink_notif_prefs") || "{}");
      setLocalPrefs((prev) => ({ ...prev, ...stored }));
    } catch {
      // ignore
    }
  }, []);

  const handleSave = useCallback(async () => {
    setSaving(true);
    setSaved(false);
    try {
      await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      // Save local prefs
      localStorage.setItem("curalink_notif_prefs", JSON.stringify(localPrefs));
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }, [settings, localPrefs]);

  if (loading) return <p className="text-stone-500">Loading notification preferences...</p>;

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold font-display mb-1">Notification Preferences</h1>
        <p className="text-stone-500">Control how and when you receive updates from CuraLink.</p>
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium px-1">
          Communication Channels
        </p>

        <ToggleCard
          icon={Mail}
          title="Email Notifications"
          description="Receive consultation reminders and prescription updates via email."
          checked={settings.emailNotifications}
          onChange={(val) => setSettings((s) => ({ ...s, emailNotifications: val }))}
          iconColor="#0F3D3E"
          iconBg="#E7F1F0"
        />

        <ToggleCard
          icon={MessageSquare}
          title="SMS Notifications"
          description="Get ambulance status updates and urgent alerts via SMS."
          checked={settings.smsNotifications}
          onChange={(val) => setSettings((s) => ({ ...s, smsNotifications: val }))}
          iconColor="#B5541B"
          iconBg="#FBEFE6"
        />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium px-1">
          Appointment Reminders
        </p>

        <ToggleCard
          icon={Bell}
          title="24-Hour Reminder"
          description="Get notified one day before your scheduled appointment."
          checked={localPrefs.appointmentReminder24h}
          onChange={(val) =>
            setLocalPrefs((p) => ({ ...p, appointmentReminder24h: val }))
          }
          iconColor="#2E7D32"
          iconBg="#E8F5E9"
        />

        <ToggleCard
          icon={Bell}
          title="1-Hour Reminder"
          description="Get a reminder one hour before your appointment starts."
          checked={localPrefs.appointmentReminder1h}
          onChange={(val) =>
            setLocalPrefs((p) => ({ ...p, appointmentReminder1h: val }))
          }
          iconColor="#8A6D00"
          iconBg="#FFF8E1"
        />
      </div>

      <div className="space-y-4 mb-8">
        <p className="text-xs text-stone-400 uppercase tracking-wide font-medium px-1">
          Content & Marketing
        </p>

        <ToggleCard
          icon={BellOff}
          title="Newsletter & Health Tips"
          description="Receive weekly health tips and platform updates."
          checked={localPrefs.newsletter}
          onChange={(val) => setLocalPrefs((p) => ({ ...p, newsletter: val }))}
          iconColor="#7B1FA2"
          iconBg="#F3E5F5"
        />
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="flex items-center gap-2 bg-teal-950 text-white px-6 py-2.5 rounded-xl font-medium text-sm hover:bg-teal-900 disabled:opacity-50 transition-colors"
      >
        {saved ? (
          <>
            <Check size={16} /> Saved!
          </>
        ) : (
          <>
            <Save size={16} /> {saving ? "Saving..." : "Save Preferences"}
          </>
        )}
      </button>

      {saved && (
        <p className="text-sm text-green-700 mt-3 flex items-center gap-1.5">
          <Check size={14} /> Notification preferences updated successfully.
        </p>
      )}
    </div>
  );
}
