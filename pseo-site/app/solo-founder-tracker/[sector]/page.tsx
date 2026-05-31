import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getDataLastModified, getCurrentPeriod } from "@/lib/data";
import {
  SOLO_FOUNDER_SECTORS,
  getSoloFounderSectorBySlug,
  type SoloFounderSectorEntry,
} from "@/content/solo-founder-tracker";

interface PageProps {
  params: Promise<{ sector: string }>;
}

const SITE = "https://signals.gitdealflow.com";

export async function generateStaticParams() {
  return SOLO_FOUNDER_SECTORS.map((s) => ({ sector: s.slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector } = await params;
  const entry = getSoloFounderSectorBySlug(sector);
  if (!entry) return {};

  const url = `${SITE}/solo-founder-tracker/${entry.slug}`;
  const title = `${entry.name} — Solo-Founder Tracker (commit / star / contributor thresholds)`;
  const description = `${entry.tagline} Threshold definition, observable acceleration shape, and most common false-positive pattern for spotting one-engineer companies in ${entry.name}.`;

  return {
    title,
    description,
    alternates: { canonical: `/solo-founder-tracker/${entry.slug}` },
    openGraph: {
      title,
      description,
      url,
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: `${entry.name} — Solo-Founder Tracker`,
      description: entry.tagline,
    },
  };
}

function buildJsonLd(entry: SoloFounderSectorEntry): object {
  const url = `${SITE}/solo-founder-tracker/${entry.slug}`;
  const lastModifiedIso = getDataLastModified().toISOString();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Solo-Founder Tracker",
            item: `${SITE}/solo-founder-tracker`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: entry.name,
            item: url,
          },
        ],
      },
      {
        "@type": "WebPage",
        "@id": `${url}#webpage`,
        url,
        name: `${entry.name} — Solo-Founder Tracker`,
        description: entry.tagline,
        inLanguage: "en-US",
        datePublished: lastModifiedIso,
        dateModified: lastModifiedIso,
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]", "[data-agent-summary]"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: `${SITE}/opengraph-image`,
        },
        about: {
          "@type": "Thing",
          name: entry.name,
        },
      },
      {
        "@type": "DefinedTermSet",
        "@id": `${url}#thresholds`,
        name: `Solo-Founder Thresholds — ${entry.name}`,
        description: `Per-sector thresholds for identifying one-engineer companies on GitHub in ${entry.name}.`,
        hasDefinedTerm: [
          {
            "@type": "DefinedTerm",
            name: "Stars (floor)",
            description: `≥${entry.thresholds.stars} stars on the breakout repo.`,
          },
          {
            "@type": "DefinedTerm",
            name: "Commits (rolling 90 days)",
            description: `≥${entry.thresholds.commits90d} default-branch commits in the rolling 90-day window.`,
          },
          {
            "@type": "DefinedTerm",
            name: "Maximum distinct contributors",
            description: `≤${entry.thresholds.maxContributors} distinct human committers (bots excluded).`,
          },
          {
            "@type": "DefinedTerm",
            name: "Top-contributor share",
            description: `≥${Math.round(entry.thresholds.topContributorShare * 100)}% of commits attributable to the top contributor over the ${entry.thresholds.concentrationWindow}.`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: `Why do solo-founder companies emerge in ${entry.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.whyOneFounder,
            },
          },
          {
            "@type": "Question",
            name: `What tooling footprint signals a solo-founder ${entry.name} company?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.toolingFootprint,
            },
          },
          {
            "@type": "Question",
            name: `What acceleration shape should I watch for in ${entry.name}?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.patternToWatch,
            },
          },
          {
            "@type": "Question",
            name: `What is the most common false-positive in ${entry.name} solo-founder signals?`,
            acceptedAnswer: {
              "@type": "Answer",
              text: entry.pitfall,
            },
          },
        ],
      },
      {
        "@type": "ItemList",
        name: `Related Solo-Founder Tracker sectors — ${entry.name}`,
        numberOfItems: entry.relatedSectors.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: entry.relatedSectors
          .map((slug, i) => {
            const r = getSoloFounderSectorBySlug(slug);
            if (!r) return null;
            return {
              "@type": "ListItem",
              position: i + 1,
              name: `${r.name} — Solo-Founder Tracker`,
              url: `${SITE}/solo-founder-tracker/${r.slug}`,
            };
          })
          .filter(Boolean),
      },
      {
        "@type": "WebAPI",
        name: "VC Deal Flow Signal — Public Agent API",
        documentation: `${SITE}/api/openapi.json`,
        endpointURL: [
          `${SITE}/api/signals.json`,
          `${SITE}/api/mcp/rpc`,
          `${SITE}/api/agent/tools`,
        ],
        provider: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: SITE,
        },
      },
    ],
  };
}

export default async function SoloFounderSectorPage({ params }: PageProps) {
  const { sector } = await params;
  const entry = getSoloFounderSectorBySlug(sector);
  if (!entry) notFound();

  const url = `${SITE}/solo-founder-tracker/${entry.slug}`;
  const jsonLd = buildJsonLd(entry);
  const period = getCurrentPeriod();
  const stwSlug = `${entry.slug}-${period.slug}`;
  const related = entry.relatedSectors
    .map((s) => getSoloFounderSectorBySlug(s))
    .filter((s): s is SoloFounderSectorEntry => Boolean(s));

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={getHreflangLanguages(`/solo-founder-tracker/${entry.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/solo-founder-tracker/${entry.slug}`} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <Link
              href="/solo-founder-tracker"
              className="hover:text-gray-300"
            >
              Solo-Founder Tracker
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{entry.name}</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Sector tracker · One-engineer companies · Threshold-driven
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {entry.name} — the{" "}
            <span className="text-sky-400">one-person unicorn</span> lens.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {entry.tagline}
          </p>
        </header>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-3"
          aria-label="Thresholds for this sector"
          data-agent-summary
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Thresholds — {entry.name}
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            What makes a {entry.name} repo &ldquo;solo-founder&rdquo; here
          </h2>
          <dl className="grid sm:grid-cols-2 gap-3 text-sm">
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Stars (floor)
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≥ {entry.thresholds.stars}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Commits (rolling 90d)
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≥ {entry.thresholds.commits90d}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Distinct contributors
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≤ {entry.thresholds.maxContributors}
              </dd>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900 p-3">
              <dt className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Top-contributor share
              </dt>
              <dd className="text-gray-100 text-base font-bold tabular-nums">
                ≥ {Math.round(entry.thresholds.topContributorShare * 100)}%
              </dd>
            </div>
          </dl>
          <p className="text-gray-400 text-xs leading-relaxed">
            Concentration window: {entry.thresholds.concentrationWindow}.
          </p>
        </section>

        <section className="space-y-3">
          <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
            Why one founder, why this sector
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            The shape of one-engineer companies in {entry.name}
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {entry.whyOneFounder}
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
          <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
            Tooling footprint
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            What the codebase looks like
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {entry.toolingFootprint}
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
          <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider">
            Pattern to watch
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The observable acceleration shape
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {entry.patternToWatch}
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-rose-700/40 bg-rose-950/10 p-5 sm:p-6">
          <p className="text-rose-300 text-[10px] font-semibold uppercase tracking-wider">
            Most common false positive
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            What looks like solo-founder signal but isn&rsquo;t
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {entry.pitfall}
          </p>
        </section>

        <section className="space-y-3 rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            Archetype (composite — not a real person)
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The {entry.name} solo-founder shape, in one sentence
          </h2>
          <p className="text-gray-300 text-base leading-relaxed italic">
            {entry.archetype}
          </p>
          <p className="text-gray-500 text-xs leading-relaxed">
            Composite archetype. We don&rsquo;t name founders publicly — that
            edge belongs to dashboard subscribers, not the open web.
          </p>
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="Where to find the live data"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Where the live {entry.name} data lives
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            From this thesis to the working board
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            This page is the editorial lens. The live data feeds are next door.
            /predicted is the weekly all-stage bet. /startups-to-watch ranks
            this sector by acceleration. /firstlook is the paid Dashboard where
            the threshold filter actually runs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href={`/startups-to-watch/${stwSlug}`}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Ranked {entry.name} list →
            </Link>
            <Link
              href="/predicted"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Weekly bets →
            </Link>
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Dashboard access →
            </Link>
          </div>
        </section>

        {related.length > 0 && (
          <section
            className="space-y-3"
            aria-label={`Related Solo-Founder Tracker sectors for ${entry.name}`}
          >
            <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
              Related sectors
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
              Where else this archetype shows up
            </h2>
            <ul className="grid sm:grid-cols-3 gap-3">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link
                    href={`/solo-founder-tracker/${r.slug}`}
                    className="block rounded-lg border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-3 group"
                  >
                    <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider group-hover:text-sky-300">
                      /solo-founder-tracker/{r.slug}
                    </p>
                    <p className="text-gray-100 text-sm font-bold leading-snug">
                      {r.name}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {entry.relatedAnswerSlug && (
          <p className="text-gray-400 text-sm leading-relaxed border-t border-slate-800 pt-6">
            Related answer:{" "}
            <Link
              href={`/answers/${entry.relatedAnswerSlug}`}
              className="text-sky-300 underline decoration-dotted hover:text-sky-200"
            >
              /answers/{entry.relatedAnswerSlug}
            </Link>
            .
          </p>
        )}

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Last reviewed {entry.updatedAt}. Sector entries reviewed monthly.
          Methodology:{" "}
          <Link
            href="/methodology"
            className="text-sky-300 underline decoration-dotted hover:text-sky-200"
          >
            /methodology
          </Link>
          .
        </p>
      </article>
    </>
  );
}
