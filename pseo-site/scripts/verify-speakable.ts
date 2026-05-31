#!/usr/bin/env tsx
/**
 * Verify every `SpeakableSpecification` in the codebase points at a real,
 * rendered element — not just a generic tag fallback.
 *
 * WHY THIS EXISTS (AEO regression guard)
 * --------------------------------------
 * The answer-first / speakable pattern is a load-bearing AEO surface: voice
 * assistants and answer engines read the elements named by a page's
 * `SpeakableSpecification.cssSelector` as the extractable summary of the page.
 * Across this site that contract is implemented with *semantic class*
 * selectors — `.tagline`, `.signal-summary`, `.verdict-block`,
 * `[aria-label='Key takeaway']`, `[data-speakable]`, … — each of which must
 * resolve to an element actually rendered by the template (or a component it
 * composes).
 *
 * The failure mode this guards against is SILENT: if someone renames a
 * className in the JSX (`.signal-summary` → `.entity-summary`) but forgets to
 * update the matching `cssSelector`, the JSON-LD STILL VALIDATES — it just
 * degrades to matching only the generic `h1` tag. The page keeps ranking, the
 * schema keeps passing Rich Results, but the speakable answer silently
 * collapses to the bare page title. Nothing in the build catches it today;
 * the 2026-05-29 audit verified all 14 dynamic families by hand. This script
 * codifies that manual pass so it can never regress unnoticed.
 *
 * WHAT IT CHECKS
 * --------------
 *  - Collects every "rendered token" across `app/` + `components/`:
 *      • className words      (className="tagline ...", `className={`...`}`)
 *      • aria-label values    (aria-label="Key takeaway")
 *      • data-* attributes    (data-speakable, data-agent-summary)
 *  - For each `SpeakableSpecification`, parses its `cssSelector` array and
 *    classifies each token:
 *      • GENERIC  — bare tag selectors (h1, h2, p, article, …). These are a
 *        fine *fallback* but do NOT count as a real extractable target.
 *      • SPECIFIC — `.class`, `[data-x]`, `[aria-label='…']`. These are the
 *        signal-bearing targets and MUST resolve to a rendered token.
 *  - FAILS the build when a SpeakableSpecification has SPECIFIC selectors of
 *    which NONE resolve (→ it would degrade to tag/h1-only).
 *  - WARNS (non-fatal) when SOME specific selectors resolve but others are
 *    dangling (a likely typo worth fixing) — and when a spec ships with no
 *    specific selectors at all (tag-only by construction).
 *
 * Run as part of `postbuild` alongside the pSEO uniqueness/coverage audits.
 * Exits non-zero with a precise list of offending files + selectors.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const SCAN_DIRS = [join(PROJECT_ROOT, "app"), join(PROJECT_ROOT, "components")];

async function* walk(dir: string): AsyncGenerator<string> {
  let entries;
  try {
    entries = await readdir(dir, { withFileTypes: true });
  } catch {
    return;
  }
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name.startsWith("_") || entry.name === "node_modules") continue;
      yield* walk(full);
    } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      yield full;
    }
  }
}

// --- Token collection -------------------------------------------------------

const classTokens = new Set<string>();
const ariaLabelValues = new Set<string>();
const dataAttrs = new Set<string>();

// Remove `cssSelector: [...]` / `cssSelector: "..."` regions from a source
// string before harvesting rendered tokens. CRITICAL: without this, a
// selector definition seeds its OWN target into the token corpus
// (`[aria-label='Verdict']` would register an aria-label value "Verdict"),
// so every selector trivially "resolves to itself" and the guard can never
// detect a dangling selector that exists only in the spec and nowhere in JSX.
function stripSelectorRegions(src: string): string {
  let out = "";
  let i = 0;
  const re = /cssSelector\s*:\s*/g;
  for (let m; (m = re.exec(src)); ) {
    out += src.slice(i, m.index);
    let j = m.index + m[0].length;
    const ch = src[j];
    if (ch === "[") {
      let depth = 0;
      for (; j < src.length; j++) {
        if (src[j] === "[") depth++;
        else if (src[j] === "]") {
          depth--;
          if (depth === 0) {
            j++;
            break;
          }
        }
      }
    } else if (ch === '"' || ch === "'") {
      const q = ch;
      j++;
      for (; j < src.length; j++) {
        if (src[j] === "\\") j++;
        else if (src[j] === q) {
          j++;
          break;
        }
      }
    }
    i = j;
    re.lastIndex = j;
  }
  out += src.slice(i);
  return out;
}

