import type { Metadata } from "next";
import Link from "next/link";
import { AgentSummary } from "@/components/AgentSummary";
import { getDataLastModified, getCurrentPeriod } from "@/lib/data";
import PSEOFooterNav from "@/components/PSEOFooterNav";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { PANEL_CLAIM } from "@/lib/canonical-claims";
import { withEditorialOverride } from "@/lib/metadata";

export const metadata: Metadata = withEditorialOverride({
  title:
    "Enterprise, VC Deal Flow Signal for Funds (Sharp Tier €4,970/yr · Application-Gated)",
  description:
    "Enterprise plan for active VC funds and syndicates. Sharp Tier at €497/mo or €4,970/yr, application-gated, capped at 8 funds in 2026. Quarterly portfolio review, white-labeled API endpoint, methodology source code access, dedicated support.",
  alternates: {
    canonical: "/enterprise",
  },
});

const ENTERPRISE_CONTACT_URL =
  "mailto:signals@gitdealflow.com?subject=Enterprise%20Engagement%20%E2%80%94%20%5BYour%20Fund%5D&body=Hi%20%E2%80%94%0A%0AFund%20name%3A%20%0AAUM%3A%20%0AStandard%20deals%2Fyear%3A%20%0AThesis%2Fsectors%3A%20%0A%0AScope%20of%20interest%20%28pick%20any%29%3A%0A-%20White-label%20fund-branded%20UI%0A-%20Dedicated%20Slack%20channel%0A-%20On-call%20diligence%20support%20for%20active%20fundraises%0A-%20Custom%20sector%20coverage%20expansion%0A-%20Multi-seat%20Sharp%20Tier%20%28beyond%20single-fund%20cap%29%0A%0AThanks%2C%0A";

interface EnterpriseFeature {
  title: string;
  detail: string;
}

const sharpFeatures: EnterpriseFeature[] = [
  {
    title: "Quarterly portfolio review call",
    detail:
      "60-minute call where we map your existing holdings against the live engineering-acceleration signal. We surface which portfolio companies are showing breakout signals, which are quietly slowing, and which adjacent sectors are heating up. Output is a written memo your team can circulate.",
  },
  {
    title: "Custom thesis-aligned watchlist",
    detail:
      "We co-build a watchlist around your fund's specific investment thesis, sector mix, stage band, geography, technical-stack preferences, anti-thesis filters. The watchlist runs against the same dataset that drives /pricing tier signals but is filtered to your investment scope. Refreshed weekly.",
  },
  {
    title: "White-labeled API endpoint",
    detail:
      "Your own slug at /api/v1/sharp/<your-fund>. The endpoint returns the same JSON the public API exposes, scoped to your watchlist, with your fund's branding in the response payload. Suitable for embedding in your internal deal-flow dashboard or piping to Slack.",
  },
  {
    title: "Methodology source code access",
    detail:
      "Private repo invite to the methodology computation code. Your engineers can replicate every published number from the same public GitHub data, audit edge cases, or fork the methodology to apply to your own private dataset. CC-BY-4.0 license.",
  },
  {
    title: "Same-day signal questions",
    detail:
      "Direct line to the founder for diligence questions on any tracked startup. No SLA published, but typical response is under 4 hours during European working hours. Examples: \"why did X drop in last week's ranking?\", \"is Y showing the contributor-retention signal?\", \"what's the 90-day trajectory on Z?\".",
  },
  {
    title: "Data-room exports for LP updates",
    detail:
      "Quarterly LP-update-formatted exports of the engineering-acceleration data on your portfolio. Includes period-over-period change, peer-sector benchmarks, and citation-ready text suitable for inclusion in LP letters. Removes the LP-letter-writing tax that comes with showing portfolio metrics.",
  },
  {
    title: "All future paid MCP tools included",
    detail:
      "We may add new paid MCP tools (advanced sector forecasts, founder-cluster analysis, fundraise-prediction confidence scoring) as the product matures. Sharp Tier subscribers get all future paid tools at no per-tool upcharge, the tier price covers the entire roadmap.",
  },
];

