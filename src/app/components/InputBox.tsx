"use client";

import {
  forwardRef,
  type KeyboardEvent,
  useImperativeHandle,
  useRef,
} from "react";

import { moodStyles, type MoodState } from "@/app/components/Message";

export type ComposerMode = "text" | "contact-choice" | "contacting";

type InputBoxProps = {
  mood: MoodState;
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  mode?: ComposerMode;
  choices?: string[];
  selectedChoice?: string;
  onChoiceSelect?: (value: string) => void;
  contactingLabel?: string;
};

export type InputBoxHandle = {
  focus: () => void;
};

const InputBox = forwardRef<InputBoxHandle, InputBoxProps>(function InputBox(
  {
    mood,
    value,
    onChange,
    onSubmit,
    disabled = false,
    mode = "text",
    choices = [],
    selectedChoice = "",
    onChoiceSelect,
    contactingLabel = "",
  },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const moodStyle = moodStyles[mood];

  useImperativeHandle(ref, () => ({
    focus() {
      textareaRef.current?.focus();
    },
  }));

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled) {
        onSubmit();
      }
    }
  }

  const isTextMode = mode === "text";
  const isChoiceMode = mode === "contact-choice";
  const isContactingMode = mode === "contacting";

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled) {
          onSubmit();
        }
      }}
      className="w-full rounded-[24px] border border-quiet bg-white px-2.5 py-1.5 shadow-[0_12px_24px_rgba(15,23,42,0.1)] dark:bg-panel-dark dark:shadow-[0_12px_24px_rgba(0,0,0,0.35)]"
    >
      <div className="flex items-center px-1 pb-1.5">
        <span className={`mood-pill px-2.5 py-0.5 text-xs ${moodStyle.badge}`}>
          <span className={`h-2.5 w-2.5 rounded-full ${moodStyle.dot}`} />
          {mood}
        </span>
      </div>

      {isTextMode ? (
        <>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => onChange(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
            disabled={disabled}
            placeholder={
              disabled
                ? "Zhideyling AI is typing..."
                : "Message Zhideyling AI..."
            }
            className="min-h-11 w-full resize-none rounded-[16px] border border-transparent bg-transparent px-2 py-0.5 text-sm leading-5 text-body outline-none transition placeholder:text-quiet disabled:opacity-60"
          />

          <div className="mt-1 flex items-center justify-between gap-3 border-t border-primary/10 pt-1.5 dark:border-white/5">
            <p className="hidden text-xs leading-5 text-quiet sm:block">
              Enter to send. Shift + Enter for a new line.
            </p>
            <button
              type="submit"
              disabled={disabled || !value.trim()}
              className="rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-text disabled:opacity-50 sm:text-sm"
            >
              Send
            </button>
          </div>
        </>
      ) : null}

      {isChoiceMode ? (
        <>
          <div className="grid gap-2 sm:grid-cols-2">
            {choices.map((choice) => {
              const isSelected = selectedChoice === choice;

              return (
                <button
                  key={choice}
                  type="button"
                  onClick={() => onChoiceSelect?.(choice)}
                  className={`rounded-[18px] border px-3 py-3 text-left text-sm font-semibold transition ${
                    isSelected
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-quiet bg-soft/45 text-body hover:border-primary/25 hover:bg-white"
                  }`}
                >
                  {choice}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex items-center justify-between gap-3 border-t border-primary/10 pt-1.5 dark:border-white/5">
            <p className="hidden text-xs leading-5 text-quiet sm:block">
              Choose one option, then submit.
            </p>
            <button
              type="submit"
              disabled={disabled || !selectedChoice}
              className="rounded-full bg-primary px-3.5 py-1 text-xs font-semibold text-white transition hover:bg-text disabled:opacity-50 sm:text-sm"
            >
              Submit
            </button>
          </div>
        </>
      ) : null}

      {isContactingMode ? (
        <div
          aria-live="polite"
          className="flex min-h-24 items-center justify-between gap-4 rounded-[20px] bg-soft/55 px-4 py-4"
        >
          <div>
            <p className="text-sm font-semibold text-body">{contactingLabel}</p>
            <p className="mt-1 text-xs text-quiet">
              Simulating outreach for this prototype.
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {[0, 150, 300].map((delay) => (
              <span
                key={delay}
                className="h-2.5 w-2.5 rounded-full bg-primary/60 animate-bounce"
                style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
              />
            ))}
          </div>
        </div>
      ) : null}
    </form>
  );
});

export default InputBox;
