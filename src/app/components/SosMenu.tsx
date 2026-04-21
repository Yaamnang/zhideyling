"use client";

import { useEffect } from "react";

export type SosAction = "breathing" | "safety-plan" | "resources" | "counselor";

type SosMenuProps = {
  open: boolean;
  onClose: () => void;
  onAction: (action: SosAction) => void;
};

const actions: Array<{
  id: SosAction;
  title: string;
  description: string;
  accent: string;
}> = [
  {
    id: "breathing",
    title: "Start breathing exercise",
    description: "Guided 4-7-8 cycle to settle the body.",
    accent: "bg-accent text-text",
  },
  {
    id: "safety-plan",
    title: "Open safety plan",
    description: "Review your warning signs, contacts, and calm steps.",
    accent: "bg-primary text-white",
  },
  {
    id: "resources",
    title: "View resources",
    description: "Hotlines, counselors, and student support nearby.",
    accent: "bg-secondary text-white",
  },
  {
    id: "counselor",
    title: "Talk to a counselor",
    description: "Surface trusted adult and counselor options now.",
    accent: "bg-critical text-white",
  },
];

export default function SosMenu({ open, onClose, onAction }: SosMenuProps) {
  useEffect(() => {
    if (!open) {
      return;
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onClose]);

  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-text/30 px-4 pb-6 pt-20 backdrop-blur-sm sm:items-start sm:justify-end sm:px-6 sm:pt-24"
      role="dialog"
      aria-modal="true"
      aria-label="Support options"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[28px] border border-quiet bg-white p-5 shadow-[0_28px_60px_rgba(15,23,42,0.24)] dark:bg-panel-dark"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-critical">
              Support Shortcuts
            </p>
            <h2 className="mt-2 text-xl font-semibold tracking-tight text-body">
              Pick what helps right now
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close support menu"
            className="rounded-full border border-quiet p-1.5 text-quiet transition hover:bg-bg dark:hover:bg-white/5"
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
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="mt-5 space-y-3">
          {actions.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => onAction(action.id)}
              className="flex w-full items-start gap-3 rounded-[22px] border border-quiet surface-muted px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-primary/30"
            >
              <span
                className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-xl text-sm font-bold ${action.accent}`}
              >
                {action.id === "breathing"
                  ? "~"
                  : action.id === "safety-plan"
                    ? "!"
                    : action.id === "resources"
                      ? "?"
                      : "SOS"}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-semibold text-body">
                  {action.title}
                </span>
                <span className="mt-1 block text-xs leading-6 text-quiet">
                  {action.description}
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
