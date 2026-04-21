"use client";

import { useEffect, useMemo, useState } from "react";

type Category = "Crisis" | "Counselors" | "Self-help" | "Student support";

type Resource = {
  id: string;
  category: Category;
  name: string;
  description: string;
  contact: string;
  hours: string;
};

const resources: Resource[] = [
  {
    id: "pema",
    category: "Crisis",
    name: "PEMA Secretariat Helpline",
    description: "Bhutan's national mental wellbeing helpline. Confidential support for distress and crisis.",
    contact: "1010",
    hours: "24 / 7",
  },
  {
    id: "police",
    category: "Crisis",
    name: "Royal Bhutan Police",
    description: "For immediate danger to yourself or someone near you.",
    contact: "112",
    hours: "24 / 7",
  },
  {
    id: "jdwnrh",
    category: "Counselors",
    name: "JDWNRH Psychiatric Unit",
    description: "National referral hospital in Thimphu. Walk-in and appointment services.",
    contact: "+975 2 322 496",
    hours: "Mon-Fri, 9:00 - 16:00",
  },
  {
    id: "school",
    category: "Counselors",
    name: "School / college counselor",
    description: "Most schools and colleges in Bhutan have a counselor office. Ask at the student services desk.",
    contact: "On campus",
    hours: "Term hours",
  },
  {
    id: "rent",
    category: "Student support",
    name: "Student wellbeing circle",
    description: "Peer-led wellbeing groups run through many schools. Low-pressure space to talk.",
    contact: "Ask your counselor",
    hours: "Weekly",
  },
  {
    id: "ycb",
    category: "Student support",
    name: "Youth Centre (Nazhoen Lamtoen)",
    description: "Safe youth space offering listening, referrals, and outreach.",
    contact: "+975 2 336 111",
    hours: "Mon-Sat, 9:00 - 17:00",
  },
  {
    id: "breathe",
    category: "Self-help",
    name: "Guided breathing (in-app)",
    description: "Use the SOS menu > Start breathing to try a 4-7-8 cycle right now.",
    contact: "In app",
    hours: "Anytime",
  },
  {
    id: "plan",
    category: "Self-help",
    name: "Write a safety plan (in-app)",
    description: "Prepare a plan on a calm day so future-you has a clear script.",
    contact: "In app",
    hours: "Anytime",
  },
  {
    id: "intl",
    category: "Crisis",
    name: "International: Befrienders Worldwide",
    description: "Global directory of emotional support helplines in many countries.",
    contact: "befrienders.org",
    hours: "Varies",
  },
];

const categories: Array<"All" | Category> = [
  "All",
  "Crisis",
  "Counselors",
  "Self-help",
  "Student support",
];

const categoryAccent: Record<Category, string> = {
  Crisis: "bg-critical/10 text-critical",
  Counselors: "bg-primary/10 text-primary",
  "Self-help": "bg-accent/15 text-accent",
  "Student support": "bg-secondary/15 text-secondary",
};

type ResourcesDirectoryProps = {
  open: boolean;
  onClose: () => void;
  trustedContacts?: string[];
  onAddToTrustedList?: (contact: string) => void;
};

export default function ResourcesDirectory({
  open,
  onClose,
  trustedContacts = [],
  onAddToTrustedList,
}: ResourcesDirectoryProps) {
  if (!open) {
    return null;
  }
  return (
    <ResourcesOverlay
      onClose={onClose}
      trustedContacts={trustedContacts}
      onAddToTrustedList={onAddToTrustedList}
    />
  );
}

function ResourcesOverlay({
  onClose,
  trustedContacts,
  onAddToTrustedList,
}: {
  onClose: () => void;
  trustedContacts: string[];
  onAddToTrustedList?: (contact: string) => void;
}) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<"All" | Category>("All");

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();
    return resources.filter((item) => {
      const matchesCategory = filter === "All" || item.category === filter;
      const matchesQuery =
        q.length === 0 ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [query, filter]);

  function createTrustedContactLabel(resource: Resource) {
    return `${resource.name} - ${resource.contact}`;
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-end justify-center bg-text/40 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="resources-title"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl overflow-hidden rounded-t-[28px] border border-quiet bg-white shadow-[0_28px_60px_rgba(15,23,42,0.3)] dark:bg-panel-dark sm:rounded-[28px]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3 border-b border-quiet px-5 py-5 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
              Resources
            </p>
            <h2
              id="resources-title"
              className="mt-2 text-2xl font-semibold tracking-tight text-body"
            >
              Support directory
            </h2>
            <p className="mt-2 text-sm leading-6 text-quiet">
              Bhutan-focused hotlines, counselors, and student support, plus self-help
              tools available in this app.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close resources"
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

        <div className="space-y-4 px-5 py-5 sm:px-6">
          <label className="block">
            <span className="sr-only">Search resources</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for hotline, counselor, breathing..."
              className="w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {categories.map((option) => {
              const isActive = option === filter;
              const pillClass =
                option === "All"
                  ? "bg-primary/10 text-primary"
                  : categoryAccent[option];

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`mood-pill transition ${pillClass} ${
                    isActive ? "ring-2 ring-primary/40" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {option}
                </button>
              );
            })}
          </div>

          <div className="max-h-[55vh] space-y-3 overflow-y-auto pr-1">
            {visible.map((item) => (
              <article
                key={item.id}
                className="rounded-[22px] border border-quiet surface-muted px-4 py-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm font-semibold text-body">{item.name}</h3>
                  <span
                    className={`mood-pill text-xs ${categoryAccent[item.category]}`}
                  >
                    {item.category}
                  </span>
                </div>
                <p className="mt-2 text-sm leading-6 text-quiet">{item.description}</p>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-3 text-xs text-quiet">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-semibold text-body">{item.contact}</span>
                    <span>{item.hours}</span>
                  </div>
                  {onAddToTrustedList ? (
                    <button
                      type="button"
                      onClick={() => onAddToTrustedList(createTrustedContactLabel(item))}
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-2 text-xs font-semibold transition ${
                        trustedContacts.includes(createTrustedContactLabel(item))
                          ? "bg-primary/10 text-primary"
                          : "border border-primary/15 bg-white text-body hover:border-primary/30 hover:bg-primary/5 dark:bg-panel-dark"
                      }`}
                    >
                      <span aria-hidden="true">
                        {trustedContacts.includes(createTrustedContactLabel(item))
                          ? "♥"
                          : "♡"}
                      </span>
                      {trustedContacts.includes(createTrustedContactLabel(item))
                        ? "Added to trusted list"
                        : "Add to trusted list"}
                    </button>
                  ) : null}
                </div>
              </article>
            ))}

            {visible.length === 0 ? (
              <p className="rounded-[20px] border border-dashed border-quiet px-4 py-6 text-center text-sm text-quiet">
                No matches. Try a different search or clear the filter.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
