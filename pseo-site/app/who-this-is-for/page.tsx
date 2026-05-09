import type { Metadata } from "next";
import Link from "next/link";
import { ARCHETYPES, type Archetype } from "@/content/archetypes";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

/**
 * Archetype hub. Three reader-archetypes laid out side-by-side, each with a
 * full profile (one-liner, day-shape, jobs-to-be-done, why they buy, the
 * disqualifier, entry + ramp tiers). Cross-linked from the homepage card
 * preview, /about, /pricing, and the /quiz result page.
 *
 * Audit 2026-05-09 (Brunson Traffic Secrets Ch 1 split): the single
 * "developer-investor" composite avatar is split into Solo Angel,
 * Fund GP / Scout, and Family Office Analyst. Internal source workbook:
 * brunson/08-dream-customer.md §8.
 */

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Who VC Deal Flow Signal Is For — Three Reader Archetypes",
  description:
    "Three buying motions, three entry tiers. Solo Angel writing personal checks, Fund GP running a Monday memo, or Family Office analyst writing diligence reports — find the right tier for the way you actually work.",
  alternates: { canonical: "/who-this-is-for" },
  openGraph: {
    title: "Who this is for — three reader archetypes",
    description:
      "Solo Angel, Fund GP / Scout, or Family Office Analyst. Each archetype maps to a specific entry tier — pick the one whose week-rhythm sounds like yours.",
    url: "https://signals.gitdealflow.com/who-this-is-for",
    type: "website",
  },
};

const ACCENT: Record<
  Archetype["accent"],
  {
    border: string;
    chip: string;
    headline: string;
    cta: string;
    secondary: string;
    bullet: string;
    rule: string;
  }
> = {
  sky: {
    border:
      "border-sky-500/30 bg-gradient-to-br from-sky-950/30 via-slate-950 to-slate-950",
    chip: "bg-sky-500/15 text-sky-300 ring-sky-400/30",
    headline: "text-sky-300",
    cta: "bg-sky-600 hover:bg-sky-500 text-white shadow-sky-500/30",
    secondary:
      "border-sky-700/50 bg-sky-950/30 hover:bg-sky-900/40 text-sky-100",
    bullet: "bg-sky-400/70",
    rule: "border-sky-700/30",
  },
  amber: {
    border:
      "border-amber-500/30 bg-gradient-to-br from-amber-950/30 via-slate-950 to-slate-950",
    chip: "bg-amber-500/15 text-amber-300 ring-amber-400/30",
    headline: "text-amber-300",
    cta: "bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-amber-500/30",
    secondary:
      "border-amber-700/50 bg-amber-950/30 hover:bg-amber-900/40 text-amber-100",
    bullet: "bg-amber-400/70",
    rule: "border-amber-700/30",
  },
  emerald: {
    border:
      "border-emerald-500/30 bg-gradient-to-br from-emerald-950/30 via-slate-950 to-slate-950",
    chip: "bg-emerald-500/15 text-emerald-300 ring-emerald-400/30",
    headline: "text-emerald-300",
    cta: "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-500/30",
    secondary:
      "border-emerald-700/50 bg-emerald-950/30 hover:bg-emerald-900/40 text-emerald-100",
    bullet: "bg-emerald-400/70",
    rule: "border-emerald-700/30",
  },
};

