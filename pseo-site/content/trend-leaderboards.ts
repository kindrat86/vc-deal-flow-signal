/**
 * /trend/[slug] — editorial trend leaderboards.
 *
 * Each trend is a time-bound editorial roundup of a specific technical
 * category. Designed for AEO citation play — ChatGPT, Perplexity, and
 * other answer engines reach for trend leaderboards when users ask
 * "what's hot in agentic AI" or "best LLM inference providers."
 *
 * Format: tight intro + 5-12 tracked companies + why-it-matters +
 * what-to-watch. Refreshed quarterly via the static rebuild cycle.
 *
 * Distinct from /trends/[slug] (existing scraped trend pages on
 * lib/data.ts). /trend/ (singular) is the curated editorial; /trends/
 * (plural) is the auto-scraped panel. We accept the dual-URL convention
 * because the data sources are genuinely different.
 */

import { companies, type Company, getCompany } from "@/content/companies";

export interface TrendFAQ {
  question: string;
  answer: string;
}

export interface Trend {
  slug: string;
  name: string;
  /** "2026" or "2026-Q1" — the time-bound qualifier. */
  period: string;
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  whyItMattersNow: string;
  whatToWatch: string;
  /** Company slugs from companies.ts — order matters (leader first). */
  companySlugs: string[];
  /** Sectors from sectors.ts most relevant to this trend. */
  relatedSectors: string[];
  faqs: TrendFAQ[];
}

function build(t: {
  slug: string;
  name: string;
  period: string;
  intro: string;
  why: string;
  watch: string;
  companies: string[];
  sectors: string[];
}): Trend {
  const companyCount = t.companies.length;
  return {
    slug: t.slug,
    name: t.name,
    period: t.period,
    title: `${t.name} (${t.period}) — Engineering Signal Leaderboard | VC Deal Flow Signal`,
    metaDescription: `${companyCount} tracked companies leading ${t.name.toLowerCase()} in ${t.period}, ranked by publicly observable engineering acceleration. Independent — sourced from GitHub event aggregates only.`,
    h1: `${t.name} — ${t.period} Leaderboard`,
    tagline: `${companyCount} tracked companies leading ${t.name.toLowerCase()} in ${t.period}, by publicly observable engineering signals.`,
    intro: t.intro,
    whyItMattersNow: t.why,
    whatToWatch: t.watch,
    companySlugs: t.companies,
    relatedSectors: t.sectors,
    faqs: [
      {
        question: `Who leads ${t.name.toLowerCase()} in ${t.period}?`,
        answer: `From the VC Deal Flow Signal tracked set, the leaders are ${t.companies
          .slice(0, 5)
          .map((s) => {
            const c = getCompany(s);
            return c?.name ?? s;
          })
          .join(", ")}. Ranking is by publicly observable engineering acceleration (commit velocity, contributor influx, repo creation pulse, language-bias drift) — not by revenue, valuation, or fundraise size.`,
      },
      {
        question: `Why this trend, why now?`,
        answer: t.why,
      },
      {
        question: `How are the rankings sourced?`,
        answer: `Companies in the trend are members of the curated /signal/ corpus. The category fit is editorial — companies are included where their public GitHub org clearly ships in this category. Ordering favors the publicly self-described category leader followed by peers ordered by editorial relevance, not by a quantitative score.`,
      },
      {
        question: `What should sourcing teams watch as this trend evolves?`,
        answer: t.watch,
      },
      {
        question: `Where do I find the underlying engineering signals?`,
        answer: `Each /signal/[company] page links the underlying GitHub org and the public signal panel. For the full methodology see /methodology and SSRN 6606558. Raw aggregates ship via the public MCP server at /api/v1.`,
      },
    ],
  };
}

