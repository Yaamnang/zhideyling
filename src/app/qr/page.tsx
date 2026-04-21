"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { startTransition, useEffect } from "react";

const qrSize = 17;

function isInFinder(row: number, col: number, originRow: number, originCol: number) {
  return (
    row >= originRow &&
    row < originRow + 5 &&
    col >= originCol &&
    col < originCol + 5
  );
}

function isFinderCell(row: number, col: number) {
  const finderOrigins = [
    [0, 0],
    [0, qrSize - 5],
    [qrSize - 5, 0],
  ] as const;

  return finderOrigins.some(([originRow, originCol]) =>
    isInFinder(row, col, originRow, originCol)
  );
}

function isDarkCell(row: number, col: number) {
  if (isFinderCell(row, col)) {
    const localRow = row < 5 ? row : row > qrSize - 6 ? row - (qrSize - 5) : row;
    const localCol = col < 5 ? col : col > qrSize - 6 ? col - (qrSize - 5) : col;

    return (
      localRow === 0 ||
      localRow === 4 ||
      localCol === 0 ||
      localCol === 4 ||
      (localRow >= 1 && localRow <= 3 && localCol >= 1 && localCol <= 3)
    );
  }

  if (row === 6 || col === 6) {
    return (row + col) % 2 === 0;
  }

  return (row * col + row + col) % 3 === 0 || (row + col) % 4 === 0;
}

export default function QrPage() {
  const router = useRouter();

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      startTransition(() => {
        router.replace("/loading");
      });
    }, 1000);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [router]);

  const cells = Array.from({ length: qrSize * qrSize }, (_, index) => {
    const row = Math.floor(index / qrSize);
    const col = index % qrSize;

    return {
      id: `${row}-${col}`,
      dark: isDarkCell(row, col),
    };
  });

  return (
    <main className="page-shell justify-center gap-5 sm:max-w-xl">
      <section className="glass-card p-6 text-center sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-primary">
          NDI QR Prototype
        </p>
        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-body">
          Scan to continue
        </h1>
        <p className="mt-3 text-sm leading-7 text-quiet sm:text-base">
          This screen simulates the NDI login route. After roughly one second,
          the prototype transitions automatically into the loading handoff.
        </p>

        <div className="mt-8 flex justify-center">
          <div className="rounded-[32px] border border-primary/20 bg-white p-5 shadow-[0_20px_40px_rgba(79,124,172,0.12)]">
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${qrSize}, minmax(0, 1fr))` }}
            >
              {cells.map((cell) => (
                <span
                  key={cell.id}
                  className={`block h-3.5 w-3.5 rounded-[4px] ${
                    cell.dark ? "bg-text" : "bg-soft"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 rounded-[24px] surface-muted px-4 py-4 text-left">
          <p className="text-sm font-semibold text-body">
            Prototype behavior
          </p>
          <div className="mt-3 space-y-2 text-sm leading-7 text-quiet">
            <p>1. Display QR code for NDI login.</p>
            <p>2. Wait roughly one second.</p>
            <p>3. Auto-route to fake loading, then into the dashboard.</p>
          </div>
        </div>

        <p className="mt-6 text-sm text-quiet">
          Want to skip ahead?{" "}
          <Link href="/dashboard" className="font-semibold text-primary">
            Open dashboard
          </Link>
        </p>
      </section>
    </main>
  );
}
