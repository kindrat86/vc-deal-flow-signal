/**
 * Competitor Funnel Teardowns — Brunson-style structural analysis.
 *
 * Why structural diagrams instead of literal screenshots:
 *   1. Anonymity rule (manifesto pillar #4) — the product, not the
 *      personality, leads. Pixel screenshots invite trademark / fair-use
 *      friction we don't need; structural teardowns of publicly-observable
 *      funnel mechanics carry the same persuasive intent without the IP risk.
 *   2. Each step here is sourced from each vendor's own public marketing
 *      surfaces, sales pages, and pricing FAQs — not from inside their
 *      paywalls. We describe what a logged-out visitor would see.
 *   3. The pattern follows DotCom Secrets Ch 10 (Reverse Engineering a
 *      Successful Funnel): identify the funnel architecture, name the
 *      conversion mechanic at each step, and sit our offer alongside it.
 *
 * Shape:
 *   competitor   — display name + slug key (matches comparison slugs)
 *   tagline      — single-sentence positioning of their funnel
 *   funnelArch   — ordered steps from cold-traffic → committed-buyer
 *   whatTheyDoRight / whereTheyLeak — bookend honest analysis
 *   ourMoveSummary — single closing line on how our funnel differs
 */

export interface TeardownStep {
  /** Step label as the visitor experiences it ("Demo gate", "Pricing wall", etc.). */
  step: string;
  /** What the competitor does at this step — neutral, factual. */
  theirMechanic: string;
  /** Russell-Brunson-style read on the conversion mechanic. */
  brunsonNote: string;
  /** Our parallel move at the same funnel stage. */
  ourMove: string;
}

export interface CompetitorTeardown {
  /** Stable slug used for lookup + page anchors. */
  key: string;
  /** Display name as it appears in headlines + table. */
  competitor: string;
  /** Single-sentence positioning of the competitor's funnel. */
  tagline: string;
  /** Ordered funnel architecture (5–7 steps recommended). */
  funnelArch: TeardownStep[];
  /** 1–2 sentence "they did this well" credit — must be honest. */
  whatTheyDoRight: string;
  /** 1–2 sentence "the leak" — where the funnel costs conversion. */
  whereTheyLeak: string;
  /** Closing how-we-differ line, ~1 sentence. */
  ourMoveSummary: string;
  /** Primary public source(s) for the funnel architecture (homepage, pricing page, etc.). */
  sources: string[];
}