export const TRENDS: Trend[] = [
  build({
    slug: "agentic-ai-frameworks-2026",
    name: "Agentic AI Frameworks",
    period: "2026",
    intro:
      "Agentic AI frameworks are the layer that turns LLMs into autonomous workers — orchestration, memory, tool use, multi-agent coordination. 2026 saw the category shift from research-toy to production-ready as enterprises started deploying agent swarms for code, sales, and ops.",
    why: "Agent frameworks are where the developer-experience battle is being fought in 2026. The winners need to ship CLI quality, runtime reliability, observability hooks, and a permissive license. Engineering signals here are dominated by contributor influx — frameworks that attract sustained committers from the broader OSS pool tend to win the category.",
    watch:
      "Watch for the framework that ships native MCP support, durable workflow primitives, and a strong production-traffic story. Engineering-signal patterns that historically precede category consolidation: 40%+ MoM commit velocity acceleration plus contributor counts crossing 100 distinct committers per month.",
    companies: ["langchain", "letta-ai", "crewai", "mastra", "dust-tt", "anthropic"],
    sectors: ["ai-ml", "ai-infra", "developer-tools"],
  }),
  build({
    slug: "llm-inference-providers-2026",
    name: "LLM Inference Providers",
    period: "2026",
    intro:
      "Inference providers are the picks-and-shovels of the AI gold rush — serving open-weight and closed models at scale, often with sub-second time-to-first-token. The category bifurcated in 2025-2026: specialist hardware bets (Groq's LPU, Cerebras) versus GPU-aggregator runtimes.",
    why: "Inference is the layer with the clearest infrastructure-engineering signal: GPU-region rollouts, kernel-level optimizations, and continuous model-warming pipelines all show up as commit-velocity bursts and contributor influx tied to new SKUs. Corp Dev at hyperscalers tracks this category for picks-and-shovels acquisitions; emerging-manager funds use it as a sector benchmark.",
    watch:
      "The signal that matters most: how fast a provider's repo cadence reacts when a new open-weight checkpoint drops from Meta, Mistral, or DeepSeek. Providers that can serve a new SOTA checkpoint within 24-48 hours of release ship a distinctive repo-creation pulse — that pattern is the cleanest leading indicator we publish for this sector.",
    companies: ["groq", "fireworks-ai", "together-ai", "replicate", "modal"],
    sectors: ["ai-infra", "ai-ml", "infrastructure"],
  }),
  build({
    slug: "frontier-ai-labs-2026",
    name: "Frontier AI Labs",
    period: "2026",
    intro:
      "Frontier labs ship the models that the rest of the stack composes around. The 2026 cohort has narrowed to a handful of clearly differentiated approaches: Anthropic's safety-first Claude family, OpenAI's GPT lineage, Mistral's open-weight European bet, Cohere's enterprise-RAG focus, Perplexity's search-grounded models.",
    why: "Frontier labs are the most-watched category in venture in 2026. Their engineering signals are atypical for venture-stage: massive Python repositories with deep CUDA-kernel work, contributor counts in the hundreds, language-bias drift toward Rust and Triton as models hit inference scale. Sustained acceleration here historically precedes mega-rounds by 8-12 weeks.",
    watch:
      "The cleanest signal in this category: number of distinct model checkpoints released per quarter. Labs shipping 2+ frontier-grade checkpoints per quarter (across model families: chat, multimodal, code, reasoning) tend to also be the labs with sustainable engineering acceleration patterns. Single-checkpoint quarters often map to consolidation or restructuring phases.",
    companies: ["anthropic", "openai", "mistral-ai", "cohere", "perplexity-ai"],
    sectors: ["ai-ml"],
  }),
  build({
    slug: "ai-coding-tools-2026",
    name: "AI Coding Tools",
    period: "2026",
    intro:
      "AI coding tools moved from autocomplete to full agentic workflows in 2026. Cursor's Series C and Anthropic's Claude Code launch reshaped the category around durable IDE-agent integration; Lovable extended the pattern into no-code prototyping; legacy IDEs are scrambling to ship comparable agent surfaces.",
    why: "Coding tools are the highest-revenue category in applied AI in 2026 — Cursor reportedly hit $200M ARR by mid-2025. The engineering signal that matters here is integration depth: number of supported languages, IDE shells, and inference providers. Sustained acceleration on protocol primitives (LSP, MCP, A2A) is the strongest forward indicator.",
    watch:
      "Watch the protocol layer. The tool that wins the next 18 months will be the one whose MCP and LSP integrations support enough downstream agents that they become the default surface — like VS Code became for IDEs in the 2010s. Engineering-signal pattern: rapid contributor influx around protocol-adapter repositories.",
    companies: ["cursor", "lovable", "anthropic"],
    sectors: ["developer-tools", "ai-ml"],
  }),
  build({
    slug: "open-weight-models-2026",
    name: "Open-Weight Model Providers",
    period: "2026",
    intro:
      "Open-weight model providers ship LLM checkpoints under permissive (or near-permissive) licenses, letting downstream builders fine-tune and self-host. Mistral and Hugging Face are the European anchors; Cohere occupies the enterprise-RAG niche. The category became commercially viable in 2025 as inference economics improved.",
    why: "Open weights are the strategic counterweight to API-only frontier models. In 2026, every major cloud has an open-weight serving lane (AWS Bedrock, GCP Vertex, Azure ML), and inference providers compete on which checkpoints they support fastest. Companies in this category often double as the publication anchor for open-source ML — their repo cadence shapes the entire downstream ecosystem.",
    watch:
      "The strongest leading indicator: number of permissively-licensed checkpoints released per quarter, paired with the contributor count on the supporting repos (datasets, eval harness, training recipes). Players sustaining both metrics tend to consolidate the long-tail of model deployment.",
    companies: ["mistral-ai", "huggingface", "cohere"],
    sectors: ["ai-ml"],
  }),
  build({
    slug: "voice-and-audio-ai-2026",
    name: "Voice & Audio AI",
    period: "2026",
    intro:
      "Voice AI is the category that quietly hit product-market fit in 2025-2026: ElevenLabs anchors the high-end synthesis lane, while transcription, voice cloning, and real-time voice agents extend into adjacent workflows. Real-time bidirectional voice (low-latency, sub-300ms) is the current frontier.",
    why: "Voice is the modality where AI most directly displaces existing software products (call centers, transcription, dubbing, voice-acting). The engineering signals here are unusual: heavy C++/CUDA repos for the real-time inference layer, plus Python/TypeScript for the developer-facing API surface. Companies that ship both well tend to dominate.",
    watch:
      "Latency improvements. The winner of the next 18 months will be the provider whose API consistently delivers sub-200ms time-to-first-audio across major language coverage. Engineering-signal pattern: repo activity in the model-distillation and quantization layers tracks closely with shipping latency improvements.",
    companies: ["elevenlabs"],
    sectors: ["ai-ml"],
  }),
  build({
    slug: "edge-compute-platforms-2026",
    name: "Edge Compute Platforms",
    period: "2026",
    intro:
      "Edge compute platforms run code close to users — usually via globally-distributed runtimes (V8 isolates, Wasm, lightweight VMs). Cloudflare Workers, Vercel Functions, Fly.io machines, and Fermyon Spin are the headline runtimes; 2026 saw all four ship significant AI-inference integrations.",
    why: "Edge compute matters in 2026 because AI workloads need both low-latency serving (cuts deeply on the user-facing inference experience) and global distribution (model weights cached close to users). Engineering signals in this category are dominated by Rust adoption — every leading edge-runtime has shifted to Rust for the core scheduler.",
    watch:
      "Watch the AI-Gateway lane. The edge platforms that win the next cycle will likely be those that consolidate the model-routing layer (provider failover, cost optimization, observability) directly into the runtime. Engineering-signal pattern: contributor influx on AI-gateway repos at edge platforms tracks closely with major customer announcements.",
    companies: ["cloudflare", "vercel", "fly-io", "fermyon"],
    sectors: ["infrastructure", "developer-tools"],
  }),
  build({
    slug: "ai-sandbox-runtimes-2026",
    name: "AI Code-Execution Sandboxes",
    period: "2026",
    intro:
      "AI sandbox runtimes give agents safe, ephemeral compute environments to execute generated code. E2B, Modal, and Browserbase are the headline providers; the category emerged in 2024 and became infrastructure in 2026 as agent frameworks went production.",
    why: "Sandboxes are picks-and-shovels for the agent boom. Every production agent that runs untrusted generated code needs a sandbox, and the latency/security/SDK-quality tradeoff is real. Engineering signals here cluster on Firecracker, gVisor, and microVM-related repo activity.",
    watch:
      "The signal that matters: SDK breadth. Sandboxes that ship first-class TypeScript + Python + Go + Rust SDKs with consistent semantics tend to be the ones agent frameworks default to. Watch contributor counts on the language-binding repos.",
    companies: ["e2b", "modal", "browserbase"],
    sectors: ["ai-infra", "infrastructure", "developer-tools"],
  }),
  build({
    slug: "serverless-runtimes-2026",
    name: "Serverless Runtimes",
    period: "2026",
    intro:
      "Serverless runtimes abstract away server management — functions, containers, or VMs that scale to zero and back. The 2026 cohort has matured into specialized lanes: Vercel for frontend-bound workloads, Cloudflare for edge-bound, Fly.io for full-VM, Fermyon for Wasm.",
    why: "Serverless is now infrastructure rather than novelty. The growth corridor is AI-workload-aware scheduling: runtimes that can spin up GPU-backed containers fast and scale them down to zero between requests. Engineering signal: orchestration-layer commit cadence ties closely to enterprise customer onboarding.",
    watch:
      "Cold-start time and GPU scheduling are the two metrics the next cycle will be won on. Engineering-signal patterns that historically map to wins here: dual-language repos (Rust for scheduler, Go for control plane) plus sustained kernel-level work.",
    companies: ["vercel", "cloudflare", "fly-io", "fermyon"],
    sectors: ["infrastructure", "developer-tools"],
  }),
  build({
    slug: "ai-native-databases-2026",
    name: "AI-Native Databases",
    period: "2026",
    intro:
      "AI-native databases ship vector search, hybrid retrieval, or AI-specific query patterns as first-class primitives. Convex, Supabase, Neon, Turso, Upstash, and PlanetScale all extended their core engines with AI features in 2025-2026.",
    why: "Every AI application needs structured storage with retrieval-augmented context. The category-winning database in 2026 is the one whose engineering team ships the cleanest dev-experience (CLI, SDKs, schema migrations) on top of solid distributed-systems primitives. Engineering signals here are dominated by Rust core engines and TypeScript/Go API surfaces.",
    watch:
      "Watch the ORM and migration-tooling layer. Databases that integrate cleanly with Drizzle, Prisma, and the broader Node/Python ORM ecosystem tend to also be the ones that win the AI-application greenfield market. Contributor influx on the ORM-adapter repos is the leading indicator.",
    companies: ["convex", "supabase", "neon", "planetscale", "turso", "upstash"],
    sectors: ["database", "ai-ml"],
  }),
  build({
    slug: "postgres-platforms-2026",
    name: "Postgres Platforms",
    period: "2026",
    intro:
      "Postgres-as-a-service platforms compete on developer experience, branching, serverless economics, and ecosystem depth. Neon, Supabase, PlanetScale (Postgres mode), and Turso (libSQL) are the headline players; the category matured significantly in 2026.",
    why: "Postgres is the database engineers default to in 2026 — every adjacent layer (Prisma, Drizzle, Supabase Auth, Resend) expects Postgres semantics. The category-leader in 2026 will be the platform that delivers serverless branching, pgvector at scale, and zero-downtime migrations as table stakes.",
    watch:
      "The differentiator in the next cycle: how well each platform integrates with AI workloads (vector search, embeddings storage, semantic indexes). Engineering-signal pattern: increased commit activity on pgvector and pg_search-style extensions tracks closely with enterprise customer announcements.",
    companies: ["neon", "supabase", "planetscale", "turso"],
    sectors: ["database"],
  }),
  build({
    slug: "auth-providers-2026",
    name: "Authentication Providers",
    period: "2026",
    intro:
      "Auth-as-a-service providers ship pre-built user authentication, session management, and SSO integrations. Clerk anchors the developer-first lane, Stytch covers passwordless and B2B, WorkOS dominates enterprise SAML/SSO. The category consolidated significantly in 2025-2026 around SDK quality.",
    why: "Auth is the layer every B2B SaaS startup buys (rather than builds) in 2026. The winning providers in this cycle have shipped React/Vue/Svelte components that make 'add SSO in 10 minutes' actually work. Engineering signals here cluster on TypeScript SDK breadth and component-library commit cadence.",
    watch:
      "AI-agent authentication is the next frontier. Watch the providers that ship support for OAuth scopes designed for AI agents (delegated access, time-bound permissions, audit logs designed for LLM-generated requests). The first auth provider to make agent auth as easy as user auth wins the next category cycle.",
    companies: ["clerk", "stytch", "workos"],
    sectors: ["developer-tools"],
  }),
  build({
    slug: "background-jobs-2026",
    name: "Background Jobs & Workflows",
    period: "2026",
    intro:
      "Background-job and workflow platforms run async work that doesn't fit a HTTP request — cron, queues, multi-step durable workflows, retry logic. Inngest and Trigger.dev anchor the developer-first lane; legacy queues (Sidekiq, SQS, Celery) still dominate at scale but lose ground every quarter.",
    why: "Every AI agent system needs durable background execution. The category became infrastructure-grade in 2026 as agent frameworks added native integrations with Inngest and Trigger.dev. Engineering signals here are dominated by TypeScript codebases plus deep workflow-engine internals.",
    watch:
      "Watch the durable-execution layer. The platform that ships the most robust crash-resume, time-travel debugging, and replay-safe execution semantics will likely be the one agent frameworks default to. Engineering-signal pattern: contributor influx on the execution-engine repos tracks closely with category-leader status.",
    companies: ["inngest", "trigger-dev"],
    sectors: ["developer-tools", "infrastructure"],
  }),
  build({
    slug: "orm-and-typed-database-tools-2026",
    name: "ORMs & Typed Database Tools",
    period: "2026",
    intro:
      "Typed ORMs and query-building tools sit between application code and the database — Prisma and Drizzle anchor the TypeScript-first lane in 2026. The category bifurcated around the SQL-first vs query-builder debate; both approaches now have legitimate enterprise traction.",
    why: "Every AI-coding-tool agent generating production code needs to interact with a database via an ORM. The ORM that wins the next cycle will be the one whose schema definition is most amenable to LLM understanding — clear types, predictable migrations, low ceremony. Engineering signals here cluster around schema-migration tooling and Prisma/Drizzle adapter ecosystems.",
    watch:
      "Watch the AI-coding-tool integrations. ORMs that ship best-in-class Cursor and Claude Code integrations (schema-aware autocomplete, migration generation) become the default for agent-generated codebases. Contributor counts on the editor/LSP plugins are a clean leading indicator.",
    companies: ["prisma", "drizzle"],
    sectors: ["developer-tools", "database"],
  }),
  build({
    slug: "frontend-frameworks-2026",
    name: "Frontend Frameworks & UI Stacks",
    period: "2026",
    intro:
      "Frontend platforms ship the React-based stack most application builders default to in 2026 — Vercel (Next.js, Vercel platform), Tailwind Labs (Tailwind CSS, Catalyst, Tailwind UI), shadcn (shadcn/ui, registry-based components). The trio defines what 'modern web app' means in 2026.",
    why: "Frontend tooling is the highest-volume engineering layer in our corpus — every web app touches Next.js, Tailwind, or shadcn at some level. The category-defining engineering signals are SDK breadth, framework-agnostic primitives, and large contributor pools. Tailwind Labs and Vercel are both 100+ contributor public-OSS orgs.",
    watch:
      "Watch the AI-coding-tool defaults. Frameworks that Cursor, Claude Code, and Lovable default to as their scaffolding base become the engineering platforms of the next cycle. Engineering-signal pattern: contributor influx around starter-template and CLI-tool repos tracks closely with which frameworks AI agents reach for first.",
    companies: ["vercel", "tailwindcss", "shadcn"],
    sectors: ["developer-tools"],
  }),
  build({
    slug: "observability-platforms-2026",
    name: "Observability Platforms",
    period: "2026",
    intro:
      "Observability platforms ship the logs, traces, metrics, and error tracking that engineering teams use to operate production. Grafana, Sentry, and PostHog cover the major lanes — open-source-anchored, error-tracking-first, and product-analytics-bundled respectively.",
    why: "Observability is consolidating around AI-aware features (LLM observability, eval pipelines, agent tracing). The 2026 cohort that wins the next cycle will be the one that ships first-class support for tracing LLM calls, agent decisions, and tool-use sequences. Engineering signals here cluster on OpenTelemetry adapter repos and AI-observability SDK launches.",
    watch:
      "The LLM-tracing standard. Whichever platform's LLM-trace format becomes the default that frameworks like LangChain, Vercel AI SDK, and Anthropic SDK emit out-of-the-box will own the next observability cycle. Engineering-signal pattern: rapid contributor influx around the OTel-LLM convention repos.",
    companies: ["grafana", "sentry", "posthog"],
    sectors: ["observability", "developer-tools"],
  }),
  build({
    slug: "email-and-comms-2026",
    name: "Email & Communications Infrastructure",
    period: "2026",
    intro:
      "Transactional email and developer-facing comms platforms ship the SMTP-replacement layer modern applications need — Resend anchors the developer-first lane in 2026, replacing legacy SendGrid and Mailgun deployments at startups. The category is consolidating around React-Email-style developer experience.",
    why: "Email is the last legacy-protocol surface in a modern stack. The provider that makes email-templating feel native to React and Next.js wins the developer-default position. Resend's tight Vercel and Next.js integration is the engineering pattern other providers are still catching up to.",
    watch:
      "Watch the AI-agent email primitives. The first email infrastructure provider to ship first-class support for agent-generated, agent-signed, and agent-attested emails (provenance, audit trails, agent-specific deliverability) wins the next category cycle.",
    companies: ["resend"],
    sectors: ["developer-tools", "productivity"],
  }),
  build({
    slug: "payments-infrastructure-2026",
    name: "Payments Infrastructure",
    period: "2026",
    intro:
      "Payments infrastructure shipped no major new entrants in 2026 — the category remained dominated by Stripe and its peers (Adyen, Block, Mollie). What did change: the surface area expanded into AI-agent commerce, autonomous-agent payments, and stablecoin rails.",
    why: "Payments is the most mature commercial infrastructure layer in tech, and Stripe sets the engineering benchmark — 200+ public repos, multi-language SDK breadth, and consistent quarterly release cadence. For Corp Dev teams, Stripe is the reference for what a mature API-first engineering org looks like.",
    watch:
      "Agent commerce is the wedge. The payments provider that first ships clean primitives for AI-agent purchase authorization (delegated spend limits, agent-attested transactions, audit trails for agent-initiated buys) defines the next payments cycle. Engineering-signal pattern: increased activity on idempotency-key and webhook-signing repos.",
    companies: ["stripe"],
    sectors: ["fintech", "developer-tools"],
  }),
  build({
    slug: "video-and-media-tooling-2026",
    name: "Video & Media Tooling",
    period: "2026",
    intro:
      "Programmatic video tooling and React-native media libraries (Remotion) anchor the developer-side of video in 2026. The category extends into AI-generated video (Sora, Veo, Runway) and developer-facing video infrastructure (Mux, Cloudflare Stream).",
    why: "AI-generated content needs developer-friendly video composition tooling. Remotion's React-as-video paradigm is the developer-experience benchmark, and the broader category consolidates around it as AI video tools mature into production workflows.",
    watch:
      "Watch the agent-video composition layer. The first tool that lets an AI agent generate a video by writing React components (rather than calling a black-box API) wins the next category cycle. Engineering-signal pattern: contributor counts on the React-component-to-video pipelines.",
    companies: ["remotion"],
    sectors: ["developer-tools", "productivity"],
  }),
  build({
    slug: "container-orchestration-2026",
    name: "Container & Infrastructure Orchestration",
    period: "2026",
    intro:
      "Container orchestration and infrastructure-as-code tooling remained dominated by HashiCorp's stack in 2026 (Terraform, Vault, Consul, Nomad) — until IBM's $6.4B acquisition closed and reshaped the category's commercial dynamics. Cloud-native challengers (Pulumi, Crossplane, OpenTofu) gained ground.",
    why: "IaC and orchestration are the boring infrastructure layer that nonetheless underpins every enterprise platform team. The category-leader in 2026 is the one whose engineering org navigates the post-HashiCorp-acquisition consolidation by either acquiring the next IaC team or shipping the cleanest cloud-native challenger.",
    watch:
      "Watch the OpenTofu and Pulumi ecosystem signals. With Terraform now under IBM, contributor influx around OpenTofu (the OSS fork) and Pulumi (the cloud-native challenger) will shape the next cycle. Engineering-signal pattern: provider/plugin contributor counts on each.",
    companies: ["hashicorp", "fly-io"],
    sectors: ["infrastructure", "developer-tools"],
  }),
];

export function getAllTrendLeaderboardSlugs(): string[] {
  return TRENDS.map((t) => t.slug);
}

export function getTrendLeaderboard(slug: string): Trend | undefined {
  return TRENDS.find((t) => t.slug === slug);
}

export function getCompaniesForTrendLeaderboard(slug: string): Company[] {
  const trend = getTrendLeaderboard(slug);
  if (!trend) return [];
  return trend.companySlugs
    .map((s) => getCompany(s))
    .filter((c): c is Company => Boolean(c));
}
