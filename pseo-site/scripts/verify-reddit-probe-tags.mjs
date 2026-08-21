#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("lib/paid-acquisition.ts", "utf8");
const redditBlock = source.slice(source.indexOf('slug: "vc"'), source.indexOf('// ────────────────────────────────────── GOOGLE SEARCH'));
const tags = redditBlock.match(/campaign: "([^"]+)"/g) ?? [];
assert.equal(tags.length, 6, "Reddit probe must contain six campaign tags");
assert.ok(tags.every((tag) => tag === 'campaign: "reddit-probe-2026-08"'), "all six inactive Reddit probe routes must use the same August attribution cohort");
assert.doesNotMatch(redditBlock, /(?:vc|dev)-2026-05/, "stale May Reddit attribution tags must not return");
console.log("[verify-reddit-probe-tags] PASS");
