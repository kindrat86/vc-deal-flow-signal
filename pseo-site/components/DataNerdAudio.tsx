import { dataNerdManifest } from "@/lib/data-nerd-manifest";

type Props = {
  slug: string;
  label?: string;
  subtitle?: string;
  variant?: "page" | "compact";
};

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

function audioObjectJsonLd(slug: string, durationSec: number) {
  return {
    "@context": "https://schema.org",
    "@type": "AudioObject",
    contentUrl: `https://signals.gitdealflow.com/audio/data-nerd/${slug}.mp3`,
    encodingFormat: "audio/mpeg",
    duration: `PT${Math.max(1, Math.round(durationSec))}S`,
    inLanguage: "en",
    creator: {
      "@type": "Person",
      "@id": "https://signals.gitdealflow.com/about#person",
      name: "The Data Nerd",
      url: "https://signals.gitdealflow.com/about/founder",
    },
    isAccessibleForFree: true,
    description: "Synthetic narration by The Data Nerd (Cartesia text-to-speech). Voice consistent across YouTube, email-audio, and on-page narrations.",
  };
}

export function DataNerdAudio({
  slug,
  label = "Listen — The Data Nerd reads this aloud",
  subtitle,
  variant = "page",
}: Props) {
  const clip = dataNerdManifest.clips[slug];
  if (!clip || !clip.durationSec) return null;

  const src = `/audio/data-nerd/${slug}.mp3`;
  const durLabel = formatDuration(clip.durationSec);
  const isCompact = variant === "compact";

  return (
    <div
      className={
        isCompact
          ? "my-3 rounded-md border border-slate-800 bg-slate-900/40 px-3 py-2"
          : "my-5 rounded-lg border border-sky-500/30 bg-slate-900/50 p-4"
      }
    >
      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-sky-400 text-xs font-semibold uppercase tracking-wider">
          🎧 {label}
        </span>
        <span className="text-gray-400 text-xs">· {durLabel}</span>
      </div>
      <audio controls preload="none" className="w-full" src={src}>
        Your browser does not support audio playback.
      </audio>
      {subtitle ? (
        <p className="text-gray-400 text-xs mt-2">{subtitle}</p>
      ) : null}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(audioObjectJsonLd(slug, clip.durationSec)),
        }}
      />
    </div>
  );
}
