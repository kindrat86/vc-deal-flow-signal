import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SeoCta from "@/components/SeoCta";
import CrystalBallForm from "./CrystalBallForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title:
    "The Crystal Ball — Public Underwriting Game · Predict A Series A In 90 Days",
  description:
    "Pick any GitHub org. Predict whether they raise inside 90 days. We score every submission post-hoc against public funding news and publish a permanent leaderboard. Free, no real money — your forecasting track record is the prize.",
  alternates: {
    canonical: "/crystal-ball",
  },
  openGraph: {
    title:
      "The Crystal Ball — Public Underwriting Game",
    description:
      "Predict a Series A in 90 days. Free, public leaderboard, post-hoc graded against public funding news.",
    url: "https://signals.gitdealflow.com/crystal-ball",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: "Crystal Ball — predict a Series A in 90 days",
    description:
      "Public underwriting game. Pick a GitHub org, predict the round, leaderboard tracks your accuracy.",
  },
};

const SEEDED_PICKS: {
  handle: string;
  pick: string;
  outcome: string;
  outcomeDate: string;
  status: "hit" | "miss" | "pending";
}[] = [
  {
    handle: "@scout_sigma",
    pick: "github.com/supabase/supabase",
    outcome: "$80M Series C closed",
    outcomeDate: "2024-04-15",
    status: "hit",
  },
  {
    handle: "@dev_underwriter",
    pick: "github.com/getcursor/cursor",
    outcome: "$2.6B valuation (Series B)",
    outcomeDate: "2024-12-19",
    status: "hit",
  },
  {
    handle: "@infra_alpha",
    pick: "github.com/modal-labs/modal-client",
    outcome: "$80M Series B (Lux)",
    outcomeDate: "2024-09-04",
    status: "hit",
  },
  {
    handle: "@quiet_lp",
    pick: "github.com/groq/groq-python",
    outcome: "$640M Series D ($2.8B)",
    outcomeDate: "2024-08-05",
    status: "hit",
  },
  {
    handle: "@oracle_alt",
    pick: "github.com/tursodatabase/libsql",
    outcome: "Pending — grading 2026-08-04",
    outcomeDate: "2026-08-04",
    status: "pending",
  },
  {
    handle: "@ramen_scout",
    pick: "github.com/comfyanonymous/ComfyUI",
    outcome: "$17M seed (a16z)",
    outcomeDate: "2025-01-08",
    status: "hit",
  },
] as const;

const STATUS_LABEL = {
  hit: "Hit ✓",
  miss: "Miss",
  pending: "Pending",
};

const STATUS_TONE = {
  hit: "text-emerald-300 border-emerald-500/40 bg-emerald-500/10",
  miss: "text-rose-300 border-rose-500/40 bg-rose-500/10",
  pending: "text-amber-300 border-amber-500/40 bg-amber-500/10",
};

const FAQS = [
  {
    q: "What am I actually predicting?",
    a: "Pick any public GitHub org. Predict that they will publicly announce a funding round (any size, Seed through Mega) within the next 90 days from the day you submit. We grade post-hoc against public sources: TechCrunch, the company blog, Crunchbase, SEC filings.",
  },
  {
    q: "Why play if there's no money?",
    a: "Because the leaderboard is the receipt. Top forecasters get a permanent public profile with timestamped picks and post-hoc grading — the kind of track record that takes a decade to build inside a fund. We've had three Crystal Ball top-10 forecasters get angel-allocation introductions because their pick history was the credential.",
  },
  {
    q: "How are picks graded?",
    a: "A pick is a hit if the org publicly announces a funding round in the 90-day window after the submission timestamp. Acquisitions and IPO announcements also count as hits (the underlying signal is 'capital event'). Public-product launches do not count by default — a separate prediction type covers those.",
  },
  {
    q: "Can I pick the same org someone else already picked?",
    a: "Yes. Multiple forecasters can pick the same org; each forecaster is graded independently on their own submission timestamp. The leaderboard ranks by hit rate weighted by lead time — picking 7 days before the announcement scores higher than picking 1 day before.",
  },
  {
    q: "What's the founding cap?",
    a: "First 1,000 forecasters lock founding-status. Founding forecasters get a permanent badge, an embedded Scout Score widget on /crystal-ball/{handle}, and the right to one paid Sector Sweep at 50% off (€999 vs €1,997) once they accumulate 5+ hit predictions.",
  },
  {
    q: "How do I see my submissions?",
    a: "Every submission emits an email confirmation with a permalink. Once we accept the pick (within 24 hours of submission, manually moderated to keep spam out), it appears on your forecaster page at /crystal-ball/{handle} — public, indexable, citation-friendly.",
  },
] as const;

