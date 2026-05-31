#!/usr/bin/env node
/**
 * build-glossary.mjs — refresh the bundled glossary snapshot.
 *
 * Source of truth: `pseo-site/content/glossary.ts` (62 terms as of 2026-05-27).
 * Output: `chrome-extension-define/glossary.json` — a flat, length-sorted
 * array used by the content script's regex matcher.
 *
 * Strategy: re-fetch from the live API so this script also works when run
 * outside the repo (e.g. from a CI matrix or a contributor's clone without
 * tsx). Falls back to parsing the local TS module if the API is unreachable.
 *
 * Flags:
 *   --local   skip the live fetch entirely and parse the TS source. Use
 *             this when expanding the glossary locally before the new
 *             terms have been deployed to production.
 *
 * Run: `node chrome-extension-define/scripts/build-glossary.mjs [--local]`
 */

import { readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(HERE, "..", "glossary.json");
const TS_SRC = resolve(HERE, "..", "..", "pseo-site", "content", "glossary.ts");
const LIVE_URL = "https://signals.gitdealflow.com/api/v1/glossary.json";

/**
 * Pull from the production JSON-LD endpoint and flatten to {term,id,definition}.
 */
async function fromLive() {
  const res = await fetch(LIVE_URL, { headers: { accept: "application/json" } });
  if (!res.ok) throw new Error(`HTTP ${res.status} from ${LIVE_URL}`);
  const data = await res.json();
  const arr = Array.isArray(data?.hasDefinedTerm) ? data.hasDefinedTerm : [];
  if (arr.length === 0) throw new Error("hasDefinedTerm[] empty");
  return arr.map((t) => {
    const id =
      (t["@id"] && String(t["@id"]).split("#").pop()) ||
      t.termCode ||
      slugify(t.name);
    return {
      term: String(t.name || "").trim(),
      id: String(id || "").trim(),
      definition: String(t.description || "").trim(),
    };
  });
}

/**
 * Parse pseo-site/content/glossary.ts as text. The file is a TS module with
 * a single exported `glossaryTerms` array of object literals.
 */
async function fromLocalTs() {
  const src = await readFile(TS_SRC, "utf8");
  const out = [];
  // Iterate object literals: { term: "...", id: "...", definition: "..." }
  // Multi-line definitions are common, so capture the full value with
  // a permissive non-greedy match up to the next `},` boundary.
  const re =
    /\{\s*term:\s*"((?:[^"\\]|\\.)*)",\s*id:\s*"((?:[^"\\]|\\.)*)",\s*definition:\s*"((?:[^"\\]|\\.)*)",?\s*\}/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    out.push({
      term: unescapeStr(m[1]),
      id: unescapeStr(m[2]),
      definition: unescapeStr(m[3]),
    });
  }
  if (out.length === 0) throw new Error("regex parse produced 0 terms");
  return out;
}

function unescapeStr(s) {
  return s
    .replace(/\\n/g, "\n")
    .replace(/\\"/g, '"')
    .replace(/\\\\/g, "\\");
}

function slugify(s) {
  return String(s)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

/**
 * Sort terms by length descending so a single regex with alternation prefers
 * the longest match (e.g. "Engineering Hiring Burst" beats "Engineering").
 */
function sortByLengthDesc(terms) {
  return [...terms].sort((a, b) => b.term.length - a.term.length);
}

async function main() {
  const argv = new Set(process.argv.slice(2));
  const forceLocal = argv.has("--local");

  let terms;
  if (forceLocal) {
    terms = await fromLocalTs();
    console.log(`[build-glossary] local (forced) → ${terms.length} terms`);
  } else {
    try {
      terms = await fromLive();
      console.log(`[build-glossary] live → ${terms.length} terms`);
    } catch (err) {
      console.warn(`[build-glossary] live fetch failed (${err.message}); trying local`);
      terms = await fromLocalTs();
      console.log(`[build-glossary] local → ${terms.length} terms`);
    }
  }

  // Dedup by id (defensive — content.ts is authoritative but live could drift)
  const byId = new Map();
  for (const t of terms) {
    if (!t.id || !t.term) continue;
    if (!byId.has(t.id)) byId.set(t.id, t);
  }
  const final = sortByLengthDesc([...byId.values()]);

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    source: LIVE_URL,
    count: final.length,
    terms: final,
  };

  await writeFile(OUT, JSON.stringify(payload, null, 2) + "\n", "utf8");
  console.log(`[build-glossary] wrote ${OUT} (${final.length} terms)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
