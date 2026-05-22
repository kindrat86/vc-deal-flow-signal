/**
 * Niche-down taxonomy for /niche-down/[sector]/[sub-niche].
 *
 * Greg-style "the riches are in the niches" angle: each entry is a small,
 * specific opportunity that an indie/AI-native team could realistically
 * build OR an early-stage VC could realistically fund. Pages are paired
 * with the existing GitHub-signal data — the matching sector's live
 * scoreboard appears inline so each niche page is grounded in active
 * repositories, not a vibe essay.
 *
 * Anonymity rule: the `examples` field lists PUBLIC project / category
 * descriptors only (e.g. "Cursor / Continue / Codeium-style copilots"),
 * never founders we track as proprietary deal flow.
 *
 * Routes are SSG via `app/niche-down/[sector]/[subniche]/page.tsx` with
 * `dynamicParams = false`. Slugs are stable — they ship to IndexNow on
 * postbuild, so renames break inbound citations.
 */

export type BuildCost = "weekend" | "month" | "quarter" | "team";
export type DealVelocity = "trickle" | "steady" | "hot" | "frothy";

export interface NicheFAQ {
  q: string;
  a: string;
}

export interface Niche {
  slug: string;
  name: string;
  pitch: string;
  buildCost: BuildCost;
  dealVelocity: DealVelocity;
  signalShape: string;
  whyNow: string;
  examples: string[];
  competingFor: string;
  ourTake: string;
  faqs: NicheFAQ[];
}

export interface NicheSector {
  slug: string;
  name: string;
  shortPitch: string;
  niches: Niche[];
}

const BUILD_COST_LABEL: Record<BuildCost, string> = {
  weekend: "Weekend build",
  month: "Month-long build",
  quarter: "One-quarter build",
  team: "Team-sized build",
};

const DEAL_VELOCITY_LABEL: Record<DealVelocity, string> = {
  trickle: "Trickle — one deal per quarter",
  steady: "Steady — one deal per month",
  hot: "Hot — multiple deals per month",
  frothy: "Frothy — multiple deals per week",
};

export function buildCostLabel(c: BuildCost): string {
  return BUILD_COST_LABEL[c];
}

export function dealVelocityLabel(v: DealVelocity): string {
  return DEAL_VELOCITY_LABEL[v];
}

// ---------------------------------------------------------------------------
// Sector × sub-niche taxonomy. 20 sectors × 10 sub-niches = 200 leaf pages.
// ---------------------------------------------------------------------------

export const nicheSectors: NicheSector[] = [
  {
    slug: "ai-ml",
    name: "AI & Machine Learning",
    shortPitch:
      "The platform shift everyone is chasing — but the leverage is in narrow tooling, not yet-another general assistant.",
    niches: [
      {
        slug: "llm-eval-harnesses",
        name: "LLM eval harnesses",
        pitch:
          "Reproducible eval suites that an AI-native team can drop into CI and trust by lunchtime.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos crossing 1k stars inside a quarter, with the contributor list dominated by ML platform engineers from infra-heavy companies — not researchers.",
        whyNow:
          "Every model swap (GPT → Claude → Gemini → Llama variant) breaks the prompt graph. Teams need an eval layer that survives provider churn.",
        examples: [
          "Promptfoo-style YAML eval harnesses",
          "DeepEval-style pytest plugins",
          "OpenAI Evals forks tuned to a single vertical",
        ],
        competingFor:
          "Hand-rolled notebook eval scripts and the prompt engineer's weekly Excel sheet.",
        ourTake:
          "Build it as a vertical eval (legal, medical, code review) rather than a general harness — the general slot is crowded. The signal that something is breaking out: a single vertical's eval repo getting starred by three or more competing product teams in the same week.",
        faqs: [
          {
            q: "Why is an eval harness a niche, not a feature of every LLM tool?",
            a: "Because evals are model-agnostic and product-agnostic — they belong in a separate layer that survives provider swaps. Teams that bury evals inside a single product end up with brittle CI.",
          },
          {
            q: "Should I build or fund?",
            a: "Build if you already have the vertical's golden dataset. Fund if you don't — the moat is data, not framework.",
          },
          {
            q: "What's the GitHub signal that an eval repo is going to raise?",
            a: "Star velocity is a weak signal; what matters is whether engineers from three or more named product companies are filing issues in the same month.",
          },
        ],
      },
      {
        slug: "agent-orchestration-frameworks",
        name: "Agent orchestration frameworks",
        pitch:
          "The 'LangChain for X' slot is still wide open — pick a vertical, ship the runtime, win the wedge.",
        buildCost: "quarter",
        dealVelocity: "frothy",
        signalShape:
          "Repos with a high ratio of integration commits to core commits — sign that the framework is being adopted faster than it's being polished.",
        whyNow:
          "The general-purpose orchestrators (LangChain, LlamaIndex, CrewAI) have left every vertical understacked. Whoever owns 'agents for [insurance|legal|sales-ops]' wins the runtime relationship.",
        examples: [
          "Vertical CrewAI clones for specific industries",
          "Mastra-style typesafe agent frameworks for one platform",
          "OpenAI Swarm forks tuned to one workflow",
        ],
        competingFor:
          "Generic LangChain agents that work in demos but break under production load.",
        ourTake:
          "Don't try to beat the general frameworks at generality — they'll always have more stars. Beat them at a single workflow's reliability and shipped product surface. Watch for repos where the README lists a specific industry's job-to-be-done, not a feature list.",
        faqs: [
          {
            q: "Isn't this market over?",
            a: "The general market is over. The vertical wedge is barely started. Every Tier-1 firm has at least one verticalized-agent thesis open.",
          },
          {
            q: "What's the build-vs-invest call?",
            a: "Build if you have a vertical you've operated in. Invest if you've watched three repos converge on the same shape in the same week.",
          },
          {
            q: "How fast does this category re-rank?",
            a: "Every 90 days. The framework leaderboard at quarter-start rarely survives intact to quarter-end.",
          },
        ],
      },
      {
        slug: "retrieval-augmented-search-libraries",
        name: "Retrieval-augmented search libraries",
        pitch:
          "RAG-as-a-library — bring-your-own embedding, bring-your-own vector store, win on developer ergonomics.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos with TypeScript-first, framework-adapter shaped READMEs and a contributor list of 'I'm shipping this in production' developers, not academic accounts.",
        whyNow:
          "RAG-in-a-product is now table stakes. The library that fades cleanly into a Next.js or FastAPI codebase wins the developer relationship before the agentic layer is even decided.",
        examples: [
          "Vercel AI SDK retrieval modules",
          "LlamaIndex-style toolkits with vertical adapters",
          "Hybrid BM25 + vector libraries with single-call API",
        ],
        competingFor:
          "Hand-rolled retrieval glue using raw vector DB clients.",
        ourTake:
          "Position as 'the missing layer between your vector DB and your LLM' — not as another vector DB. The wedge is in adapters: Postgres, Mongo, Elasticsearch, Notion, Linear. Win the integration list before any competitor.",
        faqs: [
          {
            q: "Why isn't this captured by LangChain?",
            a: "LangChain is a framework, not a retrieval library. Teams want a small focused dependency, not a runtime opinion.",
          },
          {
            q: "What's the funding signal?",
            a: "Cross-product adoption — when one library is being imported by three different categories of AI app in the same month.",
          },
          {
            q: "Is this a feature or a company?",
            a: "Library today, hosted retrieval API tomorrow, vertical search engine in 18 months. The path is real.",
          },
        ],
      },
      {
        slug: "fine-tuning-tools-for-non-ml-teams",
        name: "Fine-tuning tools for non-ML teams",
        pitch:
          "Take fine-tuning out of the notebook. Product teams want to point at JSONL and get a deployable adapter.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos where the demo gif is a CLI command followed by a deployed endpoint — not a Jupyter cell. Stars come from product engineers, not ML researchers.",
        whyNow:
          "Open-source models (Llama, Qwen, Mistral) are good enough that fine-tuning beats RAG for narrow tasks. But the tooling assumes you can spell PEFT, LoRA, and DeepSpeed.",
        examples: [
          "Modal-style fine-tune-as-a-service libraries",
          "Replicate-shaped CLI flows for LoRA training",
          "OpenAI fine-tuning CLI clones for open models",
        ],
        competingFor:
          "Hugging Face Trainer scripts maintained by one ML engineer per company.",
        ourTake:
          "Ship the 'pip install, fine-tune, get URL' path. The market is product engineers who don't want to learn PyTorch. Pricing is per training run, margin comes from GPU markup. Build if you've operated GPUs. Invest if you've seen three startups orient around this in one quarter.",
        faqs: [
          {
            q: "Isn't Modal already this?",
            a: "Modal is GPU compute. This is the fine-tune workflow on top — there's room for a focused layer that hides the orchestration.",
          },
          {
            q: "How does the team make money?",
            a: "GPU markup early, hosted inference later. Eventually a model registry product.",
          },
          {
            q: "What kills the wedge?",
            a: "OpenAI shipping fine-tuning that's as good as a Llama LoRA at the same price. Watch the gap.",
          },
        ],
      },
      {
        slug: "on-device-llm-runtimes",
        name: "On-device LLM runtimes",
        pitch:
          "Privacy, latency, cost — three reasons every app eventually wants a 3-8B model running on the user's machine.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape:
          "Repos with C++/Rust core, contributor list of WebGPU/Metal/CUDA specialists, and benchmarks against llama.cpp in the README.",
        whyNow:
          "Apple Silicon and consumer GPUs are now fast enough. The runtime that ships the cleanest mobile + desktop + browser experience wins the long tail of privacy-bound apps.",
        examples: [
          "llama.cpp forks with WebGPU bindings",
          "MLX-based mobile runtimes",
          "ONNX Runtime extensions for new architectures",
        ],
        competingFor:
          "Cloud-hosted inference for tasks that don't need it (autocomplete, redaction, transcription).",
        ourTake:
          "Heavy lift to build, but the moat compounds — every supported architecture and platform combo adds defensibility. Fund teams with prior systems experience (compiler, kernel, graphics). Don't fund teams whose only background is fine-tuning notebooks.",
        faqs: [
          {
            q: "Isn't llama.cpp already winning?",
            a: "For desktop, mostly. Mobile, browser, and embedded are still being decided. There's room for a portable runtime above llama.cpp.",
          },
          {
            q: "Is this a feature of the OS?",
            a: "Apple and Google will ship their own. But the cross-platform runtime — Mac + Windows + Linux + iOS + Android + WebGPU — is a third-party slot.",
          },
          {
            q: "What's the wedge product?",
            a: "Usually a developer SDK first, then a consumer app that uses it as proof.",
          },
        ],
      },
      {
        slug: "ai-voice-clone-toolkits",
        name: "AI voice-clone toolkits",
        pitch:
          "Open-weight voice cloning is finally good enough — the SDK that hides the model swaps wins the use-case sprawl.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos with audio sample directories, latency benchmarks in the README, and a Discord link with 1k+ members within three months of launch.",
        whyNow:
          "Cartesia, ElevenLabs, OpenAI TTS, and open-weight alternatives (Kokoro, MARS, Higgs) shipped roughly the same year. The integration layer is the slot.",
        examples: [
          "Cartesia API wrappers with fallback chains",
          "ElevenLabs-compatible SDKs for open models",
          "Latency-optimized streaming TTS libraries",
        ],
        competingFor:
          "Hand-rolled TTS code that locks teams into one provider.",
        ourTake:
          "Build it as a provider-router (Cartesia + ElevenLabs + Kokoro + OpenAI), not a single-vendor SDK. Win on falling back gracefully when one provider rate-limits. Watch for repos where the README brags about 99.9% TTS uptime — that's the leverage story.",
        faqs: [
          {
            q: "Aren't voice providers all racing to the bottom?",
            a: "Yes. Which is exactly why the routing/abstraction layer has durable value — it survives the price war.",
          },
          {
            q: "What's the use-case wedge?",
            a: "Outbound calling for SMBs and accessibility tooling for publishers. Both will pay $50-200/mo per seat.",
          },
          {
            q: "Is this a real company or a feature?",
            a: "Company for the next 12 months while providers stabilize. After that, likely consolidated into the model vendors.",
          },
        ],
      },
      {
        slug: "multimodal-rag-stacks",
        name: "Multimodal RAG stacks",
        pitch:
          "Text + image + table retrieval — the indexing layer that doesn't yet have a winner.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos with PDF parsing benchmarks in the README, contributor list of OCR/CV engineers, and growing test fixture directories of real documents (insurance forms, lab reports, contracts).",
        whyNow:
          "GPT-4o and Claude vision are good at single-document Q&A but terrible at large corpus retrieval. The indexing layer for multi-modal corpora is unbuilt.",
        examples: [
          "ColPali-based document retrieval libraries",
          "LlamaParse-style PDF chunkers",
          "Vision-RAG benchmarks with reproducible scoring",
        ],
        competingFor:
          "Hand-rolled OCR → text → embed pipelines that lose layout context.",
        ourTake:
          "Build vertical: a stack that wins on legal contracts beats a stack that's mediocre on everything. The defensible asset is the ingest pipeline plus the eval set on real documents.",
        faqs: [
          {
            q: "Doesn't every LLM vendor ship vision now?",
            a: "They ship inference. They don't ship retrieval at scale. That's the gap.",
          },
          {
            q: "What's the signal that one stack is winning?",
            a: "Same eval set scoring 30%+ better with the same model — the difference is the retrieval, not the model.",
          },
          {
            q: "What's the moat?",
            a: "The eval set, then the ingest pipeline, then the API stickiness.",
          },
        ],
      },
      {
        slug: "llm-observability-stacks",
        name: "LLM observability stacks",
        pitch:
          "Production AI apps need traces, evals, and cost dashboards — the Datadog of AI is still being decided.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape:
          "Repos with OpenTelemetry instrumentation, SDK adapters for the top five model providers, and a hosted dashboard demo in the README.",
        whyNow:
          "Every product team is shipping an AI feature. Most are blind to cost, latency, and quality regressions. The observability layer is being chosen now and switching costs are high.",
        examples: [
          "Langfuse-style hosted observability platforms",
          "Helicone-shaped lightweight proxies",
          "Phoenix from Arize — open-source observability for LLMs",
        ],
        competingFor:
          "Console.log statements and weekly spreadsheet exports.",
        ourTake:
          "The product is hosted, not open-source-only. Win the developer relationship with a 10-line SDK install, monetize on retention + alerts. Compete on the eval primitives, not the trace viewer.",
        faqs: [
          {
            q: "Is Datadog going to win this?",
            a: "Eventually they'll be a credible option. The 18-month window belongs to focused teams that own the workflow.",
          },
          {
            q: "What's the funding signal?",
            a: "Free-tier-to-paid conversion above 4%. That's the metric every Tier-1 firm asks about.",
          },
          {
            q: "How does this compound?",
            a: "Traces → evals → model routing → cost optimization. Each adjacency is a new product line.",
          },
        ],
      },
      {
        slug: "prompt-version-control",
        name: "Prompt version control",
        pitch:
          "Git-for-prompts that non-engineers can use — a small focused tool that every AI team eventually wants.",
        buildCost: "month",
        dealVelocity: "steady",
        signalShape:
          "Repos with a CLI + dashboard combo, integration test directories for popular frameworks, and a 'compare two prompt versions' demo in the README.",
        whyNow:
          "Prompts live in three places (code, prompt files, vendor consoles) and drift constantly. The tool that gives PMs a diff view wins the workflow.",
        examples: [
          "PromptLayer-style hosted prompt registries",
          "Vellum-shaped prompt management platforms",
          "Open-source Git-for-prompts CLIs",
        ],
        competingFor:
          "A Notion page maintained by one tired prompt engineer.",
        ourTake:
          "Two-product company: free CLI + paid hosted dashboard with eval integration. The moat is in the eval link — versions without evals are useless. Watch for repos that add eval integration in the same commit as multi-user access.",
        faqs: [
          {
            q: "Is this a feature of the observability tool?",
            a: "Possibly — and the observability tools will try. But the non-engineer surface is a different product.",
          },
          {
            q: "Who's the buyer?",
            a: "AI PMs and applied AI leads, $200-500 per seat per month.",
          },
          {
            q: "What's the wedge?",
            a: "Slack + GitHub integration. The PM lives in Slack and reviews diffs in GitHub. Match that.",
          },
        ],
      },
      {
        slug: "ai-safety-redteam-tools",
        name: "AI safety / red-team tools",
        pitch:
          "Prompt injection, jailbreaks, data leakage — every shipped AI feature needs a test harness. Most teams don't have one.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos with curated attack taxonomies, scoring rubrics, and contributor list including security researchers from named labs.",
        whyNow:
          "Regulation (EU AI Act, sectoral guidance) is forcing teams to demonstrate red-team coverage. Compliance is a budget unlock.",
        examples: [
          "Garak-style scanning frameworks",
          "Promptfoo red-team plugins",
          "Vertical attack libraries (medical, financial, legal)",
        ],
        competingFor:
          "Internal one-off red-team exercises that take a week and don't repeat.",
        ourTake:
          "Build as a CI-runnable scanner with a vertical attack pack. Compete on coverage breadth and the speed at which new attacks land in the public corpus. Fund teams with at least one named security researcher on the founding side.",
        faqs: [
          {
            q: "Won't the foundation models fix this themselves?",
            a: "They'll improve, but the responsibility sits with the deployer, not the model vendor. The product company always needs its own test layer.",
          },
          {
            q: "Is this a service or a product?",
            a: "Both — services for the top-100 enterprises, product for everyone else.",
          },
          {
            q: "What's the moat?",
            a: "The attack corpus, then the eval pipeline, then the compliance reports.",
          },
        ],
      },
    ],
  },
  {
    slug: "developer-tools",
    name: "Developer Tools",
    shortPitch:
      "The most overcrowded sector — but also the one with the highest signal-to-noise ratio for GitHub-trending repos.",
    niches: [
      {
        slug: "code-review-for-mobile",
        name: "Code review for mobile",
        pitch:
          "Mobile is where review tooling broke first — phone screens, swipe-friendly diffs, async patterns.",
        buildCost: "month",
        dealVelocity: "steady",
        signalShape:
          "Repos that publish iOS / Android binaries on every release and treat the web UI as secondary. Star growth dominated by managers and senior ICs, not juniors.",
        whyNow:
          "Async + distributed teams created a real need to triage PRs from a phone. GitHub mobile is read-only; the gap is real.",
        examples: [
          "Pull request triage apps with native mobile clients",
          "Code review apps shipped via TestFlight + Play Store",
          "Slack-bot-first review flows for mobile-first managers",
        ],
        competingFor:
          "GitHub mobile + a Slack notification + 'I'll look at this when I'm at my laptop.'",
        ourTake:
          "Wedge product is the mobile reviewer. Eventually expands to standups, deploy approvals, on-call. Build if you ship native mobile fast. Invest if you watch a repo gain stars from engineering managers (high LinkedIn-bio match rate).",
        faqs: [
          {
            q: "Isn't GitHub going to ship this themselves?",
            a: "They had years to. They didn't. The constraint is product focus, not capability.",
          },
          {
            q: "What's the GTM?",
            a: "Bottom-up to managers in async-first companies. Top-down to platform teams in larger orgs.",
          },
          {
            q: "How fast can this category grow?",
            a: "Slowly — but the LTV is high. Once a manager replaces their workflow, switching cost is months.",
          },
        ],
      },
      {
        slug: "ai-pair-programming-cli",
        name: "AI pair-programming CLI",
        pitch:
          "Terminal-native AI coding — Aider, Plandex, Claude Code shape — minus the IDE lock-in.",
        buildCost: "quarter",
        dealVelocity: "frothy",
        signalShape:
          "Repos with multi-provider model adapters (OpenAI + Anthropic + local) and active issue threads about specific tool calls (git operations, test runners, linters).",
        whyNow:
          "Cursor and Copilot own the IDE slot. The CLI / terminal-native slot is wide open, and that's where senior engineers actually work.",
        examples: [
          "Aider-style git-aware coding agents",
          "OpenAI Codex CLI",
          "Claude Code-shaped terminal flows",
        ],
        competingFor:
          "Copy-paste from a chat window into the terminal and back.",
        ourTake:
          "Hard to build, harder to differentiate. The wedge is a specific developer ritual — 'fix all the lint errors before this PR' or 'run the failing test and patch it.' Sell to staff engineers, not juniors.",
        faqs: [
          {
            q: "Won't OpenAI / Anthropic absorb this?",
            a: "They'll ship reference implementations. The interesting wedges sit on top of the reference — vertical workflows, opinionated git flows, language-specific behaviors.",
          },
          {
            q: "How do you price this?",
            a: "Per-seat, with the model spend either passed through or covered by the founder's commercial model deal.",
          },
          {
            q: "Is the moat real?",
            a: "Workflow stickiness, not technology. Once a team has muscle memory, they don't switch.",
          },
        ],
      },
      {
        slug: "terraform-alternatives",
        name: "Terraform alternatives",
        pitch:
          "HashiCorp's BSL license cracked the door — multiple credible forks and rebuilds are now real businesses.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape:
          "Repos with extensive provider directories, golden-path examples for AWS / GCP / Azure, and an active discord with infrastructure engineers from named platform teams.",
        whyNow:
          "The OpenTofu / Pulumi / Crossplane race is on. The infrastructure-as-code seat is one of the highest-LTV in dev tools.",
        examples: [
          "OpenTofu — the BSL fork",
          "Pulumi-style language-native IaC",
          "Crossplane / KCL for Kubernetes-first ops",
        ],
        competingFor:
          "Terraform Cloud + an Atlantis cron + bash scripts.",
        ourTake:
          "Build is only viable with prior infra experience. Invest if you see contributor list overlap with named platform engineers from FAANG / late-stage scale-ups. The replication of internal patterns into open source is the signal.",
        faqs: [
          {
            q: "Isn't HashiCorp going to recapture?",
            a: "The license can't be reversed. The community has migrated. The window is open.",
          },
          {
            q: "What's the wedge feature?",
            a: "Drift detection plus AI-suggested remediation. Both adjacencies are unbuilt.",
          },
          {
            q: "Who pays for this?",
            a: "Platform teams at companies with 100+ engineers. $50k-500k per year deals.",
          },
        ],
      },
      {
        slug: "postgres-clients-for-ai",
        name: "Postgres clients for AI",
        pitch:
          "AI apps mostly fail at Postgres — connection pooling, prepared statements, vector indexes. There's a clean client to be built.",
        buildCost: "month",
        dealVelocity: "steady",
        signalShape:
          "Repos with explicit pgvector + pgvectorscale support, edge runtime compatibility, and a benchmark README against node-postgres / postgres-js.",
        whyNow:
          "Postgres is now the default AI database. The clients were built for traditional web apps and need redesign for vector workloads and serverless lifecycles.",
        examples: [
          "Neon serverless driver-style clients",
          "Drizzle ORM + pgvector adapters",
          "Pglite for in-browser Postgres clients",
        ],
        competingFor:
          "node-postgres + a custom connection pool + manual pgvector queries.",
        ourTake:
          "Library now, hosted DB tomorrow. The library wedge gives you the integration list to launch your DB. Watch repos that ship Neon / Supabase / Xata adapters in their first six months.",
        faqs: [
          {
            q: "Is this a Vercel / Neon feature?",
            a: "Partially. But the cross-vendor client (Neon + Supabase + RDS + self-hosted) is a third-party slot.",
          },
          {
            q: "Who's the user?",
            a: "AI app developers using Next.js / Astro / SvelteKit / Remix.",
          },
          {
            q: "Does this expand?",
            a: "Yes — client → hosted DB → vector search → eval store. Same path as Drizzle → DB → ORM.",
          },
        ],
      },
      {
        slug: "github-action-test-runners",
        name: "GitHub Action test runners",
        pitch:
          "CI is slow and expensive. AI-aware test runners that selectively re-run, parallelize, and flake-detect are unsolved.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos with benchmarks against vanilla Actions, cost-saving demos in the README, and integrations for the top 5 test frameworks per language.",
        whyNow:
          "AI-generated PR floods are crushing CI budgets. The runner that figures out 'only run the tests this PR could break' wins the budget conversation.",
        examples: [
          "BuildJet / Blacksmith — faster runners",
          "Trunk Flaky Tests — selective re-run",
          "Sentry Codecov AI-selected tests",
        ],
        competingFor:
          "GitHub-hosted runners + a custom matrix definition.",
        ourTake:
          "Two viable shapes: faster compute (commodity, race to bottom) or smarter selection (durable, hard to replicate). Fund the second. Build if you have prior CI infra experience.",
        faqs: [
          {
            q: "Will GitHub do this themselves?",
            a: "They've been hinting at it for years. Whoever ships first wins the workflow.",
          },
          {
            q: "Pricing model?",
            a: "Per-minute saved or per-pipeline, depending on the wedge.",
          },
          {
            q: "What's the moat?",
            a: "The selection model — and the data you collect to train it.",
          },
        ],
      },
      {
        slug: "container-build-cache-tools",
        name: "Container build cache tools",
        pitch:
          "Docker builds in CI are still slow. The remote cache layer is where the speedup hides.",
        buildCost: "month",
        dealVelocity: "trickle",
        signalShape:
          "Repos with BuildKit configuration tutorials, distributed cache backends (S3, GCS, R2), and benchmarks showing 5-10x build speedups.",
        whyNow:
          "Monorepos and AI-heavy CI have made Docker build times the single biggest CI tax. Caching layers compound — every team that adopts saves real money.",
        examples: [
          "Depot.dev — managed remote build cache",
          "Earthly's BuildKit-based cache layer",
          "Self-hosted BuildKit + S3 cache patterns",
        ],
        competingFor:
          "GitHub Actions cache + a Dockerfile and prayers.",
        ourTake:
          "Niche but durable. Buyers are platform teams that benchmark CI cost weekly. Hard to displace once installed. Fund if you see a repo gaining stars from named SREs across multiple companies.",
        faqs: [
          {
            q: "How do you make money?",
            a: "Hosted cache with bandwidth + storage markup. $500-50k/mo per customer.",
          },
          {
            q: "Is this competitive with Bazel?",
            a: "Adjacent. Bazel users have their own cache story. The wedge is the Dockerfile crowd.",
          },
          {
            q: "What kills this?",
            a: "GitHub shipping fast Actions cache or Docker shipping a free hosted cache. Both are possible.",
          },
        ],
      },
      {
        slug: "type-safe-orms-2026",
        name: "Type-safe ORMs (2026 reboot)",
        pitch:
          "Drizzle won the wedge. The next ORM optimizes for AI agent friendliness, schema inference, and edge runtimes.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos with a TypeScript-first API, edge runtime compatibility, and an AI-generated query demo in the README.",
        whyNow:
          "AI agents write SQL badly. ORMs are the abstraction layer that gives agents structured types to reason over. The next reboot is AI-native.",
        examples: [
          "Drizzle ORM — current incumbent",
          "Prisma's edge-friendly client",
          "Kysely — query-builder-first approach",
        ],
        competingFor:
          "Raw SQL + a TypeScript wrapper + careful refactors.",
        ourTake:
          "Hard to build, very hard to win. But the LTV is enormous — once installed, ORMs don't leave. Fund only with prior database commercial experience.",
        faqs: [
          {
            q: "Is this market over?",
            a: "Drizzle and Prisma split the wedge but neither owns 50%. The AI-native wedge is fresh.",
          },
          {
            q: "What's the AI-native angle?",
            a: "Schema introspection for agents, structured query result types, and SQL safety primitives the agent can call.",
          },
          {
            q: "Who's the buyer?",
            a: "Solo developers and small teams (free tier), DBaaS vendors (commercial licensing).",
          },
        ],
      },
      {
        slug: "devbox-and-environment-replication",
        name: "Devbox & environment replication",
        pitch:
          "Dev containers are still half-broken. The team that nails 'clone repo → start coding in 10s' wins the dev relationship.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos with multi-language template directories, GitHub Codespaces compatibility, and a `flake.nix` or `devbox.json` shipped at root.",
        whyNow:
          "AI agents need reproducible environments to run code safely. The dev-env layer is now both a human and an agent tool.",
        examples: [
          "Devbox — Nix-powered dev environments",
          "Devcontainer specs with first-class CLI",
          "Daytona-style dev environment managers",
        ],
        competingFor:
          "A README with 18 setup steps and a yearly Docker Compose breakage.",
        ourTake:
          "The agent angle is the wedge. Human dev-envs is a commodity race; agent-safe sandboxes is a real product. Watch for repos integrating with code-running AI services.",
        faqs: [
          {
            q: "Is this Vercel Sandbox now?",
            a: "Adjacent. Vercel Sandbox is the runtime. This is the spec + local + cloud env.",
          },
          {
            q: "Who pays?",
            a: "Platform teams that want one env spec across local + cloud + AI runners.",
          },
          {
            q: "Build or fund?",
            a: "Build if you have systems background. Fund if you've seen a repo win the agent integration race.",
          },
        ],
      },
      {
        slug: "secret-scanners-for-llm-logs",
        name: "Secret scanners for LLM logs",
        pitch:
          "LLM logs and traces are leaking secrets at scale. Scanners that catch them at the SDK boundary are an unbuilt layer.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos with regex + entropy + ML detector trios, integration adapters for the top LLM SDKs, and compliance frameworks (SOC2 / HIPAA / GDPR) called out in the README.",
        whyNow:
          "Every observability tool stores prompts and completions. Secrets leak into both. Regulated industries are starting to ask.",
        examples: [
          "TruffleHog-style scanners adapted to LLM payloads",
          "Detect-secrets forks with PII + secret detectors",
          "Lakera-style guard frameworks for outbound logs",
        ],
        competingFor:
          "A regex grep over the log stream + crossed fingers.",
        ourTake:
          "SDK-level injection wins. Customers want a 2-line install. Pricing is per LLM call scanned. Watch for repos that ship adapters for OpenAI, Anthropic, and the major observability tools (Langfuse, Helicone, Datadog) in the same release.",
        faqs: [
          {
            q: "Isn't this a feature of observability?",
            a: "Some observability tools ship this. But the standalone scanner that runs across all of them is a different shape.",
          },
          {
            q: "What's the compliance angle?",
            a: "EU AI Act + sectoral regulation. Buyers are CISOs at AI-adopting enterprises.",
          },
          {
            q: "Is this a feature?",
            a: "Feature today, product tomorrow, platform when extended to image/video.",
          },
        ],
      },
      {
        slug: "doc-from-code-generators",
        name: "Doc-from-code generators",
        pitch:
          "AI can write docs that don't suck. The plumbing between code and rendered docs is the real product.",
        buildCost: "month",
        dealVelocity: "steady",
        signalShape:
          "Repos that integrate with the top 3-5 doc renderers (Mintlify / Docusaurus / Starlight) and ship CLI + CI flows.",
        whyNow:
          "Engineering teams skip doc writing. AI can fill the gap if the workflow is right (commit hooks, PR comments, automatic refresh).",
        examples: [
          "Mintlify Writer — AI-generated docs",
          "Pieces / Codeium docs-from-code helpers",
          "Open-source 'changelog from PR' generators",
        ],
        competingFor:
          "README.md that hasn't been updated since 2024.",
        ourTake:
          "Hard to differentiate at the model layer. The wedge is the workflow integration — Slack bot, PR comment, deploy hook. Watch for repos shipping integrations for Vercel / Netlify / GitHub Pages in their first 90 days.",
        faqs: [
          {
            q: "Is this just a Copilot feature?",
            a: "Copilot writes inline. This is about rendered docs sites, which is a different workflow.",
          },
          {
            q: "Pricing?",
            a: "Per repo per month. $50-500 depending on size.",
          },
          {
            q: "Who's the moat-builder?",
            a: "Whoever owns the change-log → release-notes → external-blog pipeline.",
          },
        ],
      },
    ],
  },
];

