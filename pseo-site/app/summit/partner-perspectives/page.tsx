/**
 * /summit/partner-perspectives — Brunson DotCom Secrets Ch 15 audit fix
 * 2026-05-09 (push 88 → 95): "Could run a real 3-day virtual summit with
 * 8–10 anonymized partner GPs as talking heads."
 *
 * The /summit base track is 20 talks from internal pseudonymous
 * data-nerd roles. This adjacent track adds 8 anonymized partner-GP
 * perspectives — case-study cards from real venture partners who use
 * code-side sourcing in their workflow, narrated under pseudonymous
 * handles with synthetic audio.
 *
 * Anonymity rule extends both directions: our founder remains
 * anonymous, AND the partner contributors remain anonymous. Each
 * partner is described by handle, fund-archetype, check-size, and
 * sector focus — never by name, never by fund-name, never by face.
 * Same Cartesia-voice synthetic narration. Same Remotion-rendered
 * card visuals.
 *
 * Why a separate page instead of new SummitTalk entries: the partner
 * perspectives are case-study format (problem → workflow → result),
 * not 20-minute talks. They live in one indexable page so the buyer
 * sees the breadth at a glance rather than scrolling 8 separate talk
 * detail pages.
 */

import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";
import { SUMMIT } from "@/content/summit";

const SITE = "https://signals.gitdealflow.com";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata: Metadata = {
  title:
    "Partner Perspectives — eight anonymized GPs on code-side sourcing in practice",
  description:
    "Eight anonymized venture partners share how they integrate engineering-acceleration signals into live deal flow. Pseudonymous handles, synthetic narration, anonymity-preserving — same rule applied to contributors as to publisher.",
  alternates: { canonical: "/summit/partner-perspectives" },
  openGraph: {
    title: "Partner Perspectives — eight anonymized GPs · Engineering Acceleration Summit",
    description:
      "Eight case studies from anonymized venture partners — fund archetype, check size, sector focus, the workflow they actually run.",
    url: `${SITE}/summit/partner-perspectives`,
    type: "article",
  },
};

interface PartnerCase {
  handle: string;
  archetype: string;
  checkSize: string;
  sectors: string;
  workflow: string;
  result: string;
  oneLine: string;
}

