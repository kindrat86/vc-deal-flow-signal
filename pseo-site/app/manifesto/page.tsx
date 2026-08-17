import type { Metadata } from "next";
import Link from "next/link";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { DATA_NERD_TRIBE, DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import {
  EMOTIONAL_CAUSE_KICKER,
  EMOTIONAL_CAUSE_HEADLINE,
  EMOTIONAL_CAUSE_LINES,
} from "@/content/cause";
import { withEditorialOverride } from "@/lib/metadata";

export const metadata: Metadata = withEditorialOverride({
  title: "What GitDealFlow Believes, and What It Refuses to Become",
  description:
    "What GitDealFlow believes about timing, proof, and signal, and what it refuses to become while helping you move earlier with less noise.",
  alternates: { canonical: "/manifesto" },
  openGraph: {
    title: "What GitDealFlow believes",
    description:
      "A direct statement of what GitDealFlow is trying to protect: trust, timing, clarity, and a signal that can be checked in public.",
    url: "https://signals.gitdealflow.com/manifesto",
    type: "article",
  },
});

const BELIEFS = [
  "You should be able to verify the claim in public.",
  "You should get timing before you get theatre.",
  "You should not need a louder dashboard just to feel informed.",
  "A useful signal reduces second-guessing instead of multiplying tabs.",
  "The right weekly read should leave you clearer, not busier.",
] as const;

const REFUSALS = [
  "We will not hide weak proof behind stronger branding.",
  "We will not confuse more startup records with better timing.",
  "We will not force you into a heavy workflow before the signal earns your trust.",
  "We will not describe you from the outside when we can help you decide directly.",
] as const;

const PILLARS = [
  {
    title: "Proof before performance",
    body: "If the methodology cannot be checked, the claim is too expensive to trust. That is why the proof surface exists in public, not behind a sales process.",
  },
  {
    title: "Timing before volume",
    body: "A bigger list does not help if it arrives too late. The real edge is seeing what changed before the round starts feeling obvious.",
  },
  {
    title: "Clarity before complexity",
    body: "You should not need another heavy workflow just to get a better read. The signal should fit your week, not take it over.",
  },
  {
    title: "Signal before consensus",
    body: "The job is not to repeat what the market already knows. The job is to notice the public movement that matters before everyone starts citing the same company.",
  },
] as const;

export default function ManifestoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: "What GitDealFlow Believes, and What It Refuses to Become",
        description:
          "What GitDealFlow believes about timing, proof, and signal.",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/manifesto",
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/manifesto"
        languages={getHreflangLanguages("/manifesto")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/manifesto" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav aria-label="Breadcrumb" className="text-sm text-gray-400">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Manifesto</span>
        </nav>

        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            Manifesto
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.08] tracking-tight">
            You do not need another louder startup tool. You need a signal that stays honest when timing matters.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            This page is the shortest honest version of what GitDealFlow is trying to protect.
            If you care about earlier signal, public proof, and less noise, this should feel familiar.
            If you want hype, theatre, or a bigger pile of startup records, it probably won’t.
          </p>
        </header>

        <section className="rounded-xl border border-amber-700/30 bg-amber-950/20 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the highest-intent routes
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Use the manifesto when you want the belief system. But if your real question is proof, timing, or buyer-side fit, start with the sharper pages first.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/research" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-amber-500 text-slate-950 text-sm font-semibold hover:bg-amber-400 transition-colors">
              Read the research panel →
            </Link>
            <Link href="/compare/crunchbase-alternative-for-angel-investors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Compare timing vs verification →
            </Link>
            <Link href="/buyers-guide" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Read the buyer's guide →
            </Link>
          </div>
        </section>

        <section className="rounded-xl border border-rose-700/40 bg-gradient-to-br from-rose-950/25 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            What we are tired of
          </p>
          <p className="text-gray-100 text-lg leading-relaxed border-l-2 border-rose-500/60 pl-4 italic">
            Hearing about the company after the calm window is already gone.
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            That is the moment this whole product pushes against: when the story is already public,
            the databases are already updated, and you are being asked to react instead of notice.
          </p>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed border-l-2 border-rose-500/60 pl-4">
            So here is what we stand against, by name: the warm-intro funnel, where the best deals
            only flow to the people who can afford the right dinners. The consensus deal-flow
            industry that sells six-figure data subscriptions to six-person funds and calls proximity
            a methodology. Being three time zones from a partner&rsquo;s lunch table should not be the
            price of admission to a round.
          </p>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3">
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              What we believe
            </p>
            <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
              {BELIEFS.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-emerald-400 shrink-0">→</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              What we refuse
            </p>
            <ul className="space-y-3 text-gray-300 text-sm leading-relaxed">
              {REFUSALS.map((line) => (
                <li key={line} className="flex gap-2">
                  <span className="text-amber-400 shrink-0">✗</span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">The four pillars</h2>
          <div className="space-y-4">
            {PILLARS.map((p) => (
              <article
                key={p.title}
                className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-5 sm:p-6 space-y-2"
              >
                <h3 className="text-amber-200 font-bold text-lg sm:text-xl">{p.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{p.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-rose-700/30 bg-gradient-to-br from-rose-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            {EMOTIONAL_CAUSE_KICKER}
          </p>
          <h2 className="text-2xl font-bold text-gray-100 leading-snug">
            {EMOTIONAL_CAUSE_HEADLINE}
          </h2>
          <div className="space-y-3">
            {EMOTIONAL_CAUSE_LINES.map((line) => (
              <p key={line} className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {line}
              </p>
            ))}
          </div>
          <p className="text-gray-200 text-sm sm:text-base leading-relaxed border-l-2 border-rose-500/60 pl-4">
            There is a name for the reader who nods through all of this. You are a First Mover, and
            this is the creed: {DATA_NERD_TRIBE.oneLine}
          </p>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            If this sounds right
          </p>
          <h2 className="text-2xl font-bold text-gray-100 leading-snug">
            Start with the free issue. Then decide whether you want more than the shortlist.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The manifesto matters only if the output earns your trust.
            Start with the free weekly signal, or, if one sector is already on your mind, test it with a €7 First Look.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="https://gitdealflow.com/#signup" className="inline-flex items-center justify-center rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-semibold px-5 py-3 transition-colors">
              Get the free issue
            </Link>
            <Link href="/firstlook" className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-950/60 text-gray-200 hover:border-slate-600 text-sm font-semibold px-5 py-3 transition-colors">
              Or test one sector, First Look €7
            </Link>
          </div>
        </section>

        <DataNerdSignoff variant="long" />
      </div>
    </>
  );
}
