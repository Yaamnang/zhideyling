"use client";

import { forwardRef, type KeyboardEvent, useImperativeHandle, useRef } from "react";

import { moodStyles, type MoodState } from "@/app/components/Message";

type InputBoxProps = {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  currentMood: MoodState;
  disabled?: boolean;
};

export type InputBoxHandle = {
  focus: () => void;
};

const InputBox = forwardRef<InputBoxHandle, InputBoxProps>(function InputBox(
  { value, onChange, onSubmit, currentMood, disabled = false },
  ref
) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useImperativeHandle(ref, () => ({
    focus() {
      textareaRef.current?.focus();
    },
  }));

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (!disabled) onSubmit();
    }
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        if (!disabled) onSubmit();
      }}
      className="rounded-[24px] bg-primary/5 p-3 dark:bg-white/5"
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet">
            New Message
          </p>
          <p className="mt-1 text-sm text-quiet">
            Share what feels true right now.
          </p>
        </div>
        <span className={`mood-pill transition-all duration-500 ${moodStyles[currentMood].badge}`}>
          <span className={`h-2.5 w-2.5 rounded-full transition-colors duration-500 ${moodStyles[currentMood].dot}`} />
          {currentMood}
        </span>
      </div>

      <textarea
        ref={textareaRef}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        disabled={disabled}
        placeholder={
          disabled
            ? "Talop is typing…"
            : "I'm feeling overwhelmed and tired after a long day..."
        }
        className="min-h-28 w-full resize-none rounded-[20px] border border-quiet bg-white px-4 py-3 text-sm leading-7 text-body outline-none transition placeholder:text-quiet focus:border-primary/40 disabled:opacity-60 dark:bg-panel-dark"
      />

      <div className="mt-3 flex items-center justify-between gap-3">
        <p className="text-xs leading-6 text-quiet">
          Press Enter to send &middot; Shift + Enter for new line.
        </p>
        <button
          type="submit"
          disabled={disabled || !value.trim()}
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-text disabled:opacity-50"
        >
          Send
        </button>
      </div>
    </form>
  );
});

export default InputBox;
