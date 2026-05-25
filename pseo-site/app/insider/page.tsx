import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import TrialClose from "@/components/TrialClose";
import BuyerRoadmap from "@/components/BuyerRoadmap";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "Insider Circle — See Every Signal 24 Hours Before The Public · €97/mo",
  description:
    "The Insider Circle walkthrough. If the public Acceleration Watch publishes Mondays at 09:00 UTC, Insiders read the same names Sunday at 09:00 UTC. The single belief: in venture, edge is time, not research. Stack value €4,206/yr — founder rate €97/mo locked forever.",
  alternates: {
    canonical: "/insider",
  },
  openGraph: {
    title: "Insider Circle — 24-Hour Lead Over The Free Tier",
    description:
      "Same signal, 24h earlier. €97/mo founder rate, locked forever. Telegram + JSON/CSV API + custom watchlists + early-list. Stack value €4,206/yr.",
    url: "https://signals.gitdealflow.com/insider",
    type: "article",
  },
};

const STRIPE_INSIDER = "https://buy.stripe.com/4gM00ifRpcRG2069I40x202";
const STRIPE_DASHBOARD = "https://buy.stripe.com/28E7sK48H04U8ou07u0x200";
const SIGNUP_URL = "https://gitdealflow.com/#signup";

const STACK_ITEMS = [
  {
    label: "24-Hour Lead On The Acceleration Watch",
    description:
      "Public list publishes Monday 09:00 UTC. Insiders receive the same ten ranked names by Telegram + email Sunday 09:00 UTC. One full sourcing day before any other investor sees them.",
    standalone: "€597/yr",
  },
  {
    label: "Everything in Dashboard Beta",
    description:
      "109 venture-backed startups across 19 sectors, refreshed every Monday 06:00 UTC. Sector filters. Five-quarter historical comparison. Watchlists. Both Chrome extensions. Free MCP forever.",
    standalone: "€348/yr",
  },
  {
    label: "Private Telegram Group + Live Briefings",
    description:
      "Closed Insider Telegram group. Founder posts the Sunday list with one-line theses, the chart, and the percentile. Open thread for follow-ups, sector questions, or 'is this real or noise' calls.",
    standalone: "€600/yr",
  },
  {
    label: "Insider API — JSON Endpoints + Bulk CSV Pulls",
    description:
      "Authenticated /api/v1/insider/* endpoints. Pull the full ranking, filter by sector + stage, query an org by name. Bulk CSV exports for any sector slice. Rate limit: 600/hr.",
    standalone: "€1,200/yr",
  },
  {
    label: "Custom Watchlist Co-Built Around Your Thesis",
    description:
      "One async exchange — you send your thesis, we send back the 10 highest-acceleration orgs that match. Re-runnable quarterly. Becomes your private feed inside the Telegram group.",
    standalone: "€297 once",
  },
  {
    label: "Webhook Delivery On Threshold Triggers",
    description:
      "Wire any acceleration percentile or signal type into your Slack, Discord, or internal pipeline. Fires when a tracked org crosses your defined threshold. JSON payload, retry-safe.",
    standalone: "Bundled (€397/yr value)",
  },
  {
    label: "Monthly Insider Drop — net-new artefact every first Tuesday",
    description:
      "Sector deep-dive, methodology release, founder essay, or shipping tool — on a four-format rotation. First Tuesday of every month, 09:00 UTC. PDF + CSV + code + chart pack delivered the day it ships. The continuity programme that turns the subscription from a tool into an anticipation engine. Twelve-month forward calendar at /continuity.",
    standalone: "€1,164/yr (12 drops × €97 standalone value each)",
  },
  {
    label: "Direct Founder Line For Diligence Questions",
    description:
      "Reply to any briefing email or Telegram message. Same-day response on signal-quality questions, methodology clarifications, or 'is this org tracked' lookups. Not a sales channel — a research line.",
    standalone: "€0 (priceless)",
  },
  {
    label: "30-Day Signal-or-It's-Free Guarantee",
    description:
      "If, in your first 30 days, the 24-hour lead and the Telegram briefings do not surface a single name you find genuinely useful, reply REFUND. Full refund inside two business days. No exit interview.",
    standalone: "Bonus",
  },
] as const;

