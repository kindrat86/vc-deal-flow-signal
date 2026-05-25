/**
 * Idempotently seed the dream_customers PocketBase collection from the
 * static TS list in lib/dream-customers-seed.ts.
 *
 * Usage:
 *   cd pseo-site
 *   POCKETBASE_URL=... POCKETBASE_ADMIN_EMAIL=... POCKETBASE_ADMIN_PASSWORD=... \
 *     npx tsx scripts/seed-dream-customers.ts
 *
 * Re-runs are safe: rows are upserted by `handle`. Live state fields
 * (stage / comment_count / notes / last_engaged_at) are never overwritten.
 */

import { DREAM_CUSTOMERS_SEED } from "../lib/dream-customers-seed";
import { upsertByHandle } from "../lib/dream-customers";

async function main() {
  let created = 0;
  let updated = 0;
  const failures: { handle: string; error: string }[] = [];

  console.log(`Seeding ${DREAM_CUSTOMERS_SEED.length} dream customers…`);

  for (const row of DREAM_CUSTOMERS_SEED) {
    try {
      const res = await upsertByHandle({
        name: row.name,
        handle: row.handle,
        firm: row.firm,
        role: row.role,
        url: `https://x.com/${row.handle}`,
        segment: row.segment,
        confidence: row.confidence,
      });
      if (res.created) {
        created += 1;
        process.stdout.write(".");
      } else {
        updated += 1;
        process.stdout.write("·");
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      failures.push({ handle: row.handle, error: msg });
      process.stdout.write("x");
    }
  }

  process.stdout.write("\n");
  console.log(`Created: ${created}`);
  console.log(`Updated: ${updated}`);
  console.log(`Failed:  ${failures.length}`);
  if (failures.length > 0) {
    for (const f of failures) {
      console.error(`  ${f.handle}: ${f.error}`);
    }
    process.exit(1);
  }

  const bySegment = DREAM_CUSTOMERS_SEED.reduce<Record<string, number>>(
    (acc, r) => {
      acc[r.segment] = (acc[r.segment] ?? 0) + 1;
      return acc;
    },
    {},
  );
  console.log("Segment counts:", bySegment);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
