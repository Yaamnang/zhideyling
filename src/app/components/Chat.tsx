"use client";

import { useEffect, useRef, useState } from "react";

import AlertModal, { type AlertAction } from "@/app/components/AlertModal";
import InputBox, { type InputBoxHandle } from "@/app/components/InputBox";
import Message, {
  moodStyles,
  type ChatMessage,
  type MoodState,
} from "@/app/components/Message";
import ThemeToggle, { type Theme } from "@/app/components/ThemeToggle";

type ChatProps = {
  onMoodUpdate: (mood: MoodState, note: string) => void;
  theme: Theme;
  onThemeChange: (t: Theme) => void;
  onSosClick: () => void;
};

const moodButtons: MoodState[] = [
  "Happy",
  "Neutral",
  "Sad",
  "Stressed",
  "Critical",
];

const shortcutPrompts: Record<MoodState, string> = {
  Happy: "I feel happy and hopeful today.",
  Neutral: "I feel okay and steady today.",
  Sad: "I feel sad and low today.",
  Stressed: "I feel stressed, tired, and overwhelmed today.",
  Critical: "I feel unsafe and need immediate support.",
};

const moodSummaries: Record<MoodState, string> = {
  Happy: "Momentum feels positive. Responses lean into reflection and what is helping.",
  Neutral: "Things feel steady. The check-in stays simple and grounding.",
  Sad: "The tone sounds heavier. Responses slow down and offer gentle, manageable steps.",
  Stressed: "Pressure is rising. Responses shift into decompression and prioritization mode.",
  Critical: "Urgent support may be needed. Extra help options are now available.",
};

const keywordGroups: Record<MoodState, string[]> = {
  Happy: ["happy", "good", "great", "hopeful", "calm", "grateful", "excited"],
  Neutral: ["okay", "ok", "fine", "steady", "normal", "alright"],
  Sad: ["sad", "down", "lonely", "hurt", "empty", "crying", "low"],
  Stressed: [
    "stressed",
    "tired",
    "overwhelmed",
    "anxious",
    "pressure",
    "panic",
    "burned out",
    "burnt out",
  ],
  Critical: [
    "unsafe",
    "self-harm",
    "self harm",
    "hopeless",
    "suicidal",
    "suicide",
    "can't go on",
    "cant go on",
    "hurt myself",
    "kill myself",
    "wanna die",
    "want to die",
    "end my life",
    "don't want to live",
    "dont want to live",
    "don't want to be here",
    "no reason to live",
    "need immediate support",
    "distress",
  ],
};

function createId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createTimestamp() {
  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date());
}

function buildMessage(
  role: ChatMessage["role"],
  text: string,
  mood: MoodState
): ChatMessage {
  return { id: createId(), role, text, mood, timestamp: createTimestamp() };
}

const killVentPatterns = [
  /\bwanna kill\b/,
  /\bwant to kill\b/,
  /\bgoing to kill\b/,
  /\bgonna kill\b/,
  /\bi('ll| will) kill\b/,
  /\bcould kill\b/,
];

// Returns true when venting anger at someone else (not self-harm)
function isKillVent(text: string) {
  const normalized = text.toLowerCase();
  // Exclude self-directed phrases already caught by critical keywords
  if (/kill (my)?self|kill me\b/.test(normalized)) return false;
  return killVentPatterns.some((re) => re.test(normalized));
}

function analyzeMood(text: string) {
  const normalized = text.toLowerCase();

  if (keywordGroups.Critical.some((kw) => normalized.includes(kw))) {
    return { mood: "Critical" as MoodState, needsAlert: true };
  }
  if (keywordGroups.Stressed.some((kw) => normalized.includes(kw))) {
    return { mood: "Stressed" as MoodState, needsAlert: false };
  }
  if (keywordGroups.Sad.some((kw) => normalized.includes(kw))) {
    return { mood: "Sad" as MoodState, needsAlert: false };
  }
  if (keywordGroups.Happy.some((kw) => normalized.includes(kw))) {
    return { mood: "Happy" as MoodState, needsAlert: false };
  }
  if (keywordGroups.Neutral.some((kw) => normalized.includes(kw))) {
    return { mood: "Neutral" as MoodState, needsAlert: false };
  }

  return { mood: "Neutral" as MoodState, needsAlert: false };
}

function buildAssistantReply(mood: MoodState) {
  switch (mood) {
    case "Happy":
      return "I'm glad there's some lift in the day. What helped you get here, and what would you like to keep steady?";
    case "Neutral":
      return "Thanks for checking in. We can keep this simple and focus on one small thing that would make today feel easier.";
    case "Sad":
      return "I'm sorry things feel heavy right now. Let's keep the next step gentle and realistic so you don't have to carry everything at once.";
    case "Stressed":
      return "That sounds like a lot at the same time. Let's break the pressure into one task, one pause, and one person or resource that can lighten it.";
    case "Critical":
      return "I'm really sorry this feels so intense. I'm surfacing extra support options now because you deserve human backup when things feel unsafe.";
    default:
      return "I'm here with you. Tell me what feels most important right now.";
  }
}

const initialMessages: ChatMessage[] = [
  buildMessage(
    "assistant",
    "Welcome to Zhideyling AI. Try a daily check-in button or type how you're feeling, and I'll respond in a tone that matches the mood.",
    "Neutral"
  ),
];

function TypingIndicator() {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-1.5 rounded-[24px] border border-quiet bg-white px-5 py-4 shadow-sm dark:bg-panel-dark">
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            className="h-2 w-2 rounded-full bg-primary/50 animate-bounce"
            style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
          />
        ))}
      </div>
    </div>
  );
}

