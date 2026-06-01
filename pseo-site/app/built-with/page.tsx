import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const TITLE = "Built with @gitdealflow/mcp-signal — embed badge for MCP integrators";
const DESCRIPTION =
  "Free 'Built with @gitdealflow/mcp-signal' badge for any project that calls our MCP server, dataset API, or signals JSON. Three variants, copy-paste markdown, no signup, no telemetry. Same caching model as Codecov or shields.io.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/built-with" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/built-with`,
    type: "website",
    images: [{ url: `${SITE}/api/og/badge-builder`, width: 1200, height: 630 }],
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: TITLE,
    description: DESCRIPTION,
    images: [`${SITE}/api/og/badge-builder`],
  },
};

interface Variant {
  name: "default" | "compact" | "long";
  caption: string;
  url: string;
  markdown: string;
  html: string;
  bbcode: string;
}

const VARIANTS: Variant[] = [
  {
    name: "default",
    caption: "Default — best for README hero rows.",
    url: `${SITE}/api/badge/built-with/svg`,
    markdown: `[![Built with gitdealflow MCP](${SITE}/api/badge/built-with/svg)](${SITE}/built-with)`,
    html: `<a href="${SITE}/built-with"><img src="${SITE}/api/badge/built-with/svg" alt="Built with gitdealflow MCP" /></a>`,
    bbcode: `[url=${SITE}/built-with][img]${SITE}/api/badge/built-with/svg[/img][/url]`,
  },
  {
    name: "compact",
    caption: "Compact — narrow value field, fits dense badge rows.",
    url: `${SITE}/api/badge/built-with/svg?variant=compact`,
    markdown: `[![Built with gitdealflow](${SITE}/api/badge/built-with/svg?variant=compact)](${SITE}/built-with)`,
    html: `<a href="${SITE}/built-with"><img src="${SITE}/api/badge/built-with/svg?variant=compact" alt="Built with gitdealflow" /></a>`,
    bbcode: `[url=${SITE}/built-with][img]${SITE}/api/badge/built-with/svg?variant=compact[/img][/url]`,
  },
  {
    name: "long",
    caption: "Long — explicit npm package name. Best for npm package READMEs.",
    url: `${SITE}/api/badge/built-with/svg?variant=long`,
    markdown: `[![Built with @gitdealflow/mcp-signal](${SITE}/api/badge/built-with/svg?variant=long)](${SITE}/built-with)`,
    html: `<a href="${SITE}/built-with"><img src="${SITE}/api/badge/built-with/svg?variant=long" alt="Built with @gitdealflow/mcp-signal" /></a>`,
    bbcode: `[url=${SITE}/built-with][img]${SITE}/api/badge/built-with/svg?variant=long[/img][/url]`,
  },
];

const FAQ = [
  {
    q: "Who is this badge for?",
    a: "Any project that calls our MCP server (@gitdealflow/mcp-signal), the public signals JSON, or the dataset API. AI agents, dashboards, side-projects, fund-internal tools — if you read our data, you can wear the badge.",
  },
  {
    q: "Do I need permission?",
    a: "No. The badge is CC BY 4.0 with attribution baked into the SVG title and the embed URL. Drop it in, no DM required. If you tell us you shipped it, we'll feature you on /mirrors.",
  },
  {
    q: "Will the badge break my README?",
    a: "GitHub renders all README images through its camo proxy, which caches the SVG aggressively (24h CDN, hourly ETag revalidation). The endpoint always returns a valid SVG — even on transient errors, it returns a neutral pill rather than a broken-image icon.",
  },
  {
    q: "What's the cache policy?",
    a: "Cache-Control: max-age=300, s-maxage=86400, stale-while-revalidate=604800. Static SVG with a fixed ETag. Hundreds of badges on a single page hit the same cache after the first paint.",
  },
  {
    q: "Can I customize the label?",
    a: "Yes — append ?label=your+label (max 40 chars) to override the left-hand label text. Variant controls the right-hand value: default, compact, or long.",
  },
  {
    q: "Is the MCP server free forever?",
    a: "Yes. The six tier-zero tools — get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_scout_receipts, get_methodology — are free with no signup, no rate limit, no telemetry. New paid tools may ship later, but these six stay free.",
  },
];

const FREE_TOOLS = [
  {
    name: "get_trending_startups",
    desc: "Top 20 startups by engineering acceleration across all sectors.",
  },
  {
    name: "search_startups_by_sector",
    desc: "All tracked startups in a sector, ranked by acceleration. 20 sector enum.",
  },
  {
    name: "get_startup_signal",
    desc: "Full signal profile for one startup: velocity, contributors, repos, classification.",
  },
  {
    name: "get_signals_summary",
    desc: "Dataset snapshot — period, counts, refresh date, format URLs, citation.",
  },
  {
    name: "get_scout_receipts",
    desc: "Compute a Scout Score (0-100) for any GitHub user from their starring history vs. validated unicorns.",
  },
  {
    name: "get_methodology",
    desc: "How signals are sourced, computed, and classified — with known limitations.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      "@id": `${SITE}/built-with#page`,
      name: TITLE,
      url: `${SITE}/built-with`,
      description: DESCRIPTION,
      inLanguage: "en-US",
      isPartOf: { "@id": `${SITE}/#website` },
      breadcrumb: { "@id": `${SITE}/built-with#breadcrumb` },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", "[data-speakable]"],
      },
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${SITE}/built-with#breadcrumb`,
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE },
        { "@type": "ListItem", position: 2, name: "Built With", item: `${SITE}/built-with` },
      ],
    },
    {
      "@type": "HowTo",
      name: "How to add the Built-With badge to your project",
      description:
        "Three-step workflow for adding a 'Built with @gitdealflow/mcp-signal' badge to a README, project site, or npm package page.",
      totalTime: "PT30S",
      step: [
        {
          "@type": "HowToStep",
          position: 1,
          name: "Pick a variant",
          text: "Default for README hero rows, compact for dense badge stacks, long for npm package pages.",
        },
        {
          "@type": "HowToStep",
          position: 2,
          name: "Copy the markdown snippet",
          text: "Each variant has copy-paste-ready markdown, HTML, and BBCode. The markdown form is what you want for GitHub READMEs.",
        },
        {
          "@type": "HowToStep",
          position: 3,
          name: "Paste it anywhere",
          text: "Drop the snippet into your README, project page, or docs. The badge renders within seconds and stays current via the CDN ETag.",
        },
      ],
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};

