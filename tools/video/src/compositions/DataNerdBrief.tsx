import React from "react";
import { AbsoluteFill, Audio, Sequence, staticFile } from "remotion";
import { ShortHook } from "../scenes/ShortHook";
import { ShortTimeline } from "../scenes/ShortTimeline";
import { ShortCTA } from "../scenes/ShortCTA";
import { WordCaption, type Word } from "../scenes/WordCaption";
import captions from "../../out/data-nerd-brief/captions.json";

/**
 * DataNerdBrief — recurring 60-second Short delivering one persona-anchored
 * observation per week. Brunson Expert Secrets Ch 3 (Charismatic Leader):
 * the recurring character moment that runs on a different beat from the
 * Monday Acceleration Watch (which is data-shaped, not character-shaped).
 *
 * Beat: Wed 14:07 UTC. Same voice (Cartesia Theo). Same brand visual
 * treatment as ShortMagicBullet, but the Hook stamp says THE DATA NERD
 * and the timeline carries one specific observation, not a demo timeline.
 */

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

export const DataNerdBrief: React.FC<{ meta: Meta }> = ({ meta }) => {
  let cursor = 0;
  return (
    <AbsoluteFill style={{ backgroundColor: "#020617" }}>
      <Audio src={staticFile("data-nerd-brief/music.mp3")} volume={0.13} />
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
  // Brief timeline beats start on numeric/keyword anchors emitted by the VO.
  // Use "this", "first", "second", "third" or numeric markers as anchors.
  const anchors = new Set(["this", "first", "second", "third", "one", "two", "three"]);
  const times: number[] = [];
  for (const w of words) {
    const t = w.text.toLowerCase().replace(/[.,!?]/g, "");
    if (anchors.has(t) || /^\d+$/.test(t)) times.push(w.fromMs / 1000);
  }
  return times.slice(0, beatCount);
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
      const beats = baseBeats.map((b, i) => ({ ...b, startSec: timings[i] ?? i * 6 }));
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
