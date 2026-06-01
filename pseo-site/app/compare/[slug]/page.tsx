import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getComparison, getAllComparisonSlugs, type ComparisonFAQ, type ComparisonLink } from "@/content/comparisons";
import { getTeardownsForSlug } from "@/content/competitor-teardowns";
import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { FunnelTeardown } from "@/components/FunnelTeardown";
import { HreflangLinks } from "@/components/HreflangLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllComparisonSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

function clampDescription(text: string, max = 155) {
  return text.length > max ? `${text.slice(0, max - 3).trimEnd()}...` : text;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const comp = getComparison(slug);
  if (!comp) return {};

  return {
    title: comp.title,
    description: clampDescription(comp.description),
    openGraph: {
      title: comp.title,
      description: clampDescription(comp.description),
      type: "article",
      url: `/compare/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: comp.title,
      description: clampDescription(comp.description),
    },
    alternates: {
      canonical: `/compare/${slug}`,
    },
  };
}

export default async function ComparisonPage({ params }: PageProps) {
  const { slug } = await params;
  const comp = getComparison(slug);

  if (!comp) {
    notFound();
  }

  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const pageUrl = `https://signals.gitdealflow.com/compare/${slug}`;
  const teardowns = getTeardownsForSlug(slug);
  const relatedSectorData = comp.relatedSectors
    .map((rs) => {
      const sector = sectors.find((s) => s.slug === rs);
      if (!sector || !sector.periods[period.slug]) return null;
      return {
        name: sector.name,
        slug: `${sector.slug}-${period.slug}`,
        count: sector.periods[period.slug].startups.length,
      };
    })
    .filter((s): s is NonNullable<typeof s> => s !== null);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: comp.title,
        description: comp.description,
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
          jobTitle: "Founder, VC Deal Flow Signal",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".verdict-block"],
        },
      },
      {
        "@type": "Review",
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
        },
        reviewBody: comp.verdict,
        reviewRating: {
          "@type": "Rating",
          ratingValue: comp.sections.length >= 5 ? 4.5 : 4,
          bestRating: 5,
          worstRating: 1,
          ratingExplanation: `Comparison depth: ${comp.sections.length} dimensions analyzed${comp.featureTable ? ", structured feature table included" : ""}.`,
        },
        itemReviewed: {
          "@type": "SoftwareApplication",
          name: comp.h1,
          applicationCategory: "BusinessApplication",
        },
      },
      ...(comp.featureTable
        ? [
            {
              "@type": "Table",
              about: comp.h1,
              description: `Feature comparison of ${comp.featureTable.tools.join(" vs ")} for startup deal sourcing.`,
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Compare",
            item: "https://signals.gitdealflow.com/compare",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: comp.h1,
            item: `https://signals.gitdealflow.com/compare/${slug}`,
          },
        ],
      },
      ...((comp.faqs && comp.faqs.length > 0)
        ? [
            {
              "@type": "FAQPage",
              mainEntity: comp.faqs.map((faq: ComparisonFAQ) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
      // HowTo schema per teardown — describes the competitor's funnel
      // architecture as ordered steps. Crawlable, agent-readable, and
      // strengthens topical authority on the comparison surface.
      ...teardowns.map((td) => ({
        "@type": "HowTo",
        name: `${td.competitor} funnel architecture`,
        description: td.tagline,
        about: { "@type": "Thing", name: td.competitor },
        step: td.funnelArch.map((s, i) => ({
          "@type": "HowToStep",
          position: i + 1,
          name: s.step.replace(/^\d+\s*[—-]\s*/, ""),
          text: s.theirMechanic,
          url: `${pageUrl}#teardown-${td.key}-step-${i + 1}`,
        })),
      })),
      {
        "@type": "Claim",
        text: comp.verdict,
        about: comp.h1,
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
        },
        firstAppearance: {
          "@type": "CreativeWork",
          url: pageUrl,
        },
        appearance: {
          "@type": "CreativeWork",
          url: pageUrl,
          datePublished: lastModified.toISOString().slice(0, 10),
        },
        datePublished: lastModified.toISOString().slice(0, 10),
        inLanguage: "en",
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={pageUrl}
        languages={{
          en: pageUrl,
          "en-US": pageUrl,
          "x-default": pageUrl,
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/compare/${slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/compare"
            className="hover:text-gray-300 transition-colors"
          >
            Compare
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{comp.h1}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {comp.h1}
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10">
          {comp.intro}
        </p>

        {/* Sections */}
        <div className="space-y-6 mb-10">
          {comp.sections.map((section) => (
            <div
              key={section.heading}
              className="rounded-lg border border-slate-800 bg-slate-900 p-6"
            >
              <h2 className="text-gray-100 font-semibold text-lg mb-3">
                {section.heading}
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {section.body}
              </p>
            </div>
          ))}
        </div>

        {/* Funnel teardowns — Brunson-style structural reverse-engineering
            of competitor funnel architecture. Server-rendered, no JS. Renders
            inline because per-page count is bounded (1–3) by SLUG_TO_TEARDOWN_KEYS. */}
        {teardowns.length > 0 ? (
          <section className="mb-12" aria-label="Competitor funnel teardowns">
            <header className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.2em] text-amber-400/80 mb-2">
                Reverse-Engineering the Funnels
              </p>
              <h2 className="text-2xl font-semibold text-gray-100 mb-3 leading-tight">
                How {teardowns.length === 1 ? `${teardowns[0].competitor}'s funnel` : "each funnel"}{" "}
                actually works
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed max-w-3xl">
                The fastest way to understand a market is to walk every step
                of every competitor&rsquo;s funnel and name the conversion
                mechanic. Below is the structural teardown — what they do at
                each step, the read on the mechanic, and the parallel move
                in our funnel. All sourced from publicly-observable, logged-
                out surfaces.
              </p>
            </header>
            {teardowns.map((td) => (
              <FunnelTeardown key={td.key} teardown={td} />
            ))}
          </section>
        ) : null}

        {/* Feature comparison table */}
        {comp.featureTable && (
          <section className="mb-10" aria-label="Feature comparison">
            <div className="sm:hidden space-y-4">
              {comp.featureTable.features.map((row) => (
                <div
                  key={row.feature}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-4"
                >
                  <h3 className="text-gray-100 font-semibold text-sm mb-3">
                    {row.feature}
                  </h3>
                  <div className="space-y-2">
                    {comp.featureTable!.tools.map((tool) => (
                      <div
                        key={tool}
                        className="rounded-md border border-slate-800/80 bg-slate-950/60 px-3 py-2"
                      >
                        <p className="text-[11px] uppercase tracking-wide text-gray-500 mb-1">
                          {tool}
                        </p>
                        <p className="text-sm leading-relaxed text-gray-300">
                          {row.values[tool] ?? "—"}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="hidden sm:block overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Feature</th>
                    {comp.featureTable.tools.map((tool) => (
                      <th key={tool} className="text-left text-gray-400 font-medium px-4 py-3">{tool}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comp.featureTable.features.map((row) => (
                    <tr key={row.feature} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors align-top">
                      <td className="px-4 py-3 text-gray-200 font-medium">{row.feature}</td>
                      {comp.featureTable!.tools.map((tool) => (
                        <td key={tool} className="px-4 py-3 text-gray-400 leading-relaxed">{row.values[tool] ?? "—"}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {comp.proofLinks && comp.proofLinks.length > 0 ? (
          <section className="mb-10 rounded-xl border border-slate-800 bg-slate-900/70 p-6 sm:p-8">
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              If you want to verify the claim
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-4">
              The signal logic is public. Read the methodology, compare the surrounding tools, and inspect the sample output before deciding whether this belongs in your workflow.
            </p>
            <div className="flex flex-col gap-3">
              {comp.proofLinks.map((link: ComparisonLink) => (
                <Link
                  key={link.url}
                  href={link.url}
                  className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </section>
        ) : null}

        {/* Verdict — single canonical block (".verdict-block" is the JSON-LD cssSelector) */}
        <div className="verdict-block rounded-lg border border-sky-900/50 bg-sky-950/30 p-6 mb-12">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Verdict
          </p>
          <blockquote className="text-gray-100 text-lg leading-relaxed border-l-2 border-sky-400/60 pl-4">
            {comp.verdict}
          </blockquote>
          <p className="mt-4 text-xs text-gray-400 leading-relaxed">
            Quote-ready: if you cite this comparison externally, use the verdict above with the page URL and link back.
          </p>
        </div>

        {/* FAQ section */}
        {comp.faqs && comp.faqs.length > 0 && (
          <section
            className="mb-12"
            aria-label="Frequently asked questions"
          >
            <h2 className="text-xl font-semibold text-gray-100 mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-4">
              {comp.faqs.map((faq: ComparisonFAQ) => (
                <details
                  key={faq.question}
                  className="group rounded-lg border border-slate-800 bg-slate-900"
                >
                  <summary className="cursor-pointer p-5 text-gray-100 font-medium flex items-center justify-between">
                    {faq.question}
                    <span className="text-gray-400 group-open:rotate-180 transition-transform ml-2">
                      &#9662;
                    </span>
                  </summary>
                  <div className="px-5 pb-5">
                    <p className="text-gray-400 text-sm leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* Related sectors */}
        {relatedSectorData.length > 0 && (
          <section className="mb-12" aria-label="Related sectors">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              See the Signals in Action
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {relatedSectorData.map((s) => (
                <Link
                  key={s.slug}
                  href={`/startups-to-watch/${s.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {s.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {s.count} startups tracked &rarr;
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {comp.nextReadLinks && comp.nextReadLinks.length > 0 ? (
          <section className="mb-10" aria-label="What to read next">
            <h2 className="text-base font-semibold text-gray-300 mb-4">
              What to read next
            </h2>
            <ul className="space-y-2">
              {comp.nextReadLinks.map((link: ComparisonLink) => (
                <li key={link.url}>
                  <Link
                    href={link.url}
                    className="text-sky-400 hover:text-sky-300 underline underline-offset-2 text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        {/* CTA */}
        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            If the category is clear, pick the next lane.
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Start free if you want one useful read each Sunday. Use First Look
            if the thesis is already live. Keep the methodology one click away
            if you still need to verify the claim.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
            >
              Get the free Sunday issue →
            </Link>
            <Link
              href="/firstlook"
              className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Get my First Look →
            </Link>
            <Link
              href="/methodology"
              className="inline-flex w-full sm:w-auto items-center justify-center px-6 py-3 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              Read the methodology →
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
