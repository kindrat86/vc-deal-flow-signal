"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

export default function WatchlistManager({ email }: { email: string }) {
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [alertsEnabled, setAlertsEnabled] = useState(false);
  const [alertStatus, setAlertStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  useEffect(() => {
    try {
      const saved = localStorage.getItem("gdf_watchlist");
      if (saved) setWatchlist(JSON.parse(saved));
      const alerts = localStorage.getItem("gdf_alerts_enabled");
      if (alerts === "true") setAlertsEnabled(true);
    } catch {}
  }, []);

  function removeFromWatchlist(name: string) {
    const next = watchlist.filter((n) => n !== name);
    setWatchlist(next);
    localStorage.setItem("gdf_watchlist", JSON.stringify(next));
  }

  async function requestAlerts() {
    setAlertStatus("sending");
    try {
      const res = await fetch("/api/watchlist/alerts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, watchlist }),
      });
      if (res.ok) {
        setAlertsEnabled(true);
        localStorage.setItem("gdf_alerts_enabled", "true");
        setAlertStatus("sent");
      } else {
        setAlertStatus("error");
      }
    } catch {
      setAlertStatus("error");
    }
  }

  if (watchlist.length === 0) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
        <svg className="w-12 h-12 text-gray-700 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
        <p className="text-gray-400 mb-4">Your watchlist is empty.</p>
        <Link
          href="/dashboard"
          className="text-sky-500 hover:text-sky-400 text-sm font-medium transition"
        >
          Go to Dashboard and star some startups
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Watchlist table */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/60">
              <th className="text-left text-gray-400 font-medium px-4 py-3">Company</th>
              <th className="text-right text-gray-400 font-medium px-4 py-3 w-20">Actions</th>
            </tr>
          </thead>
          <tbody>
            {watchlist.map((name) => (
              <tr key={name} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/startup/${slugify(name)}`}
                    className="text-gray-200 hover:text-sky-400 font-medium transition-colors"
                  >
                    {name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeFromWatchlist(name)}
                    className="text-gray-600 hover:text-red-400 text-xs transition"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Email alerts */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Email Alerts
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Get notified at <span className="text-gray-200">{email}</span> when
          any of your watched startups show a significant signal change.
        </p>

        {alertsEnabled || alertStatus === "sent" ? (
          <div className="flex items-center gap-2 text-emerald-400 text-sm">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Alerts enabled for {watchlist.length} {watchlist.length === 1 ? "company" : "companies"}
          </div>
        ) : (
          <button
            onClick={requestAlerts}
            disabled={alertStatus === "sending"}
            className="bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition"
          >
            {alertStatus === "sending" ? "Enabling..." : alertStatus === "error" ? "Retry" : "Enable Email Alerts"}
          </button>
        )}
      </div>
    </div>
  );
}
