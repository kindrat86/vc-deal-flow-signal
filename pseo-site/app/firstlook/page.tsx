import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import CartPreview from "@/components/CartPreview";

export const dynamic = "force-static";

// Canonical URL for schema.org Offer.url. The actual checkout flow is
// a server-created Stripe Checkout Session (POST /api/checkout/session)
// that captures the card with setup_future_usage='off_session' — that's
// what makes the one-click OTO on /firstlook/thanks possible.
const FIRSTLOOK_OFFER_URL = "https://signals.gitdealflow.com/firstlook";

export const metadata: Metadata = {
  title: "First Look Pass — €7. One sector. 24-hour deep dive.",
  description:
    "Pay €7 once, pick any of 19 tracked sectors, and within 24 hours get a written sector deep dive: top 25 ranked GitHub orgs, 14-day acceleration deltas, contributor maps, and three pre-Crunchbase breakouts. Credited toward Dashboard if you upgrade in 14 days.",
  alternates: { canonical: "/firstlook" },
  openGraph: {
    title: "First Look Pass — €7. One sector. 24-hour deep dive.",
    description:
      "€7 once, pick a sector, get the full GitHub-momentum deep dive in 24h.",
    url: "https://signals.gitdealflow.com/firstlook",
    type: "article",
  },
};

// CURIOSITY LOOPS — Brunson DotCom Secrets Ch 12 (23 Building Blocks),
// Building Block #3: "What you'll discover" bullets. Each line opens a loop
// the reader can only close by paying €7. The page-number references make the
// artefact feel concrete; the counter-intuitive twist on each bullet is what
// stops the scroll and forces the click. Russell's rule: every bullet has a
// specific named discovery + a "but here's what surprised us" counter-beat.
const DISCOVERIES = [
  {
    head: "The three sectors where 14-day commit-velocity gives the biggest fundraise lead-time",
    body: "And the one sector where the signal lags by 60+ days because the engineering work happens in private repos until series B. Page 4.",
  },
  {
    head: "Why a contributor influx of 4+ in 30 days predicts fundraise better than raw commit count",
    body: "Plus the 90-second test you can run on any GitHub org tonight to see the pattern on a public company before we ship the report. Page 7.",
  },
  {
    head: "Three pre-Crunchbase startups in your sector — named, with the timestamp we surfaced each one",
    body: "So when one of them announces a round in 21–47 days you can verify we flagged it first, not back-fitted. Page 11.",
  },
] as const;

const STACK = [
  {
    label: "Top 25 ranked GitHub orgs in your sector",
    detail:
      "Sorted by 14-day commit velocity acceleration, with two-period confirmation to filter out noise spikes.",
  },
  {
    label: "Contributor map per top org",
    detail:
      "Who's joined in the past 30 days. Matters because contributor influx precedes hiring announcements.",
  },
  {
    label: "Three pre-Crunchbase breakouts",
    detail:
      "Net-new orgs surfaced by the same engine — companies the consensus deal-flow tools haven't indexed yet.",
  },
  {
    label: "Raw CSV (every org × every metric)",
    detail:
      "Drop into your CRM or notebook. License-friendly. Every metric is re-derivable from public GitHub data.",
  },
  {
    label: "Written walkthrough (15-minute read)",
    detail:
      "What stood out. What's likely a false positive. The thesis-specific surprises in the data this quarter.",
  },
] as const;

// Brunson Stack Slide — DotCom Secrets Ch 9. Each line in the deliverable
// quoted with the standalone retail value of the same artefact ordered
// elsewhere, so the €7 cart price reads as the anchor it actually is.
const VALUE_STACK = [
  { label: "Top-25 ranked org list (one sector)", value: 290 },
  { label: "Contributor influx map (top 10 orgs × 30-day)", value: 240 },
  { label: "Three pre-Crunchbase breakouts (named + thesis-tagged)", value: 360 },
  { label: "Raw CSV — every org × every metric", value: 190 },
  { label: "JSON dump (Dashboard-grade, agent-readable)", value: 150 },
  { label: "Written 14-page walkthrough PDF", value: 220 },
  { label: "REQUEST CREDIT — €7 toward Dashboard if you upgrade in 14d", value: 97 },
] as const;

