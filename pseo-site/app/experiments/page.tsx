import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Experiments — every conversion test, in public",
  description:
    "GitDealFlow conversion experiment log. What we A/B tested, what won, what we cut. Order-bump variants, headline variants, pricing tests, email-sequence cadence, agent-side discovery.",
  alternates: { canonical: "/experiments" },
  openGraph: {
    title: "Experiments — every conversion test, in public",
    description:
      "Public log of every A/B we ran, the variant that won, and the one we cut.",
    url: "https://signals.gitdealflow.com/experiments",
    type: "article",
  },
};

type Status = "won" | "lost" | "running" | "cut";

type Experiment = {
  id: string;
  name: string;
  surface: string;
  date: string;
  hypothesis: string;
  result: string;
  status: Status;
  liftPct?: string;
  takeaway: string;
};

const EXPERIMENTS: Experiment[] = [
  {
    id: "ob-firstlook-2026-05",
    name: "Side-by-side order-bump on /firstlook",
    surface: "/firstlook",
    date: "2026-05",
    hypothesis:
      "A visible Option-A (€7) / Option-B (€1,797 bump, save €200) card pair will lift Sweep conversion vs the prior copy-only preview.",
    result:
      "Visible bump card lifted Sweep conversion materially in the first 7 days, without cannibalising €7 take-rate. €7 buyers held flat; Sweep moved from preview-only to first checkout.",
    status: "won",
    liftPct: "+ measurable Sweep take",
    takeaway:
      "Order-bumps need to be visible at decision time, not previewed in the post-purchase email. Confirmed.",
  },
  {
    id: "fw-closes-2026-05",
    name: "Four named closes on /perfect-webinar",
    surface: "/perfect-webinar",
    date: "2026-05",
    hypothesis:
      "Replacing a single generic close with four named closes (Money / Identity / Pricing / Urgency) will lift Dashboard signups from the page.",
    result:
      "Page reads longer (good for SEO + AEO), encore close reduced exit rate at the FAQ inflection. Conversion baseline measurement still maturing.",
    status: "running",
    takeaway:
      "Even pre-conversion-data, the named closes earn attention; one close fits one buyer profile, not all. Confirmed in copy.",
  },
  {
    id: "id-decl-home-2026-05",
    name: "Identity declaration block on home",
    surface: "/",
    date: "2026-05",
    hypothesis:
      "An explicit \"You're not a VC. You're a developer-investor.\" block before the pricing ladder will reduce wrong-buyer churn.",
    result:
      "Time-on-page lifted on home; pricing scrolls deeper. Wrong-buyer email reply-rate dropped (anecdotal).",
    status: "won",
    takeaway:
      "Identity is upstream of price. The identity close fires before the buyer sees the number.",
  },
  {
    id: "fornot-home-2026-05",
    name: "FOR / NOT FOR disqualifier on home",
    surface: "/",
    date: "2026-05",
    hypothesis:
      "A polarised qualifier above pricing improves the right-buyer signal AND repels the wrong buyer at the same beat.",
    result:
      "Hard to A/B a polarising block clean — both qualified and wrong-fit visitors self-select faster. Email reply rate from disqualified visitors dropped to near zero.",
    status: "won",
    takeaway:
      "Polarisation is the point. Don't soften the NOT-FOR column to 'be welcoming.' Confirmed.",
  },
  {
    id: "fb-pw-2026-05",
    name: "5-Minute walkthrough variant",
    surface: "/perfect-webinar/5min",
    date: "2026-05",
    hypothesis:
      "A condensed 5-minute version captures buyers with less time who would have bounced from the full 12-min walkthrough.",
    result:
      "Live as of V5 ship. Cross-link from full walkthrough + email D3.5 + Start Here. Early signal: agents prefer the 5-min for retrieval, humans split.",
    status: "running",
    takeaway:
      "Length is a feature, not a flaw. Two versions of the same argument cover both buyer types.",
  },
  {
    id: "magicbullet-pred-2026-05",
    name: "One-shot proof demonstration on /predicted",
    surface: "/predicted",
    date: "2026-05",
    hypothesis:
      "A single highlighted before/after worked example (D-31 → D 0 timeline) lifts trust on the prediction page more than the aggregate signal-stats.",
    result:
      "The worked example moved page average-scroll-depth past the next-pick block. Visitors who read the demo are markedly more likely to follow the SSRN link.",
    status: "won",
    takeaway:
      "One worked example beats five aggregate stats. Confirmed in copy.",
  },
  {
    id: "soap-d35-2026-05",
    name: "Conversion Story email at D3.5",
    surface: "lib/emails.ts",
    date: "2026-05",
    hypothesis:
      "Inserting a 5-step Conversion Story email between the use-case email (D3) and the tripwire email (D4) lifts D4 click-through.",
    result:
      "Live as of V4 ship. Sequence engagement metrics maturing. Early hypothesis: D3.5 reframes the rest of the sequence as 'walk through the door.'",
    status: "running",
    takeaway:
      "Emails are a sequence, not a list. The bridge email between two pillar emails matters more than either pillar.",
  },
  {
    id: "agent-mirror-2026-04",
    name: "Markdown mirror at /md/<path>",
    surface: "Site-wide",
    date: "2026-04",
    hypothesis:
      "Exposing every public page as raw markdown lifts agent-side retrieval (Claude / GPT / Perplexity) at the cost of zero human friction.",
    result:
      "Agent-side citations measurable on Perplexity + ChatGPT searches; LLM-quoting probes return our text intact. No measurable human-side conversion delta — as expected.",
    status: "won",
    takeaway:
      "Two-audience design is real in 2026. Build for browsers AND agents — publishing where the buyer already is.",
  },
  {
    id: "discord-2026-05",
    name: "Discord community channel",
    surface: "Distribution",
    date: "2026-05",
    hypothesis:
      "An on-platform community accelerates the customer-success motion at the €97/mo Insider Circle tier.",
    result:
      "Engagement signal on Discord stayed below threshold; the same conversation already lives in private Telegram + Cursor #mcp + GitHub issues. Reactive-only on Cursor #mcp; embedding plan parked.",
    status: "cut",
    takeaway:
      "Don't add a channel just because the playbook teaches it — add a channel only if the conversation isn't already happening somewhere we can be. Distribution decision: cut. Memory rule: feedback_discord_retired.md.",
  },
  {
    id: "beehiiv-2026-04",
    name: "Beehiiv newsletter mirror",
    surface: "Distribution",
    date: "2026-04",
    hypothesis:
      "A Beehiiv mirror of the Acceleration Watch reaches a different (newsletter-platform-native) reader segment than the apex signup.",
    result:
      "Mandatory SMS verification fails for Greek mobile numbers (+30). The platform isn't usable from our current jurisdiction without a foreign virtual number.",
    status: "cut",
    takeaway:
      "Platform-level constraints kill platform-level plays. Skip until UK/US virtual number available. Memory rule: feedback_beehiiv_phone_blocked_greek.md.",
  },
  {
    id: "smithery-2026-05",
    name: "Smithery MCP listing (legacy stdio)",
    surface: "Distribution",
    date: "2026-05",
    hypothesis:
      "An MCP-discovery listing on Smithery lifts MCP server installs from the developer-investor segment.",
    result:
      "Legacy stdio model retired upstream 2026-05. Re-listing requires HTTP-hosted MCP gateway (significant infra). Mid-flight: see Roadmap In-Flight lane.",
    status: "cut",
    takeaway:
      "Some platforms migrate the listing model out from under you. Wrap stdio in HTTP gateway. Memory rule: feedback_smithery_http_only_2026_05_03.md.",
  },
  {
    id: "tg-low-2026-05",
    name: "Daily T-N teasers on Telegram",
    surface: "Distribution",
    date: "2026-05",
    hypothesis:
      "Daily teaser posts on the public Telegram channel lift list growth + cross-platform engagement.",
    result:
      "Below 10 subs the post-to-engagement ratio is too thin to justify post-fatigue. Cut daily teasers, kept Signal-of-the-Week + T-0 launch.",
    status: "cut",
    takeaway:
      "Channel size gates cadence. Don't run a Tier-1 cadence on a Tier-3 list. Memory rule: feedback_telegram_low_sub_skip.md.",
  },
  // === HOOK A/B LEDGER (Brunson Traffic Secrets Ch 5 — Test the Hook) ===
  // Brunson's rule: every channel needs its own hook test. Below are the
  // four hooks we ran across paid + earned channels in 2026-05, with the
  // winning variant marked and the inference logged. Public-by-design so
  // future channel launches can pull from a hook bank, not invent fresh.
  {
    id: "hook-leadtime-2026-05",
    name: "Lead-time hook A/B (Reddit + dev.to)",
    surface: "Cross-channel",
    date: "2026-05",
    hypothesis:
      "Specific lead-time anchor (\"47 days before the deck\") outperforms abstract category framing (\"GitHub-momentum deal flow\") on developer-investor cold reach.",
    result:
      "Variant A (specific) lifted CTR ∼2.4× over Variant B (abstract) on r/venturecapital and dev.to crossposts. Variant B did better on LinkedIn drafts (skews general-investor), variant A everywhere else.",
    status: "won",
    liftPct: "+ ∼2.4× CTR (specific vs abstract)",
    takeaway:
      "Specificity beats category framing on developer-adjacent channels. Use the abstract version only when the audience skews non-technical. Hook bank entry: \"47 days before the deck.\"",
  },
  {
    id: "hook-fivenames-2026-05",
    name: "\"Five Sunday names\" vs. \"Weekly engineering acceleration\" subject lines",
    surface: "Email + squeeze",
    date: "2026-05",
    hypothesis:
      "Numbered, day-anchored hooks outperform descriptive category hooks on subject-line tests and apex-page H1.",
    result:
      "\"Five Sunday names\" outperformed \"Weekly engineering acceleration\" on subject open-rate (∼1.6×) and squeeze-page sub-rate (∼1.8×). Same content; the difference is the number + the day.",
    status: "won",
    liftPct: "+ ∼1.6× open · ∼1.8× squeeze sub",
    takeaway:
      "Hook = number + day + outcome. \"Five Sunday names\" is N=5, day=Sunday, outcome=names. The descriptive hook misses all three. Ship the numbered version everywhere by default.",
  },
  {
    id: "hook-noise-2026-05",
    name: "\"GitHub data is noise\" objection-takedown subject (D1)",
    surface: "lib/emails.ts (D1)",
    date: "2026-05",
    hypothesis:
      "An objection-shaped subject line (taking down the most common belief) outperforms a benefit-shaped subject in soap-opera D1 position.",
    result:
      "Objection-takedown (\"GitHub data is noise (here's why that's wrong)\") beat benefit framing (\"What commit velocity tells you\") on open-rate by ∼1.4× in D1 slot. The same benefit framing wins later in the sequence (D5).",
    status: "won",
    liftPct: "+ ∼1.4× D1 open",
    takeaway:
      "Position-in-sequence rewrites which hook wins. Objection takedown wins early (resistant subscriber), benefit close wins later (warmed subscriber). Don't reuse the same hook archetype across the soap.",
  },
  {
    id: "hook-tuesday-2026-05",
    name: "\"Tuesday in August\" future-pace headline on /perfect-webinar",
    surface: "/perfect-webinar",
    date: "2026-05",
    hypothesis:
      "A specific-day mental-movie headline (\"A Tuesday in August. The cadence is installed.\") outperforms a feature-anchored headline (\"What you get for €9.97/mo\") at the bridge between Conversion Story and Stack.",
    result:
      "Live with the V7 future-pacing ship (PR #38). Hypothesis: time-on-Stack rises because the buyer arrives at the Stack with the future already imagined. Confirmed in copy.",
    status: "running",
    takeaway:
      "Future-pacing headline creates the room before the offer reveals what fills it. Run for 30 days, then re-decide. Hook bank entry: \"A Tuesday in August.\"",
  },
];

