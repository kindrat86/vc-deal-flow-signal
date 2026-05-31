import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";

export const dynamic = "force-static";

// Brunson Audit 2026-05-08 — DotCom Secrets Ch 2 (Value Ladder) ding fix.
// Rung 8 of the now-10-rung ladder. Built to respect the anonymity rule:
// no live calls, no founder voice, no in-person attendance. Every
// deliverable is async and licensable.

const APPLY_MAILTO =
  "mailto:signal@gitdealflow.com" +
  "?subject=" +
  encodeURIComponent("Methodology Partnership — application") +
  "&body=" +
  encodeURIComponent(
    [
      "Fund name:",
      "Primary contact:",
      "AUM:",
      "Thesis (one paragraph):",
      "Sectors covered:",
      "Existing data subscriptions:",
      "What you'd build with the regression source if you had it:",
      "What 'success' looks like 12 months from now:",
      "How urgent is this (months / quarters):",
      "",
      "We review applications inside 48 business hours. The Methodology",
      "Partnership is async-only — no live calls, no in-person attendance.",
      "Capped at 5 funds in 2026.",
    ].join("\n"),
  );

const PRICE_LABEL = "€14,997 / year";
const PRICE_NUMBER = "14997.00";

const STACK = [
  {
    label: "Everything in Sharp Tier (€4,970/yr value)",
    value: 4970,
    detail:
      "Quarterly portfolio review brief (async), custom thesis-aligned watchlist, white-labeled API endpoint, methodology source code access, same-day signal questions, data-room exports formatted for LP updates. The full Sharp Tier deliverable, included.",
  },
  {
    label: "Custom Panel Construction — your fund's regression model",
    value: 18000,
    detail:
      "Send your fund's anonymized historical investment outcomes (wins, misses, exits, write-offs). We re-train the panel-construction pipeline on your portfolio and return a fund-specific lead-time model that scores future GitHub-momentum events against your fund's actual returns curve. Standalone analyst-hour equivalent: 120 hours at €150/hr.",
  },
  {
    label: "Bespoke 50-Org Watchlist — monthly rebuild",
    value: 12000,
    detail:
      "Beyond the 109-startup public Dashboard. A 50-org watchlist tuned to your written thesis, rebuilt the first Monday of every month against the live signal feed and pushed to your inbox plus Slack/Discord webhook. Equivalent to 80 hours/yr of senior analyst sourcing time.",
  },
  {
    label: "White-Labeled Fund Subdomain — signal.yourfund.com",
    value: 6000,
    detail:
      "Your fund's subdomain returns the same dataset behind your auth, with your brand. Drop into your CRM (Affinity, Attio, Salesforce), internal dashboards, deal-screening tool, or LP reports. Includes uptime SLA matching the public Dashboard.",
  },
  {
    label: "Quarterly Synthetic Founder Talk — fund-specific",
    value: 8000,
    detail:
      "Four times a year, we render a 6-minute Remotion-built synthetic-voice video on your fund's specific thesis: where the engineering data is heading, what the regression flagged in your watchlist, and one falsifiable prediction for the next quarter. Anonymity-preserving (no founder face), shareable internally for IC prep.",
  },
  {
    label: "Async Methodology Q&A — dedicated channel",
    value: 10800,
    detail:
      "Unlimited written methodology questions via a dedicated email channel. 24-hour weekday turn. Replaces the live-call SLA with an async equivalent — covers signal interpretation, regression questions, methodology forks, and write-up review. ~6 senior analyst hours per month at €150/hr.",
  },
  {
    label: "Quarterly Anonymized Case Study — published",
    value: 3200,
    detail:
      "Each quarter, we co-author a case study using your fund as the (anonymized, attribution-optional) example, published to /press and submitted to industry newsletters. Fund-as-publisher move — your thesis becomes part of the public record without exposing your fund identity. Optional opt-in to named attribution.",
  },
  {
    label: "Annual Methodology Brief — fund-only",
    value: 5000,
    detail:
      "Once a year, a 30-minute synthetic-voice walkthrough plus 40-page PDF brief covering: panel re-construction, regression coefficients with confidence intervals, signal-type performance over twelve months, and the year-ahead methodology roadmap. Distributed only to Methodology Partnership funds.",
  },
  {
    label: "Founding-rate lock — through end of 2027",
    value: 14997,
    detail:
      "The Methodology Partnership rate goes to €29,997/yr after 2026. Funds joining in 2026 keep €14,997/yr through the end of 2027 as long as the partnership stays active. The rate is a relationship anchor, not a discount window.",
  },
] as const;

