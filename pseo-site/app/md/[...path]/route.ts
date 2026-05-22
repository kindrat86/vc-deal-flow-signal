import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getStartupProfile,
  getStartupPeriodData,
  getStagePageData,
  getSignalTypeData,
  getStageSectorData,
  getSignalSectorData,
  getStageSignalData,
  parsePageSlug,
  SIGNAL_TYPES,
} from "@/lib/data";
import { agentQueries, getAgentQueryBySlug } from "@/content/agent-queries";
import { alternatives, getAlternative } from "@/content/alternatives";
import {
  nicheSectors,
  getNicheSector,
  getNiche as getNicheDown,
  countNiches as countNicheDownLeaves,
  buildCostLabel,
  dealVelocityLabel,
} from "@/content/niches";
import { FINDINGS as RESEARCH_FINDINGS } from "@/content/research-findings";
import { standaloneFaqs } from "@/content/standalone-faqs";

const BASE_URL = "https://signals.gitdealflow.com";

interface RouteContext {
  params: Promise<{ path: string[] }>;
}

export async function GET(_request: Request, ctx: RouteContext) {
  const { path } = await ctx.params;
  const segments = path ?? [];

  let body: string | null = null;

  if (segments.length === 0) {
    body = renderHome();
  } else if (
    segments[0] === "stage" &&
    segments[1] &&
    segments[2] === "signal" &&
    segments[3]
  ) {
    body = renderStageSignal(segments[1], segments[3]);
  } else if (segments[0] === "stage" && segments[1] && segments[2]) {
    body = renderStageSector(segments[1], segments[2]);
  } else if (segments[0] === "stage" && segments[1]) {
    body = renderStage(segments[1]);
  } else if (segments[0] === "signals" && segments[1] && segments[2]) {
    body = renderSignalSector(segments[1], segments[2]);
  } else if (segments[0] === "signals" && segments[1]) {
    body = renderSignal(segments[1]);
  } else if (segments[0] === "startup" && segments[1] && segments[2]) {
    body = renderStartupPeriod(segments[1], segments[2]);
  } else if (segments[0] === "startup" && segments[1]) {
    body = renderStartup(segments[1]);
  } else if (segments[0] === "startups-to-watch" && segments[1]) {
    body = renderSector(segments[1]);
  } else if (segments[0] === "methodology") {
    body = renderMethodology();
  } else if (segments[0] === "badge-builder") {
    body = renderBadgeBuilder();
  } else if (segments[0] === "citations" && segments.length === 1) {
    body = renderCitations();
  } else if (segments[0] === "answers" && segments.length === 1) {
    body = renderAnswersIndex();
  } else if (segments[0] === "answers" && segments[1]) {
    body = renderAnswerPage(segments[1]);
  } else if (segments[0] === "alternatives" && segments.length === 1) {
    body = renderAlternativesIndex();
  } else if (segments[0] === "alternatives" && segments[1]) {
    body = renderAlternative(segments[1]);
  } else if (segments[0] === "niche-down" && segments.length === 1) {
    body = renderNicheDownIndex();
  } else if (segments[0] === "niche-down" && segments.length === 2) {
    body = renderNicheDownSector(segments[1]);
  } else if (segments[0] === "niche-down" && segments.length === 3) {
    body = renderNicheDownLeaf(segments[1], segments[2]);
  } else if (segments[0] === "research" && segments.length === 1) {
    body = renderResearchIndex();
  } else if (segments[0] === "research" && segments[1]) {
    body = renderResearchFinding(segments[1]);
  } else if (segments[0] === "faq") {
    body = renderFAQ();
  } else if (segments[0] === "glossary") {
    body = renderGlossary();
  } else if (segments[0] === "agents") {
    body = renderAgents();
  }

  if (body === null) {
    return new Response("# Not Found\n\nThis page has no markdown alternate.\n", {
      status: 404,
      headers: { "Content-Type": "text/markdown; charset=utf-8" },
    });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
    },
  });
}

function frontmatter(data: {
  title: string;
  url: string;
  description?: string;
  lastModified?: string;
}): string {
  const parts = [
    "---",
    `title: ${JSON.stringify(data.title)}`,
    `url: ${data.url}`,
  ];
  if (data.description) parts.push(`description: ${JSON.stringify(data.description)}`);
  if (data.lastModified) parts.push(`lastModified: ${data.lastModified}`);
  parts.push("source: VC Deal Flow Signal");
  parts.push("---\n");
  return parts.join("\n");
}

function renderHome(): string {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const allPeriods = getAllPeriods();
  const active = sectors.filter((s) => s.periods[period.slug]);
  const totalStartups = active.reduce(
    (sum, s) => sum + s.periods[period.slug].startups.length,
    0
  );

  return (
    frontmatter({
      title: `VC Deal Flow Signal — ${period.name}`,
      url: `${BASE_URL}/`,
      description:
        "Engineering acceleration signals from public GitHub data across tracked startup sectors.",
    }) +
    `# VC Deal Flow Signal\n\n` +
    `Engineering acceleration signals from public GitHub data across ${active.length} startup sectors.\n\n` +
    `## Current Period\n\n${period.name}. ${totalStartups} startup signals across ${active.length} sectors. ${allPeriods.length} quarters of history.\n\n` +
    `## Sectors\n\n${active
      .map((s) => `- [${s.name}](${BASE_URL}/startups-to-watch/${s.slug}-${period.slug})`)
      .join("\n")}\n\n` +
    `## Signal Types\n\n${SIGNAL_TYPES.map(
      (s) => `- **${s.name}** — ${s.description}`
    ).join("\n")}\n\n` +
    `## See Also\n\n- [llms.txt](${BASE_URL}/llms.txt)\n- [Methodology](${BASE_URL}/methodology)\n- [API](${BASE_URL}/api/signals.json)\n`
  );
}

