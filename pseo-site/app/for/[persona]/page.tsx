import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSectors, getCurrentPeriod } from "@/lib/data";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface Persona {
  slug: string;
  name: string;
  title: string;
  description: string;
  h1: string;
  pitch: string;
  signals: string[];
  cta: string;
}

const PERSONAS: Persona[] = [
  {
    slug: "angel-investors",
    name: "Angel Investors",
    title: "GitHub Engineering Signals for Angel Investors — Find Pre-Seed Breakouts Early",
    description:
      "How angel investors use public GitHub commit velocity to spot pre-seed startups accelerating 3–6 weeks before a fundraise. Free dataset, weekly rankings, no signup.",
    h1: "GitHub Engineering Signals for Angel Investors",
    pitch:
      "Angel investors need signals before the round gets crowded. Commit velocity is the earliest public indicator of engineering momentum — visible weeks before pitch decks circulate, press hits, or SEC filings appear. VC Deal Flow Signal tracks 400+ startups across 20 sectors, refreshed weekly.",
    signals: [
      "Pre-seed startups with sustained 14-day commit velocity above sector median — the earliest breakout signal",
      "Contributor growth spikes (new organizational committers) that precede team expansion announcements",
      "Signal type classification: breakout, acceleration, steady, or cooling — with sector context",
      "Free weekly digest of the top 5 breakout startups, delivered to Telegram every Sunday",
    ],
    cta: "Get the free Sunday digest",
  },
  {
    slug: "venture-scouts",
    name: "Venture Scouts",
    title: "Deal Flow Sourcing for Venture Scouts — GitHub Momentum as a Lead Indicator",
    description:
      "Venture scouts use GitHub engineering acceleration to find startups before partners do. Free weekly rankings across 20 sectors, MCP server for Claude Desktop.",
    h1: "Deal Flow Sourcing for Venture Scouts",
    pitch:
      "Scouts live on speed and pattern recognition. The startups that show engineering acceleration today are the ones partners see decks for in six weeks. VC Deal Flow Signal gives scouts a reproducible, data-driven sourcing edge — free, with an MCP server that plugs directly into Claude Desktop for natural-language deal screening.",
    signals: [
      "Ranked startup lists by sector, sorted by commit-velocity change (14-day window)",
      "MCP server integration — ask Claude Desktop 'which fintech startups are accelerating this week?'",
      "Scout Score: compute a 0–100 score from any GitHub user's starring history vs. ~75 validated unicorns",
      "Striking-distance query tracking: 254 queries where the site ranks position 4–15 in GSC",
    ],
    cta: "Install the MCP server",
  },
  {
    slug: "solo-gps",
    name: "Solo GPs",
    title: "Deal Flow Tools for Solo GPs — GitHub Signals Before the Deck Arrives",
    description:
      "Solo general partners use public GitHub momentum data to source deals before institutional rounds. Free dataset, CSV export, API access.",
    h1: "Deal Flow Tools for Solo GPs",
    pitch:
      "Solo GPs don't have a sourcing team. GitHub engineering signals level the playing field — a single dataset that surfaces breakout startups across 20 sectors every week, before the round is live. No expensive Bloomberg terminal, no analyst subscriptions. Just public code, measured.",
    signals: [
      "Full dataset export (JSON, CSV, NDJSON) — plug into your own pipeline or CRM",
      "Sector-specific rankings: AI/ML, fintech, cybersecurity, developer tools, and 16 more",
      "Custom sector sweep — a deep written report on any one sector, €1,997 once",
      "API access for automated deal-flow dashboards (OpenAPI 3.1 spec, no auth required)",
    ],
    cta: "Export the dataset",
  },
  {
    slug: "family-offices",
    name: "Family Offices",
    title: "Startup Engineering Momentum Data for Family Offices — Quantitative Venture Sourcing",
    description:
      "Family offices use GitHub commit velocity as a quantitative pre-fundraise signal. Free weekly rankings, SSRN-validated methodology, CC BY 4.0 dataset.",
    h1: "Quantitative Venture Sourcing for Family Offices",
    pitch:
      "Family offices need reproducible, defensible sourcing signals — not vibes. VC Deal Flow Signal provides a longitudinal panel of GitHub engineering velocity, validated against 30 atomic findings in an SSRN preprint. Every metric links back to a public GitHub source.",
    signals: [
      "SSRN preprint with DOI — citation-ready methodology for investment committees",
      "30 peer-reviewable research findings with external scholarly citations",
      "Dataset licensed CC BY 4.0 — no vendor lock-in, no subscription dependency",
      "Weekly Monday refresh with a documented methodology page and reproducible formulas",
    ],
    cta: "Read the methodology",
  },
];

