import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { VideoEmbedBlock } from "@/components/VideoEmbedBlock";
import { DataNerdAudio } from "@/components/DataNerdAudio";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { HreflangLinks } from "@/components/HreflangLinks";
import { LiveReplayBar } from "@/components/LiveReplayBar";
import { FastActionBonuses } from "@/components/FastActionBonuses";
import { DoorsClosingBanner } from "@/components/DoorsClosingBanner";
import TrialClose from "@/components/TrialClose";
import { getHreflangLanguages } from "@/lib/hreflang";
import { getReplayWindowSnapshot } from "@/lib/replay-window";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "How to Spot a Series A 47 Days Before the Deck Lands — Perfect Webinar",
  description:
    "The single belief that changes how you source deals: commit-velocity acceleration is the most leading public signal in venture capital. Three objections, three breakdowns, and the stack that delivers it for €9.97/mo.",
  alternates: {
    canonical: "/perfect-webinar",
  },
  openGraph: {
    title:
      "How to Spot a Series A 47 Days Before the Deck Lands",
    description:
      "If commit-velocity acceleration is the most leading signal in VC, every other deal-flow tool becomes a lagging indicator. Here is the proof.",
    url: "https://signals.gitdealflow.com/perfect-webinar",
    type: "article",
  },
};

const STRIPE_DASHBOARD = "https://buy.stripe.com/28E7sK48H04U8ou07u0x200";
const SIGNUP_URL = "https://gitdealflow.com/#signup";
const FIRST_LOOK_URL = "/pricing#first-look-pass";

const STACK_ITEMS = [
  {
    label: "The Live Dashboard",
    description:
      "109 venture-backed startups ranked by 14-day commit-velocity acceleration, refreshed every Monday at 06:00 UTC. Filter by sector, stage, geography. The same data the SSRN paper was built on.",
    standalone: "€348/yr",
  },
  {
    label: "The 219-Startup Backtest CSV",
    description:
      "Five quarters of historical signal-to-fundraise pairs. The full dataset behind the 21–47-day lead-time claim. Yours to load into a notebook and replicate.",
    standalone: "€297 one-time",
  },
  {
    label: "Monthly Sector Deep-Dive PDF",
    description:
      "Pick one sector each month. We deliver a 12-page deep-dive with top 25 ranked orgs, contributor maps, and the three breakout candidates not yet on Crunchbase. Twelve issues a year.",
    standalone: "€588/yr",
  },
  {
    label: "Two Free Chrome Extensions",
    description:
      "(1) Crunchbase + Wellfound badge that injects a momentum score into every profile. (2) VC GitHub Lookup — hover any org or repo, see the velocity in 200ms.",
    standalone: "€198/yr value",
    links: [
      {
        label: "Install Crunchbase + Wellfound badge",
        href: "https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn",
      },
      {
        label: "Install VC GitHub Lookup",
        href: "https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm",
      },
    ],
  },
  {
    label: "The Free MCP Server (forever, never gated)",
    description:
      "npx @gitdealflow/mcp-signal — six read-only tools inside Claude, Cursor, Windsurf, or any MCP host. Ask 'which AI infra startups are accelerating this week' and get the answer inline.",
    standalone: "€0 — bundled with every tier",
  },
  {
    label: "Async Watchlist Build",
    description:
      "Send your thesis. We come back with a custom watchlist of the 10 highest-acceleration orgs that match it. One-time, kicks off the day you upgrade.",
    standalone: "€297 one-time",
  },
  {
    label: "Methodology Vault",
    description:
      "The full SSRN preprint, every signal definition, the regression code that produced the lead-time numbers. Open by default — the vault is the unlock to the source data.",
    standalone: "€0 — published",
  },
  {
    label: "30-Day Signal-or-It's-Free Guarantee",
    description:
      "If, in your first 30 days, the signal does not surface a startup you find genuinely interesting, reply REFUND to any email. No forms, no call, no questions. Full refund inside two business days.",
    standalone: "Bonus",
  },
] as const;