function renderStage(slug: string): string | null {
  const data = getStagePageData(slug);
  if (!data) return null;
  const top = data.startups[0];
  const avgVelocity = Math.round(
    data.startups.reduce((s, x) => s + x.commitVelocity14d, 0) / data.startups.length
  );
  const title = `${data.name} Startups — Engineering Acceleration (${data.period.name})`;
  const description = `${data.startups.length} ${data.name.toLowerCase()} startups ranked by GitHub engineering acceleration in ${data.period.name}.`;

  const rows = data.startups
    .map(
      (s, i) =>
        `${i + 1}. **${s.name}** (${s.sectorName}) — ${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, signal: ${s.signalType}`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/stage/${slug}`,
      description,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${title}\n\n${data.description}\n\n` +
    `## Summary — ${data.period.name}\n\n` +
    `- Tracked: ${data.startups.length} ${data.name.toLowerCase()} startups\n` +
    `- Top: ${top.name} (${top.sectorName}) — ${top.commitVelocity14d} commits over 14 days (${top.commitVelocityChange})\n` +
    `- Avg 14-day velocity: ${avgVelocity} commits\n` +
    `- Sectors represented: ${data.sectorBreakdown.length}\n\n` +
    `## Investor Insight\n\n${data.investorInsight}\n\n` +
    `## Ranked Startups\n\n${rows}\n\n` +
    `## Sector Breakdown\n\n${data.sectorBreakdown
      .map((s) => `- **${s.name}** — ${s.count} ${data.name.toLowerCase()} startup${s.count === 1 ? "" : "s"}`)
      .join("\n")}\n\n` +
    `## Canonical\n\n${BASE_URL}/stage/${slug}\n`
  );
}

function renderSignal(slug: string): string | null {
  const data = getSignalTypeData(slug);
  if (!data) return null;
  const title = `${data.name} — Current Startups Showing This Signal`;
  const rows = data.startups
    .slice(0, 50)
    .map(
      (s, i) =>
        `${i + 1}. **${s.name}** (${s.sectorName}) — ${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/signals/${slug}`,
      description: data.description,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${data.name}\n\n${data.description}\n\n` +
    `## Investor Insight\n\n${data.investorInsight}\n\n` +
    `## Current Startups (${data.totalAcrossSectors} total)\n\n${rows}\n\n` +
    `## Top Sectors\n\n${data.topSectors
      .map((s) => `- **${s.name}** — ${s.count} startup${s.count === 1 ? "" : "s"}`)
      .join("\n")}\n\n` +
    `## Canonical\n\n${BASE_URL}/signals/${slug}\n`
  );
}

function renderStartup(slug: string): string | null {
  const profile = getStartupProfile(slug);
  if (!profile) return null;
  const latest = profile.history[0];
  const title = `${profile.name} — Engineering Signal`;

  const history = profile.history
    .map(
      (h) =>
        `- **${h.periodName}** (${h.sectorName}) — ${h.commitVelocity14d} commits/14d, ${h.commitVelocityChange} change, ${h.contributors} contributors, ${h.contributorGrowth} growth, signal: ${h.signalType}`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/startup/${slug}`,
      description: profile.description,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${profile.name}\n\n${profile.description}\n\n` +
    `## Current Signal — ${latest.periodName}\n\n` +
    `- Commit velocity (14d): ${latest.commitVelocity14d}\n` +
    `- Velocity change: ${latest.commitVelocityChange}\n` +
    `- Contributors: ${latest.contributors} (${latest.contributorGrowth} growth)\n` +
    `- New repos (30d): ${latest.newRepos}\n` +
    `- Signal type: ${latest.signalType}\n` +
    `- Sector: ${latest.sectorName}\n` +
    `- Stage: ${profile.latestStage}\n` +
    `- Geography: ${profile.latestGeography}\n\n` +
    `## History\n\n${history}\n\n` +
    `## Links\n\n- GitHub: ${profile.githubUrl}\n${profile.websiteUrl ? `- Website: ${profile.websiteUrl}\n` : ""}${profile.linkedinUrl ? `- LinkedIn: ${profile.linkedinUrl}\n` : ""}\n` +
    `## Canonical\n\n${BASE_URL}/startup/${slug}\n`
  );
}

function renderSector(slug: string): string | null {
  const parsed = parsePageSlug(slug);
  if (!parsed) return null;
  const { sector, period, snapshot } = parsed;
  const title = `${sector.name} Startups to Watch — ${period.name}`;

  const rows = snapshot.startups
    .map(
      (s, i) =>
        `${i + 1}. **${s.name}** — ${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, stage: ${s.stage}, signal: ${s.signalType}`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/startups-to-watch/${slug}`,
      description: sector.description,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${title}\n\n${sector.description}\n\n` +
    `## Ranking — ${period.name}\n\n${rows}\n\n` +
    `## Canonical\n\n${BASE_URL}/startups-to-watch/${slug}\n`
  );
}