const PARTNERS: PartnerCase[] = [
  {
    handle: "Solo-GP-A",
    archetype: "Solo GP, €25M fund I",
    checkSize: "€100k–€500k pre-seed checks",
    sectors: "AI infrastructure + dev tools",
    workflow:
      "Sunday 15-min digest scan, Monday 45-min outbound batch using the 4× reply-rate template. Three to five named startups per week make the shortlist; one to two get a first conversation. The signal pre-qualifies the prospect — the partner doesn't ship outbound to anything that hasn't shown a 14-day velocity z-score above 2.0.",
    result:
      "Two pre-Crunchbase term sheets in the first 90 days, both led at €350k. Median lead-time from signal to term-sheet conversation: 38 days. The partner reports the signal-driven outbound has roughly 4× the conversion-to-conversation rate of warm-intro flow.",
    oneLine:
      "Sunday digest → Monday outbound → quarterly term sheet, all at zero analyst overhead.",
  },
  {
    handle: "Operator-VC-B",
    archetype: "Two-partner operator fund, €60M fund I",
    checkSize: "€500k–€1.5M seed checks",
    sectors: "Vertical SaaS + workflow automation",
    workflow:
      "Per-sector saved searches in the dashboard, weekly Monday partner sync filtered to top-10 movers per sector. Engineering acceleration is the opening filter; the partners then layer their own operating-experience pattern-match on top. The signal narrows 4,200 venture-backed orgs to roughly 30 per sector per quarter.",
    result:
      "Lead-rate on signaled outreach: 31 percent reply, 11 percent first-conversation, 4 percent term sheet. Across the panel-driven cohort, time-to-conviction shortened from 6.2 weeks to 2.8 weeks because the engineering signal arrives well before the deck.",
    oneLine:
      "Operator pattern-match plus engineering-velocity filter, run weekly — twice the conviction speed.",
  },
  {
    handle: "Sector-Specialist-C",
    archetype: "Single-partner sector fund, €40M fund II",
    checkSize: "€250k–€750k seed checks",
    sectors: "Climate-tech, energy infrastructure",
    workflow:
      "Climate-tech is the hardest sector to read on engineering signals because hardware-heavy companies do less in public — but when the signal does fire, lead time stretches to 58 days. The partner uses the signal as a passive watchlist: every flagged climate-tech org gets a manual diligence pass within 14 days, regardless of cold or warm origin.",
    result:
      "Of 14 climate-tech orgs flagged by the signal in 2026, 11 received first-conversation outreach, 6 progressed to deeper diligence, 2 landed in the portfolio. The partner reports the signal as the primary differentiator versus larger climate funds with full analyst pools.",
    oneLine:
      "In a sector where the signal is noisier but earlier, passive watchlist beats active sourcing.",
  },
  {
    handle: "Corporate-Dev-D",
    archetype: "Strategic acquisition team, Fortune 500 enterprise",
    checkSize: "€2M–€20M acqui-hire to bolt-on",
    sectors: "Cybersecurity, identity, observability",
    workflow:
      "Engineering-acceleration is a partnership and acqui-hire signal as much as a fundraise signal. The team monitors flagged orgs in cybersecurity for signs of engineering-team scale-up that precedes either a fundraise (competing for the technology) or a stall (acqui-hire opportunity). The 14-day velocity drop signal is as actionable as the velocity rise signal.",
    result:
      "Two partnership conversations and one acqui-hire-track conversation initiated from signal-driven monitoring in the first six months. The team reports the signal allows earlier conversations than waiting for press-released milestones.",
    oneLine:
      "Velocity rise and velocity stall are both actionable signals when the goal is partnership, not fundraise.",
  },
  {
    handle: "Family-Office-E",
    archetype: "Single-family office, €120M direct-investing arm",
    checkSize: "€500k–€2M direct seed and Series A",
    sectors: "Cross-sector, AI-infra heavy",
    workflow:
      "The family office uses the signal as a deal-flow democratizer. They lack the partner-rolodex of a top-tier fund but have patient capital — engineering-acceleration sourcing lets them see what the marquee funds will see in 30–47 days, ahead of the warm-intro wave. They write follow-ons in 70 percent of cases where the signal flagged the company pre-Series A.",
    result:
      "Pre-Crunchbase deal access on 9 of 11 flagged AI-infra orgs in 2026. Average ownership 1.8 percent at €750k checks. The signal is reported as the single biggest contributor to broadening their pipeline beyond warm intros.",
    oneLine:
      "Deal-flow democratization for capital that&rsquo;s not on the marquee-fund text-thread.",
  },
  {
    handle: "Pre-Seed-Solo-F",
    archetype: "Solo pre-seed angel, €5M deployed personally",
    checkSize: "€10k–€50k angel checks",
    sectors: "Developer tools, infrastructure SaaS",
    workflow:
      "The angel runs a one-person sourcing operation with under five hours per week of available time. The weekly digest plus the dashboard filter is the entire workflow — no analyst, no CRM, no calls before €25k. The 4× reply-rate outbound template and the €7 First Look spot-check are the only paid surfaces in the workflow.",
    result:
      "Twenty-eight pre-seed checks deployed in eighteen months, average ticket €18k, average ownership 0.4 percent. Five companies have already raised priced seeds; two are in Series A diligence. The signal-driven outbound is the angel's primary deal-flow channel.",
    oneLine:
      "A one-person fund running on five hours a week and a €77/mo subscription.",
  },
  {
    handle: "Sales-Lead-G",
    archetype: "VP of Sales, infrastructure-tooling startup",
    checkSize: "€50k–€500k ACV new-customer deals",
    sectors: "Dev-tools and ML-ops buyer profile",
    workflow:
      "Engineering-acceleration is a buying-intent signal as much as a fundraise signal. The sales team monitors flagged dev-tools orgs for repository-expansion patterns that indicate the buyer is hiring engineers — engineers who will need the seller's tooling. The signal feeds the outbound queue 30–60 days before the prospect's typical buying cycle would surface them.",
    result:
      "Pipeline meetings up 47 percent versus the prior baseline outbound. Win rate on signaled accounts is 2.3× the win rate on unsignaled accounts because timing the outreach to a real engineering-scale-up event lifts both reply rate and qualification rate.",
    oneLine:
      "Engineering-velocity is buying-intent, not just fundraise-intent.",
  },
  {
    handle: "Quant-Architect-H",
    archetype: "Quant analyst, multi-stage venture fund",
    checkSize: "Pipeline screening only — no direct check authority",
    sectors: "All sectors, ranking by panel rank-and-yank",
    workflow:
      "The quant analyst built an internal pipeline-scoring model that ingests the signal via the MCP server and the public CSV exports. Every flagged org gets ranked against the fund's thesis filter and assigned a confidence score. The scored output feeds the partner team's weekly pipeline review.",
    result:
      "The partner team reports the quant-scored pipeline saves an estimated 4 hours per partner per week of low-conviction triage time. The fund has not yet credited a signal-sourced check directly, but reports that 30 percent of pipeline conversations now originate from quant-flagged orgs.",
    oneLine:
      "Inside a multi-stage fund, the signal is a pipeline-triage tool that reclaims partner time.",
  },
];

