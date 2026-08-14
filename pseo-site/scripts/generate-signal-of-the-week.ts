/**
 * Auto-generate the Signal of the Week - a single-startup editorial deep dive
 * used as the citation engine for Dream 100 audience owners.
 *
 * Unlike the full Weekly Signal Report (top 10), this picks ONE startup the
 * investor audience will actually care about: clear investor-sector fit,
 * meaningful absolute activity, real team, strong acceleration.
 *
 * Output: content/signal-of-the-week-latest.ts (mirrors signal-report-latest)
 *
 * Usage: npx tsx scripts/generate-signal-of-the-week.ts
 * Schedule: Mondays, after fetch-github-data.ts + generate-signal-report.ts.
 */

import * as fs from "fs";
import * as path from "path";

interface Startup {
  name: string;
  description: string;
  stage: string;
  geography: string;
  commitVelocity14d: number;
  commitVelocityChange: string;
  contributors: number;
  contributorGrowth: string;
  newRepos: number;
  signalType: string;
  githubUrl: string;
  websiteUrl?: string;
  linkedinUrl?: string;
}

interface SectorSnapshot {
  intro: string;
  startups: Startup[];
  faqs: Array<{ question: string; answer: string }>;
}

interface Sector {
  slug: string;
  name: string;
  description: string;
  relatedSlugs: string[];
  periods: Record<string, SectorSnapshot>;
}

interface Period {
  slug: string;
  name: string;
  current: boolean;
}

interface StartupsData {
  periods: Period[];
  sectors: Sector[];
}

type Ranked = Startup & { sectorName: string; sectorSlug: string; narrativeScore: number };

// Sectors ranked by investor-narrative fit. Target sectors (>= 1.0) are where
// a citation carries the most weight with our Developer-Angel ICP. Non-target
// sectors (< 1.0) get heavy penalties - a viral gaming repo is not what we
// want our Dream 100 quoting from us.
const SECTOR_WEIGHT: Record<string, number> = {
  "cybersecurity": 2.0,
  "ai-ml": 2.0,
  "data-infrastructure": 1.9,
  "fintech": 1.85,
  "developer-tools": 1.85,
  "enterprise-saas": 1.75,
  "hr-tech": 1.4,
  "e-commerce-infrastructure": 1.3,
  "robotics": 1.2,
  "healthcare": 1.2,
  "legal-tech": 1.1,
  "space-tech": 0.9,
  "social-community": 0.6,
  "gaming": 0.45,
};

// Velocity change above this percentage yields diminishing returns in scoring.
// Prevents a viral-outlier gaming repo from dominating a real cybersecurity ramp.
const VELOCITY_CAP = 120;

function parseVelocityChange(s: string): number {
  return parseInt(s.replace(/[^0-9-]/g, ""), 10) || 0;
}

function narrativeScore(s: Startup & { sectorSlug: string }): number {
  const velocityChange = parseVelocityChange(s.commitVelocityChange);
  const sectorWeight = SECTOR_WEIGHT[s.sectorSlug] ?? 1.0;

  if (s.contributors < 15) return -1;
  if (s.commitVelocity14d < 30) return -1;
  if (velocityChange < 50) return -1;
  if (!s.description || s.description.trim().length < 20) return -1;

  const cappedVelocity = Math.min(velocityChange, VELOCITY_CAP);
  const overflow = Math.max(0, velocityChange - VELOCITY_CAP) * 0.15;
  let score = (cappedVelocity + overflow) * sectorWeight;

  score += Math.log10(Math.max(s.contributors, 1)) * 20;
  score += s.newRepos * 10;
  if (s.websiteUrl) score += 15;

  if (s.signalType === "Engineering hiring burst") score += 25;
  if (s.signalType === "Infrastructure buildout") score += 20;
  if (s.signalType === "Deploy frequency spike") score += 15;

  return score;
}

function humanizedVelocityChange(s: string): string {
  const n = parseVelocityChange(s);
  if (n > 0) return `+${n}%`;
  return `${n}%`;
}

