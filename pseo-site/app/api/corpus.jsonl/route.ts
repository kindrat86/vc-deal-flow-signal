/**
 * /api/corpus.jsonl — NDJSON stream of the curated entity corpus.
 *
 * One record per line, line-diffable, with a leading `_meta` line that
 * self-describes the snapshot (revision, asOf, counts, license, citation)
 * so a RAG ingestion pipeline or HF dataset script needs no side fetch.
 *
 * Why JSONL alongside /api/corpus.json: NDJSON is what HF Datasets, OpenAI
 * Files, and most RAG ingestion accept natively, and the one-record-per-line
 * shape lets a consumer `diff` two pulls to see exactly which entities
 * changed between snapshots. Each line carries its own `recordHash`.
 */

import {
  buildCorpusSnapshot,
  corpusCitation,
  CORPUS_CONTRACT_VERSION,
  CORPUS_LICENSE,
  SITE,
} from "@/lib/corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = buildCorpusSnapshot();
  const etag = `"corpus-jsonl:${CORPUS_CONTRACT_VERSION}:${snapshot.revision}"`;

  const lines: string[] = [];

  lines.push(
    JSON.stringify({
      _meta: true,
      dataset: "gitdealflow-curated-entity-corpus",
      contractVersion: CORPUS_CONTRACT_VERSION,
      revision: snapshot.revision,
      asOf: snapshot.asOf,
      asOfTimestamp: snapshot.asOfTimestamp,
      counts: snapshot.counts,
      license: CORPUS_LICENSE,
      citation: corpusCitation(snapshot),
      methodology: `${SITE}/methodology`,
      schemaUrl: `${SITE}/api/corpus.json`,
      diffGuide:
        "Each subsequent line is one entity record with a stable recordHash. Diff two pulls line-by-line to localize changes; compare the _meta revision to detect any change at all.",
    }),
  );

  for (const r of snapshot.records) {
    lines.push(JSON.stringify(r));
  }

  const body = lines.join("\n") + "\n";

  return new Response(body, {
    headers: {
      "Content-Type": "application/x-ndjson; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      ETag: etag,
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/api/corpus.jsonl>; rel="canonical"`,
    },
  });
}