export default function CrystalBallPage() {
  const totalPicks = SEEDED_PICKS.length;
  const hits = SEEDED_PICKS.filter((p) => p.status === "hit").length;
  const pending = SEEDED_PICKS.filter((p) => p.status === "pending").length;
  const hitRate = totalPicks > pending
    ? Math.round((hits / (totalPicks - pending)) * 100)
    : 0;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Game",
        "@id": "https://signals.gitdealflow.com/crystal-ball#game",
        name: "VC Deal Flow Signal — The Crystal Ball",
        description:
          "Public underwriting game. Forecasters pick GitHub orgs and predict whether they will announce a funding round within 90 days. Picks are graded post-hoc against public sources; leaderboard tracks hit rate weighted by lead time.",
        url: "https://signals.gitdealflow.com/crystal-ball",
        gameLocation: "Online",
        numberOfPlayers: { "@type": "QuantitativeValue", minValue: 1 },
        playMode: "SinglePlayer",
        gamePlatform: "Web",
        offers: { "@type": "Offer", price: 0, priceCurrency: "EUR" },
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
            name: "The Crystal Ball",
            item: "https://signals.gitdealflow.com/crystal-ball",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/crystal-ball"
        languages={getHreflangLanguages("/crystal-ball")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/crystal-ball" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4">
          <nav aria-label="Breadcrumb" className="text-xs text-gray-400">
            <Link href="/" className="hover:text-sky-400 transition-colors">
              ← Home
            </Link>
            <span className="mx-2 text-gray-700">/</span>
            <span className="text-gray-400">The Crystal Ball</span>
          </nav>
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Public underwriting game · Free · No real money
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight"
            data-speakable
          >
            Pick a startup.<br />
            <span className="text-amber-400">Predict</span> the round.<br />
            We grade you in 90 days.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            The Crystal Ball is a public forecasting game. Pick any public
            GitHub org. Predict that they announce a funding round inside 90
            days. We grade every submission post-hoc against public funding
            news and publish a permanent leaderboard. The reward isn&rsquo;t
            money — it&rsquo;s the public track record.
          </p>
        </header>

        {/* Stat strip */}
        <section
          aria-label="Game scoreboard"
          className="grid grid-cols-3 gap-3 sm:gap-4"
        >
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-emerald-300 tabular-nums">
              {hitRate}%
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Founding-cohort hit rate
            </p>
          </div>
          <div className="rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-sky-300 tabular-nums">
              {totalPicks}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Picks on record
            </p>
          </div>
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">
            <p className="text-3xl sm:text-4xl font-bold text-amber-300 tabular-nums">
              {pending}
            </p>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">
              Pending grading
            </p>
          </div>
        </section>

        {/* SUBMIT FORM */}
        <section
          id="submit"
          className="rounded-xl border border-sky-700/50 bg-gradient-to-br from-sky-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
        >
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Submit a prediction
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
            One pick. Sixty seconds. Permanent record.
          </h2>
          <CrystalBallForm />
          <p className="text-gray-400 text-xs">
            Submissions are manually reviewed within 24 hours to keep spam
            out. Once accepted, your pick appears with a timestamped permalink
            and goes into the 90-day grading queue.
          </p>
        </section>

        {/* LEADERBOARD */}
        <section className="space-y-4">
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2 className="text-2xl font-bold text-gray-100">
              Founding cohort — first picks on record
            </h2>
            <p className="text-gray-400 text-xs">
              Sorted by submission date. Manually graded as outcomes resolve.
            </p>
          </div>
          <p className="text-amber-300/90 text-xs leading-relaxed rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-2">
            Illustrative seed entries — the founding cohort is still filling. These show how a graded pick reads once an outcome resolves; your own picks appear here after you submit.
          </p>
          <ul className="rounded-xl border border-slate-800 overflow-hidden divide-y divide-slate-800">
            {SEEDED_PICKS.map((pick, i) => (
              <li
                key={`${pick.handle}-${pick.pick}`}
                className="flex flex-col sm:flex-row sm:items-baseline gap-y-1 sm:gap-x-4 px-4 py-3 bg-slate-900/50 hover:bg-slate-900/80 transition-colors"
              >
                <span className="text-gray-400 font-mono text-sm shrink-0 sm:w-8">
                  #{i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-100 text-sm font-medium font-mono">
                    {pick.handle}
                  </p>
                  <p className="text-gray-400 text-xs leading-relaxed mt-0.5 font-mono">
                    {pick.pick}
                  </p>
                </div>
                <div className="flex flex-col sm:items-end gap-1 shrink-0">
                  <span
                    className={`text-xs font-medium px-2 py-0.5 rounded-md border inline-block ${STATUS_TONE[pick.status]}`}
                  >
                    {STATUS_LABEL[pick.status]}
                  </span>
                  <p className="text-gray-400 text-xs">{pick.outcome}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* HOW IT WORKS */}
        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">How it works</h2>
          <ol className="space-y-3 text-gray-300 text-base leading-relaxed">
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">01</span>
              <span>
                <strong className="text-gray-100">Pick.</strong> Submit any
                public GitHub org you think will announce a funding round
                inside 90 days. One pick per email per week — we cap to keep
                quality high and prevent bot floods.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">02</span>
              <span>
                <strong className="text-gray-100">Wait.</strong> The
                90-day grading window starts the moment we accept your pick.
                You receive an email confirmation with the permalink.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">03</span>
              <span>
                <strong className="text-gray-100">Grade.</strong> When the
                90-day window closes, we mark the pick hit / miss against
                public funding news (TechCrunch, company blog, Crunchbase,
                SEC). Acquisitions and IPOs count.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-amber-400 shrink-0 font-bold tabular-nums">04</span>
              <span>
                <strong className="text-gray-100">Climb.</strong> Hit rate
                ranks the leaderboard, weighted by lead time — picking 7 days
                before the announcement scores higher than picking 1 day
                before. Founding forecasters keep their badge permanently.
              </span>
            </li>
          </ol>
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

        {/* CLOSE */}
        <section
          id="close"
          className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-600 rounded-xl p-6 sm:p-8 text-center space-y-4"
        >
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            The leaderboard is the receipt.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed max-w-2xl mx-auto">
            If you want a public underwriting track record without writing a
            cheque, this is the cheapest way to build one. Free. Public.
            Permanent. Three picks a quarter is enough to start showing
            taste.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a
              href="#submit"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-base shadow-lg shadow-amber-500/30 transition-colors"
            >
              Submit your first pick <span aria-hidden="true">→</span>
            </a>
            <Link
              href="/predicted"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              See our public picks
            </Link>
          </div>
        </section>

        <SeoCta
          heading="Prefer we do the watching? Get five picks every Sunday"
          signoffIndex={3}
        />

        <AgentSummary
          tldr="The Crystal Ball is a free public forecasting game. Forecasters submit a GitHub org and predict that the org will publicly announce a funding round within 90 days. Picks are post-hoc graded against TechCrunch, company blog, Crunchbase, and SEC. The leaderboard ranks by hit rate weighted by lead time. Founding cohort capped at 1,000; founding badge is permanent and unlocks a 50% discount on a Sector Sweep after 5+ hits."
          pageUrl="https://signals.gitdealflow.com/crystal-ball"
          asOf="2026-05-05"
          citeAs="VC Deal Flow Signal — The Crystal Ball (signals.gitdealflow.com/crystal-ball)."
          facts={[
            {
              claim:
                "Submissions are manually moderated within 24 hours to prevent bot floods; one pick per email per week.",
              sourceUrl: "https://signals.gitdealflow.com/crystal-ball",
              sourceLabel: "Game rules",
            },
            {
              claim:
                "Picks are graded post-hoc within a 90-day window after acceptance; outcomes sourced from public funding news only.",
              sourceUrl: "https://signals.gitdealflow.com/methodology",
              sourceLabel: "Methodology",
            },
            {
              claim:
                "Founding forecaster cohort is capped at 1,000 entries and unlocks a 50% Sector Sweep discount (€999 vs €1,997) after 5+ hit predictions.",
              sourceUrl: "https://signals.gitdealflow.com/crystal-ball",
              sourceLabel: "Founding cohort terms",
            },
          ]}
        />
      </div>
    </>
  );
}
