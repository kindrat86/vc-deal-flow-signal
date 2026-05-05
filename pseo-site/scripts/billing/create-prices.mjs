#!/usr/bin/env node
/**
 * Create / reuse Stripe prices for the new PAYG + Insider tiers.
 *
 * Idempotent: if a matching active price already exists on the target product,
 * we reuse it. New prices are created as needed.
 *
 * Outputs the three env-var lines you need to add to Vercel:
 *   STRIPE_PRICE_PAYG_19=price_...
 *   STRIPE_PRICE_PAYG_100=price_...
 *   STRIPE_PRICE_INSIDER_29=price_...
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import Stripe from "stripe";

const envCandidates = [".env.production.local", ".env.local"];
let envPath = null;
for (const candidate of envCandidates) {
  const tryPath = resolve(process.cwd(), candidate);
  try {
    const text = readFileSync(tryPath, "utf8");
    if (/^STRIPE_SECRET_KEY=/m.test(text)) { envPath = tryPath; break; }
  } catch { /* missing */ }
}
if (!envPath) {
  console.error("No env file with STRIPE_SECRET_KEY found.");
  process.exit(1);
}
for (const raw of readFileSync(envPath, "utf8").split(/\r?\n/)) {
  const line = raw.trim();
  if (!line || line.startsWith("#")) continue;
  const eq = line.indexOf("=");
  if (eq < 0) continue;
  const key = line.slice(0, eq).trim();
  let val = line.slice(eq + 1).trim();
  if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
    val = val.slice(1, -1);
  }
  val = val.replace(/\\n/g, "\n").replace(/\\"/g, '"').trim();
  if (!process.env[key]) process.env[key] = val;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PAYG_PRODUCT_ID = "prod_USHx0ixOCllD1m"; // existing "Agent Credits"
const INSIDER_PRODUCT_ID = "prod_UKVsgNDULAHJae"; // existing "Insider Circle"

async function findOrCreatePrice({
  productId,
  unitAmount,
  currency,
  recurring,
  nickname,
  planTag,
}) {
  // Look for an existing active price matching amount + currency + recurring shape
  const existing = await stripe.prices.list({
    product: productId,
    active: true,
    limit: 100,
  });
  for (const pr of existing.data) {
    const sameAmount = pr.unit_amount === unitAmount && pr.currency === currency;
    const recurringMatches =
      (!recurring && !pr.recurring) ||
      (recurring && pr.recurring && pr.recurring.interval === recurring.interval);
    if (sameAmount && recurringMatches) {
      console.log(`  reusing existing ${nickname}: ${pr.id} (${unitAmount / 100} ${currency.toUpperCase()})`);
      // Tag the price metadata for future lookups
      if (planTag && pr.metadata?.gdf_plan !== planTag) {
        await stripe.prices.update(pr.id, {
          metadata: { ...pr.metadata, gdf_plan: planTag },
          nickname: pr.nickname || nickname,
        });
      }
      return pr.id;
    }
  }
  console.log(`  creating new ${nickname}: ${unitAmount / 100} ${currency.toUpperCase()}${recurring ? `/${recurring.interval}` : " one-time"}`);
  const created = await stripe.prices.create({
    product: productId,
    unit_amount: unitAmount,
    currency,
    nickname,
    recurring: recurring || undefined,
    metadata: { gdf_plan: planTag },
  });
  return created.id;
}

console.log("Resolving prices...\n");

const paygNineteen = await findOrCreatePrice({
  productId: PAYG_PRODUCT_ID,
  unitAmount: 1900,
  currency: "eur",
  nickname: "PAYG €19 — 190 calls",
  planTag: "payg-19",
});

const paygHundred = await findOrCreatePrice({
  productId: PAYG_PRODUCT_ID,
  unitAmount: 10000,
  currency: "eur",
  nickname: "PAYG €100 — 1000 calls",
  planTag: "payg-100",
});

const insider29 = await findOrCreatePrice({
  productId: INSIDER_PRODUCT_ID,
  unitAmount: 2900,
  currency: "eur",
  recurring: { interval: "month" },
  nickname: "Insider Circle €29/mo",
  planTag: "insider",
});

console.log("\n--- env lines to add to Vercel (preview + production) ---\n");
console.log(`STRIPE_PRICE_PAYG_19=${paygNineteen}`);
console.log(`STRIPE_PRICE_PAYG_100=${paygHundred}`);
console.log(`STRIPE_PRICE_INSIDER_29=${insider29}`);
console.log();
