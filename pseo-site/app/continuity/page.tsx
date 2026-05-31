import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  CONTINUITY_DROPS,
  FORMAT_LABELS,
  FORMAT_DESCRIPTIONS,
  DROP_CADENCE_RULE,
  dropsByDateDesc,
  liveDropCount,
  scheduledDropCount,
  type DropFormat,
} from "@/content/continuity-drops";

export const dynamic = "force-static";

const SITE = "https://signals.gitdealflow.com";
const STRIPE_INSIDER = "https://buy.stripe.com/4gM00ifRpcRG2069I40x202";

/**
 * /continuity — Monthly Continuity Drop hub.
 *
 * Brunson DotCom Secrets Ch 22 (Decade in a Day / Continuity) +
 * Expert Secrets §3 Ch 22. The 2026-05-09 audit scored Continuity at
 * 90/100 with the gap: "continuity should have a content cadence beyond
 * the dashboard." This page surfaces the cadence — first Tuesday of
 * every month, four-format rotation, public abstract + member-only
 * artefact, 90-day delayed essay-to-public opening.
 *
 * The hub page does three things:
 *   1. Names the cadence rule (so the visitor sees the contract)
 *   2. Lists the live + scheduled drops on a single calendar grid
 *   3. Exposes the format rotation so the next 3-6 months are visible
 *
 * Static RSC. All content sourced from /content/continuity-drops.ts.
 */

export const metadata: Metadata = {
  title:
    "Monthly Insider Drop — net-new artefact every month · VC Deal Flow Signal",
  description:
    "First Tuesday of every month, 09:00 UTC. A new sector deep-dive, methodology release, founder essay, or tool — on a four-format rotation. Members get the artefact. Public gets the abstract. Twelve-drop calendar visible forward.",
  alternates: { canonical: "/continuity" },
  openGraph: {
    title:
      "Monthly Insider Drop — net-new artefact every month",
    description:
      "First Tuesday of every month, 09:00 UTC. Sector deep-dive, methodology release, founder essay, or tool — four-format rotation. Members get the artefact.",
    url: `${SITE}/continuity`,
    type: "website",
  },
};

const FORMAT_BADGE_CLASSES: Record<DropFormat, string> = {
  "sector-deep-dive":
    "text-emerald-300 border-emerald-700/40 bg-emerald-950/30",
  methodology: "text-sky-300 border-sky-700/40 bg-sky-950/30",
  "founder-essay":
    "text-violet-300 border-violet-700/40 bg-violet-950/30",
  "tool-release": "text-amber-300 border-amber-700/40 bg-amber-950/30",
};

const STATUS_BADGE_CLASSES = {
  live: "text-emerald-300 border-emerald-600/50 bg-emerald-950/40",
  scheduled: "text-gray-400 border-slate-700 bg-slate-900/50",
  archived: "text-gray-500 border-slate-800 bg-slate-950/40",
} as const;

