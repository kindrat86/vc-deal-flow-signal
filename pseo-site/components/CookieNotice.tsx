"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const STORAGE_KEY = "gdf-cookie-notice-dismissed";

export default function CookieNotice() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      if (typeof navigator !== "undefined") {
        const nav = navigator as Navigator & { globalPrivacyControl?: boolean };
        if (nav.doNotTrack === "1" || nav.globalPrivacyControl) return;
      }
      if (localStorage.getItem(STORAGE_KEY) === "1") return;
    } catch {
      return;
    }
    setVisible(true);
  }, []);

  if (!visible) return null;

  const dismiss = () => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setVisible(false);
  };

  return (
    <div
      role="dialog"
      aria-label="Cookie notice"
      className="fixed bottom-4 right-4 z-50 max-w-sm rounded-lg border border-slate-700 bg-slate-900/95 p-4 text-sm text-gray-200 shadow-xl backdrop-blur"
    >
      <p className="leading-relaxed">
        We set one first-party cookie for product analytics (PostHog EU) so we can count unique visitors. No ads, no cross-site tracking. Browsers sending DNT or GPC are auto-opted-out.{" "}
        <Link href="/privacy" className="text-sky-400 hover:underline">
          Details
        </Link>
        .
      </p>
      <div className="mt-3 flex justify-end">
        <button
          type="button"
          onClick={dismiss}
          className="rounded-md bg-sky-500 px-3 py-1.5 text-xs font-medium text-white hover:bg-sky-400"
        >
          Got it
        </button>
      </div>
    </div>
  );
}
