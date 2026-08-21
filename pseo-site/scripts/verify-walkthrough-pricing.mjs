#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("app/walkthrough/page.tsx", "utf8");
assert.doesNotMatch(source, /€9\.97\/mo/, "expired founding price must not remain in current sales copy");
assert.doesNotMatch(source, /Founding members who joined before June 30, 2026/, "expired founding offer must not remain in current sales copy");
assert.match(source, /€49\/mo/, "walkthrough must keep the current public Dashboard price");
console.log("[verify-walkthrough-pricing] PASS");
