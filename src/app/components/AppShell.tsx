"use client";

import type { ReactNode } from "react";

import MobileTabs from "@/app/components/MobileTabs";
import Sidebar from "@/app/components/Sidebar";
import type { MoodState } from "@/app/components/Message";
import type { NavItemId } from "@/app/components/navItems";

type AppShellProps = {
  activeTab: NavItemId;
  currentMood: MoodState;
  streakDays: number;
  onTabChange: (tab: NavItemId) => void;
  children: ReactNode;
};

export default function AppShell({
  activeTab,
  currentMood,
  streakDays,
  onTabChange,
  children,
}: AppShellProps) {
  return (
    <div className="app-shell">
      <Sidebar
        activeTab={activeTab}
        currentMood={currentMood}
        streakDays={streakDays}
        onTabChange={onTabChange}
      />

      <div className="app-main">
        {children}
      </div>

      <MobileTabs activeTab={activeTab} onTabChange={onTabChange} />
    </div>
  );
}
