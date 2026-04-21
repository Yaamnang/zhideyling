"use client";

import { navItems, type NavItemId } from "@/app/components/navItems";

type MobileTabsProps = {
  activeTab: NavItemId;
  onTabChange: (tab: NavItemId) => void;
};

export default function MobileTabs({ activeTab, onTabChange }: MobileTabsProps) {
  return (
    <nav
      aria-label="Primary"
      className="mobile-tabs lg:hidden"
    >
      <div className="mobile-tabs-inner">
        {navItems.map((item) => {
          const isActive = item.id === activeTab;

          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onTabChange(item.id)}
              aria-current={isActive ? "page" : undefined}
              className={`mobile-tab ${
                isActive ? "mobile-tab-active" : "mobile-tab-inactive"
              }`}
            >
              <span className="flex h-5 w-5 items-center justify-center">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
