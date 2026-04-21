"use client";

import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const ACCOUNTS = [
  {
    id: "prototype",
    name: "Talop",
    email: "talop@gmail.com",
    initials: "T",
    color: "bg-[#4285F4]",
  },
];

export default function GoogleOAuthPage() {
  const router = useRouter();
  const [selecting, setSelecting] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selecting) {
      return;
    }

    const id = window.setTimeout(() => {
      startTransition(() => {
        router.replace("/loading");
      });
    }, 900);

    return () => window.clearTimeout(id);
  }, [selecting, router]);

  function handleSelect(id: string) {
    setSelectedId(id);
    setSelecting(true);
  }

  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-[#f1f3f4] px-4 py-10 dark:bg-[#1a1a2e]">
      <div className="w-full max-w-sm overflow-hidden rounded-[28px] bg-white shadow-[0_4px_24px_rgba(0,0,0,0.15)] dark:bg-[#1e2030]">
        {/* Google header */}
        <div className="border-b border-[#e8eaed] px-6 pb-5 pt-7 dark:border-white/10">
          <GoogleWordmark />
          <h1 className="mt-5 text-2xl font-normal tracking-tight text-[#202124] dark:text-white">
            Sign in
          </h1>
          <p className="mt-1 text-sm text-[#5f6368] dark:text-white/60">
            to continue to <span className="font-medium text-[#202124] dark:text-white">Zhideyling AI</span>
          </p>
        </div>

        {/* Fake browser URL bar */}
        <div className="flex items-center gap-2 bg-[#f8f9fa] px-5 py-2.5 dark:bg-white/5">
          <svg
            viewBox="0 0 24 24"
            className="h-3.5 w-3.5 shrink-0 text-[#5f6368] dark:text-white/50"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <span className="truncate text-xs text-[#5f6368] dark:text-white/50">
            accounts.google.com/o/oauth2/auth
          </span>
        </div>

        {/* Account list */}
        <div className="px-6 py-5">
          <p className="text-sm text-[#5f6368] dark:text-white/60">
            Choose an account
          </p>

          <div className="mt-4 space-y-2">
            {ACCOUNTS.map((account) => {
              const isSelected = selectedId === account.id;

              return (
                <button
                  key={account.id}
                  type="button"
                  onClick={() => handleSelect(account.id)}
                  disabled={selecting}
                  className="flex w-full items-center gap-3 rounded-full border border-[#e8eaed] px-4 py-3 text-left transition hover:bg-[#f8f9fa] disabled:opacity-70 dark:border-white/10 dark:hover:bg-white/5"
                >
                  <span
                    className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${account.color} text-sm font-semibold text-white`}
                  >
                    {isSelected ? (
                      <svg
                        viewBox="0 0 24 24"
                        className="h-4 w-4 animate-spin"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                      >
                        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                      </svg>
                    ) : (
                      account.initials
                    )}
                  </span>
                  <span className="min-w-0">
                    <p className="truncate text-sm font-medium text-[#202124] dark:text-white">
                      {account.name}
                    </p>
                    <p className="truncate text-xs text-[#5f6368] dark:text-white/60">
                      {account.email}
                    </p>
                  </span>
                </button>
              );
            })}

            <button
              type="button"
              className="flex w-full items-center gap-3 rounded-full px-4 py-3 text-left text-sm text-[#1a73e8] transition hover:bg-[#e8f0fe] dark:text-[#8ab4f8] dark:hover:bg-white/5"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#dadce0] dark:border-white/15">
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={1.8}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4 21a8 8 0 0 1 16 0" />
                  <path d="M19 3v4M17 5h4" />
                </svg>
              </span>
              Use another account
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#e8eaed] px-6 py-4 dark:border-white/10">
          <span className="text-xs text-[#5f6368] dark:text-white/40">
            English (US)
          </span>
          <div className="flex gap-4 text-xs text-[#5f6368] dark:text-white/40">
            <span>Help</span>
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>

      {selecting && (
        <p className="absolute bottom-8 left-1/2 -translate-x-1/2 text-xs text-[#5f6368] dark:text-white/50">
          Signing you in…
        </p>
      )}
    </main>
  );
}

function GoogleWordmark() {
  return (
    <svg viewBox="0 0 74 24" className="h-6 w-auto" aria-label="Google">
      <path
        d="M9.24 8.19v2.46h5.88c-.18 1.38-.64 2.39-1.34 3.1-.86.86-2.2 1.8-4.54 1.8-3.62 0-6.45-2.92-6.45-6.54s2.83-6.54 6.45-6.54c1.95 0 3.38.77 4.43 1.76L15.4 2.5C13.94 1.08 11.98 0 9.24 0 4.28 0 .11 4.04.11 9s4.17 9 9.13 9c2.68 0 4.7-.88 6.28-2.52 1.62-1.62 2.13-3.91 2.13-5.75 0-.57-.04-1.1-.13-1.54H9.24z"
        fill="#4285F4"
      />
      <path
        d="M25 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"
        fill="#EA4335"
      />
      <path
        d="M53.58 7.49h-.09c-.57-.68-1.67-1.3-3.06-1.3C47.53 6.19 45 8.72 45 12c0 3.26 2.53 5.81 5.43 5.81 1.39 0 2.49-.62 3.06-1.32h.09v.83c0 2.22-1.19 3.41-3.1 3.41-1.56 0-2.53-1.12-2.93-2.07l-2.22.92c.64 1.54 2.33 3.43 5.15 3.43 2.99 0 5.52-1.76 5.52-6.05V6.49h-2.42v1zm-2.93 8.03c-1.76 0-3.1-1.5-3.1-3.52 0-2.05 1.34-3.52 3.1-3.52 1.74 0 3.1 1.5 3.1 3.54.01 2.03-1.36 3.5-3.1 3.5z"
        fill="#4285F4"
      />
      <path
        d="M38 6.19c-3.21 0-5.83 2.44-5.83 5.81 0 3.34 2.62 5.81 5.83 5.81s5.83-2.46 5.83-5.81c0-3.37-2.62-5.81-5.83-5.81zm0 9.33c-1.76 0-3.28-1.45-3.28-3.52 0-2.09 1.52-3.52 3.28-3.52s3.28 1.43 3.28 3.52c0 2.07-1.52 3.52-3.28 3.52z"
        fill="#FBBC05"
      />
      <path
        d="M58 .24h2.51v17.57H58z"
        fill="#34A853"
      />
      <path
        d="M63.93 14.35c-.83 0-1.42-.38-1.8-1.12l4.97-2.06-.17-.42c-.31-.84-1.26-2.38-3.2-2.38-1.92 0-3.52 1.51-3.52 3.81 0 2.14 1.58 3.81 3.7 3.81 1.71 0 2.7-.1 3.49-1.32l-1.43-.95c-.47.69-1.12 1.04-2.04 1.04l-.01.01v.58zm-.19-4.7c.65 0 1.19.33 1.38.8l-3.33 1.38c-.04-2.02 1.34-2.18 1.95-2.18z"
        fill="#EA4335"
      />
    </svg>
  );
}
