import type { Metadata } from "next";
import Link from "next/link";
import {
  startupIdeas,
  getStartupIdeasByCategory,
} from "@/content/startup-ideas";
import {
  countIdeasWithLiveMatches,
} from "@/lib/startup-ideas";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { FRESH_YEAR_PLAIN } from "@/lib/freshness-year";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 604800;

export const metadata: Metadata = {
  title: { absolute: `52 Startup Ideas ${FRESH_YEAR_PLAIN}: Buildable, Live Repos` },
  description: `Fifty-plus buildable startup ideas for ${FRESH_YEAR_PLAIN}, AI-native CRM, browser-use agents, vertical AI, dev tools, vibe-coding micro-SaaS. Each one paired with the three repos already accelerating against it, pulled live from our GitHub signal panel.`,
  alternates: { canonical: "/startup-ideas" },
  openGraph: {
    title: `Startup Ideas ${FRESH_YEAR_PLAIN}, buildable opportunities with the repos already trying`,
    description:
      "Fifty-plus buildable startup ideas, each paired with the three repos already accelerating against it. Pulled live from GitHub commit velocity.",
    url: `${SITE}/startup-ideas`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: `Startup Ideas ${FRESH_YEAR_PLAIN}, buildable opportunities, live signal`,
    description:
      "Fifty-plus buildable startup ideas. Each one with the three repos already accelerating against it.",
  },
};

const CATEGORY_ORDER = [
  "AI-Native SaaS",
  "Agent Infrastructure",
  "Vertical AI",
  "Dev Tools",
  "Data Infrastructure",
  "Multimodal",
  "Vibe-Coding / Micro-SaaS",
  "Climate & Niche",
  "Open Source / Community",
] as const;

const CATEGORY_BLURB: Record<string, string> = {
  "AI-Native SaaS":
    "Every B2B SaaS category, rebuilt with the agent as the primary surface.",
  "Agent Infrastructure":
    "Picks-and-shovels for the agent economy, runtimes, memory, eval, payment rails.",
  "Vertical AI":
    "AI for one industry at a time, legal, medical, real estate, construction, insurance.",
  "Dev Tools":
    "The cluster engineers pay for on a credit card. Code review, test gen, debugging, observability.",
  "Data Infrastructure":
    "The plumbing for the AI stack, vector stores, embeddings, ETL, warehouses.",
  Multimodal:
    "Voice, video, image, the layer above the foundation models that ships the workflow.",
  "Vibe-Coding / Micro-SaaS":
    "One-person SaaS, AI app generators, indie operator tools. The solo-founder cohort.",
  "Climate & Niche":
    "Compliance-driven and underserved verticals, carbon accounting, ESG underwriting.",
  "Open Source / Community":
    "Distribution-led plays, OSS funding, dev communities, the picks for the long tail.",
};

