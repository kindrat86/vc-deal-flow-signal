/**
 * The Data Nerd voice — single source of truth for Cartesia TTS across
 * surfaces (YouTube videos, page audio embeds, email-audio).
 *
 * Voice identity flows via CARTESIA_VOICE_ID. Every surface that imports
 * this module produces audio in the same voice — that consistency is what
 * makes "The Data Nerd" persona an Attractive Character across channels.
 *
 * Env source priority (first one with the keys wins):
 *   1. process.env (already set)
 *   2. tools/audio/.env.local
 *   3. tools/video/.env.local
 *   4. tools/.env
 */
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function loadEnvFile(filePath) {
  if (!existsSync(filePath)) return false;
  for (const line of readFileSync(filePath, "utf8").split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
  }
  return true;
}

function loadEnv() {
  const candidates = [
    path.resolve(__dirname, "../audio/.env.local"),
    path.resolve(__dirname, "../video/.env.local"),
    path.resolve(__dirname, "../.env"),
  ];
  for (const p of candidates) loadEnvFile(p);
}
loadEnv();

export const dataNerdVoice = {
  apiKey: process.env.CARTESIA_API_KEY,
  voiceId: process.env.CARTESIA_VOICE_ID,
  voiceName: process.env.CARTESIA_VOICE_NAME || "The Data Nerd",
  modelId: process.env.CARTESIA_MODEL_ID || "sonic-2",
  version: process.env.CARTESIA_VERSION || "2026-03-01",
};

export function assertVoiceConfigured() {
  if (!dataNerdVoice.apiKey || !dataNerdVoice.voiceId) {
    throw new Error(
      "missing CARTESIA_API_KEY or CARTESIA_VOICE_ID — set in tools/audio/.env.local " +
      "(use the same voice id as tools/video/.env.local for cross-surface consistency)"
    );
  }
}

export async function ttsToMp3Buffer(transcript) {
  assertVoiceConfigured();
  const res = await fetch("https://api.cartesia.ai/tts/bytes", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${dataNerdVoice.apiKey}`,
      "Cartesia-Version": dataNerdVoice.version,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model_id: dataNerdVoice.modelId,
      transcript,
      voice: { mode: "id", id: dataNerdVoice.voiceId },
      language: "en",
      output_format: { container: "mp3", sample_rate: 44100, bit_rate: 192000 },
    }),
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Cartesia ${res.status}: ${body}`);
  }
  return Buffer.from(await res.arrayBuffer());
}