const TOTAL_VALUE = VALUE_STACK.reduce((s, x) => s + x.value, 0);

// Brunson OTO Ladder — Cart Funnel Secret 18. Buyers move up rungs at
// progressively higher commitment. We show the whole ladder so the reader
// can see where they are and where the path goes.
const OTO_LADDER = [
  {
    rung: "Rung 0",
    label: "Acceleration Watch",
    price: "Free",
    purpose: "Weekly digest. Builds the rhythm.",
    href: "https://gitdealflow.com/#signup",
    tone: "slate",
  },
  {
    rung: "Rung 1",
    label: "First Look Pass",
    price: "€7",
    purpose: "One sector, 24-hour intake. The tripwire — first dollar.",
    href: "/firstlook",
    tone: "amber",
    current: true,
  },
  {
    rung: "Rung 2",
    label: "Insider Circle",
    price: "€77 / mo",
    purpose: "Private Telegram + spike alerts + monthly briefing. €20 off first month, this funnel only.",
    href: "/pricing#insider-circle",
    tone: "teal",
  },
  {
    rung: "Rung 3",
    label: "Sector Sweep (post-purchase OTO)",
    price: "€1,797",
    purpose: "One-click upsell on the thank-you page. Full panel + 60-min walkthrough — €200 off standalone.",
    href: "/firstlook/thanks",
    tone: "emerald",
  },
  {
    rung: "Rung 4",
    label: "Dashboard (annual)",
    price: "€119.64 / yr",
    purpose: "All sectors, real-time scoring. The retention seat.",
    href: "/pricing",
    tone: "sky",
  },
] as const;

const FAQS = [
  {
    q: "What's the deliverable, exactly?",
    a: "A PDF report (10–14 pages depending on sector) plus the raw CSV. Delivered to your inbox within 24 hours of payment, weekdays. Manually written by the founder, not auto-generated. The same engine that powers the Dashboard, but applied to one sector with a written narrative around it.",
  },
  {
    q: "How do I pick the sector?",
    a: "On the Stripe checkout page, the order field asks which sector. We track 19: AI/ML, AI infra, AI safety, climate tech, crypto/web3, cybersecurity, data infra, dev tools, edtech, fintech rails, future of work, gaming, healthtech, identity, observability, open source tooling, robotics, SaaS infra, vertical AI. If your thesis cuts across, name it and we'll pick the most relevant one.",
  },
  {
    q: "What happens if I upgrade to the Dashboard?",
    a: "The €7 is credited toward your first month of Dashboard if you upgrade within 14 days of receiving the deep dive. Reply to the delivery email with REQUEST CREDIT and the founder applies it manually — no automation, but it's never been missed.",
  },
  {
    q: "Why is it €7 and not free?",
    a: "Two reasons. One — €7 filters out time-wasters but doesn't punish a serious investor who just wants to see the data on their thesis before subscribing. Two — €7 is the price of a coffee in central Lisbon, which is exactly what writing a 14-page sector report costs in time when amortised across the work it takes to build it. The price isn't margin, it's a filter.",
  },
  {
    q: "What's the order bump and how do I claim it?",
    a: "Tick the Methodology Vault checkbox in the cart preview before checkout — the 38-page PDF is added to your order as a +€19 line item, total €26. The Vault unpacks every signal definition, every regression coefficient in the SSRN paper, and the three confounders the public preprint does not name. It arrives as an instant download link in your First Look intake email. The bump is only available at this checkout step — the Vault is not sold standalone.",
  },
  {
    q: "What if I don't like the deliverable?",
    a: "30-day refund, no questions, no clawback of the artefacts you received. Reply REFUND to the delivery email; we send back the €7 inside one business day and you keep the PDF + CSV. The guarantee exists because we'd rather lose €7 than have a buyer feel oversold — and because in three years of running this we've issued exactly two refunds.",
  },
] as const;

