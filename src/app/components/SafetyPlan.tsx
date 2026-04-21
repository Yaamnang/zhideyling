"use client";

import { useEffect } from "react";

export type SafetyPlanFields = {
  warningSigns: string;
  copingStrategies: string;
  distractions: string;
  trustedContacts: string;
  safeEnvironment: string;
};

export const emptySafetyPlan: SafetyPlanFields = {
  warningSigns: "",
  copingStrategies: "",
  distractions: "",
  trustedContacts: "",
  safeEnvironment: "",
};

type SafetyPlanProps = {
  open: boolean;
  values: SafetyPlanFields;
  onChange: (values: SafetyPlanFields) => void;
  onClose: () => void;
};

type Section = {
  id: keyof SafetyPlanFields;
  title: string;
  description: string;
  placeholder: string;
};

const sections: Section[] = [
  {
    id: "warningSigns",
    title: "Warning signs",
    description: "Thoughts, feelings, or situations that tell me I may be entering crisis.",
    placeholder: "Sleeping less, isolating, racing thoughts…",
  },
  {
    id: "copingStrategies",
    title: "Internal coping",
    description: "Things I can do on my own to settle myself.",
    placeholder: "Breathing, short walk, music, cold water…",
  },
  {
    id: "distractions",
    title: "People and places for distraction",
    description: "Healthy people or spaces that can take my mind off the pain.",
    placeholder: "Common room, library, gaming with a friend…",
  },
  {
    id: "trustedContacts",
    title: "Trusted contacts",
    description: "People I can reach out to when I need to talk.",
    placeholder: "Ama (+975…), counselor, close friend…",
  },
  {
    id: "safeEnvironment",
    title: "Making my environment safer",
    description: "Steps to reduce access to means of harm.",
    placeholder: "Give medication to a trusted adult, avoid alcohol tonight…",
  },
];

export default function SafetyPlan({
  open,
  values,
  onChange,
  onClose,
}: SafetyPlanProps) {
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

  function updateField(id: keyof SafetyPlanFields, value: string) {
    onChange({ ...values, [id]: value });
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-text/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="safety-plan-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-t-[28px] border border-quiet bg-white shadow-[0_28px_60px_rgba(15,23,42,0.3)] dark:bg-panel-dark sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-quiet px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-critical">
              Crisis Safety Plan
            </p>
            <h2
              id="safety-plan-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-body"
            >
              Your personal safety plan
            </h2>
            <p className="mt-2 text-sm leading-6 text-quiet">
              Fill this in on a calmer day so future-you has a clear next step.
              Entries stay only on this device during this session.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close safety plan"
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

        <div className="max-h-[70vh] space-y-4 overflow-y-auto px-5 py-5 sm:px-6">
          {sections.map((section, index) => (
            <label key={section.id} className="block">
              <span className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[11px] font-bold text-primary">
                  {index + 1}
                </span>
                {section.title}
              </span>
              <span className="mt-2 block text-sm leading-6 text-quiet">
                {section.description}
              </span>
              <textarea
                value={values[section.id]}
                onChange={(event) => updateField(section.id, event.target.value)}
                rows={3}
                placeholder={section.placeholder}
                className="mt-2 w-full resize-none rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm leading-6 text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
              />
            </label>
          ))}

          <div className="rounded-[20px] border border-quiet surface-muted px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
              If you feel in immediate danger
            </p>
            <p className="mt-2 text-sm leading-6 text-body">
              Call 112 (Royal Bhutan Police) or reach the PEMA Secretariat helpline
              immediately. You do not have to handle this alone.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-quiet px-5 py-4 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-text"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
