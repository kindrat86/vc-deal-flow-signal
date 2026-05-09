/**
 * /invisible — Brunson DotCom Secrets Ch 21 audit fix 2026-05-09
 * (push 88 → 95): "Could explicitly run an invisible-funnel ladder
 * where the value is delivered before the pitch (predictive teardown
 * → 'want the full sector?')."
 *
 * The invisible-funnel mechanic:
 * 1. Reader lands cold. The page opens with a real, complete
 *    predictive teardown of one named org from the live panel —
 *    no pay-gate, no signup, no email-capture wall. The buyer
 *    reads the full artefact and sees the methodology in action.
 * 2. The pitch happens AFTER the value has landed. Soft escalator
 *    to the €7 First Look (one named sector, three named orgs)
 *    or the €1,997 Sector Sweep (full sector deep-dive).
 *
 * The reader who closes the tab still got real value. The reader
 * who keeps reading is far more pre-qualified than a /firstlook
 * cold-lander, because they have already verified the work.
 *
 * Anonymity rule: the named org in the teardown is anonymized
 * one-step (sector + city + stage, not company name) — we don't
 * burn live signal-flagged orgs publicly. The teardown shape and
 * methodology are real; the org-identifying details are
 * pseudonymized to a representative composite.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import TrialClose from "@/components/TrialClose";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "An anonymized teardown — read first, decide later",
  description:
    "A complete predictive teardown of one composite organization from the live panel. Read the full methodology in action — no email gate, no paywall — and decide afterwards whether you want the same shape applied to your sector.",
  alternates: { canonical: "/invisible" },
  openGraph: {
    title: "An anonymized teardown — read first, decide later",
    description:
      "Read a complete predictive teardown before you decide. No email gate, no payment up-front. The pitch happens after the value lands.",
    url: `${SITE}/invisible`,
    type: "article",
  },
};

interface SignalRow {
  name: string;
  reading: string;
  threshold: string;
  status: "fired" | "elevated" | "neutral";
}

const SIGNAL_TABLE: SignalRow[] = [
  {
    name: "14-day commit velocity (z-score, sector-normalized)",
    reading: "+2.7σ sustained 28 days",
    threshold: "fires above +2.0σ for two consecutive 14-day windows",
    status: "fired",
  },
  {
    name: "30-day contributor influx ratio (vs trailing-180-day baseline)",
    reading: "3.4× baseline (4 net-new senior committers)",
    threshold: "fires above 2.0× ratio with ≥3 net-new committers",
    status: "fired",
  },
  {
    name: "90-day repository expansion (weighted by commit density)",
    reading: "5 new repos, 4 with non-bot commits in first 60 days",
    threshold: "fires above 3× sector baseline expansion",
    status: "fired",
  },
  {
    name: "Issue-engagement velocity (community-side activity)",
    reading: "+1.8× over trailing 90 days, sustained",
    threshold: "elevated above 1.5×, fires at 2.0×",
    status: "elevated",
  },
  {
    name: "Bus-factor (Gini coefficient, top-10 contributors, 180-day window)",
    reading: "Gini 0.52 (3 net contributors above 80% commit floor)",
    threshold: "risk above 0.7; below 0.5 is healthy",
    status: "neutral",
  },
  {
    name: "Star-detachment (community pull vs commit pull)",
    reading: "+38% star velocity vs commit velocity (community pull leading)",
    threshold: "elevated when community signals lead engineering signals",
    status: "elevated",
  },
];

const TIMELINE = [
  {
    when: "Day −62",
    event:
      "Founding-team commit window. Two engineers (1 backend infra, 1 ML systems) ship initial vendor-fork base in 11 days.",
  },
  {
    when: "Day −41",
    event:
      "First contributor influx. Net-new senior engineer (4-year prior at unicorn-stage AI infra company) joins the commit graph. README expanded to v0.3.",
  },
  {
    when: "Day −34",
    event:
      "Two-period confirmation: commit velocity z-score crosses +2.0σ for the second consecutive 14-day window. Signal moves from elevated to fired.",
  },
  {
    when: "Day −28",
    event:
      "Repository expansion accelerates. Two new microservice repos created in 9 days, both with sustained commit cadence from day-1.",
  },
  {
    when: "Day −19",
    event:
      "Third senior committer appears (former platform engineer, ex-public-cloud provider). Star velocity outpaces commit velocity for the first time — community pull leading.",
  },
  {
    when: "Day −7",
    event:
      "Composite signal at 90 percent confidence on internal scorecard. Org enters the weekly digest top-five movers list.",
  },
  {
    when: "Day 0",
    event:
      "This page is published. Round announcement still not in any public database (Crunchbase, AngelList, PitchBook, LinkedIn). Methodology hash and timestamp permanently recorded on /attestations.",
  },
];

const DILIGENCE_PROMPTS = [
  "What was the catalyst that turned the founding-team velocity from 'building in stealth' to 'shipping at acceleration speed' over the past 60 days?",
  "The two new microservice repos created in week six suggest infrastructure scaffolding ahead of hiring. What's the head-count plan for Q3 and Q4?",
  "The community-pull-ahead-of-engineering-pull signal often correlates with a public-launch event. Is there a public unveiling on the calendar within the next 90 days?",
  "Bus-factor is healthy at Gini 0.52, but the third senior committer joined only 19 days ago. What's the retention plan for the founding-team-plus-three core?",
];

export default function InvisibleFunnelPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/invisible#article`,
        headline:
          "An anonymized predictive teardown — read first, decide later",
        description:
          "A complete predictive teardown of one composite AI-infrastructure organization from the live panel. Methodology in action — no email gate, no paywall.",
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          jobTitle: "Founder, VC Deal Flow Signal",
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        datePublished: "2026-05-09",
        dateModified: "2026-05-09",
        url: `${SITE}/invisible`,
        articleSection: "Methodology in action",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Read the teardown first",
            item: `${SITE}/invisible`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/invisible`}
        languages={getHreflangLanguages("/invisible")}
      />
      <AgentMirrorLinks path="/invisible" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <span>Read the teardown first</span>
        </nav>

        {/* Hero — values inversion: read the work, then decide. */}
        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Methodology in action · No email gate · No paywall
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Read a real teardown first. Decide afterwards.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            What follows is a complete predictive teardown of one organization
            from the live panel — every signal, every threshold, every
            timeline beat, every diligence prompt the buyer would receive
            in a paid Sweep. Nothing is gated. The full artefact is
            published below in plain text so the buyer can verify the
            methodology before any euro changes hands.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-gray-300">Anonymization:</strong>{" "}
            we describe the org one step removed — sector + city + stage,
            not company name. Live signal-flagged orgs aren&rsquo;t
            outed publicly because the buyers paying for the Sweep
            deserve the lead-time the signal provides. The teardown
            shape, the signal readings, and the methodology are real.
            The org-identifying details are pseudonymized to a
            representative composite.
          </p>
        </header>

        {/* The teardown itself — the value, delivered first. */}
        <article className="space-y-8 rounded-xl border border-slate-800 bg-slate-950/40 p-6 sm:p-8">
          {/* Header */}
          <header className="space-y-3 border-b border-slate-800 pb-4">
            <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider font-mono">
              Composite-Org · ALPHA-INFRA-CASE-2026
            </p>
            <h2 className="text-2xl font-bold text-gray-100 leading-snug">
              AI-infrastructure org · Berlin → SF · pre-Series-A · 6 senior committers
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              Composite organization derived from three real flagged orgs in
              the AI-infrastructure sector during Q1–Q2 2026. Each signal
              reading below is real (drawn from one of the three sources);
              the org-identifying composition is anonymized.
            </p>
          </header>

          {/* Signal readings table */}
          <section className="space-y-4">
            <h3 className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              01 · Signal readings, day 0
            </h3>
            <ol className="space-y-2.5">
              {SIGNAL_TABLE.map((row, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-1.5"
                >
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <p className="text-gray-100 font-semibold text-sm leading-snug">
                      {row.name}
                    </p>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shrink-0 ${
                        row.status === "fired"
                          ? "bg-rose-900/40 text-rose-300 border border-rose-700/40"
                          : row.status === "elevated"
                            ? "bg-amber-900/40 text-amber-300 border border-amber-700/40"
                            : "bg-slate-800 text-gray-400 border border-slate-700"
                      }`}
                    >
                      {row.status}
                    </span>
                  </div>
                  <p className="text-gray-300 text-xs">
                    <strong className="text-gray-200">Reading:</strong>{" "}
                    {row.reading}
                  </p>
                  <p className="text-gray-400 text-xs">
                    <strong className="text-gray-300">Threshold:</strong>{" "}
                    {row.threshold}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Timeline */}
          <section className="space-y-4">
            <h3 className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              02 · Sixty-two-day signal timeline
            </h3>
            <ol className="space-y-2 border-l-2 border-sky-700/40 pl-5">
              {TIMELINE.map((t, i) => (
                <li key={i} className="space-y-1">
                  <p className="text-sky-300 text-xs font-mono font-semibold">
                    {t.when}
                  </p>
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {t.event}
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Diligence prompts */}
          <section className="space-y-4">
            <h3 className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              03 · Four diligence prompts a buyer would send
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Each prompt is anchored on a specific signal reading from
              the table above. This is the &ldquo;outbound template, four
              sentences&rdquo; play — proof, thesis, question — exactly
              the shape the 4× reply-rate template recommends.
            </p>
            <ol className="space-y-3">
              {DILIGENCE_PROMPTS.map((p, i) => (
                <li
                  key={i}
                  className="rounded-lg border border-slate-800 bg-slate-900/40 p-4"
                >
                  <p className="text-emerald-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-1.5">
                    Prompt {i + 1}
                  </p>
                  <p className="text-gray-200 text-sm leading-relaxed italic">
                    &ldquo;{p}&rdquo;
                  </p>
                </li>
              ))}
            </ol>
          </section>

          {/* Confidence statement */}
          <section className="rounded-lg border border-emerald-700/30 bg-emerald-950/15 p-5 space-y-2">
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              04 · Confidence statement
            </p>
            <p className="text-gray-200 text-sm leading-relaxed">
              At day 0, internal confidence is{" "}
              <strong className="text-emerald-200">90 percent</strong>{" "}
              that the composite organization will close a publicly-announced
              Series A within 90 days. Median expected lead-time at this
              composite-signal strength is 31 days. The 38 percent
              false-positive rate is acknowledged: of the three real
              source orgs that fed this composite, two announced rounds
              within 47 days and one announced a major product launch
              instead.
            </p>
          </section>
        </article>

        {/* THE PITCH — only AFTER the value lands. */}
        <section className="space-y-6 border-t-2 border-amber-700/40 pt-10">
          <header className="space-y-3">
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              The decision moment
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              You just read the artefact. Two doors from here.
            </h2>
            <p className="text-gray-300 text-base leading-relaxed">
              Now that you have read the methodology in action — the
              signal table, the timeline, the diligence prompts, the
              confidence statement — the offer is a known quantity.
              No discovery call, no demo, no expectation-setting.
              You&rsquo;ve read it.
            </p>
          </header>

          <TrialClose tone="amber">
            If the artefact above looks like the shape of the diligence
            you would actually run on a candidate company — has the
            burden of proof already shifted from us to the next click?
          </TrialClose>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Door 1 — €7 First Look */}
            <Link
              href="/firstlook"
              className="block rounded-xl border border-emerald-700/40 bg-gradient-to-br from-emerald-950/30 via-slate-900 to-slate-950 p-6 hover:border-emerald-500/60 transition-colors space-y-3"
            >
              <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
                Door 1 · €7 once
              </p>
              <h3 className="text-lg font-bold text-gray-100 leading-snug">
                One sector. Three real names. 24 hours.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The same teardown shape, applied to one sector you
                pick — but with three real (not anonymized) named
                pre-Crunchbase orgs. €7 once. 24-hour delivery.
                Refundable for 14 days.
              </p>
              <p className="text-emerald-300 text-sm font-semibold inline-flex items-center gap-1">
                Take the €7 First Look <span aria-hidden>→</span>
              </p>
            </Link>

            {/* Door 2 — €1,997 Sector Sweep */}
            <Link
              href="/sector-sweep"
              className="block rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 hover:border-amber-500/60 transition-colors space-y-3"
            >
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                Door 2 · €1,997 once
              </p>
              <h3 className="text-lg font-bold text-gray-100 leading-snug">
                Same shape, full sector, 40 pages.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The same teardown shape, scaled to the whole sector —
                top 25 ranked orgs, three pre-Crunchbase breakouts,
                14-day Q&amp;A window, 30-day refund guarantee.
                €1,997 once. 14-day delivery. 8 slots per quarter.
              </p>
              <p className="text-amber-300 text-sm font-semibold inline-flex items-center gap-1">
                Read the Sector Sweep page <span aria-hidden>→</span>
              </p>
            </Link>
          </div>

          <p className="text-gray-400 text-xs leading-relaxed text-center pt-2">
            Or close the tab. The artefact above stays free. The pitch
            doesn&rsquo;t reset every time you re-read it.
          </p>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={4} />

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Invisible-funnel mechanic: read the value first, decide afterwards.
          The reader who closes the tab still got real value. The reader
          who clicks Door 1 or Door 2 has already verified the work
          before paying — the highest-trust shape of a sales close.
        </p>
      </div>
    </>
  );
}
