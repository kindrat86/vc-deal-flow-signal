import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

// Russell-Brunson Expert Secrets §1 Ch 3 audit ship 2026-05-09:
//   The "New Opportunity" must be named, not described. The audit scored
//   the chapter at 92/100, the -8 was that the category was walked
//   ("the new vehicle isn't bigger network, it's a different sensor")
//   but never branded as a category a buyer could repeat to a partner.
//
//   This page brands the category: "Code-Side Sourcing." The page is the
//   canonical definition surface. Every other surface that previously
//   said "alternative data" or "code-side momentum" now points here.
//
//   Anonymity rule preserved: the category is named without invoking any
//   author/framework attribution on customer-visible copy. The connection
//   to direct-response sales canon stays inside this comment block.

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = withEditorialOverride({
  title:
    "Code-Side Sourcing, the new category VC Deal Flow Signal invented",
  description:
    "Code-Side Sourcing is the practice of using public repository-velocity data as a leading indicator of venture-stage outcomes, surfacing fundraises 21-47 days before pitch decks circulate. The category, the formal definition, what it replaces, who practices it, and the open methodology that grounds it.",
  alternates: { canonical: "/code-side-sourcing" },
  openGraph: {
    title: "Code-Side Sourcing, a new category in venture sourcing",
    description:
      "Public repository-velocity data as a leading indicator of venture-stage outcomes. Definition, what it replaces, practitioners, methodology.",
    url: `${SITE}/code-side-sourcing`,
    type: "article",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code-Side Sourcing, the new category",
    description:
      "Public repository-velocity data as a leading indicator of venture-stage outcomes. The 21-47 day pre-deck window.",
  },
});

const SHORT_DEFINITION =
  "Code-Side Sourcing is the practice of using public repository-velocity data as a leading indicator of venture-stage outcomes, surfacing fundraises 21 to 47 days before pitch decks circulate.";

const FORMAL_DEFINITION = [
  "Code-Side Sourcing is a category of venture-capital deal sourcing in which the primary input is public, machine-readable engineering activity, commit graphs, contributor maps, repository creation patterns, deploy cadence, rather than warm introductions, pitch decks, or curated databases.",
  "The category is defined by three properties: (1) the input data is public and reproducible from primary sources, (2) the signal arrives before the company actively markets the round, (3) the methodology is published and falsifiable, not opaque.",
  "Code-Side Sourcing is not a tool, it is a sourcing channel. The same way a fund builds a Dream-100 list of LPs or runs a partner-meeting funnel, a fund running Code-Side Sourcing builds a repository watchlist, runs a weekly acceleration scan, and surfaces breakouts before they reach the warm-intro layer.",
];

const WHAT_IT_REPLACES = [
  {
    n: 1,
    name: "Warm-intro sourcing",
    body: "The dominant sourcing channel for the last forty years. Output capped by the partner&rsquo;s rolodex, latency measured in weeks, geography-locked to wherever the partner has lunch. Code-Side Sourcing runs in parallel, not as a replacement, but as the first parallel channel that doesn&rsquo;t depend on the partner&rsquo;s personal network.",
  },
  {
    n: 2,
    name: "Deck-based sourcing",
    body: "A pitch deck is a marketing artifact written for the next round, weeks after the engineering team locked the trajectory. Decks are lagging by definition. Code-Side Sourcing reads the engineering work directly, so the signal arrives before the deck is drafted.",
  },
  {
    n: 3,
    name: "Database-based sourcing (Crunchbase, PitchBook, Tracxn)",
    body: "Comprehensive but lagging, a database row appears after the round is announced or after a press mention triggers ingestion. The database is a system of record, not a system of discovery. Code-Side Sourcing is the system of discovery that feeds the database, not the other way around.",
  },
  {
    n: 4,
    name: "Alternative-data sourcing (web traffic, hiring scrapes, app downloads)",
    body: "The closest existing analog. Strong for late-stage growth signals (B2C app traction, enterprise hiring waves), weak for early-stage technical companies whose product never lands on a public ranking before the Series A. Code-Side Sourcing is the alt-data category for engineering-led companies, the segment where commits and contributors leak the ramp before any consumer surface does.",
  },
] as const;

