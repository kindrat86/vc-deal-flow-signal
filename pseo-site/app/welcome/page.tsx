import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Welcome — VC Deal Flow Signal",
  robots: { index: false },
};

export default async function WelcomePage() {
  const session = await getSession();

  if (!session) {
    redirect("/");
  }

  const isInsider = session.tier === "insider";

  return (
    <div className="max-w-2xl mx-auto px-6 py-20">
      {/* Tier badge */}
      <div className="mb-6">
        <span
          className={`inline-block text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-full ${
            isInsider
              ? "bg-amber-500/15 text-amber-300 border border-amber-500/30"
              : "bg-sky-500/15 text-sky-300 border border-sky-500/30"
          }`}
        >
          {isInsider ? "Insider Circle" : "Dashboard Beta"}
        </span>
      </div>

      <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4">
        {isInsider ? "Welcome to the Insider Circle" : "Your Dashboard is ready"}
      </h1>

      <p className="text-gray-400 text-lg mb-2">
        Logged in as <span className="text-gray-200">{session.email}</span>
      </p>

      <p className="text-emerald-400 text-sm font-medium mb-10">
        {isInsider
          ? "Your beta price of \u20AC97/mo is locked in forever."
          : "Your early access price of \u20AC9.97/mo is locked in forever."}
      </p>

      {/* What's included */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-8">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          What&apos;s included
        </h2>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-gray-300">
            <span className="text-sky-500 mt-0.5">&#10003;</span>
            <span>
              <strong className="text-gray-100">Full Dashboard</strong> — 100+
              startups ranked by engineering acceleration across 20 sectors
            </span>
          </li>
          <li className="flex items-start gap-3 text-gray-300">
            <span className="text-sky-500 mt-0.5">&#10003;</span>
            <span>
              <strong className="text-gray-100">Filters</strong> — sector,
              stage, geography, and signal type
            </span>
          </li>
          <li className="flex items-start gap-3 text-gray-300">
            <span className="text-sky-500 mt-0.5">&#10003;</span>
            <span>
              <strong className="text-gray-100">Weekly updates</strong> — fresh
              GitHub data every Monday
            </span>
          </li>
          {isInsider && (
            <>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-amber-500 mt-0.5">&#10003;</span>
                <span>
                  <strong className="text-gray-100">
                    Private Telegram group
                  </strong>{" "}
                  — direct discussion with other data-driven investors
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-amber-500 mt-0.5">&#10003;</span>
                <span>
                  <strong className="text-gray-100">
                    Monthly signal briefing
                  </strong>{" "}
                  — live call covering the strongest signals
                </span>
              </li>
              <li className="flex items-start gap-3 text-gray-300">
                <span className="text-amber-500 mt-0.5">&#10003;</span>
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

      {/* Next steps */}
      <div className="rounded-xl border border-slate-700 bg-slate-900 p-6 mb-10">
        <h2 className="text-lg font-semibold text-gray-100 mb-4">
          Your next steps
        </h2>
        <ol className="space-y-4 list-decimal list-inside text-gray-300">
          <li>
            <Link
              href="/dashboard"
              className="text-sky-400 hover:text-sky-300 font-medium"
            >
              Open the Dashboard
            </Link>{" "}
            — browse startups, filter by what matters to you
          </li>
          {isInsider && (
            <li>
              <strong className="text-gray-100">
                Join the private Telegram group
              </strong>{" "}
              — check your welcome email for the invite link
            </li>
          )}
          <li>
            <strong className="text-gray-100">Reply to the welcome email</strong>{" "}
            — tell me what sectors and stages you invest in
          </li>
        </ol>
      </div>

      {/* CTA */}
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          href="/dashboard"
          className="inline-flex items-center justify-center bg-sky-600 hover:bg-sky-700 text-white font-semibold px-8 py-3 rounded-lg text-lg transition"
        >
          Go to Dashboard
        </Link>
        <Link
          href="https://t.me/gitdealflow"
          className="inline-flex items-center justify-center border border-slate-600 hover:border-slate-400 text-gray-300 hover:text-white font-medium px-8 py-3 rounded-lg transition"
        >
          Free Telegram Channel
        </Link>
      </div>
    </div>
  );
}
