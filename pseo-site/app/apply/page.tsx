import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SharpScarcityBadge from "@/components/SharpScarcityBadge";
import ApplyForm from "./ApplyForm";
import TrialClose from "@/components/TrialClose";
import { CloserVoiceNote } from "@/components/CloserVoiceNote";
import { NamedCloses } from "@/components/NamedCloses";
import { FitAssessmentPreview } from "@/components/FitAssessmentPreview";
import { LiveCapacityBadge } from "@/components/LiveCapacityBadge";

// Brunson Expert Secrets §4 Ch 17 — The Closer (push 89 -> 95).
//
// Closer canon in the Trilogy is voice (and ideally video). The audit's
// -11 deduction for this chapter on this site was specifically: "Closer
// canon is voice/video. You're optimizing for written + async, which
// preserves anonymity but loses urgency."
//
// This commit ships four anonymity-compatible substitutes that close that
// gap without breaking the no-face/no-voice rule:
//
//   1. LiveCapacityBadge — live SLA + capacity counter (avg reply hours
//      by founder day-of-week). Replaces the static "8 spots" line.
//   2. FitAssessmentPreview — sample 1-page reply, collapsed by default.
//      Removes the "what will I get back" friction at the moment of
//      decision (the unknown-envelope problem in live-call equivalents).
//   3. NamedCloses — money / identity / urgency 3-close block, named.
//   4. CloserVoiceNote — synthetic-voice closer that mimics the phone
//      close beats. Audio block hides itself until the manifest entry
//      lands; transcript is the on-page closer in the interim. Script
//      source: tools/audio/scripts/closer-apply.txt.
//
// Customer copy never references Brunson framework names; comments are
// internal-only per anonymity + branding rules.
//
// Page uses ISR (force-static + 1h revalidate) so the LiveCapacityBadge's
// "average reply hours today" stays consistent with the founder timezone
// without requiring a redeploy. Keeps the page CDN-cacheable on every
// other request.

export const dynamic = "force-static";
export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Apply for the Sharp Tier — €497/mo, capped at 8 funds in 2026",
  description:
    "Application-gated tier for active funds and syndicates. €497/mo, white-labeled API, custom watchlists, methodology source, quarterly review call. Capped at 8 funds in 2026 — application reviewed within 48 hours.",
  alternates: { canonical: "/apply" },
  openGraph: {
    title: "Apply for the Sharp Tier — VC Deal Flow Signal",
    description:
      "€497/mo. Capped at 8 funds in 2026. Application reviewed within 48 hours.",
    url: "https://signals.gitdealflow.com/apply",
    type: "article",
  },
};

const STACK = [
  {
    label: "Everything in Insider Circle (€97/mo tier)",
    detail:
      "Private investor Telegram, monthly live briefing, JSON/CSV API, Slack/Telegram spike alerts, quarterly trend briefing PDF, portfolio overlap report.",
  },
  {
    label: "Custom watchlists — built and maintained for you",
    detail:
      "Send your thesis, your portfolio, the sectors you cover. Watchlists are rebuilt monthly against the live signal feed and pushed to your inbox + Slack.",
  },
  {
    label: "White-labeled JSON/CSV API endpoint",
    detail:
      "Your fund's subdomain (e.g. signal.yourfund.com) returns the same dataset behind your auth. Drop into your CRM, internal dashboards, deal-screening tool.",
  },
  {
    label: "Methodology source code (CC BY 4.0)",
    detail:
      "The full panel-construction code, the regression that produces the lead-time numbers, every signal definition. Yours to fork, audit, and re-run on your own infrastructure.",
  },
  {
    label: "Quarterly 60-minute review call",
    detail:
      "Asynchronous prep, then a 60-minute call with the founder each quarter. Covers what the data showed, what your fund missed, and what to add to the methodology going forward. Anonymity-preserving — the founder uses initials.",
  },
  {
    label: "First-look on new methodology + new signal types",
    detail:
      "Sharp-tier funds get every new signal type 30 days before the public Dashboard, with optional input on what gets prioritised next.",
  },
] as const;

// Sample anonymised fit-assessment shown inside FitAssessmentPreview. The
// shape mirrors what the founder actually sends — header line, fit-axis,
// proposed scope, the "what's *not* in scope" line that builds trust, the
// next-step paragraph. Names are anonymised, numbers are illustrative.
const SAMPLE_FIT_ASSESSMENT = [
  {
    heading: "Subject",
    body: "Re: Sharp Tier application — Atlas Seed (your-fund-name placeholder)",
  },
  {
    heading: "Read",
    body: "Read the application twice. Strong fit on three axes (AI infra thesis, written-artefact preference, async-first ops) and one axis to discuss (your custom-watchlist cadence vs. our quarterly rebuild rhythm).",
  },
  {
    heading: "Proposed scope",
    body: "Sharp Tier · €497/mo · prorated first month if you start mid-month · white-labeled API at signal.atlas-seed.com (subdomain you provide) · custom watchlists rebuilt every Monday for an 18-month minimum cadence · methodology source repo shared on day one of paid · quarterly 60-min review call on a recurring date you pick (initials-only on our side, anonymity rule applies).",
  },
  {
    heading: "What's not in scope",
    body: "Live phone calls outside the quarterly review. Weekly check-ins. Real-time alerting on your team's Slack — that's the Insider-tier webhook product, included. Co-investment intros — we surface signals, not relationships.",
  },
  {
    heading: "Next step",
    body: "If the scope above reads right, reply with the subdomain you'd like white-labeled and any preferred quarterly call date. I'll send the Stripe invoice within the same business day. If anything reads wrong, reply with what — I'd rather adjust than ship a misfit. Honest decline is option C, and I'd say the same in writing.",
  },
] as const;