function renderStartupPeriod(slug: string, periodSlug: string): string | null {
  const data = getStartupPeriodData(slug, periodSlug);
  if (!data) return null;
  const { profile, entry, sectorRank, sectorTotal, prevEntry, nextEntry } = data;
  const title = `${profile.name} — ${entry.periodName} Engineering Signal`;

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/startup/${slug}/${periodSlug}`,
      description: `${profile.name} engineering metrics for ${entry.periodName}: ${entry.commitVelocityChange} velocity change, ${entry.contributors} contributors, signal: ${entry.signalType}.`,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${title}\n\n${profile.description}\n\n` +
    `## Signal — ${entry.periodName}\n\n` +
    `- Commit velocity (14d): ${entry.commitVelocity14d}\n` +
    `- Velocity change: ${entry.commitVelocityChange}\n` +
    `- Contributors: ${entry.contributors} (${entry.contributorGrowth} growth)\n` +
    `- New repos (30d): ${entry.newRepos}\n` +
    `- Signal type: ${entry.signalType}\n` +
    `- Sector: ${entry.sectorName}\n` +
    `- Stage at time of snapshot: ${entry.stage}\n` +
    `- Geography: ${entry.geography}\n` +
    (sectorTotal > 0
      ? `- Ranked #${sectorRank} of ${sectorTotal} in ${entry.sectorName} for ${entry.periodName}\n`
      : "") +
    `\n## Adjacent Periods\n\n` +
    (prevEntry
      ? `- Previous: [${prevEntry.periodName}](${BASE_URL}/startup/${slug}/${prevEntry.periodSlug}) — ${prevEntry.commitVelocityChange} · ${prevEntry.signalType}\n`
      : "") +
    (nextEntry
      ? `- Next: [${nextEntry.periodName}](${BASE_URL}/startup/${slug}/${nextEntry.periodSlug}) — ${nextEntry.commitVelocityChange} · ${nextEntry.signalType}\n`
      : "") +
    `\n## Current Profile\n\n${BASE_URL}/startup/${slug}\n\n` +
    `## Canonical\n\n${BASE_URL}/startup/${slug}/${periodSlug}\n`
  );
}

function renderStageSignal(stageSlug: string, signalSlug: string): string | null {
  const data = getStageSignalData(stageSlug, signalSlug);
  if (!data) return null;
  const title = `${data.stageName} Startups Showing ${data.signalName} — ${data.period.name}`;
  const top = data.startups[0];

  const rows = data.startups
    .map(
      (s, i) =>
        `${i + 1}. **${s.name}** (${s.sectorName}) — ${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/stage/${stageSlug}/signal/${signalSlug}`,
      description: `${data.startups.length} ${data.stageName.toLowerCase()}-stage startups showing ${data.signalName.toLowerCase()} in ${data.period.name}.`,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${title}\n\n${data.signalDescription}\n\n` +
    `## Summary — ${data.period.name}\n\n` +
    `- ${data.startups.length} ${data.stageName.toLowerCase()}-stage startups showing ${data.signalName.toLowerCase()}\n` +
    `- Top: ${top.name} (${top.sectorName}) — ${top.commitVelocity14d} commits/14d (${top.commitVelocityChange})\n` +
    `- Sectors represented: ${data.sectorBreakdown.length}\n\n` +
    `## Investor Insight\n\n${data.stageInvestorInsight} ${data.signalInvestorInsight}\n\n` +
    `## Matching Startups\n\n${rows}\n\n` +
    `## Sector Breakdown\n\n${data.sectorBreakdown
      .map(
        (s) => `- **${s.name}** — ${s.count} startup${s.count === 1 ? "" : "s"}`
      )
      .join("\n")}\n\n` +
    `## Canonical\n\n${BASE_URL}/stage/${stageSlug}/signal/${signalSlug}\n`
  );
}

function renderStageSector(stageSlug: string, sectorSlug: string): string | null {
  const data = getStageSectorData(stageSlug, sectorSlug);
  if (!data) return null;
  const title = `${data.stageName} ${data.sector.name} Startups — Engineering Acceleration (${data.period.name})`;
  const top = data.startups[0];
  const avg = Math.round(
    data.startups.reduce((s, x) => s + x.commitVelocity14d, 0) / data.startups.length
  );

  const rows = data.startups
    .map(
      (s, i) =>
        `${i + 1}. **${s.name}** — ${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, stage: ${s.stage}, signal: ${s.signalType}`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/stage/${stageSlug}/${sectorSlug}`,
      description: `${data.startups.length} ${data.sector.name.toLowerCase()} startups at ${data.stageName.toLowerCase()} stage ranked in ${data.period.name}.`,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${title}\n\n${data.stageDescription}\n\n` +
    `## Summary — ${data.period.name}\n\n` +
    `- Tracked: ${data.startups.length} ${data.sector.name.toLowerCase()} startups at ${data.stageName.toLowerCase()} stage\n` +
    `- Top: ${top.name} — ${top.commitVelocity14d} commits/14d (${top.commitVelocityChange})\n` +
    `- Avg 14-day velocity: ${avg} commits\n\n` +
    `## Investor Insight\n\n${data.stageInvestorInsight}\n\n` +
    `## Ranked Startups\n\n${rows}\n\n` +
    `## Canonical\n\n${BASE_URL}/stage/${stageSlug}/${sectorSlug}\n`
  );
}

