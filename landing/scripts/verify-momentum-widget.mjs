#!/usr/bin/env node
import assert from "node:assert/strict";
import { createRequire } from "node:module";
import { existsSync, readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const read = (rel) => readFileSync(join(root, rel), "utf8");
const mustInclude = (source, marker, label) => {
  assert.ok(source.includes(marker), `${label} is missing ${JSON.stringify(marker)}`);
};

const enginePath = join(root, "momentum-engine.js");
assert.ok(existsSync(enginePath), "momentum-engine.js is missing, the standalone tool and widget must share one scoring engine");
const require = createRequire(import.meta.url);
const engine = require(enginePath);

assert.equal(engine.normalizeQuery("https://github.com/vercel/next.js.git"), "vercel/next.js");
assert.equal(Math.round(engine.tractionOf(99999)), 100);
const now = Date.UTC(2026, 7, 20);
assert.equal(engine.recencyOf(new Date(now - 86400000).toISOString(), now), 100);
assert.equal(engine.recencyOf(new Date(now - 10 * 86400000).toISOString(), now), 68);
assert.equal(engine.recencyOf(new Date(now - 200 * 86400000).toISOString(), now), 8);
const commits = engine.analyseCommits([
  ...Array.from({ length: 12 }, () => ({ total: 10 })),
  ...Array.from({ length: 4 }, () => ({ total: 20 })),
]);
assert.equal(commits.mean4, 20);
assert.equal(commits.mean12, 10);
assert.equal(commits.accel, 2);
assert.equal(engine.velocityFromAcceleration(2), 100);
assert.equal(engine.scoreMomentum({ traction: 100, recency: 100, velocity: 100 }), 100);

const tool = read("free/github-momentum-checker.html");
mustInclude(tool, '<script src="/momentum-engine.js"></script>', "standalone checker");
mustInclude(tool, 'rel="alternate" type="application/json+oembed"', "standalone checker");
mustInclude(tool, 'id="copy-embed"', "standalone checker");
mustInclude(tool, 'id="share-result"', "standalone checker");
mustInclude(tool, "momentum_embed_copied", "standalone checker analytics");
mustInclude(tool, "momentum_lead_submitted", "standalone checker analytics");
mustInclude(tool, 'property="og:image"', "standalone checker social card");

const widget = read("embed/tools/startup-momentum-checker.html");
mustInclude(widget, '<meta name="robots" content="noindex, follow">', "embed widget");
mustInclude(widget, '<script src="/momentum-engine.js"></script>', "embed widget");
mustInclude(widget, "https://api.github.com", "embed widget");
mustInclude(widget, "embedded_momentum_check_completed", "embed widget analytics");
mustInclude(widget, "utm_source=embedded_widget", "embed widget attribution link");
assert.ok(!widget.includes("Math.random()"), "embed widget fabricates fallback metrics with Math.random()");

const embedPage = read("embed.html");
mustInclude(embedPage, '<meta name="robots" content="index, follow">', "embed instructions page");
mustInclude(embedPage, 'id="momentum-checker-widget"', "embed instructions page");
mustInclude(embedPage, 'id="copy-momentum-embed"', "embed instructions page");
mustInclude(embedPage, "momentum_embed_copied", "embed instructions analytics");
mustInclude(embedPage, 'loading="lazy"', "embed instructions live preview");
const sitemap = read("sitemap-pages.xml");
mustInclude(sitemap, "<loc>https://gitdealflow.com/embed</loc>", "landing sitemap");
assert.ok(!read("_rebuild_sitemap.py").includes('    "embed.html",'), "sitemap generator still hard-excludes the now-indexable embed instructions hub");

const oembed = JSON.parse(read("oembed/startup-momentum-checker.json"));
assert.equal(oembed.type, "rich");
assert.equal(oembed.provider_name, "GitDealFlow");
assert.match(oembed.html, /startup-momentum-checker/);
assert.match(oembed.html, /GitHub Momentum Checker by GitDealFlow/);

const vercel = JSON.parse(read("vercel.json"));
const headers = vercel.headers || [];
const embedHub = headers.find((entry) => entry.source === "/embed");
const embedWidgets = headers.find((entry) => entry.source === "/embed/(.*)");
const value = (entry, key) => entry?.headers?.find((header) => header.key.toLowerCase() === key.toLowerCase())?.value;
assert.match(value(embedHub, "X-Robots-Tag") || "", /^index, follow/);
assert.equal(value(embedWidgets, "X-Robots-Tag"), "noindex, follow");
assert.equal(value(embedWidgets, "X-Frame-Options"), "ALLOWALL");
assert.match(value(embedWidgets, "Content-Security-Policy") || "", /frame-ancestors \*/);

console.log("[verify-momentum-widget] shared engine, honest widget, viral loop, lead capture, oEmbed, and frame headers verified");
