import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { SUMMIT, summitDays } from "@/content/summit";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "You're in — VC Engineering Acceleration Summit",
  description:
    "Your Free Pass is reserved. Check your inbox to confirm, then watch for one email per day during the live window with the talk that just unlocked.",
  alternates: { canonical: "/summit/thanks" },
  robots: { index: false, follow: true },
};

export default function SummitThanksPage() {
  const days = summitDays();

  return (
    <>
      <AgentMirrorLinks path="/summit/thanks" />
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-10">
        <header className="space-y-4 text-center">
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            You're in
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-tight">
            Free Pass reserved. Check your inbox to confirm.
          </h1>
          <p className="text-gray-300 leading-relaxed">
            We'll send one email per day during the summit telling you which
            talk just unlocked. Each talk is free for 24 hours after it airs.
            After that, talks live behind the All-Access Pass.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 space-y-3">
          <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
            Your schedule
          </h2>
          <ul className="space-y-2 text-sm">
            {days.map((d) => (
              <li key={d.day} className="flex items-baseline justify-between gap-3 border-b border-slate-800/60 last:border-b-0 pb-2 last:pb-0">
                <span className="text-gray-200">{d.caption}</span>
                <span className="text-gray-400 font-mono text-xs">{d.date}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* OTO — All-Access Pass */}
        <section className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Skip the wait — get All-Access now
          </p>
          <h2 className="text-xl font-bold text-gray-100">
            Want every talk now, plus lifetime replays?
          </h2>
          <p className="text-sm text-gray-300 leading-relaxed">
            The All-Access Pass unlocks all 20 talks immediately, plus every
            transcript, every slide deck, and the 219-startup backtest CSV.
            One payment of €{SUMMIT.allAccessPrice}, lifetime access, 30-day
            refund. Most attendees who go All-Access do it before Day 1
            airs because the transcripts alone are worth the price.
          </p>
          <Link
            href="/summit/all-access"
            className="inline-block rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-5 py-3 transition-colors"
          >
            Get All-Access Pass — €{SUMMIT.allAccessPrice} →
          </Link>
        </section>

        <section className="space-y-3">
          <h2 className="text-sm text-gray-400 font-semibold uppercase tracking-wider">
            While you wait
          </h2>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/manifesto" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Read the manifesto
              </Link>{" "}
              — the seven pillars and the named enemy.
            </li>
            <li>
              <Link href="/walkthrough" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                12-minute walkthrough
              </Link>{" "}
              — the core claim, written.
            </li>
            <li>
              <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Methodology
              </Link>{" "}
              — every signal definition, decision rule, and pitfall.
            </li>
            <li>
              <Link href="/firstlook" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                €7 First Look
              </Link>{" "}
              — pick a sector, get a deep-dive in 24 hours.
            </li>
          </ul>
        </section>

        <DataNerdSignoff variant="compact" className="mt-8" />
      </div>
    </>
  );
}
