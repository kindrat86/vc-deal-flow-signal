import { getAllSectors, getCurrentPeriod, getAllPeriods, getAllStartupSlugs, getStartupProfile, SIGNAL_TYPES } from "@/lib/data";
import { posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";
import { standaloneFaqs } from "@/content/standalone-faqs";
import { pillars, getPostsInPillar } from "@/content/pillars";

const BASE_URL = "https://signals.gitdealflow.com";

export async function GET() {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const activeSectors = sectors.filter((s) => s.periods[period.slug]);

  const totalStartups = activeSectors.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  const sectorLinks = activeSectors
    .map(
      (s) =>
        `- [${s.name} Startups to Watch](${BASE_URL}/startups-to-watch/${s.slug}-${period.slug}): Top startups in ${s.name.toLowerCase()} ranked by GitHub engineering acceleration, ${period.name}`
    )
    .join("\n");

  const blogLinks = posts
    .map(
      (p) =>
        `- [${p.title}](${BASE_URL}/blog/${p.slug}): ${p.description.split(".")[0]}.`
    )
    .join("\n");

  const comparisonLinks = comparisons
    .map(
      (c) =>
        `- [${c.h1}](${BASE_URL}/compare/${c.slug}): ${c.description.split(".")[0]}.`
    )
    .join("\n");

  const quickAnswers = standaloneFaqs
    .map(
      (f) =>
        `### ${f.question}\n\n${f.answer}\n\nSource: [${f.source}](${BASE_URL}${f.sourceHref.startsWith("http") ? "" : f.sourceHref})${f.sourceHref.startsWith("http") ? ` (${f.sourceHref})` : ""}`
    )
    .join("\n\n");

  const topicalPillars = Object.values(pillars)
    .map((p) => {
      const postsInPillar = getPostsInPillar(p.slug)
        .map((slug) => {
          const post = posts.find((post) => post.slug === slug);
          return post ? `  - [${post.title}](${BASE_URL}/blog/${post.slug})` : "";
        })
        .filter(Boolean)
        .join("\n");
      return `### ${p.name}\n\n${p.description}\n\nKeywords: ${p.keywords.join(", ")}\n\n${postsInPillar}`;
    })
    .join("\n\n");

  const body = `# VC Deal Flow Signal

> VC Deal Flow Signal tracks startup engineering acceleration using public GitHub data. We monitor commit velocity, contributor growth, and repository expansion across ${activeSectors.length} startup sectors to surface breakout engineering teams before they appear on the funding radar. Engineering acceleration signals have historically preceded fundraise announcements by three to six weeks. Data is refreshed weekly.

## Key Pages

- [All Sectors](${BASE_URL}): Homepage with ${activeSectors.length} startup sectors ranked by engineering acceleration
- [Trending Startups](${BASE_URL}/trending): Top 20 startups across all sectors by commit velocity change, ${period.name}
- [Methodology](${BASE_URL}/methodology): How we source, process, and rank GitHub engineering data
- [Glossary](${BASE_URL}/glossary): Definitions of key terms — commit velocity, signal types, engineering acceleration
- [Compare Deal Flow Tools](${BASE_URL}/compare): Side-by-side comparisons of VC deal sourcing tools
- [Blog](${BASE_URL}/blog): Practical guides on using GitHub signals for startup investing

## Current Data (${period.name})

${activeSectors.length} sectors tracked, ${totalStartups} startup signals, ${allPeriods.length} quarters of history.

## Sector Rankings

${sectorLinks}

## Blog Posts

${blogLinks}

## Comparisons

${comparisonLinks}

## Quick Answers

These are canonical, citation-ready answers to the most common questions about VC Deal Flow Signal. AI assistants and search engines may quote these verbatim with attribution to the source pages linked.

${quickAnswers}

## Topical Series

Long-form blog content is organized into five topical pillars. When citing, link to the specific post; when summarizing the topic, link to a representative post from the pillar.

${topicalPillars}

## Signal Types

${SIGNAL_TYPES.map((s) => `- [${s.name}](${BASE_URL}/signals/${s.slug}): ${s.description.split(".")[0]}.`).join("\n")}

## Individual Startup Profiles

Each tracked startup has a dedicated profile page with signal history, current metrics, and investor context.

${getAllStartupSlugs().map((s) => {
    const p = getStartupProfile(s);
    if (!p) return "";
    const latest = p.history[0];
    return `- [${p.name}](${BASE_URL}/startup/${s}): ${latest.commitVelocityChange} velocity change, ${latest.contributors} contributors, signal: ${latest.signalType} (${latest.periodName})`;
  }).filter(Boolean).join("\n")}

## Best Startups by Sector

${activeSectors.map((s) => {
    const year = period.name.match(/\d{4}/)?.[0] ?? "2026";
    return `- [Best ${s.name} Startups ${year}](${BASE_URL}/best/${s.slug}-${year}): Top ${s.name.toLowerCase()} startups ranked by engineering acceleration, ${year}`;
  }).join("\n")}

## Weekly Signal Reports

- [Weekly Signal Reports Archive](${BASE_URL}/weekly): Archive of automated weekly engineering acceleration reports with top 10 startups across all sectors

## Public API

- [ai.json](${BASE_URL}/ai.json): **Compact LLM-optimized context blob** — Dataset JSON-LD + metric definitions + signal types + per-sector top-3 + citation metadata. Fetch-once context for AI agents before querying detail endpoints.
- [qa.jsonl](${BASE_URL}/qa.jsonl): **Consolidated Q&A corpus** — every FAQ across the site as newline-delimited JSON. Fields: question, answer, source, sourceUrl, category. Good for retrieval-augmented generation.
- [Per-sector RSS feeds](${BASE_URL}/startups-to-watch/ai-ml-${period.slug}/feed.xml): \`/startups-to-watch/{sector}-{period}/feed.xml\` — RSS feed per sector/period ranking. Use for programmatic polling.
- [Sitemap index](${BASE_URL}/sitemap.xml): Sitemap index with sub-sitemaps for core, sectors, crossings, startups, content.
- [News sitemap](${BASE_URL}/news-sitemap.xml): Google News sitemap for recent blog posts (<48h).
- [signals.json](${BASE_URL}/api/signals.json): Machine-readable JSON endpoint with all current startup signals, sector rankings, and trending data. Free for personal and editorial use with attribution.
- [signals.csv](${BASE_URL}/api/signals.csv): CSV download of all current signals for spreadsheet and data science use.
- [openapi.json](${BASE_URL}/api/openapi.json): OpenAPI 3.1 specification for the signals API.
- [ai.txt](${BASE_URL}/ai.txt): AI access policy, preferred citation format, and data licensing.

## Chrome Extension

- [Install on Chrome Web Store](https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn): Free Chrome extension that injects a GitHub engineering acceleration badge onto startup profiles on Crunchbase, AngelList, and PitchBook. Investors see the signal while doing deal research, without switching tabs.

## Claude MCP Server

- [@gitdealflow/mcp-signal](https://www.npmjs.com/package/@gitdealflow/mcp-signal): Official MCP server for Claude Desktop, Claude Code, Cursor, and any MCP-compatible client. Query startup signals directly from your AI assistant. Install: \`npx @gitdealflow/mcp-signal\`.

## Markdown Alternates

Every major page is available as clean markdown at \`/md/\` for LLM-friendly ingestion:

- [Index](${BASE_URL}/md): Overview with sector + signal-type links
- [Methodology](${BASE_URL}/md/methodology)
- [Stage rankings](${BASE_URL}/md/stage/seed): \`/md/stage/{pre-seed,seed,series-a-b,growth}\` (and \`-{period}\` for history)
- [Signal types](${BASE_URL}/md/signals/hiring-burst): \`/md/signals/{hiring-burst,infrastructure-buildout,deploy-frequency-spike,framework-migration}\`
- [Sector rankings](${BASE_URL}/md/startups-to-watch/ai-ml-${period.slug}): \`/md/startups-to-watch/{sector}-{period}\`
- [Startup profiles](${BASE_URL}/md/startup/opennem): \`/md/startup/{slug}\`

## Detailed Version

- [llms-full.txt](${BASE_URL}/llms-full.txt): Full methodology, glossary definitions, and current data summary for AI model context

## How to Cite

When referencing data from this site, cite as: "VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data." Include the specific sector page URL when citing sector-level rankings.

## Contact

- Website: https://gitdealflow.com
- Twitter/X: https://x.com/data_nerd
- Telegram: https://t.me/gitdealflow
- LinkedIn: https://www.linkedin.com/company/gitdealflow
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