export default function Chat({ onMoodUpdate, theme, onThemeChange, onSosClick }: ChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
  const [input, setInput] = useState("");
  const [currentMood, setCurrentMood] = useState<MoodState>("Neutral");
  const [isTyping, setIsTyping] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const messagesRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<InputBoxHandle | null>(null);

  useEffect(() => {
    const el = messagesRef.current;
    if (!el) return;
    // Only auto-scroll when content overflows (i.e. after first few messages)
    if (el.scrollHeight > el.clientHeight) {
      el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  function commitMood(mood: MoodState, note: string) {
    setCurrentMood(mood);
    onMoodUpdate(mood, note);
  }

  function sendMessage(rawText: string) {
    const text = rawText.trim();
    if (!text) return;

    // Easter egg — venting anger at someone else
    if (isKillVent(text)) {
      setMessages((prev) => [...prev, buildMessage("user", text, "Stressed")]);
      setInput("");
      commitMood("Stressed", text);

      setIsTyping(true);
      // Phase 1: show "hmm…"
      window.setTimeout(() => {
        setIsTyping(false);
        setMessages((prev) => [...prev, buildMessage("assistant", "hmm…", "Neutral")]);

        // Phase 2: second typing dot, then play audio + final reply
        window.setTimeout(() => {
          setIsTyping(true);
          window.setTimeout(() => {
            setIsTyping(false);
            // Start audio and show message simultaneously, then reply after 2s
            try {
              new Audio("/dho.mp3").play();
            } catch {
              // autoplay blocked — silently ignore
            }
            window.setTimeout(() => {
              setMessages((prev) => [
                ...prev,
                buildMessage("assistant", "perhaps this cleansed ur mind 😌", "Happy"),
              ]);
              inputRef.current?.focus();
            }, 2000);
          }, 1200);
        }, 600);
      }, 1200);

      return;
    }

    const analysis = analyzeMood(text);

    setMessages((prev) => [...prev, buildMessage("user", text, analysis.mood)]);
    setInput("");
    commitMood(analysis.mood, text);

    setIsTyping(true);
    window.setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        buildMessage("assistant", buildAssistantReply(analysis.mood), analysis.mood),
      ]);
      if (analysis.needsAlert) {
        setIsAlertOpen(true);
      } else {
        inputRef.current?.focus();
      }
    }, 1400);
  }

  function handleAlertSelection(action: AlertAction) {
    setIsAlertOpen(false);

    const followUp =
      action === "counselor"
        ? "Let's prioritize a counselor or trained support person next. In a real product this would open an immediate support handoff."
        : action === "trusted-adult"
          ? "Reaching a trusted adult is a strong next move. Keep the message simple: you need support and don't want to handle this alone."
          : "We can keep talking here. If the situation feels more urgent, please reach out to a nearby person or local emergency support right away.";

    setMessages((prev) => [...prev, buildMessage("assistant", followUp, "Critical")]);
  }

  const moodStyle = moodStyles[currentMood];

  return (
    <section className="flex flex-1 flex-col gap-4">
      <div className={`flex min-h-0 flex-1 flex-col gap-4 transition-[filter] duration-300 ${isAlertOpen ? "blur-[2px] pointer-events-none select-none" : ""}`}>

        {/* Conversation panel — fills remaining height */}
        <div className="panel-card flex min-h-0 flex-1 flex-col overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-quiet px-5 py-4 sm:px-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
                Conversation
              </p>
              <h2 className="mt-1 text-xl font-semibold tracking-tight text-body">
                Zhideyling AI
              </h2>
            </div>
            <span className={`mood-pill transition-all duration-500 ${moodStyle.badge}`}>
              <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${moodStyle.dot}`} />
              {currentMood}
            </span>
          </div>

          <div
            ref={messagesRef}
            className="min-h-0 flex-1 overflow-y-auto bg-soft/40 px-4 py-5 dark:bg-surface-dark/40 sm:px-6"
          >
            <div className="flex min-h-full flex-col justify-end gap-4">
              {messages.map((message) => (
                <Message key={message.id} message={message} />
              ))}
              {isTyping && <TypingIndicator />}
            </div>
          </div>

          {/* Composer */}
          <div className="border-t border-quiet bg-primary/5 px-3 pb-3 pt-2 dark:bg-white/5 sm:px-4">
            <div className="mb-2 flex items-center justify-end gap-2">
              <ThemeToggle theme={theme} onChange={onThemeChange} />
              <button
                type="button"
                onClick={onSosClick}
                className="inline-flex items-center gap-1.5 rounded-full bg-critical px-3 py-1.5 text-xs font-semibold text-white shadow-[0_6px_16px_rgba(185,28,28,0.35)] transition hover:brightness-110"
              >
                <svg viewBox="0 0 24 24" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 3 2 21h20Z" /><path d="M12 10v4" /><path d="M12 18h.01" />
                </svg>
                SOS
              </button>
            </div>
            <InputBox
              ref={inputRef}
              value={input}
              onChange={setInput}
              onSubmit={() => sendMessage(input)}
              currentMood={currentMood}
              disabled={isTyping}
            />
          </div>
        </div>

      </div>
      <AlertModal
        open={isAlertOpen}
        onSelect={handleAlertSelection}
        onClose={() => setIsAlertOpen(false)}
      />
    </section>
  );
}
