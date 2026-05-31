"use client";

import { useEffect } from "react";

/**
 * WalkthroughQuickRedirect — sticky 50/50 bucket assignment that fires on
 * mount and redirects to /walkthrough/5min or /walkthrough/90s.
 *
 * Sticky via localStorage so a returning visitor always lands on the same
 * variant (otherwise the same person would A/B-flip themselves and pollute
 * conversion data). Logs `walkthrough_variant_assigned` to PostHog the first
 * time the bucket is set.
 *
 * Brunson Expert Secrets §4 Ch 19 — Test, Test, Test. Bucket assignment
 * happens once per visitor, then the variant tracker on the destination
 * page does the rest of the funnel-step capture.
 */

type Variant = "5min" | "90s";

const STORAGE_KEY = "walkthrough_variant";
const STORAGE_VERSION_KEY = "walkthrough_variant_v";
// If we ever change the bucketing logic (e.g. add a third arm), bump this
// to invalidate stale assignments. Brunson Ch 19: every test has a "ship
// version" — that's what this is.
const STORAGE_VERSION = "1";

function isVariant(v: unknown): v is Variant {
  return v === "5min" || v === "90s";
}

function readStoredVariant(): Variant | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(STORAGE_KEY);
    const ver = window.localStorage.getItem(STORAGE_VERSION_KEY);
    if (ver !== STORAGE_VERSION) return null;
    return isVariant(v) ? v : null;
  } catch {
    return null;
  }
}

function persistVariant(variant: Variant) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, variant);
    window.localStorage.setItem(STORAGE_VERSION_KEY, STORAGE_VERSION);
  } catch {
    // Private mode or storage full — fall through; we'll re-bucket next
    // visit. Acceptable degradation.
  }
}

function pickVariant(): Variant {
  // crypto.getRandomValues for a more uniform distribution than Math.random
  // when available; falls back gracefully.
  if (
    typeof window !== "undefined" &&
    "crypto" in window &&
    typeof window.crypto.getRandomValues === "function"
  ) {
    const buf = new Uint32Array(1);
    window.crypto.getRandomValues(buf);
    return buf[0] % 2 === 0 ? "5min" : "90s";
  }
  return Math.random() < 0.5 ? "5min" : "90s";
}

export default function WalkthroughQuickRedirect() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Honour an explicit override via ?force=5min|90s (used by support /
    // QA links and by paid-ad creative variants that want to lock to a
    // specific length without relying on randomness).
    const params = new URLSearchParams(window.location.search);
    const force = params.get("force");
    let chosen: Variant | null = null;
    if (force && isVariant(force)) {
      chosen = force;
      persistVariant(chosen);
    } else {
      chosen = readStoredVariant();
      if (!chosen) {
        chosen = pickVariant();
        persistVariant(chosen);

        // First-time assignment — log to PostHog.
        const ph = window.posthog;
        if (ph?.capture && ph.__loaded) {
          try {
            ph.capture("walkthrough_variant_assigned", {
              variant: chosen,
              version: STORAGE_VERSION,
              entry_path: "/walkthrough/quick",
            });
          } catch {
            // Non-fatal.
          }
        }
      }
    }

    const target = chosen === "90s" ? "/walkthrough/90s" : "/walkthrough/5min";
    // Preserve UTM + referral params across the redirect so attribution
    // doesn't break.
    const utmKept = new URLSearchParams();
    for (const [k, v] of params.entries()) {
      if (k === "force") continue;
      utmKept.set(k, v);
    }
    const qs = utmKept.toString();
    const finalUrl = qs ? `${target}?${qs}` : target;

    // Use replace() so the router page doesn't pollute the browser's back
    // button — pressing back should return to wherever the visitor came
    // from, not bounce them between the router and the variant.
    window.location.replace(finalUrl);
  }, []);

  return null;
}
