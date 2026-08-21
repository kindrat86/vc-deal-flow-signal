#!/usr/bin/env node
/**
 * Regression guard: report copy must use the active 15-sector panel and must
 * not turn public engineering activity into a financing-timing claim.
 */
import { readFileSync, writeFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const output = resolve(root, "content", "signal-report-latest.ts");
const before = readFileSync(output, "utf8");

try {
  execFileSync("npx", ["tsx", "scripts/generate-signal-report.ts"], {
    cwd: root,
    stdio: "inherit",
  });
  const generated = readFileSync(output, "utf8");
  const violations = [];
  if (!generated.includes("15 active sectors")) violations.push("missing 15 active sectors disclosure");
  if (/\b20\s+(?:startup\s+)?sectors\b/i.test(generated)) violations.push("reintroduced a 20-sector claim");
  if (/preced(?:es|ed)\s+(?:an?\s+)?(?:fund|financ)/i.test(generated)) violations.push("reintroduced financing-timing copy");
  if (violations.length) throw new Error(violations.join("; "));
  console.log("verify-signal-report-generator PASS");
} finally {
  writeFileSync(output, before, "utf8");
}
