import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Embed — Free Widgets, Badges &amp; OG Cards",
  description:
    "Free embeddable widgets and badges from VC Deal Flow Signal. Scout Score badges, repo momentum badges, signal-of-the-week OG cards. Drop a single URL into a README, blog post, or social card. CC BY 4.0 — attribution baked into the asset.",
  alternates: { canonical: "/embed" },
  openGraph: {
    title: "Embed — VC Deal Flow Signal",
    description:
      "Free embeddable badges, widgets, and OG cards. One URL each. CC BY 4.0.",
    type: "article",
    url: `${SITE}/embed`,
  },
};

interface Embed {
  group: "Badges" | "OG cards" | "Mini-widgets";
  name: string;
  href: string;
  preview?: string;
  example: string;
  description: string;
  copy: string;
}

const EMBEDS: Embed[] = [
  // Badges
  {
    group: "Badges",
    name: "Scout Score badge",
    href: `${SITE}/api/badge/scout/{username}/svg`,
    preview: `${SITE}/api/badge/scout/torvalds/svg`,
    example: `${SITE}/api/badge/scout/torvalds/svg`,
    description:
      "0–100 Scout Score for any GitHub username. Rendered as shields.io-style SVG. Replace {username} with a GitHub handle.",
    copy: `[![Scout Score](https://signals.gitdealflow.com/api/badge/scout/{username}/svg)](https://signals.gitdealflow.com/s/{username})`,
  },
  {
    group: "Badges",
    name: "Repo momentum badge",
    href: `${SITE}/api/badge/momentum/{org}/{repo}/svg`,
    preview: `${SITE}/api/badge/momentum/vercel/next.js/svg`,
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
    example: `${SITE}/api/badge/built-with/svg?variant=long`,
    description:
      "'Built with @gitdealflow/mcp-signal' badge for any project that calls our MCP server, signals JSON, or dataset API. Three variants — default, compact, long — via ?variant=. One ask, permanent backlink. Full landing at /built-with.",
    copy: `[![Built with gitdealflow MCP](https://signals.gitdealflow.com/api/badge/built-with/svg)](https://signals.gitdealflow.com/built-with)`,
  },

  // OG cards
  {
    group: "OG cards",
    name: "Signal-of-the-week OG card",
    href: `${SITE}/api/og/signal-card?org={org}&metric={metric}&delta={delta}`,
    preview: `${SITE}/api/og/signal-card`,
    example: `${SITE}/api/og/signal-card?org=Acme&metric=Δ%20Velocity&delta=%2B142%25`,
    description:
      "1200×630 OG image showing an org name, the chosen metric, and a delta. Use as Twitter card, LinkedIn share image, or blog hero. Fresh image on every share.",
    copy: `<meta property="og:image" content="https://signals.gitdealflow.com/api/og/signal-card?org=Acme&metric=Velocity&delta=%2B142%25" />`,
  },

  // Mini-widgets
  {
    group: "Mini-widgets",
    name: "Sector mini-leaderboard (iframe)",
    href: `${SITE}/embed/leaderboard/{sector-slug}`,
    example: `${SITE}/embed/leaderboard/ai-ml`,
    description:
      "Compact iframe-friendly leaderboard for a single sector. Shows top 5 startups by current 14-day commit velocity. Sandbox-safe.",
    copy: `<iframe src="https://signals.gitdealflow.com/embed/leaderboard/ai-ml" width="380" height="320" frameborder="0" loading="lazy"></iframe>`,
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

const GROUPS: Embed["group"][] = ["Badges", "OG cards", "Mini-widgets"];

export default function EmbedPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/embed#page`,
        name: "Embed — VC Deal Flow Signal",
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="text-xs text-gray-500 mb-6" aria-label="Breadcrumb">
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
          Free embeddable badges, OG cards, and mini-widgets. Drop a single
          URL into a README, blog post, or social card. CC BY 4.0 — every
          asset carries attribution.
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
                          className="max-w-full"
                        />
                      </div>
                    ) : null}
                    <p className="text-xs text-gray-500 mb-2 mt-3">URL pattern</p>
                    <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto mb-3">
                      <code>{e.href}</code>
                    </pre>
                    <p className="text-xs text-gray-500 mb-2">Example</p>
                    <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-sky-300 overflow-x-auto mb-3">
                      <code>{e.example}</code>
                    </pre>
                    <p className="text-xs text-gray-500 mb-2">Copy-paste</p>
                    <pre className="rounded-md bg-slate-950 border border-slate-800 px-4 py-3 text-xs font-mono text-gray-200 overflow-x-auto whitespace-pre-wrap">
                      <code>{e.copy}</code>
                    </pre>
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
              Inline-embedding hundreds of badges on a single page is fine —
              they all hit cache after the first paint.
            </li>
            <li>
              Mini-widget iframes set <code className="font-mono text-sky-300">x-frame-options: ALLOWALL</code>
              {" "}so they embed cross-origin without setup.
            </li>
            <li>
              No API key required for any surface. If you build something
              with these, drop a link to{" "}
              <a
                href="mailto:signal@gitdealflow.com"
                className="text-sky-400 hover:text-sky-300"
              >
                signal@gitdealflow.com
              </a>{" "}
              — we&apos;ll feature it on{" "}
              <Link href="/mirrors" className="text-sky-400 hover:text-sky-300">
                /mirrors
              </Link>
              .
            </li>
          </ul>
        </section>

        <p className="text-xs text-gray-500 text-center">
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
      </main>
    </>
  );
}
