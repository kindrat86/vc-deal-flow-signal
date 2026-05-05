import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import SharpScarcityBadge from "@/components/SharpScarcityBadge";
import ApplyForm from "./ApplyForm";

export const dynamic = "force-static";

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
        </header>

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
        </section>

        <section className="bg-gradient-to-br from-purple-950/30 via-slate-900 to-slate-950 border border-purple-700/40 rounded-xl p-6 sm:p-8 space-y-6">
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

          <ApplyForm />
        </section>

        <section className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {FAQS.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="text-gray-500 text-sm border-t border-slate-800 pt-5">
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
