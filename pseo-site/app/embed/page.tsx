import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { withEditorialOverride } from "@/lib/metadata";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = withEditorialOverride({
  title: "Embed, Free Widgets, Badges &amp; OG Cards",
  description:
    "Free embeddable widgets and badges from VC Deal Flow Signal. Scout Score badges, repo momentum badges, signal-of-the-week OG cards. Drop a single URL into a README, blog post, or social card. CC BY 4.0, attribution baked into the asset.",
  alternates: { canonical: "/embed" },
  openGraph: {
    title: "Embed",
    description:
      "Free embeddable badges, widgets, and OG cards. One URL each. CC BY 4.0.",
    type: "article",
    url: `${SITE}/embed`,
  },
});

interface Embed {
  group: "Calculators" | "Badges" | "OG cards" | "Mini-widgets";
  name: string;
  href: string;
  preview?: string;
  /** Intrinsic preview width (SVG badges are tiny, OG PNGs are 1200x630). */
  previewW?: number;
  /** Intrinsic preview height, emitted as height={...} to reserve layout space (CLS). */
  previewH?: number;
  example: string;
  description: string;
  copy: string;
  /** Optional secondary snippet, e.g. a <script>-tag alternative to <iframe>. */
  copyAlt?: string;
  copyAltLabel?: string;
}

// Calculators, defined first so they appear at the top of the docs page.
// Operator newsletters and VC blogs are the primary embed surface for these.
const CALCULATOR_EMBEDS: Embed[] = (
  [
    {
      slug: "safe-calculator",
      name: "SAFE Calculator",
      description:
        "Post-money SAFE conversion math, cap vs discount, effective ownership at the next priced round. Sliders + share-link.",
      height: 620,
    },
    {
      slug: "runway-calculator",
      name: "Runway Calculator",
      description:
        "Months of cash runway from balance and net burn, with optional headcount-scenario modeling.",
      height: 560,
    },
    {
      slug: "burn-multiple-calculator",
      name: "Burn Multiple Calculator",
      description:
        "Total burn ÷ net new ARR, classified into the David Sacks bands (exceptional / great / OK / suspect / bad).",
      height: 520,
    },
    {
      slug: "magic-number-calculator",
      name: "Magic Number Calculator",
      description:
        "Annualized net new ARR ÷ quarterly S&M spend, Bessemer / OpenView SaaS sales efficiency.",
      height: 520,
    },
    {
      slug: "cac-payback-calculator",
      name: "CAC Payback Calculator",
      description:
        "Months to recover customer acquisition cost from gross-margin contribution. Standard bands built in.",
      height: 520,
    },
    {
      slug: "ltv-calculator",
      name: "LTV Calculator",
      description:
        "Customer lifetime value + LTV:CAC ratio with industry-standard bands (>5× exceptional, 3-5× healthy, …).",
      height: 540,
    },
    {
      slug: "quick-ratio-calculator",
      name: "Quick Ratio Calculator",
      description:
        "(New + expansion ARR) ÷ (churned + contracted), Kleiner Perkins / Mamoon Hamid SaaS growth efficiency.",
      height: 520,
    },
    {
      slug: "dilution-stack",
      name: "Dilution Stack",
      description:
        "Up-to-three stacked post-money SAFEs converting at a priced Series A with option-pool refresh. Founder ownership + over-dilution warnings.",
      height: 760,
    },
  ] as Array<{
    slug: string;
    name: string;
    description: string;
    height: number;
  }>
).map(({ slug, name, description, height }) => ({
  group: "Calculators",
  name: `${name} (iframe)`,
  href: `${SITE}/embed/tools/${slug}`,
  preview: `${SITE}/api/og/tools/${slug}`,
  previewW: 1200,
  previewH: 630,
  example: `${SITE}/embed/tools/${slug}`,
  description: `${description} Dark theme, CC BY 4.0 attribution baked in, auto-resize via /embed.js. Full standalone tool at /tools/${slug}.`,
  copy: `<iframe src="https://signals.gitdealflow.com/embed/tools/${slug}" width="100%" height="${height}" frameborder="0" loading="lazy" title="${name}, GitDealFlow"></iframe>`,
  copyAlt: `<script src="https://signals.gitdealflow.com/embed.js" data-tool="${slug}"></script>`,
  copyAltLabel:
    "Script tag (auto-resize, for hosts that allow JS, Ghost, WordPress, Notion)",
}));

