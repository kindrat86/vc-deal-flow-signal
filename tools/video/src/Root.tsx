import React from "react";
import { Composition } from "remotion";
import { Predicted90s } from "./compositions/Predicted90s";
import { Vsl3min } from "./compositions/Vsl3min";
import { ShortMagicBullet } from "./compositions/ShortMagicBullet";
import { DataNerdBrief } from "./compositions/DataNerdBrief";
import { Thumbnail } from "./compositions/Thumbnail";
import { ThumbnailVsl } from "./compositions/ThumbnailVsl";
import predictedMeta from "../out/predicted-90s/script-meta.json";
import vslMeta from "../out/vsl-3min/script-meta.json";
import shortMeta from "../out/short-magic-bullet/script-meta.json";
import briefMeta from "../out/data-nerd-brief/script-meta.json";

const framesFor = (m: { scenes: { durationSec: number }[]; fps: number }) =>
  Math.ceil(m.scenes.reduce((s, x) => s + x.durationSec, 0) * m.fps);

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="Predicted90s"
        component={Predicted90s as React.ComponentType<Record<string, unknown>>}
        durationInFrames={framesFor(predictedMeta)}
        fps={predictedMeta.fps}
        width={predictedMeta.width}
        height={predictedMeta.height}
        defaultProps={{ meta: predictedMeta }}
      />
      <Composition
        id="Vsl3min"
        component={Vsl3min as React.ComponentType<Record<string, unknown>>}
        durationInFrames={framesFor(vslMeta)}
        fps={vslMeta.fps}
        width={vslMeta.width}
        height={vslMeta.height}
        defaultProps={{ meta: vslMeta }}
      />
      <Composition
        id="ShortMagicBullet"
        component={ShortMagicBullet as React.ComponentType<Record<string, unknown>>}
        durationInFrames={framesFor(shortMeta)}
        fps={shortMeta.fps}
        width={shortMeta.width}
        height={shortMeta.height}
        defaultProps={{ meta: shortMeta }}
      />
      <Composition
        id="DataNerdBrief"
        component={DataNerdBrief as React.ComponentType<Record<string, unknown>>}
        durationInFrames={framesFor(briefMeta)}
        fps={briefMeta.fps}
        width={briefMeta.width}
        height={briefMeta.height}
        defaultProps={{ meta: briefMeta }}
      />
      <Composition
        id="ThumbnailPredicted"
        component={Thumbnail}
        durationInFrames={1}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ThumbnailVsl"
        component={ThumbnailVsl}
        durationInFrames={1}
        fps={30}
        width={1280}
        height={720}
      />
    </>
  );
};
