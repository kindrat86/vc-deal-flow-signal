#!/usr/bin/env node
/**
 * The published GitDealFlow research release has 219 startup-period observations
 * and no linked funding-event labels. Public copy must not convert those rows
 * into financing outcomes or prediction evidence.
 */
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { resolve, relative, extname } from "node:path";

const root = resolve(import.meta.dirname, "..", "..");
const surfaces = ["landing", "pseo-site", "mcp-server", "chrome-extension", "distribution"];
const ignored = new Set([".git", "node_modules", ".next", ".vercel", "dist", "coverage"]);
const textExtensions = new Set([".html", ".md", ".mdx", ".txt", ".json", ".js", ".mjs", ".ts", ".tsx", ".jsx", ".yml", ".yaml"]);
const financingWord = "fund" + "rais";
const forbidden = new RegExp(`(?:\\b219\\b.{0,180}\\b${financingWord}\\w*\\b|\\b${financingWord}\\w*\\b.{0,180}\\b219\\b)`, "i");

function walk(path, found) {
  for (const name of readdirSync(path)) {
    if (ignored.has(name)) continue;
    const full = resolve(path, name);
    const stat = statSync(full);
    if (stat.isDirectory()) walk(full, found);
    else if (textExtensions.has(extname(name))) found.push(full);
  }
}

const files = [];
for (const surface of surfaces) {
  const path = resolve(root, surface);
  if (existsSync(path)) walk(path, files);
}
for (const name of ["AGENTS.md", "CLAIMS-LEDGER.md"]) {
  const path = resolve(root, name);
  if (existsSync(path)) files.push(path);
}

const violations = [];
for (const file of files) {
  const rel = relative(root, file);
  const lines = readFileSync(file, "utf8").split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    if (forbidden.test(lines[index])) violations.push(`${rel}:${index + 1}: ${lines[index].trim()}`);
  }
}

if (violations.length) {
  throw new Error(`Research-claim lock failed. The primary paper has 219 startup-period observations and no linked funding-event labels.\n${violations.join("\n")}`);
}
console.log("Research-claim lock passed: no public surface converts 219 observations into financing outcomes.");
