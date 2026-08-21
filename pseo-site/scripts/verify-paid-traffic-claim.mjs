#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("components/PaidTrafficBanner.tsx", "utf8");
assert.doesNotMatch(source, /219-startup panel/i, "219 is the observation count, not the startup panel size");
assert.match(source, /219 startup-period observations/i, "paid traffic copy must name the SSRN observation count accurately");
console.log("[verify-paid-traffic-claim] PASS");
