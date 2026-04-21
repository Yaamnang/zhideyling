"use client";

import { startTransition, useState } from "react";

import AppShell from "@/app/components/AppShell";
import BreathingWidget from "@/app/components/BreathingWidget";
import Chat from "@/app/components/Chat";
import { moodStyles, type MoodState } from "@/app/components/Message";
import MoodTrendChart from "@/app/components/MoodTrendChart";
import ResourcesDirectory from "@/app/components/ResourcesDirectory";
import SafetyPlan, {
  emptySafetyPlan,
  type SafetyPlanFields,
} from "@/app/components/SafetyPlan";
import SosMenu, { type SosAction } from "@/app/components/SosMenu";
import StreakCard from "@/app/components/StreakCard";
import type { NavItemId } from "@/app/components/navItems";

type MoodEntry = {
  id: string;
  mood: MoodState;
  note: string;
  label: string;
};

const moodOrder: MoodState[] = [
  "Happy",
  "Neutral",
  "Sad",
  "Stressed",
  "Critical",
];

const starterHistory: MoodEntry[] = [
  {
    id: "starter-1",
    mood: "Neutral",
    note: "Steady check-in before the afternoon routine.",
    label: "Today",
  },
  {
    id: "starter-2",
    mood: "Happy",
    note: "Felt relieved after finishing a major task.",
    label: "Tue",
  },
  {
    id: "starter-3",
    mood: "Stressed",
    note: "Workload felt heavy and scattered.",
    label: "Mon",
  },
  {
    id: "starter-4",
    mood: "Sad",
    note: "Energy dipped and motivation felt low.",
    label: "Sun",
  },
];

const moodInsights: Record<MoodState, string> = {
  Happy: "Positive energy is showing up more often. Keep capturing what contributes to it.",
  Neutral: "The recent pattern looks fairly steady with room for small supportive interventions.",
  Sad: "The trend suggests lower energy. Gentle follow-ups and softer pacing may help.",
  Stressed:
    "Stress language is appearing often enough to justify lighter goals and more check-ins.",
  Critical:
    "Urgent support signals were detected. The system should prioritize human escalation paths.",
};

