"use client";

export type AlertAction = "counselor" | "trusted-adult" | "continue";

type AlertModalProps = {
  open: boolean;
  onSelect: (action: AlertAction) => void;
  onClose: () => void;
};

export default function AlertModal({
  open,
  onSelect,
  onClose,
}: AlertModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-text/40 p-4 backdrop-blur-md sm:items-center"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-[28px] bg-white p-6 shadow-[0_28px_60px_rgba(15,23,42,0.24)] dark:bg-panel-dark"
        role="dialog"
        aria-modal="true"
        aria-labelledby="support-alert-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-critical">
              Support Alert
            </p>
            <h2
              id="support-alert-title"
              className="mt-3 text-2xl font-semibold tracking-tight text-body"
            >
              It seems you might need additional support
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close support alert"
            className="rounded-full border border-quiet p-1.5 text-quiet transition hover:bg-bg dark:hover:bg-white/5"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M6 6l12 12M6 18L18 6" />
            </svg>
          </button>
        </div>
        <p className="mt-3 text-sm leading-7 text-quiet">
          This prototype opens an extra step whenever the conversation contains
          higher-risk language, so the user sees support choices immediately.
        </p>

        <div className="mt-6 space-y-3">
          <button
            type="button"
            onClick={() => onSelect("counselor")}
            className="flex w-full items-center justify-between rounded-[20px] bg-primary px-4 py-4 text-left text-white transition hover:bg-text"
          >
            <span className="font-semibold">Talk to counselor</span>
            <span className="text-sm text-white/75">Recommended</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect("trusted-adult")}
            className="flex w-full items-center justify-between rounded-[20px] border border-quiet surface-muted px-4 py-4 text-left text-body transition hover:border-primary/30 hover:bg-white dark:hover:bg-white/5"
          >
            <span className="font-semibold">Contact trusted adult</span>
            <span className="text-sm text-quiet">Secondary step</span>
          </button>
          <button
            type="button"
            onClick={() => onSelect("continue")}
            className="flex w-full items-center justify-between rounded-[20px] border border-transparent bg-soft/60 px-4 py-4 text-left text-body transition hover:bg-soft dark:bg-white/5 dark:hover:bg-white/10"
          >
            <span className="font-semibold">Continue chatting</span>
            <span className="text-sm text-quiet">Stay in app</span>
          </button>
        </div>
      </div>
    </div>
  );
}
