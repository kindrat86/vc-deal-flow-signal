import assert from "node:assert/strict";
import test from "node:test";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");

const sitemap = read("sitemap-pages.xml");
const affiliates = read("affiliates.html");
const jv = read("jv.html");

test("the sitemap excludes closed partner offers but preserves deployed persona routes", () => {
  for (const path of ["/affiliates", "/jv"]) {
    assert.doesNotMatch(sitemap, new RegExp(`https://gitdealflow\\.com${path}`));
  }
  for (const path of ["/for/data-providers", "/for/vc-firms"]) {
    assert.match(sitemap, new RegExp(`https://gitdealflow\\.com${path}`));
  }
  assert.match(affiliates, /<meta name="robots" content="noindex, nofollow">/);
  assert.match(jv, /<meta name="robots" content="noindex, nofollow">/);
});
