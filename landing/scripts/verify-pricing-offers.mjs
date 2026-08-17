#!/usr/bin/env node
/**
 * Product/Offer rich-result guard for gitdealflow.com/pricing (apex landing).
 *
 * The apex /pricing page carries a Product + AggregateOffer. A free $0 offer
 * nested inside the AggregateOffer forces lowPrice:0, which is the canonical
 * way Google suppresses or drops a price-based Product rich result. The free
 * "Sunday Signal Digest" tier stays visible on the page; it must NOT be
 * marked up as a $0 Offer inside the aggregate. The aggregate must price the
 * PAID ladder only: lowPrice = lowest paid rung, offerCount = number of paid
 * offers, no offer.price === 0.
 *
 * This is the landing half of the site-wide rule; the pSEO half lives in

 * scripts/verify-no-regressions.ts section 63.
 *
 * Usage: node scripts/verify-pricing-offers.mjs   (exit 1 on violation)
 */
import { readFileSync } from "node:fs";

const FILE = "pricing.html";
const BLOCK_RE =
  /<script[^>]*\btype\s*=\s*["']?application\/ld\+json["']?[^>]*>([\s\S]*?)<\/script>/gi;

const errors = [];

let html;
try {
  html = readFileSync(FILE, "utf8");
} catch {
  console.error(`❌ verify-pricing-offers: ${FILE} not found (run from landing/ root)`);
  process.exit(1);
}

const graph = [];
let m;
while ((m = BLOCK_RE.exec(html)) !== null) {
  let parsed;
  try {
    parsed = JSON.parse(m[1].trim());
  } catch (err) {
    errors.push(`${FILE}: invalid JSON-LD, ${err.message}`);
    continue;
  }
  const nodes = parsed["@graph"] || (Array.isArray(parsed) ? parsed : [parsed]);
  for (const n of nodes) graph.push(n);
}

const product = graph.find((n) => n && n["@type"] === "Product");
if (!product) {
  errors.push(`${FILE}: no Product node in JSON-LD`);
} else {
  const agg = product.offers;
  if (!agg || agg["@type"] !== "AggregateOffer") {
    errors.push(`${FILE}: Product has no AggregateOffer`);
  } else {
    const offers = agg.offers;
    if (!Array.isArray(offers) || offers.length === 0) {
      errors.push(`${FILE}: AggregateOffer has no offers array`);
    } else {
      const prices = offers.map((o) => Number(o.price));
      const freeOffers = prices.filter((p) => p === 0);
      const minPaid = Math.min(...prices);
      if (freeOffers.length > 0) {
        errors.push(
          `${FILE}: ${freeOffers.length} free $0 offer(s) inside the AggregateOffer (suppresses the price rich result); the free tier must stay visible on-page only`,
        );
      }
      if (Number(agg.lowPrice) !== minPaid) {
        errors.push(
          `${FILE}: lowPrice ${agg.lowPrice} != lowest paid offer ${minPaid}`,
        );
      }
      if (Number(agg.offerCount) !== offers.length) {
        errors.push(
          `${FILE}: offerCount ${agg.offerCount} != offers.length ${offers.length}`,
        );
      }
    }
  }
}

if (errors.length) {
  console.error(`\n❌ verify-pricing-offers: ${errors.length} violation(s):`);
  for (const e of errors) console.error(`  - ${e}`);
  console.error(
    "\nFix the SOURCE (landing/pricing.html), not a post-processor: remove any",
  );
  console.error(
    "price:0 Offer from the AggregateOffer.offers array, keep lowPrice = the",
  );
  console.error("lowest PAID rung and offerCount = the paid-offer count.");
  process.exit(1);
}

console.log("✓ verify-pricing-offers: apex /pricing Product aggregate prices the paid ladder only");