export const TEARDOWNS: CompetitorTeardown[] = [
  {
    key: "harmonic",
    competitor: "Harmonic.ai",
    tagline:
      "Enterprise team-pattern intelligence behind a sales-led demo gate.",
    funnelArch: [
      {
        step: "1 — Cold traffic landing",
        theirMechanic:
          "Hero block leads with logos of marquee VC funds and a 'Request a demo' primary CTA. No price, no public product tour, no self-serve trial.",
        brunsonNote:
          "Pure enterprise framing — they're optimising for partner-track buyers at funds with a six-figure data budget. Everyone below that tier is friction-walled by design.",
        ourMove:
          "We lead with one falsifiable claim ('Series A surfaces 21–47 days early') and a free Acceleration Watch signup — buyer self-qualifies in 90 seconds, no human needed.",
      },
      {
        step: "2 — Demo request form",
        theirMechanic:
          "Multi-field form: company, role, AUM, fund stage, sourcing volume. Routes to a sales rep who books a discovery call within 1–3 business days.",
        brunsonNote:
          "Classic high-ticket qualification gate — disqualifies non-fits early so the AE only takes calls with budget-holders. Costs them every small-cheque buyer and angel.",
        ourMove:
          "€7 First Look Pass replaces the demo. Buyer picks a sector, gets a 24-hour written deep-dive — same outcome the demo would tease, delivered as a tangible asset.",
      },
      {
        step: "3 — Discovery call",
        theirMechanic:
          "30–45 minute Zoom with an AE: BANT qualification, demo of dashboard, custom queries against a sample dataset, mutual-fit assessment.",
        brunsonNote:
          "The discovery call is where they earn the price tag — the AE personalises the dashboard to the partner's thesis. It's a real value transfer, but it's also a 90-minute ask.",
        ourMove:
          "First Look Pass walkthrough PDF is asynchronous — the partner reads it on the train and forwards it to two colleagues. No calendar coordination, no AE-as-bottleneck.",
      },
      {
        step: "4 — Pricing reveal",
        theirMechanic:
          "Custom pricing only, surfaced after the discovery call. Public reports place annual contracts in the high five-figure range, with multi-seat scaling above.",
        brunsonNote:
          "Pricing-as-a-conversation maximises revenue per closed deal but leaks every buyer who isn't ready for a six-figure procurement cycle. The funnel is built for top-decile funds only.",
        ourMove:
          "€9.97/mo founding-member rate, locked forever. Public pricing page. The buyer can decide in 30 seconds without scheduling a call.",
      },
      {
        step: "5 — Annual contract",
        theirMechanic:
          "Annual subscription with multi-seat license, MSA + DPA negotiation, procurement intake at the buyer's fund. Onboarding handled by a customer-success manager.",
        brunsonNote:
          "Annual contracts lock revenue for 12 months but raise the cost of acquisition — the AE's commission, the procurement back-and-forth, the CSM's onboarding hours all live in CAC.",
        ourMove:
          "Monthly subscription. Cancel any time. Founding rate locked even if you cancel and resubscribe later. The cost of trust is paid in transparency, not contract length.",
      },
      {
        step: "6 — Renewal cycle",
        theirMechanic:
          "Year-end review with the CSM, expansion conversation (more seats, premium API tier), renegotiation of next-year terms.",
        brunsonNote:
          "Renewal is where high-ticket SaaS lives or dies — if the CSM hasn't proven seven-figure-of-deal-flow ROI, the procurement team kills the line item.",
        ourMove:
          "There is no renewal cycle. Subscription auto-continues at the locked rate. The product earns its price every Monday morning when the digest lands, not once a year.",
      },
    ],
    whatTheyDoRight:
      "Team-pattern signals are a genuinely distinct lens — incorporation-stage and founder-pedigree data is hard to replicate, and the AE-led motion delivers personalised dashboards that feel bespoke to a fund's thesis.",
    whereTheyLeak:
      "Every solo GP, angel, scout, and small-cheque buyer below the institutional tier bounces at the demo gate. The funnel is engineered for the top 3% of buyers and ignores the long tail entirely.",
    ourMoveSummary:
      "We replace the demo with a €7 deliverable. Same value transfer, no calendar.",
    sources: [
      "Harmonic.ai homepage (logged out)",
      "Public pricing FAQ on company comparison sites",
    ],
  },

  {
    key: "pitchbook",
    competitor: "PitchBook",
    tagline:
      "Reference-grade private market database sold through annual sales-led contracts.",
    funnelArch: [
      {
        step: "1 — Cold traffic landing",
        theirMechanic:
          "Brand-led hero ('the leading private capital market database'), category navigation, downloadable industry reports as lead magnets.",
        brunsonNote:
          "They lead with authority — Morningstar's parent brand carries enterprise credibility. The free reports are the squeeze; everything past that is gated.",
        ourMove:
          "We give the SSRN preprint, the Zenodo dataset, and the regression code on the public site. The buyer can replicate the work before they're asked to pay.",
      },
      {
        step: "2 — Report download (squeeze)",
        theirMechanic:
          "Industry report PDFs in exchange for a 7-field form: name, email, role, company, AUM, fund stage, region. Auto-routes to inside sales.",
        brunsonNote:
          "The reports are excellent free bait — broadly cited in venture press — but the squeeze form length is brutal. Half the cold traffic bounces here.",
        ourMove:
          "Acceleration Watch signup is two fields: email, optional sector. The buyer is on the rhythm in under 10 seconds.",
      },
      {
        step: "3 — Outbound from inside sales",
        theirMechanic:
          "SDR cadence within 24–48 hours: cold call + personalised email + LinkedIn connect. Books a 30-minute platform demo if the lead matches ICP.",
        brunsonNote:
          "The SDR cadence works because the report-download intent is high. But it's a heavy-handed motion — solo GPs and individual angels feel hunted, not served.",
        ourMove:
          "No SDRs. The Day 0 email is a real teach moment — read it, decide. The product earns the second email by being useful in the first.",
      },
      {
        step: "4 — Platform demo",
        theirMechanic:
          "60-minute screen-share covering deal flow, comparables, valuation modeling, exit analysis. The dashboard depth is the close mechanic.",
        brunsonNote:
          "The breadth of the platform is the pitch — every workflow a fund analyst runs lives in one tool. But breadth is a double-edged sword: small teams pay for surface area they never touch.",
        ourMove:
          "/watch is a 90-second silent demo. /walkthrough is a 12-minute scrollable read. The full Stack is on one page; the buyer doesn't need a guided tour to understand the value.",
      },
      {
        step: "5 — Custom quote + procurement",
        theirMechanic:
          "Custom annual quote based on seats, modules, API access, and integration scope. Procurement cycle 4–8 weeks at a typical fund.",
        brunsonNote:
          "The quote model captures the ceiling but punishes the floor — small funds pay disproportionate procurement overhead per dollar of subscription.",
        ourMove:
          "€49/mo Dashboard. €1,797 Sector Sweep one-time. €77/mo Insider. Three rungs, public. The buyer chooses without asking.",
      },
      {
        step: "6 — Annual renewal + expansion",
        theirMechanic:
          "End-of-year QBR, seat expansion, API tier upgrade, integration-team rollout. CSM-driven motion.",
        brunsonNote:
          "Land-and-expand is the unit economics — single-seat trials grow into firm-wide deployments. The model is sound; the floor is just very high.",
        ourMove:
          "Self-serve upgrades from email — Day 45 Insider, Day 60 Sector Sweep, Day 75 Crystal Ball. The expansion is in the drip, not in a QBR.",
      },
    ],
    whatTheyDoRight:
      "PitchBook's depth — comparables, valuation models, exit data — is genuinely reference-grade. The free industry reports are best-in-class lead magnets and earn their citations.",
    whereTheyLeak:
      "The SDR cadence + custom-quote model is calibrated for funds with full procurement teams. Solo GPs, scouts, operators, and emerging managers bounce because the buying motion doesn't match their org shape.",
    ourMoveSummary:
      "Public pricing, instant self-serve, async value delivery. Small buyers don't need to be sold — they need to be allowed.",
    sources: [
      "pitchbook.com homepage (logged out)",
      "Free industry-report download flow",
      "Public buyer reviews on G2 / TrustRadius",
    ],
  },

  {
    key: "cbinsights",
    competitor: "CB Insights",
    tagline:
      "Enterprise market intelligence with a content-marketing top-of-funnel feeding annual SaaS contracts.",
    funnelArch: [
      {
        step: "1 — Cold traffic landing",
        theirMechanic:
          "Hero leads with newsletter ('Insights') and report library ('State of Venture'). Free + email-gated content drives most of the top-of-funnel.",
        brunsonNote:
          "Their newsletter is the actual product at the top of the funnel — half of venture Twitter quotes 'Insights' weekly. That's earned distribution, hard to copy.",
        ourMove:
          "We own the newsletter category for one slice — engineering acceleration. We don't try to out-Insights Insights; we out-specialise it.",
      },
      {
        step: "2 — Newsletter capture",
        theirMechanic:
          "Single-field email capture, immediate first issue delivery. Daily and weekly cadence. Content quality is the retention mechanic.",
        brunsonNote:
          "The single-field signup is correct — direct-response 101. The daily cadence is heavy but earns trust through sheer reps.",
        ourMove:
          "Acceleration Watch is weekly — Sunday digest. Daily would be noise; weekly matches the rhythm of how a partner actually reviews deal flow.",
      },
      {
        step: "3 — Report download + tracking",
        theirMechanic:
          "Long-form quarterly reports ('State of Venture', 'State of AI') gated behind a 6-field form. The completed form populates a CRM record + scoring.",
        brunsonNote:
          "The reports are the bait that converts the casual newsletter reader to a sales-qualified lead. The progressive profiling — each download adds a field — is operationally sharp.",
        ourMove:
          "Our SSRN paper, datasets, and regression code are downloadable without an email. We don't profile-progressively — we let the work do the qualification.",
      },
      {
        step: "4 — Sales outreach",
        theirMechanic:
          "BDR follow-up within 1–3 business days of a high-intent download. Cold call + personalised email referencing the specific report downloaded.",
        brunsonNote:
          "The intent-based outreach is well-tuned — they only call on hot leads, which keeps the BDR efficiency high. But it still feels like a reach to a buyer who just wanted a chart.",
        ourMove:
          "Day 4 email asks for €7. The buyer who's serious raises their hand by paying. We never call.",
      },
      {
        step: "5 — Platform demo + custom quote",
        theirMechanic:
          "45–60 minute demo covering company profiles, market sizing, deal trends, exit analysis. Custom quote in the five- to six-figure annual range.",
        brunsonNote:
          "The platform demo is where the newsletter authority pays off — by the time the partner sees the dashboard, they already trust the data quality.",
        ourMove:
          "Same dynamic, different medium: by the time the buyer sees the Dashboard, they've read 6 emails, the SSRN paper, and a sector deep-dive. Trust is pre-loaded.",
      },
      {
        step: "6 — Annual contract + content amplification",
        theirMechanic:
          "Annual SaaS contract, multi-seat. Logo placement in 'used by' marquee. Customer often becomes a quoted source in subsequent reports.",
        brunsonNote:
          "The customer-as-content move is genius — every quote in the next report is both PR for the customer and earned authority for the platform. Compounds over time.",
        ourMove:
          "Customer wins land in /wins as anonymised case studies (CC BY 4.0). Different mechanic — anonymity-first, but the compounding effect is similar.",
      },
    ],
    whatTheyDoRight:
      "The content moat is real and hard to copy — daily newsletter, quarterly reports, and category-defining 'State of X' authority. The platform is dragged uphill by the newsletter, not the other way around.",
    whereTheyLeak:
      "The custom-quote model means a small-cheque buyer with a €5k-50k check size cannot self-serve. They subscribe to the newsletter, never become a customer.",
    ourMoveSummary:
      "Same content strategy, narrower category, public pricing. The newsletter reader can pay €7 and become a customer the same day.",
    sources: [
      "cbinsights.com homepage (logged out)",
      "Free newsletter signup flow",
      "Public 'State of X' report download flow",
    ],
  },

  {
    key: "dealroom",
    competitor: "Dealroom",
    tagline:
      "European-led startup database with tiered self-serve and enterprise sales motion stacked on top.",
    funnelArch: [
      {
        step: "1 — Cold traffic landing",
        theirMechanic:
          "Hero block leads with platform access (free + paid tiers) and ecosystem reports. Strong European VC + government partnerships visible in social proof.",
        brunsonNote:
          "Hybrid model — they want both self-serve and enterprise. That's hard to do; the self-serve tier risks cannibalising the enterprise close, the enterprise tier risks looking like an upcharge.",
        ourMove:
          "We pick a single primary motion (self-serve, monthly) and ladder above it (Insider €77/mo, Sector Sweep €1,797 one-time). The €1,797 rung is the upcharge that doesn't cannibalise the €49 floor.",
      },
      {
        step: "2 — Free signup",
        theirMechanic:
          "Email + name + company. Free tier gives limited search depth, watermarked exports, and read-only access to public profiles.",
        brunsonNote:
          "Free tier as enterprise lead-gen is the model — every free user is a potential paid conversion. The watermarked exports are the friction-as-feature that drives upgrades.",
        ourMove:
          "Acceleration Watch is the free tier — and it stays free forever, never gated. The conversion mechanic is the buyer-self-discovers-they-want-more, not artificial constraint.",
      },
      {
        step: "3 — Search depth paywall",
        theirMechanic:
          "After ~5 searches or attempts to access funding history, exports, or contact data, a paywall surfaces. Upgrade prompt with monthly + annual pricing.",
        brunsonNote:
          "The 5-search rule is the right metering — it lets the buyer feel real value before the wall. But the paywall hits before the buyer has built a habit.",
        ourMove:
          "We don't meter. The free Acceleration Watch shows 5 startups every Monday for as long as you're subscribed. Habit first, paywall never on the free tier.",
      },
      {
        step: "4 — Self-serve upgrade",
        theirMechanic:
          "Monthly + annual SaaS tiers, public pricing on the page. Stripe checkout, instant access on payment.",
        brunsonNote:
          "Self-serve upgrade is correct — they make it easy to convert without a call. The tier structure is clean.",
        ourMove:
          "Same mechanic — Stripe checkout, instant access, public price, monthly. We don't do annual lock-ins because monthly is the trust signal.",
      },
      {
        step: "5 — Enterprise upsell",
        theirMechanic:
          "For multi-seat, custom data feeds, or API access, enterprise contact form routes to AE. Custom pricing, annual contract, integration support.",
        brunsonNote:
          "The enterprise tier is bolted on top of the self-serve — most buyers never see it. That's actually fine; it's the right way to layer.",
        ourMove:
          "We surface the enterprise rung publicly (Sector Sweep, Insider, Fund Tier) with public pricing. No hidden tier. The buyer sees the whole ladder from day one.",
      },
      {
        step: "6 — Ecosystem reports + community",
        theirMechanic:
          "Co-branded reports with national VC associations, government innovation agencies, and accelerator networks. Drives top-of-funnel and retention via authority.",
        brunsonNote:
          "Ecosystem partnerships are the smart play — every co-branded report is essentially free distribution from the partner's audience. Hard to replicate without those relationships.",
        ourMove:
          "We replace partner-distribution with agent-distribution — MCP server, OpenAPI spec, agent-card endpoints, /md mirrors. Agents are the new co-marketing partners.",
      },
    ],
    whatTheyDoRight:
      "European-VC ecosystem positioning is genuinely strong — government and association partnerships drive top-of-funnel that competitors can't easily replicate. The hybrid self-serve + enterprise ladder is well-engineered.",
    whereTheyLeak:
      "Outside Europe the ecosystem partnerships are thin, and the search-depth paywall hits before the buyer has built habit. Global solo GPs default to Crunchbase or PitchBook before discovering Dealroom.",
    ourMoveSummary:
      "Geo-agnostic from day one. Free tier never paywalled. Agent distribution replaces association distribution.",
    sources: [
      "dealroom.co homepage (logged out)",
      "Public pricing page",
      "Free-tier search experience",
    ],
  },

  {
    key: "affinity",
    competitor: "Affinity",
    tagline:
      "Relationship-intelligence CRM sold through enterprise sales to fund-firm IT teams.",
    funnelArch: [
      {
        step: "1 — Cold traffic landing",
        theirMechanic:
          "Hero leads with 'Relationship Intelligence' positioning + 'Request a demo' CTA. Strong fund-logo proof. No public pricing, no self-serve trial.",
        brunsonNote:
          "Pure CRM-replacement framing — they're competing for the partner-team CRM line item, not the deal-flow tool budget. Different buyer, different funnel.",
        ourMove:
          "We're not a CRM and don't try to be. We feed CRMs — every signal exports as CSV, every API call returns clean JSON. Affinity could be a customer of ours.",
      },
      {
        step: "2 — Demo request form",
        theirMechanic:
          "Multi-field form with role, fund AUM, team size, current CRM. Routes to AE within 1 business day for a discovery call.",
        brunsonNote:
          "The team-size field is the qualifier — Affinity's economics work at 10+ partner-team seats. Solo GPs and 2-person funds aren't the ICP.",
        ourMove:
          "First Look Pass is single-seat — €7, 24-hour turnaround. Solo GPs are the primary ICP, not an exception.",
      },
      {
        step: "3 — Discovery + relationship-graph demo",
        theirMechanic:
          "60-minute demo: pull in the partner's email + calendar history, show auto-built relationship graph, demonstrate intro-warmth scoring.",
        brunsonNote:
          "The 'we already built your graph' moment is the close — partners see their own network visualised in 3 minutes and feel the value immediately. Visceral.",
        ourMove:
          "Our 'visceral close' is different — Day 4 email + €7 returns the partner's chosen sector pre-ranked by 14-day commit-velocity. They see their own thesis confirmed in a deliverable, not a graph.",
      },
      {
        step: "4 — Enterprise contract + IT integration",
        theirMechanic:
          "Annual contract, multi-seat, IT-led integration with email, calendar, Slack, and existing fund-management systems. 4–8 week onboarding.",
        brunsonNote:
          "The IT integration is both the moat and the cost — once it's wired in, switching costs are enormous. But the 4–8 week onboarding kills the small-fund close.",
        ourMove:
          "Zero IT integration. The MCP server installs in one line. The dashboard works in any browser. Onboarding is 4 minutes, not 4 weeks.",
      },
      {
        step: "5 — Renewal + seat expansion",
        theirMechanic:
          "Year-end review with CSM, expansion to additional seats, deeper integration into adjacent workflows (LP relations, portfolio support).",
        brunsonNote:
          "Land-and-expand from CRM into LP-relations + portco-support is the long-term play. Each adjacency adds a new line item and raises switching cost.",
        ourMove:
          "We don't expand by adjacency — we deepen by signal. Every signal added (commit velocity → contributor influx → dependents graph) tightens the same use case for the same buyer.",
      },
    ],
    whatTheyDoRight:
      "The auto-built relationship graph is a visceral demo moment — partners see their own network visualised in 3 minutes and feel the value before the price reveal. That's a textbook 'show, don't tell.'",
    whereTheyLeak:
      "The 4–8 week IT integration walls off every small fund and every solo GP. The funnel is built for the 10+ seat firm, and the unit economics require that floor.",
    ourMoveSummary:
      "Different category (signal, not CRM), different buyer (solo GP, not 10-seat firm), different time-to-value (4 minutes, not 4 weeks).",
    sources: [
      "affinity.co homepage (logged out)",
      "Demo-request form flow",
      "Public buyer reviews on G2",
    ],
  },

  {
    key: "crunchbase",
    competitor: "Crunchbase",
    tagline:
      "Freemium private-market database with the broadest top-of-funnel and the most familiar friction model.",
    funnelArch: [
      {
        step: "1 — Cold traffic landing",
        theirMechanic:
          "Brand-led hero — 'discover innovative companies' — with category navigation and free company profile pages. Strong SEO presence on every named startup.",
        brunsonNote:
          "Crunchbase wins SEO for almost every startup name in the world — that's the actual moat. Most cold traffic arrives via Google searching a specific company name.",
        ourMove:
          "We don't fight Crunchbase on company-name SEO — we own engineering-acceleration SEO. /alternatives, /compare, /answers, and /research are our keyword footprint.",
      },
      {
        step: "2 — Free profile view",
        theirMechanic:
          "Public company profile with name, founding year, stage, investors. Some fields blurred or marked 'Pro'. CTA to 'unlock more' on every profile.",
        brunsonNote:
          "The blurred-fields trick is psychologically perfect — visitors see exactly what they're missing, which spikes upgrade intent. Best-in-class freemium friction.",
        ourMove:
          "We don't blur — every public surface shows the full data. The upgrade is to live access, not to unblurred history.",
      },
      {
        step: "3 — Free signup wall",
        theirMechanic:
          "After a few profile views, signup wall appears: email + name. Unlocks 5 saved searches, basic alerts, limited exports.",
        brunsonNote:
          "The signup wall is correct — they're capturing email before the upgrade close. Standard 2-step funnel.",
        ourMove:
          "Same step, lower friction — single field (email) for Acceleration Watch. The buyer is captured 50% faster.",
      },
      {
        step: "4 — Pro upgrade (self-serve)",
        theirMechanic:
          "Monthly subscription, public pricing, Stripe checkout. Unlocks alert subscriptions, extended exports, advanced search filters.",
        brunsonNote:
          "Self-serve upgrade is correct, but the price point sits in the small-fund-irrelevant zone — too expensive for a solo angel, too cheap for a fund analyst's procurement to bother.",
        ourMove:
          "€9.97/mo founding rate is below the procurement threshold — angels and scouts buy on credit card without asking permission.",
      },
      {
        step: "5 — Enterprise upsell",
        theirMechanic:
          "For API access, multi-seat, or custom integrations, contact-sales form. Annual contract, custom pricing.",
        brunsonNote:
          "The enterprise tier is the high-margin business — Pro is the lead-gen, Enterprise is the revenue. Two-tier model executed well.",
        ourMove:
          "Same shape — Dashboard is lead-gen, Sector Sweep + Fund Tier is the revenue. Public pricing on every rung.",
      },
    ],
    whatTheyDoRight:
      "The SEO moat — owning company-name searches for almost every named startup — is essentially uncopyable. Every cold visitor arrives with high commercial intent. The blurred-fields freemium pattern is psychologically optimal.",
    whereTheyLeak:
      "The signal is fundamentally lagging — funding announcements, team changes, news mentions. By the time it appears in a Crunchbase alert, the round is closing or closed.",
    ourMoveSummary:
      "We're orthogonal — Crunchbase tells you who has raised, we tell you who is about to. We feed each other.",
    sources: [
      "crunchbase.com homepage (logged out)",
      "Public company profile pages",
      "Free + Pro signup flows",
    ],
  },
];

