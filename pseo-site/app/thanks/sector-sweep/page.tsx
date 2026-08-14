import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import TelegramCTA from "@/components/TelegramCTA";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Sector Sweep commissioned. Reply with your thesis.",
  description:
    "Founder-written onboarding for Custom Sector Sweep buyers. Three things to send so the deliverable is sharp.",
  alternates: { canonical: "/thanks/sector-sweep" },
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: 1,
    label: "Reply to your welcome email with three things",
    detail:
      "(1) The sector or thesis you want the Sweep written against. Be specific, 'AI infra' is too broad; 'AI inference observability + GPU monitoring' is sharp. (2) Three companies you'd want a deep-dive on regardless. (3) Three companies you're comparing against (these become the comparative anchor in the report).",
  },
  {
    n: 2,
    label: "Send any private intel you'd want factored in (optional)",
    detail:
      "If you have non-public context, companies you've passed on, founders you've met, sub-theses you're testing, share it. Goes into the founder's private notes only, never published, never quoted. It just makes the Sweep sharper.",
  },
  {
    n: 3,
    label: "Block 60 minutes for the deliverable in 5 to 10 days",
    detail:
      "The Sweep ships in five business days for sectors we already track and ten for sectors that need fresh data ingestion. You'll get the PDF, the raw CSV, diligence prompts for the top-10 startups, and three pre-Crunchbase breakouts. Plus a 14-day async Q&A window built in.",
  },
] as const;

export default function ThanksSweep() {
  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/thanks/sector-sweep"
        languages={getHreflangLanguages("/thanks/sector-sweep")}
      />
      <AgentMirrorLinks path="/thanks/sector-sweep" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Payment confirmed · Custom Sector Sweep commissioned
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Sweep is on the build queue.
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Stripe receipt is in your inbox. The deliverable is custom, the
            sharper your thesis brief, the sharper the Sweep. Three things to
            send in the next 24 hours.
          </p>
        </header>

        <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5 sm:p-6 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Best next move while the Sweep is being built
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Do not leave this as a receipt page. While the custom report is in progress, the best use of your time is to sharpen the proof and the buyer-side framework that will help you use the Sweep well when it arrives.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/research" className="text-amber-200 hover:text-amber-100 underline underline-offset-2">
              Read the research panel
            </Link>
            <Link href="/buyers-guide" className="text-amber-200 hover:text-amber-100 underline underline-offset-2">
              Read the buyer's guide
            </Link>
            <Link href="/answers/when-should-i-use-dashboard-vs-insider" className="text-amber-200 hover:text-amber-100 underline underline-offset-2">
              Decide if Insider is next
            </Link>
          </div>
        </section>

        <ol className="space-y-4">
          {STEPS.map((s) => (
            <li
              key={s.n}
              className="flex items-start gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-5"
            >
              <span
                aria-hidden="true"
                className="shrink-0 w-8 h-8 rounded-full bg-amber-600/20 border border-amber-500/40 text-amber-200 text-base font-bold flex items-center justify-center"
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

        <section className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Insider Circle credit
          </p>
          <p className="text-gray-200 text-base leading-relaxed">
            The €1,997 you paid credits 1:1 toward Insider Circle if you
            upgrade within 60 days of receiving the Sweep. That&rsquo;s
            roughly 20 months of Insider, prepaid, with the Sweep on top.
            Most Sweep buyers upgrade within the first three weeks because
            the Sweep itself surfaces the watchlist they then want monitored.
          </p>
          <p>
            <Link
              href="/pricing"
              className="text-sky-400 hover:text-sky-300 text-sm underline decoration-dotted"
            >
              See the Insider Circle stack →
            </Link>
          </p>
        </section>

        {/* Brunson TS §3 Ch 11, Sweep buyers wait 5-10 business days for
            delivery. The public Telegram pinned during that window keeps
            the signal-rhythm alive between purchase and delivery. */}
        <TelegramCTA tone="amber" context="post-purchase" />

        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 space-y-2">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            30-day Signal-or-It&rsquo;s-Free guarantee
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If, in the first 30 days after delivery, the Sweep doesn&rsquo;t
            surface three orgs you didn&rsquo;t already know about, reply{" "}
            <code className="text-amber-200 bg-amber-900/40 px-1.5 py-0.5 rounded text-xs">
              REFUND
            </code>{" "}
            to any email and the full €1,997 is refunded inside two business
            days. No forms, no exit interview, no &ldquo;wait, let me show
            you one more cut.&rdquo;
          </p>
        </section>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