const TOTAL_VALUE = STACK.reduce((s, x) => s + x.value, 0);

const FAQS = [
  {
    q: "What does 'async-only' mean in practice?",
    a: "No live calls, no Zoom, no in-person attendance, no founder voice on a recording. Every deliverable is text, PDF, dataset, or synthetic-voice video. Methodology Q&A runs through a dedicated email channel with 24-hour weekday turn. The constraint is the founder anonymity rule — and it forces every deliverable to be licensable, archivable, and reviewable on the fund's own time. If your fund's diligence process requires a live partner-to-partner call, we are not the right vendor.",
  },
  {
    q: "What does 'custom panel construction' actually deliver?",
    a: "You send anonymized historical investment outcomes — round dates, sector tags, outcome labels (success / write-off / hold), and any internal scoring you used. We rebuild the panel-construction pipeline on your portfolio: same regression methodology as the public SSRN paper, retrained on your fund's actual returns curve. The output is a fund-specific lead-time score that grades every flagged signal against the regression your fund would have benefited from, had it existed three years ago. The model code, the regression coefficients, and the audit trail are all yours under a fund-only license.",
  },
  {
    q: "Why €14,997 and not €4,997 or €49,997?",
    a: "Three anchors. (1) The Sharp Tier at €4,970/yr is what a fund pays for the productized version of this — same data, no custom regression, no fund-branded subdomain, no quarterly founder talk. The €14,997 is roughly 3× Sharp because the deliverables are bespoke, not productized. (2) Equivalent fund-as-case-study work from a name-brand methodology consultancy quotes €60,000–€120,000/year. We undercut that on margin, not on quality. (3) The next rung up — the Vault — is €49,997/yr and includes co-development access, pre-publication paper preview, and signal-of-the-quarter co-invest alerts. €14,997 sits exactly between productized and partnership-grade.",
  },
  {
    q: "Why is this capped at 5 funds in 2026?",
    a: "Two reasons. (1) The custom regression work is real founder-engineering time — even on async-only delivery, every additional fund adds 80–120 hours of pipeline work over the first three months. Five is the ceiling at which we can guarantee the 24-hour Q&A SLA without dropping quality. (2) Cap creates the scarcity that makes the founding rate hold. After 2026 the cap rises to 8 and the rate moves to €29,997/yr. Founding-rate funds keep €14,997/yr through end of 2027.",
  },
  {
    q: "How does this compare to commissioning a Sector Sweep?",
    a: "The €1,997 Sector Sweep is one-time, written, narrative-led, and covers one sector you pick. The Methodology Partnership is twelve months, custom-coded, regression-driven, and covers your entire portfolio plus a 50-org bespoke watchlist that rebuilds monthly. Most Methodology Partnership funds first commission a Sweep on their highest-conviction sector, validate the signal quality matches their thesis, then upgrade. Sweep is the proof-of-fit; Methodology Partnership is the relationship.",
  },
  {
    q: "What disqualifies an application?",
    a: "(1) Reselling the data wholesale — we license to one fund per agreement, not OEM. (2) Funds whose primary thesis is reselling alternative data. (3) Anything that would compromise the founder's anonymity (live in-person calls, named-attribution publications featuring the founder, photos, podcast appearances). (4) Funds requesting a per-deal sourcing fee — the Partnership is a flat-rate license, not a finders-fee structure. We turn down roughly one in three applications on these grounds; written reasons are always provided.",
  },
  {
    q: "What's the upgrade path to the Vault (€49,997/yr)?",
    a: "Methodology Partnership funds can upgrade to the Vault any time during the 12-month engagement. The Partnership rate is credited 1:1 toward the Vault rate (so a fund 6 months into Partnership pays €49,997 minus €7,499 prorated = €42,498 to upgrade). The Vault adds co-development access (your analysts submit signal hypotheses to the pipeline), pre-publication preview of next year's SSRN successor paper, 72-hour signal head-start over the public Dashboard, and annual private methodology summit. Capped at 2 funds in 2026.",
  },
] as const;

