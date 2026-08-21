import assert from "node:assert/strict";
import { buildReleaseSurfaceReport } from "../verify-release-integrity.mjs";

const report = buildReleaseSurfaceReport({
  npmVersion: "2.2.2",
  npmLockVersion: "2.2.2",
  initializeVersion: "2.2.2",
  manifestVersion: "2.2.2",
  serverCardVersion: "2.2.2",
  registryVersion: "2.2.2",
  stdioVersion: "2.2.2",
  registryDescription: "GitHub engineering acceleration signals across 15 sectors.",
});
assert.equal(report.ok, true);
assert.deepEqual(report.errors, []);

const drift = buildReleaseSurfaceReport({
  npmVersion: "2.2.2",
  npmLockVersion: "2.2.1",
  initializeVersion: "1.6.0",
  manifestVersion: "1.5.4",
  serverCardVersion: "1.5.0",
  registryVersion: "1.5.0",
  stdioVersion: "2.2.0",
  registryDescription: "Startup signals across " + "20 sectors.",
});
assert.equal(drift.ok, false);
assert.equal(drift.errors.length, 7);
assert.match(drift.errors.join("\n"), /must state 15 sectors/);
console.log("release-integrity unit test passed");
