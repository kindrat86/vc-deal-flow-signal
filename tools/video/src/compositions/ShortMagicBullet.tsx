import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ShortHook } from "../scenes/ShortHook";
import { ShortTimeline } from "../scenes/ShortTimeline";
import { ShortCTA } from "../scenes/ShortCTA";
import { WordCaption, type Word } from "../scenes/WordCaption";
import captions from "../../out/short-magic-bullet/captions.json";

type Scene = {
  id: string;
  kind: string;
  vo: string;
  durationSec: number;
  voDurationSec: number;
  audioPath: string | null;
  data: Record<string, unknown>;
};

type Meta = { fps: number; scenes: Scene[] };

const CAPTION_SCENES = new Set(["short-hook", "short-cta"]);

export const ShortMagicBullet: React.FC<{ meta: Meta }> = ({ meta }) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      <Audio src={staticFile("short-magic-bullet/music.mp3")} volume={0.13} />
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

function extractBeatTimings(sceneId: string, beatCount: number): number[] {
  const words = (captions as Record<string, Word[]>)[sceneId];
  if (!words) return [];
  const dayTimes: number[] = [];
  for (const w of words) {
    if (w.text.toLowerCase().replace(/[.,!?]/g, "") === "day") dayTimes.push(w.fromMs / 1000);
  }
  return dayTimes.slice(0, beatCount);
}

function renderScene(scene: Scene) {
  const d = scene.data as Record<string, never>;
  switch (scene.kind) {
    case "short-hook":
      // @ts-expect-error
      return <ShortHook topLine={d.topLine} midLine={d.midLine} bottomLine={d.bottomLine} stamp={d.stamp} />;
    case "short-timeline": {
      // @ts-expect-error
      const baseBeats = d.beats as Array<Record<string, unknown>>;
      const timings = extractBeatTimings(scene.id, baseBeats.length);
      const beats = baseBeats.map((b, i) => ({ ...b, startSec: timings[i] ?? i * 7 }));
      // @ts-expect-error
      return <ShortTimeline title={d.title} beats={beats} />;
    }
    case "short-cta":
      // @ts-expect-error
      return <ShortCTA headline={d.headline} url={d.url} tag={d.tag} />;
    default:
      return null;
  }
}
