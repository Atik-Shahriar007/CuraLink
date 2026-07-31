"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function DeactivateAccountSection() {
  const router = useRouter();
  const { logout } = useAuth();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleDeactivate(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      const res = await fetch("/api/account/deactivate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to deactivate account.");
        return;
      }

      await logout();
      router.push("/login");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-red-200 rounded-lg p-5 bg-red-50">
      <h2 className="font-semibold text-lg mb-1 text-red-700">Deactivate Account</h2>
      <p className="text-sm text-red-700/80 mb-4">
        This will sign you out and prevent you from logging back in. Contact support to
        reactivate your account later.
      </p>

      {!confirming ? (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="border border-red-400 text-red-700 px-4 py-2 rounded-lg font-medium hover:bg-red-100"
        >
          Deactivate my account
        </button>
      ) : (
        <form onSubmit={handleDeactivate} className="space-y-3 max-w-md">
          <p className="text-sm font-medium text-red-800">
            Enter your password to confirm. This action cannot be undone by you.
          </p>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border rounded-lg px-4 py-2 w-full"
            autoComplete="current-password"
          />
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={submitting || !password}
              className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 disabled:opacity-50"
            >
              {submitting ? "Deactivating..." : "Confirm Deactivation"}
            </button>
            <button
              type="button"
              onClick={() => {
                setConfirming(false);
                setPassword("");
                setError("");
              }}
              className="px-4 py-2 rounded-lg font-medium text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
        </form>
      )}
    </div>
  );
}
