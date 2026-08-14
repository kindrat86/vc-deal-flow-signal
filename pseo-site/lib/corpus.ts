/**
 * lib/corpus.ts, the canonical, versioned, dated, content-hashed snapshot
 * of the *curated entity corpus* (companies, funds, founders, glossary,
 * sectors, acquirers).
 *
 * This is the data layer behind two machine-readable surfaces:
 *   - /api/corpus.json  , full snapshot, one document
 *   - /api/corpus.jsonl , NDJSON, one record per line (line-diffable)
 *
 * Why this exists separately from the surfaces already on the domain:
 *   - /entities.json          lists only *meta* entities (the org, the
 *                             founder, the datasets, the publication), not
 *                             the 159 companies / 45 funds / 29 founders /
 *                             135 glossary terms that make up the corpus.
 *   - /api/dataset.jsonl      streams the *numeric signal panel* (lib/data),
 *                             not the curated entity records.
 *   - /knowledge-graph.json   is JSON-LD; needs a JSON-LD parser.
 *
 * The agentic-era contract this surface adds:
 *   1. DATED , every snapshot carries `asOf` (data-as-of, tied to the same
 *      freshness clock as the rest of the site via getDataLastModified) and
 *      `generatedAt` (build time). An LLM can ground "as of 2026-05-30"
 *      instead of hallucinating freshness.
 *   2. VERSIONED, `contractVersion` is the schema semver; `revision` is a
 *      deterministic short content hash of the records. Same data → same
 *      revision, across rebuilds. Different data → different revision.
 *   3. DIFFABLE, every record carries its own `recordHash`, and the
 *      JSONL surface emits one record per line, so a consumer can diff two
 *      pulls line-by-line (or hash-by-hash) and see exactly what changed
 *      without re-reading the whole corpus.
 *
 * Determinism note: the hashes depend ONLY on the record content, never on
 * wall-clock time. `generatedAt` is metadata and intentionally excluded
 * from the hash so `revision` stays stable for unchanged data.
 */

import { createHash } from "node:crypto";
import { companies } from "@/content/companies";
import { funds } from "@/content/funds";
import { founders } from "@/content/founders";
import { glossaryTerms } from "@/content/glossary";
import { sectors } from "@/content/sectors";
import { ACQUIRERS } from "@/content/acquirers";
import { getDataLastModified } from "@/lib/data";

export const SITE = "https://signals.gitdealflow.com";
const APEX = "https://gitdealflow.com";
const WIKIDATA_QID = "Q139376302";

/** Bump when the *record schema* changes (field added/removed/renamed). */
export const CORPUS_CONTRACT_VERSION = "1.0.0";

export type CorpusCollection =
  | "companies"
  | "funds"
  | "founders"
  | "glossary"
  | "sectors"
  | "acquirers";

interface CorpusRecordFields {
  collection: CorpusCollection;
  id: string;
  type: string;
  name: string;
  url: string;
  // Collection-specific fields are spread in at build time.
  [key: string]: unknown;
}

export type CorpusRecord = CorpusRecordFields & {
  /** Deterministic short hash of this record's content fields. */
  recordHash: string;
};

/**
 * Stable JSON: object keys serialized in sorted order, recursively, so the
 * same logical content always produces the same string (and therefore the
 * same hash) regardless of declaration order.
 */
function stableStringify(value: unknown): string {
  if (value === null || typeof value !== "object") {
    return JSON.stringify(value);
  }
  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`;
  }
  const obj = value as Record<string, unknown>;
  const keys = Object.keys(obj).sort();
  return `{${keys
    .map((k) => `${JSON.stringify(k)}:${stableStringify(obj[k])}`)
    .join(",")}}`;
}

function shortHash(input: string, len = 12): string {
  return createHash("sha256").update(input).digest("hex").slice(0, len);
}

/**
 * Build a normalized record. The `recordHash` is computed over the content
 * fields only (everything except `recordHash` itself), so it is stable and
 * lets consumers detect per-record changes.
 */
function makeRecord(fields: CorpusRecordFields): CorpusRecord {
  const recordHash = shortHash(stableStringify(fields));
  return { ...fields, recordHash };
}

function buildCompanyRecords(): CorpusRecord[] {
  return companies.map((c) =>
    makeRecord({
      collection: "companies",
      id: c.slug,
      type: "Organization",
      name: c.name,
      url: `${SITE}/signal/${c.slug}`,
      githubOrg: c.githubOrg,
      githubUrl: `https://github.com/${c.githubOrg}`,
      homepageUrl: c.homepageUrl,
      sector: c.sector,
      stage: c.stage,
      description: c.description,
      momentum: c.publicSignal?.momentum ?? null,
      publicReposEstimate: c.publicSignal?.publicReposEstimate ?? null,
      languageBias: c.publicSignal?.languageBias ?? null,
      relatedSectors: c.relatedSectors,
    }),
  );
}

