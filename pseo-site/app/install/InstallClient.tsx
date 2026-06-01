"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { DataNerdSignoff } from "@/components/DataNerdSignoff";

function escapeHtmlAttr(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/**
 * React 19 strips `javascript:` URLs from `href` attributes for XSS safety,
 * which kills bookmarklets. We render the anchor with raw HTML via
 * dangerouslySetInnerHTML so the href survives, then attach an onClick
 * handler imperatively for the "don't click — drag" hint.
 */
function BookmarkletDragSection({ href }: { href: string }) {
  const wrapRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const a = wrapRef.current?.querySelector("a[data-bookmarklet]");
    if (!a) return;
    const handler = (e: Event) => {
      e.preventDefault();
      alert(
        "Don't click — drag this button onto your bookmarks bar.\n\n" +
          "Tip: press Cmd/Ctrl+Shift+B first to make the bookmarks bar visible.",
      );
    };
    a.addEventListener("click", handler);
    return () => a.removeEventListener("click", handler);
  }, []);

  const html =
    `<a href="${escapeHtmlAttr(href)}" data-bookmarklet draggable="true" ` +
    `aria-label="Drag to bookmarks bar" ` +
    `class="inline-flex items-center gap-2 px-7 py-4 rounded-xl bg-gradient-to-br from-orange-500 to-rose-500 hover:from-orange-400 hover:to-rose-400 text-white font-bold text-lg shadow-lg shadow-orange-500/20 cursor-grab active:cursor-grabbing select-none transition">` +
    `<svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M6 4h12a2 2 0 012 2v15l-8-5.5L4 21V6a2 2 0 012-2z"/></svg>` +
    `GitDealFlow Signal` +
    `</a>`;

  return (
    <section className="mb-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-rose-500/5 p-6 sm:p-10 text-center">
      <p className="text-xs uppercase tracking-wider text-orange-300 font-semibold mb-4">
        Step 1 · Drag this button to your bookmarks bar
      </p>
      <div ref={wrapRef} dangerouslySetInnerHTML={{ __html: html }} />
      <p className="mt-5 text-xs sm:text-sm text-gray-300 max-w-md mx-auto">
        Hold mouse down on the orange button → drag it up onto your bookmarks
        bar → release. That&rsquo;s it.
      </p>
    </section>
  );
}

const SITE = "https://signals.gitdealflow.com";

const BOOKMARKLET_SOURCE =
  `(function(){var u=location;` +
  `if(u.hostname.indexOf('github.com')===-1){` +
  `if(confirm('GitDealFlow Signal works on github.com pages.\\nOpen the GitDealFlow homepage instead?')){` +
  `window.open('${SITE}?utm_source=bookmarklet&utm_medium=offsite','_blank');}return;}` +
  `var p=u.pathname.split('/').filter(Boolean);` +
  `if(p.length<1){alert('Open a GitHub user or repo page first.');return;}` +
  `var o=p[0],r=p[1];` +
  `var t=r` +
  `?'${SITE}/momentum/'+encodeURIComponent(o)+'/'+encodeURIComponent(r)+'?utm_source=bookmarklet&utm_medium=github_repo'` +
  `:'${SITE}/receipts/'+encodeURIComponent(o)+'?utm_source=bookmarklet&utm_medium=github_profile';` +
  `window.open(t,'gitdealflow','width=460,height=720,resizable=yes,scrollbars=yes');})();`;

const BOOKMARKLET_HREF = `javascript:${encodeURIComponent(BOOKMARKLET_SOURCE)}`;

const TWEET_TEXT =
  "I drag-installed a bookmarklet that shows engineering momentum + Scout Score on any github.com page. Zero install, no extension. Free.";
const TWEET_INTENT = `https://x.com/intent/tweet?text=${encodeURIComponent(
  TWEET_TEXT,
)}&url=${encodeURIComponent(`${SITE}/install`)}&via=data_nerd`;

