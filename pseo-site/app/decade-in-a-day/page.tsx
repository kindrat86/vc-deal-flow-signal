import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "A Decade in a Day — the developer-investor curriculum",
  description:
    "Ten years of developer-investor education compressed into one Saturday. Twelve modules: identity, methodology, dream customer, funnel architecture, signal lens, ascension, traffic, agent-side distribution, ethics, scale.",
  alternates: { canonical: "/decade-in-a-day" },
  openGraph: {
    title: "A Decade in a Day — the developer-investor curriculum",
    description:
      "Twelve modules. One Saturday. The curriculum we wish we'd had at the start.",
    url: "https://signals.gitdealflow.com/decade-in-a-day",
    type: "article",
  },
};

type Module = {
  n: number;
  minutes: number;
  title: string;
  question: string;
  content: string;
  links: { label: string; href: string }[];
};

const MODULES: Module[] = [
  {
    n: 1,
    minutes: 25,
    title: "Identity — name the buyer you actually are",
    question: "Why does identity precede method?",
    content:
      "If you decide you're a 'mini-VC' you'll buy fund-grade tooling and complain about the price. If you decide you're a 'developer-investor' the right tools, prices, and rhythm fall into place. Identity is upstream of every purchase decision. The identity close lives or dies on this naming.",
    links: [
      { label: "/about/founder — what a developer-investor is", href: "/about/founder" },
      { label: "Identity declaration on home", href: "/" },
      { label: "FOR / NOT FOR disqualifier", href: "/#disqualifier" },
    ],
  },
  {
    n: 2,
    minutes: 30,
    title: "Methodology — the signal that grounds everything",
    question: "Why commit-velocity acceleration, not commit count?",
    content:
      "Counts are noise. Acceleration relative to a company's own baseline is a regime change. We use a 14-day rolling window, two-period confirmation, contributor-quality filter. The SSRN paper (n=219) shows the signal preceded fundraises by 21–47 days IQR. The methodology is the only durable moat — every other element on the site rests on it.",
    links: [
      { label: "/methodology — full breakdown", href: "/methodology" },
      { label: "SSRN paper abstract=6606558", href: "https://ssrn.com/abstract=6606558" },
      { label: "/reproducibility — clone, run, replicate", href: "/reproducibility" },
    ],
  },
  {
    n: 3,
    minutes: 25,
    title: "Dream customer — name the people, not the segment",
    question: "Who is this for, in 30 seconds?",
    content:
      "An engineer who reads commit logs for fun and writes €5k–€50k checks on the side, 5–40 angel checks a year, more curious about codebases than about pitch decks. Three thesis axes: AI infrastructure, dev tools, technical SaaS. The disqualifier is as important as the qualifier — Series-B+ partners with six-figure data budgets are not us.",
    links: [
      { label: "/target-list — the top 100 voices the buyer reads", href: "/target-list" },
      { label: "/funnels — every entry point sized to the buyer", href: "/funnels" },
    ],
  },
  {
    n: 4,
    minutes: 35,
    title: "Funnel architecture — six rungs, one ladder, one cadence",
    question: "Why six tiers and not three? And why a monthly drop on top?",
    content:
      "Free → €7 → €9.97 → €97 → €497 → €1,997. Every rung exists because the rung below it doesn't fit one specific check size or one specific cadence. Free is for cadence-builders. €7 is for thesis-testers. €9.97 is for the daily-rhythm buyer. €97 is for the syndicate. €497 is for the small fund. €1,997 is for the deep-dive on a single sector. Never let a buyer leave at zero commitment when there's a free rung below. Above the rungs sits the continuity layer — a net-new monthly drop (sector deep-dive, methodology release, founder essay, or tool) that turns the paid tier from a tool subscription into an anticipation engine.",
    links: [
      { label: "/funnels — the value ladder visualised", href: "/funnels" },
      { label: "/funnels#building-blocks — the 25 components", href: "/funnels#building-blocks" },
      { label: "/pricing — the offer side", href: "/pricing" },
      { label: "/continuity — the monthly Insider Drop calendar", href: "/continuity" },
    ],
  },
  {
    n: 5,
    minutes: 25,
    title: "Reverse-engineering — what the leaders are optimising for",
    question: "How do you read a competitor's funnel?",
    content:
      "Don't read their pricing. Read their lead form, their bridge page, their stack-claim, their close. Harmonic optimises for partner-budgets. Tracxn optimises for sector breadth. Affinity optimises for warm-intro routing. None of them optimise for the developer-investor — that's not a pricing-gap, it's an ICP-gap. The competitor teardown you ship is the one that fills the blind spot.",
    links: [
      { label: "/funnels#reverse-engineering — full teardown", href: "/funnels#reverse-engineering" },
      { label: "/buyers-guide — buyer-side decision tree", href: "/buyers-guide" },
      { label: "/alternatives — what other tools exist", href: "/alternatives" },
    ],
  },
  {
    n: 6,
    minutes: 30,
    title: "The core claim — one belief that closes the buyer",
    question: "What's the single belief that, if held, makes everything else inevitable?",
    content:
      "If commit-velocity acceleration is the most leading public signal in venture capital, every other deal-flow source — pitch decks, AngelList, Crunchbase, warm intros — is a lagging indicator. The whole investing thesis falls or stands on whether that belief is true. Once you accept it, everything we sell follows automatically. If you don't accept it, no amount of stack will move you. Find this belief for your own product before you write copy.",
    links: [
      { label: "/walkthrough — core claim + Three Objections", href: "/walkthrough" },
      { label: "/pitch — the same belief in 90 seconds", href: "/pitch" },
    ],
  },
  {
    n: 7,
    minutes: 30,
    title: "The Conversion Story — five steps from belief to action",
    question: "Old way → new vehicle → external → internal → frameworks. Why this order?",
    content:
      "The canonical conversion script. (1) Name the old way the buyer was sold — for us, 'best deals come from your network.' (2) Reveal the new vehicle — engineering acceleration. (3) Remove the external struggle — you don't need fund-grade tooling. (4) Remove the internal struggle — you don't need to become a different person to source. (5) Show the frameworks — Sunday digest, Wednesday filter, end-of-quarter sweep. Each step is a beat the reader has to walk through; skip one and they bounce.",
    links: [
      { label: "/walkthrough#conversion-story — full script", href: "/walkthrough#conversion-story" },
      { label: "/walkthrough/5min — condensed version", href: "/walkthrough/5min" },
    ],
  },
  {
    n: 8,
    minutes: 25,
    title: "The Stack — turn features into anchored value",
    question: "Why itemise standalone value before the price?",
    content:
      "Eight objects, each with a standalone value, totalling €1,728/yr. The buyer's brain anchors on the total. The price (€9.97/mo = €119.64/yr) becomes a 14× discount — which is the actual story. Stack order matters: the most desirable thing first, the bonus last. Never bury the dashboard inside the methodology vault. Lead with the thing the buyer wants most.",
    links: [
      { label: "/walkthrough — the canonical 8-row stack", href: "/walkthrough" },
      { label: "/pricing — stack on the offer page", href: "/pricing" },
    ],
  },
  {
    n: 9,
    minutes: 30,
    title: "The Closes — five named patterns, one buyer profile each",
    question: "Money / Identity / Pricing / Urgency / Encore — when does each fire?",
    content:
      "Money close fires for the spreadsheet buyer. Identity close fires for the engineer who's tired of pretending to be a partner. Pricing close fires for the rate-anchor — €1,728 retail vs €119.64 founding. Urgency close fires for the calendar — every Monday skipped is one 21–47-day window closed. Encore is the safety net for everyone — eight lines, the whole offer in one block, before the FAQ. One of the five always lands; you don't pick, you stack.",
    links: [
      { label: "/walkthrough — four-close grid + encore", href: "/walkthrough" },
    ],
  },
  {
    n: 10,
    minutes: 25,
    title: "Traffic — earned, owned, and the one we don't pay for",
    question: "Why earned and owned, not paid?",
    content:
      "Owned: email list (free Acceleration Watch), RSS, MCP server in the buyer's IDE. Earned: Reddit AEO, dev.to long-form, Substack mirror, federated social (Bluesky / Mastodon / Farcaster), academic SSRN citation. Paid: deferred under HOLD until earned-only proof. The reason isn't ideology, it's compounding — earned channels keep paying after you stop. Paid channels stop the day the budget does.",
    links: [
      { label: "/distribution — every channel mapped", href: "/distribution" },
      { label: "/target-list — top 100 voices we read on each channel", href: "/target-list" },
    ],
  },
  {
    n: 11,
    minutes: 30,
    title: "Agent-side distribution — the second internet",
    question: "Why publish to /md, agents.json, llms.txt, and OpenAPI?",
    content:
      "Half the readers in 2026 are agents, not browsers. We publish six redundant agent surfaces: /md/<path> markdown mirror, agents.json discovery, llms.txt + llms-full.txt corpus, OpenAPI 21 endpoints, knowledge-graph.json, model.json. The agent-side reader doesn't see your hero CTA — they see the schema. The site is 1,060+ pages on the human side and 1,400+ surfaces on the agent side. Both sides matter.",
    links: [
      { label: "/install — MCP server install", href: "/install" },
      { label: "/distribution#agent-mirrors — full agent surface map", href: "/distribution#agent-mirrors" },
      { label: "/api/actions/openapi.json — the agent contract", href: "/api/actions/openapi.json" },
    ],
  },
  {
    n: 12,
    minutes: 30,
    title: "Ethics + scale — the lines that don't move",
    question: "Where does GitDealFlow refuse to scale?",
    content:
      "Anonymity rule: no podcasts, no founder-face content, no real-name signatures. The product is a dataset, not a personality. Methodology rule: every claim is reproducible against the public Zenodo dataset; we don't keep a private edge. Pricing rule: founding-member rate locks forever before the public hike — never renegotiated retroactively. Free-tier rule: the 5 core MCP tools are free forever; new paid tools are added alongside, never gated. Scale stops where the buyer's trust would have to.",
    links: [
      { label: "/manifesto — the seven pillars", href: "/manifesto" },
      { label: "/about/founder#flaws — the three character flaws on purpose", href: "/about/founder" },
      { label: "/compliance.json — the public commitment", href: "/compliance.json" },
    ],
  },
];

