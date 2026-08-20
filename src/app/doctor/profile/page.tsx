"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  User, Mail, Phone, Building2, Stethoscope, DollarSign, Award, GraduationCap,
  BadgeCheck, Pencil, Camera, ExternalLink, ShieldCheck, Upload,
} from "lucide-react";
import AccountSettingsCard from "@/app/components/AccountSettingsCard";

function InfoRow({ icon: Icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <div className="flex items-center gap-4 py-4 border-b border-stone-100 last:border-0">
      <Icon size={18} className="text-stone-400 flex-shrink-0" />
      <div>
        <p className="text-xs text-stone-400 uppercase tracking-wide">{label}</p>
        <p className="text-stone-900">{value || "—"}</p>
      </div>
    </div>
  );
}

const approvalStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-emerald-100 text-emerald-800",
  REJECTED: "bg-red-100 text-red-700",
};

export default function DoctorProfilePage() {
  const [account, setAccount] = useState<any>(null);
  const [doctor, setDoctor] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  const [licenseNumber, setLicenseNumber] = useState("");
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [submittingVerification, setSubmittingVerification] = useState(false);
  const [verificationMessage, setVerificationMessage] = useState("");

  const [form, setForm] = useState({
    firstName: "", lastName: "", phone: "", description: "", hospital: "", specialty: "",
    price: "", degrees: "", certifications: "", experienceLevel: "LESS_THAN_ONE",
  });

  useEffect(() => {
    fetch("/api/doctor/profile")
      .then((res) => res.json())
      .then(({ account, doctor }: { account: any; doctor: any }) => {
        setAccount(account);
        setDoctor(doctor);
        setPhotoPreview(doctor.photoUrl);
        setForm({
          firstName: account.firstName || "",
          lastName: account.lastName || "",
          phone: account.phone || "",
          description: doctor.description || "",
          hospital: doctor.hospital || "",
          specialty: doctor.specialty || "",
          price: doctor.price?.toString() || "",
          degrees: doctor.degrees?.join(", ") || "",
          certifications: doctor.certifications?.join(", ") || "",
          experienceLevel: doctor.experienceLevel || "LESS_THAN_ONE",
        });
      })
      .finally(() => setLoading(false));
  }, []);

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSave() {
    setSaving(true);
    setMessage("");
    try {
      const payload: any = {
        firstName: form.firstName, lastName: form.lastName, phone: form.phone,
        description: form.description, hospital: form.hospital, specialty: form.specialty,
        price: form.price ? parseFloat(form.price) : undefined,
        degrees: form.degrees.split(",").map((d) => d.trim()).filter(Boolean),
        certifications: form.certifications.split(",").map((c) => c.trim()).filter(Boolean),
        experienceLevel: form.experienceLevel,
      };
      if (photoFile) payload.photoBase64 = await fileToBase64(photoFile);

      const res = await fetch("/api/doctor/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setMessage("Profile updated.");
        setEditing(false);
        const refreshed = await fetch("/api/doctor/profile").then((r) => r.json());
        setAccount(refreshed.account);
        setDoctor(refreshed.doctor);
        setPhotoPreview(refreshed.doctor.photoUrl);
      }
    } finally {
      setSaving(false);
    }
  }

  async function handleSubmitVerification() {
    setVerificationMessage("");
    if (!licenseNumber.trim()) {
      setVerificationMessage("Please enter your license number.");
      return;
    }
    if (!licenseFile && !doctor.licenseDocumentUrl) {
      setVerificationMessage("Please upload your license document.");
      return;
    }
    setSubmittingVerification(true);
    try {
      const payload: any = { licenseNumber };
      if (licenseFile) payload.licenseDocumentBase64 = await fileToBase64(licenseFile);

      const res = await fetch("/api/doctor/verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setVerificationMessage(data.error || "Could not submit for verification.");
        return;
      }
      setDoctor(data.doctor);
      setLicenseFile(null);
      setVerificationMessage("Submitted for review. We'll notify you once an admin checks it.");
    } finally {
      setSubmittingVerification(false);
    }
  }

  if (loading || !account || !doctor) return <p className="text-stone-500">Loading...</p>;

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold font-display">Profile</h1>
        <div className="flex items-center gap-3">
          {doctor.approvalStatus === "APPROVED" && (
            <Link
              href={`/doctors/${doctor.id}`}
              target="_blank"
              className="flex items-center gap-1 text-sm text-teal-800 hover:underline"
            >
              <ExternalLink size={14} /> View public profile
            </Link>
          )}
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${approvalStyles[doctor.approvalStatus]}`}>
            {doctor.approvalStatus}
          </span>
        </div>
      </div>

      {doctor.approvalStatus === "PENDING" && (
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-xl px-4 py-3 mb-6 text-sm">
          Your profile is awaiting admin approval. Complete every field below to speed up review.
        </div>
      )}

      <div className="border border-stone-200 rounded-2xl bg-white p-6">
        {!editing ? (
          <>
            <div className="flex items-center gap-5 mb-6">
              <div className="w-20 h-20 rounded-full bg-stone-100 overflow-hidden flex-shrink-0">
                {photoPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div>
                <p className="font-semibold text-lg">Dr. {account.firstName} {account.lastName}</p>
                <p className="text-stone-500 text-sm">{doctor.specialty || "Specialty not set"}</p>
              </div>
            </div>

            <InfoRow icon={Mail} label="Email" value={account.email} />
            <InfoRow icon={Phone} label="Phone" value={account.phone} />
            <InfoRow icon={Building2} label="Hospital" value={doctor.hospital} />
            <InfoRow icon={Stethoscope} label="Specialty" value={doctor.specialty} />
            <InfoRow icon={DollarSign} label="Consultation Price" value={doctor.price ? `$${doctor.price}` : ""} />
            <InfoRow icon={GraduationCap} label="Degrees" value={doctor.degrees?.join(", ")} />
            <InfoRow icon={Award} label="Certifications" value={doctor.certifications?.join(", ")} />
            <InfoRow icon={BadgeCheck} label="Experience" value={doctor.experienceLevel?.replace(/_/g, " ")} />

            {doctor.description && (
              <div className="pt-4">
                <p className="text-xs text-stone-400 uppercase tracking-wide mb-1">Bio</p>
                <p className="text-stone-700 text-sm">{doctor.description}</p>
              </div>
            )}

            <button
              onClick={() => setEditing(true)}
              className="mt-6 flex items-center gap-2 bg-teal-950 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-teal-900"
            >
              <Pencil size={14} /> Edit Profile
            </button>
          </>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-stone-100 overflow-hidden flex-shrink-0">
                {photoPreview && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={photoPreview} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <label className="flex items-center gap-2 text-sm border border-stone-300 px-3 py-2 rounded-lg cursor-pointer hover:bg-stone-50">
                <Camera size={14} /> Change photo
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <input placeholder="First name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
              <input placeholder="Last name" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="border rounded-lg px-3 py-2 text-sm" />
            </div>
            <input placeholder="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <input placeholder="Specialty" value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <input placeholder="Hospital" value={form.hospital} onChange={(e) => setForm({ ...form, hospital: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <input type="number" placeholder="Price per consultation ($)" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <select value={form.experienceLevel} onChange={(e) => setForm({ ...form, experienceLevel: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full">
              <option value="LESS_THAN_ONE">Less than 1 year</option>
              <option value="ONE_TO_FIVE">1–5 years</option>
              <option value="FIVE_PLUS">5+ years</option>
            </select>
            <textarea placeholder="Bio" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full h-24" />
            <input placeholder="Degrees (comma separated)" value={form.degrees} onChange={(e) => setForm({ ...form, degrees: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />
            <input placeholder="Certifications (comma separated)" value={form.certifications} onChange={(e) => setForm({ ...form, certifications: e.target.value })} className="border rounded-lg px-3 py-2 text-sm w-full" />

            <div className="flex gap-2">
              <button onClick={handleSave} disabled={saving} className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900 disabled:opacity-50">
                {saving ? "Saving..." : "Save"}
              </button>
              <button onClick={() => setEditing(false)} className="text-stone-500 text-sm px-3">Cancel</button>
            </div>
          </div>
        )}
      </div>

      {message && <p className="text-sm text-green-700 mt-4">{message}</p>}

      <div className="border border-stone-200 rounded-2xl bg-white p-6 mt-6">
        <h2 className="font-semibold flex items-center gap-2 mb-1">
          <ShieldCheck size={18} className="text-teal-800" /> License Verification
        </h2>
        <p className="text-stone-500 text-sm mb-4">
          Get the &ldquo;Verified&rdquo; badge on your public profile once an admin confirms your license.
        </p>

        {doctor.verificationStatus === "VERIFIED" ? (
          <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg px-4 py-3 text-sm">
            <BadgeCheck size={16} /> Verified
            {doctor.verifiedAt && (
              <span className="text-emerald-600">
                since {new Date(doctor.verifiedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        ) : doctor.verificationStatus === "PENDING" ? (
          <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-lg px-4 py-3 text-sm">
            Your license is under review (license #{doctor.licenseNumber}). We&rsquo;ll notify you once it&rsquo;s checked.
          </div>
        ) : (
          <div className="space-y-3">
            {doctor.verificationStatus === "REJECTED" && (
              <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg px-4 py-3 text-sm">
                Your last submission wasn&rsquo;t approved.
                {doctor.verificationNote && <> Note: {doctor.verificationNote}</>} Please update the details below and resubmit.
              </div>
            )}
            <input
              placeholder="Medical license number"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm w-full"
            />
            <label className="flex items-center gap-2 text-sm border border-stone-300 px-3 py-2 rounded-lg cursor-pointer hover:bg-stone-50 w-fit">
              <Upload size={14} /> {licenseFile ? licenseFile.name : "Upload license document (PDF/image)"}
              <input
                type="file"
                accept="image/*,.pdf"
                onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
                className="hidden"
              />
            </label>
            {verificationMessage && <p className="text-sm text-stone-600">{verificationMessage}</p>}
            <button
              onClick={handleSubmitVerification}
              disabled={submittingVerification}
              className="bg-teal-950 text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-teal-900 disabled:opacity-50"
            >
              {submittingVerification ? "Submitting..." : "Submit for verification"}
            </button>
          </div>
        )}
      </div>

      <AccountSettingsCard />
    </div>
  );
}