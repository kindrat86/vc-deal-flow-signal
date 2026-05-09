import { dataNerdManifest } from "@/lib/data-nerd-manifest";

/**
 * Brunson Expert Secrets §4 Ch 17 — The Closer.
 *
 * Closer canon in the Trilogy is voice (and ideally video): a human voice
 * walking the buyer through the offer at the moment of decision, naming
 * the obvious objections and reframing them. The chapter scoring deduction
 * the audit returned for this site was specifically: "you're optimizing for
 * written + async, which preserves anonymity but loses urgency."
 *
 * This component is the anonymity-compatible substitute. It ships:
 *
 *   1. A synthetic-voice audio block (Cartesia "sonic-2", The Data Nerd voice)
 *      that plays the closer message inline. Audio is gated on the manifest
 *      entry existing; until the render lands, the block falls back to (2).
 *
 *   2. A written transcript styled as a phone-close, with the same beats a
 *      live closer would hit: open with the buyer's hesitation, name the
 *      three objections in order, answer each one in 1–2 sentences, land on
 *      the asymmetric-bet close.
 *
 * Anonymity rule: synthetic voice only. No real founder voice ever.
 *
 * Internal-only Brunson framework references stay in this comment.
 * Customer copy uses plain English ("founder note") on every visible
 * surface.
 */

type Beat = {
  readonly heading: string;
  readonly body: string;
};

interface Props {
  /** Manifest slug — also the script filename in tools/audio/scripts/. */
  readonly slug: string;
  /** Pre-headline above the block, e.g. "If you're on the fence". */
  readonly eyebrow: string;
  /** Title shown in the player + transcript header. */
  readonly title: string;
  /** Opening lead-in that anchors the buyer's hesitation. */
  readonly opener: string;
  /** Three closer beats — Money / Identity / Urgency, in plain English. */
  readonly beats: readonly [Beat, Beat, Beat];
  /** Final ask line that sends them back to the form/buy-link. */
  readonly close: string;
  /** Anchor the close points to — "#brief", form id, etc. */
  readonly closeHref: string;
  /** Visible label on the close link. */
  readonly closeLabel: string;
}

function formatDuration(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = Math.round(sec % 60);
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

export function CloserVoiceNote({
  slug,
  eyebrow,
  title,
  opener,
  beats,
  close,
  closeHref,
  closeLabel,
}: Props) {
  const clip = dataNerdManifest.clips[slug];
  const hasAudio = Boolean(clip && clip.durationSec);
  const audioSrc = `/audio/data-nerd/${slug}.mp3`;
  const durLabel = hasAudio ? formatDuration(clip!.durationSec) : null;

  const audioJsonLd = hasAudio
    ? {
        "@context": "https://schema.org",
        "@type": "AudioObject",
        contentUrl: `https://signals.gitdealflow.com${audioSrc}`,
        encodingFormat: "audio/mpeg",
        duration: `PT${Math.max(1, Math.round(clip!.durationSec))}S`,
        inLanguage: "en",
        name: title,
        creator: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#author",
          name: "The Data Nerd",
          url: "https://signals.gitdealflow.com/about/founder",
        },
        isAccessibleForFree: true,
        description:
          "Synthetic narration by The Data Nerd (Cartesia text-to-speech). The on-page closer note for this offer. No live founder voice — synthetic voice convention applies.",
      }
    : {
        "@context": "https://schema.org",
        "@type": "CreativeWork",
        name: title,
        creator: {
          "@type": "Person",
          "@id": "https://signals.gitdealflow.com/about#author",
          name: "The Data Nerd",
        },
        text: [opener, ...beats.map((b) => b.body), close].join(" "),
      };

  return (
    <section
      aria-label="Closer note from the founder"
      className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/15 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5"
      data-speakable
    >
      <header className="space-y-2">
        <p className="text-amber-300 text-[11px] font-semibold uppercase tracking-wider">
          {eyebrow}
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          {title}
        </h2>
      </header>

      {hasAudio ? (
        <div className="rounded-lg border border-amber-500/30 bg-slate-900/50 p-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
              🎧 Listen — synthetic narration
            </span>
            <span className="text-gray-400 text-xs">· {durLabel}</span>
          </div>
          <audio controls preload="none" className="w-full" src={audioSrc}>
            Your browser does not support audio playback.
          </audio>
          <p className="text-gray-500 text-[11px] leading-relaxed">
            Synthetic voice (Cartesia). Same voice across every page narration.
            There is no live founder voice — the methodology is the protagonist.
          </p>
        </div>
      ) : null}

      <div className="space-y-3 text-gray-200 text-base leading-relaxed">
        <p className="text-gray-300 italic">{opener}</p>
        <ol className="space-y-3 mt-3">
          {beats.map((b, i) => (
            <li
              key={b.heading}
              className="rounded-lg border border-slate-800 bg-slate-900/40 p-4 space-y-1"
            >
              <p className="text-amber-300 text-[10px] font-semibold uppercase tracking-wider">
                {String(i + 1).padStart(2, "0")} · {b.heading}
              </p>
              <p className="text-gray-200 text-sm sm:text-base leading-relaxed">
                {b.body}
              </p>
            </li>
          ))}
        </ol>
        <p className="text-gray-100 font-semibold pt-2">{close}</p>
      </div>

      <div className="pt-1">
        <a
          href={closeHref}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm transition-colors"
        >
          {closeLabel} <span aria-hidden="true">&rarr;</span>
        </a>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(audioJsonLd) }}
      />
    </section>
  );
}
