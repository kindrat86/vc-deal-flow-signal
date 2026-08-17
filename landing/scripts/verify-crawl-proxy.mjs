#!/usr/bin/env node
/**
 * Prebuild guard: the apex AI-discovery bot_crawl proxy must be present.
 *
 * The apex (gitdealflow.com) is a static Vercel project that only logs crawler
 * traffic through api/crawl-proxy.js (the AI discovery files are rewritten to
 * it, see vercel.json). A static tree that loses the function, its .src source
 * files, or the rewrites silently reopens the apex crawl-stats blind spot: no
 * error, no 500, just zero AI-crawler visibility on the weekly board and digest.
 *
 * Fail the build so a tree that lacks it cannot deploy.
 */
import { readFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

function fail(msg) {
  console.error(`[verify-crawl-proxy] ${msg}`);
  process.exit(1);
}

const fnPath = join(root, "api", "crawl-proxy.js");
if (!existsSync(fnPath)) {
  fail("api/crawl-proxy.js missing — apex AI-crawler logging is dead");
}
const fn = readFileSync(fnPath, "utf8");
if (!fn.includes("bot_crawl")) {
  fail("api/crawl-proxy.js does not emit bot_crawl — apex crawl-stats blind spot reintroduced");
}
if (!fn.includes("eu.i.posthog.com/capture")) {
  fail("api/crawl-proxy.js missing the PostHog EU capture endpoint (project 143861)");
}
if (!fn.includes("readFileSync")) {
  fail("api/crawl-proxy.js does not serve the discovery files (readFileSync missing)");
}
for (const src of ["llms.src.txt", "llms-full.src.txt", "ai.src.txt", "agents.src.txt"]) {
  if (!existsSync(join(root, src))) {
    fail(`${src} missing — the crawl-proxy source file is gone`);
  }
}

let cfg;
try {
  cfg = JSON.parse(readFileSync(join(root, "vercel.json"), "utf8"));
} catch {
  fail("vercel.json is not valid JSON");
}
const rewrites = JSON.stringify(cfg.rewrites || []);
for (const pub of ["/llms.txt", "/llms-full.txt", "/ai.txt", "/agents.txt"]) {
  if (!rewrites.includes(pub)) {
    fail(`vercel.json rewrites do not route ${pub} to /api/crawl-proxy`);
  }
}

console.log(
  "[verify-crawl-proxy] apex AI-discovery bot_crawl proxy present and correct",
);