export default function InstallClient() {
  const [copied, setCopied] = useState(false);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <p className="text-orange-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          One-drag install · zero extensions
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">
          See investor signal on every github.com page
        </h1>
        <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl">
          Drag the orange button below to your bookmarks bar. Click it on any
          GitHub profile or repo. A live momentum + Scout Score card opens in a
          side window. Free, works in every browser, no extension store review.
        </p>
      </header>

      <section className="mb-10 rounded-2xl border border-orange-500/30 bg-orange-500/5 p-6 sm:p-8">
        <p className="text-orange-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
          Start with the highest-intent routes
        </p>
        <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
          Use this page if you want the zero-install bookmarklet path. But if your real question is browser extensions, developer docs, or agent pricing, start with the sharper routes first.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/developers" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors">
            Read developer docs →
          </Link>
          <Link href="/badge-builder" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            Build a repo badge →
          </Link>
          <Link href="/agents/credits" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium">
            See agent credits →
          </Link>
        </div>
      </section>

      <BookmarkletDragSection href={BOOKMARKLET_HREF} />

      <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wider text-sky-400 font-semibold mb-4">
          Step 2 · Click it on any github.com page
        </p>
        <ol className="space-y-3 text-sm text-gray-300 leading-relaxed">
          <li className="flex gap-3">
            <span className="font-mono text-sky-400 shrink-0">→</span>
            <span>
              Visit any GitHub profile (e.g.{" "}
              <a
                href="https://github.com/anthropics"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:text-sky-200 underline-offset-2 hover:underline"
              >
                github.com/anthropics
              </a>
              ) or repo page.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-sky-400 shrink-0">→</span>
            <span>
              Click the <strong className="text-gray-100">GitDealFlow Signal</strong>{" "}
              bookmark on your bar.
            </span>
          </li>
          <li className="flex gap-3">
            <span className="font-mono text-sky-400 shrink-0">→</span>
            <span>
              A side window opens with momentum tier, commit velocity change,
              contributor growth, and a one-click <em>Predict their next round</em>{" "}
              button.
            </span>
          </li>
        </ol>
      </section>

      <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/30 p-6 sm:p-8">
        <p className="text-xs uppercase tracking-wider text-gray-300 font-semibold mb-4">
          Can&rsquo;t see your bookmarks bar?
        </p>
        <ul className="space-y-2 text-sm text-gray-300 leading-relaxed">
          <li>
            <strong className="text-gray-100">Chrome / Edge / Brave / Comet:</strong>{" "}
            press <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono">⌘ Shift B</kbd>{" "}
            (Mac) or{" "}
            <kbd className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-xs font-mono">Ctrl Shift B</kbd>{" "}
            (Win/Linux).
          </li>
          <li>
            <strong className="text-gray-100">Firefox:</strong> right-click the
            toolbar → Bookmarks Toolbar → Always Show.
          </li>
          <li>
            <strong className="text-gray-100">Safari:</strong> View menu → Show
            Favorites Bar.
          </li>
          <li>
            <strong className="text-gray-100">Mobile / no bar:</strong> copy the
            source below and create a bookmark manually with this as the URL.
          </li>
        </ul>
      </section>

      <section className="mb-10 rounded-2xl border border-slate-800 bg-slate-900/40 p-5 sm:p-6">
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] uppercase tracking-wider text-gray-300 font-semibold">
            Bookmarklet source (copy if drag fails)
          </p>
          <button
            type="button"
            onClick={async () => {
              try {
                await navigator.clipboard.writeText(BOOKMARKLET_HREF);
                setCopied(true);
                setTimeout(() => setCopied(false), 1600);
              } catch {
                setCopied(false);
              }
            }}
            className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-gray-300 transition"
          >
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
        <pre className="bg-slate-950 border border-slate-800 rounded-md p-3 text-[11px] text-sky-300 overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
          {BOOKMARKLET_HREF}
        </pre>
      </section>

      <section className="mb-10 rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5 sm:p-6">
        <p className="text-emerald-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Got it installed?
        </p>
        <h2 className="text-xl font-bold text-gray-100 mb-2">
          Brag a little. Help us spread it.
        </h2>
        <p className="text-gray-300 text-sm mb-4">
          The bookmarklet works for everyone, but only if they hear about it.
          One tweet helps a lot.
        </p>
        <a
          href={TWEET_INTENT}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium transition"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
          </svg>
          Tweet about it
        </a>
      </section>

      <section className="mb-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link
          href="/badge-builder"
          className="rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition group"
        >
          <p className="text-[10px] uppercase tracking-wider text-sky-400 font-semibold mb-1">
            Repo owners
          </p>
          <p className="text-base font-semibold text-gray-100 group-hover:text-white">
            Drop a Scout Score badge in your README →
          </p>
        </Link>
        <a
          href="https://chromewebstore.google.com/detail/hehkgipiamajnnlpkfhpeoeaoaogmknn"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition group"
        >
          <p className="text-[10px] uppercase tracking-wider text-purple-400 font-semibold mb-1">
            Chrome Extension #1 — Crunchbase + Wellfound
          </p>
          <p className="text-base font-semibold text-gray-100 group-hover:text-white">
            Momentum score on every profile →
          </p>
        </a>
        <a
          href="https://chromewebstore.google.com/detail/vc-github-lookup-%E2%80%94-startu/plgngijmloeljfkenecdkhiblcfcbblm"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition group"
        >
          <p className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold mb-1">
            Chrome Extension #2 — VC GitHub Lookup
          </p>
          <p className="text-base font-semibold text-gray-100 group-hover:text-white">
            Hover any GitHub repo or org for velocity →
          </p>
        </a>
        <a
          href="https://github.com/kindrat86/vc-deal-flow-signal/tree/main/chrome-extension-define"
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-xl border border-slate-800 bg-slate-900/40 hover:bg-slate-900/70 p-5 transition group"
        >
          <p className="text-[10px] uppercase tracking-wider text-cyan-400 font-semibold mb-1">
            Chrome Extension #3 — VC Term Highlighter
          </p>
          <p className="text-base font-semibold text-gray-100 group-hover:text-white">
            Underline VC terms on any page →
          </p>
        </a>
      </section>

      <section className="mb-10 rounded-2xl border border-orange-500/30 bg-gradient-to-br from-orange-500/10 to-rose-500/5 p-6 sm:p-8">
        <p className="text-orange-300 text-xs font-semibold uppercase tracking-[0.14em] mb-2">
          Prefer the whole field ranked for you?
        </p>
        <h2 className="text-xl font-bold text-gray-100 mb-2">
          No install. Open one short read and the teams pulling ahead this
          week are already sorted to the top.
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed mb-4 max-w-2xl">
          The bookmarklet is great when you already have a name to check. If you
          want the call made for you instead &mdash; the standouts surfaced,
          ranked, and explained in plain business language &mdash; start here.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/firstlook"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-400 transition-colors"
          >
            First Look &mdash; one ranked dossier, &euro;7 &rarr;
          </Link>
          <a
            href="https://gitdealflow.com/#signup"
            className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-gray-200 hover:border-slate-500 transition-colors text-sm font-medium"
          >
            Or the free Sunday digest &rarr;
          </a>
        </div>
      </section>

      <section className="text-center text-xs text-gray-300 leading-relaxed">
        <p>
          The bookmarklet is vanilla JavaScript. It only runs when you click
          it, only reads the github.com URL you&rsquo;re currently on, and only
          opens a popup. No background scripts, no telemetry, no install state.
        </p>
      </section>

      <div className="mt-10">
        <DataNerdSignoff variant="compact" />
      </div>
    </div>
  );
}
