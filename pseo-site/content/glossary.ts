/**
 * Glossary terms, single source of truth.
 *
 * Consumed by /glossary (HTML page with JSON-LD) and /api/v1/glossary.json
 * (versioned machine-readable surface). Pass VII (2026-05-05) extracted
 * the inline `terms` array from app/glossary/page.tsx into this module so
 * both surfaces stay in sync.
 *
 * 2026-05-08 (F37): expanded 18 → 62 terms across four families -
 * engineering-acceleration metrics, discoverability surfaces, academic
 * citation infrastructure, and venture vocabulary, to anchor more
 * Q&A volume per the AEO audit.
 */

export interface GlossaryTerm {
  term: string;
  id: string;
  definition: string;
  /** Featured-snippet target: a self-contained 40-55 word direct answer. */
  snippet?: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  // ── Code-Side Sourcing, the named category ────────────────────────────
  {
    term: "Code-Side Sourcing",
    id: "code-side-sourcing",
    snippet:
      "Code-side sourcing is the practice of using public repository-velocity data as a leading indicator of venture-stage outcomes, surfacing fundraises 21 to 47 days before pitch decks circulate. It is a sub-category of alternative data, narrowed to engineering-side public GitHub activity, and it runs alongside warm intros and databases rather than replacing them.",
    definition:
      "The category VC Deal Flow Signal defines: the practice of using public repository-velocity data as a leading indicator of venture-stage outcomes, surfacing fundraises 21 to 47 days before pitch decks circulate. Three properties make a sourcing channel Code-Side: (1) the input data is public and reproducible from primary sources, (2) the signal arrives before the company actively markets the round, (3) the methodology is published and falsifiable, not opaque. Code-Side Sourcing is a sub-category of alternative data, narrowed to engineering-side public repository activity, and runs alongside warm intros, decks, and databases rather than replacing them. The full canonical definition, what it replaces, the five first principles, and the practitioner list live at /code-side-sourcing.",
  },
  // ── Engineering acceleration: core metrics ──────────────────────────────
  {
    term: "Commit-Velocity Acceleration Engine",
    id: "commit-velocity-acceleration-engine",
    snippet:
      "The Commit-Velocity Acceleration Engine is the published mechanism behind VC Deal Flow Signal. It pulls 14-day commit volume per organization from the public GitHub REST API, computes the percentage change against the prior window, requires two-period confirmation, scores contributor concentration with a Gini coefficient, then classifies each breakout into one of four signal types.",
    definition:
      "The named mechanism behind VC Deal Flow Signal. Five deterministic steps: (1) pull 14-day commit volume per organization from the public GitHub REST API with the bot filter applied, (2) compute the percentage delta against the prior 14-day window, (3) require two-period confirmation before a breakout becomes actionable, (4) score contributor concentration with the Gini coefficient, (5) classify the breakout into one of four signal types (Hiring Burst, Infrastructure Buildout, Deploy Spike, Framework Migration). The engine is published, sourced, and reproducible, see /mechanism for the full formula and the SSRN proof panel. The engine is the formal implementation of the broader category: Code-Side Sourcing.",
  },
  {
    term: "Commit Velocity",
    id: "commit-velocity",
    snippet:
      "Commit velocity is the total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. It measures raw engineering output volume, not code quality, and is tracked as a baseline metric. For investors, what matters most is the rate of change, which is captured by commit velocity change.",
    definition:
      "The total number of commits to a startup's most active public GitHub repository over a rolling 14-day window. Commit velocity measures the raw volume of engineering output, not the quality or significance of individual commits. At VC Deal Flow Signal, we track commit velocity as a baseline metric, what matters most for investors is the rate of change (see: Commit Velocity Change).",
  },
  {
    term: "Commit Velocity Change",
    id: "commit-velocity-change",
    snippet:
      "Commit velocity change is the percentage change in commit velocity compared with the preceding 14-day window. It is the primary ranking signal at VC Deal Flow Signal: a startup with 40 commits this period and 20 last period shows +100% velocity change. Sustained acceleration has historically preceded fundraise announcements by three to six weeks.",
    definition:
      "The percentage change in commit velocity compared to the preceding 14-day window. This is the primary ranking signal at VC Deal Flow Signal. A startup with 40 commits this period and 20 commits last period shows +100% velocity change. Commit velocity change measures engineering acceleration, whether a team is speeding up, maintaining pace, or slowing down. Sustained acceleration has historically preceded fundraise announcements by three to six weeks.",
  },
  {
    term: "Engineering Acceleration",
    id: "engineering-acceleration",
    snippet:
      "Engineering acceleration is a sustained increase in a startup's engineering output relative to its own historical baseline. It is the core concept behind VC Deal Flow Signal: startups that are accelerating engineering work are likely approaching a product milestone, scaling the team, or preparing for a fundraise. Unlike absolute volume, it measures rate of change.",
    definition:
      "A sustained increase in a startup's engineering output relative to its own historical baseline. Engineering acceleration is the core concept behind VC Deal Flow Signal: startups that are accelerating their engineering work are likely approaching a product milestone, scaling the team, or preparing for a fundraise. Unlike absolute engineering volume, acceleration captures the rate of change, making it useful across startups of different sizes.",
  },
  {
    term: "Deal Flow Signal",
    id: "deal-flow-signal",
    snippet:
      "A deal flow signal is any data-driven indicator that helps an investor identify a promising startup before traditional sourcing channels surface it. Unlike warm introductions, pitch decks, and press coverage, signals are quantitative, and their key advantage is timing: they typically appear weeks or months before a startup enters the mainstream investor pipeline.",
    definition:
      "Any data-driven indicator that helps an investor identify a promising startup before traditional deal sourcing channels surface it. Traditional deal flow relies on warm introductions, pitch decks, and press coverage. Deal flow signal supplements this with quantitative data from sources like GitHub engineering activity, hiring patterns, and web traffic. The key advantage of signal-based deal sourcing is timing: signals typically appear weeks or months before a startup enters the mainstream investor pipeline.",
  },
  {
    term: "Contributor Growth",
    id: "contributor-growth",
    snippet:
      "Contributor growth is the change in the number of unique contributors to a startup's GitHub repository over time, estimated by comparing recent six-week commit volume with the prior six-week period. A rising contributor count often signals team expansion through new hires, contractors, or open-source adoption.",
    definition:
      "The change in the number of unique contributors to a startup's GitHub repository over time. Contributor growth is estimated by comparing recent six-week commit volume to the prior six-week period. A rising contributor count often signals team expansion, either through new hires, contractors, or open-source community adoption. For investors, contributor growth is a proxy for whether a startup is scaling its engineering team, which often follows a funding round.",
  },
  {
    term: "Engineering Hiring Burst",
    id: "engineering-hiring-burst",
    snippet:
      "An engineering hiring burst is a signal type triggered when a startup's contributor growth rate exceeds 50% in a short window. It typically means the company recently closed a round and is scaling fast. For investors, it can mean being too late for the current round but well timed for the next.",
    definition:
      "A signal type indicating that a startup's contributor growth rate exceeds 50% in a short window. Engineering hiring bursts typically mean the company has recently closed a funding round and is rapidly scaling the team. For investors, this signal may indicate you are too late for the current round but perfectly timed for the next one. It is one of four signal types tracked by VC Deal Flow Signal.",
  },
  {
    term: "Infrastructure Buildout",
    id: "infrastructure-buildout",
    snippet:
      "An infrastructure buildout is a signal type triggered when a startup creates three or more new public repositories in 30 days. It suggests the company is expanding its technical surface area: new microservices, internal tools, SDKs, or platform components. The pattern is classic Series A behavior.",
    definition:
      "A signal type indicating that a startup has created three or more new public repositories in 30 days. Infrastructure buildouts suggest the company is expanding its technical surface area, building new microservices, internal tools, SDKs, or platform components. This pattern is classic Series A behavior: the core product works, and now the team is building the platform around it.",
  },
  {
    term: "Deploy Frequency Spike",
    id: "deploy-frequency-spike",
    snippet:
      "A deploy frequency spike is a signal type triggered when a startup's commit velocity increases 150% or more versus its baseline. The team is shipping code at an unusually high rate, which can indicate a product launch, a pivot, iteration on early customer feedback, or a response to sudden demand.",
    definition:
      "A signal type indicating that a startup's commit velocity has increased 150% or more versus its baseline. Deploy frequency spikes mean the team is shipping code at an unusually high rate. This can indicate a product launch, a pivot, iteration on early customer feedback, or a response to sudden demand. All of these are interesting to investors as potential indicators of product-market fit.",
  },
  {
    term: "Framework Migration",
    id: "framework-migration",
    snippet:
      "A framework migration is a signal type for general engineering acceleration that does not fit the hiring burst, infrastructure buildout, or deploy spike categories. It often indicates a technology stack transition, such as moving from a prototype stack to a production stack.",
    definition:
      "A signal type indicating general engineering acceleration that does not fit the hiring burst, infrastructure buildout, or deploy spike categories. Framework migrations often indicate a technology stack transition, moving from a prototype stack to a production stack, or adopting new infrastructure. This is the subtlest signal type but can indicate the shift from exploration to exploitation, a key milestone in startup development.",
  },
  {
    term: "Bot Filter",
    id: "bot-filter",
    snippet:
      "A bot filter is the deterministic exclusion rule that removes commits authored by automated accounts, such as Dependabot, Renovate, and GitHub Actions, plus any account name matching 'bot', before aggregation runs. Filtering happens at commit level, so human commits in repos that also receive bot traffic are still counted.",
    definition:
      "The deterministic exclusion rule that removes commits authored by automated accounts (Dependabot, Renovate, GitHub Actions, and any account name matching the substring 'bot') before any aggregation runs. Bot filtering is applied at the commit level, not the repository level, so a human-authored commit in a repo that also receives bot traffic is still counted. Without this filter the framework-migration signal type would be inflated by lockfile churn and the resulting ranking would be noise.",
  },
  {
    term: "Two-Period Confirmation",
    id: "two-period-confirmation",
    snippet:
      "Two-period confirmation is the rule that an acceleration breakout must persist into a second 14-day window before VC Deal Flow Signal treats it as actionable. Fourteen-day windows are volatile, so the rule removes most one-off noise while keeping the signal early enough to precede a fundraise by three to six weeks.",
    definition:
      "The rule that an acceleration breakout must persist into a second 14-day window before VC Deal Flow Signal treats it as actionable. The 14-day window is responsive but volatile, so single-period spikes from hackathons, launch sprints, or one new contributor onboarding are common. Two-period confirmation removes most of that noise while keeping the signal early enough to precede a fundraise by three to six weeks. The same rule is applied to contributor-growth signals.",
  },
  {
    term: "Top-Contributor Concentration",
    id: "top-contributor-concentration",
    snippet:
      "Top-contributor concentration is the Gini coefficient of commit distribution across contributors over a 14-day window. Below 0.30, commits are spread broadly; above 0.70, one or two contributors do most of the work. With high velocity, low concentration is the strongest predictor: those orgs are 3.4x more likely to announce a Series A within 60 days.",
    definition:
      "The Gini coefficient of commit distribution across contributors over the same 14-day window used for velocity. A score below 0.30 means commits are spread broadly across the team; a score above 0.70 means one or two contributors are doing most of the work. Combined with high velocity, low concentration is the strongest single composite predictor in the SSRN panel, orgs meeting both conditions are 3.4× more likely to announce a Series A within 60 days than orgs with high velocity alone.",
  },

