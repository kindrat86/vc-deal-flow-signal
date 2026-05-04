import type { Metadata } from "next";
import Link from "next/link";
import { getAllPeriods, getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";

export const metadata: Metadata = {
  title: "Changelog — Weekly Signal Updates & Product Releases",
  description:
    "Weekly data refreshes, new sectors, MCP server releases, and product updates for VC Deal Flow Signal. Updated every Monday at 09:00 EEST.",
  alternates: {
    canonical: "/changelog",
  },
};

interface ProductEntry {
  date: string;
  title: string;
  tag: "product" | "data" | "integration" | "seo";
  body: string;
}

const productUpdates: ProductEntry[] = [
  {
    date: "2026-04-19",
    title: "Alternatives hub and use-case pages shipped",
    tag: "seo",
    body: "New /alternatives/ hub with detailed head-to-head comparisons against Harmonic.ai, Dealroom, Forager.ai, and Crunchbase. Three persona-focused /use-cases/ pages. /integrations, /changelog, /developers, and /data-sources pages added for better AEO coverage.",
  },
  {
    date: "2026-04-18",
    title: "MCP server 1.2.0 with Glama A-tier tool descriptions",
    tag: "integration",
    body: "Published @gitdealflow/mcp-signal 1.2.0 on npm with refined tool descriptions, a glama.json manifest, and the new demo video hero. All five tools back to A-tier (4.8-4.9/5.0) on Glama.",
  },
  {
    date: "2026-04-18",
    title: "272-URL IndexNow push to Bing + Yandex",
    tag: "seo",
    body: "Submitted the full signals sitemap via IndexNow, fan-out to Bing, Yandex, and Seznam. Brave Search and llms.txt registry submissions also live.",
  },
  {
    date: "2026-04-17",
    title: "Chrome extension launched",
    tag: "integration",
    body: "Sidebar badge on Crunchbase, AngelList, and PitchBook company pages showing live engineering signal status. Integrated on landing and pSEO site.",
  },
  {
    date: "2026-04-17",
    title: "SEO hardening pass",
    tag: "seo",
    body: "Added JSON-LD on all page types, BreadcrumbList everywhere, OG images, Twitter card metadata, enriched RSS with content:encoded, footer social links, and sitewide Twitter handle @data_nerd.",
  },
  {
    date: "2026-04-16",
    title: "Crunchbase, G2, SaaSHub, AlternativeTo, LinkedIn profiles live",
    tag: "product",
    body: "High-DA directory listings going live as external signals. LinkedIn company page at linkedin.com/company/gitdealflow added to the footer.",
  },
  {
    date: "2026-04-15",
    title: "Three new SEO blog posts",
    tag: "seo",
    body: "Alternative data for VCs, GitHub vs Crunchbase comparison, and engineering metrics as leading indicators. Eight total posts live under /blog.",
  },
  {
    date: "2026-04-15",
    title: "Weekly content automation live",
    tag: "product",
    body: "Scheduled task generates the Signal of the Week plus 10 distribution variants every Monday at 9am EEST.",
  },
  {
    date: "2026-04-10",
    title: "Zapier integration v1.0.3 published",
    tag: "integration",
    body: "Private Zapier app with four live Zaps. 40/53 validation steps cleared. Moving to public release once the three-user threshold is met.",
  },
  {
    date: "2026-04-01",
    title: "MCP server 1.0 published to npm + MCP Registry",
    tag: "integration",
    body: "Five tools exposing trending startups, sector signals, individual startup lookup, methodology, and weekly summaries. Discoverable from Claude Desktop, Cursor, Windsurf.",
  },
  {
    date: "2026-03-15",
    title: "Dashboard beta launched at EUR 9.97/month",
    tag: "product",
    body: "Full 85+ startup weekly ranking with sector, stage, and geography filters. Stripe checkout, email auth, and webhook-driven provisioning.",
  },
];

function tagStyle(tag: ProductEntry["tag"]) {
  const base = "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border";
  switch (tag) {
    case "product":
      return `${base} bg-sky-950/50 border-sky-900/50 text-sky-400`;
    case "data":
      return `${base} bg-emerald-950/50 border-emerald-900/50 text-emerald-400`;
    case "integration":
      return `${base} bg-violet-950/50 border-violet-900/50 text-violet-400`;
    case "seo":
      return `${base} bg-amber-950/50 border-amber-900/50 text-amber-400`;
  }
}

export default function ChangelogPage() {
  const periods = getAllPeriods();
  const sectors = getAllSectors();
  const current = getCurrentPeriod();
  const lastModified = getDataLastModified();

  const activeSectors = sectors.filter((s) => s.periods[current.slug]);
  const totalStartups = activeSectors.reduce(
    (sum, s) => sum + s.periods[current.slug].startups.length,
    0
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        name: "VC Deal Flow Signal Changelog",
        description:
          "Weekly data refreshes and product updates for VC Deal Flow Signal.",
        url: "https://signals.gitdealflow.com/changelog",
        dateModified: lastModified.toISOString(),
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
      },
      {
        "@type": "ItemList",
        itemListElement: productUpdates.slice(0, 20).map((u, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: u.title,
          description: u.body,
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
            name: "Changelog",
            item: "https://signals.gitdealflow.com/changelog",
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
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Changelog</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Changelog
        </h1>
        <p className="text-gray-400 text-base leading-relaxed mb-10 max-w-2xl">
          Weekly data refreshes, new sectors, product releases, and
          distribution pushes. Data refreshes every Monday at 09:00 EEST. Last
          refresh: {lastModified.toISOString().slice(0, 10)}.
        </p>

        <div className="grid sm:grid-cols-3 gap-4 mb-12">
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Current period</p>
            <p className="text-gray-100 font-semibold text-lg">{current.name}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Sectors tracked</p>
            <p className="text-gray-100 font-semibold text-lg">{activeSectors.length}</p>
          </div>
          <div className="rounded-lg border border-slate-800 bg-slate-900 p-5">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Startups this period</p>
            <p className="text-gray-100 font-semibold text-lg">{totalStartups}</p>
          </div>
        </div>

        <section className="mb-12" aria-label="Product updates">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Product updates</h2>
          <div className="space-y-6">
            {productUpdates.map((entry) => (
              <article
                key={`${entry.date}-${entry.title}`}
                className="rounded-lg border border-slate-800 bg-slate-900 p-6"
              >
                <div className="flex items-center gap-3 mb-2">
                  <time
                    dateTime={entry.date}
                    className="text-xs text-gray-500 font-mono"
                  >
                    {entry.date}
                  </time>
                  <span className={tagStyle(entry.tag)}>
                    {entry.tag}
                  </span>
                </div>
                <h3 className="text-gray-100 font-semibold text-lg mb-2">
                  {entry.title}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {entry.body}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-label="Data refresh history">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">Data refresh history</h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/60">
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Period</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Sectors</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Startups</th>
                  <th className="text-left text-gray-400 font-medium px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {periods.map((p) => {
                  const pSectors = sectors.filter((s) => s.periods[p.slug]);
                  const pStartups = pSectors.reduce(
                    (sum, s) => sum + s.periods[p.slug].startups.length,
                    0
                  );
                  return (
                    <tr
                      key={p.slug}
                      className="border-b border-slate-800/60 last:border-0"
                    >
                      <td className="px-4 py-3 text-gray-200 font-medium">{p.name}</td>
                      <td className="px-4 py-3 text-gray-400">{pSectors.length}</td>
                      <td className="px-4 py-3 text-gray-400">{pStartups}</td>
                      <td className="px-4 py-3">
                        {p.current ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                            Current
                          </span>
                        ) : (
                          <span className="text-gray-500 text-xs">Archived</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        <div className="rounded-xl border border-slate-800 bg-slate-900 p-6 sm:p-8">
          <h2 className="text-gray-100 font-semibold text-lg mb-2">
            Want changelog updates?
          </h2>
          <p className="text-gray-400 text-sm mb-5">
            Subscribe to the weekly Signal Report for the latest data refresh,
            or watch the{" "}
            <Link href="/api/changelog.json" className="text-sky-400 hover:text-sky-300">
              JSON changelog endpoint
            </Link>{" "}
            for machine-readable updates.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-sm font-medium transition-colors"
            >
              Subscribe to Signal Report
            </Link>
            <Link
              href="/feed.xml"
              className="inline-flex items-center justify-center px-5 py-2 rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-medium transition-colors"
            >
              RSS Feed
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
