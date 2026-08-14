"use client";

import { useState } from "react";

// Brunson DotCom Secrets Ch 13 ("Best Bait"), pre-checkout sector capture.
// Every visitor who reaches this form has self-identified as
// "I'd actually buy this if X sector is covered." Capturing email + sector
// here, before they hit Stripe, gives us:
//   1. a list segmented by sector intent (warm-up content, not cold);
//   2. permission to pre-warm the engine for that sector;
//   3. a soft commitment that increases the probability of completing
//      checkout (the foot-in-the-door technique).
//
// POSTs to /api/firstlook/intent. Idempotent: same email × sector inside
// 7 days = single intent record (the API de-dups). Falls open to the
// public Stripe checkout if the API is down (no hard dependency).

const SECTORS: ReadonlyArray<{ key: string; label: string }> = [
  { key: "ai-ml", label: "AI / ML" },
  { key: "ai-infra", label: "AI infrastructure" },
  { key: "ai-safety", label: "AI safety" },
  { key: "climate-tech", label: "Climate tech" },
  { key: "crypto-web3", label: "Crypto / Web3" },
  { key: "cybersecurity", label: "Cybersecurity" },
  { key: "data-infra", label: "Data infrastructure" },
  { key: "dev-tools", label: "Developer tools" },
  { key: "edtech", label: "EdTech" },
  { key: "fintech-rails", label: "Fintech rails" },
  { key: "future-of-work", label: "Future of work" },
  { key: "gaming", label: "Gaming" },
  { key: "healthtech", label: "Healthtech" },
  { key: "identity", label: "Identity / auth" },
  { key: "observability", label: "Observability" },
  { key: "open-source-tooling", label: "Open-source tooling" },
  { key: "robotics", label: "Robotics" },
  { key: "saas-infra", label: "SaaS infrastructure" },
  { key: "vertical-ai", label: "Vertical AI" },
];

type Status = "idle" | "submitting" | "success" | "error";

export default function SectorIntent({
  source = "firstlook-page",
}: {
  source?: string;
}) {
  const [email, setEmail] = useState("");
  const [sector, setSector] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");
  // Honeypot, hidden from humans; bots that fill it get a silent fake
  // success from the API (mirrors the subscribe form's "website" field).
  const [website, setWebsite] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "submitting") return;

    if (!email || !sector) {
      setStatus("error");
      setMessage("Pick a sector and enter your email, both are required.");
      return;
    }

    setStatus("submitting");
    setMessage("");

    try {
      const res = await fetch("/api/firstlook/intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, sector, source, website }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setStatus("error");
        setMessage(
          data.error === "invalid_email"
            ? "That email doesn't look right, check for typos."
            : data.error === "invalid_sector"
            ? "Pick one of the sectors from the list."
            : "Something hiccupped. Skip ahead and check out, Stripe will capture your email and we can lock the sector on the order field.",
        );
        return;
      }
      setStatus("success");
      setMessage(
        data.replay
          ? `Already locked, your ${SECTORS.find((s) => s.key === sector)?.label} intent is on file. Continue to checkout below.`
          : `${SECTORS.find((s) => s.key === sector)?.label} locked. We'll pre-warm the panel, continue to checkout below.`,
      );
    } catch {
      setStatus("error");
      setMessage(
        "Network glitch. Skip the form and continue to checkout, Stripe will capture both fields.",
      );
    }
  }

  const isSuccess = status === "success";

  return (
    <section
      aria-label="Sector pre-capture, lock your sector before checkout"
      className="rounded-xl border-2 border-violet-500/40 bg-gradient-to-br from-violet-950/30 via-slate-900 to-slate-950 p-5 sm:p-7 space-y-5"
    >
      <header className="space-y-1.5">
        <p className="text-violet-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
          Step 1 of 2 · pre-capture · 30 seconds
        </p>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-100 leading-snug">
          Lock your sector first. Checkout second.
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          Naming the sector before checkout lets the engine pre-warm the
          panel, your 24-hour clock starts at full speed instead of cold.
          The form is non-binding; you can change the sector on the Stripe
          order field if you change your mind.
        </p>
      </header>

      {isSuccess ? (
        <div className="rounded-lg border-2 border-emerald-500/50 bg-emerald-950/30 p-4 sm:p-5 space-y-2">
          <p className="text-emerald-300 text-[10px] sm:text-xs font-semibold uppercase tracking-wider">
            ✓ Sector locked · pre-warm started
          </p>
          <p className="text-emerald-100 text-sm leading-relaxed">{message}</p>
          <a
            href="#cart"
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm px-4 py-2.5 mt-2"
          >
            Continue to checkout · €7 →
          </a>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="space-y-4"
          noValidate
        >
          <div className="space-y-1.5">
            <label
              htmlFor="firstlook-intent-email"
              className="text-gray-200 text-sm font-semibold"
            >
              Your email
            </label>
            <input
              id="firstlook-intent-email"
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@yourthesis.com"
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-gray-100 placeholder:text-slate-600 focus:border-violet-500 focus:outline-none text-sm"
              disabled={status === "submitting"}
            />
            <p className="text-slate-500 text-xs leading-relaxed">
              Same email you&rsquo;ll use at Stripe. We pre-warm under this
              key so the panel is ready when payment lands.
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="firstlook-intent-sector"
              className="text-gray-200 text-sm font-semibold"
            >
              Sector
            </label>
            <select
              id="firstlook-intent-sector"
              name="sector"
              required
              value={sector}
              onChange={(e) => setSector(e.target.value)}
              className="w-full rounded-lg border border-slate-700 bg-slate-950/60 px-3 py-2.5 text-gray-100 focus:border-violet-500 focus:outline-none text-sm"
              disabled={status === "submitting"}
            >
              <option value="" disabled>
                Pick one of 19 tracked sectors…
              </option>
              {SECTORS.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.label}
                </option>
              ))}
            </select>
            <p className="text-slate-500 text-xs leading-relaxed">
              Your thesis cuts across? Pick the closest match. The order
              field at Stripe lets you note the cross-sector cut and we
              pivot the report accordingly.
            </p>
          </div>

          {/* Honeypot, hidden from humans, bots fill it and get ignored */}
          <div className="hidden" aria-hidden="true">
            <label htmlFor="firstlook-intent-website">Website</label>
            <input
              id="firstlook-intent-website"
              name="website"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
            />
          </div>

          {status === "error" && message ? (
            <p
              role="alert"
              className="rounded-lg border border-rose-700/50 bg-rose-950/30 px-3 py-2 text-rose-200 text-xs leading-relaxed"
            >
              {message}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 rounded-lg bg-violet-500 hover:bg-violet-400 disabled:opacity-50 disabled:cursor-not-allowed text-slate-950 font-bold text-sm px-5 py-2.5 transition-colors"
          >
            {status === "submitting" ? "Locking sector…" : "Lock sector → continue to checkout"}
          </button>
          <p className="text-slate-500 text-xs leading-relaxed border-t border-slate-800 pt-3">
            Skip the pre-capture if you&rsquo;re ready to check out, the
            cart below works without this step. The pre-capture is purely
            for engine warm-up and sector-segmented follow-up if you don&rsquo;t
            complete checkout today.
          </p>
        </form>
      )}
    </section>
  );
}