const FAQS = [
  {
    q: "What does Insider get me that Dashboard doesn't?",
    a: "Three things, in order of value. (1) The 24-hour lead — Insiders receive Sunday at 09:00 UTC the same 10 names the public Acceleration Watch publishes Monday at 09:00 UTC. (2) The Telegram group — closed, founder-moderated, where the briefing arrives with thesis + chart + percentile and you can ask follow-ups. (3) The API — authenticated JSON endpoints and bulk CSV pulls so you can wire the signal into your own stack. Dashboard is the visual tool; Insider is the time advantage plus the research relationship.",
  },
  {
    q: "Is the 24-hour lead actually meaningful?",
    a: "In venture, time-to-first-meeting is the leading variable on whether you get into a round. The SSRN-published panel has lead-time IQR 21–47 days from signal fire to fundraise announcement. Inside that window, every day of head-start compounds — you reach the founder when they have one or two investors circling, not five. The 24-hour Insider lead lets you be the first cold email of the week, not the fifth.",
  },
  {
    q: "Why €97/mo when Dashboard is €9.97?",
    a: "Different buyers. Dashboard is the tool for an investor who wants the ranked list and the visual interface. Insider is the tool for an investor who has thirty deal-flow conversations a week and needs the 24-hour lead, the API for their own stack, and a direct research line to the founder. The €97 is roughly the cost of one hour of associate time at a fund — the value is one extra outbound conversation per quarter that closes.",
  },
  {
    q: "What does the API actually return?",
    a: "Authenticated JSON at /api/v1/insider/ranking, /api/v1/insider/sector/{slug}, /api/v1/insider/org/{handle}, and /api/v1/insider/csv?sector={slug}. Same fields as the public dataset (acceleration percentile, contributor delta, commit-velocity 14d/30d/90d, signal type, stage, geography) plus the un-redacted org name and the engineering thesis. Rate limit 600/hr per key. CSV export accepts sector + stage + geography filters and returns every matching org × every metric.",
  },
  {
    q: "Is the Telegram group active or just a broadcast channel?",
    a: "Active. Founder posts the Sunday briefing as the anchor message; threads run all week with sector-specific follow-ups, signal-type questions, and 'is this real' calls. Members are vetted (one paying subscription = one Telegram seat) so the signal-to-noise ratio stays high. You can lurk; about a third of members do.",
  },
  {
    q: "Can I downgrade to Dashboard if Insider is too much?",
    a: "Yes — one-click in the Stripe customer portal. The 30-day refund applies first, so if Insider isn't earning its keep, you reply REFUND and get the full €97 back rather than downgrading. After 30 days, downgrades are pro-rated against the current billing period.",
  },
  {
    q: "What's the Monthly Insider Drop and what do I actually get?",
    a: "On the first Tuesday of every month at 09:00 UTC, every Insider gets a net-new artefact — on a four-format rotation: sector deep-dive (25-page PDF + CSV), methodology release (regression code + paper update), founder essay (4-6K-word post-mortem), or tool release (new MCP tool, API endpoint, or chart pack). Public sees the abstract; members get the full essay + member-only artefact bundle. Twelve-month forward calendar at /continuity. If a drop slips by 48 hours past its publish date, every Insider gets one month free automatically — that's how seriously the cadence is taken.",
  },
] as const;

