#!/usr/bin/env node
/**
 * F40 — automated a11y CI (closes audit-2026-05-08 gap "no automated
 * axe-core CI; regressions will surface only via visual review").
 *
 * Wraps `pa11y-ci` (Puppeteer + axe-core under the hood) and runs against
 * a curated list of representative URLs covering every major route family.
 * Fails on any WCAG 2.1 AA violation (unless A11Y_AUDIT_REPORT_ONLY=true).
 *
 * Substitutes ${BASE_URL} (defaults to https://signals.gitdealflow.com)
 * so the same script works against:
 *   - production (default; daily scheduled GH Actions run)
 *   - a Vercel preview URL (BASE_URL=https://my-preview-xyz.vercel.app)
 *   - a local dev server (BASE_URL=http://localhost:3000)
 *
 * Writes the full JSON report to data/a11y/report.json so CI can surface
 * it as an artifact.
 */
import { spawnSync } from "node:child_process";
import {
  mkdirSync,
  writeFileSync,
  readFileSync,
  existsSync,
  openSync,
  closeSync,
} from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, "..");
const REPORT_DIR = join(PROJECT_ROOT, "data", "a11y");
const REPORT_PATH = join(REPORT_DIR, "report.json");
const TEMP_CONFIG = join(REPORT_DIR, ".pa11yci.runtime.json");
const BASE_TEMPLATE = join(PROJECT_ROOT, ".pa11yci.json");

const BASE_URL = (process.env.BASE_URL ?? "https://signals.gitdealflow.com")
  .replace(/\/$/, "");
// When `A11Y_AUDIT_REPORT_ONLY=true`, the script always exits 0 even if
// pa11y-ci surfaced WCAG-AA violations. Mirrors the
// `PSEO_AUDIT_REPORT_ONLY` pattern in audit-pseo-uniqueness.ts and lets us
// land the gate before clearing the existing backlog. Flip to false in
// the workflow once errors=0 on a clean prod run.
const REPORT_ONLY =
  /^(true|1|yes)$/i.test(process.env.A11Y_AUDIT_REPORT_ONLY ?? "");

/**
 * Curated URL paths covering every major route family + every Schema.org
 * entity type so a layout regression in any route family surfaces here.
 *
 * Add to this list when shipping a new route family. Removing entries
 * masks regressions — only remove if the entire family is decommissioned.
 *
 * Dynamic-route slugs are pinned to canonical examples that should remain
 * stable. If a slug is removed, swap to another example in the same family.
 */
const PATHS = [
  // Core surfaces
  "/",
  "/methodology",
  "/pricing",
  "/about",
  "/faq",
  "/glossary",
  "/research",
  "/changelog",
  "/citation-guide",
  // Predicted / weekly cadence (Periodical schema)
  "/predicted",
  // Q&A (FAQPage + Speakable)
  "/answers",
  "/answers/what-is-a-github-scout-score",
  // Content surfaces
  "/blog",
  // pSEO families — one canonical example per family
  "/vs",
  "/alternatives",
  "/use-cases",
  // Agent surfaces
  "/agents",
  "/developers",
  // Funnel surfaces (visual-heavy, contrast-prone)
  "/firstlook",
  "/walkthrough",
];

function buildRuntimeConfig() {
  const template = JSON.parse(readFileSync(BASE_TEMPLATE, "utf8"));
  const config = {
    ...template,
    urls: PATHS.map((p) => `${BASE_URL}${p}`),
  };
  mkdirSync(REPORT_DIR, { recursive: true });
  writeFileSync(TEMP_CONFIG, JSON.stringify(config, null, 2));
  return TEMP_CONFIG;
}

function findPa11yCi() {
  const local = join(PROJECT_ROOT, "node_modules", ".bin", "pa11y-ci");
  if (existsSync(local)) return local;
  // Fall back to npx — ensures the script also works when invoked from a
  // checkout without a local install (e.g. one-off ad-hoc audit).
  return null;
}

function runPa11yCi(configPath) {
  const local = findPa11yCi();
  const cmd = local ?? "npx";
  const args = local
    ? ["--config", configPath, "--json"]
    : ["--yes", "pa11y-ci@^4", "--config", configPath, "--json"];
  // Stream pa11y-ci stdout DIRECTLY to disk via a file descriptor — sidesteps
  // Node's child-process buffer limit (which silently truncates pa11y's
  // multi-MB JSON output to ~64 KB regardless of the configured maxBuffer
  // when stdio: "pipe" is used). The summarizer then re-reads from disk.
  mkdirSync(REPORT_DIR, { recursive: true });
  const fd = openSync(REPORT_PATH, "w");
  try {
    const result = spawnSync(cmd, args, {
      cwd: PROJECT_ROOT,
      stdio: ["ignore", fd, "inherit"],
    });
    return result.status ?? 1;
  } finally {
    closeSync(fd);
  }
}

