"use client";

import { useEffect } from "react";
import type { FunnelSlug } from "@/content/funnel-slugs";

/**
 * Fires a single tracking ping to /api/funnel-activity on mount, registering
 * the current visitor as a viewer of `slug`. Used both on /funnels (where
 * one tracker fires for the hub itself) and on individual funnel landing
 * pages (where each page reports its own slug).
 *
 * Anonymity:
 *   - Session id is a 16-char random string regenerated each calendar day
 *     (yyyy-mm-dd seed prefix). Stored in sessionStorage, not a cookie. No
 *     IPs, no UA tracking, no PII leaves the browser. The sid is only used
 *     to dedupe rapid reloads inside a 5-minute window for the "active now"
 *     count, anything past 5 min has no use for the sid.
 *
 *   - Skips entirely if the visitor has Do-Not-Track set or if window.
 *     navigator.doNotTrack is "1". Also skips on prerender.
 *
 *   - Failures are silent (we never block UX or surface errors for an
 *     analytics ping).
 */

const SID_KEY = "vdfs.funnel.sid";

function todayStamp(): string {
  const d = new Date();
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
}

function randomChunk(): string {
  // Use crypto where available, fall back to Math.random.
  const bytes = new Uint8Array(8);
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    crypto.getRandomValues(bytes);
  } else {
    for (let i = 0; i < bytes.length; i++) bytes[i] = Math.floor(Math.random() * 256);
  }
  return Array.from(bytes, (b) => b.toString(36).padStart(2, "0")).join("").slice(0, 12);
}

function readOrMintSid(): string {
  try {
    const stored = sessionStorage.getItem(SID_KEY);
    const today = todayStamp();
    if (stored) {
      const [stamp, sid] = stored.split(":");
      if (stamp === today && sid && sid.length >= 6) return sid;
    }
    const fresh = randomChunk();
    sessionStorage.setItem(SID_KEY, `${today}:${fresh}`);
    return fresh;
  } catch {
    // sessionStorage may be blocked (Safari private mode); send a fresh sid
    // and accept that this view counts as "active" only for the lifetime of
    // this tab.
    return randomChunk();
  }
}

function dntEnabled(): boolean {
  try {
    const navAny = navigator as unknown as { doNotTrack?: string; msDoNotTrack?: string };
    return navAny.doNotTrack === "1" || navAny.msDoNotTrack === "1";
  } catch {
    return false;
  }
}

export function FunnelViewTracker({ slug }: { slug: FunnelSlug }) {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (dntEnabled()) return;
    const sid = readOrMintSid();
    const body = JSON.stringify({ slug, sid });
    // Use sendBeacon-style fetch with keepalive so the request survives a
    // fast back-button / link click. Body is small enough to never need
    // the 64KB Beacon API limit.
    try {
      void fetch("/api/funnel-activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body,
        keepalive: true,
        credentials: "omit",
      }).catch(() => {
        /* swallow, analytics must never throw */
      });
    } catch {
      /* swallow */
    }
  }, [slug]);
  return null;
}