const FIRST_PRINCIPLES = [
  {
    n: 1,
    title: "Acceleration over absolute volume",
    body: "Cross-company commit-count comparisons are meaningless. A 50-commit week is a slowdown for one team and a breakout for another. Code-Side Sourcing measures each company against its own historical baseline, only sustained acceleration relative to self counts as a signal.",
  },
  {
    n: 2,
    title: "Confirm it twice before it counts",
    body: "A one-off busy week, a hackathon, a launch sprint, a new-hire onboarding burst, means nothing on its own. The acceleration has to show up again in a second two-week window before it counts as a real signal (we call this two-period confirmation). This single rule eliminates the dominant source of false alarms.",
  },
  {
    n: 3,
    title: "The whole team speeding up, not one star engineer",
    body: "There is a difference between a broad team all pushing harder, the strongest predictor, and a single star engineer carrying everyone else, which is mostly noise. We measure how evenly the work is spread across contributors (using a standard inequality measure, the Gini coefficient) and only count the broad-team case. Acceleration alone is half a signal; acceleration plus a broad team is the full signal.",
  },
  {
    n: 4,
    title: "Classification over scoring",
    body: "A composite score collapses information. Code-Side Sourcing classifies each breakout into one of five signal types, Engineering Hiring Burst, Infrastructure Buildout, Deploy Frequency Spike, Framework Migration, Deceleration, because each carries a distinct fundraise-lead-time distribution. The classification is the prediction; the score is just the headline.",
  },
  {
    n: 5,
    title: "Open methodology over proprietary algorithm",
    body: "If the methodology can&rsquo;t be published, the buyer can&rsquo;t verify it, can&rsquo;t reproduce it, can&rsquo;t argue with it. Code-Side Sourcing requires the methodology to be a published document, SSRN preprint, Zenodo dataset, regression code under CC BY 4.0, so any buyer can audit the math before they trust the call.",
  },
] as const;

const PRACTITIONERS = [
  {
    name: "VC Deal Flow Signal",
    role: "Reference implementation",
    detail:
      "The site you&rsquo;re reading. Live dashboard, weekly Acceleration Watch, SSRN-published methodology, 219-startup proof panel, free MCP server. The category and the reference implementation share an author, see /mechanism for the formula and /research for the panel.",
  },
  {
    name: "Quant funds adapting GitHub data",
    role: "Adjacent practitioners",
    detail:
      "Several quantitative venture funds run internal GitHub-momentum models against public APIs. Most don&rsquo;t publish the methodology, which keeps the work outside the formal Code-Side Sourcing category, but the underlying activity is the same. Public categorisation lifts the floor for everyone.",
  },
  {
    name: "Open-source contributor analytics tooling",
    role: "Component vendors",
    detail:
      "Tools that surface contributor activity (CHAOSS, OpenSSF Scorecard, GitHub&rsquo;s own Insights) feed components of the methodology but don&rsquo;t close the loop into a sourcing channel. They are inputs to a Code-Side Sourcing pipeline, not the pipeline itself.",
  },
  {
    name: "Funds you respect that already practice this without naming it",
    role: "Latent practitioners",
    detail:
      "If a fund tells you their associate &ldquo;watches GitHub for the team&rdquo; or that they noticed a portfolio company&rsquo;s ramp two months before the round, they&rsquo;re practising Code-Side Sourcing without the name. Naming the category turns informal practice into a repeatable system.",
  },
] as const;

const DELIVERABLES = [
  {
    name: "Acceleration Watch",
    cadence: "Free, every Sunday",
    what: "Five named startups ranked by 14-day commit-velocity acceleration. The on-ramp for any practitioner of the category, most funds adopt the rhythm before they adopt the dashboard.",
    href: "https://gitdealflow.com/#signup",
  },
  {
    name: "Live Dashboard",
    cadence: "€49/mo",
    what: "350+ ranked orgs across 15 sectors, refreshed Mondays 06:00 UTC. Sector filters, watchlists, the full acceleration ranking, the operational surface for a fund running Code-Side Sourcing as a weekly motion.",
    href: "/pricing",
  },
  {
    name: "Sector Sweep",
    cadence: "€1,997 once per sector",
    what: "A 40-page written deep-dive on one sector with the top-25 ranked orgs, contributor maps, three pre-Crunchbase breakouts. The artefact a partner takes into an IC discussion.",
    href: "/sector-sweep",
  },
  {
    name: "First Look Pass",
    cadence: "€7 once",
    what: "The €7 tripwire, pick one sector, get a sector PDF in 24 hours. The cheapest way to feel the signal quality on a sector you already know before adopting the rhythm.",
    href: "/firstlook",
  },
  {
    name: "MCP server, OpenAPI 3.1, JSON/CSV API",
    cadence: "Free agent layer",
    what: "Six read-only tools inside Claude / Cursor / Windsurf. The agent surface lets any LLM-driven workflow call the same dataset without a screen, the agent-native form of Code-Side Sourcing.",
    href: "/integrations",
  },
] as const;

