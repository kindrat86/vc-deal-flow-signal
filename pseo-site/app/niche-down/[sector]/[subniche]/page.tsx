import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";
import {
  getAllNichePairs,
  getNiche,
  getNicheSector,
  buildCostLabel,
  dealVelocityLabel,
  type BuildCost,
  type DealVelocity,
} from "@/content/niches";
import { getDataLastModified } from "@/lib/data";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ sector: string; subniche: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return getAllNichePairs();
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector: sectorSlug, subniche: nicheSlug } = await params;
  const found = getNiche(sectorSlug, nicheSlug);
  if (!found) return {};
  const { sector, niche } = found;

  const title = `${niche.name}, niche opportunity inside ${sector.name}`;
  const description = `${niche.pitch} Build cost: ${buildCostLabel(niche.buildCost)}. Deal velocity: ${dealVelocityLabel(niche.dealVelocity)}.`;
  const url = `${SITE}/niche-down/${sector.slug}/${niche.slug}`;
  return {
    title,
    description,
    alternates: {
      canonical: `/niche-down/${sector.slug}/${niche.slug}`,
    },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const BUILD_COST_TONE: Record<BuildCost, string> = {
  weekend: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  month: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  quarter: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  team: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};
const DEAL_VELOCITY_TONE: Record<DealVelocity, string> = {
  trickle: "bg-slate-500/15 text-slate-300 border-slate-500/30",
  steady: "bg-sky-500/15 text-sky-300 border-sky-500/30",
  hot: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  frothy: "bg-rose-500/15 text-rose-300 border-rose-500/30",
};

export default async function NicheLeafPage({ params }: PageProps) {
  const { sector: sectorSlug, subniche: nicheSlug } = await params;
  const found = getNiche(sectorSlug, nicheSlug);
  if (!found) notFound();

  const { sector, niche } = found;
  const url = `${SITE}/niche-down/${sector.slug}/${niche.slug}`;
  const lastModified = getDataLastModified().toISOString();

  // Adjacent sub-niches in the same sector (for cross-linking)
  const adjacent = sector.niches.filter((n) => n.slug !== niche.slug).slice(0, 4);

  // Related sectors, pick 3 alphabetically-adjacent
  const sectorIndex = sector ? getNicheSector(sector.slug) : null;
  void sectorIndex;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: `${niche.name}, niche opportunity inside ${sector.name}`,
        description: niche.pitch,
        url,
        datePublished: lastModified,
        dateModified: lastModified,
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".niche-pitch", "[data-speakable]"],
        },
        about: {
          "@type": "Thing",
          name: `${sector.name}, ${niche.name}`,
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Niche-down", item: `${SITE}/niche-down` },
          { "@type": "ListItem", position: 3, name: sector.name, item: `${SITE}/niche-down/${sector.slug}` },
          { "@type": "ListItem", position: 4, name: niche.name, item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: niche.faqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={getHreflangLanguages(`/niche-down/${sector.slug}/${niche.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/niche-down/${sector.slug}/${niche.slug}`} />

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/niche-down" className="hover:text-gray-300">Niche-down</Link>
            <span className="mx-2">/</span>
            <Link href={`/niche-down/${sector.slug}`} className="hover:text-gray-300">{sector.name}</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{niche.name}</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {sector.name} · sub-niche
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {niche.name}.
          </h1>
          <p
            className="niche-pitch text-gray-200 text-lg sm:text-xl leading-relaxed font-light"
            data-speakable
          >
            {niche.pitch}
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${BUILD_COST_TONE[niche.buildCost]}`}
              title="How much upfront commitment a builder needs"
            >
              {buildCostLabel(niche.buildCost)}
            </span>
            <span
              className={`inline-flex items-center px-2.5 py-1 rounded-md border text-[10px] font-semibold uppercase tracking-wider ${DEAL_VELOCITY_TONE[niche.dealVelocity]}`}
              title="How fast funded companies are landing in this category"
            >
              {dealVelocityLabel(niche.dealVelocity)}
            </span>
          </div>
        </header>

        <section className="space-y-3" aria-label="Why now">
          <h2 className="text-xs text-amber-300 font-semibold uppercase tracking-wider">
            Why now
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {niche.whyNow}
          </p>
        </section>

        <section className="space-y-3" aria-label="Signal shape">
          <h2 className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
            What the signal looks like
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {niche.signalShape}
          </p>
        </section>

        <section className="space-y-3" aria-label="Public examples">
          <h2 className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Public examples
          </h2>
          <p className="text-gray-400 text-xs italic">
            We name <em>public</em> projects + categories only, never founders we
            track inside the paid product. The buyer&rsquo;s edge stays inside
            the product.
          </p>
          <ul className="list-disc pl-5 text-gray-300 text-base space-y-1">
            {niche.examples.map((ex) => (
              <li key={ex}>{ex}</li>
            ))}
          </ul>
        </section>

        <section className="space-y-3" aria-label="Competing for">
          <h2 className="text-xs text-rose-300 font-semibold uppercase tracking-wider">
            What this displaces
          </h2>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {niche.competingFor}
          </p>
        </section>

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="Build-vs-invest call"
        >
          <h2 className="text-xs text-sky-300 font-semibold uppercase tracking-wider">
            Our build-vs-invest call
          </h2>
          <p className="text-gray-100 text-base sm:text-lg leading-relaxed">
            {niche.ourTake}
          </p>
        </section>

        <section className="space-y-4" aria-label="Frequently asked questions">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Common questions about this niche
          </h2>
          <dl className="space-y-4">
            {niche.faqs.map((f) => (
              <div
                key={f.q}
                className="border-l-2 border-slate-700 pl-4 space-y-1.5"
              >
                <dt className="text-gray-100 font-semibold text-base">{f.q}</dt>
                <dd className="text-gray-300 text-base leading-relaxed">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <SeoCta className="mt-10" />

        {adjacent.length > 0 && (
          <section
            className="border-t border-slate-800 pt-8 space-y-4"
            aria-label="Adjacent sub-niches"
          >
            <h2 className="text-sm text-sky-300 font-semibold uppercase tracking-wider">
              More inside {sector.name}
            </h2>
            <ul className="space-y-2">
              {adjacent.map((n) => (
                <li key={n.slug}>
                  <Link
                    href={`/niche-down/${sector.slug}/${n.slug}`}
                    className="text-gray-300 hover:text-sky-200 text-base leading-relaxed underline decoration-dotted decoration-slate-600 hover:decoration-sky-300"
                  >
                    {n.name}
                  </Link>{" "}
                  <span className="text-gray-500 text-sm">{n.pitch}</span>
                </li>
              ))}
            </ul>
            <p className="pt-2">
              <Link
                href={`/niche-down/${sector.slug}`}
                className="text-sky-300 text-sm font-semibold hover:text-sky-200"
              >
                See all {sector.niches.length} {sector.name} sub-niches →
              </Link>
            </p>
          </section>
        )}

        <footer className="border-t border-slate-800 pt-6 space-y-2 text-xs text-gray-500">
          <p>
            Last refreshed:{" "}
            <time dateTime={lastModified}>
              {new Date(lastModified).toISOString().slice(0, 10)}
            </time>
            . Editorial commentary; not investment advice.
          </p>
          <p>
            Methodology + data source:{" "}
            <Link href="/methodology" className="text-gray-400 hover:text-gray-200 underline decoration-dotted">
              /methodology
            </Link>
            . Named scoreboard:{" "}
            <Link href="/startups-to-watch" className="text-gray-400 hover:text-gray-200 underline decoration-dotted">
              /startups-to-watch
            </Link>
            .
          </p>
        </footer>
      </article>
    </>
  );
}
