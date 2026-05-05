#!/usr/bin/env node
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");

function loadEnv() {
  const envPath = path.join(ROOT, ".env.local");
  if (!existsSync(envPath)) throw new Error(`missing ${envPath}`);
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
}
loadEnv();

const {
  CARTESIA_API_KEY,
  CARTESIA_MODEL_ID = "sonic-2",
  CARTESIA_VOICE_ID,
  CARTESIA_VOICE_NAME = "(unnamed)",
  CARTESIA_VERSION = "2026-03-01",
} = process.env;
if (!CARTESIA_API_KEY || !CARTESIA_VOICE_ID) {
  throw new Error("missing CARTESIA_API_KEY or CARTESIA_VOICE_ID in .env.local");
}

// First positional arg = script slug (default: predicted-90s).
// Outputs land in out/<slug>/* so multiple videos coexist.
const slug = process.argv[2] ?? "predicted-90s";
const SCRIPT_PATH = path.join(ROOT, `content/${slug}.json`);
const OUT_DIR = path.join(ROOT, "out", slug);
if (!existsSync(OUT_DIR)) mkdirSync(OUT_DIR, { recursive: true });

const script = JSON.parse(readFileSync(SCRIPT_PATH, "utf8"));

async function tts(transcript, outPath) {
  const res = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${CARTESIA_API_KEY}`,
      "Cartesia-Version": CARTESIA_VERSION,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: CARTESIA_MODEL_ID,
      transcript,
      voice: { mode: "id", id: CARTESIA_VOICE_ID },
      language: "en",
      output_format: {
        container: "mp3",
        sample_rate: 44100,
        bit_rate: 192000,
      },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cartesia ${res.status}: ${body}`);
  }
  const buf = Buffer.from(await res.arrayBuffer());
  writeFileSync(outPath, buf);
  return buf.length;
}

function probeDurationSec(mp3Path) {
  const out = execFileSync("ffprobe", [
    "-v", "error",
    "-show_entries", "format=duration",
    "-of", "default=noprint_wrappers=1:nokey=1",
    mp3Path,
  ], { encoding: "utf8" });
  return Number(out.trim());
}

const meta = {
  id: script.id,
  fps: script.fps,
  width: script.width,
  height: script.height,
  voice: { id: CARTESIA_VOICE_ID, name: CARTESIA_VOICE_NAME, model: CARTESIA_MODEL_ID },
  scenes: [],
};

const t0 = Date.now();
console.log(`Voice: ${CARTESIA_VOICE_NAME} (${CARTESIA_MODEL_ID})`);
console.log(`Scenes: ${script.scenes.length}`);
console.log("");

for (const scene of script.scenes) {
  const mp3Abs = path.join(OUT_DIR, `vo-${scene.id}.mp3`);

  let durationSec = 0;
  let bytes = 0;

  if (scene.vo && scene.vo.trim().length > 0) {
    const t = Date.now();
    bytes = await tts(scene.vo, mp3Abs);
    durationSec = probeDurationSec(mp3Abs);
    const ms = Date.now() - t;
    console.log(`  ${scene.id.padEnd(14)} ${durationSec.toFixed(2)}s · ${(bytes / 1024).toFixed(0)}KB · ${ms}ms`);
  } else {
    durationSec = scene.durationHint ?? 2;
    console.log(`  ${scene.id.padEnd(14)} ${durationSec.toFixed(2)}s · (no VO)`);
  }

  // For scenes with VO, target VO + 0.6s breath. For silent scenes, use hint.
  const BREATH = 0.6;
  const finalDuration = scene.vo
    ? Math.max(durationSec + BREATH, scene.durationHint ?? 0)
    : (scene.durationHint ?? 2);

  meta.scenes.push({
    id: scene.id,
    kind: scene.kind,
    vo: scene.vo,
    durationHint: scene.durationHint ?? 0,
    durationSec: finalDuration,
    voDurationSec: durationSec,
    audioPath: scene.vo ? `${slug}/vo-${scene.id}.mp3` : null,
    data: scene.data ?? {},
  });
}

const totalSec = meta.scenes.reduce((s, x) => s + x.durationSec, 0);
meta.totalDurationSec = totalSec;
meta.totalDurationFrames = Math.ceil(totalSec * script.fps);

writeFileSync(path.join(OUT_DIR, "script-meta.json"), JSON.stringify(meta, null, 2));

console.log("");
console.log(`Total: ${totalSec.toFixed(2)}s (${meta.totalDurationFrames} frames @ ${script.fps}fps)`);
console.log(`Wall: ${((Date.now() - t0) / 1000).toFixed(1)}s`);
console.log(`Wrote out/${slug}/script-meta.json`);
