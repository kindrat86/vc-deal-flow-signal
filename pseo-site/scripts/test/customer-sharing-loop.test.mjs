import test from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const componentPath = resolve(root, "components/TrackedScoutShareActions.tsx");
const pagePath = resolve(root, "app/dashboard/scout/page.tsx");
const packagePath = resolve(root, "package.json");

test("scout dashboard exposes an attributed, tracked customer-sharing loop", () => {
  assert.ok(existsSync(componentPath), "tracked share-actions component must exist");
  const component = readFileSync(componentPath, "utf8");
  const page = readFileSync(pagePath, "utf8");
  const packageJson = readFileSync(packagePath, "utf8");

  assert.match(component, /customer_share_clicked/);
  assert.match(component, /surface:\s*"dashboard_scout"/);
  assert.match(component, /channel/);
  assert.match(component, /navigator\.clipboard\.writeText\(shareUrl\)/);
  assert.match(page, /makeShareIntents\(\{/);
  assert.match(page, /sharer:\s*scoutHandle/);
  assert.match(page, /kind:\s*"scout"/);
  assert.match(page, /<TrackedScoutShareActions/);
  assert.match(packageJson, /customer-sharing-loop\.test\.mjs/);
});
