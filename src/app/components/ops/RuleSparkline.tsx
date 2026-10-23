"use client";

import { Area, AreaChart, ResponsiveContainer, Tooltip } from "recharts";
import { RULE_STATUS_TEXT, RULE_STATUS_LABELS } from "@/lib/formatters";

/**
 * A rule's recent history as a sparkline.
 *
 * The point of showing this rather than just the current number is trend: a rule
 * sitting at exactly its threshold for six scans running is a very different
 * situation from one that spiked once and came back down, and the operator
 * deciding whether to open a work order needs to see which one they have.
 */
export default function RuleSparkline({
  data,
  threshold,
  height = 40,
}: {
  data: Array<{ value: number; status: string }>;
  threshold: number;
  height?: number;
}) {
  if (data.length === 0) {
    return (
      <div
        className="flex items-center justify-center text-[11px] text-stone-400"
        style={{ height }}
      >
        No history yet
      </div>
    );
  }

  if (data.length === 1) {
    // A single point has no shape to draw, so state it plainly instead of
    // rendering a misleading flat line.
    const only = data[0];
    return (
      <div
        className="flex items-center text-[11px] font-medium"
        style={{ height }}
      >
        <span className={RULE_STATUS_TEXT[only.status as keyof typeof RULE_STATUS_TEXT] ?? "text-stone-500"}>
          {only.value} · first reading ({RULE_STATUS_LABELS[only.status as keyof typeof RULE_STATUS_LABELS] ?? only.status})
        </span>
      </div>
    );
  }

  const stroke = data[data.length - 1].status === "BREACHED" ? "#b91c1c" : "#0F3D3E";
  // Scaling to the rule's own recent range rather than a fixed axis keeps small
  // movements legible; the threshold marker below restores the absolute meaning.
  const max = Math.max(threshold * 1.4, ...data.map((d) => d.value), 1);

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={height}>
        <AreaChart data={data} margin={{ top: 4, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={`spark-${stroke.replace("#", "")}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity={0.28} />
              <stop offset="100%" stopColor={stroke} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ fontSize: 11, borderRadius: 8, border: "1px solid #e7e5e4" }}
            formatter={(value) => [`${value ?? ""}`, "measured"]}
            labelFormatter={() => ""}
          />
          <Area
            type="monotone"
            dataKey="value"
            stroke={stroke}
            strokeWidth={1.75}
            fill={`url(#spark-${stroke.replace("#", "")})`}
            isAnimationActive={false}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Threshold marker: where "breached" starts, positioned against the same
          ceiling the chart scales to. */}
      {threshold > 0 && (
        <div
          className="absolute left-0 right-0 border-t border-dashed border-stone-400 pointer-events-none"
          style={{ top: 4 + (height - 4) * (1 - threshold / max) }}
        />
      )}
    </div>
  );
}
