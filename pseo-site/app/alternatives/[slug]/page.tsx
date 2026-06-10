import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { alternatives, getAlternative, getAllAlternativeSlugs, type AlternativeFAQ } from "@/content/alternatives";
import { useCases } from "@/content/use-cases";
import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import SeoCta from "@/components/SeoCta";
import SignalDisclaimer from "@/components/SignalDisclaimer";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllAlternativeSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const alt = getAlternative(slug);
  if (!alt) return {};

  return {
    title: alt.title,
    description: alt.description,
    openGraph: {
      title: alt.title,
      description: alt.description,
      type: "article",
      url: `/alternatives/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: alt.title,
      description: alt.description,
    },
    alternates: {
      canonical: `/alternatives/${slug}`,
    },
  };
}

export default async function AlternativePage({ params }: PageProps) {
  const { slug } = await params;
  const alt = getAlternative(slug);

  if (!alt) {
    notFound();
  }

  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const pageUrl = `https://signals.gitdealflow.com/alternatives/${slug}`;

  const relatedSectorData = alt.relatedSectors
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
        headline: alt.title,
        description: alt.description,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", ".verdict-block", ".tagline"],
        },
      },
      {
        "@type": "Review",
        author: DATA_NERD_AUTHOR_REF,
        reviewBody: alt.verdict,
        reviewRating: {
          "@type": "Rating",
          ratingValue: 4.5,
          bestRating: 5,
          worstRating: 1,
          ratingExplanation: `Structured comparison across ${alt.sections.length} dimensions plus feature table.`,
        },
        itemReviewed: {
          "@type": "SoftwareApplication",
          name: alt.competitor,
          applicationCategory: "BusinessApplication",
          url: alt.competitorUrl,
        },
      },
      {
        "@type": "SoftwareApplication",
        name: "VC Deal Flow Signal",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web, MCP, Email, RSS, Telegram",
        url: "https://gitdealflow.com",
        offers: [
          {
            "@type": "Offer",
            name: "Free Signal Report",
            price: "0",
            priceCurrency: "EUR",
            availability: "https://schema.org/InStock",
            description: "Weekly email with 5 breakout startups ranked by GitHub commit-velocity acceleration.",
          },
          {
            "@type": "Offer",
            name: "Dashboard (Beta)",
            price: "9.97",
            priceCurrency: "EUR",
            priceValidUntil: "2026-12-31",
            availability: "https://schema.org/InStock",
            description: "Full dashboard: 140 ranked startups, sector/stage/geography filters, MCP access.",
            priceSpecification: {
              "@type": "UnitPriceSpecification",
              price: "9.97",
              priceCurrency: "EUR",
              unitCode: "MON",
              referenceQuantity: {
                "@type": "QuantitativeValue",
                value: 1,
                unitCode: "MON",
              },
            },
          },
        ],
      },
      {
        "@type": "Table",
        about: alt.h1,
        description: `Feature comparison of ${alt.featureTable.tools.join(" vs ")} for startup deal sourcing.`,
      },
      ...(alt.roundup
        ? [
            {
              "@type": "ItemList",
              name: alt.roundup.heading,
              description: alt.roundup.intro,
              numberOfItems: alt.roundup.tools.length,
              itemListElement: alt.roundup.tools.map((tool, i) => ({
                "@type": "ListItem",
                position: i + 1,
                item: {
                  "@type": "SoftwareApplication",
                  name: tool.name,
                  applicationCategory: "BusinessApplication",
                  url: tool.url,
                  description: `${tool.signal}. Free tier: ${tool.free}. Best for: ${tool.bestFor}.`,
                },
              })),
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
            name: "Alternatives",
            item: "https://signals.gitdealflow.com/alternatives",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: alt.h1,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: alt.faqs.map((faq: AlternativeFAQ) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "Claim",
        text: alt.verdict,
        about: alt.h1,
        author: DATA_NERD_AUTHOR_REF,
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
      <AgentMirrorLinks path={`/alternatives/${slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href="/alternatives" className="hover:text-gray-300 transition-colors">
            Alternatives
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{alt.h1}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {alt.h1}
        </h1>
        <p data-speakable className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {alt.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-3">
          {alt.intro}
        </p>
        <p className="text-xs text-gray-500 mb-1">
          Data refreshed:{" "}
          {lastModified.toLocaleDateString("en-US", {
            month: "long",
            year: "numeric",
          })}
        </p>
        <SignalDisclaimer className="mb-10" />

        {alt.roundup && (
          <section className="mb-12" aria-label={alt.roundup.heading}>
            <h2 className="text-xl font-semibold text-gray-100 mb-3">
              {alt.roundup.heading}
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed mb-5">
              {alt.roundup.intro}
            </p>
            <div className="overflow-x-auto rounded-lg border border-slate-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-900/60">
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Tool</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Free tier</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Signal type</th>
                    <th className="text-left text-gray-400 font-medium px-4 py-3">Best for</th>
                  </tr>
                </thead>
                <tbody>
                  {alt.roundup.tools.map((tool) => (
                    <tr
                      key={tool.name}
                      className={`border-b border-slate-800/60 last:border-0 transition-colors ${
                        tool.isUs ? "bg-sky-950/30" : "hover:bg-slate-800/40"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">
                        <a
                          href={tool.url}
                          rel={tool.isUs ? undefined : "nofollow noopener"}
                          target={tool.isUs ? undefined : "_blank"}
                          className={tool.isUs ? "text-sky-400" : "text-gray-200 hover:text-gray-100"}
                        >
                          {tool.name}
                        </a>
                        {tool.isUs && (
                          <span className="ml-2 text-[10px] uppercase tracking-wider text-sky-500">
                            this site
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-400">{tool.free}</td>
                      <td className="px-4 py-3 text-gray-400">{tool.signal}</td>
                      <td className="px-4 py-3 text-gray-400">{tool.bestFor}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        <div className="space-y-6 mb-10">
          {alt.sections.map((section) => (
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

        <div className="overflow-x-auto rounded-lg border border-slate-800 mb-10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-800 bg-slate-900/60">
                <th className="text-left text-gray-400 font-medium px-4 py-3">Feature</th>
                {alt.featureTable.tools.map((tool) => (
                  <th key={tool} className="text-left text-gray-400 font-medium px-4 py-3">{tool}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {alt.featureTable.features.map((row) => (
                <tr key={row.feature} className="border-b border-slate-800/60 last:border-0 hover:bg-slate-800/40 transition-colors">
                  <td className="px-4 py-3 text-gray-200 font-medium">{row.feature}</td>
                  {alt.featureTable.tools.map((tool) => (
                    <td key={tool} className="px-4 py-3 text-gray-400">{row.values[tool] ?? "—"}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-6">
            <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
              Pick VC Deal Flow Signal if
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {alt.whenToPick.us}
            </p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-6">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">
              Pick {alt.competitor} if
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              {alt.whenToPick.them}
            </p>
          </div>
        </div>

        <div className="verdict-block rounded-lg border border-sky-900/50 bg-sky-950/30 p-6 mb-12">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Verdict
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {alt.verdict}
          </p>
        </div>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {alt.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other alternatives">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Other Alternatives to Compare
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {alternatives
              .filter((a) => a.slug !== slug)
              .slice(0, 6)
              .map((a) => (
                <Link
                  key={a.slug}
                  href={`/alternatives/${a.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {a.h1}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {a.tagline}
                  </p>
                </Link>
              ))}
          </div>
        </section>

        <section className="mb-12" aria-label="Related use cases">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">
            Related Use Cases
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {useCases
              .filter((u) =>
                u.relatedAlternatives?.includes(slug) ||
                u.relatedSectors?.some((rs) => alt.relatedSectors.includes(rs))
              )
              .slice(0, 6)
              .map((u) => (
                <Link
                  key={u.slug}
                  href={`/use-cases/${u.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {u.persona}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {u.tagline}
                  </p>
                </Link>
              ))}
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Try the engineering signal approach
          </h2>
          <p className="text-gray-400 text-sm mb-5 max-w-lg mx-auto">
            Get this week&apos;s top 5 breakout startups ranked by
            GitHub engineering acceleration. Free, no spam.
          </p>
          <Link
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-6 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition-colors"
          >
            Get the Report
          </Link>
        </div>

        <div className="mt-6">
          <SeoCta
            secondary={{ label: "Test one sector — First Look €7", href: "/firstlook" }}
            signoffIndex={1}
          />
        </div>
      </div>
    </>
  );
}
