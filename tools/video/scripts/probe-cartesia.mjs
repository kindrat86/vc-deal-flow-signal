#!/usr/bin/env node
// Smoke test: hits Cartesia with one short line, saves out/probe.mp3.
// Validates auth, headers, body schema before we burn budget on the full run.
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
for (const line of readFileSync(path.join(ROOT, ".env.local"), "utf8").split("\n")) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const res = await fetch("https://api.cartesia.ai/tts/bytes", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${process.env.CARTESIA_API_KEY}`,
    "Cartesia-Version": process.env.CARTESIA_VERSION ?? "2026-03-01",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    model_id: process.env.CARTESIA_MODEL_ID ?? "sonic-2",
    transcript: "Engineering acceleration. The signal that fires before the round closes.",
    voice: { mode: "id", id: process.env.CARTESIA_VOICE_ID },
    language: "en",
    output_format: { container: "mp3", sample_rate: 44100, bit_rate: 192000 },
  }),
});

if (!res.ok) {
  console.error(`HTTP ${res.status}`);
  console.error(await res.text());
  process.exit(1);
}

const buf = Buffer.from(await res.arrayBuffer());
writeFileSync(path.join(ROOT, "out/probe.mp3"), buf);
console.log(`OK ${buf.length} bytes → out/probe.mp3`);
