"use client";

import { useState } from "react";

/**
 * Stadium Pitch — RSVP form.
 *
 * POSTs to /api/stadium-pitch/rsvp. Schedules T-24h / T-1h / T-0 reminder
 * emails for the next first-Wednesday-of-the-month drop. Confirmation
 * email lands inside ~30 seconds; reminders queue at Resend.
 *
 * Single email field. No double-opt-in flow — RSVP is a low-stakes
 * commitment ("notify me when this drops"), not a newsletter signup. Users
 * who also want the weekly Sunday digest sign up at gitdealflow.com via
 * the separate flow.
 */

type Status = "idle" | "submitting" | "success" | "error";

type Props = {
  /** Optional UTM source override. Default "state-of-github". */
  source?: string;
  /** Optional className passed to root form/section element. */
  className?: string;
};

export default function StadiumPitchRsvp({
  source = "state-of-github",
  className = "",
}: Props) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [errMsg, setErrMsg] = useState("");
  const [scheduled, setScheduled] = useState<string[]>([]);
  const [dropTimeIso, setDropTimeIso] = useState<string>("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setStatus("submitting");
    setErrMsg("");
    try {
      const res = await fetch("/api/stadium-pitch/rsvp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          referrer: typeof document !== "undefined" ? document.referrer : "",
        }),
      });
      const data = await res
        .json()
        .catch(() => ({ ok: false, error: "Bad response" }));
      if (!res.ok || !data.ok) {
        throw new Error(data.error || `HTTP ${res.status}`);
      }
      setScheduled(Array.isArray(data.scheduled) ? data.scheduled : []);
      setDropTimeIso(typeof data.dropTimeIso === "string" ? data.dropTimeIso : "");
      setStatus("success");
    } catch (err) {
      setStatus("error");
      setErrMsg(err instanceof Error ? err.message : "Network error");
    }
  }

  if (status === "success") {
    return (
      <section
        className={`rounded-xl border border-emerald-700/40 bg-emerald-950/20 p-5 sm:p-6 space-y-3 ${className}`}
        aria-live="polite"
      >
        <p className="text-emerald-300 text-xs font-semibold uppercase tracking-wider">
          RSVP confirmed
        </p>
        <h3 className="text-gray-100 font-semibold text-lg leading-snug">
          You&rsquo;re on the list for the next drop.
        </h3>
        <p className="text-gray-300 text-sm leading-relaxed">
          Confirmation just landed at{" "}
          <strong className="text-emerald-200">{email}</strong>.
          {scheduled.length > 0 && (
            <> We&rsquo;ll send you {scheduled.length} reminder
              {scheduled.length === 1 ? "" : "s"} ahead of the drop —
              {" "}
              {scheduled.join(", ")}.
            </>
          )}
        </p>
        <p className="text-gray-400 text-xs leading-relaxed pt-1">
          Add the recurring monthly drop to your calendar via the{" "}
          <a
            href="/api/stadium-pitch/calendar.ics"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
            download="state-of-github.ics"
          >
            .ics calendar invite
          </a>
          .
        </p>
      </section>
    );
  }

  const submitting = status === "submitting";
  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-xl border-2 border-emerald-700/40 bg-gradient-to-br from-emerald-950/20 via-slate-950 to-slate-950 p-5 sm:p-6 space-y-4 ${className}`}
    >
      <div className="space-y-1.5">
        <label
          htmlFor="stadium-pitch-rsvp-email"
          className="block text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]"
        >
          RSVP — get the next drop in your inbox at the live moment
        </label>
        <p className="text-gray-400 text-xs leading-relaxed">
          Three reminders (T-24h, T-1h, the drop). No weekly newsletter, no
          drip. Just the Stadium Pitch reminder cadence — separate list from
          the Sunday digest.
        </p>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          id="stadium-pitch-rsvp-email"
          type="email"
          inputMode="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={submitting}
          placeholder="you@yourfund.com"
          className="flex-1 rounded-md border border-slate-700 bg-slate-900 text-gray-100 text-base px-3 py-2.5 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={submitting || !email}
          className="rounded-md bg-emerald-600 hover:bg-emerald-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-semibold text-sm px-5 py-2.5 transition-colors"
        >
          {submitting ? "RSVPing…" : "RSVP for the drop"}
        </button>
      </div>
      {status === "error" && (
        <p className="text-rose-400 text-xs" role="alert">
          {errMsg || "Something went wrong. Try again?"}
        </p>
      )}
    </form>
  );
}
