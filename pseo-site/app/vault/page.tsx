import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { withEditorialOverride } from "@/lib/metadata";

export const dynamic = "force-static";

// Brunson Audit 2026-05-08, top rung. The Vault is the analogue of
// Brunson's "Two Comma Club X" / inner-circle tier, redesigned for the
// anonymity rule: no live coaching, no in-person summit, no founder voice.
// Every deliverable is async, licensable, and reproducible.

const APPLY_MAILTO =
  "mailto:signals@gitdealflow.com" +
  "?subject=" +
  encodeURIComponent("Vault, application") +
  "&body=" +
  encodeURIComponent(
    [
      "Fund name:",
      "Primary contact:",
      "AUM:",
      "Thesis (one paragraph):",
      "Sectors covered:",
      "Existing data subscriptions and methodology investments:",
      "Co-development capacity (analysts/engineers who would submit signal hypotheses):",
      "Existing relationship with our team (Sharp Tier? Methodology Partnership?):",
      "What 'success' looks like 12 months from now:",
      "How urgent is this (months / quarters):",
      "",
      "Vault applications are reviewed within 5 business days. The Vault is",
      "async-only, no live calls, no in-person attendance, no founder voice",
      "on any recording. Capped at 2 funds in 2026.",
    ].join("\n"),
  );

const PRICE_LABEL = "€49,997 / year";
const PRICE_NUMBER = "49997.00";

const STACK = [
  {
    label: "Everything in Methodology Partnership (€68,000+ stack value)",
    value: 68000,
    detail:
      "Sharp Tier baseline, custom panel construction trained on your portfolio, bespoke 50-org watchlist with monthly rebuild, white-labeled fund subdomain, quarterly synthetic founder talk, async methodology Q&A, quarterly anonymized case study, annual fund-only methodology brief. The full Methodology Partnership stack, included.",
  },
  {
    label: "Co-Development Access, submit signal hypotheses to the pipeline",
    value: 36000,
    detail:
      "Your fund's analysts and engineers submit signal hypotheses (e.g., 'Does maintainer churn predict acquisition?') to the panel-construction pipeline. We run them, return the regression output, and integrate the validated ones into your fund-specific model. Approximately 24 senior-engineering hours per month at €150/hr equivalent.",
  },
  {
    label: "Pre-Publication SSRN Preview, 6 months early",
    value: 20000,
    detail:
      "Read next year's SSRN successor paper six months before public release. Includes draft methodology, preliminary regression coefficients, and the new signal types being evaluated for the next public Dashboard. Vault funds also receive co-author byline credit on opt-in (anonymity-respecting, initials only, no fund logo).",
  },
  {
    label: "72-Hour Signal Head-Start over public Dashboard",
    value: 18000,
    detail:
      "Every signal flagged by the regression is delivered to Vault funds 72 hours before it appears on the public Dashboard. Twelve flags per year on average; each flag has historically preceded fundraise announcements by 21-47 days. Conservative valuation: €1,500 per flag of additional time-to-act.",
  },
  {
    label: "Annual Methodology Summit, async, fund-branded artifacts",
    value: 15000,
    detail:
      "Once a year, an 8-hour async methodology summit: Remotion-rendered keynote tracks, fund-branded artifact pack, downloadable workbook, and a private dataset cut. No live attendance, Vault funds consume the summit on their own time over 1-4 weeks. Equivalent live-summit attendance from comparable methodology consultancies: €15,000-€25,000/seat.",
  },
  {
    label: "Methodology Source Repo, fund-only fork license",
    value: 60000,
    detail:
      "Private fork of the entire methodology source repository. Panel construction code, regression engine, signal-type definitions, ETL pipeline, and the build harness for the founder-talk generator. MIT-license to your fund only, fork, audit, run on your own infrastructure, integrate into your CRM. Re-distribution prohibited; all updates pushed to your fork for the duration of the engagement.",
  },
  {
    label: "Signal-of-the-Quarter Co-Investment Alerts",
    value: 36000,
    detail:
      "Four times a year, the regression flags one signal as the 'Signal of the Quarter', the highest-conviction event of the period. Vault funds receive a dedicated written analysis (8-12 pages), the underlying GitHub deltas, and a co-investment readiness check (term sheet ready / IC-prep ready). Conservative valuation: €9,000 per quarter of risk-adjusted sourcing intelligence.",
  },
  {
    label: "Founding-rate lock, through end of 2028",
    value: 49997,
    detail:
      "Vault rate goes to €99,997/yr after 2026. Funds joining in 2026 keep €49,997/yr through end of 2028 as long as the engagement stays active. The rate is structured to make Vault the right rung for funds that intend to license the methodology long-term, not for one-cycle subscribers.",
  },
] as const;