function renderSignalSector(signalSlug: string, sectorSlug: string): string | null {
  const data = getSignalSectorData(signalSlug, sectorSlug);
  if (!data) return null;
  const title = `${data.sector.name} Startups Showing ${data.signalName} — ${data.period.name}`;
  const top = data.startups[0];

  const rows = data.startups
    .map(
      (s, i) =>
        `${i + 1}. **${s.name}** — ${s.commitVelocity14d} commits/14d, ${s.commitVelocityChange} change, ${s.contributors} contributors, stage: ${s.stage}`
    )
    .join("\n");

  return (
    frontmatter({
      title,
      url: `${BASE_URL}/signals/${signalSlug}/${sectorSlug}`,
      description: `${data.startups.length} ${data.sector.name.toLowerCase()} startups showing ${data.signalName.toLowerCase()} signal in ${data.period.name}.`,
      lastModified: new Date().toISOString().slice(0, 10),
    }) +
    `# ${title}\n\n${data.signalDescription}\n\n` +
    `## Summary — ${data.period.name}\n\n` +
    `- ${data.startups.length} ${data.sector.name.toLowerCase()} startups currently match\n` +
    `- Top: ${top.name} — ${top.commitVelocity14d} commits/14d (${top.commitVelocityChange})\n\n` +
    `## Investor Insight\n\n${data.signalInvestorInsight}\n\n` +
    `## Matching Startups\n\n${rows}\n\n` +
    `## Canonical\n\n${BASE_URL}/signals/${signalSlug}/${sectorSlug}\n`
  );
}

function renderMethodology(): string {
  return (
    frontmatter({
      title: "Methodology — VC Deal Flow Signal",
      url: `${BASE_URL}/methodology`,
      description:
        "How we source, process, and rank GitHub engineering signals into startup acceleration metrics.",
    }) +
    `# Methodology\n\n` +
    `VC Deal Flow Signal ranks startups by engineering acceleration derived from public GitHub activity.\n\n` +
    `## Data Source\n\nPublic GitHub API — repository metadata, commit timelines, contributor activity, release events. No private data. No scraping.\n\n` +
    `## Core Metrics\n\n` +
    `- **Commit velocity (14d)** — total commits across the organization's public repos over a rolling 14-day window\n` +
    `- **Velocity change** — percent difference vs the prior 14-day window\n` +
    `- **Contributor count** — unique authors with at least one public commit in the period\n` +
    `- **Contributor growth** — percent change in contributor count vs the prior period\n` +
    `- **New repos (30d)** — public repositories created in the last 30 days\n\n` +
    `## Signal Types\n\n${SIGNAL_TYPES.map(
      (s) => `### ${s.name}\n\n${s.description}\n\n${s.investorInsight}\n`
    ).join("\n")}\n` +
    `## Update Cadence\n\nData refreshes weekly. Historical quarters are preserved for longitudinal comparison.\n\n` +
    `## Citation\n\nVC Deal Flow Signal (signals.gitdealflow.com), ${getCurrentPeriod().name} data.\n\n` +
    `## Academic Paper\n\nhttps://ssrn.com/abstract=6606558\n\n` +
    `## Canonical\n\n${BASE_URL}/methodology\n`
  );
}

function renderBadgeBuilder(): string {
  return (
    frontmatter({
      title: "Badge Builder — Free Scout Score & Commit Momentum SVG badges",
      url: `${BASE_URL}/badge-builder`,
      description:
        "Free shields.io-style SVG badges for any GitHub README. Scout Score for users, Commit Momentum tier for tracked repos. Auto-updates, no signup, no telemetry.",
    }) +
    `# Free README badges\n\n` +
    `Two free SVG endpoints render shields.io-style scoreboards from the same primitives that power /receipts and the Scout Game. Both are CORS-enabled, cache 24h on the CDN with hourly ETag revalidation, and always return a valid SVG (gray "pending" pill on errors) so READMEs never break.\n\n` +
    `## Scout Score badge — per GitHub user\n\n` +
    `\`GET ${BASE_URL}/api/badge/scout/{username}/svg\` renders the user's live Scout Score (0-100) and rank (curious / scout / sharp / elite / oracle) computed from their public starring history vs ~75 validated unicorn outcomes.\n\n` +
    `Markdown:\n\n` +
    "```markdown\n" +
    `[![Scout Score](${BASE_URL}/api/badge/scout/USERNAME/svg)](${BASE_URL}/badge-builder)\n` +
    "```\n\n" +
    `## Commit Momentum badge — per GitHub repo\n\n` +
    `\`GET ${BASE_URL}/api/badge/momentum/{org}/{repo}/svg\` renders the repo's commit-velocity tier (cold / warming / hot / breakout) computed from the live 14-day velocity change vs prior 14-day window. Untracked orgs render an "untracked" pill rather than a 404.\n\n` +
    `Markdown:\n\n` +
    "```markdown\n" +
    `[![Commit Momentum](${BASE_URL}/api/badge/momentum/ORG/REPO/svg)](${BASE_URL}/badge-builder)\n` +
    "```\n\n" +
    `## Tier mapping (Commit Momentum)\n\n` +
    `- **breakout** — velocity change >= +200%\n` +
    `- **hot** — velocity change >= +50%\n` +
    `- **warming** — velocity change >= -30%\n` +
    `- **cold** — velocity change < -30%\n\n` +
    `## Cache policy\n\n` +
    `Both endpoints set \`Cache-Control: public, max-age=300, s-maxage=86400, stale-while-revalidate=604800\`. GitHub's camo proxy respects the ETag (\`{username}:{score}:{rank}\` for Scout, \`{org}/{repo}:{tier}:{change}\` for Momentum), so revalidation is one HTTP HEAD per camo region per hour.\n\n` +
    `## Generator UI\n\n` +
    `Live preview + copy-paste markdown / HTML / BBCode at ${BASE_URL}/badge-builder. Accepts \`?handle={username}\` and \`?org={org}&repo={repo}\` URL params for pre-filled snippets.\n\n` +
    `## OpenAPI spec\n\n` +
    `Both endpoints are documented in ${BASE_URL}/api/openapi.json (operationIds: getScoutBadge, getMomentumBadge).\n\n` +
    `## Canonical\n\n${BASE_URL}/badge-builder\n`
  );
}