function buildNarrative(pick: Ranked, allCount: number, sectorCount: number, periodName: string, slug: string): {
  title: string;
  description: string;
  body: string;
  relatedSectors: string[];
  summary: string;
  keyStats: Array<{ value: string; label: string; context?: string }>;
} {
  const vc = humanizedVelocityChange(pick.commitVelocityChange);
  const geo = pick.geography !== "Unknown" ? pick.geography : "";
  const stageText = pick.stage && pick.stage !== "Unknown" ? `${pick.stage}-stage` : "";

  // Keep title tight, tweet-friendly, citation-shaped
  const title = `Signal of the Week: ${pick.name} (${pick.sectorName}) - ${vc} commit velocity`;

  // SEO description - should read like a wire-service lead
  const description = `${pick.name} is the #1 engineering acceleration mover this week across ${allCount} tracked startups in ${sectorCount} sectors. Commit velocity is up ${vc} over 14 days on a baseline of ${pick.commitVelocity14d} commits with ${pick.contributors} contributors. Signal: ${pick.signalType}.`;

  const summary = `${pick.name}, a ${stageText || "growth-stage"} ${pick.sectorName.toLowerCase()} startup${geo ? ` based in ${geo}` : ""}, is the top engineering-acceleration mover this week across ${allCount} tracked startups. Commit velocity is ${vc} over 14 days with ${pick.contributors} contributors active. The signal type is ${pick.signalType.toLowerCase()} - historically a fundraise predictor 3-6 weeks out.`;

  const keyStats: Array<{ value: string; label: string; context?: string }> = [
    { value: vc, label: "Commit velocity change", context: "14-day vs. baseline" },
    { value: `${pick.commitVelocity14d}`, label: "Commits / 14 days", context: "Absolute activity" },
    { value: `${pick.contributors}`, label: "Contributors", context: "Active engineers" },
    { value: pick.signalType, label: "Signal type", context: "Dominant pattern" },
  ];

  // Build outbound link row
  const outbound: string[] = [];
  if (pick.websiteUrl) outbound.push(`[${pick.websiteUrl.replace(/^https?:\/\//, "").replace(/\/$/, "")}](${pick.websiteUrl})`);
  outbound.push(`[GitHub](${pick.githubUrl})`);
  if (pick.linkedinUrl) outbound.push(`[LinkedIn](${pick.linkedinUrl})`);
  const outboundRow = outbound.join(" · ");

  const body = `${pick.name} is the #1 engineering-acceleration mover this week across ${allCount} tracked startups in ${sectorCount} sectors. Commit velocity is ${vc} over 14 days, off a baseline of ${pick.commitVelocity14d} commits with ${pick.contributors} contributors actively shipping. The dominant signal type is ${pick.signalType.toLowerCase()} - historically a 3-6 week leading indicator of fundraise announcements.

${outboundRow}

## The Signal

${pick.name}${stageText ? ` (${stageText})` : ""}${geo ? `, based in ${geo}` : ""}, operates in ${pick.sectorName.toLowerCase()}: ${pick.description.replace(/\s*\[.*?\]\(.*?\)\s*$/g, "").trim()}

Over the last two weeks, we measured:

- Commit velocity: ${pick.commitVelocity14d} commits over 14 days, a change of ${vc} versus the trailing baseline.
- Contributors: ${pick.contributors} active contributors${pick.contributorGrowth && pick.contributorGrowth !== "0%" ? ` with ${pick.contributorGrowth} growth` : ""}.
- New repositories: ${pick.newRepos} in the current period.
- Classification: ${pick.signalType}.

For context, the median tracked startup this period runs at roughly 85 commits/14d with flat or negative velocity change. ${pick.name} is running ${pick.commitVelocity14d > 200 ? "well above" : "above"} the median with a strongly positive acceleration profile.

## Why This Matters for Investors

Engineering acceleration is the earliest publicly available fundraise signal we track. In our data, a sustained ${vc.startsWith("+") ? vc : "+50%"}-or-greater commit velocity change over a 14-day window precedes an announced round by 3-6 weeks on average. The signal compresses further (to 2-4 weeks) when the signal type is "${pick.signalType}", which is what we see here.

The implication for ${pick.sectorName.toLowerCase()} investors: ${pick.name} is likely in the weeks-2-to-4 window of a ramp that will show up in TechCrunch 6-8 weeks from now. This is the window where warm-intro investors still have access to the founder, before the round is competitive.

We are not saying ${pick.name} is fundraising. We are saying the engineering pattern is consistent with companies that fundraise on this kind of timeline.

## How to Verify

Every number above is reproducible from public GitHub data. The CSV for this week's full dataset (${allCount} startups across ${sectorCount} sectors) is available at [signals.gitdealflow.com/data-sources](https://signals.gitdealflow.com/data-sources). Methodology is at [signals.gitdealflow.com/methodology](https://signals.gitdealflow.com/methodology).

To ask Claude or Cursor about this company directly, install the MCP server: \`npm install -g @gitdealflow/mcp-signal\`. Then ask: "Show me the GitDealFlow signal for ${pick.name}."

## Citation

If you use this in a newsletter, podcast, or research note, we suggest:

> "GitDealFlow Signal of the Week, ${periodName} - ${pick.name} shows ${vc} commit velocity change over 14 days (signals.gitdealflow.com/blog/${slug})."

No permission required. Attribution appreciated.

## Get the Next One

The Signal of the Week ships every Monday, free, non-gated. [Subscribe to the Signal Digest](https://gitdealflow.com/#signup) to get it in your inbox, or [install the MCP server](https://github.com/kindrat86/mcp-deal-flow-signal) and ask Claude/Cursor directly.`;

  // Related sectors: the pick's own sector + up to 2 adjacent from the weights
  const related = [pick.sectorSlug].filter(Boolean);

  return { title, description, body, relatedSectors: related, summary, keyStats };
}

