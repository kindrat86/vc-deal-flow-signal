import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import SectorSweepBriefForm from "./SectorSweepBriefForm";

export const dynamic = "force-static";

const STRIPE_DIRECT_BUY = "https://buy.stripe.com/bJe14m34DbNC6gm1by0x204";

export const metadata: Metadata = {
  title:
    "Sector Sweep — €1,997 once. 40-page custom deep-dive. Async setter, 24h brief.",
  description:
    "The €1,997 Custom Sector Sweep. Pick one sector, written 40-page deep-dive in 14 days, raw CSV, three pre-Crunchbase breakouts, 14-day async Q&A. Submit a 5-question brief and get a written fit assessment + buy link inside 24 business hours, or skip the brief and go direct to Stripe.",
  alternates: { canonical: "/sector-sweep" },
  openGraph: {
    title: "Sector Sweep — €1,997 once · VC Deal Flow Signal",
    description:
      "40-page custom deep-dive on the sector you pick. Async-only. Brief in 24h or skip straight to checkout.",
    url: "https://signals.gitdealflow.com/sector-sweep",
    type: "article",
  },
};

// Brunson Stack Slide (DotCom Secrets Ch 9). Each line is the standalone
// retail value of the same artefact ordered separately, so the €1,997
// reads as the anchor it actually is — not a per-unit estimate.
const VALUE_STACK = [
  {
    label: "40-page custom sector PDF (your sector, your thesis)",
    value: 1497,
    detail:
      "Written specifically against your sector + thesis brief. Top 25 ranked orgs, 14-day acceleration deltas, contributor maps, geography breakdown, signal-type classification.",
  },
  {
    label: "Three pre-Crunchbase breakouts, named + diligence-prompted",
    value: 1200,
    detail:
      "Companies the consensus deal-flow tools haven't indexed yet. Each comes with a 1-paragraph thesis, the specific GitHub-side signal that surfaced them, and 5 diligence questions worth asking the founder.",
  },
  {
    label: "Top-five org deep-dives (1 page each)",
    value: 950,
    detail:
      "For the five highest-acceleration orgs in your sector: contributor influx, repo-creation pattern, README freshness, dependents graph, the 30-day commit-velocity chart.",
  },
  {
    label: "Raw CSV — every org × every metric",
    value: 290,
    detail:
      "Drop into your CRM, spreadsheet, or notebook. License-friendly. Every metric re-derivable from the public dataset.",
  },
  {
    label: "JSON dump (Dashboard-grade, agent-readable)",
    value: 240,
    detail:
      "Same dataset as the CSV but structured for direct ingestion into Claude / Cursor / any MCP host. Pair with the free MCP server.",
  },
  {
    label: "14-day async Q&A window",
    value: 1200,
    detail:
      "Reply to the delivery email any time in the next 14 days with sector-specific follow-up questions. We answer in writing inside 48 business hours, no call needed.",
  },
  {
    label: "100% credit toward Insider Circle if you upgrade in 60 days",
    value: 582,
    detail:
      "The full €1,997 credits 1:1 against Insider Circle — that's roughly your first 20 months of Insider, paid in full. The Sweep becomes the on-ramp, not a one-off.",
  },
] as const;

const TOTAL_VALUE = VALUE_STACK.reduce((s, x) => s + x.value, 0);

// Brunson "On the bus / Off the bus" disqualifier (Expert Secrets Ch 5).
// Stating who the Sweep ISN'T for is the highest-trust move on a €1,997
// page — readers who self-disqualify are readers who would have refunded.
const ON_THE_BUS = [
  "You're a fund partner, scout, or active angel covering one specific sector intensively for the next quarter.",
  "You want a written artefact you can drop into an IC memo or a partner discussion — not a dashboard you operate weekly.",
  "You're comfortable with async-only delivery: structured brief in, written PDF + CSV out, 14-day written Q&A, no live calls.",
  "You read methodology before you trust the output — the 40-page Sweep is built on the SSRN-published panel, all assumptions named.",
];

const NOT_ON_THE_BUS = [
  "You need a recurring weekly feed — that's the Dashboard (€9.97/mo). The Sweep is a one-off.",
  "You require a scheduled phone call to make the buy decision — anonymity rule, async-only commitment.",
  "You're sourcing across more than three sectors — at that breadth, the Dashboard subscription is the right rung, not a Sweep.",
  "You want the Sweep to include warm intros to founders — we don't have that relationship inventory; we surface the org and the signal, you decide on outreach.",
];

