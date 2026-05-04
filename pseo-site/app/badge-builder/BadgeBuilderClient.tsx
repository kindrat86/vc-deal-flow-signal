"use client";

import { useState, useMemo, useEffect } from "react";

const SITE = "https://signals.gitdealflow.com";

type CopyKey = string;

function buildScoutBadge(handle: string) {
  const safe = encodeURIComponent(handle);
  const badgeUrl = `${SITE}/api/badge/scout/${safe}/svg`;
  const profileUrl = `${SITE}/receipts/${safe}`;
  return {
    badgeUrl,
    profileUrl,
    markdown: `[![Scout Score](${badgeUrl})](${profileUrl})`,
    html: `<a href="${profileUrl}"><img src="${badgeUrl}" alt="Scout Score" /></a>`,
    bbcode: `[url=${profileUrl}][img]${badgeUrl}[/img][/url]`,
  };
}

function buildMomentumBadge(org: string, repo: string) {
  const o = encodeURIComponent(org);
  const r = encodeURIComponent(repo);
  const badgeUrl = `${SITE}/api/badge/momentum/${o}/${r}/svg`;
  const profileUrl = `${SITE}/`;
  return {
    badgeUrl,
    profileUrl,
    markdown: `[![Commit Momentum](${badgeUrl})](${profileUrl})`,
    html: `<a href="${profileUrl}"><img src="${badgeUrl}" alt="Commit Momentum" /></a>`,
    bbcode: `[url=${profileUrl}][img]${badgeUrl}[/img][/url]`,
  };
}

type BuiltWithVariant = "default" | "compact" | "long";

function buildBuiltWithBadge(variant: BuiltWithVariant) {
  const qs = variant === "default" ? "" : `?variant=${variant}`;
  const badgeUrl = `${SITE}/api/badge/built-with/svg${qs}`;
  const profileUrl = `${SITE}/built-with`;
  const alt =
    variant === "long"
      ? "Built with @gitdealflow/mcp-signal"
      : variant === "compact"
        ? "Built with gitdealflow"
        : "Built with gitdealflow MCP";
  return {
    badgeUrl,
    profileUrl,
    markdown: `[![${alt}](${badgeUrl})](${profileUrl})`,
    html: `<a href="${profileUrl}"><img src="${badgeUrl}" alt="${alt}" /></a>`,
    bbcode: `[url=${profileUrl}][img]${badgeUrl}[/img][/url]`,
  };
}

function buildTweetIntent({ text, url }: { text: string; url: string }): string {
  const t = encodeURIComponent(text);
  const u = encodeURIComponent(url);
  return `https://x.com/intent/tweet?text=${t}&url=${u}&via=data_nerd`;
}

function trackTweetIntent(kind: "scout" | "momentum", handleOrRepo: string) {
  if (typeof window === "undefined") return;
  type PostHogShim = { capture: (event: string, props: Record<string, unknown>) => void };
  const w = window as unknown as { posthog?: PostHogShim };
  if (!w.posthog) return;
  try {
    w.posthog.capture("badge_tweet_intent_click", { kind, target: handleOrRepo.slice(0, 80) });
  } catch {
    // posthog optional; never block the click
  }
}

function TweetIntentButton({
  href,
  onClick,
  label,
}: {
  href: string;
  onClick: () => void;
  label: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className="inline-flex items-center gap-1.5 rounded-md border border-sky-500/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-300 hover:bg-sky-500/20 hover:border-sky-400 transition-colors"
    >
      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
      </svg>
      {label}
    </a>
  );
}