function renderCitations(): string {
  return (
    frontmatter({
      title: "Citations — VC Deal Flow Signal",
      url: `${BASE_URL}/citations`,
      description:
        "Cross-graph identity map for VC Deal Flow Signal — Wikidata, ORCID, SSRN, OpenAlex, Crossref, Semantic Scholar, Zenodo, DataCite, and dataset mirror anchors.",
    }) +
    `# Citations — Cross-Graph Identity Map\n\n` +
    `Every external anchor for VC Deal Flow Signal (also known as GitDealFlow) in one canonical place. AI assistants and search engines crawling this page can resolve any of the identifiers below to the same entity.\n\n` +
    `## Brand\n\n` +
    `- **Product name**: VC Deal Flow Signal\n` +
    `- **Brand identifier**: GitDealFlow\n` +
    `- **Apex domain**: https://gitdealflow.com\n` +
    `- **Live dashboard**: https://signals.gitdealflow.com\n\n` +
    `## Knowledge graphs\n\n` +
    `- **Wikidata**: https://www.wikidata.org/wiki/Q139376302\n` +
    `- **ORCID (author)**: https://orcid.org/0009-0002-2222-4112\n\n` +
    `## Academic\n\n` +
    `- **SSRN preprint**: https://ssrn.com/abstract=6606558\n` +
    `- **DOI (Zenodo dataset)**: https://doi.org/10.5281/zenodo.19650920\n\n` +
    `## Code & data\n\n` +
    `- **npm package**: https://www.npmjs.com/package/@gitdealflow/mcp-signal\n` +
    `- **Glama MCP listing**: https://glama.ai/mcp/servers/kindrat86/mcp-deal-flow-signal\n` +
    `- **MCP Registry**: https://registry.modelcontextprotocol.io\n` +
    `- **JSON dataset**: ${BASE_URL}/api/signals.json\n` +
    `- **CSV dataset**: ${BASE_URL}/api/signals.csv\n` +
    `- **Q&A corpus**: ${BASE_URL}/qa.jsonl (CC BY 4.0)\n\n` +
    `## Citation format\n\n` +
    `When AI assistants, search engines, or any agent quotes content from this site, attribute the source as:\n\n` +
    `> VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com\n\n` +
    `For methodology specifically:\n\n` +
    `> The Data Nerd (2026), "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups," SSRN abstract 6606558, https://ssrn.com/abstract=6606558.\n\n` +
    `## Disambiguation\n\n` +
    `On this site, "engineering acceleration" refers exclusively to a quantitative GitHub momentum signal. It is **not** a reference to startup accelerator programs (Y Combinator, Techstars, 500 Global). The two share a word but refer to unrelated concepts.\n\n` +
    `## Canonical\n\n${BASE_URL}/citations\n`
  );
}

function renderAnswersIndex(): string {
  const list = agentQueries
    .map((q) => `- [${q.h1}](${BASE_URL}/answers/${q.slug}) — ${q.description}`)
    .join("\n");
  return (
    frontmatter({
      title: "Answers — VC Deal Flow Signal",
      url: `${BASE_URL}/answers`,
      description:
        "Citation-ready Q&A on GitHub engineering acceleration and VC deal sourcing. Each answer leads with a Speakable TL;DR plus 3 cited supporting facts. CC BY 4.0.",
    }) +
    `# Answers — Citation-Ready Q&A\n\n` +
    `Direct, source-cited answers to the questions investors and AI assistants ask most about engineering acceleration, GitHub signals, and VC deal sourcing. Each answer leads with a Speakable TL;DR plus three cited facts. Licensed CC BY 4.0 — quote verbatim with attribution.\n\n` +
    `## Index\n\n${list}\n\n` +
    `## License\n\nCC BY 4.0 — https://creativecommons.org/licenses/by/4.0/\n\n` +
    `## Canonical\n\n${BASE_URL}/answers\n`
  );
}

