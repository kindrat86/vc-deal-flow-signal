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
  getAllStageSlugs,
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
import { PRIMITIVES } from "@/content/signal-primitives";
import { LOCALES } from "@/content/locales";
import { getMarketSlugs } from "@/lib/markets";
import { getAllTop100Slugs } from "@/lib/top-100";
import { getAllPredictionWeekSlugs } from "@/lib/predictions";
import { DATA_NERD_PARABLES } from "@/lib/data-nerd";

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

export const dynamic = "force-static";
export const dynamicParams = false;
export const revalidate = 3600;

export function generateStaticParams() {
  return ["core", "sectors", "crossings", "startups", "content"].map((id) => ({
    id: `${id}.xml`,
  }));
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
      { url: `${BASE_URL}/pricing`, lastmod, changefreq: "monthly", priority: 0.9 },
      { url: `${BASE_URL}/teardown`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/firstlook`, lastmod, changefreq: "monthly", priority: 0.85 },
      // Brunson DCS Secret 15 — single-purpose Lead Squeeze landing.
      // High priority because this is the dedicated paid-traffic + cold-link
      // capture page; Sunday-digest acquisition target.
      { url: `${BASE_URL}/squeeze`, lastmod, changefreq: "monthly", priority: 0.95 },
      { url: `${BASE_URL}/buyers-guide`, lastmod, changefreq: "monthly", priority: 0.85 },
      // Book funnel — Brunson Secret 17 (2026-05-06). Free PDF + EPUB +
      // €0.99 Kindle. Each chapter is its own indexable page.
      { url: `${BASE_URL}/book`, lastmod, changefreq: "monthly", priority: 0.9 },
      { url: `${BASE_URL}/book/read`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/book/read/introduction`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-1-commit-velocity`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-2-contributor-influx`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-3-infra-buildout`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-4-star-detachment`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-5-issue-cadence`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-6-dependency-adoption`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/signal-7-founding-team-visibility`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/methodology`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/replication-appendix`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/book/read/conclusion`, lastmod, changefreq: "monthly", priority: 0.8 },
      // Tweet Teardown — €1 micro-tripwire (Brunson DCS Ch 18, 2026-05-06).
      { url: `${BASE_URL}/tweet-teardown`, lastmod, changefreq: "monthly", priority: 0.85 },
      // Walkthrough — three lengths of the same Perfect Webinar argument
      // (Brunson Expert Secrets §3 Ch 15 — Webinar Variations). The 90s
      // and 5min variants are A/B-tested via /walkthrough/quick (router
      // is noindex; both variants are canonical).
      { url: `${BASE_URL}/walkthrough`, lastmod, changefreq: "monthly", priority: 0.9 },
      { url: `${BASE_URL}/walkthrough/5min`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/walkthrough/90s`, lastmod, changefreq: "monthly", priority: 0.85 },
      // Summit Funnel — Brunson DotCom Ch 16. 20 anonymous-by-design talks
      // across 5 days. /summit is the squeeze; /summit/[slug] is each talk;
      // /summit/all-access is the €97 one-time upsell.
      { url: `${BASE_URL}/summit`, lastmod, changefreq: "weekly", priority: 0.95 },
      { url: `${BASE_URL}/summit/all-access`, lastmod, changefreq: "weekly", priority: 0.85 },
      ...["core-claim-engineering-acceleration", "public-over-private-cc-by-walkthrough", "rolodex-to-regression", "six-atomic-signals-glossary", "computing-commit-velocity", "bus-factor-contributor-diversity", "repository-expansion-as-hiring-indicator", "false-positives-honestly", "ai-infrastructure-2026-series-a-wave", "dev-tools-acceleration-first", "climate-tech-engineering-velocity", "fintech-payments-engineering-cadence", "sourcing-workflow-digest-to-reply", "icp-engineering-target-list-by-github", "agent-native-sourcing-mcp-x402", "signal-to-first-reply-outbound-play", "next-five-years-code-eats-pitch-deck", "reproducibility-as-moat", "state-of-engine-falsifiable-predictions", "closing-keynote-manifesto-data-first-vc"].map((slug) => ({
        url: `${BASE_URL}/summit/${slug}`,
        lastmod,
        changefreq: "weekly" as const,
        priority: 0.8,
      })),
      { url: `${BASE_URL}/enterprise`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/api/v1/pricing.json`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/dataset`, lastmod, changefreq: "weekly", priority: 0.85 },
      { url: `${BASE_URL}/faq`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/about`, lastmod, changefreq: "monthly", priority: 0.6 },
      { url: `${BASE_URL}/story`, lastmod, changefreq: "monthly", priority: 0.75 },
      // Brunson Expert Secrets Ch 8 (Hero's Two Journeys) — /origin is the
      // founder's arc; /origin/your-journey is the buyer's arc, told beat-
      // for-beat against it. Both indexed at the same priority so search
      // engines and answer surfaces find the matched pair.
      { url: `${BASE_URL}/origin`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/origin/your-journey`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/glossary`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/compare`, lastmod, changefreq: "monthly", priority: 0.6 },
      { url: `${BASE_URL}/weekly`, lastmod, changefreq: "weekly", priority: 0.6 },
      { url: `${BASE_URL}/weekly/top-100`, lastmod, changefreq: "weekly", priority: 0.85 },
      { url: `${BASE_URL}/weekly/top-100/data.json`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/weekly/top-100/feed.xml`, lastmod, changefreq: "weekly", priority: 0.7 },
      ...getAllTop100Slugs().flatMap((slug) => [
        {
          url: `${BASE_URL}/weekly/top-100/${slug}`,
          lastmod,
          changefreq: "weekly" as const,
          priority: 0.8,
        },
        {
          url: `${BASE_URL}/weekly/top-100/${slug}/data.json`,
          lastmod,
          changefreq: "weekly" as const,
          priority: 0.65,
        },
      ]),
      { url: `${BASE_URL}/signal-of-the-week`, lastmod, changefreq: "weekly", priority: 0.8 },
      { url: `${BASE_URL}/alternatives`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/use-cases`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/integrations`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/integrations/mistral`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/integrations/chatgpt`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/integrations/agent-runtimes`, lastmod, changefreq: "monthly", priority: 0.85 },
      // Programmatic /for-{framework} dev-investor crossover surfaces (2026-05-03)
      { url: `${BASE_URL}/for-langchain`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/for-crewai`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/for-letta`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/for-mastra`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/for-vercel-ai-sdk`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/api/actions/openapi.json`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/changelog`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/developers`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/data-sources`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/citations`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/citation-guide`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/knowledge-graph.json`, lastmod, changefreq: "weekly", priority: 0.7 },
      // E-E-A-T trust surfaces (2026-05-02 chain)
      { url: `${BASE_URL}/standards`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/corrections`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/reproducibility`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/attestations`, lastmod, changefreq: "monthly", priority: 0.85 },
      // Topical-authority hubs
      { url: `${BASE_URL}/signals`, lastmod, changefreq: "monthly", priority: 0.85 },
      ...PRIMITIVES.map((p) => ({
        url: `${BASE_URL}/signals/define/${p.slug}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.8,
      })),
      { url: `${BASE_URL}/knowledge`, lastmod, changefreq: "monthly", priority: 0.8 },
      // Off-page receptacles
      { url: `${BASE_URL}/press`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/press/ssrn-panel-q2-2026`, lastmod, changefreq: "yearly", priority: 0.7 },
      { url: `${BASE_URL}/press/agent-credits-launch-q2-2026`, lastmod, changefreq: "yearly", priority: 0.7 },
      { url: `${BASE_URL}/press/annual-state-of-engineering-velocity-q4-2026`, lastmod, changefreq: "yearly", priority: 0.7 },
      { url: `${BASE_URL}/podcasts`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/mirrors`, lastmod, changefreq: "monthly", priority: 0.7 },
      // Brunson-trilogy surfaces shipped 2026-05-06 (audit V7)
      { url: `${BASE_URL}/launch`, lastmod, changefreq: "weekly", priority: 0.8 },
      { url: `${BASE_URL}/launch/agent-credits`, lastmod, changefreq: "weekly", priority: 0.85 },
      { url: `${BASE_URL}/state-of-github`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/watch`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/embed`, lastmod, changefreq: "monthly", priority: 0.7 },
      // i18n surfaces
      { url: `${BASE_URL}/translations`, lastmod, changefreq: "monthly", priority: 0.6 },
      ...LOCALES.map((l) => ({
        url: `${BASE_URL}/${l.code}`,
        lastmod,
        changefreq: "monthly",
        priority: 0.6,
      })),
      // Localized topic stubs — 12 locales × 3 topics = 36 stubs
      ...LOCALES.flatMap((l) =>
        ["methodology", "glossary", "faq"].map((topic) => ({
          url: `${BASE_URL}/${l.code}/${topic}`,
          lastmod,
          changefreq: "monthly",
          priority: 0.55,
        })),
      ),
      // Wikipedia citation helper
      { url: `${BASE_URL}/wikipedia`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/predict`, lastmod, changefreq: "weekly", priority: 0.95 },
      { url: `${BASE_URL}/receipts`, lastmod, changefreq: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/markets`, lastmod, changefreq: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/markets/methodology`, lastmod, changefreq: "monthly", priority: 0.8 },
      ...getMarketSlugs().map((slug) => ({
        url: `${BASE_URL}/markets/${slug}`,
        lastmod,
        changefreq: "weekly" as const,
        priority: 0.9,
      })),
      { url: `${BASE_URL}/install`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/mcp-demo`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/leaderboard`, lastmod, changefreq: "hourly", priority: 0.85 },
      { url: `${BASE_URL}/agents`, lastmod, changefreq: "weekly", priority: 0.9 },
      { url: `${BASE_URL}/a2a`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/a2a-demo`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/a2a/claude-code`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/cursor`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/openai-agents-sdk`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/langchain`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/a2a/vercel-ai-sdk`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/affiliates`, lastmod, changefreq: "monthly", priority: 0.6 },
      { url: `${BASE_URL}/authors`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/authors/the-data-nerd`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/authors/engineering-research`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/authors/founder-perspective`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/badge-builder`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/built-with`, lastmod, changefreq: "weekly", priority: 0.7 },
      { url: `${BASE_URL}/predicted`, lastmod, changefreq: "weekly", priority: 0.85 },
      ...getAllPredictionWeekSlugs().map((slug) => ({
        url: `${BASE_URL}/predicted/${slug}`,
        lastmod,
        changefreq: "weekly" as const,
        priority: 0.75,
      })),
      { url: `${BASE_URL}/challenge`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/target-list`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/distribution`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/funnels`, lastmod, changefreq: "monthly", priority: 0.75 },
      { url: `${BASE_URL}/experiments`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/experiments/hooks`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/affiliates/top-partners`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/earned-plays`, lastmod, changefreq: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/scorecard`, lastmod, changefreq: "monthly", priority: 0.65 },
      { url: `${BASE_URL}/wins`, lastmod, changefreq: "monthly", priority: 0.65 },
      // Founder character surfaces — Brunson Expert Secrets Ch 1 + 2.
      // The /data-nerd character bible, the /now live-status surface, the
      // /parables index + per-parable SSG pages, plus the longform
      // narrative pages (/origin, /story, /manifesto) and the /about hub.
      // All anonymity-compatible — no founder face/voice/name.
      { url: `${BASE_URL}/data-nerd`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/about/founder`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/manifesto`, lastmod, changefreq: "monthly", priority: 0.85 },
      { url: `${BASE_URL}/origin`, lastmod, changefreq: "monthly", priority: 0.8 },
      { url: `${BASE_URL}/now`, lastmod, changefreq: "weekly", priority: 0.85 },
      { url: `${BASE_URL}/parables`, lastmod, changefreq: "monthly", priority: 0.85 },
      ...DATA_NERD_PARABLES.map((p) => ({
        url: `${BASE_URL}/parables/${p.slug}`,
        lastmod,
        changefreq: "monthly" as const,
        priority: 0.75,
      })),
      // Charter Cohort 2026 — Brunson Expert Secrets §1 Ch 4 (Mass Movement
      // Vehicle). Member-side companion ledger to /wins. The four seat
      // templates are individually indexable so the cohort surface compounds
      // as members claim.
      { url: `${BASE_URL}/members`, lastmod, changefreq: "weekly", priority: 0.8 },
      { url: `${BASE_URL}/members/leaderboard`, lastmod, changefreq: "weekly", priority: 0.78 },
      { url: `${BASE_URL}/members/join`, lastmod, changefreq: "monthly", priority: 0.7 },
      { url: `${BASE_URL}/members/charter-1`, lastmod, changefreq: "weekly", priority: 0.65 },
      { url: `${BASE_URL}/members/charter-2`, lastmod, changefreq: "weekly", priority: 0.65 },
      { url: `${BASE_URL}/members/charter-3`, lastmod, changefreq: "weekly", priority: 0.65 },
      { url: `${BASE_URL}/members/charter-4`, lastmod, changefreq: "weekly", priority: 0.65 },
      // Brunson DCS Ch 13 — Best-Bait redacted Friday-noon trailer of
      // Sunday's digest. Weekly cadence matches the data refresh.
      { url: `${BASE_URL}/friday-preview`, lastmod, changefreq: "weekly", priority: 0.8 },
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
      ...getAllStageSlugs().map((slug) => ({
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
