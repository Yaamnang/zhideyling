export type MoodState = "Happy" | "Neutral" | "Sad" | "Stressed" | "Critical";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  text: string;
  mood: MoodState;
  timestamp: string;
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
  const moodStyle = moodStyles[message.mood];

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <article
        className={`max-w-[88%] rounded-[24px] border px-4 py-4 shadow-sm sm:max-w-[80%] ${
          isUser
            ? "border-transparent bg-primary text-white"
            : `${moodStyle.border} bg-white text-text dark:bg-panel-dark dark:text-text-dark`
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
          {isUser && (
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-2.5 py-1 text-xs font-semibold text-white">
              <span className="h-2 w-2 rounded-full bg-white" />
              {message.mood}
            </span>
          )}
        </div>
        <p className="mt-3 text-sm leading-7 sm:text-[15px]">{message.text}</p>
        <p
          className={`mt-3 text-xs ${
            isUser ? "text-white/70" : "text-muted dark:text-muted-dark"
          }`}
        >
          {message.timestamp}
        </p>
      </article>
    </div>
  );
}
