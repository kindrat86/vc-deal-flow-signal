"use client";

import type { DreamCustomer } from "@/lib/dream-customers-types";
import { SegmentChip, ConfidenceChip } from "./SegmentChip";

interface Props {
  row: DreamCustomer;
  onDragStart: (id: string) => void;
  onDragEnd: () => void;
  onIncrement: (id: string, delta: 1 | -1) => void;
  onEdit: (id: string) => void;
  dragging: boolean;
}

export default function Card({
  row,
  onDragStart,
  onDragEnd,
  onIncrement,
  onEdit,
  dragging,
}: Props) {
  return (
    <article
      draggable
      onDragStart={(e) => {
        e.dataTransfer.effectAllowed = "move";
        e.dataTransfer.setData("text/plain", row.id);
        onDragStart(row.id);
      }}
      onDragEnd={onDragEnd}
      className={`group rounded-lg border border-neutral-800 bg-neutral-900 p-2.5 text-sm shadow-sm cursor-grab active:cursor-grabbing transition ${
        dragging ? "opacity-40" : "hover:border-neutral-700"
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="font-medium text-neutral-100 truncate">{row.name}</div>
          <a
            href={row.url || `https://x.com/${row.handle}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="text-xs text-sky-400 hover:text-sky-300 hover:underline truncate block"
            draggable={false}
          >
            @{row.handle}
          </a>
        </div>
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onEdit(row.id);
          }}
          className="text-neutral-500 hover:text-neutral-200 text-xs opacity-0 group-hover:opacity-100 transition"
          aria-label={`Edit ${row.name}`}
        >
          ✎
        </button>
      </div>

      {(row.firm || row.role) && (
        <div className="mt-1 text-[11px] text-neutral-400 truncate">
          {[row.firm, row.role].filter(Boolean).join(" · ")}
        </div>
      )}

      <div className="mt-2 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <SegmentChip value={row.segment} />
          <ConfidenceChip value={row.confidence} />
        </div>
        <div className="flex items-center gap-1 text-[11px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncrement(row.id, -1);
            }}
            disabled={row.comment_count <= 0}
            className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed text-neutral-300"
            aria-label="Decrement comment count"
          >
            −
          </button>
          <span
            className="min-w-[1.5rem] text-center font-mono text-neutral-300"
            title="Comments left on their posts"
          >
            {row.comment_count}
          </span>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onIncrement(row.id, 1);
            }}
            className="w-5 h-5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
            aria-label="Increment comment count"
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}