  // ── Discoverability: programmatic SEO + AEO/GEO/AIO surfaces ────────────
  {
    term: "pSEO (Programmatic SEO)",
    id: "pseo",
    snippet:
      "Programmatic SEO, pSEO for short, is a content strategy that generates hundreds or thousands of search-optimized pages from structured data using templates. At VC Deal Flow Signal, it powers sector-specific startup ranking pages such as 'AI Startups to Watch, Q2 2026', each targeting a long-tail query investors use when researching deal flow in specific sectors.",
    definition:
      "A content strategy that generates hundreds or thousands of search-optimized pages from structured data using templates. In the context of VC Deal Flow Signal, pSEO is used to create sector-specific startup ranking pages (e.g., 'AI Startups to Watch, Q2 2026') at scale. Each page targets a long-tail search query that investors might use when researching deal flow in specific sectors.",
  },
  {
    term: "GEO (Generative Engine Optimization)",
    id: "geo",
    snippet:
      "Generative Engine Optimization, GEO, is the practice of structuring content so AI assistants and large language models can accurately cite it when answering questions. It uses structured data such as JSON-LD, self-contained summary paragraphs, FAQ schema, and clear methodology documentation. GEO targets the retrieval patterns of AI systems like ChatGPT, Perplexity, and Claude.",
    definition:
      "The practice of structuring website content so that AI assistants and large language models (LLMs) can accurately cite it when answering user questions. GEO involves using structured data (JSON-LD), self-contained summary paragraphs, FAQ schema, and clear methodology documentation. Unlike traditional SEO which targets human search behavior, GEO targets the information retrieval patterns of AI systems like ChatGPT, Perplexity, and Claude.",
  },
  {
    term: "IndexNow",
    id: "indexnow",
    snippet:
      "IndexNow is an open protocol that lets websites notify search engines such as Bing, Yandex, Seznam, and Naver about new or updated content in real time. Instead of waiting for crawlers to discover changes, IndexNow pushes URLs directly to participating engines. VC Deal Flow Signal uses it to get new sector rankings indexed within hours.",
    definition:
      "An open protocol that allows websites to notify search engines (Bing, Yandex, Seznam, Naver, and others) about new or updated content in real time. Instead of waiting for search engine crawlers to discover changes, IndexNow pushes URLs directly to participating engines. VC Deal Flow Signal uses IndexNow to ensure new sector rankings and blog posts are indexed within hours of publication.",
  },
  {
    term: "AEO (Answer Engine Optimization)",
    id: "aeo",
    snippet:
      "Answer Engine Optimization, AEO, structures content so answer engines can extract complete, self-contained answers in 40 to 80 words. It emphasizes FAQPage and QAPage schema, atomic question-answer blocks, and explicit source attribution. VC Deal Flow Signal publishes a 200+ question-answer dataset at /qa.jsonl as an AEO surface for human readers and retrieval pipelines alike.",
    definition:
      "Structuring content so that answer engines, Google's People-Also-Ask, Reddit pull-quotes, Quora top answers, ChatGPT search results, Perplexity citations, can extract a complete, self-contained answer in 40-80 words. AEO emphasises FAQPage and QAPage schema, atomic question-answer blocks, and explicit source attribution. VC Deal Flow Signal publishes a 200+ Q&A dataset at /qa.jsonl as an AEO surface for both human readers and retrieval pipelines.",
  },
  {
    term: "AIO (AI Overview Optimization)",
    id: "aio",
    snippet:
      "AI Overview Optimization, AIO, is the subset of GEO and AEO aimed specifically at Google's AI Overviews. It combines clear topic sentences, FAQPage schema, Speakable selectors, HowTo structure, and quotable single-sentence facts, because Google's AI Overview model preferentially extracts text wrapped in Speakable selectors and topical entity schema.",
    definition:
      "The subset of GEO/AEO targeted specifically at Google's AI Overviews (formerly SGE). AIO combines clear topic sentences, FAQPage schema, Speakable selectors, HowTo structure, DefinedTerm sets, and quotable single-sentence facts. Google's AI Overview model preferentially extracts text wrapped in Speakable selectors and content surrounded by topical entity schema. VC Deal Flow Signal exposes /llms.txt, /llms-full.txt, /qa.jsonl, /md/* and a Speakable selector across pillar pages for this purpose.",
  },
  {
    term: "Speakable Schema",
    id: "speakable-schema",
    snippet:
      "Speakable schema is a Schema.org property that marks specific page elements as suitable for text-to-speech reading, used primarily by Google Assistant and AI Overviews. A SpeakableSpecification carries a cssSelector or xPath array pointing at the speakable elements; pages that mark their topic sentences as speakable are preferentially extracted into voice answers and summary panels.",
    definition:
      "A Schema.org property that marks specific elements of a page as suitable for text-to-speech reading, used primarily by Google Assistant and AI Overviews. SpeakableSpecification carries a cssSelector or xPath array pointing at the speakable elements; on this site the selector includes [data-speakable], h1, h2, and [data-agent-summary]. Pages that mark their topic sentences as speakable are preferentially extracted into voice answers and short summary panels.",
  },
  {
    term: "JSON-LD",
    id: "json-ld",
    snippet:
      "JSON-LD, JavaScript Object Notation for Linked Data, is the W3C-standard syntax for embedding structured data in web pages. It is the preferred format for Schema.org markup because it lives in a single script-tag block decoupled from the HTML body. VC Deal Flow Signal emits JSON-LD on every page and exposes machine-readable mirrors at /api/v1/*.json.",
    definition:
      "JavaScript Object Notation for Linked Data, the W3C-standard syntax for embedding structured data in web pages. JSON-LD is the preferred format for Schema.org markup because it lives in a single script-tag block decoupled from the HTML body. VC Deal Flow Signal emits JSON-LD on every page (Organization, WebSite, Article, FAQPage, BreadcrumbList, etc.) and exposes machine-readable mirrors at /api/v1/*.json with full @context and @graph payloads.",
  },
  {
    term: "FAQPage Schema",
    id: "faqpage-schema",
    snippet:
      "FAQPage schema is a Schema.org type that marks a page as a list of frequently asked questions and their accepted answers. FAQPage entries are eligible for rich-result treatment in Google search and are heavily referenced by AI Overviews. Each entry is a Question with a single accepted Answer.",
    definition:
      "A Schema.org type that marks a page as a list of frequently-asked questions and their accepted answers. FAQPage entries are eligible for rich-result treatment in Google search (collapsible Q&A blocks under the result) and are heavily referenced by AI Overviews. Each entry is a Question with a single acceptedAnswer (Answer). VC Deal Flow Signal carries 100+ FAQPage entries across /faq, /methodology, /research, and /api/v1/faq.json.",
  },
  {
    term: "QAPage Schema",
    id: "qapage-schema",
    snippet:
      "QAPage schema is a Schema.org type that marks a page where one primary question receives one accepted answer, optionally with suggested answers. It is distinct from FAQPage: QAPage describes the page itself as a single Q&A, while FAQPage describes a list of supplementary Q&As. Google treats QAPage as a separate rich-result family in AI Overviews.",
    definition:
      "A Schema.org type that marks a page where one primary question receives one accepted answer (with optional suggested answers). QAPage is distinct from FAQPage, QAPage describes the page itself as a single Q&A, FAQPage describes a list of supplementary Q&As. Google treats QAPage as a separate rich-result family in AI Overviews. VC Deal Flow Signal uses QAPage on every /answers/[slug] route and FAQPage on the same pages for additional related questions.",
  },
  {
    term: "HowTo Schema",
    id: "howto-schema",
    snippet:
      "HowTo schema is a Schema.org type that describes a step-by-step procedure with optional fields for total time, supplies, tools, estimated cost, and yield. It is the preferred way to expose methodologies and operational checklists to search engines and LLMs. VC Deal Flow Signal emits HowTo on /methodology describing the five-step weekly pipeline.",
    definition:
      "A Schema.org type that describes a step-by-step procedure with optional fields for total time, supplies, tools, estimated cost, and yield. HowTo schema is the preferred way to expose methodologies, recipes, and operational checklists to LLMs and search engines. VC Deal Flow Signal emits HowTo on /methodology and /api/v1/methodology.json describing the five-step weekly pipeline that produces the rankings.",
  },
  {
    term: "BreadcrumbList Schema",
    id: "breadcrumblist-schema",
    snippet:
      "BreadcrumbList schema is a Schema.org type that describes the hierarchical position of a page within a site as an ordered list of ListItem entries. It gives search engines and LLMs a deterministic crawl-depth signal and renders as a hierarchical breadcrumb in Google search results. VC Deal Flow Signal emits BreadcrumbList on every leaf page.",
    definition:
      "A Schema.org type that describes the hierarchical position of a page within a site, expressed as an ordered list of ListItem entries. BreadcrumbList markup gives search engines and LLMs a deterministic crawl-depth signal and is rendered as a hierarchical breadcrumb in Google search results. VC Deal Flow Signal emits BreadcrumbList on every leaf page and faceted hub.",
  },
  {
    term: "DefinedTermSet",
    id: "defined-term-set",
    snippet:
      "A DefinedTermSet is a Schema.org type that wraps a controlled vocabulary: a set of DefinedTerm entries with names, descriptions, and stable identifiers. It is the Schema.org-native way to publish a glossary that LLMs can ground on. VC Deal Flow Signal exposes its glossary as a DefinedTermSet at /api/v1/glossary.json, each term carrying a stable URL fragment.",
    definition:
      "A Schema.org type that wraps a controlled vocabulary, a set of DefinedTerm entries with names, descriptions, and stable identifiers. DefinedTermSet is the Schema.org-native way to publish a glossary that LLMs can ground on. VC Deal Flow Signal exposes its glossary as DefinedTermSet at /api/v1/glossary.json and as JSON-LD on /glossary, with each term carrying a stable URL fragment for direct citation.",
  },
  {
    term: "Hreflang",
    id: "hreflang",
    snippet:
      "Hreflang is an HTML link-element annotation, or sitemap entry, that signals the language and region of a page to search engines. It prevents duplicate-content penalties when the same page exists in multiple locales and ensures the right language version surfaces in the right region. VC Deal Flow Signal advertises 12 locales with bidirectional hreflang.",
    definition:
      "An HTML link-element annotation (or sitemap entry) that signals the language and region of a page to search engines. Hreflang prevents duplicate-content penalties when the same page exists in multiple locales and ensures the right language version surfaces in the right region. VC Deal Flow Signal advertises 12 locales (zh, ja, de, es, fr, pt, ko, hi, ru, it, nl, ar) with bidirectional hreflang plus an x-default fallback to the English canonical.",
  },
  {
    term: "Canonical URL",
    id: "canonical-url",
    snippet:
      "A canonical URL is a link-element annotation (rel=canonical) that designates one URL as the authoritative version of a page when multiple URLs serve the same content. Canonical tags collapse duplicate-content signals into a single ranked URL. VC Deal Flow Signal sets canonicals through Next.js metadata on every route, with bidirectional hreflang across all 12 locales.",
    definition:
      "A link-element annotation (rel=canonical) that designates one URL as the authoritative version of a page when multiple URLs serve the same content. Canonical tags collapse duplicate-content signals into a single ranked URL. VC Deal Flow Signal sets canonical URLs through Next.js metadata.alternates.canonical on every route, with bidirectional hreflang reciprocation across the 12 supported locales.",
  },
  {
    term: "robots.txt",
    id: "robots-txt",
    snippet:
      "robots.txt is a plaintext file at a website's root that tells web crawlers which paths they may or may not fetch, per RFC 9309. VC Deal Flow Signal's robots.txt explicitly allow-lists 30+ AI crawlers such as GPTBot, ClaudeBot, and PerplexityBot by name, and disallows authentication, webhook, cron, and dashboard surfaces.",
    definition:
      "A plaintext file at the root of a website that tells web crawlers which paths they may or may not fetch. The format is RFC 9309. VC Deal Flow Signal's robots.txt explicitly allow-lists 30+ AI crawlers (GPTBot, ClaudeBot, PerplexityBot, GoogleOther, Mistral, Cohere, Apple-AI, Meta-ExternalFetcher and others) by name rather than relying on the wildcard, and disallows authentication, webhook, cron, and dashboard surfaces.",
  },
  {
    term: "sitemap.xml",
    id: "sitemap-xml",
    snippet:
      "sitemap.xml is an XML file that lists the canonical URLs a website wants indexed. VC Deal Flow Signal serves a sitemap index at /sitemap.xml pointing at five sharded child sitemaps plus separate news, image, video, and i18n sitemaps, together advertising 5,000+ URLs across human and machine surfaces.",
    definition:
      "An XML file that lists the canonical URLs a website wants indexed. The format is sitemaps.org. VC Deal Flow Signal serves a sitemap-index at /sitemap.xml that points at five sharded child sitemaps (core, sectors, crossings, startups, content) plus separate /news-sitemap.xml, /sitemap-images.xml, /sitemap-videos.xml, and /sitemap-i18n.xml, together advertising 5,000+ URLs across human and machine surfaces.",
  },
  {
    term: "OpenAPI 3.1",
    id: "openapi-3-1",
    snippet:
      "OpenAPI 3.1 is the current major version of the OpenAPI Specification, a vendor-neutral schema for describing HTTP APIs. It fully aligns with JSON Schema 2020-12 and supports webhooks. VC Deal Flow Signal serves an OpenAPI 3.1 contract at /api/openapi.json describing 25 REST operations across 11 tags.",
    definition:
      "The current major version of the OpenAPI Specification, a vendor-neutral schema for describing HTTP APIs. OpenAPI 3.1 is the version that fully aligns with JSON Schema 2020-12 and supports webhooks. VC Deal Flow Signal serves an OpenAPI 3.1 contract at /api/openapi.json (and four well-known mirrors), describing 25 REST operations across 11 tags with x-mcp-tool annotations cross-referencing the parallel MCP server.",
  },
  {
    term: "x-mcp-tool Vendor Extension",
    id: "x-mcp-tool",
    snippet:
      "The x-mcp-tool vendor extension is a property added to OpenAPI operations that names the corresponding MCP tool, so a single OpenAPI fetch maps every REST endpoint to its agent-callable equivalent. VC Deal Flow Signal uses it on five OpenAPI operations plus a top-level x-mcp-server enumerating 8 tools, 3 resources, 2 templates, and 5 prompts.",
    definition:
      "A vendor-extension property added to OpenAPI operations that names the corresponding MCP tool, so a single OpenAPI fetch maps every REST endpoint to its agent-callable equivalent. VC Deal Flow Signal uses x-mcp-tool on five OpenAPI operations (get_signals_summary, get_startup_signal, get_methodology, get_deep_signal, share_result) plus a top-level x-mcp-server enumerating 8 tools, 3 resources, 2 templates, and 5 prompts in one document.",
  },
  {
    term: "discover.json Manifest",
    id: "discover-json",
    snippet:
      "discover.json is a central DataCatalog manifest at /.well-known/discover.json that enumerates every discovery surface a site exposes: well-known files, root aliases, /api/v1/*, sitemaps, feeds, and policy files. Each surface carries a slug name, canonical URL, MIME type, category, and description, so a fresh agent can map an entire site in a single fetch.",
    definition:
      "A central DataCatalog manifest at /.well-known/discover.json that enumerates every discovery surface a site exposes, well-known files, root aliases, /api/v1/*, sitemaps, feeds, and policy files. Each surface carries a kebab-slug name, canonical URL, MIME type, category, description, and (for canonical APIs) a rich endpoints[] array with method, parameters, responses, security, and x-mcp-tool cross-references. A fresh agent can map an entire site in a single fetch.",
  },
  {
    term: "ai.txt and ai-policy.json",
    id: "ai-policy",
    snippet:
      "ai.txt and ai-policy.json are emerging conventions for advertising a site's policy toward AI training and retrieval. ai.txt is the human-readable analog to robots.txt; ai-policy.json is the machine-readable counterpart with per-agent allow and deny rules. VC Deal Flow Signal publishes both, explicitly allowing crawl, training, and retrieval under CC BY 4.0 with attribution.",
    definition:
      "Emerging conventions for advertising a site's policy toward AI training and retrieval. ai.txt is the human-readable analog to robots.txt; ai-policy.json is the machine-readable counterpart with per-agent allow/deny rules. VC Deal Flow Signal publishes both at the root and at /.well-known/ along with /openai-search.json and /.well-known/ai.json, explicitly allowing crawl, training, and retrieval under CC BY 4.0 with attribution.",
  },
  {
    term: "qa.jsonl",
    id: "qa-jsonl",
    snippet:
      "qa.jsonl is a newline-delimited JSON file where every line is one question-answer pair. The format is RAG-friendly: a retrieval pipeline can stream the file, score each line against a query, and cite the answer text without further parsing. VC Deal Flow Signal serves /qa.jsonl carrying the same 300+ Q&A corpus that backs /api/answer and /api/ask.",
    definition:
      "A newline-delimited JSON file where every line is one self-contained question-answer pair. The format is RAG-friendly: a retrieval pipeline can stream the file, score each line against a query, and cite the exact answer text without further parsing. VC Deal Flow Signal serves /qa.jsonl (and /.well-known/qa.jsonl) carrying the same 300+ Q&A corpus that backs /api/answer and /api/ask, all under CC BY 4.0.",
  },
  {
    term: "llms.txt",
    id: "llms-txt",
    snippet:
      "llms.txt is a proposed standard for guiding LLMs and AI assistants to a site's most useful content surfaces in a single file, similar in spirit to robots.txt but optimised for retrieval-augmented generation. VC Deal Flow Signal publishes /llms.txt and /llms-full.txt plus per-page /md/* mirrors, so any LLM can resolve context in one or two fetches.",
    definition:
      "A proposed standard for guiding LLMs and AI assistants to a site's most useful content surfaces in a single deterministic file. Similar in spirit to robots.txt or sitemap.xml but optimised for retrieval-augmented generation. VC Deal Flow Signal publishes /llms.txt (~800 lines, link-only) and /llms-full.txt (full content) plus per-page /md/* mirrors, so any LLM can resolve canonical context in one or two fetches.",
  },
  {
    term: "llms-full.txt",
    id: "llms-full-txt",
    snippet:
      "llms-full.txt is the full-content companion to llms.txt, a single file containing the canonical body text of a site's pillar pages concatenated for one-fetch retrieval. Where llms.txt lists URLs and short summaries, llms-full.txt inlines the prose so an LLM can ground without follow-up fetches. VC Deal Flow Signal serves it at the root and at /.well-known/.",
    definition:
      "The full-content companion to llms.txt, a single file containing the canonical body text of a site's pillar pages concatenated for one-fetch retrieval. Where llms.txt lists URLs and short summaries, llms-full.txt inlines the prose so an LLM can ground without follow-up fetches. VC Deal Flow Signal mirrors the same content at the root and at /.well-known/llms-full.txt for direct content delivery (200, no redirects).",
  },
  {
    term: "Schema.org",
    id: "schema-org",
    snippet:
      "Schema.org is the collaborative vocabulary maintained by Google, Microsoft, Yahoo, and Yandex for structuring on-page metadata. It defines hundreds of types, including Organization, Article, FAQPage, HowTo, and Dataset, and is the canonical vocabulary for JSON-LD markup. VC Deal Flow Signal emits 60+ distinct Schema.org types across the site.",
    definition:
      "The collaborative vocabulary maintained by Google, Microsoft, Yahoo, and Yandex for structuring on-page metadata. Schema.org defines hundreds of types (Organization, Article, FAQPage, HowTo, Dataset, etc.) and is the canonical vocabulary for JSON-LD markup. VC Deal Flow Signal emits 60+ distinct Schema.org types across the site, including academic research types like ScholarlyArticle and Periodical that anchor SSRN-paper-grade citations.",
  },
  {
    term: "ClaimReview",
    id: "claim-review",
    snippet:
      "ClaimReview is a Schema.org type that marks a fact-check or claim assessment with a claimReviewed text and a numeric reviewRating. It is the schema Google uses to surface fact-check labels in search results. VC Deal Flow Signal emits ClaimReview on /predicted, marking the weekly Acceleration Watch prediction as a falsifiable claim with an as-of date.",
    definition:
      "A Schema.org type that marks a structured fact-check or claim assessment, with a claimReviewed text and a numeric reviewRating. ClaimReview is the schema Google uses to surface fact-check labels in search results. VC Deal Flow Signal emits ClaimReview on /predicted, marking the weekly Acceleration Watch prediction as a falsifiable claim with an as-of date, the same reproducibility commitment that anchors the Pricing Hold pillar of the manifesto.",
  },
  {
    term: "Quotation Schema",
    id: "quotation-schema",
    snippet:
      "Quotation schema is a Schema.org type for a single quoted statement, with text, optional spokenByCharacter, creator, and isPartOf fields. It is the schema LLMs prefer when extracting a citable single-sentence claim from a longer document. VC Deal Flow Signal emits Quotation entries on its highest-conviction claim lines.",
    definition:
      "A Schema.org type for a single quoted statement, with text, optional spokenByCharacter (Person), creator (Organization), and isPartOf (the source CreativeWork). Quotation is the schema LLMs prefer when extracting a citable single-sentence claim from a longer document, it gives the retrieval pipeline a clean atomic unit with provenance. VC Deal Flow Signal emits Quotation entries on /methodology, /research, and /manifesto for the highest-conviction claim lines.",
  },