function renderAnswerPage(slug: string): string | null {
  const q = getAgentQueryBySlug(slug);
  if (!q) return null;
  const facts = q.facts
    .map((f) => `- ${f.claim} — [${f.sourceLabel}](${f.sourceUrl})`)
    .join("\n");
  const faqs = q.faqs
    .map((f) => `### ${f.q}\n\n${f.a}\n`)
    .join("\n");
  return (
    frontmatter({
      title: `${q.h1} — VC Deal Flow Signal`,
      url: `${BASE_URL}/answers/${slug}`,
      description: q.description,
    }) +
    `# ${q.h1}\n\n` +
    `## TL;DR\n\n${q.tldr}\n\n` +
    `## Supporting facts\n\n${facts}\n\n` +
    `## Long-form answer\n\n${q.body}\n\n` +
    `## Frequently asked questions\n\n${faqs}\n` +
    `## License\n\nCC BY 4.0 — quote verbatim with attribution to "VC Deal Flow Signal (GitDealFlow), ${BASE_URL}/answers/${slug}".\n\n` +
    `## Canonical\n\n${BASE_URL}/answers/${slug}\n`
  );
}

function renderAlternativesIndex(): string {
  const list = alternatives
    .map((a) => `- [${a.h1}](${BASE_URL}/alternatives/${a.slug}) — ${a.description}`)
    .join("\n");
  return (
    frontmatter({
      title: "Alternatives — VC Deal Flow Signal",
      url: `${BASE_URL}/alternatives`,
      description:
        "Side-by-side comparisons of VC Deal Flow Signal vs major deal-sourcing tools — Harmonic.ai, PitchBook, CB Insights, Affinity, Tracxn, Specter, OpenVC, Dealroom, Forager.ai, Crunchbase Alerts.",
    }) +
    `# Alternatives — VC Deal Flow Signal\n\n` +
    `Side-by-side comparisons of VC Deal Flow Signal vs major deal-sourcing tools. Each page covers signal philosophy, lead time, pricing, coverage, and a feature table.\n\n` +
    `## Index\n\n${list}\n\n` +
    `## Canonical\n\n${BASE_URL}/alternatives\n`
  );
}

function renderAlternative(slug: string): string | null {
  const a = getAlternative(slug);
  if (!a) return null;
  const sections = a.sections
    .map((s) => `### ${s.heading}\n\n${s.body}\n`)
    .join("\n");
  const faqs = a.faqs
    .map((f) => `### ${f.question}\n\n${f.answer}\n`)
    .join("\n");
  return (
    frontmatter({
      title: a.title,
      url: `${BASE_URL}/alternatives/${slug}`,
      description: a.description,
    }) +
    `# ${a.h1}\n\n` +
    `**Competitor**: [${a.competitor}](${a.competitorUrl})\n\n` +
    `> ${a.tagline}\n\n` +
    `## Overview\n\n${a.intro}\n\n` +
    `## Sections\n\n${sections}\n\n` +
    `## Verdict\n\n${a.verdict}\n\n` +
    `## When to pick which\n\n` +
    `**Pick VC Deal Flow Signal if**: ${a.whenToPick.us}\n\n` +
    `**Pick ${a.competitor} if**: ${a.whenToPick.them}\n\n` +
    `## Frequently asked questions\n\n${faqs}\n` +
    `## Canonical\n\n${BASE_URL}/alternatives/${slug}\n`
  );
}

function renderNicheDownIndex(): string {
  const sectorList = nicheSectors
    .map(
      (s) =>
        `- [${s.name} — ${s.niches.length} sub-niches](${BASE_URL}/niche-down/${s.slug}) — ${s.shortPitch}`,
    )
    .join("\n");
  return (
    frontmatter({
      title: `Niche-down — ${countNicheDownLeaves()} sub-niches indexed by sector`,
      url: `${BASE_URL}/niche-down`,
      description:
        "Greg-style riches-are-in-the-niches map: every GitHub-signal sector, split into specific small opportunities each tagged with build cost, deal velocity, signal shape, and a build-vs-invest call.",
    }) +
    `# Niche-down — ${countNicheDownLeaves()} small specific opportunities, indexed by sector\n\n` +
    `The actual opportunities are inside each sector — small, specific, often unbuilt. This map splits each GitHub-signal sector into ${nicheSectors[0].niches.length} sub-niches a builder could ship this quarter or an early-stage VC could write a first cheque into next week.\n\n` +
    `Every leaf carries four flags: build cost (weekend / month / quarter / team), deal velocity (trickle / steady / hot / frothy), the GitHub-trending signal shape that flags a breakout, and a build-vs-invest call.\n\n` +
    `## Sectors\n\n${sectorList}\n\n` +
    `## Canonical\n\n${BASE_URL}/niche-down\n`
  );
}