const TOTAL_MIN = MODULES.reduce((s, m) => s + m.minutes, 0);

export default function DecadePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Course",
        "@id": "https://signals.gitdealflow.com/decade-in-a-day#course",
        name: "A Decade in a Day — the developer-investor curriculum",
        description:
          "Twelve modules condensing ten years of developer-investor practice into one Saturday: identity, methodology, dream customer, funnel architecture, conversion story, stack, closes, traffic, agent-side distribution, and the ethical lines that don't move.",
        provider: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://signals.gitdealflow.com",
        },
        hasCourseInstance: {
          "@type": "CourseInstance",
          courseMode: "online",
          courseWorkload: `PT${Math.ceil(TOTAL_MIN / 60)}H`,
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "A Decade in a Day", item: "https://signals.gitdealflow.com/decade-in-a-day" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/decade-in-a-day"
        languages={getHreflangLanguages("/decade-in-a-day")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/decade-in-a-day" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">A Decade in a Day</span>
          </nav>
          <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
            A decade in a day · Applied
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Ten years of developer-investor practice — <span className="text-violet-400">in twelve modules</span>.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            When a curriculum exists, you compress a decade of practice into
            a Saturday. The reader doesn&rsquo;t need to repeat your
            mistakes — they need the conclusions you walked away with, in
            the order that made them inevitable.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Twelve modules · {TOTAL_MIN} minutes total · designed to be read
            in one sitting on a Saturday morning, or in chunks across a
            week. Skip the modules you already lived through. The links at
            the end of each module take you to the live page where the
            module&rsquo;s teaching is wired into the product.
          </p>
        </header>

        <nav
          aria-label="Module index"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6"
        >
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            12 modules · {TOTAL_MIN} minutes · jump to:
          </p>
          <ol className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-sm">
            {MODULES.map((m) => (
              <li key={m.n}>
                <a
                  href={`#m${m.n}`}
                  className="block px-3 py-1.5 rounded-md hover:bg-slate-800 text-violet-300 hover:text-violet-200 transition-colors"
                >
                  {m.n}. {m.title}{" "}
                  <span className="text-gray-400 text-xs ml-1">
                    {m.minutes}m
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>

        {MODULES.map((m) => (
          <section
            key={m.n}
            id={`m${m.n}`}
            className="space-y-4 scroll-mt-20 border-l-4 border-violet-600 pl-5 sm:pl-6"
          >
            <header className="space-y-1">
              <p className="text-violet-400 text-[10px] font-semibold uppercase tracking-wider">
                Module {m.n} · {m.minutes} minutes
              </p>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                {m.title}
              </h2>
              <p className="text-violet-300/80 text-sm italic">
                Question: {m.question}
              </p>
            </header>
            <p className="text-gray-300 text-base leading-relaxed">
              {m.content}
            </p>
            <ul className="space-y-1 text-sm">
              {m.links.map((l) => (
                <li key={l.href}>
                  →{" "}
                  {l.href.startsWith("http") ? (
                    <a
                      href={l.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-violet-300 hover:text-violet-200 underline decoration-dotted"
                    >
                      {l.label}
                    </a>
                  ) : (
                    <Link
                      href={l.href}
                      className="text-violet-300 hover:text-violet-200 underline decoration-dotted"
                    >
                      {l.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </section>
        ))}

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            What to do tomorrow
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Don&rsquo;t print this. Pick one module and live in it for a week.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            A Saturday-morning read changes nothing if you don&rsquo;t pick
            a single beat to embody. We&rsquo;d pick Module 6 — the core
            claim — and rewrite it for whatever you&rsquo;re building this
            quarter. Once you have your core claim, every other module
            re-reads in five minutes.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <a
              href="https://gitdealflow.com/#signup"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Get the free Acceleration Watch →
            </a>
            <Link
              href="/start-here"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Or read the 3-min primer →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Curriculum compressed from direct-response sales canon.
        </p>
      </div>
    </>
  );
}