// Brunson Expert Secrets Ch 12 — Trial close stack reused on /perfect-webinar.
// Drop one above the form so the reader has to nod before filling 5 fields.
const FAQS = [
  {
    q: "Why is there a brief intake before the buy link?",
    a: "Because €1,997 is a serious cheque and we want you to know what you're getting before you click. The 5-question brief takes ~7 minutes to fill. Inside 24 business hours we reply in writing with a 1-page fit assessment, a sample table-of-contents tailored to your sector, the personal buy link, and an honest 'don't buy this' note if the Sweep isn't right for what you described. Skip the brief and pay direct via the Stripe link below if you'd rather just commit.",
  },
  {
    q: "Who actually writes the Sweep?",
    a: "The same pseudonymous team that ships every other surface on this site. The Data Nerd writes the framing and methodology sections. A small async crew assembles the panel data, ranks the orgs, and drafts the per-org deep-dives. Final review and the three pre-Crunchbase breakout calls are signed off by The Data Nerd. No live calls, no founder face, no real names. That's the constraint, and it's why the price is €1,997 and not €19,997.",
  },
  {
    q: "What's the 14-day delivery window?",
    a: "Brief intake within 24 business hours. Written fit assessment within 48 business hours of brief receipt. If you proceed, the full 40-page PDF + CSV + JSON deliverables land within 14 calendar days of payment. The 14-day async Q&A window starts the day delivery lands.",
  },
  {
    q: "What's the 30-day Signal-or-It's-Free guarantee?",
    a: "If, in your first 30 days after delivery, the Sweep does not surface at least three orgs you didn't already know about — or if the methodology can't be reproduced from the published panel — reply REFUND to the delivery email. Full €1,997 refund inside two business days. No exit interview, no 'wait, let me show you one more thing'.",
  },
  {
    q: "Can I run two sectors?",
    a: "Two Sweeps = two briefs, two PDFs, two €1,997 charges. We don't bundle. The reason is honest: each sector takes a real chunk of writing time. A 'two-for-one' would either compress per-sector depth or take three weeks instead of two. Neither is what you're paying for.",
  },
] as const;