const FAQS = [
  {
    q: "Is Code-Side Sourcing the same as alternative data?",
    a: "Code-Side Sourcing is a sub-category of alternative data, narrowed to engineering-side public repository activity. Most alternative-data products in venture capital surface late-stage growth signals (web traffic, app downloads, enterprise hiring). Code-Side Sourcing surfaces early-stage technical signals, the segment where alt-data has historically been weakest because the consumer surface doesn&rsquo;t exist yet.",
  },
  {
    q: "Does Code-Side Sourcing replace warm intros?",
    a: "No, it runs in parallel. A fund running Code-Side Sourcing as a sourcing channel still uses warm intros for diligence, founder reference checks, and the actual investment conversation. The difference is the channel that surfaces the company in the first place, Code-Side Sourcing extends the funnel one step earlier than the warm-intro layer can reach.",
  },
  {
    q: "Why is the lead time 21 to 47 days specifically?",
    a: "That&rsquo;s the interquartile range of the SSRN-published panel of 219 venture-backed startups across five quarterly periods. The median is 31 days. The signal arrives earlier than 21 days for 25% of the panel and later than 47 days for another 25%. The full distribution and methodology are published at /research and ssrn.com/abstract=6606558.",
  },
  {
    q: "What kind of fund or investor is best suited to practise Code-Side Sourcing?",
    a: "Funds and angels investing in technical companies, AI infrastructure, developer tools, technical SaaS, open-source-led businesses, infrastructure software. The category is least useful for B2C consumer-facing companies (where app stores and web traffic are stronger leading indicators) and Series-D+ growth investing (where the engineering ramp is no longer the marginal information).",
  },
  {
    q: "Can a Code-Side Sourcing pipeline be built without subscribing?",
    a: "Yes. The methodology is published under CC BY 4.0, anyone can build their own pipeline. The SSRN paper, Zenodo dataset, and regression code are all open. The reason most practitioners subscribe is operational: building and maintaining the pipeline is engineering work that competes with investment work, and €49/mo is materially cheaper than the engineer-hour cost of self-hosting it.",
  },
  {
    q: "Is the category defensible if the data is public?",
    a: "The data is public. The category is defensible by methodology, panel proof, distribution channel, and operational rhythm, none of which copy from a Wikipedia search. The same logic that makes quantitative finance defensible (everyone can read 10-Ks; not everyone can build the model) applies to Code-Side Sourcing.",
  },
] as const;

