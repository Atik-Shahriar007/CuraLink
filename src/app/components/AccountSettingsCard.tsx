"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { KeyRound, Bell, ShieldOff, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
        checked ? "bg-teal-900" : "bg-stone-300"
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          checked ? "translate-x-6" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export default function AccountSettingsCard() {
  const router = useRouter();
  const { logout } = useAuth();

  // Password change
  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwSaving, setPwSaving] = useState(false);
  const [pwMessage, setPwMessage] = useState<{ type: "error" | "success"; text: string } | null>(null);

  // Notification prefs
  const [notifLoading, setNotifLoading] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);
  const [notifSaving, setNotifSaving] = useState(false);

  // Deactivate account
  const [showDeactivate, setShowDeactivate] = useState(false);
  const [deactivatePassword, setDeactivatePassword] = useState("");
  const [deactivating, setDeactivating] = useState(false);
  const [deactivateError, setDeactivateError] = useState("");

  useEffect(() => {
    fetch("/api/account/notifications")
      .then((res) => res.json())
      .then((data) => {
        if (typeof data.emailNotifications === "boolean") setEmailNotifications(data.emailNotifications);
        if (typeof data.smsNotifications === "boolean") setSmsNotifications(data.smsNotifications);
      })
      .finally(() => setNotifLoading(false));
  }, []);

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    setPwMessage(null);

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwMessage({ type: "error", text: "New passwords do not match." });
      return;
    }
    if (pwForm.newPassword.length < 8) {
      setPwMessage({ type: "error", text: "New password must be at least 8 characters." });
      return;
    }

    setPwSaving(true);
    try {
      const res = await fetch("/api/account/change-password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: pwForm.currentPassword,
          newPassword: pwForm.newPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setPwMessage({ type: "error", text: data.error || "Something went wrong." });
      } else {
        setPwMessage({ type: "success", text: "Password updated." });
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
      }
    } catch {
      setPwMessage({ type: "error", text: "Something went wrong." });
    } finally {
      setPwSaving(false);
    }
  }

  async function handleToggleNotification(field: "emailNotifications" | "smsNotifications", value: boolean) {
    const prevEmail = emailNotifications;
    const prevSms = smsNotifications;
    if (field === "emailNotifications") setEmailNotifications(value);
    else setSmsNotifications(value);

    setNotifSaving(true);
    try {
      const res = await fetch("/api/account/notifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [field]: value }),
      });
      if (!res.ok) {
        // revert on failure
        setEmailNotifications(prevEmail);
        setSmsNotifications(prevSms);
      }
    } catch {
      setEmailNotifications(prevEmail);
      setSmsNotifications(prevSms);
    } finally {
      setNotifSaving(false);
    }
  }

  async function handleDeactivate() {
    setDeactivateError("");
    if (!deactivatePassword) {
      setDeactivateError("Enter your password to confirm.");
      return;
    }
    setDeactivating(true);
    try {
      const res = await fetch("/api/account/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: deactivatePassword }),
      });
      const data = await res.json();
      if (!res.ok) {
        setDeactivateError(data.error || "Something went wrong.");
        return;
      }
      await logout();
      router.push("/login");
    } catch {
      setDeactivateError("Something went wrong.");
    } finally {
      setDeactivating(false);
    }
  }

  return (
    <div className="space-y-6 mt-6">
      {/* Change password */}
      <div className="border border-stone-200 rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <KeyRound size={18} className="text-teal-800" /> Change Password
        </h2>
        <form onSubmit={handleChangePassword} className="space-y-3 max-w-sm">
          <input
            type="password"
            placeholder="Current password"
            value={pwForm.currentPassword}
            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm w-full"
            autoComplete="current-password"
          />
          <input
            type="password"
            placeholder="New password"
            value={pwForm.newPassword}
            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm w-full"
            autoComplete="new-password"
          />
          <input
            type="password"
            placeholder="Confirm new password"
            value={pwForm.confirmPassword}
            onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
            className="border rounded-lg px-3 py-2 text-sm w-full"
            autoComplete="new-password"
          />
          <button
            type="submit"
            disabled={pwSaving}
            className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900 disabled:opacity-50"
          >
            {pwSaving ? "Updating..." : "Update Password"}
          </button>
          {pwMessage && (
            <p className={`text-sm ${pwMessage.type === "error" ? "text-red-600" : "text-green-700"}`}>
              {pwMessage.text}
            </p>
          )}
        </form>
      </div>

      {/* Notification preferences */}
      <div className="border border-stone-200 rounded-2xl bg-white p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-4">
          <Bell size={18} className="text-teal-800" /> Notification Preferences
        </h2>
        {notifLoading ? (
          <p className="text-sm text-stone-400 flex items-center gap-2">
            <Loader2 size={14} className="animate-spin" /> Loading...
          </p>
        ) : (
          <div className="space-y-4 max-w-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-800">Email notifications</p>
                <p className="text-xs text-stone-400">Appointment updates and account activity</p>
              </div>
              <Toggle
                checked={emailNotifications}
                onChange={(v) => handleToggleNotification("emailNotifications", v)}
              />
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-stone-800">SMS notifications</p>
                <p className="text-xs text-stone-400">Text reminders for upcoming events</p>
              </div>
              <Toggle
                checked={smsNotifications}
                onChange={(v) => handleToggleNotification("smsNotifications", v)}
              />
            </div>
            {notifSaving && <p className="text-xs text-stone-400">Saving...</p>}
          </div>
        )}
      </div>

      {/* Deactivate account */}
      <div className="border border-red-200 rounded-2xl bg-red-50/40 p-6">
        <h2 className="flex items-center gap-2 font-semibold mb-2 text-red-800">
          <ShieldOff size={18} /> Deactivate Account
        </h2>
        <p className="text-sm text-stone-600 mb-4">
          Deactivating your account will sign you out and prevent further logins until it's
          reactivated. Your data is preserved.
        </p>
        {!showDeactivate ? (
          <button
            onClick={() => setShowDeactivate(true)}
            className="text-sm border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-100"
          >
            Deactivate my account
          </button>
        ) : (
          <div className="space-y-3 max-w-sm">
            <input
              type="password"
              placeholder="Enter your password to confirm"
              value={deactivatePassword}
              onChange={(e) => setDeactivatePassword(e.target.value)}
              className="border border-red-200 rounded-lg px-3 py-2 text-sm w-full"
            />
            {deactivateError && <p className="text-sm text-red-600">{deactivateError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleDeactivate}
                disabled={deactivating}
                className="bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-800 disabled:opacity-50"
              >
                {deactivating ? "Deactivating..." : "Confirm Deactivation"}
              </button>
              <button
                onClick={() => {
                  setShowDeactivate(false);
                  setDeactivatePassword("");
                  setDeactivateError("");
                }}
                className="text-stone-500 text-sm px-3"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