const FAQS = [
  {
    q: "Why do you call this a Perfect Webinar if it's a written page?",
    a: "Because the structure is the same. The Perfect Webinar framework is a sequence: hook, story, big domino, three secrets, stack, close. Russell Brunson popularised it as a 90-minute sales presentation. We use the same arc on a single scrollable page so a busy investor can read it in 12 minutes instead of sitting through a recording. The structure is what closes; the medium is just delivery.",
  },
  {
    q: "What's the Big Domino in one sentence?",
    a: "If GitHub commit-velocity acceleration is the most leading public signal in venture capital, then every other deal-flow source — pitch decks, AngelList, Crunchbase, warm intros — is a lagging indicator. The whole investing thesis falls or stands on whether that single belief is true.",
  },
  {
    q: "What proof do you have for the 21–47 day lead time?",
    a: "An SSRN-published longitudinal panel of 219 venture-backed startups across 19 sectors, five quarterly periods. Companies that registered a 2× contributor spike inside a 14-day window preceded fundraise announcements by a median of 31 days, with a 21–47 day interquartile range. The full panel + regression code is at signals.gitdealflow.com/research and the preprint is at ssrn.com/abstract=6606558.",
  },
  {
    q: "Why €9.97/mo when comparable tools cost €1,000/mo?",
    a: "Two reasons. One — we do not have a sales team. The whole price difference between us and Harmonic or Tracxn is the cost of an enterprise sales motion. Two — the buyer is a developer-investor writing €5k-€50k checks, not a partner at a fund with a six-figure data budget. Pricing matches the buyer.",
  },
  {
    q: "What if I just want to test it on one sector before committing?",
    a: "The First Look Pass is €7 once. You pick any of 19 tracked sectors at checkout. Within 24 hours you receive a written deep-dive PDF, the raw CSV, and a walkthrough of what stood out. If you upgrade to the Dashboard within 14 days, the €7 is credited. If you don't, you keep the report.",
  },
] as const;

