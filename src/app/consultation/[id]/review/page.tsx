"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReviewPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/consultations/${id}/review`)
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setAlreadyReviewed(true);
          setRating(data.rating);
          setComment(data.comment || "");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit() {
    if (rating === 0) {
      setError("Please select a star rating.");
      return;
    }
    setSubmitting(true);
    setError("");

    try {
      const res = await fetch(`/api/consultations/${id}/review`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Could not submit review");
        return;
      }

      router.push("/patient/consultations");
    } catch {
      setError("Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <p className="max-w-xl mx-auto px-4 py-8">Loading...</p>;

  return (
    <div className="max-w-xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Rate Your Consultation</h1>
      <p className="text-gray-500 mb-6">
        {alreadyReviewed
          ? "You've already reviewed this consultation."
          : "Your feedback helps other patients choose the right doctor."}
      </p>

      <div className="flex gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            disabled={alreadyReviewed}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            onClick={() => setRating(star)}
            className="text-4xl disabled:cursor-default"
          >
            <span className={(hoverRating || rating) >= star ? "text-amber-400" : "text-gray-200"}>
              ★
            </span>
          </button>
        ))}
      </div>

      <textarea
        placeholder="Optional comment about your experience..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={alreadyReviewed}
        className="border rounded-lg px-4 py-3 w-full h-32 disabled:bg-gray-50"
      />

      {error && <p className="text-red-600 text-sm mt-3">{error}</p>}

      {!alreadyReviewed && (
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="mt-4 bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 disabled:opacity-50"
        >
          {submitting ? "Submitting..." : "Submit Review"}
        </button>
      )}
    </div>
  );
}