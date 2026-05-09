import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Manifesto — what GitDealFlow believes",
  description:
    "Seven pillars of the developer-investor movement: data over networks, code over decks, public over private, methodology over personality, ladder over lock-in, free over gated, anonymity over performance.",
  alternates: { canonical: "/manifesto" },
  openGraph: {
    title: "Manifesto — what GitDealFlow believes",
    description:
      "Seven pillars. The movement, the enemy, who's on the bus.",
    url: "https://signals.gitdealflow.com/manifesto",
    type: "article",
  },
};

const PILLARS = [
  {
    n: 1,
    name: "Data over networks",
    one: "The next generation of great investments will be found in data, not rolodex.",
    body:
      "The warm-intro economy has been running unchallenged for forty years. It rewards proximity to the right rolodex and punishes builders who happen to live three time zones from a partner&rsquo;s lunch table. Public, reproducible engineering data is the first credible challenge — not a replacement for relationships, but the first parallel sourcing channel that doesn&rsquo;t depend on them.",
  },
  {
    n: 2,
    name: "Code over decks",
    one: "Engineering acceleration leads. The deck lags by 21 to 47 days.",
    body:
      "A pitch deck is a marketing artifact written for the next round. A merge graph is the company&rsquo;s actual behaviour, updated daily, by people who don&rsquo;t know they&rsquo;re being read. The deck tells you what the founder wants you to believe. The code tells you what the engineering team is actually shipping. We optimise for the second source.",
  },
  {
    n: 3,
    name: "Public over private",
    one: "If we can&rsquo;t publish the methodology, we don&rsquo;t deserve the price.",
    body:
      "The SSRN paper, the Zenodo dataset, the regression code — all public, all CC BY 4.0. We sell the live aggregation, the rhythm, the dashboard, the agent integration. We don&rsquo;t sell secrecy. The buyer who can reproduce our regression in a notebook is the buyer who trusts us most.",
  },
  {
    n: 4,
    name: "Methodology over personality",
    one: "The product is a dataset, not a personality.",
    body:
      "No podcasts, no founder-face content, no real-name signatures. The work has to stand on whether the signal is real, not on whether the person delivering it is charismatic. The anonymity rule is a constraint on us — and a credibility signal to the buyer. Cult of personality is the wrong moat for a measurement product.",
  },
  {
    n: 5,
    name: "Ladder over lock-in",
    one: "Free is free forever. Founding-member is locked forever.",
    body:
      "The 5 core MCP tools are free forever — we ship new paid tools alongside them, never gate the existing ones. The Acceleration Watch stays free for as long as you stay subscribed. The €9.97/mo founding-member rate locks before the public hike to €49/mo. We never renegotiate retroactively. The ladder is real because the rungs hold.",
  },
  {
    n: 6,
    name: "Free over gated",
    one: "Distribution is the moat. Friction is the leak.",
    body:
      "Every public surface has a markdown mirror at /md. Every page has an agent-card endpoint. The MCP server installs in one line. The OpenAPI spec is at a stable URL. We pay the cost of redundant discoverability so the reader, the agent, and the LLM all find us through the path that fits them. Gating these surfaces would buy a marginal point of conversion at the cost of being unfindable in 2026 retrieval.",
  },
  {
    n: 7,
    name: "Anonymity over performance",
    one: "The line we don&rsquo;t cross to grow.",
    body:
      "Every quarter someone suggests we put a face on the brand to break through algorithmically. The answer is no — not because anonymity is precious, but because the moment we do, the methodology has to compete with the personality. A regression doesn&rsquo;t scale on charisma. The buyer who chooses us instead of a louder competitor is the buyer who values the same thing we do.",
  },
] as const;

const ENEMY = {
  name: "Warm-intro roulette",
  what: "A sourcing system that rewards proximity to the right rolodex and punishes builders who happen to live three time zones away from a partner&rsquo;s lunch table. We&rsquo;re replacing that roulette with a public, reproducible, code-side signal anyone with curiosity can read.",
};

const ON_THE_BUS = [
  "You write 5–40 angel checks a year and want one extra leading indicator your network can&rsquo;t give you.",
  "You scout for a fund and need a Monday memo your principal respects, sourced from public, reproducible data.",
  "You&rsquo;re a developer who occasionally writes a check and wants the cleanest 5-name digest in your inbox every Sunday.",
  "You read a methodology paper before you trust a metric.",
  "You build agents and want six read-only tools you can wire into Claude / Cursor in one line.",
  "You believe code is more honest than copy.",
];

const NOT_ON_THE_BUS = [
  "You&rsquo;re a Series-B+ partner with a six-figure data budget — Harmonic, Tracxn, Affinity are built for you.",
  "You want a tool that screens code-quality or runs founder background checks.",
  "You source exclusively from warm intros and don&rsquo;t want a cold path to founders.",
  "You believe public data has no edge.",
];