const EMBEDS: Embed[] = [
  ...CALCULATOR_EMBEDS,
  // Badges
  {
    group: "Badges",
    name: "Scout Score badge",
    href: `${SITE}/api/badge/scout/{username}/svg`,
    preview: `${SITE}/api/badge/scout/torvalds/svg`,
    previewW: 146,
    previewH: 20,
    example: `${SITE}/api/badge/scout/torvalds/svg`,
    description:
      "0-100 Scout Score for any GitHub username. Rendered as shields.io-style SVG. Replace {username} with a GitHub handle.",
    copy: `[![Scout Score](https://signals.gitdealflow.com/api/badge/scout/{username}/svg)](https://signals.gitdealflow.com/s/{username})`,
  },
  {
    group: "Badges",
    name: "Repo momentum badge",
    href: `${SITE}/api/badge/momentum/{org}/{repo}/svg`,
    preview: `${SITE}/api/badge/momentum/vercel/next.js/svg`,
    previewW: 143,
    previewH: 20,
    example: `${SITE}/api/badge/momentum/vercel/next.js/svg`,
    description:
      "GitHub momentum (Δ commit velocity, color-coded) for any public repo. Auto-refreshes weekly. Drop into a README.",
    copy: `[![GitHub Momentum](https://signals.gitdealflow.com/api/badge/momentum/{org}/{repo}/svg)](https://signals.gitdealflow.com/startup/{repo})`,
  },
  {
    group: "Badges",
    name: "Built-With badge",
    href: `${SITE}/api/badge/built-with/svg`,
    preview: `${SITE}/api/badge/built-with/svg`,
    previewW: 169,
    previewH: 20,
    example: `${SITE}/api/badge/built-with/svg?variant=long`,
    description:
      "'Built with @gitdealflow/mcp-signal' badge for any project that calls our MCP server, signals JSON, or dataset API. Three variants, default, compact, long, via ?variant=. One ask, permanent backlink. Full landing at /built-with.",
    copy: `[![Built with gitdealflow MCP](https://signals.gitdealflow.com/api/badge/built-with/svg)](https://signals.gitdealflow.com/built-with)`,
  },
  {
    group: "Badges",
    name: "Sector signal badge",
    href: `${SITE}/api/badge/sector/{sector-slug}/svg`,
    preview: `${SITE}/api/badge/sector/healthcare/svg`,
    previewW: 160,
    previewH: 20,
    example: `${SITE}/api/badge/sector/healthcare/svg`,
    description:
      "Compact shields-style badge showing a tracked sector's startup count, color-coded by aggregate momentum. One URL per sector, live from the weekly signal corpus. Replace {sector-slug} with any tracked sector (healthcare, fintech, web3, ...).",
    copy: `[![Healthcare: 26 startups tracked](https://signals.gitdealflow.com/api/badge/sector/{sector-slug}/svg)](https://signals.gitdealflow.com/startups-to-watch/{sector-slug}-q3-2026)`,
  },
  {
    group: "Badges",
    name: "Sector momentum chart",
    href: `${SITE}/api/chart/sector/{sector-slug}/svg`,
    preview: `${SITE}/api/chart/sector/healthcare/svg`,
    previewW: 760,
    previewH: 494,
    example: `${SITE}/api/chart/sector/healthcare/svg`,
    description:
      "760px bar chart of a sector's top 8 startups by 14-day commit velocity, with aggregate stats (startup count, breakout count, average velocity change) and a Powered-by attribution line. Drop one <img> into a Substack, Ghost, or Notion post. Self-updates weekly.",
    copy: `[![Healthcare sector momentum](https://signals.gitdealflow.com/api/chart/sector/{sector-slug}/svg)](https://signals.gitdealflow.com/startups-to-watch/{sector-slug}-q3-2026)`,
  },

  // OG cards
  {
    group: "OG cards",
    name: "Signal-of-the-week OG card",
    href: `${SITE}/api/og/signal-card?org={org}&metric={metric}&delta={delta}`,
    preview: `${SITE}/api/og/signal-card`,
    previewW: 1200,
    previewH: 630,
    example: `${SITE}/api/og/signal-card?org=Acme&metric=Δ%20Velocity&delta=%2B142%25`,
    description:
      "1200×630 OG image showing an org name, the chosen metric, and a delta. Use as Twitter card, LinkedIn share image, or blog hero. Fresh image on every share.",
    copy: `<meta property="og:image" content="https://signals.gitdealflow.com/api/og/signal-card?org=Acme&metric=Velocity&delta=%2B142%25" />`,
  },

  // Mini-widgets
  {
    group: "Mini-widgets",
    name: "Weekly Acceleration Watch (iframe)",
    href: `${SITE}/embed/weekly`,
    example: `${SITE}/embed/weekly`,
    description:
      "Drop-in iframe widget showing the top 5 picks from this week's Engineering Acceleration Watch. Updates every Monday. CDN-cached, sandbox-safe, and styled with the same fixed dark palette as the site. Pulls from the same dataset as /predicted and /predicted/feed.json.",
    copy: `<iframe src="https://signals.gitdealflow.com/embed/weekly?pub=your-newsletter" width="380" height="420" frameborder="0" loading="lazy" title="Engineering Acceleration Watch, top 5 this week"></iframe>`,
  },
  {
    group: "Mini-widgets",
    name: "Receipts (Scout proof) card",
    href: `${SITE}/s/{username}`,
    example: `${SITE}/s/torvalds`,
    description:
      "Shareable scout proof page for any GitHub user. Auto-OG-image, copy-paste-friendly. Public, no login.",
    copy: `https://signals.gitdealflow.com/s/{username}`,
  },
];