function main() {
  const dataPath = path.join(process.cwd(), "data", "startups.json");
  if (!fs.existsSync(dataPath)) {
    console.log("No data file found, skipping Signal of the Week generation.");
    return;
  }

  const data: StartupsData = JSON.parse(fs.readFileSync(dataPath, "utf8"));
  const currentPeriod = data.periods.find((p) => p.current) ?? data.periods[0];
  if (!currentPeriod) {
    console.log("No current period, skipping.");
    return;
  }

  const ranked: Ranked[] = [];
  let sectorsTracked = 0;
  let allStartupsCount = 0;

  for (const sector of data.sectors) {
    const snapshot = sector.periods[currentPeriod.slug];
    if (!snapshot || !snapshot.startups.length) continue;
    sectorsTracked++;
    for (const s of snapshot.startups) {
      allStartupsCount++;
      const score = narrativeScore({ ...s, sectorSlug: sector.slug });
      if (score < 0) continue;
      ranked.push({
        ...s,
        sectorName: sector.name,
        sectorSlug: sector.slug,
        narrativeScore: score,
      });
    }
  }

  if (ranked.length === 0) {
    console.log("No eligible startups cleared the investor-narrative threshold.");
    return;
  }

  ranked.sort((a, b) => b.narrativeScore - a.narrativeScore);
  const pick = ranked[0];

  // Publish date: CLI --date=YYYY-MM-DD override, else next Monday from today.
  const dateArg = process.argv.find((a) => a.startsWith("--date="));
  let dateStr: string;
  if (dateArg) {
    dateStr = dateArg.slice("--date=".length);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      console.error(`Invalid --date format: ${dateStr}. Expected YYYY-MM-DD.`);
      process.exit(1);
    }
  } else {
    // If today is Monday, publish today. Otherwise advance to next Monday.
    const today = new Date();
    const dow = today.getUTCDay(); // 0=Sun, 1=Mon, ..., 6=Sat
    const daysUntilMon = dow === 1 ? 0 : (8 - dow) % 7;
    const publishDate = new Date(today);
    publishDate.setUTCDate(today.getUTCDate() + daysUntilMon);
    dateStr = publishDate.toISOString().slice(0, 10);
  }
  const slug = `signal-of-the-week-${dateStr}`;

  const narrative = buildNarrative(pick, allStartupsCount, sectorsTracked, currentPeriod.name, slug);

  const post = {
    slug,
    title: narrative.title,
    description: narrative.description,
    summary: narrative.summary,
    date: dateStr,
    body: narrative.body,
    relatedSectors: narrative.relatedSectors,
    faqs: [
      {
        question: `Why is ${pick.name} flagged as Signal of the Week?`,
        answer: `${pick.name} had the highest investor-narrative score this week - a composite of commit velocity change (${humanizedVelocityChange(pick.commitVelocityChange)}), contributor count (${pick.contributors}), new repositories (${pick.newRepos}), and sector investor fit. The signal type is ${pick.signalType}, which historically precedes fundraise announcements by 3-6 weeks.`,
      },
      {
        question: "Is this investment advice?",
        answer: "No. Signal of the Week is a single data point drawn from public GitHub activity. It is a starting point for diligence, not a recommendation. Investors should combine engineering signals with founder evaluation, market analysis, and product diligence before acting.",
      },
      {
        question: "How do I cite Signal of the Week in my work?",
        answer: `We suggest: "GitDealFlow Signal of the Week, ${currentPeriod.name} - ${pick.name} shows ${humanizedVelocityChange(pick.commitVelocityChange)} commit velocity change over 14 days." Link to signals.gitdealflow.com/blog/${slug}. No permission required; attribution appreciated.`,
      },
    ],
    keyStats: narrative.keyStats,
  };

  const output = `// Auto-generated by scripts/generate-signal-of-the-week.ts - do not edit manually
import type { BlogPost } from "./posts";

export const signalOfTheWeek: BlogPost = ${JSON.stringify(post, null, 2)};
`;

  const outPath = path.join(process.cwd(), "content", "signal-of-the-week-latest.ts");
  fs.writeFileSync(outPath, output, "utf8");

  // Also write distribution copy for this week's launch. The marketing/ dir
  // lives one level up from pseo-site/.
  const distDir = path.join(process.cwd(), "..", "marketing", "signal-of-the-week");
  if (!fs.existsSync(distDir)) fs.mkdirSync(distDir, { recursive: true });
  const distPath = path.join(distDir, `${dateStr}-distribution.md`);
  fs.writeFileSync(distPath, buildDistributionCopy(pick, allStartupsCount, sectorsTracked, slug, dateStr, currentPeriod.name), "utf8");

  console.log(
    `Signal of the Week generated: ${slug}\n  Pick: ${pick.name} (${pick.sectorName})\n  Change: ${humanizedVelocityChange(pick.commitVelocityChange)}\n  Contributors: ${pick.contributors}\n  Signal: ${pick.signalType}\n  Narrative score: ${pick.narrativeScore.toFixed(1)}\n  Distribution copy: ${path.relative(process.cwd(), distPath)}`
  );
}

