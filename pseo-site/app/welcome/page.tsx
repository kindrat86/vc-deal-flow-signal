import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { withEditorialOverride } from "@/lib/metadata";

export const metadata: Metadata = withEditorialOverride({
  title: "Welcome",
  robots: { index: false },
});

export default async function WelcomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const isInsider = session.tier === "insider";

  return (
    <div className="relative max-w-2xl mx-auto px-6 py-16 brand-glow">
      {/* Tier badge */}
      <div className="mb-6">
        <span
          className={`inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
            isInsider
              ? "bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-sm shadow-amber-500/20"
              : "bg-sky-500/15 text-sky-300 border border-sky-500/40 shadow-sm shadow-sky-500/20"
          }`}
        >
          <span aria-hidden="true">{isInsider ? "★" : "●"}</span>
          {isInsider ? "Insider Circle" : "Dashboard Beta"}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 tracking-tight leading-tight">
        {isInsider ? "Welcome to the Insider Circle" : "Your Dashboard is ready"}
      </h1>

      <p className="text-gray-400 text-base mb-2">
        Logged in as <span className="text-gray-100 font-medium">{session.email}</span>
      </p>

      <p className="inline-flex items-center gap-1.5 mb-10 rounded-md border border-emerald-700/40 bg-emerald-950/30 px-3 py-1.5 text-emerald-300 text-sm font-medium">
        <span aria-hidden="true">🔒</span>
        {isInsider
          ? "Insider at €197/mo (the €97 founding rate closed 2026-06-30)."
          : "Dashboard at €49/mo (the €9.97 founding rate closed 2026-06-30)."}
      </p>

      {/* What's included */}
      <div className="rounded-xl border border-slate-700 bg-slate-900/60 backdrop-blur-sm p-6 sm:p-7 mb-6 shadow-lg shadow-slate-950/40">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          What&apos;s included
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-gray-300">
            <CheckIcon className="text-sky-400" />
            <span>
              <strong className="text-gray-100">Full Dashboard</strong>: 100+
              startups ranked by engineering acceleration across 15 sectors
            </span>
          </li>
          <li className="flex items-start gap-3 text-gray-300">
            <CheckIcon className="text-sky-400" />
            <span>
              <strong className="text-gray-100">Filters</strong>: sector,
              stage, geography, and signal type
            </span>
          </li>
          <li className="flex items-start gap-3 text-gray-300">
            <CheckIcon className="text-sky-400" />
            <span>
              <strong className="text-gray-100">Weekly updates</strong>: fresh
              GitHub data every Monday
            </span>
          </li>
          {isInsider && (
            <>
              <li className="flex items-start gap-3 text-gray-300">
                <CheckIcon className="text-amber-400" />
                <span>
                  <strong className="text-gray-100">
                    Private Telegram group
                  </strong>{" "}
direct discussion with other data-driven investors
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <CheckIcon className="text-amber-400" />
                <span>
                  <strong className="text-gray-100">
                    Monthly signal briefing
                  </strong>{" "}
live call covering the strongest signals
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <CheckIcon className="text-amber-400" />
                <span>
                  <strong className="text-gray-100">
                    Custom watchlists + API access
                  </strong>
                </span>
              </li>
            </>
          )}
        </ul>
      </div>

      {/* Dashboard → Insider upsell (Dashboard tier only) */}
      {!isInsider && (
        <div className="rounded-xl border border-amber-500/30 bg-amber-950/15 p-6 sm:p-7 mb-6">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider mb-2">
            Optional upgrade
          </p>
          <h2 className="text-lg font-semibold text-gray-100 mb-2">
            Want the same ranked list 24 hours earlier?
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed mb-4">
            The Insider Circle gets the weekly list a day ahead of the Dashboard,
            plus the private investor room. No code required, same list, more
            lead time. €197/mo.
          </p>
          <Link
            href="/insider"
            className="inline-flex items-center gap-1.5 text-amber-300 hover:text-amber-200 text-sm font-semibold transition-colors"
          >
            See the Insider Circle <span aria-hidden="true">→</span>
          </Link>
        </div>
      )}

      {/* Next steps */}
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 sm:p-7 mb-10">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Your next steps
        </h2>
        <ol className="space-y-4 text-gray-300 text-sm">
          {[
            <>
              <Link
                href="/dashboard"
                className="text-sky-400 hover:text-sky-300 font-medium transition-colors"
              >
                Open the Dashboard
              </Link>{" "}
browse startups, filter by what matters to you
            </>,
            ...(isInsider
              ? [
                  <>
                    <strong className="text-gray-100">
                      Join the private Telegram group
                    </strong>{" "}
check your welcome email for the invite link
                  </>,
                ]
              : []),
            <>
              <strong className="text-gray-100">
                Reply to the welcome email
              </strong>{" "}
tell me what sectors and stages you invest in
            </>,
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span
                className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-slate-800 text-gray-300 text-xs font-semibold tabular-nums"
                aria-hidden="true"
              >
                {i + 1}
              </span>
              <span className="leading-relaxed">{item}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center gap-1.5 bg-signal-500 hover:bg-signal-600 text-slate-950 font-semibold px-7 py-3 rounded-lg text-base transition-colors shadow-sm shadow-signal-500/30"
        >
          Go to Dashboard
          <span aria-hidden="true">→</span>
        </Link>
        <Link
          href="https://t.me/gitdealflow"
          className="inline-flex items-center justify-center border border-slate-700 hover:border-slate-500 hover:bg-slate-800/40 text-gray-300 hover:text-white font-medium px-7 py-3 rounded-lg transition-colors"
        >
          Free Telegram Channel
        </Link>
      </div>

      <DataNerdSignoff variant="compact" className="mt-8" />
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-5 w-5 mt-0.5 shrink-0 ${className}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path
        fillRule="evenodd"
        d="M16.704 5.29a1 1 0 0 1 .006 1.414l-7.5 7.6a1 1 0 0 1-1.42.006l-3.5-3.5a1 1 0 1 1 1.414-1.414l2.79 2.79 6.793-6.89a1 1 0 0 1 1.417-.006Z"
        clipRule="evenodd"
      />
    </svg>
  );
}