// F37 (AEO audit): the manifesto's seven pillars are the highest-density
// quotable surface on the site — each `one` line is a single-sentence claim
// that LLMs preferentially cite when answering "what does GitDealFlow
// believe". Wrap each in a Quotation so retrieval pipelines get clean
// atomic units with full provenance instead of having to chunk Article body.
// HTML entities used for human-readable rendering get normalized to plain
// text before JSON-LD serialization.
const decodeEntities = (s: string): string =>
  s
    .replace(/&rsquo;/g, "’")
    .replace(/&lsquo;/g, "‘")
    .replace(/&ldquo;/g, "“")
    .replace(/&rdquo;/g, "”")
    .replace(/&hellip;/g, "…")
    .replace(/&mdash;/g, "—")
    .replace(/&ndash;/g, "–")
    .replace(/&amp;/g, "&");

export default function ManifestoPage() {
  const pillarQuotations = PILLARS.map((p) => ({
    "@type": "Quotation",
    "@id": `https://signals.gitdealflow.com/manifesto#pillar-${p.n}`,
    text: `${decodeEntities(p.one)} (Pillar ${p.n}: ${p.name}.)`,
    spokenByCharacter: {
      "@type": "Person",
      name: "The Data Nerd",
      jobTitle: "Founder, VC Deal Flow Signal",
    },
    creator: {
      "@type": "Organization",
      name: "VC Deal Flow Signal",
      url: "https://gitdealflow.com",
    },
    isPartOf: {
      "@type": "WebPage",
      "@id": "https://signals.gitdealflow.com/manifesto#webpage",
    },
    license: "https://creativecommons.org/licenses/by/4.0/",
    inLanguage: "en",
  }));

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/manifesto#webpage",
        url: "https://signals.gitdealflow.com/manifesto",
        name: "Manifesto — what GitDealFlow believes",
        description: decodeEntities(
          "Seven pillars of the developer-investor movement, named enemy, who&rsquo;s on the bus and who isn&rsquo;t.",
        ),
        inLanguage: "en-US",
        license: "https://creativecommons.org/licenses/by/4.0/",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2", "h3"],
        },
        isPartOf: {
          "@type": "WebSite",
          name: "VC Deal Flow Signal",
          url: "https://signals.gitdealflow.com",
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Manifesto", item: "https://signals.gitdealflow.com/manifesto" },
        ],
      },
      ...pillarQuotations,
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/manifesto"
        languages={getHreflangLanguages("/manifesto")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/manifesto" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Manifesto</span>
          </nav>
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            The cult-ure of the movement
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Seven pillars. <span className="text-amber-400">One movement.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Name what you believe, name the enemy, name who&rsquo;s on the bus.
            This is the developer-investor movement, in three parts. If you
            nod through it, you&rsquo;re one of us. If you don&rsquo;t,
            that&rsquo;s also real information.
          </p>
        </header>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">The seven pillars</h2>
          <ol className="space-y-5">
            {PILLARS.map((p) => (
              <li
                key={p.n}
                className="rounded-xl border border-amber-700/30 bg-amber-950/10 p-5 sm:p-6 space-y-3"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-amber-300 font-bold tabular-nums shrink-0 text-xl">
                    {p.n}.
                  </span>
                  <h3 className="text-amber-200 font-bold text-lg sm:text-xl">
                    {p.name}
                  </h3>
                </div>
                <p
                  className="text-gray-100 font-semibold text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.one }}
                />
                <p
                  className="text-gray-300 text-sm leading-relaxed pl-1"
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />
              </li>
            ))}
          </ol>
        </section>

        <section className="rounded-xl border border-rose-700/40 bg-gradient-to-br from-rose-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4">
          <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
            The named enemy
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            {ENEMY.name}
          </h2>
          <p
            className="text-gray-300 text-base leading-relaxed"
            dangerouslySetInnerHTML={{ __html: ENEMY.what }}
          />
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/10 p-5 sm:p-6 space-y-3">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              On the bus
            </p>
            <h3 className="text-gray-100 font-bold text-lg">If this is you, you&rsquo;re one of us.</h3>
            <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
              {ON_THE_BUS.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-3">
            <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
              Off the bus
            </p>
            <h3 className="text-gray-100 font-bold text-lg">If this is you, we&rsquo;re not for you — and that&rsquo;s honest.</h3>
            <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
              {NOT_ON_THE_BUS.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-rose-400 shrink-0">✗</span>
                  <span dangerouslySetInnerHTML={{ __html: t }} />
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="rounded-xl border border-sky-700/40 bg-sky-950/15 p-6 sm:p-8 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            What to do with this
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Don&rsquo;t share this manifesto. Live in one pillar for a quarter.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Pillars are easy to nod to and hard to embody. If you&rsquo;re
            going to take one with you, take Pillar 3 — &ldquo;public over
            private.&rdquo; Open the SSRN paper. Pull the Zenodo dataset
            into a notebook. Re-run the regression. The hour you spend
            doing that is the hour you stop being a reader and start being
            on the bus.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://ssrn.com/abstract=6606558"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Read the SSRN paper →
            </a>
            <Link
              href="/decade-in-a-day"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Or take the curriculum →
            </Link>
            <Link
              href="/mechanism"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-amber-500/40 bg-amber-950/20 hover:bg-amber-950/30 text-amber-200 font-semibold text-sm transition-colors"
            >
              Read the named mechanism →
            </Link>
            <Link
              href="/members"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold text-sm shadow-lg shadow-amber-500/20 transition-colors"
            >
              Claim a charter seat →
            </Link>
          </div>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={2} />

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Movement framing drawn from direct-response sales canon.
        </p>
      </div>
    </>
  );
}