function summarize() {
  if (!existsSync(REPORT_PATH)) return { errors: 0, urls: 0, perUrl: [] };
  let report;
  try {
    report = JSON.parse(readFileSync(REPORT_PATH, "utf8"));
  } catch {
    return { errors: 0, urls: 0, perUrl: [], parseError: true };
  }
  // pa11y-ci v4 shape: { total: N, passes: N, errors: N, results: { url: [issues...] } }
  const results = report.results ?? {};
  const perUrl = Object.entries(results).map(([url, issues]) => {
    const list = Array.isArray(issues) ? issues : [];
    return {
      url,
      errorCount: list.filter((i) => i.type === "error").length,
      warningCount: list.filter((i) => i.type === "warning").length,
      noticeCount: list.filter((i) => i.type === "notice").length,
    };
  });
  return {
    errors: report.errors ?? perUrl.reduce((s, u) => s + u.errorCount, 0),
    urls: report.total ?? perUrl.length,
    passes: report.passes ?? perUrl.filter((u) => u.errorCount === 0).length,
    perUrl,
  };
}

function writeGithubSummary(summary) {
  // GitHub Actions: write a markdown summary table when run inside CI.
  const path = process.env.GITHUB_STEP_SUMMARY;
  if (!path) return;
  const lines = [
    `## A11y Audit — pa11y-ci + axe-core`,
    "",
    `**BASE_URL**: \`${BASE_URL}\`  `,
    `**URLs audited**: ${summary.urls}  `,
    `**Total errors**: ${summary.errors}  `,
    `**Mode**: ${REPORT_ONLY ? "report-only (workflow always passes)" : "gating (workflow fails on errors)"}`,
    "",
    "| URL | errors | warnings | notices |",
    "| --- | ---: | ---: | ---: |",
    ...[...summary.perUrl]
      .sort((a, b) => b.errorCount - a.errorCount)
      .map((u) => {
        const path = u.url.replace(BASE_URL, "") || "/";
        const tag = u.errorCount > 0 ? "✗" : "✓";
        return `| ${tag} \`${path}\` | ${u.errorCount} | ${u.warningCount} | ${u.noticeCount} |`;
      }),
    "",
    "Full report uploaded as workflow artifact `a11y-report-<run-id>`.",
  ].join("\n");
  try {
    writeFileSync(path, lines + "\n", { flag: "a" });
  } catch {
    // Don't fail the audit if the summary write fails.
  }
}

function main() {
  console.log(`[a11y-audit] BASE_URL=${BASE_URL}`);
  console.log(`[a11y-audit] auditing ${PATHS.length} URLs...`);
  if (REPORT_ONLY) {
    console.log("[a11y-audit] A11Y_AUDIT_REPORT_ONLY=true — will exit 0 regardless of findings");
  }
  const configPath = buildRuntimeConfig();
  const exitCode = runPa11yCi(configPath);
  const summary = summarize();
  console.log("");
  console.log(
    `[a11y-audit] result — errors=${summary.errors} across ${summary.urls} url(s)`,
  );
  if (summary.perUrl.length > 0) {
    const sorted = [...summary.perUrl].sort(
      (a, b) => b.errorCount - a.errorCount,
    );
    for (const r of sorted.slice(0, 25)) {
      const tag = r.errorCount > 0 ? "✗" : "✓";
      console.log(
        `  ${tag} ${r.url}  errors=${r.errorCount} warnings=${r.warningCount} notices=${r.noticeCount}`,
      );
    }
  }
  console.log(`[a11y-audit] full report at ${REPORT_PATH}`);
  writeGithubSummary(summary);

  // pa11y-ci returns:
  //   0 — all URLs pass
  //   1 — at least one URL has errors at or above the configured `level`
  //   2 — config error / startup error
  // In REPORT_ONLY mode we surface the count to logs / GitHub summary but
  // exit 0 so the workflow doesn't gate. Otherwise we propagate the
  // pa11y-ci exit code so CI fails on errors.
  if (REPORT_ONLY) {
    process.exit(0);
  }
  process.exit(exitCode);
}

try {
  main();
} catch (err) {
  console.error("[a11y-audit] unexpected error", err);
  process.exit(2);
}
