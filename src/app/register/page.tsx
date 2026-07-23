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
    role: "PATIENT" as "PATIENT" | "DOCTOR",
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
      } else {
        router.push("/doctors");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold mb-6">Create your account</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="email"
          placeholder="Email"
          required
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />
        <input
          type="password"
          placeholder="Password (min 8 characters)"
          required
          minLength={8}
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className="border rounded-lg px-4 py-2 w-full"
        />

        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.role === "PATIENT"}
              onChange={() => setForm({ ...form, role: "PATIENT" })}
            />
            I'm a Patient
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              checked={form.role === "DOCTOR"}
              onChange={() => setForm({ ...form, role: "DOCTOR" })}
            />
            I'm a Doctor
          </label>
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium w-full hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p className="text-sm text-gray-600 mt-4">
        Already have an account?{" "}
        <a href="/login" className="text-blue-600 hover:underline">
          Log in
        </a>
      </p>
    </div>
  );
}