export const metadata: Metadata = {
  title:
    "Methodology Partnership — €14,997/yr · Custom regression on your fund's thesis",
  description:
    "Done-with-you methodology engagement for active VC funds. Custom panel construction trained on your portfolio, bespoke 50-org watchlist, white-labeled fund subdomain, quarterly synthetic founder talk, async-only methodology Q&A. Capped at 5 funds in 2026. €14,997/yr founding rate.",
  alternates: { canonical: "/methodology-partnership" },
  openGraph: {
    title: "Methodology Partnership — €14,997/yr · GitDealFlow",
    description:
      "Custom regression on your fund's portfolio. Bespoke watchlist. Async-only. Capped at 5 funds in 2026.",
    url: "https://signals.gitdealflow.com/methodology-partnership",
    type: "article",
  },
};

export default function MethodologyPartnershipPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id":
          "https://signals.gitdealflow.com/methodology-partnership#webpage",
        url: "https://signals.gitdealflow.com/methodology-partnership",
        name: "Methodology Partnership — €14,997/yr · VC Deal Flow Signal",
        isAccessibleForFree: true,
      },
      {
        "@type": "Service",
        "@id":
          "https://signals.gitdealflow.com/methodology-partnership#service",
        name: "Methodology Partnership",
        serviceType: "Investment research and custom regression methodology",
        description:
          "Twelve-month done-with-you engagement: custom panel construction trained on your fund's anonymized portfolio outcomes, bespoke 50-org watchlist with monthly rebuild, white-labeled fund subdomain, quarterly synthetic founder talk, async-only methodology Q&A. Capped at 5 funds in 2026.",
        provider: { "@id": "https://gitdealflow.com/#organization" },
        offers: {
          "@type": "Offer",
          name: "Methodology Partnership — annual",
          price: PRICE_NUMBER,
          priceCurrency: "EUR",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/LimitedAvailability",
          url: "https://signals.gitdealflow.com/methodology-partnership",
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            maxValue: 5,
            unitText: "year",
          },
        },
      },
      {
        "@type": "ItemList",
        "@id":
          "https://signals.gitdealflow.com/methodology-partnership#stack",
        name: "Methodology Partnership — value stack",
        itemListOrder: "https://schema.org/ItemListOrderDescending",
        numberOfItems: STACK.length,
        itemListElement: STACK.map((s, i) => ({
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
            name: "Pricing",
            item: "https://signals.gitdealflow.com/pricing",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Methodology Partnership",
            item: "https://signals.gitdealflow.com/methodology-partnership",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/methodology-partnership"
        languages={getHreflangLanguages("/methodology-partnership")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/methodology-partnership" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-violet-400 text-xs font-medium uppercase tracking-wider">
            Rung 8 · Done-with-you · Capped at 5 funds in 2026
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Your fund&rsquo;s portfolio.{" "}
            <span className="text-violet-400">
              Our regression engine. Twelve months.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The Sharp Tier (€4,970/yr) gives you the productised version of
            our signal. The Methodology Partnership goes one rung higher: we
            re-train the regression on your fund&rsquo;s anonymized portfolio,
            ship a bespoke 50-org watchlist that rebuilds monthly, and run a
            white-labeled fund subdomain at <code>signal.yourfund.com</code>.
            Async-only. No live calls, no founder voice. €14,997/yr,
            founding rate locked through end of 2027.
          </p>
        </header>

        <aside
          aria-label="Why a fund pays €14,997 instead of €4,970"
          className="rounded-xl border border-violet-700/40 bg-violet-950/15 p-5 sm:p-6 space-y-2"
        >
          <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            The single belief
          </p>
          <h2 className="text-gray-100 font-bold text-lg sm:text-xl leading-snug">
            A regression trained on{" "}
            <em>your portfolio</em> outperforms a regression trained on the
            public panel.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            The SSRN paper&rsquo;s 21–47-day lead time was measured against
            the public 219-startup panel. Funds with five-plus years of their
            own outcomes (wins, write-offs, exits) carry private signal that
            the public regression cannot see. The Methodology Partnership
            trains the same regression on your data and gives you the
            fund-specific lead-time score &mdash; plus the source code to
            re-run it whenever your portfolio updates.
          </p>
        </aside>

        <section
          aria-labelledby="stack-heading"
          className="space-y-4"
        >
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <h2
              id="stack-heading"
              className="text-gray-100 font-semibold text-2xl"
            >
              What&rsquo;s in the partnership
            </h2>
            <p className="text-violet-400 text-sm font-mono">
              Total stack value: €{TOTAL_VALUE.toLocaleString("en-US")} / year
            </p>
          </div>
          <ol className="space-y-4">
            {STACK.map((item, i) => (
              <li
                key={item.label}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <div className="flex items-baseline justify-between gap-3 mb-2 flex-wrap">
                  <h3 className="text-gray-100 font-semibold text-base sm:text-lg leading-snug">
                    <span className="text-violet-400 mr-2">{i + 1}.</span>
                    {item.label}
                  </h3>
                  <span className="text-violet-300 text-sm font-mono shrink-0">
                    €{item.value.toLocaleString("en-US")}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
          <div className="rounded-xl border border-violet-600/40 bg-gradient-to-br from-violet-950/40 to-slate-900 p-5 sm:p-6">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
              Total value
            </p>
            <p className="text-gray-100 text-2xl font-bold mb-2 line-through opacity-60">
              €{TOTAL_VALUE.toLocaleString("en-US")} / year
            </p>
            <p className="text-violet-400 text-3xl font-bold mb-1">
              {PRICE_LABEL}
            </p>
            <p className="text-gray-400 text-xs">
              Founding-rate, locked through end of 2027. Going to €29,997/yr
              for funds joining 2027+.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="apply-heading"
          className="rounded-xl border border-violet-700/40 bg-violet-950/15 p-6 sm:p-8 space-y-4"
        >
          <h2
            id="apply-heading"
            className="text-gray-100 font-semibold text-xl sm:text-2xl"
          >
            Apply for the Methodology Partnership
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Application is by structured email. We respond inside 48 business
            hours with either an invoice + onboarding pack or a written
            decline reason. The application is free and never auto-converts
            to a charge.
          </p>
          <a
            href={APPLY_MAILTO}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-violet-600 hover:bg-violet-500 text-white font-semibold transition-colors shadow-sm shadow-violet-500/30"
          >
            Email an application →
          </a>
          <p className="text-gray-400 text-xs">
            Mail goes to{" "}
            <code className="text-gray-300">signal@gitdealflow.com</code>.
            Subject and body are pre-filled with the diligence template.
          </p>
        </section>

        <section aria-labelledby="faq-heading" className="space-y-4">
          <h2
            id="faq-heading"
            className="text-gray-100 font-semibold text-2xl"
          >
            Frequently asked
          </h2>
          <ol className="space-y-4">
            {FAQS.map((f) => (
              <li
                key={f.q}
                className="rounded-xl border border-slate-800 bg-slate-900/60 p-5"
              >
                <h3 className="text-gray-100 font-semibold text-base mb-2 leading-snug">
                  {f.q}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </li>
            ))}
          </ol>
        </section>

        <nav
          aria-label="Pricing ladder context"
          className="rounded-xl border border-slate-800 bg-slate-900/60 p-5 text-sm"
        >
          <p className="text-gray-400 mb-2 text-xs uppercase tracking-wider font-semibold">
            Where this sits on the ladder
          </p>
          <p className="text-gray-300 leading-relaxed">
            Below: the{" "}
            <Link
              href="/pricing#sharp-tier"
              className="text-violet-400 hover:text-violet-300 underline decoration-dotted"
            >
              Sharp Tier (€4,970/yr)
            </Link>{" "}
            — productised, no custom regression. Above: the{" "}
            <Link
              href="/vault"
              className="text-violet-400 hover:text-violet-300 underline decoration-dotted"
            >
              Vault (€49,997/yr)
            </Link>{" "}
            — adds co-development, pre-publication paper preview, 72-hour
            signal head-start, capped at 2 funds. See the{" "}
            <Link
              href="/pricing"
              className="text-violet-400 hover:text-violet-300 underline decoration-dotted"
            >
              full ten-rung ladder
            </Link>
            .
          </p>
        </nav>
      </div>
    </>
  );
}
