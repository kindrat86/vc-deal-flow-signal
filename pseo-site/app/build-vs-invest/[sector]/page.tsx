import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  buildVsInvestSectors,
  getAllBuildVsInvestSlugs,
  getBuildVsInvestBySlug,
  QUADRANT_META,
  type BuildVsInvestQuadrant,
  type BuildVsInvestSector,
} from "@/content/build-vs-invest";
import {
  getAllSectors,
  getCurrentPeriod,
  getDataLastModified,
} from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

interface PageProps {
  params: Promise<{ sector: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateStaticParams() {
  return getAllBuildVsInvestSlugs().map((sector) => ({ sector }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector } = await params;
  const entry = getBuildVsInvestBySlug(sector);
  if (!entry) return {};

  const meta = QUADRANT_META[entry.quadrant];
  const title = `${entry.name}: build it or fund it? — ${meta.short} quadrant`;
  const description = entry.headline;

  return {
    title,
    description,
    alternates: { canonical: `/build-vs-invest/${sector}` },
    openGraph: {
      title,
      description,
      url: `${SITE}/build-vs-invest/${sector}`,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

const QUADRANT_TONE: Record<
  BuildVsInvestQuadrant,
  {
    chip: string;
    headline: string;
    bar: string;
    cellActive: string;
    cellDim: string;
    accent: string;
  }
> = {
  build: {
    chip: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
    headline: "text-emerald-300",
    bar: "bg-emerald-500",
    cellActive:
      "bg-emerald-500/20 border-emerald-500/40 text-emerald-200",
    cellDim: "bg-slate-900/40 border-slate-800 text-slate-500",
    accent: "border-emerald-700/40",
  },
  fund: {
    chip: "bg-sky-500/15 text-sky-300 border-sky-500/30",
    headline: "text-sky-300",
    bar: "bg-sky-500",
    cellActive: "bg-sky-500/20 border-sky-500/40 text-sky-200",
    cellDim: "bg-slate-900/40 border-slate-800 text-slate-500",
    accent: "border-sky-700/40",
  },
  wait: {
    chip: "bg-amber-500/15 text-amber-300 border-amber-500/30",
    headline: "text-amber-300",
    bar: "bg-amber-500",
    cellActive: "bg-amber-500/20 border-amber-500/40 text-amber-200",
    cellDim: "bg-slate-900/40 border-slate-800 text-slate-500",
    accent: "border-amber-700/40",
  },
  avoid: {
    chip: "bg-rose-500/15 text-rose-300 border-rose-500/30",
    headline: "text-rose-300",
    bar: "bg-rose-500",
    cellActive: "bg-rose-500/20 border-rose-500/40 text-rose-200",
    cellDim: "bg-slate-900/40 border-slate-800 text-slate-500",
    accent: "border-rose-700/40",
  },
};

// Map (highCost,highVelocity) → quadrant. Used to highlight the active 2×2 cell.
function cellQuadrant(
  highCost: boolean,
  highVelocity: boolean,
): BuildVsInvestQuadrant {
  if (!highCost && highVelocity) return "build";
  if (highCost && highVelocity) return "fund";
  if (highCost && !highVelocity) return "wait";
  return "avoid";
}

function buildJsonLd(entry: BuildVsInvestSector, lastModifiedIso: string) {
  const url = `${SITE}/build-vs-invest/${entry.slug}`;
  const meta = QUADRANT_META[entry.quadrant];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: entry.headline,
        description: entry.thesis,
        url,
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        inLanguage: "en",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
      },
      {
        "@type": "Dataset",
        name: `${entry.name} build-vs-invest scores`,
        description: `Cost-to-build (${entry.costToBuild}/100) and deal-velocity (${entry.dealVelocity}/100) scores for ${entry.name}, plus the derived ${meta.short} quadrant verdict.`,
        url,
        creator: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
        },
        keywords: [
          entry.name,
          "build vs invest",
          "venture capital sourcing",
          "engineering acceleration",
          meta.short,
        ],
        license: "https://creativecommons.org/licenses/by/4.0/",
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
          {
            "@type": "ListItem",
            position: 3,
            name: `${entry.name} — ${meta.short} quadrant`,
            item: url,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: entry.faqs.map((f) => ({
          "@type": "Question",
          name: f.question,
          acceptedAnswer: { "@type": "Answer", text: f.answer },
        })),
      },
      {
        "@type": "Claim",
        text: entry.headline,
        about: `${entry.name} — build-vs-invest verdict`,
        author: DATA_NERD_AUTHOR_REF,
        firstAppearance: {
          "@type": "CreativeWork",
          url,
        },
        appearance: {
          "@type": "CreativeWork",
          url,
          datePublished: lastModifiedIso.slice(0, 10),
        },
        datePublished: lastModifiedIso.slice(0, 10),
        inLanguage: "en",
      },
    ],
  };
}

export default async function BuildVsInvestSectorPage({ params }: PageProps) {
  const { sector } = await params;
  const entry = getBuildVsInvestBySlug(sector);
  if (!entry) notFound();

  const meta = QUADRANT_META[entry.quadrant];
  const tone = QUADRANT_TONE[entry.quadrant];
  const lastModifiedIso = getDataLastModified().toISOString();
  const url = `${SITE}/build-vs-invest/${sector}`;

  // Link to the live sector roster if the slug matches the canonical sector
  // taxonomy (it should — see content/build-vs-invest.ts file header).
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const liveSector = sectors.find((s) => s.slug === entry.slug);
  const liveSnapshot = liveSector?.periods[period.slug];
  const trackedCount = liveSnapshot?.startups.length ?? 0;
  const sectorPeriodSlug = liveSector
    ? `${liveSector.slug}-${period.slug}`
    : null;

  // Sibling sectors in the same quadrant — for cross-linking.
  const siblings = buildVsInvestSectors
    .filter((s) => s.quadrant === entry.quadrant && s.slug !== entry.slug)
    .slice(0, 5);

  // 2×2 cell highlight rules.
  const highCost = entry.costToBuild >= 50;
  const highVelocity = entry.dealVelocity >= 50;

  const cells: {
    quadrant: BuildVsInvestQuadrant;
    label: string;
    highCost: boolean;
    highVelocity: boolean;
  }[] = [
    {
      quadrant: cellQuadrant(false, true),
      label: QUADRANT_META.build.label,
      highCost: false,
      highVelocity: true,
    },
    {
      quadrant: cellQuadrant(true, true),
      label: QUADRANT_META.fund.label,
      highCost: true,
      highVelocity: true,
    },
    {
      quadrant: cellQuadrant(false, false),
      label: QUADRANT_META.avoid.label,
      highCost: false,
      highVelocity: false,
    },
    {
      quadrant: cellQuadrant(true, false),
      label: QUADRANT_META.wait.label,
      highCost: true,
      highVelocity: false,
    },
  ];

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={getHreflangLanguages(`/build-vs-invest/${sector}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(buildJsonLd(entry, lastModifiedIso)),
        }}
      />
      <AgentMirrorLinks path={`/build-vs-invest/${sector}`} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/build-vs-invest"
              className="hover:text-gray-300"
            >
              Build vs invest
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{entry.name}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-2">
            <span
              className={`inline-flex items-center px-2 py-0.5 rounded border text-[10px] font-semibold uppercase tracking-wider ${tone.chip}`}
            >
              {meta.short} quadrant
            </span>
            <span className="text-slate-500 text-[10px] uppercase tracking-wider">
              {entry.name} · {period.name}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {entry.name}:{" "}
            <span className={tone.headline}>{meta.label.toLowerCase()}.</span>
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {entry.headline}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            <strong className="text-gray-200">Scope:</strong> {entry.scope}
          </p>
        </header>

        <section
          aria-label="TL;DR"
          className="max-w-3xl mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-4"
        >
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">
            TL;DR — {entry.name}
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {entry.headline}
          </p>
          <p className="mt-2 text-gray-400 text-xs">
            Quadrant: <strong className="text-gray-200">{meta.label}</strong>
            {" "}— {meta.description}. Data refreshed weekly.
          </p>
        </section>

        <p className="text-gray-400 text-sm leading-relaxed mb-6 max-w-3xl" aria-label="Definition">
          <strong className="text-gray-200">Build-vs-invest scoring</strong>{" "}
          measures engineering cost-to-velocity ratio across GitHub
          organizations: a sector where high commit velocity co-occurs with low
          cost-per-commit is a <em className="text-gray-300">build</em>{" "}
          signal (founder-addressable); high velocity with high cost is a{" "}
          <em className="text-gray-300">fund</em> signal (capital-intensive,
          institutional). All scores are derived from the SSRN panel dataset
          and update with each weekly data refresh.
        </p>

        {/* Score panel + 2×2 cell highlight */}
        <section
          aria-label="Scoring panel"
          className="grid lg:grid-cols-2 gap-5"
        >
          {/* Score bars */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-5">
            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-gray-300 text-sm font-semibold">
                  Cost-to-build
                </p>
                <p className="text-gray-100 text-sm font-bold tabular-nums">
                  {entry.costToBuild}
                  <span className="text-slate-500 text-xs">/100</span>
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${tone.bar}`}
                  style={{ width: `${entry.costToBuild}%` }}
                />
              </div>
              <p className="mt-2 text-slate-400 text-xs leading-relaxed">
                {entry.costNote}
              </p>
            </div>

            <div>
              <div className="flex items-baseline justify-between">
                <p className="text-gray-300 text-sm font-semibold">
                  Deal-velocity
                </p>
                <p className="text-gray-100 text-sm font-bold tabular-nums">
                  {entry.dealVelocity}
                  <span className="text-slate-500 text-xs">/100</span>
                </p>
              </div>
              <div className="mt-2 h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full ${tone.bar}`}
                  style={{ width: `${entry.dealVelocity}%` }}
                />
              </div>
              <p className="mt-2 text-slate-400 text-xs leading-relaxed">
                {entry.velocityNote}
              </p>
            </div>

            {trackedCount > 0 && sectorPeriodSlug && (
              <div className="pt-4 border-t border-slate-800">
                <p className="text-slate-400 text-xs leading-relaxed">
                  Live signal: <strong className="text-gray-200 tabular-nums">{trackedCount}</strong>{" "}
                  {entry.name.toLowerCase()} startups currently tracked for{" "}
                  {period.name}.{" "}
                  <Link
                    href={`/startups-to-watch/${sectorPeriodSlug}`}
                    className="text-sky-300 underline decoration-dotted hover:text-sky-200"
                  >
                    See the roster →
                  </Link>
                </p>
              </div>
            )}
          </div>

          {/* 2×2 cell highlight */}
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
              Where {entry.name} lands
            </p>
            <div className="grid grid-cols-[auto_1fr_1fr] grid-rows-[1fr_1fr_auto] gap-px text-[10px]">
              {/* row 1: high velocity */}
              <div className="px-2 py-2 text-slate-500 font-semibold tracking-wider [writing-mode:vertical-rl] rotate-180 text-center">
                ↑ velocity
              </div>
              {cells.slice(0, 2).map((c) => {
                const active =
                  c.highCost === highCost && c.highVelocity === highVelocity;
                return (
                  <div
                    key={`${c.highCost}-${c.highVelocity}`}
                    className={`border rounded p-3 transition-colors min-h-[80px] flex flex-col justify-between ${
                      active ? tone.cellActive : tone.cellDim
                    }`}
                  >
                    <p className="font-semibold text-[10px] uppercase tracking-wider">
                      {QUADRANT_META[c.quadrant].short}
                    </p>
                    <p className="text-[11px] font-medium leading-tight">
                      {c.label}
                    </p>
                  </div>
                );
              })}
              {/* row 2: low velocity */}
              <div className="px-2 py-2" />
              {cells.slice(2, 4).map((c) => {
                const active =
                  c.highCost === highCost && c.highVelocity === highVelocity;
                return (
                  <div
                    key={`${c.highCost}-${c.highVelocity}`}
                    className={`border rounded p-3 transition-colors min-h-[80px] flex flex-col justify-between ${
                      active ? tone.cellActive : tone.cellDim
                    }`}
                  >
                    <p className="font-semibold text-[10px] uppercase tracking-wider">
                      {QUADRANT_META[c.quadrant].short}
                    </p>
                    <p className="text-[11px] font-medium leading-tight">
                      {c.label}
                    </p>
                  </div>
                );
              })}
              {/* row 3: cost axis labels */}
              <div />
              <div className="px-1 pt-2 text-slate-500 font-semibold tracking-wider text-center">
                ← low cost
              </div>
              <div className="px-1 pt-2 text-slate-500 font-semibold tracking-wider text-center">
                high cost →
              </div>
            </div>
            <p
              className={`mt-4 text-sm leading-relaxed text-gray-300 border-l-2 ${tone.accent} pl-3`}
            >
              {meta.description}
            </p>
          </div>
        </section>

        {/* Thesis */}
        <section
          aria-label="Thesis"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider">
            The honest version
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            What the score is really saying.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">{entry.thesis}</p>
        </section>

        {/* Build + fund playbooks side by side */}
        <section
          aria-label="Build and fund playbooks"
          className="grid lg:grid-cols-2 gap-5"
        >
          <div className="rounded-xl border border-emerald-700/30 bg-emerald-950/10 p-5 sm:p-6 space-y-3">
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
              If you are building
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-100">
              The indie playbook.
            </h2>
            <p className="text-emerald-100/80 text-xs leading-relaxed italic">
              Fits when: {entry.buildPlaybook.whenItFits}
            </p>
            <ol className="space-y-2.5 list-none pl-0">
              {entry.buildPlaybook.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-gray-200 text-sm leading-relaxed"
                >
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-bold tabular-nums mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
          <div className="rounded-xl border border-sky-700/30 bg-sky-950/10 p-5 sm:p-6 space-y-3">
            <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
              If you are funding
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-100">
              The investor playbook.
            </h2>
            <p className="text-sky-100/80 text-xs leading-relaxed italic">
              Fits when: {entry.fundPlaybook.whenItFits}
            </p>
            <ol className="space-y-2.5 list-none pl-0">
              {entry.fundPlaybook.steps.map((step, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-gray-200 text-sm leading-relaxed"
                >
                  <span className="flex-shrink-0 inline-flex items-center justify-center w-5 h-5 rounded-full bg-sky-500/20 text-sky-300 text-[11px] font-bold tabular-nums mt-0.5">
                    {i + 1}
                  </span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* FAQ */}
        <section aria-label="Frequently asked questions" className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Frequently asked questions.
          </h2>
          <div className="space-y-3">
            {entry.faqs.map((faq) => (
              <details
                key={faq.question}
                className="group rounded-lg border border-slate-800 bg-slate-900/60"
              >
                <summary className="cursor-pointer p-4 text-gray-100 font-medium text-sm flex items-center justify-between">
                  {faq.question}
                  <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">
                    &#9662;
                  </span>
                </summary>
                <div className="px-4 pb-4">
                  <p className="text-gray-300 text-sm leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </section>

        {/* Sibling sectors */}
        {siblings.length > 0 && (
          <section aria-label="Same quadrant, different sectors" className="space-y-4">
            <h2 className="text-lg sm:text-xl font-bold text-gray-100">
              Same quadrant, different sectors.
            </h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {siblings.map((s) => (
                <Link
                  key={s.slug}
                  href={`/build-vs-invest/${s.slug}`}
                  className="block rounded-lg border border-slate-800 bg-slate-900/60 hover:border-slate-600 hover:bg-slate-900 transition-colors p-4 space-y-1.5"
                >
                  <h3 className="text-gray-100 font-semibold text-sm">
                    {s.name}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed line-clamp-2">
                    {s.headline}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {/* Back to the matrix */}
        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3">
          <h2 className="text-lg font-semibold text-gray-100">
            See the full matrix.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Every sector we track lives somewhere on the 2×2 — the index page
            groups all 20 verdicts in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/build-vs-invest"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-100 text-sm font-semibold transition-colors"
            >
              ← Back to the 2×2
            </Link>
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the Monday email →
            </Link>
          </div>
        </section>

        {/* Escalation ladder — for the reader who's already decided to act */}
        <section
          aria-label="Go deeper on this sector"
          className="rounded-xl border border-sky-700/30 bg-sky-950/10 p-5 sm:p-6 space-y-5"
        >
          <div className="space-y-2">
            <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
              When the verdict isn&rsquo;t enough
            </p>
            <h2 className="text-lg sm:text-xl font-bold text-gray-100">
              You read the quadrant. Now you want the names.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              The free Monday email tells you which way the wind is blowing.
              If {entry.name.toLowerCase()} is the call you&rsquo;re weighing this
              quarter, two faster moves: pull the live teardown on this one
              sector, or watch every sector week over week so you see the team
              pulling ahead before it shows up in someone&rsquo;s deck.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-gray-100 font-semibold text-sm">
                  Pressure-test one sector
                </p>
                <p className="text-gray-100 font-bold text-sm tabular-nums">
                  €7
                </p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed flex-1">
                One sector, one teardown, one sitting. The same read your
                analyst would spend an afternoon on — who&rsquo;s shipping like
                they&rsquo;re about to raise, and who just looks busy. Cheaper
                than the coffee you&rsquo;d buy to ask around.
              </p>
              <Link
                href="https://gitdealflow.com/firstlook"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
              >
                Test one sector — €7 →
              </Link>
            </div>

            <div className="rounded-lg border border-sky-600/40 bg-sky-950/20 p-4 sm:p-5 flex flex-col gap-3">
              <div className="flex items-baseline justify-between gap-2">
                <p className="text-gray-100 font-semibold text-sm">
                  Watch it move every week
                </p>
                <p className="text-gray-100 font-bold text-sm tabular-nums">
                  €49<span className="text-slate-400 text-xs font-medium">/mo</span>
                </p>
              </div>
              <p className="text-gray-400 text-xs leading-relaxed flex-1">
                The standing dashboard across every sector we track — so the
                team that quietly doubled overnight lands in front of you, not
                in front of the partner who beat you to the term sheet. The deck
                lags the work by 21 to 47 days; this is where you spend that
                head start.
              </p>
              <Link
                href="https://gitdealflow.com/dashboard"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
              >
                Get the dashboard — €49/mo →
              </Link>
            </div>
          </div>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={3} />
      </div>
    </>
  );
}
