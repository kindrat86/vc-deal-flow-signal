#!/usr/bin/env node
// Regression test: /sectors hub snippet optimization (2026-08-31).
//
// Why: GSC 28-day window showed /sectors at 432 impressions, avg position
// 5.09, 0 clicks. The snippet targeted a generic "funding signals by
// industry" phrase instead of the query class users actually issue:
// "startup sectors to watch" / "startup sector signals". This test pins the
// re-optimized title, meta description, H1, answer-first lead, social
// mirrors, canonical shape, and JSON-LD validity so a regression to the
// generic framing (or a /sectors vs /sectors/ canonical split) fails loudly.
//
// Convention: standalone node:test policy file (like test-sitemap-policy.mjs),
// NOT wired into scripts/verify-all.mjs, so the Vercel build container does
// not need it (.vercelignore only re-includes verify-* gates).
//
// Usage: node --test scripts/test-sectors-hub-policy.mjs  (from landing/)

import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const landingRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagePath = join(landingRoot, "sectors", "index.html");
const html = readFileSync(pagePath, "utf8");

const CANONICAL = "https://gitdealflow.com/sectors";

function metaContent(name) {
  const m = html.match(
    new RegExp(`<meta[^>]+(?:name|property)=["']${name}["'][^>]*>`, "i"),
  );
  if (!m) return null;
  const c = m[0].match(/content=["']([^"']*)["']/i);
  return c ? c[1] : null;
}

function jsonldBlocks() {
  return [...html.matchAll(
    /<script type="application\/ld\+json">(.*?)<\/script>/gs,
  )].map((m) => m[1]);
}

test("title targets the sectors-to-watch query class, not generic industry framing", () => {
  const t = html.match(/<title>([^<]*)<\/title>/)[1];
  assert.ok(
    t.startsWith("Startup Sectors to Watch"),
    `title must lead with "Startup Sectors to Watch", got: ${t}`,
  );
  assert.match(t, /Funding Signals/i, "title keeps the funding-signals phrase");
  assert.ok(t.length <= 65, `title too long for SERP display: ${t.length}`);
  assert.ok(!/by Industry/i.test(t), "generic 'by Industry' framing retired");
});

test("meta description is answer-first, live-signal framed, and SERP-length", () => {
  const d = metaContent("description");
  assert.ok(d, "meta description present");
  assert.ok(
    /^Which startup sectors/i.test(d),
    `description must open by answering the query, got: ${d.slice(0, 60)}`,
  );
  assert.match(d, /watch/i, "description carries 'watch'");
  assert.match(d, /live/i, "description frames signals as live");
  assert.match(d, /signal/i, "description carries 'signal(s)'");
  assert.match(d, /week/i, "description states the weekly refresh cadence");
  assert.ok(
    d.length >= 120 && d.length <= 165,
    `description length ${d.length} outside 120-165`,
  );
});

test("og and twitter mirrors stay in sync with the new title and description", () => {
  const title = html.match(/<title>([^<]*)<\/title>/)[1];
  assert.equal(metaContent("og:title"), title, "og:title must equal <title>");
  assert.equal(
    metaContent("twitter:title"),
    title,
    "twitter:title must equal <title>",
  );
  assert.equal(
    metaContent("og:description"),
    metaContent("description"),
    "og:description must equal meta description",
  );
  assert.equal(
    metaContent("twitter:description"),
    metaContent("description"),
    "twitter:description must equal meta description",
  );
});

test("H1 targets sectors-to-watch; opening lead answers the query first", () => {
  const h1 = html.match(/<h1>([^<]*)<\/h1>/)[1];
  assert.match(h1, /Startup Sectors to Watch/i, `H1 framing, got: ${h1}`);

  const lead = html.match(/<p class="lead">([\s\S]*?)<\/p>/)[1];
  const text = lead.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  assert.ok(
    text.startsWith("The startup sectors worth watching"),
    `lead must open by answering the query, got: ${text.slice(0, 60)}`,
  );
  // Locked, truthful claims preserved on the hub.
  assert.match(text, /350\+/, "lead keeps the locked 350+ panel claim");
  assert.match(text, /15 sectors/, "lead keeps the locked 15-sector claim");
  assert.match(
    text, /21 to 47 days/,
    "lead keeps the shipped 21-47 day early-signal claim",
  );
  assert.match(
    text, /commit velocity/i,
    "lead names the live signal dimensions",
  );
  assert.match(text, /week/i, "lead states the weekly refresh");
});

test("canonical shape: exactly one canonical, no-slash, matching hreflang alternates", () => {
  const canonicals = [...html.matchAll(/<link rel="canonical" href="([^"]+)"/g)];
  assert.equal(canonicals.length, 1, "exactly one canonical link");
  assert.equal(
    canonicals[0][1], CANONICAL,
    `canonical must be the no-slash apex URL, got ${canonicals[0][1]}`,
  );
  for (const m of html.matchAll(/<link rel="alternate" hreflang="([^"]+)" href="([^"]+)"/g)) {
    assert.equal(
      m[2], CANONICAL,
      `hreflang ${m[1]} must match the canonical URL, got ${m[2]}`,
    );
  }
  assert.ok(!/"https:\/\/gitdealflow\.com\/sectors\/"/.test(html), "no trailing-slash self-references");
});

test("all JSON-LD blocks parse and the ItemList is named for the sectors hub", () => {
  const blocks = jsonldBlocks();
  assert.ok(blocks.length >= 3, "hub keeps its BreadcrumbList/ItemList/Organization schema");
  const parsed = blocks.map((b) => JSON.parse(b));
  const list = parsed.find((o) => o["@type"] === "ItemList");
  assert.ok(list, "ItemList present");
  assert.match(list.name, /Sectors/i, `ItemList name, got: ${list.name}`);
  assert.ok(
    list.itemListElement.length >= 15,
    "sector entries preserved",
  );
});

test("no em/en dashes anywhere on the hub (verify-no-dashes parity for this file)", () => {
  const EM = String.fromCharCode(0x2014);
  const EN = String.fromCharCode(0x2013);
  assert.ok(!html.includes(EM), "em dash found");
  assert.ok(!html.includes(EN), "en dash found");
  assert.ok(!/&[mn]dash;/.test(html), "dash HTML entity found");
});
