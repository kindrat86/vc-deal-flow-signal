import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  CITIES,
  ALL_CITY_SLUGS,
  REGION_LABELS,
  getCityBySlug,
} from "@/content/cities";
import { HreflangLinks } from "@/components/HreflangLinks";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return ALL_CITY_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const city = getCityBySlug(slug);
  if (!city) return {};

  const title = `${city.name} Engineering & VC Signals (2026) — VC Deal Flow Signal`;
  const description = `${city.name}, ${city.country}: engineering acceleration signals, notable scaleups, active VC anchors, and the local commit-cadence pattern. Editorial interpretation for Corp Dev, PE operating partners, and emerging managers.`;

  return {
    title,
    description,
    openGraph: { title, description, type: "article", url: `/city/${slug}` },
    twitter: { card: "summary_large_image", title, description },
    alternates: { canonical: `/city/${slug}` },
  };
}

export default async function CityPage({ params }: PageProps) {
  const { slug } = await params;
  const city = getCityBySlug(slug);

  if (!city) {
    notFound();
  }

  const pageUrl = `https://signals.gitdealflow.com/city/${slug}`;
  const otherCitiesInRegion = CITIES.filter(
    (c) => c.region === city.region && c.slug !== city.slug,
  ).slice(0, 6);

  const faqs = [
    {
      question: `Which notable engineering orgs are headquartered in ${city.name}?`,
      answer: `${city.notableOrgs.slice(0, 6).join(", ")} are among the publicly-known scaleups anchored in or near ${city.name}. The full list is editorial — discoverable on Crunchbase or each org's careers page.`,
    },
    {
      question: `Which VCs are most active in ${city.name}?`,
      answer: `${city.vcAnchors.slice(0, 5).join(", ")} are firms with named partners and an active engineering-aware lens on ${city.name} deal flow. We do not claim these funds endorse this page — the list is derived from public partner posts and Crunchbase profiles.`,
    },
    {
      question: `When do ${city.name} engineering signals tend to fire?`,
      answer: city.signalPattern,
    },
    {
      question: `Why does ${city.name} matter on the engineering-acceleration map?`,
      answer: city.whyMatters,
    },
    {
      question: `How can a fund or Corp Dev team use this page?`,
      answer: `Two workflows. (1) Source: filter the public engineering-signal panel by ${city.name}'s notable sectors (${city.notableSectors.join(", ")}) and watch for acceleration breaks 3 to 6 weeks before announcements. (2) Validate: when a ${city.name} deal lands in your pipeline, cross-reference the local commit-cadence pattern above to flag false positives. The continent-level live panel is at /startups-to-watch/region/${city.parentGeoSlug}.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${city.name} Engineering & VC Signals`,
        description: city.ecosystem,
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
        about: {
          "@type": "City",
          name: city.name,
          containedInPlace: {
            "@type": "Country",
            name: city.country,
            identifier: city.countryCode,
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: city.lat,
            longitude: city.lng,
          },
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".ecosystem", ".why-matters"],
        },
      },
      {
        "@type": "ItemList",
        name: `${city.name} — Notable Engineering Orgs`,
        itemListOrder: "Unordered",
        numberOfItems: city.notableOrgs.length,
        itemListElement: city.notableOrgs.map((org, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: org,
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
            name: "Cities",
            item: "https://signals.gitdealflow.com/city",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: REGION_LABELS[city.region],
            item: `https://signals.gitdealflow.com/city#${city.region.toLowerCase()}`,
          },
          {
            "@type": "ListItem",
            position: 4,
            name: city.name,
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
          <Link href="/city" className="hover:text-gray-300 transition-colors">
            Cities
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{city.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {city.name} — Engineering & VC Signals
        </h1>
        <p className="text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {city.country} &middot; {REGION_LABELS[city.region]} &middot; established as a
          tracked hub {city.established}
        </p>

        <p className="ecosystem text-gray-400 text-base leading-relaxed mb-10">
          {city.ecosystem}
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{city.populationMillions}M</p>
            <p className="text-xs text-gray-400 mt-1">Population</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{city.notableOrgs.length}</p>
            <p className="text-xs text-gray-400 mt-1">Tracked orgs</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{city.vcAnchors.length}</p>
            <p className="text-xs text-gray-400 mt-1">VC anchors</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{city.notableSectors.length}</p>
            <p className="text-xs text-gray-400 mt-1">Active sectors</p>
          </div>
        </div>

        <section className="mb-10 why-matters" aria-label="Why this city matters">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why {city.name} matters on the engineering-acceleration map
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{city.whyMatters}</p>
        </section>

        <section className="mb-10" aria-label="Signal pattern">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Local signal pattern
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{city.signalPattern}</p>
        </section>

        <section className="mb-10" aria-label="Active sectors">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Active sectors</h2>
          <div className="flex flex-wrap gap-2">
            {city.notableSectors.map((sector) => (
              <span
                key={sector}
                className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-gray-300"
              >
                {sector}
              </span>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="Notable engineering orgs">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Notable engineering orgs
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {city.notableOrgs.map((org) => (
              <div
                key={org}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-gray-200"
              >
                {org}
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10" aria-label="VC anchors">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            VC anchors active in {city.name}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {city.vcAnchors.map((vc) => (
              <div
                key={vc}
                className="rounded-lg border border-slate-800 bg-slate-900 px-3 py-2 text-sm text-gray-200"
              >
                {vc}
              </div>
            ))}
          </div>
        </section>

        <div className="rounded-lg border border-sky-900/50 bg-sky-950/30 p-5 mb-10">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            Drill into live data
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            For the live continent-level engineering-acceleration panel covering{" "}
            {REGION_LABELS[city.region]}, see{" "}
            <Link
              href={`/startups-to-watch/region/${city.parentGeoSlug}`}
              className="text-sky-400 hover:text-sky-300 underline"
            >
              /startups-to-watch/region/{city.parentGeoSlug}
            </Link>
            . The public dataset resolves to coarse continents, not per-city; this page is
            the editorial lens for reading the panel through {city.name}'s context.
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

        {otherCitiesInRegion.length > 0 && (
          <section className="mb-12" aria-label="Other cities in region">
            <h2 className="text-lg font-semibold text-gray-100 mb-4">
              Other {REGION_LABELS[city.region]} cities
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {otherCitiesInRegion.map((c) => (
                <Link
                  key={c.slug}
                  href={`/city/${c.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {c.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {c.country} &middot; {c.notableSectors.slice(0, 3).join(", ")}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8 text-center">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Get the weekly engineering signal for {REGION_LABELS[city.region]}
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            Engineering acceleration in your region, surfaced 3 to 6 weeks before the
            announcement.
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
