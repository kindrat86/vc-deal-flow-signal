import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "You're in the Insider Circle.",
  description:
    "Founder-written onboarding for Insider Circle members. Telegram invitation, API key generation, and the rhythm.",
  alternates: { canonical: "/thanks/insider" },
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: 1,
    label: "Watch your inbox for the private Telegram invitation",
    detail:
      "Sent within four business hours, manually by the founder, to the email on your Stripe receipt. The Telegram group is small (under 80 investors at any time) and stays that way — the value is signal density, not vanity numbers.",
  },
  {
    n: 2,
    label: "Generate your API key",
    detail:
      "Log in at https://signals.gitdealflow.com/dashboard/api-keys and click Generate. The key is rate-limited at 60 requests per minute and returns the same JSON shape as the public dataset, plus the deeper enrichment fields (signal classification, contributor delta, repo count).",
  },
  {
    n: 3,
    label: "Tell the founder what to alert you on",
    detail:
      "Reply to your welcome email with the sectors, stages, or companies you want spike alerts on. Slack or Telegram, your pick. Alerts are calibrated weekly so you don't get paged for noise — alpha thresholds are tunable per investor.",
  },
] as const;

export default function ThanksInsider() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/thanks/insider"
        languages={getHreflangLanguages("/thanks/insider")}
      />
      <AgentMirrorLinks path="/thanks/insider" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Payment confirmed · Welcome to the Insider Circle
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            You&rsquo;re in. €97/mo founder price, locked forever.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            The Insider Circle is small by design. Three things to set up in
            the next thirty minutes that turn the subscription into a
            standing rhythm — written by the founder, not a bot.
          </p>
        </header>

        <ol className="space-y-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex items-start gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-5"
            >
              <span
                aria-hidden="true"
                className="shrink-0 w-8 h-8 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-300 text-base font-bold flex items-center justify-center"
              >
                {s.n}
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-gray-100 font-semibold text-base mb-1">
                  {s.label}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">{s.detail}</p>
              </div>
            </li>
          ))}
        </ol>

        <section className="bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Founder note
          </p>
          <p className="text-gray-200 text-base leading-relaxed">
            The Insider tier is the closest thing this product has to a
            standing meeting with the founder. Use the Telegram group like
            you&rsquo;d use a Slack DM with a co-investor — ask about a
            specific org, request a re-rank against your portfolio, surface a
            competitor for cross-check. Reply within 24 hours is the norm.
          </p>
          <p className="text-gray-300 text-sm">
            30-day Signal-or-It&rsquo;s-Free guarantee applies. Reply{" "}
            <code className="text-sky-200 bg-sky-900/40 px-1.5 py-0.5 rounded text-xs">
              REFUND
            </code>{" "}
            to any email if it doesn&rsquo;t deliver.
          </p>
        </section>

        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-2">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            What unlocks at the Sharp Tier (€497/mo, application-gated)
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            White-labeled API on your fund&rsquo;s subdomain, custom
            watchlists rebuilt monthly, methodology source code, and a
            60-minute quarterly review call with the founder. Capped at 8
            funds in 2026. Insider monthly fee credits 1:1 toward the first
            month of Sharp on upgrade.
          </p>
          <p className="pt-2">
            <Link
              href="/apply"
              className="text-purple-300 hover:text-purple-200 text-sm underline decoration-dotted"
            >
              Apply for Sharp Tier →
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