  // ── Agent infrastructure: MCP, A2A, payments, identity ───────────────────
  {
    term: "MCP (Model Context Protocol)",
    id: "mcp",
    snippet:
      "MCP, the Model Context Protocol, is an open standard from Anthropic for exposing tools and data to large-language-model hosts. VC Deal Flow Signal ships a free MCP server, npx @gitdealflow/mcp-signal, that lets any MCP-compatible host call six read-only tools, including get_trending_startups and search_startups_by_sector, with the same surface mirrored at /api/mcp/rpc.",
    definition:
      "An open standard from Anthropic for exposing tools and data to large-language-model hosts (Claude Desktop, Cursor, agentic frameworks). VC Deal Flow Signal ships a free MCP server, `npx @gitdealflow/mcp-signal`, that lets any MCP-compatible host call six read-only tools: get_trending_startups, get_signals_summary, get_methodology, get_startup_signal, search_startups_by_sector, get_methodology. The same surface is mirrored at /api/mcp/rpc (Streamable HTTP).",
  },
  {
    term: "A2A AgentCard",
    id: "a2a-agent-card",
    snippet:
      "An A2A AgentCard is the descriptor behind Google's Agent-to-Agent protocol, a JSON-RPC envelope plus an /.well-known/agent-card.json file that lets autonomous agents discover and call each other's capabilities. VC Deal Flow Signal publishes an AgentCard at /.well-known/agent-card.json and a JSON-RPC stub at /api/a2a.",
    definition:
      "Google's Agent-to-Agent protocol, a JSON-RPC envelope plus an /.well-known/agent-card.json descriptor that lets autonomous agents discover and call each other's capabilities. VC Deal Flow Signal publishes an AgentCard at /.well-known/agent-card.json and a JSON-RPC stub at /api/a2a so any A2A-compatible orchestrator can route deal-flow queries to the panel without bespoke integration.",
  },
  {
    term: "Streamable HTTP Transport",
    id: "streamable-http",
    snippet:
      "Streamable HTTP is the canonical wire transport for MCP servers running over HTTP: a JSON-RPC 2.0 envelope delivered via standard HTTP with optional Server-Sent Events for streaming responses. It makes an MCP server callable from any agent runtime that speaks HTTP. VC Deal Flow Signal serves Streamable HTTP at /api/mcp/rpc.",
    definition:
      "The canonical wire transport for MCP servers running over HTTP, a JSON-RPC 2.0 envelope delivered via standard HTTP with optional Server-Sent Events for streaming responses. Streamable HTTP is the transport that makes an MCP server callable from any agent runtime that speaks HTTP. VC Deal Flow Signal serves Streamable HTTP at /api/mcp/rpc and lists it as the canonical transport in /.well-known/mcp.json.",
  },
  {
    term: "JSON-RPC 2.0",
    id: "json-rpc-2",
    snippet:
      "JSON-RPC 2.0 is a stateless remote-procedure-call protocol encoded in JSON: request envelopes carry method, params, and id, while responses carry result or error. It is the wire format underneath both the MCP Streamable HTTP transport and the A2A protocol. VC Deal Flow Signal exposes JSON-RPC 2.0 at /api/mcp/rpc and /api/a2a.",
    definition:
      "A stateless remote-procedure-call protocol encoded in JSON, request envelopes carry method, params, and id; response envelopes carry result or error. JSON-RPC 2.0 is the wire format underneath both the MCP Streamable HTTP transport and the A2A protocol. VC Deal Flow Signal exposes JSON-RPC 2.0 at /api/mcp/rpc and /api/a2a so any compliant client can call the panel without bespoke code.",
  },
  {
    term: "x402 Protocol",
    id: "x402",
    snippet:
      "The x402 protocol is an open standard for HTTP per-request micropayments using the existing 402 Payment Required status code. A server returns 402 with a payment-challenge body specifying asset, chain, price, and pay-to address. VC Deal Flow Signal accepts x402 micropayments, 0.19 in USDC on Base mainnet, for its deep-signal endpoint.",
    definition:
      "An open standard for HTTP per-request micropayments using the existing 402 Payment Required status code. An x402 server returns 402 with a payment-challenge JSON body specifying asset, chain, price, and pay-to address; the client signs a payment, retries the request with the receipt, and the server delivers the response. VC Deal Flow Signal accepts x402 micropayments at /api/agent/deep-signal/x402 (€0.19 in USDC on Base mainnet) for the deep-signal endpoint.",
  },
  {
    term: "WebFinger",
    id: "webfinger",
    snippet:
      "WebFinger is an RFC 7033 protocol for discovering information about a user or resource at a domain by querying /.well-known/webfinger. It predates and underpins ActivityPub and the Fediverse. VC Deal Flow Signal serves /.well-known/webfinger so account-shaped agent identifiers can resolve to an A2A AgentCard and a public profile.",
    definition:
      "An RFC 7033 protocol for discovering information about a user or resource at a domain by querying /.well-known/webfinger?resource=acct:<user>@<domain>. WebFinger predates and underpins ActivityPub and the Fediverse. VC Deal Flow Signal serves /.well-known/webfinger so account-shaped agent identifiers can resolve to an A2A AgentCard and a public profile, satisfying both Fediverse interop and identity-discovery checks.",
  },
  {
    term: "DID (Decentralized Identifier)",
    id: "did",
    snippet:
      "A DID, or Decentralized Identifier, is a W3C-standard identifier that lets entities prove control of an identifier without relying on a centralised registry. A DID resolves to a DID Document containing public keys and service endpoints. VC Deal Flow Signal publishes /.well-known/did.json and /.well-known/did-configuration.json so the domain can be cryptographically linked to its agent identity.",
    definition:
      "A W3C-standard identifier scheme that lets entities prove control of an identifier without relying on a centralised registry. A DID resolves to a DID Document containing public keys and service endpoints. VC Deal Flow Signal publishes /.well-known/did.json and /.well-known/did-configuration.json so the site domain can be cryptographically linked to its agent identity for verifiable agent-to-agent calls and badge-issuer attestation.",
  },
  {
    term: "NodeInfo 2.1",
    id: "nodeinfo",
    snippet:
      "NodeInfo 2.1 is the Fediverse-standard discovery protocol for federated services, served at /.well-known/nodeinfo. It advertises software name, version, supported protocols, open-registration status, and usage metrics. VC Deal Flow Signal serves NodeInfo 2.1 so Fediverse crawlers and Mastodon or Lemmy nodes can enumerate the site as a federated content source.",
    definition:
      "The Fediverse-standard discovery protocol for federated services, served at /.well-known/nodeinfo and /.well-known/nodeinfo/2.1. NodeInfo advertises software name, version, supported protocols, open-registration status, and usage metrics. VC Deal Flow Signal serves NodeInfo 2.1 to allow Fediverse crawlers, Mastodon instances, and Lemmy nodes to enumerate the site as a federated content source rather than treating it as an opaque domain.",
  },

