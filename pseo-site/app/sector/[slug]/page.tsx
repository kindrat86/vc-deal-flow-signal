import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getSector,
  getAllSectorSlugs,
  getCompaniesInSector,
  getFundsInSector,
  getFoundersInSector,
  getGlossaryTermsForSector,
  getSectorKeyStats,
  sectors,
} from "@/content/sectors";
import { REFERENCE_PROFILE_REVIEWED } from "@/content/companies";
import { HreflangLinks } from "@/components/HreflangLinks";
import SeoCta from "@/components/SeoCta";
import SignalDisclaimer from "@/components/SignalDisclaimer";
import DefinitionBlock from "@/components/DefinitionBlock";
import { buildSourceTruthDataset } from "@/lib/dataset-schema";
import CitableStat from "@/components/CitableStat";
import { citableStat } from "@/lib/citable-stats";
import { withEditorialOverride } from "@/lib/metadata";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSectorSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 604800;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const s = getSector(slug);
  if (!s) return {};

  return withEditorialOverride({
    title: s.title,
    description: s.metaDescription,
    openGraph: {
      title: s.title,
      description: s.metaDescription,
      type: "article",
      url: `/sector/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: s.title,
      description: s.metaDescription,
    },
    alternates: {
      canonical: `/sector/${slug}`,
    },
  });
}

export default async function SectorHubPage({ params }: PageProps) {
  const { slug } = await params;
  const s = getSector(slug);

  if (!s) {
    notFound();
  }

  const companiesInSector = getCompaniesInSector(slug);
  const fundsInSector = getFundsInSector(slug);
  const foundersInSector = getFoundersInSector(slug);
  const glossaryForSector = getGlossaryTermsForSector(slug).slice(0, 12);
  const keyStats = getSectorKeyStats(slug);
  const otherSectors = sectors.filter((o) => o.slug !== slug);

  const pageUrl = `https://signals.gitdealflow.com/sector/${slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        url: pageUrl,
        name: s.h1,
        description: s.metaDescription,
        about: {
          "@type": "Thing",
          name: s.name,
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", ".tagline", ".what-we-track", ".key-stats"],
        },
      },
      {
        "@type": "ItemList",
        name: `${s.name}: Tracked Companies`,
        itemListOrder: "Unordered",
        numberOfItems: companiesInSector.length,
        itemListElement: companiesInSector.map((c, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/signal/${c.slug}`,
          name: c.name,
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
            name: "Sector Hubs",
            item: "https://signals.gitdealflow.com/sector",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: s.name,
            item: pageUrl,
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: s.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      buildSourceTruthDataset({
        url: pageUrl,
        name: `${s.name}: Engineering Velocity Signals`,
        description: `Derived engineering-velocity statistics for ${s.name} venture-backed startups tracked by the VC Deal Flow Signal (GitDealFlow) GitHub panel. ${s.metaDescription}`,
        variableMeasured: keyStats.map((k) => ({
          name: k.label,
          value: k.value,
          description: k.detail,
        })),
        keywords: [s.name, "venture capital", "engineering velocity", "GitHub", "startups"],
      }),
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
          <span className="text-gray-400">{s.name}</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          {s.h1}
        </h1>
        <DefinitionBlock
          text={`${s.name} startups tracked by public GitHub engineering acceleration: commit velocity, contributor growth, and repository expansion. This hub lists the sector's leading teams and the metrics investors use to read momentum.`}
        />
        <p data-speakable className="tagline text-sky-400 text-base leading-relaxed mb-6 font-medium">
          {s.tagline}
        </p>
        <p className="text-gray-400 text-base leading-relaxed mb-3">{s.intro}</p>
        <CitableStat {...citableStat("sector")} template="sector" />
        <div className="mb-8 rounded-lg border border-sky-900/60 bg-sky-950/30 p-4 sm:p-5">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-sky-400">
            Analyst note
          </p>
          <p className="text-gray-300 text-sm leading-relaxed sm:text-base">{s.analystNote}</p>
        </div>
        {keyStats.length > 0 && (
          <div
            data-speakable
            className="key-stats mb-8 rounded-lg border border-emerald-900/50 bg-emerald-950/20 p-4 sm:p-5"
          >
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-emerald-400">
              Key stats
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {keyStats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-lg border border-slate-800 bg-slate-900/70 p-3"
                >
                  <p className="text-2xl font-bold text-emerald-300">{stat.value}</p>
                  <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-gray-200">
                    {stat.label}
                  </p>
                  <p className="mt-1 text-xs text-gray-400 leading-snug">{stat.detail}</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-[11px] text-gray-500 leading-relaxed">
              Figures are editorially curated benchmark values (reviewed{" "}
              {REFERENCE_PROFILE_REVIEWED}), computed across this hub&apos;s{" "}
              {companiesInSector.length} tracked orgs, not live GitHub measurements.
            </p>
          </div>
        )}
        <SignalDisclaimer className="mb-10" />

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{companiesInSector.length}</p>
            <p className="text-xs text-gray-400 mt-1">Tracked companies</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{fundsInSector.length}</p>
            <p className="text-xs text-gray-400 mt-1">Active funds</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-4 text-center">
            <p className="text-2xl font-bold text-sky-400">{foundersInSector.length}</p>
            <p className="text-xs text-gray-400 mt-1">Engineering leaders</p>
          </div>
        </div>

        <section className="mb-10 what-we-track" aria-label="What we track">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">What we track</h2>
          <p className="text-gray-400 text-sm leading-relaxed">{s.whatWeTrack}</p>
        </section>

        <section className="mb-10" aria-label="Why it matters">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Why this sector matters for Corp Dev, PE, and emerging managers
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">{s.whyItMatters}</p>
        </section>

        {companiesInSector.length > 0 && (
          <section className="mb-10" aria-label="Tracked companies">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Tracked Companies in {s.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {companiesInSector.map((c) => (
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

        {fundsInSector.length > 0 && (
          <section className="mb-10" aria-label="Active funds">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Active Funds Investing in {s.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fundsInSector.map((f) => (
                <Link
                  key={f.slug}
                  href={`/fund/${f.slug}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {f.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {f.hq} &middot; {f.stageFocus}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {foundersInSector.length > 0 && (
          <section className="mb-10" aria-label="Engineering leaders">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Engineering Leaders in {s.name}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {foundersInSector.map((p) => (
                <Link
                  key={p.handle}
                  href={`/founder/${p.handle}`}
                  className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
                >
                  <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                    {p.name}
                  </h3>
                  <p className="text-gray-400 text-xs">
                    {p.role} &middot; {p.affiliation}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        {glossaryForSector.length > 0 && (
          <section className="mb-10" aria-label="Relevant terms">
            <h2 className="text-xl font-semibold text-gray-100 mb-4">
              Relevant Terms in {s.name}
            </h2>
            <div className="flex flex-wrap gap-2">
              {glossaryForSector.map((g) => (
                <Link
                  key={g.id}
                  href={`/glossary#${g.id}`}
                  className="rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-gray-300 hover:border-slate-600 hover:text-sky-400 transition-all"
                >
                  {g.term}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="mb-12" aria-label="Frequently asked questions">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Frequently Asked Questions
          </h2>
          <div className="space-y-4">
            {s.faqs.map((faq) => (
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

        <section className="mb-12" aria-label="Other sectors">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Other Sector Hubs</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {otherSectors.map((o) => (
              <Link
                key={o.slug}
                href={`/sector/${o.slug}`}
                className="group block rounded-lg border border-slate-800 bg-slate-900 p-4 hover:border-slate-600 transition-all"
              >
                <h3 className="text-gray-200 font-medium text-sm group-hover:text-sky-400 transition-colors mb-1">
                  {o.name}
                </h3>
                <p className="text-gray-400 text-xs">{o.tagline}</p>
              </Link>
            ))}
          </div>
        </section>

        <SeoCta
          heading={`Get the weekly ${s.name} signal, before the round gets crowded`}
          secondary={{ label: "See First Look (€7)", href: "/firstlook" }}
          signoffIndex={0}
        />
      </div>
    </>
  );
}
