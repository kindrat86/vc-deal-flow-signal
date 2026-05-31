#!/usr/bin/env tsx
/**
 * Verify every Next.js `page.tsx` exports either `metadata` or
 * `generateMetadata`. Closes audit-2026-05-08 gap "No central metadata()
 * enforcement helper" — companion to `lib/metadata.ts`.
 *
 * The helper makes it easy to define metadata, but a missed export still
 * silently falls back to the layout default (no per-page <title>
 * disambiguation). This script makes that condition fail the build.
 *
 * Run as part of `prebuild`. Exits non-zero with a list of offending pages.
 */
import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";
import { dirname } from "node:path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const APP_DIR = join(PROJECT_ROOT, "app");

// Routes that intentionally rely on the layout-level metadata template (no
// page-specific title) or are not a public HTML page. Keep this list
// minimal and review on every audit.
const ALLOWLIST_PATTERNS = [
  /\/error\.tsx$/,
  /\/loading\.tsx$/,
  /\/not-found\.tsx$/,
  /\/global-error\.tsx$/,
  /\/template\.tsx$/,
  /\/layout\.tsx$/,
  /\/route\.ts$/,
  /\/route\.tsx$/,
  // Programmatic image responses don't have a <head>.
  /\/opengraph-image\.tsx$/,
  /\/twitter-image\.tsx$/,
  /\/icon\.tsx$/,
  /\/apple-icon\.tsx$/,
  // Sitemap and robots.ts emit XML/text — not HTML pages.
  /\/sitemap\.ts$/,
  /\/sitemap\.tsx$/,
  /\/robots\.ts$/,
];

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
      // Skip Next.js internals (none expected in app/, but defensive).
      if (entry.name.startsWith("_") || entry.name === "node_modules") continue;
      yield* walk(full);
    } else if (entry.isFile() && /^page\.(tsx|ts|jsx|js)$/.test(entry.name)) {
      yield full;
    }
  }
}

const METADATA_REGEX = [
  // Static export: `export const metadata = ...` or `export const metadata: Metadata = ...`
  /export\s+const\s+metadata\s*[:=]/m,
  // Dynamic export (sync or async): `export function generateMetadata` /
  // `export async function generateMetadata`.
  /export\s+(?:async\s+)?function\s+generateMetadata\b/m,
  // Re-export form: `export { metadata }` or `export { generateMetadata }`.
  /export\s*\{[^}]*\b(?:metadata|generateMetadata)\b[^}]*\}/m,
];

async function pageHasMetadata(filePath: string): Promise<boolean> {
  const src = await readFile(filePath, "utf8");
  return METADATA_REGEX.some((re) => re.test(src));
}

async function main() {
  const offenders: string[] = [];
  let scanned = 0;
  for await (const filePath of walk(APP_DIR)) {
    if (ALLOWLIST_PATTERNS.some((p) => p.test(filePath))) continue;
    scanned++;
    if (!(await pageHasMetadata(filePath))) {
      offenders.push(relative(PROJECT_ROOT, filePath));
    }
  }

  if (offenders.length > 0) {
    console.error(
      `\n[verify-metadata] ${offenders.length} of ${scanned} page(s) are missing both \`metadata\` and \`generateMetadata\` exports:\n`,
    );
    for (const f of offenders) console.error(`  - ${f}`);
    console.error(
      `\nFix: import \`defineMetadata\` from \`@/lib/metadata\` and add\n  export const metadata = defineMetadata({ title, description, path });\nor a \`generateMetadata\` async function.\n`,
    );
    process.exit(1);
  }

  console.log(
    `[verify-metadata] OK — ${scanned} page(s) scanned, all export metadata.`,
  );
}

main().catch((err) => {
  console.error("[verify-metadata] unexpected error", err);
  process.exit(2);
});
