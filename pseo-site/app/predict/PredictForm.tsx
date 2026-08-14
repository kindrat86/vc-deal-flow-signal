"use client";

import { useState, useEffect, useCallback } from "react";

interface SignalResult {
  status: "accelerating" | "steady" | "decelerating" | "no_data";
  name?: string;
  commitVelocity14d?: number;
  velocityChange?: string;
  contributors?: number;
  contributorGrowth?: string;
  signalType?: string;
  stage?: string;
  geography?: string;
  websiteUrl?: string;
  sectorUrl?: string;
  cta?: string;
}

interface ShareIntents {
  twitterIntent: string;
  linkedinIntent: string;
}

async function fetchShareIntents(org: string, result: SignalResult): Promise<ShareIntents | null> {
  const labelByStatus: Record<SignalResult["status"], string> = {
    accelerating: "ACCELERATING",
    steady: "STEADY",
    decelerating: "DECELERATING",
    no_data: "UNTRACKED",
  };
  const status = labelByStatus[result.status];
  const text =
    result.status === "no_data"
      ? `Just looked up ${org} on @sipiteno's GitDealFlow. Not in the index yet. The 7-day preview shows this week's actual breakouts:`
      : `${org} on GitDealFlow: ${status}${result.velocityChange ? ` (${result.velocityChange} velocity)` : ""}. Recipient gets a 7-day extended preview of the live signal index:`;
  try {
    const res = await fetch("/api/share/mint", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ kind: "signal-card", sharer: org.slice(0, 40), text }),
    });
    if (!res.ok) return null;
    return (await res.json()) as ShareIntents;
  } catch {
    return null;
  }
}

const STATUS_STYLES: Record<
  SignalResult["status"],
  { label: string; bg: string; pill: string; msg: string }
> = {
  accelerating: {
    label: "Accelerating",
    bg: "bg-emerald-500/10 border-emerald-500/40",
    pill: "bg-emerald-500/20 text-emerald-300",
    msg: "Strong breakout signal. Historical lead time on fundraises: 3-6 weeks.",
  },
  steady: {
    label: "Steady",
    bg: "bg-amber-500/10 border-amber-500/40",
    pill: "bg-amber-500/20 text-amber-300",
    msg: "Healthy baseline. No acceleration signal yet, but worth watching.",
  },
  decelerating: {
    label: "Decelerating",
    bg: "bg-rose-500/10 border-rose-500/40",
    pill: "bg-rose-500/20 text-rose-300",
    msg: "Engineering momentum cooling. Worth asking the team why.",
  },
  no_data: {
    label: "Not in our index yet",
    bg: "bg-slate-800 border-slate-700",
    pill: "bg-slate-700 text-gray-300",
    msg: "We track ~369 venture-backed startup orgs. Submit this one to add it to next week's index.",
  },
};

function normalize(input: string) {
  return input
    .replace(/^https?:\/\/(www\.)?github\.com\//i, "")
    .replace(/\/.*$/, "")
    .trim();
}

export default function PredictForm({ initialOrg }: { initialOrg: string }) {
  const [org, setOrg] = useState(initialOrg);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SignalResult | null>(null);
  const [shareIntents, setShareIntents] = useState<ShareIntents | null>(null);
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (name: string) => {
    if (!name) return;
    setLoading(true);
    setError(null);
    setResult(null);
    setShareIntents(null);
    try {
      const res = await fetch(
        `/api/signal?company=${encodeURIComponent(name)}`
      );
      if (!res.ok) throw new Error(`Lookup failed (${res.status})`);
      const data: SignalResult = await res.json();
      setResult(data);
      // Fire-and-forget share-intent mint — share buttons appear when ready.
      fetchShareIntents(name, data).then(setShareIntents);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Lookup failed");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (initialOrg) lookup(initialOrg);
  }, [initialOrg, lookup]);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const name = normalize(org);
    setOrg(name);
    lookup(name);
  }

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
        <input
          type="text"
          value={org}
          onChange={(e) => setOrg(e.target.value)}
          placeholder="e.g. supabase  or  github.com/vercel"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 rounded-lg border border-slate-700 bg-slate-900 px-4 py-3 text-gray-100 placeholder-gray-600 focus:outline-none focus:border-sky-500 transition-colors"
        />
        <button
          type="submit"
          disabled={loading || !org.trim()}
          className="rounded-lg bg-sky-700 hover:bg-sky-600 disabled:bg-slate-700 disabled:text-gray-400 text-white px-6 py-3 text-sm font-medium transition-colors whitespace-nowrap"
        >
          {loading ? "Reading GitHub..." : "Get the signal →"}
        </button>
      </form>

      {error && (
        <div className="mt-4 rounded-lg border border-rose-500/40 bg-rose-500/10 p-4 text-sm text-rose-300">
          {error}
        </div>
      )}

      {result && (
        <ResultCard result={result} fallbackName={normalize(org)} shareIntents={shareIntents} />
      )}

      <p className="mt-3 text-xs text-gray-400">
        Free. No signup. Powered by gitdealflow.com weekly engineering signal
        index.
      </p>
    </div>
  );
}

