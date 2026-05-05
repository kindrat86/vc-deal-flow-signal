"use client";

import { useState, useEffect } from "react";

type Prediction = "yes" | "no";

interface Props {
  prefilledOrg?: string;
}

export default function ScoutCallForm({ prefilledOrg }: Props) {
  const [githubOrg, setGithubOrg] = useState("");
  const [prediction, setPrediction] = useState<Prediction | null>(null);
  const [email, setEmail] = useState("");
  const [confidence, setConfidence] = useState<number>(70);
  const [rationale, setRationale] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [predictionId, setPredictionId] = useState("");
  const [shareUrl, setShareUrl] = useState("");
  const [scoutHandle, setScoutHandle] = useState("");
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    if (prefilledOrg) setGithubOrg(prefilledOrg);
  }, [prefilledOrg]);

  function normalizeOrg(raw: string): string {
    const trimmed = raw.trim();
    const match = trimmed.match(
      /^(?:https?:\/\/)?(?:www\.)?github\.com\/([^/?#]+)/i,
    );
    if (match) return match[1];
    return trimmed.replace(/^@/, "");
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrorMessage("");
    if (!githubOrg.trim()) {
      setErrorMessage("Paste a GitHub org or repo URL.");
      return;
    }
    if (!prediction) {
      setErrorMessage("Pick yes or no.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Add your email so we can notify you when it resolves.");
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/scout/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          githubOrg: normalizeOrg(githubOrg),
          prediction,
          email: email.trim().toLowerCase(),
          confidence,
          rationale: rationale.trim().slice(0, 500),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus("error");
        setErrorMessage(data.error || "Something went wrong.");
        return;
      }
      setPredictionId(data.predictionId || "");
      setShareUrl(data.shareUrl || "");
      setScoutHandle(data.handle || "");
      setStatus("success");
    } catch {
      setStatus("error");
      setErrorMessage("Network error. Try again in a moment.");
    }
  }

  if (status === "success") {
    const shareOrg = normalizeOrg(githubOrg);
    const fallbackUrl = `https://signals.gitdealflow.com/predict?org=${encodeURIComponent(shareOrg)}&utm_source=share&utm_medium=scout_call&utm_campaign=prediction_${predictionId || "v1"}`;
    const effectiveShareUrl = shareUrl || fallbackUrl;
    const shareText = `Just locked in my scout call on ${shareOrg}: ${prediction?.toUpperCase()} on raising in 6 months. ${confidence}% confidence.${scoutHandle ? ` (@${scoutHandle} on @data_nerd's GitDealFlow.)` : ""}\n\nPlay the game, pick a startup. The recipient gets a 7-day extended preview:`;
    const xHref = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(effectiveShareUrl)}`;
    const linkedinHref = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(effectiveShareUrl)}`;

    return (
      <div className="rounded-xl border border-emerald-500/40 bg-emerald-500/5 p-6">
        <p className="text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
          Prediction locked in
        </p>
        <h3 className="text-xl font-bold text-gray-100 mb-3">
          Call received. You are now a Curious-rank scout.
        </h3>
        <p className="text-gray-300 text-sm mb-3">
          Your prediction on{" "}
          <span className="font-mono text-emerald-400">{shareOrg}</span>:{" "}
          <strong className="uppercase">{prediction}</strong> (raise in next 6
          months).
        </p>
        {predictionId && (
          <p className="text-gray-400 text-xs font-mono mb-3">
            Prediction ID: {predictionId}
          </p>
        )}
        <p className="text-gray-300 text-sm mb-4">
          Confirmation email sent. We will ping you when the call resolves (the
          moment funding is announced, or when the 6-month window closes).
        </p>

        <div className="mt-4 pt-4 border-t border-emerald-500/20">
          <p className="text-emerald-300 text-xs font-mono uppercase tracking-wider mb-2">
            Stake your call publicly
          </p>
          <p className="text-gray-400 text-xs mb-3">
            Scouts who share rank faster. Top 1% earn an Oracle badge.
          </p>
          <div className="flex flex-wrap gap-2">
            <a
              href={xHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-black hover:bg-gray-800 text-white text-xs font-medium rounded-md transition"
            >
              Share on X
            </a>
            <a
              href={linkedinHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-[#0A66C2] hover:bg-[#084d94] text-white text-xs font-medium rounded-md transition"
            >
              Share on LinkedIn
            </a>
            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(effectiveShareUrl);
                setCopyState("copied");
                setTimeout(() => setCopyState("idle"), 1600);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-2 bg-slate-800 hover:bg-slate-700 text-gray-200 text-xs font-medium rounded-md transition"
            >
              {copyState === "copied" ? "Copied ✓" : "Copy link"}
            </button>
          </div>
          {shareUrl ? (
            <p className="text-emerald-300/70 text-[11px] mt-3 leading-relaxed">
              Each share grants the recipient a 7-day extended preview of the live signal index. They get value, you get reach.
            </p>
          ) : null}
        </div>

        <button
          onClick={() => {
            setStatus("idle");
            setGithubOrg(prefilledOrg ?? "");
            setPrediction(null);
            setRationale("");
            setPredictionId("");
            setShareUrl("");
            setScoutHandle("");
          }}
          className="mt-4 inline-block px-4 py-2 bg-sky-700 hover:bg-sky-600 text-white text-sm font-medium rounded-lg transition"
        >
          Make another prediction
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-xl border border-slate-800 bg-slate-900/80 p-6 space-y-5"
    >
      <div>
        <label
          htmlFor="scout-github-org"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          GitHub org or repo
        </label>
        <input
          id="scout-github-org"
          type="text"
          value={githubOrg}
          onChange={(e) => setGithubOrg(e.target.value)}
          placeholder="vercel  or  github.com/vercel  or  vercel/next.js"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
          autoComplete="off"
        />
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-200 mb-2">
          Will this team raise a round in the next 6 months?
        </legend>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => setPrediction("yes")}
            className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
              prediction === "yes"
                ? "bg-emerald-600 text-white ring-2 ring-emerald-400"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }`}
          >
            Yes, they raise
          </button>
          <button
            type="button"
            onClick={() => setPrediction("no")}
            className={`py-3 px-4 rounded-lg font-semibold text-sm transition ${
              prediction === "no"
                ? "bg-rose-600 text-white ring-2 ring-rose-400"
                : "bg-slate-800 text-gray-300 hover:bg-slate-700"
            }`}
          >
            No, they don&rsquo;t
          </button>
        </div>
      </fieldset>

      <div>
        <label
          htmlFor="scout-confidence"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Confidence:{" "}
          <span className="font-mono text-sky-400">{confidence}%</span>
        </label>
        <input
          id="scout-confidence"
          type="range"
          min={50}
          max={99}
          value={confidence}
          onChange={(e) => setConfidence(Number(e.target.value))}
          className="w-full accent-sky-500"
        />
        <p className="text-xs text-gray-400 mt-1">
          50% = coin flip. 99% = bet the house. High-confidence correct calls
          earn more rank points.
        </p>
      </div>

      <div>
        <label
          htmlFor="scout-rationale"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Why? <span className="text-gray-400">(optional, 500 chars)</span>
        </label>
        <textarea
          id="scout-rationale"
          value={rationale}
          onChange={(e) => setRationale(e.target.value.slice(0, 500))}
          placeholder="What made you call this? Commits, hiring, deploy cadence, something you noticed..."
          rows={3}
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label
          htmlFor="scout-email"
          className="block text-sm font-medium text-gray-200 mb-2"
        >
          Your email
        </label>
        <input
          id="scout-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          className="w-full rounded-lg border border-slate-700 bg-slate-950 px-4 py-2.5 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-sky-500"
          required
          autoComplete="email"
        />
        <p className="text-xs text-gray-400 mt-1">
          Used to notify you when your call resolves + to track your scout
          profile. No spam.
        </p>
      </div>

      {errorMessage && (
        <p className="text-rose-400 text-sm" role="alert">
          {errorMessage}
        </p>
      )}

      <button
        type="submit"
        disabled={status === "submitting"}
        className="w-full py-3 px-4 bg-sky-700 hover:bg-sky-600 disabled:bg-slate-700 text-white font-semibold rounded-lg transition"
      >
        {status === "submitting" ? "Locking in..." : "Lock in prediction"}
      </button>

      <p className="text-xs text-gray-400 text-center">
        Free tier: 3 predictions per week. Paid tier removes the cap.
      </p>
    </form>
  );
}
