import assert from "node:assert/strict";
import fs from "node:fs";
const source = fs.readFileSync(new URL("../../lib/stripe.ts", import.meta.url), "utf8");
assert.match(source, /49000:\s*"dashboard"/);
assert.match(source, /997:\s*"dashboard"/);
assert.match(source, /4900:\s*"dashboard"/);
console.log("annual and grandfathered Dashboard amounts reconcile to the Dashboard tier");