function CopyBlock({ label, value }: { label: string; value: string }) {
  return (
    <>
      <p className="text-xs text-gray-400 mt-3 mb-2">{label}</p>
      <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-sky-300 overflow-x-auto whitespace-pre-wrap break-all">
        <code>{value}</code>
      </pre>
    </>
  );
}

export default function BuiltWithPage() {
  return (
    <>
      <AgentMirrorLinks path="/built-with" qaCategory="general" />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-400 mb-6" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span>Built With</span>
        </nav>

        <header className="mb-10">
          <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
            Built-With badge
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Show that your project runs on @gitdealflow/mcp-signal
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed" data-speakable>
            One-line copy-paste. Three variants. CC BY 4.0. If you call our MCP
            server, the signals JSON, or the dataset API anywhere in your
            stack, this badge tells your visitors where the data comes from —
            and gives us a permanent backlink in return.
          </p>
        </header>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">Live preview</h2>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 flex flex-wrap items-center gap-4">
            {VARIANTS.map((v) => (
              <div key={v.name} className="flex flex-col items-start gap-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={v.url}
                  alt={`Built-With badge — ${v.name}`}
                  className="h-5"
                  loading="lazy"
                />
                <span className="text-[10px] uppercase tracking-wider text-gray-400">
                  {v.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            Copy-paste snippets
          </h2>
          <div className="space-y-6">
            {VARIANTS.map((v) => (
              <article
                key={v.name}
                id={v.name}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-6"
              >
                <h3 className="text-base font-semibold text-white capitalize mb-1">
                  {v.name} variant
                </h3>
                <p className="text-sm text-gray-300 mb-3">{v.caption}</p>
                <CopyBlock label="Markdown (README.md)" value={v.markdown} />
                <CopyBlock label="HTML (project site)" value={v.html} />
                <CopyBlock label="BBCode (forums)" value={v.bbcode} />
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            What you get for embedding
          </h2>
          <ul className="text-sm text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
            <li>
              Permanent badge served from a Vercel edge node. CDN-cached for
              24h, ETag-revalidated hourly. No outage on your README.
            </li>
            <li>
              Free MCP access to all six read tools, forever. No signup, no
              key, no telemetry on calls.
            </li>
            <li>
              Featured on{" "}
              <Link href="/mirrors" className="text-sky-400 hover:text-sky-300">
                /mirrors
              </Link>{" "}
              once you ping{" "}
              <a
                href="mailto:signal@gitdealflow.com"
                className="text-sky-400 hover:text-sky-300"
              >
                signal@gitdealflow.com
              </a>{" "}
              with a link to your project. Mutual backlink.
            </li>
            <li>
              First-look access when we ship new datasets, sectors, or tier-zero
              tools — implementers get the changelog before the broadcast list.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">
            The six free-tier MCP tools
          </h2>
          <p className="text-sm text-gray-300 mb-4">
            These six tools are tier-zero — free, no signup, no rate limit on
            the public CDN. If your project calls any of them, you can wear the
            badge.
          </p>
          <div className="rounded-lg border border-slate-800 bg-slate-900/40 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-950/60 border-b border-slate-800">
                <tr>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-4 py-3">
                    Tool
                  </th>
                  <th className="text-left text-xs uppercase tracking-wider text-gray-400 font-semibold px-4 py-3">
                    Returns
                  </th>
                </tr>
              </thead>
              <tbody>
                {FREE_TOOLS.map((t, i) => (
                  <tr
                    key={t.name}
                    className={i < FREE_TOOLS.length - 1 ? "border-b border-slate-800" : ""}
                  >
                    <td className="px-4 py-3 font-mono text-sky-300 whitespace-nowrap">
                      {t.name}
                    </td>
                    <td className="px-4 py-3 text-gray-300">{t.desc}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-xs text-gray-400 mt-3">
            Full schema and install instructions:{" "}
            <Link href="/integrations" className="hover:text-gray-300">
              /integrations
            </Link>{" "}
            ·{" "}
            <a
              href="https://www.npmjs.com/package/@gitdealflow/mcp-signal"
              className="hover:text-gray-300"
              rel="noopener"
            >
              npm
            </a>{" "}
            ·{" "}
            <a
              href="https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal"
              className="hover:text-gray-300"
              rel="noopener"
            >
              Glama A-Tier (4.9/5.0 across 6 tools)
            </a>
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-white mb-4">FAQ</h2>
          <dl className="space-y-5">
            {FAQ.map((f) => (
              <div key={f.q}>
                <dt className="text-base font-semibold text-white mb-1">
                  {f.q}
                </dt>
                <dd className="text-sm text-gray-300 leading-relaxed">
                  {f.a}
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link href="/badge-builder" className="hover:text-gray-300">
            Scout Score &amp; Momentum builder
          </Link>{" "}
          ·{" "}
          <Link href="/embed" className="hover:text-gray-300">
            Embed catalog
          </Link>{" "}
          ·{" "}
          <Link href="/integrations" className="hover:text-gray-300">
            MCP integrations
          </Link>{" "}
          ·{" "}
          <Link href="/mirrors" className="hover:text-gray-300">
            Mirrors
          </Link>
        </p>
      </div>
    </>
  );
}
