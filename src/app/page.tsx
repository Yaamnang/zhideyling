import Link from "next/link";

const quickNotes = [
  {
    label: "Mood-aware chat",
    text: "Responses adapt around happy, neutral, sad, stressed, and critical cues.",
  },
  {
    label: "NDI prototype",
    text: "The QR route still moves through the simulated loading handoff.",
  },
  {
    label: "Profile tab",
    text: "Mood history, analytics, and settings stay available after sign-in.",
  },
];

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-5 px-4 py-5 sm:px-6 sm:py-8">
      <section className="grid gap-4 sm:grid-cols-[0.88fr_1.12fr] sm:items-center">
        <div className="panel-card relative overflow-hidden p-6 sm:p-8">
          <div className="absolute -right-10 -top-8 h-32 w-32 rounded-full bg-primary/10" />
          <div className="absolute bottom-5 right-6 h-20 w-20 rounded-full bg-accent/15" />

          <span className="mood-pill bg-primary/10 text-primary">
            Zhideyling AI
          </span>
          <h1 className="mt-5 text-3xl font-semibold tracking-tight text-body sm:text-4xl">
            Sign in and continue the support flow.
          </h1>
          <p className="mt-3 max-w-sm text-sm leading-7 text-quiet">
            A cleaner entry screen with direct login, Google, and NDI in one place.
          </p>

          <div className="mt-8 grid gap-3">
            {quickNotes.map((item) => (
              <div
                key={item.label}
                className="rounded-[22px] border border-quiet surface-muted px-4 py-4"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                  {item.label}
                </p>
                <p className="mt-2 text-sm leading-7 text-quiet">{item.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex items-center gap-3 rounded-[22px] bg-text px-4 py-4 text-white dark:bg-white/10">
            <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-2xl bg-white">
              <img src="/logo.png" alt="Zhideyling AI" className="h-full w-full object-contain p-1" />
            </div>
            <div>
              <p className="text-sm font-semibold">Prototype status</p>
              <p className="text-sm text-white/70">
                Login, QR, loading, chat, and dashboard are ready.
              </p>
            </div>
          </div>
        </div>

        <section className="rounded-[30px] border border-quiet bg-white p-6 shadow-[0_24px_55px_rgba(15,23,42,0.1)] dark:bg-panel-dark sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-quiet">
            Welcome back
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-body">
            Sign in
          </h2>
          <p className="mt-2 text-sm leading-7 text-quiet">
            Use the form or continue with one of the prototype login methods.
          </p>

          <form action="/dashboard" className="mt-8 space-y-4">
            <label className="block text-sm font-semibold text-body">
              Name
              <input
                type="text"
                name="name"
                placeholder="Talop"
                className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-normal text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
              />
            </label>

            <label className="block text-sm font-semibold text-body" htmlFor="password">
              Password
              <input
                id="password"
                type="password"
                name="password"
                placeholder="********"
                className="mt-2 w-full rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm text-body outline-none transition placeholder:text-quiet focus:border-primary/40"
              />
            </label>

            <div className="flex items-center justify-between">
              <button
                type="submit"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition hover:bg-text"
              >
                Login
              </button>
              <Link href="/forgot-password" className="text-sm font-semibold text-primary">
                Forgot password?
              </Link>
            </div>
          </form>

          <div className="mt-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-soft dark:bg-white/10" />
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-quiet">
              Or continue with
            </span>
            <div className="h-px flex-1 bg-soft dark:bg-white/10" />
          </div>

          <div className="mt-6 grid gap-3">
            <Link
              href="/oauth/google"
              className="flex items-center justify-between rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-semibold text-body transition hover:border-primary/40"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary dark:bg-white/10 dark:text-accent">
                  <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden>
                    <path
                      fill="currentColor"
                      d="M21.6 12.2c0-.7-.1-1.4-.2-2H12v3.8h5.4a4.6 4.6 0 0 1-2 3v2.5h3.3c1.9-1.8 3-4.3 3-7.3Z"
                    />
                    <path
                      fill="currentColor"
                      opacity=".8"
                      d="M12 22c2.7 0 5-.9 6.7-2.5l-3.3-2.5c-.9.6-2.1 1-3.4 1-2.6 0-4.8-1.7-5.6-4.1H3v2.6A10 10 0 0 0 12 22Z"
                    />
                    <path
                      fill="currentColor"
                      opacity=".6"
                      d="M6.4 13.9a6 6 0 0 1 0-3.8V7.5H3a10 10 0 0 0 0 9l3.4-2.6Z"
                    />
                    <path
                      fill="currentColor"
                      opacity=".45"
                      d="M12 5.9c1.5 0 2.8.5 3.8 1.5l2.8-2.8A10 10 0 0 0 3 7.5l3.4 2.6C7.2 7.6 9.4 5.9 12 5.9Z"
                    />
                  </svg>
                </span>
                Continue with Google
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs text-quiet dark:bg-white/5">
                OAuth
              </span>
            </Link>
            <Link
              href="/qr"
              className="flex items-center justify-between rounded-[18px] border border-quiet surface-muted px-4 py-3 text-sm font-semibold text-body transition hover:border-primary/40"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary dark:bg-white/10 dark:text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <rect x="3" y="3" width="7" height="7" rx="1" />
                    <rect x="14" y="3" width="7" height="7" rx="1" />
                    <rect x="3" y="14" width="7" height="7" rx="1" />
                    <path d="M14 14h3v3M20 14v.01M14 20v.01M17 20h4" />
                  </svg>
                </span>
                Continue with NDI
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs text-quiet dark:bg-white/5">
                QR
              </span>
            </Link>
            <Link
              href="/signup"
              className="flex items-center justify-between rounded-[18px] border border-primary/20 bg-primary/5 px-4 py-3 text-sm font-semibold text-primary transition hover:bg-primary/10 dark:border-accent/30 dark:bg-accent/10 dark:text-accent"
            >
              <span className="flex items-center gap-3">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-primary dark:bg-white/10 dark:text-accent">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21a8 8 0 0 1 16 0" />
                    <path d="M19 3v4M17 5h4" />
                  </svg>
                </span>
                Create an account
              </span>
              <span className="rounded-full bg-white px-2.5 py-1 text-xs text-quiet dark:bg-white/5">
                New
              </span>
            </Link>
          </div>
        </section>
      </section>
    </main>
  );
}
