#!/usr/bin/env node
// Run whisper.cpp on each scene's VO mp3, extract word-level timings,
// and write captions.json keyed by scene id.
import { readFileSync, writeFileSync, existsSync, mkdirSync } from "node:fs";
import { execFileSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2] ?? "predicted-90s";
const OUT = path.join(ROOT, "out", slug);
const MODEL = path.join(ROOT, "out", "whisper-base.en.bin");

if (!existsSync(MODEL)) {
  throw new Error(`missing whisper model at ${MODEL}. Download with:\n  curl -L -o ${MODEL} https://huggingface.co/ggerganov/whisper.cpp/resolve/main/ggml-base.en.bin`);
}

const meta = JSON.parse(readFileSync(path.join(OUT, "script-meta.json"), "utf8"));

function transcribe(mp3Path, sceneId) {
  const wav = path.join(OUT, `vo-${sceneId}.wav`);
  const jsonOut = path.join(OUT, `vo-${sceneId}`); // whisper appends .json
  // Convert to 16k mono WAV
  execFileSync("ffmpeg", [
    "-y", "-i", mp3Path,
    "-ar", "16000", "-ac", "1", "-c:a", "pcm_s16le", wav,
    "-loglevel", "error",
  ]);
  // -ml 1 + -sow → one word per segment (no BPE subword splitting)
  // -dtw base.en → Dynamic Time Warping for accurate per-word timestamps
  // (without DTW, whisper piles late-scene words at the segment boundary)
  execFileSync("whisper-cli", [
    "-m", MODEL,
    "-f", wav,
    "--output-json", "--output-file", jsonOut,
    "-ml", "1", "-sow",
    "-dtw", "base.en",
    "-nt",
  ], { stdio: ["ignore", "ignore", "ignore"] });

  const data = JSON.parse(readFileSync(`${jsonOut}.json`, "utf8"));
  const words = (data.transcription ?? [])
    .map((s) => ({
      text: applyBrandFix((s.text ?? "").trim()),
      fromMs: s.offsets?.from ?? 0,
      toMs: s.offsets?.to ?? 0,
    }))
    .filter((w) => w.text && /[a-zA-Z0-9]/.test(w.text));
  return words;
}

// Whisper consistently mishears brand terms with phonetic ambiguity. Apply a
// small dictionary of known corrections — keep it minimal so true mistakes
// still surface, only patch the brand pronunciations we control.
const BRAND_FIXES = [
  [/\bget-?deal-?flow\b/gi, "gitdealflow"],
  [/\bgitdeal-?flow\b/gi, "gitdealflow"], // normalize hyphenation
  [/\bperfect-?webinar\b/gi, "perfect-webinar"], // hyphenate URL slug
];
function applyBrandFix(text) {
  let out = text;
  for (const [re, sub] of BRAND_FIXES) out = out.replace(re, sub);
  return out;
}

// Whisper sometimes assigns N consecutive words the same timestamp when its
// internal alignment loses precision (typically the last 30–50% of a clip).
// Distribute such runs evenly across the actual available audio so karaoke
// captions don't burst all at once. Window:
//   start = max(prev distinct word's toMs, runStart - N * 80ms)
//   end   = min(next distinct word's fromMs, audioEndMs)
function smoothTimings(words, voDurationSec) {
  if (words.length === 0) return words;
  const out = words.map((w) => ({ ...w }));
  const audioEndMs = Math.round(voDurationSec * 1000);

  let i = 0;
  while (i < out.length) {
    let j = i + 1;
    while (j < out.length && out[j].fromMs === out[i].fromMs) j++;
    const runLen = j - i;
    if (runLen > 1) {
      // Whisper sets `toMs` on the prior distinct word to the pile-up
      // timestamp too, so we can't trust it. Use prior `fromMs + 100ms` as a
      // floor. Backfill so each word gets ~80ms of display time minimum.
      const prevFromMs = i > 0 ? out[i - 1].fromMs : 0;
      const nextFromMs = j < out.length ? out[j].fromMs : audioEndMs;
      const runEnd = Math.min(nextFromMs, audioEndMs);
      const desiredStart = runEnd - runLen * 80;
      let runStart = Math.max(prevFromMs + 100, desiredStart);
      runStart = Math.max(0, Math.min(runStart, runEnd - 50));
      const span = runEnd - runStart;
      for (let k = 0; k < runLen; k++) {
        out[i + k].fromMs = Math.round(runStart + (span * k) / runLen);
        out[i + k].toMs = Math.round(runStart + (span * (k + 1)) / runLen);
      }
    }
    i = j;
  }
  return out;
}

const captions = {};
const PUBLIC_DIR = path.join(ROOT, "out");
for (const scene of meta.scenes) {
  if (!scene.audioPath) continue;
  // audioPath is `<slug>/vo-<id>.mp3` (relative to PUBLIC_DIR / Remotion publicDir).
  const mp3 = path.join(PUBLIC_DIR, scene.audioPath);
  process.stdout.write(`  ${scene.id.padEnd(14)} `);
  const t = Date.now();
  const raw = transcribe(mp3, scene.id);
  const smoothed = smoothTimings(raw, scene.voDurationSec);
  const ms = Date.now() - t;
  captions[scene.id] = smoothed;
  // Count of words that got smoothed (had identical timestamps)
  const collapsed = raw.length - new Set(raw.map((w) => w.fromMs)).size;
  console.log(`${smoothed.length} words · ${ms}ms${collapsed > 0 ? ` · ${collapsed} smoothed` : ""}`);
}

writeFileSync(path.join(OUT, "captions.json"), JSON.stringify(captions, null, 2));
console.log(`\nWrote out/${slug}/captions.json (${Object.keys(captions).length} scenes)`);
