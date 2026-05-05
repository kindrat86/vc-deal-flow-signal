import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

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
const STRIPE_INSIDER = "https://buy.stripe.com/4gM00ifRpcRG2069I40x202";
const SIGNUP_URL = "https://gitdealflow.com/#signup";

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

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HOOK — Brunson rule: hook hard, lead with curiosity. */}
        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Free 12-minute read · Updated 2026-05-05
          </p>
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
        </header>

        {/* STORY / EPIPHANY BRIDGE */}
        <section className="space-y-4 border-l-2 border-sky-500/40 pl-5 italic text-gray-300">
          <h2 className="not-italic text-2xl font-semibold text-gray-100">
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
          <p className="not-italic text-gray-400">
            That accident is the only reason this product exists.
          </p>
        </section>

        {/* BIG DOMINO */}
        <section className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/40 rounded-xl p-6 sm:p-8 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            The big domino
          </p>
          <h2
            className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug"
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
        </section>

        {/* THREE SECRETS */}
        <section className="space-y-8">
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
          </div>
        </section>

        {/* THE SHIFT */}
        <section className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-4">
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
        </section>

        {/* THE STACK */}
        <section className="space-y-6">
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
            {STACK_ITEMS.map((item, i) => (
              <li
                key={item.label}
                className="flex items-start gap-4 bg-slate-900/60 border border-slate-800 rounded-lg p-4"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 w-7 h-7 rounded-full bg-sky-600/20 border border-sky-500/40 text-sky-300 text-sm font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <p className="text-gray-100 font-semibold text-base">
                      {item.label}
                    </p>
                    <p className="text-gray-500 text-xs whitespace-nowrap">
                      Standalone:{" "}
                      <span className="text-emerald-400">
                        {item.standalone}
                      </span>
                    </p>
                  </div>
                  <p className="text-gray-400 text-sm leading-relaxed mt-1">
                    {item.description}
                  </p>
                </div>
              </li>
            ))}
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
            <p className="text-gray-500 text-xs">
              That is €119.64/year, or roughly the cost of one missed seed
              deal. The price stays €9.97 for as long as you stay subscribed,
              even after the public launch hike to €49/mo.
            </p>
          </div>
        </section>

        {/* GUARANTEE */}
        <section className="bg-emerald-950/30 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-3">
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

        {/* CLOSE */}
        <section className="bg-gradient-to-br from-sky-950/50 via-slate-900 to-slate-950 border border-sky-600 rounded-xl p-6 sm:p-8 text-center space-y-4">
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
          <p className="text-gray-500 text-xs pt-2">
            Or test on one sector for{" "}
            <a
              href="https://gitdealflow.com/firstlook/sample"
              className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            >
              €7 (First Look Pass)
            </a>{" "}
            — credited toward Dashboard if you upgrade in 14 days.
          </p>
        </section>

        {/* FAQ */}
        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

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
