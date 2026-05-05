import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Title } from "../scenes/Title";
import { Hook } from "../scenes/Hook";
import { Problem } from "../scenes/Problem";
import { MagicBullet } from "../scenes/MagicBullet";
import { Scorecard } from "../scenes/Scorecard";
import { CTA } from "../scenes/CTA";
import { WordCaption, type Word } from "../scenes/WordCaption";
import captions from "../../out/predicted-90s/captions.json";

type Scene = {
  id: string;
  kind: string;
  vo: string;
  durationSec: number;
  voDurationSec: number;
  audioPath: string | null;
  data: Record<string, unknown>;
};

type Meta = {
  fps: number;
  scenes: Scene[];
};

export const Predicted90s: React.FC<{ meta: Meta }> = ({ meta }) => {
  let cursor = 0;
  const totalFrames = Math.ceil(meta.scenes.reduce((s, x) => s + x.durationSec, 0) * meta.fps);
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      {/* Music bed — sits under all scenes at -22dB-ish */}
      <Audio src={staticFile("predicted-90s/music.mp3")} volume={0.13} />

      {meta.scenes.map((scene) => {
        const start = cursor;
        const dur = Math.max(1, Math.round(scene.durationSec * meta.fps));
        cursor += dur;
        return (
          <Sequence key={scene.id} from={start} durationInFrames={dur}>
            <SceneFrame scene={scene} />
          </Sequence>
        );
      })}
    </AbsoluteFill>
  );
};

// Captions are redundant on scenes where on-screen text mirrors VO (hook,
// problem). On magic-bullet, the timeline IS the caption. We render karaoke
// word-captions on scenes that surface stats/CTAs the VO contextualizes.
const CAPTION_SCENES = new Set(["scorecard", "cta"]);

const SceneFrame: React.FC<{ scene: Scene }> = ({ scene }) => {
  const showCaption = scene.vo && CAPTION_SCENES.has(scene.kind);
  const words = (captions as Record<string, Word[]>)[scene.id] ?? [];
  return (
    <AbsoluteFill>
      {renderScene(scene)}
      {scene.audioPath ? <Audio src={staticFile(scene.audioPath)} /> : null}
      {showCaption && words.length > 0 ? <WordCaption words={words} /> : null}
    </AbsoluteFill>
  );
};

// Pull "Day"-token timestamps from whisper captions for magic-bullet beats.
// Returns seconds, ordered chronologically, one per beat. Trailing duplicates
// (e.g. the closing "we had it on day minus thirty-one") are dropped.
function extractBeatTimings(sceneId: string, beatCount: number): number[] {
  const words = (captions as Record<string, Word[]>)[sceneId];
  if (!words) return [];
  const dayTimes: number[] = [];
  for (const w of words) {
    if (w.text.toLowerCase().replace(/[.,!?]/g, "") === "day") {
      dayTimes.push(w.fromMs / 1000);
    }
  }
  // Sometimes whisper inserts a trailing "day minus thirty-one" recap line;
  // we only want the first `beatCount` calls.
  return dayTimes.slice(0, beatCount);
}

function renderScene(scene: Scene) {
  const d = scene.data as Record<string, never>;
  switch (scene.kind) {
    case "title":
      // @ts-expect-error -- data is typed loosely from JSON
      return <Title title={d.title} subtitle={d.subtitle} />;
    case "hook":
      // @ts-expect-error
      return <Hook lines={d.lines} stamp={d.stamp} />;
    case "problem":
      // @ts-expect-error
      return <Problem headline={d.headline} subhead={d.subhead} />;
    case "magic-bullet": {
      // @ts-expect-error
      const baseBeats = d.beats as Array<Record<string, unknown>>;
      const timings = extractBeatTimings(scene.id, baseBeats.length);
      const beats = baseBeats.map((b, i) => ({ ...b, startSec: timings[i] ?? 0 }));
      // @ts-expect-error
      return <MagicBullet title={d.title} beats={beats} />;
    }
    case "scorecard":
      // @ts-expect-error
      return <Scorecard stats={d.stats} footnote={d.footnote} />;
    case "cta":
      // @ts-expect-error
      return <CTA headline={d.headline} url={d.url} ctas={d.ctas} />;
    default:
      return null;
  }
}