function collectTokens(rawSrc: string) {
  const src = stripSelectorRegions(rawSrc);
  // className="..."  /  className='...'  /  className={`...`}
  const classRe =
    /className=(?:"([^"]*)"|'([^']*)'|\{`([^`]*)`\}|\{"([^"]*)"\}|\{'([^']*)'\})/g;
  for (let m; (m = classRe.exec(src)); ) {
    const raw = m[1] ?? m[2] ?? m[3] ?? m[4] ?? m[5] ?? "";
    // Strip template-literal `${...}` interpolations before splitting.
    for (const w of raw.replace(/\$\{[^}]*\}/g, " ").split(/\s+/)) {
      if (w) classTokens.add(w);
    }
  }
  // aria-label="..." / aria-label='...'
  const ariaRe = /aria-label=(?:"([^"]*)"|'([^']*)')/g;
  for (let m; (m = ariaRe.exec(src)); ) {
    const v = (m[1] ?? m[2] ?? "").trim();
    if (v) ariaLabelValues.add(v);
  }
  // data-foo  (attribute name only)
  const dataRe = /\bdata-[a-z][a-z0-9-]*/g;
  for (let m; (m = dataRe.exec(src)); ) dataAttrs.add(m[0]);
}

// --- Speakable extraction ---------------------------------------------------

interface SpeakableHit {
  file: string;
  selectors: string[];
}

// Extract the array literal that follows `cssSelector:` starting at `from`,
// tracking bracket depth so attribute selectors containing `]`
// (e.g. "[aria-label='Verdict']") don't prematurely close the array.
function readBalancedArray(src: string, from: number): string | null {
  const open = src.indexOf("[", from);
  if (open === -1) return null;
  let depth = 0;
  for (let i = open; i < src.length; i++) {
    const ch = src[i];
    if (ch === "[") depth++;
    else if (ch === "]") {
      depth--;
      if (depth === 0) return src.slice(open + 1, i);
    }
  }
  return null;
}