export default function StartupIdeasHubPage() {
  const byCategory = getStartupIdeasByCategory();
  const liveCount = countIdeasWithLiveMatches(startupIdeas);

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "CollectionPage",
        "@id": `${SITE}/startup-ideas#collection`,
        name: `Startup Ideas ${FRESH_YEAR_PLAIN}, buildable opportunities with the repos already trying`,
        description:
          "A curated set of buildable startup ideas for 2026, each paired with the top three GitHub repos already accelerating against it.",
        url: `${SITE}/startup-ideas`,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "[data-speakable]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: SITE,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Startup Ideas",
            item: `${SITE}/startup-ideas`,
          },
        ],
      },
      {
        "@type": "ItemList",
        name: "Buildable startup ideas, 2026",
        numberOfItems: startupIdeas.length,
        itemListOrder: "https://schema.org/ItemListUnordered",
        itemListElement: startupIdeas.map((idea, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: idea.title,
          url: `${SITE}/startup-ideas/${idea.slug}`,
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/startup-ideas`}
        languages={getHreflangLanguages("/startup-ideas")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/startup-ideas" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
        <header className="space-y-5">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Startup Ideas</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            {startupIdeas.length} buildable ideas · {liveCount} with live-signal
            matches · Refreshed weekly
          </p>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Startup ideas you could{" "}
            <span className="text-sky-400">build today</span>.
            <br className="hidden sm:block" />
            With the repos already trying.
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-3xl"
            data-speakable
          >
            Most startup-idea lists are vibes. This one is wired to live data -
            every idea below ships with the top three GitHub repos already
            accelerating against it, pulled from our current-period signal
            panel and re-ranked weekly. Use the framing for the why-now and
            what-to-build, then click through to see who&rsquo;s already moving.
          </p>
          <div className="flex flex-wrap gap-2 pt-2">
            {CATEGORY_ORDER.map((cat) => {
              const count = byCategory[cat]?.length ?? 0;
              if (count === 0) return null;
              const id = cat.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
              return (
                <a
                  key={cat}
                  href={`#${id}`}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-700 bg-slate-900 hover:border-sky-700/50 hover:bg-slate-800 text-gray-200 text-xs font-medium transition-colors"
                >
                  <span>{cat}</span>
                  <span className="text-gray-500 tabular-nums">{count}</span>
                </a>
              );
            })}
          </div>
        </header>

        <section
          aria-label="How this list works"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2"
        >
          <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
            How this list works
          </p>
          <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
            Each idea page has four blocks: <em>why now</em> (the trend that
            opens the wedge), <em>the idea you could build today</em> (the
            shape of the product + a build stack), <em>the three repos
            already trying</em> (live join into our GitHub signal panel -
            filtered by sector, name, and description match), and{" "}
            <em>the seed-round pattern</em> (the trendline that has
            historically preceded the announcement by three to six weeks).
          </p>
          <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
            Anonymity rule: ideas are categories of opportunity, and the repos
            surfaced are public GitHub orgs. We never name individual founders
            or stealth teams.
          </p>
        </section>

        {CATEGORY_ORDER.map((cat) => {
          const ideas = byCategory[cat];
          if (!ideas?.length) return null;
          const id = cat.replace(/[^a-z0-9]+/gi, "-").toLowerCase();
          return (
            <section
              key={cat}
              id={id}
              aria-label={`${cat} ideas`}
              className="space-y-4 scroll-mt-24"
            >
              <div className="space-y-1">
                <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                  {cat} · {ideas.length} ideas
                </p>
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
                  {CATEGORY_BLURB[cat]}
                </h2>
              </div>
              <ul className="grid gap-3 sm:gap-4 sm:grid-cols-2">
                {ideas.map((idea) => (
                  <li key={idea.slug}>
                    <Link
                      href={`/startup-ideas/${idea.slug}`}
                      className="block h-full rounded-xl border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-sky-700/40 transition-colors p-5 sm:p-6 space-y-2 group"
                    >
                      <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                        /startup-ideas/{idea.slug}
                      </p>
                      <h3 className="text-gray-100 font-semibold text-lg leading-snug group-hover:text-sky-200 transition-colors">
                        {idea.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed">
                        {idea.oneLiner}
                      </p>
                      <p className="text-sky-400 text-xs font-medium pt-1 group-hover:text-sky-300">
                        Read the idea →
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}

        <section
          aria-label="Use the signal"
          className="rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Use the signal, not just the idea
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Every idea here re-ranks weekly. Subscribe so you don&rsquo;t
            miss the trendline.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            The First Look digest sends the week&rsquo;s top-shifted ideas -
            the categories where the top-three repos changed, and the seed
            patterns we&rsquo;re watching for the next 90 days. Free. Reply
            with what you&rsquo;d build next.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-signal-500 hover:bg-signal-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the weekly First Look →
            </Link>
            <Link
              href="/trending"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Live trending board →
            </Link>
          </div>
        </section>

        <p className="text-gray-500 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Refreshed weekly. The editorial framing is curated; the &ldquo;three
          repos already trying&rdquo; slot on each page is generated live from
          our current-period GitHub signal panel.{" "}
          <Link
            href="/methodology"
            className="text-sky-400 underline decoration-dotted hover:text-sky-300"
          >
            Read the methodology
          </Link>
          .
        </p>
      </div>
    </>
  );
}
