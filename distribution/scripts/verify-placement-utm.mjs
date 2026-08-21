#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";

const distributionRoot = path.resolve(process.cwd(), "distribution");
const marker = /<!--\s*distribution-cta:[^\n]*-->\s*\n\s*(https:\/\/[^\s)>]+)(?=\s|$)/g;
const required = ["utm_source", "utm_medium", "utm_campaign", "utm_content", "utm_id"];
const errors = [];
let checked = 0;

function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name.startsWith(".")) continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.isFile() && entry.name.endsWith(".md")) inspect(full);
  }
}

function inspect(file) {
  const body = fs.readFileSync(file, "utf8");
  marker.lastIndex = 0;
  let match;
  while ((match = marker.exec(body))) {
    checked += 1;
    const url = new URL(match[1]);
    if (!/(^|\.)gitdealflow\.com$/.test(url.hostname)) {
      errors.push(`${path.relative(process.cwd(), file)}: CTA must point to a GitDealFlow domain`);
      continue;
    }
    for (const key of required) {
      const value = url.searchParams.get(key);
      if (!value) errors.push(`${path.relative(process.cwd(), file)}: CTA is missing ${key}`);
      else if (value !== value.toLowerCase()) errors.push(`${path.relative(process.cwd(), file)}: ${key} must be lowercase`);
    }
    const placement = url.searchParams.get("utm_id") || "";
    if (!/^[a-z0-9][a-z0-9-]{2,119}$/.test(placement)) {
      errors.push(`${path.relative(process.cwd(), file)}: utm_id must be an immutable lowercase placement key`);
    }
  }
}

walk(distributionRoot);
if (checked === 0) errors.push("No distribution-cta links found. Mark every publishable acquisition link before release.");
if (errors.length) {
  console.error("[verify-placement-utm] FAIL");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}
console.log(`[verify-placement-utm] PASS ${checked} managed CTA link${checked === 1 ? "" : "s"}`);