export default function SectorSweepPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://signals.gitdealflow.com/sector-sweep#service",
        name: "Custom Sector Sweep",
        serviceType: "Sector deep-dive research report",
        description:
          "€1,997 one-time. 40-page custom PDF on the sector you pick, raw CSV of every org × every metric, three pre-Crunchbase breakouts, 14-day async Q&A. Async-only delivery; no live calls.",
        provider: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        areaServed: "Worldwide",
        offers: {
          "@type": "Offer",
          "@id": "https://signals.gitdealflow.com/sector-sweep#offer",
          price: "1997",
          priceCurrency: "EUR",
          url: STRIPE_DIRECT_BUY,
          availability: "https://schema.org/LimitedAvailability",
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            value: 8,
            unitText: "Sweeps per quarter",
          },
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
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Sector Sweep",
            item: "https://signals.gitdealflow.com/sector-sweep",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/sector-sweep"
        languages={getHreflangLanguages("/sector-sweep")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/sector-sweep" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Sector Sweep</span>
        </nav>

        {/* HERO */}
        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Custom Sector Sweep · €1,997 once · 8/quarter cap · Async-only
          </p>
          <h1
            className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight"
            data-speakable
          >
            One sector. Forty pages.{" "}
            <span className="text-amber-300">
              Three pre-Crunchbase breakouts, named.
            </span>
          </h1>
          <p
            className="text-gray-300 text-base sm:text-lg leading-relaxed"
            data-speakable
          >
            The Custom Sector Sweep is the deepest single artefact this site
            ships. €1,997 once, you pick the sector, we deliver a 40-page
            written PDF + raw CSV + JSON in 14 days, plus three pre-Crunchbase
            breakouts and a 14-day async Q&amp;A window. No call required, no
            founder voice, no live commitment — async setter in, written
            artefact out.
          </p>
        </header>

        {/* TWO DOORS */}
        <section
          aria-label="Two doors — brief setter or direct buy"
          className="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <a
            href="#brief"
            className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 hover:border-amber-500 transition-colors space-y-2 block"
          >
            <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
              Door 1 · Recommended
            </p>
            <h2 className="text-lg font-bold text-gray-100">
              Submit the 7-minute brief →
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Five-question intake. We reply in writing inside 24 business
              hours with a 1-page fit assessment, a tailored table of
              contents, the personal buy link, and an honest &ldquo;don&rsquo;t
              buy this&rdquo; note if the Sweep isn&rsquo;t right for what you
              described.
            </p>
          </a>
          <a
            href={STRIPE_DIRECT_BUY}
            className="rounded-xl border border-slate-700 bg-slate-900/40 p-6 hover:border-slate-500 transition-colors space-y-2 block"
          >
            <p className="text-slate-400 text-[10px] font-semibold uppercase tracking-wider">
              Door 2 · Skip the brief
            </p>
            <h2 className="text-lg font-bold text-gray-100">
              Pay €1,997 direct via Stripe →
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Already know your sector and want to commit. Stripe Checkout
              opens, you pay, the intake form for sector + thesis lands in
              your inbox within five minutes, and the 14-day delivery clock
              starts the moment we receive your reply.
            </p>
          </a>
        </section>

        {/* STACK */}
        <section className="space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            01 · The stack
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            Seven artefacts. €5,959 retail. €1,997 founding-rate price.
          </h2>
          <ol className="space-y-3">
            {VALUE_STACK.map((item, i) => (
              <li
                key={i}
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3"
              >
                <div className="space-y-1.5 flex-1">
                  <p className="text-gray-100 font-bold text-base leading-snug">
                    {i + 1}. {item.label}
                  </p>
                  <p className="text-gray-400 text-sm leading-relaxed">
                    {item.detail}
                  </p>
                </div>
                <p className="text-amber-300 font-mono text-sm font-bold tabular-nums sm:text-right shrink-0">
                  €{item.value.toLocaleString("en-GB")}
                </p>
              </li>
            ))}
          </ol>
          <div className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-4 flex items-baseline justify-between text-base">
            <span className="text-gray-300">Total retail value</span>
            <span className="font-mono font-bold text-gray-200 line-through">
              €{TOTAL_VALUE.toLocaleString("en-GB")}
            </span>
          </div>
          <div className="rounded-lg border-2 border-amber-500 bg-gradient-to-br from-amber-950/40 to-slate-950 p-4 flex items-baseline justify-between text-xl">
            <span className="font-bold text-gray-100">
              Sector Sweep — founding rate
            </span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">
              €1,997
            </span>
          </div>
          <p className="text-gray-400 text-xs italic">
            Founding rate is locked through Q4 2026. Cap is 8 Sweeps per
            quarter — Q3 2026 has 7 of 8 slots open as of this page load.
            After 2026 the price moves to €2,997 and the cap stays at 8.
          </p>
          {/* Brunson Expert Secrets Ch 14 — Trial close. */}
          <p className="text-amber-300/80 text-sm italic leading-relaxed pt-2 border-t border-amber-800/40">
            €1,997 against €5,959 of standalone deliverables, with the full
            sum credited if you upgrade to Insider in 60 days. Reasonable?
          </p>
        </section>

        {/* ON THE BUS / OFF THE BUS */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/10 p-5 space-y-3">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              02 · On the bus
            </p>
            <h3 className="text-gray-100 font-bold text-base">
              If this is you, the Sweep was built for you.
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
              {ON_THE_BUS.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-emerald-400 shrink-0">✓</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-xl border border-rose-700/40 bg-rose-950/10 p-5 space-y-3">
            <p className="text-rose-400 text-xs font-semibold uppercase tracking-wider">
              02b · Off the bus
            </p>
            <h3 className="text-gray-100 font-bold text-base">
              If this is you, please don&rsquo;t buy this.
            </h3>
            <ul className="space-y-2 text-gray-300 text-sm leading-relaxed">
              {NOT_ON_THE_BUS.map((t, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-rose-400 shrink-0">✗</span>
                  <span>{t}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* HOW THE BRIEF WORKS */}
        <section className="rounded-xl border border-sky-700/40 bg-sky-950/15 p-6 sm:p-8 space-y-4">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            03 · How the async setter works (no calls, ever)
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            Brief in 7 minutes. Fit assessment in 24 hours. Decision is yours.
          </h2>
          <ol className="space-y-3 text-gray-200 text-sm leading-relaxed">
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold shrink-0 tabular-nums w-6">
                1.
              </span>
              <span>
                You fill the 5-question brief below. Five fields. Takes about
                seven minutes if you already know your sector.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold shrink-0 tabular-nums w-6">
                2.
              </span>
              <span>
                Inside 24 business hours, you receive a written reply: a
                1-page fit assessment, the tailored table of contents we
                propose for your Sweep, the personal Stripe buy link, and an
                honest &ldquo;don&rsquo;t buy this&rdquo; note if your brief
                says the Sweep isn&rsquo;t the right artefact for you.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold shrink-0 tabular-nums w-6">
                3.
              </span>
              <span>
                If you decide to proceed, you click the buy link. Stripe
                Checkout, no resale of the brief details, no auto-charge if
                you don&rsquo;t click. The 14-day delivery clock starts at
                payment.
              </span>
            </li>
            <li className="flex gap-3">
              <span className="text-sky-400 font-bold shrink-0 tabular-nums w-6">
                4.
              </span>
              <span>
                Delivery lands as a single email with the 40-page PDF, the
                CSV, the JSON, and the start of your 14-day async Q&amp;A
                window. Reply with sector-specific questions any time in the
                next 14 days; we answer in writing inside 48 business hours.
              </span>
            </li>
          </ol>
          <p className="text-sky-300/80 text-sm italic leading-relaxed pt-2 border-t border-sky-800/40">
            Async setter, written closer, no calls. Sound fair?
          </p>
        </section>

        {/* THE BRIEF FORM */}
        <section
          id="brief"
          className="space-y-4 scroll-mt-20 border-t-2 border-amber-700/40 pt-10"
        >
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            04 · The brief
          </p>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-100">
            Five questions. Seven minutes. 24-hour reply.
          </h2>
          <p className="text-gray-400 text-sm leading-relaxed">
            We use this to write the fit assessment + draft the tailored
            table of contents. No tracking pixels, no auto-charge, no add-to-
            CRM. The brief lands in <code className="bg-slate-800 px-1.5 py-0.5 rounded text-amber-300 text-xs">signal@gitdealflow.com</code>{" "}
            and stays there until we reply to you directly.
          </p>
          <SectorSweepBriefForm />
        </section>

        {/* GUARANTEE */}
        <section className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 sm:p-8 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
            05 · Risk reversal
          </p>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-100">
            30 days. Three orgs you didn&rsquo;t know. Or it&rsquo;s free.
          </h2>
          <p className="text-gray-300 text-base leading-relaxed">
            If, in your first 30 days after delivery, the Sweep does not
            surface at least three orgs you didn&rsquo;t already know about
            — or if any methodology claim cannot be reproduced from the
            published panel — reply{" "}
            <code className="bg-slate-800 px-1.5 py-0.5 rounded text-emerald-300 text-sm">
              REFUND
            </code>{" "}
            to the delivery email. Full €1,997 refund inside two business
            days. No exit interview.
          </p>
          <p className="text-emerald-300/80 text-sm italic leading-relaxed pt-2 border-t border-emerald-800/40">
            30 days. Three orgs or refund. Fair enough?
          </p>
        </section>

        {/* FAQ */}
        <section className="space-y-5">
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            06 · FAQ
          </p>
          <h2 className="text-2xl font-bold text-gray-100">
            What people ask before submitting the brief.
          </h2>
          {FAQS.map((f, i) => (
            <div key={i} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        {/* TRIAL CLOSE STACK */}
        <section className="space-y-3 border-t border-slate-800 pt-8">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            07 · Two paths from here
          </p>
          <div className="flex flex-col sm:flex-row gap-3">
            <a
              href="#brief"
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-base transition-colors"
            >
              Submit the 7-minute brief →
            </a>
            <a
              href={STRIPE_DIRECT_BUY}
              className="flex-1 inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg border border-slate-600 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-base transition-colors"
            >
              Or skip the brief — €1,997 direct →
            </a>
          </div>
          <p className="text-gray-400 text-xs">
            Or test on one sector for{" "}
            <Link
              href="/firstlook"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              €7 (First Look Pass)
            </Link>{" "}
            — credited toward Dashboard if you upgrade in 14 days.
          </p>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={1} />

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          Funnel framing per <em>DotCom Secrets</em> Ch 18 (Cart Funnels) +
          Ch 23 (Application Funnels) and <em>Expert Secrets</em> Ch 16+17
          (Magic Script / Setter-Closer), Russell Brunson, 2017/2020.
          Implemented under the anonymity rule — async-only setter, written
          closer, pseudonymous handle on every reply. Used under fair-use
          commentary.
        </p>
      </div>
    </>
  );
}
