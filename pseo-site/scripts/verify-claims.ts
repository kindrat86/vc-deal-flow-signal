/**
 * verify-claims.ts  - prebuild guard for the canonical stats block
 * (lib/canonical-stats.ts). Failures block BOTH deploy paths: it runs in
 * `prebuild` (pseo-site) and is invoked by scripts/release-landing.sh (apex).
 *
 * Enforces two invariants:
 *  A) Code/content surfaces never hardcode a stale panel count. Known-bad
 *     literal tokens fail the build outright.
 *  B) Static copies (landing HTML, READMEs, manifest) carry a panel number
 *     within ±15% of the live panel count derived from data/startups.json,
 *     and never contain known-bad tokens.
 *
 * Exemptions (do NOT flag):
 *  - Research-sample constants WITH their label: SSRN 12,000+ repos,
 *    219 confirmed rounds, ~75 validated unicorns, Q2-2026 benchmark 269.
 *  - Period-labelled historical prose ("350+ orgs in the Q1 2026 window").
 *  - lib/canonical-stats.ts and this file.
 *  - marketing/, outreach/, tools/, monitoring/ archives (published history).
 */
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { join, relative } from "node:path";
import { ACTIVE_SECTOR_COUNT, CURRENT_PANEL_COUNT } from "../lib/canonical-stats";

const failures: string[] = [];
const read = (p: string): string | null => {
  try {
    return readFileSync(p, "utf8");
  } catch {
    return null;
  }
};
const firstInt = (m: RegExpMatchArray | null): number | null =>
  m ? parseInt(m[1], 10) : null;

// ── A) Stale-panel tokens in code/content surfaces ─────────────────────────
const CODE_ROOTS = ["app", "content", "components", "lib", "scripts"];
const STALE_TOKENS: [RegExp, string][] = [
  [/350\+\+/, "typo token 350++"],
  [/\b4,?800\b/, "unsupported count 4,800 (union of all panels is ~541)"],
  [/thousands of startups/, 'inflated panel claim "thousands of startups"'],
  [/\b140 (?:startups|ranked|venture-backed)/i, "stale dashboard-size claim 140"],
  [/\b60\+ startups\b/i, "stale dashboard-size claim 60+"],
  // "350+" as a panel claim is allowed ONLY as period-labelled history; in
  // current-tense copy it must use PANEL_CLAIM. Narrow pattern: "350+"
  // adjacent to current-tense panel verbs.
  [/(?:tracks?|covers?|monitors?|reads?|watch(?:es|ing)?) [^.]{0,30}350\+/i, "current-tense 350+ panel claim"],
  // bare "369" as a count (excluded: part of longer numbers like 369014916)
  [/(?<![0-9])369(?![0-9])/, "stale count 369"],
];

function walk(dir: string): string[] {
  const out: string[] = [];
  for (const e of readdirSync(dir)) {
    if ([".next", "node_modules", ".vercel", ".turbo"].includes(e)) continue;
    const p = join(dir, e);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else if (/\.(ts|tsx)$/.test(e)) out.push(p);
  }
  return out;
}

// 4,800-URL pSEO long tail (URL count, not org count) appears in guard
// comments; "4,800 organizations" in shipped copy is the banned form.
function isUrlCountContext(matched: string, fileRel: string): boolean {
  if (fileRel === "scripts/verify-no-regressions.ts") return true; // guard needles, not shipped copy
  return /4,?800[- ]URL/.test(matched) || /long tail|sitemap/i.test(matched);
}

