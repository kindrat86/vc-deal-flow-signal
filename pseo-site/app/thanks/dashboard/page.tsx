import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import TelegramCTA from "@/components/TelegramCTA";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "You're in. Welcome to the Dashboard.",
  description:
    "Three things to do in the next ten minutes that double the value of your subscription. Founder-written onboarding for Dashboard Beta members.",
  alternates: { canonical: "/thanks/dashboard" },
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: 1,
    label: "Bookmark the Dashboard",
    detail:
      "https://signals.gitdealflow.com, log in with the email on your Stripe receipt. The magic link in your inbox lasts 30 days. Bookmark it now so the Monday rhythm starts on Monday.",
  },
  {
    n: 2,
    label: "Install the free MCP server in Claude or Cursor",
    detail:
      "Run npx @gitdealflow/mcp-signal once and add it to your MCP host config. From then on you can ask 'which AI infra startups are accelerating this week' in any chat. Every Dashboard member gets the MCP free, never gated.",
  },
  {
    n: 3,
    label: "Pick the sector for your first Sector Deep-Dive PDF",
    detail:
      "Reply to your welcome email with the sector you want first. PDFs ship monthly, the first one within seven days. If you don't pick, the founder picks based on what's hottest in your thesis and you can swap next month.",
  },
] as const;

export default function ThanksDashboard() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/thanks/dashboard"
        languages={getHreflangLanguages("/thanks/dashboard")}
      />
      <AgentMirrorLinks path="/thanks/dashboard" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Payment confirmed · Welcome to the Dashboard
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            You&rsquo;re in. €9.97/mo, locked forever.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            The receipt is in your inbox. So is a magic-link login. Three
            things to do in the next ten minutes that double the value of
            your first month, written by the founder, not a bot.
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
                className="shrink-0 w-8 h-8 rounded-full bg-emerald-600/20 border border-emerald-500/40 text-emerald-300 text-base font-bold flex items-center justify-center"
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

        <section className="bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 border border-emerald-700/40 rounded-xl p-6 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Founder note
          </p>
          <p className="text-gray-200 text-base leading-relaxed">
            Reply to any email with the word{" "}
            <code className="text-emerald-200 bg-emerald-900/40 px-1.5 py-0.5 rounded text-xs">REFUND</code>
            {" "}within 30 days if the signal doesn&rsquo;t surface a startup
            you find genuinely interesting. Two-business-day refund, no forms,
            no exit interview. The guarantee exists because the signal either
            works or it doesn&rsquo;t, and charging for an output you
            don&rsquo;t find useful is bad business.
          </p>
        </section>

        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Best next move this week
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Do not leave this as a receipt page. If you want to get value fast, use one page to understand the signal better and one page to decide whether you eventually need the higher-touch layer.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/research" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Read the research panel
            </Link>
            <Link href="/answers/when-should-i-use-dashboard-vs-insider" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Decide if Dashboard is enough
            </Link>
            <Link href="/buyers-guide" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Read the buyer's guide
            </Link>
          </div>
        </section>

        {/* Brunson TS §3 Ch 11, Dashboard buyers already get email; the
            channel is the second pipe. Sits AFTER the founder note and
            BEFORE the next-tier mention so it reads as a useful free
            add-on, not a competing offer to Insider. */}
        <TelegramCTA tone="emerald" context="post-purchase" />

        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-2">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            What unlocks at €197/mo (Insider Circle)
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Private investor Telegram, monthly live briefings, Slack/Telegram
            spike alerts, JSON/CSV API access, and quarterly trend briefings.
            Two months in the Dashboard is enough to know if Insider would
            pay for itself. No upgrade pressure, the Acceleration Watch
            email mentions the doors when they&rsquo;re relevant.
          </p>
          <p className="pt-2">
            <Link
              href="/pricing"
              className="text-sky-400 hover:text-sky-300 text-sm underline decoration-dotted"
            >
              See the Insider Circle stack →
            </Link>
          </p>
        </section>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