function extractSpeakable(file: string, src: string): SpeakableHit[] {
  const hits: SpeakableHit[] = [];
  // Find each SpeakableSpecification, then the nearest following cssSelector
  // value. cssSelector may be a single string or an array.
  const specRe = /SpeakableSpecification/g;
  for (let m; (m = specRe.exec(src)); ) {
    const window = src.slice(m.index, m.index + 600);
    const cssIdx = window.search(/cssSelector\s*:/);
    let selectors: string[] = [];
    if (cssIdx !== -1) {
      const after = window.slice(cssIdx);
      // Array form: cssSelector: [ ... ]  (bracket-balanced)
      if (/cssSelector\s*:\s*\[/.test(after)) {
        const inner = readBalancedArray(after, 0);
        if (inner) {
          // Match each top-level string literal. A double-quoted entry may
          // legitimately contain single quotes (e.g. "[aria-label='X']") and
          // vice-versa, so consume whole quoted spans.
          selectors = [...inner.matchAll(/"((?:[^"\\]|\\.)*)"|'((?:[^'\\]|\\.)*)'/g)]
            .map((s) => s[1] ?? s[2] ?? "")
            // Drop nested inner-quote captures: a token like [aria-label='X']
            // is one double-quoted entry; the inner 'X' would also match, so
            // keep only entries that look like full selectors (start with a
            // tag char, '.', '[', '#', '*', or ':').
            .filter((s) => /^[a-zA-Z.[#*:]/.test(s));
        }
      } else {
        // Single string form: cssSelector: "..."
        const strMatch = after.match(/cssSelector\s*:\s*(?:"([^"]*)"|'([^']*)')/);
        if (strMatch) selectors = [strMatch[1] ?? strMatch[2] ?? ""];
      }
    }
    selectors = selectors.map((s) => s.trim()).filter(Boolean);
    if (selectors.length) hits.push({ file, selectors });
  }
  return hits;
}

type Resolution = "generic" | "resolved" | "dangling";

function classifySelector(sel: string): { kind: Resolution; reason: string } {
  // Generic bare-tag selector (no class/attribute) — fallback only.
  if (/^[a-z][a-z0-9]*$/.test(sel)) {
    return { kind: "generic", reason: "bare tag" };
  }
  // .class  (possibly compound like ".a .b" — check the last class token)
  const classMatches = [...sel.matchAll(/\.([A-Za-z0-9_-]+)/g)].map((m) => m[1]);
  if (classMatches.length) {
    const ok = classMatches.every((c) => classTokens.has(c));
    return ok
      ? { kind: "resolved", reason: `class .${classMatches.join(" .")}` }
      : {
          kind: "dangling",
          reason: `class not rendered: ${classMatches
            .filter((c) => !classTokens.has(c))
            .map((c) => "." + c)
            .join(", ")}`,
        };
  }
  // [aria-label='X']
  const aria = sel.match(/\[aria-label=(?:'([^']*)'|"([^"]*)")\]/);
  if (aria) {
    const v = aria[1] ?? aria[2] ?? "";
    return ariaLabelValues.has(v)
      ? { kind: "resolved", reason: `aria-label '${v}'` }
      : { kind: "dangling", reason: `aria-label not rendered: '${v}'` };
  }
  // [data-foo] or [data-foo='bar']
  const data = sel.match(/\[(data-[a-z0-9-]+)/);
  if (data) {
    return dataAttrs.has(data[1])
      ? { kind: "resolved", reason: `attr ${data[1]}` }
      : { kind: "dangling", reason: `attr not rendered: ${data[1]}` };
  }
  // Other attribute / pseudo selectors: treat as generic (can't verify).
  return { kind: "generic", reason: "unverifiable selector" };
}

async function main() {
  // Pass 1: collect rendered tokens across the whole UI surface.
  const speakableHits: SpeakableHit[] = [];
  for (const dir of SCAN_DIRS) {
    for await (const file of walk(dir)) {
      const src = await readFile(file, "utf8");
      collectTokens(src);
      if (src.includes("SpeakableSpecification")) {
        speakableHits.push(...extractSpeakable(file, src));
      }
    }
  }

  const failures: { file: string; selectors: string[]; detail: string }[] = [];
  const warnings: { file: string; detail: string }[] = [];
  const tagOnly: string[] = [];
  let resolvedSpecs = 0;

  for (const hit of speakableHits) {
    const classified = hit.selectors.map((s) => ({
      sel: s,
      ...classifySelector(s),
    }));
    const specific = classified.filter((c) => c.kind !== "generic");
    const resolved = specific.filter((c) => c.kind === "resolved");
    const dangling = specific.filter((c) => c.kind === "dangling");
    const rel = relative(PROJECT_ROOT, hit.file);

    if (specific.length === 0) {
      // Tag-only specs (h1/h2…) are legitimate on static/index/tool pages that
      // have no single extractable answer paragraph. Track for a summary line
      // rather than spamming a warning per page.
      tagOnly.push(rel);
      continue;
    }
    if (resolved.length === 0) {
      failures.push({
        file: rel,
        selectors: hit.selectors,
        detail: dangling.map((d) => `${d.sel} → ${d.reason}`).join("; "),
      });
      continue;
    }
    resolvedSpecs++;
    if (dangling.length > 0) {
      warnings.push({
        file: rel,
        detail: `dangling selector(s) (spec still resolves via ${resolved
          .map((r) => r.sel)
          .join(", ")}): ${dangling.map((d) => `${d.sel} → ${d.reason}`).join("; ")}`,
      });
    }
  }

  console.log(
    `[verify-speakable] scanned ${speakableHits.length} SpeakableSpecification block(s); ` +
      `${resolvedSpecs} resolve to a rendered extractable target.`,
  );
  console.log(
    `[verify-speakable] token corpus: ${classTokens.size} class tokens, ` +
      `${ariaLabelValues.size} aria-label values, ${dataAttrs.size} data-* attrs.`,
  );
  if (tagOnly.length) {
    console.log(
      `[verify-speakable] ${tagOnly.length} tag-only spec(s) (h1/h2 fallback, no extractable target) — fine for static/index/tool pages.`,
    );
  }

  if (warnings.length) {
    console.warn(`\n[verify-speakable] ${warnings.length} warning(s):`);
    for (const w of warnings) console.warn(`  ⚠ ${w.file}: ${w.detail}`);
  }

  if (failures.length) {
    console.error(
      `\n[verify-speakable] FAIL — ${failures.length} SpeakableSpecification block(s) have NO resolvable extractable target (would degrade to tag/h1-only):\n`,
    );
    for (const f of failures) {
      console.error(`  ✗ ${f.file}`);
      console.error(`      cssSelector: [${f.selectors.join(", ")}]`);
      console.error(`      ${f.detail}`);
    }
    console.error(
      `\nFix: ensure at least one of the spec's class/aria/data selectors matches an element actually rendered by the template (or a component it composes).\n`,
    );
    process.exit(1);
  }

  console.log("\n[verify-speakable] OK — every speakable spec resolves. ✅");
}

main().catch((err) => {
  console.error("[verify-speakable] unexpected error", err);
  process.exit(2);
});
