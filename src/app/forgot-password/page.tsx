"use client";

import Link from "next/link";
import { useState } from "react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-4 py-10 sm:px-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-2xl bg-white shadow-[0_4px_14px_rgba(79,124,172,0.2)]">
          <img src="/logo.png" alt="Zhideyling AI" className="h-full w-full object-contain p-1" />
        </div>
        <span className="text-sm font-semibold text-body">Zhideyling AI</span>
      </div>

      <section className="mt-8 rounded-[30px] border border-quiet bg-white p-6 shadow-[0_24px_55px_rgba(15,23,42,0.1)] dark:bg-panel-dark sm:p-8">
        {sent ? (
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-accent/15">
              <svg
                viewBox="0 0 24 24"
                className="h-8 w-8 text-accent"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M22 2 11 13" />
                <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
              </svg>
            </div>
            <h1 className="mt-5 text-2xl font-semibold tracking-tight text-body">
              Check your email
            </h1>
            <p className="mt-3 text-sm leading-7 text-quiet">
              We sent a password reset link to{" "}
              <span className="font-semibold text-body">{email}</span>.
              <br />
              The link expires in 15 minutes.
            </p>
            <p className="mt-4 text-xs leading-6 text-quiet">
              This is a prototype — no real email is sent.
            </p>
            <Link
              href="/"
              className="mt-8 inline-block w-full rounded-full bg-primary px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-text"
            >
              Back to sign in
            </Link>
          </div>
        ) : (
          <>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
              Account recovery
            </p>
            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-body">
              Forgot password?
            </h1>
            <p className="mt-2 text-sm leading-7 text-quiet">
              Enter the email address on your account and we&rsquo;ll send you a reset link.
            </p>

            <form onSubmit={handleSubmit} className="mt-8 space-y-4">
              <label className="block text-sm font-semibold text-body">
                Email address
                <input
                  type="email"
                  name="email"
                  placeholder="you@school.bt"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
                />
              </label>

              <button
                type="submit"
                className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-text"
              >
                Send reset link
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-quiet">
              Remember your password?{" "}
              <Link href="/" className="font-semibold text-primary">
                Sign in
              </Link>
            </p>
          </>
        )}
      </section>
    </main>
  );
}
