"use client";

import { useState } from "react";

interface CertificateFormProps {
  bookTitle: string;
  isbn: string;
}

const SHARE_TEXT = "I just finished the methodology book. Seven public-data signals that predict Series A rounds. Free at signals.gitdealflow.com/book";

/**
 * Reader certificate generator. The reader types their name; we build a PNG
 * URL by passing it to the /api/og/book-certificate endpoint. No server
 * round-trip, no auth — name lives only in the URL and the rendered PNG.
 *
 * Anonymity rule applies to readers, not just the author: nothing about the
 * reader is stored anywhere. Refresh the page and the form is empty.
 */
export function CertificateForm({ bookTitle, isbn: _isbn }: CertificateFormProps) {
  const [name, setName] = useState("");
  const trimmed = name.trim();
  const valid = trimmed.length >= 2 && trimmed.length <= 60;
  const today = new Date().toISOString().slice(0, 10);

  const certUrl = valid
    ? `/api/og/book-certificate?name=${encodeURIComponent(trimmed)}&date=${today}`
    : null;

  const linkedinShare =
    valid && typeof window !== "undefined"
      ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
          `https://signals.gitdealflow.com/book/certificate?name=${encodeURIComponent(trimmed)}`,
        )}`
      : "#";

  const twitterShare =
    valid && typeof window !== "undefined"
      ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          SHARE_TEXT,
        )}&url=${encodeURIComponent(
          `https://signals.gitdealflow.com/book/certificate?name=${encodeURIComponent(trimmed)}`,
        )}`
      : "#";

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 border border-amber-700/40 rounded-xl p-6 space-y-4">
        <label
          htmlFor="reader-name"
          className="block text-amber-300 text-xs font-semibold uppercase tracking-wider"
        >
          Your name (as you want it on the certificate)
        </label>
        <input
          id="reader-name"
          type="text"
          inputMode="text"
          maxLength={60}
          autoComplete="name"
          placeholder="e.g. Alex Morgan"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-lg bg-slate-950 border border-slate-700 text-gray-100 placeholder:text-gray-500 px-4 py-3 focus:border-amber-500 focus:ring-1 focus:ring-amber-500 outline-none"
        />
        <p className="text-xs text-gray-400">
          2–60 characters. No special storage — typed locally, embedded in the
          PNG URL only.
        </p>
      </div>

      {valid && certUrl ? (
        <div className="space-y-5">
          <div className="bg-slate-900/40 border border-slate-800 rounded-xl overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={certUrl}
              alt={`Reader completion certificate for ${trimmed} — ${bookTitle}`}
              width={1200}
              height={630}
              className="w-full h-auto block"
              loading="eager"
            />
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <a
              href={certUrl}
              download={`gitdealflow-book-certificate-${trimmed.replace(/\s+/g, "-").toLowerCase()}.png`}
              className="inline-flex items-center justify-center rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold px-5 py-2.5 text-sm"
            >
              ⬇ Download PNG
            </a>
            <a
              href={linkedinShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-sky-700 hover:border-sky-500 text-sky-200 font-semibold px-5 py-2.5 text-sm"
            >
              Share on LinkedIn
            </a>
            <a
              href={twitterShare}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-slate-700 hover:border-slate-500 text-gray-200 font-semibold px-5 py-2.5 text-sm"
            >
              Share on Twitter
            </a>
          </div>
        </div>
      ) : (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-8 text-center text-gray-400 text-sm">
          The certificate preview appears here once you type your name.
        </div>
      )}
    </div>
  );
}
