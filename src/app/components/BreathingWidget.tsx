"use client";

import { useEffect, useReducer, useState } from "react";

type BreathingWidgetProps = {
  open: boolean;
  onClose: () => void;
};

type Phase = {
  id: "inhale" | "hold" | "exhale";
  label: string;
  seconds: number;
  scale: number;
  tint: string;
};

const phases: Phase[] = [
  { id: "inhale", label: "Breathe in", seconds: 4, scale: 1, tint: "rgb(79, 124, 172)" },
  { id: "hold", label: "Hold", seconds: 7, scale: 1, tint: "rgb(122, 168, 116)" },
  { id: "exhale", label: "Breathe out", seconds: 8, scale: 0.2, tint: "rgb(79, 124, 172)" },
];

type BreathingState = {
  phaseIndex: number;
  secondsLeft: number;
  cycles: number;
};

const initialState: BreathingState = {
  phaseIndex: 0,
  secondsLeft: phases[0].seconds,
  cycles: 0,
};

function reducer(state: BreathingState, action: "tick"): BreathingState {
  if (action !== "tick") {
    return state;
  }

  if (state.secondsLeft > 1) {
    return { ...state, secondsLeft: state.secondsLeft - 1 };
  }

  const nextIndex = (state.phaseIndex + 1) % phases.length;
  return {
    phaseIndex: nextIndex,
    secondsLeft: phases[nextIndex].seconds,
    cycles: nextIndex === 0 ? state.cycles + 1 : state.cycles,
  };
}

export default function BreathingWidget({ open, onClose }: BreathingWidgetProps) {
  if (!open) {
    return null;
  }
  return <BreathingOverlay onClose={onClose} />;
}

function BreathingOverlay({ onClose }: { onClose: () => void }) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [primed, setPrimed] = useState(false);

  useEffect(() => {
    const id = window.setInterval(() => dispatch("tick"), 1000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => setPrimed(true));
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    function handleKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        onClose();
      }
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const phase = phases[state.phaseIndex];
  const visibleScale = primed ? phase.scale : 0.2;
  const visibleTint = primed ? phase.tint : phases[2].tint;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-text/60 px-4 backdrop-blur-lg"
      role="dialog"
      aria-modal="true"
      aria-label="Breathing exercise"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-[32px] border border-white/10 bg-panel-dark/95 p-8 text-center text-text-dark shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-accent">
          4 - 7 - 8 Breathing
        </p>
        <h2 className="mt-2 text-2xl font-semibold tracking-tight">
          Let&rsquo;s slow this down together
        </h2>

        <div className="relative mx-auto mt-8 flex h-60 w-60 items-center justify-center">
          <span className="absolute inset-0 rounded-full bg-accent/10" />
          <span
            className="flex h-full w-full items-center justify-center rounded-full text-base font-semibold text-white"
            style={{
              transform: `scale(${visibleScale})`,
              backgroundColor: visibleTint,
              transitionProperty: "transform, background-color",
              transitionDuration: `${phase.seconds * 1000}ms`,
              transitionTimingFunction: "ease-in-out",
            }}
          >
            {phase.label}
          </span>
        </div>

        <p className="mt-6 text-4xl font-semibold tabular-nums">{state.secondsLeft}</p>
        <p className="mt-2 text-sm text-muted-dark">
          Cycle {state.cycles + 1} &middot; inhale 4 &middot; hold 7 &middot; exhale 8
        </p>

        <button
          type="button"
          onClick={onClose}
          className="mt-8 w-full rounded-full bg-white/10 px-5 py-3 text-sm font-semibold text-text-dark transition hover:bg-white/20"
        >
          I feel steadier &mdash; close
        </button>
      </div>
    </div>
  );
}
