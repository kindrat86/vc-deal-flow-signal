import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const insider = readFileSync(resolve(import.meta.dirname, "../insider.html"), "utf8");

test("a closed Insider offer is noindex until it has substantive, current enrollment content", () => {
  assert.match(insider, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(insider, /Insider enrollment is not open/);
});
