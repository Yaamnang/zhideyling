"use client";

import { useMemo } from "react";

import type { MoodState } from "@/app/components/Message";

const moodScore: Record<MoodState, number> = {
  Happy: 4,
  Neutral: 3,
  Sad: 2,
  Stressed: 1,
  Critical: 0,
};

const moodLabelFromScore: Record<number, MoodState> = {
  4: "Happy",
  3: "Neutral",
  2: "Sad",
  1: "Stressed",
  0: "Critical",
};

const seed = [
  3, 3, 2, 3, 3, 4, 3, 2, 2, 3,
  2, 1, 2, 2, 3, 3, 4, 3, 3, 2,
  1, 2, 3, 3, 2, 3, 3, 2, 3,
];

type MoodTrendChartProps = {
  currentMood: MoodState;
};

const width = 600;
const height = 180;
const paddingX = 12;
const paddingY = 18;

export default function MoodTrendChart({ currentMood }: MoodTrendChartProps) {
  const points = useMemo(() => {
    const raw = [...seed, moodScore[currentMood]];
    const n = raw.length;
    const stepX = (width - paddingX * 2) / (n - 1);
    const stepY = (height - paddingY * 2) / 4;

    return raw.map((value, index) => {
      const x = paddingX + stepX * index;
      const y = paddingY + stepY * (4 - value);
      return { x, y, value };
    });
  }, [currentMood]);

  const linePath = useMemo(() => {
    return points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
  }, [points]);

  const areaPath = useMemo(() => {
    const first = points[0];
    const last = points[points.length - 1];
    const lineSegment = points
      .map((p, i) => `${i === 0 ? "M" : "L"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`)
      .join(" ");
    return `${lineSegment} L ${last.x.toFixed(1)} ${height - paddingY} L ${first.x.toFixed(1)} ${height - paddingY} Z`;
  }, [points]);

  const latest = points[points.length - 1];
  const bestScore = Math.max(...points.map((p) => p.value));
  const worstScore = Math.min(...points.map((p) => p.value));
  const avgScore =
    Math.round((points.reduce((acc, p) => acc + p.value, 0) / points.length) * 10) / 10;

  return (
    <article className="panel-card p-5 sm:col-span-2 sm:p-6">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
            30-day mood trend
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-body">
            Simulated history
          </h2>
          <p className="mt-1 text-sm text-quiet">
            Live today: <span className="font-semibold text-body">{currentMood}</span>
            {" "}&middot; best: {moodLabelFromScore[bestScore]} &middot; lowest: {moodLabelFromScore[worstScore]}
          </p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
          Avg {avgScore} / 4
        </span>
      </div>

      <div className="mt-5 overflow-hidden rounded-[22px] border border-quiet surface-muted p-3 sm:p-4">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="h-48 w-full"
          preserveAspectRatio="none"
          role="img"
          aria-label="30-day mood trend"
        >
          <defs>
            <linearGradient id="mood-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4F7CAC" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#4F7CAC" stopOpacity="0" />
            </linearGradient>
          </defs>

          {[0, 1, 2, 3, 4].map((level) => {
            const y = paddingY + ((height - paddingY * 2) / 4) * (4 - level);
            return (
              <line
                key={level}
                x1={paddingX}
                x2={width - paddingX}
                y1={y}
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.08"
                strokeDasharray="3 5"
              />
            );
          })}

          <path d={areaPath} fill="url(#mood-gradient)" />
          <path
            d={linePath}
            fill="none"
            stroke="#4F7CAC"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {points.map((p, i) => (
            <circle
              key={i}
              cx={p.x}
              cy={p.y}
              r={i === points.length - 1 ? 4.5 : 2}
              fill={i === points.length - 1 ? "#4FD1C5" : "#4F7CAC"}
              stroke={i === points.length - 1 ? "#ffffff" : "none"}
              strokeWidth={i === points.length - 1 ? 2 : 0}
            />
          ))}
        </svg>

        <div className="mt-3 flex items-center justify-between text-[11px] font-semibold uppercase tracking-[0.22em] text-quiet">
          <span>30 days ago</span>
          <span>Today &middot; {moodLabelFromScore[latest.value]}</span>
        </div>
      </div>
    </article>
  );
}