export default function WhoThisIsForPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/who-this-is-for#page",
        url: "https://signals.gitdealflow.com/who-this-is-for",
        name: "Who VC Deal Flow Signal Is For — Three Reader Archetypes",
        description:
          "Three reader archetypes — Solo Angel, Fund GP / Scout, and Family Office Analyst — mapped to three entry tiers.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        mainEntity: {
          "@id": "https://signals.gitdealflow.com/who-this-is-for#archetype-list",
        },
      },
      {
        "@type": "ItemList",
        "@id":
          "https://signals.gitdealflow.com/who-this-is-for#archetype-list",
        itemListOrder: "https://schema.org/ItemListOrderAscending",
        numberOfItems: ARCHETYPES.length,
        itemListElement: ARCHETYPES.map((arch, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: arch.label,
          url: `https://signals.gitdealflow.com/who-this-is-for#${arch.id}`,
          description: arch.oneLiner,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Who this is for",
            item: "https://signals.gitdealflow.com/who-this-is-for",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/who-this-is-for"
        languages={getHreflangLanguages("/who-this-is-for")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/who-this-is-for" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-[0.16em]">
            Three reader archetypes · three entry tiers
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Pick the archetype whose week-rhythm sounds like yours.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl">
            We used to describe one reader: the developer-investor. That
            description fit a third of our buyers and confused the other
            two-thirds. So we split it. There are three of you, and the tier
            that fits each of you is different. Solo Angel is not Fund GP. Fund
            GP is not Family Office. The methodology is the same; the contract
            shape, the on-ramp, and the upgrade path are not.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {ARCHETYPES.map((arch) => (
              <a
                key={arch.id}
                href={`#${arch.id}`}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 transition-colors ${ACCENT[arch.accent].chip}`}
              >
                {arch.label}
                <span aria-hidden="true">↓</span>
              </a>
            ))}
          </div>
        </header>

        {ARCHETYPES.map((arch) => {
          const accent = ACCENT[arch.accent];
          return (
            <article
              key={arch.id}
              id={arch.id}
              className={`scroll-mt-24 rounded-2xl border p-6 sm:p-8 space-y-6 ${accent.border}`}
            >
              <div className="space-y-3">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] ring-1 ${accent.chip}`}
                >
                  Archetype · {arch.shortLabel}
                </span>
                <h2
                  className={`text-2xl sm:text-3xl font-bold leading-snug ${accent.headline}`}
                >
                  {arch.label}
                </h2>
                <p className="text-gray-200 text-base sm:text-lg leading-relaxed max-w-3xl">
                  {arch.oneLiner}
                </p>
              </div>

              <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6 ${accent.rule}`}>
                <div className="space-y-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
                    A typical week
                  </p>
                  <ul className="space-y-2.5 text-gray-200 text-[15px] leading-relaxed">
                    {arch.dayShape.map((line, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          aria-hidden
                          className={`mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${accent.bullet}`}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
                    Jobs to be done
                  </p>
                  <ul className="space-y-2.5 text-gray-200 text-[15px] leading-relaxed">
                    {arch.jobs.map((line, i) => (
                      <li key={i} className="flex gap-3">
                        <span
                          aria-hidden
                          className={`mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${accent.bullet}`}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className={`space-y-3 border-t pt-6 ${accent.rule}`}>
                <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
                  What makes this reader buy
                </p>
                <ul className="space-y-2.5 text-gray-200 text-[15px] leading-relaxed">
                  {arch.whatBuys.map((line, i) => (
                    <li key={i} className="flex gap-3">
                      <span
                        aria-hidden
                        className={`mt-[0.55rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full ${accent.bullet}`}
                      />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div
                className={`space-y-3 border-t pt-6 ${accent.rule}`}
                aria-label="Disqualifier"
              >
                <p className="text-rose-300/90 text-xs font-semibold uppercase tracking-[0.14em]">
                  Not for you if
                </p>
                <p className="text-gray-300 text-[15px] leading-relaxed">
                  {arch.notForYouIf}
                </p>
              </div>

              <div
                className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-6 ${accent.rule}`}
              >
                <div className="space-y-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
                    Entry tier
                  </p>
                  <p className="text-gray-100 text-base font-semibold">
                    {arch.entryTier.name}
                    <span className="text-gray-500 font-normal"> · </span>
                    <span className="text-gray-300 font-normal">
                      {arch.entryTier.price}
                    </span>
                  </p>
                  {arch.entryCta.external ? (
                    <a
                      href={arch.entryCta.href}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-lg transition-colors ${accent.cta}`}
                    >
                      {arch.entryCta.label}{" "}
                      <span aria-hidden="true">→</span>
                    </a>
                  ) : (
                    <Link
                      href={arch.entryCta.href}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-sm font-semibold shadow-lg transition-colors ${accent.cta}`}
                    >
                      {arch.entryCta.label}{" "}
                      <span aria-hidden="true">→</span>
                    </Link>
                  )}
                </div>
                <div className="space-y-3">
                  <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
                    Ramp tier
                  </p>
                  <p className="text-gray-100 text-base font-semibold">
                    {arch.rampTier.name}
                    <span className="text-gray-500 font-normal"> · </span>
                    <span className="text-gray-300 font-normal">
                      {arch.rampTier.price}
                    </span>
                  </p>
                  {arch.rampCta.external ? (
                    <a
                      href={arch.rampCta.href}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${accent.secondary}`}
                    >
                      {arch.rampCta.label}
                    </a>
                  ) : (
                    <Link
                      href={arch.rampCta.href}
                      className={`inline-flex items-center justify-center gap-2 rounded-lg border px-5 py-2.5 text-sm font-semibold transition-colors ${accent.secondary}`}
                    >
                      {arch.rampCta.label}
                    </Link>
                  )}
                </div>
              </div>
            </article>
          );
        })}

        <section
          aria-label="Routing matrix"
          className="rounded-2xl border border-slate-800 bg-slate-900/40 p-6 sm:p-8 space-y-4"
        >
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-[0.14em]">
            Routing matrix
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Which tier fits which archetype
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed max-w-3xl">
            Same eight tiers, three different on-ramps. Not every cell is a
            primary fit — some are awareness, some are wrong-tier. The matrix
            below shows where each archetype starts, where they ramp to, and
            where they should not bother.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-gray-400 text-xs uppercase tracking-wider">
                  <th className="py-2 pr-4 font-semibold">Tier</th>
                  <th className="py-2 px-3 font-semibold">Solo Angel</th>
                  <th className="py-2 px-3 font-semibold">Fund GP</th>
                  <th className="py-2 px-3 font-semibold">Family Office</th>
                </tr>
              </thead>
              <tbody className="text-gray-200">
                {[
                  ["Free Acceleration Watch", "Entry", "Awareness", "Awareness"],
                  ["First Look Pass · €7", "Tripwire", "Skip", "Skip"],
                  ["Dashboard · €9.97/mo", "Core", "Underspec", "Wrong tier"],
                  ["Insider Circle · €97/mo", "Ramp", "Entry", "Underspec"],
                  ["Sharp Tier · €497/mo", "Overkill", "Core", "Awareness"],
                  ["Sector Sweep · €1,997 once", "Overkill", "Thesis primer", "Entry"],
                  [
                    "Methodology Partnership · €14,997/yr",
                    "Wrong tier",
                    "Overkill",
                    "Core",
                  ],
                  ["Vault · €49,997/yr", "Wrong tier", "Awareness", "Ramp"],
                ].map((row) => (
                  <tr
                    key={row[0]}
                    className="border-b border-slate-800/70 last:border-b-0"
                  >
                    <td className="py-2.5 pr-4 font-medium text-gray-200">
                      {row[0]}
                    </td>
                    <td className="py-2.5 px-3 text-gray-400">{row[1]}</td>
                    <td className="py-2.5 px-3 text-gray-400">{row[2]}</td>
                    <td className="py-2.5 px-3 text-gray-400">{row[3]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section
          aria-label="Quiz cross-link"
          className="rounded-2xl border border-amber-500/30 bg-gradient-to-br from-amber-950/20 via-slate-950 to-slate-950 p-6 sm:p-8 space-y-3"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Still not sure
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
            Take the 90-second quiz instead.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-3xl">
            Five questions on cadence, thesis, rhythm, edge, and how you self-ID.
            We route you to one of these three archetypes plus the matching
            entry tier. No hard sell, no email required to see the result.
          </p>
          <Link
            href="/quiz"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 px-5 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/30 transition-colors hover:bg-amber-400"
          >
            Start the quiz <span aria-hidden="true">→</span>
          </Link>
        </section>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-4">
          Pricing tiers are real and current. Solo Angel ramp from Free →
          Dashboard → Insider; Fund GP ramps Insider → Sharp; Family Office
          ramps Sector Sweep → Methodology Partnership → Vault. Every tier
          carries the same 30-day Signal-or-It&rsquo;s-Free guarantee on the
          first paid window.
        </p>
      </div>
    </>
  );
}
