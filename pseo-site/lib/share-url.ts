import "server-only";
import { generateShareToken, type SharePayload } from "./share-token";

const SITE = process.env.SITE_URL || "https://signals.gitdealflow.com";

export type ShareKind = SharePayload["k"];

export interface MakeShareUrlOptions {
  sharer: string;
  kind: ShareKind;
  daysValid?: number;
}

export function makeShareUrl(opts: MakeShareUrlOptions): string {
  const token = generateShareToken(opts.sharer || "anon", opts.kind, opts.daysValid);
  return `${SITE}/share/${token}`;
}

export interface ShareIntents {
  shareUrl: string;
  twitterIntent: string;
  linkedinIntent: string;
}

export function makeShareIntents(opts: {
  sharer: string;
  kind: ShareKind;
  text: string;
  daysValid?: number;
}): ShareIntents {
  const shareUrl = makeShareUrl(opts);
  const enc = encodeURIComponent;
  return {
    shareUrl,
    twitterIntent: `https://twitter.com/intent/tweet?text=${enc(opts.text)}&url=${enc(shareUrl)}&via=sipiteno`,
    linkedinIntent: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(shareUrl)}`,
  };
}