function CopyBlock({
  label,
  value,
  copyKey,
  copiedKey,
  setCopiedKey,
}: {
  label: string;
  value: string;
  copyKey: CopyKey;
  copiedKey: CopyKey | null;
  setCopiedKey: (k: CopyKey | null) => void;
}) {
  const isCopied = copiedKey === copyKey;
  return (
    <div className="mb-4">
      <div className="flex items-center justify-between mb-1">
        <p className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
          {label}
        </p>
        <button
          type="button"
          onClick={async () => {
            try {
              await navigator.clipboard.writeText(value);
              setCopiedKey(copyKey);
              setTimeout(() => setCopiedKey(null), 1600);
            } catch {
              setCopiedKey(null);
            }
          }}
          className="text-xs px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-gray-300 transition"
        >
          {isCopied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="bg-slate-950 border border-slate-800 rounded-md p-3 text-xs text-sky-300 overflow-x-auto whitespace-pre-wrap break-all">
        {value}
      </pre>
    </div>
  );
}

export default function BadgeBuilderClient() {
  const [handle, setHandle] = useState("");
  const [org, setOrg] = useState("");
  const [repo, setRepo] = useState("");
  const [builtWithVariant, setBuiltWithVariant] = useState<BuiltWithVariant>("default");
  const [copiedKey, setCopiedKey] = useState<CopyKey | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const h = params.get("handle");
    if (h) setHandle(h);
    const o = params.get("org");
    const r = params.get("repo");
    if (o) setOrg(o);
    if (r) setRepo(r);
    const v = params.get("variant");
    if (v === "compact" || v === "long" || v === "default") setBuiltWithVariant(v);
  }, []);

  const scout = useMemo(
    () => (handle.trim() ? buildScoutBadge(handle.trim()) : null),
    [handle],
  );
  const momentum = useMemo(
    () =>
      org.trim() && repo.trim()
        ? buildMomentumBadge(org.trim(), repo.trim())
        : null,
    [org, repo],
  );
  const builtWith = useMemo(() => buildBuiltWithBadge(builtWithVariant), [builtWithVariant]);

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <header className="mb-10">
        <p className="text-sky-400 text-xs uppercase tracking-wider mb-2 font-semibold">
          Badge builder
        </p>
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-3">
          Show off your taste in your README
        </h1>
        <p className="text-gray-400 text-base leading-relaxed max-w-2xl">
          Drop a live Scout Score badge into your GitHub profile or a Commit
          Momentum badge into any tracked repo. Auto-updates. Free, no signup.
        </p>
      </header>

      <section className="mb-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-100 mb-1">Scout Score badge</h2>
        <p className="text-sm text-gray-400 mb-5">
          Paste in any GitHub username. Score updates as your starring history
          grows.
        </p>
        <label className="block mb-5">
          <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
            GitHub username
          </span>
          <input
            type="text"
            value={handle}
            onChange={(e) => setHandle(e.target.value)}
            placeholder="torvalds"
            className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-sky-500"
          />
        </label>
        {scout ? (
          <>
            <div className="mb-5 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Live preview
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={scout.badgeUrl}
                alt="Scout Score badge preview"
                className="h-5"
              />
            </div>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
              <TweetIntentButton
                href={buildTweetIntent({
                  text: `My GitDealFlow Scout Score for @${handle.trim()} 👇\n\nProof I called these wins early.`,
                  url: scout.profileUrl,
                })}
                onClick={() => trackTweetIntent("scout", handle.trim())}
                label="Tweet my Scout Score"
              />
              <span className="text-[10px] text-gray-500">
                Pre-filled tweet · opens X compose
              </span>
            </div>
            <CopyBlock
              label="Markdown (README.md)"
              value={scout.markdown}
              copyKey="scout-md"
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
            />
            <CopyBlock
              label="HTML (personal site)"
              value={scout.html}
              copyKey="scout-html"
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
            />
            <CopyBlock
              label="BBCode (forums)"
              value={scout.bbcode}
              copyKey="scout-bb"
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
            />
          </>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Enter a username to generate snippets.
          </p>
        )}
      </section>

      <section className="mb-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8">
        <h2 className="text-lg font-bold text-gray-100 mb-1">
          Commit Momentum badge
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          For repo owners. Renders our live commit-velocity tier (cold / warming
          / hot / breakout). Only works on GitHub orgs we currently track.
        </p>
        <div className="grid grid-cols-2 gap-3 mb-5">
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Org
            </span>
            <input
              type="text"
              value={org}
              onChange={(e) => setOrg(e.target.value)}
              placeholder="vercel"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-sky-500"
            />
          </label>
          <label className="block">
            <span className="block text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
              Repo
            </span>
            <input
              type="text"
              value={repo}
              onChange={(e) => setRepo(e.target.value)}
              placeholder="next.js"
              className="w-full bg-slate-950 border border-slate-700 rounded-md px-3 py-2 text-gray-100 placeholder:text-gray-400 focus:outline-none focus:border-sky-500"
            />
          </label>
        </div>
        {momentum ? (
          <>
            <div className="mb-5 flex items-center gap-3 flex-wrap">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
                Live preview
              </span>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={momentum.badgeUrl}
                alt="Commit Momentum badge preview"
                className="h-5"
              />
            </div>
            <div className="mb-5 flex items-center gap-2 flex-wrap">
              <TweetIntentButton
                href={buildTweetIntent({
                  text: `Tracking GitHub commit momentum on ${org.trim()}/${repo.trim()} 👇\n\nLive engineering signal — auto-updates.`,
                  url: `${SITE}/predict?org=${encodeURIComponent(org.trim())}`,
                })}
                onClick={() => trackTweetIntent("momentum", `${org.trim()}/${repo.trim()}`)}
                label="Tweet this momentum"
              />
              <span className="text-[10px] text-gray-500">
                Pre-filled tweet · opens X compose
              </span>
            </div>
            <CopyBlock
              label="Markdown (README.md)"
              value={momentum.markdown}
              copyKey="mom-md"
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
            />
            <CopyBlock
              label="HTML"
              value={momentum.html}
              copyKey="mom-html"
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
            />
            <CopyBlock
              label="BBCode"
              value={momentum.bbcode}
              copyKey="mom-bb"
              copiedKey={copiedKey}
              setCopiedKey={setCopiedKey}
            />
          </>
        ) : (
          <p className="text-sm text-gray-400 italic">
            Enter org and repo to generate snippets.
          </p>
        )}
      </section>

      <section
        id="built-with"
        className="mb-12 rounded-2xl border border-slate-800 bg-slate-900/50 p-6 sm:p-8"
      >
        <h2 className="text-lg font-bold text-gray-100 mb-1">
          Built-With badge
        </h2>
        <p className="text-sm text-gray-400 mb-5">
          For projects that call our MCP server, signals JSON, or dataset API.
          One ask, permanent backlink. Full landing page at{" "}
          <a
            href="/built-with"
            className="text-sky-400 hover:text-sky-300"
          >
            /built-with
          </a>
          .
        </p>
        <div className="mb-5 flex items-center gap-2 flex-wrap" role="tablist" aria-label="Built-With variant">
          {(["default", "compact", "long"] as BuiltWithVariant[]).map((v) => {
            const isActive = builtWithVariant === v;
            return (
              <button
                key={v}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setBuiltWithVariant(v)}
                className={`text-xs px-3 py-1.5 rounded-md border transition ${
                  isActive
                    ? "border-sky-500 bg-sky-500/15 text-sky-200"
                    : "border-slate-700 bg-slate-950 text-gray-400 hover:border-slate-600 hover:text-gray-200"
                }`}
              >
                {v}
              </button>
            );
          })}
        </div>
        <div className="mb-5 flex items-center gap-3 flex-wrap">
          <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold">
            Live preview
          </span>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={builtWith.badgeUrl}
            alt={`Built-With badge — ${builtWithVariant}`}
            className="h-5"
          />
        </div>
        <CopyBlock
          label="Markdown (README.md)"
          value={builtWith.markdown}
          copyKey={`bw-md-${builtWithVariant}`}
          copiedKey={copiedKey}
          setCopiedKey={setCopiedKey}
        />
        <CopyBlock
          label="HTML (project site)"
          value={builtWith.html}
          copyKey={`bw-html-${builtWithVariant}`}
          copiedKey={copiedKey}
          setCopiedKey={setCopiedKey}
        />
        <CopyBlock
          label="BBCode (forums)"
          value={builtWith.bbcode}
          copyKey={`bw-bb-${builtWithVariant}`}
          copiedKey={copiedKey}
          setCopiedKey={setCopiedKey}
        />
      </section>

      <section className="text-center text-xs text-gray-400 leading-relaxed">
        <p className="mb-2">
          Badges proxy through GitHub&rsquo;s camo CDN, so they cache aggressively
          and revalidate on the hour.
        </p>
        <p>
          All three badges are free and live as long as your repo or profile is
          public. No signup, no telemetry, no tracking pixel.
        </p>
      </section>
    </div>
  );
}