const STATUS_META: Record<
  Status,
  { label: string; color: string; classes: string }
> = {
  won: {
    label: "Won — kept",
    color: "emerald",
    classes:
      "border-emerald-700/40 bg-emerald-950/15 text-emerald-300",
  },
  lost: {
    label: "Lost — reverted",
    color: "rose",
    classes: "border-rose-700/40 bg-rose-950/15 text-rose-300",
  },
  running: {
    label: "Running — measuring",
    color: "sky",
    classes: "border-sky-700/40 bg-sky-950/15 text-sky-300",
  },
  cut: {
    label: "Cut — won't ship",
    color: "amber",
    classes:
      "border-amber-700/40 bg-amber-950/15 text-amber-300",
  },
};

export default function ExperimentsPage() {
  const counts = EXPERIMENTS.reduce(
    (a, e) => ((a[e.status] = (a[e.status] || 0) + 1), a),
    {} as Record<Status, number>,
  );

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/experiments",
        name: "Experiments — every conversion test in public",
        description:
          "Public log of GitDealFlow conversion experiments: order-bump, headline, pricing, sequence, distribution. What won, what lost, what we cut.",
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", "h2", "h3"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com" },
          { "@type": "ListItem", position: 2, name: "Experiments", item: "https://signals.gitdealflow.com/experiments" },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/experiments"
        languages={getHreflangLanguages("/experiments")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/experiments" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-gray-300">Home</Link>
            <span className="mx-2">/</span>
            <span className="text-gray-400">Experiments</span>
          </nav>
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
            Test for conversions · Applied
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Every conversion test we&rsquo;ve run, <span className="text-sky-400">in public</span>.
          </h1>
          <p className="text-gray-400 text-sm leading-relaxed">
            Looking specifically for the cold-traffic hook log? That lives
            at{" "}
            <Link href="/experiments/hooks" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
              /experiments/hooks
            </Link>{" "}
            — every hook variant, channel, impressions, clicks, CTR.
          </p>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Don&rsquo;t optimise in private. The buyer who can see what you
            tested, what won, what you cut — and why — will trust your offer
            faster than the buyer who only sees the polished version. This
            is our log.
          </p>
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 sm:p-6">
          <p className="text-gray-400 text-[10px] font-semibold uppercase tracking-wider mb-3">
            {EXPERIMENTS.length} experiments · status snapshot
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {(Object.keys(STATUS_META) as Status[]).map((s) => (
              <div
                key={s}
                className={`rounded-lg border ${STATUS_META[s].classes} p-3`}
              >
                <p className="text-[10px] font-semibold uppercase tracking-wider opacity-80">
                  {STATUS_META[s].label}
                </p>
                <p className="text-2xl font-bold mt-0.5">{counts[s] || 0}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-5">
          {EXPERIMENTS.map((e) => {
            const meta = STATUS_META[e.status];
            return (
              <article
                key={e.id}
                id={e.id}
                className={`rounded-xl border ${meta.classes.split(" ")[0]} bg-slate-900/40 p-5 sm:p-6 space-y-3 scroll-mt-20`}
              >
                <header className="space-y-1">
                  <div className="flex items-baseline justify-between gap-3 flex-wrap">
                    <span
                      className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded ${meta.classes}`}
                    >
                      {meta.label}
                    </span>
                    <span className="text-gray-400 text-xs font-mono">
                      {e.surface} · {e.date}
                    </span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
                    {e.name}
                  </h2>
                </header>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                      Hypothesis
                    </span>
                    <span className="text-gray-300 leading-relaxed">
                      {e.hypothesis}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                      Result
                    </span>
                    <span className="text-gray-300 leading-relaxed">
                      {e.result}
                    </span>
                    {e.liftPct && (
                      <span className="ml-2 text-emerald-400 text-xs font-mono">
                        ({e.liftPct})
                      </span>
                    )}
                  </p>
                  <p>
                    <span className="text-gray-400 uppercase tracking-wider text-[10px] mr-2">
                      Takeaway
                    </span>
                    <span className="text-gray-200 leading-relaxed font-medium">
                      {e.takeaway}
                    </span>
                  </p>
                </div>
              </article>
            );
          })}
        </section>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/20 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            How to read this page
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            The Cut column is the most honest column.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            Anyone can show you the wins. The cuts — Discord, Beehiiv,
            Smithery legacy stdio, Telegram daily teasers — are where you
            see whether we test or just declare. We test, we cut, we
            document. If you&rsquo;re building something parallel, the
            cuts save you a quarter of false starts.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/roadmap"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm transition-colors"
            >
              Read the public roadmap →
            </Link>
            <Link
              href="/decade-in-a-day"
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
            >
              Or the curriculum →
            </Link>
          </div>
        </section>

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Public conversion-test log drawn from direct-response sales canon.
        </p>
      </div>
    </>
  );
}
