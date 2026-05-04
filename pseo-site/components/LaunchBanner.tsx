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
      style={{
        background: "linear-gradient(90deg, #0c4a6e 0%, #075985 100%)",
        color: "#e0f2fe",
        padding: "10px 16px",
        fontSize: 14,
        textAlign: "center",
        position: "relative",
        borderBottom: "1px solid #0369a1",
      }}
    >
      <a
        href="https://gitdealflow.com/#pricing"
        onClick={onClick}
        style={{ color: "#fef3c7", textDecoration: "none", fontWeight: 600 }}
      >
        Launch week: 50% off 3 months — code <code style={{ background: "rgba(254,243,199,0.15)", padding: "1px 6px", borderRadius: 4 }}>PH50OFF</code>
      </a>{" "}
      <span style={{ opacity: 0.85, marginLeft: 6 }}>
        ends in {remaining || "…"}
      </span>
      <button
        type="button"
        onClick={onDismiss}
        aria-label="Dismiss launch banner"
        style={{
          position: "absolute",
          right: 8,
          top: "50%",
          transform: "translateY(-50%)",
          background: "transparent",
          color: "#bae6fd",
          border: 0,
          cursor: "pointer",
          fontSize: 16,
          lineHeight: 1,
          padding: 6,
        }}
      >
        ×
      </button>
    </div>
  );
}
