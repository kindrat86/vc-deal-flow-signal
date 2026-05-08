/**
 * Glossary terms — single source of truth.
 *
 * Consumed by /glossary (HTML page with JSON-LD) and /api/v1/glossary.json
 * (versioned machine-readable surface). Pass VII (2026-05-05) extracted
 * the inline `terms` array from app/glossary/page.tsx into this module so
 * both surfaces stay in sync.
 */

export interface GlossaryTerm {
  term: string;
  id: string;
  definition: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    term: "Commit Velocity",
    id: "commit-velocity",
    definition:
      "The total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. Commit velocity measures the raw volume of engineering output, not the quality or significance of individual commits. At VC Deal Flow Signal, we track commit velocity as a baseline metric — what matters most for investors is the rate of change (see: Commit Velocity Change).",
  },
  {
    term: "Commit Velocity Change",
    id: "commit-velocity-change",
    definition:
      "The percentage change in commit velocity compared to the preceding 14-day window. This is the primary ranking signal at VC Deal Flow Signal. A startup with 40 commits this period and 20 commits last period shows +100% velocity change. Commit velocity change measures engineering acceleration — whether a team is speeding up, maintaining pace, or slowing down. Sustained acceleration has historically preceded fundraise announcements by three to six weeks.",
  },
  {
    term: "Engineering Acceleration",
    id: "engineering-acceleration",
    definition:
      "A sustained increase in a startup's engineering output relative to its own historical baseline. Engineering acceleration is the core concept behind VC Deal Flow Signal: startups that are accelerating their engineering work are likely approaching a product milestone, scaling the team, or preparing for a fundraise. Unlike absolute engineering volume, acceleration captures the rate of change — making it useful across startups of different sizes.",
  },
  {
    term: "Deal Flow Signal",
    id: "deal-flow-signal",
    definition:
      "Any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels surface it. Traditional deal flow relies on warm introductions, pitch decks, and press coverage. Deal flow signal supplements this with quantitative data from sources like GitHub engineering activity, hiring patterns, and web traffic. The key advantage of signal-based deal sourcing is timing: signals typically appear weeks or months before a startup enters the mainstream investor pipeline.",
  },
  {
    term: "Contributor Growth",
    id: "contributor-growth",
    definition:
      "The change in the number of unique contributors to a startup's GitHub repository over time. Contributor growth is estimated by comparing recent six-week commit volume to the prior six-week period. A rising contributor count often signals team expansion — either through new hires, contractors, or open-source community adoption. For investors, contributor growth is a proxy for whether a startup is scaling its engineering team, which often follows a funding round.",
  },
  {
    term: "Engineering Hiring Burst",
    id: "engineering-hiring-burst",
    definition:
      "A signal type indicating that a startup's contributor growth rate exceeds 50% in a short window. Engineering hiring bursts typically mean the company has recently closed a funding round and is rapidly scaling the team. For investors, this signal may indicate you are too late for the current round but perfectly timed for the next one. It is one of four signal types tracked by VC Deal Flow Signal.",
  },
  {
    term: "Infrastructure Buildout",
    id: "infrastructure-buildout",
    definition:
      "A signal type indicating that a startup has created three or more new public repositories in 30 days. Infrastructure buildouts suggest the company is expanding its technical surface area — building new microservices, internal tools, SDKs, or platform components. This pattern is classic Series A behavior: the core product works, and now the team is building the platform around it.",
  },
  {
    term: "Deploy Frequency Spike",
    id: "deploy-frequency-spike",
    definition:
      "A signal type indicating that a startup's commit velocity has increased 150% or more versus its baseline. Deploy frequency spikes mean the team is shipping code at an unusually high rate. This can indicate a product launch, a pivot, iteration on early customer feedback, or a response to sudden demand. All of these are interesting to investors as potential indicators of product-market fit.",
  },
  {
    term: "Framework Migration",
    id: "framework-migration",
    definition:
      "A signal type indicating general engineering acceleration that does not fit the hiring burst, infrastructure buildout, or deploy spike categories. Framework migrations often indicate a technology stack transition — moving from a prototype stack to a production stack, or adopting new infrastructure. This is the subtlest signal type but can indicate the shift from exploration to exploitation, a key milestone in startup development.",
  },
  {
    term: "pSEO (Programmatic SEO)",
    id: "pseo",
    definition:
      "A content strategy that generates hundreds or thousands of search-optimized pages from structured data using templates. In the context of VC Deal Flow Signal, pSEO is used to create sector-specific startup ranking pages (e.g., 'AI Startups to Watch, Q2 2026') at scale. Each page targets a long-tail search query that investors might use when researching deal flow in specific sectors.",
  },
  {
    term: "GEO (Generative Engine Optimization)",
    id: "geo",
    definition:
      "The practice of structuring website content so that AI assistants and large language models (LLMs) can accurately cite it when answering user questions. GEO involves using structured data (JSON-LD), self-contained summary paragraphs, FAQ schema, and clear methodology documentation. Unlike traditional SEO which targets human search behavior, GEO targets the information retrieval patterns of AI systems like ChatGPT, Perplexity, and Claude.",
  },
  {
    term: "IndexNow",
    id: "indexnow",
    definition:
      "An open protocol that allows websites to notify search engines (Bing, Yandex, Seznam, Naver, and others) about new or updated content in real time. Instead of waiting for search engine crawlers to discover changes, IndexNow pushes URLs directly to participating engines. VC Deal Flow Signal uses IndexNow to ensure new sector rankings and blog posts are indexed within hours of publication.",
  },
  {
    term: "AEO (Answer Engine Optimization)",
    id: "aeo",
    definition:
      "Structuring content so that answer engines — Google's People-Also-Ask, Reddit pull-quotes, Quora top answers, ChatGPT search results, Perplexity citations — can extract a complete, self-contained answer in 40–80 words. AEO emphasises FAQPage and QAPage schema, atomic question-answer blocks, and explicit source attribution. VC Deal Flow Signal publishes a 200+ Q&A dataset at /qa.jsonl as an AEO surface for both human readers and retrieval pipelines.",
  },
  {
    term: "AIO (AI Overview Optimization)",
    id: "aio",
    definition:
      "The subset of GEO/AEO targeted specifically at Google's AI Overviews (formerly SGE). AIO combines clear topic sentences, FAQPage schema, Speakable selectors, HowTo structure, DefinedTerm sets, and quotable single-sentence facts. Google's AI Overview model preferentially extracts text wrapped in Speakable selectors and content surrounded by topical entity schema. VC Deal Flow Signal exposes /llms.txt, /llms-full.txt, /qa.jsonl, /md/* and a Speakable selector across pillar pages for this purpose.",
  },
  {
    term: "Scout Score",
    id: "scout-score",
    definition:
      "A 0–100 score computed from a GitHub user's public starring history, measuring how many validated unicorn outcomes the user starred before the funding, acquisition, or $1B-valuation event. The Scout Score is backwards-looking proof of taste — it says nothing about future picks until paired with the forward-looking Scout Game (see /predict). Free, no signup, instant. Available as a shields.io-style badge for any GitHub README.",
  },
  {
    term: "MCP (Model Context Protocol)",
    id: "mcp",
    definition:
      "An open standard from Anthropic for exposing tools and data to large-language-model hosts (Claude Desktop, Cursor, agentic frameworks). VC Deal Flow Signal ships a free MCP server — `npx @gitdealflow/mcp-signal` — that lets any MCP-compatible host call six read-only tools: get_trending_startups, get_signals_summary, get_methodology, get_startup_signal, search_startups_by_sector, get_methodology. The same surface is mirrored at /api/mcp/rpc (Streamable HTTP).",
  },
  {
    term: "A2A (Agent-to-Agent Protocol)",
    id: "a2a",
    definition:
      "Google's Agent-to-Agent protocol — a JSON-RPC envelope plus an /.well-known/agent-card.json descriptor that lets autonomous agents discover and call each other's capabilities. VC Deal Flow Signal publishes an AgentCard at /.well-known/agent-card.json and a JSON-RPC stub at /api/a2a so any A2A-compatible orchestrator can route deal-flow queries to the panel without bespoke integration.",
  },
  {
    term: "llms.txt",
    id: "llms-txt",
    definition:
      "A proposed standard for guiding LLMs and AI assistants to a site's most useful content surfaces in a single deterministic file. Similar in spirit to robots.txt or sitemap.xml but optimised for retrieval-augmented generation. VC Deal Flow Signal publishes /llms.txt (~800 lines, link-only) and /llms-full.txt (full content) plus per-page /md/* mirrors, so any LLM can resolve canonical context in one or two fetches.",
  },
  // ─── 2026-05-08 expansion: 22 new terms covering discoverability acronyms,
  // VC alpha vocabulary, GitHub-momentum nuance, and agent-protocol specifics.
  // Closes audit gap "18 glossary terms is light for an engineering-acceleration
  // vertical". Each term anchors retrievable Q&A surface area.
  {
    term: "Alpha Decay",
    id: "alpha-decay",
    definition:
      "The rate at which a quantitative signal loses its predictive power as the market discovers and arbitrages it. In venture capital, GitHub-momentum signals exhibit alpha decay because once a startup appears on every fund's dashboard the round is no longer un-allocated. VC Deal Flow Signal publishes the panel weekly to track decay empirically and adjusts threshold cutoffs as the signal saturates.",
  },
  {
    term: "Signal Latency",
    id: "signal-latency",
    definition:
      "The lag between an underlying event (commits land, contributor joins, repo created) and the moment a downstream signal pipeline records it. VC Deal Flow Signal targets a sub-7-day latency: events in the GitHub commit_activity stream land in the panel within one weekly refresh. Lower latency improves alpha but raises false-positive rates during one-off sprints.",
  },
  {
    term: "Leading Indicator",
    id: "leading-indicator",
    definition:
      "A measurement that changes before a downstream outcome of interest does, used to forecast that outcome. Engineering acceleration is a leading indicator of fundraise: in the SSRN panel of 219 confirmed rounds, sustained 14-day commit-velocity acceleration preceded the announcement by a median of three to six weeks. Compared to lagging indicators (press releases, Crunchbase entries) leading indicators give earlier entry but higher noise.",
  },
  {
    term: "Alternative Data",
    id: "alternative-data",
    definition:
      "Data sources outside traditional financial filings used by investors to gain an information edge — credit-card transactions, satellite imagery, app-download counts, and (in venture capital) public engineering activity. GitHub commit-velocity is alternative data for VC: it is observable, structured, and predictive of fundraise outcomes 3–6 weeks ahead of mainstream deal flow.",
  },
  {
    term: "Deal Flow Funnel",
    id: "deal-flow-funnel",
    definition:
      "The pipeline of startup opportunities a venture investor evaluates: top of funnel = sourced (warm intros, signals, cold outreach); middle = first call + diligence; bottom = term sheet and close. Signal-driven sourcing fills the top of the funnel with quantitatively-screened companies, raising the diligence-to-close ratio relative to networks alone.",
  },
  {
    term: "Gini Coefficient (commit distribution)",
    id: "gini-commit-distribution",
    definition:
      "A 0–1 measure of inequality in commit distribution across a startup's contributors over a window. Gini below 0.30 indicates broadly-distributed authorship; above 0.60 indicates one or two contributors carrying most of the load. The SSRN panel's strongest predictor combines high 14-day commit velocity with low contributor Gini (under 0.30) — orgs meeting both conditions are 3.4× more likely to announce a Series A within 60 days.",
  },
  {
    term: "Deploy Frequency",
    id: "deploy-frequency",
    definition:
      "The number of times a team ships code to production over a unit of time. In the GitHub-momentum context, deploy frequency is approximated by tag pushes, release events, and main-branch merges. A sustained 150%+ rise relative to the baseline qualifies as a Deploy Frequency Spike signal type at VC Deal Flow Signal — typically corresponding to launch preparation or rapid iteration on customer feedback.",
  },
  {
    term: "Code Review Velocity",
    id: "code-review-velocity",
    definition:
      "The median time from pull-request open to merge across a startup's most active repository. Falling code-review velocity (median dropping from 48h to under 6h) indicates a team has hit operational maturity — typically Series A onward. VC Deal Flow Signal exposes this as a secondary signal in /api/v1/signals.json under the `codeReviewVelocity` field.",
  },
  {
    term: "Repository Creation Cadence",
    id: "repo-creation-cadence",
    definition:
      "The rate at which a startup creates new public repositories under its organization. A burst — three or more new repos in 30 days — signals Infrastructure Buildout, suggesting the team is expanding technical surface area (microservices, internal tooling, SDKs). Classic Series A behavior: the core product works and now the team is building the platform around it.",
  },
  {
    term: "Language Migration",
    id: "language-migration",
    definition:
      "A measurable shift in the primary programming language mix of a startup's repositories over a quarter (e.g., 70% Python → 70% Go, or React → React Server Components). Language migrations classify under the Framework Migration signal type. They are the slowest-moving signal but strategically significant — usually indicating a re-architecture from prototype to production stack.",
  },
  {
    term: "Soft 404",
    id: "soft-404",
    definition:
      "A page that returns HTTP 200 OK but whose body is functionally a not-found page — empty content, a 'no results' message, or a Next.js notFound() boundary that wasn't wired to a 404 status. Search engines penalize soft 404s harshly. VC Deal Flow Signal's pSEO templates explicitly return 404 status when the underlying data slug is missing, avoiding the trap.",
  },
  {
    term: "Speakable Schema",
    id: "speakable-schema",
    definition:
      "A Schema.org property (SpeakableSpecification) that marks specific page sections as suitable for text-to-speech rendering by voice assistants and Google's AI Overviews. VC Deal Flow Signal applies the [data-speakable] attribute to canonical answer-body content on /faq, /answers/[slug], /research/[slug], and /pitch so AI Overview engines can extract a complete spoken response without re-summarizing the page.",
  },
  {
    term: "Knowledge Graph",
    id: "knowledge-graph",
    definition:
      "A machine-readable graph of entities (organizations, people, products, places) and the relationships between them, exposed via JSON-LD or formal RDF. VC Deal Flow Signal's Organization, Person, Service, Periodical, and SoftwareApplication nodes are interlinked via @id references and a comprehensive sameAs[] cross-graph (Wikidata Q139376302, ORCID, SSRN, Crunchbase, GitHub, npm) so AI retrieval engines can resolve the publication identity from any single page.",
  },
  {
    term: "ESO (Entity SEO)",
    id: "eso",
    definition:
      "The practice of optimizing for Knowledge Graph inclusion rather than keyword rank. ESO emphasizes formal entity descriptors (Organization @id, Wikidata QID, sameAs cross-graph), structured data, and consistent name-plus-attribute usage across the web. VC Deal Flow Signal carries Wikidata Q139376302 and a 23-link sameAs array to anchor itself as a single entity across Google, Bing, and AI retrieval engines.",
  },
  {
    term: "E-E-A-T",
    id: "eeat",
    definition:
      "Google's Experience-Expertise-Authoritativeness-Trustworthiness framework for evaluating content quality. Experience = first-hand involvement in the topic; Expertise = formal or proven knowledge; Authoritativeness = recognition by peers; Trustworthiness = security, transparency, and accountability. VC Deal Flow Signal anchors E-E-A-T via SSRN preprint (10.2139/ssrn.6606558), Zenodo DOI, ORCID-linked Person, /security.txt, /uptime, and CC BY 4.0 licensing across all surfaces.",
  },
  {
    term: "LLMO (Large Language Model Optimization)",
    id: "llmo",
    definition:
      "The umbrella term for optimizing a website's content and infrastructure to be accurately quoted, cited, and summarized by large language models. LLMO is the practical superset of GEO + AEO + AIO: it covers llms.txt, qa.jsonl, citation envelopes, freshness manifests, OpenAPI cross-references, and machine-readable Q&A endpoints. The goal is single-fetch resolution: an LLM should ground in the canonical content from one HTTP request.",
  },
  {
    term: "SXO (Search Experience Optimization)",
    id: "sxo",
    definition:
      "The convergence of SEO with Core Web Vitals and on-page UX signals: LCP, INP, CLS, accessibility (WCAG-AA), tap-target sizing, and dark-pattern avoidance. SXO recognizes that Google and Bing now rank pages partly on user-experience telemetry. VC Deal Flow Signal hits SXO via Next.js 16 App Router edge caching, Inter font with display:swap, and full WCAG-AA contrast/landmarks/headings (shipped 2026-05).",
  },
  {
    term: "VEO (Video Engine Optimization)",
    id: "veo",
    definition:
      "The video-search analog of SEO: structuring video metadata, captions, transcripts, and Schema.org VideoObject so YouTube and Google Video can rank and AI Overviews can quote. VC Deal Flow Signal publishes VideoObject JSON-LD, a /sitemap-videos.xml, and Whisper-generated captions for every uploaded YouTube video, plus thumbnail OG images that double as social cards.",
  },
  {
    term: "VSO (Voice Search Optimization)",
    id: "vso",
    definition:
      "Optimizing content so voice assistants (Alexa, Google Assistant, Siri) and conversational AI (ChatGPT voice mode, Claude voice) can deliver a complete spoken answer in a single utterance. VSO requires concise topic sentences, FAQPage schema with self-contained answers, Speakable schema marking the spoken-portion CSS selectors, and explicit AskAction targets so voice agents can pose follow-up questions programmatically.",
  },
  {
    term: "OpenAPI 3.1",
    id: "openapi-3-1",
    definition:
      "The current major version of the OpenAPI Specification (3.1.0, JSON Schema draft 2020-12 compatible) for describing REST APIs. VC Deal Flow Signal publishes a single unified contract at /api/openapi.json (and /.well-known/openapi.json) that carries `x-mcp-tool` annotations on operations and a top-level `x-mcp-server` enumerating MCP tools, resources, prompts, and templates — so REST consumers and MCP agents map the surface in one fetch.",
  },
  {
    term: "x402 (HTTP-Native Payments)",
    id: "x402",
    definition:
      "An open protocol that uses HTTP 402 Payment Required as a real status code: the server returns a payment challenge (asset, chain, amount, payTo address), the client signs and resubmits with an `X-Payment` header, the server verifies and serves the response. VC Deal Flow Signal's get_deep_signal MCP tool charges €0.19 USDC on Base via x402, with misses (404) free and only hits charged. The pay-to address is a CDP Server Wallet v2 named `x402-paygo`.",
  },
  {
    term: "Streamable HTTP (MCP transport)",
    id: "streamable-http",
    definition:
      "The MCP 2025-06-18 specification's canonical HTTP transport: a single bidirectional endpoint that supports both POST (request/response JSON-RPC) and GET (server-sent-events for streaming notifications). Replaces the older HTTP+SSE split-endpoint design. VC Deal Flow Signal's MCP server runs on Streamable HTTP at /api/mcp/rpc; the same surface is also installable via stdio (`npx @gitdealflow/mcp-signal`).",
  },
];
