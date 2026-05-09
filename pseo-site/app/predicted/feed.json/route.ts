import { getAllPredictionWeeks, computeScorecard } from "@/lib/predictions";
import { getDataLastModified } from "@/lib/data";

export const dynamic = "force-static";
export const revalidate = 3600;

const BASE_URL = "https://signals.gitdealflow.com";

/**
 * /predicted/feed.json — JSON Feed v1.1 of the weekly Engineering Acceleration
 * Watch.
 *
 * One item per week. Each item carries the 10 named picks, their thesis,
 * commit-velocity change, and post-hoc grading outcome (raised / acquired /
 * IPO / no_event / shutdown / excluded / pending).
 *
 * High-value retrieval surface for AI agents that ingest weekly research
 * digests — the JSON shape lets an agent rank picks programmatically without
 * scraping the HTML page or parsing RSS.
 */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function fmtLongDate(iso: string | null | undefined): string {
  if (!iso) return "TBD";
  const d = new Date(iso + "T00:00:00Z");
  if (Number.isNaN(d.getTime())) return "TBD";
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

function safeIsoOrNull(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso + "T09:00:00Z");
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
}

const OUTCOME_LABEL: Record<string, string> = {
  raised: "Raised",
  acquired: "Acquired",
  ipo: "IPO",
  other_milestone: "Milestone",
  no_event: "No event",
  shutdown: "Shutdown",
  excluded: "Excluded",
};

export async function GET() {
  const weeks = getAllPredictionWeeks();
  const scorecard = computeScorecard();
  const lastModified = getDataLastModified().toISOString();

  // Most recent first; cap at 52 weeks.
  const items = weeks.slice(0, 52).map((week) => {
    const url = `${BASE_URL}/predicted/${week.slug}`;
    const title = `Acceleration Watch — week of ${fmtLongDate(week.weekStart)}`;
    const summary = `${week.picks.length} startups whose GitHub engineering acceleration crossed our signal threshold. Grading window closes ${fmtLongDate(week.gradingDueAt)}.`;

    const picksList = week.picks
      .map((p) => {
        const outcome =
          p.outcome && OUTCOME_LABEL[p.outcome]
            ? OUTCOME_LABEL[p.outcome]
            : "Pending";
        return `<li><strong>${escapeHtml(p.displayName)}</strong> (${escapeHtml(
          p.sector,
        )}, ${escapeHtml(p.stage)}) — ${escapeHtml(
          p.commitVelocityChange,
        )} velocity change, ${p.contributors} contributors. <em>${escapeHtml(
          p.signalType,
        )}</em>. Outcome: ${escapeHtml(outcome)}. <a href="${escapeHtml(p.githubUrl)}">GitHub</a>.</li>`;
      })
      .join("");

    const contentHtml = [
      `<p>${escapeHtml(summary)}</p>`,
      `<p>Published ${fmtLongDate(week.publishedAt)}. Window: ${week.windowDays} days. Grading due ${fmtLongDate(week.gradingDueAt)}.</p>`,
      `<h3>Picks</h3>`,
      `<ol>${picksList}</ol>`,
      `<p><a href="${url}">View the full week →</a></p>`,
    ].join("\n");

    return {
      id: url,
      url,
      title,
      content_html: contentHtml,
      content_text: summary,
      summary,
      image: `${BASE_URL}/predicted/${week.slug}/opengraph-image`,
      banner_image: `${BASE_URL}/predicted/${week.slug}/opengraph-image`,
      date_published: safeIsoOrNull(week.publishedAt) ?? lastModified,
      date_modified: safeIsoOrNull(week.publishedAt) ?? lastModified,
      authors: [
        {
          name: "The Data Nerd",
          url: `${BASE_URL}/about`,
          avatar: `${BASE_URL}/icon.png`,
        },
      ],
      tags: Array.from(new Set(week.picks.map((p) => p.sectorSlug))),
      language: "en-US",
      _gitdealflow: {
        weekSlug: week.slug,
        weekStart: week.weekStart,
        weekEnd: week.weekEnd,
        gradingDueAt: week.gradingDueAt,
        windowDays: week.windowDays,
        pickCount: week.picks.length,
        picks: week.picks.map((p) => ({
          rank: p.rank,
          name: p.displayName,
          sector: p.sectorSlug,
          stage: p.stage,
          signalType: p.signalType,
          commitVelocityChange: p.commitVelocityChange,
          contributors: p.contributors,
          outcome: p.outcome ?? "pending",
          outcomeAt: p.outcomeAt ?? null,
        })),
        license: "https://creativecommons.org/licenses/by/4.0/",
      },
    };
  });

  const feed = {
    version: "https://jsonfeed.org/version/1.1",
    title: "VC Deal Flow Signal — Engineering Acceleration Watch (Weekly)",
    home_page_url: `${BASE_URL}/predicted`,
    feed_url: `${BASE_URL}/predicted/feed.json`,
    description:
      "Weekly public data feed (not an accelerator program). Every Monday names 10 startups whose GitHub engineering acceleration crossed the signal threshold. Each pick is graded post-hoc against public fundraise news at 60 and 90 days.",
    user_comment:
      "JSON Feed v1.1. Falsifiable predictions with explicit grading windows. Catalog at /.well-known/feeds.json.",
    icon: `${BASE_URL}/icon.png`,
    favicon: `${BASE_URL}/favicon.ico`,
    language: "en-US",
    authors: [
      {
        name: "The Data Nerd",
        url: `${BASE_URL}/about`,
        avatar: `${BASE_URL}/icon.png`,
      },
    ],
    items,
    _gitdealflow: {
      stream: "predicted",
      cadence: "weekly",
      releaseDay: "Monday",
      itemCount: items.length,
      scorecard: {
        weeksGraded: scorecard.weeksGraded,
        picksTotal: scorecard.picksTotal,
        picksGraded: scorecard.picksGraded,
        picksPending: scorecard.picksPending,
        raised: scorecard.raised,
        acquired: scorecard.acquired,
        ipo: scorecard.ipo,
        otherMilestone: scorecard.otherMilestone,
        noEvent: scorecard.noEvent,
        shutdown: scorecard.shutdown,
      },
      lastModified,
      license: "https://creativecommons.org/licenses/by/4.0/",
      siblings: {
        humanIndex: `${BASE_URL}/predicted`,
        weekRoute: `${BASE_URL}/predicted/{weekSlug}`,
      },
      catalog: `${BASE_URL}/.well-known/feeds.json`,
    },
  };

  return new Response(JSON.stringify(feed, null, 2), {
    headers: {
      "Content-Type": "application/feed+json; charset=utf-8",
      "Cache-Control": "public, max-age=900, s-maxage=3600, stale-while-revalidate=86400",
      "X-Robots-Tag": "index, follow",
      "Access-Control-Allow-Origin": "*",
      Link: [
        `<${BASE_URL}/predicted/feed.json>; rel="self"; type="application/feed+json"`,
        `<${BASE_URL}/predicted>; rel="alternate"; type="text/html"`,
        `<${BASE_URL}/.well-known/feeds.json>; rel="related"; type="application/json"; title="Feed catalog"`,
        `<https://creativecommons.org/licenses/by/4.0/>; rel="license"`,
      ].join(", "),
    },
  });
}