function buildFundRecords(): CorpusRecord[] {
  return funds.map((f) =>
    makeRecord({
      collection: "funds",
      id: f.slug,
      type: "Organization",
      name: f.name,
      url: `${SITE}/fund/${f.slug}`,
      homepageUrl: f.homepageUrl,
      hq: f.hq,
      stageFocus: f.stageFocus,
      description: f.description,
      thesis: f.thesis,
      relatedSectors: f.relatedSectors,
    }),
  );
}

function buildFounderRecords(): CorpusRecord[] {
  return founders.map((p) =>
    makeRecord({
      collection: "founders",
      id: p.handle,
      type: "Person",
      name: p.name,
      url: `${SITE}/founder/${p.handle}`,
      githubHandle: p.handle,
      role: p.role,
      affiliation: p.affiliation,
      publicSource: p.publicSource,
      notablePublicWork: p.notablePublicWork,
      sameAs: p.sameAs,
    }),
  );
}

function buildGlossaryRecords(): CorpusRecord[] {
  return glossaryTerms.map((t) =>
    makeRecord({
      collection: "glossary",
      id: t.id,
      type: "DefinedTerm",
      name: t.term,
      url: `${SITE}/define/${t.id}`,
      definition: t.definition,
    }),
  );
}

function buildSectorRecords(): CorpusRecord[] {
  return sectors.map((s) => {
    const companyCount = companies.filter((c) => c.sector === s.slug).length;
    return makeRecord({
      collection: "sectors",
      id: s.slug,
      type: "CollectionPage",
      name: s.name,
      url: `${SITE}/sector/${s.slug}`,
      companyCount,
      fundSectors: s.fundSectors,
    });
  });
}

function buildAcquirerRecords(): CorpusRecord[] {
  return ACQUIRERS.map((a) =>
    makeRecord({
      collection: "acquirers",
      id: a.slug,
      type: "Organization",
      name: a.name,
      url: `${SITE}/acquirer/${a.slug}`,
      homepageUrl: a.homepageUrl,
      hq: a.hq,
      focusSectors: a.focusSectors,
      notableAcquisitionsCount: a.notableAcquisitions.length,
      notableAcquisitions: a.notableAcquisitions.map((d) => ({
        name: d.name,
        year: d.year,
        announcedAmount: d.announcedAmount ?? null,
        note: d.note,
      })),
    }),
  );
}

export interface CorpusSnapshot {
  records: CorpusRecord[];
  byCollection: Record<CorpusCollection, CorpusRecord[]>;
  counts: Record<CorpusCollection, number> & { total: number };
  /** Deterministic short content hash over all record hashes, in order. */
  revision: string;
  /** Data-as-of date (YYYY-MM-DD), tied to site-wide freshness clock. */
  asOf: string;
  asOfTimestamp: string;
}

/**
 * Assemble the full snapshot. Pure function of the curated corpus modules +
 * the freshness clock, no wall-clock, no randomness, so `revision` is
 * reproducible.
 */
export function buildCorpusSnapshot(): CorpusSnapshot {
  const byCollection: Record<CorpusCollection, CorpusRecord[]> = {
    companies: buildCompanyRecords(),
    funds: buildFundRecords(),
    founders: buildFounderRecords(),
    glossary: buildGlossaryRecords(),
    sectors: buildSectorRecords(),
    acquirers: buildAcquirerRecords(),
  };

  // Stable emit order: collection order, then id order within each.
  const order: CorpusCollection[] = [
    "companies",
    "funds",
    "founders",
    "glossary",
    "sectors",
    "acquirers",
  ];
  const records: CorpusRecord[] = [];
  for (const col of order) {
    const sorted = [...byCollection[col]].sort((a, b) =>
      a.id.localeCompare(b.id),
    );
    byCollection[col] = sorted;
    records.push(...sorted);
  }

  const counts = {
    companies: byCollection.companies.length,
    funds: byCollection.funds.length,
    founders: byCollection.founders.length,
    glossary: byCollection.glossary.length,
    sectors: byCollection.sectors.length,
    acquirers: byCollection.acquirers.length,
    total: records.length,
  };

  const revision = shortHash(
    records.map((r) => `${r.collection}/${r.id}:${r.recordHash}`).join("\n"),
    16,
  );

  const modified = getDataLastModified();
  return {
    records,
    byCollection,
    counts,
    revision,
    asOf: modified.toISOString().slice(0, 10),
    asOfTimestamp: modified.toISOString(),
  };
}

export const CORPUS_PUBLISHER = {
  name: "VC Deal Flow Signal",
  alternateName: "GitDealFlow",
  url: APEX,
  wikidata: `https://www.wikidata.org/wiki/${WIKIDATA_QID}`,
} as const;

export const CORPUS_LICENSE = "https://creativecommons.org/licenses/by/4.0/";

/** Stable citation string for the current snapshot. */
export function corpusCitation(snapshot: CorpusSnapshot): string {
  return `VC Deal Flow Signal (GitDealFlow), curated entity corpus revision ${snapshot.revision}, as of ${snapshot.asOf}. ${SITE}/api/corpus.json. CC BY 4.0.`;
}