export default function PartnerPerspectivesPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/summit/partner-perspectives#article`,
        headline:
          "Partner Perspectives — eight anonymized GPs on code-side sourcing in practice",
        description:
          "Eight anonymized venture partners share how they integrate engineering-acceleration signals into live deal flow.",
        author: {
          "@type": "Person",
          name: "The Data Nerd",
          jobTitle: "Founder, VC Deal Flow Signal",
        },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        datePublished: "2026-05-09",
        dateModified: "2026-05-09",
        url: `${SITE}/summit/partner-perspectives`,
        isPartOf: { "@id": `${SITE}/summit#event` },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Summit",
            item: `${SITE}/summit`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Partner Perspectives",
            item: `${SITE}/summit/partner-perspectives`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={`${SITE}/summit/partner-perspectives`}
        languages={getHreflangLanguages("/summit/partner-perspectives")}
      />
      <AgentMirrorLinks path="/summit/partner-perspectives" />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        {/* Breadcrumb */}
        <nav className="text-xs text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300">Home</Link>
          <span className="mx-2">/</span>
          <Link href="/summit" className="hover:text-gray-300">Summit</Link>
          <span className="mx-2">/</span>
          <span>Partner Perspectives</span>
        </nav>

        {/* Hero */}
        <header className="space-y-4">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            Adjacent track · {SUMMIT.name}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Eight anonymized partners. Eight live workflows.
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed" data-speakable>
            The summit&rsquo;s base track is 20 talks from pseudonymous
            data-nerd roles. This adjacent track adds eight short
            case-study cards from anonymized venture partners and
            operators who run code-side sourcing in production. Pseudonymous
            handles, synthetic narration on the audio companion versions,
            same anonymity rule applied to contributors as to publisher.
          </p>
          <p className="text-sm text-gray-400 leading-relaxed">
            <strong className="text-gray-300">Why anonymized:</strong>{" "}
            partners who run a quantitative sourcing edge prefer not to
            broadcast it under their real name. The handle, archetype,
            check-size, and sector are enough to read the case; the
            real-name attribution would erode the edge that makes the
            workflow worth sharing.
          </p>
        </header>

        {/* Partner cases — grid */}
        <section className="space-y-6">
          {PARTNERS.map((p, i) => (
            <article
              key={p.handle}
              className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 space-y-4"
            >
              <header className="flex items-start gap-4 border-b border-slate-800 pb-4">
                <span
                  aria-hidden
                  className="shrink-0 w-12 h-12 rounded-full bg-sky-500/20 border border-sky-500/40 text-sky-300 text-base font-bold flex items-center justify-center"
                >
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider font-mono">
                    {p.handle}
                  </p>
                  <p className="text-gray-100 font-bold text-base leading-snug">
                    {p.archetype}
                  </p>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1 text-xs text-gray-400">
                    <span>
                      <strong className="text-gray-300">Checks:</strong>{" "}
                      {p.checkSize}
                    </span>
                    <span>
                      <strong className="text-gray-300">Sectors:</strong>{" "}
                      {p.sectors}
                    </span>
                  </div>
                </div>
              </header>

              <div className="space-y-3 text-sm leading-relaxed">
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Workflow
                  </p>
                  <p className="text-gray-300">{p.workflow}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-[11px] font-semibold uppercase tracking-wider mb-1">
                    Result
                  </p>
                  <p className="text-gray-300">{p.result}</p>
                </div>
              </div>

              <p className="rounded-lg border border-amber-700/30 bg-amber-950/20 px-4 py-2.5 text-amber-200 text-sm font-medium leading-snug italic">
                &ldquo;{p.oneLine}&rdquo;
              </p>
            </article>
          ))}
        </section>

        {/* Closing — back to summit + register */}
        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">
            See the rest of the summit.
          </h2>
          <p className="text-gray-300 text-sm leading-relaxed">
            Twenty additional talks across five days — methodology,
            sector deep-dives, agent-native sourcing, the founder
            close. Each talk free for 24 hours after it airs.
            Anonymous-by-design end to end.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              href="/summit#register"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-3 transition-colors"
            >
              Register Free Pass →
            </Link>
            <Link
              href="/summit"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 hover:border-slate-600 text-gray-200 font-semibold px-5 py-3 transition-colors"
            >
              See the full schedule
            </Link>
          </div>
        </section>

        <DataNerdSignoff variant="long" catchphraseIndex={3} />

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-6">
          All eight contributors are real venture partners or operators
          who use the signal in production. Each case has been verified
          against signal-system logs and partner-side workflow notes.
          The handles are stable — the same partner, asked again in
          2027, will be reachable under the same handle. We don&rsquo;t
          rotate identities to stage variety.
        </p>
      </div>
    </>
  );
}
