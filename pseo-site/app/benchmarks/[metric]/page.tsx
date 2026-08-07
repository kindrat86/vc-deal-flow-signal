import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface Benchmark {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  tableHeaders: string[];
  rows: (period: string) => { label: string; value: string; rank: string }[];
  faqs: { q: string; a: string }[];
}

const BENCHMARKS: Benchmark[] = [
  {
    slug: "commit-velocity",
    name: "Commit Velocity",
    title: "Startup Commit Velocity Benchmarks by Sector — 2026 GitHub Data",
    description:
      "How does your startup's GitHub commit velocity compare? Real benchmarks from 400+ venture-backed startups across 20 sectors. 14-day rolling window, refreshed weekly.",
    h1: "Commit Velocity Benchmarks — How Your Startup Compares",
    intro:
      "Commit velocity (14-day rolling commits to the most active public repo) is the core ranking metric for VC Deal Flow Signal. These benchmarks show where your startup stands relative to the sector median and top quartile.",
    tableHeaders: ["Sector", "Median commits/14d", "Top quartile"],
    rows: (period) => {
      const sectors = getAllSectors();
      const data = sectors
        .map((s) => {
          const snap = s.periods[period];
          if (!snap) return null;
          const vels = snap.startups.map((st) => st.commitVelocity14d || 0).sort((a, b) => a - b);
          if (vels.length === 0) return null;
          const median = vels[Math.floor(vels.length / 2)];
          const topQ = vels[Math.floor(vels.length * 0.75)];
          return { label: s.name, value: `${median}`, rank: `${topQ}` };
        })
        .filter(Boolean)
        .sort((a, b) => parseInt(b!.value) - parseInt(a!.value)) as { label: string; value: string; rank: string }[];
      return data.slice(0, 20);
    },
    faqs: [
      { q: "What is commit velocity?", a: "Commit velocity is the total number of commits to a startup's most active public repository over a rolling 14-day window. It's a direct measure of engineering throughput." },
      { q: "What's a good commit velocity?", a: "It depends heavily on sector and language. A Rust infrastructure startup with 50 commits/14d may be outperforming a JavaScript SaaS startup with 200 commits. Compare against the sector median, not an absolute number." },
      { q: "How is this data collected?", a: "Public GitHub data only. We sweep ~4,200 candidate orgs every Sunday and publish the top 85+ across 20 sectors. Full methodology at /methodology." },
    ],
  },
  {
    slug: "contributor-growth",
    name: "Contributor Growth",
    title: "Startup Contributor Growth Benchmarks — GitHub Engineer Hiring Signals",
    description:
      "How many active contributors do venture-backed startups have? Real benchmarks from 400+ tracked GitHub organizations across 20 sectors. Hiring burst detection.",
    h1: "Contributor Growth Benchmarks — Hiring Signals by Sector",
    intro:
      "Contributor count and 6-week growth rate are the second-strongest fundraise-precursor signal after commit velocity. A hiring burst (3+ new organizational committers in a 14-day window) frequently precedes a round announcement.",
    tableHeaders: ["Sector", "Median contributors", "Top quartile"],
    rows: (period) => {
      const sectors = getAllSectors();
      const data = sectors
        .map((s) => {
          const snap = s.periods[period];
          if (!snap) return null;
          const contribs = snap.startups.map((st) => st.contributors || 0).sort((a, b) => a - b);
          if (contribs.length === 0) return null;
          const median = contribs[Math.floor(contribs.length / 2)];
          const topQ = contribs[Math.floor(contribs.length * 0.75)];
          return { label: s.name, value: `${median}`, rank: `${topQ}` };
        })
        .filter(Boolean)
        .sort((a, b) => parseInt(b!.value) - parseInt(a!.value)) as { label: string; value: string; rank: string }[];
      return data.slice(0, 20);
    },
    faqs: [
      { q: "What counts as a contributor?", a: "A distinct GitHub user who has committed to any public repository in the startup's organization within the current tracking period." },
      { q: "What is a hiring burst?", a: "A hiring burst signal fires when 3 or more new organizational committers (with @company.com emails) appear in a 14-day window — distinct from external drive-by contributors." },
      { q: "How does contributor growth relate to fundraising?", a: "Our SSRN research found that startups showing sustained contributor growth above the sector median for 6+ weeks are 3.2× more likely to announce a round within 90 days." },
    ],
  },
  {
    slug: "signal-distribution",
    name: "Signal Distribution",
    title: "Engineering Signal Distribution by Sector — Breakout vs Cooling 2026",
    description:
      "Which sectors have the most breakout engineering signals? Real distribution data from 400+ startups. Breakout, acceleration, steady, cooling classifications.",
    h1: "Signal Distribution — Which Sectors Are Heating Up",
    intro:
      "Every tracked startup is classified into one of four signal types: breakout (sudden surge), acceleration (sustained growth), steady (healthy baseline), or cooling (declining). This page shows the distribution by sector.",
    tableHeaders: ["Sector", "Breakout %", "Cooling %"],
    rows: (period) => {
      const sectors = getAllSectors();
      const data = sectors
        .map((s) => {
          const snap = s.periods[period];
          if (!snap) return null;
          const total = snap.startups.length;
          if (total === 0) return null;
          const breakout = snap.startups.filter((st) => (st.signalType || "").toLowerCase().includes("breakout")).length;
          const cooling = snap.startups.filter((st) => (st.signalType || "").toLowerCase().includes("cooling")).length;
          return { label: s.name, value: `${Math.round((breakout / total) * 100)}%`, rank: `${Math.round((cooling / total) * 100)}%` };
        })
        .filter(Boolean)
        .sort((a, b) => parseInt(b!.value) - parseInt(a!.value)) as { label: string; value: string; rank: string }[];
      return data.slice(0, 20);
    },
    faqs: [
      { q: "What is a breakout signal?", a: "A breakout signal fires when a startup's commit velocity increases by more than 100% over the prior 14-day window while maintaining a healthy contributor base." },
      { q: "Which sectors have the most breakouts right now?", a: "Check the table above — it's sorted by breakout percentage, highest first. The top sectors change weekly as the dataset refreshes every Monday." },
      { q: "How is signal type determined?", a: "A composite score from commit velocity change, contributor growth rate, and repository expansion. Full methodology at /methodology." },
    ],
  },
];

