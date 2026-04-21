"use client";

import { moodStyles, type MoodState } from "@/app/components/Message";
import { navItems, type NavItemId } from "@/app/components/navItems";

type SidebarProps = {
  activeTab: NavItemId;
  currentMood: MoodState;
  streakDays: number;
  onTabChange: (tab: NavItemId) => void;
};

export default function Sidebar({
  activeTab,
  currentMood,
  streakDays,
  onTabChange,
}: SidebarProps) {
  return (
    <aside className="hidden border-r border-quiet px-5 py-6 lg:flex lg:flex-col lg:gap-6">
      <div className="flex items-center gap-3">
        <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_6px_14px_rgba(79,124,172,0.2)] dark:bg-white/90">
          <img src="/logo.png" alt="Zhideyling AI" className="h-full w-full object-contain p-1" />
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
            Zhideyling AI
          </p>
          <p className="mt-1 text-sm font-semibold text-body">
            Emotional support
          </p>
        </div>
      </div>

      <div className="rounded-[22px] surface-muted px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Current mood
        </p>
        <div className="mt-3 flex items-center gap-2">
          <span className={`mood-pill ${moodStyles[currentMood].badge}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${moodStyles[currentMood].dot}`} />
            {currentMood}
          </span>
        </div>
        <p className="mt-3 text-xs leading-6 text-quiet">
          Streak: <span className="font-semibold text-body">{streakDays}</span> check-in days
        </p>
      </div>

      <nav aria-label="Primary" className="flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`sidebar-link text-left ${
                isActive ? "sidebar-link-active" : "sidebar-link-inactive"
              }`}
            >
              <span
                className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${
                  isActive
                    ? "bg-primary text-white"
                    : "bg-white/60 text-primary dark:bg-white/5"
                }`}
              >
                {item.icon}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold">{item.label}</span>
                <span className="mt-0.5 block text-xs leading-5 opacity-80">
                  {item.description}
                </span>
              </span>
            </button>
          );
        })}
      </nav>

      <div className="mt-auto rounded-[22px] border border-quiet surface-muted px-4 py-4">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Signed in as
        </p>
        <p className="mt-2 text-sm font-semibold text-body">Talop</p>
        <p className="mt-1 text-xs text-quiet">Simulated Google / NDI session</p>
      </div>
    </aside>
  );
}