const customScopeFeatures: EnterpriseFeature[] = [
  {
    title: "White-label fund-branded UI",
    detail:
      "A dashboard hosted under your fund's domain or sub-path with your fund's logo, color palette, and copy. Underlying data is the same; presentation is fully your brand. Suitable for showing the dashboard to LPs, portfolio companies, or potential co-investors without exposing the GitDealFlow brand.",
  },
  {
    title: "Dedicated Slack channel",
    detail:
      "A private Slack channel between your team and the founder. Replaces email threads with searchable, threaded discussion on individual signals, weekly digest reactions, and ad-hoc diligence questions. Same-day response window applies.",
  },
  {
    title: "On-call diligence support",
    detail:
      "When your fund has an active fundraise process for a tracked startup, we provide on-call diligence support: synthesis of the startup's engineering-acceleration history, peer benchmarks within their sector, technical-debt indicators, and contributor-retention analysis. Output sized to fit deal memo formats.",
  },
  {
    title: "Custom sector coverage expansion",
    detail:
      `Coverage today spans 15 sectors and ${PANEL_CLAIM} venture-backed startup orgs. If your fund's thesis covers a sector or geography we don't currently track, we expand the panel to include it, typically a 2-week turnaround for sector expansion, longer for geography-specific coverage.`,
  },
  {
    title: "Multi-seat Sharp Tier",
    detail:
      "Sharp Tier is single-fund by default. Funds with multiple investing arms (e.g., a fund-of-funds, an opportunity fund + venture fund pair) can request multi-seat pricing under a master enterprise agreement.",
  },
];

const enterpriseFaqs: { q: string; a: string }[] = [
  {
    q: "What does enterprise pricing for VC Deal Flow Signal look like?",
    a: "Enterprise pricing for VC Deal Flow Signal centers on the Sharp Tier at €497 per month or €4,970 per year (saves two months on annual). Sharp Tier is application-gated, capped at 8 funds in 2026, and includes everything in Insider Circle plus quarterly portfolio review calls, custom thesis-aligned watchlists, a white-labeled API endpoint at /api/v1/sharp/<your-fund>, direct methodology source code access via private repo invite, same-day signal questions, data-room exports for LP updates, and all future paid MCP tools at no per-tool upcharge. Funds with deeper custom requirements, white-label fund-branded UI, dedicated Slack channel, on-call fundraise diligence, custom sector coverage expansion, multi-seat agreements, are scoped per fund starting at €15,000 per year. The Sector Sweep at €1,997 one-time is the lower-commitment on-ramp; many funds commission a Sweep first and upgrade if the signal quality matches their thesis.",
  },
  {
    q: "Why is Sharp Tier capped at 8 funds in 2026?",
    a: "Sharp Tier includes the parts of the work that don't scale, quarterly review calls, custom watchlist co-build, same-day signal questions. Capping at 8 funds in 2026 keeps the response window honest and the relationship-quality high. The cap is policy, not capacity, the underlying data infrastructure can support thousands of subscribers, but the human-touch components have a real ceiling. As the company grows operations, the cap will be reviewed annually.",
  },
  {
    q: "How does the application process work?",
    a: "Send an email to signal at gitdealflow dot com with the subject line 'Sharp Tier Application, [Your Fund]' (the apply button on /pricing prefills this). Include fund or syndicate name, AUM or annual deals, thesis focus, how you heard about us, and one thing you'd want the quarterly review call to cover. We reply within 48 hours with a 20-minute intro call. If there's a fit, we onboard the same week, Stripe checkout, white-labeled endpoint provisioned, methodology repo invite sent.",
  },
  {
    q: "What happens if I cancel Sharp Tier?",
    a: "Sharp Tier follows the same month-to-month cancellation policy as Dashboard and Insider Circle, no minimum term, no cancellation fee, prorated against the current billing period. Cancel from your Stripe customer portal or by email. The white-labeled API endpoint stays live until the end of the current billing period, then returns 410 Gone. The methodology source code access (private repo invite) stays valid, once you've forked it, you keep the fork. The 30-day Signal-or-It's-Free guarantee applies to your first month: if the signal doesn't surface a startup you find genuinely interesting, full refund within 30 days.",
  },
  {
    q: "Can my engineers contribute to the methodology?",
    a: "Yes, methodology source code access is a private repo invite, so your engineers can fork, audit, and contribute back. We don't accept blind PRs (the methodology is opinionated and any change needs to round-trip through the published SSRN paper at abstract id 6606558), but we do take suggestions seriously and credit contributors in the changelog. Several Sharp Tier subscribers have suggested filtering refinements that ended up shipping in the public methodology.",
  },
  {
    q: "Does Sharp Tier include the Sector Sweep?",
    a: "No, Sector Sweep is a separate one-time engagement at €1,997. Sharp Tier subscribers can commission a Sweep at the same price as anyone else; the two are designed to compose. The typical pattern is Sweep → Sharp Tier: a fund commissions a Sweep on a thesis-relevant sector, validates the signal quality on a deep written report, and upgrades to Sharp for ongoing dashboard + custom watchlist + quarterly review.",
  },
  {
    q: "Is there a multi-seat or team plan?",
    a: "Sharp Tier is priced per-fund, with the assumption of a single investing entity. Funds with multiple investing arms (fund-of-funds, opportunity fund + venture fund pair, geography-split funds under one GP) can request multi-seat pricing under a master enterprise agreement. Pricing is scoped per arrangement; typical multi-seat agreements run €15,000-25,000 per year for two to four arms. Email signal at gitdealflow dot com with the structure of your fund family for a scoped quote.",
  },
  {
    q: "What if my fund needs custom sector coverage we don't currently track?",
    a: `Coverage today spans 15 sectors with ${PANEL_CLAIM} venture-backed startup orgs. If your thesis is in an adjacent sector we don't currently track (for example, climate-tech sub-sectors, bio-infrastructure, or specific geographic clusters), we can expand the panel to include it. Sector expansion is typically a 2-week turnaround; geography-specific coverage takes longer because we have to validate that the orgs in that geography satisfy the venture-backed-startup heuristic. This is included in custom enterprise scope, not in standard Sharp Tier.`,
  },
];