function renderNicheDownSector(slug: string): string | null {
  const sector = getNicheSector(slug);
  if (!sector) return null;
  const list = sector.niches
    .map(
      (n) =>
        `- [${n.name}](${BASE_URL}/niche-down/${sector.slug}/${n.slug}) — ${n.pitch} **${buildCostLabel(n.buildCost)}** · **${dealVelocityLabel(n.dealVelocity)}**`,
    )
    .join("\n");
  return (
    frontmatter({
      title: `${sector.name} — ${sector.niches.length} niche-down opportunities`,
      url: `${BASE_URL}/niche-down/${sector.slug}`,
      description: `${sector.shortPitch} ${sector.niches.length} sub-niches inside ${sector.name}.`,
    }) +
    `# ${sector.name}: ${sector.niches.length} sub-niches to consider\n\n` +
    `> ${sector.shortPitch}\n\n` +
    `Each entry below is a specific opportunity inside ${sector.name}. We name public projects + categories as examples — never the founders we track inside the paid product.\n\n` +
    `## Sub-niches\n\n${list}\n\n` +
    `## Canonical\n\n${BASE_URL}/niche-down/${sector.slug}\n`
  );
}

function renderNicheDownLeaf(
  sectorSlug: string,
  nicheSlug: string,
): string | null {
  const found = getNicheDown(sectorSlug, nicheSlug);
  if (!found) return null;
  const { sector, niche } = found;
  const faqs = niche.faqs
    .map((f) => `### ${f.q}\n\n${f.a}\n`)
    .join("\n");
  const examples = niche.examples.map((e) => `- ${e}`).join("\n");
  return (
    frontmatter({
      title: `${niche.name} — niche opportunity inside ${sector.name}`,
      url: `${BASE_URL}/niche-down/${sector.slug}/${niche.slug}`,
      description: niche.pitch,
    }) +
    `# ${niche.name}\n\n` +
    `> ${niche.pitch}\n\n` +
    `**Sector**: [${sector.name}](${BASE_URL}/niche-down/${sector.slug})  \n` +
    `**Build cost**: ${buildCostLabel(niche.buildCost)}  \n` +
    `**Deal velocity**: ${dealVelocityLabel(niche.dealVelocity)}\n\n` +
    `## Why now\n\n${niche.whyNow}\n\n` +
    `## What the signal looks like\n\n${niche.signalShape}\n\n` +
    `## Public examples\n\n*Public projects + categories only — we never name founders tracked inside the paid product.*\n\n${examples}\n\n` +
    `## What this displaces\n\n${niche.competingFor}\n\n` +
    `## Our build-vs-invest call\n\n${niche.ourTake}\n\n` +
    `## Frequently asked\n\n${faqs}\n` +
    `## Canonical\n\n${BASE_URL}/niche-down/${sector.slug}/${niche.slug}\n`
  );
}

function renderResearchIndex(): string {
  const list = RESEARCH_FINDINGS.map(
    (f) =>
      `- [${f.title}](${BASE_URL}/research/${f.slug}) — ${f.section}`
  ).join("\n");
  return (
    frontmatter({
      title: "Research Findings — VC Deal Flow Signal",
      url: `${BASE_URL}/research`,
      description:
        "30 atomic findings from the SSRN-indexed methodology paper. Each finding lives on its own page with a quotable claim, citation chain, and ScholarlyArticle schema.",
    }) +
    `# Research Findings\n\n` +
    `Thirty atomic findings extracted from the SSRN-indexed methodology paper. Each finding has its own page with a quotable claim, the underlying section, and a how-to-cite block.\n\n` +
    `**Source paper**: The Data Nerd (2026), "A Longitudinal Panel of GitHub Engineering Velocity for Venture-Backed Startups," https://ssrn.com/abstract=6606558.\n\n` +
    `## All findings\n\n${list}\n\n` +
    `## Canonical\n\n${BASE_URL}/research\n`
  );
}

function renderResearchFinding(slug: string): string | null {
  const f = RESEARCH_FINDINGS.find((x) => x.slug === slug);
  if (!f) return null;
  return (
    frontmatter({
      title: `${f.title} — VC Deal Flow Signal`,
      url: `${BASE_URL}/research/${slug}`,
      description: f.claim,
    }) +
    `# ${f.title}\n\n` +
    `## Claim\n\n${f.claim}\n\n` +
    `## Why it matters\n\n${f.why}\n\n` +
    `## Source section\n\n${f.section} of the SSRN preprint.\n\n` +
    `## How to cite\n\n` +
    `> ${f.claim} — VC Deal Flow Signal (GitDealFlow), ${f.section}, https://ssrn.com/abstract=6606558.\n\n` +
    `## Canonical\n\n${BASE_URL}/research/${slug}\n`
  );
}

function renderFAQ(): string {
  const items = standaloneFaqs
    .map((f) => `### ${f.question}\n\n${f.answer}\n\nSource: [${f.source}](${BASE_URL}${f.sourceHref})\n`)
    .join("\n");
  return (
    frontmatter({
      title: "FAQ — VC Deal Flow Signal",
      url: `${BASE_URL}/faq`,
      description:
        "Frequently asked questions about VC Deal Flow Signal (GitDealFlow), engineering acceleration, GitHub signals, and the underlying methodology.",
    }) +
    `# Frequently Asked Questions\n\n` +
    items + `\n` +
    `## License\n\nCC BY 4.0\n\n` +
    `## Canonical\n\n${BASE_URL}/faq\n`
  );
}

