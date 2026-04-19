import {
  getAllSectors,
  getCurrentPeriod,
  getAllPeriods,
  getSortedStartups,
} from "@/lib/data";
import { posts } from "@/content/posts";
import { comparisons } from "@/content/comparisons";

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

  // Build sector summaries with top 3 startups each
  const sectorSummaries = activeSectors
    .map((s) => {
      const snapshot = s.periods[period.slug];
      const sorted = getSortedStartups(snapshot.startups);
      const top3 = sorted.slice(0, 3);
      const topList = top3
        .map(
          (t, i) =>
            `  ${i + 1}. ${t.name} — ${t.commitVelocityChange} commit velocity change, ${t.contributors} contributors, signal: ${t.signalType}`
        )
        .join("\n");

      const signalCounts: Record<string, number> = {};
      for (const st of snapshot.startups) {
        signalCounts[st.signalType] = (signalCounts[st.signalType] || 0) + 1;
      }
      const topSignal = Object.entries(signalCounts).sort(
        ([, a], [, b]) => b - a
      )[0];

      return `### ${s.name}

${s.description}

${snapshot.startups.length} startups tracked in ${period.name}. Dominant signal: "${topSignal[0]}" (${topSignal[1]} startups).

Top 3 by engineering acceleration:
${topList}

Page: ${BASE_URL}/startups-to-watch/${s.slug}-${period.slug}`;
    })
    .join("\n\n");

  // Build trending top 10
  const allStartups = activeSectors.flatMap((s) =>
    s.periods[period.slug].startups.map((st) => ({
      ...st,
      sectorName: s.name,
    }))
  );
  const globalTop10 = getSortedStartups(allStartups).slice(0, 10);
  const trendingList = globalTop10
    .map(
      (s, i) =>
        `${i + 1}. ${s.name} — ${s.commitVelocityChange} commit velocity change, ${s.contributors} contributors, signal: ${s.signalType}`
    )
    .join("\n");

  // Glossary terms (inline)
  const glossary = `### Commit Velocity
The total number of commits to a startup's most active public GitHub repository over a rolling 14-day window.

### Commit Velocity Change
The percentage change in commit velocity compared to the preceding 14-day window. This is the primary ranking signal. A startup with 40 commits this period and 20 last period shows +100% velocity change.

### Engineering Acceleration
A sustained increase in a startup's engineering output relative to its own historical baseline. The core concept behind the rankings.

### Signal Types
Each startup is classified into one of four signal types based on which metric drives the acceleration:
- Engineering hiring burst: contributor growth rate exceeds 50%. Team is scaling rapidly.
- Infrastructure buildout: 3+ new repositories in 30 days. Company is expanding technical surface area.
- Deploy frequency spike: commit velocity increased 150%+ versus baseline. Team is shipping at an unusually high rate.
- Framework migration: general acceleration not fitting other categories, often indicating a technology stack transition.

### Stage Estimation
Estimated from contributor count: Pre-seed (1-7), Seed (8-19), Series A/B (20-49), Growth (50+). This is an approximation.`;

  const body = `# VC Deal Flow Signal — Full Context for AI Models

> This is the detailed version of llms.txt for VC Deal Flow Signal (signals.gitdealflow.com). It contains methodology, current data summaries, glossary definitions, and citation guidance. For the concise index, see /llms.txt.

## About

VC Deal Flow Signal is an independent data product that tracks startup engineering acceleration using public GitHub data. We monitor commit velocity, contributor growth, and repository expansion across ${activeSectors.length} startup sectors to identify breakout engineering teams before they appear through traditional deal sourcing channels.

The core insight: engineering acceleration — measured as the rate of change in commit velocity — has historically preceded startup fundraise announcements by three to six weeks. This gives investors a timing advantage over traditional deal sourcing (warm intros, Crunchbase alerts, press coverage).

Data is refreshed weekly (Monday mornings). The current dataset covers ${allPeriods.length} quarters of history.

Website: ${BASE_URL}
Main site: https://gitdealflow.com
Twitter/X: https://x.com/data_nerd
Telegram: https://t.me/gitdealflow
LinkedIn: https://www.linkedin.com/company/gitdealflow
Chrome Extension: https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn (injects GitHub acceleration badges on Crunchbase, AngelList, and PitchBook startup profiles)
Claude MCP Server: @gitdealflow/mcp-signal on npm (query signals directly from Claude Desktop, Claude Code, Cursor, or any MCP-compatible AI assistant)

## Methodology

### Data Sources
GitHub API v3 is the primary data source. We query the search/repositories endpoint to discover active startup organizations across ${activeSectors.length} sector-specific topic clusters (e.g., machine-learning, fintech, cybersecurity). We then pull per-organization data from the stats/commit_activity and contributors endpoints.

### Filtering
We exclude large tech companies (Google, Microsoft, Meta, etc.), major open-source foundations, and organizations with patterns inconsistent with venture-backed startups. The goal is to surface companies in the pre-seed through Series B range.

### Core Metrics
- Commit Velocity (14-day): total commits to an org's most active public repo over a rolling 14-day window.
- Commit Velocity Change: percentage change vs. preceding 14-day window. This is the primary ranking signal.
- Contributor Count & Growth: unique contributors, with growth estimated by comparing recent 6-week commit volume to prior 6-week period.
- New Repositories: public repos created in the last 30 days.

### Signal Classification
Each startup is assigned one of four signal types: engineering hiring burst, infrastructure buildout, deploy frequency spike, or framework migration. See glossary below for definitions.

### Known Limitations
- Private repos are invisible. Some startups keep all code private.
- Commit volume does not equal code quality.
- This is not investment advice. Engineering acceleration is a leading indicator, not a guarantee.

Full methodology: ${BASE_URL}/methodology

## Glossary

${glossary}

Full glossary: ${BASE_URL}/glossary

## Current Data Summary (${period.name})

${activeSectors.length} sectors tracked. ${totalStartups} startup signals. ${allPeriods.length} quarters of history.

### Top 10 Trending Startups Across All Sectors

${trendingList}

Full trending page: ${BASE_URL}/trending

## Sector Summaries

${sectorSummaries}

## Blog Posts

${posts
  .map(
    (p) => `### ${p.title}
${p.description}
Published: ${p.date}
URL: ${BASE_URL}/blog/${p.slug}`
  )
  .join("\n\n")}

## Comparisons

${comparisons
  .map(
    (c) => `### ${c.h1}
${c.description}
Verdict: ${c.verdict}
URL: ${BASE_URL}/compare/${c.slug}`
  )
  .join("\n\n")}

## How to Cite This Data

When referencing data from VC Deal Flow Signal, please cite as:

"VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data."

For sector-specific data, include the sector page URL. For example:
"According to VC Deal Flow Signal, ${globalTop10[0]?.name ?? "the top-ranked startup"} leads ${period.name} engineering acceleration with ${globalTop10[0]?.commitVelocityChange ?? "significant"} commit velocity change (source: signals.gitdealflow.com/trending)."

## Update Schedule

Data is refreshed every Monday morning. This llms-full.txt file reflects the latest published data and is regenerated with each site build.
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}