const TOTAL_VALUE = STACK.reduce((s, x) => s + x.value, 0);

const FAQS = [
  {
    q: "Why is the Vault €49,997 and not higher?",
    a: "Three anchors. (1) The Methodology Partnership is €14,997/yr, the Vault is roughly 3.3× that, with co-development access, pre-publication paper preview, 72-hour signal head-start, and the full methodology source repo as the differentiator. (2) Equivalent fund-as-research-partner engagements from name-brand methodology consultancies quote €100,000-€300,000/year. We undercut on margin, not on quality. (3) The cap of 2 funds in 2026 means the engagement stays sustainable at €49,997, beyond that, founder-engineering time becomes the bottleneck and the rate would need to climb to €100,000+ to maintain quality. The 2027 rate is €99,997/yr; 2026 funds keep €49,997 through end of 2028.",
  },
  {
    q: "What does 'co-development access' mean concretely?",
    a: "Your fund's analysts and engineers submit signal hypotheses to a private intake form. Examples we've already validated for partner funds: 'Does maintainer churn (defined as top-3 contributor exit within 60 days) predict acquisition?' or 'Does cross-org commit overlap predict M&A within the next 12 months?' We run the hypothesis against the live panel, return regression output (coefficients, p-values, lead-time distribution, replication code), and integrate the statistically-significant ones into your fund's bespoke model. Approximately 24 senior-engineering hours per month, with no per-hypothesis cap below that ceiling.",
  },
  {
    q: "How does the SSRN pre-publication preview work?",
    a: "We submit a successor preprint to SSRN annually (Q3 each year) building on the 219-startup panel from the original paper. Vault funds receive the draft six months before public release: methodology section, preliminary results, regression coefficients, and the new signal types being evaluated. Vault funds may submit one signal-type proposal that gets reviewed for inclusion in the public paper, with author-credit (initials-only) on opt-in. The pre-publication preview is shared under embargo, no public re-posting until the SSRN release date.",
  },
  {
    q: "What does the 72-hour signal head-start actually deliver?",
    a: "Every signal flagged by the regression as decision-grade (~12/year on average) is pushed to Vault funds via webhook + email 72 hours before it appears on the public Dashboard. Each flag includes the underlying GitHub deltas, contributor-influx data, regression confidence, and a written interpretation. Public-Dashboard subscribers see the same flag 72 hours later. The lead time matters most when a flag fires on a venture-backed company that the consensus deal-flow tools have not yet indexed; in that window, a Vault fund can run diligence and reach out before the round closes.",
  },
  {
    q: "What's the methodology source license, exactly?",
    a: "A private fork of the methodology repository, MIT-licensed to your fund only. You receive: the panel-construction code, the regression engine, signal-type definitions, the ETL pipeline that pulls public GitHub data, and the build harness for the founder-talk generator. You can fork, audit, run on your own infrastructure, modify, and integrate into your CRM. You cannot re-distribute, sublicense, or open-source the fork. Updates are pushed to your fork for the duration of the engagement; on engagement end, your fork stays read-only at the last delivered commit. The license is anonymity-preserving, there is no individual contributor attribution required from your end.",
  },
  {
    q: "What disqualifies an application?",
    a: "(1) Reselling the methodology or data, Vault is single-fund license, not OEM. (2) Funds whose primary thesis is reselling alternative data. (3) Anything that would compromise the founder's anonymity (live in-person summit attendance, named-attribution publications featuring the founder by name, podcast appearances). (4) Funds requesting a per-deal sourcing fee or revenue share, the Vault is a flat-rate license, not a finders-fee structure. (5) Funds without an existing Sharp Tier or Methodology Partnership relationship are deprioritized, most Vault funds enter via Methodology Partnership for 6-12 months first. We turn down roughly half of net-new Vault applications on these grounds.",
  },
  {
    q: "Is there anything above the Vault?",
    a: "Not as a productised tier. Funds with deeper requirements, multi-year exclusive license to the methodology, dedicated engineering time, custom signal-type R&D, or co-publication of a fund-specific industry report, should email signal at gitdealflow dot com for a scoped proposal. We have done this once, for a single fund, in 2025. The Vault is the right rung for the overwhelming majority of fund partnerships; the bespoke proposal exists for genuinely outlier needs.",
  },
] as const;