const TEARDOWN_BY_KEY: Record<string, CompetitorTeardown> = Object.fromEntries(
  TEARDOWNS.map((t) => [t.key, t]),
);

/**
 * Map a `/compare/[slug]` slug to the competitor teardowns that should
 * render on that page. Returns up to 3 teardowns per page (more is noisy).
 *
 * Slug → keys mapping is explicit so the editor stays in control of which
 * teardowns appear where, and SEO/agent payloads stay deterministic.
 */
const SLUG_TO_TEARDOWN_KEYS: Record<string, string[]> = {
  "vc-deal-flow-signal-vs-harmonic-ai": ["harmonic"],
  "vc-deal-flow-signal-vs-pitchbook": ["pitchbook"],
  "vc-deal-flow-signal-vs-cb-insights": ["cbinsights"],
  "vc-deal-flow-signal-vs-dealroom": ["dealroom"],
  "vc-deal-flow-signal-vs-affinity-relationship-intelligence": ["affinity"],
  "github-signals-vs-crunchbase-alerts": ["crunchbase"],
  "best-deal-flow-tools-vc-firms-2026": ["pitchbook", "cbinsights", "harmonic"],
  "best-deal-flow-tools-angel-investors": ["crunchbase", "dealroom"],
  "best-deal-flow-tools-seed-investors": ["harmonic", "pitchbook"],
  "best-deal-flow-tools-european-investors": ["dealroom", "pitchbook"],
  "best-deal-flow-tools-emerging-fund-managers": ["dealroom", "crunchbase"],
  "best-free-deal-flow-tools-2026": ["crunchbase", "dealroom"],
  "best-deal-flow-tools-ai-investors": ["cbinsights", "harmonic"],
  "best-ai-deal-sourcing-tools-2026": ["harmonic", "cbinsights"],
};

export function getTeardownsForSlug(slug: string): CompetitorTeardown[] {
  const keys = SLUG_TO_TEARDOWN_KEYS[slug] ?? [];
  return keys
    .map((k) => TEARDOWN_BY_KEY[k])
    .filter((t): t is CompetitorTeardown => Boolean(t));
}

export function getAllTeardownKeys(): string[] {
  return TEARDOWNS.map((t) => t.key);
}

export function getTeardownByKey(key: string): CompetitorTeardown | undefined {
  return TEARDOWN_BY_KEY[key];
}
