"use client";

import { useEffect, useState } from "react";
import { healthScoreColor, healthScoreLabel } from "@/lib/formatters";

/**
 * Platform health ring.
 *
 * Rendered as an SVG arc rather than a charting-library gauge: it is one number
 * on a 0-100 scale, and pulling a chart library in for a single donut would cost
 * more than it explains. The colour thresholds match `computeHealthScore`'s
 * bands so the ring and the API never disagree about what "healthy" means.
 */
export default function HealthRing({
  score,
  size = 148,
  strokeWidth = 12,
  label,
}: {
  score: number;
  size?: number;
  strokeWidth?: number;
  label?: string;
}) {
  const [animated, setAnimated] = useState(0);

  // Animate from zero on mount so the number reads as "measured", and again
  // whenever a new scan changes it.
  useEffect(() => {
    const id = requestAnimationFrame(() => setAnimated(score));
    return () => cancelAnimationFrame(id);
  }, [score]);

  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, animated));
  const dash = (clamped / 100) * circumference;
  const color = healthScoreColor(score);

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#e7e5e4"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${dash} ${circumference}`}
            style={{ transition: "stroke-dasharray 900ms cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-stone-900 tabular-nums">{score}</span>
          <span className="text-[11px] uppercase tracking-wide font-semibold" style={{ color }}>
            {healthScoreLabel(score)}
          </span>
        </div>
      </div>

      {label && <p className="text-xs text-stone-500 mt-3 text-center max-w-[200px]">{label}</p>}
    </div>
  );
}
