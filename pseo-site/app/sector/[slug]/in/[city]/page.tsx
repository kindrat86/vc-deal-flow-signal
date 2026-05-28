import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllSectorCityPairs,
  getSectorCity,
} from "@/content/sector-city";
import { getCompaniesInSector } from "@/content/sectors";
import { getCompaniesInSectorAndCity } from "@/content/company-locations";
import { REGION_LABELS } from "@/content/cities";
import { HreflangLinks } from "@/components/HreflangLinks";

interface PageProps {
  params: Promise<{ slug: string; city: string }>;
}

export async function generateStaticParams() {
  return getAllSectorCityPairs().map((pair) => ({
    slug: pair.sector,
    city: pair.city,
  }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug, city } = await params;
  const data = getSectorCity(slug, city);
  if (!data) return {};

  const title = `${data.sector.name} in ${data.city.name} — Engineering & VC Signals (2026)`;
  const description = `${data.sector.name} scouting and engineering-acceleration signal interpretation through a ${data.city.name} lens. Local VC anchors, sector signal pattern, and curated companies tracked in the ${data.sector.name.toLowerCase()} corpus.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/sector/${slug}/in/${city}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/sector/${slug}/in/${city}` },
  };
}

export default async function SectorInCityPage({ params }: PageProps) {
  const { slug, city } = await params;
  const data = getSectorCity(slug, city);

  if (!data) {
    notFound();
  }

  const { sector, city: cityObj } = data;
  const pageUrl = `https://signals.gitdealflow.com/sector/${slug}/in/${city}`;

  // Real curated intersection: companies HQ'd in this city in this sector.
  const localCompanies = getCompaniesInSectorAndCity(sector.slug, city);
  // Broader sector roster as a fallback when local set is empty or small.
  const sectorCompanies = getCompaniesInSector(sector.slug).slice(0, 8);

  const faqs = [
    {
      question: `What does ${sector.name.toLowerCase()} engineering look like in ${cityObj.name}?`,
      answer: `${cityObj.signalPattern} ${cityObj.whyMatters}`,
    },
    {
      question: `Which VCs are most active in ${sector.name.toLowerCase()} deals from ${cityObj.name}?`,
      answer: `${cityObj.vcAnchors.slice(0, 5).join(", ")} are the publicly identifiable venture firms with named partners and an active engineering-aware lens in ${cityObj.name}. We do not claim these funds focus exclusively on ${sector.name.toLowerCase()} — the list is editorial inference from their published thesis material.`,
    },
    {
      question: `Which curated ${sector.name.toLowerCase()} companies should I watch?`,
      answer:
        localCompanies.length > 0
          ? `${localCompanies
              .map((c) => c.name)
              .join(", ")} are tracked ${sector.name.toLowerCase()} companies HQ'd in or near ${cityObj.name} per our company-location map. The broader sector roster is at /sector/${sector.slug}.`
          : `${sectorCompanies
              .slice(0, 5)
              .map((c) => c.name)
              .join(", ")} are among the ${sector.name.toLowerCase()} companies VC Deal Flow Signal tracks globally. We do not currently document a ${cityObj.name}-HQ'd company in this sector in our curated corpus — broader regional coverage is at /startups-to-watch/region/${cityObj.parentGeoSlug}.`,
    },
    {
      question: `Why does the intersection of ${sector.name} and ${cityObj.name} matter for sourcing?`,
      answer: `${cityObj.whyMatters} For ${sector.name.toLowerCase()} specifically: ${sector.whyItMatters}`,
    },
    {
      question: `How does the live data resolve ${cityObj.name}?`,
      answer: `The public dataset resolves to coarse continents (US, EU, APAC, LATAM, Canada). For ${cityObj.name}, the relevant live panel is /startups-to-watch/region/${cityObj.parentGeoSlug}. This intersection page is the editorial lens through which to read that continent panel for ${sector.name.toLowerCase()}-focused queries in ${cityObj.name}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${sector.name} in ${cityObj.name}`,
        description: `${sector.name} signal interpretation and VC anchors through a ${cityObj.name} lens.`,
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        about: [
          { "@type": "Thing", name: sector.name },
          {
            "@type": "City",
            name: cityObj.name,
            containedInPlace: {
              "@type": "Country",
              name: cityObj.country,
              identifier: cityObj.countryCode,
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: cityObj.lat,
              longitude: cityObj.lng,
            },
          },
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".tagline", ".composition"],
        },
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
            name: "Sector Hubs",
            item: "https://signals.gitdealflow.com/sector",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: sector.name,
            item: `https://signals.gitdealflow.com/sector/${slug}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: `in ${cityObj.name}`,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={pageUrl}
        languages={{ en: pageUrl, "en-US": pageUrl, "x-default": pageUrl }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href="/sector" className="hover:text-gray-300 transition-colors">
            Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/sector/${slug}`} className="hover:text-gray-300 transition-colors">
            {sector.name}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">in {cityObj.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {sector.name} in {cityObj.name}
        </h1>
        <p className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          Engineering acceleration & VC anchors at the {sector.name.toLowerCase()} ×{" "}
          {cityObj.name} intersection.
        </p>
        <p className="composition text-gray-400 text-base leading-relaxed mb-10">
          This page is the editorial composition of two of our hubs:{" "}
          <Link
            href={`/sector/${slug}`}
            className="text-sky-400 hover:text-sky-300 underline"
          >
            /sector/{slug}
          </Link>{" "}
          (the curated sector hub) and{" "}
          <Link
            href={`/city/${city}`}
            className="text-sky-400 hover:text-sky-300 underline"
          >
            /city/{city}
          </Link>{" "}
          (the local engineering scene). Use it as the lens for reading
          {sector.name.toLowerCase()} signal in {cityObj.name} — local commit cadence,
          active VCs, scouting context. Live data resolves to coarse continents; this
          intersection is the editorial reading frame.
        </p>

        <section className="mb-10" aria-label="Local signal pattern">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How {sector.name.toLowerCase()} engineering reads in {cityObj.name}
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed mb-3">{cityObj.signalPattern}</p>
          <p className="text-gray-400 text-sm leading-relaxed">
            For broader {sector.name.toLowerCase()} interpretation: {sector.whyItMatters}
          </p>
        </section>

        <section className="mb-10" aria-label="Why this combination matters">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why {cityObj.name} matters for {sector.name.toLowerCase()} sourcing
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{cityObj.whyMatters}</p>
        </section>

        <section className="mb-10" aria-label="VC anchors">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            VC anchors active in {cityObj.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {cityObj.vcAnchors.map((vc) => (
              <div
                key={vc}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-gray-200"
              >
                {vc}
              </div>
            ))}
          </div>
        </section>

        {localCompanies.length > 0 && (
          <section className="mb-10" aria-label="Local tracked companies">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Tracked {sector.name.toLowerCase()} companies HQ'd in {cityObj.name}
            </h2>
            <p className="text-gray-500 text-xs mb-4">
              The actual {sector.name.toLowerCase()} × {cityObj.name} intersection from
              our curated company-location map — verified primary-HQ companies, not just
              cross-sector cross-link aggregation.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {localCompanies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/signal/${c.slug}`}
                  className="group block rounded-lg border border-sky-900/50 bg-sky-950/30 p-4 hover:border-sky-600 transition-all"
                >
                  <h3 className="text-gray-100 font-medium text-sm group-hover:text-sky-300 transition-colors mb-1">
                    {c.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {c.stage.replace("-", " ")} &middot; github.com/{c.githubOrg}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {sectorCompanies.length > 0 && (
          <section className="mb-10" aria-label="Tracked sector companies (broader)">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              {localCompanies.length > 0
                ? `Other ${sector.name.toLowerCase()} companies to cross-reference`
                : `Curated ${sector.name.toLowerCase()} companies we track`}
            </h2>
            <p className="text-gray-500 text-xs mb-4">
              {localCompanies.length > 0
                ? `Broader ${sector.name.toLowerCase()} roster (not necessarily ${cityObj.name}-HQ'd). Use as the cross-reference set when evaluating local ${cityObj.name} engineering signals.`
                : `We do not currently document a ${cityObj.name}-HQ'd company in ${sector.name.toLowerCase()} in our curated corpus. The companies below are the global ${sector.name.toLowerCase()} corpus you would cross-reference against ${cityObj.name} local signals.`}
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {sectorCompanies.map((c) => (
                <Link
                  key={c.slug}
                  href={`/signal/${c.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {c.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {c.stage.replace("-", " ")} &middot; github.com/{c.githubOrg}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5 mb-10">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Drill into live data
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            For the live continent-level {sector.name.toLowerCase()} signal panel covering{" "}
            {REGION_LABELS[cityObj.region]}, see{" "}
            <Link
              href={`/startups-to-watch/region/${cityObj.parentGeoSlug}`}
              className="text-sky-400 hover:text-sky-300 underline"
            >
              /startups-to-watch/region/{cityObj.parentGeoSlug}
            </Link>
            . Combine with the {cityObj.name} signal pattern above to weight local
            relevance.
          </p>
        </div>

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {faqs.map((faq) => (
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
                  <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            ))}
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get the weekly {sector.name} digest
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Filtered to {REGION_LABELS[cityObj.region]} momentum, 3 to 6 weeks before
            announcements.
          </p>
          <Link
            href="/firstlook"
            className="inline-block rounded-md bg-sky-500 px-5 py-2 text-sm font-semibold text-white hover:bg-sky-400 transition-colors"
          >
            See First Look
          </Link>
        </div>
      </div>
    </>
  );
}