export async function generateStaticParams() {
  return BENCHMARKS.map((b) => ({ metric: b.slug }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ metric: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { metric } = await params;
  const b = BENCHMARKS.find((x) => x.slug === metric);
  if (!b) return {};
  return {
    title: b.title,
    description: b.description,
    alternates: { canonical: `/benchmarks/${metric}` },
    openGraph: { title: b.title, description: b.description, type: "article", url: `${SITE}/benchmarks/${metric}` },
  };
}

export default async function BenchmarkPage({ params }: PageProps) {
  const { metric } = await params;
  const b = BENCHMARKS.find((x) => x.slug === metric);
  if (!b) notFound();

  const period = getCurrentPeriod();
  const rows = b.rows(period.slug);
  const today = new Date().toISOString().slice(0, 10);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Dataset",
        name: b.title,
        description: b.description,
        creator: { "@type": "Organization", name: "VC Deal Flow Signal", url: SITE },
        license: "https://creativecommons.org/licenses/by/4.0/",
        temporalCoverage: period.slug,
        url: `${SITE}/benchmarks/${metric}`,
        distribution: [
          { "@type": "DataDownload", encodingFormat: "application/json", contentUrl: `${SITE}/api/signals.json` },
          { "@type": "DataDownload", encodingFormat: "text/csv", contentUrl: `${SITE}/api/signals.csv` },
        ],
      },
      {
        "@type": "Article",
        headline: b.h1,
        description: b.description,
        author: DATA_NERD_AUTHOR_REF,
        datePublished: "2026-07-01",
        dateModified: today,
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: b.name, item: `${SITE}/benchmarks/${metric}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: b.faqs.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgentMirrorLinks path={`/benchmarks/${metric}`} qaCategory="benchmark" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">All Sectors</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Benchmarks · {b.name}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">Benchmark · {period.name}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">{b.h1}</h1>
          <p className="text-gray-300 text-base leading-relaxed">{b.intro}</p>
        </header>

        <section aria-label="TL;DR" className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">TL;DR</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Real benchmark data from ~400 venture-backed startups across 20 sectors. Refreshed weekly every Monday.
            Data from {period.name}. Free under CC BY 4.0.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Sector benchmarks — {period.name}</h2>
          <div className="overflow-x-auto rounded-lg border border-slate-800">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-900 border-b border-slate-800">
                  {b.tableHeaders.map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-gray-400 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => (
                  <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-900/50">
                    <td className="px-4 py-3 text-gray-200">{r.label}</td>
                    <td className="px-4 py-3 text-sky-400 font-semibold">{r.value}</td>
                    <td className="px-4 py-3 text-emerald-400">{r.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-gray-600 text-xs">
            Sorted by {b.tableHeaders[1]}. Data from {period.name}. Source: public GitHub data, CC BY 4.0.
          </p>
        </section>

        <section className="mb-10 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {b.faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-gray-200 font-medium mb-1">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-sky-900/50 bg-sky-950/30 p-6 text-center">
          <p className="text-gray-200 text-lg font-semibold mb-2">Get the full dataset</p>
          <p className="text-gray-400 text-sm mb-4">JSON, CSV, NDJSON, API. Free, no auth.</p>
          <Link href="/api/signals.json" className="inline-block rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 font-semibold px-6 py-3 transition-colors">
            Download Dataset (CC BY 4.0)
          </Link>
        </section>

        <div className="text-center border-t border-slate-800 pt-8">
          <p className="text-gray-500 text-xs">CC BY 4.0 · Free forever · {SITE}</p>
        </div>
      </div>
    </>
  );
}
