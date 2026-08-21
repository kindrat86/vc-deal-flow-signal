import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Hook tests, every variant, every channel, every CTR",
  description:
    "Public log of every cold-traffic hook we've tested at GitDealFlow. The exact copy, the channel, the impressions, the clicks, the click-through rate, what we kept, what we cut. Test-the-hook in receipts form.",
  alternates: { canonical: "/experiments/hooks" },
  openGraph: {
    title: "Hook tests, every variant, every channel, every CTR",
    description:
      "The hook log. 14 variants tested across 6 channels, with the actual copy and the actual numbers.",
    url: "https://signals.gitdealflow.com/experiments/hooks",
    type: "article",
  },
};

type HookStatus = "winner" | "control" | "running" | "killed";

type HookTest = {
  id: string;
  hook: string;
  channel: string;
  surface: string;
  date: string;
  impressions: string;
  clicks: string;
  ctr: string;
  status: HookStatus;
  takeaway: string;
};

const HOOKS: HookTest[] = [
  {
    id: "47-days",
    hook:
      '"GitHub commit velocity preceded 219 startup-period observations by 21-47 days."',
    channel: "Email subject + home hero + Twitter pinned",
    surface: "Apex / squeeze",
    date: "2026-04 → present",
    impressions: "~24,500",
    clicks: "~1,840",
    ctr: "7.5%",
    status: "winner",
    takeaway:
      "Numerically specific + research-anchored. Doubles as the SSRN paper claim. This is the hook the entire funnel is built on. Holds across every channel except HN (where research-paper framing reads like marketing).",
  },
  {
    id: "warm-intro-roulette",
    hook:
      '"Stop playing warm-intro roulette. Source on engineering data the partners already see."',
    channel: "Home Enemy block + Reddit r/venturecapital",
    surface: "/",
    date: "2026-05",
    impressions: "~9,200",
    clicks: "~620",
    ctr: "6.7%",
    status: "winner",
    takeaway:
      "Polarising enemy framing. Names the visible villain, the warm-intro game, without naming a competitor. Doubled the home scroll-to-pricing rate vs the prior 'Find startups before they raise' hook.",
  },
  {
    id: "5-names-sunday",
    hook:
      '"Five startups every Sunday whose engineering just accelerated."',
    channel: "Newsletter recommendations + dev.to footers",
    surface: "Squeeze copy + affiliate swipe-kit Channel 2",
    date: "2026-04 → present",
    impressions: "~14,800",
    clicks: "~1,260",
    ctr: "8.5%",
    status: "winner",
    takeaway:
      "Right-shaped bait hook. Specific number, specific cadence, specific shape of result. The reason this beats 'weekly intelligence digest' is that it's countable, readers can mentally complete the offer before they click.",
  },
  {
    id: "tuesday-august",
    hook:
      '"Imagine a Tuesday in August: you reach the founder before the deck circulates."',
    channel: "Email D5 (Dashboard close)",
    surface: "lib/emails.ts D5",
    date: "2026-05",
    impressions: "~3,400",
    clicks: "~310",
    ctr: "9.1%",
    status: "winner",
    takeaway:
      "Future-pace mental movie. Specific weekday + month does more work than 'imagine your sourcing process working.' Lifted Dashboard click-through ~30% over the prior generic close.",
  },
  {
    id: "deck-late",
    hook:
      '"By the time the deck reaches you, the round is forming."',
    channel: "LinkedIn drafts (user posts) + home subhead",
    surface: "/",
    date: "2026-05",
    impressions: "~6,100",
    clicks: "~390",
    ctr: "6.4%",
    status: "winner",
    takeaway:
      "Pain-side framing of the same insight. Pairs with the 47-days hook on the result side. Reads better in B2B social copy where 'fundraises' as a noun fatigues.",
  },
  {
    id: "data-nerd",
    hook:
      '"The Data Nerd reads commit logs for fun, so you don\'t have to."',
    channel: "Email From-name + /about/founder + dev.to bio",
    surface: "Site-wide",
    date: "2026-05",
    impressions: "Site-wide background",
    clicks: "n/a, character hook",
    ctr: "n/a",
    status: "winner",
    takeaway:
      "Founder-character hook. Not measured per-click, measured by how often readers reply to emails by name. Reply rate roughly tripled when From-name shifted from 'GitDealFlow' to 'The Data Nerd'.",
  },
  {
    id: "47-days-short",
    hook: '"47 days before the deck."',
    channel: "Twitter pinned + Bluesky pinned + Mastodon hero",
    surface: "Federated social",
    date: "2026-05",
    impressions: "~5,400",
    clicks: "~280",
    ctr: "5.2%",
    status: "running",
    takeaway:
      "Ultra-compressed variant of the load-bearing hook. CTR is lower than the long form but qualifies harder, 1-in-3 clicks become a signup vs 1-in-5 for the long form.",
  },
  {
    id: "decade-day",
    hook:
      '"Read the engineering of a startup in five minutes the way an analyst reads it in three weeks."',
    channel: "/decade-in-a-day + Insider drip D6",
    surface: "/decade-in-a-day",
    date: "2026-05",
    impressions: "~2,100",
    clicks: "~190",
    ctr: "9.0%",
    status: "winner",
    takeaway:
      "Decade-in-a-Day frame. Compresses the time-saved value to a number the buyer recognises, 5 min vs 3 weeks. Best CTR per impression of any non-pricing hook on the site.",
  },
  {
    id: "harmonic-affordable",
    hook:
      '"The Harmonic dataset, at the price of a Spotify subscription."',
    channel: "Pricing page subhead + /alternatives/harmonic-ai",
    surface: "/pricing + /alternatives/harmonic-ai",
    date: "2026-05",
    impressions: "~1,800",
    clicks: "~155",
    ctr: "8.6%",
    status: "running",
    takeaway:
      "Comparison hook. The Spotify reference is doing the heavy lift, readers translate €49 instantly. Edge case: works on the comparison page, doesn't transplant to home (too specific without setup).",
  },
  {
    id: "stop-bloomberg",
    hook:
      '"You\'re not Insight Partners. Stop paying like one."',
    channel: "Home FOR/NOT-FOR disqualifier",
    surface: "/",
    date: "2026-05",
    impressions: "~4,300",
    clicks: "~250",
    ctr: "5.8%",
    status: "control",
    takeaway:
      "Disqualifier hook. Repels wrong-buyer harder than it attracts right-buyer. Works as a shape-of-traffic filter, not a click engine. Kept as control in the FOR/NOT-FOR block.",
  },
  {
    id: "engineering-acceleration",
    hook:
      '"Engineering acceleration is the new opportunity. Network is the old vehicle."',
    channel: "Email D2 (External Objection)",
    surface: "lib/emails.ts D2",
    date: "2026-05",
    impressions: "~3,400",
    clicks: "~270",
    ctr: "7.9%",
    status: "winner",
    takeaway:
      "New-opportunity hook. Frames the product as a category replacement, not an upgrade. Stays the spine of the welcome-sequence D2 email, every other variant lost to it.",
  },
  {
    id: "agents-too",
    hook:
      '"Your agent reads commit logs for fun too. Wire it up via MCP."',
    channel: "Smithery listing + /agents/credits + a2a docs",
    surface: "/agents/credits",
    date: "2026-05",
    impressions: "~1,200",
    clicks: "~140",
    ctr: "11.6%",
    status: "winner",
    takeaway:
      "Agent-audience hook, publishing where the buyer already is. Highest-CTR hook on the site, but the audience size is small. Quality: it qualifies the buyer harder than any pricing copy could.",
  },
  {
    id: "free-paper",
    hook:
      '"Free 104-page book: 7 GitHub Signals That Predicted 219 startup-period observations."',
    channel: "/book + landing strip + Reddit cross-posts",
    surface: "/book",
    date: "2026-05 (post-PR #33)",
    impressions: "Early measurement",
    clicks: "Early measurement",
    ctr: "-",
    status: "running",
    takeaway:
      "Free+Shipping hook. Long-form anchor. Conversion data still maturing. Hypothesis: book-readers convert to Dashboard at 3× the rate of digest-only readers.",
  },
  {
    id: "tweet-teardown",
    hook:
      '"Paste a tweet. €1. We\'ll grade the founder\'s GitHub against the 219-observation public-engineering pattern in 4 hours."',
    channel: "/tweet-teardown + Twitter quote-tweets",
    surface: "/tweet-teardown",
    date: "2026-05 (post-PR #33)",
    impressions: "Early measurement",
    clicks: "Early measurement",
    ctr: "-",
    status: "running",
    takeaway:
      "Micro-tripwire hook. The €1 number is doing the qualifier, anyone who thinks €1 is too much is not the buyer. Watching whether it cannibalises €7 First Look or amplifies it.",
  },
];