export default function FirstLookPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        // F23: explicit access-status statement. The /firstlook URL itself is
        // fully crawlable — every word of the marketing copy, value stack,
        // FAQs, and order-bump description is publicly readable. The PRODUCT
        // is paid (€7 base + €19 Methodology Vault order-bump), but its
        // description is not paywalled, so we set isAccessibleForFree: true
        // on the page. This tells Google we are not cloaking paywalled
        // content. The Product's paid status is already represented by the
        // Offer.price > 0 signal.
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/firstlook#webpage",
        url: "https://signals.gitdealflow.com/firstlook",
        name: "First Look Pass — €7. One sector. 24-hour deep dive.",
        isAccessibleForFree: true,
        primaryImageOfPage: {
          "@type": "ImageObject",
          url: "https://signals.gitdealflow.com/api/og/firstlook",
        },
        mainEntity: {
          "@id": "https://signals.gitdealflow.com/firstlook#product",
        },
      },
      {
        "@type": "Product",
        "@id": "https://signals.gitdealflow.com/firstlook#product",
        name: "First Look Pass",
        description:
          "€7 one-time tripwire — a sector-specific written deep dive on GitHub momentum, delivered within 24 hours.",
        brand: { "@type": "Brand", name: "GitDealFlow" },
        offers: {
          "@type": "AggregateOffer",
          priceCurrency: "EUR",
          lowPrice: "7.00",
          // €7 base + €19 Methodology Vault bump. Sector Sweep €1,797 is
          // the OTO #1 rung on /firstlook/thanks — surfaced to its own
          // Product/Offer entity over there, not aggregated here, because
          // it is post-purchase and not selectable on /firstlook itself.
          highPrice: "26.00",
          offerCount: 2,
          availability: "https://schema.org/InStock",
          priceValidUntil: "2026-12-31",
          url: "https://signals.gitdealflow.com/firstlook",
          offers: [
            {
              "@type": "Offer",
              name: "First Look Pass — base",
              price: "7.00",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              priceValidUntil: "2026-12-31",
              url: FIRSTLOOK_OFFER_URL,
            },
            {
              "@type": "Offer",
              name: "Order bump — Methodology Vault PDF",
              price: "19.00",
              priceCurrency: "EUR",
              availability: "https://schema.org/InStock",
              priceValidUntil: "2026-12-31",
              url: FIRSTLOOK_OFFER_URL,
            },
          ],
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://signals.gitdealflow.com/firstlook#stack",
        name: "First Look Pass — value stack",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: VALUE_STACK.length,
        itemListElement: VALUE_STACK.map((s, i) => ({
          "@type": "ListItem",
          position: i + 1,
          name: s.label,
          item: {
            "@type": "Offer",
            price: s.value.toFixed(2),
            priceCurrency: "EUR",
          },
        })),
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
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "First Look Pass",
            item: "https://signals.gitdealflow.com/firstlook",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/firstlook"
        languages={getHreflangLanguages("/firstlook")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/firstlook" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Tripwire offer · €7 · One-time
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Pick a sector. Pay €7.{" "}
            <span className="text-amber-400">Get the full deep dive in 24 hours.</span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            Most investors won&rsquo;t pay €9.97/mo for a tool they
            haven&rsquo;t tested on their actual thesis. Fair. The First Look
            Pass exists for that exact gap. €7, one-time, no subscription —
            and €7 of credit if you upgrade.
          </p>
        </header>

        {/* CURIOSITY LOOPS — Brunson DotCom Secrets Ch 12 (Building Block #3,
            "What you'll discover"). Squeeze placement: first thing after the
            hero, before the offer reveal. Three open loops the reader can
            only close by paying. Specific page numbers + counter-intuitive
            second beats are what convert curiosity into checkout clicks.
            Headline pattern: "Discover [specific named thing] — and why
            [thing that flips the obvious assumption]." */}
        <section
          aria-label="What you'll discover inside the deep dive"
          className="rounded-xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-4"
        >
          <header className="space-y-1.5">
            <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              What you&rsquo;ll discover · three open loops
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              Three things in the report you can&rsquo;t Google.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              The PDF is 14 pages. These are the three pages investors
              screenshot most. Each one names a specific finding and the page
              it&rsquo;s on, so you know exactly what €7 is buying.
            </p>
          </header>

          <ul className="space-y-3">
            {DISCOVERIES.map((d, i) => (
              <li
                key={d.head}
                className="flex items-start gap-3 sm:gap-4 rounded-lg border border-violet-700/30 bg-slate-900/60 p-3 sm:p-4"
              >
                <span
                  aria-hidden="true"
                  className="shrink-0 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-violet-500/20 border border-violet-500/60 flex items-center justify-center text-violet-200 font-bold text-sm tabular-nums"
                >
                  {i + 1}
                </span>
                <div className="space-y-1 min-w-0">
                  <p className="text-gray-100 font-semibold text-sm sm:text-base leading-snug">
                    {d.head}
                  </p>
                  <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                    {d.body}
                  </p>
                </div>
              </li>
            ))}
          </ul>

          <p className="text-violet-200/80 text-xs leading-relaxed border-l-2 border-violet-700/40 pl-3">
            Open loops on purpose. The page numbers are real — if any of these
            three discoveries isn&rsquo;t in your delivered PDF, reply REFUND
            and the €7 returns inside one business day, no questions.
          </p>
        </section>

        {/* BEST BAIT — Brunson DotCom Secrets Ch 13. */}
        <aside
          aria-label="Why this is bait built for you"
          className="rounded-xl border border-amber-700/40 bg-amber-950/15 p-5 sm:p-6 space-y-2"
        >
          <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Why this is the right bait
          </p>
          <h2 className="text-gray-100 font-bold text-lg sm:text-xl leading-snug">
            This pass isn&rsquo;t a generic trial. It&rsquo;s built for the
            developer-investor specifically.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Brunson&rsquo;s rule of bait: match the offer to the avatar.
            A €7 PDF is the wrong bait for a fund partner with a
            six-figure data budget — too small to register. It&rsquo;s the
            <em> right </em>bait for the engineer-investor who reads
            commit logs for fun, writes €5k–€50k checks on the side, and
            wants to test the data on their actual thesis before
            subscribing. That&rsquo;s why the price is €7, the deliverable
            is sector-specific, and the format is PDF + raw CSV — not a
            sales call, not a demo, not a calendar invite.
          </p>
        </aside>

        {/* STACK SLIDE — Brunson DotCom Secrets Ch 9 + Expert Secrets Ch 13.
            Quote each artefact at standalone retail value, sum it, anchor
            against the €7 cart price. The math has to be defensible —
            every line is the going rate for that artefact in the open
            market when ordered separately. */}
        <section
          aria-label="Stack value vs cart price"
          className="rounded-xl border border-slate-800 bg-gradient-to-b from-slate-900/80 to-slate-950 p-5 sm:p-7 space-y-5"
        >
          <header className="space-y-1.5">
            <p className="text-violet-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              The stack · what €7 buys at retail
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              €{TOTAL_VALUE.toLocaleString("en-US")} in deliverables. €7 cart price.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Every artefact below is priced at what the same thing costs when
              ordered separately on the open market — sector-research consulting
              rates, list-rental fees, custom-CSV jobs. The total isn&rsquo;t
              marketing math; it&rsquo;s the going retail.
            </p>
          </header>

          <ul className="divide-y divide-slate-800 border-y border-slate-800">
            {VALUE_STACK.map((row) => (
              <li
                key={row.label}
                className="flex items-baseline justify-between gap-4 py-2.5 text-sm"
              >
                <span className="text-gray-300 leading-snug min-w-0">{row.label}</span>
                <span className="text-gray-100 font-semibold tabular-nums shrink-0">
                  €{row.value}
                </span>
              </li>
            ))}
            <li className="flex items-baseline justify-between gap-4 py-3 text-sm">
              <span className="text-violet-300 font-semibold uppercase tracking-wider text-xs">
                Total retail value
              </span>
              <span className="text-violet-300 font-bold text-lg sm:text-xl tabular-nums">
                €{TOTAL_VALUE.toLocaleString("en-US")}
              </span>
            </li>
          </ul>

          <div className="rounded-lg border-2 border-amber-500/60 bg-amber-950/30 p-4 sm:p-5 flex items-baseline justify-between gap-4">
            <div>
              <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                Your cart price
              </p>
              <p className="text-amber-100 text-sm leading-snug pt-0.5">
                {Math.round((TOTAL_VALUE - 7) / 7)}× return at retail. One coffee.
              </p>
            </div>
            <p className="text-amber-300 font-bold text-3xl sm:text-4xl tabular-nums">
              €7
            </p>
          </div>
        </section>

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-100">What lands in your inbox</h2>
          <ul className="space-y-3">
            {STACK.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="text-amber-400 font-bold shrink-0 mt-0.5">→</span>
                <div>
                  <p className="text-gray-100 font-semibold text-sm">{item.label}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>

        {/* CART PREVIEW — Brunson Cart Funnel Secret 18. Visual cart with
            running total + bump toggle. Stripe handles auth/payment, but the
            cart UX (line items, bump optics, save-amount feedback) lives on
            this page so the buyer sees the funnel mechanics before checkout. */}
        <CartPreview />

        {/* RISK REVERSAL — Brunson DotCom Secrets Ch 19, placed at the cart
            point where it actually catches the hesitation, not buried in
            the FAQ. Every Brunson cart has a guarantee card adjacent to
            the buy button. */}
        <section
          aria-label="30-day refund guarantee"
          className="rounded-xl border-2 border-emerald-500/40 bg-emerald-950/15 p-5 sm:p-6"
        >
          <div className="flex items-start gap-4">
            <div
              aria-hidden="true"
              className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-emerald-500/20 border-2 border-emerald-500/60 flex items-center justify-center text-emerald-300 font-bold text-xl sm:text-2xl"
            >
              ✓
            </div>
            <div className="space-y-2">
              <p className="text-emerald-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
                30-day Signal-or-It&rsquo;s-Free guarantee
              </p>
              <h3 className="text-gray-100 font-bold text-base sm:text-lg leading-snug">
                Read it. Hate it. Reply REFUND. Keep everything.
              </h3>
              <p className="text-gray-300 text-sm leading-relaxed">
                If the deep dive isn&rsquo;t a 30× retail-value return on €7,
                reply <code className="bg-slate-900 text-emerald-200 px-1.5 py-0.5 rounded text-xs">REFUND</code>{" "}
                inside 30 days — refund hits your card in one business day, no
                questions, no clawback. We&rsquo;ve issued two refunds in three
                years. The guarantee exists because we&rsquo;d rather lose €7
                than have a buyer feel oversold.
              </p>
            </div>
          </div>
        </section>

        {/* OTO LADDER — Brunson Cart Funnel Secret 18. The full path the cart
            funnel walks the buyer through: free → tripwire → OTO → bump →
            retention. Each rung has its own purpose; transparency about the
            sequence is itself a trust signal. */}
        <section
          aria-label="The full cart funnel — every rung the buyer can take"
          className="space-y-4"
        >
          <header className="space-y-1.5">
            <p className="text-sky-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              The cart funnel · every rung
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              You&rsquo;re on rung 1. Here&rsquo;s the whole ladder.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              Brunson&rsquo;s cart-funnel rule: tell the buyer the whole map.
              Hidden upsells feel like ambush; named ones feel like a path.
              Every offer below is independent — no offer requires the next.
            </p>
          </header>

          <ol className="space-y-2.5">
            {OTO_LADDER.map((r) => {
              const toneBorder = {
                slate: "border-slate-700",
                amber: "border-amber-500/70 bg-amber-950/20",
                teal: "border-teal-700/50",
                emerald: "border-emerald-700/50",
                sky: "border-sky-700/50",
              }[r.tone];
              const tonePill = {
                slate: "text-gray-400",
                amber: "text-amber-300",
                teal: "text-teal-300",
                emerald: "text-emerald-300",
                sky: "text-sky-300",
              }[r.tone];
              return (
                <li
                  key={r.rung}
                  className={`rounded-lg border ${toneBorder} p-4 sm:p-5 ${
                    "current" in r && r.current ? "ring-2 ring-amber-500/40" : ""
                  }`}
                >
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-0.5 min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-mono uppercase tracking-wider ${tonePill}`}>
                          {r.rung}
                        </span>
                        {"current" in r && r.current && (
                          <span className="text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-amber-500 text-slate-950">
                            You are here
                          </span>
                        )}
                      </div>
                      <p className="text-gray-100 font-semibold text-sm sm:text-base">
                        {r.label}
                      </p>
                      <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                        {r.purpose}
                      </p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-gray-100 font-bold text-base sm:text-lg tabular-nums">
                        {r.price}
                      </p>
                      <a
                        href={r.href}
                        className={`text-xs sm:text-sm underline decoration-dotted ${tonePill} hover:opacity-80`}
                      >
                        {r.href.startsWith("http") ? "Open ↗" : "View →"}
                      </a>
                    </div>
                  </div>
                </li>
              );
            })}
          </ol>
        </section>

        {/* FUTURE PACING — Brunson Expert Secrets Ch 14. The buyer needs to
            FEEL the next 24 hours before they pay; uncertainty about timing
            is one of the three top-line cart objections. Timeline removes
            it by making each stop concrete. */}
        <section
          aria-label="What happens in the next 24 hours"
          className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 sm:p-7 space-y-4"
        >
          <header className="space-y-1.5">
            <p className="text-cyan-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              Future pacing · the next 24 hours
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              What actually happens between paying and reading.
            </h2>
            <p className="text-gray-400 text-sm leading-relaxed">
              The 24-hour window is real work, not an SLA marketing trick.
              Here&rsquo;s the timeline so you know what you&rsquo;re getting at
              every checkpoint.
            </p>
          </header>

          <ol className="space-y-3 border-l-2 border-cyan-700/40 pl-5 sm:pl-6">
            {[
              {
                t: "T+0 min",
                head: "Stripe confirms · sector locked",
                body: "You complete checkout. Stripe webhook fires. The order field (your sector) lands in the founder's intake queue with your email stamped.",
              },
              {
                t: "T+30 min",
                head: "Engine pulls the panel",
                body: "Same engine behind the Dashboard runs your sector through the 14-day commit-velocity acceleration filter. ~2,400 GitHub orgs scored in one batch; top 25 stamped with two-period confirmation.",
              },
              {
                t: "T+4 h",
                head: "Contributor maps + breakouts compiled",
                body: "Top 10 orgs get a 30-day contributor influx map. The breakout-detection pass surfaces three pre-Crunchbase candidates. Raw CSV + JSON dump sealed.",
              },
              {
                t: "T+12 h",
                head: "Written walkthrough drafted",
                body: "Founder writes the 14-page narrative: what stood out, what's likely a false positive, the thesis-specific surprises. Manual, not auto-generated. The thinking part of the deliverable.",
              },
              {
                t: "T+18 h",
                head: "Self-review + cross-check",
                body: "Each named breakout cross-checked against Crunchbase + LinkedIn to confirm pre-funded status. Two-source rule. If a breakout fails the check, it gets pulled and the report ships with the remaining two plus a noted skip.",
              },
              {
                t: "T+24 h",
                head: "Delivery email lands · credit window opens",
                body: "PDF + CSV + JSON in your inbox. The 14-day Dashboard-credit window starts now: reply REQUEST CREDIT inside two weeks and the €7 applies to month one of Dashboard.",
              },
            ].map((s, i) => (
              <li key={s.t} className="relative">
                <span
                  aria-hidden="true"
                  className="absolute -left-[26px] sm:-left-[31px] top-1 w-3 h-3 rounded-full bg-cyan-400 border-2 border-slate-950"
                />
                <p className="text-cyan-300 text-[11px] font-mono uppercase tracking-wider">
                  {s.t}
                </p>
                <p className="text-gray-100 font-semibold text-sm sm:text-base">
                  {s.head}
                </p>
                <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                  {s.body}
                </p>
              </li>
            ))}
          </ol>
          <p className="text-gray-400 text-xs leading-relaxed border-l-2 border-cyan-700/30 pl-3">
            Weekday delivery. Pay Friday after 18:00 UTC and the timeline
            shifts to Monday 18:00 UTC; the email tells you when to expect
            the inbox land if it&rsquo;s a weekend gap.
          </p>
        </section>

        {/* POST-PURCHASE OTO PREVIEW — DotCom Ch 12. */}
        <aside
          className="border border-slate-800 bg-slate-900/40 rounded-xl p-5 sm:p-6 space-y-2"
          aria-label="Post-purchase upsell preview"
        >
          <p className="text-teal-400 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            What happens after delivery
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Inside the delivery email there&rsquo;s a one-time invitation to add{" "}
            <Link href="/pricing#insider-circle" className="text-teal-300 hover:text-teal-200 underline decoration-dotted">
              Insider Circle
            </Link>{" "}
            (private Telegram + spike alerts + monthly briefing) at{" "}
            <strong className="text-gray-100">€77 for the first month</strong>{" "}
            — €20 off the standard €97. The invite expires when the next
            Monday digest goes out, and never re-appears at this price.
            Decline it and your €7 First Look Pass still works exactly the
            same way.
          </p>
        </aside>

        {/* AGENT CART — Brunson Secret 13 ("right bait, right avatar")
            applied to a non-human buyer. The same data, different cart
            shape. Builders who run an autonomous deal-screen agent
            don't want a 24-hour PDF; they want a callable JSON endpoint
            with USDC settlement. Both carts answer the same big domino
            ("see GitHub momentum first"); the bait differs. */}
        <section
          aria-label="Pay-per-call cart for agents and AI buyers"
          className="rounded-xl border border-violet-700/50 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-4"
        >
          <header className="space-y-1.5">
            <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              Different buyer · different cart
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
              Building an agent? There&rsquo;s a cart shape for that.
            </h2>
            <p className="text-gray-300 text-sm leading-relaxed">
              €7 + 24-hour PDF is the right bait for an investor at a
              keyboard. The wrong bait for an agent screening 200 orgs
              overnight. Same data, different cart: pay-per-call USDC, no
              account, JSON in 2 seconds.
            </p>
          </header>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-sm">
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:p-4 space-y-1">
              <p className="text-violet-400 text-[10px] uppercase tracking-wider">
                Price
              </p>
              <p className="text-gray-100 font-bold text-base">$0.19 USDC</p>
              <p className="text-gray-400 text-xs leading-snug">
                Per deep-signal call. ~$0.001 in gas. Misses (404) are free.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:p-4 space-y-1">
              <p className="text-violet-400 text-[10px] uppercase tracking-wider">
                Settlement
              </p>
              <p className="text-gray-100 font-bold text-base">x402 protocol</p>
              <p className="text-gray-400 text-xs leading-snug">
                HTTP 402 challenge → wallet signs → 2-second settlement on Base.
              </p>
            </div>
            <div className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 sm:p-4 space-y-1">
              <p className="text-violet-400 text-[10px] uppercase tracking-wider">
                Endpoint
              </p>
              <p className="text-gray-100 font-bold text-base font-mono text-xs">
                /api/agent/deep-signal/x402
              </p>
              <p className="text-gray-400 text-xs leading-snug">
                Curl-callable. SDK-friendly. Coinbase facilitator handles
                receipts.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 pt-1">
            <Link
              href="/agents/credits"
              className="inline-flex items-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 text-slate-950 font-bold text-sm px-4 py-2 transition-colors"
            >
              Open the agent cart →
            </Link>
            <a
              href="https://x402.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-lg border border-violet-700/50 text-violet-200 hover:text-violet-100 hover:border-violet-500 text-sm px-4 py-2 transition-colors"
            >
              x402 protocol ↗
            </a>
          </div>
        </section>

        {/* DOWNSELL — DotCom Ch 12. If they bounce on €7, capture them on the
            €1 Teardown rung first, free list second. Russell rule: never let
            a visitor leave at zero commitment if there's a paid-but-cheaper
            rung below — the €1 Teardown is the buyer-threshold breaker added
            specifically to close the €0-to-€7 psychological gap. */}
        <aside
          className="border-l-2 border-rose-700/50 pl-4 py-1 space-y-2"
          aria-label="Downsell to €1 Teardown then to free list"
        >
          <p className="text-rose-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            Not ready for €7?
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Try the{" "}
            <Link
              href="/teardown"
              className="text-rose-300 hover:text-rose-200 underline decoration-dotted"
            >
              €1 Tweet Teardown
            </Link>{" "}
            instead — name one startup, get a tweet-length read on its
            engineering momentum in 24h, written by the founder. €1 credits
            into the First Look Pass if you upgrade within 7 days, so this
            is the €0-to-€7 bridge, not a separate purchase.
          </p>
          <p className="text-gray-400 text-sm leading-relaxed">
            Or skip paid entirely and join the free{" "}
            <a
              href="https://gitdealflow.com/#signup"
              rel="noopener noreferrer"
              className="text-emerald-400 hover:text-emerald-300 underline decoration-dotted"
            >
              Acceleration Watch
            </a>{" "}
            — five startups every Monday, sector-tagged, no card.
          </p>
        </aside>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5">
          Not sure if €7 fits or you should just lock the Dashboard?{" "}
          <Link href="/quiz" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            Take the 90-second quiz
          </Link>
          .
        </p>

        {/* Bottom spacer so the sticky mobile cart bar doesn't cover content */}
        <div aria-hidden="true" className="md:hidden h-20" />
      </div>

      {/* STICKY MOBILE CART BAR — Brunson Cart Funnel Secret 18. The bar
          travels with the buyer as they scroll FAQ + timeline so the
          cart never falls below the fold on small screens. CSS-only
          (no JS, no client component) — the price is the base €7;
          tap to scroll to the interactive CartPreview where the bump
          can be toggled. Hidden md+ (the full cart is always visible
          on desktop). */}
      <div
        aria-label="Sticky cart bar (mobile)"
        className="fixed bottom-0 inset-x-0 md:hidden z-40 border-t border-amber-500/40 bg-slate-950/95 backdrop-blur-sm shadow-[0_-4px_20px_rgba(245,158,11,0.15)]"
      >
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="space-y-0.5 min-w-0">
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
              First Look · cart price
            </p>
            <p className="text-gray-100 font-bold text-lg tabular-nums leading-none">
              €7
              <span className="text-gray-400 text-[10px] font-medium ml-1.5 uppercase tracking-wider">
                one-time
              </span>
            </p>
          </div>
          <form action="/api/checkout/session" method="POST" className="shrink-0">
            <input type="hidden" name="tier" value="firstlook" />
            <button
              type="submit"
              className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-4 py-2.5 shadow-md"
            >
              Check out →
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
