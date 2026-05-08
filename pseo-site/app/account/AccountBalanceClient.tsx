"use client";

import { useState } from "react";
import Link from "next/link";

const STRIPE_LINK =
  process.env.NEXT_PUBLIC_STRIPE_AGENT_CREDITS_LINK ??
  "https://signals.gitdealflow.com/agents/credits";

interface CreditState {
  balance: number;
  purchased: number;
  consumed: number;
  lastConsumedAt: string | null;
  purchaseUrl: string;
}

export default function AccountBalanceClient() {
  const [apiKey, setApiKey] = useState("");
  const [state, setState] = useState<CreditState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function check(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setState(null);
    setLoading(true);
    try {
      const trimmed = apiKey.trim();
      if (!trimmed.startsWith("gdf_v2.")) {
        setError(
          "API key should look like gdf_v2.cus_xxxxx.<hmac>. Paste the value from your purchase confirmation email."
        );
        return;
      }
      const res = await fetch("/api/account/credits", {
        headers: { Authorization: `Bearer ${trimmed}` },
        cache: "no-store",
      });
      const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
      if (res.status === 401) {
        setError(
          (data.message as string) ??
            "API key did not validate. Re-check the value from your purchase confirmation email."
        );
        return;
      }
      if (!res.ok) {
        setError(`HTTP ${res.status}: ${data.error ?? "unknown error"}`);
        return;
      }
      setState(data as unknown as CreditState);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <article className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-gray-300 transition-colors">
          All Sectors
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-400">Account</span>
      </nav>

      <header className="mb-8">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-3 font-semibold">
          Agent credits · Balance check
        </p>
        <h1 className="text-3xl font-bold text-gray-100 mb-3 leading-tight">
          Check your credit balance
        </h1>
        <p className="text-gray-400 text-base leading-relaxed">
          Paste the API key from your{" "}
          <em className="text-gray-300">Agent Credits</em> purchase
          confirmation email. Same data as{" "}
          <code className="text-emerald-400 font-mono text-sm">
            GET /api/account/credits
          </code>
          , just rendered.
        </p>
      </header>

      <form onSubmit={check} className="mb-8">
        <label
          htmlFor="apikey"
          className="block text-gray-200 text-sm font-medium mb-2"
        >
          API key
        </label>
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            id="apikey"
            type="text"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="gdf_v2.cus_xxxxxxxxxxxxxx.xxxxxxxxxxxxxxxx"
            spellCheck={false}
            autoComplete="off"
            className="flex-1 h-11 rounded-lg border border-slate-700 bg-slate-950 px-4 text-sm text-gray-100 font-mono placeholder:text-gray-400 focus:border-sky-500 focus:ring-2 focus:ring-sky-500/30 focus:outline-none transition-colors"
          />
          <button
            type="submit"
            disabled={loading || apiKey.length < 10}
            className="inline-flex items-center justify-center gap-1.5 h-11 px-5 rounded-lg bg-sky-600 hover:bg-sky-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors shadow-sm shadow-sky-500/30"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                Checking…
              </>
            ) : (
              "Check balance"
            )}
          </button>
        </div>
        <p className="text-gray-400 text-xs mt-2">
          Your key is sent only to{" "}
          <code className="font-mono text-gray-400">/api/account/credits</code>{" "}
          on this domain. Nothing is stored client-side.
        </p>
      </form>

      {error && (
        <div role="alert" className="rounded-lg border border-red-500/30 bg-red-500/5 p-4 mb-6">
          <p className="text-red-300 text-sm">{error}</p>
        </div>
      )}

      {state && (
        <div className="rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/10 to-slate-900 p-6 mb-6 shadow-lg shadow-emerald-500/10">
          <div className="flex items-baseline justify-between mb-1">
            <p className="text-emerald-400 text-xs uppercase tracking-wider font-semibold">
              Current balance
            </p>
            <span className="text-emerald-400 text-xs font-mono">
              ≈ €{(state.balance * 0.19).toFixed(2)}
            </span>
          </div>
          <p className="text-5xl sm:text-6xl font-bold text-gray-100 mb-1 tabular-nums tracking-tight">
            {state.balance}
          </p>
          <p className="text-gray-400 text-sm mb-5">
            credit{state.balance === 1 ? "" : "s"} remaining
          </p>
          <dl className="grid grid-cols-2 gap-4 text-sm border-t border-emerald-900/40 pt-4">
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wider">Lifetime purchased</dt>
              <dd className="text-gray-100 font-mono mt-1 text-base tabular-nums">{state.purchased}</dd>
            </div>
            <div>
              <dt className="text-gray-400 text-xs uppercase tracking-wider">Lifetime consumed</dt>
              <dd className="text-gray-100 font-mono mt-1 text-base tabular-nums">{state.consumed}</dd>
            </div>
            <div className="col-span-2">
              <dt className="text-gray-400 text-xs uppercase tracking-wider">Last call</dt>
              <dd className="text-gray-300 font-mono mt-1 text-xs">
                {state.lastConsumedAt ?? "never"}
              </dd>
            </div>
          </dl>
          {state.balance < 20 && (
            <div className="mt-5 pt-4 border-t border-emerald-900/40">
              <p className="text-amber-300 text-sm mb-3 inline-flex items-center gap-1.5">
                <span aria-hidden="true">⚠️</span>
                Balance running low — top up before the next batch.
              </p>
              <Link
                href={STRIPE_LINK}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-semibold transition-colors shadow-sm shadow-amber-500/30"
              >
                Top up — €19 / 100 credits
                <span aria-hidden="true">→</span>
              </Link>
            </div>
          )}
        </div>
      )}

      <section className="mt-10 rounded-lg border border-slate-800 bg-slate-900/40 p-5">
        <h2 className="text-gray-100 font-semibold text-sm mb-3">
          Prefer the command line?
        </h2>
        <pre className="bg-slate-950 border border-slate-800 rounded p-3 text-xs text-emerald-300 font-mono overflow-x-auto whitespace-pre">
{`curl https://signals.gitdealflow.com/api/account/credits \\
  -H "Authorization: Bearer gdf_v2.cus_xxx.<your_hmac>"`}
        </pre>
      </section>

      <div className="mt-8 flex flex-wrap gap-3 text-sm">
        <Link
          href="/agents/credits"
          className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
        >
          Buy credits →
        </Link>
        <span className="text-gray-600">·</span>
        <Link
          href="/agents"
          className="text-sky-400 hover:text-sky-300 underline-offset-2 hover:underline"
        >
          All agent surfaces
        </Link>
      </div>
    </article>
  );
}
