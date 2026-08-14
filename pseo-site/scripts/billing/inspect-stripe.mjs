#!/usr/bin/env node
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
  } catch { /* file missing */ }
}
if (!envPath) {
  console.error("No env file found containing STRIPE_SECRET_KEY (tried .env.production.local, .env.local)");
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

const sk = process.env.STRIPE_SECRET_KEY;
if (!sk) {
  console.error("STRIPE_SECRET_KEY missing from .env.local");
  process.exit(1);
}
console.log("key mode:", sk.startsWith("sk_live_") ? "LIVE" : sk.startsWith("sk_test_") ? "TEST" : "unknown");
console.log("key prefix:", sk.slice(0, 12) + "...");

const stripe = new Stripe(sk);
const products = await stripe.products.list({ limit: 30, active: true });
console.log(`\nactive products (${products.data.length}):`);
for (const p of products.data) {
  const prices = await stripe.prices.list({ product: p.id, active: true, limit: 5 });
  const planMeta = p.metadata?.gdf_plan ? ` [gdf_plan=${p.metadata.gdf_plan}]` : "";
  console.log(`  ${p.id}, ${p.name}${planMeta}`);
  for (const pr of prices.data) {
    const recurring = pr.recurring ? `/${pr.recurring.interval}` : "(one-time)";
    console.log(`    ${pr.id}, ${(pr.unit_amount ?? 0) / 100} ${pr.currency.toUpperCase()} ${recurring}`);
  }
}
