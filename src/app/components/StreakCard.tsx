"use client";

type Badge = {
  id: string;
  label: string;
  threshold: number;
  hint: string;
};

const badges: Badge[] = [
  { id: "consistent", label: "Consistent", threshold: 3, hint: "3 days in a row" },
  { id: "steady", label: "Steady", threshold: 7, hint: "A full week" },
  { id: "rooted", label: "Rooted", threshold: 14, hint: "Two weeks strong" },
];

type StreakCardProps = {
  streakDays: number;
  longestStreak?: number;
};

export default function StreakCard({ streakDays, longestStreak = 5 }: StreakCardProps) {
  const nextBadge = badges.find((badge) => streakDays < badge.threshold);
  const progressTarget = nextBadge?.threshold ?? badges[badges.length - 1].threshold;
  const progressPercent = Math.min(100, Math.round((streakDays / progressTarget) * 100));

  return (
    <article className="panel-card p-5 sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
        Check-in streak
      </p>
      <div className="mt-3 flex items-end gap-3">
        <span className="text-4xl font-bold tracking-tight text-body">
          {streakDays}
        </span>
        <span className="pb-1 text-sm text-quiet">days in a row</span>
      </div>
      <p className="mt-1 text-sm text-quiet">
        Longest: <span className="font-semibold text-body">{longestStreak}</span> days
      </p>

      <div className="mt-5">
        <div className="flex items-center justify-between text-xs font-semibold text-quiet">
          <span>
            {nextBadge
              ? `Next: ${nextBadge.label} (${progressTarget} days)`
              : "Top tier reached"}
          </span>
          <span>
            {streakDays} / {progressTarget}
          </span>
        </div>
        <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-soft dark:bg-white/10">
          <div
            className="h-full rounded-full bg-primary transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <div className="mt-5 grid grid-cols-3 gap-2">
        {badges.map((badge) => {
          const earned = streakDays >= badge.threshold;
          return (
            <div
              key={badge.id}
              className={`rounded-[18px] border px-3 py-3 text-center transition ${
                earned
                  ? "border-accent/40 bg-accent/10 text-body"
                  : "border-quiet surface-muted text-quiet"
              }`}
            >
              <div
                className={`mx-auto flex h-10 w-10 items-center justify-center rounded-full text-base font-bold ${
                  earned
                    ? "bg-accent text-text"
                    : "bg-white/60 text-quiet dark:bg-white/5"
                }`}
              >
                {earned ? "*" : "-"}
              </div>
              <p className="mt-2 text-xs font-semibold">{badge.label}</p>
              <p className="mt-1 text-[11px] leading-4 opacity-80">{badge.hint}</p>
            </div>
          );
        })}
      </div>
    </article>
  );
}
