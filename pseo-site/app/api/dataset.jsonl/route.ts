import { getAllSectors, getCurrentPeriod, getDataLastModified } from "@/lib/data";
import {
  isNotModified,
  makeETag,
  notModifiedResponse,
  withConditionalHeaders,
} from "@/lib/http-conditional";

export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";
const CACHE_CONTROL =
  "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800";

/**
 * Hugging-Face-Datasets-compatible JSONL stream of the current panel.
 *
 * One startup per line, NDJSON, plus a leading metadata line that lets a
 * dataset card or RAG ingestion pipeline self-describe without a side fetch.
 *
 * Honors both If-None-Match and If-Modified-Since for crawl-budget /
 * RAG-pipeline efficiency.
 */
export async function GET(request: Request) {
  const sectors = getAllSectors();
  const period = getCurrentPeriod();
  const lastModified = getDataLastModified();
  const etag = makeETag("jsonl", period.slug, lastModified.getTime());

  if (isNotModified(request, lastModified, etag)) {
    return notModifiedResponse(lastModified, etag, CACHE_CONTROL);
  }

  const lines: string[] = [];

  lines.push(
    JSON.stringify({
      _meta: true,
      dataset: "gitdealflow-startup-engineering-signals",
      version: "1.0.0",
      period: period.name,
      periodSlug: period.slug,
      lastModified: lastModified.toISOString(),
      license: "https://creativecommons.org/licenses/by/4.0/",
      citation: "VC Deal Flow Signal (signals.gitdealflow.com), " + period.name + " data.",
      methodology: SITE + "/methodology",
      schemaUrl: SITE + "/api/openapi.json",
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

  return withConditionalHeaders(body, {
    contentType: "application/x-ndjson; charset=utf-8",
    lastModified,
    etag,
    cacheControl: CACHE_CONTROL,
    extraHeaders: {
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
    },
  });
}
