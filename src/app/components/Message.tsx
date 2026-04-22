export type MoodState = "Happy" | "Neutral" | "Sad" | "Stressed" | "Critical";

export type ChatCardData =
  | { kind: "sad-offer"; resolved?: string }
  | { kind: "game-pick"; resolved?: string }
  | { kind: "exercise-pick"; resolved?: string }
  | {
      kind: "emoji-guess";
      emojis: string;
      choices: string[];
      correctIndex: number;
      userIndex?: number;
    }
  | {
      kind: "wyr";
      prompt: { a: string; b: string };
      userPick?: "a" | "b";
    };

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  mood: MoodState;
  timestamp: string;
  card?: ChatCardData;
};

export const moodStyles: Record<
  MoodState,
  { badge: string; border: string; dot: string }
> = {
  Happy: {
    badge: "bg-happy/10 text-happy",
    border: "border-happy/20",
    dot: "bg-happy",
  },
  Neutral: {
    badge: "bg-neutral/20 text-text",
    border: "border-neutral/30",
    dot: "bg-neutral",
  },
  Sad: {
    badge: "bg-sad/10 text-sad",
    border: "border-sad/20",
    dot: "bg-sad",
  },
  Stressed: {
    badge: "bg-stressed/10 text-stressed",
    border: "border-stressed/20",
    dot: "bg-stressed",
  },
  Critical: {
    badge: "bg-critical/10 text-critical",
    border: "border-critical/20",
    dot: "bg-critical",
  },
};

type MessageProps = {
  message: ChatMessage;
};

export default function Message({ message }: MessageProps) {
  const isUser = message.role === "user";

  return (
    <div className={`flex w-full ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[88%] rounded-[22px] px-4 py-3.5 sm:max-w-[78%] ${
          isUser
            ? "bg-primary text-white shadow-[0_14px_28px_rgba(79,124,172,0.24)]"
            : "border border-primary/10 bg-white text-text shadow-[0_10px_22px_rgba(15,23,42,0.06)] dark:bg-panel-dark/90 dark:text-text-dark dark:shadow-[0_12px_26px_rgba(0,0,0,0.22)]"
        }`}
      >
        <div className="flex items-center justify-between gap-3">
          <p
            className={`text-xs font-semibold uppercase tracking-[0.18em] ${
              isUser ? "text-white/75" : "text-muted dark:text-muted-dark"
            }`}
          >
            {isUser ? "You" : "Zhideyling AI"}
          </p>
          {isUser ? (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              {message.mood}
            </span>
          ) : null}
        </div>
        <p className="mt-2.5 text-sm leading-7 sm:text-[15px]">{message.text}</p>
        <p
          className={`mt-2.5 text-xs ${
            isUser ? "text-white/70" : "text-muted dark:text-muted-dark"
          }`}
        >
          {message.timestamp}
        </p>
      </article>
    </div>
  );
}
