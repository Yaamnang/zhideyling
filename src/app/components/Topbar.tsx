"use client";

import { moodStyles, type MoodState } from "@/app/components/Message";
import ThemeToggle, { type Theme } from "@/app/components/ThemeToggle";
import { navItems, type NavItemId } from "@/app/components/navItems";

type TopbarProps = {
  activeTab: NavItemId;
  currentMood: MoodState;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onSosClick: () => void;
};

export default function Topbar({
  activeTab,
  currentMood,
  theme,
  onThemeChange,
  onSosClick,
}: TopbarProps) {
  const tabMeta = navItems.find((item) => item.id === activeTab);

  return (
    <header className="glass-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-5">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-xl bg-white shadow-[0_4px_12px_rgba(79,124,172,0.2)] dark:bg-white/90 lg:hidden">
          <img src="/logo.png" alt="Zhideyling AI" className="h-full w-full object-contain p-1" />
        </div>
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
            {tabMeta?.label ?? "Dashboard"}
          </p>
          <h1 className="mt-0.5 truncate text-base font-semibold tracking-tight text-body sm:text-lg">
            {tabMeta?.description ?? "Emotional support prototype"}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span
          className={`mood-pill ${moodStyles[currentMood].badge} hidden sm:inline-flex`}
        >
          <span className={`h-2.5 w-2.5 rounded-full ${moodStyles[currentMood].dot}`} />
          {currentMood}
        </span>
        <ThemeToggle theme={theme} onChange={onThemeChange} />
        <button
          type="button"
          onClick={onSosClick}
          className="inline-flex items-center gap-2 rounded-full bg-critical px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_28px_rgba(185,28,28,0.35)] transition hover:brightness-110"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 3 2 21h20Z" />
            <path d="M12 10v4" />
            <path d="M12 18h.01" />
          </svg>
          SOS
        </button>
      </div>
    </header>
  );
}
