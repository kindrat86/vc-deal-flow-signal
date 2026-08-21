#!/usr/bin/env node
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const source = readFileSync("components/PixelManager.tsx", "utf8");
const loader = source.match(/id="gtag-loader"[\s\S]{0,500}?strategy="([^"]+)"/);
const init = source.match(/id="gtag-init"[\s\S]{0,500}?strategy="([^"]+)"/);

assert.equal(loader?.[1], "lazyOnload", "gtag-loader must stay outside the LCP window");
assert.equal(init?.[1], "afterInteractive", "gtag-init must configure GA4 before qualified_visit is captured");
console.log("[verify-pixel-gtag-order] PASS");
