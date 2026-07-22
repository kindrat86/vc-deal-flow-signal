import type { Metadata } from "next";
import Link from "next/link";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { comparisons } from "@/content/comparisons";
import { posts } from "@/content/posts";
import { FINDINGS } from "@/content/research-findings";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import RelatedLinks from "@/components/RelatedLinks";
import { getDefaultRelatedGroups } from "@/lib/related-links";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Explore the Signal Network — VC Deal Flow Signal",
  description:
    "Interactive link graph of all startup sectors, signal types, blog posts, comparisons, and research findings. Navigate the full pSEO content network.",
  alternates: { canonical: "/explore" },
  openGraph: {
    title: "Explore the Signal Network",
    description: "Full content map of VC Deal Flow Signal — sectors, signals, comparisons, research.",
    url: `${SITE}/explore`,
    type: "website",
  },
};

export default function ExplorePage() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  return (
    <>
      <HreflangLinks
        hrefLang="en-US"
        href="https://signals.gitdealflow.com/explore"
        path="/explore"
      />
      <AgentMirrorLinks path="/explore" title="Explore the Signal Network — VC Deal Flow Signal" />
      <main className="max-w-5xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold text-gray-100 mb-2 text-center">
          Explore the Signal Network
        </h1>
        <p className="text-gray-400 text-center mb-10 max-w-2xl mx-auto">
          Every content surface on VC Deal Flow Signal, organized by cluster.
          Use this map to navigate the full pSEO link graph.
        </p>

        {/* Sectors */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Sectors ({activeSectors.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {activeSectors.map((s) => (
              <Link
                key={s.slug}
                href={`/startups-to-watch/${s.slug}-${period.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-gray-300 hover:border-sky-600/50 hover:text-sky-400 transition-colors"
              >
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        {/* Blog posts */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Blog posts ({posts.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {posts.map((p) => (
              <Link
                key={p.slug}
                href={`/blog/${p.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-gray-300 hover:border-sky-600/50 hover:text-sky-400 transition-colors"
              >
                <span className="font-medium">{p.title}</span>
                <span className="block text-xs text-gray-500 mt-1">{p.date}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Comparisons */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Comparisons ({comparisons.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {comparisons.map((c) => (
              <Link
                key={c.slug}
                href={`/compare/${c.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-gray-300 hover:border-sky-600/50 hover:text-sky-400 transition-colors"
              >
                <span className="font-medium">{c.h1}</span>
                <span className="block text-xs text-gray-500 mt-1">{c.verdict}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Research findings */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            Research findings ({FINDINGS.length})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {FINDINGS.map((f) => (
              <Link
                key={f.slug}
                href={`/research/${f.slug}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-gray-300 hover:border-sky-600/50 hover:text-sky-400 transition-colors"
              >
                <span className="font-medium">{f.title}</span>
                <span className="block text-xs text-gray-500 mt-1">Section {f.section}</span>
              </Link>
            ))}
          </div>
        </section>

        {/* Key hubs */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">Key hubs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {[
              { href: "/answers", label: "Answers" },
              { href: "/alternatives", label: "Alternatives" },
              { href: "/use-cases", label: "Use Cases" },
              { href: "/signals", label: "Signal Taxonomy" },
              { href: "/glossary", label: "Glossary" },
              { href: "/faq", label: "FAQ" },
              { href: "/citations", label: "Citations" },
              { href: "/methodology", label: "Methodology" },
              { href: "/trending", label: "Trending" },
              { href: "/startups-to-watch", label: "Startups to Watch" },
              { href: "/compare", label: "Compare" },
              { href: "/pricing", label: "Pricing" },
            ].map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className="rounded-lg border border-slate-800 bg-slate-900 p-3 text-sm text-gray-300 hover:border-sky-600/50 hover:text-sky-400 transition-colors"
              >
                {l.label}
              </Link>
            ))}
          </div>
        </section>

        <RelatedLinks groups={getDefaultRelatedGroups()} />
      </main>
    </>
  );
}
