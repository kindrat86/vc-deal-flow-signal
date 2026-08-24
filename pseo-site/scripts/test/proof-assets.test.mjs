import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "../..");
const dataPath = path.join(root, "content/proof-assets.json");
const pagePath = path.join(root, "app/for/[slug]/page.tsx");
const vercelPath = path.join(root, "vercel.json");

assert.ok(fs.existsSync(dataPath), "proof asset registry must exist");
assert.ok(fs.existsSync(pagePath), "proof asset route must exist");

const assets = JSON.parse(fs.readFileSync(dataPath, "utf8"));
assert.equal(assets.length, 10, "pilot must publish exactly ten proof assets");
assert.equal(new Set(assets.map((asset) => asset.id)).size, 10, "asset IDs must be unique");
assert.ok(assets.every((asset) => /^pa_[a-f0-9]{24}$/.test(asset.id)), "asset IDs must be privacy-safe random tokens");
assert.ok(assets.every((asset) => asset.fund && asset.companies?.length === 2), "every asset needs one fund and two companies");
assert.ok(assets.every((asset) => asset.companies.every((company) => company.portfolioEvidence && company.github && company.observation && company.question)), "each company needs complete proof fields");
assert.ok(assets.every((asset) => !JSON.stringify(asset).includes("@")), "published asset data must not contain email addresses");
assert.ok(assets.every((asset) => !Object.hasOwn(asset, "recipient")), "published asset data must not name recipients");

const page = fs.readFileSync(pagePath, "utf8");
assert.match(page, /dynamicParams\s*=\s*false/, "unknown asset IDs must 404");
assert.match(page, /robots:\s*\{\s*index:\s*false,\s*follow:\s*false/, "asset metadata must be noindex/nofollow");
assert.match(page, /notFound\(\)/, "unknown asset IDs must call notFound");

const vercel = JSON.parse(fs.readFileSync(vercelPath, "utf8"));
const header = vercel.headers.find((entry) => entry.source === "/for/(.*)");
assert.ok(header, "Vercel must emit a dedicated /for noindex header");
assert.ok(header.headers.some((item) => item.key === "X-Robots-Tag" && item.value === "noindex, nofollow, noarchive"), "X-Robots-Tag must block indexing and archival");

console.log("proof-assets unit test passed");
