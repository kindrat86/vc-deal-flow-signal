import type { Metadata } from "next";
import Link from "next/link";
import {
  competitors,
  competitorVsPairs,
  type CompetitorInfo,
  type CompetitorVs,
} from "@/content/competitor-vs";
import PSEOFooterNav from "@/components/PSEOFooterNav";

export const metadata: Metadata = {
  title: "VC Deal Flow Tools Compared Head-to-Head 2026 — 36 Pairwise Comparisons",
  description:
    "Every major VC deal flow tool compared head-to-head: PitchBook, CB Insights, Harmonic.ai, Affinity, Specter, Crunchbase, Dealroom, Forager.ai, Tracxn. 36 pairwise comparisons covering signal type, lead time, pricing, and when to pick each one.",
  alternates: {
    canonical: "/vs",
  },
};

interface CategorizedPair {
  pair: CompetitorVs;
  a: CompetitorInfo;
  b: CompetitorInfo;
}

// Map each competitor key to a category bucket for grouping the hub page.
// Buckets are derived from the existing competitor metadata in
// content/competitor-vs.ts and mirror the categorization used on the
// /alternatives index intro.
const BUCKET: Record<string, "leading" | "database" | "crm"> = {
  "harmonic-ai": "leading",
  "forager-ai": "leading",
  specter: "leading",
  pitchbook: "database",
  "cb-insights": "database",
  crunchbase: "database",
  dealroom: "database",
  tracxn: "database",
  affinity: "crm",
};

function bucketOf(key: string): "leading" | "database" | "crm" | "other" {
  return BUCKET[key] ?? "other";
}

function pairCategory(a: string, b: string): string {
  const ba = bucketOf(a);
  const bb = bucketOf(b);
  if (ba === "leading" && bb === "leading") return "Leading-signal engines compared";
  if (ba === "database" && bb === "database") return "Reference databases compared";
  if (ba === "crm" || bb === "crm") return "Relationship-CRM vs sourcing/research tools";
  return "Cross-category — sourcing vs reference";
}

const CATEGORY_ORDER = [
  "Leading-signal engines compared",
  "Cross-category — sourcing vs reference",
  "Reference databases compared",
  "Relationship-CRM vs sourcing/research tools",
];

export default function VsHubIndex() {
  const enriched: CategorizedPair[] = competitorVsPairs
    .map((pair) => {
      const a = competitors[pair.a];
      const b = competitors[pair.b];
      if (!a || !b) return null;
      return { pair, a, b };
    })
    .filter((p): p is CategorizedPair => p !== null);

  const grouped = new Map<string, CategorizedPair[]>();
  for (const cat of CATEGORY_ORDER) grouped.set(cat, []);
  for (const item of enriched) {
    const cat = pairCategory(item.pair.a, item.pair.b);
    if (!grouped.has(cat)) grouped.set(cat, []);
    grouped.get(cat)!.push(item);
  }

  // Sort each group alphabetically by combined display name for stable order
  for (const list of grouped.values()) {
    list.sort((x, y) => `${x.a.name} vs ${x.b.name}`.localeCompare(`${y.a.name} vs ${y.b.name}`));
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "VC Deal Flow Tools Compared Head-to-Head 2026",
        description:
          "All pairwise head-to-head comparisons across nine of the most-used VC deal flow tools, organized by tool category.",
        url: "https://signals.gitdealflow.com/vs",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        name: "VC deal flow tool head-to-head comparisons",
        numberOfItems: enriched.length,
        itemListElement: enriched.map((item, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: `https://signals.gitdealflow.com/vs/${item.pair.slug}`,
          name: `${item.a.name} vs ${item.b.name}`,
        })),
      },
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
            name: "Head-to-Head",
            item: "https://signals.gitdealflow.com/vs",
          },
        ],
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Head-to-Head</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          VC Deal Flow Tools Compared Head-to-Head 2026
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-6">
          Every major VC deal flow tool compared pairwise: signal philosophy, lead time,
          coverage, pricing, and when each tool is the better fit. {enriched.length} comparisons
          across {Object.keys(competitors).length} tracked tools, organized by category so you
          can jump to whichever matchup matters for your stack.
        </p>
        <div className="rounded-lg border border-slate-800 bg-slate-900 p-5 mb-10 text-sm text-gray-300">
          <p className="text-xs font-medium text-sky-400 uppercase tracking-wider mb-2">
            How to use this hub
          </p>
          <p className="leading-relaxed">
            Most VCs run a three-layer stack: a leading-signal sourcing engine, a curated
            reference database, and a relationship-CRM. The categories below mirror those layers.
            Comparisons within a category help you pick a single tool for that slot. Cross-category
            comparisons help you understand where the layers complement each other.
          </p>
        </div>

        {CATEGORY_ORDER.map((cat) => {
          const items = grouped.get(cat) ?? [];
          if (items.length === 0) return null;
          return (
            <section key={cat} className="mb-12" aria-label={cat}>
              <h2 className="text-xl font-semibold text-gray-100 mb-4 leading-tight">{cat}</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {items.map(({ pair, a, b }) => (
                  <Link
                    key={pair.slug}
                    href={`/vs/${pair.slug}`}
                    className="group block rounded-lg border border-slate-800 bg-slate-900 p-5 hover:border-slate-600 hover:bg-slate-800/60 transition-all"
                  >
                    <h3 className="text-gray-100 font-semibold text-base mb-2 group-hover:text-sky-400 transition-colors">
                      {a.name} vs {b.name}
                    </h3>
                    <p className="text-gray-400 text-xs leading-relaxed line-clamp-3 mb-2">
                      {pair.verdict}
                    </p>
                    <span className="inline-block text-sky-500 text-xs font-medium group-hover:text-sky-400 transition-colors">
                      Read comparison &rarr;
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}

        <PSEOFooterNav excludeHrefs={["/vs"]} />
      </div>
    </>
  );
}
