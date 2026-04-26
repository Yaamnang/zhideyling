"use client";

import { useEffect, useRef, useState } from "react";

import { moodStyles, type ChatMessage, type MoodState } from "@/app/components/Message";

type CameraViewProps = {
  open: boolean;
  imageSrc: string;
  messages: ChatMessage[];
  isTyping: boolean;
  scanning: boolean;
  mood: MoodState;
  onClose: () => void;
  onSend: (text: string) => void;
};

export default function CameraView({
  open,
  imageSrc,
  messages,
  isTyping,
  scanning,
  mood,
  onClose,
  onSend,
}: CameraViewProps) {
  const [draft, setDraft] = useState("");
  const liveEndRef = useRef<HTMLDivElement | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!open) {
      setDraft("");
      return;
    }
    const id = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    liveEndRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [messages, isTyping, open]);

  useEffect(() => {
    if (!open || isTyping) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => window.clearTimeout(id);
  }, [isTyping, open]);

  if (!open) {
    return null;
  }

  const liveMessages = messages.slice(-30);

  function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isTyping) return;
    setDraft("");
    onSend(text);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
      <div className="relative h-full w-full max-w-md overflow-hidden bg-black sm:h-[92vh] sm:rounded-[28px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={imageSrc}
          alt="Talop"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-x-0 top-0 flex items-center justify-between gap-3 bg-gradient-to-b from-black/55 to-transparent px-4 pb-10 pt-4">
          <div className="h-10 w-10" aria-hidden />
          <div className="flex items-center gap-2 rounded-full bg-black/55 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md">
            {scanning ? (
              <>
                <span className="flex items-center gap-1">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/85"
                      style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
                    />
                  ))}
                </span>
                <span className="tracking-wide">Scanning...</span>
              </>
            ) : (
              <>
                <span className={`h-2 w-2 rounded-full ${moodStyles[mood].dot}`} />
                <span className="tracking-wide">{mood}</span>
              </>
            )}
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close camera"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>

        <div className="pointer-events-none absolute inset-x-0 bottom-0 flex max-h-[55%] flex-col justify-end gap-1.5 bg-gradient-to-t from-black/55 via-black/15 to-transparent px-3 pb-28 pt-6">
          {liveMessages.map((message) => {
            const isUser = message.role === "user";
            return (
              <div
                key={`live-${message.id}`}
                className="flex max-w-[85%] items-start gap-2"
              >
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${
                    isUser
                      ? "bg-white/85 text-text"
                      : "bg-pink-500 text-white"
                  }`}
                >
                  {isUser ? "U" : "AI"}
                </span>
                <div className="rounded-2xl bg-black/45 px-3 py-1.5 text-[13px] leading-snug text-white backdrop-blur-md">
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-white/70">
                    {isUser ? "you" : "Zhideyling AI"}
                  </p>
                  {message.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={message.image}
                      alt=""
                      className="mt-1 h-16 w-16 rounded-lg object-cover"
                    />
                  ) : null}
                  {message.text ? <p className="mt-0.5">{message.text}</p> : null}
                </div>
              </div>
            );
          })}
          {isTyping ? (
            <div className="flex max-w-[85%] items-start gap-2">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-pink-500 text-[11px] font-bold text-white">
                AI
              </span>
              <div className="flex items-center gap-1 rounded-2xl bg-black/45 px-3 py-2 backdrop-blur-md">
                {[0, 150, 300].map((delay) => (
                  <span
                    key={delay}
                    className="h-1.5 w-1.5 animate-bounce rounded-full bg-white/80"
                    style={{ animationDelay: `${delay}ms`, animationDuration: "900ms" }}
                  />
                ))}
              </div>
            </div>
          ) : null}
          <div ref={liveEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="absolute inset-x-3 bottom-3 flex items-center gap-2 rounded-full bg-black/55 px-3 py-2 backdrop-blur-md"
        >
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Say something..."
            className="flex-1 bg-transparent text-sm text-white placeholder:text-white/55 outline-none"
            disabled={isTyping}
          />
          <button
            type="submit"
            disabled={isTyping || !draft.trim()}
            className="rounded-full bg-pink-500 px-4 py-1.5 text-xs font-semibold text-white transition hover:brightness-110 disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
