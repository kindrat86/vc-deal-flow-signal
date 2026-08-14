import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

/**
 * Hugging-Face-Datasets-compatible JSONL stream of the current panel.
 *
 * One startup per line, NDJSON, plus a leading metadata line that lets a
 * dataset card or RAG ingestion pipeline self-describe without a side fetch.
 *
 * Why JSONL: HF Datasets, OpenAI Files, and most RAG ingestion pipelines
 * accept newline-delimited JSON natively. This endpoint is what lets agents
 * "drop in" the GitDealFlow panel as a finetune/RAG corpus with one curl.
 */
export async function GET(request: Request) {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();

  const ifNoneMatch = request.headers.get("if-none-match");
  const etag = `"jsonl:${period.slug}:${lastModified.getTime()}"`;
  if (ifNoneMatch === etag) {
    return new Response(null, {
      status: 304,
      headers: {
        ETag: etag,
        "Cache-Control": "s-maxage=86400, stale-while-revalidate=3600",
      },
    });
  }

  const lines: string[] = [];

  // Leading metadata line, single JSON object describing the panel.
  lines.push(
    JSON.stringify({
      _meta: true,
      dataset: "gitdealflow-startup-engineering-signals",
      version: "1.0.0",
      period: period.name,
      periodSlug: period.slug,
      lastModified: lastModified.toISOString(),
      license: "https://creativecommons.org/licenses/by/4.0/",
      citation: `VC Deal Flow Signal (signals.gitdealflow.com), ${period.name} data.`,
      methodology: `${SITE}/methodology`,
      schemaUrl: `${SITE}/api/openapi.json`,
      fields: [
        "name",
        "sector",
        "sectorSlug",
        "period",
        "commitVelocity14d",
        "commitVelocityChange",
        "contributors",
        "contributorGrowth",
        "newRepos",
        "signalType",
        "stage",
        "geography",
        "githubUrl",
      ],
    }),
  );

  for (const sector of sectors) {
    const snapshot = sector.periods[period.slug];
    if (!snapshot) continue;
    for (const s of snapshot.startups) {
      lines.push(
        JSON.stringify({
          name: s.name,
          sector: sector.name,
          sectorSlug: sector.slug,
          period: period.name,
          commitVelocity14d: s.commitVelocity14d,
          commitVelocityChange: s.commitVelocityChange,
          contributors: s.contributors,
          contributorGrowth: s.contributorGrowth,
          newRepos: s.newRepos,
          signalType: s.signalType,
          stage: s.stage,
          geography: s.geography,
          githubUrl: s.githubUrl,
          websiteUrl: s.websiteUrl ?? null,
        }),
      );
    }
  }

  const body = lines.join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control": "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      ETag: etag,
      "Last-Modified": lastModified.toUTCString(),
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
