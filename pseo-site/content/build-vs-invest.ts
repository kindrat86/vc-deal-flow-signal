/**
 * Build-vs-Invest 2×2 by sector.
 *
 * Greg-Isenberg-shaped programmatic surface: for each tracked sector, score
 * "cost-to-build" (capital + regulatory + hardware overhead an indie founder
 * faces) against "deal-velocity" (rate at which deals close inside the
 * pre-fundraise window the rest of the site measures). Each page renders
 * the matrix, drops the sector into one of four quadrants, and offers
 * matched playbooks — one for the founder asking "should I just build this?"
 * and one for the investor asking "is this where my next cheque goes?".
 *
 * Pages are rendered by `app/build-vs-invest/[sector]/page.tsx`. Slugs match
 * the canonical sector slugs in `data/startups.json` so the sector roster
 * and live-startup count panel composes against real data.
 *
 * Scoring conventions (1–100):
 *   costToBuild  — 1   = a weekend with a laptop and zero capital
 *                  100 = decade of regulatory + hardware + capital risk
 *   dealVelocity — 1   = sector dormant, almost no rounds closing
 *                  100 = rounds closing inside the 6–12 week pre-fundraise window
 *
 * Quadrant thresholds: 50 / 50. Adjust here, the slug pages and the index
 * grid both read off this single source of truth.
 */

export type BuildVsInvestQuadrant =
  | "build" // low cost, high velocity → ship it yourself
  | "fund" // high cost, high velocity → write the cheque
  | "wait" // high cost, low velocity → capital trap, partner or stand down
  | "avoid"; // low cost, low velocity → cheap to build, nothing closes

export interface BuildVsInvestFAQ {
  question: string;
  answer: string;
}

export interface BuildVsInvestPlaybook {
  /** Three short, sequential moves. */
  steps: string[];
  /** One-line condition under which this playbook actually applies. */
  whenItFits: string;
}

export interface BuildVsInvestSector {
  /** Canonical sector slug — must match data/startups.json. */
  slug: string;
  /** Display name — also pulled from data/startups.json but inlined for SSG. */
  name: string;
  /** Plain-language scope of the sector. */
  scope: string;
  /** 1–100 — see file header for scoring conventions. */
  costToBuild: number;
  /** 1–100 — see file header for scoring conventions. */
  dealVelocity: number;
  /** Derived from the two scores. Recomputed at module load — see deriveQuadrant. */
  quadrant: BuildVsInvestQuadrant;
  /** Two-line headline rendered at the top of the page. */
  headline: string;
  /** One paragraph framing the bet. */
  thesis: string;
  /** What the cost-to-build score is actually measuring for this sector. */
  costNote: string;
  /** What the deal-velocity score is actually measuring for this sector. */
  velocityNote: string;
  /** What a solo / indie founder should do. */
  buildPlaybook: BuildVsInvestPlaybook;
  /** What an angel / fund GP should do. */
  fundPlaybook: BuildVsInvestPlaybook;
  /** Long-tail FAQ entries — feed the FAQPage JSON-LD. */
  faqs: BuildVsInvestFAQ[];
}

function deriveQuadrant(
  costToBuild: number,
  dealVelocity: number,
): BuildVsInvestQuadrant {
  const highCost = costToBuild >= 50;
  const highVelocity = dealVelocity >= 50;
  if (!highCost && highVelocity) return "build";
  if (highCost && highVelocity) return "fund";
  if (highCost && !highVelocity) return "wait";
  return "avoid";
}

