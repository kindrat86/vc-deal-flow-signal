import type { Metadata } from "next";
import Link from "next/link";
import { getLinkSections } from "@/lib/related-links";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Explore GitHub Startup Signals — Sectors, Stages, Trends & More | GitDealFlow",
  description:
    "Browse every GitDealFlow signal view: sectors, funding stages, signal types, trends, comparisons, and research. Real GitHub engineering-activity signals across venture-backed startups.",
  alternates: { canonical: "/explore" },
  openGraph: { title: "Explore GitHub Startup Signals", description: "Browse every GitDealFlow signal view.", url: `${SITE}/explore`, type: "website" },
};

const SECTION_TITLES: Record<string, string> = {
  topics: "Topics", vs: "Comparisons", research: "Research", define: "Definitions",
  fund: "Funds", acquirer: "Acquirers", founder: "Founders", city: "Cities",
  continuity: "Continuity", answers: "Answers", sectors: "Sectors",
};
const titleCase = (s: string) => s.replace(/[-_/]/g, " ").trim().replace(/\b\w/g, (c) => c.toUpperCase());

export default function ExplorePage() {
  const sections = getLinkSections();
  const ordered = Object.entries(sections)
    .filter(([, ps]) => ps.length > 0)
    .sort((a, b) => b[1].length - a[1].length);

  const itemList = {
    "@context": "https://schema.org", "@type": "CollectionPage",
    name: "Explore GitHub Startup Signals", url: `${SITE}/explore`,
    hasPart: ordered.map(([sec]) => ({ "@type": "WebPage", name: SECTION_TITLES[sec] || titleCase(sec), url: `${SITE}/${sec}` })),
  };

  return (
    <main className="mx-auto max-w-5xl px-4 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemList) }} />
      <h1 className="text-3xl font-bold text-gray-100 mb-2">Explore GitHub startup signals</h1>
      <p className="text-slate-400 mb-8 max-w-2xl">
        Every view into GitDealFlow&apos;s real GitHub engineering-activity signals — by sector, stage, signal type, trend,
        comparison, and research. Pick a thread and follow it.
      </p>
      {ordered.map(([sec, ps]) => (
        <section key={sec} className="mb-10">
          <h2 className="text-lg font-semibold text-sky-400 uppercase tracking-wider mb-4">
            {SECTION_TITLES[sec] || titleCase(sec)} <span className="text-slate-600 normal-case">({ps.length})</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            {ps.slice(0, 60).map((p) => (
              <Link key={p} href={p} className="text-slate-300 hover:text-sky-300 text-sm truncate">
                {titleCase(p.split("/").filter(Boolean).slice(1).join(" ") || p)}
              </Link>
            ))}
          </div>
        </section>
      ))}
    </main>
  );
}
