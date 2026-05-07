import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Roadmap — what's shipping next, and what's on the public bet",
  description:
    "GitDealFlow public roadmap. Shipped this quarter, in flight, on deck, considering. Plus the live testing transparency log: what we tried, what worked, what we cut.",
  alternates: { canonical: "/roadmap" },
  openGraph: {
    title: "Roadmap — public roadmap + testing log",
    description:
      "What's shipping, what's in flight, what we cut. Public bet, public log.",
    url: "https://signals.gitdealflow.com/roadmap",
    type: "article",
  },
};

type Item = {
  title: string;
  desc: string;
  link?: string;
  external?: boolean;
};

const SHIPPED_Q2 = [
  { title: "Acceleration Watch (free weekly)", desc: "5 named startups every Monday with sector + percentile + decision rule.", link: "/predicted" },
  { title: "First Look Pass — €7 tripwire", desc: "Pick a sector, pay €7 once, get the 24-hour deep dive PDF + CSV.", link: "/firstlook" },
  { title: "Dashboard at €9.97/mo founding price", desc: "Live dashboard, refreshed Mondays. Founding-member rate locked forever.", link: "/pricing" },
  { title: "Sector Sweep — €1,997 stack", desc: "Full panel, three time windows, 60-min walkthrough call.", link: "/pricing#sector-sweep" },
  { title: "MCP server v1.6.0 published", desc: "Six read-only tools inside Claude / Cursor / any MCP host. npm: @gitdealflow/mcp-signal.", link: "https://www.npmjs.com/package/@gitdealflow/mcp-signal", external: true },
  { title: "ChatGPT GPT Store listing", desc: "VC Deal Flow Signal GPT, OpenAPI Action mounted, publisher-verified domain.", link: "https://chat.openai.com/g/g-vc-deal-flow-signal", external: true },
  { title: "Substack mirror (gitdealflow.substack.com)", desc: "Weekly Top-100 list + Acceleration Watch, canonical back to signals.gitdealflow.com.", link: "https://gitdealflow.substack.com", external: true },
  { title: "Bluesky / Mastodon / Farcaster posters", desc: "Three federated networks wired with cross-posting infrastructure.", link: "/distribution#social" },
  { title: "1,060+ pSEO pages live", desc: "12 hreflang locales, /startup/[slug]/[period], /predicted/[week].", link: "/sitemap.xml" },
  { title: "OpenAPI 3.1 spec — 21 endpoints", desc: "Public agent contract for the GPT, the MCP server, and any third-party agent.", link: "/api/actions/openapi.json" },
  { title: "Brunson Trilogy V4 — composite 89/100", desc: "Dream 100, Distribution map, 23 Building Blocks, Reverse-Eng teardown, Conversion Story script, 5-min Perfect Webinar.", link: "/funnels#building-blocks" },
] as const;

const IN_FLIGHT = [
  { title: "Brunson Trilogy V5 — push to 92 ceiling", desc: "Start Here onramp, Decade-in-a-Day curriculum, Manifesto, Roadmap, Best Bait sharpener. Shipping in this same window.", link: "/start-here" },
  { title: "Sector coverage: 19 → 24 sectors", desc: "Adding climate-software, robotics-ops, identity-infra, healthtech-RWD, fintech-rails-EU. Q3 target.", link: "/methodology" },
  { title: "Smithery re-listing (HTTP-hosted MCP)", desc: "Wrapping our stdio MCP in an HTTP gateway so we&rsquo;re re-discoverable in the new Smithery model.", link: "/install" },
  { title: "Wikipedia entry (Wikidata anchor live)", desc: "Wikidata Q-number set; Wikipedia draft pending notability passes.", link: "/wikipedia" },
] as const;

const ON_DECK = [
  { title: "Live A/B order-bump experimentation log", desc: "Public dashboard of the conversion experiments we run on /firstlook + /pricing." },
  { title: "Long-Form Video Sales Letter (LFVSL)", desc: "Voiceover-only walkthrough of /perfect-webinar. Anonymity-rule preserves: synthetic narration, no founder face." },
  { title: "Public scoreboard for past Acceleration Watch picks", desc: "Quarterly grading at 60d / 90d. Re-confirms the Magic Bullet (Expert Ch 13) on rolling cadence." },
  { title: "Insider Circle Telegram (private group)", desc: "Live for €97/mo subscribers. Spike alerts, monthly briefing, portfolio overlap." },
  { title: "Custom Sector Sweep — recurring Q4 rhythm", desc: "End-of-quarter deep dives on requested sectors, capped at 8 per quarter." },
] as const;

const CONSIDERING = [
  { title: "European-side data residency", desc: "Mirror dashboard + CSV in EU-hosted Postgres for GDPR-strict syndicates." },
  { title: "GitHub Actions integration", desc: "Push your portfolio orgs into a YAML, get a PR comment on weekly velocity changes." },
  { title: "Public funder map", desc: "Anonymized view of who&rsquo;s reading the Watch — by region, fund stage, focus." },
  { title: "Multi-language /perfect-webinar variants", desc: "ja, de, fr-FR currently localised on /[locale]; expand to PW + 5min PW." },
] as const;

const CUT = [
  { title: "Discord community channel", desc: "Reactive-only on Cursor #mcp; embedding plan parked. Retired 2026-05-02 per memory rule." },
  { title: "Beehiiv newsletter mirror", desc: "Mandatory SMS verification fails for Greek mobile numbers. Skip until UK/US virtual number available." },
  { title: "Paid newsletter sponsorships", desc: "HOLD until earned Tier-1 citation OR 500 paying subs + 3:1 CAC/LTV." },
  { title: "Podcasts / video interviews", desc: "Anonymity rule. Permanent." },
  { title: "Smithery (legacy stdio listing)", desc: "Delisted 2026-05-03; legacy stdio model retired upstream. Replaced by HTTP-gateway plan in Q3 (in flight)." },
] as const;