nicheSectors.push(
  {
    slug: "fintech",
    name: "Fintech",
    shortPitch:
      "The most fragmented stack in tech. Every workflow has a niche player and a 'we'll get to it' incumbent.",
    niches: [
      {
        slug: "stablecoin-treasury-tooling",
        name: "Stablecoin treasury tooling",
        pitch: "Treasury management when half your float is USDC.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape:
          "Repos with multi-chain wallet adapters, accounting export integrations (QuickBooks / Xero), and contributor lists including ex-Coinbase / ex-Circle engineers.",
        whyNow:
          "Stablecoin payment volume crossed $10T annualized. CFOs are catching up — most still treat USDC as crypto, not cash equivalent.",
        examples: [
          "Multisig + accounting export dashboards",
          "USDC-native invoicing platforms",
          "Onchain treasury reconciliation libraries",
        ],
        competingFor: "A spreadsheet of wallet addresses and Etherscan tabs.",
        ourTake:
          "Wedge product for AI-native startups paying contractors in USDC. Expands to mid-market when the accounting integrations are deep. Fund teams that ship QuickBooks + Xero + Netsuite in their first six months.",
        faqs: [
          { q: "Isn't this Coinbase's product?", a: "Coinbase Prime serves the institutional top. The mid-market and SMB slot is a different shape entirely." },
          { q: "Compliance angle?", a: "FinCEN MSB licensing, plus state-level money transmitter requirements where applicable." },
          { q: "Who's the buyer?", a: "CFOs and finance leads at remote-first software startups." },
        ],
      },
      {
        slug: "embedded-payroll-apis",
        name: "Embedded payroll APIs",
        pitch: "Payroll-as-a-service for vertical SaaS — the Stripe Atlas of W-2 employment.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape:
          "Repos with payroll calculation libraries by state, integration adapters for vertical SaaS platforms, and W-2 / 1099 form generators.",
        whyNow: "Every vertical SaaS eventually wants to run payroll. Building it from scratch is a regulated nightmare. The API layer is high-trust, high-margin.",
        examples: ["Check / Gusto Embedded API", "Vertical-payroll APIs (construction, restaurants)", "Contractor-first payroll rails"],
        competingFor: "Gusto + a Zapier sync to your vertical app.",
        ourTake:
          "Multi-year build with regulatory burden. Fund only if founders have payroll or labor-law background. The leverage is the long-tail vertical SaaS market that can't afford a Gusto integration team.",
        faqs: [
          { q: "How big can this get?", a: "Multi-billion in TAM. Payroll is sticky and high-LTV." },
          { q: "What's the GTM?", a: "Direct integration deals with the top 50 vertical SaaS platforms." },
          { q: "Who's the moat?", a: "Regulatory licensing in 50 states + the contractor / tax compliance graph." },
        ],
      },
      {
        slug: "ai-tax-loss-harvesting",
        name: "AI tax-loss harvesting",
        pitch: "Tax-loss harvesting for crypto + brokerage portfolios, automated end-to-end.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos with broker API integrations (Alpaca / IBKR / Robinhood), cost-basis calculation libraries, and tax-form generators.",
        whyNow: "Retail investors holding crypto + equities have unrealized losses they can claim. The product is annual, sticky, and pricable.",
        examples: ["Wealthfront-style automated harvesting", "CoinTracker-shaped crypto tax", "Hybrid stock + crypto harvesters"],
        competingFor: "A CPA who looks at the portfolio in Q4 and panics.",
        ourTake:
          "Build only with prior wealth-tech experience. Compliance complexity is real. The wedge is the high-net-worth retail user with $50k-500k portfolios — too big for Robinhood, too small for a private bank.",
        faqs: [
          { q: "Is this seasonal?", a: "Q4 is the spike, but onboarding happens all year for the next tax season." },
          { q: "Pricing?", a: "$100-300/year per user, or 0.25% AUM-style." },
          { q: "Defensibility?", a: "The broker integrations + the tax-form library + the regulator relationship." },
        ],
      },
      {
        slug: "accounts-receivable-automation",
        name: "Accounts receivable automation",
        pitch: "AR follow-up, invoice routing, payment reconciliation — the workflow no one wants to own.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos with QuickBooks / Xero / Netsuite / SAP integrations, email automation libraries, and dunning-flow state machines.",
        whyNow: "AI can finally write the 'where's our payment?' email convincingly. Mid-market companies are the buyers — too big to chase by hand, too small for SAP.",
        examples: ["Versapay-style AR automation", "Tabs / Tesorio shape", "AI-native dunning + collections platforms"],
        competingFor: "A Gmail inbox and three Excel pivots.",
        ourTake:
          "Hot category. Boring but high-LTV. Fund teams shipping ERP integrations early. The repo pattern to watch: dunning state machines + LLM-drafted emails + payment portal hand-offs.",
        faqs: [
          { q: "Why now?", a: "Higher rates + tighter cash mean AR matters more. AI lowers the cost of personalized chasing." },
          { q: "Who buys?", a: "Controllers and CFOs at $5M-100M revenue companies." },
          { q: "What's the moat?", a: "Each ERP integration. Each adds defensibility." },
        ],
      },
      {
        slug: "small-business-credit-underwriting",
        name: "Small-business credit underwriting",
        pitch: "Real-time underwriting from bank-transaction data, not pulled credit reports.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape:
          "Repos with Plaid / Codat / Rutter integrations, cash-flow ML models, and risk-grading libraries.",
        whyNow: "Banks still pull 3-year credit reports for $50k loans. AI lets you underwrite from 90 days of bank transactions and get a more accurate signal.",
        examples: ["Pipe-style revenue-based financing", "Clearco shape", "Plaid-powered underwriting infra"],
        competingFor: "A bank's commercial lending team and a PDF tax return upload.",
        ourTake:
          "Capital-heavy. Fund only if there's a lending partner already lined up. The infra (data + model + decisioning) is the product to build; the lending itself is the partnership.",
        faqs: [
          { q: "Aren't we late?", a: "The first wave struggled with capital costs. The infra-layer (sell to lenders) is the second wave." },
          { q: "Who buys the infra?", a: "Mid-tier banks + fintech lenders." },
          { q: "Defensibility?", a: "Model accuracy on the long tail. The big banks won't underwrite a one-person business; you can." },
        ],
      },
      {
        slug: "b2b-invoice-financing-rails",
        name: "B2B invoice financing rails",
        pitch: "Invoice-backed working capital, embedded in the workflows that issue the invoices.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape:
          "Repos with marketplace / SaaS integration adapters, KYC libraries, and underwriting decision logs.",
        whyNow: "B2B marketplaces are the new payment surfaces. The invoice on day 0 is now an asset. Embedded financing is the unlock.",
        examples: ["Resolve-style B2B BNPL", "Slope-shaped working capital APIs", "Marketplace-embedded financing"],
        competingFor: "Net-30 terms and crossed fingers.",
        ourTake:
          "Hard to differentiate at API level. The moat is the embedded distribution — getting into the top 20 B2B marketplaces or vertical SaaS platforms. Fund early-stage if there's signed partnership-letter evidence.",
        faqs: [
          { q: "Who's the user?", a: "B2B marketplace buyers + sellers, both." },
          { q: "Pricing?", a: "1-3% factor rate on the invoice value." },
          { q: "What's the moat?", a: "Partnership exclusivity in vertical marketplaces." },
        ],
      },
      {
        slug: "programmable-card-issuing",
        name: "Programmable card issuing",
        pitch: "Stripe Issuing but vertical — virtual cards with workflow-aware controls.",
        buildCost: "team",
        dealVelocity: "trickle",
        signalShape:
          "Repos with card-program APIs, fraud-rule engines, and ledger libraries.",
        whyNow: "Vertical SaaS platforms want to issue cards branded to their flow. Stripe Issuing covers basics; vertical controls are the wedge.",
        examples: ["Lithic / Marqeta-style issuing", "Vertical card programs (trucking, hospitality)", "Stripe Issuing integrations"],
        competingFor: "A corporate card from Brex + a manual reconciliation flow.",
        ourTake:
          "Capital-heavy + regulatory. Fund only with prior issuing or banking-as-a-service team. The wedge is workflow rules — 'this card only works at gas stations in this state on Tuesdays.' Watch repos with deep MCC / fraud-rule libraries.",
        faqs: [
          { q: "Isn't Stripe Issuing this?", a: "Stripe ships the rails. Vertical workflow controls are downstream." },
          { q: "Margin?", a: "Interchange share + monthly platform fee." },
          { q: "Who's the buyer?", a: "Vertical B2B SaaS platforms with spend embedded in their flow." },
        ],
      },
      {
        slug: "kyc-replacements",
        name: "KYC replacements",
        pitch: "KYC providers are slow and brittle. Identity + risk scoring as a graph, not a one-shot check.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape:
          "Repos with multi-source identity validators (gov ID + biometric + email + phone + device), risk-scoring rule engines, and webhook-based decision flows.",
        whyNow: "Online fraud is up. KYC providers (Onfido / Persona / Veriff) lock customers in, charge per check, and underdeliver on risk-scoring accuracy.",
        examples: ["Alloy-style identity orchestration", "Persona's vertical KYC flows", "Open-source identity verification libraries"],
        competingFor: "A single KYC vendor + a fraud team adjusting risk thresholds by hand.",
        ourTake:
          "Orchestration is the wedge. Don't build a single identity check; orchestrate the existing ones. Margin comes from picking the right check at the right cost. Watch repos that publish vendor-comparison benchmarks in their READMEs.",
        faqs: [
          { q: "Who's the buyer?", a: "Fintech risk teams + crypto exchanges + neo-banks." },
          { q: "Pricing?", a: "Per-check with volume discounts. $0.50-$5 per verification." },
          { q: "Defensibility?", a: "The vendor matrix + risk-scoring model + decision telemetry." },
        ],
      },
      {
        slug: "expense-management-for-solopreneurs",
        name: "Expense management for solopreneurs",
        pitch: "Ramp / Brex are sized for funded startups. The 1-5 person business is underserved.",
        buildCost: "month",
        dealVelocity: "hot",
        signalShape:
          "Repos with mobile-first receipt OCR, multi-account aggregation, and tax-category auto-classification.",
        whyNow: "AI receipt OCR is finally accurate. Solo founders, freelancers, and 1099 contractors have $50-500/mo in spend that's miscategorized.",
        examples: ["Keeper Tax-style auto-categorization", "Found / Lili-shape solo expense", "Receipt OCR libraries"],
        competingFor: "A drawer of receipts and tax-season panic.",
        ourTake:
          "Self-serve, low-touch, high-volume. Pricing $10-30/mo. The moat is tax-deduction accuracy — get it right and you save customers more than you cost. Watch repos that publish accuracy benchmarks.",
        faqs: [
          { q: "Is this a feature of accounting software?", a: "Eventually. For 24-36 months it's a wedge product." },
          { q: "Pricing?", a: "$10-30/mo or % of refund." },
          { q: "TAM?", a: "60M+ US gig workers / sole proprietors." },
        ],
      },
      {
        slug: "real-time-fx-rails",
        name: "Real-time FX rails",
        pitch: "FX is still 2-3 day settlement and 1.5-3% spreads. AI-native FX with sub-second settlement is the next layer.",
        buildCost: "team",
        dealVelocity: "trickle",
        signalShape:
          "Repos with multi-rail (SWIFT + ACH + RTP + stablecoin) settlement, currency-spread libraries, and counterparty risk scoring.",
        whyNow: "Stablecoin rails make 24/7/365 FX viable. The non-crypto-facing wrapper layer is unbuilt.",
        examples: ["Wise / Revolut-shape FX APIs", "Bridge.xyz-style stablecoin rails", "Multi-rail FX orchestration"],
        competingFor: "A wire transfer + a 1.5% spread + 'arrives Tuesday.'",
        ourTake:
          "Capital and regulatory burden are real. Fund only with prior payments background. The wedge is B2B cross-border payments under $100k — the slot Wise dominated retail but mid-market is fragmented.",
        faqs: [
          { q: "Won't Wise win this?", a: "Wise dominates retail. B2B mid-market is wide open." },
          { q: "Margin?", a: "20-50bps + platform fee." },
          { q: "Compliance?", a: "Money transmitter licensing in major jurisdictions." },
        ],
      },
    ],
  },
  {
    slug: "healthcare",
    name: "Healthcare",
    shortPitch:
      "Sales cycles are long but LTV is enormous. The AI wedge is real — and most categories still have open lanes.",
    niches: [
      {
        slug: "ai-scribe-for-specialists",
        name: "AI scribe for specialists",
        pitch: "AI medical scribing for non-primary-care specialists where the workflow is different.",
        buildCost: "quarter",
        dealVelocity: "frothy",
        signalShape: "Repos with specialty-specific terminology libraries, EHR integration adapters, and HIPAA compliance frameworks.",
        whyNow: "Abridge and Nuance won primary care. Cardiology, ortho, derm, psych each have specialty-specific note shapes that need rework.",
        examples: ["Abridge-style ambient scribing", "Nuance DAX clones", "Specialty-specific scribe products"],
        competingFor: "A medical assistant typing during the appointment.",
        ourTake:
          "Vertical wedge. Pick one specialty, win the EHR integration race for that vertical, then expand. The funding signal is repos that ship Epic / Cerner / Athena integrations in 90 days.",
        faqs: [
          { q: "Is this just an Abridge feature?", a: "Abridge will expand, but the specialty depth is hard to fake." },
          { q: "Buyer?", a: "Specialty practice owners — 5-50 doctor practices." },
          { q: "Defensibility?", a: "Specialty terminology + EHR integration + workflow understanding." },
        ],
      },
      {
        slug: "clinical-trial-recruitment-software",
        name: "Clinical trial recruitment software",
        pitch: "Patient matching for clinical trials, with AI eligibility screening.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape: "Repos with clinical-criteria parsers, EHR data adapters, and recruitment-funnel libraries.",
        whyNow: "Trial enrollment is the bottleneck of pharma R&D. AI can match patients to protocols 10x faster.",
        examples: ["Antidote / Deep 6 AI-style platforms", "EHR-integrated recruitment", "Patient portal trial-matching"],
        competingFor: "A CRO calling patients from a list.",
        ourTake:
          "Pharma is the buyer; sales cycles are 12-24 months. Fund only with biotech or pharma-adjacent founders. The moat is the eligibility-criteria library + the EHR integration footprint.",
        faqs: [
          { q: "Who pays?", a: "Pharma sponsors and CROs." },
          { q: "Pricing?", a: "Per-patient enrolled or per-trial." },
          { q: "Compliance?", a: "HIPAA + GCP + IRB workflows." },
        ],
      },
      {
        slug: "chronic-condition-monitoring-apps",
        name: "Chronic condition monitoring apps",
        pitch: "RPM for diabetes, hypertension, CHF — AI-aware monitoring with caregiver-facing dashboards.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape: "Repos with device integration libraries (CGM / BP cuff / scale), care-team workflow apps, and billing-code automation.",
        whyNow: "Medicare RPM reimbursement is $50-110/patient/month. The patient + caregiver + provider triangle is solvable with AI.",
        examples: ["Livongo / Omada-style chronic care", "DarioHealth shape", "Open-source CGM dashboards"],
        competingFor: "A pamphlet from the cardiologist and a paper food log.",
        ourTake:
          "Reimbursement-driven, capital-intensive. Fund with healthcare GTM experience. The wedge is one chronic condition done extremely well; expand to comorbidities.",
        faqs: [
          { q: "Reimbursement model?", a: "CPT codes 99453, 99454, 99457, 99458 for RPM." },
          { q: "Who's the buyer?", a: "Hospital systems and ACOs, secondarily insurers." },
          { q: "Defensibility?", a: "Clinical outcome data + provider integration." },
        ],
      },
      {
        slug: "telehealth-prescription-routing",
        name: "Telehealth prescription routing",
        pitch: "ePrescribe APIs that handle the controlled-substance + state-by-state mess.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape: "Repos with Surescripts adapters, DEA EPCS compliance flows, and state-specific routing logic.",
        whyNow: "Telehealth is permanent. Every new telehealth app needs eRx. Most rebuild it from scratch poorly.",
        examples: ["DoseSpot-style eRx APIs", "Photon Health shape", "Open-source eRx integrations"],
        competingFor: "A solo founder spending six months on Surescripts integration.",
        ourTake:
          "Infra wedge for the telehealth long tail. Sell to 100-1000 telehealth apps. Pricing per script. The moat is compliance + reliability — both hard to fake.",
        faqs: [
          { q: "Who's the buyer?", a: "Telehealth platforms and direct-to-consumer health brands." },
          { q: "Margin?", a: "Per-script fee, 30-60% gross margin." },
          { q: "What kills this?", a: "Surescripts shipping a public API. Unlikely for years." },
        ],
      },
      {
        slug: "dental-practice-saas",
        name: "Dental practice SaaS",
        pitch: "Practice management software for the long tail of solo dental offices.",
        buildCost: "team",
        dealVelocity: "trickle",
        signalShape: "Repos with imaging-system integrations, insurance-claim libraries, and patient-portal frameworks.",
        whyNow: "Dental PMS is dominated by 20-year-old desktop software. AI-native PMS with insurance-claim automation is a real wedge.",
        examples: ["Cloud-based dental PMS", "AI claim-coding tools for dental", "Patient acquisition platforms"],
        competingFor: "Dentrix or Eaglesoft on a Windows server in the back office.",
        ourTake:
          "Long sales cycle. Vertical SaaS classic. Fund only with prior dental industry GTM. The moat is the insurance-claim integration + the practice-management feature graph.",
        faqs: [
          { q: "TAM?", a: "200k dental practices in the US, $5k+ per year each." },
          { q: "Why hasn't this been done?", a: "It has — Dentrix / Eaglesoft / Open Dental. The wedge is AI-native + cloud-native." },
          { q: "GTM?", a: "Reseller-led for the first 1000 customers." },
        ],
      },
      {
        slug: "fertility-tracking-with-ai",
        name: "Fertility tracking with AI",
        pitch: "Cycle + fertility tracking with AI-driven personalization, not generic notification spam.",
        buildCost: "month",
        dealVelocity: "steady",
        signalShape: "Repos with cycle-data modeling, wearable device integrations, and provider hand-off flows.",
        whyNow: "Privacy concerns post-Dobbs reshuffled the market. Cloud-free, encrypted, AI-personalized fertility apps are a real opening.",
        examples: ["Natural Cycles-style apps", "Oura / Apple Watch integrations", "Privacy-first cycle trackers"],
        competingFor: "Flo / Clue with creepy ad targeting.",
        ourTake:
          "Consumer category. Hard CAC math. Fund only with prior consumer health or DTC GTM experience. The wedge is privacy + accuracy.",
        faqs: [
          { q: "Regulatory?", a: "FDA Class II if claiming contraception." },
          { q: "Pricing?", a: "$10-30/mo subscription." },
          { q: "Moat?", a: "Privacy story + accuracy + provider partnerships." },
        ],
      },
      {
        slug: "mental-health-group-therapy-platforms",
        name: "Mental health group therapy platforms",
        pitch: "Group therapy and peer support, run by clinicians, scaled by software.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape: "Repos with video-calling integrations, group-session management, and clinical-progress tracking.",
        whyNow: "Therapist shortage is structural. Group therapy + AI-mediated facilitation can scale care without scaling clinicians 1:1.",
        examples: ["Headspace Care-style platforms", "Lyra Health shape", "Open-source group therapy management"],
        competingFor: "An hour-a-week 1:1 therapist who has a 6-month waitlist.",
        ourTake:
          "Clinical evidence is the moat. Fund teams with a clinical co-founder. Reimbursement varies wildly by payer. The buyer is the employer first, the insurer second.",
        faqs: [
          { q: "Who pays?", a: "Employers via mental-health benefit packages." },
          { q: "Compliance?", a: "HIPAA + state-by-state telehealth licensing." },
          { q: "Defensibility?", a: "Clinical outcome data + clinician network + employer relationships." },
        ],
      },
      {
        slug: "medical-billing-llm-coders",
        name: "Medical billing LLM coders",
        pitch: "ICD-10 and CPT coding with AI, validated by RCM workflows.",
        buildCost: "team",
        dealVelocity: "hot",
        signalShape: "Repos with EHR integration adapters, code-validation rule engines, and audit-trail libraries.",
        whyNow: "Medical coding is a $30B industry. LLMs can finally do this well enough to reshape the workflow.",
        examples: ["CodaMetrix-style autonomous coding", "Fathom / Nym Health shape", "Open-source medical coding libraries"],
        competingFor: "An outsourced coding firm in Manila or Manila.",
        ourTake:
          "Capital-light, high-value vertical AI. The moat is the validation set + the EHR integrations + the payer-specific rules. Fund only with clinical AI background.",
        faqs: [
          { q: "Buyer?", a: "Hospital systems and large physician groups." },
          { q: "Pricing?", a: "Per-encounter or per-claim, $0.50-$5." },
          { q: "Defensibility?", a: "Accuracy benchmarks vs. existing coding firms." },
        ],
      },
      {
        slug: "prior-authorization-automation",
        name: "Prior authorization automation",
        pitch: "Prior auth is one of the most painful workflows in healthcare. AI can break the bottleneck.",
        buildCost: "team",
        dealVelocity: "hot",
        signalShape: "Repos with payer-specific PA criteria libraries, EHR integration adapters, and approval-status webhooks.",
        whyNow: "Insurer + provider tension on PA is at all-time highs. Regulatory pressure (CMS rules) is forcing electronic PA workflows.",
        examples: ["Cohere Health-style PA automation", "Olive AI shape (pre-pivot)", "Payer-specific PA APIs"],
        competingFor: "A fax machine and a 45-minute hold call.",
        ourTake:
          "Hot category, real budgets. The wedge is one specialty (oncology, GLP-1s, MRI). Fund with payer-side or provider-side GTM. The moat is payer-relationship + criteria-library depth.",
        faqs: [
          { q: "Who pays?", a: "Providers initially; payers eventually." },
          { q: "TAM?", a: "$10B+ in administrative spend." },
          { q: "Defensibility?", a: "Per-payer criteria library + integration footprint." },
        ],
      },
      {
        slug: "voice-first-ehr",
        name: "Voice-first EHR",
        pitch: "EHR you talk to, not click through. The Suki / Abridge category extended to full charting.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape: "Repos with high-fidelity STT, medical-NER libraries, and EHR write-back integrations.",
        whyNow: "Voice models are finally accurate enough for medical terminology. Provider burnout is the budget unlock.",
        examples: ["Suki AI assistant", "DeepScribe shape", "Open-source medical STT"],
        competingFor: "Typing into Epic for 2 hours after every shift.",
        ourTake:
          "Hard to build. Easy to demo. The moat is integration depth + clinical accuracy + EHR write-back. Fund with prior healthcare SaaS team.",
        faqs: [
          { q: "Buyer?", a: "Health systems and large physician groups." },
          { q: "Pricing?", a: "$200-500/clinician/month." },
          { q: "What kills this?", a: "Epic or Cerner shipping native voice. Inevitable but slow." },
        ],
      },
    ],
  },
  {
    slug: "cybersecurity",
    name: "Cybersecurity",
    shortPitch:
      "Adjacent to AI growth. Every new agent layer creates new attack surfaces — the security wedge follows the platform shift.",
    niches: [
      {
        slug: "llm-firewall-tooling",
        name: "LLM firewall tooling",
        pitch: "WAF for AI agents — prompt injection blocking, output sanitization, policy enforcement at the API boundary.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape: "Repos with attack-pattern libraries, multi-model adapters, and policy DSLs.",
        whyNow: "Every shipped AI agent is a new attack surface. Compliance is just starting to require coverage.",
        examples: ["Lakera Guard shape", "Prompt Security-style platforms", "Open-source LLM guard libraries"],
        competingFor: "Hand-rolled regex filters + 'we'll get to it.'",
        ourTake:
          "Wedge product. The moat is the attack-corpus + the policy enforcement engine. Watch repos that grow integrations across the top observability platforms.",
        faqs: [
          { q: "Is this a feature of observability?", a: "Adjacent. Some observability tools will absorb it. The standalone wedge is still real for 18 months." },
          { q: "Buyer?", a: "CISOs at AI-deploying enterprises." },
          { q: "Pricing?", a: "Per-call or per-deployment SaaS." },
        ],
      },
      {
        slug: "supply-chain-attack-detectors",
        name: "Supply chain attack detectors",
        pitch: "Catch malicious npm / PyPI packages before they land in production.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape: "Repos with package-registry scanners, dependency-graph libraries, and CI integration flows.",
        whyNow: "Supply-chain attacks doubled YoY. Most teams still trust npm install blindly.",
        examples: ["Socket / Phylum-style package scanners", "Snyk shape", "OSV / GitHub Advisory integrations"],
        competingFor: "Dependabot + a Snyk free tier + crossed fingers.",
        ourTake:
          "Steady demand, real budgets. The wedge is real-time detection vs. periodic scanning. Fund teams shipping deep dependency graph + behavioral analysis.",
        faqs: [
          { q: "Isn't Snyk this?", a: "Snyk is broad. The behavioral-analysis wedge is real-time and complementary." },
          { q: "Pricing?", a: "Per developer or per scan." },
          { q: "Moat?", a: "Malware corpus + behavioral analysis model + integration footprint." },
        ],
      },
      {
        slug: "secret-rotation-automation",
        name: "Secret rotation automation",
        pitch: "Secrets that rotate themselves — across HashiCorp Vault, AWS Secrets Manager, GitHub, and your CI.",
        buildCost: "month",
        dealVelocity: "steady",
        signalShape: "Repos with multi-secret-store adapters, rotation workflow libraries, and audit-log frameworks.",
        whyNow: "Long-lived secrets are the biggest unaddressed risk in most stacks. Rotation is a checkbox most teams never check.",
        examples: ["Doppler-style secret management", "Infisical / Bitwarden Secrets shape", "Open-source rotation libraries"],
        competingFor: ".env files + 'rotate quarterly' that nobody does.",
        ourTake:
          "Boring but real. Build cheap; sell to platform teams. The moat is the integration footprint, not the rotation logic.",
        faqs: [
          { q: "Doesn't Vault do this?", a: "Vault handles secrets; rotation orchestration across systems is its own product." },
          { q: "Buyer?", a: "Platform engineering teams." },
          { q: "Pricing?", a: "$10-50/seat/month or per-secret-managed." },
        ],
      },
      {
        slug: "oss-vulnerability-graphs",
        name: "OSS vulnerability graphs",
        pitch: "The dependency graph for open source vulnerabilities, indexed for AI agents and humans.",
        buildCost: "quarter",
        dealVelocity: "trickle",
        signalShape: "Repos with CVE / OSV ingestion, dependency-graph build pipelines, and MCP / API surfaces.",
        whyNow: "Agents need machine-readable security context. The graph layer is unbuilt or buried inside paid products.",
        examples: ["GUAC / OSV graph projects", "Snyk Knowledge Base", "OWASP-style open repos"],
        competingFor: "A CVE database + npm audit + grep.",
        ourTake:
          "Open data is the wedge; commercialization is the platform on top. Fund only with prior security infra background.",
        faqs: [
          { q: "Who pays?", a: "Security platforms paying for higher-fidelity data." },
          { q: "Moat?", a: "Data freshness + graph completeness + API ergonomics." },
          { q: "Build or fund?", a: "Build only with prior security data background; fund teams with named security backgrounds." },
        ],
      },
      {
        slug: "cloud-config-drift-detection",
        name: "Cloud config drift detection",
        pitch: "Continuous detection of AWS / GCP / Azure config drift, plus AI-suggested remediation.",
        buildCost: "quarter",
        dealVelocity: "steady",
        signalShape: "Repos with multi-cloud adapters, policy-as-code libraries, and remediation-workflow engines.",
        whyNow: "Cloud bills + cloud risk both come from config drift. AI can finally explain a misconfig in plain language.",
        examples: ["Cloudquery-style cloud scanners", "Wiz / Lacework shape", "Open-source policy-as-code"],
        competingFor: "AWS Config + a quarterly external audit.",
        ourTake:
          "Crowded category. Differentiate on remediation, not detection. Fund teams shipping auto-fix workflows for the top 50 misconfigs.",
        faqs: [
          { q: "Isn't Wiz this?", a: "Wiz is enterprise. The mid-market and SMB slot is open." },
          { q: "Pricing?", a: "Per cloud account / per resource scanned." },
          { q: "Defensibility?", a: "Remediation library + integration footprint." },
        ],
      },
      {
        slug: "identity-graph-tools",
        name: "Identity graph tools",
        pitch: "Map identity across SaaS apps — find shadow accounts, dormant access, over-permissioned users.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape: "Repos with SaaS API integrations (Okta / Google / Microsoft / 50+ tools), graph database libraries, and ITDR rule engines.",
        whyNow: "SaaS sprawl + LLM agent access = identity is the new perimeter. ITDR (identity threat detection) is a budget line for the first time.",
        examples: ["Veza-style identity platforms", "Authomize shape", "Open-source IAM graph tools"],
        competingFor: "An Okta admin and a quarterly audit spreadsheet.",
        ourTake:
          "Real budgets, real growth. The moat is the SaaS integration footprint + the threat-detection library. Fund teams shipping 30+ integrations in 90 days.",
        faqs: [
          { q: "Buyer?", a: "CISO + IAM lead." },
          { q: "Pricing?", a: "Per-identity or per-SaaS-app integrated." },
          { q: "Moat?", a: "Integration breadth + threat-detection model." },
        ],
      },
      {
        slug: "ai-agent-permissioning",
        name: "AI agent permissioning",
        pitch: "Who can run which agent? What can the agent see? The IAM layer for the agent era.",
        buildCost: "quarter",
        dealVelocity: "hot",
        signalShape: "Repos with policy DSLs, OAuth / OIDC adapters for agents, and MCP-aware permission frameworks.",
        whyNow: "Agents inherit user permissions implicitly. Audit teams are starting to ask for explicit policy boundaries.",
        examples: ["Cerbos / OPA-style policy engines", "MCP-aware permission frameworks", "Open-source agent IAM"],
        competingFor: "A wide-open API key with no policy boundary.",
        ourTake:
          "New category. Real demand at AI-mature enterprises. Build only with prior IAM or policy-engine background.",
        faqs: [
          { q: "Is this a feature of identity providers?", a: "Eventually. The wedge is 18-24 months." },
          { q: "Buyer?", a: "CISO + AI platform team." },
          { q: "Defensibility?", a: "Policy DSL + agent integration ecosystem." },
        ],
      },
      {
        slug: "deepfake-detection-apis",
        name: "Deepfake detection APIs",
        pitch: "Detect AI-generated voice + video + image for KYC, fraud, and content moderation.",
        buildCost: "team",
        dealVelocity: "hot",
        signalShape: "Repos with multi-modal detection models, KYC integration adapters, and continuous-evaluation harnesses.",
        whyNow: "Deepfake fraud incidents quadrupled YoY. KYC + content platforms have real budgets.",
        examples: ["Reality Defender shape", "Sensity AI", "Open-source deepfake detection libraries"],
        competingFor: "A human reviewer + 'they look real' shrug.",
        ourTake:
          "Hard category. The moat is the model + the dataset. Fund only with ML research depth. Evaluation matters more than marketing.",
        faqs: [
          { q: "Pricing?", a: "Per-detection or per-API-call." },
          { q: "Buyer?", a: "Fintech + content platforms + identity providers." },
          { q: "What kills this?", a: "Foundation models including deepfake detection as a free feature." },
        ],
      },
      {
        slug: "zero-trust-network-mesh",
        name: "Zero-trust network mesh",
        pitch: "Tailscale + Cloudflare Access shape — zero-trust networking for the agent era.",
        buildCost: "team",
        dealVelocity: "steady",
        signalShape: "Repos with WireGuard / WireGuard-derived implementations, identity-aware proxy code, and SSO integrations.",
        whyNow: "Hybrid work + AI agent access from anywhere = network perimeter is dead. The mesh approach is winning.",
        examples: ["Tailscale shape", "Twingate / NetBird", "Cloudflare Access patterns"],
        competingFor: "A VPN that 2/3 of the team has misconfigured.",
        ourTake:
          "Heavy build. Fund only with prior networking background. The wedge is a specific developer ritual — 'access prod for 30 minutes' or 'agent gets time-bounded scope.'",
        faqs: [
          { q: "Isn't Tailscale winning?", a: "Tailscale won the developer wedge. Enterprise + agent-specific is open." },
          { q: "Pricing?", a: "Per seat or per resource." },
          { q: "Defensibility?", a: "Networking primitives + integration ecosystem + audit features." },
        ],
      },
      {
        slug: "ssh-key-lifecycle-management",
        name: "SSH key lifecycle management",
        pitch: "Boring but unsolved. SSH keys outlive employment, devices, and security postures.",
        buildCost: "month",
        dealVelocity: "trickle",
        signalShape: "Repos with key-discovery libraries, rotation orchestration, and SSO integrations.",
        whyNow: "SSH-key sprawl is the audit finding nobody wants. Compliance pressure (SOC2 / FedRAMP) is forcing action.",
        examples: ["Smallstep-style certificate authorities", "Teleport SSH access", "Open-source SSH lifecycle tools"],
        competingFor: "An ssh-key file last rotated three jobs ago.",
        ourTake:
          "Niche but durable. Sell to platform engineering at compliance-bound companies. Fund only with prior infra background; don't build solo.",
        faqs: [
          { q: "Buyer?", a: "Platform + compliance teams at regulated companies." },
          { q: "Pricing?", a: "Per-user or per-host." },
          { q: "Moat?", a: "Integration breadth + compliance reports." },
        ],
      },
    ],
  },
);