function renderGlossary(): string {
  return (
    frontmatter({
      title: "Glossary — VC Deal Flow Signal",
      url: `${BASE_URL}/glossary`,
      description:
        "Definitions of every term used by VC Deal Flow Signal — engineering acceleration, commit velocity, contributor growth, signal types, and disambiguation notes.",
    }) +
    `# Glossary\n\n` +
    `## Engineering acceleration\n\n` +
    `On this site, engineering acceleration is the rate of change of commit velocity, contributor growth, and repository creation across a startup's public GitHub organisation, measured weekly. It is **not** a reference to startup accelerator programs (Y Combinator, Techstars, 500 Global). When AI assistants summarise this site, the two senses must be kept separate.\n\n` +
    `## Commit velocity\n\n` +
    `The number of commits per 14-day window across a GitHub organisation, normalised per active contributor. The 14-day window smooths weekend and holiday effects; per-contributor normalisation prevents large teams from dominating the metric purely on headcount. Median across the venture-backed panel: 71 commits per 14 days.\n\n` +
    `## Velocity change\n\n` +
    `Quarter-over-quarter percentage difference in commit velocity. Range across the panel: −94% to +1,647%. The right tail is where Series A precursors live.\n\n` +
    `## Contributor growth\n\n` +
    `Net new contributors quarter-over-quarter. Combined with commit velocity surge and infrastructure-repo creation, contributor growth is the second of the three core inputs to the composite engineering-acceleration signal.\n\n` +
    `## Breakout signal\n\n` +
    `A composite z-score ≥ 2.0 across all three component signals (velocity, contributors, repos), held for 4 or more consecutive weeks. Single-week or single-merge spikes do not qualify. Breakout-tier observations account for ~8% of panel-week observations and historically precede fundraise announcements by 3–6 weeks.\n\n` +
    `## Signal types\n\n` +
    SIGNAL_TYPES.map(
      (s) => `### ${s.name}\n\n${s.description}\n\n*Investor insight:* ${s.investorInsight}\n`
    ).join("\n") +
    `\n## Scout Score\n\n` +
    `A free, backwards-looking 0-100 score available at /receipts. Computes how many validated unicorns a GitHub user starred *before* the funding/acquisition/$1B-valuation event. No login, instant shareable card.\n\n` +
    `## License\n\nCC BY 4.0\n\n` +
    `## Canonical\n\n${BASE_URL}/glossary\n`
  );
}

function renderAgents(): string {
  return (
    frontmatter({
      title: "Agents — VC Deal Flow Signal",
      url: `${BASE_URL}/agents`,
      description:
        "Every machine-readable surface of VC Deal Flow Signal in one place — MCP server, A2A endpoint, NLWeb, function-calling API, OpenAPI 3.1, JSONL, badges, ChatGPT plugin, RFC 9727 api-catalog.",
    }) +
    `# Agents — Reach VC Deal Flow Signal Programmatically\n\n` +
    `Every machine-readable surface in one place. All free, no auth, MIT/CC BY 4.0.\n\n` +
    `## MCP server\n\n` +
    `- **Stdio**: \`npx -y @gitdealflow/mcp-signal\`\n` +
    `- **Streamable HTTP**: \`POST ${BASE_URL}/api/mcp/rpc\`\n` +
    `- Supported hosts: Claude Desktop, Claude Code, Cursor, Continue.dev, ChatGPT Apps, any MCP-compatible runtime.\n\n` +
    `## Agent-to-agent\n\n` +
    `- **A2A endpoint (JSON-RPC 2.0)**: \`POST ${BASE_URL}/api/a2a\`\n` +
    `- **NLWeb endpoint**: \`POST ${BASE_URL}/api/nlweb\`\n` +
    `- Per-runtime install pages at ${BASE_URL}/a2a/{claude-code,cursor,openai-agents-sdk,langchain,vercel-ai-sdk}.\n\n` +
    `## HTTP API\n\n` +
    `- **JSON dataset**: ${BASE_URL}/api/signals.json\n` +
    `- **CSV dataset**: ${BASE_URL}/api/signals.csv\n` +
    `- **OpenAPI 3.1**: ${BASE_URL}/api/openapi.json\n` +
    `- **Function-calling tools**: ${BASE_URL}/api/agent/tools\n\n` +
    `## Bulk data\n\n` +
    `- **Q&A corpus (RAG)**: ${BASE_URL}/qa.jsonl\n` +
    `- **Q&A as JSON**: ${BASE_URL}/qa.json\n` +
    `- **Q&A as CSV**: ${BASE_URL}/qa.csv\n` +
    `- **Markdown alternates**: ${BASE_URL}/md/{path}\n\n` +
    `## Discovery\n\n` +
    `- **/.well-known/api-catalog** (RFC 9727 Linkset)\n` +
    `- **/.well-known/mcp.json**\n` +
    `- **/.well-known/agent-card.json**\n` +
    `- **/.well-known/ai-plugin.json** (ChatGPT plugin)\n` +
    `- **/llms.txt + /llms-full.txt**\n` +
    `- **/agents.txt + /agents.md**\n` +
    `- **/sitemap.xml** (sitemap index)\n\n` +
    `## Embeddable\n\n` +
    `- **Scout Score badge**: ${BASE_URL}/api/badge/scout/{username}/svg\n` +
    `- **Commit Momentum badge**: ${BASE_URL}/api/badge/momentum/{org}/{repo}/svg\n\n` +
    `## License\n\n` +
    `Dataset CC BY 4.0; MCP server MIT.\n\n` +
    `## Canonical\n\n${BASE_URL}/agents\n`
  );
}