export default function PerfectWebinarPage() {
  // Brunson Live-Replay Pressure (Expert Secrets Ch 14 — Perfect Webinar Hack):
  // every cohort opens Mon 06:00 UTC and closes Thu 23:59 UTC, with fast-action
  // bonuses dropping at Wed 23:59 UTC. The snapshot is captured at build time;
  // the client components correct to live state on hydration so the cohort
  // banner is always honest about the current phase.
  const replaySnapshot = getReplayWindowSnapshot();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/perfect-webinar#article",
        headline:
          "How to Spot a Series A 47 Days Before the Deck Lands",
        description:
          "The single belief that changes how you source deals: commit-velocity acceleration is the most leading public signal in venture capital. Three objections, three breakdowns, and the stack that delivers it for €9.97/mo.",
        url: "https://signals.gitdealflow.com/perfect-webinar",
        datePublished: "2026-05-05T00:00:00.000Z",
        dateModified: "2026-05-05T00:00:00.000Z",
        author: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#person",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about",
        },
        publisher: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: "https://signals.gitdealflow.com/perfect-webinar",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: FAQS.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "All Sectors",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Perfect Webinar",
            item: "https://signals.gitdealflow.com/perfect-webinar",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/perfect-webinar"
        languages={getHreflangLanguages("/perfect-webinar")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/perfect-webinar" />

      {/* Brunson Expert Secrets Ch 14 — Live-replay pressure mechanic.
          Sticky cohort countdown across all three phases:
          fast-action (Mon→Wed), last-hours (Thu), closed (Fri→Sun). */}
      <LiveReplayBar initialWindow={replaySnapshot} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* VEO anchor — 3-minute VSL version of this Perfect Webinar */}
        <VideoEmbedBlock slug="perfect-webinar-vsl" variant="full" />
        {/* HOOK — Brunson rule: hook hard, lead with curiosity. */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">Perfect Webinar</span>
          </nav>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
              Free 12-minute read · Updated 2026-05-05
            </p>
            <a
              href="#close"
              className="text-xs font-medium text-sky-400 hover:text-sky-300 underline decoration-dotted underline-offset-4"
            >
              Skip to offer →
            </a>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            How to spot a Series A{" "}
            <span className="text-sky-400">47 days before the deck</span>{" "}
            lands in your inbox.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            If you are a developer, ex-founder, or technical operator who also
            writes angel checks, the next 12 minutes will reframe how you source
            deals. Three objections will be addressed. One uncomfortable
            conclusion will follow. And one specific, sub-€10/mo tool will let
            you act on it.
          </p>
          <DataNerdAudio
            slug="perfect-webinar-prologue"
            label="Press play — 90-second prologue, narrated by The Data Nerd"
            subtitle="If you only have 90 seconds: this is the Big Domino, stated. The rest of the page is what falls when it tips."
          />
        </header>

        {/* STORY / EPIPHANY BRIDGE */}
        <section
          id="story"
          className="space-y-4 border-l-2 border-sky-500/40 pl-5 text-gray-300 leading-relaxed scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold text-gray-100">
            The accident that started this
          </h2>
          <p>
            I was tracking a small fintech startup, mostly out of curiosity.
            Nothing special on the surface. No press, no AngelList buzz, no warm
            intros circulating.
          </p>
          <p>
            But their GitHub told a different story. In two weeks, their commit
            velocity tripled. Four new contributors joined. They spun up three
            new infrastructure repos.
          </p>
          <p>
            I flagged it in my notes. Three weeks later, they announced a $4M
            Series A led by a top-tier fund.
          </p>
          <p>
            That moment broke something for me. The signal had been right there
            the whole time — public, free, updating in real time on a website
            every developer already opens 30 times a day. And nobody was reading
            it as deal flow.
          </p>
          <p className="italic text-gray-400 pt-3 border-t border-slate-800">
            That accident is the only reason this product exists.
          </p>
          <TrialClose tone="sky">
            Pause for one second. If <em>you</em> had spotted that fintech in your
            own GitHub feed three weeks early — would you have written a check?
          </TrialClose>
        </section>

        {/* BIG DOMINO */}
        <section
          id="domino"
          className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6 sm:p-8 space-y-4 scroll-mt-20"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            The big domino
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold text-gray-100 leading-tight tracking-tight"
            data-speakable
          >
            If commit-velocity acceleration is the most leading public signal
            in venture capital, then every other deal-flow source — pitch
            decks, AngelList, Crunchbase, warm intros — is a{" "}
            <span className="text-sky-400">lagging indicator</span>.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            That is the one belief this whole page is built around. If it falls,
            so does our entire thesis. So instead of selling you a dashboard, I
            am going to spend the next three sections trying to knock it down.
            If it survives, the rest is arithmetic.
          </p>
          <TrialClose tone="sky">
            Following so far? Three objections coming, plain language, no
            sales-pitch detours.
          </TrialClose>
        </section>

        {/* THREE SECRETS */}
        <section id="secrets" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              The three secrets
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Three objections every investor raises. Three breakdowns.
            </h2>
            <p className="text-gray-400 text-sm">
              Brunson rule: a great offer is a stack of broken false beliefs.
              Here are the three that block this one.
            </p>
          </div>

          {/* SECRET 1 — VEHICLE BELIEF */}
          <div className="border-l-4 border-sky-500 pl-5 space-y-3">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
              Secret #1 · Vehicle objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;GitHub data is just noise.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">Fair objection.</strong> Raw
              commit counts are noisy. A bot can inflate them. A hackathon can
              spike them. A single developer pushing config files looks the
              same as a team shipping features.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              We do not look at absolute numbers. We look at{" "}
              <em className="text-sky-300 not-italic font-semibold">
                acceleration patterns
              </em>{" "}
              — when a company&rsquo;s engineering velocity deviates sharply
              from its own baseline. That is not noise. That is a regime
              change. Something happened inside that company. They hired. They
              found product-market fit. They are preparing to launch.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              In the SSRN-published 219-startup panel, a 2× contributor spike
              inside a 14-day window preceded a fundraise announcement by a
              median of 31 days. Same dataset, replicate the regression
              yourself at{" "}
              <Link
                href="/research"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                /research
              </Link>
              .
            </p>
            <TrialClose tone="amber">
              Acceleration vs. absolute count — does that distinction land?
              That single shift is what turns &ldquo;noise&rdquo; into a signal
              with a 31-day median lead.
            </TrialClose>
          </div>

          {/* SECRET 2 — INTERNAL BELIEF */}
          <div className="border-l-4 border-emerald-500 pl-5 space-y-3">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Secret #2 · Internal objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;I already have enough deal flow from my network.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">
                Your network shows you what other investors are already seeing.
              </strong>{" "}
              By the time a warm intro reaches you, the founder has talked to
              three to five other investors. The deck is circulating. The terms
              are forming. You are competing on reputation and speed, not on
              information.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              The deals that generate outsized returns are the ones where you
              arrive before consensus forms. Before the deck exists. Before the
              company is &ldquo;hot.&rdquo;
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              That is the 21-to-47-day window we open. Engineering accelerates
              before the fundraise starts. In that window you can reach out
              first, offer help before they need money, and build a
              relationship before everyone else is trying to. Your network gets
              you to the table. This gets you there first.
            </p>
            <TrialClose tone="emerald">
              If you arrived 21–47 days before the deck started circulating,
              would your hit rate change? Make a mental note of the answer.
            </TrialClose>
          </div>

          {/* SECRET 3 — EXTERNAL BELIEF */}
          <div className="border-l-4 border-indigo-500 pl-5 space-y-3">
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Secret #3 · External objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;Public data can&rsquo;t be an edge — everyone has it.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">
                Everyone has SEC filings too.
              </strong>{" "}
              Quant funds still make billions parsing them faster and smarter
              than the rest of the market. The edge isn&rsquo;t in having
              exclusive data — it is in reading what others ignore.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              Right now, zero investor tools package GitHub activity as a
              dedicated deal-flow signal. The data is public. The analysis
              layer doesn&rsquo;t exist. That gap is your edge — and it stays
              your edge until the market catches up.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              We tracked Harmonic, Tracxn, Affinity, SignalFire Beacon, and
              Forager.ai in our{" "}
              <Link
                href="/buyers-guide"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                buyers guide
              </Link>
              . None publish their methodology. None expose raw data.
              Engineering signal is the open lane.
            </p>
            <TrialClose tone="violet">
              Three objections, three breakdowns. If none of those three is
              what was holding you back — what is? (That answer is the one to
              keep handy as the stack lands.)
            </TrialClose>
          </div>
        </section>

        {/* THE SHIFT */}
        <section
          id="shift"
          className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-4 scroll-mt-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            So if all three objections are false, what would the world look
            like?
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            You would open one email on Monday morning, read the five startups
            ranked by their engineering acceleration that week, pick the one
            that matches your thesis, and send the founder a three-line email
            on Tuesday. Two more would already be in your dashboard for the
            Wednesday deeper dive. End of quarter, one Custom Sector Sweep
            would land for the thesis you have been saying you want to go
            deeper on for six months.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That is the rhythm. Sunday digest, Wednesday filter, end-of-quarter
            sweep. Three touchpoints, twelve minutes a week, sub-€10/mo. The
            dashboard is just a tool — the leverage is in the rhythm.
          </p>
          <TrialClose tone="amber">
            Twelve minutes a week, three touchpoints, one rhythm. Sound fair?
          </TrialClose>
        </section>

        {/* CONVERSION STORY — Brunson Expert Secrets Ch 12. Five-step
            canonical script: Old Way → New Vehicle → External Struggle
            collapsed → Internal Struggle collapsed → Frameworks revealed.
            The bridge from belief (Three Objections) to offer (Stack). */}
        <section
          id="conversion-story"
          aria-label="Conversion story — five-step bridge"
          className="space-y-5 border-y border-slate-800 py-8 scroll-mt-20"
        >
          <header className="space-y-2">
            <p className="text-violet-400 text-xs font-semibold uppercase tracking-wider">
              Conversion story · Expert Secrets Ch 12
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
              The five-step shift — in your own voice.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed max-w-2xl">
              If you read the three objections and felt the shift, here&rsquo;s
              the formal version of what just happened — Russell&rsquo;s
              canonical Conversion Story, applied to the developer-investor.
            </p>
          </header>
          <ol className="space-y-4">
            <li className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-violet-300 font-bold tabular-nums shrink-0">1.</span>
                <p className="text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
                  The old way you were sold
                </p>
              </div>
              <p className="text-gray-100 font-semibold text-base leading-snug">
                &ldquo;The best deals come from your network. Build the
                rolodex.&rdquo;
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every operator-turned-investor was told this. It&rsquo;s the
                first lesson of every fellowship, every angel-school slide
                deck, every conversation with a senior partner. Network is the
                vehicle. Warm intros are the engine. Time-in-seat is the moat.
              </p>
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-violet-300 font-bold tabular-nums shrink-0">2.</span>
                <p className="text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
                  The new vehicle
                </p>
              </div>
              <p className="text-gray-100 font-semibold text-base leading-snug">
                Engineering acceleration. Public, reproducible, code-side.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every great startup leaves a footprint in its code 21–47 days
                before the deck circulates. That footprint is public, the
                methodology is reproducible (SSRN n=219), and the cost of
                reading it is €9.97/mo. The new vehicle isn&rsquo;t bigger
                network — it&rsquo;s a different sensor.
              </p>
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-violet-300 font-bold tabular-nums shrink-0">3.</span>
                <p className="text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
                  External struggle, removed
                </p>
              </div>
              <p className="text-gray-100 font-semibold text-base leading-snug">
                You don&rsquo;t need partner-grade tooling. You need
                builder-grade signal.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                Harmonic, Tracxn, and Affinity are €1k–€10k/mo because they
                serve fund-grade procurement. The developer-investor was
                priced out of the category, not by methodology, but by sales
                motion. Pull the sales motion out and the same data ladder
                runs at €9.97/mo.
              </p>
            </li>
            <li className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-violet-300 font-bold tabular-nums shrink-0">4.</span>
                <p className="text-violet-300 text-[10px] font-semibold uppercase tracking-wider">
                  Internal struggle, removed
                </p>
              </div>
              <p className="text-gray-100 font-semibold text-base leading-snug">
                You don&rsquo;t need to become someone else to source.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                The lesson the network rule taught you was that you needed to
                turn into a partner-style human — coffees, calendar Tetris,
                socially-aware persuasion. The data-side path lets you stay
                the engineer who reads commit logs for fun. Identity stays
                intact. The signal does the introduction.
              </p>
            </li>
            <li className="rounded-xl border border-violet-700/40 bg-violet-950/15 p-5 sm:p-6 space-y-2">
              <div className="flex items-baseline gap-3">
                <span className="text-violet-200 font-bold tabular-nums shrink-0">5.</span>
                <p className="text-violet-200 text-[10px] font-semibold uppercase tracking-wider">
                  The frameworks (and where they live)
                </p>
              </div>
              <p className="text-gray-100 font-semibold text-base leading-snug">
                Sunday digest. Wednesday filter. End-of-quarter sweep.
              </p>
              <p className="text-gray-300 text-sm leading-relaxed">
                The Acceleration Watch is the Sunday digest. The Dashboard is
                the Wednesday filter. The Sector Sweep is the end-of-quarter
                deep dive. Three rhythms, twelve minutes a week, methodology
                published. The shift is already wired into the product —
                you&rsquo;re not buying a tool, you&rsquo;re buying a cadence.
              </p>
            </li>
          </ol>
          <p className="text-gray-400 text-sm leading-relaxed border-l-2 border-violet-700/40 pl-4">
            That&rsquo;s the five-step Conversion Story. If steps 1–4 read
            like the room you&rsquo;re standing in, step 5 is the door.
          </p>
        </section>

        {/* FUTURE-PACING — Brunson Expert Secrets Ch 21. The mental movie
            placed between Conversion Story and Stack — buyer is now
            primed for the offer, but doesn't yet feel the offer. The
            "Tuesday in August" block makes them live the cadence three
            months from now in their own working week, so the Stack
            reveal that follows isn't a list of features, it's the
            instrument that produces the future they just imagined. */}
        <section
          aria-label="Three months from now — a Tuesday in August"
          className="bg-gradient-to-br from-violet-950/40 via-slate-900 to-slate-950 border border-violet-700/40 rounded-xl p-6 sm:p-8 space-y-5"
        >
          <div className="space-y-1.5">
            <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider">
              Future-pace · 90 days from today
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight">
              A Tuesday in August. The cadence is installed.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Three months from now. Second Tuesday of August. You&rsquo;ve
              run the Sunday–Wednesday–Quarter rhythm for twelve weeks.
              Here&rsquo;s what your day looks like, hour by hour, once
              the cadence is just background.
            </p>
          </div>

          <ol className="space-y-4">
            {[
              {
                time: "09:14",
                scene:
                  "Coffee, laptop open. Sunday’s digest from this past weekend is still in the tab to the left — five names, sector-tagged. The third one, an AI-infra org out of Berlin, you opened on Monday because it matched the thesis you keep pulling toward. You spent fifteen minutes on their commit graph and sent the founder a three-line email. There’s a reply at the top of your inbox now: short, friendly, asks if you want to see the deck.",
              },
              {
                time: "11:30",
                scene:
                  "Wednesday filter, but pulled forward to Tuesday because you have a partner call this afternoon. You open the Dashboard, set sector = AI infra, stage = Seed, and sort by 14-day acceleration. Top ten. You cross-reference two of them against your portfolio’s GitHub orgs — and one of them has a contributor in common with a portfolio company you led last year. That’s a warm-intro vector your AngelList syndicate doesn’t have. You note it for the partner call.",
              },
              {
                time: "15:00",
                scene:
                  "Partner call. You open with the Berlin org and the warm-intro vector. The partner asks how you’re finding these. You don’t name the tool — you describe the rhythm. Five names on Sunday, fifteen minutes on Wednesday, one specific email a month. Twelve minutes a week. The partner is quiet for a beat and then asks if you’d co-source the next three. That’s the moment the cadence stops being a private edge and becomes leverage in the room.",
              },
              {
                time: "18:00",
                scene:
                  "End of day. You drop the Sector Sweep file on the AI-infra panel into the partner’s shared folder — €1,997 once, paid in March, still earning attention now five months later. The IC memo for next week writes itself: three names, two of them off-Crunchbase, one already with a confirmed product launch since the Sweep was delivered. You close the laptop. The Sunday email lands again in five days. The rhythm is the room you live in now, not a workflow you maintain.",
              },
            ].map((moment) => (
              <li
                key={moment.time}
                className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-5 border-l-2 border-violet-600/40 pl-4"
              >
                <span
                  className="font-mono text-violet-300 font-bold text-sm tracking-wider shrink-0 sm:w-16 pt-0.5"
                  aria-hidden="true"
                >
                  {moment.time}
                </span>
                <p className="text-gray-300 text-sm sm:text-[15px] leading-relaxed flex-1">
                  {moment.scene}
                </p>
              </li>
            ))}
          </ol>

          <p className="text-gray-300 text-sm leading-relaxed border-t border-violet-800/40 pt-4">
            That&rsquo;s the August Tuesday. The cadence isn&rsquo;t a tool
            you operate, it&rsquo;s a room you live in. The Stack below is
            the instrument that produces it. The price below is what the
            instrument costs to lease per month, founding-member rate,
            locked forever.
          </p>
          <TrialClose tone="violet">
            Can you picture it? The Sunday digest, the Tuesday email, the
            quarter-end Sweep — that&rsquo;s the rhythm that produces the
            August Tuesday above. The next section is the bill.
          </TrialClose>
        </section>

        {/* THE STACK */}
        <section id="stack" className="space-y-6 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-amber-400 text-xs font-semibold uppercase tracking-wider">
              The stack
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Here is everything you get for{" "}
              <span className="text-sky-400">€9.97/mo</span>.
            </h2>
            <p className="text-gray-400 text-sm">
              Eight objects. Four-figure standalone value. Founding-member
              price locked forever.
            </p>
          </div>

          <ol className="space-y-3">
            {STACK_ITEMS.map((item, i) => {
              const isFeatured = i === 0;
              return (
                <li
                  key={item.label}
                  className={`flex items-start gap-4 rounded-lg p-4 ${
                    isFeatured
                      ? "bg-sky-950/30 border border-sky-600/50 ring-1 ring-sky-500/20"
                      : "bg-slate-900/60 border border-slate-800"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${
                      isFeatured
                        ? "bg-sky-500 text-white"
                        : "bg-sky-600/20 border border-sky-500/40 text-sky-300"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <p className="text-gray-100 font-semibold text-base flex items-center gap-2">
                        {item.label}
                        {isFeatured && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-sky-300 bg-sky-500/15 border border-sky-500/30 rounded px-1.5 py-0.5">
                            Core
                          </span>
                        )}
                      </p>
                      <p className="text-gray-400 text-xs whitespace-nowrap">
                        Standalone:{" "}
                        <span className="text-emerald-400">
                          {item.standalone}
                        </span>
                      </p>
                    </div>
                    <p className="text-gray-400 text-sm leading-relaxed mt-1">
                      {item.description}
                    </p>
                    {"links" in item && item.links && item.links.length > 0 && (
                      <ul className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                        {item.links.map((link) => (
                          <li key={link.href}>
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-[12px] font-semibold text-sky-300 hover:text-sky-200 underline decoration-dotted underline-offset-4"
                            >
                              {link.label} →
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </li>
              );
            })}
          </ol>

          {/* PRICE STACK */}
          <div className="border-t border-slate-700 pt-6 space-y-3">
            <div className="flex items-baseline justify-between text-gray-400 text-sm">
              <span>Total standalone value</span>
              <span className="line-through">€1,728/yr</span>
            </div>
            <div className="flex items-baseline justify-between text-gray-400 text-sm">
              <span>Post-launch retail (Dashboard at €49/mo)</span>
              <span className="line-through">€588/yr</span>
            </div>
            <div className="flex items-baseline justify-between text-2xl font-bold text-gray-100 pt-3 border-t border-slate-800">
              <span>Founding-member price, locked forever</span>
              <span className="text-sky-400">€9.97/mo</span>
            </div>
            <p className="text-gray-400 text-xs">
              That is €119.64/year, or roughly the cost of one missed seed
              deal. The price stays €9.97 for as long as you stay subscribed,
              even after the public launch hike to €49/mo.
            </p>
          </div>
          <TrialClose tone="amber">
            €9.97 vs. one missed seed deal. Which side of that math do you
            want to be on for the next twelve months?
          </TrialClose>
        </section>

        {/* FAST-ACTION BONUSES — Brunson DotCom Secrets Ch 12 (Cart Funnel
            Building Block #19): stacked bonuses with hard expiry. Three
            named bonuses, dollar-denominated, that disappear at Wed 23:59
            UTC. The component swaps copy when the cohort enters last-hours
            (Thu) and closed (Fri–Sun) so the page is honest about phase. */}
        <FastActionBonuses initialWindow={replaySnapshot} signupUrl={SIGNUP_URL} />

        {/* GUARANTEE */}
        <section
          id="guarantee"
          className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-3 scroll-mt-20"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Risk reversal
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            30 days. Signal or it&rsquo;s free. No forms. No call.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            If, in your first 30 days, the signal does not surface a startup
            you find genuinely interesting — defined as one you would have
            wanted to know about earlier — reply <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 text-sm">REFUND</code> to any
            email. The full payment is refunded inside two business days. No
            questions, no exit interview, no &ldquo;wait, let me show you
            one more feature.&rdquo;
          </p>
          <p className="text-gray-400 text-sm">
            The guarantee exists because the signal either works or it
            doesn&rsquo;t. Charging for an output you don&rsquo;t find useful
            is bad business.
          </p>
          <TrialClose tone="emerald">
            Worst case: 30 days, you keep what you read, you get the €9.97
            back. Where else does that downside profile exist for a sourcing
            tool?
          </TrialClose>
        </section>

        {/* TRIAL CLOSES — 3-stack */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-100">
            Three trial closes — pick the one that sounds like you.
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-sky-400 font-bold shrink-0">1.</span>
              <span>
                If you write five-to-fifteen angel checks a year, this pays for
                itself the first time it surfaces a name you hadn&rsquo;t seen.
                That happens, on average, in the first three Mondays.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-400 font-bold shrink-0">2.</span>
              <span>
                If you scout for a fund, you can run the dashboard against your
                thesis sectors and ship a one-page memo to your principal every
                Monday morning. The memo is the artefact. The dashboard is the
                source.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-sky-400 font-bold shrink-0">3.</span>
              <span>
                If you are a developer who only occasionally writes a check,
                stay on the free digest forever. Five startups every Monday is
                enough for a part-time investor. Upgrade only when filtering
                the full universe pays for itself.
              </span>
            </li>
          </ul>
        </section>

        {/* "IF ALL THIS DID" — Brunson's canonical trial close.
            Expert Secrets Ch 16. Each line lowers the bar a notch and
            re-anchors the price against a single high-value outcome. */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            And if you&rsquo;re still not sure — ask yourself this.
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              If all this did was surface{" "}
              <strong className="text-amber-300">one name</strong> you would
              otherwise have missed in the next 12 months — would €119.64
              for the year be worth it?
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              If all this did was give you a{" "}
              <strong className="text-amber-300">15-minute Monday rhythm</strong>{" "}
              you actually keep, instead of three open tabs you don&rsquo;t —
              would €9.97/mo be worth it?
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              If all this did was let you{" "}
              <strong className="text-amber-300">reach one founder before the deck circulated</strong>,
              and that founder remembered you when they took the meeting —
              would the entire stack pay for itself?
            </li>
          </ul>
          <p className="text-gray-400 text-sm leading-relaxed pt-1">
            Brunson&rsquo;s trial-close rule: if the answer to any single line
            is yes, the math is already done.
          </p>
        </section>

        {/* THE FOUR CLOSES — Money / Identity / Pricing / Scarcity.
            Expert Secrets Ch 18. These are the named close-stack patterns
            Russell teaches; previously the page had one generic close. */}
        <section
          aria-label="Closes"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <h2 className="text-2xl font-bold text-gray-100">
            The four closes — one of these is yours.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MONEY CLOSE */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                Money close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                The price isn&rsquo;t the cost. The deal you miss is.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                €9.97/mo is €119.64 a year. The expected cost of missing one
                name that 8x&rsquo;s in five years — at a €5k angel check —
                is €40,000. The math doesn&rsquo;t work the other way. You
                are not buying a dashboard. You are insuring against a single
                missed Monday.
              </p>
            </div>

            {/* IDENTITY CLOSE */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Identity close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                You&rsquo;re not a VC. You&rsquo;re a developer-investor.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Every other deal-flow tool is built for a partner at a fund
                with a six-figure data budget. This one is built for the
                person who reads commit logs for fun and writes €5k–€50k
                checks on the side. If that&rsquo;s you, this isn&rsquo;t a
                product you adapt. It&rsquo;s the first one designed around
                your identity.
              </p>
            </div>

            {/* PRICING CLOSE */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                Pricing close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                The whole stack is €1,728/yr. You&rsquo;re paying €119.64.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We could charge €100/mo and the math would still work. We
                picked €9.97 because we want builders, not budgets. The
                €49/mo public price launches the Monday a regulated investor
                tool reviews us — the founding-member rate locks before that
                day. After it locks, you keep €9.97 for as long as you stay
                subscribed.
              </p>
            </div>

            {/* SCARCITY / URGENCY CLOSE */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-rose-400 text-[10px] font-semibold uppercase tracking-wider">
                Urgency close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                The window is the lead time, not the discount.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                The signal preceded fundraises by 21–47 days. Every Monday
                you skip is a 21-to-47-day window that closes on five
                specific names. The discount lock is real — €9.97 vs €49 —
                but the harder scarcity is the deal flow, not the price.
                Either it works for you in 30 days or you reply REFUND.
              </p>
            </div>
          </div>
        </section>

        {/* DOORS-CLOSING BANNER — phase-aware ribbon directly above the
            final CTA. Brunson Expert Secrets Ch 14: deadline lives at the
            point of decision, not buried in the chrome. */}
        <DoorsClosingBanner initialWindow={replaySnapshot} />

        {/* CLOSE */}
        <section
          id="close"
          className="bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-950 border border-sky-600 rounded-xl p-6 sm:p-8 text-center space-y-4 scroll-mt-20"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Close
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Lock €9.97/mo. Forever. Before the launch hike to €49.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            One click. Stripe checkout. The next Monday digest, the full
            dashboard, and the SSRN panel ship to you inside ten minutes. The
            30-day guarantee covers everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-base shadow-lg shadow-sky-500/30 transition-colors"
            >
              Lock €9.97/mo founder price <span aria-hidden="true">→</span>
            </a>
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start with the free digest
            </a>
          </div>
          <p className="text-gray-400 text-xs pt-2">
            Or test on one sector for{" "}
            <Link
              href={FIRST_LOOK_URL}
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              €7 (First Look Pass)
            </Link>{" "}
            — credited toward Dashboard if you upgrade in 14 days.
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="space-y-5 scroll-mt-20">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        {/* ENCORE CLOSE — Brunson "Perfect Webinar Hack" Ch 15.
            Last-chance summary that re-stacks every promise into one block.
            This is the thing the page was missing on the prior audit. */}
        <section
          aria-label="Encore — last-chance summary"
          className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            One more time, in one block
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Here&rsquo;s the entire offer in eight lines.
          </h2>
          <ul className="space-y-2 text-gray-200 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>The full ranked dashboard of every venture-backed startup we track. Refreshed every Monday at 09:00 UTC.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>The Sunday digest before that — five names ranked by acceleration, with the chart, the percentile, and the decision rule.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>Direct CSV / JSON exports. Drop them into Notion, a Google Sheet, your own pipeline.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>The MCP server (six tools) for Claude / Cursor / any agent — read your portfolio against the live signal in plain English.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>The full SSRN methodology paper + Zenodo dataset. Reproduce the regression yourself. CC BY 4.0.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>30-day Signal-or-It&rsquo;s-Free guarantee. Reply REFUND. Two business days. No exit interview.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>Founding-member price <strong className="text-amber-300">locked forever</strong> at €9.97/mo. Public hike to €49/mo lands the day a regulated investor tool reviews us.</span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>One click. Stripe. The Monday digest, the dashboard, and the SSRN paper land in your inbox inside ten minutes.</span>
            </li>
          </ul>
          <div className="border-t border-amber-700/30 pt-4 mt-4 flex items-baseline justify-between text-base">
            <span className="text-gray-300">Standalone value of the stack</span>
            <span className="text-emerald-400 font-bold">€1,728/yr</span>
          </div>
          <div className="flex items-baseline justify-between text-2xl font-bold">
            <span className="text-gray-100">Your founding-member rate</span>
            <span className="text-amber-300">€9.97/mo</span>
          </div>
        </section>

        {/* FINAL CTA — never end on FAQ; close the loop. */}
        <section className="border-t border-slate-800 pt-10 text-center space-y-4">
          <p className="text-gray-300 text-base leading-relaxed">
            Read this far? You already believe the signal works.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-base shadow-lg shadow-sky-500/30 transition-colors"
            >
              Lock €9.97/mo · Founder price <span aria-hidden="true">→</span>
            </a>
            <a
              href={SIGNUP_URL}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Free digest first
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            30-day Signal-or-It&rsquo;s-Free guarantee · Reply REFUND for full refund
          </p>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={3} />

        <AgentSummary
          tldr="The Perfect Webinar page lays out the single belief — commit-velocity acceleration is the most leading public signal in venture capital — and supports it by breaking three classic objections (vehicle: GitHub data is noise; internal: I already have deal flow; external: public data has no edge). Closes on the €9.97/mo Dashboard tier (founding-member, locked forever) with a 30-day Signal-or-It's-Free guarantee. Built on the 219-startup SSRN-published panel with a 21–47 day median lead time over fundraise announcements."
          pageUrl="https://signals.gitdealflow.com/perfect-webinar"
          asOf="2026-05-05"
          citeAs="VC Deal Flow Signal — Perfect Webinar (signals.gitdealflow.com/perfect-webinar)."
          facts={[
            {
              claim:
                "Median lead time from 2× contributor spike (14-day window) to fundraise announcement is 31 days, IQR 21–47 days, across 219 startups.",
              sourceUrl: "https://ssrn.com/abstract=6606558",
              sourceLabel: "SSRN preprint",
            },
            {
              claim:
                "Dashboard founding-member price (€9.97/mo) is locked forever and survives the public-launch hike to €49/mo.",
              sourceUrl: "https://signals.gitdealflow.com/pricing",
              sourceLabel: "Pricing page",
            },
            {
              claim:
                "30-day Signal-or-It's-Free guarantee on every paid tier — reply REFUND to any email, full refund inside two business days.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#guarantee",
              sourceLabel: "Guarantee terms",
            },
          ]}
        />
      </div>
    </>
  );
}
