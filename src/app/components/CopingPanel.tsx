"use client";

import { useMemo, useState } from "react";

import { moodStyles, type MoodState } from "@/app/components/Message";

type Category = "Grounding" | "Reframe" | "Activity" | "Connection";

type Strategy = {
  id: string;
  category: Category;
  title: string;
  body: string;
  moods: MoodState[];
  minutes: number;
};

const strategies: Strategy[] = [
  {
    id: "g1",
    category: "Grounding",
    title: "5-4-3-2-1 senses scan",
    body: "Name 5 things you see, 4 you can touch, 3 you hear, 2 you smell, 1 you taste. Slows racing thoughts.",
    moods: ["Stressed", "Sad", "Critical"],
    minutes: 3,
  },
  {
    id: "g2",
    category: "Grounding",
    title: "Cold-water reset",
    body: "Run cold water over your wrists for 30 seconds, or splash your face. Cues your body that you are safe.",
    moods: ["Stressed", "Critical"],
    minutes: 1,
  },
  {
    id: "g3",
    category: "Grounding",
    title: "Feet on the floor",
    body: "Press both feet flat. Feel the ground. Slow exhales for a minute. Anchors you into the present.",
    moods: ["Stressed", "Sad", "Neutral"],
    minutes: 2,
  },
  {
    id: "r1",
    category: "Reframe",
    title: "What would I tell a friend?",
    body: "Write the situation in one sentence. Then write the kind answer you'd give a close friend. Read it slowly.",
    moods: ["Sad", "Stressed", "Neutral"],
    minutes: 5,
  },
  {
    id: "r2",
    category: "Reframe",
    title: "Name the worry, shrink it",
    body: "Write the worst-case down. Then the most-likely case. Often the gap is wider than it feels inside.",
    moods: ["Stressed", "Sad"],
    minutes: 6,
  },
  {
    id: "r3",
    category: "Reframe",
    title: "Three things going okay",
    body: "List three small things that are fine right now &mdash; working wifi, a warm drink, a kind message. Widens the view.",
    moods: ["Happy", "Neutral", "Sad"],
    minutes: 3,
  },
  {
    id: "a1",
    category: "Activity",
    title: "Two-minute tidy",
    body: "Pick one surface. Clear it. Small order outside often brings small order inside.",
    moods: ["Stressed", "Neutral", "Sad"],
    minutes: 2,
  },
  {
    id: "a2",
    category: "Activity",
    title: "Five-minute walk outside",
    body: "Leave the room, walk somewhere with sky in view, no phone. Moves heavy energy.",
    moods: ["Sad", "Stressed", "Neutral", "Happy"],
    minutes: 5,
  },
  {
    id: "a3",
    category: "Activity",
    title: "Stretch three spots",
    body: "Neck, shoulders, lower back. 20 seconds each. Releases the held-in tension that mood loves to pool.",
    moods: ["Stressed", "Neutral"],
    minutes: 3,
  },
  {
    id: "c1",
    category: "Connection",
    title: "Send one low-pressure message",
    body: "Text one person: &ldquo;Thinking of you.&rdquo; No request attached. Keeps your world a little less alone.",
    moods: ["Sad", "Neutral", "Happy"],
    minutes: 1,
  },
  {
    id: "c2",
    category: "Connection",
    title: "Ask for 10 minutes",
    body: "Tell a trusted person: &ldquo;Can I talk for ten minutes?&rdquo; Short, bounded, easier to say yes to.",
    moods: ["Sad", "Stressed", "Critical"],
    minutes: 10,
  },
  {
    id: "c3",
    category: "Connection",
    title: "Share one small win",
    body: "Tell someone about one thing that went right today. Reinforces the good and strengthens the thread between you.",
    moods: ["Happy", "Neutral"],
    minutes: 2,
  },
];

const filterOptions: Array<"All" | MoodState> = [
  "All",
  "Happy",
  "Neutral",
  "Sad",
  "Stressed",
  "Critical",
];

const categoryOrder: Category[] = ["Grounding", "Reframe", "Activity", "Connection"];

type CopingPanelProps = {
  currentMood: MoodState;
};

export default function CopingPanel({ currentMood }: CopingPanelProps) {
  const [open, setOpen] = useState(false);
  const [filter, setFilter] = useState<"All" | MoodState>(currentMood);

  const visible = useMemo(() => {
    if (filter === "All") {
      return strategies;
    }
    return strategies.filter((item) => item.moods.includes(filter));
  }, [filter]);

  const grouped = useMemo(() => {
    const map = new Map<Category, Strategy[]>();
    categoryOrder.forEach((category) => map.set(category, []));
    visible.forEach((item) => {
      map.get(item.category)?.push(item);
    });
    return map;
  }, [visible]);

  return (
    <section className="panel-card overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left sm:px-6"
      >
        <div className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
            Coping strategies
          </p>
          <h2 className="mt-1 text-xl font-semibold tracking-tight text-body">
            Small moves for right now
          </h2>
          <p className="mt-1 text-sm text-quiet">
            Tap to {open ? "hide" : "show"} &middot; filtered by mood
          </p>
        </div>
        <span
          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-quiet transition ${
            open ? "rotate-180 bg-primary/10 text-primary" : "text-quiet"
          }`}
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
            <path d="M6 9l6 6 6-6" />
          </svg>
        </span>
      </button>

      {open ? (
        <div className="border-t border-quiet px-5 py-5 sm:px-6">
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const isActive = option === filter;
              const pillClass =
                option === "All"
                  ? "bg-primary/10 text-primary"
                  : moodStyles[option].badge;

              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => setFilter(option)}
                  className={`mood-pill transition ${pillClass} ${
                    isActive ? "ring-2 ring-primary/40" : "opacity-70 hover:opacity-100"
                  }`}
                >
                  {option !== "All" ? (
                    <span className={`h-2.5 w-2.5 rounded-full ${moodStyles[option].dot}`} />
                  ) : null}
                  {option}
                </button>
              );
            })}
          </div>

          <div className="mt-5 space-y-5">
            {categoryOrder.map((category) => {
              const items = grouped.get(category) ?? [];
              if (items.length === 0) {
                return null;
              }

              return (
                <div key={category}>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
                    {category}
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-2">
                    {items.map((item) => (
                      <article
                        key={item.id}
                        className="rounded-[22px] border border-quiet surface-muted px-4 py-4"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold text-body">
                            {item.title}
                          </h3>
                          <span className="text-xs font-semibold text-quiet">
                            ~{item.minutes} min
                          </span>
                        </div>
                        <p
                          className="mt-2 text-sm leading-6 text-quiet"
                          dangerouslySetInnerHTML={{ __html: item.body }}
                        />
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}

            {visible.length === 0 ? (
              <p className="rounded-[20px] border border-dashed border-quiet px-4 py-6 text-center text-sm text-quiet">
                No strategies tagged for this mood yet.
              </p>
            ) : null}
          </div>
        </div>
      ) : null}
    </section>
  );
}
