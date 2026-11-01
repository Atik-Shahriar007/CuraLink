"use client";

import { useState, useEffect } from "react";
import { Star, ThumbsUp, MessageSquare, BarChart2 } from "lucide-react";
import StatCard from "@/app/components/StatCard";
import DashboardCard from "@/app/components/DashboardCard";

interface ReviewRow {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  patient: { account: { firstName: string; lastName: string } };
  consultation: { date: string } | null;
}

interface ReviewsData {
  reviews: ReviewRow[];
  avgRating: number;
  distribution: Record<number, number>;
  totalCount: number;
  fiveStarCount: number;
  oneStarCount: number;
}

function StarRow({ filled, total = 5 }: { filled: number; total?: number }) {
  return (
    <span className="inline-flex gap-0.5">
      {Array.from({ length: total }).map((_, i) => (
        <Star
          key={i}
          size={14}
          className={i < filled ? "text-amber-400 fill-amber-400" : "text-stone-200 fill-stone-200"}
        />
      ))}
    </span>
  );
}

const FILTER_OPTIONS = [
  { label: "All", value: 0 },
  { label: "5 Stars", value: 5 },
  { label: "4 Stars", value: 4 },
  { label: "3 Stars", value: 3 },
  { label: "2 Stars", value: 2 },
  { label: "1 Star", value: 1 },
];

export default function DoctorReviewsPage() {
  const [data, setData] = useState<ReviewsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterRating, setFilterRating] = useState(0);

  useEffect(() => {
    fetch("/api/doctor/reviews")
      .then((res) => res.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, []);

  const filteredReviews =
    !data
      ? []
      : filterRating === 0
      ? data.reviews
      : data.reviews.filter((r) => r.rating === filterRating);

  return (
    <div>
      {/* Header */}
      <div className="bg-gradient-to-br from-teal-950 to-teal-800 text-white rounded-2xl p-6 mb-6">
        <h1 className="text-xl font-display font-semibold">Patient Reviews</h1>
        <p className="text-teal-100 text-sm mt-1">See what your patients are saying about you.</p>
      </div>

      {loading ? (
        <p className="text-stone-500 text-sm">Loading reviews...</p>
      ) : !data ? (
        <p className="text-stone-500 text-sm">Could not load reviews.</p>
      ) : (
        <>
          {/* Stat cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <StatCard
              label="Total Reviews"
              value={data.totalCount}
              icon={MessageSquare}
              iconColor="#0F3D3E"
              iconBg="#E7F1F0"
            />
            <StatCard
              label="Average Rating"
              value={data.totalCount > 0 ? data.avgRating.toFixed(1) : "—"}
              icon={Star}
              iconColor="#8A6D00"
              iconBg="#FFF8E1"
            />
            <StatCard
              label="5-Star Reviews"
              value={data.fiveStarCount}
              icon={ThumbsUp}
              iconColor="#2E7D32"
              iconBg="#E8F5E9"
            />
            <StatCard
              label="1-Star Reviews"
              value={data.oneStarCount}
              icon={BarChart2}
              iconColor="#B5541B"
              iconBg="#FBEFE6"
            />
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-6">
            {/* Average rating display */}
            <DashboardCard title="Overall Rating" className="flex flex-col items-center justify-center py-4">
              {data.totalCount === 0 ? (
                <p className="text-stone-400 text-sm">No reviews yet.</p>
              ) : (
                <>
                  <p className="text-6xl font-bold text-stone-900 mb-2">
                    {data.avgRating.toFixed(1)}
                  </p>
                  <StarRow filled={Math.round(data.avgRating)} />
                  <p className="text-stone-400 text-sm mt-2">{data.totalCount} reviews</p>
                </>
              )}
            </DashboardCard>

            {/* Distribution bars */}
            <DashboardCard title="Rating Distribution" className="md:col-span-2">
              {data.totalCount === 0 ? (
                <p className="text-stone-400 text-sm">No reviews yet.</p>
              ) : (
                <div className="space-y-3">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = data.distribution[star] ?? 0;
                    const pct = data.totalCount > 0 ? (count / data.totalCount) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-sm text-stone-600 w-12 shrink-0 flex items-center gap-1">
                          {star} <Star size={12} className="text-amber-400 fill-amber-400" />
                        </span>
                        <div className="flex-1 bg-stone-100 rounded-full h-2.5 overflow-hidden">
                          <div
                            className="bg-amber-400 h-2.5 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-sm text-stone-500 w-8 text-right shrink-0">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </DashboardCard>
          </div>

          {/* Filter tabs */}
          <div className="flex gap-2 mb-4 flex-wrap">
            {FILTER_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => setFilterRating(opt.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors border ${
                  filterRating === opt.value
                    ? "bg-teal-700 text-white border-teal-700"
                    : "bg-white text-stone-700 border-stone-200 hover:border-teal-400"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Reviews list */}
          <DashboardCard title={`Reviews (${filteredReviews.length})`}>
            {filteredReviews.length === 0 ? (
              <p className="text-stone-400 text-sm">No reviews match this filter.</p>
            ) : (
              <div className="space-y-4">
                {filteredReviews.map((review) => (
                  <div
                    key={review.id}
                    className="border border-stone-100 rounded-xl p-4 hover:border-stone-200 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div>
                        <p className="font-medium text-stone-800">
                          {review.patient.account.firstName} {review.patient.account.lastName}
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          {review.consultation
                            ? `Consultation: ${new Date(review.consultation.date).toLocaleDateString()}`
                            : new Date(review.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <StarRow filled={review.rating} />
                        <span className="text-xs text-stone-400">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    {review.comment ? (
                      <p className="text-sm text-stone-600 leading-relaxed">{review.comment}</p>
                    ) : (
                      <p className="text-sm text-stone-400 italic">No comment left.</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </DashboardCard>
        </>
      )}
    </div>
  );
}
