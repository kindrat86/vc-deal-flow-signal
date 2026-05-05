#!/usr/bin/env node
// Synthesize a tasteful ambient music bed via ffmpeg. Produces a procedural
// drone+pad in A minor (calm, neutral, not melodic) — designed to sit behind
// VO at -22dB without competing for attention. The ducker in 04-mix.mjs will
// further attenuate it under speech.
//
// Procedural rather than downloaded so the whole pipeline stays autonomous
// and royalty-free. Swap out/music.mp3 with any track you like; the mix step
// will use whatever exists at that path.
import { execFileSync } from "node:child_process";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const slug = process.argv[2] ?? "predicted-90s";
const OUT = path.join(ROOT, "out", slug);

const meta = JSON.parse(readFileSync(path.join(OUT, "script-meta.json"), "utf8"));
const totalSec = Math.ceil(meta.totalDurationSec) + 2;

const out = path.join(OUT, "music.mp3");

// A minor pad: A2 (110 Hz), C3 (130.81), E3 (164.81), A3 (220) — root + minor 3rd + 5th + octave.
// Slow tremolo on root for movement. Pink noise filtered to a low whoosh for texture.
// Total mix sits at unity here; final mix-down in 04-mix.mjs sets it to -24dB under VO.
const filter = [
  // Note layers
  `sine=f=110.00:duration=${totalSec},volume=0.16,tremolo=f=0.18:d=0.35[a]`,
  `sine=f=164.81:duration=${totalSec},volume=0.10[b]`,
  `sine=f=220.00:duration=${totalSec},volume=0.08[c]`,
  `sine=f=329.63:duration=${totalSec},volume=0.05[d]`,
  // Texture: pink noise, lowpassed + sidechain shimmer
  `anoisesrc=d=${totalSec}:c=pink:r=44100,volume=0.07,lowpass=f=600,highpass=f=80[noise]`,
  // Mix and shape
  `[a][b][c][d][noise]amix=inputs=5:dropout_transition=0,aformat=sample_rates=44100:channel_layouts=stereo,afade=t=in:st=0:d=3,afade=t=out:st=${totalSec - 3}:d=3`,
].join(";");

const t = Date.now();
execFileSync("ffmpeg", [
  "-y",
  "-f", "lavfi", "-i", "anullsrc=r=44100:cl=stereo:d=0",
  "-filter_complex", filter,
  "-c:a", "libmp3lame", "-b:a", "192k",
  out,
  "-loglevel", "error",
]);
const sizeKB = Math.round(execFileSync("stat", ["-f", "%z", out], { encoding: "utf8" }).trim() / 1024);
console.log(`Synthesized ${totalSec}s ambient bed → out/${slug}/music.mp3 (${sizeKB}KB · ${Date.now() - t}ms)`);
