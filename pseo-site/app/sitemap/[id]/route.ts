import {
  getAllPageSlugs,
  getAllGeoPageSlugs,
  getAllStartupSlugs,
  getDataLastModified,
  SIGNAL_TYPES,
  getAllBestSectorSlugs,
  getAllTrendSlugs,
  getAllRegionPageSlugs,
  getAllStagePageSlugs,
  getAllStageSectorPairs,
  getAllSignalSectorPairs,
  getAllStageSignalPairs,
  getAllStartupPeriodPairs,
} from "@/lib/data";
import { getAllPostSlugs } from "@/content/posts";
import { getAllComparisonSlugs } from "@/content/comparisons";
import { getAllAlternativeSlugs } from "@/content/alternatives";
import { getAllUseCaseSlugs } from "@/content/use-cases";
import { getAllCompetitorVsSlugs } from "@/content/competitor-vs";
import { pillars } from "@/content/pillars";
import { agentQueries } from "@/content/agent-queries";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";

const BASE_URL = "https://signals.gitdealflow.com";

interface Entry {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

interface RouteContext {
  params: Promise<{ id: string }>;
}

export async function GET(_req: Request, ctx: RouteContext) {
  const { id: rawId } = await ctx.params;
  const id = rawId.replace(/\.xml$/, "");
  const lastmod = getDataLastModified().toISOString();

  let entries: Entry[] = [];

  if (id === "core") {
    entries = [
      { url: BASE_URL, lastmod, changefreq: "weekly", priority: 1.0 },
      { url: `${BASE_URL}/trending`, lastmod, changefreq: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/methodology`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/faq`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/about`, lastmod, changefreq: "monthly", priority: 0.6 },
      { url: `${BASE_URL}/glossary`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/compare`, lastmod, changefreq: "monthly", priority: 0.6 },
      { url: `${BASE_URL}/weekly`, lastmod, changefreq: "weekly", priority: 0.6 },
      { url: `${BASE_URL}/signal-of-the-week`, lastmod, changefreq: "weekly", priority: 0.8 },
      { url: `${BASE_URL}/alternatives`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/use-cases`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/integrations`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/changelog`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/developers`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/data-sources`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/citations`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/predict`, lastmod, changefreq: "weekly", priority: 0.95 },
      { url: `${BASE_URL}/receipts`, lastmod, changefreq: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/leaderboard`, lastmod, changefreq: "hourly", priority: 0.85 },
      { url: `${BASE_URL}/agents`, lastmod, changefreq: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/a2a`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/a2a-demo`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/a2a/claude-code`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/cursor`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/openai-agents-sdk`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/langchain`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/vercel-ai-sdk`, lastmod, changefreq: "monthly", priority: 0.75 },
    ];
  } else if (id === "sectors") {
    entries = [
      ...getAllPageSlugs().map((slug) => ({
        url: `${BASE_URL}/startups-to-watch/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.8,
      })),
      ...getAllGeoPageSlugs().map((slug) => ({
        url: `${BASE_URL}/startups-to-watch/geo/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.6,
      })),
      ...getAllRegionPageSlugs().map((slug) => ({
        url: `${BASE_URL}/startups-to-watch/region/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...getAllBestSectorSlugs().map((slug) => ({
        url: `${BASE_URL}/best/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.8,
      })),
      ...getAllTrendSlugs().map((slug) => ({
        url: `${BASE_URL}/trends/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.6,
      })),
    ];
  } else if (id === "crossings") {
    entries = [
      ...getAllStagePageSlugs().map((slug) => ({
        url: `${BASE_URL}/stage/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.8,
      })),
      ...SIGNAL_TYPES.map((s) => ({
        url: `${BASE_URL}/signals/${s.slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...getAllStageSectorPairs().map(({ stage, sector }) => ({
        url: `${BASE_URL}/stage/${stage}/${sector}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...getAllSignalSectorPairs().map(({ signal, sector }) => ({
        url: `${BASE_URL}/signals/${signal}/${sector}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...getAllStageSignalPairs().map(({ stage, signal }) => ({
        url: `${BASE_URL}/stage/${stage}/signal/${signal}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      })),
    ];
  } else if (id === "startups") {
    entries = [
      ...getAllStartupSlugs().map((slug) => ({
        url: `${BASE_URL}/startup/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.7,
      })),
      ...getAllStartupPeriodPairs().map(({ slug, period }) => ({
        url: `${BASE_URL}/startup/${slug}/${period}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.5,
      })),
    ];
  } else if (id === "content") {
    entries = [
      { url: `${BASE_URL}/blog`, lastmod, changefreq: "weekly", priority: 0.6 },
      { url: `${BASE_URL}/topics`, lastmod, changefreq: "weekly", priority: 0.7 },
      ...Object.keys(pillars).map((slug) => ({
        url: `${BASE_URL}/topics/${slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.8,
      })),
      ...getAllPostSlugs().map((slug) => ({
        url: `${BASE_URL}/blog/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.7,
      })),
      ...getAllComparisonSlugs().map((slug) => ({
        url: `${BASE_URL}/compare/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.7,
      })),
      ...getAllAlternativeSlugs().map((slug) => ({
        url: `${BASE_URL}/alternatives/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.8,
      })),
      ...getAllUseCaseSlugs().map((slug) => ({
        url: `${BASE_URL}/use-cases/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.8,
      })),
      ...getAllCompetitorVsSlugs().map((slug) => ({
        url: `${BASE_URL}/vs/${slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.7,
      })),
      { url: `${BASE_URL}/answers`, lastmod, changefreq: "weekly", priority: 0.85 },
      ...agentQueries.map((q) => ({
        url: `${BASE_URL}/answers/${q.slug}`,
        lastmod,
        changefreq: "weekly",
        priority: 0.85,
      })),
      { url: `${BASE_URL}/research`, lastmod, changefreq: "weekly", priority: 0.9 },
      ...RESEARCH_FINDINGS.map((f) => ({
        url: `${BASE_URL}/research/${f.slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.8,
      })),
    ];
  } else {
    return new Response("Not Found", { status: 404 });
  }

  const urlsXml = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${e.lastmod}</lastmod>\n    <changefreq>${e.changefreq}</changefreq>\n    <priority>${e.priority}</priority>\n  </url>`
    )
    .join("\n");

  const body = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlsXml}\n</urlset>\n`;

  return new Response(body, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}
