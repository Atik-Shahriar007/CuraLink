"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/AuthContext";

export default function RegisterPage() {
  const router = useRouter();
  const { refresh } = useAuth();
  const [form, setForm] = useState({
    email: "",
    password: "",
    role: "PATIENT" as "PATIENT" | "DOCTOR" | "AMBULANCE_PROVIDER",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        return;
      }

      await refresh();

      if (data.role === "DOCTOR") {
        router.push("/doctor/profile");
      } else if (data.role === "AMBULANCE_PROVIDER") {
        router.push("/provider/profile");
      } else {
        router.push("/patient/dashboard");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const roles = [
    { value: "PATIENT", label: "Patient" },
    { value: "DOCTOR", label: "Doctor" },
    { value: "AMBULANCE_PROVIDER", label: "Ambulance Provider" },
  ] as const;

  return (
    <div className="min-h-[calc(100vh-64px)] flex items-center justify-center bg-stone-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-teal-950">CuraLink</h1>
          <p className="text-stone-500 text-sm mt-1">Create your account</p>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wide mb-1 block">Email</label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="border border-stone-200 rounded-lg px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/10"
              />
            </div>
            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wide mb-1 block">Password</label>
              <input
                type="password"
                required
                minLength={8}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="border border-stone-200 rounded-lg px-4 py-2.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-teal-900/10"
              />
              <p className="text-xs text-stone-400 mt-1">At least 8 characters</p>
            </div>

            <div>
              <label className="text-xs text-stone-400 uppercase tracking-wide mb-2 block">I am a...</label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((r) => (
                  <button
                    type="button"
                    key={r.value}
                    onClick={() => setForm({ ...form, role: r.value })}
                    className={`px-3 py-2.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.role === r.value
                        ? "bg-teal-950 text-white border-teal-950"
                        : "border-stone-200 text-stone-600 hover:border-teal-800/30"
                    }`}
                  >
                    {r.label}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="text-red-600 text-sm">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="bg-teal-950 hover:bg-teal-900 text-white px-6 py-3 rounded-lg font-medium w-full transition-colors disabled:opacity-50"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>
        </div>

        <p className="text-sm text-stone-500 mt-6 text-center">
          Already have an account?{" "}
          <a href="/login" className="text-teal-900 font-medium hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}