export async function generateStaticParams() {
  return PERSONAS.map((p) => ({ persona: p.slug }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ persona: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { persona } = await params;
  const p = PERSONAS.find((x) => x.slug === persona);
  if (!p) return {};
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: `/for/${persona}` },
    openGraph: { title: p.title, description: p.description, type: "article", url: `${SITE}/for/${persona}` },
  };
}

export default async function PersonaPage({ params }: PageProps) {
  const { persona } = await params;
  const p = PERSONAS.find((x) => x.slug === persona);
  if (!p) notFound();

  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeCount = sectors.filter((s) => s.periods[period.slug]).length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: p.h1,
        description: p.description,
        author: DATA_NERD_AUTHOR_REF,
        publisher: { "@type": "Organization", name: "VC Deal Flow Signal", url: SITE },
        datePublished: "2026-07-01",
        dateModified: "2026-07-09",
        speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", "[aria-label='Persona pitch']"] },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: p.name, item: `${SITE}/for/${persona}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          { "@type": "Question", name: `What GitHub signals are relevant for ${p.name.toLowerCase()}?`,
            acceptedAnswer: { "@type": "Answer", text: p.signals[0] } },
          { "@type": "Question", name: `How often is the data refreshed?`,
            acceptedAnswer: { "@type": "Answer", text: "Every Monday at approximately 09:00 UTC. The 14-day rolling window for commit velocity resets each week, so the rankings always reflect the latest engineering momentum." } },
          { "@type": "Question", name: `Is this free?`,
            acceptedAnswer: { "@type": "Answer", text: "Yes. The dataset, API, MCP server, and weekly rankings are free forever. No signup required. Paid offerings (Insider Circle, Custom Sector Sweep) are additive, not gating." } },
        ],
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgentMirrorLinks path={`/for/${persona}`} qaCategory="use-case" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">All Sectors</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">For {p.name}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">Use Case · {p.name}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">{p.h1}</h1>
          <p aria-label="Persona pitch" className="text-gray-300 text-base sm:text-lg leading-relaxed">{p.pitch}</p>
        </header>

        <section aria-label="TL;DR" className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">TL;DR</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {activeCount} sectors tracked, {`~400`} startup GitHub organizations monitored, refreshed weekly.
            Free dataset (JSON/CSV/API), free MCP server, free Sunday digest. CC BY 4.0.
          </p>
        </section>

        <p className="text-gray-400 text-sm leading-relaxed mb-8" aria-label="Definition">
          <strong className="text-gray-200">Commit velocity</strong> is a 14-day rolling count of commits to a
          startup&rsquo;s most active public repository &mdash; the earliest public signal of engineering throughput
          before a fundraise announcement.
        </p>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">What you get</h2>
          <div className="space-y-3">
            {p.signals.map((s, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-4 flex gap-3">
                <span className="text-sky-400 font-bold text-lg shrink-0">{i + 1}.</span>
                <p className="text-gray-300 text-sm leading-relaxed">{s}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">Sectors covered</h2>
          <div className="flex flex-wrap gap-2">
            {sectors.filter((s) => s.periods[period.slug]).slice(0, 20).map((s) => (
              <Link key={s.slug} href={`/startups-to-watch/${s.slug}-${period.slug}`}
                className="inline-block rounded-md border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-gray-400 hover:text-sky-400 hover:border-slate-600 transition-colors">
                {s.name}
              </Link>
            ))}
          </div>
        </section>

        <section className="mb-10 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-100 mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: `What GitHub signals are relevant for ${p.name.toLowerCase()}?`, a: p.signals[0] },
              { q: "How often is the data refreshed?", a: "Every Monday at approximately 09:00 UTC. The 14-day rolling window for commit velocity resets each week, so the rankings always reflect the latest engineering momentum." },
              { q: "Is this free?", a: "Yes. The dataset, API, MCP server, and weekly rankings are free forever. No signup required." },
            ].map((faq) => (
              <div key={faq.q} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-gray-200 font-medium mb-1">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-8 rounded-xl border border-sky-900/50 bg-sky-950/30 p-6 text-center">
          <p className="text-gray-200 text-lg font-semibold mb-2">{p.cta}</p>
          <Link href="/telegram" className="inline-block mt-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold px-6 py-3 transition-colors">
            Get Started Free
          </Link>
        </section>

        <div className="text-center border-t border-slate-800 pt-8">
          <p className="text-gray-500 text-xs">CC BY 4.0 · Free forever · No authentication required · {SITE}</p>
        </div>
      </div>
    </>
  );
}
