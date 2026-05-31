#!/usr/bin/env node
/**
 * package.mjs — produce a Chrome Web Store-ready .zip of the extension.
 *
 * Skips: dev scaffolding (icon.svg source, scripts/, node_modules, .DS_Store).
 * Includes: manifest.json, content.js/css, popup.*, icons/, glossary.json.
 *
 * Uses the system `zip` binary (present on macOS + Linux + CI runners).
 * Output: chrome-extension-define/dist/vc-term-highlighter-<version>.zip
 */

import { readFile, mkdir, rm } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(HERE, "..");
const DIST = resolve(ROOT, "dist");

async function main() {
  const manifest = JSON.parse(
    await readFile(resolve(ROOT, "manifest.json"), "utf8"),
  );
  const version = manifest.version || "0.0.0";
  const zipName = `vc-term-highlighter-${version}.zip`;
  const zipPath = resolve(DIST, zipName);

  await rm(DIST, { recursive: true, force: true });
  await mkdir(DIST, { recursive: true });

  // The `zip` syntax: zip -r <out> <inputs> -x <patterns>
  const inputs = [
    "manifest.json",
    "content.js",
    "content.css",
    "popup.html",
    "popup.css",
    "popup.js",
    "glossary.json",
    "icons/",
  ];
  const excludes = ["*/.DS_Store", "*.zip"];

  const args = [
    "-r",
    "-X", // strip extra file attributes
    zipPath,
    ...inputs,
    "-x",
    ...excludes,
  ];

  const result = spawnSync("zip", args, { cwd: ROOT, encoding: "utf8" });
  if (result.status !== 0) {
    console.error("[package] zip failed:", result.stderr || result.stdout);
    process.exit(1);
  }
  console.log(`[package] wrote ${zipPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