export default function InsiderPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": "https://signals.gitdealflow.com/insider#article",
        headline:
          "Insider Circle — See Every Signal 24 Hours Before The Public",
        description:
          "If venture-investing edge is time rather than research, then a 24-hour lead on a list of 10 ranked engineering accelerations is the most leveraged €97/mo an active investor can spend. Stack value €4,206/yr.",
        url: "https://signals.gitdealflow.com/insider",
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
        mainEntityOfPage: "https://signals.gitdealflow.com/insider",
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
        "@type": "Offer",
        "@id": "https://signals.gitdealflow.com/insider#offer",
        name: "Insider Circle — €97/mo founding-member rate",
        description:
          "Monthly subscription at founding-member rate (€97/mo, locks for the lifetime of the subscription; list price €197/mo). Includes 24-hour lead on Acceleration Watch, private Telegram group, JSON/CSV API, custom watchlist, webhooks, founder line, and Dashboard Beta.",
        price: 97,
        priceCurrency: "EUR",
        priceValidUntil: "2026-12-31",
        url: STRIPE_INSIDER,
        availability: "https://schema.org/InStock",
        category: "subscription",
        priceSpecification: {
          "@type": "UnitPriceSpecification",
          price: 97,
          priceCurrency: "EUR",
          billingDuration: "P1M",
          unitCode: "MON",
        },
        seller: { "@id": "https://gitdealflow.com/#organization" },
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
            name: "Insider Circle",
            item: "https://signals.gitdealflow.com/insider",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/insider"
        languages={getHreflangLanguages("/insider")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/insider" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* HOOK */}
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">Insider Circle</span>
          </nav>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-emerald-400 text-xs font-medium uppercase tracking-wider">
              Free 10-minute read · Updated 2026-05-05
            </p>
            <a
              href="#close"
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 underline decoration-dotted underline-offset-4"
            >
              Skip to offer →
            </a>
          </div>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            Same signal, sent{" "}
            <span className="text-emerald-400">24 hours earlier</span>.<br />
            That&rsquo;s the entire Insider Circle.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            If you write more than ten checks a year, the difference between
            arriving second and arriving first on a fundraise is one outbound
            email and twenty-four hours of head-start. The Insider Circle is
            the tool that gives you the head-start. The next ten minutes
            explain why €97/mo is the most leveraged price in deal-flow
            tooling once recurring visibility already works and you need
            recurring conviction support.
          </p>
        </header>

        <section className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Verify the claim before you buy
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            If you still need proof, compare logic, or buyer-side clarity before paying €97/mo, use the shortest page for that question first. Then come back when recurring visibility already feels useful and you want the tighter layer around the judgment.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <Link href="/research" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Read the research panel
            </Link>
            <Link href="/answers/when-should-i-use-dashboard-vs-insider" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Choose Dashboard vs Insider
            </Link>
            <Link href="/buyers-guide" className="text-emerald-200 hover:text-emerald-100 underline underline-offset-2">
              Read the buyer's guide
            </Link>
          </div>
        </section>

        {/* STORY */}
        <section
          id="story"
          className="space-y-4 border-l-2 border-emerald-500/40 pl-5 text-gray-300 leading-relaxed scroll-mt-20"
        >
          <h2 className="text-2xl font-semibold text-gray-100">
            The Tuesday I learned that Mondays are too late
          </h2>
          <p>
            A founder I had been watching went into fundraise in February
            2025. Their commit velocity had crossed the 95th percentile two
            Sundays earlier. The Acceleration Watch list — the public version
            — published the following Monday at 09:00 UTC.
          </p>
          <p>
            By the time I sent my outreach email Tuesday morning, the founder
            replied that they had four investors on calls already.
          </p>
          <p>
            Four investors. Inside thirty hours. From a list that had been
            public for one work-day.
          </p>
          <p>
            The signal had worked. The list had worked. The lead-time numbers
            were correct. The thing that had failed was the calendar — Monday
            morning is when every other investor opens their laptop. By
            Tuesday the round is already shaping.
          </p>
          <p className="italic text-gray-400 pt-3 border-t border-slate-800">
            That&rsquo;s the only reason the Insider Circle exists. To send
            the same list one work-day earlier.
          </p>
          <TrialClose tone="emerald">
            One Tuesday too late closes a round. If a single Sunday-instead-
            of-Monday cycle lands you the meeting before the four-other-
            investors line forms — has €97/mo already justified itself?
          </TrialClose>
        </section>

        {/* BIG DOMINO */}
        <section
          id="domino"
          className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-4 scroll-mt-20"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            The core claim
          </p>
          <h2
            className="text-2xl sm:text-4xl font-bold text-gray-100 leading-tight tracking-tight"
            data-speakable
          >
            In venture, the edge is{" "}
            <span className="text-emerald-400">time</span>, not research.
            Anyone with a laptop can rank GitHub orgs by acceleration. Almost
            nobody can read the list before the rest of the market does.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            That belief, if true, makes Insider the most leveraged price in
            deal-flow tooling. The data is the same. The Telegram group is a
            convenience. The API is a convenience. The 24-hour lead is the
            product. Three secrets follow — each is one objection to that
            belief, and each gets broken.
          </p>
          <TrialClose tone="emerald">
            Edge is time, not research. If that single sentence reads as
            true, does the rest of the page reduce to whether €97/mo is
            cheaper than the time you&rsquo;re currently spending on
            sourcing?
          </TrialClose>
        </section>

        {/* THREE SECRETS */}
        <section id="secrets" className="space-y-8 scroll-mt-20">
          <div className="space-y-2">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              The three secrets
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
              Three objections. Three breakdowns.
            </h2>
          </div>

          {/* SECRET 1 — VEHICLE */}
          <div className="border-l-4 border-emerald-500 pl-5 space-y-3">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              Secret #1 · Vehicle objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;Twenty-four hours doesn&rsquo;t actually matter.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">It does, and the SSRN panel quantifies it.</strong>{" "}
              Lead-time from a fired signal to a public fundraise announcement
              is 21–47 days IQR. Inside that window, the round shape is
              determined in the first 72 hours after the founder starts taking
              meetings. Reaching out on Sunday afternoon — when the founder
              has cleared their inbox and is loading the week — is a
              structurally different conversation than Tuesday morning when
              they have already committed two introductions.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              The 24-hour lead doesn&rsquo;t exist to beat other investors by
              a day. It exists to put your email in the founder&rsquo;s inbox
              before they have decided which investors they will actively
              pursue.
            </p>
          </div>

          {/* SECRET 2 — INTERNAL */}
          <div className="border-l-4 border-sky-500 pl-5 space-y-3">
            <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
              Secret #2 · Internal objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;I already get the dashboard. The Telegram is overkill.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">The dashboard tells you the rank. The Telegram tells you whether to act.</strong>{" "}
              The dashboard is a sortable table — useful for browsing, weak
              for triage. The Telegram briefing arrives with a one-line
              thesis, the chart, the percentile, and (when relevant) the
              specific reason this week&rsquo;s acceleration looks more like a
              fundraise precursor than a launch.
            </p>
            <p className="text-gray-300 text-base leading-relaxed">
              Practically: if you only have ten minutes on a Sunday evening,
              the briefing tells you which two of the ten names to actually
              cold-email. The dashboard tells you all ten exist.
            </p>
          </div>

          {/* SECRET 3 — EXTERNAL */}
          <div className="border-l-4 border-indigo-500 pl-5 space-y-3">
            <p className="text-indigo-400 text-xs font-semibold uppercase tracking-wider">
              Secret #3 · External objection
            </p>
            <h3 className="text-xl font-bold text-gray-100">
              &ldquo;The data is public. Anyone can replicate it.&rdquo;
            </h3>
            <p className="text-gray-300 text-base leading-relaxed">
              <strong className="text-gray-100">Replicating it costs 6 months and a data engineer.</strong>{" "}
              The methodology is open at{" "}
              <a
                href="https://ssrn.com/abstract=6606558"
                className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted"
                target="_blank"
                rel="noopener"
              >
                SSRN abstract 6606558
              </a>
              {" "}because we don&rsquo;t mind. Building the pipeline that
              ranks 4,200 orgs every week, deduplicates them against fundraise
              announcements, classifies the signal type, and ships the result
              by Sunday 09:00 UTC is its own job. €97/mo is roughly the cost
              of ninety minutes of that engineer&rsquo;s time. You buy the
              pipeline, not the methodology.
            </p>
          </div>

          <TrialClose tone="indigo">
            Three objections, three breakdowns, methodology open at SSRN. If
            none of those three was the real objection — what is? (That
            answer is the one to keep handy as the stack lands.)
          </TrialClose>
        </section>

        {/* THE SHIFT */}
        <section
          id="shift"
          className="bg-slate-900/60 border border-slate-700 rounded-xl p-6 sm:p-8 space-y-4 scroll-mt-20"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            If all three are false, what does Sunday look like?
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Sunday 09:15 UTC, you open the Telegram briefing in bed. Ten
            ranked names, one-line theses, the chart, the percentile. You pick
            two whose theses match what you&rsquo;re writing checks for this
            quarter. You draft two cold emails — three lines each — and
            schedule them for Monday 07:30 in the founder&rsquo;s timezone.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            Monday morning, your two emails are in the founder&rsquo;s inbox
            before the rest of the market sees the public list. Tuesday, you
            have either a meeting or a polite no. Either way, you closed a
            week of deal-flow work into thirty minutes on a Sunday.
          </p>
          <p className="text-gray-300 text-base leading-relaxed">
            That rhythm is the entire product. Everything else — the API, the
            custom watchlist, the founder line — is a tool that makes the
            Sunday-evening rhythm easier.
          </p>
          <TrialClose tone="amber">
            Sunday 09:15 in bed, two cold emails scheduled for Monday 07:30,
            Tuesday a meeting or a polite no. If that rhythm replaced the
            Sunday-night sourcing block you do anyway — would you swap?
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
              <span className="text-emerald-400">€97/mo</span>.
            </h2>
            <p className="text-gray-400 text-sm">
              Nine items. €4,206/yr standalone value. Founding-member price
              locked forever.
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
                      ? "bg-emerald-950/30 border border-emerald-600/50 ring-1 ring-emerald-500/20"
                      : "bg-slate-900/60 border border-slate-800"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className={`shrink-0 w-7 h-7 rounded-full text-sm font-bold flex items-center justify-center ${
                      isFeatured
                        ? "bg-emerald-500 text-slate-950"
                        : "bg-emerald-600/20 border border-emerald-500/40 text-emerald-300"
                    }`}
                  >
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-3 flex-wrap">
                      <p className="text-gray-100 font-semibold text-base flex items-center gap-2">
                        {item.label}
                        {isFeatured && (
                          <span className="text-[10px] uppercase tracking-wider font-bold text-emerald-300 bg-emerald-500/15 border border-emerald-500/30 rounded px-1.5 py-0.5">
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
                  </div>
                </li>
              );
            })}
          </ol>

          {/* PRICE STACK */}
          <div className="border-t border-slate-700 pt-6 space-y-3">
            <div className="flex items-baseline justify-between text-gray-400 text-sm">
              <span>Total standalone value</span>
              <span className="line-through">€4,206/yr</span>
            </div>
            <div className="flex items-baseline justify-between text-gray-400 text-sm">
              <span>Post-launch retail (Insider at €197/mo)</span>
              <span className="line-through">€2,364/yr</span>
            </div>
            <div className="flex items-baseline justify-between text-2xl font-bold text-gray-100 pt-3 border-t border-slate-800">
              <span>Founding-member price, locked forever</span>
              <span className="text-emerald-400">€97/mo</span>
            </div>
            <p className="text-gray-400 text-xs">
              That is €1,164/year, or roughly the cost of one missed warm
              intro. The price stays €97 for as long as you stay subscribed,
              even after the public hike to €197/mo.
            </p>
          </div>
          <TrialClose tone="violet">
            €4,206/yr standalone at €97/mo founding rate, locked through the
            public hike to €197. If the lock itself is the asset — would you
            rather wake up on the founding rate or the post-launch rate?
          </TrialClose>
        </section>

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
            If, in your first 30 days, the 24-hour lead and the Telegram
            briefings do not surface a single name you find genuinely useful,
            reply <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 text-sm">REFUND</code> to
            any briefing. The full €97 is refunded inside two business days.
            Your Telegram seat is removed at next month boundary. No exit
            interview, no &ldquo;wait, let me show you one more thing.&rdquo;
          </p>
          <TrialClose tone="rose">
            Worst case: 30 days, you keep what you read, the €97 lands back
            on your card. Where else does the &ldquo;keep the asset, get the
            money back&rdquo; downside profile exist for an investor tool?
          </TrialClose>
        </section>

        {/* TRIAL CLOSES */}
        <section className="space-y-3">
          <h2 className="text-2xl font-bold text-gray-100">
            Three trial closes — pick the one that sounds like you.
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">1.</span>
              <span>
                If you write ten-plus angel checks a year, the Sunday briefing
                pays for itself the first month it puts you in front of one
                founder before the deck circulates. That happens, on average,
                inside the first two Sundays.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">2.</span>
              <span>
                If you run a fund or a syndicate, the API alone is worth €97
                — drop the JSON into your own pipeline and ship a one-page
                Monday memo to your principal before the rest of the team has
                opened their laptop.
              </span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-emerald-400 font-bold shrink-0">3.</span>
              <span>
                If you are still deciding whether the weekly shortlist is enough,
                start on Dashboard at €9.97/mo. Move up when you want more context,
                more signal support, and less second-guessing around the call.
              </span>
            </li>
          </ul>
        </section>

        {/* IF ALL THIS DID */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            And if you&rsquo;re still not sure — ask yourself this.
          </h2>
          <ul className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              If all this did was give you a{" "}
              <strong className="text-amber-300">
                24-hour head-start on one founder per quarter
              </strong>
              , and that head-start meant you got the meeting before the round
              filled — would €97/mo be worth it?
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              If all this did was{" "}
              <strong className="text-amber-300">
                replace your Sunday-night sourcing block
              </strong>{" "}
              with a 15-minute Telegram briefing — would €97/mo be worth it?
            </li>
            <li className="border-l-4 border-amber-500 pl-5 py-1">
              If all this did was let you{" "}
              <strong className="text-amber-300">
                ship one cold email Sunday evening
              </strong>{" "}
              that arrived in the founder&rsquo;s inbox before any other
              investor saw the list — would the entire stack pay for itself
              the first quarter?
            </li>
          </ul>
        </section>

        {/* FOUR CLOSES */}
        <section
          aria-label="Closes"
          className="space-y-5 border-t border-slate-800 pt-8"
        >
          <h2 className="text-2xl font-bold text-gray-100">
            The four closes — one of these is yours.
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* MONEY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-emerald-400 text-[10px] font-semibold uppercase tracking-wider">
                Money close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                €1,164/yr. One missed warm intro.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                €97/mo is €1,164/year. The expected value of one cheque you
                wrote because you got there first — at a €5k-€50k angel range
                with even a 3× exit multiple — is between €15k and €150k. The
                math doesn&rsquo;t work the other way. You aren&rsquo;t paying
                for data. You&rsquo;re paying for one Sunday-evening
                head-start per quarter.
              </p>
            </div>

            {/* IDENTITY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-sky-400 text-[10px] font-semibold uppercase tracking-wider">
                Identity close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                Start with Dashboard when the shortlist feels useful. Move here when you want more than the shortlist.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Dashboard is the weekly field. Insider is the layer you add when you want more context, more access, and a steadier signal rhythm around the decisions that matter.
              </p>
            </div>

            {/* PRICING */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-indigo-400 text-[10px] font-semibold uppercase tracking-wider">
                Pricing close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                The stack is €4,206/yr. You pay €1,164.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                We could charge €197/mo and the math would still work. The
                €197 launches the day a regulated investor tool reviews us —
                the founding-member rate locks before that day. After it
                locks, you keep €97/mo for as long as you stay subscribed.
              </p>
            </div>

            {/* URGENCY */}
            <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6 space-y-2">
              <p className="text-rose-400 text-[10px] font-semibold uppercase tracking-wider">
                Urgency close
              </p>
              <h3 className="text-gray-100 font-semibold text-base">
                The Telegram is capped. Not as marketing — as moderation.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                Insider Telegram is closed and one-seat-per-subscription. We
                cap at the size where the founder can still answer threads
                personally — currently around 50 active members. Beyond that,
                new sign-ups go on a waiting list while we tier the group.
                Founding members keep their seat permanently, even if the cap
                is later lowered.
              </p>
            </div>
          </div>
        </section>

        {/* CLOSE */}
        <section
          id="close"
          className="bg-gradient-to-br from-emerald-950/50 via-slate-900 to-slate-950 border border-emerald-600 rounded-xl p-6 sm:p-8 text-center space-y-4 scroll-mt-20"
        >
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Close
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Lock €97/mo. Forever. Before the launch hike to €197.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            One click. Stripe checkout. The next Sunday briefing, the
            Telegram invite, the API key, and your custom-watchlist intake
            form ship to you inside ten minutes. The 30-day guarantee covers
            everything.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href={STRIPE_INSIDER}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-base shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Lock €97/mo founder price <span aria-hidden="true">→</span>
            </a>
            <a
              href={STRIPE_DASHBOARD}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or start with Dashboard at €9.97/mo
            </a>
          </div>
          <p className="text-gray-400 text-xs pt-2">
            Or read the full case in the{" "}
            <Link
              href="/walkthrough"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              Dashboard walkthrough
            </Link>{" "}
            first — Insider includes everything in Dashboard.
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

        {/* ENCORE */}
        <section
          aria-label="Encore — last-chance summary"
          className="rounded-xl border border-amber-500/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            One more time, in one block
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            Here&rsquo;s the entire offer in nine lines.
          </h2>
          <ul className="space-y-2 text-gray-200 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Sunday-09:00-UTC briefing — same ten ranked names the public
                list publishes Monday at 09:00 UTC. 24 hours of head-start on
                every other investor.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Closed Insider Telegram — founder posts the briefing as the
                anchor message; threads run all week with sector follow-ups
                and signal-quality questions.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Authenticated /api/v1/insider/* endpoints + bulk CSV pulls.
                600/hr rate limit. Drop the JSON into your stack.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Custom watchlist — async exchange, you send your thesis, we
                send back the 10 highest-acceleration orgs that match.
                Re-runnable quarterly.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Webhooks on threshold triggers. Wire any acceleration
                percentile or signal type into Slack, Discord, or your own
                pipeline.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Direct founder line by reply-to-email or Telegram message.
                Same-day response on signal-quality questions or
                methodology clarifications.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Everything in Dashboard Beta — 109 startups, 19 sectors,
                weekly refresh, both Chrome extensions, free MCP forever.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                Monthly Insider Drop — first Tuesday of every month, 09:00
                UTC, a net-new sector deep-dive, methodology release, founder
                essay, or shipping tool. Twelve-month forward calendar at{" "}
                <Link
                  href="/continuity"
                  className="text-amber-300 underline decoration-dotted hover:text-amber-200"
                >
                  /continuity
                </Link>
                .
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold">→</span>
              <span>
                30-day Signal-or-It&rsquo;s-Free guarantee. Founding-member
                price <strong className="text-amber-300">locked forever</strong> at
                €97/mo. Public hike to €197/mo lands the day a regulated
                investor tool reviews us.
              </span>
            </li>
          </ul>
          <div className="border-t border-amber-700/30 pt-4 mt-4 flex items-baseline justify-between text-base">
            <span className="text-gray-300">Standalone value of the stack</span>
            <span className="text-emerald-400 font-bold">€4,206/yr</span>
          </div>
          <div className="flex items-baseline justify-between text-2xl font-bold">
            <span className="text-gray-100">Your founding-member rate</span>
            <span className="text-amber-300">€97/mo</span>
          </div>
        </section>

        {/* BUYER ROADMAP — Brunson Expert Secrets Ch 18. Four-beat
            calendar (Today → Sunday+6 → first Tuesday → Day 90→1yr) so
            the €97/mo reads as a vehicle on a calendar, not a recurring
            charge. Sits between the Encore and the Final CTA so the
            arc is the last thing the buyer reads before clicking. */}
        <BuyerRoadmap tier="insider" />

        {/* FINAL CTA */}
        <aside
          className="border-l-2 border-slate-700/60 pl-4 py-1 space-y-2"
          aria-label="If this feels too early"
        >
          <p className="text-slate-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            If this feels too early
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Start with the free digest if you still need more repetitions before paying.
            Use Dashboard if the signal already feels real but you only need the recurring
            weekly surface, not the tighter support layer.
          </p>
          <div className="flex flex-wrap gap-3 text-sm">
            <a
              href={SIGNUP_URL}
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted underline-offset-2"
            >
              Get the free digest first
            </a>
            <Link
              href="/answers/what-do-i-actually-get-from-dashboard-each-week"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted underline-offset-2"
            >
              See what Dashboard gives you
            </Link>
            <Link
              href="/buyers-guide"
              className="text-emerald-300 hover:text-emerald-200 underline decoration-dotted underline-offset-2"
            >
              Read the buyer's guide
            </Link>
          </div>
        </aside>

        <section className="border-t border-slate-800 pt-10 text-center space-y-4">
          <p className="text-gray-300 text-base leading-relaxed">
            Read this far? You already believe the 24-hour lead is real.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href={STRIPE_INSIDER}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-base shadow-lg shadow-emerald-500/30 transition-colors"
            >
              Lock €97/mo · Founder price <span aria-hidden="true">→</span>
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

        <AgentSummary
          tldr="Insider Circle is the €97/mo (founding-member rate, locked forever; list €197/mo) tier of VC Deal Flow Signal. The single thing it sells is a 24-hour lead on the public Acceleration Watch — Insiders receive the same ten ranked startups Sunday at 09:00 UTC that the public list publishes Monday at 09:00 UTC. Stack also includes everything in Dashboard Beta, a closed Insider Telegram with founder briefings and threads, an authenticated API (/api/v1/insider/* + bulk CSV), custom thesis-aligned watchlist, webhook delivery on threshold triggers, and a direct founder line for diligence questions. €4,206/yr standalone value. 30-day Signal-or-It's-Free guarantee, reply REFUND."
          pageUrl="https://signals.gitdealflow.com/insider"
          asOf="2026-05-05"
          citeAs="VC Deal Flow Signal — Insider Circle (signals.gitdealflow.com/insider)."
          facts={[
            {
              claim:
                "Insider Circle founding-member rate is €97/mo and locks for the lifetime of the subscription; list price is €197/mo.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#insider-circle",
              sourceLabel: "Pricing page",
            },
            {
              claim:
                "Sunday-09:00-UTC briefing arrives 24 hours before the public Monday-09:00-UTC Acceleration Watch publishes the same names.",
              sourceUrl: "https://signals.gitdealflow.com/predicted",
              sourceLabel: "Acceleration Watch",
            },
            {
              claim:
                "Authenticated /api/v1/insider/* endpoints and bulk CSV exports are included; rate limit 600/hr per key.",
              sourceUrl: "https://signals.gitdealflow.com/agents",
              sourceLabel: "Agents surface",
            },
          ]}
        />

        <div aria-hidden="true" className="md:hidden h-20" />
      </div>

      <div
        aria-label="Sticky insider bar (mobile)"
        className="fixed bottom-0 inset-x-0 md:hidden z-40 border-t border-emerald-500/40 bg-slate-950/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(16,185,129,0.15)]"
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-wider">
              Insider · founder rate
            </p>
            <p className="text-gray-100 font-bold text-lg tabular-nums leading-none">
              €97
              <span className="text-gray-400 text-[10px] font-medium ml-1.5 uppercase tracking-wider">
                /mo
              </span>
            </p>
          </div>
          <a
            href={STRIPE_INSIDER}
            className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm px-4 py-2.5 shadow-md"
          >
            Join →
          </a>
        </div>
      </div>
    </>
  );
}
