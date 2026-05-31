import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

const STRIPE_TEARDOWN_LINK =
  process.env.NEXT_PUBLIC_STRIPE_TEARDOWN_LINK ||
  "https://buy.stripe.com/bJe5kC48H2d2cEKg6s0x209";

const PAGE_URL = "https://signals.gitdealflow.com/tweet-teardown";
const PRICE_EUR = 1;

export const metadata: Metadata = {
  title: "Tweet Teardown — €1, replied in 4 hours",
  description:
    "Pay €1. We extract the GitHub org named or implied in any tweet, run the 7-signal Scout methodology, and reply with a 3-paragraph teardown plus the live Scout Score card. Manual reply within 4 hours, refund if no match.",
  alternates: { canonical: "/tweet-teardown" },
  openGraph: {
    title: "Tweet Teardown — €1, replied in 4 hours",
    description:
      "A €1 micro-tripwire. Submit any tweet about a startup or engineering team; we reply with the 7-signal teardown of the underlying GitHub org within 4 hours. Refund if no match.",
    url: PAGE_URL,
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Tweet Teardown — €1",
    description:
      "Drop us any tweet praising a startup. €1. We reply with the receipts.",
  },
};

const STACK = [
  {
    n: "01",
    h: "The org match",
    p: "We read the tweet, identify the company / engineering team being discussed, and confirm the GitHub org. If the tweet is too vague to match, refund — no questions, no judgment.",
  },
  {
    n: "02",
    h: "The Scout Score card",
    p: "Live composite of seven signals (commit velocity, contributor influx, infra buildout, star detachment, issue cadence, dependency adoption, founding-team visibility) over a 14-day window. Same card our €9.97/mo subscribers see, frozen for the day you bought.",
  },
  {
    n: "03",
    h: "The 3-paragraph written teardown",
    p: "What the tweet's claim is, what the data actually shows, and where the gap is. No filler. No hedging. Written by a human, not a model — it carries our name.",
  },
  {
    n: "04",
    h: "The replication breadcrumb",
    p: "Every claim links to a public GitHub URL or SSRN reference. You can re-derive the score in 10 minutes if you want to. The methodology is open-source CC BY 4.0 either way.",
  },
  {
    n: "05",
    h: "The 4-hour reply window",
    p: "Drop the tweet at checkout, get the teardown back in your inbox within four business hours. Slower hours of the week (Friday evening UTC, weekends) may push to next-business-morning — never longer.",
  },
];

const PROOF = [
  {
    label: "Methodology",
    value: "SSRN paper, n=219",
    href: "https://ssrn.com/abstract=6606558",
  },
  {
    label: "Scout panel",
    value: "4,200 venture-backed orgs",
    href: "https://signals.gitdealflow.com/methodology",
  },
  {
    label: "Free signal digest",
    value: "Every Sunday",
    href: "https://signals.gitdealflow.com/#signup",
  },
];

const FAQ = [
  {
    q: "What's a teardown actually look like?",
    a: "Three short paragraphs of plain text. Paragraph one names the org and shows the live Scout Score. Paragraph two takes the tweet's specific claim (\"shipping fast,\" \"crushing distribution,\" \"team of legends\") and grades it against the seven-signal data. Paragraph three flags the highest-leverage thing to verify next — usually a public GitHub URL or a recent commit pattern.",
  },
  {
    q: "Why €1 specifically?",
    a: "Because the goal isn't revenue. €1 is the smallest amount Stripe will charge a card for. Payment friction is the filter. Anyone who pays €1 has signaled real intent — that's the audience we want to deliver to.",
  },
  {
    q: "What if the tweet is about a private repo or an unfunded side project?",
    a: "Refund. We refund any teardown where the org isn't traceable to a real public GitHub presence. We have a small backlog buffer to absorb the occasional vague tweet, but at €1 we'd rather refund than guess.",
  },
  {
    q: "Can I send multiple tweets?",
    a: "One tweet per €1 purchase. If you want a sweep of a sector or a Dream-100 batch, that's the €1,997 Sector Sweep — a different product entirely.",
  },
  {
    q: "Will the teardown be public or private?",
    a: "Private — sent only to the email used at checkout. We never publish a teardown without explicit permission. The aggregate Scout Score data IS public on the Dashboard, but the written teardown stays yours.",
  },
];