export default function EnterprisePage() {
  const asOf = getDataLastModified().toISOString().slice(0, 10);
  const period = getCurrentPeriod();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": "https://signals.gitdealflow.com/enterprise#webpage",
        url: "https://signals.gitdealflow.com/enterprise",
        name: "VC Deal Flow Signal, Enterprise Plan for Funds",
        description:
          "Sharp Tier and custom enterprise scope for active VC funds and syndicates. Application-gated, capped at 8 funds in 2026.",
        inLanguage: "en-US",
        isPartOf: {
          "@id": "https://signals.gitdealflow.com/#website",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          xpath: ["/html/body//h1", "/html/body//h2"],
        },
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
            name: "Pricing",
            item: "https://signals.gitdealflow.com/pricing",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Enterprise",
            item: "https://signals.gitdealflow.com/enterprise",
          },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: enterpriseFaqs.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "SoftwareApplication",
        name: "VC Deal Flow Signal by GitDealFlow",
        url: "https://signals.gitdealflow.com/enterprise",
        applicationCategory: "BusinessApplication",
        applicationSubCategory: "Investment Intelligence",
        operatingSystem: "Web",
        description:
          "Deal-flow signal tool for investors. Reads startups' public GitHub engineering activity and flags accelerating teams weeks before the round. This page covers the Sharp Tier and custom enterprise scope for active VC funds and syndicates.",
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
          sameAs: "https://www.wikidata.org/wiki/Q139376302",
        },
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/enterprise"
        languages={getHreflangLanguages("/enterprise")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/pricing"
            className="hover:text-gray-300 transition-colors"
          >
            Pricing
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Enterprise</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Enterprise, VC Deal Flow Signal for Funds
        </h1>

        <p className="text-gray-400 text-base leading-relaxed mb-6">
          Two paths for active funds: the application-gated{" "}
          <strong className="text-gray-200">Sharp Tier</strong> at &euro;497
          per month (&euro;4,970 per year saves two months, capped at 8
          funds in 2026), or a fully-scoped{" "}
          <strong className="text-gray-200">custom enterprise engagement</strong>{" "}
          starting at &euro;15,000 per year for funds needing white-label UI,
          dedicated Slack, on-call diligence, custom sector coverage, or
          multi-seat agreements.
        </p>

        <AgentSummary
          tldr="Enterprise pricing for VC Deal Flow Signal (GitDealFlow) is structured as the Sharp Tier at €497/mo (€4,970/yr saves two months) plus a fully-scoped custom enterprise engagement starting at €15,000/yr. Sharp Tier is application-gated, capped at 8 funds in 2026, and includes everything in Insider Circle plus quarterly portfolio review calls, custom thesis-aligned watchlists, white-labeled API endpoint at /api/v1/sharp/<your-fund>, methodology source code access, same-day signal questions, data-room exports for LP updates, and all future paid MCP tools at no per-tool upcharge. Custom enterprise scope adds white-label fund-branded UI, dedicated Slack channel, on-call fundraise diligence, custom sector coverage expansion, and multi-seat agreements. Application: email signal at gitdealflow dot com with fund name, AUM, thesis, and intent. 48-hour reply window, 20-minute intro call, same-week onboarding if there's a fit. Cancellation is month-to-month with no minimum term."
          pageUrl="https://signals.gitdealflow.com/enterprise"
          asOf={asOf}
          citeAs={`VC Deal Flow Signal, Enterprise (signals.gitdealflow.com/enterprise), retrieved ${period.name}.`}
          facts={[
            {
              claim:
                "Sharp Tier: €497/mo or €4,970/yr (saves two months), application-gated, capped at 8 funds in 2026.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#sharp-tier",
              sourceLabel: "Sharp Tier on /pricing",
            },
            {
              claim:
                "Custom enterprise scope (white-label, dedicated Slack, on-call diligence, multi-seat) starts at €15,000/yr.",
              sourceUrl:
                "mailto:signals@gitdealflow.com?subject=Enterprise%20Engagement",
              sourceLabel: "Enterprise contact",
            },
            {
              claim:
                "Application turnaround: 48-hour reply, 20-minute intro call, same-week onboarding if there's a fit.",
              sourceUrl: "https://signals.gitdealflow.com/enterprise#how-to-apply",
              sourceLabel: "How to apply",
            },
            {
              claim:
                "Cancellation policy is month-to-month with no minimum term and no cancellation fee. White-labeled API endpoint sunsets at end of billing period; methodology repo fork stays valid.",
              sourceUrl: "https://signals.gitdealflow.com/pricing#sharp-tier",
              sourceLabel: "Pricing FAQ, cancellation",
            },
          ]}
        />

        {/* Sharp Tier section */}
        <section className="mb-12 rounded-lg border border-yellow-700/40 bg-yellow-950/10 p-6">
          <div className="flex flex-wrap items-baseline gap-3 mb-3">
            <h2 className="text-2xl font-semibold text-gray-100">Sharp Tier</h2>
            <span className="text-3xl font-bold text-gray-100">€497</span>
            <span className="text-gray-400 text-sm">/mo</span>
            <span className="text-gray-400 text-xs">
              or €4,970/yr · application required · 8-fund cap 2026
            </span>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            Everything in the Insider Circle (€197/mo tier) plus the parts of
            the work that don&rsquo;t scale, quarterly portfolio
            review calls, custom thesis-aligned watchlist co-built with your
            fund, white-labeled API endpoint at{" "}
            <code className="text-yellow-200 bg-yellow-500/10 px-1.5 py-0.5 rounded text-xs">
              /api/v1/sharp/&lt;your-fund&gt;
            </code>
            , and direct access to the methodology source code.
          </p>
          <div className="space-y-3 mb-5">
            {sharpFeatures.map((f, i) => (
              <div key={i} className="border-l-2 border-yellow-700/40 pl-4">
                <p className="text-gray-200 text-sm font-medium mb-1">
                  &#10003; {f.title}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
          <Link
            href="/apply"
            className="inline-block bg-yellow-500 hover:bg-yellow-400 text-dark-900 font-semibold px-5 py-2.5 rounded-md transition-colors text-sm"
          >
            Apply for Sharp Tier &rarr;
          </Link>
          <p className="text-gray-400 text-xs mt-3">
            Sharp Tier &rarr; apply in 2 minutes at{" "}
            <Link
              href="/apply"
              className="text-yellow-200 hover:text-yellow-100 underline decoration-dotted"
            >
              /apply
            </Link>
            . Need a fully-scoped custom engagement? Email us below.
          </p>
        </section>

        {/* Custom enterprise scope */}
        <section className="mb-12 rounded-lg border border-slate-800 bg-slate-900 p-6">
          <h2 className="text-2xl font-semibold text-gray-100 mb-3">
            Custom enterprise engagement
          </h2>
          <p className="text-gray-400 text-sm italic mb-2">
            Starting at &euro;15,000/yr · scoped per fund · no published
            ceiling
          </p>
          <p className="text-gray-300 text-sm leading-relaxed mb-5">
            For funds with requirements that exceed the Sharp Tier scope:
            white-label fund-branded UI, dedicated Slack, on-call diligence
            for active fundraises, custom sector coverage expansion, or
            multi-seat agreements covering multiple investing arms under one
            GP. Pricing is scoped per fund based on the specific
            requirements.
          </p>
          <div className="space-y-3 mb-5">
            {customScopeFeatures.map((f, i) => (
              <div key={i} className="border-l-2 border-slate-700 pl-4">
                <p className="text-gray-200 text-sm font-medium mb-1">
                  &#10003; {f.title}
                </p>
                <p className="text-gray-400 text-sm leading-relaxed">
                  {f.detail}
                </p>
              </div>
            ))}
          </div>
          <a
            href={ENTERPRISE_CONTACT_URL}
            className="inline-block bg-slate-700 hover:bg-slate-600 text-white font-semibold px-5 py-2.5 rounded-md transition-colors text-sm"
          >
            Email enterprise scope request &rarr;
          </a>
        </section>

        {/* How to apply */}
        <section
          id="how-to-apply"
          className="mb-12 rounded-lg border border-sky-800 bg-sky-950/20 p-6"
        >
          <h2 className="text-xl font-semibold text-sky-200 mb-3">
            How the application process works
          </h2>
          <ol className="space-y-2 text-gray-300 text-sm leading-relaxed list-decimal list-inside">
            <li>
              Email signal at gitdealflow dot com (the apply button prefills
              the subject line).
            </li>
            <li>
              Include fund or syndicate name, AUM or annual deals, thesis
              focus, attribution (how you heard about us), and one thing
              you&rsquo;d want the quarterly review call to cover.
            </li>
            <li>
              We reply within 48 hours with a 20-minute intro call invite.
            </li>
            <li>
              If there&rsquo;s a fit, we onboard the same week -
              Stripe checkout, white-labeled endpoint provisioned, methodology
              repo invite sent.
            </li>
          </ol>
        </section>

        {/* Cross-link to /pricing for full tier comparison */}
        <section className="mb-12 rounded-lg border border-slate-800 bg-slate-900 p-6 text-center">
          <h2 className="text-base font-semibold text-gray-100 mb-2">
            Need to compare against the lower tiers?
          </h2>
          <p className="text-gray-400 text-sm mb-4">
            See all six pricing tiers side by side, Free Signal Digest,
            &euro;7 First Look Pass, &euro;49/mo Dashboard Beta, &euro;197/mo
            Insider Circle, Sharp Tier, and &euro;1,997 Sector Sweep.
          </p>
          <Link
            href="/pricing"
            className="inline-block bg-signal-500 hover:bg-signal-600 text-slate-950 text-sm font-semibold px-4 py-2 rounded-md transition-colors"
          >
            See full pricing &rarr;
          </Link>
        </section>

        {/* FAQ */}
        <section className="mb-12">
          <h2 className="text-xl font-semibold text-gray-100 mb-6">
            Enterprise FAQs
          </h2>
          <div className="space-y-6">
            {enterpriseFaqs.map((f, i) => (
              <div key={i}>
                <h3 className="text-base font-semibold text-gray-200 mb-2">
                  {f.q}
                </h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
              </div>
            ))}
          </div>
        </section>

        <p className="text-xs text-gray-400 mt-8 mb-4">
          Enterprise terms last verified {asOf}. Sharp Tier capacity may
          shift based on 2026 utilisation review.
        </p>

        <PSEOFooterNav />

        <DataNerdSignoff variant="default" className="mt-12" />
      </div>
    </>
  );
}
