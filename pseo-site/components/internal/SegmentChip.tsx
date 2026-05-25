"use client";

const SEGMENT_STYLES: Record<string, string> = {
  A: "bg-indigo-500/15 text-indigo-300 ring-indigo-500/40",
  B: "bg-emerald-500/15 text-emerald-300 ring-emerald-500/40",
  D: "bg-amber-500/15 text-amber-300 ring-amber-500/40",
  F: "bg-rose-500/15 text-rose-300 ring-rose-500/40",
};

const SEGMENT_NAMES: Record<string, string> = {
  A: "Solo GP",
  B: "Partner",
  D: "Family Office",
  F: "Platform",
};

export function SegmentChip({ value }: { value: string }) {
  if (!value) return null;
  const style = SEGMENT_STYLES[value] ?? "bg-neutral-500/15 text-neutral-300 ring-neutral-500/40";
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium ring-1 ring-inset ${style}`}
      title={SEGMENT_NAMES[value] ?? value}
    >
      {value}
    </span>
  );
}

const CONFIDENCE_STYLES: Record<string, string> = {
  HIGH: "border-green-500/60 text-green-300",
  MEDIUM: "border-yellow-500/60 text-yellow-300 border-dashed",
  LOW: "border-neutral-600 text-neutral-500 border-dotted",
};

export function ConfidenceChip({ value }: { value: string }) {
  if (!value) return null;
  const style = CONFIDENCE_STYLES[value] ?? "border-neutral-600 text-neutral-400";
  return (
    <span
      className={`inline-flex items-center rounded px-1.5 py-0.5 text-[10px] uppercase tracking-wide border ${style}`}
      title={`Confidence: ${value}`}
    >
      {value.toLowerCase()}
    </span>
  );
}