export const metadata: Metadata = withEditorialOverride({
  title:
    "The Vault, €49,997/yr · Co-development, pre-publication SSRN, 72h signal head-start",
  description:
    "Top-rung research partnership for active VC funds. Co-development access to the panel-construction pipeline, pre-publication SSRN preview, 72-hour signal head-start, methodology source repo (fund-only license). Async-only, anonymity-preserving. Capped at 2 funds in 2026. €49,997/yr founding rate.",
  alternates: { canonical: "/vault" },
  openGraph: {
    title: "The Vault, €49,997/yr · GitDealFlow",
    description:
      "Top rung. Methodology source license. 72-hour signal head-start. Capped at 2 funds in 2026.",
    url: "https://signals.gitdealflow.com/vault",
    type: "article",
  },
});

export default function VaultPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/vault#webpage",
        url: "https://signals.gitdealflow.com/vault",
        name: "The Vault, €49,997/yr · VC Deal Flow Signal",
        isAccessibleForFree: true,
      },
      {
        "@type": "Service",
        "@id": "https://signals.gitdealflow.com/vault#service",
        name: "The Vault",
        serviceType:
          "Investment research partnership, methodology source license, co-development, pre-publication research access",
        description:
          "Twelve-month research partnership for active VC funds. Includes everything in the Methodology Partnership, plus: co-development access to the panel-construction pipeline, pre-publication SSRN preview six months early, 72-hour signal head-start over public Dashboard, annual async methodology summit, methodology source repo (fund-only fork license), Signal-of-the-Quarter co-investment alerts. Async-only, anonymity-preserving. Capped at 2 funds in 2026.",
        provider: { "@id": "https://gitdealflow.com/#organization" },
        offers: {
          "@type": "Offer",
          name: "The Vault, annual",
          price: PRICE_NUMBER,
          priceCurrency: "EUR",
          priceValidUntil: "2026-12-31",
          availability: "https://schema.org/LimitedAvailability",
          url: "https://signals.gitdealflow.com/vault",
          eligibleQuantity: {
            "@type": "QuantitativeValue",
            maxValue: 2,
            unitText: "year",
          },
        },
      },
      {
        "@type": "ItemList",
        "@id": "https://signals.gitdealflow.com/vault#stack",
        name: "The Vault, value stack",
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
            name: "The Vault",
            item: "https://signals.gitdealflow.com/vault",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/vault"
        languages={getHreflangLanguages("/vault")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/vault" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          <p className="text-amber-400 text-xs font-medium uppercase tracking-wider">
            Rung 9 · Top of the ladder · Capped at 2 funds in 2026
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            The methodology source.{" "}
            <span className="text-amber-400">
              The 72-hour head-start. Two funds.
            </span>
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            The Vault is the top rung. Methodology Partnership funds have the
            regression trained on their portfolio. Vault funds have the
            regression trained on their portfolio <em>and</em> a private fork
            of the methodology repo, co-development access to the
            panel-construction pipeline, pre-publication SSRN preview six
            months before release, and a 72-hour signal head-start over the
            public Dashboard. €49,997/yr, founding-rate locked through end of
            2028. Two funds only in 2026.
          </p>
        </header>

        <aside
          aria-label="Why a fund pays €49,997"
          className="rounded-xl border border-amber-700/40 bg-amber-950/15 p-5 sm:p-6 space-y-2"
        >
          <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            The single belief
          </p>
          <h2 className="text-gray-100 font-bold text-lg sm:text-xl leading-snug">
            The fund that <em>owns</em> the methodology runs faster than the
            fund that <em>licenses</em> the output.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Every Sharp Tier and Methodology Partnership fund consumes the
            output of the regression. The Vault gives you the regression
            itself, private fork of the source code, co-development
            rights to extend it, pre-publication access to next year&rsquo;s
            paper, and 72 hours of head-start on every flag. If your fund
            intends to make GitHub-momentum signal a multi-year sourcing
            advantage, you cannot do that on a license to the output. You
            need the source.
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
              What&rsquo;s in the Vault
            </h2>
            <p className="text-amber-400 text-sm font-mono">
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
                    <span className="text-amber-400 mr-2">{i + 1}.</span>
                    {item.label}
                  </h3>
                  <span className="text-amber-300 text-sm font-mono shrink-0">
                    €{item.value.toLocaleString("en-US")}
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {item.detail}
                </p>
              </li>
            ))}
          </ol>
          <div className="rounded-xl border border-amber-600/40 bg-gradient-to-br from-amber-950/40 to-slate-900 p-5 sm:p-6">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-semibold mb-1">
              Total value
            </p>
            <p className="text-gray-100 text-2xl font-bold mb-2 line-through opacity-60">
              €{TOTAL_VALUE.toLocaleString("en-US")} / year
            </p>
            <p className="text-amber-400 text-3xl font-bold mb-1">
              {PRICE_LABEL}
            </p>
            <p className="text-gray-400 text-xs">
              Founding-rate, locked through end of 2028. Going to €99,997/yr
              for funds joining 2027+.
            </p>
          </div>
        </section>

        <section
          aria-labelledby="apply-heading"
          className="rounded-xl border border-amber-700/40 bg-amber-950/15 p-6 sm:p-8 space-y-4"
        >
          <h2
            id="apply-heading"
            className="text-gray-100 font-semibold text-xl sm:text-2xl"
          >
            Apply for the Vault
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Application is by structured email. We respond inside 5 business
            days, Vault applications receive a written diligence
            review. The application is free and never auto-converts to a
            charge. Most accepted Vault funds enter via the Methodology
            Partnership first.
          </p>
          <div className="rounded-lg border border-amber-700/40 bg-slate-900/50 p-4 space-y-2">
            <p className="text-amber-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
              De-risk before you apply
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              You don&rsquo;t have to take the track record on faith, and you
              don&rsquo;t need to read a line of code to check it. Read the{" "}
              <Link
                href="/methodology"
                className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
              >
                methodology
              </Link>
              , the{" "}
              <Link
                href="/wins"
                className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
              >
                receipts on /wins
              </Link>
              , and the{" "}
              <Link
                href="/research"
                className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
              >
                SSRN research
              </Link>{" "}
              before you commit a euro.
            </p>
            <p className="text-gray-400 text-sm leading-relaxed">
              The 30-day Signal-or-It&rsquo;s-Free guarantee applies to your
              first month, the same as every tier: if the signal doesn&rsquo;t
              surface a fund-relevant company in the first 30 days, the first
              month is free. To be accurate, this is a month-one guarantee, not
              a refund of the full annual fee, the front-end tiers and
              the early verification above exist precisely so you can confirm
              fit before the annual commitment.
            </p>
          </div>
          <a
            href={APPLY_MAILTO}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-semibold transition-colors shadow-sm shadow-amber-500/30"
          >
            Email a Vault application →
          </a>
          <p className="text-gray-400 text-xs">
            Mail goes to{" "}
            <code className="text-gray-300">signals@gitdealflow.com</code>.
            Subject and body are pre-filled with the Vault diligence template.
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
              href="/methodology-partnership"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
            >
              Methodology Partnership (€14,997/yr)
            </Link>{" "}
custom regression on your portfolio, no methodology source
            license, no co-development. Above: nothing as a productised tier.
            See the{" "}
            <Link
              href="/pricing"
              className="text-amber-400 hover:text-amber-300 underline decoration-dotted"
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