function Section({
  id,
  label,
  intro,
  items,
  color,
}: {
  id: string;
  label: string;
  intro: string;
  items: readonly Item[];
  color: "emerald" | "sky" | "amber" | "violet" | "rose";
}) {
  const palette = {
    emerald: "border-emerald-700/40 text-emerald-300",
    sky: "border-sky-700/40 text-sky-300",
    amber: "border-amber-700/40 text-amber-300",
    violet: "border-violet-700/40 text-violet-300",
    rose: "border-rose-700/40 text-rose-300",
  }[color];
  return (
    <section
      id={id}
      className="space-y-4 scroll-mt-20 border-l-4 pl-5 sm:pl-6"
      style={{ borderColor: "var(--tw-color)" }}
    >
      <header className="space-y-1">
        <p className={`${palette.split(" ")[1]} text-[10px] font-semibold uppercase tracking-wider`}>
          {label}
        </p>
        <p className="text-gray-400 text-sm leading-relaxed">
          {intro}
        </p>
      </header>
      <ul className="space-y-2.5">
        {items.map((it, i) => (
          <li
            key={`${id}-${i}`}
            className={`rounded-lg border ${palette} bg-slate-900/40 p-4 space-y-1`}
          >
            <h3 className="text-gray-100 font-semibold text-sm">
              {it.link ? (
                it.external ? (
                  <a
                    href={it.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline decoration-dotted"
                  >
                    {it.title} →
                  </a>
                ) : (
                  <Link href={it.link} className="hover:underline decoration-dotted">
                    {it.title} →
                  </Link>
                )
              ) : (
                it.title
              )}
            </h3>
            <p className="text-gray-400 text-sm leading-relaxed">
              {it.desc}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function RoadmapPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/roadmap",
        name: "GitDealFlow Roadmap",
        description:
          "Public roadmap and live testing log: shipped, in flight, on deck, considering, cut.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "h3"],
        },
        dateModified: new Date().toISOString().slice(0, 10),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Roadmap", item: "https://signals.gitdealflow.com/roadmap" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/roadmap"
        languages={getHreflangLanguages("/roadmap")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/roadmap" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Roadmap</span>
          </nav>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            Traffic Secrets Ch 19 · Pre-Launch · Live testing transparency
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            What we&rsquo;ve shipped, <span className="text-emerald-400">what&rsquo;s next</span>, what we cut.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Brunson&rsquo;s teaching on pre-launch and live testing: the
            buyer who can see what you&rsquo;re working on next, and what
            you cut and why, builds trust faster than the buyer who only
            sees the polished marketing. This is our public bet.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-slate-700 pl-4">
            Updated when something material ships, not on a calendar
            cadence. The dateModified on this page is the date of the most
            recent change.
          </p>
        </header>

        <nav
          aria-label="Sections"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            Five lanes · jump to:
          </p>
          <ul className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-sm">
            <li><a href="#shipped" className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-emerald-300 hover:text-emerald-200">Shipped</a></li>
            <li><a href="#in-flight" className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-sky-300 hover:text-sky-200">In flight</a></li>
            <li><a href="#on-deck" className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-amber-300 hover:text-amber-200">On deck</a></li>
            <li><a href="#considering" className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-violet-300 hover:text-violet-200">Considering</a></li>
            <li><a href="#cut" className="block px-3 py-1.5 rounded-md bg-slate-800/60 hover:bg-slate-800 text-rose-300 hover:text-rose-200">Cut</a></li>
          </ul>
        </nav>

        <Section
          id="shipped"
          label="Shipped — Q2 2026"
          intro="Live in production. Verified via /distribution and the public sitemap. Each row links to where it lives."
          items={SHIPPED_Q2}
          color="emerald"
        />

        <Section
          id="in-flight"
          label="In flight — this quarter"
          intro="Actively being built. Status changes as items move to Shipped. Trust this section over Considering — these have a deadline."
          items={IN_FLIGHT}
          color="sky"
        />

        <Section
          id="on-deck"
          label="On deck — next quarter"
          intro="Specced, sequenced, not yet started. Likely Q3-Q4 2026. Order may shift if a higher-leverage Brunson gap appears in the next monthly audit."
          items={ON_DECK}
          color="amber"
        />

        <Section
          id="considering"
          label="Considering — exploration"
          intro="Ideas with real-but-uncertain leverage. We&rsquo;ll commit when one of them clears the Brunson threshold (i.e. closes a chapter that scores below 80)."
          items={CONSIDERING}
          color="violet"
        />

        <Section
          id="cut"
          label="Cut — and why"
          intro="The lanes we walked away from, named so visitors don&rsquo;t suggest them on a loop. The cuts are durable — see the linked memory rule for each. Test-your-webinar transparency includes both wins and cuts."
          items={CUT}
          color="rose"
        />

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to read this page
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            If you want to bet on us, bet on the In-Flight column.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Shipped is past. Considering is wishful. The In-flight lane is
            the only one with a deadline and a public commitment. If those
            land on time, the rest of the roadmap is credible. If they
            don&rsquo;t, this column is the first place we&rsquo;ll
            tell you they slipped.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/manifesto"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Read the manifesto →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Public roadmap per <em>Traffic Secrets</em> Ch 19 (My Pre-Launch)
          + <em>Expert Secrets</em> Ch 18 (Test Your Webinar Live —
          transparency variant) by Russell Brunson. Used under fair-use
          commentary.
        </p>
      </div>
    </>
  );
}
