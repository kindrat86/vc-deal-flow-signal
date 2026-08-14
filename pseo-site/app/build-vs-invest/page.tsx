import type { Metadata } from "next";
import Link from "next/link";
import {
  buildVsInvestSectors,
  QUADRANT_META,
  type BuildVsInvestQuadrant,
} from "@/content/build-vs-invest";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 604800;

export const metadata: Metadata = {
  title:
    "Build it or fund it?, The 2×2 by sector",
  description:
    "For every tracked sector, the honest answer to 'should I build this or fund it?'. Cost-to-build vs deal-velocity, scored on the same engineering-signal data that powers the rest of the site.",
  alternates: { canonical: "/build-vs-invest" },
  openGraph: {
    title:
      "Build it or fund it?, The 2×2 by sector",
    description:
      "Cost-to-build vs deal-velocity, scored per sector on the same engineering-signal data that powers VC Deal Flow Signal.",
    url: `${SITE}/build-vs-invest`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Build it or fund it?, The 2×2 by sector",
    description:
      "Cost-to-build vs deal-velocity, scored per sector. The honest answer for every sector we track.",
  },
};

const QUADRANT_TONE: Record<
  BuildVsInvestQuadrant,
  { ring: string; chip: string; dot: string }
> = {
  build: {
    ring: "border-emerald-700/50 hover:border-emerald-500/70",
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    dot: "bg-emerald-400",
  },
  fund: {
    ring: "border-sky-700/50 hover:border-sky-500/70",
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    dot: "bg-sky-400",
  },
  wait: {
    ring: "border-amber-700/50 hover:border-amber-500/70",
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    dot: "bg-amber-400",
  },
  avoid: {
    ring: "border-rose-700/50 hover:border-rose-500/70",
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    dot: "bg-rose-400",
  },
};

const QUADRANT_ORDER: BuildVsInvestQuadrant[] = [
  "build",
  "fund",
  "wait",
  "avoid",
];