export default function ContinuityHubPage() {
  const drops = dropsByDateDesc();
  const live = liveDropCount();
  const scheduled = scheduledDropCount();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/continuity#webpage`,
        url: `${SITE}/continuity`,
        name: "Monthly Insider Drop — VC Deal Flow Signal",
        description:
          "Monthly continuity drop for paid members — sector deep-dive, methodology release, founder essay, or tool on a four-format rotation. First Tuesday of every month.",
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
      },
      {
        "@type": "Periodical",
        "@id": `${SITE}/continuity#periodical`,
        name: "Monthly Insider Drop",
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        url: `${SITE}/continuity`,
        issn: undefined,
        description:
          "Monthly net-new artefact for paid members of VC Deal Flow Signal. Four-format rotation across sector deep-dives, methodology releases, founder essays, and tool releases.",
      },
      {
        "@type": "ItemList",
        name: "Insider Drop schedule",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: drops.length,
        itemListElement: drops.map((d, i) => ({
          "@type": "ListItem",
          position: i + 1,
          item: {
            "@type": "CreativeWork",
            name: d.title,
            url: `${SITE}/continuity/${d.slug}`,
            datePublished: d.publishDate,
            description: d.abstract,
            genre: FORMAT_LABELS[d.format],
            isAccessibleForFree: false,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Continuity",
            item: `${SITE}/continuity`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/continuity`}
        languages={getHreflangLanguages("/continuity")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/continuity" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Continuity</span>
          </nav>
          <p
            className="text-amber-400 text-xs font-semibold uppercase tracking-wider"
            data-speakable
          >
            Monthly Insider Drop · {live} live · {scheduled} scheduled
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            One net-new artefact,{" "}
            <span className="text-amber-400">every month</span>, on a
            cadence you can plan around.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The Sunday digest is the free cadence. The Dashboard is the daily
            tool. The Insider Drop is the thing that makes the paid tier a
            continuity programme — a brand-new sector deep-dive, methodology
            release, founder essay, or shipping tool on the first Tuesday of
            every month. Public gets the abstract. Members get the artefact.
          </p>
        </header>

        {/* THE CADENCE RULE — the contract */}
        <section
          aria-label="The cadence rule"
          className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            The cadence rule
          </p>
          <p className="text-gray-100 text-base sm:text-lg font-semibold leading-snug">
            {DROP_CADENCE_RULE}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Drops are dated, numbered, and pre-scheduled. The next twelve
            months are visible on this page. If a drop slips by more than 48
            hours past its publish date, every Insider gets an automatic
            credit (one month free) — that&rsquo;s how serious the
            commitment is to the cadence.
          </p>
        </section>

        {/* THE FORMAT ROTATION — what kinds of drops, in what order */}
        <section aria-label="The four-format rotation" className="space-y-5">
          <header className="space-y-1">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
              The four-format rotation
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              Four kinds of drops. One every month. Predictable, on rotation.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Variety is the point. A Methodology release answers a different
              question than a Sector Deep-Dive, which answers a different
              question than a Founder Essay, which answers a different
              question than a Tool Release. The four-month rotation means
              every quarter you get one of each.
            </p>
          </header>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {(Object.keys(FORMAT_LABELS) as DropFormat[]).map((f) => (
              <div
                key={f}
                className={`rounded-lg border p-4 sm:p-5 ${FORMAT_BADGE_CLASSES[f]}`}
              >
                <p className="text-[11px] font-semibold uppercase tracking-wider mb-1">
                  {FORMAT_LABELS[f]}
                </p>
                <p className="text-gray-200 text-sm leading-relaxed">
                  {FORMAT_DESCRIPTIONS[f]}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* THE CALENDAR — the drops, dated */}
        <section aria-label="The drop calendar" className="space-y-5">
          <header className="space-y-1">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              The twelve-month calendar
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              Every drop, by date. The next twelve months, public.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              Live drops link to the full essay + member artefact. Scheduled
              drops show the topic + format so you know what&rsquo;s coming.
              We commit forward to twelve months at a time so the cadence is
              auditable, not aspirational.
            </p>
          </header>
          <ol className="space-y-4">
            {drops.map((d) => {
              const dateLabel = new Date(d.publishDate).toLocaleDateString(
                "en-US",
                { year: "numeric", month: "long", day: "numeric" }
              );
              const isLive = d.status === "live";
              return (
                <li
                  key={d.slug}
                  className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
                >
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-gray-500 text-xs font-mono tabular-nums">
                          #{String(d.n).padStart(3, "0")}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${STATUS_BADGE_CLASSES[d.status]}`}
                        >
                          {d.status}
                        </span>
                        <span
                          className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded border ${FORMAT_BADGE_CLASSES[d.format]}`}
                        >
                          {FORMAT_LABELS[d.format]}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {dateLabel}
                        </span>
                      </div>
                      {isLive ? (
                        <h3 className="text-gray-100 font-semibold text-lg leading-snug">
                          <Link
                            href={`/continuity/${d.slug}`}
                            className="hover:text-amber-300 transition-colors"
                          >
                            {d.title}{" "}
                            <span aria-hidden="true">→</span>
                          </Link>
                        </h3>
                      ) : (
                        <h3 className="text-gray-300 font-semibold text-lg leading-snug">
                          {d.title}
                        </h3>
                      )}
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {d.subtitle}
                      </p>
                      <p className="text-gray-500 text-xs leading-relaxed pt-1">
                        {d.abstract}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* WHO GETS WHAT — public vs member */}
        <section
          aria-label="Public vs member access"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3">
            <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
              Public — free forever
            </p>
            <h3 className="text-gray-100 font-semibold text-base">
              The abstract, the topic, the cadence proof.
            </h3>
            <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>Every drop&rsquo;s abstract, dated and signed</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>The full twelve-month forward calendar</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>The full essay, ninety days after the drop ships</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✗</span>
                <span className="text-gray-500">
                  Member artefact (PDF / CSV / code / chart pack)
                </span>
              </li>
            </ul>
          </div>
          <div className="rounded-xl border border-amber-700/50 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-5 sm:p-6 space-y-3">
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
              Members — Insider Circle (€97/mo) and above
            </p>
            <h3 className="text-gray-100 font-semibold text-base">
              The artefact, the day it ships.
            </h3>
            <ul className="space-y-1.5 text-gray-300 text-sm leading-relaxed">
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>Full essay the day it ships</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>
                  Member artefact (PDF, CSV, code, chart pack, MCP tool)
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>
                  Telegram thread for the drop — sector questions, follow-ups
                </span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-400 shrink-0">✓</span>
                <span>
                  Retroactive access to every prior drop the day you upgrade
                </span>
              </li>
            </ul>
            <a
              href={STRIPE_INSIDER}
              className="mt-2 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
            >
              Lock €97/mo Insider rate <span aria-hidden="true">→</span>
            </a>
          </div>
        </section>

        {/* WHAT THIS REPLACES — the audit-closing block */}
        <section
          aria-label="What this replaces"
          className="rounded-xl border border-violet-700/40 bg-gradient-to-br from-violet-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
        >
          <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider">
            The continuity gap this closes
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Continuity isn&rsquo;t access. Continuity is content.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            A subscription that gives you the same dashboard every month is a
            tool subscription. A subscription that delivers a brand-new
            artefact every month — sector deep-dive, methodology release,
            founder essay, or shipping tool — is a continuity programme. The
            difference is whether you anticipate the next renewal or just
            tolerate it.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The Free Acceleration Watch is the cadence-builder. The Dashboard
            is the daily-rhythm tool. The State of GitHub is the public
            monthly anchor. The Insider Drop — this surface — is the
            paid-tier&rsquo;s anticipation engine. First Tuesday of every
            month, something net-new lands.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/decade-in-a-day"
              className="text-violet-300 hover:text-violet-200 underline decoration-dotted text-sm"
            >
              Read the earlier-signal curriculum →
            </Link>
            <Link
              href="/funnels"
              className="text-violet-300 hover:text-violet-200 underline decoration-dotted text-sm"
            >
              See where this fits in the funnel architecture →
            </Link>
          </div>
        </section>

        <footer className="border-t border-slate-800 pt-6 text-xs text-gray-500 leading-relaxed">
          <p>
            Authored by The Data Nerd. Synthetic narration only. The
            methodology is the protagonist. See{" "}
            <Link
              href="/about/founder"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              the Attractive Character canon
            </Link>{" "}
            for the rules of voice.
          </p>
        </footer>
      </div>
    </>
  );
}
