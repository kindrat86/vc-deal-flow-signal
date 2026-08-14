import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import {
  nicheSectors,
  countNiches,
  countSectors,
} from "@/content/niches";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 604800;

export const metadata: Metadata = {
  title: `Niche-down — ${countNiches()} small specific opportunities, indexed by sector`,
  description:
    "The riches are in the niches. We took the GitHub-signal sector map and split each sector into the small, specific opportunities a builder could ship or an early-stage VC could back. 15 sectors, 200 sub-niches, every entry status-flagged for build-vs-invest.",
  alternates: { canonical: "/niche-down" },
  openGraph: {
    title: `Niche-down — ${countNiches()} small specific opportunities`,
    description:
      "15 sectors × 10 sub-niches each. Each entry: build cost, deal velocity, signal shape, build-vs-invest call.",
    url: `${SITE}/niche-down`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `Niche-down — ${countNiches()} sub-niches by sector`,
    description:
      "The riches are in the niches — 200 specific opportunities a builder or VC could move on this quarter.",
  },
};

export default function NicheDownHubPage() {
  const totalNiches = countNiches();
  const totalSectors = countSectors();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/niche-down`,
        url: `${SITE}/niche-down`,
        name: `Niche-down — ${totalNiches} small specific opportunities, indexed by sector`,
        description:
          "Every GitHub-signal sector, split into the 10 most fundable small niches. Each leaf carries build cost, deal velocity, signal shape, and a build-vs-invest call.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Niche-down", item: `${SITE}/niche-down` },
        ],
      },
      {
        "@type": "ItemList",
        name: "Niche-down sectors",
        numberOfItems: totalSectors,
        itemListElement: nicheSectors.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.name,
          item: {
            "@type": "WebPage",
            "@id": `${SITE}/niche-down/${s.slug}`,
            name: `${s.name} — ${s.niches.length} sub-niches`,
            description: s.shortPitch,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/niche-down`}
        languages={getHreflangLanguages("/niche-down")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/niche-down" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Niche-down</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {totalSectors} sectors · {totalNiches} sub-niches · Build-vs-invest tagged
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The riches are in the <span className="text-sky-400">niches</span>.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            One mixed list of &ldquo;hot sectors&rdquo; isn&rsquo;t useful for
            builders or seed-stage investors. The actual opportunities are{" "}
            <em>inside</em> each sector — small, specific, often unbuilt. So we
            took the GitHub-signal sector map and split each one into the 10
            sub-niches a builder could ship this quarter or an early-stage VC
            could write a first cheque into next week.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Every leaf carries the same four flags: build cost, deal velocity,
            signal shape (the GitHub-trending pattern that tells you a repo
            here is breaking out), and our build-vs-invest call. The data is
            curated; the live signal data on each sector page comes straight
            from the weekly{" "}
            <Link
              href="/methodology"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              GitHub momentum panel
            </Link>
            .
          </p>
        </header>

        <section
          className="grid gap-4 sm:grid-cols-2"
          aria-label="Sectors with sub-niches"
        >
          {nicheSectors.map((s) => (
            <Link
              key={s.slug}
              href={`/niche-down/${s.slug}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-5 sm:p-6 space-y-3 group"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                  /niche-down/{s.slug}
                </p>
                <span className="text-[10px] text-slate-500 tabular-nums">
                  {s.niches.length} sub-niches
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug group-hover:text-sky-200 transition-colors">
                {s.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {s.shortPitch}
              </p>
              <p className="text-sky-400 text-sm font-semibold pt-1 group-hover:text-sky-300">
                Open the {s.niches.length}-niche map →
              </p>
            </Link>
          ))}
        </section>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label="How the niche-down map is built"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            How this map is built
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Sectors come from the GitHub signal. Sub-niches come from where the
            signal is breaking out.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The 20 top-level sectors are the same taxonomy the weekly{" "}
            <Link
              href="/methodology"
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              GitHub momentum panel
            </Link>{" "}
            uses — they&rsquo;re the categories under which repositories
            cluster when we scan the open-source population for engineering
            acceleration.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            The sub-niches are editorial. Each is a small, specific opportunity
            where (a) the signal shape suggests something is breaking out, (b)
            an indie team could plausibly build it in a quarter or less, and
            (c) an early-stage check would be a reasonable first move. We
            don&rsquo;t name the founders we track inside the paid product —
            that&rsquo;s the buyer&rsquo;s edge. The category-level commentary
            here is fair game.
          </p>
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="How to read the build-vs-invest call"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            How to read the build-vs-invest call
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Every sub-niche has the same four flags.
          </h2>
          <ul className="text-gray-300 text-base leading-relaxed space-y-2 list-disc pl-5">
            <li>
              <span className="text-sky-200 font-semibold">Build cost</span> —
              weekend, month, quarter, or team build. How big the upfront
              commitment is for an indie / small team.
            </li>
            <li>
              <span className="text-sky-200 font-semibold">Deal velocity</span>{" "}
              — trickle, steady, hot, or frothy. How fast funded companies are
              landing in the category right now.
            </li>
            <li>
              <span className="text-sky-200 font-semibold">Signal shape</span>{" "}
              — what the GitHub-trending pattern looks like when a repository
              in this niche is breaking out.
            </li>
            <li>
              <span className="text-sky-200 font-semibold">Our take</span> —
              the 2-3 sentence build-vs-invest call.
            </li>
          </ul>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/methodology"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              See the methodology →
            </Link>
            <Link
              href="/startups-to-watch"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Named startups (paid) →
            </Link>
          </div>
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="Get the weekly signal"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Get the weekly signal
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Want the named companies moving inside these niches?
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The map above is the category view. The weekly Acceleration Watch
            emails you the specific companies whose engineering is accelerating
            right now — ranked, in plain English, no code required. Free to
            start. Or test one sector for €7.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Test one sector for €7 →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Last refreshed: this surface is regenerated from{" "}
          <code className="text-gray-300">content/niches.ts</code> on every
          deploy. Each sub-niche is a stable URL; the editorial commentary is
          updated when the underlying GitHub-signal pattern shifts.
        </p>
      </div>
    </>
  );
}
