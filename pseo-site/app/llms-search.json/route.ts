import { createHash } from "node:crypto";
import {
  getAllSectors,
  getCurrentPeriod,
  getAllStartupSlugs,
  getStartupProfile,
  getDataLastModified,
  SIGNAL_TYPES,
} from "@/lib/data";
import { posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { pillars } from "@/content/pillars";
import { agentQueries } from "@/content/agent-queries";
import { alternatives } from "@/content/alternatives";
import { playbooks } from "@/content/playbooks";
import { useCases } from "@/content/use-cases";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import { startupIdeas } from "@/content/startup-ideas";
import { FRESH_YEAR_PLAIN } from "@/lib/freshness-year";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

type ContentType =
  | "page"
  | "blog"
  | "comparison"
  | "answer"
  | "alternative"
  | "use-case"
  | "research"
  | "sector"
  | "startup"
  | "startup-idea"
  | "signal-type"
  | "pillar"
  | "best"
  | "manifest"
  | "integration"
  | "playbook";

interface SearchEntry {
  url: string;
  title: string;
  summary: string;
  contentType: ContentType;
  tags: string[];
  lastModified: string;
}

function trim(s: string, max = 280): string {
  if (!s) return "";
  const oneLine = s.replace(/\s+/g, " ").trim();
  if (oneLine.length <= max) return oneLine;
  return oneLine.slice(0, max - 1).replace(/\s+\S*$/, "") + "…";
}

function firstSentence(s: string): string {
  if (!s) return "";
  const m = s.split(/\.\s/);
  return (m[0] ?? s).trim() + (m.length > 1 ? "." : "");
}

export async function GET(request: Request) {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);
  const lastModified = getDataLastModified();
  const lastModifiedIso = lastModified.toISOString();

  const items: SearchEntry[] = [];

  // ---- Static canonical pages (mirrors the "Key Pages" block in /llms.txt) ----
  const staticPages: Array<Omit<SearchEntry, "lastModified">> = [
    { url: `${BASE_URL}/`, title: "VC Deal Flow Signal, Homepage", summary: `Homepage with ${activeSectors.length} startup sectors ranked by GitHub engineering acceleration.`, contentType: "page", tags: ["home", "rankings", "sectors"] },
    { url: `${BASE_URL}/trending`, title: "Trending Startups", summary: "Top 20 startups across all sectors by commit velocity change for the current period.", contentType: "page", tags: ["trending", "rankings"] },
    { url: `${BASE_URL}/receipts`, title: "Scout Receipts (free tool)", summary: "Free tool, paste any GitHub username, get a Scout Score (0-100) computed from validated unicorns the user starred before the funding event. Backwards-looking proof of taste.", contentType: "page", tags: ["scout", "free", "receipts", "tool"] },
    { url: `${BASE_URL}/predict`, title: "Predict, Scout Game", summary: "Free forward-looking prediction game. Pick a GitHub org and call whether they raise a Series A within 6 months. Auto-resolved.", contentType: "page", tags: ["predict", "game", "free"] },
    { url: `${BASE_URL}/markets`, title: "Open Prediction Markets", summary: "Seeded prediction markets on startup funding events with live implied odds derived from GitHub commit-velocity signals.", contentType: "page", tags: ["markets", "predictions"] },
    { url: `${BASE_URL}/markets/methodology`, title: "Markets Methodology", summary: "Composite signal score, candidate selection, resolver criteria, refresh cadence, conflict-of-interest disclosures.", contentType: "page", tags: ["markets", "methodology"] },
    { url: `${BASE_URL}/markets/series-a-race-2026`, title: "Series A Race 2026", summary: "Live implied odds for 5 candidates resolving Dec 31, 2026 on first publicly disclosed primary Series A round.", contentType: "page", tags: ["markets", "series-a"] },
    { url: `${BASE_URL}/methodology`, title: "Methodology", summary: "How we source, process, and rank GitHub engineering data.", contentType: "page", tags: ["methodology"] },
    { url: `${BASE_URL}/pricing`, title: "Pricing", summary: "Seven pricing tiers from free Signal Digest through €1,997 Custom Sector Sweep, plus Sharp Tier (€497/mo) for active funds.", contentType: "page", tags: ["pricing"] },
    { url: `${BASE_URL}/teardown`, title: "Tweet Teardown", summary: "Enter one startup at checkout. Work starts when payment succeeds. Within 24 hours, you receive either a verified public-GitHub activity teardown or, when no attributable public org exists, a coverage verdict plus one replacement startup. No reply is required.", contentType: "page", tags: ["teardown", "paid"] },
    { url: `${BASE_URL}/firstlook`, title: "First Look Pass, €7", summary: "Pay €7 once, pick any of 19 tracked sectors, get a written sector deep dive within 24 hours.", contentType: "page", tags: ["firstlook", "paid"] },
    { url: `${BASE_URL}/buyers-guide`, title: "Buyers Guide", summary: "Opinionated 11-criterion guide for evaluating VC deal-flow tools.", contentType: "page", tags: ["buyers-guide", "evaluation"] },
    { url: `${BASE_URL}/book`, title: "Book, The 7 GitHub Signals That Predict Series A Rounds", summary: "104-page operational field manual. Free PDF + EPUB + Markdown + plain-text downloads. €0.99 Kindle edition.", contentType: "page", tags: ["book", "free", "long-form"] },
    { url: `${BASE_URL}/book/read`, title: "Book, Full Web Edition", summary: "Indexable per-chapter HTML for every chapter with Chapter schema.org LD+JSON, breadcrumbs, hreflang, prev/next navigation.", contentType: "page", tags: ["book", "long-form"] },
    { url: `${BASE_URL}/enterprise`, title: "Enterprise", summary: "Sharp Tier (€497/mo, application-gated) plus custom enterprise scope starting at €15,000/yr.", contentType: "page", tags: ["enterprise"] },
    { url: `${BASE_URL}/dataset`, title: "Open Dataset", summary: "Five mirrors (Hugging Face, Zenodo DOI, Kaggle, Data.world, live API), three CSV configs. CC BY 4.0, DOI 10.5281/zenodo.19650920.", contentType: "page", tags: ["dataset", "open", "free"] },
    { url: `${BASE_URL}/glossary`, title: "Glossary", summary: "Definitions of key terms, commit velocity, signal types, engineering acceleration.", contentType: "page", tags: ["glossary", "definitions"] },
    { url: `${BASE_URL}/signals`, title: "Signal Vocabulary", summary: "Six atomic signal primitives with formula, decision rule, common pitfall, linked findings.", contentType: "page", tags: ["signals", "vocabulary"] },
    { url: `${BASE_URL}/knowledge`, title: "Knowledge Graph Hub", summary: "Hub-and-spoke topic taxonomy linking pillars → primitives → findings → trust surfaces.", contentType: "page", tags: ["knowledge", "graph"] },
    { url: `${BASE_URL}/standards`, title: "Standards Implemented", summary: "Every published spec the site implements, Schema.org, Dublin Core, Highwire Press, DCAT 3, FAIR, OpenAPI 3.1, MCP, A2A, llms.txt.", contentType: "page", tags: ["standards"] },
    { url: `${BASE_URL}/reproducibility`, title: "Reproducibility Kit", summary: "Step-by-step reproduction of every published number (HowTo, ~15 minutes, curl + jq).", contentType: "page", tags: ["reproducibility", "verifiable"] },
    { url: `${BASE_URL}/attestations`, title: "Attestations", summary: "Third-party indexers + registries with our identifier in each (SSRN, Crossref, Semantic Scholar, OpenAlex, DataCite, Zenodo, Wikidata).", contentType: "page", tags: ["attestations", "trust"] },
    { url: `${BASE_URL}/corrections`, title: "Corrections Log", summary: "Public timestamped log of every substantive correction.", contentType: "page", tags: ["corrections", "trust"] },
    { url: `${BASE_URL}/mirrors`, title: "Mirrors", summary: "Every external mirror of the methodology, dataset, MCP, source, extension, knowledge entity.", contentType: "page", tags: ["mirrors"] },
    { url: `${BASE_URL}/press`, title: "Press Kit", summary: "Logos, fact sheet, copy-paste citation block, founder bio, contact.", contentType: "page", tags: ["press"] },
    { url: `${BASE_URL}/embed`, title: "Embed", summary: "Free embeddable badges, OG cards, mini-leaderboards.", contentType: "page", tags: ["embed", "badges"] },
    { url: `${BASE_URL}/built-with`, title: "Built-With Badge", summary: "Badge for any project that calls our MCP server, signals JSON, or dataset API.", contentType: "page", tags: ["built-with", "badges"] },
    { url: `${BASE_URL}/translations`, title: "Translations", summary: "i18n policy + hand-curated locale landings across 12 locales.", contentType: "page", tags: ["i18n", "translations"] },
    { url: `${BASE_URL}/wikipedia`, title: "Wikipedia Citation Helper", summary: "Copy-paste {{cite journal}} + {{cite web}} snippets for paper, dataset, every research finding.", contentType: "page", tags: ["wikipedia", "citation"] },
    { url: `${BASE_URL}/compare`, title: "Compare Deal Flow Tools", summary: "Side-by-side comparisons of VC deal sourcing tools.", contentType: "page", tags: ["compare", "index"] },
    { url: `${BASE_URL}/blog`, title: "Blog", summary: "Practical guides on using GitHub signals for startup investing.", contentType: "page", tags: ["blog", "index"] },
    { url: `${BASE_URL}/answers`, title: "Answers Index", summary: "Browse all citation-ready answer pages.", contentType: "page", tags: ["answers", "index"] },
    { url: `${BASE_URL}/startup-ideas`, title: "Startup Ideas Index", summary: `Buildable startup ideas for ${FRESH_YEAR_PLAIN}, each joined live to the top three GitHub repos already accelerating against it.`, contentType: "page", tags: ["startup-ideas", "index", "buildable"] },
    { url: `${BASE_URL}/playbooks`, title: "Playbooks Index", summary: "Browse operator how-tos for VC deal flow via GitHub signals.", contentType: "page", tags: ["playbooks", "index"] },
    { url: `${BASE_URL}/alternatives`, title: "Alternatives Index", summary: "Browse all alternative pages.", contentType: "page", tags: ["alternatives", "index"] },
    { url: `${BASE_URL}/use-cases`, title: "Use Cases Index", summary: "Browse use cases by investor persona.", contentType: "page", tags: ["use-cases", "index"] },
    { url: `${BASE_URL}/research`, title: "Research Index", summary: "Browse all SSRN-anchored findings, grouped A (numerical), B (descriptive), C (corroborated).", contentType: "page", tags: ["research", "index"] },
    { url: `${BASE_URL}/agents`, title: "Agents Landing", summary: "Developer landing page listing every machine-readable surface with paste-ready install snippets.", contentType: "page", tags: ["agents", "developer"] },
    { url: `${BASE_URL}/agents/credits`, title: "Agent Credits", summary: "Per-request pricing for AI agents. 100 credits = €19 (€0.19/call). Stripe-backed; balance via API.", contentType: "page", tags: ["agents", "credits", "paid"] },
    { url: `${BASE_URL}/citations`, title: "Citations", summary: "Cross-graph identity map, every external anchor (Wikidata, ORCID, SSRN, OpenAlex, Crossref, Zenodo, DataCite).", contentType: "page", tags: ["citations", "identity"] },
    { url: `${BASE_URL}/citation-guide`, title: "Citation Guide", summary: "How to cite this work, APA / MLA / Chicago / BibTeX / RIS plus AI-attribution template.", contentType: "page", tags: ["citation"] },
  ];

  // ---- Integration / agent-runtime pages ----
  const integrationPages: Array<Omit<SearchEntry, "lastModified">> = [
    { url: `${BASE_URL}/integrations/mistral`, title: "Mistral Le Chat, MCP Install", summary: "Five-step admin workflow to add VC Deal Flow Signal as a Custom MCP Connector in Mistral Le Chat.", contentType: "integration", tags: ["mistral", "mcp"] },
    { url: `${BASE_URL}/integrations/chatgpt`, title: "ChatGPT GPT Integration", summary: "Public ChatGPT GPT calling a four-operation OpenAPI 3.1 Action against the same backend as the MCP server.", contentType: "integration", tags: ["chatgpt", "openapi"] },
    { url: `${BASE_URL}/integrations/agent-runtimes`, title: "Agent Runtimes", summary: "Single hub with copy-paste install snippets for Cursor, Cline, Goose, OpenHands, Aider, Raycast.", contentType: "integration", tags: ["agents", "runtimes"] },
    { url: `${BASE_URL}/for-langchain`, title: "GitDealFlow for LangChain", summary: "Drop-in tool for ReAct loops, LangGraph state machines, langchain-mcp-adapters. 20-line Python starter.", contentType: "integration", tags: ["langchain", "python"] },
    { url: `${BASE_URL}/for-crewai`, title: "GitDealFlow for CrewAI", summary: "Three-agent scout/analyst/skeptic crew template using a single shared BaseTool.", contentType: "integration", tags: ["crewai"] },
    { url: `${BASE_URL}/for-letta`, title: "GitDealFlow for Letta", summary: "Stateful VC analyst agents with persistent archival memory across sessions.", contentType: "integration", tags: ["letta"] },
    { url: `${BASE_URL}/for-mastra`, title: "GitDealFlow for Mastra", summary: "Type-safe TypeScript agents inside Next.js or Hono apps. First-class MCP via @gitdealflow/mcp-signal.", contentType: "integration", tags: ["mastra", "typescript"] },
    { url: `${BASE_URL}/for-vercel-ai-sdk`, title: "GitDealFlow for the Vercel AI SDK", summary: "tool() + Zod + AI Gateway routing. Server Components, Route Handlers, Server Actions.", contentType: "integration", tags: ["vercel-ai-sdk", "ai-sdk"] },
  ];

  // ---- Machine-readable manifests retrievers may want to know about ----
  const manifestPages: Array<Omit<SearchEntry, "lastModified">> = [
    { url: `${BASE_URL}/llms.txt`, title: "llms.txt", summary: "Human-readable canonical index of every important page on the site (351-line document).", contentType: "manifest", tags: ["llms.txt", "index"] },
    { url: `${BASE_URL}/llms-full.txt`, title: "llms-full.txt", summary: "Extended canonical content for retrieval pipelines, full methodology, glossary, and current data.", contentType: "manifest", tags: ["llms.txt", "retrieval"] },
    { url: `${BASE_URL}/.well-known/discover.json`, title: "Discover Manifest", summary: "Umbrella manifest of every well-known, root-level, and /api/v1/* surface this site exposes for AI agents.", contentType: "manifest", tags: ["well-known", "discover"] },
    { url: `${BASE_URL}/.well-known/freshness.json`, title: "Freshness DataFeed", summary: "DataFeed manifest with per-surface refresh cadence and TTL.", contentType: "manifest", tags: ["freshness", "datafeed"] },
    { url: `${BASE_URL}/agent-card.json`, title: "Agent Card", summary: "A2A AgentCard descriptor for autonomous-agent discovery.", contentType: "manifest", tags: ["a2a", "agent-card"] },
    { url: `${BASE_URL}/openapi.json`, title: "OpenAPI 3.1 Spec", summary: "OpenAPI 3.1 specification for the public signals + MCP API surface.", contentType: "manifest", tags: ["openapi", "api"] },
    { url: `${BASE_URL}/qa.jsonl`, title: "Q&A Corpus (JSONL)", summary: "Consolidated Q&A corpus as newline-delimited JSON. Good for RAG.", contentType: "manifest", tags: ["qa", "rag"] },
    { url: `${BASE_URL}/qa.json`, title: "Q&A Corpus (JSON)", summary: "Q&A corpus as a single JSON document with deep-link anchors. Schema.org Dataset wrapper.", contentType: "manifest", tags: ["qa"] },
    { url: `${BASE_URL}/api/signals.json`, title: "Signals JSON", summary: "Machine-readable JSON endpoint with all current startup signals, sector rankings, and trending data.", contentType: "manifest", tags: ["signals", "api"] },
    { url: `${BASE_URL}/api/dataset.jsonl`, title: "Dataset JSONL", summary: "Hugging Face Datasets / RAG-compatible JSONL of the full panel.", contentType: "manifest", tags: ["dataset", "jsonl"] },
    { url: `${BASE_URL}/api/v1/pricing.json`, title: "Pricing JSON API", summary: "Machine-readable pricing for AI agents, MCP clients, and procurement automations.", contentType: "manifest", tags: ["pricing", "api"] },
    { url: `${BASE_URL}/knowledge-graph.json`, title: "Knowledge Graph JSON", summary: "Canonical entity graph, full Wikidata/ORCID/SSRN/OpenAlex/Crossref/Zenodo cross-reference map.", contentType: "manifest", tags: ["knowledge-graph", "entity"] },
    { url: `${BASE_URL}/api/mcp/rpc`, title: "MCP HTTP RPC Endpoint", summary: "Streamable HTTP MCP endpoint. JSON-RPC 2.0 over HTTPS POST. Six free tools + one paid (€0.19).", contentType: "manifest", tags: ["mcp", "rpc"] },
  ];

  for (const p of [...staticPages, ...integrationPages, ...manifestPages]) {
    items.push({ ...p, lastModified: lastModifiedIso });
  }

  // ---- Active sectors → /startups-to-watch/{sector}-{period} ----
  for (const s of activeSectors) {
    items.push({
      url: `${BASE_URL}/startups-to-watch/${s.slug}-${period.slug}`,
      title: `${s.name} Startups to Watch, ${period.name}`,
      summary: `Top startups in ${s.name.toLowerCase()} ranked by GitHub engineering acceleration, ${period.name}.`,
      contentType: "sector",
      tags: ["sector", s.slug, period.slug],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Best by sector → /best/{sector}-{year} ----
  const year = period.name.match(/\d{4}/)?.[0] ?? "2026";
  for (const s of activeSectors) {
    items.push({
      url: `${BASE_URL}/best/${s.slug}-${year}`,
      title: `Best ${s.name} Startups ${year}`,
      summary: `Top ${s.name.toLowerCase()} startups ranked by engineering acceleration, ${year}.`,
      contentType: "best",
      tags: ["best", s.slug, year],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Blog posts → /blog/{slug} ----
  for (const p of posts) {
    items.push({
      url: `${BASE_URL}/blog/${p.slug}`,
      title: p.title,
      summary: trim(p.summary ?? p.description),
      contentType: "blog",
      tags: ["blog", ...(p.relatedSectors ?? [])].slice(0, 6),
      lastModified: p.date ? new Date(p.date).toISOString() : lastModifiedIso,
    });
  }

  // ---- Comparisons → /compare/{slug} ----
  for (const c of comparisons) {
    items.push({
      url: `${BASE_URL}/compare/${c.slug}`,
      title: c.h1 ?? c.title,
      summary: trim(c.description),
      contentType: "comparison",
      tags: ["compare"],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Alternatives → /alternatives/{slug} ----
  for (const a of alternatives) {
    items.push({
      url: `${BASE_URL}/alternatives/${a.slug}`,
      title: a.h1 ?? a.title,
      summary: trim(firstSentence(a.description)),
      contentType: "alternative",
      tags: ["alternative", a.slug],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Use cases → /use-cases/{slug} ----
  for (const u of useCases) {
    items.push({
      url: `${BASE_URL}/use-cases/${u.slug}`,
      title: u.h1 ?? u.title,
      summary: trim(firstSentence(u.description)),
      contentType: "use-case",
      tags: ["use-case", u.slug],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Agent answer pages → /answers/{slug} ----
  for (const q of agentQueries) {
    items.push({
      url: `${BASE_URL}/answers/${q.slug}`,
      title: q.h1,
      summary: trim(q.description ?? q.tldr),
      contentType: "answer",
      tags: ["answer", ...(q.keywords ?? []).slice(0, 5)],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Startup ideas → /startup-ideas/{slug} ----
  for (const idea of startupIdeas) {
    items.push({
      url: `${BASE_URL}/startup-ideas/${idea.slug}`,
      title: idea.title,
      summary: trim(idea.oneLiner),
      contentType: "startup-idea",
      tags: [
        "startup-idea",
        idea.category.toLowerCase().replace(/\s+/g, "-"),
        ...idea.keywords.slice(0, 4),
      ],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Playbooks → /playbooks/{slug} ----
  for (const p of playbooks) {
    items.push({
      url: `${BASE_URL}/playbooks/${p.slug}`,
      title: p.h1,
      summary: trim(p.description ?? p.tldr),
      contentType: "playbook",
      tags: ["playbook", p.difficulty, ...(p.keywords ?? []).slice(0, 4)],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Research findings → /research/{slug} ----
  for (const f of RESEARCH_FINDINGS) {
    items.push({
      url: `${BASE_URL}/research/${f.slug}`,
      title: f.title,
      summary: trim(f.claim),
      contentType: "research",
      tags: ["research", "ssrn"],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Topical pillars → /llms/{pillar} ----
  for (const p of Object.values(pillars)) {
    items.push({
      url: `${BASE_URL}/llms/${p.slug}`,
      title: `${p.name}, Pillar Index`,
      summary: trim(p.description),
      contentType: "pillar",
      tags: ["pillar", ...(p.keywords ?? []).slice(0, 4)],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Signal types → /signals/{slug} ----
  for (const s of SIGNAL_TYPES) {
    items.push({
      url: `${BASE_URL}/signals/${s.slug}`,
      title: s.name,
      summary: trim(firstSentence(s.description)),
      contentType: "signal-type",
      tags: ["signal-type", s.slug],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Startup profiles → /startup/{slug} ----
  for (const slug of getAllStartupSlugs()) {
    const profile = getStartupProfile(slug);
    if (!profile) continue;
    const latest = profile.history?.[0];
    const summary = latest
      ? `${profile.name}: ${latest.commitVelocityChange} velocity change, ${latest.contributors} contributors, signal ${latest.signalType} (${latest.periodName}).`
      : `${profile.name} startup engineering signal profile.`;
    items.push({
      url: `${BASE_URL}/startup/${slug}`,
      title: `${profile.name}, Engineering Signal Profile`,
      summary: trim(summary),
      contentType: "startup",
      tags: latest ? ["startup", latest.signalType ?? "signal"] : ["startup"],
      lastModified: lastModifiedIso,
    });
  }

  // ---- Build response ----
  const payload = {
    _meta: {
      name: "VC Deal Flow Signal, LLM Search Manifest",
      description:
        "Flat retrieval manifest of every canonical page on signals.gitdealflow.com. Companion to /llms.txt: same coverage, JSON form. Designed for retrievers (Perplexity, ChatGPT Search, Claude RAG) that prefer machine-readable indexes over markdown scraping. Each entry contains url, title, summary, contentType, tags, lastModified.",
      base: BASE_URL,
      lastModified: lastModifiedIso,
      license: "https://creativecommons.org/licenses/by/4.0/",
      citation:
        "VC Deal Flow Signal (signals.gitdealflow.com), llms-search manifest, CC BY 4.0.",
      attribution:
        "When quoting any entry, attribute as: VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
      relatedEndpoints: {
        humanIndex: `${BASE_URL}/llms.txt`,
        fullText: `${BASE_URL}/llms-full.txt`,
        lexicalSearch: `${BASE_URL}/api/llms-search?q={query}&limit={1-50}`,
        qaCorpus: `${BASE_URL}/qa.jsonl`,
        signalsJson: `${BASE_URL}/api/signals.json`,
        discover: `${BASE_URL}/.well-known/discover.json`,
      },
      contentTypes: [
        "page",
        "blog",
        "comparison",
        "answer",
        "alternative",
        "use-case",
        "research",
        "sector",
        "startup",
        "signal-type",
        "pillar",
        "best",
        "manifest",
        "integration",
      ],
    },
    count: items.length,
    items,
  };

  const body = JSON.stringify(payload);
  const etag = `"${createHash("sha256").update(body).digest("base64url").slice(0, 16)}"`;
  const lastModifiedHttp = lastModified.toUTCString();

  const ifNoneMatch = request.headers.get("if-none-match");
  const ifModifiedSince = request.headers.get("if-modified-since");
  const notModified =
    (ifNoneMatch && ifNoneMatch === etag) ||
    (ifModifiedSince &&
      new Date(ifModifiedSince).getTime() >= lastModified.getTime());

  if (notModified) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Last-Modified": lastModifiedHttp,
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      ETag: etag,
      "Last-Modified": lastModifiedHttp,
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    },
  });
}