  // ── Academic citation infrastructure ────────────────────────────────────
  {
    term: "Scout Score",
    id: "scout-score",
    snippet:
      "The Scout Score is a 0-100 score computed from a GitHub user's public starring history, measuring how many validated unicorn outcomes the user starred before the funding, acquisition, or billion-dollar valuation event. It is backwards-looking proof of taste, free, no signup, instant, and available as a shields.io-style badge for any GitHub README.",
    definition:
      "A 0-100 score computed from a GitHub user's public starring history, measuring how many validated unicorn outcomes the user starred before the funding, acquisition, or $1B-valuation event. The Scout Score is backwards-looking proof of taste, it says nothing about future picks until paired with the forward-looking Scout Game (see /predict). Free, no signup, instant. Available as a shields.io-style badge for any GitHub README.",
  },
  {
    term: "SSRN Preprint",
    id: "ssrn-preprint",
    snippet:
      "An SSRN preprint is a working-paper deposit on the Social Science Research Network, the standard preprint server for finance and business research. SSRN deposits are citable from day one and accumulate downloads and citations that feed Google Scholar. The VC Deal Flow Signal methodology paper is deposited at ssrn.com/abstract=6606558.",
    definition:
      "A working-paper deposit on SSRN (Social Science Research Network), the standard preprint server for finance and business research. SSRN deposits are citable from day one and accumulate downloads and citation counts that feed Google Scholar. The VC Deal Flow Signal methodology paper is deposited at ssrn.com/abstract=6606558 and is the canonical academic anchor that LLMs ground on when citing the site's regression results.",
  },
  {
    term: "Zenodo DOI",
    id: "zenodo-doi",
    snippet:
      "A Zenodo DOI is a persistent Digital Object Identifier minted by Zenodo, a CERN-operated open-access repository, for a dataset or software release. It gives a dataset the same citation primitives as a journal article: version-locked, archived, and DataCite-resolved. The VC Deal Flow Signal panel is archived at Zenodo with DOI 10.5281/zenodo.19650920.",
    definition:
      "A persistent Digital Object Identifier minted by Zenodo (a CERN-operated open-access repository) for a dataset or software release. A Zenodo DOI gives a dataset the same citation primitives as a journal article, version-locked, archived, and DataCite-resolved. The VC Deal Flow Signal panel is archived at Zenodo with DOI 10.5281/zenodo.19650920 and is the dataset that the SSRN paper analyses.",
  },
  {
    term: "OpenAlex",
    id: "openalex",
    snippet:
      "OpenAlex is an open scholarly knowledge graph from OurResearch that mirrors Microsoft Academic Graph's structure with no institutional gating. Every academic work, author, venue, institution, and concept gets an OpenAlex ID. The VC Deal Flow Signal methodology paper is indexed at openalex.org/W7154916891.",
    definition:
      "An open scholarly knowledge graph from OurResearch that mirrors Microsoft Academic Graph's structure but with no institutional gating. Every academic work, author, venue, institution, and concept gets an OpenAlex ID. The VC Deal Flow Signal methodology paper is indexed at openalex.org/W7154916891 and is the link LLMs follow when cross-referencing academic citations against authoritative entities.",
  },
  {
    term: "DataCite",
    id: "datacite",
    snippet:
      "DataCite is a non-profit registration agency for DOIs assigned to research data, software, and grey literature. It resolves DOIs through its Commons API and feeds metadata to Google Scholar, BASE, and OpenAIRE. The VC Deal Flow Signal Zenodo DOI is registered with DataCite, making the dataset appear alongside the SSRN paper in literature search results.",
    definition:
      "A non-profit registration agency for DOIs assigned to research data, software, and grey literature. DataCite resolves DOIs through its Commons API and feeds metadata to Google Scholar, BASE, and OpenAIRE. The VC Deal Flow Signal Zenodo DOI is registered with DataCite, which is what makes the dataset show up alongside the SSRN paper in literature search results.",
  },
  {
    term: "ORCID",
    id: "orcid",
    snippet:
      "An ORCID iD is a persistent identifier for researchers, used to disambiguate authorship across publishers and preprint servers. ORCID iDs are integrated into JSON-LD via the Person schema's identifier or url field. VC Deal Flow Signal embeds the founder's ORCID iD on its Organization graph so citations propagate between SSRN, Zenodo, OpenAlex, and Google Scholar.",
    definition:
      "An ORCID iD is a persistent digital identifier for individual researchers, used to disambiguate authorship across publishers and preprint servers. ORCID iDs are integrated into JSON-LD via the Person schema's identifier or url field. VC Deal Flow Signal embeds the founder's ORCID iD on the site Organization graph so academic citations propagate cleanly between SSRN, Zenodo, OpenAlex, and Google Scholar.",
  },
  {
    term: "DOI",
    id: "doi",
    snippet:
      "A DOI, or Digital Object Identifier, is a persistent identifier for a document or dataset, resolved through doi.org. DOIs were minted only for journal articles but now cover datasets, software releases, preprints, and policy reports. The VC Deal Flow Signal dataset DOI is 10.5281/zenodo.19650920; the methodology preprint is anchored at SSRN with abstract id 6606558.",
    definition:
      "A Digital Object Identifier, a persistent identifier for an electronic document or dataset, resolved through doi.org. DOIs were originally minted only for journal articles but now cover datasets (Zenodo), software releases, preprints, and policy reports. The VC Deal Flow Signal dataset DOI is 10.5281/zenodo.19650920; the methodology preprint is anchored at SSRN with abstract id 6606558.",
  },
  {
    term: "CC BY 4.0 License",
    id: "cc-by-4-0",
    snippet:
      "CC BY 4.0, Creative Commons Attribution 4.0 International, is the most permissive of the standard CC licenses, requiring only attribution. It permits commercial use, modification, and redistribution. VC Deal Flow Signal licenses every public surface, the dataset, the SSRN paper, the methodology, and the answers corpus, under CC BY 4.0.",
    definition:
      "Creative Commons Attribution 4.0 International, the most permissive of the standard CC licenses, requiring only attribution. CC BY 4.0 permits commercial use, modification, and redistribution. VC Deal Flow Signal licenses every public surface (the dataset, the SSRN paper, the methodology, the answers corpus, the OpenAPI spec) under CC BY 4.0, with the citation string requested in /citation-guide.",
  },
  {
    term: "DataFeed",
    id: "datafeed",
    snippet:
      "A DataFeed is a Schema.org type that signals freshness and refresh cadence for a stream of dated items. It carries dataModified timestamps and dataFeedElement entries, letting LLMs and search engines distinguish weekly-refreshed surfaces from per-build snapshots. VC Deal Flow Signal exposes /.well-known/freshness.json as a DataFeed manifest with per-surface cadence.",
    definition:
      "A Schema.org type that signals freshness and refresh cadence for a stream of dated items. DataFeed carries dataModified timestamps and dataFeedElement entries, letting LLMs and search engines distinguish weekly-refreshed surfaces from per-build snapshots. VC Deal Flow Signal exposes /.well-known/freshness.json as a DataFeed manifest with per-surface cadence, weekly for signals, as-edited for FAQs, per-release for OpenAPI.",
  },