function createEntryId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createDayLabel() {
  return new Intl.DateTimeFormat("en-US", { weekday: "short" }).format(
    new Date()
  );
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState<NavItemId>("chat");
  const [currentMood, setCurrentMood] = useState<MoodState>("Neutral");
  const [history, setHistory] = useState<MoodEntry[]>(starterHistory);
  const [streakDays, setStreakDays] = useState(3);
  const [trustedContactInput, setTrustedContactInput] = useState("");
  const [trustedContacts, setTrustedContacts] = useState<string[]>([]);
  const [trustedContactToRemove, setTrustedContactToRemove] = useState<
    string | null
  >(null);

  const [sosOpen, setSosOpen] = useState(false);
  const [breathingOpen, setBreathingOpen] = useState(false);
  const [safetyOpen, setSafetyOpen] = useState(false);
  const [resourcesOpen, setResourcesOpen] = useState(false);
  const [safetyValues, setSafetyValues] = useState<SafetyPlanFields>(emptySafetyPlan);
  const [supportShortcutId, setSupportShortcutId] = useState(0);

  const moodCounts = moodOrder.reduce<Record<MoodState, number>>(
    (counts, mood) => {
      counts[mood] = 0;
      return counts;
    },
    {
      Happy: 0,
      Neutral: 0,
      Sad: 0,
      Stressed: 0,
      Critical: 0,
    }
  );

  history.forEach((entry) => {
    moodCounts[entry.mood] += 1;
  });

  const dominantMood = moodOrder.reduce<MoodState>(
    (best, mood) => (moodCounts[mood] > moodCounts[best] ? mood : best),
    "Neutral"
  );
  const totalEntries = Math.max(history.length, 1);
  const trustedContactSummary = trustedContacts.length
    ? `${trustedContacts[0]}${
        trustedContacts.length > 1 ? ` +${trustedContacts.length - 1} more` : ""
      }`
    : "Not added yet";

  function handleTabChange(tab: NavItemId) {
    startTransition(() => {
      setActiveTab(tab);
    });
  }

  function handleMoodUpdate(mood: MoodState, note: string) {
    setCurrentMood(mood);
    setStreakDays((current) => current + 1);
    setHistory((currentHistory) => [
      {
        id: createEntryId(),
        mood,
        note: note.slice(0, 84),
        label: "Today",
      },
      ...currentHistory.map((entry, index) =>
        index === 0 && entry.label === "Today"
          ? { ...entry, label: createDayLabel() }
          : entry
      ),
    ].slice(0, 7));
  }

  function handleSosAction(action: SosAction) {
    setSosOpen(false);
    if (action === "breathing") {
      setBreathingOpen(true);
    } else if (action === "safety-plan") {
      setSafetyOpen(true);
    } else if (action === "resources") {
      setResourcesOpen(true);
    } else if (action === "counselor") {
      startTransition(() => {
        setActiveTab("chat");
      });
      setSupportShortcutId((current) => current + 1);
    }
  }

  function addTrustedContact(value: string) {
    const trimmedValue = value.trim();

    if (!trimmedValue) {
      return;
    }

    setTrustedContacts((currentContacts) =>
      currentContacts.includes(trimmedValue)
        ? currentContacts
        : [...currentContacts, trimmedValue]
    );
  }

  function handleTrustedContactAdd() {
    addTrustedContact(trustedContactInput);
    setTrustedContactInput("");
  }

  function handleTrustedContactRemove() {
    if (!trustedContactToRemove) {
      return;
    }

    setTrustedContacts((currentContacts) =>
      currentContacts.filter((contact) => contact !== trustedContactToRemove)
    );
    setTrustedContactToRemove(null);
  }

  return (
    <>
      <AppShell
        activeTab={activeTab}
        currentMood={currentMood}
        streakDays={streakDays}
        onTabChange={handleTabChange}
      >
        {activeTab === "chat" ? (
          <Chat
            onMoodUpdate={handleMoodUpdate}
            onSosClick={() => setSosOpen(true)}
            supportShortcut={
              supportShortcutId
                ? { id: supportShortcutId, type: "counselor" }
                : null
            }
          />
        ) : (
          <section className="grid gap-4 sm:grid-cols-2">
            <article className="panel-card p-5 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                Current snapshot
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-3">
                <span className={`mood-pill ${moodStyles[currentMood].badge}`}>
                  <span
                    className={`h-2.5 w-2.5 rounded-full ${moodStyles[currentMood].dot}`}
                  />
                  {currentMood}
                </span>
                <span className="text-sm text-quiet">Live from the latest chat</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-quiet">
                {moodInsights[currentMood]}
              </p>
              <div className="mt-5 rounded-[22px] surface-muted px-4 py-4">
                <p className="text-sm font-semibold text-body">User info</p>
                <div className="mt-3 space-y-2 text-sm text-quiet">
                  <p>Profile: Talop</p>
                  <p>Authentication: Google / NDI ready</p>
                  <p>Support mode: Mood-aware chat with alert escalation</p>
                  <p>Trusted contacts: {trustedContactSummary}</p>
                </div>
              </div>
            </article>

            <StreakCard streakDays={streakDays} />

            <article className="panel-card p-5 sm:col-span-2 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                    Trusted person
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-body">
                    Support contacts
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {trustedContacts.length} saved
                </span>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-2">
                <div className="rounded-[22px] border border-quiet surface-muted px-4 py-4">
                  <p className="text-sm font-semibold text-body">Add contact</p>
                  <p className="mt-2 text-sm leading-7 text-quiet">
                    Save more than one trusted person. Phone numbers, emails,
                    and general contact labels all work here.
                  </p>

                  <form
                    className="mt-4 space-y-3"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleTrustedContactAdd();
                    }}
                  >
                    <label className="block text-sm font-semibold text-body">
                      Best friend / trusted person contact
                      <input
                        type="text"
                        value={trustedContactInput}
                        onChange={(event) =>
                          setTrustedContactInput(event.target.value)
                        }
                        placeholder="Phone number, email, or other contact"
                        className="mt-2 w-full rounded-[18px] border border-quiet bg-white px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/30 dark:bg-panel-dark"
                      />
                    </label>
                    <button
                      type="submit"
                      className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-text"
                    >
                      Add contact
                    </button>
                    <button
                      type="button"
                      onClick={() => setResourcesOpen(true)}
                      className="w-full rounded-full border border-primary/15 bg-white px-5 py-3 text-sm font-semibold text-body transition hover:border-primary/30 hover:bg-primary/5 dark:bg-panel-dark"
                    >
                      Add from a service?
                    </button>
                  </form>
                </div>

                <div className="rounded-[22px] border border-quiet surface-muted px-4 py-4">
                  <p className="text-sm font-semibold text-body">Manage list</p>
                  <p className="mt-2 text-sm leading-7 text-quiet">
                    Saved contacts appear here beside the add form. Choose one
                    to remove and confirm before it disappears.
                  </p>

                  {trustedContacts.length ? (
                    <div className="mt-4 space-y-3">
                      {trustedContacts.map((contact) => (
                        <div
                          key={contact}
                          className="flex items-center justify-between gap-3 rounded-[18px] border border-primary/10 bg-white px-4 py-3 dark:bg-panel-dark"
                        >
                          <span className="text-sm font-medium text-body">
                            {contact}
                          </span>
                          <button
                            type="button"
                            onClick={() => setTrustedContactToRemove(contact)}
                            className="rounded-full border border-primary/15 px-3 py-1.5 text-xs font-semibold text-primary transition hover:border-primary/30 hover:bg-primary/5"
                          >
                            Remove
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-4 rounded-[18px] border border-dashed border-primary/15 px-4 py-5 text-sm text-quiet">
                      No trusted contacts yet. Add one on the left and it will
                      appear here.
                    </div>
                  )}

                  {trustedContactToRemove ? (
                    <div className="frosted-card mt-4 px-4 py-4">
                      <p className="text-sm font-semibold text-body">
                        Remove this contact?
                      </p>
                      <p className="mt-2 text-sm leading-7 text-quiet">
                        {trustedContactToRemove}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        <button
                          type="button"
                          onClick={() => setTrustedContactToRemove(null)}
                          className="rounded-full border border-white/60 px-4 py-2 text-sm font-semibold text-body transition hover:bg-white/60 dark:border-white/10 dark:hover:bg-white/10"
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          onClick={handleTrustedContactRemove}
                          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-text"
                        >
                          Confirm remove
                        </button>
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </article>

            <article className="panel-card p-5 sm:col-span-2 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                Weekly analytics
              </p>
              <h2 className="mt-2 text-2xl font-semibold tracking-tight text-body">
                Dominant pattern: {dominantMood}
              </h2>
              <div className="mt-5 space-y-4">
                {moodOrder.map((mood) => {
                  const percent = Math.round(
                    (moodCounts[mood] / totalEntries) * 100
                  );

                  return (
                    <div key={mood}>
                      <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-semibold text-body">{mood}</span>
                        <span className="text-quiet">{percent}%</span>
                      </div>
                      <div className="h-3 overflow-hidden rounded-full bg-soft dark:bg-white/10">
                        <div
                          className={`h-full rounded-full ${moodStyles[mood].dot}`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>

            <MoodTrendChart currentMood={currentMood} />

            <article className="panel-card p-5 sm:col-span-2 sm:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                    Mood history
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-body">
                    Recent check-ins
                  </h2>
                </div>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">
                  {history.length} stored entries
                </span>
              </div>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                {history.map((entry) => (
                  <div
                    key={entry.id}
                    className="rounded-[22px] border border-quiet surface-muted px-4 py-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <span className={`mood-pill ${moodStyles[entry.mood].badge}`}>
                        <span
                          className={`h-2.5 w-2.5 rounded-full ${moodStyles[entry.mood].dot}`}
                        />
                        {entry.mood}
                      </span>
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet">
                        {entry.label}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-7 text-quiet">{entry.note}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="panel-card p-5 sm:col-span-2 sm:p-6">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                Settings
              </p>
              <div className="mt-4 grid gap-3 sm:grid-cols-3">
                {[
                  "Privacy mode enabled",
                  "Calm reminder notifications on",
                  "Counselor escalation available",
                ].map((setting) => (
                  <div
                    key={setting}
                    className="rounded-[22px] border border-quiet surface-muted px-4 py-4 text-sm font-semibold text-body"
                  >
                    {setting}
                  </div>
                ))}
              </div>
            </article>
          </section>
        )}
      </AppShell>

      <SosMenu
        open={sosOpen}
        onClose={() => setSosOpen(false)}
        onAction={handleSosAction}
      />

      <BreathingWidget
        open={breathingOpen}
        onClose={() => setBreathingOpen(false)}
      />

      <SafetyPlan
        open={safetyOpen}
        values={safetyValues}
        onChange={setSafetyValues}
        onClose={() => setSafetyOpen(false)}
      />

      <ResourcesDirectory
        open={resourcesOpen}
        onClose={() => setResourcesOpen(false)}
        trustedContacts={trustedContacts}
        onAddToTrustedList={addTrustedContact}
      />
    </>
  );
}