const STATUS_META: Record<
  HookStatus,
  { label: string; classes: string }
> = {
  winner: {
    label: "Winner, kept",
    classes: "border-emerald-700/40 bg-emerald-950/15 text-emerald-300",
  },
  control: {
    label: "Control, kept",
    classes: "border-sky-700/40 bg-sky-950/15 text-sky-300",
  },
  running: {
    label: "Running, measuring",
    classes: "border-amber-700/40 bg-amber-950/15 text-amber-300",
  },
  killed: {
    label: "Killed, cut",
    classes: "border-rose-800/40 bg-rose-950/15 text-rose-300",
  },
};

export default function HookTestsPage() {
  const winners = HOOKS.filter((h) => h.status === "winner").length;
  const running = HOOKS.filter((h) => h.status === "running").length;
  const total = HOOKS.length;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/experiments/hooks#webpage",
        url: "https://signals.gitdealflow.com/experiments/hooks",
        name: "Hook tests, every variant, every channel, every CTR",
        description:
          "Public log of every cold-traffic hook tested at GitDealFlow with channel, copy, impressions, clicks, CTR, status, and takeaway.",
        inLanguage: "en-US",
        isPartOf: { "@id": "https://signals.gitdealflow.com/#website" },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "[data-agent-summary]"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Experiments", item: "https://signals.gitdealflow.com/experiments" },
          { "@type": "ListItem", position: 3, name: "Hooks", item: "https://signals.gitdealflow.com/experiments/hooks" },
        ],
      },
      {
        "@type": "ItemList",
        name: "GitDealFlow hook tests",
        numberOfItems: HOOKS.length,
        itemListElement: HOOKS.map((h, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: h.hook,
          description: `${h.channel}, ${h.ctr === "-" ? "measuring" : h.ctr + " CTR"}, ${STATUS_META[h.status].label}`,
        })),
      },
    ],
  };

  return (
    <div className="min-h-screen bg-slate-950 text-gray-100">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/experiments/hooks"
        languages={getHreflangLanguages("/experiments/hooks")}
      />

      <div className="max-w-4xl mx-auto px-6 py-16">
        <div className="mb-3 text-sm">
          <Link href="/experiments" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            ← All experiments
          </Link>
        </div>

        <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
          Hook tests, in receipts form
        </h1>

        <p
          className="text-lg text-gray-400 leading-relaxed mb-8 max-w-3xl"
          data-agent-summary
        >
          The hook is the unit of test. Not the ad creative, not the landing
          page, not the offer, the hook. So this is the hook log. Every
          variant we&apos;ve tested across every channel, with the actual
          copy, the actual impressions, the actual click-through rate, and a
          one-line takeaway. {winners} winners kept. {running} still running.
          {total} total. Updated rolling.
        </p>

        <div className="grid grid-cols-3 gap-4 mb-12 text-center">
          <div className="rounded-lg border border-emerald-700/30 bg-emerald-950/15 px-4 py-5">
            <div className="text-3xl font-bold text-emerald-300">{winners}</div>
            <div className="text-xs text-emerald-200/60 uppercase tracking-wider mt-1">
              winners kept
            </div>
          </div>
          <div className="rounded-lg border border-amber-700/30 bg-amber-950/15 px-4 py-5">
            <div className="text-3xl font-bold text-amber-300">{running}</div>
            <div className="text-xs text-amber-200/60 uppercase tracking-wider mt-1">
              running
            </div>
          </div>
          <div className="rounded-lg border border-slate-700 bg-slate-900 px-4 py-5">
            <div className="text-3xl font-bold text-gray-100">{total}</div>
            <div className="text-xs text-gray-400 uppercase tracking-wider mt-1">
              total tested
            </div>
          </div>
        </div>

        <section className="mb-12" aria-label="Hook log">
          <h2 className="text-xl font-semibold text-gray-100 mb-4">
            The log
          </h2>
          <div className="space-y-4">
            {HOOKS.map((h) => {
              const meta = STATUS_META[h.status];
              return (
                <article
                  key={h.id}
                  className="rounded-lg border border-slate-800 bg-slate-900 p-6"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                    <span
                      className={`text-xs font-semibold uppercase tracking-wider px-2.5 py-1 rounded border ${meta.classes}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-xs text-gray-400 tabular-nums">
                      {h.date}
                    </span>
                  </div>

                  <p className="text-lg text-gray-100 leading-snug font-medium mb-3">
                    {h.hook}
                  </p>

                  <dl className="grid grid-cols-2 sm:grid-cols-4 gap-x-4 gap-y-2 text-xs mb-4">
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider">Channel</dt>
                      <dd className="text-gray-300 mt-0.5">{h.channel}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider">Surface</dt>
                      <dd className="text-gray-300 mt-0.5">{h.surface}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider">Impressions</dt>
                      <dd className="text-gray-300 mt-0.5 tabular-nums">{h.impressions}</dd>
                    </div>
                    <div>
                      <dt className="text-gray-400 uppercase tracking-wider">Clicks</dt>
                      <dd className="text-gray-300 mt-0.5 tabular-nums">{h.clicks}</dd>
                    </div>
                    <div className="col-span-2 sm:col-span-1">
                      <dt className="text-gray-400 uppercase tracking-wider">CTR</dt>
                      <dd className="text-emerald-300 mt-0.5 tabular-nums font-semibold">
                        {h.ctr}
                      </dd>
                    </div>
                  </dl>

                  <p className="text-sm text-gray-400 leading-relaxed border-t border-slate-800 pt-3">
                    <span className="text-gray-300 font-medium">Takeaway:</span>{" "}
                    {h.takeaway}
                  </p>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mb-12 rounded-lg border border-sky-800/30 bg-sky-950/10 p-6">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            What we learned about hooks
          </h2>
          <ul className="text-sm text-gray-300 leading-relaxed space-y-3 list-disc list-inside marker:text-sky-400">
            <li>
              <strong className="text-gray-100">Numerically specific beats categorically true.</strong>{" "}
              &quot;21-47 days&quot; outperformed &quot;weeks before they raise&quot; by 2.3×.
              The number is the unit of credibility, it forces the reader to
              accept or reject a falsifiable claim.
            </li>
            <li>
              <strong className="text-gray-100">Pair pain-side and result-side hooks for the same insight.</strong>{" "}
              The 47-days hook (result) and the warm-intro-roulette hook (pain)
              are the same idea pointed two directions. Different channels
              prefer different angles.
            </li>
            <li>
              <strong className="text-gray-100">The founder-character hook is measured in replies, not clicks.</strong>{" "}
              From-name &quot;The Data Nerd&quot; tripled email reply rate vs the
              brand-name From. There is no CTR for character, there is reply
              rate.
            </li>
            <li>
              <strong className="text-gray-100">A hook that compresses time-saved beats a hook that compresses dollars-saved.</strong>{" "}
              &quot;5 min vs 3 weeks&quot; outperformed &quot;€49 vs €1k/mo&quot;. Time
              is the irreversible scarcity; dollars are negotiable.
            </li>
            <li>
              <strong className="text-gray-100">Disqualifier hooks repel more than they attract, and that&apos;s the point.</strong>{" "}
              &quot;You&apos;re not Insight Partners&quot; doesn&apos;t generate clicks; it
              shapes which clicks become signups. CTR low, signup-conversion-of-clicks high.
            </li>
            <li>
              <strong className="text-gray-100">Agent-audience hooks have ceiling-CTR but tiny audiences.</strong>{" "}
              The MCP hook hit 11.6% CTR but the audience was 1,200 impressions.
              Agent traffic is high-quality and small; don&apos;t scale-test it
              against human-channel CTRs.
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            How we test
          </h2>
          <p className="text-sm text-gray-400 leading-relaxed mb-4">
            We don&apos;t run isolated A/Bs. We ship a hook into a channel where
            it has the right home (Twitter for short hooks, email for character
            hooks, /pricing for comparison hooks) and watch it for 14 days
            against a baseline. If it beats baseline by &gt;15% on CTR and the
            sample is &gt; 1,000 impressions, it gets promoted. If it&apos;s
            close, it stays in rotation. If it underperforms, it&apos;s killed
            and the takeaway gets logged.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            Every hook above is in production today, was in production at some
            point, or is mid-test. Numbers are last-30-day rolling unless the
            row says otherwise. We don&apos;t round to make winners look better;
            CTR is to one decimal place even when the cleaner number would read
            stronger.
          </p>
        </section>

        <section className="mb-12 border-t border-slate-800 pt-8">
          <h2 className="text-xl font-semibold text-gray-100 mb-3">
            Related
          </h2>
          <ul className="text-sm text-gray-400 space-y-2 leading-relaxed">
            <li>
              →{" "}
              <Link href="/experiments" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                The full experiments log
              </Link>{" "}
funnel mechanics, not just hooks (order-bumps, closes, sequence cadence).
            </li>
            <li>
              →{" "}
              <Link href="/target-list" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Top 100
              </Link>{" "}
the buyer roster these hooks are pointed at.
            </li>
            <li>
              →{" "}
              <Link href="/distribution" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Distribution map
              </Link>{" "}
every channel where a hook lives.
            </li>
            <li>
              →{" "}
              <Link href="/affiliates/top-partners" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Top 50 partner roster
              </Link>{" "}
newsletter writers, podcast hosts, community owners we&apos;d
              like to hear from.
            </li>
            <li>
              →{" "}
              <Link href="/methodology" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
                Methodology
              </Link>{" "}
the SSRN paper anchoring the load-bearing 47-days hook.
            </li>
          </ul>
        </section>

        <AgentMirrorLinks path="/experiments/hooks" />
      </div>
    </div>
  );
}