function ResultCard({
  result,
  fallbackName,
  shareIntents,
}: {
  result: SignalResult;
  fallbackName: string;
  shareIntents: ShareIntents | null;
}) {
  const style = STATUS_STYLES[result.status];
  return (
    <div className={`mt-4 rounded-xl border ${style.bg} p-5`}>
      <div className="flex items-baseline justify-between mb-3 flex-wrap gap-2">
        <h3 className="text-gray-100 font-semibold text-lg">
          {result.name || fallbackName}
        </h3>
        <span
          className={`text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${style.pill}`}
        >
          {style.label}
        </span>
      </div>

      {result.status !== "no_data" && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
          <Stat label="Velocity Δ" value={result.velocityChange} />
          <Stat
            label="Commits (14d)"
            value={
              result.commitVelocity14d != null
                ? String(result.commitVelocity14d)
                : "—"
            }
          />
          <Stat
            label="Contributors"
            value={
              result.contributors != null
                ? `${result.contributors} (${result.contributorGrowth ?? "—"})`
                : "—"
            }
          />
          <Stat label="Stage" value={result.stage ?? "—"} />
        </div>
      )}

      <p className="text-sm text-gray-300 mb-4">{style.msg}</p>

      {result.status !== "no_data" && (
        <p className="text-xs text-gray-400">
          Signal type:{" "}
          <span className="text-gray-300">{result.signalType}</span>
          {result.sectorUrl && (
            <>
              {" · "}
              <a
                href={result.sectorUrl}
                className="text-sky-400 hover:text-sky-300 underline"
              >
                See full sector ranking →
              </a>
            </>
          )}
        </p>
      )}

      {result.status === "no_data" && (
        <a
          href="https://gitdealflow.com/#signup"
          className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-xs font-medium transition-colors"
        >
          Submit + get the weekly index →
        </a>
      )}

      {result.status === "accelerating" && (
        <div className="mt-4 pt-4 border-t border-emerald-500/20">
          <p className="text-xs text-gray-400 mb-2">
            Get the weekly free report covering startups like this one:
          </p>
          <a
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-medium transition-colors"
          >
            Subscribe free → 5 breakouts/week
          </a>
        </div>
      )}

      {shareIntents && result.status !== "no_data" && (
        <div className="mt-4 pt-4 border-t border-slate-700/40">
          <p className="text-xs text-gray-400 mb-2">
            Recipient gets a 7-day extended preview of the live signal index:
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={shareIntents.twitterIntent}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800/50 text-xs text-gray-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              Share on X
            </a>
            <a
              href={shareIntents.linkedinIntent}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-3 py-1.5 rounded-md border border-slate-700 bg-slate-800/50 text-xs text-gray-300 hover:text-sky-400 hover:border-sky-500/40 transition-colors"
            >
              Share on LinkedIn
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <p className="text-[10px] text-gray-400 uppercase tracking-wider">
        {label}
      </p>
      <p className="text-gray-100 font-mono text-sm font-semibold">
        {value || "—"}
      </p>
    </div>
  );
}
