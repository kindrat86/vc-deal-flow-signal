#!/usr/bin/env node
/**
 * Data-integrity guard for data/startups.json (GUARDRAIL 5.2).
 *
 * Blocks publication of the GitHub Engineering Velocity Index (backlog order 4)
 * until BOTH assertions pass:
 *
 *   (a) no single `contributors` value occupies >20% of records
 *       — catches the GitHub API `per_page=100` cap (contributors===100 in
 *         ~26% of records because the contributors endpoint was never
 *         paginated);
 *   (b) no record with a NEGATIVE commit-velocity change is labelled as one of
 *       the four acceleration signal types — a decelerating startup must not
 *       be published as an "acceleration" signal.
 *
 * Exit 0 = pass, exit 1 = fail. Run standalone; wire it as the gate for
 * order 4 (the Index) before that page can ship. Intentionally NOT wired into
 * scripts/verify-no-regressions.ts prebuild yet, because the current data still
 * carries the two defects and a hard prebuild gate would brick every deploy.
 */
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const DATA_PATH = join(dirname(fileURLToPath(import.meta.url)), "..", "data", "startups.json");

const ACCELERATION_TYPES = new Set([
  "Engineering hiring burst",
  "Infrastructure buildout",
  "Deploy frequency spike",
  "Framework migration",
]);

const MAX_VALUE_SHARE = 0.2; // >20% of records carrying one value = red flag

function loadRecords() {
  const data = JSON.parse(readFileSync(DATA_PATH, "utf8"));
  const records = [];
  for (const sector of data.sectors ?? []) {
    for (const snap of Object.values(sector.periods ?? {})) {
      for (const s of snap.startups ?? []) {
        records.push({ ...s, _sector: sector.slug });
      }
    }
  }
  return records;
}

function main() {
  const records = loadRecords();
  const total = records.length;
  const failures = [];

  // (a) value-concentration check on `contributors`
  const counts = new Map();
  for (const r of records) counts.set(r.contributors, (counts.get(r.contributors) ?? 0) + 1);
  let worst = { value: null, count: 0 };
  for (const [value, count] of counts) if (count > worst.count) worst = { value, count };
  if (total > 0 && worst.count / total > MAX_VALUE_SHARE) {
    failures.push(
      `contributors===${worst.value} in ${worst.count}/${total} records ` +
        `(${(100 * worst.count / total).toFixed(1)}% > ${MAX_VALUE_SHARE * 100}%) — ` +
        `the GitHub per_page=100 cap was never paginated`,
    );
  }

  // (b) contradiction check: negative velocity must not be an acceleration signal
  let negAccel = 0;
  for (const r of records) {
    if (String(r.commitVelocityChange ?? "").startsWith("-") && ACCELERATION_TYPES.has(r.signalType)) {
      negAccel++;
    }
  }
  if (negAccel > 0) {
    failures.push(
      `${negAccel}/${total} records carry a negative commit-velocity change yet are labelled ` +
        `an acceleration signal type (${[...ACCELERATION_TYPES].join(" / ")})`,
    );
  }

  if (failures.length) {
    console.error(`❌ DATA INTEGRITY FAILED (${total} records)`);
    for (const f of failures) console.error(`  - ${f}`);
    process.exitCode = 1;
  } else {
    console.log(`✅ DATA INTEGRITY PASS (${total} records): no contributor-value >20%, no negative-velocity acceleration label`);
  }
}

main();
