"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect, useState } from "react";

const loadingSteps = [
  { label: "Verifying prototype identity handoff", threshold: 25 },
  { label: "Preparing mood-aware dashboard context", threshold: 60 },
  { label: "Opening chat and analytics tabs", threshold: 100 },
];

export default function LoadingPage() {
  const router = useRouter();
  const [progress, setProgress] = useState(18);

  useEffect(() => {
    const timeouts = [
      window.setTimeout(() => setProgress(34), 260),
      window.setTimeout(() => setProgress(62), 720),
      window.setTimeout(() => setProgress(100), 1120),
      window.setTimeout(() => {
        startTransition(() => {
          router.replace("/dashboard");
        });
      }, 1500),
    ];

    return () => {
      timeouts.forEach((timeoutId) => window.clearTimeout(timeoutId));
    };
  }, [router]);

  return (
    <main className="page-shell justify-center gap-5 sm:max-w-xl">
      <section className="glass-card p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          Fake Loading Screen
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-body">
          Preparing your dashboard
        </h1>
        <p className="mt-3 text-sm leading-7 text-quiet sm:text-base">
          This is the simulated handoff after QR login. The progress bar advances
          automatically, then the app routes into the main prototype.
        </p>

        <div className="mt-8 h-3 overflow-hidden rounded-full bg-soft">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{
              width: `${progress}%`,
              backgroundImage:
                "linear-gradient(90deg, #4F7CAC 0%, #4FD1C5 100%)",
            }}
          />
        </div>
        <div className="mt-3 flex items-center justify-between text-sm text-quiet">
          <span>Simulation in progress</span>
          <span>{progress}%</span>
        </div>

        <div className="mt-6 space-y-3">
          {loadingSteps.map((step) => {
            const isComplete = progress >= step.threshold;

            return (
              <div
                key={step.label}
                className={`rounded-[20px] border px-4 py-4 transition ${
                  isComplete
                    ? "border-accent/30 bg-accent/10"
                    : "border-quiet surface-muted"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`h-3 w-3 rounded-full ${
                      isComplete ? "bg-accent" : "bg-soft"
                    }`}
                  />
                  <span className="text-sm font-semibold text-body">
                    {step.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        <p className="mt-6 text-sm text-quiet">
          Prefer not to wait?{" "}
          <Link href="/dashboard" className="font-semibold text-primary">
            Skip to dashboard
          </Link>
        </p>
      </section>
    </main>
  );
}