export default function CodeSideSourcingPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "DefinedTerm",
        "@id": `${SITE}/code-side-sourcing#term`,
        name: "Code-Side Sourcing",
        alternateName: [
          "Engineering Acceleration Sourcing",
          "Repository-Velocity Sourcing",
          "Code-Side Venture Sourcing",
        ],
        description: SHORT_DEFINITION,
        url: `${SITE}/code-side-sourcing`,
        inDefinedTermSet: {
          "@type": "DefinedTermSet",
          "@id": `${SITE}/glossary#defined-term-set`,
          name: "VC Deal Flow Signal Glossary",
          url: `${SITE}/glossary`,
        },
        sameAs: [`${SITE}/glossary#code-side-sourcing`],
      },
      {
        "@type": "TechArticle",
        "@id": `${SITE}/code-side-sourcing#article`,
        headline:
          "Code-Side Sourcing, the new category VC Deal Flow Signal invented",
        description: SHORT_DEFINITION,
        url: `${SITE}/code-side-sourcing`,
        datePublished: "2026-05-09T00:00:00.000Z",
        dateModified: "2026-05-09T00:00:00.000Z",
        author: DATA_NERD_AUTHOR_REF,
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
        },
        mainEntityOfPage: `${SITE}/code-side-sourcing`,
        about: {
          "@id": `${SITE}/code-side-sourcing#term`,
        },
        keywords: [
          "Code-Side Sourcing",
          "venture capital alternative data",
          "GitHub commit velocity",
          "engineering acceleration",
          "repository-velocity sourcing",
          "code-side venture intelligence",
          "leading indicator venture",
        ],
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Code-Side Sourcing",
            item: `${SITE}/code-side-sourcing`,
          },
        ],
      },
      {
        "@type": "FAQPage",
        "@id": `${SITE}/code-side-sourcing#faq`,
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/code-side-sourcing`}
        languages={getHreflangLanguages("/code-side-sourcing")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/code-side-sourcing" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">
              Home
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Code-Side Sourcing</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            The category we&rsquo;re defining
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Code-Side Sourcing.
          </h1>
          <p
            data-speakable
            className="text-gray-200 text-lg sm:text-xl leading-relaxed font-medium"
          >
            {SHORT_DEFINITION}
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            This page is the canonical definition. Every other surface on the
            site that previously said &ldquo;alternative data&rdquo; or
            &ldquo;code-side momentum&rdquo; now points here.
          </p>

          {/* REFRAME / REASSURANCE, the most important line on the page.
              "Code-Side" describes where the signal originates, not anything
              the reader has to do. Buyer is corp-dev / PE / angel who does
              not read code. Reuses the reassurance phrasing + the creed. */}
          <div
            data-speakable
            className="rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-5 sm:p-6 space-y-2"
          >
            <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
              You do not have to read code
            </p>
            <p className="text-gray-200 text-base sm:text-lg leading-relaxed font-medium">
              &ldquo;Code-Side&rdquo; refers to where the <em>signal</em> comes
              from, the engineering work, not to anything you have to do. You
              never read a line of code; the read is done for you. The output
              is plain business English: a named company, why it&rsquo;s
              moving, and how long you likely have before the round.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              The creed is one line:{" "}
              <em className="text-gray-300">
                &ldquo;We move on the engineering signal before the round -
                without reading a line of code.&rdquo;
              </em>{" "}
              If you&rsquo;re a solo angel, scout, seed fund, corp-dev or PE
              operator who evaluates companies for a living but doesn&rsquo;t
              want to pull up a merge graph, this category was built for you.
            </p>
          </div>
        </header>

        {/* FORMAL DEFINITION */}
        <section
          aria-label="Formal definition"
          className="space-y-4 rounded-xl border border-sky-700/40 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            01 · Formal definition
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Three properties make a sourcing channel &ldquo;Code-Side&rdquo;.
          </h2>
          {FORMAL_DEFINITION.map((p, i) => (
            <p
              key={i}
              data-speakable
              className="text-gray-300 text-base leading-relaxed"
            >
              {p}
            </p>
          ))}
        </section>

        {/* WHAT IT REPLACES */}
        <section aria-label="What it replaces" className="space-y-5">
          <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
            02 · What it replaces (and what it runs alongside)
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Four sourcing channels predate Code-Side Sourcing. None of them
            disappear.
          </h2>
          <ol className="space-y-4">
            {WHAT_IT_REPLACES.map((item) => (
              <li
                key={item.n}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-amber-300 font-bold tabular-nums shrink-0">
                    {item.n}.
                  </span>
                  <h3 className="text-gray-100 font-semibold text-base sm:text-lg">
                    {item.name}
                  </h3>
                </div>
                <p
                  className="text-gray-300 text-sm sm:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.body }}
                />
              </li>
            ))}
          </ol>
        </section>

        {/* FIRST PRINCIPLES */}
        <section
          aria-label="First principles"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            03 · The five first principles
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Anything calling itself Code-Side Sourcing must satisfy all five.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            These aren&rsquo;t our preferences, they&rsquo;re the rules that
            keep the category from collapsing back into &ldquo;another
            proprietary scoring algorithm&rdquo; (the trap that swallowed
            Schwartz-Level-3 deal-flow tooling).
          </p>
          <ol className="space-y-4">
            {FIRST_PRINCIPLES.map((p) => (
              <li
                key={p.n}
                className="rounded-xl border border-emerald-700/30 bg-emerald-950/10 p-5 sm:p-6 space-y-2"
              >
                <div className="flex items-baseline gap-3">
                  <span className="text-emerald-300 font-bold tabular-nums shrink-0">
                    {p.n}.
                  </span>
                  <h3 className="text-emerald-100 font-semibold text-base sm:text-lg">
                    {p.title}
                  </h3>
                </div>
                <p
                  className="text-gray-300 text-sm sm:text-base leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: p.body }}
                />
              </li>
            ))}
          </ol>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-emerald-700/40 pl-4">
            The full mechanism, the five formal steps that implement these
            principles in code, is at{" "}
            <Link
              href="/mechanism"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              /mechanism
            </Link>
            . The proof panel is at{" "}
            <Link
              href="/research"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
            >
              /research
            </Link>
            .
          </p>
        </section>

        {/* PRACTITIONERS */}
        <section aria-label="Practitioners" className="space-y-5 border-t border-slate-800 pt-8">
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
            04 · Who practises Code-Side Sourcing
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            The category is small, the practice is older than the name.
          </h2>
          <div className="space-y-4">
            {PRACTITIONERS.map((p) => (
              <div
                key={p.name}
                className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <h3 className="text-gray-100 font-semibold text-base sm:text-lg">
                    {p.name}
                  </h3>
                  <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider">
                    {p.role}
                  </p>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {p.detail}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* DELIVERABLES */}
        <section
          aria-label="The reference implementation"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
            05 · The reference implementation, rung by rung
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            How VC Deal Flow Signal ships the category in practice.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            Each rung is a different operational form of Code-Side Sourcing.
            Most readers start at the free Acceleration Watch and ascend
            based on cadence, not feature.
          </p>
          <div className="space-y-3">
            {DELIVERABLES.map((d) => (
              <Link
                key={d.name}
                href={d.href}
                className="block rounded-xl border border-slate-800 hover:border-rose-700/40 bg-slate-900/40 hover:bg-slate-900/70 p-5 sm:p-6 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 mb-2">
                  <h3 className="text-gray-100 font-semibold text-base sm:text-lg">
                    {d.name}{" "}
                    <span aria-hidden className="text-rose-400">
                      →
                    </span>
                  </h3>
                  <p className="text-rose-300 text-xs font-semibold uppercase tracking-wider">
                    {d.cadence}
                  </p>
                </div>
                <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
                  {d.what}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section
          aria-label="FAQ"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            06 · FAQ
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Six questions a practitioner asks first.
          </h2>
          <div className="space-y-5">
            {FAQS.map((f) => (
              <div key={f.q} className="space-y-2">
                <h3 className="text-gray-100 font-semibold text-base sm:text-lg">
                  {f.q}
                </h3>
                <p
                  data-speakable
                  className="text-gray-300 text-sm sm:text-base leading-relaxed"
                >
                  {f.a}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* CLOSE */}
        <section
          aria-label="Where to go from here"
          className="rounded-xl border border-sky-600 bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4 text-center"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Where to go from here
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            The category is named. The reference implementation is shipping.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-xl mx-auto">
            Start at the free Sunday digest. Or skip the wait: see the signal
            on a sector you already know for €7, or run the live dashboard for
            €49/mo. You never read a line of code, the read is done for you.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <Link
              href="/firstlook"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold text-base shadow-lg shadow-rose-500/30 transition-colors"
            >
              See one sector for €7{" "}
              <span aria-hidden="true">→</span>
            </Link>
            <Link
              href="/pricing"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-signal-500 hover:bg-signal-600 text-slate-950 font-semibold text-base shadow-lg shadow-signal-500/30 transition-colors"
            >
              Run the dashboard, €49/mo{" "}
              <span aria-hidden="true">→</span>
            </Link>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start free with the Sunday digest
            </a>
            <Link
              href="/walkthrough"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Read the 12-minute walkthrough
            </Link>
          </div>
        </section>

        <DataNerdSignoff />
      </div>
    </>
  );
}
