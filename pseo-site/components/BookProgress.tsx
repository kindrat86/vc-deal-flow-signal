"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface BookProgressProps {
  /** Slug of the chapter the user just opened */
  chapterSlug: string;
  /** Number of this chapter in the book (0-indexed) */
  chapterNumber: number;
  /** All chapter slugs in reading order */
  allChapters: { slug: string; title: string; number: number }[];
}

const STORAGE_KEY = "gdf-book-progress-v1";

interface ProgressState {
  read: string[]; // slugs
  startedAt: string; // ISO date
  completedAt?: string; // ISO date
}

function load(): ProgressState {
  if (typeof window === "undefined") {
    return { read: [], startedAt: new Date().toISOString() };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { read: [], startedAt: new Date().toISOString() };
    const parsed = JSON.parse(raw) as ProgressState;
    return {
      read: Array.isArray(parsed.read) ? parsed.read : [],
      startedAt: parsed.startedAt || new Date().toISOString(),
      completedAt: parsed.completedAt,
    };
  } catch {
    return { read: [], startedAt: new Date().toISOString() };
  }
}

function save(state: ProgressState) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage disabled; progress is a nice-to-have, fail silent
  }
}

/**
 * Reader progress tracker. Records chapters opened in localStorage. When the
 * reader has hit every chapter, the completion banner activates and routes
 * to the certificate page.
 *
 * No-server, no-auth, no-cookie design — anonymity rule applies to readers
 * the same way it applies to the founder. The certificate is reader-typed
 * (their name only ever lives in the URL) and never stored.
 */
export function BookProgress({
  chapterSlug,
  chapterNumber,
  allChapters,
}: BookProgressProps) {
  const total = allChapters.length;
  const [state, setState] = useState<ProgressState>(() => ({
    read: [],
    startedAt: new Date().toISOString(),
  }));
  const [hydrated, setHydrated] = useState(false);

  // On mount: load existing state and mark this chapter read.
  useEffect(() => {
    const loaded = load();
    const alreadyRead = loaded.read.includes(chapterSlug);
    const newRead = alreadyRead ? loaded.read : [...loaded.read, chapterSlug];
    const isComplete = newRead.length >= total;
    const next: ProgressState = {
      read: newRead,
      startedAt: loaded.startedAt,
      completedAt:
        loaded.completedAt || (isComplete ? new Date().toISOString() : undefined),
    };
    save(next);
    setState(next);
    setHydrated(true);
  }, [chapterSlug, total]);

  if (!hydrated) {
    // Server render + first client paint show a static placeholder; avoids a
    // hydration flash where progress would briefly show 0.
    return (
      <div
        aria-hidden="true"
        className="mt-10 h-12 rounded-lg border border-slate-800 bg-slate-900/30"
      />
    );
  }

  const readCount = state.read.length;
  const pct = Math.round((readCount / total) * 100);
  const completed = readCount >= total;

  return (
    <section className="mt-10 space-y-3">
      <div className="flex items-baseline justify-between text-xs text-gray-400">
        <span className="font-semibold uppercase tracking-wider text-sky-300">
          Your reading progress
        </span>
        <span>
          {readCount} / {total} chapters · {pct}%
        </span>
      </div>
      <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full transition-all duration-700 ${completed ? "bg-amber-400" : "bg-sky-500"}`}
          style={{ width: `${pct}%` }}
          role="progressbar"
          aria-valuenow={pct}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      <p className="text-xs text-gray-500">
        Tracked locally in your browser only. Nothing is sent to a server. Clear
        site data to reset.
      </p>
      {completed ? (
        <div className="bg-gradient-to-br from-amber-950/40 via-slate-900 to-slate-950 border border-amber-700/50 rounded-xl p-5 mt-2 space-y-3">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
            🎉 Book finished
          </p>
          <p className="text-gray-100 leading-relaxed">
            All {total} chapters read. You earned a completion certificate —
            type your name and download the PNG to share.
          </p>
          <Link
            href="/book/certificate"
            className="inline-flex items-center justify-center rounded-md bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-4 py-2 text-sm"
          >
            Claim your completion certificate →
          </Link>
        </div>
      ) : chapterNumber === total - 1 ? (
        <div className="text-xs text-gray-400 italic mt-1">
          One chapter to go after this one.
        </div>
      ) : null}
    </section>
  );
}
