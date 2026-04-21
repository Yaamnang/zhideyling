import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "#4F7CAC",
        secondary: "#A78BFA",
        accent: "#4FD1C5",
        bg: "#F8FAFC",
        soft: "#E2E8F0",
        text: "#0F172A",
        muted: "#64748B",
        happy: "#22C55E",
        neutral: "#FACC15",
        sad: "#F97316",
        stressed: "#EF4444",
        critical: "#B91C1C",
        "bg-dark": "#0B1220",
        "surface-dark": "#121A2B",
        "panel-dark": "#17213A",
        "soft-dark": "#1F2A44",
        "text-dark": "#E6EDF7",
        "muted-dark": "#8FA1BE",
      },
    },
  },
  plugins: [],
};

export default config;
