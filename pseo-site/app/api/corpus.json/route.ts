/**
 * /api/corpus.json, versioned, dated, diffable snapshot of the curated
 * entity corpus (companies, funds, founders, glossary, sectors, acquirers).
 *
 * One fetch gives an agent the full curated inventory with provenance:
 *   - `revision`      deterministic content hash, same data, same hash
 *   - `asOf`          data-as-of date (YYYY-MM-DD), site-wide freshness clock
 *   - `generatedAt`   build time
 *   - per-record `recordHash` for line/record-level diffing
 *
 * Companion surfaces:
 *   - /api/corpus.jsonl       NDJSON, one record per line (line-diffable)
 *   - /entities.json          flat meta-entity manifest (org/person/datasets)
 *   - /api/dataset.jsonl      numeric signal panel (distinct from this corpus)
 *   - /.well-known/dataset.json  DCAT catalog that lists this surface
 *
 * Served as a route handler (not a static public/ file) so it emits a typed
 * content-type, a content-derived ETag, and full Cache-Control headers.
 */

import {
  buildCorpusSnapshot,
  corpusCitation,
  CORPUS_CONTRACT_VERSION,
  CORPUS_LICENSE,
  CORPUS_PUBLISHER,
  SITE,
} from "@/lib/corpus";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  const snapshot = buildCorpusSnapshot();
  const etag = `"corpus:${CORPUS_CONTRACT_VERSION}:${snapshot.revision}"`;

  const body = {
    $schema: "https://json-schema.org/draft/2020-12/schema",
    name: "VC Deal Flow Signal, curated entity corpus",
    description:
      "Versioned, dated, diffable snapshot of every curated entity asserted by signals.gitdealflow.com: companies (with public GitHub orgs), venture funds, public engineering founders, glossary terms, sector hubs, and M&A acquirers. Each record carries a stable recordHash for diffing; the snapshot carries a content-derived `revision` and an `asOf` date. Distinct from /api/dataset.jsonl (numeric signal panel) and /entities.json (meta-entity manifest). License: CC BY 4.0.",
    contractVersion: CORPUS_CONTRACT_VERSION,
    revision: snapshot.revision,
    asOf: snapshot.asOf,
    asOfTimestamp: snapshot.asOfTimestamp,
    generatedAt: new Date().toISOString(),
    publisher: CORPUS_PUBLISHER,
    license: CORPUS_LICENSE,
    citation: corpusCitation(snapshot),
    methodology: `${SITE}/methodology`,
    mirrors: {
      huggingface:
        "https://huggingface.co/datasets/the-data-nerd/vc-deal-flow-signal-corpus",
    },
    diffGuide:
      "Compare `revision` across two pulls to detect any change. Compare per-record `recordHash` (or diff /api/corpus.jsonl line-by-line) to localize what changed. Both hashes depend only on record content, not on generatedAt.",
    counts: snapshot.counts,
    collections: snapshot.byCollection,
  };

  return new Response(JSON.stringify(body), {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control":
        "public, max-age=300, s-maxage=86400, stale-while-revalidate=604800",
      ETag: etag,
      "X-Content-Type-Options": "nosniff",
      "Access-Control-Allow-Origin": "*",
      "X-Robots-Tag": "index, follow",
      Link: `<${SITE}/api/corpus.json>; rel="canonical"`,
    },
  });
}
