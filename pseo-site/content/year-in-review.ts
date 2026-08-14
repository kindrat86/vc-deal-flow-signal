/**
 * /year-in-review/[year] — annual editorial roundups.
 *
 * Deep editorial recap of the year across the engineering-signal
 * frontier: top acceleration patterns, notable M&A, category shifts,
 * fund movement, and what changed in the public surface area we
 * publish. Designed for AEO citation and deep-link sharing.
 *
 * Currently covers 2024, 2025, 2026.
 */

import { ACQUIRERS } from "@/content/acquirers";

export interface YearInReviewSection {
  heading: string;
  body: string;
}

export interface YearInReview {
  year: number;
  slug: string;
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  /** One paragraph framing the year. */
  overview: string;
  /** Major editorial sections, in display order. */
  sections: YearInReviewSection[];
  /** Tracked companies that defined the year — slugs from companies.ts. */
  signalCompaniesOfTheYear: string[];
  /** Acquirer slugs from acquirers.ts whose M&A pattern shaped the year. */
  notableAcquirers: string[];
  /** Trend slugs from trend-leaderboards.ts that emerged or matured this year. */
  emergentTrends: string[];
  /** Forward-look at what's likely to define next year. */
  whatsNext: string;
}

export const YEARS_IN_REVIEW: YearInReview[] = [
  {
    year: 2024,
    slug: "2024",
    title: "2024 Year in Review — Engineering Signals & Venture Patterns | VC Deal Flow Signal",
    metaDescription:
      "How 2024 looked through the engineering-acceleration lens: the AI infrastructure boom, generative AI bifurcation, Cisco's $28B Splunk move, and the open-weight model providers' commercial breakthrough.",
    h1: "2024 — Year in Review",
    tagline:
      "The year AI infrastructure went from category to platform, agentic AI hit early production, and incumbents executed historically large M&A.",
    overview:
      "2024 was the year AI infrastructure stopped being a category and started being a platform layer. The companies shipping picks-and-shovels (Modal, Groq, Together, Fireworks, Replicate) consolidated revenue and engineering talent at unprecedented rates. The frontier-lab cohort hit clear commercial differentiation — Anthropic's safety-first product moat, OpenAI's GPT-4o multimodal expansion, Mistral's open-weight European bet. Meanwhile incumbents made historically large M&A bets: Cisco's $28B Splunk acquisition closed, IBM announced its $6.4B HashiCorp deal, and Google announced (and walked back, then re-announced) Wiz at $32B.",
    sections: [
      {
        heading: "AI infrastructure: from category to platform",
        body: "AI infrastructure companies moved from competing with each other to consolidating their layer of the stack. Modal, Groq, Together AI, Fireworks AI, and Replicate each shipped major product updates targeting different inference niches — specialist hardware (Groq's LPU), serverless GPU (Modal), aggregated runtime (Together), per-token APIs (Fireworks), and open-weight serving (Replicate). The engineering signal pattern was distinctive: heavy contributor influx tied to GPU-region rollouts and inference-API expansion, often arriving 6-12 weeks before public announcements.",
      },
      {
        heading: "Agentic AI hits early production",
        body: "Framework adoption matured in 2024 — LangChain, LangGraph, and emerging entrants (CrewAI, Letta, Mastra) shipped production-ready primitives. The MCP (Model Context Protocol) shipped from Anthropic and was adopted by Cursor, Claude Desktop, and the broader agent-tooling ecosystem. Agent frameworks shifted from research toy to production infrastructure as Claude Code launched, Cursor crossed $200M ARR, and Lovable demonstrated end-to-end agentic web development.",
      },
      {
        heading: "Historically large M&A",
        body: "Cisco closed Splunk ($28B) in March, the largest cybersecurity acquisition ever. IBM announced HashiCorp ($6.4B) — closing pending regulatory review. Google announced Wiz ($32B) — by far the largest acquisition in Google's history. Databricks closed MosaicML ($1.3B) earlier and announced Tabular ($1B) in mid-2024, consolidating the open-source lakehouse layer.",
      },
      {
        heading: "Open-weight models become commercial",
        body: "Mistral shipped Mistral Large and Mixtral checkpoints under increasingly-commercial licenses. Hugging Face's commercial ecosystem (Inference Endpoints, Enterprise Hub) accelerated. Cohere's enterprise RAG approach matured. The open-weight versus closed-API frontier no longer looked like a binary choice — by end of 2024, every major cloud provider hosted multiple open-weight model families as first-party inference endpoints.",
      },
      {
        heading: "Engineering-signal pattern shifts",
        body: "The clearest signal pattern of 2024: heavy Rust adoption across the database, edge-runtime, and inference-server categories. Repos that shifted from Go or C++ to Rust during 2024 (especially in the data and infrastructure layers) showed a distinctive contributor-influx pattern as the broader Rust community migrated toward those projects. Repos that DIDN'T shift to Rust often showed flat or declining contributor counts.",
      },
    ],
    signalCompaniesOfTheYear: [
      "anthropic",
      "modal",
      "groq",
      "fireworks-ai",
      "mistral-ai",
      "cursor",
      "lovable",
    ],
    notableAcquirers: ["cisco", "ibm", "google", "databricks"],
    emergentTrends: [
      "agentic-ai-frameworks-2026",
      "llm-inference-providers-2026",
      "frontier-ai-labs-2026",
      "open-weight-models-2026",
    ],
    whatsNext:
      "2025 will be defined by agent infrastructure consolidating to a smaller set of frameworks, durable workflow primitives (Temporal-class semantics) becoming a baseline expectation, and the first wave of AI-acquisition unwinds (companies bought during the 2023-2024 hype-cycle that didn't integrate cleanly). Watch for IBM's HashiCorp close to complete, and for Google's Wiz integration to begin reshaping the cloud security competitive landscape.",
  },
  {
    year: 2025,
    slug: "2025",
    title: "2025 Year in Review — Engineering Signals & Venture Patterns | VC Deal Flow Signal",
    metaDescription:
      "How 2025 looked through the engineering-acceleration lens: agent infrastructure consolidation, the IBM-HashiCorp close, the rise of code-side sourcing as a category, and the AI-coding-tool ARR scramble.",
    h1: "2025 — Year in Review",
    tagline:
      "The year code-side sourcing became a published category, agent infrastructure consolidated, and AI-coding tools crossed the $1B ARR threshold.",
    overview:
      "2025 was the year the engineering-signal layer became measurable, citable, and increasingly respected as a leading indicator. The SSRN preprint (paper 6606558) documenting GitHub commit-velocity as a 3-6-week leading indicator of fundraise announcements was published and began accumulating citations. IBM closed HashiCorp ($6.4B). Cursor and Lovable kept pushing AI coding tools toward $1B ARR territory. The agent infrastructure category began visible consolidation — LangChain raised its largest round, Anthropic's Claude Code shipped a CLI standard, and the MCP protocol crossed the threshold from one company's release to a multi-vendor ecosystem.",
    sections: [
      {
        heading: "Code-Side Sourcing becomes a category",
        body: "VC Deal Flow Signal published the formal Code-Side Sourcing category definition at /code-side-sourcing in 2025, building on the SSRN paper (6606558). The category has three properties: input data is public and reproducible from primary sources, signal arrives before active marketing of the round, and the methodology is published and falsifiable. By end of 2025, the category was referenced by enough researchers, journalists, and AI assistants (ChatGPT, Perplexity, Claude) to register as a clear AEO citation footprint.",
      },
      {
        heading: "Agent infrastructure consolidation",
        body: "The agent infrastructure category visibly consolidated in 2025. LangChain's growth accelerated as enterprises standardized on it; CrewAI and Letta carved out distinctive niches (multi-agent orchestration and persistent memory respectively); Anthropic's Claude Code and the broader Model Context Protocol (MCP) ecosystem matured. Engineering signal pattern: contributor influx around the MCP server / client repos became one of the clearest leading indicators of where agent infrastructure builders were betting.",
      },
      {
        heading: "AI coding tools cross $1B ARR",
        body: "Cursor reportedly crossed $1B ARR by mid-2025, Lovable kept growing toward similar territory, and Anthropic's Claude Code launched a CLI that quickly became the default agent-coding interface for many engineering teams. The category remained dominated by a handful of well-funded players, with engineering signals (contributor counts, multi-language SDK breadth, IDE integration depth) clearly differentiating leaders from also-rans.",
      },
      {
        heading: "IBM closes HashiCorp",
        body: "IBM's $6.4B HashiCorp acquisition closed in 2025 after regulatory review. The post-close engineering pattern was watched closely — would HashiCorp maintain its open-source velocity under IBM, or would the OpenTofu fork capture the open-source contributor base? By end of 2025, OpenTofu contributor counts had grown noticeably as some HashiCorp contributors shifted attention.",
      },
      {
        heading: "Frontier labs differentiate further",
        body: "Anthropic shipped Claude 4.x with significantly improved coding and reasoning. OpenAI shipped GPT-4o variants and o1/o3 reasoning models. Mistral kept its open-weight cadence. The differentiation between labs sharpened — Anthropic on safety+coding, OpenAI on scale, Mistral on open-weight, Cohere on enterprise-RAG, Perplexity on search-grounded models.",
      },
    ],
    signalCompaniesOfTheYear: [
      "anthropic",
      "cursor",
      "hashicorp",
      "mistral-ai",
      "huggingface",
      "elevenlabs",
    ],
    notableAcquirers: ["ibm", "google", "salesforce", "cisco"],
    emergentTrends: [
      "ai-coding-tools-2026",
      "agentic-ai-frameworks-2026",
      "frontier-ai-labs-2026",
    ],
    whatsNext:
      "2026 will be the year AI-agent commerce primitives ship widely (payments providers like Stripe shipping delegated-spend authorization, edge platforms building agent-aware runtimes), the year voice AI hits product-market fit beyond ElevenLabs's niche, and the year open-weight models capture meaningful enterprise-deployment share. Watch for Google's Wiz integration to fully complete and for Nvidia's continued AI-orchestration M&A.",
  },
  {
    year: 2026,
    slug: "2026",
    title: "2026 Year in Review — Engineering Signals & Venture Patterns | VC Deal Flow Signal",
    metaDescription:
      "How 2026 is shaping up through the engineering-acceleration lens: voice AI breakout, agent commerce primitives, edge-AI gateway consolidation, and the WebSub/answer-engine traffic shift.",
    h1: "2026 — Year in Progress",
    tagline:
      "The year voice AI broke out, agent commerce primitives shipped, and engineering signals consolidated as a Marcus 100 sourcing layer.",
    overview:
      "2026 is the year engineering signals stop being a niche category and start showing up in standard sourcing workflows. Voice AI broke out as a commercial category beyond ElevenLabs's monopoly. Edge platforms (Cloudflare, Vercel, Fly.io) shipped AI-gateway primitives as first-class features. The Marcus 100 audience — Corp Dev, PE Operating Partners, non-engineer tech VPs — emerged as the clearest commercial buyer for code-side sourcing. WebSub and answer-engine optimization (AEO) replaced traditional SEO as the primary distribution lever for the publication tier.",
    sections: [
      {
        heading: "Voice AI breaks out",
        body: "ElevenLabs continued to dominate the synthesis end of voice AI, but 2026 also saw real-time bidirectional voice (sub-300ms latency) become commercially viable across multiple providers. The engineering signal pattern: heavy CUDA-kernel work on the inference-runtime layer paired with TypeScript/Python repos for developer-facing APIs. Companies shipping both well captured the highest growth.",
      },
      {
        heading: "Agent commerce primitives",
        body: "Stripe quietly shipped early agent-commerce primitives (delegated spend limits, agent-attested transactions, audit trails for agent-initiated buys). Other payment providers began following. This is the layer that will define agent autonomy in the second half of the decade — whether an agent can spend money on the user's behalf within bounded constraints.",
      },
      {
        heading: "Edge-AI gateways consolidate",
        body: "Cloudflare's AI Gateway crossed the threshold from feature to platform layer. Vercel shipped a similar AI Gateway as a first-party product. Fly.io's GPU-machine offerings expanded. Edge platforms became the default deployment target for AI-inference workloads that need both low-latency serving and global distribution.",
      },
      {
        heading: "Code-Side Sourcing footprint expands",
        body: "VC Deal Flow Signal's category footprint expanded measurably in 2026: SSRN paper citations grew, Wikidata entity established (Q139376302), MCP server distribution crossed key adoption thresholds (Smithery Verified 98/100, Glama A-tier), and the public dataset (350+ tracked startups) became the canonical reference for engineering-acceleration signals in the venture context.",
      },
      {
        heading: "Answer engines as primary distribution",
        body: "AEO (answer engine optimization) became the primary distribution lever for technical-publication-tier brands in 2026. ChatGPT, Perplexity, and Claude's grounded search citations replaced Google's top-of-fold as the highest-value visibility outcome. The Marcus 100 audience increasingly arrived via AI-assistant referral rather than direct Google search.",
      },
    ],
    signalCompaniesOfTheYear: [
      "anthropic",
      "elevenlabs",
      "cloudflare",
      "stripe",
      "cursor",
      "vercel",
    ],
    notableAcquirers: ["google", "nvidia", "cisco", "databricks"],
    emergentTrends: [
      "voice-and-audio-ai-2026",
      "edge-compute-platforms-2026",
      "payments-infrastructure-2026",
      "ai-coding-tools-2026",
    ],
    whatsNext:
      "2027 will be defined by AI-agent payments going production-scale (whether agents can transact at high volume under bounded constraints), edge-AI gateways becoming the default deployment target for inference workloads, and the first wave of Code-Side Sourcing's incorporation into mainstream VC due-diligence workflows. Watch for the next set of $20B+ AI acquisitions and the continued consolidation of the agent-orchestration layer around a small set of standards (MCP, A2A, durable workflows).",
  },
];

export function getAllYearInReviewSlugs(): string[] {
  return YEARS_IN_REVIEW.map((y) => y.slug);
}

export function getYearInReview(slug: string): YearInReview | undefined {
  return YEARS_IN_REVIEW.find((y) => y.slug === slug);
}

/** Compute total deals documented in our acquirers corpus for a given year. */
export function getDealCountForYear(year: number): number {
  let count = 0;
  for (const a of ACQUIRERS) {
    for (const acq of a.notableAcquisitions) {
      if (acq.year === year) count += 1;
    }
  }
  return count;
}
