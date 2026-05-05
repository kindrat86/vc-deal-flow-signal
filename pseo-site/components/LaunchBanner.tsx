"use client";

import { useEffect, useState } from "react";

const DEADLINE_ISO = "2026-06-25T23:59:00Z";
const STORAGE_KEY = "gd_banner_dismissed_v1";

function formatDelta(ms: number): string {
  if (ms <= 0) return "0d 0h 0m";
  const d = Math.floor(ms / 86_400_000);
  const h = Math.floor((ms % 86_400_000) / 3_600_000);
  const m = Math.floor((ms % 3_600_000) / 60_000);
  return `${d}d ${h}h ${m}m`;
}

export default function LaunchBanner() {
  const [visible, setVisible] = useState(false);
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.localStorage.getItem(STORAGE_KEY) === "1") return;
    setVisible(true);
    const tick = () => {
      const left = new Date(DEADLINE_ISO).getTime() - Date.now();
      setRemaining(formatDelta(left));
      if (left <= 0) setVisible(false);
    };
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!visible) return null;

  const onDismiss = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      /* private mode — fine */
    }
  };

  const onClick = () => {
    if (typeof window !== "undefined" && (window as unknown as { posthog?: { capture: (e: string) => void } }).posthog) {
      try {
        (window as unknown as { posthog: { capture: (e: string) => void } }).posthog.capture("launch_banner_clicked");
      } catch {
        /* no-op */
      }
    }
  };

  return (
    <div
      role="region"
      aria-label="Launch promotion"
      className="relative bg-gradient-to-r from-sky-900 to-sky-800 text-sky-100 border-b border-sky-700 px-10 py-2.5 text-center text-xs sm:text-sm leading-snug"
    >
      <a
        href="https://gitdealflow.com/#pricing"
        onClick={onClick}
        className="text-amber-100 font-semibold no-underline hover:underline"
      >
        Launch week: 50% off 3 months — code{" "}
        <code className="bg-amber-100/15 px-1.5 py-0.5 rounded text-[0.95em]">
          PH50OFF
        </code>
      </a>{" "}
      <span className="opacity-85 inline-block">
        ends in {remaining || "…"}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss launch banner"
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-transparent text-sky-200 border-0 cursor-pointer text-base leading-none p-1.5 hover:text-white"
      >
        ×
      </button>
    </div>
  );
}
