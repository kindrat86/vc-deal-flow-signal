"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { slugify } from "@/lib/slugify";

interface WatchlistItem {
  id: number;
  startup_name: string;
  added_at: string;
  alert_on_accelerating: boolean;
  alert_on_new_peak: boolean;
}

export default function WatchlistManager({ email }: { email: string }) {
  const [items, setItems] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/watchlist")
      .then((r) => (r.ok ? r.json() : { items: [] }))
      .then((data: { items: WatchlistItem[] }) => {
        setItems(data.items ?? []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  function removeFromWatchlist(name: string) {
    setItems((prev) => prev.filter((i) => i.startup_name !== name));
    fetch(`/api/watchlist/${encodeURIComponent(name)}`, { method: "DELETE" }).catch(() => {});
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-8 text-center">
        <p className="text-gray-500 text-sm">Loading watchlist…</p>
      </div>
    );
  }

  if (items.length === 0) {
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
            {items.map((item) => (
              <tr key={item.startup_name} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3">
                  <Link
                    href={`/startup/${slugify(item.startup_name)}`}
                    className="text-gray-200 hover:text-sky-400 font-medium transition-colors"
                  >
                    {item.startup_name}
                  </Link>
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => removeFromWatchlist(item.startup_name)}
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

      {/* Email alerts — automatic, no button needed */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6">
        <h2 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-3">
          Email Alerts
        </h2>
        <p className="text-gray-400 text-sm mb-4">
          Weekly digest sent to <span className="text-gray-200">{email}</span> every Monday when
          any of your watched startups cross a signal threshold.
        </p>
        <div className="flex items-center gap-2 text-emerald-400 text-sm">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          Alerts active for {items.length} {items.length === 1 ? "company" : "companies"}
        </div>
      </div>
    </div>
  );
}
