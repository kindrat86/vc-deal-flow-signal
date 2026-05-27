#!/usr/bin/env node
/**
 * build-icons.mjs — render extension PNG icons from an inline SVG.
 *
 * Uses macOS `sips` (no extra deps). Outputs 16/48/128 to icons/.
 *
 * Design: dark slate square + bold "A" + cyan highlighter underline.
 * The underline metaphor matches what the extension visibly does on pages.
 */

import { writeFile, mkdir, unlink } from "node:fs/promises";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const HERE = dirname(fileURLToPath(import.meta.url));
const ICON_DIR = resolve(HERE, "..", "icons");
const TMP_SVG = resolve(HERE, "..", "icon.svg");

const SIZES = [16, 48, 128];

const SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <linearGradient id="hl" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="100%" stop-color="#0ea5e9"/>
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="22" ry="22" fill="url(#bg)"/>
  <rect x="6" y="6" width="116" height="116" rx="18" ry="18" fill="none" stroke="rgba(56,189,248,0.12)" stroke-width="2"/>
  <text x="64" y="90" font-family="-apple-system, Helvetica, Arial, sans-serif" font-size="92" font-weight="800" fill="#f1f5f9" text-anchor="middle" letter-spacing="-2">A</text>
  <rect x="22" y="100" width="84" height="12" rx="6" fill="url(#hl)"/>
</svg>
`;

async function main() {
  await mkdir(ICON_DIR, { recursive: true });
  await writeFile(TMP_SVG, SVG, "utf8");

  for (const size of SIZES) {
    const out = resolve(ICON_DIR, `icon-${size}.png`);
    const result = spawnSync(
      "sips",
      [
        "-s",
        "format",
        "png",
        "-Z",
        String(size),
        TMP_SVG,
        "--out",
        out,
      ],
      { encoding: "utf8" },
    );
    if (result.status !== 0) {
      console.error(`[build-icons] sips failed (${size}px):`, result.stderr);
      process.exit(1);
    }
    console.log(`[build-icons] wrote icon-${size}.png`);
  }

  // Keep the SVG checked in — it's the editable source.
  console.log(`[build-icons] svg source kept at ${TMP_SVG}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
