import { getLatestTop100, getAllTop100Slugs } from "@/lib/top-100";

export const dynamic = "force-static";
export const revalidate = 3600;

export async function GET() {
  const snap = getLatestTop100();
  if (!snap) {
    return new Response(
      JSON.stringify({ error: "no_snapshot_available" }),
      {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      },
    );
  }
  const payload = {
    ...snap,
    canonical: `https://signals.gitdealflow.com/weekly/top-100/${snap.isoWeek}`,
    archive: getAllTop100Slugs().map(
      (s) => `https://signals.gitdealflow.com/weekly/top-100/${s}/data.json`,
    ),
    license: "https://creativecommons.org/licenses/by/4.0/",
    citation:
      "VC Deal Flow Signal (GitDealFlow), Top 100 GitHub-Signal Startups, " +
      `${snap.isoWeek}, https://signals.gitdealflow.com/weekly/top-100/${snap.isoWeek}`,
  };
  return new Response(JSON.stringify(payload, null, 2), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
      "Access-Control-Allow-Origin": "*",
    },
  });
}
