"use client";

import { useState } from "react";

interface BookShareQuoteProps {
  chapterTitle: string;
  chapterUrl: string;
}

/**
 * Reader-driven shareable quote card. Reader pastes any sentence from the
 * chapter, gets a personalized OG-image link, and one click pre-fills a
 * Tweet / LinkedIn share / Mastodon toot intent.
 *
 * Brunson Cart-Funnel Ch 18 + Traffic-Secrets Ch 14 (other people's
 * distribution): every shared quote card is a one-shot ad with a built-in
 * landing-page URL. Cost to us: zero.
 */
export function BookShareQuote({
  chapterTitle,
  chapterUrl,
}: BookShareQuoteProps) {
  const [quote, setQuote] = useState("");
  const trimmed = quote.trim();
  const enabled = trimmed.length >= 10 && trimmed.length <= 240;

  const ogUrl = enabled
    ? `https://signals.gitdealflow.com/api/og/book-quote?q=${encodeURIComponent(trimmed)}&c=${encodeURIComponent(chapterTitle)}`
    : null;

  const text = enabled ? `“${trimmed}” — ${chapterTitle}` : "";

  const twitterIntent = enabled
    ? `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(chapterUrl)}`
    : "#";

  const linkedinIntent = enabled
    ? `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(chapterUrl)}`
    : "#";

  const mastodonIntent = enabled
    ? `https://mastodon.social/share?text=${encodeURIComponent(text + " " + chapterUrl)}`
    : "#";

  return (
    <section className="mt-12 bg-gradient-to-br from-slate-900/60 via-slate-950 to-slate-950 border border-sky-900/40 rounded-xl p-5 sm:p-6 space-y-4">
      <div className="space-y-1">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          Share an insight
        </p>
        <p className="text-gray-300 text-sm leading-relaxed">
          Paste any sentence from this chapter. We&rsquo;ll render a quote card
          PNG (1200×630) you can post on Twitter, LinkedIn, or Mastodon. The
          chapter URL travels with it.
        </p>
      </div>
      <textarea
        rows={3}
        maxLength={240}
        placeholder="Paste a sentence (10–240 characters)…"
        value={quote}
        onChange={(e) => setQuote(e.target.value)}
        className="w-full rounded-lg bg-slate-950 border border-slate-700 text-gray-100 placeholder:text-gray-500 px-4 py-3 focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none text-sm leading-relaxed resize-none"
      />
      <div className="flex items-center justify-between text-xs text-gray-400">
        <span>{trimmed.length} / 240</span>
        <span>{enabled ? "Ready to share" : "Add 10+ characters"}</span>
      </div>
      {enabled && ogUrl ? (
        <div className="space-y-3">
          <div className="rounded-lg border border-slate-800 overflow-hidden bg-slate-950">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={ogUrl}
              alt={`Quote from ${chapterTitle}`}
              width={1200}
              height={630}
              className="w-full h-auto block"
              loading="lazy"
            />
          </div>
          <div className="flex flex-wrap gap-2.5">
            <a
              href={twitterIntent}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md bg-sky-500 hover:bg-sky-400 text-slate-950 font-semibold px-4 py-2 text-sm"
            >
              Tweet it
            </a>
            <a
              href={linkedinIntent}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-sky-700 hover:border-sky-500 text-sky-200 font-semibold px-4 py-2 text-sm"
            >
              Share on LinkedIn
            </a>
            <a
              href={mastodonIntent}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 font-semibold px-4 py-2 text-sm"
            >
              Toot on Mastodon
            </a>
            <a
              href={ogUrl}
              download={`gitdealflow-quote-${Date.now()}.png`}
              className="inline-flex items-center justify-center rounded-md border border-slate-700 hover:border-slate-500 text-gray-200 font-semibold px-4 py-2 text-sm"
            >
              ⬇ Download PNG
            </a>
          </div>
        </div>
      ) : null}
    </section>
  );
}