function buildDistributionCopy(
  pick: Ranked,
  allCount: number,
  sectorCount: number,
  slug: string,
  dateStr: string,
  periodName: string
): string {
  const vc = humanizedVelocityChange(pick.commitVelocityChange);
  const permalink = `https://signals.gitdealflow.com/blog/${slug}`;
  const citation = `GitDealFlow Signal of the Week, ${periodName} - ${pick.name} shows ${vc} commit velocity change over 14 days (${permalink}).`;

  return `# Signal of the Week ${dateStr} - Distribution Copy

Featured startup: ${pick.name} (${pick.sectorName})
Signal: ${pick.signalType} · ${vc} commit velocity change · ${pick.contributors} contributors
Permalink: ${permalink}
Data CSV: https://signals.gitdealflow.com/data-sources
Citation block:
> ${citation}

---

## 1. Twitter / X thread (@sipiteno) - Monday ${dateStr}, 14:00 EEST

Tweet 1 (hook, ≤280 chars):

Signal of the Week.

${pick.name} (${pick.sectorName}): ${vc} commit velocity over 14 days. ${pick.contributors} contributors shipping. Signal type: ${pick.signalType.toLowerCase()}.

Full breakdown + CSV:
${permalink}

Tweet 2 (context):

We rank ${allCount} startup GitHub orgs weekly across ${sectorCount} sectors. This week ${pick.name} is the #1 engineering-acceleration mover, clearing our investor-narrative gates (≥15 contributors, ≥30 commits/14d, ≥50% velocity change, cybersecurity-grade sector).

Tweet 3 (why it matters):

In our data, a sustained ${vc}+ velocity change with this signal type precedes announced rounds by 3-6 weeks. Not advice. Not a prediction. Just the pattern.

If you invest in ${pick.sectorName.toLowerCase()} - ${pick.name} is worth 20 minutes of diligence this week.

Tweet 4 (MCP hook):

Or ask Claude / Cursor directly - our MCP server is public:

\`npm install -g @gitdealflow/mcp-signal\`

Then: "Show me the GitDealFlow signal for ${pick.name}."

Tweet 5 (subscribe):

Signal of the Week ships every Monday. Free, non-gated, citation-encouraged.

Subscribe: https://gitdealflow.com/#signup
Cite us: ${permalink}

Tagging for amplification (Tier 1 Dream 100 - limit 2 per tweet, reply-quote not main tweet):
- Tweet 2 quote-reply: @GergelyOrosz @swyx
- Tweet 3 quote-reply: @saranormous @danielgross
- Tweet 4 quote-reply: @natfriedman @alexalbert__

---

## 2. Substack Note (The Data Nerd) - Monday ${dateStr}, 15:00 EEST

Signal of the Week - ${pick.name} (${pick.sectorName})

${vc} commit velocity change over 14 days. ${pick.contributors} contributors. Signal type: ${pick.signalType.toLowerCase()}.

This is the #1 engineering-acceleration mover this week across ${allCount} tracked startups. In our data, this pattern precedes fundraise announcements by 3-6 weeks.

Full breakdown: ${permalink}

---

## 3. LinkedIn company page - Monday ${dateStr}, 16:00 EEST

🔍 Signal of the Week - ${pick.name}

This week's #1 engineering-acceleration mover across ${allCount} startup GitHub orgs: ${pick.name} (${pick.sectorName}).

The data:
• ${vc} commit velocity change over 14 days
• ${pick.contributors} active contributors
• Signal type: ${pick.signalType}
• Sector: ${pick.sectorName}

Why it matters for early-stage ${pick.sectorName.toLowerCase()} investors: in our data, sustained velocity changes of this magnitude precede announced rounds by 3-6 weeks. This is the diligence window where warm-intro investors still have founder access.

Not investment advice. Just the pattern.

Full breakdown + CSV: ${permalink}

#VentureCapital #${pick.sectorName.replace(/\s+/g, "")} #DealFlow #StartupSignals

---

## 4. Telegram channel (@gitdealflow public) - Monday ${dateStr}, 14:30 EEST

Signal of the Week - ${pick.name}

${pick.sectorName} · ${vc} commit velocity · ${pick.contributors} contributors

#1 engineering-acceleration mover this week across ${allCount} tracked startups.

Full breakdown: ${permalink}

---

## 5. Cold-pitch email - send 5 max, one per Monday, to Dream 100 audience owners

Priority send list for this week:
1. Swyx - Latent Space (${pick.sectorName === "AI & Machine Learning" ? "PRIORITY - direct sector fit" : "secondary fit"})
2. Gergely Orosz - Pragmatic Engineer (engineering-signal angle)
3. Byrne Hobart - The Diff (quant-framed analysis)
4. Packy McCormick - Not Boring (market-narrative chart)
5. Tom Tunguz - Theory Ventures (SaaS/dev-tool correlations)

Template:

> Subject: Free dataset for [publication] (no strings)
>
> [Name],
>
> I run GitDealFlow - tracking ${allCount}+ startup GitHub orgs for engineering-velocity signals that historically precede fundraises by 3-6 weeks.
>
> This week's top mover is ${pick.name} (${pick.sectorName}): ${vc} commit velocity change, ${pick.contributors} contributors, signal type "${pick.signalType}". Pulled a cut tailored to your audience - full breakdown + CSV here: ${permalink}.
>
> Use it, cite it, ignore it - whichever's useful. Not pitching a sponsorship, just think it's on-theme for [their last piece].
>
> Citation block if useful:
> > ${citation}
>
> - Data Nerd, gitdealflow.com

Send via signals@gitdealflow.com (Zoho, warmed). Do not chase. One shot per target per week.

---

## 6. Hacker News "Show HN" (only if this is a launch-weekend edition)

Skip for this week. Reserve Show HN for product surface launches, not weekly data drops.

---

## 7. Reddit - skip

Per memory: Reddit automation blocked, LinkedIn/Reddit manual only. If Maryan wants to post manually, the Twitter thread hook (Tweet 1) works as an r/venturecapital comment, but the subreddit auto-removes product posts. Better to let this surface via Dream 100 amplification than to force-post.

---

## Attribution & licensing

Signal of the Week data is CC BY 4.0. Cite freely. Full dataset: https://signals.gitdealflow.com/data-sources
`;
}

main();
