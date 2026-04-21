"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useState } from "react";

export default function SignupPage() {
  const router = useRouter();
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(true);
    startTransition(() => {
      router.push("/loading");
    });
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
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
          Get started
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-body">
          Create your account
        </h1>
        <p className="mt-2 text-sm leading-7 text-quiet">
          Free to use. Your data stays on your device — nothing is sent to a server.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <label className="block text-sm font-semibold text-body">
            Full name
            <input
              type="text"
              name="name"
              placeholder="Tenzin Dorji"
              required
              className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
            />
          </label>

          <label className="block text-sm font-semibold text-body">
            Email address
            <input
              type="email"
              name="email"
              placeholder="you@school.bt"
              required
              className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
            />
          </label>

          <label className="block text-sm font-semibold text-body">
            Password
            <input
              type="password"
              name="password"
              placeholder="At least 8 characters"
              required
              minLength={8}
              className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
            />
          </label>

          <label className="block text-sm font-semibold text-body">
            Confirm password
            <input
              type="password"
              name="confirm"
              placeholder="Same as above"
              required
              className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
            />
          </label>

          <p className="text-xs leading-6 text-quiet">
            By creating an account you agree to our{" "}
            <span className="font-semibold text-primary">Terms of use</span> and{" "}
            <span className="font-semibold text-primary">Privacy policy</span>.
          </p>

          <button
            type="submit"
            disabled={submitted}
            className="w-full rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-text disabled:opacity-60"
          >
            {submitted ? "Creating account…" : "Create account"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-quiet">
          Already have an account?{" "}
          <Link href="/" className="font-semibold text-primary">
            Sign in
          </Link>
        </p>
      </section>
    </main>
  );
}