export default function BuildVsInvestIndexPage() {
  const grouped: Record<BuildVsInvestQuadrant, typeof buildVsInvestSectors> = {
    build: [],
    fund: [],
    wait: [],
    avoid: [],
  };
  for (const s of buildVsInvestSectors) grouped[s.quadrant].push(s);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/build-vs-invest#webpage`,
        url: `${SITE}/build-vs-invest`,
        name: "Build it or fund it?, The 2×2 by sector",
        description:
          "Cost-to-build vs deal-velocity, scored per sector on the same engineering-signal data that powers VC Deal Flow Signal.",
        inLanguage: "en-US",
        isAccessibleForFree: true,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "CollectionPage",
        name: "Build-vs-invest 2×2 by sector",
        url: `${SITE}/build-vs-invest`,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        name: "Per-sector build-vs-invest verdicts",
        numberOfItems: buildVsInvestSectors.length,
        itemListElement: buildVsInvestSectors.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `${SITE}/build-vs-invest/${s.slug}`,
          name: `${s.name}, ${QUADRANT_META[s.quadrant].short} quadrant`,
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Build vs invest",
            item: `${SITE}/build-vs-invest`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/build-vs-invest`}
        languages={getHreflangLanguages("/build-vs-invest")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/build-vs-invest" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Build vs invest</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            One 2×2 · 15 sectors · scored on engineering-signal data
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Should you{" "}
            <span className="text-emerald-400">build it</span>: or <span className="text-sky-400">fund it</span>?
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            Every sector we track gets the same two scores: how expensive it
            is to credibly build inside, and how fast the deals close once
            engineering acceleration shows up. Two numbers, one 2×2,
            twenty sectors. The four quadrants are the honest answer to the
            question every operator and every angel asks themselves
            inside the same week.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            The methodology re-uses the same engineering-acceleration data
            that powers <Link href="/predicted" className="text-sky-300 underline decoration-dotted hover:text-sky-200">/predicted</Link> and{" "}
            <Link href="/startups-to-watch" className="text-sky-300 underline decoration-dotted hover:text-sky-200">/startups-to-watch</Link>.
            Cost-to-build estimates blend capital intensity, regulatory drag,
            and hardware overhead.
          </p>
        </header>

        {/* The 2×2 grid */}
        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 overflow-hidden"
          aria-label="Build vs invest 2x2 grid"
        >
          <div className="grid grid-cols-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            <div className="px-4 py-2.5 border-b border-r border-slate-800 bg-slate-900/60">
              ← Low cost-to-build
            </div>
            <div className="px-4 py-2.5 border-b border-slate-800 bg-slate-900/60 text-right">
              High cost-to-build →
            </div>
          </div>
          <div className="grid grid-cols-2 gap-px bg-slate-800">
            {QUADRANT_ORDER.map((q) => {
              const meta = QUADRANT_META[q];
              const tone = QUADRANT_TONE[q];
              const sectors = grouped[q];
              return (
                <div
                  key={q}
                  className="bg-slate-950/60 p-5 space-y-3 min-h-[180px]"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-block w-2 h-2 rounded-full ${tone.dot}`}
                    />
                    <p
                      className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${tone.chip}`}
                    >
                      {meta.short} quadrant
                    </p>
                  </div>
                  <h2 className="text-gray-100 font-bold text-base leading-snug">
                    {meta.label}
                  </h2>
                  <p className="text-gray-400 text-xs leading-relaxed">
                    {meta.description}
                  </p>
                  <ul className="flex flex-wrap gap-1.5 pt-1">
                    {sectors.map((s) => (
                      <li key={s.slug}>
                        <Link
                          href={`/build-vs-invest/${s.slug}`}
                          className="inline-flex items-center px-2 py-0.5 rounded bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-sky-300 text-[11px] transition-colors"
                        >
                          {s.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
          <div className="grid grid-cols-2 text-[10px] font-semibold uppercase tracking-wider text-slate-400 border-t border-slate-800">
            <div className="px-4 py-2.5 border-r border-slate-800 bg-slate-900/60">
              ↑ High deal-velocity
            </div>
            <div className="px-4 py-2.5 bg-slate-900/60 text-right">
              ↓ Low deal-velocity
            </div>
          </div>
        </section>

        {/* All sectors index */}
        <section aria-label="All sector verdicts" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            All 15 sector verdicts.
          </h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {buildVsInvestSectors.map((s) => {
              const tone = QUADRANT_TONE[s.quadrant];
              const meta = QUADRANT_META[s.quadrant];
              return (
                <Link
                  key={s.slug}
                  href={`/build-vs-invest/${s.slug}`}
                  className={`block rounded-lg border ${tone.ring} bg-slate-900/60 hover:bg-slate-900 transition-colors p-4 space-y-2`}
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <h3 className="text-gray-100 font-semibold text-sm">
                      {s.name}
                    </h3>
                    <span
                      className={`inline-flex items-center px-1.5 py-0.5 rounded border text-[9px] font-semibold uppercase tracking-wider ${tone.chip}`}
                    >
                      {meta.short}
                    </span>
                  </div>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {s.headline}
                  </p>
                  <p className="text-slate-500 text-[10px] tabular-nums">
                    cost {s.costToBuild} · velocity {s.dealVelocity}
                  </p>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Methodology note */}
        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label="Methodology"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            How the scores are built
          </p>
          <h2 className="text-lg sm:text-xl font-bold text-gray-100">
            Two numbers, one source of truth.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-gray-100">Cost-to-build</strong> is a 1-100
            score blending realistic capital requirements, regulatory drag,
            hardware overhead, and team-quality bar for an indie founder
            attempting to ship a credible first product. A score of 1 means
            &ldquo;a weekend on a laptop&rdquo;; a score of 100 means a
            multi-year multi-million-euro hard-tech bet.
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            <strong className="text-gray-100">Deal-velocity</strong> is a 1-100
            score for the rate at which deals close inside the pre-fundraise
            window we measure across the site. A score of 1 means the sector
            is functionally dormant; 100 means rounds compress to days once
            engineering acceleration shows up. The threshold for each
            quadrant is 50.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Read the full methodology at{" "}
            <Link
              href="/methodology"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /methodology
            </Link>{" "}
            and the per-signal definitions at{" "}
            <Link
              href="/signals"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /signals
            </Link>
            .
          </p>
        </section>

        {/* CTA */}
        <section className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            The same data, weekly
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            One Monday email. Five sectors. Five movers.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The 2×2 above is the strategic view. The weekly Signal Report is
            the tactical one, five breakout startups ranked by GitHub
            engineering acceleration, every Monday, free.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the Monday email →
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              See the dashboard →
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