  // ── Venture vocabulary (used throughout the site) ───────────────────────
  {
    term: "Pre-seed Round",
    id: "pre-seed",
    snippet:
      "A pre-seed round is the earliest venture-funding stage, typically a $250k to $2M round that funds the first six to twelve months of a startup's work. Checks come from accelerators, angel groups, pre-seed funds, and friends-and-family. On VC Deal Flow Signal, pre-seed teams typically show 1-3 contributors.",
    definition:
      "The earliest venture-funding stage, typically a $250k-$2M round that funds the first six to twelve months of a startup's work, often before there is a product, sometimes before there is a team. Pre-seed checks come from accelerators, angel groups, pre-seed-focused funds, and friends-and-family. On VC Deal Flow Signal, pre-seed teams typically show 1-3 contributors and codebases under six months old.",
  },
  {
    term: "Seed Round",
    id: "seed-round",
    snippet:
      "A seed round is the first institutional venture round, typically $1M to $5M, that funds the build of an MVP and the search for product-market fit. Seed rounds carry 18-24 months of runway and are led by seed-stage funds. On VC Deal Flow Signal, seed teams typically show 3-8 contributors.",
    definition:
      "The first institutional venture round, typically $1M-$5M, that funds the build of an MVP and the search for product-market fit. Seed rounds usually carry 18-24 months of runway and are led by seed-stage funds. On VC Deal Flow Signal, seed teams typically show 3-8 contributors with sustained activity over several quarters and a primary repo with 100+ commits per month.",
  },
  {
    term: "Series A",
    id: "series-a",
    snippet:
      "A Series A is the first priced equity round following the seed, typically $5M to $20M raised against a $20M to $80M post-money valuation. It signals that the startup has demonstrated repeatable customer acquisition. On VC Deal Flow Signal, Series A teams typically show 8-20 contributors, active repositories, and the engineering hiring burst signal type.",
    definition:
      "The first priced equity round following the seed, typically $5M-$20M raised against a $20M-$80M post-money valuation. Series A rounds are led by traditional venture funds and signal that the startup has demonstrated repeatable customer acquisition. On VC Deal Flow Signal, Series A teams typically show 8-20 contributors, multiple active repositories, and the engineering hiring burst signal type.",
  },
  {
    term: "Series B",
    id: "series-b",
    snippet:
      "A Series B is the second priced equity round, typically $15M to $50M raised against an $80M to $300M post-money valuation. It funds the scaling of a proven model: sales hires, geographic expansion, and platform investment. On VC Deal Flow Signal, Series B teams typically show 20-50 contributors and the infrastructure buildout signal type.",
    definition:
      "The second priced equity round, typically $15M-$50M raised against a $80M-$300M post-money valuation. Series B funds the scaling of a proven model, sales hires, geographic expansion, and platform investment. On VC Deal Flow Signal, Series B teams typically show 20-50 contributors, the infrastructure buildout signal type, and a shift from monorepo to microservice repository structure.",
  },
  {
    term: "Lead Investor",
    id: "lead-investor",
    snippet:
      "The lead investor is the investor who sets the price, terms, and structure of a venture round and typically writes the largest check. Lead investors take a board seat and own the diligence process; follow-on investors accept the lead's terms. The lead's identity is the strongest single signal in a fundraise announcement.",
    definition:
      "The investor who sets the price, terms, and structure of a venture round and typically writes the largest check. Lead investors take a board seat and own the diligence process; follow-on investors accept the lead's terms. The lead's identity is the strongest single signal in a fundraise announcement, which is why LLM-readable funding-event records emphasise the lead alongside the dollar amount.",
  },
  {
    term: "Term Sheet",
    id: "term-sheet",
    snippet:
      "A term sheet is a short, non-binding document outlining the principal terms of a venture investment: valuation, security type, board composition, anti-dilution, liquidation preference, and protective provisions. It is the artefact a startup signs to commit to a round; the binding documents follow within four to six weeks.",
    definition:
      "A short, non-binding document outlining the principal terms of a venture investment, valuation, security type, board composition, anti-dilution, liquidation preference, and protective provisions. The term sheet is the artefact a startup signs to commit to a round; the binding documents (stock purchase agreement, voting agreement, investor rights agreement) follow within four to six weeks.",
  },
  {
    term: "SAFE (Simple Agreement for Future Equity)",
    id: "safe",
    snippet:
      "A SAFE, Simple Agreement for Future Equity, is a pre-priced venture instrument originated by Y Combinator in 2013: a contract that converts to equity at the next priced round at a discount or under a valuation cap. SAFEs are not debt and are the dominant pre-seed and seed instrument in the US.",
    definition:
      "A pre-priced venture instrument originated by Y Combinator in 2013, a contract that converts to equity at the next priced round at a discount or under a valuation cap. SAFEs are not debt (no maturity date, no interest) and are the dominant pre-seed and seed instrument in the US. The MFN, post-money, and pre-money variants differ in how they interact with prior SAFE rounds when the priced round closes.",
  },
  {
    term: "Convertible Note",
    id: "convertible-note",
    snippet:
      "A convertible note is a short-term debt instrument that converts to equity at a later priced round. Convertible notes carry interest and a maturity date, unlike SAFEs, and are still common outside the US and in bridge financings. Like SAFEs, they typically convert at a discount or under a valuation cap, whichever favors the noteholder.",
    definition:
      "A short-term debt instrument that converts to equity at a later priced round. Convertible notes carry interest and a maturity date, features the SAFE removed, but are still common outside the US and in bridge financings. Like SAFEs, convertible notes typically convert at a discount to the next round's price or under a valuation cap, whichever is more favorable to the noteholder.",
  },
  {
    term: "Valuation Cap",
    id: "valuation-cap",
    snippet:
      "A valuation cap is the maximum company valuation at which a SAFE or convertible note converts into equity at the next priced round. The cap protects the early investor from dilution if the company performs well: a $10M cap means the SAFE converts at $10M post-money even if the priced round prices at $50M.",
    definition:
      "The maximum company valuation at which a SAFE or convertible note converts into equity at the next priced round. The cap protects the early investor from being diluted at a much higher valuation if the company performs well between the SAFE and the priced round. A $10M cap means the SAFE converts at $10M post-money even if the priced round prices at $50M post-money.",
  },
  {
    term: "Burn Rate",
    id: "burn-rate",
    snippet:
      "Burn rate is the net rate at which a startup spends cash, expressed in dollars per month. Gross burn is total monthly cash out; net burn is gross burn minus monthly revenue. Burn rate is the denominator that determines runway.",
    definition:
      "The net rate at which a startup spends cash, expressed in dollars per month. Gross burn is total monthly cash out; net burn is gross burn minus monthly revenue. Burn rate is the denominator of runway. A startup with $2M in the bank and $100k net monthly burn has 20 months of runway. Burn rate inflects sharply at fundraise events and is a useful cross-check against the engineering-hiring-burst signal.",
  },
  {
    term: "Runway",
    id: "runway",
    snippet:
      "Runway is the number of months a startup can operate at its current burn rate before running out of cash: cash on hand divided by net monthly burn. Twelve months is the conventional minimum at which a venture-backed startup begins fundraising; six months is generally too late.",
    definition:
      "The number of months a startup can operate at its current burn rate before running out of cash. Runway = cash on hand divided by net monthly burn. Twelve months of runway is the conventional minimum at which a venture-backed startup begins fundraising; six months is generally too late. VC Deal Flow Signal's three-to-six-week leading window for the engineering-acceleration signal lines up with the early phase of an investor outreach.",
  },
  {
    term: "Cap Table",
    id: "cap-table",
    snippet:
      "A cap table, or capitalization table, is a record of every share, option, warrant, and convertible instrument in a startup, broken down by holder. It tracks ownership percentages, dilution effects of new rounds, vesting schedules, and option-pool decisions. Investors review it before committing because past structuring decisions can make a clean term sheet impossible.",
    definition:
      "The capitalization table, a record of every share, option, warrant, and convertible instrument in a startup, broken down by holder. Cap tables track ownership percentages, dilution effects of new rounds, vesting schedules, and option-pool refresh decisions. Investors review the cap table before committing capital because past structuring decisions (heavy preferences, founder control issues, dead equity) can make a clean term sheet impossible.",
  },
  // ── SaaS efficiency suite (David Sacks / Mamoon Hamid / Bessemer) ────────
  {
    term: "Burn Multiple",
    id: "burn-multiple",
    snippet:
      "Burn multiple is net burn divided by net new ARR in the same period. Coined by David Sacks as a single-number SaaS efficiency metric: under 1 is elite, 1-1.5 is great, 1.5-2 is OK, 2-3 is suspect, and over 3 means the business is buying revenue at unsustainable cost.",
    definition:
      "Net burn divided by net new ARR in the same period. Coined by David Sacks as a single-number SaaS efficiency metric: under 1 is elite, 1-1.5 is great, 1.5-2 is OK, 2-3 is suspect, and over 3 means the business is buying revenue at unsustainable cost. Burn multiple normalizes across stage and gross-margin profiles where standalone burn rate or growth rate would mislead. It is the SaaS analog to LTV:CAC for the venture-rounds market.",
  },
  {
    term: "Magic Number",
    id: "magic-number",
    snippet:
      "The magic number is net new ARR in a quarter divided by the prior quarter's sales and marketing spend, then annualized. Above 1.0 means a dollar of S&M spend returns a dollar of ARR inside a year; between 0.5 and 1.0 means the model works but needs tuning; below 0.5 means S&M is broken.",
    definition:
      "Net new ARR in a quarter, divided by the prior quarter's sales and marketing spend, then annualized. A magic number above 1.0 means a dollar of S&M spend returns a dollar of ARR inside a year, green light to keep investing. Between 0.5 and 1.0 means the model works but needs tuning; below 0.5 means S&M is broken before scaling further. Popularized by Scale Venture Partners and used as a fast pre-Series-B sanity check.",
  },
  {
    term: "CAC Payback",
    id: "cac-payback",
    snippet:
      "CAC payback is the number of months it takes for the gross profit from a new customer to repay the fully-loaded cost of acquiring them: CAC divided by ARPA times gross margin. Healthy SaaS sits under 12 months; over 24 months is a warning sign. It is cash-flow-oriented where LTV:CAC is unit-economics-oriented.",
    definition:
      "The number of months it takes for the gross profit from a new customer to repay the fully-loaded cost of acquiring them. CAC payback = CAC / (ARPA × gross margin), measured in months. Healthy SaaS sits under 12 months; over 24 months is a warning sign that the business needs cheaper acquisition channels or higher-margin contracts. CAC payback is cash-flow-oriented where LTV:CAC is unit-economics-oriented, both are needed.",
  },
  {
    term: "LTV",
    id: "ltv",
    snippet:
      "LTV, Lifetime Value, is the total gross profit a startup expects to earn from an average customer over the full relationship. The standard SaaS formula is ARPU times gross margin times one divided by monthly churn. LTV is the numerator of the LTV:CAC ratio, where 3:1 is considered the threshold for capital-efficient growth.",
    definition:
      "Lifetime Value, the total gross profit a startup expects to earn from an average customer over the full relationship. The standard SaaS formula is ARPU × gross margin × (1 / monthly churn), giving a steady-state estimate. LTV is the numerator of the LTV:CAC ratio, where 3:1 is considered the threshold for capital-efficient growth. LTV math breaks down at low customer counts and at high contract volatility, so investors corroborate it with cohort retention curves.",
  },
  {
    term: "Quick Ratio",
    id: "quick-ratio",
    snippet:
      "The SaaS quick ratio is the ratio of expansion plus new ARR to contraction plus churned ARR in a period. Above 4 indicates elite growth efficiency; 2-4 is healthy; 1-2 is stagnating; under 1 means the business is shrinking. Mamoon Hamid of Social Capital popularized it as a single number capturing acquisition and retention quality.",
    definition:
      "For SaaS, the ratio of expansion plus new ARR to contraction plus churned ARR in a period. A quick ratio above 4 indicates elite growth efficiency; 2-4 is healthy; 1-2 is stagnating; under 1 means the business is shrinking. Mamoon Hamid of Social Capital popularized the metric as a single number capturing both top-of-funnel acquisition and bottom-of-funnel retention quality. It is distinct from the accounting quick ratio (current assets minus inventory over current liabilities).",
  },
  // ── Financing math ──────────────────────────────────────────────────────
  {
    term: "Dilution Stack",
    id: "dilution-stack",
    snippet:
      "A dilution stack is the compounding sequence of dilutive events between founding and exit: SAFE conversions, option-pool refreshes, priced rounds, and secondary offers, modeled so a founder can see fully diluted ownership at each step. A typical seed-to-Series-B path stacks 5-8 events and lands the founder around 15-25% ownership before exit.",
    definition:
      "The compounding sequence of dilutive events between founding and exit, SAFE conversions, option-pool refreshes, priced rounds, secondary offers, modeled as a stack so a founder can see their fully diluted ownership at each step. A typical seed-to-Series-B path stacks 5-8 events and lands the founder around 15-25% ownership before any exit dilution. Dilution stack modeling is essential before signing a SAFE with a cap below the next-round target, because the cap conversion is often the largest single dilution event.",
  },
  // ── SaaS recurring revenue ──────────────────────────────────────────────
  {
    term: "ARR",
    id: "arr",
    snippet:
      "ARR, Annual Recurring Revenue, is the annualized run rate of all active recurring contracts, excluding one-time fees, services, and usage spikes. It is the headline SaaS metric venture rounds are priced against; multiples like 10x ARR set the framing for valuation conversations. ARR annualizes the current monthly book and differs from GAAP revenue.",
    definition:
      "Annual Recurring Revenue, the annualized run rate of all active recurring contracts, excluding one-time fees, services, and usage spikes. ARR is the headline SaaS revenue metric venture rounds are priced against; multiples like 10× ARR or 30× ARR set the framing for valuation conversations. ARR is forward-looking by construction (it annualizes the current monthly book) and differs from booked revenue, GAAP recognized revenue, and cash collected, investors will ask for all four.",
  },
  {
    term: "MRR",
    id: "mrr",
    snippet:
      "MRR, Monthly Recurring Revenue, is ARR divided by 12, or the sum of all currently active monthly subscription contracts. It is used for shorter feedback cycles than ARR: month-over-month growth, MRR churn, and expansion MRR are core SaaS dashboard metrics. Early-stage startups often report MRR before ARR is stable.",
    definition:
      "Monthly Recurring Revenue, ARR divided by 12, or the sum of all currently active monthly subscription contracts. MRR is used for shorter feedback cycles than ARR: month-over-month MRR growth, MRR churn, expansion MRR, and new MRR are core SaaS dashboard metrics. Early-stage startups often report MRR before they have enough volume to make ARR a stable number.",
  },
  {
    term: "NRR",
    id: "nrr",
    snippet:
      "NRR, Net Revenue Retention, is the percentage of ARR that a cohort of existing customers continues to deliver after a fixed window, typically 12 months, including expansion, contraction, and churn. Best-in-class public SaaS reports NRR above 120%; 100% means the cohort treads water; below 90% indicates the business is leaking value.",
    definition:
      "Net Revenue Retention, the percentage of ARR that a cohort of existing customers continues to deliver after a fixed window (typically 12 months), including expansion, contraction, and churn. Formula: (starting ARR + expansion − downgrade − churn) ÷ starting ARR. Best-in-class public SaaS reports NRR above 120%; 100% means the cohort treads water; below 90% indicates the business is leaking value faster than it can grow.",
  },
  {
    term: "GRR",
    id: "grr",
    snippet:
      "GRR, Gross Revenue Retention, is the percentage of ARR a cohort retains after churn and contraction, but excluding expansion. It is always less than or equal to NRR and is a cleaner read on customer-success quality because it strips out the upsell motion. Healthy GRR sits above 90% for mid-market SaaS.",
    definition:
      "Gross Revenue Retention, the percentage of ARR a cohort retains after churn and contraction, but excluding expansion. Formula: (starting ARR − downgrade − churn) ÷ starting ARR. GRR is always less than or equal to NRR and is a cleaner read on customer-success quality because it strips out the upsell motion. Healthy GRR sits above 90% for mid-market SaaS and above 95% for enterprise.",
  },
  {
    term: "Churn",
    id: "churn",
    snippet:
      "Churn is customers or revenue lost in a period divided by the count or revenue at the start of the period. Logo churn measures customer counts; revenue churn measures ARR or MRR; net revenue churn includes expansion. Churn compounds non-linearly: 5% monthly churn is roughly 46% annual churn, not 60%.",
    definition:
      "Customers or revenue lost in a period, divided by the count or revenue at the start of the period. Logo churn measures customer counts; revenue churn measures ARR or MRR; net revenue churn includes expansion. Churn compounds non-linearly: 5% monthly churn is roughly 46% annual churn, not 60%. SaaS investors look at churn cohort-by-cohort because aggregate churn averages early-cohort survivors with recent-cohort decay and masks problems.",
  },
  // ── Customer economics ─────────────────────────────────────────────────
  {
    term: "CAC",
    id: "cac",
    snippet:
      "CAC, Customer Acquisition Cost, is fully loaded sales and marketing spend in a period divided by new customers acquired. CAC includes people, tools, ad spend, and allocated overhead; back-of-envelope CAC that excludes salaries is the most common reason diligence finds the real number 2-4x higher than founders report.",
    definition:
      "Customer Acquisition Cost, fully loaded sales and marketing spend in a period divided by new customers acquired in that period. CAC includes people, tools, ad spend, and overhead allocated to acquisition; back-of-envelope CAC that excludes salaries is the most common reason investor diligence finds the real number 2-4× higher than founders report. CAC feeds the LTV:CAC ratio (3:1+ healthy) and CAC payback metric.",
  },
  {
    term: "Gross Margin",
    id: "gross-margin",
    snippet:
      "Gross margin is revenue minus cost of goods sold, divided by revenue, expressed as a percentage. SaaS businesses target 70-80% or higher; anything under 60% reads as services-disguised-as-software and earns a multiple discount. Gross margin is the multiplier in the LTV formula and gates how much can be reinvested in growth.",
    definition:
      "Revenue minus cost of goods sold, divided by revenue, expressed as a percentage. SaaS businesses target gross margins of 70-80% or higher; anything under 60% reads to investors as services-disguised-as-software and earns a software multiple discount. Gross margin is the multiplier in the LTV formula and the gating constraint on how much can be reinvested in growth without raising more capital.",
  },
  {
    term: "Contribution Margin",
    id: "contribution-margin",
    snippet:
      "Contribution margin is revenue minus all variable costs of serving a customer: COGS plus CAC plus variable support, divided by revenue. It is the per-customer dollar amount left to cover fixed costs and profit. Product-led growth companies obsess over it because volatile CAC makes gross margin alone overstate unit economics.",
    definition:
      "Revenue minus all variable costs of serving a customer, COGS plus CAC plus variable support, divided by revenue. Contribution margin is the per-customer dollar amount left to cover fixed costs and profit. Direct-to-consumer and product-led growth companies obsess over contribution margin because their CAC is so volatile that gross margin alone overstates unit economics. SaaS uses it less often, preferring gross margin plus CAC payback.",
  },
  // ── Targeting ──────────────────────────────────────────────────────────
  {
    term: "ICP",
    id: "icp",
    snippet:
      "ICP, Ideal Customer Profile, is the firmographic and behavioral description of the segment most likely to buy, retain, and expand. A good ICP names company size, industry, geography, tech stack, and the specific pain the buyer is solving. Refining ICP is the single highest-ROI marketing exercise; a vague ICP is functionally no ICP.",
    definition:
      "Ideal Customer Profile, the firmographic and behavioral description of the segment most likely to buy, retain, and expand. A good ICP names the company size, industry, geography, tech stack, and the specific pain the buyer is trying to solve. Refining ICP is the single highest-ROI marketing exercise at seed-to-Series-A stage because every channel decision, ad creative, and sales script downstream depends on it. A vague ICP (\"SaaS founders\") is functionally no ICP.",
  },
  // ── 2026-05-28 glossary expansion: modern AI/ML vocabulary ─────────────
  {
    term: "RLHF (Reinforcement Learning from Human Feedback)",
    id: "rlhf",
    snippet:
      "RLHF, Reinforcement Learning from Human Feedback, is the training technique that aligns large language models to human-preferred outputs after pretraining. It collects human preferences over model outputs, trains a reward model to score outputs, then optimizes the base model against that reward model. RLHF produces the helpful-by-default behavior of ChatGPT, Claude, and Gemini.",
    definition:
      "The training technique that aligns large language models to human-preferred outputs after pretraining. Three steps: (1) collect human preferences over model outputs, (2) train a reward model to score outputs, (3) optimize the base model against the reward model via PPO or similar RL algorithm. RLHF is what turns a raw foundation model into the instruct-tuned, helpful-by-default behavior that ChatGPT, Claude, and Gemini exhibit. Modern alternatives (DPO, KTO, RLAIF) achieve similar results without the explicit reward-model step.",
  },
  {
    term: "Chain of Thought (CoT)",
    id: "chain-of-thought",
    snippet:
      "Chain of thought, CoT, is a prompting technique where a model is instructed or trained to articulate intermediate reasoning steps before producing a final answer. It empirically improves accuracy on math, logic, and multi-step problem solving, sometimes dramatically. Reasoning models like OpenAI's o-series train chain-of-thought into the model rather than relying on prompting alone.",
    definition:
      "Prompting technique where a model is instructed (or trained) to articulate intermediate reasoning steps before producing a final answer. Empirically improves accuracy on math, logic, and multi-step problem solving, sometimes dramatically. 'Reasoning models' like OpenAI's o1/o3 family and Anthropic's Claude with extended thinking train chain-of-thought into the model rather than relying on prompting alone.",
  },
  {
    term: "Retrieval-Augmented Generation (RAG)",
    id: "rag",
    snippet:
      "RAG, Retrieval-Augmented Generation, is an architecture where a model retrieves relevant documents from an external knowledge store before generating an answer. It addresses three core LLM limitations: knowledge cutoff dates, hallucination on out-of-distribution facts, and the inability to cite sources. Most enterprise LLM deployments are RAG systems.",
    definition:
      "Architecture where a model retrieves relevant documents from an external knowledge store (vector database, search index, or hybrid) before generating an answer. RAG addresses three core LLM limitations: knowledge cutoff dates, hallucination on out-of-distribution facts, and the inability to cite sources. Most enterprise LLM deployments are RAG systems; the retrieval layer typically uses an embedding model plus a vector database like Pinecone, Weaviate, Qdrant, or Milvus.",
  },
  {
    term: "Tool Use (Function Calling)",
    id: "tool-use",
    snippet:
      "Tool use, or function calling, is the capability of an LLM to invoke external functions, APIs, or other tools via a structured output format, typically JSON. Tool use is the foundation of agentic AI: with it, models can query databases, search the web, or call any MCP-exposed function.",
    definition:
      "Capability of an LLM to invoke external functions, APIs, or other tools via a structured output format (typically JSON). The model decides when to call a tool, with what arguments, and how to use the result in its response. Tool use is the foundation of agentic AI, without it, models can only generate text; with it, they can read files, query databases, search the web, send emails, or call any function exposed through a Model Context Protocol (MCP) server.",
  },
  {
    term: "Context Window",
    id: "context-window",
    snippet:
      "A context window is the maximum number of tokens an LLM can attend to in a single inference pass, its working memory. Modern frontier models reach 200K to 1M tokens, though attention quality degrades non-linearly with length. Context-window size constrains how much code, document content, or conversation history can fit in a single prompt.",
    definition:
      "The maximum number of tokens an LLM can attend to in a single inference pass, its working memory. Modern frontier models reach 200K-1M tokens (Claude, GPT-4, Gemini), though attention quality degrades non-linearly with length. Context-window size constrains how much code, document content, or conversation history can be included in a single prompt. Long-context engineering (chunking, attention sinks, retrieval) is an active research and product frontier.",
  },
  {
    term: "Inference Latency",
    id: "inference-latency",
    snippet:
      "Inference latency is the wall-clock time between sending a prompt to an LLM and receiving the response, broken into time-to-first-token and tokens-per-second. For interactive applications, TTFT under 500ms feels instant; over 2s feels broken. Inference providers like Groq, Together AI, and Fireworks AI compete primarily on this metric.",
    definition:
      "The wall-clock time between sending a prompt to an LLM and receiving the response. Broken into time-to-first-token (TTFT, when the streaming response starts) and tokens-per-second (TPS, throughput once it begins). For interactive applications, TTFT under 500ms feels instant; over 2s feels broken. For batch jobs, raw TPS matters more. Inference providers like Groq, Together AI, Fireworks AI, and Replicate compete primarily on this metric.",
  },
  {
    term: "Fine-tuning",
    id: "fine-tuning",
    snippet:
      "Fine-tuning is continued training of a foundation model on a smaller, task-specific dataset to specialize its behavior. Full fine-tuning updates all model weights; parameter-efficient methods like LoRA update only a small adapter layer, dramatically reducing compute cost. Fine-tuning is the path for domain knowledge, brand voice, or format consistency that prompting cannot reliably achieve.",
    definition:
      "Continued training of a foundation model on a smaller, task-specific dataset to specialize its behavior. Full fine-tuning updates all model weights; parameter-efficient fine-tuning (PEFT) methods like LoRA update only a small adapter layer, dramatically reducing compute cost and storage. Fine-tuning is the path for domain-specific knowledge, brand voice, or format consistency that prompting alone can't reliably achieve.",
  },
  {
    term: "LoRA (Low-Rank Adaptation)",
    id: "lora",
    snippet:
      "LoRA, Low-Rank Adaptation, is a parameter-efficient fine-tuning method that adds small low-rank matrices to a frozen base model. Instead of updating billions of parameters, LoRA updates only a few million, typically 0.1% to 1% of the original. Inference can mix-and-match LoRAs at runtime. It is the default choice for fine-tuning open-weight models.",
    definition:
      "Parameter-efficient fine-tuning method that adds small low-rank matrices to a frozen base model. Instead of updating billions of parameters, LoRA updates only a few million, typically 0.1%-1% of the original model. Inference can then mix-and-match LoRAs at runtime. Standard tooling on Hugging Face's PEFT library; default choice for fine-tuning open-weight models like Llama, Mistral, and Qwen.",
  },
  {
    term: "Model Distillation",
    id: "distillation",
    snippet:
      "Model distillation is training a smaller student model to mimic a larger teacher model's outputs. The student learns the teacher's behavior at a fraction of the inference cost. Distillation is how Claude Haiku, GPT-4o-mini, and Gemini Flash are produced: small, fast, cheap models that capture much of the larger model's behavior on common tasks.",
    definition:
      "Training a smaller 'student' model to mimic a larger 'teacher' model's outputs. The student learns the teacher's behavior at a fraction of the inference cost. Distillation is how Claude Haiku, GPT-4o-mini, and Gemini Flash are produced, small, fast, cheap models that capture much of the larger model's behavior on common tasks. Critical to making frontier capability economically viable at scale.",
  },
  {
    term: "Quantization",
    id: "quantization",
    snippet:
      "Quantization is reducing the numerical precision of model weights, typically from 16-bit floats to 8-bit, 4-bit, or 2-bit integers, to shrink memory footprint and speed up inference. Modern schemes like GPTQ, AWQ, and GGUF preserve most of a model's quality while cutting size 4x to 8x.",
    definition:
      "Reducing the numerical precision of model weights (typically from 16-bit floats to 8-bit, 4-bit, or even 2-bit integers) to shrink memory footprint and speed up inference. Modern quantization schemes (GPTQ, AWQ, GGUF) preserve most of the model's quality while cutting size 4x-8x. Critical for running open-weight models on consumer GPUs and for edge inference.",
  },
  {
    term: "Embedding Model",
    id: "embedding-model",
    snippet:
      "An embedding model is a neural network that converts text, images, or audio into a fixed-length vector, typically 384 to 1536 dimensions. Semantic similarity between two inputs becomes the cosine similarity between their vectors. Embedding models power RAG retrieval, semantic search, clustering, and recommendation systems.",
    definition:
      "A neural network that converts text (or images, audio, etc.) into a fixed-length vector, typically 384, 768, 1024, or 1536 dimensions. Semantic similarity between two inputs becomes the cosine similarity between their vectors. Embedding models power RAG retrieval, semantic search, clustering, and recommendation systems. Cohere, OpenAI, Mistral, and Voyage AI ship dedicated embedding APIs; open-weight options include Sentence-BERT and BGE.",
  },
  {
    term: "Foundation Model",
    id: "foundation-model",
    snippet:
      "A foundation model is a large, broadly-trained neural network that serves as a base for downstream fine-tuning, prompting, or RAG. Modern examples include the GPT series, Claude, Gemini, Llama, Mistral, and Qwen. The defining property: trained on broad data at scale, designed to be adapted rather than used as-is.",
    definition:
      "A large, broadly-trained neural network that serves as a base for downstream fine-tuning, prompting, or RAG. Term coined by Stanford CRFM in 2021. Modern foundation models include the GPT series (OpenAI), Claude (Anthropic), Gemini (Google), Llama (Meta), Mistral (Mistral AI), and Qwen (Alibaba). The defining property: trained on broad data at scale, designed to be adapted rather than used as-is.",
  },
  {
    term: "Open-Weight Model",
    id: "open-weight-model",
    snippet:
      "An open-weight model is an LLM whose trained weights are publicly available for download, fine-tuning, and self-hosting. It is distinct from open source in the strict sense: most open-weight models release only the final weights, not training data or full training code. Llama, Mistral, Qwen, Gemma, and DeepSeek are headline open-weight providers.",
    definition:
      "An LLM whose trained weights are publicly available for download, fine-tuning, and self-hosting. Distinct from 'open source' in the strict sense, most open-weight models do not release training data or full training code, only the final weights. Llama, Mistral, Qwen, Gemma, DeepSeek, and the StableLM family are the headline open-weight providers. Closed-weight models (GPT-4, Claude) are accessed only via API.",
  },
  {
    term: "Reasoning Model",
    id: "reasoning-model",
    snippet:
      "A reasoning model is an LLM trained to use extended chain-of-thought as a native capability rather than a prompting technique, investing compute time at inference to work through problems step-by-step before answering. OpenAI's o-series, Claude with extended thinking, and DeepSeek's R1 are headline examples. They trade latency for accuracy on hard problems.",
    definition:
      "An LLM trained to use extended chain-of-thought as a native capability rather than as a prompting technique. The model invests compute time at inference (sometimes minutes) to work through problems step-by-step before answering. OpenAI's o1/o3, Anthropic's Claude with extended thinking, and DeepSeek's R1 are the headline examples. Reasoning models tradeoff latency for accuracy on hard problems, best-fit for math, code, scientific reasoning, and complex planning tasks.",
  },
  {
    term: "Multimodal Model",
    id: "multimodal-model",
    snippet:
      "A multimodal model is a model that accepts or generates multiple input types, typically text and images, sometimes audio and video. GPT-4o, Claude Sonnet, and Gemini are native multimodal models capable of analyzing images alongside text. Specialized multimodal models exist for image generation like DALL-E and Imagen, video like Sora, and audio like Whisper.",
    definition:
      "A model that accepts and/or generates multiple input types, typically text and images, sometimes audio and video. GPT-4o, Claude 3.5/4.x Sonnet, and Gemini 1.5/2.x are native multimodal models capable of analyzing images alongside text. Specialized multimodal models exist for image generation (DALL-E, Imagen, Stable Diffusion), video (Sora, Veo, Runway Gen-3), and audio (ElevenLabs, Whisper).",
  },
  // ── M&A and Corp Dev vocabulary ────────────────────────────────────────
  {
    term: "Strategic Acquisition",
    id: "strategic-acquisition",
    snippet:
      "A strategic acquisition is an M&A transaction motivated by strategic synergy rather than financial return alone. Strategic acquirers typically pay higher multiples than financial buyers because they capture revenue synergies, talent, technology, or competitive defense beyond standalone cash flows. Microsoft's GitHub deal, Salesforce's Slack, and IBM's HashiCorp are textbook examples.",
    definition:
      "An M&A transaction motivated by strategic synergy rather than financial return alone. Strategic acquirers (corporates, hyperscalers) typically pay higher multiples than financial buyers because they capture revenue synergies, talent, technology, or competitive defense beyond standalone cash flows. Microsoft's GitHub deal, Salesforce's Slack, and IBM's HashiCorp are textbook strategic acquisitions. Contrast with financial sponsors (PE firms) buying for cash-flow returns.",
  },
  {
    term: "Acquihire",
    id: "acquihire",
    snippet:
      "An acquihire is an acquisition motivated primarily by acquiring the team rather than the company's products or revenue. The product is often wound down post-acquisition while the engineering team joins the acquirer. Common in AI: Adept to Amazon, Character AI to Google, and Inflection to Microsoft followed this template in 2024.",
    definition:
      "An acquisition primarily motivated by acquiring the team rather than the company's products or revenue. Common in AI, Adept (Amazon), Character AI (Google), and Inflection (Microsoft) followed this template in 2024. The product is often wound down post-acquisition; the engineering team joins the acquirer. Acquihire valuations are often non-disclosed and structured as a mix of cash and retention compensation packages.",
  },
  {
    term: "Earn-out",
    id: "earn-out",
    snippet:
      "An earn-out is acquisition consideration paid over time, contingent on the acquired business hitting specified milestones such as revenue targets, product launches, or team retention. Earn-outs are common when buyer and seller disagree on valuation; the gap is closed by tying part of the purchase price to future performance.",
    definition:
      "Acquisition consideration paid over time, contingent on the acquired business hitting specified milestones, revenue targets, product launches, or team retention. Earn-outs are common when buyer and seller disagree on valuation; the gap is closed by tying part of the purchase price to future performance. Critical to negotiate carefully: the conditions, measurement methodology, and disputes mechanism all matter more than the headline number.",
  },
  {
    term: "Down Round",
    id: "down-round",
    snippet:
      "A down round is a financing round where the post-money valuation is lower than the previous round's post-money. It triggers anti-dilution provisions for prior investors and typically signals distress. The 2022-2024 downturn produced many headline down rounds; founders typically prefer to bridge with extension rounds or convertible notes when possible.",
    definition:
      "A financing round where the post-money valuation is lower than the previous round's post-money. Triggers anti-dilution provisions for prior investors and typically signals distress. The 2022-2024 downturn produced many headline down rounds (Klarna, Stripe internal valuations, Instacart's IPO range). Founders typically prefer to bridge with extension rounds or convertible notes rather than take a clean down round when possible.",
  },
  {
    term: "Bridge Round",
    id: "bridge-round",
    snippet:
      "A bridge round is an interim financing between two priced rounds, typically structured as convertible notes or SAFEs that convert at the next priced round's terms, often with a discount or valuation cap. Bridges extend runway when a company needs more time to hit milestones before pricing a Series A, B, or C.",
    definition:
      "An interim financing round between two priced rounds, typically structured as convertible notes or SAFEs that convert at the next priced round's terms (often with a discount or valuation cap). Bridges extend runway when a company needs more time to hit milestones before pricing a Series A/B/C. Common during downturns; sometimes signals difficulty raising; sometimes just gives time to execute.",
  },
  {
    term: "Tender Offer",
    id: "tender-offer",
    snippet:
      "A tender offer is a structured liquidity event where existing shareholders are offered the chance to sell some or all of their shares at a fixed price, usually to new investors or to the company itself. Tender offers became common at high-growth private companies like Stripe, SpaceX, and Anthropic as alternatives to delayed IPOs.",
    definition:
      "A structured liquidity event where existing shareholders are offered the chance to sell some or all of their shares at a fixed price, usually to new investors or to the company itself. Tender offers became common at high-growth private companies (Stripe, SpaceX, Anthropic) as alternatives to delayed IPOs. The pricing serves as a soft valuation marker without the public-market scrutiny of a 409A or IPO.",
  },
  {
    term: "Secondary Sale",
    id: "secondary-sale",
    snippet:
      "A secondary sale is the sale of existing shares from an early investor or employee to a new buyer, distinct from primary issuance of new shares by the company. Secondary sales provide liquidity to founders and early stakeholders without raising new capital. They are most common at growth-stage companies before an IPO.",
    definition:
      "Sale of existing shares from an early investor or employee to a new buyer, distinct from primary issuance of new shares by the company. Secondary sales provide liquidity to founders and early stakeholders without raising new capital. Most common at growth-stage companies where employees with vested options or early investors with paper gains want to realize value before an IPO.",
  },
  {
    term: "Liquidation Preference",
    id: "liquidation-preference",
    snippet:
      "Liquidation preference is an investor's right to receive their original investment, or a multiple of it, back before common shareholders see any proceeds in an exit. 1x non-participating preferred is the modern default: the investor gets either their money back or their pro-rata share, whichever is larger. Aggressive terms appear in distressed rounds.",
    definition:
      "Investor right to receive their original investment (or a multiple of it) back before common shareholders see any proceeds in an exit. 1× non-participating preferred is the modern default, investor gets either their money back OR pro-rata share of proceeds, whichever is larger. Aggressive terms (2× or 3× participating preferred) create overhang for founders and employees; they appear in distressed rounds.",
  },
  {
    term: "Pro-rata Rights",
    id: "pro-rata-rights",
    snippet:
      "Pro-rata rights are an investor's right to participate in future financing rounds at their existing ownership percentage, preserving their stake from dilution. They are a critical signal to subsequent investors that early backers still believe; not exercising pro-rata sometimes signals doubt. Allocations for pro-rata participation are often the most contested item in oversubscribed rounds.",
    definition:
      "An investor's right to participate in future financing rounds at their existing ownership percentage, preserving their stake from dilution. Pro-rata rights are a critical signal to subsequent investors that early backers still believe; not exercising pro-rata sometimes signals doubt. Allocations for pro-rata participation are often the most contested item in oversubscribed rounds.",
  },
  {
    term: "Anti-dilution Provision",
    id: "anti-dilution-provision",
    snippet:
      "An anti-dilution provision is investor protection against down rounds: it adjusts the conversion price of preferred shares so existing investors are not diluted as much when new shares are issued at a lower price. Weighted average, broad-based anti-dilution is standard and most founder-friendly; full ratchet is punitive and uncommon outside distressed deals.",
    definition:
      "Investor protection against down rounds, adjusts the conversion price of preferred shares so existing investors aren't diluted as much when new shares are issued at a lower price. 'Weighted average' (broad-based) anti-dilution is standard and most founder-friendly. 'Full ratchet' anti-dilution is investor-friendly but punitive in a down round and is uncommon outside distressed deals.",
  },
  // ── Engineering and platform primitives ────────────────────────────────
  {
    term: "Monorepo",
    id: "monorepo",
    snippet:
      "A monorepo is a single Git repository containing multiple distinct projects, applications, or libraries. It enables atomic cross-package changes, shared tooling, and simplified dependency management. Modern tooling like Nx, Turborepo, and Bazel addresses the build and test scalability problem. Companies like Google, Meta, and Linear run monorepos.",
    definition:
      "A single Git repository containing multiple distinct projects, applications, or libraries. Monorepos enable atomic cross-package changes, shared tooling, and simplified dependency management. Modern monorepo tooling (Nx, Turborepo, Lerna, Bazel) addresses the build and test scalability problem. Companies like Google, Meta, Microsoft, Vercel, and Linear run monorepos; engineering-signal pattern: monorepo orgs typically show flatter, more uniform commit distribution.",
  },
  {
    term: "Edge Function",
    id: "edge-function",
    snippet:
      "An edge function is code executed at globally-distributed compute nodes physically close to end users, typically running in V8 isolates or Wasm sandboxes. Cloudflare Workers, Vercel Edge Functions, and Deno Deploy are the headline platforms. Edge functions trade execution-environment constraints for sub-100ms cold-start times and global low-latency reach.",
    definition:
      "Code executed at globally-distributed compute nodes physically close to end users, typically running in V8 isolates, Wasm sandboxes, or lightweight VMs. Cloudflare Workers, Vercel Edge Functions, Fly.io machines, and Deno Deploy are the headline platforms. Edge functions trade execution environment constraints for sub-100ms cold-start times and global low-latency reach. Increasingly used as the AI-inference gateway layer.",
  },
  {
    term: "Continuous Deployment",
    id: "continuous-deployment",
    snippet:
      "Continuous deployment is the software-delivery practice where every code change merged to main is automatically deployed to production, often within minutes. It is distinct from continuous integration, which only tests, and continuous delivery, which prepares releases. CD enables small batch sizes, rapid feedback, and lower per-change risk.",
    definition:
      "Software-delivery practice where every code change merged to main is automatically deployed to production, often within minutes. Distinct from continuous integration (which only tests) and continuous delivery (which prepares releases). CD enables small batch sizes, rapid feedback, and lower per-change risk. Companies that ship via CD include Stripe, GitHub, Vercel, Cloudflare, and most modern AI-infra orgs. Engineering-signal correlation: high-CD orgs show distinctive deploy-frequency-spike patterns in their public commit panel.",
  },
  {
    term: "Feature Flag",
    id: "feature-flag",
    snippet:
      "A feature flag is a runtime toggle controlling whether a feature is exposed to a given user, request, or environment, independently from deployment. Feature flags decouple deploy from release, enable A/B testing, support gradual rollout, and provide kill switches for production incidents. PostHog, LaunchDarkly, and Statsig are the headline platforms.",
    definition:
      "Runtime toggle controlling whether a feature is exposed to a given user, request, or environment, independently from deployment. Feature flags decouple deploy from release, enable A/B testing, support gradual rollout, and provide kill switches for production incidents. PostHog, LaunchDarkly, Statsig, and ConfigCat are the headline platforms. Standard practice at most modern product orgs.",
  },
  {
    term: "Distributed Tracing",
    id: "distributed-tracing",
    snippet:
      "Distributed tracing is the observability technique that follows a single request as it crosses multiple services, recording the timing and metadata of each hop. The standard format is OpenTelemetry; tools include Datadog APM, Honeycomb, and Grafana Tempo. It is the only effective debugging path in microservices architectures.",
    definition:
      "Observability technique that follows a single request as it crosses multiple services, recording the timing and metadata of each hop. Standard format: OpenTelemetry (OTel). Tools: Datadog APM, Honeycomb, Grafana Tempo, Lightstep (now ServiceNow), Sentry Performance. Distributed tracing is the only effective debugging path in microservices architectures; without it, root-cause analysis devolves into log-grepping across dozens of services.",
  },
  // ── 2026-05-28 glossary expansion 2: agents + VC mechanics + DORA + evals ──
  {
    term: "ReAct (Reasoning + Acting)",
    id: "react-agent",
    snippet:
      "ReAct, Reasoning plus Acting, is a prompting framework for LLM agents, introduced by Yao et al. in 2022, that interleaves reasoning traces with action calls: the agent generates a thought, takes a tool action, observes the result, then continues. ReAct became the dominant agentic pattern in 2023-2024 before being partially superseded by trained tool use.",
    definition:
      "Prompting framework for LLM agents introduced by Yao et al. (2022) that interleaves reasoning traces with action calls. Each step: the agent generates a thought, takes an action (tool call), observes the result, then continues. ReAct became the dominant agentic pattern in 2023-2024 before being partially superseded by trained tool-use in modern frontier models. LangChain, CrewAI, and many early agent frameworks built around ReAct as the default loop.",
  },
  {
    term: "Agent Memory",
    id: "agent-memory",
    snippet:
      "Agent memory is persistent state an LLM agent maintains across turns, sessions, or interactions. Three common types: short-term, the current context window; episodic, recent conversation history retrieved via RAG; and long-term, facts and preferences stored in a separate database. Letta, formerly MemGPT, is the canonical reference implementation.",
    definition:
      "Persistent state an LLM agent maintains across turns, sessions, or interactions. Three common memory types: (1) short-term, the current context window; (2) episodic, recent conversation history retrieved via RAG; (3) long-term, facts and preferences stored in a separate database. Letta (formerly MemGPT) is the canonical reference implementation for persistent agent memory; modern frameworks (Mastra, CrewAI) ship memory primitives as a first-class concept.",
  },
  {
    term: "Multi-Agent Orchestration",
    id: "multi-agent-orchestration",
    snippet:
      "Multi-agent orchestration is an architecture where multiple LLM agents with distinct roles collaborate on a task, coordinated by a meta-agent or an explicit workflow. CrewAI and AutoGen pioneered the pattern; LangGraph and Mastra extended it with state-machine-style coordination. Key design tradeoffs include role specialization, message-passing semantics, and failure handling.",
    definition:
      "Architecture where multiple LLM agents with distinct roles collaborate on a task, coordinated by a meta-agent or explicit workflow. CrewAI and AutoGen pioneered the multi-agent pattern; LangGraph and Mastra extended it with state-machine-style coordination. Critical design tradeoffs: agent role specialization, message-passing semantics, failure handling, and the orchestration overhead vs single-agent baselines.",
  },
  {
    term: "Agent Evaluation",
    id: "agent-evaluation",
    snippet:
      "Agent evaluation is the discipline of measuring LLM agent capability, reliability, and safety across well-defined benchmarks. It is distinct from LLM evals because agent evals require multi-step trajectory measurement. Common benchmarks include SWE-bench for software engineering, tau-bench for tool use, WebArena for browser navigation, and AgentBench for general capability.",
    definition:
      "The discipline of measuring LLM agent capability, reliability, and safety across well-defined benchmarks. Distinct from LLM evals (which measure single-call performance) because agent evals require multi-step trajectory measurement. Common benchmarks: SWE-bench (software engineering), τ-bench (tool use), WebArena (browser navigation), AgentBench (general capability). Vendors: Braintrust, Galileo, Inspect AI, LangSmith.",
  },
  {
    term: "Agent Guardrails",
    id: "agent-guardrails",
    snippet:
      "Agent guardrails are runtime constraints that limit agent behavior: output filtering, tool-call validation, spend limits, time budgets, and harmful-action detection. Implementations include NVIDIA NeMo Guardrails and Guardrails AI. Distinct from training-time alignment like RLHF, guardrails operate at inference time and can be customized per deployment.",
    definition:
      "Runtime constraints that limit agent behavior, output filtering, tool-call validation, spend limits, time budgets, and harmful-action detection. Implementations include NVIDIA NeMo Guardrails, Guardrails AI, and platform-specific safety APIs (Anthropic, OpenAI). Distinct from training-time alignment (RLHF, Constitutional AI), guardrails operate at inference time and can be customized per deployment.",
  },
  {
    term: "Planning Agent",
    id: "planning-agent",
    snippet:
      "A planning agent is an LLM agent designed to decompose a high-level goal into a sequence of sub-tasks before executing. It typically uses chain-of-thought reasoning to construct the plan and a separate execution loop to carry it out. Examples include Devin, Claude Code, and AutoGen Planner; modern reasoning models can serve as planning agents natively.",
    definition:
      "An LLM agent designed to decompose a high-level goal into a sequence of sub-tasks before executing. Planning agents typically use Chain-of-Thought reasoning to construct the plan and a separate execution loop to carry it out. Examples: Devin (Cognition), Claude Code (Anthropic), AutoGen Planner. Modern reasoning models (OpenAI o1/o3, Claude with extended thinking) can serve as planning agents natively.",
  },
  {
    term: "Long-running Agent",
    id: "long-running-agent",
    snippet:
      "A long-running agent is an LLM agent designed to execute a task over hours, days, or longer, across multiple sessions, with persistent state and resilience to interruption. Examples include Claude with computer use and autonomous coding agents like Devin. They require durable workflow infrastructure such as Temporal or Inngest plus explicit checkpoint-resume primitives.",
    definition:
      "An LLM agent designed to execute a task over hours, days, or longer, across multiple sessions, with persistent state, and resilient to interruption. Examples: Anthropic's Claude with computer use, OpenAI's o1-Pro mode for extended reasoning, autonomous coding agents (Devin). Long-running agents require durable workflow infrastructure (Temporal, Inngest) and explicit checkpoint-resume primitives.",
  },
  {
    term: "Tool Bench",
    id: "tool-bench",
    snippet:
      "A tool bench is a benchmark suite that measures LLM agent capability at calling, chaining, and reasoning over real-world APIs. The original ToolBench from 2023 covered 16K+ APIs across 49 categories; modern variants like the Berkeley Function Calling Leaderboard and tau-bench refine the measurement. Frontier labs publish tool-use scores as proxies for agent capability.",
    definition:
      "Benchmark suite that measures LLM agent capability at calling, chaining, and reasoning over real-world APIs. The original ToolBench (2023) covered 16K+ APIs across 49 categories. Modern variants (Berkeley Function Calling Leaderboard, τ-bench) refine the measurement. Frontier labs publish tool-use scores on these benchmarks as proxies for agent capability.",
  },
  {
    term: "LPA (Limited Partner Agreement)",
    id: "lpa",
    snippet:
      "An LPA, Limited Partner Agreement, is the legal document governing the relationship between a venture fund and its investors. It specifies fund size, investment period, fund life, typically 10 years, management fee, carried interest, GP commit, distribution waterfall, and key-person provisions. It is the foundational document of fund formation.",
    definition:
      "The legal document governing the relationship between a venture capital fund (the General Partner) and its investors (Limited Partners). Specifies fund size, investment period, fund life (typically 10 years), management fee, carried interest, GP commit, distribution waterfall, and key-person provisions. The LPA is the foundational document of fund formation; LP-side legal counsel scrutiny on LPA terms is one of the longest stages of new-fund formation.",
  },
  {
    term: "GP Commit",
    id: "gp-commit",
    snippet:
      "GP commit is the capital that the General Partner commits to its own fund, expressed as a percentage of fund size. Industry standard ranges from 1% for institutional funds to 5%+ for emerging managers, where LPs require higher skin-in-the-game. GP commit is one of the strongest fund-quality signals LPs evaluate during diligence.",
    definition:
      "The capital that the General Partner (the VC firm) commits to its own fund, expressed as a percentage of fund size. Industry standard ranges from 1% (institutional funds) to 5%+ (emerging-manager funds where LPs require higher skin-in-the-game). GP commit is one of the strongest fund-quality signals LPs evaluate; a low or financed GP commit is often a red flag during LP diligence.",
  },
  {
    term: "Carried Interest (Carry)",
    id: "carried-interest",
    snippet:
      "Carried interest, or carry, is the General Partner's share of fund profits above the LPs' return of capital, typically after a preferred return hurdle of 6-8%. Industry standard is 20% carry on the upside, though high-performing funds can negotiate 25-30%. Carry is the primary economic incentive aligning GPs with LPs.",
    definition:
      "The General Partner's share of fund profits above the LPs' return of capital (and typically a preferred return hurdle of 6-8%). Industry standard is 20% carry on the upside, though high-performing funds can negotiate 25-30%. Carry is the primary economic incentive aligning GPs with LPs and is taxed favorably as long-term capital gains in most jurisdictions.",
  },
  {
    term: "Management Fee",
    id: "management-fee",
    snippet:
      "A management fee is the annual fee a venture fund charges its LPs to cover operating costs, typically 2% of committed capital during the investment period and 2% of invested capital during the harvest period. Emerging-manager funds occasionally negotiate 2.5-3%; large established funds sometimes step down to 1.5%.",
    definition:
      "The annual fee a venture fund charges its LPs to cover operating costs, typically 2% of committed capital during the investment period and 2% of invested capital during the harvest period. Tier-1 emerging-manager funds occasionally negotiate 2.5-3% to support more GP infrastructure; large established funds sometimes step down to 1.5%. Management fees are deducted from LP commitments and reduce the net IRR returns LPs ultimately realize.",
  },
  {
    term: "Vintage Year",
    id: "vintage-year",
    snippet:
      "A vintage year is the year a fund made its first investment, used by LPs to benchmark fund performance against peers raised in the same market environment. Vintage matters because returns are heavily macro-correlated: a 2020 vintage fund has different return-expectation context than a 2008 vintage. PitchBook and Cambridge Associates publish vintage-year benchmarks.",
    definition:
      "The year a fund made its first investment, used by LPs to benchmark fund performance against peers raised in the same market environment. Vintage matters because returns are heavily macro-correlated; a 2020 vintage fund has different return-expectation context than a 2008 vintage. PitchBook, Cambridge Associates, and Preqin publish vintage-year benchmarks that LPs use during fund evaluation.",
  },
  {
    term: "Capital Call",
    id: "capital-call",
    snippet:
      "A capital call is a formal request from a venture fund's General Partner to its Limited Partners to wire committed but not-yet-funded capital to the fund. LPs typically receive capital calls 10-15 days before the deadline with the dollar amount, allocation purpose, and wiring instructions. Defaults are extremely rare but do happen during economic distress.",
    definition:
      "A formal request from a venture fund's General Partner to its Limited Partners to wire committed but not-yet-funded capital to the fund. LPs typically receive capital calls 10-15 days before the deadline with the dollar amount, allocation purpose, and wiring instructions. Capital call defaults are extremely rare (default would forfeit the LP's stake) but do happen during economic distress.",
  },
  {
    term: "Deployment Frequency (DORA)",
    id: "deployment-frequency",
    snippet:
      "Deployment frequency is one of the four DORA metrics: how often code is deployed to production. Elite teams deploy multiple times per day; high performers once per day to once per week; medium performers once per month to once per six months. High deployment frequency correlates with lower batch sizes and faster feedback.",
    definition:
      "One of the four DORA metrics measuring software-delivery performance. Counts how often code is deployed to production: elite teams deploy multiple times per day; high-performing teams deploy once per day to once per week; medium-performing teams deploy once per month to once per six months; low-performing teams deploy less than once per six months. High deployment frequency correlates with lower batch sizes, faster feedback, and higher organizational reliability.",
  },
  {
    term: "Lead Time for Changes (DORA)",
    id: "lead-time-for-changes",
    snippet:
      "Lead time for changes is one of the four DORA metrics: the time between a code commit and that code running successfully in production. Elite teams achieve less than 1 day; high performers 1 day to 1 week; medium 1 week to 1 month; low 1 month to 6 months.",
    definition:
      "One of the four DORA metrics, the time between a code commit and that code running successfully in production. Elite teams: less than 1 day. High performers: 1 day to 1 week. Medium: 1 week to 1 month. Low: 1 month to 6 months. Short lead time enables rapid iteration on customer feedback and emergency security patches. Long lead time often correlates with batch-up-and-release-monthly culture and brittle deployment pipelines.",
  },
  {
    term: "Change Failure Rate (DORA)",
    id: "change-failure-rate",
    snippet:
      "Change failure rate is one of the four DORA metrics: the percentage of changes to production that result in degraded service, requiring hotfix, rollback, or remediation. Elite and high-performing teams sit at 0-15%; medium and low performers at 16-30%. DORA research shows high performers have both high deployment frequency and low failure rate.",
    definition:
      "One of the four DORA metrics, the percentage of changes to production that result in degraded service, requiring hotfix, rollback, or remediation. Elite and high-performing teams: 0-15%. Medium and low performers: 16-30%. Despite intuition that high deployment frequency causes more failures, DORA research shows the opposite, high performers have BOTH high deployment frequency AND low change failure rate, because small batches reduce per-change risk.",
  },
  {
    term: "Red-Teaming (AI)",
    id: "red-teaming-ai",
    snippet:
      "AI red-teaming is adversarial testing of LLMs by humans or other AI systems attempting to elicit harmful, unsafe, or undesired behaviors. The goal is to surface jailbreaks, alignment failures, and security vulnerabilities before public release. Anthropic, OpenAI, Google DeepMind, and Meta all run internal red teams; the practice has matured into a distinct discipline.",
    definition:
      "Adversarial testing of LLMs by humans (or other AI systems) attempting to elicit harmful, unsafe, or undesired behaviors. Goals: surface jailbreaks, alignment failures, security vulnerabilities, and miscalibrated capabilities before public release. Anthropic, OpenAI, Google DeepMind, and Meta all run internal red-teams; the practice has matured into a distinct discipline with publishing venues (Anthropic Red-Teaming Network, OpenAI's evals team).",
  },
  {
    term: "Jailbreak",
    id: "jailbreak",
    snippet:
      "A jailbreak is a prompt or sequence of prompts designed to bypass an LLM's safety training and elicit prohibited behaviors. Common patterns include role-playing as an uncensored AI, fictional framing, multi-turn manipulation, and adversarial token sequences. Modern frontier models substantially harden against jailbreaks, but the cat-and-mouse continues.",
    definition:
      "A prompt or sequence of prompts designed to bypass an LLM's safety training and elicit prohibited behaviors. Common patterns: role-playing as an uncensored AI, fictional framing, multi-turn manipulation, and adversarial token sequences. Modern frontier models substantially harden against jailbreaks via Constitutional AI training and runtime input filtering, but the cat-and-mouse continues.",
  },
  {
    term: "Eval (LLM Benchmark)",
    id: "eval-llm",
    snippet:
      "An LLM eval is a structured benchmark measuring model capability on a specific task. Common evals include MMLU for broad academic knowledge, HumanEval for Python code generation, GSM8K for math word problems, GPQA for graduate-level science, and SWE-bench for software engineering. Evals drive reward modeling and serve as the screening test for model releases.",
    definition:
      "A structured benchmark measuring LLM capability on a specific task. Common evals: MMLU (broad academic knowledge), HumanEval (Python code generation), GSM8K (math word problems), MATH (advanced math), GPQA (graduate-level science), SWE-bench (software engineering trajectories). Eval-driven development is the foundation of modern LLM training: evals provide the loss signal for reward modeling, the screening test for model releases, and the comparative basis for cross-lab model comparison.",
  },
];