nicheSectors.push(
  {
    slug: "climate-tech",
    name: "Climate Tech",
    shortPitch: "Capital is back. The software layers — accounting, marketplaces, monitoring — are where leverage compounds.",
    niches: makeNiches([
      ["carbon-accounting-for-smbs", "Carbon accounting for SMBs", "Carbon accounting that an SMB owner can actually run in a Saturday.", "month", "hot", "Repos with accounting-system integrations, emission-factor libraries by industry, and CDP / SBTi reporting templates.", "EU CSRD + US state-level disclosure rules are forcing SMBs to measure for the first time.", ["Watershed-style platforms", "Plan A / Sweep shape", "Open-source carbon-accounting libraries"], "A consultant + a spreadsheet + a one-off PDF.", "Sell to SMB accountants and fractional CFOs. The wedge is integrations with QuickBooks, Xero, and the top 10 SMB ERPs.", [["Buyer?", "SMB accountants and fractional CFOs."], ["Pricing?", "$50-500/mo per company."], ["What kills this?", "QuickBooks bundling carbon as a feature."]]],
      ["fleet-electrification-analytics", "Fleet electrification analytics", "Software that helps fleet operators model and execute EV transitions.", "quarter", "steady", "Repos with TCO calculators, route-optimization adapters, and utility-rate libraries.", "Federal + state fleet mandates are forcing logistics + delivery to electrify.", ["Geotab integrations", "Sawatch / Vincentric-shape TCO tools", "Open-source EV-fleet analytics"], "An Excel sheet from the truck dealer.", "Sell to fleet managers. The wedge is integrations with telematics providers (Geotab, Samsara, Verizon Connect).", [["Buyer?", "Fleet operators + utility partners."], ["Pricing?", "Per vehicle per month."], ["Moat?", "TCO accuracy + utility-program integrations."]]],
      ["household-electrification-marketplaces", "Household electrification marketplaces", "Heat pumps, EV chargers, solar — software that gets homeowners from quote to install.", "team", "steady", "Repos with quote-generation tools, installer marketplaces, and incentive-finder libraries.", "IRA tax credits + utility incentives created a new buying motion. Most homeowners get confused and stall.", ["Sealed-style platforms", "Wattbuy", "Open-source incentive-finder libraries"], "A Google search + four contractor estimates.", "Hard to build profitably. Fund only with prior home-services or marketplace GTM. The wedge is a specific product (heat pumps) done extremely well.", [["Buyer?", "Homeowners directly; utilities as channel partners."], ["Margin?", "Lead-gen + financing referral."], ["Defensibility?", "Installer network + financing partnerships."]]],
      ["methane-leak-detection-software", "Methane leak detection software", "Satellite + drone + sensor fusion to find methane leaks before regulators do.", "team", "trickle", "Repos with satellite-data adapters, ML-detection models, and oil & gas operator integrations.", "EPA + EU regulations on methane reporting are forcing detection. The data layer is unbuilt.", ["MethaneSAT data products", "GHGSat shape", "Open-source detection libraries"], "An annual flyover survey + crossed fingers.", "Capital-heavy. Fund only with prior energy industry background. The wedge is one operator (Oxy, BP, Shell) signed for pilot.", [["Buyer?", "Oil & gas operators + regulators."], ["Pricing?", "Per well-site or per region monitored."], ["Compliance?", "EPA OOOOb + EU Methane Regulation."]]],
      ["regenerative-ag-data-platforms", "Regenerative ag data platforms", "Software for farmers practicing regenerative ag — yield, carbon, soil, market data.", "quarter", "steady", "Repos with satellite-ingest libraries, soil-sensor adapters, and carbon-market integrations.", "Carbon credit markets + premium pricing for regen produce are creating real demand.", ["Indigo Ag-style platforms", "Cargill RegenConnect shape", "Open-source ag data libraries"], "A John Deere spreadsheet + a soil test once a year.", "Vertical SaaS. Long sales cycle. Fund only with ag background. The wedge is one crop (wheat, corn, soy) done well.", [["Buyer?", "Mid-size regenerative farmers."], ["Pricing?", "$5-50/acre/year."], ["Moat?", "Data accuracy + market access."]]],
      ["grid-flexibility-orchestration", "Grid flexibility orchestration", "Software that coordinates demand response, battery storage, and EV charging.", "team", "hot", "Repos with utility-API adapters, OpenADR libraries, and energy-market integrations.", "Grid stress + utility demand-response programs are creating new market for orchestration.", ["AutoGrid / GE Vernova shape", "Voltus", "Open-source DR libraries"], "An email from the utility asking you to turn down your AC.", "Heavy regulatory burden. Fund with prior utility-industry GTM. The wedge is one state's market.", [["Buyer?", "Utilities + commercial + industrial customers."], ["Pricing?", "Revenue share on DR program savings."], ["Defensibility?", "Utility integrations + market participation."]]],
      ["ev-charging-network-saas", "EV charging network SaaS", "Charge point management software for the long tail of small EV charging networks.", "quarter", "steady", "Repos with OCPP / OCPI adapters, payment integrations, and uptime monitoring.", "EV charging deployment is fragmented. The long tail of 5-500 station operators needs software.", ["AmpUp shape", "EVPassport", "Open-source CPMS libraries"], "Manufacturer software that costs $50/charger/month and barely works.", "Capital-light vertical SaaS. The moat is reliability + integrations + customer service.", [["Buyer?", "Small EV charging operators."], ["Pricing?", "$10-30/charger/month."], ["What kills this?", "Tesla opening their network at scale."]]],
      ["climate-risk-modeling-apis", "Climate risk modeling APIs", "Flood / fire / heat risk APIs that mortgage lenders and insurers can integrate.", "team", "steady", "Repos with climate-model output adapters, address-resolution libraries, and probabilistic-risk score generators.", "Insurance + mortgage industry is being forced to price climate risk. Most lack the data.", ["Cervest / ClimateAi shape", "First Street Foundation", "Open-source climate risk libraries"], "A FEMA flood map from 2010.", "Capital + science-heavy. Fund only with climate-science co-founder. The moat is model accuracy + integration ecosystem.", [["Buyer?", "Insurers + mortgage lenders + commercial real estate."], ["Pricing?", "Per address or per portfolio."], ["Defensibility?", "Model accuracy + data freshness."]]],
      ["building-energy-retrofit-planners", "Building energy retrofit planners", "Software that helps owners model and execute deep energy retrofits.", "quarter", "trickle", "Repos with building-energy-model adapters, financing-incentive libraries, and contractor-marketplace integrations.", "IRA + state retrofit incentives are creating real demand. The decision-support layer is unbuilt.", ["BlocPower shape", "Sealed-style platforms", "Open-source building-energy libraries"], "A consultant + a 200-page audit + nothing happens.", "Long sales cycle. Fund with building-industry GTM. The wedge is one building type (multifamily, schools, hospitals).", [["Buyer?", "Building owners + property managers."], ["Pricing?", "Per building or per project."], ["Moat?", "Modeling accuracy + financing partnerships."]]],
      ["sustainable-supply-chain-trace", "Sustainable supply chain trace", "Trace ESG and supply chain provenance from origin to consumer.", "team", "steady", "Repos with supplier-data ingest, multi-tier graph traversal, and ESG-reporting frameworks.", "EU CSRD + US state laws on supply-chain due diligence are creating mandatory demand.", ["Sourcemap shape", "TrusTrace", "Open-source supply-chain trace libraries"], "A supplier questionnaire that arrives once a year.", "Heavy enterprise sale. Fund only with prior supply-chain or ESG GTM. The wedge is one industry (textiles, electronics, food).", [["Buyer?", "Sustainability + procurement teams at large brands."], ["Pricing?", "$50k-500k/year per buyer."], ["Defensibility?", "Supplier network + verification methodology."]]],
    ]),
  },
  {
    slug: "data-infrastructure",
    name: "Data Infrastructure",
    shortPitch: "Every workload eventually wants a custom data backend. The library + SaaS combo wins.",
    niches: makeNiches([
      ["vector-database-engines", "Vector database engines", "Vector search engines optimized for specific workloads — high-dimensional, hybrid, or local.", "team", "hot", "Repos with benchmarks against Pinecone / Weaviate / Qdrant, SDK adapters in TS + Python, and recall/latency tradeoff dashboards.", "RAG is now everywhere. The vector DB seat is being decided. Switching costs are forming fast.", ["Qdrant / Weaviate forks", "TurboPuffer-style serverless vector DBs", "pgvector + pgvectorscale combos"], "An overprovisioned Pinecone bill and 200ms p95.", "Hard to differentiate. The wedge is a specific workload (multi-tenant, low-latency, edge). Fund with prior search infra background only.", [["Buyer?", "AI app developers + ML platform teams."], ["Pricing?", "$100-10k/mo SaaS or self-hosted."], ["Moat?", "Performance + ecosystem + cost."]]],
      ["real-time-feature-stores", "Real-time feature stores", "Feature stores with sub-second freshness for online ML.", "team", "trickle", "Repos with streaming-ingest adapters (Kafka, Kinesis), point-in-time correctness libraries, and serving APIs with caching.", "Real-time fraud, personalization, and ranking all need real-time features. Most teams build it badly.", ["Tecton shape", "Hopsworks", "Feast + custom serving"], "A Lambda + DynamoDB + crossed fingers.", "Heavy build. Fund only with prior ML-platform team. The wedge is one industry (fintech, e-commerce, ads).", [["Buyer?", "ML platform teams at ML-heavy companies."], ["Pricing?", "$100k-1M+/year."], ["Defensibility?", "Performance + correctness + integrations."]]],
      ["postgres-extension-marketplaces", "Postgres extension marketplaces", "Postgres is now the AI database. The extension ecosystem is the next platform.", "team", "steady", "Repos with extension installers, multi-version Postgres support, and CI for extension testing.", "Postgres extensions (pgvector, pg_cron, pg_search) are exploding. The discovery + install layer is unbuilt.", ["Supabase + extensions", "Neon + branching", "Tembo-style Postgres marketplaces"], "A Stack Overflow answer from 2019.", "Strategic moat — the Postgres distro that ships the right extension bundle wins the AI workload.", [["Buyer?", "AI app developers + ML platform teams."], ["Pricing?", "Hosted DB markup + extension marketplace fees."], ["Moat?", "Extension catalog + Postgres relationship."]]],
      ["columnar-warehouse-alternatives", "Columnar warehouse alternatives", "Snowflake / BigQuery alternatives optimized for a specific shape — cheap, fast, or open.", "team", "trickle", "Repos with Iceberg / Delta Lake support, query-optimizer libraries, and S3-native compute.", "Snowflake credits are too expensive for the long tail. Open lakehouse standards lower the switching cost.", ["DuckDB / MotherDuck shape", "ClickHouse Cloud", "Tabular / Iceberg-native"], "A BigQuery bill that surprises every quarter.", "Heavy build. Fund only with prior database infra background. The wedge is a price-performance frontier.", [["Buyer?", "Data platform teams at $50M+ revenue companies."], ["Pricing?", "Per TB scanned or per warehouse."], ["Defensibility?", "Performance + cost + ecosystem."]]],
      ["change-data-capture-tools", "Change data capture tools", "CDC pipelines that don't require a Kafka cluster.", "quarter", "steady", "Repos with multi-database source adapters, exactly-once delivery libraries, and destination connectors.", "CDC is moving from Kafka-centric to lighter SaaS shape. Reverse-ETL category is hot.", ["Sequin shape", "Estuary / Materialize", "Debezium-as-a-service"], "A nightly batch job + 24-hour latency.", "Hard to differentiate from Airbyte / Fivetran. The wedge is real-time + lightweight + database-specific.", [["Buyer?", "Data engineering teams."], ["Pricing?", "Per event or per source."], ["Defensibility?", "Source-connector quality + reliability."]]],
      ["data-contract-platforms", "Data contract platforms", "Enforce data shape and quality at the producer, not the consumer.", "quarter", "steady", "Repos with schema-registry integration, CI checks for breaking changes, and producer SDKs in major languages.", "Data quality is broken because contracts aren't enforced. Producer-side enforcement is the unlock.", ["Gable.ai shape", "Soda / Monte Carlo extension", "Open-source data-contract libraries"], "A Slack channel where data engineers complain about producer breakage.", "Wedge with data platform teams. Fund teams shipping Kafka + dbt + Airflow integrations early.", [["Buyer?", "Data platform + data engineering teams."], ["Pricing?", "Per contract or per pipeline."], ["Moat?", "Integration footprint + community."]]],
      ["llm-cache-layers", "LLM cache layers", "Semantic caching for LLM calls — save cost, reduce latency, increase reliability.", "month", "hot", "Repos with semantic-similarity matching, multi-tier cache backends, and SDK adapters for the top providers.", "LLM API spend is now a top-5 line item at AI-native companies. Caching saves real money.", ["GPTCache shape", "Helicone caching layer", "Open-source semantic-cache libraries"], "A Redis cache + exact-string matching that misses everything.", "Wedge product. Pricing per cached call. The moat is cache-hit-rate accuracy.", [["Buyer?", "AI engineering teams."], ["Pricing?", "Per million cached calls or per dollar saved."], ["What kills this?", "OpenAI / Anthropic shipping semantic caching as a feature."]]],
      ["semantic-layers-2026", "Semantic layers (2026 reboot)", "BI semantic layers, redesigned for LLM-driven exploration.", "quarter", "steady", "Repos with dbt / Cube.dev compatibility, LLM-query interfaces, and BI-tool integrations.", "Every BI vendor is racing to ship AI. Most fail because they lack a semantic layer. The standalone product is real.", ["Cube.dev shape", "MetricFlow / Transform shape", "Open-source semantic layer libraries"], "A Looker LookML file that one person understands.", "Hard but durable. Fund only with prior BI or data-modeling background. The moat is the semantic-graph + the BI integrations.", [["Buyer?", "Data + analytics leaders at mid-market companies."], ["Pricing?", "$1-5k/mo per organization."], ["Defensibility?", "Semantic graph + LLM-query accuracy + ecosystem."]]],
      ["time-series-databases-for-ml", "Time-series databases for ML", "Time-series databases optimized for ML feature workloads, not just monitoring.", "team", "trickle", "Repos with Parquet / Arrow support, ML-aware aggregations, and Python / TS SDKs.", "ML workloads need time-series features differently than monitoring. The slot between Influx and Snowflake is open.", ["TimescaleDB shape", "QuestDB", "ClickHouse for time series"], "A Postgres table with a timestamp index + slow queries.", "Hard build. Fund only with prior database team. The wedge is a specific ML workload (financial, IoT, observability).", [["Buyer?", "ML platform teams."], ["Pricing?", "Hosted DB markup."], ["Moat?", "Performance + ML-specific features + ecosystem."]]],
      ["anti-entropy-sync-libraries", "Anti-entropy sync libraries", "Conflict-free data sync for offline-first apps and local-first software.", "quarter", "trickle", "Repos with CRDT implementations, multi-platform SDKs, and reactive query layers.", "Local-first apps are growing — Linear, Figma, and the new AI-native generation all need sync.", ["Yjs / Automerge", "Replicache", "ElectricSQL shape"], "A custom sync layer that breaks on edge cases.", "Niche but durable. Fund only with prior distributed-systems team. The wedge is a developer SDK that hides CRDT complexity.", [["Buyer?", "App developers building local-first products."], ["Pricing?", "Per-app SaaS or per-record."], ["Defensibility?", "Sync semantics + SDK ergonomics."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "ecommerce-infrastructure",
    name: "E-commerce Infrastructure",
    shortPitch: "Shopify is the platform. The leverage is on top: app store wins, AI-driven catalog, returns automation, post-purchase.",
    niches: makeNiches([
      ["shopify-app-replacements", "Shopify app replacements", "Specific Shopify-app categories where the incumbent is mediocre and AI-native rebuild wins.", "quarter", "hot", "Repos with Shopify CLI integrations, theme-aware UI components, and benchmark traffic data.", "Shopify App Store has 8,000+ apps. The top 100 by category are mostly 8+ years old, written before AI was a tool.", ["Modern reviews / loyalty / subscription apps", "AI-rebuild of upsell / cross-sell apps", "Replacement for legacy product-search apps"], "An app from 2017 with a 3.2-star rating.", "Pick a specific category. Rebuild AI-native. Lower price. Steal the wedge. The funding signal is reviews + install count growth in 90 days.", [["Buyer?", "Shopify merchants."], ["Pricing?", "$10-200/mo or rev share."], ["GTM?", "App store SEO + influencer reviews."]]],
      ["headless-cms-for-stores", "Headless CMS for stores", "CMS for headless e-commerce — Shopify Storefront API or BigCommerce GraphQL + content.", "quarter", "steady", "Repos with Shopify / BigCommerce adapters, image-management libraries, and SEO-friendly preview flows.", "Headless commerce is the future for $5M-50M brands. The content layer is unbuilt.", ["Sanity.io for commerce", "Hygraph e-commerce shape", "Open-source headless CMS"], "A Shopify theme.liquid + 4-day deploys for a copy change.", "Vertical wedge — headless commerce content specifically, not generic CMS. Fund teams shipping Shopify Storefront + Next.js + content workflows.", [["Buyer?", "DTC + scaling e-commerce teams."], ["Pricing?", "$200-2k/mo per brand."], ["Defensibility?", "Commerce-specific integrations + workflow."]]],
      ["ai-product-listing-generators", "AI product listing generators", "Generate product titles, descriptions, alt text, SEO copy from images + structured data.", "month", "frothy", "Repos with multimodal LLM adapters, brand-voice trainers, and channel-specific output formats.", "Marketplaces (Amazon, Etsy, Shopify) need optimized listings. AI can write better than the in-house team for $0.10/listing.", ["Copy.ai for commerce", "Anthropic-powered listing tools", "Open-source product-listing generators"], "A virtual assistant + a $5/listing copywriting budget.", "Hot category. Differentiate on brand voice + channel-specific output. Fund teams shipping multi-marketplace adapters in 90 days.", [["Buyer?", "DTC + Amazon sellers + Etsy artisans."], ["Pricing?", "Per listing or monthly seat."], ["What kills this?", "Shopify shipping native AI listing generation. Some competitors already paywalled."]]],
      ["returns-and-refund-automation", "Returns and refund automation", "AI-mediated returns, refunds, exchanges — the post-purchase workflow most stores ignore.", "quarter", "hot", "Repos with Shopify / e-commerce platform adapters, return-policy DSLs, and customer-message LLM tools.", "Returns are 15-30% of e-commerce orders. The unhandled-returns workflow is the leakiest bucket in DTC.", ["Loop Returns shape", "AfterShip Returns", "Open-source returns workflow libraries"], "A customer-service team manually approving each return.", "Hot. The wedge is the return-policy DSL + the e-commerce platform integrations + the fraud detection.", [["Buyer?", "DTC + mid-market e-commerce brands."], ["Pricing?", "Per return processed or monthly SaaS."], ["Moat?", "Integration footprint + policy DSL + fraud accuracy."]]],
      ["post-purchase-experience-saas", "Post-purchase experience SaaS", "Tracking, support, upsell — the post-purchase window that most brands waste.", "quarter", "steady", "Repos with carrier-tracking APIs, conversational support adapters, and upsell-recommendation libraries.", "Post-purchase email open rates are 4-8x marketing. Brands don't monetize the window.", ["Wonderment shape", "AfterShip", "Malomo-style post-purchase"], "An automated shipping email and nothing else.", "Vertical wedge. The moat is the carrier integration + the upsell algorithm. Fund teams with prior e-commerce GTM.", [["Buyer?", "DTC + mid-market e-commerce brands."], ["Pricing?", "$100-1k/mo per brand."], ["Defensibility?", "Carrier integration + upsell accuracy."]]],
      ["inventory-forecasting-llms", "Inventory forecasting LLMs", "Demand forecasting + reorder automation for SKU-heavy brands.", "quarter", "steady", "Repos with Shopify / Amazon / WooCommerce adapters, time-series ML libraries, and procurement integration flows.", "Inventory management is the second-biggest pain after marketing. AI-driven forecasting beats Excel sheets.", ["Inventory Planner shape", "Cogsy", "Open-source demand-forecasting libraries"], "An Excel sheet maintained by the founder.", "Vertical wedge. The moat is forecast accuracy + the platform integrations + the procurement workflow.", [["Buyer?", "DTC + multi-SKU e-commerce brands."], ["Pricing?", "$200-2k/mo based on SKU count."], ["Moat?", "Accuracy + platform integrations."]]],
      ["multi-channel-marketplace-uploaders", "Multi-channel marketplace uploaders", "Push catalog to Amazon, Etsy, eBay, Shopify, Walmart, TikTok Shop — keep them in sync.", "team", "steady", "Repos with marketplace-API adapters, attribute-mapping libraries, and order-routing workflows.", "Multi-channel selling is mandatory. The sync layer is brittle and expensive.", ["ChannelAdvisor shape", "Sellbrite", "CedCommerce extensions"], "A virtual assistant + 4 dashboards + monthly inventory drift.", "Heavy integration work. Fund teams shipping 5+ marketplaces in 90 days. The wedge is reliability + speed.", [["Buyer?", "DTC + multi-channel sellers."], ["Pricing?", "Per channel or monthly SaaS."], ["Defensibility?", "Integration footprint + sync accuracy."]]],
      ["dropshipping-quality-vetting", "Dropshipping quality vetting", "Vet dropship suppliers with photo / review / shipping-data analysis.", "month", "trickle", "Repos with AliExpress / Spocket / DSers adapters, photo-review libraries, and shipping-data scrapers.", "Dropshipping is a $200B+ market. Quality is the differentiator most sellers can't verify.", ["Spocket-shape vetting", "Niche.com supplier ratings", "Open-source dropship-quality tools"], "A YouTube tutorial + an AliExpress search.", "Niche, low-LTV but high-volume. Pricing $10-30/mo. Fund only if there's clear retention.", [["Buyer?", "Dropshippers + Shopify hobbyists."], ["Pricing?", "$10-30/mo."], ["What kills this?", "Shopify shipping native supplier vetting."]]],
      ["subscription-billing-edge-cases", "Subscription billing edge cases", "Pause, swap, gift, skip — the long tail of subscription billing that Shopify Subscriptions misses.", "month", "steady", "Repos with subscription state machines, Stripe / Recharge adapters, and customer-portal frameworks.", "Subscription growth is back. The edge cases (pause, swap, gift) drive retention and upsell.", ["Recharge shape", "Bold Subscriptions", "Open-source subscription frameworks"], "Recharge + 4 manual workflows + lost subscribers.", "Wedge product. The moat is the state-machine library + the customer-portal flows.", [["Buyer?", "Subscription DTC brands."], ["Pricing?", "$100-500/mo per brand."], ["Defensibility?", "State-machine flexibility + integrations."]]],
      ["in-store-clienteling-apps", "In-store clienteling apps", "Tablet + phone apps that turn in-store associates into commission earners.", "quarter", "trickle", "Repos with POS adapters (Shopify POS, Square, Lightspeed), customer-profile libraries, and SMS / messaging flows.", "Retail is bouncing. Brands want in-store associates to sell like online — with customer history + recommendations.", ["Tulip Retail shape", "Endear shape", "Open-source clienteling libraries"], "A Shopify POS + a paper notepad.", "Vertical wedge. The moat is the POS integration depth + the messaging compliance.", [["Buyer?", "Mid-market + enterprise retail brands."], ["Pricing?", "$50-200 per associate per month."], ["Moat?", "POS integration + workflow."]]],
    ]),
  },
  {
    slug: "edtech",
    name: "EdTech",
    shortPitch: "AI is the catalyst the sector waited a decade for. Personalization, assessment, and credentialing are all up for grabs.",
    niches: makeNiches([
      ["personalized-tutor-llms", "Personalized tutor LLMs", "1:1 LLM tutors specific to a subject and a grade level.", "quarter", "frothy", "Repos with curriculum-mapping libraries, conversation-design frameworks, and parent-dashboard integrations.", "Khan Academy + ChatGPT exposed the demand. The vertical wedge is open in dozens of subjects.", ["Khanmigo shape", "Synthesis Tutor", "Open-source educational LLM frameworks"], "A weekly tutor at $80/hour.", "Pick a subject + age band. Win on conversation quality + safety + parent visibility. Fund teams with prior education GTM.", [["Buyer?", "Parents + schools."], ["Pricing?", "$10-50/mo per student."], ["Compliance?", "COPPA + FERPA."]]],
      ["classroom-ai-policy-compliance-tools", "Classroom AI policy compliance tools", "Tools that help schools enforce AI-use policies — detect, allow, log, train.", "quarter", "hot", "Repos with LMS adapters (Canvas, Schoology, Google Classroom), policy DSLs, and detection-or-attribution models.", "Every district has an AI policy. None can enforce it. The compliance + workflow layer is wide open.", ["GPTZero shape", "Turnitin AI detection", "Open-source AI-policy enforcement"], "A blanket ban + AI detection that doesn't work.", "Wedge with school districts. The moat is the LMS integration + the policy DSL + the teacher workflow.", [["Buyer?", "K-12 + higher-ed compliance teams."], ["Pricing?", "Per student or per district."], ["Defensibility?", "Integration footprint + policy depth."]]],
      ["no-code-curriculum-builders", "No-code curriculum builders", "Drag-and-drop curriculum building for teachers + tutors + creators.", "quarter", "steady", "Repos with content-block libraries, AI-generated activity tools, and student-progress dashboards.", "Curriculum building is hours of teacher time. AI + no-code accelerates it.", ["TeacherMade shape", "Newsela for content", "Open-source curriculum-builder libraries"], "A Google Doc with 50 hyperlinks.", "Two-sided market: teachers + curriculum publishers. Fund teams shipping integration with the top 5 LMSes.", [["Buyer?", "Teachers + curriculum publishers."], ["Pricing?", "$10-50/mo per teacher."], ["Moat?", "Content library + integrations."]]],
      ["video-comprehension-assessment", "Video comprehension assessment", "AI-generated questions and assessments from instructional video.", "month", "steady", "Repos with video-transcription libraries, question-generation models, and LMS integration adapters.", "Online courses are passive. Assessment-in-video drives retention + outcomes.", ["Edpuzzle shape", "PlayPosit", "Open-source video-quiz libraries"], "A passive YouTube playlist with no checkpoints.", "Wedge with online educators + creators. The moat is question quality + LMS integrations.", [["Buyer?", "Course creators + schools."], ["Pricing?", "$10-50/mo per teacher / creator."], ["Defensibility?", "Question quality + integrations."]]],
      ["language-learning-with-voice-clone", "Language learning with voice clone", "Practice conversations with AI-voiced native speakers across accents and registers.", "quarter", "hot", "Repos with TTS provider adapters, conversation-scenario libraries, and pronunciation-feedback models.", "Duolingo Max showed the model. Voice + AI conversations are the lever that beats flashcards.", ["Duolingo Max shape", "Speak.com / Praktika", "Open-source language-practice libraries"], "Duolingo + a YouTube playlist.", "Vertical wedge by language. The moat is voice quality + conversation library + pedagogy.", [["Buyer?", "Language learners directly."], ["Pricing?", "$10-30/mo subscription."], ["What kills this?", "Duolingo expanding Max to all subjects."]]],
      ["k12-iep-automation", "K-12 IEP automation", "IEP drafting + compliance + parent communication for special education.", "quarter", "trickle", "Repos with IDEA-compliance libraries, document-generation tools, and SIS integration adapters.", "IEPs are heavily regulated, paperwork-heavy. AI can draft + tracking automates compliance.", ["SETWorks shape", "PowerSchool Special Programs", "Open-source IEP-management libraries"], "A 40-page Word doc + a yearly meeting + lawsuit risk.", "Niche but durable. The buyer is the school district special-ed director. Fund only with prior K-12 GTM.", [["Buyer?", "School district special-ed leaders."], ["Pricing?", "Per student per year."], ["Compliance?", "IDEA + FERPA + state IEP rules."]]],
      ["university-syllabus-search-engines", "University syllabus search engines", "Search across millions of university syllabi for content, readings, prerequisites.", "month", "trickle", "Repos with syllabus-extraction libraries, citation-graph builders, and faculty-attribution data.", "Faculty + researchers + students need syllabus discovery. The data exists but is unstructured.", ["Open Syllabus Project shape", "Sci-Hub for syllabi", "Course catalog APIs"], "Google + 'syllabus.pdf' + manual extraction.", "Open data wedge. The moat is data depth + structured extraction + API + use-cases.", [["Buyer?", "Faculty + researchers + course publishers."], ["Pricing?", "API + premium subscription."], ["Moat?", "Data freshness + structure."]]],
      ["peer-grading-platforms", "Peer grading platforms", "Calibrated peer grading for large classes, with AI moderation.", "quarter", "trickle", "Repos with rubric-management libraries, peer-assignment algorithms, and grade-aggregation tools.", "Large online courses can't grade open-ended work. Peer grading + AI moderation scales.", ["Gradescope shape", "PeerWise", "Open-source peer-grading libraries"], "A 600-student class + 3 TAs + spotty grading.", "Niche but durable. The wedge is one assessment type (essays, code, math). The moat is rubric library + LMS integrations.", [["Buyer?", "University course staff + MOOC platforms."], ["Pricing?", "Per student per term."], ["Defensibility?", "Rubric library + integrations."]]],
      ["ai-flashcard-generators", "AI flashcard generators", "Generate flashcards from PDFs, lecture videos, notes — Anki-compatible.", "month", "hot", "Repos with PDF / video extraction libraries, spaced-repetition algorithms, and Anki export adapters.", "Flashcards are the highest-retention study tool. Creating them by hand is the bottleneck.", ["Quizlet AI shape", "RemNote", "Open-source Anki integrations"], "A blank Anki deck + 4 hours of typing.", "Self-serve consumer category. Pricing $5-20/mo. The moat is extraction accuracy + spaced-repetition algorithm.", [["Buyer?", "Students directly."], ["Pricing?", "$5-20/mo subscription."], ["What kills this?", "Quizlet shipping the full feature for free."]]],
      ["vocational-credentialing-rails", "Vocational credentialing rails", "Issue + verify vocational credentials — welding, HVAC, nursing assistants.", "team", "trickle", "Repos with credential-issuance libraries, verifier APIs, and integrations with state licensing boards.", "Vocational training is bigger than 4-year college. Credentialing is the gap that holds the market back.", ["Credly shape", "Open Badges-based platforms", "Open-source credentialing libraries"], "A PDF certificate + a phone call to verify.", "Long sales cycle. Fund only with industry-specific GTM. The wedge is one industry done well.", [["Buyer?", "Trade schools + employers + state licensing boards."], ["Pricing?", "Per credential issued or per verification."], ["Compliance?", "Per-state vocational licensing rules."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "enterprise-saas",
    name: "Enterprise SaaS",
    shortPitch: "AI is the wedge into the seat. Pick a workflow, replace the manual labor, win the budget.",
    niches: makeNiches([
      ["workflow-automation-for-revops", "Workflow automation for revops", "Lead routing, account scoring, opportunity hygiene — AI-native revops automation.", "quarter", "frothy", "Repos with Salesforce / HubSpot adapters, AI-classification libraries, and workflow DSLs.", "Revops budgets are growing. AI can finally do data-quality work humans hate.", ["Clay-style growth automation", "Default-rev shape", "Open-source revops libraries"], "A Salesforce admin + 47 workflow rules + drift.", "Hot. The wedge is the data-enrichment pipeline + the CRM integration depth. Fund teams shipping 50+ data sources.", [["Buyer?", "Revops leaders at $10M+ revenue."], ["Pricing?", "$1-10k/mo per team."], ["Moat?", "Data sources + integration depth."]]],
      ["b2b-pricing-experimentation", "B2B pricing experimentation", "Test price + packaging changes at the customer or segment level, with attribution.", "quarter", "trickle", "Repos with billing-system adapters (Stripe / Recurly / Chargebee), experiment-tracking libraries, and analytics frameworks.", "B2B pricing is a top-3 lever for growth. Most companies guess.", ["Metronome / Orb adjacency", "Stigg shape", "Open-source pricing-experiment libraries"], "A monthly pricing meeting + a guess.", "Niche but high-value. Fund only with prior pricing or billing background. The wedge is the billing-system integration + the experiment library.", [["Buyer?", "Finance + product leaders at scaling B2B."], ["Pricing?", "$2-20k/mo per company."], ["Defensibility?", "Integration depth + statistical methodology."]]],
      ["internal-llm-copilots-by-role", "Internal LLM copilots by role", "Role-specific copilots (sales, support, ops) that know company data and respect access controls.", "quarter", "hot", "Repos with multi-data-source adapters, role-based access libraries, and audit-log frameworks.", "Every enterprise wants an internal AI. Most fail because of access + security + workflow.", ["Glean shape", "Microsoft Copilot adjacency", "Open-source enterprise RAG"], "A locked-down ChatGPT Enterprise instance.", "Heavy enterprise sale. Fund only with enterprise GTM. The wedge is the data-source integration depth + the access-control story.", [["Buyer?", "CIO + CISO + CTO."], ["Pricing?", "Per seat or per query."], ["Defensibility?", "Integration depth + access controls + audit."]]],
      ["agent-permissioning-for-saas", "Agent permissioning for SaaS", "OAuth + scope management when the user is an agent, not a human.", "quarter", "hot", "Repos with OAuth provider libraries, MCP-aware scope managers, and audit-log frameworks.", "Every SaaS app is going to need agent OAuth. The platform layer is unbuilt.", ["Pomerium / Cerbos adjacency", "Stytch agent flows", "Open-source MCP auth libraries"], "An API key in a config file with all-access scope.", "New category. Real demand at AI-mature enterprises. The moat is the policy DSL + the integration footprint.", [["Buyer?", "Platform + security teams."], ["Pricing?", "Per agent or per integration."], ["Defensibility?", "Policy depth + integration ecosystem."]]],
      ["vendor-spend-intelligence", "Vendor spend intelligence", "AI that catches SaaS overspend, duplicate vendors, unused seats, and renewal traps.", "quarter", "steady", "Repos with SSO / SaaS-management API adapters, spend-analysis libraries, and procurement-workflow tools.", "SaaS sprawl is a CFO top-5 line item. AI surfaces savings that finance teams miss.", ["Vendr shape", "Spendflo / Cledara", "Open-source SaaS-spend libraries"], "An Excel sheet + a Workday report.", "Wedge with mid-market finance. The moat is the SaaS integration footprint + the negotiation playbook.", [["Buyer?", "Finance + procurement leaders."], ["Pricing?", "% of savings or flat SaaS fee."], ["Defensibility?", "Integration breadth + negotiation data."]]],
      ["contract-redlining-llms", "Contract redlining LLMs", "AI redlining of contracts against playbook + benchmark + party-specific positions.", "quarter", "hot", "Repos with contract-parsing libraries, playbook DSLs, and review-workflow frameworks.", "Contract redlining is hours of associate time. AI can do 80% of it.", ["Ironclad AI shape", "LinkSquares / Spellbook", "Open-source contract-LLM libraries"], "A junior associate + a track-changes Word doc.", "Hot. The moat is the playbook library + the integration with contract-management systems. Fund teams with prior legal-tech GTM.", [["Buyer?", "GC + legal ops."], ["Pricing?", "Per contract or per seat."], ["Defensibility?", "Playbook library + integrations."]]],
      ["sales-engineering-copilots", "Sales engineering copilots", "Demo / RFP / technical-Q&A automation for sales engineers.", "quarter", "hot", "Repos with knowledge-base ingestion, demo-script generators, and Slack / chat-channel integrations.", "Sales engineers are 25% of go-to-market spend. AI augments the most repetitive parts.", ["Vivun / Aligned shape", "Wokelo-style competitive intel", "Open-source sales-engineering libraries"], "An SE digging through 50 Slack channels and a Notion doc.", "Hot. The wedge is the knowledge-base integration + the workflow integration with sales tools.", [["Buyer?", "Sales leaders + RevOps."], ["Pricing?", "Per SE seat."], ["Moat?", "Knowledge-base depth + integration with sales tools."]]],
      ["csm-ai-handoff-tools", "CSM AI handoff tools", "AI that turns sales-to-CS handoffs into structured briefings, not lost context.", "month", "steady", "Repos with CRM integration adapters, conversation-summarization libraries, and CS-workflow frameworks.", "Onboarding leakage costs every B2B company real revenue. AI structures the handoff.", ["Catalyst / Vitally shape", "Pylon for CS automation", "Open-source CS-handoff libraries"], "A handoff Slack message + a missed onboarding step.", "Wedge with CS leaders. The moat is the integration with CRM + CS platforms + conversation tools.", [["Buyer?", "CS leaders at scaling B2B."], ["Pricing?", "Per CSM seat."], ["Defensibility?", "Integration depth + workflow."]]],
      ["post-mortem-automation", "Post-mortem automation", "Generate incident post-mortems from PagerDuty + Slack + GitHub + observability data.", "month", "trickle", "Repos with incident-data adapters, timeline-reconstruction libraries, and post-mortem template frameworks.", "Post-mortems are skipped because writing them is painful. AI drafts the first 80%.", ["Rootly shape", "Incident.io adjacency", "Open-source incident-postmortem tools"], "An incident channel that gets forgotten by Monday.", "Wedge with engineering ops. The moat is the data-source integration + the workflow.", [["Buyer?", "Engineering ops + SRE leaders."], ["Pricing?", "Per organization or per incident."], ["Defensibility?", "Integration breadth + template quality."]]],
      ["runbook-from-doc-generators", "Runbook from doc generators", "Generate executable runbooks from existing docs + Slack messages + incident history.", "month", "trickle", "Repos with documentation-ingest libraries, step-extraction models, and runbook-execution frameworks.", "Runbooks are written once and never updated. AI keeps them living.", ["Rootly / Incident.io adjacency", "Cortex / OpsLevel runbook shape", "Open-source runbook libraries"], "A Confluence page from 2020 that the on-call doesn't trust.", "Niche but durable. The wedge is the doc-ingest accuracy + the runbook-execution integrations.", [["Buyer?", "SRE + platform engineering teams."], ["Pricing?", "Per service or per organization."], ["Moat?", "Doc-ingest accuracy + executability."]]],
    ]),
  },
  {
    slug: "gaming",
    name: "Gaming",
    shortPitch: "Indie + AI-asset wave is breaking. The infrastructure under the hood is where money flows quietly.",
    niches: makeNiches([
      ["ai-npc-dialogue-engines", "AI NPC dialogue engines", "LLM-driven NPCs that don't break immersion or break the bank.", "quarter", "hot", "Repos with multi-model adapters, latency-optimized inference, and game-engine integrations (Unity / Unreal).", "Inworld + Convai opened the slot. AI-NPCs are coming to mainstream games.", ["Inworld AI shape", "Convai", "Open-source dialogue-LLM frameworks"], "A scripted dialogue tree from 2005.", "Vertical wedge for game studios. The moat is engine integration + latency + character-fine-tuning.", [["Buyer?", "Game studios."], ["Pricing?", "Per session or per character."], ["What kills this?", "Unity / Unreal shipping native AI-NPC systems."]]],
      ["in-game-ad-marketplaces", "In-game ad marketplaces", "Programmatic in-game ad placement, with brand safety and engagement metrics.", "team", "trickle", "Repos with game-engine SDK adapters, ad-server frameworks, and brand-safety filtering.", "In-game ads grew from $5B to $14B in 4 years. The marketplace layer is consolidating.", ["Anzu / Frameplay shape", "Bidstack adjacency", "Open-source in-game ad SDKs"], "A static banner ad in the game lobby.", "Capital-intensive marketplace. Fund only with adtech background. The moat is brand-safety + engine integrations.", [["Buyer?", "Game studios + brands + agencies."], ["Pricing?", "% of ad spend."], ["Defensibility?", "Brand-safety + measurement + integrations."]]],
      ["indie-publishing-rails", "Indie publishing rails", "Publishing infrastructure for indie games — Steam, Itch, mobile stores, console certs.", "quarter", "steady", "Repos with store-API adapters, build-pipeline libraries, and analytics frameworks.", "Indie game volume is up. Publishing infrastructure for solo + small studios is unbuilt.", ["Itch.io tooling shape", "Buildbot for games", "Open-source indie-publishing libraries"], "A solo dev + 4 store dashboards + manual builds.", "Niche. Fund only with games industry background. The wedge is automation across the top 5 storefronts.", [["Buyer?", "Indie studios + 1-5 person teams."], ["Pricing?", "$50-500/mo per studio."], ["Moat?", "Storefront integration breadth."]]],
      ["multiplayer-netcode-libraries", "Multiplayer netcode libraries", "Drop-in netcode for indie multiplayer games. Latency-tuned, cheat-resistant.", "team", "trickle", "Repos with WebRTC / UDP transport implementations, lag-compensation algorithms, and game-engine adapters.", "Multiplayer is desired but technically hard. Most indies skip it. The library wedge is real.", ["Photon shape", "Hathora for game servers", "Open-source netcode libraries"], "A custom Node.js server that breaks under load.", "Hard build. Fund only with prior multiplayer engineering. The moat is performance + integrations.", [["Buyer?", "Indie + mid-size game studios."], ["Pricing?", "Per concurrent user or hosted-server SaaS."], ["Defensibility?", "Performance + reliability + integrations."]]],
      ["modder-creator-economies", "Modder creator economies", "Mod marketplaces + creator monetization for modder communities.", "quarter", "trickle", "Repos with mod-API integrations, payment libraries, and community-management tools.", "Modders are the lifeblood of games. Monetization is mostly absent or fragmented.", ["mod.io shape", "Steam Workshop monetization", "Open-source mod marketplace libraries"], "A NexusMods donation button.", "Two-sided market. Hard CAC. Fund only with games-industry GTM. The moat is the developer + modder + game ecosystem.", [["Buyer?", "Game studios + modder communities."], ["Pricing?", "% of mod revenue."], ["Moat?", "Two-sided liquidity."]]],
      ["ai-asset-generators-for-indies", "AI asset generators for indies", "Sprite, music, voiceover, level-design generation tools for indie game devs.", "quarter", "frothy", "Repos with asset-generation models, game-engine adapters, and asset-management frameworks.", "Indie devs spend more on art than code. AI assets are the cost reducer.", ["Scenario.gg shape", "Layer AI for sprites", "Open-source AI asset libraries"], "A $5k/month outsourced artist or low-quality stock assets.", "Hot. The wedge is genre-specific (pixel art, isometric, voxel). Fund teams shipping engine integrations early.", [["Buyer?", "Indie devs + solo creators."], ["Pricing?", "$10-100/mo subscription."], ["What kills this?", "Major engines (Unity, Unreal) shipping native AI asset tools."]]],
      ["esports-tournament-saas", "Esports tournament SaaS", "Tournament organization + bracketing + streaming integration for amateur + community esports.", "quarter", "trickle", "Repos with bracket-management libraries, streaming-platform adapters, and prize-pool / payout integrations.", "Amateur esports is bigger than pro. The tooling is fragmented and aging.", ["Battlefy shape", "Toornament / smash.gg", "Open-source bracket libraries"], "A challonge.com bracket + a Discord channel.", "Niche. Fund only with games-industry GTM. The wedge is one game (Valorant, Smash, Counter-Strike) done well.", [["Buyer?", "Amateur + collegiate esports organizers."], ["Pricing?", "Per tournament or SaaS."], ["Moat?", "Game-integration + payment + audience."]]],
      ["live-ops-analytics-platforms", "Live ops analytics platforms", "Real-time analytics + experimentation for live-service games.", "team", "steady", "Repos with game-engine SDK adapters, experiment frameworks, and ML-powered recommendation libraries.", "Live-service games (Roblox, Fortnite, Genshin) require continuous tuning. Most studios use legacy analytics.", ["GameAnalytics shape", "Unity Live Ops", "Open-source live-ops libraries"], "A custom dashboard + a data engineer.", "Capital-heavy. Fund only with games-industry + analytics-tools background. The moat is real-time + experiment + recommendation.", [["Buyer?", "Live-service game studios."], ["Pricing?", "Per MAU or per studio."], ["Defensibility?", "Performance + ML + integrations."]]],
      ["kids-game-safety-filters", "Kids game safety filters", "Chat + content moderation + voice safety in games where kids play.", "quarter", "hot", "Repos with chat-moderation models, voice-content-analysis libraries, and parental-control APIs.", "COPPA / GDPR-K + parent demand for safety is creating real budgets at studios.", ["Modulate / GGWP shape", "Spectrum Labs", "Open-source moderation libraries"], "A manual report-button + reactive human moderation.", "Hot. The wedge is real-time + multi-language + voice + chat. Fund teams shipping game-engine integrations.", [["Buyer?", "Game studios with under-13 audiences."], ["Pricing?", "Per MAU."], ["Compliance?", "COPPA + GDPR-K."]]],
      ["web3-game-asset-bridges", "Web3 game asset bridges", "Move game assets across chains, games, and identity systems.", "team", "trickle", "Repos with EVM / Solana / Bitcoin-L2 adapters, asset-bridging libraries, and identity-bound NFT frameworks.", "Web3 games are slowly normalizing. The asset-portability infrastructure is the next platform.", ["Sequence shape", "Immutable X", "Open-source asset-bridge libraries"], "An NFT trapped in one chain.", "Speculative. Fund only with crypto-native background. The wedge is identity + cross-chain.", [["Buyer?", "Web3 game studios."], ["Pricing?", "Per transaction or per studio."], ["Defensibility?", "Cross-chain integration + identity."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "agtech",
    name: "AgTech",
    shortPitch: "Hard to sell to. Long sales cycles. But the AI + sensor + climate convergence is real for the first time in 20 years.",
    niches: makeNiches([
      ["precision-spraying-software", "Precision spraying software", "Vision + ML on tractor cameras to spray only where needed.", "team", "trickle", "Repos with vision models, tractor-CAN integrations, and field-data libraries.", "Glyphosate cost + regulatory pressure = real ROI for precision spraying.", ["See & Spray (Blue River / Deere)", "Carbon Robotics shape", "Open-source precision-ag libraries"], "Broadcast spraying + a 30% chemical waste rate.", "Capital-heavy. Fund only with ag-industry team. The moat is vision-model accuracy + tractor integration.", [["Buyer?", "Mid-large row-crop farmers."], ["Pricing?", "Per acre or hardware bundle."], ["Defensibility?", "Vision accuracy + integration."]]],
      ["livestock-vision-monitoring", "Livestock vision monitoring", "Camera-based monitoring of livestock health, behavior, feed efficiency.", "team", "steady", "Repos with vision-tracking libraries, behavior-classification models, and ranch-management integrations.", "Labor shortages + welfare regulations + economics = vision monitoring is finally viable.", ["Connecterra / Cainthus shape", "BinSentry for feed", "Open-source livestock-vision libraries"], "A daily walk-around + missed sick animals.", "Capital-heavy. Fund only with ag + vision background. The moat is data + integrations.", [["Buyer?", "Mid-large dairy + beef + poultry operations."], ["Pricing?", "Per animal or per facility."], ["Moat?", "Vision accuracy + on-farm integrations."]]],
      ["soil-microbiome-analytics", "Soil microbiome analytics", "Soil microbiome testing + recommendations for regenerative ag practices.", "team", "trickle", "Repos with lab-data adapters, microbiome-analysis libraries, and recommendation engines.", "Regenerative ag premium + lower input costs = real demand for soil-health insight.", ["Trace Genomics shape", "Pattern Ag", "Open-source soil-microbiome libraries"], "An annual soil test that measures NPK only.", "Capital + science-heavy. Fund only with microbiology background. The moat is the data + the recommendation accuracy.", [["Buyer?", "Mid-large farmers + ag consultants."], ["Pricing?", "Per sample or per acre."], ["Defensibility?", "Data + science depth."]]],
      ["farm-financial-management", "Farm financial management", "QuickBooks + cash-flow planning specifically for farms — seasonal, debt-heavy, complex tax.", "quarter", "trickle", "Repos with farm-accounting libraries, cash-flow modeling tools, and ag-lender adapters.", "Farmers carry heavy debt. Margin pressure makes financial management essential.", ["FBN shape", "Granular finance", "Open-source farm-finance libraries"], "QuickBooks + 4 spreadsheets + a stressed-out spouse.", "Niche. Fund only with farming background. The wedge is the ag-lender integration + the tax-specific features.", [["Buyer?", "Mid-large farmers."], ["Pricing?", "$50-500/mo per operation."], ["Moat?", "Lender + tax integrations."]]],
      ["satellite-yield-prediction", "Satellite yield prediction", "Yield prediction from satellite + weather + soil for insurance, finance, supply chain.", "team", "trickle", "Repos with satellite-image adapters, ML yield models, and supply-chain integrations.", "Climate volatility + insurance + supply-chain need accurate yield prediction.", ["Indigo Ag / Climate Corp adjacency", "Descartes Labs", "Open-source yield-prediction libraries"], "An insurance adjuster's eyeball estimate.", "Capital + data-heavy. Fund only with remote-sensing or ag-finance background. The moat is model accuracy + data depth.", [["Buyer?", "Crop insurers + ag-finance lenders + commodity traders."], ["Pricing?", "Per acre or per portfolio."], ["Defensibility?", "Accuracy + data."]]],
      ["agri-fintech-rails", "Agri-fintech rails", "Lending + crop insurance + commodity hedging APIs for farmers.", "team", "steady", "Repos with ag-lender APIs, crop-insurance libraries, and futures-market integrations.", "Smallholder farmers are underserved by traditional finance. AI underwriting + APIs unlock the market.", ["Pula / Aerial-style ag fintech", "Apollo Agriculture", "Open-source agri-fintech libraries"], "A bank visit + a paper application.", "Capital + regulatory burden. Fund only with ag-finance team. The moat is the underwriting model + the data + the partnerships.", [["Buyer?", "Ag-finance lenders + insurers."], ["Pricing?", "Per loan or transaction."], ["Compliance?", "Regional ag-finance regulation."]]],
      ["vertical-farm-control-systems", "Vertical farm control systems", "Software that runs vertical farms — lighting, water, climate, harvest.", "team", "trickle", "Repos with PLC adapters, climate-model libraries, and harvest-scheduling frameworks.", "Vertical farming bankruptcies hurt the category but proved the tech. Software-led operations are the future.", ["Iron Ox shape", "BrightFarms tooling", "Open-source vertical-farm control"], "A custom-built PLC + an engineer who quits.", "Niche, capital-heavy. Fund only with prior vertical-farm operations. The moat is operational data + integrations.", [["Buyer?", "Vertical farm operators."], ["Pricing?", "Per facility or per crop."], ["Moat?", "Operational data."]]],
      ["food-traceability-blockchain", "Food traceability blockchain", "Farm-to-fork traceability with blockchain (or just immutable data).", "team", "trickle", "Repos with supply-chain-data ingest libraries, immutable-data backends, and consumer-facing QR experiences.", "FDA Food Safety Modernization + EU CSRD + consumer demand = real budgets.", ["IBM Food Trust shape", "Provenance.org", "Open-source food-trace libraries"], "A paper trail + manual recall.", "Long sales cycle. Fund only with food-industry GTM. The wedge is one industry (seafood, leafy greens, beef).", [["Buyer?", "Large food brands + retailers."], ["Pricing?", "Per SKU or per shipment."], ["Compliance?", "FSMA + EU CSRD + state laws."]]],
      ["crop-disease-detection-llm", "Crop disease detection LLM", "Snap a photo, identify the disease, get a treatment recommendation.", "month", "steady", "Repos with crop-image-classification models, treatment-recommendation libraries, and farm-app integrations.", "Smartphones are universal. Crop disease ID + treatment recs at the edge is real.", ["Plantix shape", "Pinpoint / Climate FieldView adjacency", "Open-source crop-disease libraries"], "A walk to the extension agent's office.", "Vertical wedge. Fund only with ag + ML team. The moat is the disease library + the treatment-recommendation accuracy.", [["Buyer?", "Mid-large farmers + cooperatives."], ["Pricing?", "Per farm or per acre."], ["Moat?", "Image + treatment library."]]],
      ["irrigation-optimization-edge-devices", "Irrigation optimization edge devices", "Smart irrigation — soil + weather + crop-stage data to optimize watering.", "team", "trickle", "Repos with sensor-network libraries, ML irrigation models, and pump-control integrations.", "Water scarcity + cost = real ROI for irrigation optimization, especially in arid regions.", ["CropX / Tule shape", "Lindsay / Valmont adjacency", "Open-source irrigation libraries"], "A timer-based irrigation schedule + a 30% water waste rate.", "Capital + hardware-heavy. Fund only with prior ag-hardware team. The moat is the sensor + ML + pump integration.", [["Buyer?", "Mid-large farms in arid regions."], ["Pricing?", "Per acre or hardware-bundle."], ["Defensibility?", "Hardware + ML + service."]]],
    ]),
  },
  {
    slug: "hr-tech",
    name: "HR Tech",
    shortPitch: "AI is rewriting recruiting, performance, and learning. Most incumbents are slow. The wedges are real.",
    niches: makeNiches([
      ["ai-recruiting-shortlist-tools", "AI recruiting shortlist tools", "Automatic candidate shortlist from job descriptions + LinkedIn + GitHub + personal sites.", "quarter", "frothy", "Repos with candidate-source adapters, scoring libraries, and ATS integrations.", "Recruiters are drowning in unqualified inbound. AI-shortlist is the unlock.", ["Gem / Beamery shape", "HireEZ", "Open-source recruiting-LLM libraries"], "A LinkedIn Recruiter dashboard + a sourcer who quits.", "Hot. The wedge is the candidate-source breadth + the scoring accuracy + the ATS integrations.", [["Buyer?", "Recruiting leaders at $50M+ revenue."], ["Pricing?", "Per recruiter seat."], ["Defensibility?", "Source breadth + ATS integration."]]],
      ["employee-onboarding-automation", "Employee onboarding automation", "First-30-days automation: paperwork, intros, training, equipment, software access.", "quarter", "steady", "Repos with HRIS / SSO / IT-system adapters, workflow libraries, and Slack / Teams integrations.", "Onboarding is expensive (~$4k+/employee) and ineffective. AI-driven workflows fix the basics.", ["Lever Hire / BambooHR Onboarding", "Sapling shape", "Open-source onboarding-workflow libraries"], "A welcome PDF + a 'we'll figure it out' Slack message.", "Wedge for mid-market HR. The moat is the HRIS + IT integration depth + the workflow library.", [["Buyer?", "HR + IT leaders at $20-500M revenue."], ["Pricing?", "Per employee onboarded."], ["Defensibility?", "Integration breadth + workflow library."]]],
      ["performance-review-llms", "Performance review LLMs", "AI-drafted reviews, feedback summarization, calibration sessions.", "month", "hot", "Repos with HRIS adapters, draft-from-data libraries, and calibration-session frameworks.", "Performance reviews are universally hated. AI drafts the first 70%.", ["Lattice + AI shape", "15Five / Culture Amp adjacency", "Open-source performance-review libraries"], "A 4-hour blocked calendar + a blank Lattice template.", "Wedge for mid-market HR. The moat is the HRIS integration + the manager-workflow integration.", [["Buyer?", "HR + people-ops leaders."], ["Pricing?", "Per employee per year."], ["Moat?", "Integration + manager-workflow."]]],
      ["payroll-for-distributed-teams", "Payroll for distributed teams", "Multi-country payroll + benefits + tax compliance for remote-first teams.", "team", "steady", "Repos with country-specific tax libraries, multi-currency payment adapters, and benefits-administration tools.", "Remote-first is permanent. Multi-country payroll is the bottleneck most companies hate.", ["Deel shape", "Remote.com / Velocity Global", "Open-source payroll libraries"], "A 5-EOR Frankenstein + missed tax deadlines.", "Capital + regulatory burden. Fund only with payroll-industry background. The moat is country coverage + tax compliance.", [["Buyer?", "Remote-first companies $5M+ revenue."], ["Pricing?", "Per employee per month."], ["Compliance?", "Local payroll + tax in 30+ jurisdictions."]]],
      ["equity-administration-saas", "Equity administration SaaS", "Cap-table + option-grants + 409A + secondary management.", "quarter", "trickle", "Repos with cap-table libraries, ASC 718 expense calculators, and secondary-market integrations.", "Carta lost trust in 2024. The wedge is open for mid-market replacement.", ["Carta / Pulley shape", "AngelList Equity", "Open-source cap-table libraries"], "A spreadsheet + missed 409A renewal.", "Hard regulatory. Fund only with prior cap-table or fintech team. The moat is the 409A relationship + the integrations.", [["Buyer?", "CFO + Founder + CEO at $5-500M revenue."], ["Pricing?", "Per stakeholder per month."], ["Compliance?", "ASC 718 + 409A + SEC."]]],
      ["internal-mobility-marketplaces", "Internal mobility marketplaces", "Match employees to internal projects + roles based on skills, interest, growth path.", "quarter", "trickle", "Repos with HRIS adapters, skills-graph libraries, and project-management integrations.", "Retention is cheaper than hiring. Internal mobility programs need software.", ["Gloat / Eightfold internal mobility", "Mercury Mobility shape", "Open-source skills-graph libraries"], "An annual goal-setting meeting + a LinkedIn search.", "Niche but durable. Fund only with prior HR-tech GTM. The moat is the skills-graph + the HRIS integration + the workflow.", [["Buyer?", "Large enterprise HR leaders."], ["Pricing?", "Per employee per year."], ["Defensibility?", "Skills-graph depth + integrations."]]],
      ["contractor-compliance-rails", "Contractor compliance rails", "1099 / contractor classification + tax + global compliance APIs.", "quarter", "steady", "Repos with worker-classification libraries, country-tax-rule libraries, and payment-rail adapters.", "Contractor misclassification is a $10B+ regulatory risk. APIs that handle it correctly are real businesses.", ["Deel Contractor shape", "Worksuite", "Open-source contractor-compliance libraries"], "A risky misclassification + a lawsuit.", "Hard regulatory. Fund only with payroll / labor-law background. The moat is the classification accuracy + the country coverage.", [["Buyer?", "Companies hiring 50+ contractors."], ["Pricing?", "Per contractor per month."], ["Compliance?", "Per-country labor law."]]],
      ["learning-and-development-llms", "Learning and development LLMs", "Personalized learning paths + AI-generated training content for L&D programs.", "quarter", "steady", "Repos with LMS adapters, content-generation libraries, and skills-assessment frameworks.", "L&D budgets are growing. AI-personalized content + assessment beats one-size-fits-all training.", ["Docebo + AI shape", "Sana Labs", "Open-source L&D libraries"], "A SCORM course from 2018 + low completion rates.", "Wedge with L&D leaders. The moat is the content-generation accuracy + the LMS integration + the skills assessment.", [["Buyer?", "L&D leaders at large enterprises."], ["Pricing?", "Per learner per year."], ["Defensibility?", "Content + integration + assessment."]]],
      ["hr-chatbot-replacements", "HR chatbot replacements", "AI HR assistant that handles HR questions, requests, policy lookups.", "month", "hot", "Repos with HRIS + benefits-system adapters, role-based access libraries, and Slack / Teams integrations.", "HR teams are drowning in tickets. AI agent handles 70% of FAQ + workflow.", ["Leena AI shape", "ServiceNow HR Service Delivery", "Open-source HR-chatbot libraries"], "An HRBP answering the same question 30 times a week.", "Wedge with HR ops. The moat is the HRIS integration + the role-based access + the policy library.", [["Buyer?", "HR ops + IT at large enterprises."], ["Pricing?", "Per employee per year."], ["Defensibility?", "Integration depth + policy library."]]],
      ["dei-analytics-tools", "DEI analytics tools", "DEI metrics + benchmarking + workflow for HR + ESG reporting.", "quarter", "trickle", "Repos with HRIS adapters, anonymization libraries, and ESG-reporting frameworks.", "EU CSRD + US state reporting + investor pressure = mandatory DEI metrics.", ["Affirmity shape", "Syndio", "Open-source DEI-analytics libraries"], "A quarterly Excel report + a guess.", "Niche. Fund only with prior HR-analytics team. The moat is HRIS integration + reporting depth + benchmarking data.", [["Buyer?", "HR + ESG leaders at large enterprises."], ["Pricing?", "Per employee per year."], ["Compliance?", "EU CSRD + EEOC + state reporting."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "legal-tech",
    name: "Legal Tech",
    shortPitch: "AI is the biggest disruption legal has seen. The wedge plays are vertical (immigration, IP, litigation) — not horizontal Harvey clones.",
    niches: makeNiches([
      ["contract-review-by-vertical", "Contract review by vertical", "Contract review LLMs tuned to a specific industry (SaaS, real estate, M&A, employment).", "quarter", "hot", "Repos with vertical-specific playbook libraries, redlining models, and contract-management integrations.", "Generic contract-AI loses to vertical depth. Industry-specific playbooks win.", ["Spellbook for SaaS", "Lex Machina vertical shape", "Open-source legal-LLM libraries"], "A general-purpose AI tool that misses industry-specific risks.", "Vertical wedge. The moat is the playbook library + the contract-management integration + the vertical reputation.", [["Buyer?", "GC + legal ops at vertical-specific companies."], ["Pricing?", "Per contract or per seat."], ["Defensibility?", "Playbook + integration + reputation."]]],
      ["immigration-paperwork-automation", "Immigration paperwork automation", "End-to-end visa paperwork: H-1B, L-1, EB-5, asylum, family.", "quarter", "steady", "Repos with USCIS form libraries, evidence-collection workflows, and attorney-review integrations.", "Immigration legal is high-volume, high-paperwork, fragmented. AI drafts forms; humans review.", ["Boundless shape", "Legalpad", "Open-source immigration libraries"], "A $5k retainer + 6 months of email chains.", "Vertical wedge. Fund only with immigration-law background. The moat is form accuracy + attorney network + reputation.", [["Buyer?", "Immigrants + employers + immigration attorneys."], ["Pricing?", "Per case."], ["Compliance?", "USCIS + state bar."]]],
      ["ip-management-saas", "IP management SaaS", "Trademark + patent + copyright management for small-mid IP portfolios.", "quarter", "trickle", "Repos with USPTO / EPO adapters, deadline-management libraries, and renewal-payment integrations.", "IP renewals + portfolio management is fragmented. Small-mid portfolios are underserved.", ["Clarivate shape", "Anaqua", "Open-source IP-management libraries"], "A docketing spreadsheet + missed renewals.", "Niche. Fund only with IP-law GTM. The moat is the USPTO / EPO integration + the deadline accuracy + the renewal workflow.", [["Buyer?", "GC + IP managers at $5-500M revenue."], ["Pricing?", "Per asset per year."], ["Defensibility?", "Integration + accuracy + workflow."]]],
      ["e-discovery-llms", "E-discovery LLMs", "AI-driven document review for litigation — privilege, relevance, summarization.", "team", "hot", "Repos with document-ingest libraries, privilege-detection models, and litigation-platform integrations.", "E-discovery is a $10B+ industry. AI-driven review costs 1/10 of human review.", ["Reveal-Brainspace shape", "DISCO AI", "Open-source e-discovery libraries"], "An associate billing 200 hours of doc review.", "Capital-heavy. Fund only with legal-tech + ML team. The moat is privilege accuracy + integration with litigation platforms.", [["Buyer?", "Large law firms + corporate legal departments."], ["Pricing?", "Per document or per case."], ["Defensibility?", "Accuracy + integration."]]],
      ["regulatory-monitoring-for-startups", "Regulatory monitoring for startups", "Track regulatory changes in your industry — SEC, FDA, FTC, EU, state.", "month", "steady", "Repos with regulatory-source ingest libraries, change-detection models, and Slack / email notification frameworks.", "Startups can't afford regulatory counsel. AI-monitored regulatory feeds are the wedge.", ["Compliance.ai shape", "Manzama", "Open-source regulatory-monitoring libraries"], "A panicked Google search after a customer complaint.", "Vertical wedge by industry. The moat is the source breadth + the relevance-detection.", [["Buyer?", "Founders + GCs at regulated startups."], ["Pricing?", "$50-500/mo per company."], ["Moat?", "Source breadth + accuracy."]]],
      ["will-and-estate-llms", "Will and estate LLMs", "AI-drafted wills + estate plans + trust documents for the long tail of non-HNW estates.", "quarter", "steady", "Repos with state-specific will libraries, estate-tax calculators, and attorney-review workflows.", "70% of Americans lack a will. AI drafts + attorney review is the unlock.", ["Trust & Will shape", "Wealth.com", "Open-source estate-planning libraries"], "A LegalZoom template from 2015.", "Self-serve consumer + attorney marketplace. The moat is state-by-state legal accuracy + attorney network.", [["Buyer?", "Consumers directly + estate attorneys as channel."], ["Pricing?", "$100-1000 per plan."], ["Compliance?", "State-by-state estate law."]]],
      ["small-claims-document-automation", "Small claims document automation", "Generate small-claims paperwork — demand letters, complaints, evidence packets.", "month", "trickle", "Repos with state-specific court-form libraries, evidence-collection workflows, and filing-integration adapters.", "Small claims is high-volume + low-cost. Mostly DIY. AI lowers the friction further.", ["DoNotPay / FairFight shape", "Civille", "Open-source court-form libraries"], "A confused litigant + a free-clinic legal aid.", "Self-serve consumer. Long-tail volume. The moat is state-by-state form accuracy + filing integration.", [["Buyer?", "Consumers directly."], ["Pricing?", "$25-200 per case."], ["What kills this?", "Courts shipping AI-form portals natively."]]],
      ["court-records-search-apis", "Court records search APIs", "Search across federal + state court records with AI summarization + entity extraction.", "team", "trickle", "Repos with court-records ingest libraries, entity-extraction models, and API-rate-limit-friendly architectures.", "Lawyers + journalists + researchers need court-records search. Most existing tools are old + expensive.", ["PACER shape", "Court Listener", "Open-source court-records libraries"], "PACER + a $0.10/page fee.", "Open-data + commercial. Fund only with legal-data team. The moat is data breadth + accuracy + speed.", [["Buyer?", "Law firms + journalists + researchers."], ["Pricing?", "API + subscription."], ["Moat?", "Data breadth + speed."]]],
      ["deposition-summarization", "Deposition summarization", "Transcripts + AI summaries + searchable databases of deposition testimony.", "quarter", "trickle", "Repos with transcript-ingest libraries, summarization models, and case-management integrations.", "Depositions are core litigation work. AI summarization + search is high-value.", ["Veritext / Steno adjacency", "Lit Software shape", "Open-source deposition libraries"], "A junior associate + 100 pages of transcript per night.", "Niche. Fund only with prior legal-tech background. The moat is the integration with deposition vendors + the case-management workflow.", [["Buyer?", "Litigators."], ["Pricing?", "Per deposition or per case."], ["Defensibility?", "Integration + workflow."]]],
      ["gdpr-and-data-rights-tools", "GDPR and data rights tools", "Automate data-subject-rights requests, DPIA, data mapping, processor records.", "quarter", "hot", "Repos with GDPR / CCPA / state-law adapters, DSR workflow libraries, and processor-record automation.", "EU + US state privacy laws are forcing every company to handle DSRs.", ["OneTrust shape", "Transcend / Securiti", "Open-source GDPR libraries"], "A privacy-team email inbox + manual processing.", "Wedge with privacy + legal ops. The moat is the regulatory breadth + the data-source integration.", [["Buyer?", "DPOs + GCs + privacy leaders."], ["Pricing?", "Per organization or per DSR."], ["Compliance?", "GDPR + CCPA + state laws."]]],
    ]),
  },
  {
    slug: "proptech",
    name: "PropTech",
    shortPitch: "Real estate is finally adopting software. The vertical SaaS opportunity is enormous — most categories still have a 2003-vintage incumbent.",
    niches: makeNiches([
      ["short-term-rental-ops", "Short-term rental ops", "Operations + revenue management + cleaning + maintenance for STR portfolios.", "quarter", "steady", "Repos with Airbnb / Vrbo / Booking adapters, dynamic-pricing libraries, and operations-workflow tools.", "STR is now 1.5M+ US listings. Pro hosts need ops software, not consumer apps.", ["Hostfully shape", "Guesty", "PriceLabs adjacency"], "A spreadsheet + a cleaning-crew text thread.", "Vertical wedge. The moat is the channel-integration breadth + the ops workflow + the dynamic-pricing.", [["Buyer?", "STR hosts with 5+ listings."], ["Pricing?", "Per listing per month."], ["Defensibility?", "Channel + workflow + pricing."]]],
      ["smart-building-iot-platforms", "Smart building IoT platforms", "IoT + AI for commercial buildings — HVAC, lighting, security, energy.", "team", "trickle", "Repos with BACnet / Modbus adapters, AI-control libraries, and building-management integrations.", "Energy + ESG pressure makes smart-building tech a budget line. Most building-management systems are 90s-vintage.", ["75F shape", "Switch Automation", "Open-source building-IoT libraries"], "A BMS from 2003 + a manually adjusted thermostat.", "Capital + hardware-heavy. Fund only with building-industry background. The moat is the integration breadth + the AI savings.", [["Buyer?", "Commercial property owners + property managers."], ["Pricing?", "Per square foot per year."], ["Defensibility?", "Integration + AI accuracy."]]],
      ["mortgage-underwriting-llms", "Mortgage underwriting LLMs", "AI-driven document analysis + underwriting for non-QM + alternative mortgages.", "team", "steady", "Repos with document-ingest libraries, income-verification models, and lender-integration adapters.", "Non-QM + alternative mortgages are growing. AI underwriting beats the manual non-QM workflow.", ["Tomo / Better.com shape", "Snapdocs adjacency", "Open-source mortgage-underwriting libraries"], "A manual underwriter + 7 days of doc collection.", "Capital + regulatory burden. Fund only with mortgage-industry team. The moat is the document accuracy + the lender integrations.", [["Buyer?", "Non-QM lenders + private mortgage funds."], ["Pricing?", "Per loan or per lender."], ["Compliance?", "RESPA + state lending laws."]]],
      ["property-management-for-mom-and-pops", "Property management for mom-and-pops", "PMS for 1-50-unit landlords — the long tail underserved by Yardi / RealPage.", "quarter", "steady", "Repos with payment-rail adapters, lease-template libraries, and maintenance-request workflows.", "30M+ US small landlords. Most use Excel + checks. AI-native PMS is the wedge.", ["Avail / Apartments.com shape", "Innago", "Open-source small-PMS libraries"], "A checkbook + a Word lease + late rent.", "Vertical wedge. The moat is the workflow library + the payment + screening integrations.", [["Buyer?", "Small landlords (1-50 units)."], ["Pricing?", "Per unit per month."], ["Defensibility?", "Workflow + integrations."]]],
      ["commercial-lease-abstraction", "Commercial lease abstraction", "AI-extracted lease data + portfolio analytics for owners + tenants.", "quarter", "trickle", "Repos with lease-OCR libraries, lease-clause-extraction models, and portfolio-analytics tools.", "CRE leases are 100+ page PDFs. AI extraction unlocks portfolio analytics + risk.", ["LeaseAccelerator shape", "VTS Lease", "Open-source lease-abstraction libraries"], "A lease admin + a binder + missed clauses.", "Niche. Fund only with CRE background. The moat is the lease-clause library + the integration with lease-administration platforms.", [["Buyer?", "CRE owners + corporate tenants."], ["Pricing?", "Per lease or per portfolio."], ["Moat?", "Accuracy + clause library."]]],
      ["real-estate-photo-staging-ai", "Real estate photo staging AI", "AI-staged listing photos — empty room to furnished, in seconds.", "month", "frothy", "Repos with image-generation models, room-type classifiers, and MLS integration adapters.", "Listing photos drive 80% of buyer interest. AI staging is 1/100 the cost of physical staging.", ["Virtual Staging AI shape", "REimagineHome", "Open-source image-staging libraries"], "A $300-800 staging session + a slow process.", "Self-serve + agent-channel. Hot but commoditizing. The moat is quality + speed + MLS integration.", [["Buyer?", "Real estate agents + photographers + brokerages."], ["Pricing?", "$10-100/listing."], ["What kills this?", "Adobe / Canva shipping native virtual staging."]]],
      ["construction-bidding-marketplaces", "Construction bidding marketplaces", "Subcontractor + GC bidding + procurement marketplaces.", "team", "trickle", "Repos with bid-management libraries, plan-takeoff integrations, and payment-tracking workflows.", "Construction industry digitization is finally happening. Bidding + procurement is fragmented.", ["Procore + AI shape", "BuildOps", "Open-source construction-bid libraries"], "Email + fax + a 3-week back-and-forth.", "Two-sided market. Fund only with construction-industry team. The moat is liquidity + the workflow + the plan-takeoff AI.", [["Buyer?", "GCs + subcontractors + owners."], ["Pricing?", "% of bid value or SaaS."], ["Defensibility?", "Liquidity + workflow."]]],
      ["energy-retrofit-financing", "Energy retrofit financing", "PACE + green loans + retrofit financing for commercial + multifamily.", "team", "steady", "Repos with retrofit-modeling libraries, PACE adapters, and lender-integration workflows.", "IRA + state retrofit incentives are creating real demand. Financing is the unlock.", ["BlocPower shape", "PACENation members", "Open-source retrofit-finance libraries"], "A bank visit + a complicated PACE application.", "Capital + regulatory burden. Fund only with energy-finance background. The moat is the lender + utility + retrofit-contractor network.", [["Buyer?", "Building owners + retrofit contractors."], ["Pricing?", "Loan origination fees."], ["Compliance?", "State PACE rules + lending."]]],
      ["virtual-tour-generators", "Virtual tour generators", "iPhone-only virtual tours that look like Matterport at 1/10 the cost.", "month", "hot", "Repos with NeRF / Gaussian-splat libraries, mobile capture tools, and MLS integration adapters.", "Matterport made the category. AI-driven NeRF / Gaussian-splat are commoditizing it.", ["Matterport adjacency", "Giraffe360", "Open-source NeRF + capture libraries"], "A $500 Matterport session + a tripod.", "Self-serve. Pricing per tour. The moat is quality + speed + integrations.", [["Buyer?", "Real estate agents + photographers."], ["Pricing?", "$10-50 per tour."], ["What kills this?", "Apple iPhone shipping native 3D capture as a feature."]]],
      ["tenant-screening-automation", "Tenant screening automation", "Background + credit + rental-history checks for small + mid-size landlords.", "month", "steady", "Repos with credit-bureau adapters, eviction-data libraries, and FCRA-compliant workflow tools.", "30M+ US small landlords + millions of rental applications/year. Tenant-screening market is fragmented.", ["TransUnion SmartMove shape", "RentSpree / Avail screening", "Open-source tenant-screening libraries"], "A landlord doing a manual call + 'sounds fine.'", "Niche. Fund only with property-management background. The moat is FCRA compliance + accuracy + landlord workflow.", [["Buyer?", "Small landlords + property managers."], ["Pricing?", "Per screening."], ["Compliance?", "FCRA + state-specific tenant law."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "robotics",
    name: "Robotics",
    shortPitch: "AI breakthroughs are unlocking robotics applications stuck for a decade. The software layer is where leverage compounds.",
    niches: makeNiches([
      ["sim-to-real-libraries", "Sim-to-real libraries", "Reinforcement-learning environments that transfer cleanly to real robots.", "team", "trickle", "Repos with PyBullet / MuJoCo / Isaac Sim integrations, domain-randomization libraries, and policy-deploy frameworks.", "Robot-learning needs sim. The library layer is unstable + research-only. Production-grade sim-to-real is unbuilt.", ["Isaac Sim ecosystem", "Robosuite", "Open-source RL libraries"], "A custom MuJoCo setup that takes 6 months to tune.", "Niche, research-heavy. Fund only with robotics + ML team. The moat is sim-fidelity + transfer accuracy + ecosystem.", [["Buyer?", "Robot manufacturers + research labs."], ["Pricing?", "License + support."], ["Defensibility?", "Sim depth + accuracy."]]],
      ["robot-perception-models", "Robot perception models", "Vision + depth + tactile perception models for general-purpose robots.", "team", "trickle", "Repos with multi-modal perception models, sensor-fusion libraries, and ROS integrations.", "Humanoid + general-purpose robotics needs perception models. Most are stitched-together OSS.", ["RoboHive shape", "MIT / Stanford research libraries", "Open-source perception libraries"], "An OpenCV + custom-trained CNN that fails on edge cases.", "Research-heavy. Fund only with robotics + perception team. The moat is data + model accuracy + ROS-ecosystem integration.", [["Buyer?", "Robot manufacturers."], ["Pricing?", "License or per-robot."], ["Moat?", "Data + model + ecosystem."]]],
      ["warehouse-robotics-saas", "Warehouse robotics SaaS", "Software layer for warehouse robotics — fleet management, picking optimization, integration.", "team", "steady", "Repos with WMS adapters, fleet-management libraries, and robot-vendor SDK integrations.", "Warehouse robotics is mainstream. The integration + fleet-management software is fragmented.", ["Geek+ / Fetch shape", "Boston Dynamics fleet ops", "Open-source robot-fleet libraries"], "A custom integration + 4 robot vendors not talking to each other.", "Vertical SaaS. Fund only with warehouse-ops or robotics-vendor team. The moat is the multi-vendor integration + the workflow.", [["Buyer?", "Warehouse + 3PL + distribution operators."], ["Pricing?", "Per robot or per facility."], ["Defensibility?", "Integration breadth + workflow."]]],
      ["last-mile-delivery-robots", "Last-mile delivery robots", "Software for autonomous + remote-piloted last-mile delivery robots.", "team", "trickle", "Repos with mapping libraries, remote-pilot frameworks, and order-management integrations.", "Last-mile cost is 53% of total shipping. Robot delivery is finally piloting at scale.", ["Starship Technologies", "Coco Robotics shape", "Open-source delivery-robot libraries"], "A gig-economy delivery driver + a high marginal cost.", "Capital-heavy. Fund only with robotics + logistics team. The moat is the routing + remote-pilot workflow + safety.", [["Buyer?", "Quick-serve restaurants + grocery + last-mile fleet ops."], ["Pricing?", "Per delivery."], ["Compliance?", "Per-city / state robot-vehicle rules."]]],
      ["surgical-robotics-software", "Surgical robotics software", "Software + AI tools for surgical robotics — planning, intra-op vision, training.", "team", "trickle", "Repos with surgical-image libraries, robot-control APIs, and training-simulation frameworks.", "Intuitive Surgical's monopoly is cracking. The software layer is open for newcomers.", ["Intuitive Surgical adjacency", "Medtronic Mazor", "Open-source surgical-robotics libraries"], "A surgical robot + custom proprietary software + slow innovation.", "Heavy regulatory. Fund only with medical-device team. The moat is FDA clearance + clinical evidence + integrations.", [["Buyer?", "Hospitals + ASCs."], ["Pricing?", "Per surgery or per system."], ["Compliance?", "FDA Class II/III."]]],
      ["agricultural-robotics-os", "Agricultural robotics OS", "Operating system + workflow software for ag robots — weeding, harvesting, planting.", "team", "trickle", "Repos with ROS + ROS2 adapters, ag-specific libraries, and farm-management integrations.", "Ag-robotics startups are scaling. The OS + workflow layer is fragmented.", ["Carbon Robotics adjacency", "Naio Technologies shape", "Open-source ag-robotics OS"], "A custom ROS setup per startup.", "Niche. Fund only with ag + robotics team. The moat is the ag-specific library + the farm-software integration.", [["Buyer?", "Ag-robotics startups + farm operators."], ["Pricing?", "Per robot or per farm."], ["Defensibility?", "Ag-specific depth."]]],
      ["household-robot-skill-libraries", "Household robot skill libraries", "Skill libraries for the coming wave of household robots — fold laundry, load dishwasher, etc.", "team", "trickle", "Repos with manipulation models, household-task datasets, and policy-transfer libraries.", "Humanoid + household robots are a 5-10-year bet. The skill library is open foundational work.", ["1X / Figure adjacency", "Tesla Optimus skill libraries", "Open-source manipulation libraries"], "A research lab + custom skill training.", "Speculative. Fund only with robotics-research team. The moat is data + skill breadth + transfer accuracy.", [["Buyer?", "Robot manufacturers."], ["Pricing?", "License or revenue share."], ["Defensibility?", "Skill library + transferability."]]],
      ["telepresence-platforms", "Telepresence platforms", "Telepresence + remote-pilot software for industrial robots.", "team", "trickle", "Repos with low-latency video + control libraries, multi-robot adapters, and operator-workflow tools.", "Industrial telepresence solves the labor + skill gap in warehouses, mines, construction.", ["Sarcos Robotics adjacency", "Kindred AI shape", "Open-source telepresence libraries"], "A custom RTSP stream + a joystick.", "Niche. Fund only with robotics + telepresence team. The moat is latency + safety + the operator workflow.", [["Buyer?", "Warehouse + mining + construction operators."], ["Pricing?", "Per robot + per operator."], ["Defensibility?", "Latency + safety + workflow."]]],
      ["robot-fleet-management", "Robot fleet management", "Manage heterogeneous robot fleets — humanoids + AGVs + drones — across sites.", "team", "trickle", "Repos with multi-vendor adapters, fleet-orchestration libraries, and analytics frameworks.", "Multi-robot, multi-vendor fleets are the next ops headache. Software layer is unbuilt.", ["FlexQube / OTTO shape", "Brain Corp adjacency", "Open-source robot-fleet libraries"], "A custom orchestration script per vendor.", "Capital-heavy. Fund only with robotics + ops team. The moat is multi-vendor integration + ops workflow.", [["Buyer?", "Multi-site warehouse + manufacturing operators."], ["Pricing?", "Per robot or per fleet."], ["Defensibility?", "Integration + workflow."]]],
      ["robotics-data-labeling-tools", "Robotics data labeling tools", "Data-labeling tools for robotic tasks — manipulation, sim-to-real, perception.", "quarter", "trickle", "Repos with multi-modal labeling libraries, simulation-aware labelers, and active-learning frameworks.", "Robotic data labeling is fragmented. The Scale AI / Roboflow for robotics is unbuilt.", ["Scale Robotics adjacency", "Roboflow extensions", "Open-source robot-labeling libraries"], "A research lab + manual data labeling.", "Niche. Fund only with robotics + data team. The moat is the labeler-quality + the simulation integration.", [["Buyer?", "Robotics startups + research labs."], ["Pricing?", "Per label or SaaS."], ["Defensibility?", "Quality + simulation + workflow."]]],
    ]),
  },
  {
    slug: "social-community",
    name: "Social & Community",
    shortPitch: "Greg's home turf. The community-led category is enormous — but pSEO leverage is in the infrastructure, not the consumer apps.",
    niches: makeNiches([
      ["private-community-platforms", "Private community platforms", "Self-hosted + branded private community platforms — Circle / Discord / Slack alternatives.", "quarter", "hot", "Repos with payment integrations, member-management libraries, and content-moderation frameworks.", "Creators want their own platforms, not someone else's. The 'own your community' wedge is open.", ["Circle shape", "Mighty Networks", "Open-source community-platform libraries"], "A Discord server with no monetization.", "Hot. The wedge is the payments + content + moderation + analytics stack as a unified product.", [["Buyer?", "Creators + community builders."], ["Pricing?", "Per-month subscription or revenue share."], ["What kills this?", "Discord shipping native monetization properly."]]],
      ["creator-membership-saas", "Creator membership SaaS", "Patreon alternatives with better tiers, content gating, AI-driven engagement.", "quarter", "hot", "Repos with payment adapters, content-gating libraries, and member-engagement frameworks.", "Creator economy continues to grow. Patreon's stagnation creates a wedge.", ["Substack + memberships", "Beehiiv", "Open-source membership libraries"], "Patreon + complaints about discoverability.", "Hot. The wedge is the AI-driven recommendation + the better content-tier UX.", [["Buyer?", "Creators."], ["Pricing?", "Revenue share."], ["Moat?", "Recommendation + UX + payment."]]],
      ["niche-dating-apps", "Niche dating apps", "Vertical dating apps — for specific communities, interests, or values.", "quarter", "steady", "Repos with matching algorithms, video-call libraries, and safety / moderation frameworks.", "Mainstream dating is broken. Niche apps with strong matching beat the general apps.", ["Hinge adjacency", "The League / Raya shape", "Open-source dating-app libraries"], "Hinge + frustration + a paid premium tier.", "Two-sided market. Hard CAC. Fund only with prior consumer-app GTM. The wedge is one niche done deeply.", [["Buyer?", "Users directly + subscription."], ["Pricing?", "Subscription + premium features."], ["What kills this?", "Match Group acquiring all the niches."]]],
      ["voice-first-social", "Voice-first social", "Audio + voice-first social apps — Clubhouse 2.0 done correctly.", "quarter", "trickle", "Repos with low-latency voice libraries, recording + transcript tools, and community-moderation frameworks.", "Voice didn't die with Clubhouse. The asynchronous + transcript + AI-summarized voice wedge is open.", ["Clubhouse adjacency", "Twitter Spaces clones", "Open-source voice-first libraries"], "A WhatsApp voice note + no discoverability.", "Speculative. Fund only with consumer-social team. The moat is the latency + the moderation + the asynchronous-voice workflow.", [["Buyer?", "Creators + community builders."], ["Pricing?", "Subscription or ads."], ["What kills this?", "Twitter / Discord absorbing the wedge."]]],
      ["real-world-meetup-coordinators", "Real-world meetup coordinators", "Tools for organizing in-person meetups, events, gatherings.", "month", "trickle", "Repos with calendar libraries, RSVP + payment tools, and venue-finder integrations.", "Real-world community is back. Meetup.com is aging. The next wave is unbuilt.", ["Luma shape", "Partiful", "Open-source meetup libraries"], "Meetup.com + low attendance.", "Vertical wedge. The moat is the workflow + the discoverability + the safety.", [["Buyer?", "Community builders + event organizers."], ["Pricing?", "Per event or subscription."], ["Moat?", "Workflow + discoverability."]]],
      ["group-chat-summarization", "Group chat summarization", "AI summarization of group chats — WhatsApp, Slack, Discord, iMessage.", "month", "hot", "Repos with chat-platform adapters, summarization models, and notification frameworks.", "Group chats are unread. AI summarization makes them usable again.", ["Reflect for Slack", "Glean for Slack", "Open-source chat-summarization libraries"], "A 1000-message Slack channel + scroll-and-skim.", "Wedge with knowledge workers. The moat is the chat-platform integration + the summarization accuracy.", [["Buyer?", "Knowledge workers + community managers."], ["Pricing?", "Subscription."], ["What kills this?", "Slack / Discord shipping native summarization."]]],
      ["online-event-platforms", "Online event platforms", "Webinars + virtual conferences + workshops — Zoom + Hopin alternatives.", "quarter", "trickle", "Repos with video-streaming libraries, audience-engagement tools, and CRM / marketing integrations.", "Online events are mainstream. Tools are fragmented. The integrated wedge is open.", ["Hopin shape", "Welcome / Run The World", "Open-source event-platform libraries"], "Zoom + a shaky Q&A workflow.", "Crowded category. Differentiate on workflow + integrations. Fund only with prior events-industry GTM.", [["Buyer?", "Event organizers + marketing teams."], ["Pricing?", "Per event or subscription."], ["Defensibility?", "Workflow + integrations."]]],
      ["accountability-app-saas", "Accountability app SaaS", "Accountability + habit + group-coaching apps with AI nudges.", "month", "steady", "Repos with notification libraries, group-management tools, and habit-tracking frameworks.", "Personal-growth + habit-formation market is huge. AI-driven accountability is the unlock.", ["Stickk shape", "Strong app + habits", "Open-source habit + accountability libraries"], "A habit-tracker app + sporadic use.", "Self-serve consumer. Hard CAC. Fund only with consumer-app GTM. The moat is the engagement loop + the AI-nudge accuracy.", [["Buyer?", "Individuals + coaches."], ["Pricing?", "$10-30/mo subscription."], ["What kills this?", "Apple Health / Google Fit shipping native accountability."]]],
      ["hobbyist-marketplace-rails", "Hobbyist marketplace rails", "Marketplace platforms for hobbyists — crafts, vintage, collectibles, niche makers.", "quarter", "trickle", "Repos with payment libraries, seller-onboarding tools, and category-specific search engines.", "Etsy is bloated. Niche hobbyist marketplaces win on community + curation.", ["Etsy adjacency", "Reverb (Etsy-owned)", "Open-source marketplace libraries"], "Etsy + 30+ fees + algorithm drift.", "Vertical wedge. Fund only with marketplace GTM. The moat is community + curation + payments.", [["Buyer?", "Hobbyist sellers + buyers."], ["Pricing?", "% of transaction."], ["Defensibility?", "Community + payments."]]],
      ["anti-loneliness-tools", "Anti-loneliness tools", "Apps + services that combat the loneliness epidemic — friendship, connection, conversation.", "quarter", "trickle", "Repos with matching algorithms, conversation-starter libraries, and safety frameworks.", "Loneliness is a public-health crisis. The product category is just emerging.", ["Bumble BFF shape", "Wiser / Replika companion", "Open-source companionship libraries"], "Social media + worsened loneliness.", "Hard CAC. Long-term thesis. Fund only with consumer + health team. The moat is the matching + the safety + the trust.", [["Buyer?", "Lonely consumers + insurers + employers."], ["Pricing?", "Subscription or B2B."], ["What kills this?", "Stigma + measurement difficulty."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "space-tech",
    name: "Space Tech",
    shortPitch: "Hardware is hard. Software around space is where leverage compounds — data, comms, ops.",
    niches: makeNiches([
      ["in-space-manufacturing-software", "In-space manufacturing software", "Software for in-space manufacturing — control, telemetry, data return.", "team", "trickle", "Repos with satellite-comms adapters, control-system libraries, and data-analytics frameworks.", "In-space manufacturing pilots are scaling. Software layer is small but growing.", ["Varda Space adjacency", "Sierra Space", "Open-source in-space ops libraries"], "Custom mission-control software per facility.", "Niche. Fund only with space-industry team. The moat is the integration + the reliability.", [["Buyer?", "In-space manufacturing operators."], ["Pricing?", "Per mission or per facility."], ["Defensibility?", "Integration + reliability."]]],
      ["satellite-data-marketplaces", "Satellite data marketplaces", "Marketplace + APIs for satellite data — imagery, SAR, hyperspectral, LiDAR.", "team", "steady", "Repos with multi-provider adapters, geospatial-data libraries, and analytics frameworks.", "Satellite-data demand is up 30%/year. Multi-provider sourcing is hard.", ["Skywatch shape", "UP42 / SkyFi", "Open-source satellite-data libraries"], "A 4-provider procurement headache + a 2-week delivery.", "Vertical SaaS. Fund only with geospatial-data team. The moat is the provider breadth + the analytics + the workflow.", [["Buyer?", "Defense + agriculture + insurance + finance + climate."], ["Pricing?", "Per image or subscription."], ["Defensibility?", "Provider breadth + workflow."]]],
      ["ground-station-as-a-service", "Ground station as a service", "Ground station networks + scheduling + downlink — software layer.", "team", "trickle", "Repos with ground-station scheduling libraries, mission-planning tools, and analytics frameworks.", "Smallsat operators need cheap downlink. Ground-station-as-a-service is consolidating.", ["AWS Ground Station adjacency", "Leaf Space", "Open-source ground-station libraries"], "A custom ground station + 5 site engineers.", "Capital-heavy. Fund only with space-industry team. The moat is the network + the scheduling + the reliability.", [["Buyer?", "Smallsat operators."], ["Pricing?", "Per minute of downlink."], ["Defensibility?", "Network + scheduling."]]],
      ["debris-tracking-apis", "Debris tracking APIs", "Real-time orbital debris tracking + collision warnings.", "team", "trickle", "Repos with TLE / orbit-determination libraries, collision-prediction models, and operator-notification frameworks.", "Orbital debris is at crisis levels. Collision-avoidance is a budget line for every satellite operator.", ["LeoLabs shape", "Slingshot Aerospace", "Open-source orbital-debris libraries"], "A NORAD TLE + manual collision checks.", "Capital + data-heavy. Fund only with space-industry team. The moat is the data + the prediction accuracy.", [["Buyer?", "Satellite operators + insurers + space agencies."], ["Pricing?", "Per warning or per portfolio."], ["Defensibility?", "Data + accuracy."]]],
      ["lunar-mission-mission-control", "Lunar mission mission control", "Mission-control software for lunar + deep-space missions.", "team", "trickle", "Repos with mission-planning libraries, telemetry-ingest tools, and control-loop frameworks.", "Lunar mission cadence is increasing — Artemis, commercial landers, Chinese missions. Software layer is fragmented.", ["Intuitive Machines adjacency", "Astrobotic", "Open-source mission-control libraries"], "Custom mission-control per mission.", "Capital + regulatory. Fund only with space-industry team. The moat is the reliability + the integration depth.", [["Buyer?", "Lunar + deep-space mission operators."], ["Pricing?", "Per mission."], ["Compliance?", "NASA + ESA + JAXA + private-sector standards."]]],
      ["earth-observation-llm-apis", "Earth-observation LLM APIs", "Natural-language Q&A over satellite imagery — 'show me deforestation in Brazil since 2020.'", "team", "steady", "Repos with multimodal LLM integrations, satellite-data ingest libraries, and geospatial-analytics frameworks.", "Satellite-data is unstructured. LLM + RAG over imagery is the unlock for non-specialists.", ["Planet Labs + AI shape", "Picterra", "Open-source EO-LLM libraries"], "A GIS analyst + 4 hours of queries.", "Vertical wedge. The moat is the imagery + the LLM tuning + the geospatial accuracy.", [["Buyer?", "Defense + climate + finance + agriculture."], ["Pricing?", "Per query or subscription."], ["Defensibility?", "Imagery + accuracy."]]],
      ["smallsat-fleet-management", "Smallsat fleet management", "Manage smallsat fleets — telemetry, mission planning, payload ops.", "team", "trickle", "Repos with smallsat-bus adapters, mission-planning libraries, and payload-ops frameworks.", "Smallsat operators have 10-1000+ satellites. Fleet management is fragmented.", ["KSAT adjacency", "Planet Labs internal tooling", "Open-source smallsat-fleet libraries"], "Custom mission-control per operator.", "Niche. Fund only with space-industry team. The moat is the integration + the reliability + the analytics.", [["Buyer?", "Smallsat operators."], ["Pricing?", "Per satellite per month."], ["Defensibility?", "Integration + reliability."]]],
      ["propulsion-simulation-tools", "Propulsion simulation tools", "Simulation + CAD + analysis tools for rocket + satellite propulsion.", "team", "trickle", "Repos with CFD adapters, propulsion-modeling libraries, and CAD-integration frameworks.", "Propulsion R&D is the slowest part of space dev. Simulation accelerates it 10x.", ["Rocket Lab internal tooling", "ANSYS + AI adjacency", "Open-source propulsion-sim libraries"], "A custom CFD + manual analysis.", "Niche, research-heavy. Fund only with aerospace + simulation team. The moat is accuracy + ecosystem.", [["Buyer?", "Aerospace engineers + space startups."], ["Pricing?", "License + support."], ["Defensibility?", "Accuracy + ecosystem."]]],
      ["regulatory-compliance-saas", "Regulatory compliance SaaS (space)", "Compliance with FCC + ITAR + NOAA + ESA + UN space-debris standards.", "quarter", "trickle", "Repos with regulatory-rule libraries, document-generation tools, and filing-integration adapters.", "Space regulation is fragmented and growing. Compliance is a budget unlock.", ["SpaceX internal tooling", "Karman Space + Defense adjacency", "Open-source space-compliance libraries"], "A regulatory consultant + missed deadlines.", "Niche. Fund only with space + regulatory team. The moat is the regulatory breadth + the filing automation.", [["Buyer?", "Space companies + government."], ["Pricing?", "Per company per year."], ["Compliance?", "FCC + ITAR + NOAA + ESA + UN."]]],
      ["space-tourism-booking-platforms", "Space tourism booking platforms", "Booking + payments + waiver-management for the emerging space-tourism market.", "team", "trickle", "Repos with payment libraries, KYC + medical-clearance tools, and operator-coordination frameworks.", "Space tourism is real — Virgin Galactic, Blue Origin, SpaceX. The booking layer is unbuilt.", ["Virgin Galactic direct sales", "Space Adventures shape", "Open-source space-tourism libraries"], "A custom website + a manual deposit process.", "Speculative. Fund only with space + travel team. The moat is the operator partnerships + the regulatory + the experience.", [["Buyer?", "Wealthy travelers + space-tourism operators."], ["Pricing?", "% of ticket."], ["What kills this?", "Operators consolidating their own booking platforms."]]],
    ]),
  },
  {
    slug: "supply-chain",
    name: "Supply Chain",
    shortPitch: "Boring but enormous. Every workflow has 2003-vintage incumbents. AI + integrations win the upgrade.",
    niches: makeNiches([
      ["shipment-tracking-aggregators", "Shipment tracking aggregators", "Track shipments across 100+ carriers — sea, air, land, parcel.", "quarter", "steady", "Repos with carrier-API adapters, tracking-event libraries, and ETA-prediction models.", "Multi-carrier shipping is universal. The integration layer is fragmented.", ["project44 shape", "FourKites / Shippeo", "Open-source shipment-track libraries"], "A 4-carrier login workflow + ETA guesses.", "Vertical SaaS. The moat is carrier coverage + ETA accuracy + integrations.", [["Buyer?", "3PLs + shippers + retailers."], ["Pricing?", "Per shipment or SaaS."], ["Defensibility?", "Carrier breadth + accuracy."]]],
      ["trade-finance-rails", "Trade finance rails", "Letter-of-credit + invoice-finance + cross-border-payments rails for SMB importers + exporters.", "team", "trickle", "Repos with bank-API adapters, document-OCR libraries, and KYC + compliance frameworks.", "Trade finance is a $1.7T market. SMBs are underserved by HSBC / Citi.", ["Marco Polo shape", "Bolero", "Open-source trade-finance libraries"], "A bank visit + a 90-day LOC waiting period.", "Capital + regulatory burden. Fund only with banking-fintech team. The moat is the bank-partner network + the compliance + the document AI.", [["Buyer?", "SMB importers + exporters."], ["Pricing?", "% of transaction."], ["Compliance?", "OFAC + AML + ICC UCP 600."]]],
      ["customs-automation-llms", "Customs automation LLMs", "HTS classification + customs-documentation + duty-calculation LLMs.", "quarter", "hot", "Repos with HTS-classification libraries, customs-form generators, and broker-integration adapters.", "Customs is paperwork-heavy + slow. AI accelerates 80% of the work.", ["Flexport + AI adjacency", "Klearnow.ai", "Open-source customs-LLM libraries"], "A customs broker + a 4-day customs delay.", "Wedge. Fund only with customs-brokerage background. The moat is HTS accuracy + integration depth.", [["Buyer?", "Importers + customs brokers + 3PLs."], ["Pricing?", "Per entry or SaaS."], ["Compliance?", "CBP + ACE + per-country customs."]]],
      ["freight-broker-saas", "Freight broker SaaS", "TMS + load-board + carrier-management for freight brokers.", "quarter", "steady", "Repos with load-board adapters, carrier-management libraries, and EDI / API integrations.", "Freight brokerage is fragmented. Most brokers use 4-5 tools poorly. The integrated wedge is open.", ["Convoy adjacency", "Loadsmart shape", "Open-source freight-broker libraries"], "DAT + a TMS from 2008 + spreadsheets.", "Vertical SaaS. Fund only with freight-industry team. The moat is the integration + the workflow + the AI.", [["Buyer?", "Mid-market freight brokers."], ["Pricing?", "Per user per month."], ["Defensibility?", "Integration + workflow."]]],
      ["last-mile-routing-engines", "Last-mile routing engines", "Vehicle-routing + dispatch optimization for last-mile delivery.", "team", "steady", "Repos with VRP-optimization libraries, dispatch-workflow tools, and driver-app integrations.", "Last-mile cost is 53% of total shipping. Routing optimization saves 10-30%.", ["Onfleet shape", "Routific", "Open-source VRP libraries"], "A Google Maps + a paper manifest.", "Vertical wedge. The moat is the optimization accuracy + the driver workflow + the integration breadth.", [["Buyer?", "Last-mile delivery + couriers + 3PLs."], ["Pricing?", "Per driver per month."], ["Defensibility?", "Accuracy + workflow."]]],
      ["inventory-optimization-llms", "Inventory optimization LLMs", "AI-driven demand forecasting + reorder + stock-position optimization.", "quarter", "steady", "Repos with WMS / ERP adapters, demand-forecasting libraries, and reorder-recommendation engines.", "Inventory carrying cost is 25-35% of revenue for many companies. AI optimization saves real money.", ["o9 Solutions shape", "Cogsy for ecom inventory", "Open-source inventory-optimization libraries"], "An ERP report + a buyer's gut feel.", "Wedge with operations leaders. The moat is forecast accuracy + the ERP integrations + the recommendation workflow.", [["Buyer?", "Mid-market operations + supply-chain leaders."], ["Pricing?", "Per SKU or SaaS."], ["Defensibility?", "Accuracy + integration."]]],
      ["supplier-risk-monitoring", "Supplier risk monitoring", "Continuous monitoring of supplier financial + ESG + cybersecurity risk.", "quarter", "steady", "Repos with multi-data-source ingest, risk-scoring libraries, and alerting frameworks.", "Supply-chain risk is up — bankruptcy, ESG violations, cyber breaches. Continuous monitoring is the unlock.", ["Riskonnect shape", "Sayari / Interos", "Open-source supplier-risk libraries"], "An annual supplier audit + crossed fingers.", "Wedge with procurement + risk. The moat is data sources + scoring + integrations.", [["Buyer?", "Procurement + risk leaders at large enterprises."], ["Pricing?", "Per supplier monitored."], ["Defensibility?", "Data + accuracy."]]],
      ["esg-tracing-tools", "ESG tracing tools", "ESG compliance + reporting for global supply chains.", "team", "steady", "Repos with multi-tier supplier-data libraries, ESG-rules engines, and CSRD / SEC reporting frameworks.", "EU CSRD + US SEC climate disclosure = mandatory ESG tracing.", ["Sourcemap shape", "TrusTrace / Worldly", "Open-source ESG-tracing libraries"], "A supplier questionnaire + a missing audit trail.", "Heavy enterprise sale. Fund only with sustainability + supply-chain team. The moat is the regulatory breadth + the data integrations.", [["Buyer?", "Sustainability + procurement leaders at large brands."], ["Pricing?", "Per supplier or SaaS."], ["Compliance?", "EU CSRD + SEC + state laws."]]],
      ["retail-shelf-vision", "Retail shelf vision", "Computer vision for retail-shelf monitoring — out-of-stock, planogram compliance, pricing.", "team", "trickle", "Repos with mobile + camera-vision libraries, retail-data-ingest tools, and planogram-management integrations.", "Out-of-stock costs retailers $1T/year. Mobile vision + AI lowers the cost of shelf monitoring.", ["Trax Retail shape", "Pensa / Focal Systems", "Open-source retail-vision libraries"], "A part-time merchandiser + a paper checklist.", "Capital + integration-heavy. Fund only with retail-industry team. The moat is the vision accuracy + the retailer integration.", [["Buyer?", "CPG brands + retailers."], ["Pricing?", "Per store or per SKU."], ["Defensibility?", "Vision + integrations."]]],
      ["returns-reverse-logistics", "Returns + reverse logistics", "Reverse-logistics workflow + automation for retail + e-commerce returns.", "quarter", "hot", "Repos with WMS / TMS adapters, return-policy engines, and refurbishment / liquidation integrations.", "Returns are 15-30% of e-commerce. Reverse logistics is the leakiest workflow.", ["Optoro shape", "ReturnGO / Loop Returns", "Open-source returns-logistics libraries"], "A returns pile in the warehouse + manual refurbishment.", "Vertical wedge. The moat is the policy engine + the refurbishment network + the integrations.", [["Buyer?", "DTC + mid-market e-commerce + retail."], ["Pricing?", "Per return processed."], ["Defensibility?", "Workflow + integrations."]]],
    ]),
  },
);

nicheSectors.push(
  {
    slug: "web3",
    name: "Web3",
    shortPitch: "Speculative but real. Stablecoins, agent payments, and onchain compliance are the wedges that survive multiple cycles.",
    niches: makeNiches([
      ["account-abstraction-toolkits", "Account abstraction toolkits", "ERC-4337 wallet libraries + paymaster infrastructure for AA-first apps.", "team", "steady", "Repos with bundler integrations, paymaster libraries, and multi-chain account adapters.", "Account abstraction is the wallet UX unlock. Developer tooling is consolidating.", ["Alchemy AA shape", "Stackup / Pimlico", "Open-source AA libraries"], "An EOA + 'paste your seed phrase' onboarding.", "Hot infra play. Fund only with Web3 + smart-contract team. The moat is the bundler + paymaster + integration ecosystem.", [["Buyer?", "Web3 + agent app developers."], ["Pricing?", "Per AA operation + SaaS."], ["Defensibility?", "Bundler + ecosystem."]]],
      ["onchain-compliance-tools", "Onchain compliance tools", "Travel rule + KYT + transaction monitoring for crypto + stablecoin businesses.", "quarter", "hot", "Repos with chain-data ingest libraries, sanctions-screening adapters, and travel-rule integration frameworks.", "MICA + FinCEN + state crypto rules = mandatory onchain compliance.", ["Chainalysis adjacency", "TRM Labs", "Open-source onchain-compliance libraries"], "A blockchain explorer + an OFAC list + crossed fingers.", "Hot. Fund only with crypto + compliance team. The moat is the data + the regulatory breadth + the bank integrations.", [["Buyer?", "Crypto exchanges + stablecoin issuers + banks."], ["Pricing?", "Per transaction monitored."], ["Compliance?", "OFAC + FinCEN + MICA + state laws."]]],
      ["stablecoin-payment-rails", "Stablecoin payment rails", "USDC + USDT payments for B2B + cross-border — non-crypto-facing.", "team", "hot", "Repos with on-ramp + off-ramp adapters, multi-chain settlement libraries, and accounting integration frameworks.", "Stablecoin volume crossed $10T annualized. B2B payments are the killer app.", ["Bridge.xyz shape", "Conduit Payments", "Open-source stablecoin-rails libraries"], "A wire transfer + 1.5% spread + 2-day settlement.", "Hot. Fund only with payments + crypto team. The moat is the on/off-ramp + the compliance + the integrations.", [["Buyer?", "B2B importers / exporters + remittance + payroll."], ["Pricing?", "Bps + platform fee."], ["Compliance?", "FinCEN + MICA + state MSB."]]],
      ["defi-portfolio-managers", "DeFi portfolio managers", "Portfolio + risk + yield management for DeFi users + crypto funds.", "quarter", "trickle", "Repos with multi-chain DeFi adapters, risk-scoring libraries, and tax-reporting frameworks.", "DeFi-native investors need professional-grade tooling. Most use spreadsheets.", ["DeBank shape", "Zerion / Zapper", "Open-source DeFi-portfolio libraries"], "A wallet explorer + a Google Sheets.", "Vertical wedge for crypto-native users. The moat is the protocol breadth + the analytics + the tax integration.", [["Buyer?", "DeFi users + crypto funds."], ["Pricing?", "Subscription or % of AUM."], ["Defensibility?", "Protocol breadth + analytics."]]],
      ["nft-licensing-platforms", "NFT licensing platforms", "Royalty + licensing + IP-management for NFT + token IP.", "quarter", "trickle", "Repos with onchain royalty libraries, smart-contract enforcement tools, and IP-management integrations.", "NFT royalties are unenforced onchain. The licensing + enforcement layer is being rebuilt.", ["Royalty Registry adjacency", "Story Protocol", "Open-source NFT-licensing libraries"], "An OpenSea listing + ignored royalties.", "Speculative. Fund only with crypto + IP-law team. The moat is the enforcement + the regulatory + the platform partnerships.", [["Buyer?", "Brands + NFT creators."], ["Pricing?", "% of royalty + SaaS."], ["What kills this?", "OpenSea / Magic Eden centralizing royalties."]]],
      ["prediction-market-infrastructure", "Prediction market infrastructure", "Build + operate prediction markets — onchain or off.", "team", "trickle", "Repos with market-creation libraries, oracle integrations, and settlement-engine frameworks.", "Polymarket exposed the demand. The infra layer is open for vertical + niche markets.", ["Polymarket adjacency", "Kalshi", "Open-source prediction-market libraries"], "A Twitter poll + no liquidity.", "Speculative. Fund only with crypto + finance team. The moat is the liquidity + the regulatory + the oracle reliability.", [["Buyer?", "Market operators + media + research firms."], ["Pricing?", "% of volume."], ["Compliance?", "CFTC + state gambling laws."]]],
      ["real-world-asset-tokenization", "Real-world asset tokenization", "Tokenize real-world assets — real estate, treasuries, commodities — onchain.", "team", "steady", "Repos with smart-contract templates, KYC + accreditation libraries, and traditional-finance integrations.", "RWA tokenization is the institutional crypto wedge. Treasuries + RE + private credit are scaling.", ["Securitize shape", "Ondo Finance", "Open-source RWA-tokenization libraries"], "A private REIT + paper signatures.", "Heavy regulatory. Fund only with crypto + securities-law team. The moat is the regulatory + the asset-issuer relationships.", [["Buyer?", "Asset managers + issuers + institutional investors."], ["Pricing?", "% of AUM or platform fee."], ["Compliance?", "SEC + ESMA + state securities laws."]]],
      ["web3-game-rails", "Web3 game rails", "Game-specific Web3 rails — assets, identity, economies, marketplaces.", "team", "trickle", "Repos with game-engine adapters, asset-bridging libraries, and identity-bound NFT frameworks.", "Web3 gaming is slowly normalizing. The infrastructure layer is being decided.", ["Immutable X adjacency", "Sequence", "Open-source Web3-gaming libraries"], "A custom L2 + a 'why do we need this' debate.", "Speculative. Fund only with games + crypto team. The moat is the studio partnerships + the SDK quality + the cross-chain.", [["Buyer?", "Web3 game studios."], ["Pricing?", "Per transaction or per studio."], ["Defensibility?", "SDK + studio relationships."]]],
      ["dao-treasury-saas", "DAO treasury SaaS", "Treasury + accounting + payroll + governance for DAOs.", "quarter", "trickle", "Repos with multi-sig adapters, accounting libraries, and DAO-governance integration frameworks.", "DAOs are running real businesses. Treasury + accounting tooling is fragmented.", ["Llama / Karpatkey shape", "Coordinape", "Open-source DAO-treasury libraries"], "A multi-sig + a spreadsheet + paid-in-USDC chaos.", "Niche. Fund only with crypto-native team. The moat is the multi-sig integrations + the accounting + the governance.", [["Buyer?", "DAOs + crypto-native orgs."], ["Pricing?", "Per DAO per month."], ["Defensibility?", "Integration + workflow."]]],
      ["mev-protection-libraries", "MEV protection libraries", "MEV protection + private order flow for DeFi traders + protocols.", "team", "trickle", "Repos with private-pool adapters, MEV-blocker libraries, and order-flow auction integrations.", "MEV extraction is a $500M+/year tax on DeFi. Protection is a real wedge.", ["Flashbots Protect shape", "MEV Blocker", "Open-source MEV-protection libraries"], "A public-mempool transaction + sandwiched.", "Niche, technical. Fund only with crypto-native team. The moat is the protocol partnerships + the MEV-blocker accuracy.", [["Buyer?", "DeFi protocols + retail traders + wallets."], ["Pricing?", "% of order flow or per transaction."], ["Defensibility?", "Protocol + accuracy."]]],
    ]),
  },
);

// ---------------------------------------------------------------------------
// Helper used by the compact-form sector arrays above to avoid 200x duplicated
// object literal boilerplate. Each tuple is destructured into a Niche.
// ---------------------------------------------------------------------------

function makeNiches(
  rows: Array<
    [
      string, // slug
      string, // name
      string, // pitch
      BuildCost,
      DealVelocity,
      string, // signalShape
      string, // whyNow
      string[], // examples
      string, // competingFor
      string, // ourTake
      Array<[string, string]>, // faqs
    ]
  >,
): Niche[] {
  return rows.map(
    ([slug, name, pitch, buildCost, dealVelocity, signalShape, whyNow, examples, competingFor, ourTake, faqs]) => ({
      slug,
      name,
      pitch,
      buildCost,
      dealVelocity,
      signalShape,
      whyNow,
      examples,
      competingFor,
      ourTake,
      faqs: faqs.map(([q, a]) => ({ q, a })),
    }),
  );
}

export function getAllNicheSectorSlugs(): string[] {
  return nicheSectors.map((s) => s.slug);
}

export function getNicheSector(sectorSlug: string): NicheSector | undefined {
  return nicheSectors.find((s) => s.slug === sectorSlug);
}

export function getNiche(
  sectorSlug: string,
  nicheSlug: string,
): { sector: NicheSector; niche: Niche } | undefined {
  const sector = getNicheSector(sectorSlug);
  if (!sector) return undefined;
  const niche = sector.niches.find((n) => n.slug === nicheSlug);
  if (!niche) return undefined;
  return { sector, niche };
}

export function getAllNichePairs(): Array<{ sector: string; subniche: string }> {
  const out: Array<{ sector: string; subniche: string }> = [];
  for (const sector of nicheSectors) {
    for (const niche of sector.niches) {
      out.push({ sector: sector.slug, subniche: niche.slug });
    }
  }
  return out;
}

export function countNiches(): number {
  return nicheSectors.reduce((sum, s) => sum + s.niches.length, 0);
}

export function countSectors(): number {
  return nicheSectors.length;
}
