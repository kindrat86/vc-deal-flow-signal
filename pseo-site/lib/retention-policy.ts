export const CANCELLATION_REASONS = [
  "not_using",
  "too_expensive",
  "too_complex",
  "missing_features",
  "switched_service",
  "low_quality",
  "other",
] as const;

export type CancellationReason = (typeof CANCELLATION_REASONS)[number];
export type SaveAction = "pause_30d" | "one_month_37" | "tailored_starting_point" | "clean_cancel";

export function isCancellationReason(value: unknown): value is CancellationReason {
  return typeof value === "string" && (CANCELLATION_REASONS as readonly string[]).includes(value);
}

export function cancellationReasonFromStripe(value: unknown): CancellationReason {
  return isCancellationReason(value) ? value : "other";
}

export function saveActionForReason(reason: CancellationReason): SaveAction {
  if (reason === "not_using") return "pause_30d";
  if (reason === "too_expensive") return "one_month_37";
  if (reason === "too_complex" || reason === "missing_features") return "tailored_starting_point";
  return "clean_cancel";
}

export function cancellationReasonLabel(reason: CancellationReason): string {
  return {
    not_using: "I'm not using it",
    too_expensive: "Too expensive",
    too_complex: "Too complex",
    missing_features: "Missing features",
    switched_service: "Switched service",
    low_quality: "Low quality",
    other: "Other",
  }[reason];
}

export type WinbackStep = { day: 7 | 30 | 90; subject: string; html: string };

export function winbackSequenceForReason(reason: CancellationReason): WinbackStep[] {
  const label = cancellationReasonLabel(reason).toLowerCase();
  return [
    {
      day: 7,
      subject: "A useful starting point if you want to revisit GitDealFlow",
      html: `<p>You told us you left because of: ${label}.</p><p>If a clearer starting point would help, reply with your sector, geography, check size, and thesis. We will point you to one signal worth reviewing.</p><p><a href="https://signals.gitdealflow.com/login">Open GitDealFlow</a></p>`,
    },
    {
      day: 30,
      subject: "One new GitDealFlow signal that may be relevant",
      html: `<p>A new signal or sector update may be useful for your work now.</p><p>If you want a tailored starting point, reply with your sector and thesis. There is no need to restart unless the work is useful again.</p><p><a href="https://signals.gitdealflow.com/login">See the latest signals</a></p>`,
    },
    {
      day: 90,
      subject: "Resume GitDealFlow when useful",
      html: `<p>This is the last note in this recovery sequence.</p><p>If GitDealFlow becomes useful again, you can resume when it suits you. If not, no action is needed.</p><p><a href="https://signals.gitdealflow.com/pricing">See current access</a></p>`,
    },
  ];
}