for (const root of CODE_ROOTS) {
  const base = join(process.cwd(), root);
  if (!existsSync(base)) continue;
  for (const f of walk(base)) {
    const rel = relative(process.cwd(), f);
    if (rel === "scripts/verify-claims.ts" || rel === "lib/canonical-stats.ts") continue;
    const srcRaw = read(f);
    if (!srcRaw) continue;
    // skip lines where 4,800 is a URL count, not an org count (different metric),
    // and the frozen blog slug "i-tracked-369-…" (a dated URL segment from the
    // Q1/Q2-2026 window, NOT a current panel claim).
    const src = srcRaw
      .split("\n")
      .filter((line) => !/4,?800[- ](URL|url)|long tail|sitemap-llm|i-tracked-369-/.test(line))
      .join("\n");
    for (const [rx, why] of STALE_TOKENS) {
      if (rel === "scripts/verify-no-regressions.ts" && why.startsWith("stale count 369")) continue; // guard needle
      const m = src.match(rx);
      if (m) {
        const line = src.slice(0, m.index ?? 0).split("\n").length;
        failures.push(`${why}\n    file: ${rel}:${line}\n    match: ${m[0].slice(0, 80)}`);
      }
    }
  }
}

// ── B) Static copies: band check + stale-token sweep ───────────────────────
const BAND = 0.15;
// Asymmetric band for "+"-style claims (e.g. "400+ orgs"): underselling the
// live panel is accurate ("400+" with panel 540 is true); overclaiming
// ("4,800+" with panel 540) is false. Only overclaims fail.
const okBand = (n: number) =>
  n <= CURRENT_PANEL_COUNT * (1 + BAND) && n >= CURRENT_PANEL_COUNT * (1 - BAND) * 0.5;

const STATIC_FILES: { file: string; label: string; pattern: RegExp }[] = [
  { file: "../README.md", label: "root README", pattern: /Track (\d+) venture-backed/ },
  { file: "../mcp-server/README.md", label: "MCP README", pattern: /for (\d+) GitHub orgs/ },
  { file: "../mcp-server/openai-app/manifest.json", label: "OpenAI manifest", pattern: /across (\d+) startup GitHub orgs/ },
  { file: "../landing/about.html", label: "landing about", pattern: /GitHub activity (?:across|of) (\d+) startups/ },
  { file: "../landing/de/about/index.html", label: "landing de/about", pattern: /GitHub-Aktivit(?:ä|a)t von (\d+) Startups/ },
  { file: "../landing/es/about/index.html", label: "landing es/about", pattern: /GitHub de (\d+) startups/ },
  { file: "../chrome-extension/PUBLISH.md", label: "chrome PUBLISH.md", pattern: /across (\d+) startups in 15 sectors/ },
];

for (const spec of STATIC_FILES) {
  const src = read(join(process.cwd(), spec.file));
  if (src === null) continue; // surface absent on this lineage  - not our gate
  const n = firstInt(src.match(spec.pattern));
  if (n !== null && !okBand(n)) {
    failures.push(
      `${spec.label} claims ${n} orgs  - outside ±15% of live panel (${CURRENT_PANEL_COUNT}). Use the canonical wording from lib/canonical-stats.ts (see CLAIMS-LEDGER.md).`,
    );
  }
  // stale tokens in static copies too
  for (const [rx, why] of [
    [/350\+\+/, "typo token 350++"],
    [/(?<![0-9])369(?![0-9])/, "stale count 369"],
    [/thousands of startups/, 'inflated claim "thousands of startups"'],
  ] as [RegExp, string][]) {
    if (rx.test(src)) failures.push(`${why}\n    file: ${spec.file}`);
  }
}

if (failures.length) {
  console.error(
    `\n✖ verify-claims: ${failures.length} claim violation(s).\n` +
      `  Canonical block: lib/canonical-stats.ts (panel=${CURRENT_PANEL_COUNT}, sectors=${ACTIVE_SECTOR_COUNT}).\n` +
      `  Fix the surface, or if the claim is a labelled research constant, add it to RESEARCH.\n`,
  );
  for (const f of failures) console.error(`  ✖ ${f}\n`);
  process.exit(1);
}
console.log(
  `✓ verify-claims: all panel claims consistent (panel=${CURRENT_PANEL_COUNT}, sectors=${ACTIVE_SECTOR_COUNT})`,
);
