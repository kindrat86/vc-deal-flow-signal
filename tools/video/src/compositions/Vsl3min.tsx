import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { Title } from "../scenes/Title";
import { Hook } from "../scenes/Hook";
import { MagicBullet } from "../scenes/MagicBullet";
import { CTA } from "../scenes/CTA";
import { BigDomino } from "../scenes/BigDomino";
import { StackReveal } from "../scenes/StackReveal";
import { WordCaption, type Word } from "../scenes/WordCaption";
import captions from "../../out/vsl-3min/captions.json";

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

// VSL renders captions on the dense scenes (big-domino, magic-bullet, stack)
// where the on-screen text doesn't directly mirror the VO.
const CAPTION_SCENES = new Set(["big-domino", "stack-reveal", "cta"]);

export const Vsl3min: React.FC<{ meta: Meta }> = ({ meta }) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      <Audio src={staticFile("vsl-3min/music.mp3")} volume={0.13} />
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
    case "title":
      // @ts-expect-error
      return <Title title={d.title} subtitle={d.subtitle} />;
    case "hook":
      // @ts-expect-error
      return <Hook lines={d.lines} stamp={d.stamp} />;
    case "big-domino":
      // @ts-expect-error
      return <BigDomino label={d.label} before={d.before} highlight={d.highlight} after={d.after} footnote={d.footnote} />;
    case "magic-bullet": {
      // @ts-expect-error
      const baseBeats = d.beats as Array<Record<string, unknown>>;
      const timings = extractBeatTimings(scene.id, baseBeats.length);
      const beats = baseBeats.map((b, i) => ({ ...b, startSec: timings[i] ?? 0 }));
      // @ts-expect-error
      return <MagicBullet title={d.title} beats={beats} />;
    }
    case "stack-reveal":
      // @ts-expect-error
      return <StackReveal items={d.items} totalValue={d.totalValue} yourPrice={d.yourPrice} />;
    case "cta":
      // @ts-expect-error
      return <CTA headline={d.headline} url={d.url} ctas={d.ctas} />;
    default:
      return null;
  }
}
