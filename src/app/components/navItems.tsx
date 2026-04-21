import type { ReactNode } from "react";

export type NavItemId = "chat" | "profile";

export type NavItem = {
  id: NavItemId;
  label: string;
  description: string;
  icon: ReactNode;
};

const iconProps = {
  className: "h-5 w-5",
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export const navItems: NavItem[] = [
  {
    id: "chat",
    label: "Chat",
    description: "Mood-aware conversation",
    icon: (
      <svg {...iconProps}>
        <path d="M21 12a8 8 0 0 1-11.3 7.3L4 21l1.7-5.7A8 8 0 1 1 21 12Z" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "Profile",
    description: "History and analytics",
    icon: (
      <svg {...iconProps}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </svg>
    ),
  },
];