const GROUPS: Embed["group"][] = [
  "Calculators",
  "Mini-widgets",
  "Badges",
  "OG cards",
];

export default function EmbedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/embed#page`,
        name: "Embed, VC Deal Flow Signal",
        url: `${SITE}/embed`,
        inLanguage: "en-US",
        isPartOf: { "@id": `${SITE}/#website` },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-speakable]"],
        },
      },
      {
        "@type": "ItemList",
        "@id": `${SITE}/embed#list`,
        numberOfItems: EMBEDS.length,
        itemListElement: EMBEDS.map((e, i) => ({
          "@type": "ListItem",
          position: i + 1,
          url: e.example,
          name: e.name,
        })),
      },
      // WebApplication nodes for the 8 embeddable calculators, these are the
      // primary embeddable software surfaces. Adding explicit SoftwareApplication /
      // WebApplication JSON-LD lets AI answer engines (Perplexity, ChatGPT,
      // Bing Copilot) and app directories (Futurepedia, TAAFT) index each tool
      // as a distinct application with its own URL, lifting the AUTHORITY pillar
      // and discovery beyond link-only references.
      ...CALCULATOR_EMBEDS.map((e) => {
        const slug = e.href.split("/embed/tools/")[1];
        return {
          "@type": "WebApplication",
          "@id": `${e.href}#webapp`,
          name: e.name,
          url: e.href,
          description: e.description,
          applicationCategory: "FinanceApplication",
          operatingSystem: "Any (web browser)",
          browserRequirements: "Requires JavaScript",
          offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
          },
          license:
            "https://creativecommons.org/licenses/by/4.0/",
          publisher: { "@id": `${SITE}/#website` },
          isAccessibleForFree: true,
          installUrl: e.example,
        };
      }),
    ],
  };

  return (
    <>
      <AgentMirrorLinks path="/embed" qaCategory="embed" />
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
          <span>Embed</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
          Embed
        </h1>
        <p
          className="text-lg text-gray-300 mb-10 leading-relaxed"
          data-speakable
        >
          Free embeddable calculators, badges, OG cards, and mini-widgets.
          Drop a single iframe or script tag into a README, Substack post,
          Ghost site, Notion page, or VC blog. CC BY 4.0, every asset
          carries attribution back to{" "}
          <Link href="/" className="text-sky-400 hover:text-sky-300">
            signals.gitdealflow.com
          </Link>
          .
        </p>

        {GROUPS.map((group) => {
          const items = EMBEDS.filter((e) => e.group === group);
          if (items.length === 0) return null;
          return (
            <section key={group} className="mb-12">
              <h2 className="text-xl font-semibold text-white mb-4">{group}</h2>
              <div className="space-y-6">
                {items.map((e) => (
                  <article
                    key={e.name}
                    className="rounded-lg border border-slate-800 bg-slate-900/40 p-6"
                  >
                    <h3 className="text-base font-semibold text-white mb-2">
                      {e.name}
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed mb-4">
                      {e.description}
                    </p>
                    {e.preview ? (
                      <div className="rounded-md bg-slate-950 border border-slate-800 p-4 mb-3 flex items-center justify-center min-h-[60px]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={e.preview}
                          alt={`Preview of ${e.name}`}
                          loading="lazy"
                          width={e.previewW ?? 1200}
                          height={e.previewH ?? 630}
                          className="max-w-full h-auto"
                        />
                      </div>
                    ) : null}
                    <p className="text-xs text-gray-400 mb-2 mt-3">URL pattern</p>
                    <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto mb-3">
                      <code>{e.href}</code>
                    </pre>
                    <p className="text-xs text-gray-400 mb-2">Example</p>
                    <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-sky-300 overflow-x-auto mb-3">
                      <code>{e.example}</code>
                    </pre>
                    <p className="text-xs text-gray-400 mb-2">Copy-paste</p>
                    <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap">
                      <code>{e.copy}</code>
                    </pre>
                    {e.copyAlt ? (
                      <>
                        <p className="text-xs text-gray-400 mb-2 mt-3">
                          {e.copyAltLabel ?? "Alternate snippet"}
                        </p>
                        <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap">
                          <code>{e.copyAlt}</code>
                        </pre>
                      </>
                    ) : null}
                  </article>
                ))}
              </div>
            </section>
          );
        })}

        <section className="rounded-lg border border-slate-800 bg-slate-900/40 p-6 mb-10">
          <h2 className="text-base font-semibold text-white mb-3">
            Caching &amp; rate limits
          </h2>
          <ul className="text-sm text-gray-300 leading-relaxed space-y-2 list-disc pl-5">
            <li>
              Badges and OG cards are CDN-cached for ~1 hour at the edge.
              Inline-embedding hundreds of badges on a single page is fine -
              they all hit cache after the first paint.
            </li>
            <li>
              Calculator + mini-widget iframes set{" "}
              <code className="font-mono text-sky-300">
                x-frame-options: ALLOWALL
              </code>{" "}
              so they embed cross-origin without setup. Substack, Beehiiv,
              Ghost, WordPress, and Notion all accept these snippets as-is.
            </li>
            <li>
              For hosts that allow JS, the{" "}
              <code className="font-mono text-sky-300">
                /embed.js
              </code>{" "}
              loader handles auto-resize via postMessage, no fixed{" "}
              <code className="font-mono text-sky-300">height=</code>{" "}
              guess required.
            </li>
            <li>
              No API key required for any surface. If you build something
              with these, drop a link to{" "}
              <a
                href="mailto:signals@gitdealflow.com"
                className="text-sky-400 hover:text-sky-300"
              >
                signals@gitdealflow.com
              </a>{" "}
we&apos;ll feature it on{" "}
              <Link href="/mirrors" className="text-sky-400 hover:text-sky-300">
                /mirrors
              </Link>
              .
            </li>
          </ul>
        </section>

        <p className="text-xs text-gray-400 text-center">
          See also:{" "}
          <Link href="/badge-builder" className="hover:text-gray-300">
            Badge builder UI
          </Link>{" "}
          ·{" "}
          <Link href="/press" className="hover:text-gray-300">
            Press kit
          </Link>{" "}
          ·{" "}
          <Link href="/mirrors" className="hover:text-gray-300">
            Mirrors
          </Link>{" "}
          ·{" "}
          <Link href="/citation-guide" className="hover:text-gray-300">
            Citation guide
          </Link>
        </p>
      </div>
    </>
  );
}