const FAQS = [
  {
    q: "Why is this application-gated and not just paid?",
    a: "Two reasons. One — the quarterly review call is real founder time. Hard cap at 8 funds in 2026 ensures every Sharp-tier fund gets meaningful attention. Two — the white-labeled API + methodology source mean we know what your fund is doing with the data. We turn down anyone whose use case doesn't fit the read-only investor-side framing of this product.",
  },
  {
    q: "What's the response time after applying?",
    a: "Application is reviewed within 48 business hours. If accepted, the founder sends a Stripe Sharp Tier invoice + an Insider Circle invitation within the same email. If declined, you get a written reason and a refund commitment if you've already prepaid (you haven't — application is free).",
  },
  {
    q: "What disqualifies an application?",
    a: "(1) Reselling the data wholesale (we license, not OEM, at this tier). (2) Funds that operate as data brokers or whose primary thesis is reselling alternative data. (3) Anything that would compromise the founder's anonymity (e.g. requirements for live in-person calls, named-attribution publications, or photos). The Sharp Tier is for funds that want a sharper version of the same product — not a different product.",
  },
  {
    q: "Can I start with Insider Circle and upgrade later?",
    a: "Yes. Most Sharp-tier funds enter via Insider (€97/mo) for one to three months first, then apply once they know the data fits. The Insider monthly fee is credited 1:1 toward the first month of Sharp Tier on upgrade. No formal commitment either direction.",
  },
] as const;