export default function TweetTeardownPage() {
  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    "@id": `${PAGE_URL}#product`,
    name: "GitDealFlow Tweet Teardown",
    description:
      "A €1 micro-tripwire. Submit any tweet about a startup or engineering team; we reply with a 7-signal teardown of the underlying GitHub org within 4 hours.",
    brand: { "@type": "Brand", name: "GitDealFlow" },
    offers: {
      "@type": "Offer",
      price: String(PRICE_EUR),
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      url: STRIPE_TEARDOWN_LINK,
      priceValidUntil: "2026-12-31",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: "4.9",
      reviewCount: "12",
      bestRating: "5",
      worstRating: "1",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://signals.gitdealflow.com/" },
      { "@type": "ListItem", position: 2, name: "Funnels", item: "https://signals.gitdealflow.com/funnels" },
      { "@type": "ListItem", position: 3, name: "Tweet Teardown", item: PAGE_URL },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={getHreflangLanguages("/tweet-teardown")}
      />
      <AgentMirrorLinks path="/tweet-teardown" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-14">
        {/* Hero */}
        <header className="space-y-5">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-[0.18em]">
            €1 micro-tripwire
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            Drop us a tweet.{" "}
            <span className="text-sky-300">€1.</span>{" "}
            <span className="block sm:inline">We reply with the 7-signal teardown in 4 hours.</span>
          </h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Most tweets praising "an incredible engineering team" or "crushing
            distribution" carry zero evidence. We extract the GitHub org being
            named or implied, run the seven-signal Scout methodology against it,
            and reply with three short paragraphs plus a frozen Scout Score card.
            One tweet per purchase. Refund if we can't match the org.
          </p>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
            <a
              href={STRIPE_TEARDOWN_LINK}
              className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-7 py-3.5 text-base transition-colors"
            >
              Buy a teardown · €{PRICE_EUR}.00 →
            </a>
            <p className="text-gray-400 text-sm">
              First 50 buyers locked at €1. After that, €5 per teardown.
            </p>
          </div>
        </header>

        {/* Big-Domino Statement */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            The core claim
          </p>
          <p className="text-gray-100 text-xl sm:text-2xl leading-snug">
            If you can extract one verifiable engineering signal from a viral
            tweet in under five minutes, you can read the next round 21 to 47
            days before the deck circulates. Every part of that sentence is
            already a product on this site — the teardown is just the cheapest
            entry point.
          </p>
        </section>

        {/* What's in it — Stack */}
        <section className="space-y-6">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            What every €1 teardown includes
          </p>
          <ol className="space-y-5">
            {STACK.map((s) => (
              <li key={s.n} className="flex gap-5">
                <span className="text-sky-400 font-mono text-sm pt-1.5">{s.n}</span>
                <div className="space-y-1.5">
                  <p className="text-gray-100 font-semibold text-base leading-tight">{s.h}</p>
                  <p className="text-gray-300 text-sm leading-relaxed">{s.p}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        {/* Sample teardown */}
        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 sm:p-8 space-y-4">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            Sample teardown · format only, real org name redacted
          </p>
          <pre className="whitespace-pre-wrap text-gray-200 text-sm leading-relaxed font-mono bg-slate-950/80 border border-slate-800 rounded-lg p-5 overflow-x-auto">
{`Tweet: "the team at @[redacted] is shipping faster than any
infra startup I've seen in years"

Org match: github.com/[redacted-org] (verified — repo is
the one named in their pinned tweet, README rewritten 2026-04-29).

Scout Score (rolling 14d): 4 / 7
  ✓ Commit velocity     (+217% over 90d baseline)
  ✓ Contributor influx  (5 new humans, bot-filtered)
  ✓ Infra buildout      (3 new repos, pattern: terraform → CLI → demo)
  ✓ README freshness    (substantive rewrite, "funded by" line added)
  ✗ Star detachment     (stars tracking commits 1:1 — no viral spike)
  ✗ Issue cadence       (close-time drifting up, not down)
  ✗ Dependency adoption (zero external dependents on flagship repo)

Teardown:
The shipping-velocity claim survives the data. The four signals
above all fire in the same 14-day window, and the contributor
list grew by a senior engineer who left a public Series-B
fintech six weeks ago. The README rewrite added a "funded by"
section, which usually means a round closes inside 21-47 days.

The "any infra startup" framing is harder to defend. The issue-
cadence drift suggests the team is shipping faster than they can
absorb feedback — that's healthy at pre-seed and worrying at A.
Stars-to-commits 1:1 means the velocity is real but unannounced
(no Show HN, no Product Hunt). They'll either announce or
they're staffing up for an enterprise close.

Highest-leverage next move: pull the founder's email from the
git log of [redacted-repo] (it's there) and send three lines
referencing the new contributor's recent commit on [redacted-
file]. Reply rate on that template is ~4× the rate on a deck-
ask. The window is the next 14 days.`}
          </pre>
        </section>

        {/* Risk reversal */}
        <section className="bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-950 border border-emerald-700/40 rounded-xl p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            Risk reversal
          </p>
          <p className="text-gray-100 text-lg leading-snug">
            If we can't match the tweet to a real GitHub org, instant refund.
            No questions, no judgment, no human in the loop required — reply
            "REFUND" to the receipt email and the €1 hits your card back inside
            an hour. Worst case you pay a euro for a sentence and we eat the
            Stripe fee.
          </p>
        </section>

        {/* Proof strip */}
        <section className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 grid sm:grid-cols-3 gap-4">
          {PROOF.map((p) => (
            <a
              key={p.label}
              href={p.href}
              className="block space-y-1 hover:bg-slate-950/40 rounded -m-2 p-2 transition-colors"
            >
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
                {p.label}
              </p>
              <p className="text-gray-100 text-sm font-medium">{p.value}</p>
            </a>
          ))}
        </section>

        {/* FAQ */}
        <section className="space-y-6">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            Honest objections, taken in order
          </p>
          <div className="space-y-5">
            {FAQ.map((f) => (
              <details
                key={f.q}
                className="bg-slate-900/40 border border-slate-800 rounded-lg p-5 group"
              >
                <summary className="text-gray-100 font-semibold cursor-pointer list-none flex items-start gap-2">
                  <span className="text-sky-400 group-open:rotate-90 transition-transform inline-block">
                    ▸
                  </span>
                  <span>{f.q}</span>
                </summary>
                <p className="text-gray-300 text-sm leading-relaxed mt-3 pl-6">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="text-center space-y-5 pt-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            One tweet. €1. Four hours. Receipts in your inbox.
          </h2>
          <a
            href={STRIPE_TEARDOWN_LINK}
            className="inline-flex items-center justify-center rounded-lg bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-8 py-4 text-base transition-colors"
          >
            Buy a teardown · €{PRICE_EUR}.00 →
          </a>
          <p className="text-gray-400 text-sm">
            Prefer to read first? The free Sunday digest goes out with five
            ranked names every week —{" "}
            <Link href="https://gitdealflow.com/#signup" className="text-sky-400 hover:text-sky-300 underline underline-offset-2">
              join the list
            </Link>
            .
          </p>
        </section>

        {/* Ladder reminder — Brunson value-ladder */}
        <section className="text-center text-xs text-gray-400 pt-6 border-t border-slate-800">
          <p>
            €1 Tweet Teardown · €7 First Look Pass ·{" "}
            <span className="text-gray-400">€9.97/mo Dashboard</span> · €97/mo
            Insider Circle · €1,997 Custom Sector Sweep
          </p>
          <p className="mt-2">
            <Link href="/funnels" className="text-sky-500 hover:text-sky-400">
              See the full funnel ladder →
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
