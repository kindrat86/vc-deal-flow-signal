import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";
import {
  nicheSectors,
  getNicheSector,
  buildCostLabel,
  dealVelocityLabel,
  type BuildCost,
  type DealVelocity,
} from "@/content/niches";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ sector: string }>;
}

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 604800;

export function generateStaticParams() {
  return nicheSectors.map((s) => ({ sector: s.slug }));
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { sector: sectorSlug } = await params;
  const sector = getNicheSector(sectorSlug);
  if (!sector) return {};

  const title = `${sector.name} — ${sector.niches.length} niche-down opportunities`;
  const description = `${sector.shortPitch} — ${sector.niches.length} specific sub-niches inside ${sector.name}, each tagged with build cost, deal velocity, and a build-vs-invest call.`;
  const url = `${SITE}/niche-down/${sector.slug}`;
  return {
    title,
    description,
    alternates: { canonical: `/niche-down/${sector.slug}` },
    openGraph: { title, description, url, type: "article" },
    twitter: { card: "summary_large_image", title, description },
  };
}

const BUILD_COST_TONE: Record<BuildCost, string> = {
  weekend: "text-emerald-300",
  month: "text-sky-300",
  quarter: "text-amber-300",
  team: "text-rose-300",
};
const DEAL_VELOCITY_TONE: Record<DealVelocity, string> = {
  trickle: "text-slate-300",
  steady: "text-sky-300",
  hot: "text-amber-300",
  frothy: "text-rose-300",
};

export default async function NicheSectorPage({ params }: PageProps) {
  const { sector: sectorSlug } = await params;
  const sector = getNicheSector(sectorSlug);
  if (!sector) notFound();

  const url = `${SITE}/niche-down/${sector.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": url,
        url,
        name: `${sector.name} — niche-down opportunities`,
        description: sector.shortPitch,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".sector-pitch", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Niche-down", item: `${SITE}/niche-down` },
          { "@type": "ListItem", position: 3, name: sector.name, item: url },
        ],
      },
      {
        "@type": "ItemList",
        name: `${sector.name} sub-niches`,
        numberOfItems: sector.niches.length,
        itemListElement: sector.niches.map((n, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: n.name,
          item: {
            "@type": "WebPage",
            "@id": `${url}/${n.slug}`,
            name: n.name,
            description: n.pitch,
          },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={url}
        languages={getHreflangLanguages(`/niche-down/${sector.slug}`)}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/niche-down/${sector.slug}`} />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <Link href="/niche-down" className="hover:text-gray-300">Niche-down</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">{sector.name}</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {sector.name} · {sector.niches.length} sub-niches · Build-vs-invest tagged
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {sector.name}: <span className="text-sky-400">{sector.niches.length} sub-niches</span> to consider.
          </h1>
          <p
            className="sector-pitch text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            {sector.shortPitch}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Each entry below is a specific opportunity inside {sector.name}.
            We name public projects as examples — never the founders we track
            inside the paid product. The category commentary is the public
            surface; the named buyers&rsquo; edge lives in the{" "}
            <Link href="/startups-to-watch" className="text-sky-300 underline decoration-dotted hover:text-sky-200">
              paid product
            </Link>.
          </p>
        </header>

        <section
          className="grid gap-4"
          aria-label={`${sector.name} sub-niches`}
        >
          {sector.niches.map((niche) => (
            <Link
              key={niche.slug}
              href={`/niche-down/${sector.slug}/${niche.slug}`}
              className="block rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/50 transition-colors p-5 sm:p-6 space-y-3 group"
            >
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                  /niche-down/{sector.slug}/{niche.slug}
                </p>
                <div className="flex items-center gap-3 text-[10px] uppercase tracking-wider font-semibold">
                  <span className={BUILD_COST_TONE[niche.buildCost]}>
                    {buildCostLabel(niche.buildCost)}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className={DEAL_VELOCITY_TONE[niche.dealVelocity]}>
                    {dealVelocityLabel(niche.dealVelocity)}
                  </span>
                </div>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug group-hover:text-sky-200 transition-colors">
                {niche.name}
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                {niche.pitch}
              </p>
              <p className="text-sky-400 text-sm font-semibold pt-1 group-hover:text-sky-300">
                Read the full opportunity brief →
              </p>
            </Link>
          ))}
        </section>

        <section
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3"
          aria-label={`How ${sector.name} signals are tracked`}
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            How {sector.name} is tracked
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The data behind the niches is the same data behind the panel.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            {sector.name} is one of the 20 top-level sectors in the weekly{" "}
            <Link href="/methodology" className="text-sky-300 underline decoration-dotted hover:text-sky-200">
              GitHub momentum panel
            </Link>
            . The sub-niches above are editorial slices on top of that data —
            specific opportunities where the signal shape suggests something
            is breaking out. The named scoreboard for {sector.name} is in the{" "}
            <Link href={`/startups-to-watch`} className="text-sky-300 underline decoration-dotted hover:text-sky-200">
              startups-to-watch
            </Link>{" "}
            surface; the niche-down map here is the &ldquo;what could be
            built&rdquo; layer above it.
          </p>
        </section>

        <SeoCta className="mt-10" />

        <section
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
          aria-label="Adjacent sectors"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Adjacent sector maps
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Keep going — three more sector maps.
          </h2>
          <div className="grid gap-3 sm:grid-cols-3">
            {nicheSectors
              .filter((s) => s.slug !== sector.slug)
              .slice(0, 3)
              .map((s) => (
                <Link
                  key={s.slug}
                  href={`/niche-down/${s.slug}`}
                  className="block rounded-lg border border-slate-700 bg-slate-900/60 hover:bg-slate-800 px-4 py-3 text-sm text-gray-200 hover:text-sky-200"
                >
                  <p className="font-semibold">{s.name}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    {s.niches.length} sub-niches
                  </p>
                </Link>
              ))}
          </div>
          <p className="pt-3">
            <Link
              href="/niche-down"
              className="text-sky-300 text-sm font-semibold hover:text-sky-200"
            >
              See all {nicheSectors.length} sectors →
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