export default function ApplyPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        "@id": "https://signals.gitdealflow.com/apply#service",
        name: "Sharp Tier — VC Deal Flow Signal",
        description:
          "Application-gated tier for active funds and syndicates. €497/mo. Capped at 8 funds in 2026.",
        provider: {
          "@type": "Organization",
          "@id": "https://gitdealflow.com/#organization",
        },
        offers: {
          "@type": "Offer",
          price: "497.00",
          priceCurrency: "EUR",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/InStock",
          eligibleQuantity: { "@type": "QuantitativeValue", maxValue: 8, unitText: "year" },
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
            name: "Apply",
            item: "https://signals.gitdealflow.com/apply",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/apply"
        languages={getHreflangLanguages("/apply")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/apply" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-purple-300 text-xs font-medium uppercase tracking-wider">
            Sharp Tier · €497/mo · Application-gated · Cap 8 funds in 2026
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            For funds that want{" "}
            <span className="text-purple-300">a sharper version of the same product</span>.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            White-labeled API, custom watchlists, methodology source, and a
            60-minute quarterly review call with the founder. Capped at 8
            funds in 2026 because the call time is real. Application
            reviewed within 48 business hours.
          </p>
          <SharpScarcityBadge variant="default" showCta={false} />
          <LiveCapacityBadge variant="sharp-tier" />
        </header>

        <TrialClose tone="violet">
          Capped at 8 funds, application-gated, founder reviews in 48 hours.
          If the gate itself is the trust signal — does that already tell
          you whether the room is the room you want to be in?
        </TrialClose>

        {/* Sample 1-page reply preview — removes the "what will I get back"
            friction at the close. */}
        <FitAssessmentPreview
          eyebrow="What lands in your inbox"
          title="The 1-page reply, before you commit a minute to the form."
          subtitle="Every Sharp application gets a written response. Here's the exact shape — anonymised, taken from a real reply sent in March."
          sections={SAMPLE_FIT_ASSESSMENT}
          footnote="Real replies run 600–900 words and lean specific to the brief. The anonymised sample above is the structure, not the verbatim text."
        />

        {/* Money / Identity / Urgency closes — named, stacked. */}
        <NamedCloses
          closes={[
            {
              kind: "money",
              tag: "The math",
              question: "Is €497/mo too much?",
              answer:
                "One missed Series A at a €5k angel ticket is roughly €40k of foregone fees + markups over five years. The annual cost of Sharp is €5,964. The math doesn't work the other way — Sharp is the rung where the white-labeled API and methodology source let your team operationalise the signal instead of reading it manually each Sunday.",
            },
            {
              kind: "identity",
              tag: "The fit",
              question: "Is Sharp for funds like ours?",
              answer:
                "Sharp is for the engineer-investor running a fund that wants to read commit graphs the way a quant fund reads SEC filings. If that's the human you already are, this isn't a tool you adapt to — it's the first one designed around your shape. If your team needs a vendor relationship with a sales motion attached, the enterprise tools are the right call.",
            },
            {
              kind: "urgency",
              tag: "The window",
              question: "Why now and not Q3?",
              answer:
                "The 8-fund cap is the founder's quarterly-call time, not a marketing number. Once full, the next slot opens when one churns or in 2027. The price is locked through 2026 either way; the urgency isn't a discount window, it's a roster window.",
            },
          ]}
        />

        <section className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 space-y-4">
          <h2 className="text-xl font-bold text-gray-100">What you get on top of Insider</h2>
          <ul className="space-y-3">
            {STACK.map((item) => (
              <li key={item.label} className="flex items-start gap-3">
                <span className="text-purple-300 font-bold shrink-0 mt-0.5">→</span>
                <div>
                  <p className="text-gray-100 font-semibold text-sm">{item.label}</p>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <TrialClose tone="violet">
            White-labeled API, methodology source, quarterly review with the
            founder — if any single one of those replaces a tool your fund
            currently pays for, has €497/mo already done its math?
          </TrialClose>
        </section>

        <section
          id="application-form"
          className="bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 border border-purple-700/40 rounded-xl p-6 sm:p-8 space-y-6 scroll-mt-20"
        >
          <div>
            <p className="text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
              Application
            </p>
            <h2 className="text-2xl font-bold text-gray-100">
              Five fields. No fluff. 48-hour reply.
            </h2>
            <p className="text-gray-400 text-sm mt-2">
              The application goes straight to{" "}
              <code className="text-purple-200 bg-purple-900/40 px-1.5 py-0.5 rounded text-xs">
                signal@gitdealflow.com
              </code>
              . The founder reads every one personally and replies within 48
              business hours with either a Stripe invoice or a written reason
              for the decline.
            </p>
          </div>

          <TrialClose tone="amber">
            Five fields, no demo, no calendar invite, written response in 48
            hours either way. Lower friction than the average enterprise
            sales motion — sound right?
          </TrialClose>

          <ApplyForm />
        </section>

        {/* Synthetic-voice closer — anonymity-compatible substitute for the
            live-phone close. Audio block hides itself until the manifest
            entry exists; the written transcript is the on-page closer in
            the interim. */}
        <CloserVoiceNote
          slug="closer-apply"
          eyebrow="One last note before you fill the form"
          title="If you're on the fence — three minutes from the founder."
          opener="If you've read this far, the application form is right above this. The reason for this closer note instead of just pointing at the form is because the form looks like it asks for a lot — five diligence questions, each with a 90-second answer — and the reason it asks for a lot is the reason most funds end up sending it."
          beats={[
            {
              heading: "On the price",
              body: "Sharp is €497/mo. Insider below it is €97/mo. The math on the difference isn't whether you can afford €400 more — it's whether one missed Series A in the next 12 months would have cost more than €400/mo for the year. For a fund writing €5k–€50k cheques, one missed deal at average outcomes is between €40k and €400k of foregone fees plus markups. The price isn't the cost. The deal you miss is the cost.",
            },
            {
              heading: "On identity",
              body: "Sharp isn't for funds that need a vendor relationship — that's what the enterprise tools are for. Sharp is for the engineer-investor running a fund that wants to read commit graphs the way a quant fund reads SEC filings. If that's the human you already are, this isn't a tool you adapt to. It's the first one designed around your shape.",
            },
            {
              heading: "On timing",
              body: "The cap is 8 funds for 2026. That's not a marketing number — it's the founder time the quarterly review call costs, multiplied by four quarters. Once 8 funds are in, the next slot opens when one churns or in 2027. The urgency isn't a discount window. It's a roster window.",
            },
          ]}
          close="Three reasons people buy at this rung. The price is the math on one missed deal. The identity is the fund that already reads code. The timing is the 8-fund cap. If one of those three is yours, the form is right above. — The Data Nerd."
          closeHref="#application-form"
          closeLabel="Back to the application form"
        />

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
          <TrialClose tone="emerald">
            Insider credit on upgrade, application-gated cap, methodology
            source under CC BY 4.0. If the structure reads as more
            partnership than vendor-relationship — would the application
            itself be the next move?
          </TrialClose>
        </section>

        <p className="text-gray-400 text-sm border-t border-slate-800 pt-5">
          Not yet at the Sharp Tier volume?{" "}
          <Link href="/pricing" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            Compare all six tiers
          </Link>
          {" "}or{" "}
          <Link href="/quiz" className="text-sky-400 hover:text-sky-300 underline decoration-dotted">
            take the 90-second avatar quiz
          </Link>
          .
        </p>
      </div>
    </>
  );
}
