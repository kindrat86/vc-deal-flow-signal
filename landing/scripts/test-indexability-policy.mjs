import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const insider = readFileSync(resolve(import.meta.dirname, "../insider.html"), "utf8");

// Insider opened at EUR 197/mo on 2026-10-29 (Maryan, t364u). The apex copy stays
// noindex so it does not compete with the canonical signals.gitdealflow.com/insider.
test("the apex Insider page is noindex and presents the open EUR 197/mo offer", () => {
  assert.match(insider, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(insider, /buy\.stripe\.com\/bJeaEWfRpcRG6gm2fC0x20d/);
  assert.doesNotMatch(insider, /not open|enrollment is closed/i);
});
