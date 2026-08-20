"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const CATEGORIES = [
  "General Health", "Mental Health", "Child Health", "Nutrition & Diet",
  "Heart Health", "Women's Health", "Skin Care", "Diabetes & Endocrine Health",
  "Elderly Care", "Preventive Care & Wellness",
];

export default function NewArticlePage() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [excerpt, setExcerpt] = useState("");
  const [content, setContent] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleCoverChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setCoverFile(file);
    setCoverPreview(URL.createObjectURL(file));
  }

  function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function handleSubmit(submitForReview: boolean) {
    setSaving(true);
    setError("");

    try {
      const payload: any = { title, category, excerpt, content, submitForReview };
      if (coverFile) {
        payload.coverImageBase64 = await fileToBase64(coverFile);
      }

      const res = await fetch("/api/doctor/blog", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not save article");
        return;
      }

      router.push("/doctor/blog");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Write an Article</h1>

      <div className="space-y-4">
        <input
          placeholder="Article title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full text-lg font-medium"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <textarea
          placeholder="Short excerpt (optional — shown on the homepage preview card)"
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="border rounded-lg px-4 py-2 w-full h-20"
        />

        <div>
          <label className="text-sm text-gray-600 block mb-1">Cover Image</label>
          {coverPreview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={coverPreview} alt="" className="w-full h-48 object-cover rounded-lg mb-2" />
          )}
          <input type="file" accept="image/*" onChange={handleCoverChange} />
        </div>

        <textarea
          placeholder="Write your article here..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border rounded-lg px-4 py-3 w-full h-80"
        />

        {error && <p className="text-red-600 text-sm">{error}</p>}

        <div className="flex gap-3">
          <button
            onClick={() => handleSubmit(false)}
            disabled={saving || !title || content.length < 50}
            className="border border-gray-300 px-6 py-3 rounded-lg font-medium hover:bg-gray-50 disabled:opacity-50"
          >
            Save as Draft
          </button>
          <button
            onClick={() => handleSubmit(true)}
            disabled={saving || !title || content.length < 50}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50"
          >
            {saving ? "Submitting..." : "Submit for Review"}
          </button>
        </div>
        {content.length > 0 && content.length < 50 && (
          <p className="text-xs text-gray-400">Content needs at least 50 characters.</p>
        )}
      </div>
    </div>
  );
}