"use client";

import { useState } from "react";

export default function ChallengeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "submitting" | "sent" | "error"
  >("idle");
  const [errMsg, setErrMsg] = useState<string>("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;
    setStatus("submitting");
    setErrMsg("");

    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          cohort: "challenge",
          source: "challenge",
          utm_source: "challenge",
          utm_medium: "landing",
          utm_campaign: "7-day-reset",
          referrer: typeof document !== "undefined" ? document.referrer : "",
          landing_path: "/challenge",
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setErrMsg(data?.error || "Could not send. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
    } catch (err) {
      setErrMsg("Network error. Please try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-xl border border-emerald-700/40 bg-emerald-950/30 p-6 sm:p-8">
        <p className="text-emerald-300 text-sm font-medium mb-2 uppercase tracking-wider">
          Check your inbox
        </p>
        <h2 className="text-gray-100 font-semibold text-lg mb-2">
          We sent a confirmation link to {email}
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Click the link to confirm and Day 1 of the 7-Day Reset lands within
          15 minutes. If you don&rsquo;t see it within a minute, check spam
          and add{" "}
          <code className="text-emerald-200 bg-emerald-900/40 px-1 rounded">
            signal@gitdealflow.com
          </code>{" "}
          to your address book.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-sky-700/40 bg-sky-950/20 p-6 sm:p-8"
    >
      <label
        htmlFor="challenge-email"
        className="block text-gray-100 text-sm font-medium mb-2"
      >
        Start the 7-Day Deal Flow Reset
      </label>
      <p className="text-gray-400 text-xs mb-4 leading-relaxed">
        One signal per day. One 5-minute exercise per day. Day 7 reveals the
        composite. Free, no card, unsubscribe with a reply.
      </p>
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          id="challenge-email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@fund.example"
          className="flex-1 rounded-md bg-slate-950 border border-slate-700 text-gray-100 px-4 py-2.5 text-sm placeholder-gray-500 focus:outline-none focus:border-sky-500"
        />
        <button
          type="submit"
          disabled={status === "submitting"}
          className="inline-flex items-center justify-center px-5 py-2.5 rounded-md bg-sky-500 hover:bg-sky-400 disabled:opacity-60 disabled:cursor-not-allowed text-slate-950 font-semibold text-sm transition-colors"
        >
          {status === "submitting" ? "Sending…" : "Start Day 1 →"}
        </button>
      </div>
      {status === "error" && errMsg ? (
        <p className="text-rose-400 text-xs mt-3">{errMsg}</p>
      ) : null}
      <p className="text-gray-400 text-xs mt-4">
        We send one confirmation email and seven daily emails. We never
        share your address. Unsubscribe by replying.
      </p>
    </form>
  );
}
