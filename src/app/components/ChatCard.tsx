"use client";

import type { ChatCardData } from "@/app/components/Message";

export type CardAction =
  | { kind: "sad-offer"; choice: "game" | "exercise" | "chat" }
  | { kind: "game-pick"; choice: "emoji" | "wyr" }
  | { kind: "exercise-pick"; choice: "breathing" | "grounding" }
  | { kind: "emoji-guess"; index: number }
  | { kind: "wyr"; choice: "a" | "b" };

type ChatCardProps = {
  messageId: string;
  card: ChatCardData;
  onAction: (messageId: string, action: CardAction) => void;
};

const baseCard =
  "w-full max-w-[88%] rounded-[22px] border border-primary/15 bg-white/92 px-4 py-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] dark:border-white/10 dark:bg-panel-dark/92 sm:max-w-[78%]";

const choiceButton =
  "rounded-[16px] border border-primary/15 bg-soft/55 px-3 py-2.5 text-sm font-semibold text-body transition hover:border-primary/35 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:hover:bg-white/10";

const choiceButtonActive =
  "rounded-[16px] border border-primary bg-primary/10 px-3 py-2.5 text-sm font-semibold text-primary";

export default function ChatCard({ messageId, card, onAction }: ChatCardProps) {
  if (card.kind === "sad-offer") {
    return (
      <article className={baseCard}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Quick shift
        </p>
        <p className="mt-2 text-sm leading-6 text-body">
          Want to try something light? I can offer a quick game, a short
          exercise, or we can just keep chatting.
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-3">
          {(
            [
              ["game", "Play a game"],
              ["exercise", "Try an exercise"],
              ["chat", "Just chat"],
            ] as const
          ).map(([choice, label]) => (
            <button
              key={choice}
              type="button"
              disabled={!!card.resolved}
              onClick={() => onAction(messageId, { kind: "sad-offer", choice })}
              className={
                card.resolved === choice ? choiceButtonActive : choiceButton
              }
            >
              {label}
            </button>
          ))}
        </div>
      </article>
    );
  }

  if (card.kind === "game-pick") {
    return (
      <article className={baseCard}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Pick a game
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(
            [
              ["emoji", "Emoji guess"],
              ["wyr", "Would you rather"],
            ] as const
          ).map(([choice, label]) => (
            <button
              key={choice}
              type="button"
              disabled={!!card.resolved}
              onClick={() => onAction(messageId, { kind: "game-pick", choice })}
              className={
                card.resolved === choice ? choiceButtonActive : choiceButton
              }
            >
              {label}
            </button>
          ))}
        </div>
      </article>
    );
  }

  if (card.kind === "exercise-pick") {
    return (
      <article className={baseCard}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Pick an exercise
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(
            [
              ["breathing", "4-7-8 breathing"],
              ["grounding", "5-4-3-2-1 grounding"],
            ] as const
          ).map(([choice, label]) => (
            <button
              key={choice}
              type="button"
              disabled={!!card.resolved}
              onClick={() =>
                onAction(messageId, { kind: "exercise-pick", choice })
              }
              className={
                card.resolved === choice ? choiceButtonActive : choiceButton
              }
            >
              {label}
            </button>
          ))}
        </div>
      </article>
    );
  }

  if (card.kind === "emoji-guess") {
    const played = card.userIndex !== undefined;
    const correct = card.userIndex === card.correctIndex;
    return (
      <article className={baseCard}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Emoji guess
        </p>
        <p className="mt-2 text-sm leading-6 text-body">
          What do these emojis spell out?
        </p>
        <p className="mt-3 text-center text-4xl tracking-widest">
          {card.emojis}
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {card.choices.map((choice, index) => {
            const isUserPick = card.userIndex === index;
            const isCorrect = index === card.correctIndex;
            let className = choiceButton;
            if (played) {
              if (isCorrect) {
                className =
                  "rounded-[16px] border border-happy bg-happy/10 px-3 py-2.5 text-sm font-semibold text-happy";
              } else if (isUserPick) {
                className =
                  "rounded-[16px] border border-critical/40 bg-critical/10 px-3 py-2.5 text-sm font-semibold text-critical";
              } else {
                className =
                  "rounded-[16px] border border-quiet bg-soft/40 px-3 py-2.5 text-sm text-quiet";
              }
            }
            return (
              <button
                key={choice}
                type="button"
                disabled={played}
                onClick={() =>
                  onAction(messageId, { kind: "emoji-guess", index })
                }
                className={className}
              >
                {choice}
              </button>
            );
          })}
        </div>
        {played ? (
          <p className="mt-3 text-sm font-medium text-body">
            {correct
              ? `Nice — ${card.choices[card.correctIndex]} it is!`
              : `Close — it was ${card.choices[card.correctIndex]}.`}
          </p>
        ) : null}
      </article>
    );
  }

  if (card.kind === "wyr") {
    const played = !!card.userPick;
    return (
      <article className={baseCard}>
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Would you rather
        </p>
        <div className="mt-3 grid gap-2 sm:grid-cols-2">
          {(["a", "b"] as const).map((key) => {
            const selected = card.userPick === key;
            return (
              <button
                key={key}
                type="button"
                disabled={played}
                onClick={() => onAction(messageId, { kind: "wyr", choice: key })}
                className={`rounded-[16px] border px-3 py-3 text-left text-sm font-medium transition ${
                  selected
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-primary/15 bg-soft/55 text-body hover:border-primary/35 hover:bg-white disabled:opacity-60 dark:border-white/10 dark:bg-white/5"
                }`}
              >
                <span className="mr-2 font-semibold text-primary">
                  {key.toUpperCase()}.
                </span>
                {card.prompt[key]}
              </button>
            );
          })}
        </div>
      </article>
    );
  }

  return null;
}