// Raw entries — quadrant is filled in at module load so the rule lives in one place.
const RAW: Omit<BuildVsInvestSector, "quadrant">[] = [
  {
    slug: "ai-ml",
    name: "AI & Machine Learning",
    scope:
      "Foundation models, post-training infrastructure, inference, evals, agents, copilots, retrieval, fine-tuning, applied AI verticals.",
    costToBuild: 78,
    dealVelocity: 96,
    headline:
      "AI/ML is the most expensive thing to build and the fastest thing to fund.",
    thesis:
      "Engineering acceleration in AI/ML is so loud it pre-empts almost every other signal on the site. Velocity is the highest of any tracked sector — rounds compress to days once the right curve is visible — but the capital required to keep up with frontier costs makes this a category where most founders should be writing cheques, not code. The buildable wedge here is the niche eval, the niche tool, the niche agent — never the base model.",
    costNote:
      "Even a wedge AI product now carries a meaningful compute bill, a token budget, and a hire-fast pressure that turns indie-mode plans into Series A pitches inside one quarter.",
    velocityNote:
      "Pre-fundraise signal-to-announcement lag in AI/ML is the shortest of any sector we track — usually 4–8 weeks rather than the cross-site median of 6–12.",
    buildPlaybook: {
      whenItFits:
        "You have unfair distribution (an existing audience, an existing customer base, or proprietary domain data).",
      steps: [
        "Pick a single workflow inside one vertical, not a horizontal copilot.",
        "Ship against the cheapest viable model and an obvious eval; defer fine-tuning until usage proves a moat exists.",
        "Lock in a paid pilot before raising — AI/ML rounds without revenue evidence increasingly stall.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can underwrite frontier-cost burn and you have follow-on capital for the bridge nobody talks about at seed.",
      steps: [
        "Use the engineering-acceleration signal as a pre-news watchlist; respond inside 14 days of the trigger.",
        "Underwrite the post-training infra layer and the eval layer separately — different moats, different multiples.",
        "Avoid generic chat wrappers; verify a domain-data or distribution moat exists before the cheque clears.",
      ],
    },
    faqs: [
      {
        question:
          "Why is AI/ML in the fund quadrant if everyone says it is bubbly?",
        answer:
          "Bubbliness is a price story. The build-vs-invest framework is about velocity and cost: AI/ML deals genuinely close faster than any other sector we track, and the indie cost-to-build is higher than it looks once compute and salaries are honest. Both facts can be true even if entry valuations are stretched.",
      },
      {
        question: "Can a solo founder still ship a useful AI product?",
        answer:
          "Yes — but only in narrow, distribution-anchored wedges. The mistake is reading 'fund quadrant' as 'do not ship'. It means 'do not ship horizontally without capital'. Vertical, distribution-led wedges remain the highest indie hit-rate inside this sector.",
      },
    ],
  },
  {
    slug: "fintech",
    name: "Fintech",
    scope:
      "Payments, banking-as-a-service, embedded finance, RegTech, B2B accounting, crypto-adjacent ledger infrastructure, treasury.",
    costToBuild: 72,
    dealVelocity: 58,
    headline:
      "Fintech rewards capital and patience, not weekend builders.",
    thesis:
      "Regulatory drag is the dominant cost line — not engineering. The deal-velocity score is healthy because the sector keeps reopening as new compliance regimes create new entry windows, but the build path requires balance-sheet partners, licensing, and audit overhead that almost always pushes founders into a venture path early. Investors get a steady, mid-velocity pipeline; indie founders get a slow grind.",
    costNote:
      "Licensing, BIN sponsorship, KYC/KYB pipelines, and audit-readiness can pre-consume 12–18 months of runway before the first paid customer.",
    velocityNote:
      "Engineering-acceleration windows in fintech are commonly 8–10 weeks — broader than AI/ML because regulatory milestones are observable in commit history.",
    buildPlaybook: {
      whenItFits:
        "You are inside an existing regulated entity (a bank, a broker, an insurer) or shipping a non-regulated layer on top of one.",
      steps: [
        "Stay non-regulated as long as possible — orchestration, reconciliation, infra around the regulated rails.",
        "Find a sponsor bank or licensed partner before writing the first production transaction.",
        "Treat audit-readiness as a feature, not a final-quarter task.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can stomach 18-month regulatory cycles and you have a portfolio that benefits from the same compliance stack.",
      steps: [
        "Use commit-velocity bursts on compliance modules as the most underrated proxy for revenue inflection.",
        "Underwrite team-quality on the regulatory side before the engineering side.",
        "Map the sponsor-bank dependency for every deal — concentration risk shows up as a 30% valuation haircut on diligence.",
      ],
    },
    faqs: [
      {
        question: "Is fintech a build sector or a fund sector?",
        answer:
          "Fintech sits in the fund quadrant for almost every founder profile. The regulatory cost-to-build score is high enough that indie attempts usually convert into venture paths inside the first year regardless of initial intent.",
      },
      {
        question: "Why is deal-velocity higher than 50 if the sector is mature?",
        answer:
          "Mature does not mean dormant. New regulatory frames (open banking expansions, embedded-finance carve-outs, stablecoin clarity) keep reopening the deal window. Engineering acceleration tracks these openings cleanly.",
      },
    ],
  },
  {
    slug: "climate-tech",
    name: "Climate Tech",
    scope:
      "Carbon measurement, decarbonisation tooling, climate risk, energy software, grid-edge, climate finance, voluntary carbon markets.",
    costToBuild: 68,
    dealVelocity: 52,
    headline:
      "Climate tech is finally fundable software — but only the software half.",
    thesis:
      "The site's data shows engineering acceleration in climate-tech split cleanly: the software-only sub-sector (measurement, MRV, accounting, risk) moves like a healthy mid-velocity SaaS market, while the hardware-adjacent sub-sector (energy, materials, capture) carries five-to-eight-year capital cycles that make it functionally a different game. We score the blended sector just over the fund-quadrant line because software-side velocity now dominates the engineering signal.",
    costNote:
      "Pure-software climate plays are buildable; hardware-adjacent plays carry the highest capital intensity on the site, often nine-figure scale.",
    velocityNote:
      "The signal window has shortened from 14 weeks to roughly 10 as climate-software rounds compress alongside regulatory deadlines.",
    buildPlaybook: {
      whenItFits:
        "You can stay strictly in the software / MRV / risk layer and you have access to an enterprise design partner inside the first quarter.",
      steps: [
        "Anchor on a single regulatory disclosure regime (CSRD, SEC, SBTi) and ship the workflow that closes its gap.",
        "Avoid touching hardware — partner instead of building.",
        "Sell to sustainability or finance leads, not engineering — different buyer, different procurement timeline.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can separate climate-software from climate-hardware in your portfolio model; otherwise the blended IRRs will mislead.",
      steps: [
        "Underwrite climate-software and climate-hardware as two distinct sub-funds — the velocity and capital profiles disagree by a factor of five.",
        "Read MRV-pipeline commit-velocity as an early proxy for the next reporting-cycle revenue inflection.",
        "Time hardware bets to grant-cycle clusters, not engineering acceleration alone.",
      ],
    },
    faqs: [
      {
        question: "Is climate tech still fundable in 2026?",
        answer:
          "The software-only half is fundable on conventional venture timelines. The hardware-adjacent half remains a different asset class with longer cycles and higher capital intensity — the build-vs-invest framework treats them as two regimes inside one sector tag.",
      },
      {
        question: "Why is cost-to-build only 68, not 90+?",
        answer:
          "The score blends a low cost-to-build for software MRV with a much higher one for hardware. If your scope is hardware-only, treat the effective cost-to-build as ~95.",
      },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    scope:
      "Code review, observability, infra automation, build pipelines, IDE extensions, AI dev assistants, package management, internal platforms.",
    costToBuild: 28,
    dealVelocity: 84,
    headline:
      "Dev tools is the single best build-quadrant sector on this site.",
    thesis:
      "Dev tools combines the lowest realistic cost-to-build (literally just code, plus a few weeks of integrations) with one of the highest deal-velocity scores. Indie founders can ship credible products in weeks. Investors should still write cheques here — but they should know they are competing with founders who genuinely do not need them.",
    costNote:
      "A working OSS-first MVP can be shipped solo in under a quarter. The dominant cost line is distribution, not engineering.",
    velocityNote:
      "Engineering acceleration shows up in dev-tools commit history before almost anywhere else — short signal-to-announce window, often 5–8 weeks.",
    buildPlaybook: {
      whenItFits:
        "You ship daily, you have an OSS instinct, and you can write the first 100 users by hand.",
      steps: [
        "Start with an OSS core; let GitHub stars do top-of-funnel work.",
        "Pick a single workflow inside a single language ecosystem before generalising.",
        "Charge from day one — even at €9/month — so the build-vs-fund math closes without venture.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You are comfortable with bottoms-up GTM and you can wait for usage curves to inflect before metrics do.",
      steps: [
        "Pay attention to contributor-growth signals more than star counts — the former predicts revenue, the latter predicts attention.",
        "Underwrite the maintainer's bus-factor honestly; OSS-first dev tools fail through key-person concentration more than market mis-pick.",
        "Time the cheque to the dual-licence flip, not the announcement.",
      ],
    },
    faqs: [
      {
        question: "Should I bother raising if I am building a dev tool?",
        answer:
          "Only if you need distribution speed faster than OSS adoption gives you. The build-quadrant placement is exactly because most successful dev tools could have stayed bootstrapped — the question is whether you want to.",
      },
      {
        question: "Why is deal-velocity so high if the sector is crowded?",
        answer:
          "Crowded is the cause, not the counter-argument. High velocity reflects that funds price-in the speed at which a credible dev-tools team can compound — they pay early to avoid paying later.",
      },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    scope:
      "Cloud security, identity, data security, supply-chain security, GRC, vuln management, runtime protection, SOC automation.",
    costToBuild: 56,
    dealVelocity: 74,
    headline:
      "Cyber is the most reliable mid-velocity fund quadrant on the site.",
    thesis:
      "Cybersecurity rewards capital because the buyers are slow, the audit cycles are long, and the team-quality bar is high. Velocity is consistently strong because every fresh attack class re-opens the deal window. Indie founders can build adjacencies (audit tooling, dev-side controls) but the meaningful enterprise revenue almost always requires venture-backed GTM.",
    costNote:
      "The dominant cost line is enterprise sales, not engineering. Indie founders consistently underestimate the sales cycle by 2–3×.",
    velocityNote:
      "Engineering-acceleration windows are stable around 10–12 weeks — the cross-site median.",
    buildPlaybook: {
      whenItFits:
        "You are building developer-facing security tooling (SBOM, IaC scanning, secret detection) where the buyer is engineering, not CISO.",
      steps: [
        "Stay developer-facing — the CISO-led sale is venture-only.",
        "Ship into existing CI/CD pipelines as a check, not a dashboard, to compress the integration story.",
        "Open-source the detection layer; charge for the remediation and audit-readiness layer.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can underwrite an enterprise GTM build and you have CISO references that close pilots in under 90 days.",
      steps: [
        "Underwrite the team's enterprise-sales pedigree before the engineering pedigree.",
        "Read accelerated commits on detection modules as a proxy for a fresh attack-class arbitrage.",
        "Map the channel partner before the cheque — almost no cyber company scales without one.",
      ],
    },
    faqs: [
      {
        question: "Why is cybersecurity not in the build quadrant?",
        answer:
          "Because the cost line is sales, not engineering. An indie founder can ship a credible product but cannot run the 9–14 month enterprise sales cycle that the meaningful revenue requires.",
      },
      {
        question: "Are developer-facing security tools an exception?",
        answer:
          "Partly. Dev-side security (SBOM, IaC scanning, secret detection) can be built indie because the buyer is the engineer, not the CISO. Treat that sub-niche as effectively dev-tools-shaped.",
      },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    scope:
      "Clinical workflow, EHR integration, RCM, payer ops, ambient documentation, clinical trial tooling, patient-facing care, healthcare AI.",
    costToBuild: 80,
    dealVelocity: 46,
    headline:
      "Healthcare is the patient capital quadrant — and most founders forget the patient.",
    thesis:
      "Healthcare's velocity is below the cross-site median because procurement, compliance, and pilot cycles compress engineering signals into a much longer reveal window. The cost-to-build is dominated by compliance, integration, and clinical-evidence work that has no software-only shortcut. The quadrant is honest: this is wait-or-partner territory unless you already have clinical relationships.",
    costNote:
      "HIPAA, SOC 2, HL7 / FHIR integrations, and clinical-pilot overhead consistently pre-consume 18 months of runway.",
    velocityNote:
      "Engineering acceleration in healthcare is a leading indicator with a longer fuse — 14–18 weeks rather than the cross-site median.",
    buildPlaybook: {
      whenItFits:
        "You already work inside a clinical system or you are shipping a developer-tools-shaped layer that healthcare incidentally consumes.",
      steps: [
        "Skip patient-facing scope; start payer-side or provider-back-office.",
        "Treat the first pilot as the product — instrument it before scaling features.",
        "Defer EHR integration until a second design partner asks for it, not the first.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can underwrite an 18–24 month pilot-to-revenue path and you have clinical references on the LP side.",
      steps: [
        "Underwrite founders with operating clinical experience; everything else compresses faster around them.",
        "Treat slow commit-velocity months as expected — read the signal at quarterly resolution, not weekly.",
        "Map the reimbursement code path before the cheque — without one, every healthcare deal is a slow no.",
      ],
    },
    faqs: [
      {
        question: "Is healthcare AI an exception?",
        answer:
          "Marginally. Ambient documentation and triage tooling shorten the signal-to-revenue path but still inherit the compliance cost-to-build. Treat them as healthcare with an AI/ML co-tag, not AI/ML with a healthcare lens.",
      },
      {
        question: "Can a solo founder ship anything credible here?",
        answer:
          "Only adjacent — developer-tools-for-healthcare-engineering, MRV-style audit tooling, or pure infrastructure. Patient-facing scope without a clinical co-founder is rarely the right call.",
      },
    ],
  },
  {
    slug: "edtech",
    name: "EdTech",
    scope:
      "K-12, higher-ed, workforce learning, corporate L&D, tutoring AI, assessment, accreditation infrastructure, language learning.",
    costToBuild: 32,
    dealVelocity: 38,
    headline:
      "EdTech is cheap to ship and slow to monetise — most founders should reroute.",
    thesis:
      "The cost-to-build is low because the engineering surface is well-understood, but the deal-velocity score is below the cross-site median. Procurement is slow, budgets are politicised, and the post-AI consumer-side has compressed margin. The honest answer is most EdTech ideas should be rerouted into adjacent sectors — workforce-learning, recruiting, or vertical AI — where the deal mechanics are cleaner.",
    costNote:
      "Indie founders consistently ship working EdTech in under a quarter. The harder cost is the 12–18 month procurement cycle.",
    velocityNote:
      "Engineering acceleration in EdTech rarely compresses below 16 weeks — the signal is real but the funding window is slow.",
    buildPlaybook: {
      whenItFits:
        "You are shipping a workforce-learning tool sold to L&D budgets, not an institutional K-12 product sold to school districts.",
      steps: [
        "Avoid public-sector procurement entirely on the first product.",
        "Pick a budget owner with quarterly discretionary spend (L&D, manager-level) rather than annual board-approved spend.",
        "Treat the consumer-side as a pricing trap — premium-only or freemium-with-clear-paid-trigger.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a portfolio thesis around workforce learning specifically, not consumer or K-12.",
      steps: [
        "Underwrite procurement-path risk explicitly — treat institutional deals as 2× the announced cycle.",
        "Favour B2B workforce-learning sub-niches with discretionary budget owners.",
        "Be patient on consumer-side commits — the velocity signal lags consumer-side revenue by an extra quarter.",
      ],
    },
    faqs: [
      {
        question: "Why is EdTech in the avoid quadrant?",
        answer:
          "Because the build cost is low and the velocity is low. That combination kills time-to-cashflow more reliably than either one alone. Reroute to adjacent sectors where the deal mechanics close faster.",
      },
      {
        question: "What sub-niche actually works?",
        answer:
          "Workforce learning sold to L&D budgets — particularly anything that compresses certification, onboarding, or compliance training. Consumer and K-12 are the failure modes.",
      },
    ],
  },
  {
    slug: "ecommerce-infrastructure",
    name: "E-commerce Infrastructure",
    scope:
      "Headless commerce, post-purchase, returns, marketplace operations, merchant tooling, payments orchestration, shipping/fulfilment software.",
    costToBuild: 36,
    dealVelocity: 62,
    headline:
      "E-commerce infra is a clean build quadrant — adjacent layers, never the platform.",
    thesis:
      "The platform layer (Shopify, Amazon-shaped marketplaces) is closed. But the adjacent infrastructure layer — returns, post-purchase, ops, merchant tooling — is buildable, has a paying buyer with a clear ROI conversation, and sits comfortably in the build quadrant for the right founder profile.",
    costNote:
      "Indie cost-to-build is low. The harder cost is integration breadth — each new platform integration is a quarter of engineering work.",
    velocityNote:
      "Velocity is healthy because merchants compound on each other's signal — once one ops tool wins inside a Shopify Plus account, the rest of the segment opens.",
    buildPlaybook: {
      whenItFits:
        "You can find a single merchant willing to be your design partner inside the first month.",
      steps: [
        "Anchor on one platform (Shopify Plus, Amazon, BigCommerce) and one buyer (ops, finance, support) before expanding.",
        "Charge per-merchant per-month — avoid per-transaction pricing until the unit economics are obvious.",
        "Ship into existing app marketplaces before standalone — distribution is the moat.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can underwrite app-marketplace-dependent distribution and you have visibility into the platform's policy direction.",
      steps: [
        "Track app-marketplace install velocity as the most reliable revenue proxy.",
        "Underwrite platform-policy risk explicitly — a Shopify category change can wipe 40% ARR overnight.",
        "Prefer ops / post-purchase plays over front-end ones — sticker, less commodity.",
      ],
    },
    faqs: [
      {
        question: "Should I build on Shopify or stay platform-agnostic?",
        answer:
          "Start single-platform. Multi-platform-from-day-one is the most reliable indie failure mode in this sector — it triples the integration cost without tripling the addressable market.",
      },
      {
        question: "Is the platform layer itself ever buildable?",
        answer:
          "Effectively no. The platform layer is closed; only adjacent infrastructure rewards new entrants. The build quadrant placement is strictly about the adjacent layer.",
      },
    ],
  },
  {
    slug: "supply-chain",
    name: "Supply Chain",
    scope:
      "Procurement, logistics orchestration, freight, warehouse software, customs/trade compliance, B2B marketplaces, supplier risk.",
    costToBuild: 58,
    dealVelocity: 34,
    headline:
      "Supply chain is the slowest-moving sector we track — bet on capital, not on velocity.",
    thesis:
      "Engineering-acceleration windows in supply chain are the longest on the site — 18–24 weeks is normal. The cost-to-build is mid-range but the procurement cycle is long, the buyers are conservative, and the data-quality work nobody talks about pre-consumes years. The honest quadrant placement is wait-or-partner.",
    costNote:
      "Building is not what's expensive; integrating with legacy ERPs, EDI, and 1970s-era trade systems is.",
    velocityNote:
      "Long fuse — deals close, but not on the same calendar as the rest of the site. Resolution is monthly, not weekly.",
    buildPlaybook: {
      whenItFits:
        "You have operating experience inside logistics or procurement and you can land a paid pilot through your network in under a quarter.",
      steps: [
        "Start with a single mode (freight, customs, warehousing) and a single buyer persona.",
        "Avoid the marketplace shape — the take-rate math is brutal at indie scale.",
        "Anchor revenue on annual contracts; supply-chain buyers do not pay monthly.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have patient capital and you can ignore engineering-acceleration spikes that do not translate into revenue for 9 months.",
      steps: [
        "Underwrite the founder's industry network harder than the technology.",
        "Treat fast engineering acceleration as suspect — most supply-chain commits do not predict revenue at the cross-site median lag.",
        "Time the cheque to the second design-partner conversion, not the first.",
      ],
    },
    faqs: [
      {
        question: "Why is the signal lag so long in supply chain?",
        answer:
          "Because the buyer is slow and the integrations are calendar-driven. Engineering acceleration shows up months before procurement clears, which is also months before revenue.",
      },
      {
        question: "Are there exceptions inside supply chain?",
        answer:
          "Modern-stack adjacent plays (Slack-native ops, embedded-finance for SMB freight) close on conventional venture calendars. Treat them as supply-chain by topic but not by velocity.",
      },
    ],
  },
  {
    slug: "web3",
    name: "Web3",
    scope:
      "On-chain infrastructure, stablecoin rails, wallets, DeFi tooling, restaking, MEV, RWAs, tokenisation platforms.",
    costToBuild: 42,
    dealVelocity: 32,
    headline:
      "Web3 is cheap to build and slow to close — the most over-tagged sector on the site.",
    thesis:
      "The 2021 mania conditioned founders and funds to expect deal velocity that the sector has not delivered for two years. Engineering acceleration still happens, but the signal-to-revenue path is the longest on the site outside hardware. Most indie attempts here are time taxes; the institutional sub-niches (stablecoin rails, custody, RWAs) reward capital but require regulated-finance fluency.",
    costNote:
      "Open infrastructure means build cost is low; what's expensive is regulatory positioning and the legal opinion stack.",
    velocityNote:
      "Outside stablecoin-rails and tokenisation, engineering-acceleration windows commonly run 20+ weeks before any revenue evidence.",
    buildPlaybook: {
      whenItFits:
        "You are shipping developer-tooling-for-web3-engineers, not an end-user product.",
      steps: [
        "Stay dev-side; the end-user side has not paid software-style revenue at scale.",
        "Anchor on stablecoin or institutional rails — they have the only real revenue evidence in the sector.",
        "Treat 'crypto-native distribution' as a meme; sell to engineering teams the same way as any other dev tool.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a dedicated web3 thesis with comfort around regulatory and counterparty risk.",
      steps: [
        "Underwrite stablecoin rails and tokenisation separately from the rest — they are effectively fintech with a web3 tag.",
        "Read engineering acceleration with suspicion — most web3 commit bursts do not predict revenue.",
        "Avoid retail-end-user products; the unit economics still do not close.",
      ],
    },
    faqs: [
      {
        question: "Is web3 dead?",
        answer:
          "No, but most of it is not investable on conventional venture timelines. The honest framing is: stablecoin rails and tokenisation are fintech-shaped and fundable; the rest is a long-fuse research bet.",
      },
      {
        question: "What about restaking, MEV, RWAs?",
        answer:
          "RWAs follow the stablecoin / tokenisation rails curve. Restaking and MEV are infrastructure plays where revenue is concentrated in a handful of incumbents; new entrants face a brutal slope.",
      },
    ],
  },
  {
    slug: "enterprise-saas",
    name: "Enterprise SaaS",
    scope:
      "Vertical SaaS, horizontal SaaS for ops/sales/marketing/finance/HR, integration platforms, workflow software, internal tools.",
    costToBuild: 38,
    dealVelocity: 68,
    headline:
      "Enterprise SaaS is the most predictable fund quadrant — and the most overlooked build quadrant.",
    thesis:
      "Enterprise SaaS sits on the boundary. Indie founders can ship — and many do — but the meaningful revenue rewards capital. Engineering-acceleration signal is consistent and lag is well-behaved (8–12 weeks). The right framing is: build the vertical wedge; fund the platform play.",
    costNote:
      "Cost-to-build is low. Cost-to-grow is high — enterprise GTM scales with capital.",
    velocityNote:
      "Engineering acceleration tracks neatly to revenue with a 10-week lag on average; the cleanest signal on the site outside dev tools.",
    buildPlaybook: {
      whenItFits:
        "You are anchoring on a single vertical (legal, dental, accounting, marine, construction) with a clear buyer.",
      steps: [
        "Pick a vertical, not a horizontal, on day one.",
        "Charge enterprise-shaped pricing from the first paid pilot — €500/month minimum.",
        "Avoid the integration trap — ship one integration that matters; defer the rest.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can underwrite an enterprise GTM motion and you have CRO-level references that close in under 90 days.",
      steps: [
        "Read commit-velocity on the integrations module as a proxy for revenue expansion.",
        "Underwrite NRR potential before logo-acquisition speed.",
        "Vertical SaaS routinely outperforms horizontal SaaS at indie founder profiles — adjust the cheque accordingly.",
      ],
    },
    faqs: [
      {
        question:
          "Why does this sector show up in both the build and fund discussion?",
        answer:
          "Because it genuinely sits on the boundary. Vertical SaaS rewards builders; platform plays reward capital. The score reflects the blended sector.",
      },
      {
        question: "Is vertical or horizontal more buildable?",
        answer:
          "Vertical. The build quadrant treatment of enterprise SaaS only holds at indie founder profiles if the wedge is vertical — horizontal SaaS without capital is the most common indie failure mode in this sector.",
      },
    ],
  },
  {
    slug: "data-infrastructure",
    name: "Data Infrastructure",
    scope:
      "Data warehouses, lakehouses, ETL, transformation, observability, governance, vector databases, embedding pipelines, RAG infrastructure.",
    costToBuild: 64,
    dealVelocity: 82,
    headline:
      "Data infrastructure is fund quadrant — but the indie wedge inside it is the best on the site.",
    thesis:
      "The core data-warehouse layer is closed and capital-intensive. But the indie wedge — the developer-tools-shaped sliver that lives on top of the warehouse — is one of the highest-yield build opportunities on the site. Investors should fund the core layer; founders should build the wedge.",
    costNote:
      "Core infrastructure is expensive and team-heavy. Adjacent dbt-shaped tooling is buildable at indie scale.",
    velocityNote:
      "Engineering acceleration in data infra is among the cleanest on the site — 8–10 week lag, with a very strong link to revenue inflection.",
    buildPlaybook: {
      whenItFits:
        "You are shipping a dbt-shaped adjacent tool, not a new warehouse.",
      steps: [
        "Skip the warehouse layer entirely — pick a single workflow (testing, lineage, governance, prompt-ops) on top.",
        "Plug into existing warehouses on day one — Snowflake, BigQuery, Databricks, Postgres.",
        "Distribute through dbt-style OSS — the indie velocity advantage compounds.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You can underwrite enterprise infrastructure GTM and your portfolio model handles long Series A → B compounding.",
      steps: [
        "Underwrite the core warehouse / vector / observability layer with patient capital — short-cycle outperformers are the exception.",
        "Read contributor-growth as the most reliable revenue proxy in the sector.",
        "Treat the AI / vector sub-niche as compositionally different from classic data infra; price it on AI/ML curves, not data-infra curves.",
      ],
    },
    faqs: [
      {
        question: "Is the data warehouse layer still investable?",
        answer:
          "Marginally. The incumbents are entrenched and the cost-to-build is high. The investable layer is now everything adjacent — testing, governance, lineage, vector — not the warehouse itself.",
      },
      {
        question: "How does this sector overlap with AI/ML?",
        answer:
          "Vector databases, embedding pipelines, and RAG infrastructure straddle both. Treat them as data-infra by mechanics (revenue ties to ingest / query volumes) but with AI/ML co-tagged competitive dynamics.",
      },
    ],
  },
  {
    slug: "robotics",
    name: "Robotics",
    scope:
      "Industrial robotics, humanoid, mobile robotics, drones, simulation, robot operating systems, AI-controlled manipulation.",
    costToBuild: 92,
    dealVelocity: 44,
    headline:
      "Robotics is the most capital-intensive sector — wait quadrant for almost everyone.",
    thesis:
      "Cost-to-build is the highest on the site outside space-tech: hardware, simulation infrastructure, and team-quality requirements compound. Velocity has improved as AI controllers absorbed some robotics burn, but the signal-to-revenue lag remains long. The honest framing is: this is not a sector to enter without nine-figure conviction.",
    costNote:
      "BoM costs, custom hardware, and simulation environments routinely consume €10M before the first commercial unit.",
    velocityNote:
      "Engineering acceleration in robotics is increasingly software-led (AI controllers) which shortens the signal window — but the hardware tail still extends revenue 12–18 months past the signal.",
    buildPlaybook: {
      whenItFits:
        "You are shipping a robotics-adjacent software layer (simulation, MLops for robotics, operator tooling), not a robot itself.",
      steps: [
        "Skip hardware — pick a software layer that any robotics team consumes.",
        "Sell to engineering, not procurement; the buyers are different.",
        "Treat the robotics part as your reference customer, not your product.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a hard-tech thesis with patient capital and you can stage cheques against milestones, not announcements.",
      steps: [
        "Underwrite the software-controller layer separately from the hardware platform.",
        "Treat fast commit-velocity in AI-controller modules as the only reliable short-cycle signal in the sector.",
        "Time hardware deployments to manufacturing milestones, not investor decks.",
      ],
    },
    faqs: [
      {
        question: "What about humanoids?",
        answer:
          "Humanoids inherit every robotics constraint plus an additional public-attention discount. The build-vs-invest framework would treat them as a sub-niche of robotics with even higher cost-to-build and slightly higher (because of public attention) deal velocity.",
      },
      {
        question: "Is there any indie path in robotics?",
        answer:
          "Only adjacent — simulation, dev tools, controller infrastructure. Building a physical robot solo is not on the table on conventional venture timelines.",
      },
    ],
  },
  {
    slug: "legal-tech",
    name: "Legal Tech",
    scope:
      "Contract intelligence, e-discovery, legal research, matter management, in-house counsel tools, litigation analytics, vertical AI for legal.",
    costToBuild: 34,
    dealVelocity: 58,
    headline:
      "Legal tech is one of the cleanest build-quadrant plays of the AI cycle.",
    thesis:
      "Vertical AI inside legal has compressed the cost-to-build and lifted the deal-velocity in tandem. The buyer is concentrated (general counsel, ops director), the procurement is slow but predictable, and the indie founder has a clear runway to a paid pilot. This is a build-quadrant sector that punches above its weight.",
    costNote:
      "Indie cost-to-build is low; the cost line that catches founders is procurement cycle length, not engineering.",
    velocityNote:
      "Engineering acceleration in legal-tech ties to revenue with a 10–12 week lag — average to slightly above-median for the site.",
    buildPlaybook: {
      whenItFits:
        "You can find a single law firm or in-house team willing to be your first paid pilot inside the first quarter.",
      steps: [
        "Anchor on a single practice area (M&A, real estate, IP, employment) before generalising.",
        "Treat data security as a first-class feature; legal buyers will sink deals over it.",
        "Charge per-attorney per-month rather than per-firm — the unit economics close faster.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a vertical AI thesis with comfort around slow but high-NRR enterprise customers.",
      steps: [
        "Underwrite NRR explicitly — legal customers churn rarely once anchored.",
        "Read contract-corpus integration commits as the most reliable revenue proxy.",
        "Avoid horizontal legal-research plays; the wedge is always vertical.",
      ],
    },
    faqs: [
      {
        question: "Is legal tech crowded?",
        answer:
          "The horizontal layer (research, e-discovery) is. The vertical layer (matter-type-specific AI) is wide open and represents most of the indie build path in the sector.",
      },
      {
        question: "Why is the deal-velocity moderate rather than high?",
        answer:
          "Because legal buyers are slow even when convinced. Engineering acceleration shows up cleanly, but the revenue signal lags by a full quarter past the cross-site median.",
      },
    ],
  },
  {
    slug: "hr-tech",
    name: "HR Tech",
    scope:
      "Recruiting, ATS, HRIS, payroll, benefits, performance, learning, internal mobility, vertical AI for people teams.",
    costToBuild: 30,
    dealVelocity: 52,
    headline:
      "HR tech is buildable, mid-velocity, and the cleanest sector for distribution-led founders.",
    thesis:
      "HR tech is cheap to ship and the buyer (people ops, talent leadership) has discretionary monthly budget. The deal-velocity score is right at the build-quadrant boundary because procurement is consistent but never fast. Indie founders with audience or distribution outperform here; investors should bet on distribution moats, not feature moats.",
    costNote:
      "Indie cost-to-build is among the lowest on the site. The harder cost is integration overhead with payroll and HRIS systems.",
    velocityNote:
      "Engineering acceleration in HR tech ties to revenue with a 12–14 week lag — close to the cross-site median.",
    buildPlaybook: {
      whenItFits:
        "You have audience or distribution into the talent / people-ops community before you write a line of code.",
      steps: [
        "Anchor on a single budget owner (talent, L&D, comp) rather than HR generally.",
        "Ship into existing HRIS marketplaces (BambooHR, Rippling, HiBob) on day one.",
        "Price into discretionary monthly budgets — €50–€500/month per buyer.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a thesis on distribution-led HR plays specifically and you can underwrite slow but compounding NRR.",
      steps: [
        "Underwrite the distribution moat before the feature moat.",
        "Read commits on HRIS-integration modules as a leading revenue indicator.",
        "Treat horizontal HR plays as the failure mode — favour vertical (industry-specific) wedges.",
      ],
    },
    faqs: [
      {
        question: "Is HR tech saturated?",
        answer:
          "The horizontal layer is. The vertical and integration-marketplace layers are not. Indie founders who pick a vertical or anchor on an HRIS marketplace consistently outperform horizontal entrants.",
      },
      {
        question: "Why is cost-to-build so low if integrations are expensive?",
        answer:
          "Because the integration cost is amortised across the HRIS marketplace. Each integration unlocks a fresh distribution channel; the cost is real but the payback is fast.",
      },
    ],
  },
  {
    slug: "proptech",
    name: "PropTech",
    scope:
      "Real estate transaction software, property management, construction tech, IoT for buildings, mortgage and title, commercial real estate analytics.",
    costToBuild: 54,
    dealVelocity: 36,
    headline:
      "PropTech is the slowest fund-quadrant adjacent we track — avoid the indie path.",
    thesis:
      "PropTech procurement is dominated by relationships, not features. The cost-to-build is moderate but the velocity is below the cross-site median because the buyers are deeply network-driven and engineering acceleration rarely converts inside a 14-week window. Indie founders should reroute; investors should write cheques only to founders with operating real-estate experience.",
    costNote:
      "Indie cost-to-build is moderate; the dominant cost line is relationship-building and customer-development inside an industry that does not respond to cold outreach.",
    velocityNote:
      "Engineering acceleration in proptech is the least correlated with revenue across all sectors except supply chain — 18–24 week lag is common.",
    buildPlaybook: {
      whenItFits:
        "You have operating experience inside real estate, construction, or property management and a network you can sell into without cold outreach.",
      steps: [
        "Skip cold outreach entirely — start with your existing network.",
        "Anchor on a single transaction type (rental, sale, financing, mgmt) before generalising.",
        "Avoid IoT / hardware — pure software has the best indie odds in the sector.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a proptech thesis with patient capital and you can underwrite relationship-led GTM.",
      steps: [
        "Underwrite the founder's industry network as the primary input.",
        "Read engineering acceleration with suspicion — many proptech commit bursts do not translate into revenue at the cross-site median lag.",
        "Time cheques to evidence of operational customer adoption, not platform completeness.",
      ],
    },
    faqs: [
      {
        question: "Are there any fast-moving sub-niches in proptech?",
        answer:
          "Mortgage and title software adjacent to fintech rails closes faster than the rest of the sector. Treat them as fintech-shaped with a proptech tag.",
      },
      {
        question: "Why is the velocity so low?",
        answer:
          "Because the procurement is relationship-led and the buyers reward incumbents. Engineering signals show up early but the deal calendar is dominated by network, not feature differentiation.",
      },
    ],
  },
  {
    slug: "agtech",
    name: "AgTech",
    scope:
      "Precision agriculture, ag-data infrastructure, supply chain for food, on-farm robotics, sustainability MRV for ag, ag-finance.",
    costToBuild: 74,
    dealVelocity: 38,
    headline:
      "AgTech is hardware-heavy, slow, and only fundable inside a dedicated thesis.",
    thesis:
      "AgTech inherits hardware, weather, and seasonality risk in the same package. Cost-to-build is high outside pure software, and even the software layer is bottlenecked by adoption cycles that move at the speed of a growing season. The wait quadrant is honest — this is patient-capital territory.",
    costNote:
      "Pure-software ag-data plays are buildable at indie scale; everything hardware-adjacent compounds capital quickly.",
    velocityNote:
      "Engineering acceleration ties to revenue on a 6–9 month lag — much longer than the cross-site median because adoption is seasonal.",
    buildPlaybook: {
      whenItFits:
        "You can stay strictly in ag-data / ag-finance / supply-chain-for-food and you have operating exposure to a growing region.",
      steps: [
        "Avoid hardware entirely on the first product.",
        "Anchor on a single growing region — generalising too early is the dominant failure mode.",
        "Treat the season as your release cadence; ship a major version per growing cycle, not per sprint.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a dedicated ag/food thesis with patient capital and seasonal-cycle tolerance.",
      steps: [
        "Underwrite seasonal cash-flow patterns; quarterly revenue lumpiness is structural, not a red flag.",
        "Read hardware-platform acceleration as expansion signal, software-platform acceleration as adoption signal.",
        "Time cheques to second-season revenue evidence, not first-season pilots.",
      ],
    },
    faqs: [
      {
        question: "Is precision agriculture finally working?",
        answer:
          "Pieces of it. The data layer is fundable; the hardware layer remains a five-to-ten year cycle. Most agtech failures conflate the two.",
      },
      {
        question: "Can a solo founder ship credible agtech?",
        answer:
          "Only software-side, only inside a region they already know. Hardware-adjacent agtech is not a viable solo path on conventional timelines.",
      },
    ],
  },
  {
    slug: "gaming",
    name: "Gaming",
    scope:
      "Game development tools, game-as-a-service infrastructure, esports, UGC platforms, AI for game content, mobile and web gaming.",
    costToBuild: 48,
    dealVelocity: 42,
    headline:
      "Gaming is the most hit-driven sector we track — neither quadrant is a default.",
    thesis:
      "Gaming defies the build-vs-invest framework cleanly. Hit-driven revenue means deal-velocity averages low but spikes hard around viral moments. Cost-to-build is moderate but compounds around content. The honest framing: avoid the studio shape entirely; favour gaming-infrastructure plays where the deal mechanics resemble dev tools.",
    costNote:
      "Studio-shape gaming is content-heavy and the cost compounds; infrastructure-shape gaming inherits dev-tools cost structure.",
    velocityNote:
      "Hit-driven distribution means the average velocity is low but the tail is heavy — outliers move 5–10× faster than the cross-site median.",
    buildPlaybook: {
      whenItFits:
        "You are building gaming infrastructure (tools, services, UGC platforms) — not a studio.",
      steps: [
        "Skip the studio shape entirely on the first product.",
        "Pick a single game engine (Unity, Unreal, Godot) and build for its developer community first.",
        "Treat hit-driven revenue as a tail, not a base case — build on infrastructure economics.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a gaming-infrastructure thesis and you can stomach hit-driven studio outcomes.",
      steps: [
        "Underwrite gaming-infrastructure plays on dev-tools economics, not studio economics.",
        "Read commit-velocity inside engine-specific tooling as the most reliable signal.",
        "Avoid the studio shape unless you have a hit-driven portfolio model.",
      ],
    },
    faqs: [
      {
        question: "Should investors fund gaming studios?",
        answer:
          "Only inside a hit-driven portfolio model with explicit tail-distribution underwriting. Most generalist funds underperform on gaming-studio bets because the variance is misunderstood at portfolio-construction time.",
      },
      {
        question: "What about AI-generated game content?",
        answer:
          "Treat it as AI/ML applied to gaming — the unit economics resemble vertical AI, not gaming. The build-vs-invest math runs off AI/ML scores, not gaming ones.",
      },
    ],
  },
  {
    slug: "space-tech",
    name: "Space Tech",
    scope:
      "Launch, satellite hardware, ground stations, earth observation, in-orbit servicing, defence-adjacent space, satellite data analytics.",
    costToBuild: 96,
    dealVelocity: 36,
    headline:
      "Space tech is the only sector where the cheque needs nine zeros — wait quadrant for everyone else.",
    thesis:
      "Cost-to-build is the highest on the site. Velocity has improved as satellite-data plays (effectively SaaS) absorbed some space-tech burn, but the dominant capital cycle still measures in years. This is dedicated-thesis territory for the smallest set of investors; founders without prior space-industry exposure should look elsewhere.",
    costNote:
      "Hardware, launch slots, regulatory clearance, and team-quality requirements compound to the highest cost-to-build on the site.",
    velocityNote:
      "Engineering acceleration in space-tech is increasingly software-led (satellite-data analytics) which shortens the signal window for that sub-niche; the launch/hardware tail still runs in multi-year cycles.",
    buildPlaybook: {
      whenItFits:
        "You are shipping satellite-data analytics or ground-software, not hardware.",
      steps: [
        "Skip hardware. Pick a satellite-data vertical (maritime, insurance, agriculture, defence) and ship analytics on top.",
        "Buy data from constellation operators; do not build your own constellation.",
        "Sell to specific verticals; horizontal earth-observation plays underperform.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a dedicated space-tech thesis, nine-figure capacity, and patience for decade-long cycles.",
      steps: [
        "Underwrite hardware separately from satellite-data — they are different asset classes.",
        "Treat satellite-data analytics as vertical SaaS; treat launch and hardware as deep-tech.",
        "Time cheques to regulatory milestones rather than engineering signals.",
      ],
    },
    faqs: [
      {
        question: "Is satellite-data analytics actually buildable?",
        answer:
          "Yes — treat it as vertical SaaS with a space tag. The build-vs-invest math for that sub-niche resembles enterprise SaaS rather than space-tech.",
      },
      {
        question: "Why is deal-velocity not the lowest on the site?",
        answer:
          "Because satellite-data analytics has compressed velocity for one sub-niche. If you filter to launch / hardware only, velocity is materially lower than the score shown.",
      },
    ],
  },
  {
    slug: "social-community",
    name: "Social & Community",
    scope:
      "Community platforms, niche social networks, creator tools, audience monetisation, group chat, newsletter infrastructure.",
    costToBuild: 26,
    dealVelocity: 44,
    headline:
      "Social-and-community is the cheapest sector to build and the hardest to monetise — build with audience or skip it.",
    thesis:
      "Cost-to-build is the lowest on the site outside dev tools. But the deal-velocity score sits just below the build-quadrant boundary because the revenue path is dominated by audience, not feature. Founders with existing distribution outperform; founders without it underperform predictably. Investors should bet on distribution-anchored teams, not platforms.",
    costNote:
      "Indie cost-to-build is trivial; the harder cost is audience acquisition and the unit economics of community monetisation.",
    velocityNote:
      "Engineering acceleration in community-shape sectors is a weak revenue signal — distribution dominates the curve.",
    buildPlaybook: {
      whenItFits:
        "You have audience or existing community before writing a line of code — otherwise reroute.",
      steps: [
        "Pre-validate with audience first; the build is the cheapest part.",
        "Anchor on a niche (industry, profession, hobby) rather than a horizontal community shape.",
        "Charge from day one for the community itself; ad-supported community is a near-zero EV path at indie scale.",
      ],
    },
    fundPlaybook: {
      whenItFits:
        "You have a creator-economy or niche-community thesis and you underwrite distribution moats, not feature moats.",
      steps: [
        "Underwrite distribution before product. Founders with audience or existing community win this sector.",
        "Read commit-velocity as a weak signal; community metrics (activity, retention) lead revenue better.",
        "Treat horizontal community platforms as the failure mode — niche always outperforms.",
      ],
    },
    faqs: [
      {
        question: "Why is this the cheapest sector to build?",
        answer:
          "Because the engineering surface is well-understood (forums, chat, feeds) and the moat is never the code. The competitive question is always audience — which is not a build problem.",
      },
      {
        question: "Should I bother building if I do not already have audience?",
        answer:
          "Almost certainly not. Indie failure rates here are dominated by zero-distribution starts. Reroute into adjacent sectors where the deal mechanics do not depend on audience compounding.",
      },
    ],
  },
];

export const buildVsInvestSectors: BuildVsInvestSector[] = RAW.map((r) => ({
  ...r,
  quadrant: deriveQuadrant(r.costToBuild, r.dealVelocity),
}));

export function getBuildVsInvestBySlug(
  slug: string,
): BuildVsInvestSector | undefined {
  return buildVsInvestSectors.find((s) => s.slug === slug);
}

export function getAllBuildVsInvestSlugs(): string[] {
  return buildVsInvestSectors.map((s) => s.slug);
}

export const QUADRANT_META: Record<
  BuildVsInvestQuadrant,
  { label: string; short: string; description: string; tone: string }
> = {
  build: {
    label: "Build it yourself",
    short: "Build",
    description:
      "Low cost-to-build, high deal-velocity. An indie founder can credibly compete here — and probably should, before the round becomes competitive.",
    tone: "emerald",
  },
  fund: {
    label: "Write the cheque",
    short: "Fund",
    description:
      "High cost-to-build, high deal-velocity. The market rewards capital and rewards it fast — sourcing inside the pre-fundraise window matters more than picking the right sub-niche.",
    tone: "sky",
  },
  wait: {
    label: "Wait or partner",
    short: "Wait",
    description:
      "High cost-to-build, low deal-velocity. Capital-trap territory — stand down, partner with an incumbent, or stage cheques against milestones instead of announcements.",
    tone: "amber",
  },
  avoid: {
    label: "Reroute the energy",
    short: "Avoid",
    description:
      "Low cost-to-build, low deal-velocity. Cheap to ship, slow to close — most founders should re-route into adjacent sectors with cleaner deal mechanics.",
    tone: "rose",
  },
};
