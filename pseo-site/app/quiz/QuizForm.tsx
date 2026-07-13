"use client";

import { useState } from "react";
import type { ArchetypeId } from "@/content/archetypes";

type AnswerKey = "F" | "T" | "D" | "I"; // Free / Tripwire / Dashboard / Insider

interface Question {
  id: string;
  prompt: string;
  options: { label: string; route: AnswerKey }[];
}

interface ArchetypeQuestion {
  id: "archetype";
  prompt: string;
  options: { label: string; route: ArchetypeId }[];
}

const QUESTIONS: Question[] = [
  {
    id: "checks",
    prompt: "Roughly how many angel checks have you written in the past 12 months?",
    options: [
      { label: "Zero or one — I'm exploring", route: "F" },
      { label: "Two to five — building cadence", route: "T" },
      { label: "Six to twenty — actively sourcing", route: "D" },
      { label: "Twenty-plus, or I run a fund / syndicate", route: "I" },
    ],
  },
  {
    id: "thesis",
    prompt: "How well-defined is your investment thesis right now?",
    options: [
      { label: "Vague — I invest case by case", route: "F" },
      { label: "I lean toward a sector, but it's loose", route: "T" },
      { label: "I have a clear thesis (e.g. AI infra, dev tools, fintech rails)", route: "D" },
      { label: "Multiple sharp theses — I want bulk filtering by stage and geography", route: "I" },
    ],
  },
  {
    id: "rhythm",
    prompt: "How much time would you realistically spend on a deal-flow tool each week?",
    options: [
      { label: "Five minutes — I want it pushed to me", route: "F" },
      { label: "Fifteen minutes once a month — for one specific sector", route: "T" },
      { label: "Twenty to thirty minutes weekly — Monday morning rhythm", route: "D" },
      { label: "Multiple hours weekly + I want API access for my own stack", route: "I" },
    ],
  },
  {
    id: "edge",
    prompt: "What would make this pay for itself in your eyes?",
    options: [
      { label: "Just hearing about a few names I'd otherwise miss", route: "F" },
      { label: "One concrete data-backed signal on a sector I'm circling", route: "T" },
      { label: "Surfacing one or two pre-Crunchbase names per month", route: "D" },
      { label: "A live alerts feed + portfolio overlap detection + custom watchlists", route: "I" },
    ],
  },
];

// Q5 — explicit archetype self-ID. Audit 2026-05-09 (Brunson Traffic Secrets
// Ch 1 split): the F/T/D/I tier-tally answers what the buyer DOES; this
// question answers what the buyer IS. The two together let us surface both
// the right tier AND the right archetype profile on the result page.
const ARCHETYPE_QUESTION: ArchetypeQuestion = {
  id: "archetype",
  prompt: "Which best describes you?",
  options: [
    {
      label:
        "Solo Angel — I write personal checks, €5k–€50k each, on my own balance sheet",
      route: "solo-angel",
    },
    {
      label:
        "Fund GP / Scout — I source for a fund (≤$50M AUM) or scout for a larger one; I write a Monday memo",
      route: "fund-gp",
    },
    {
      label:
        "Family Office Analyst — I run diligence for a single- or multi-family office or institutional allocator",
      route: "family-office",
    },
  ],
};

const RESULTS = {
  F: {
    title: "Start with the free Acceleration Watch.",
    eyebrow: "Free tier · €0",
    body: "You'd burn money on a paid subscription right now. The free Monday digest gives you the top 5 ranked startups every week — that's enough to test whether the signal matches your taste before you commit to a tool.",
    cta: { label: "Subscribe to the Acceleration Watch — Free", href: "https://gitdealflow.com/#signup", external: true },
    secondary: { label: "Or skim the methodology first", href: "/methodology" },
  },
  T: {
    title: "The €7 First Look Pass is built for you.",
    eyebrow: "First Look Pass · €7 once",
    body: "You have a sector you're circling but you don't yet need the full dashboard. Pay €7 once, pick any of 19 tracked sectors, and within 24 hours you get a written deep-dive PDF, the raw CSV, and a walkthrough. If you upgrade to the Dashboard within 14 days, the €7 is credited.",
    cta: { label: "Get the €7 First Look Pass", href: "/firstlook", external: false },
    secondary: { label: "Compare all tiers", href: "/pricing" },
  },
  D: {
    title: "Dashboard Beta — €9.97/mo, founder price locked forever.",
    eyebrow: "Dashboard Beta · €9.97/mo",
    body: "You write enough checks and have a sharp enough thesis that the full ranked dashboard pays for itself the first time it surfaces a name you didn't already see. €9.97/mo is the founding-member rate — it stays €9.97 even after the public hike to €49/mo. Read the 12-minute walkthrough before you click if you want the full case.",
    cta: { label: "Lock €9.97/mo founder price", href: "https://buy.stripe.com/4gMbJ07kTaJy7kqg6s0x20b", external: true },
    secondary: { label: "Read the 12-minute case first", href: "/walkthrough" },
  },
  I: {
    title: "Insider Circle — or the €1,997 Sector Sweep, depending on what you need first.",
    eyebrow: "Insider Circle · €97/mo  ·  or  ·  Sector Sweep · €1,997 once",
    body: "You're operating at the volume where the API, custom watchlists, and Slack/Telegram alerts start to matter. If you want a one-time deep-dive built around your specific thesis before subscribing, the €1,997 Custom Sector Sweep is the right entry — €1,997 of it credits to Insider if you upgrade within 60 days.",
    cta: { label: "See the Insider case (24h lead)", href: "/insider", external: false },
    secondary: { label: "Or commission a Sector Sweep", href: "/pricing#sector-sweep-stack" },
  },
} as const;

function tally(answers: AnswerKey[]): keyof typeof RESULTS {
  const counts: Record<AnswerKey, number> = { F: 0, T: 0, D: 0, I: 0 };
  for (const a of answers) counts[a]++;
  // Highest count wins; ties break upward (more committed buyer).
  const order: AnswerKey[] = ["I", "D", "T", "F"];
  return order.reduce((best, k) => (counts[k] > counts[best] ? k : best), "F");
}

const RESULT_TIER_LABELS: Record<keyof typeof RESULTS, string> = {
  F: "Free Acceleration Watch",
  D: "Dashboard Beta (€9.97/mo)",
  T: "First Look Pass (€7 once)",
  I: "Insider Circle (€97/mo) / Sector Sweep (€1,997 once)",
};

// Brunson Quiz Funnel transparency — show the user the tier-specific drip
// they'll actually receive. This is the upgrade Russell flagged in his
// 2026-05-08 audit ("same drip everyone gets" — fixed: 11 new tier-specific
// emails, every reader gets a sequence shaped to the rung they self-described
// on the quiz). Source of truth is lib/emails.ts → SOAP_OPERA_F/T/D/I.
const TIER_SEQUENCE_SUMMARY: Record<keyof typeof RESULTS, { count: number; pitch: string }> = {
  F: {
    count: 17,
    pitch:
      "Tuned for 0–1 checks/year — Sunday-morning future-pace, no pressure to upgrade, Crystal Ball game framed as no-cheque public track record.",
  },
  T: {
    count: 19,
    pitch:
      "Tuned for 2–5 checks/year — €7 First Look as the right test, Tuesday-afternoon scenario, credit-back to Dashboard at the 45-day mark.",
  },
  D: {
    count: 22,
    pitch:
      "Tuned for 6–20 checks/year — full Dashboard close, Insider 24h-lead at D45, Sector Sweep at D60, State-of-the-Engine accountability anchor.",
  },
  I: {
    count: 19,
    pitch:
      "Tuned for 20+ checks/year — fund-tier rung from email 1, 24h-lead Sunday-evening scenario, Sector Sweep window opens at D45.",
  },
};

type GateState = "idle" | "submitting" | "ok" | "skip" | "error";

// Archetype short-label + lead-line for the result card. Mirrors
// content/archetypes.ts but kept inline because QuizForm is "use client" and
// we want zero server-only imports leaking. Edit both in lockstep when
// archetype labels change.
const ARCHETYPE_LABEL: Record<ArchetypeId, string> = {
  "solo-angel": "Solo Angel",
  "fund-gp": "Fund GP / Scout",
  "family-office": "Family Office Analyst",
};
const ARCHETYPE_BLURB: Record<ArchetypeId, string> = {
  "solo-angel":
    "Personal checks, engineer-buying-behavior. Free Sunday digest is the on-ramp; Dashboard is the workflow tier; Insider is for when cadence ramps past 20 checks/year.",
  "fund-gp":
    "Monday memo, LP-update defensibility. Insider gives you the 24-hour lead; Sharp (capped 8 funds) gives you the white-labeled API and methodology source.",
  "family-office":
    "Diligence cycle, compliance review, annual contract. Sector Sweep is the entry; Methodology Partnership is recurring; Vault is custom co-development.",
};

export default function QuizForm() {
  const [answers, setAnswers] = useState<AnswerKey[]>([]);
  const [archetype, setArchetype] = useState<ArchetypeId | null>(null);
  const [email, setEmail] = useState("");
  const [gate, setGate] = useState<GateState>("idle");
  const [gateError, setGateError] = useState<string | null>(null);
  const step = answers.length;

  const finishedTierAnswers = step >= QUESTIONS.length;
  const finishedAnswers = finishedTierAnswers && archetype !== null;
  const result = finishedAnswers ? RESULTS[tally(answers)] : null;
  const resultTierKey = finishedAnswers ? tally(answers) : null;

  async function captureEmail(e: React.FormEvent) {
    e.preventDefault();
    setGateError(null);
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setGateError("Please use a valid email.");
      return;
    }
    setGate("submitting");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim().toLowerCase(),
          source: "quiz",
          quiz_route: resultTierKey ?? "F",
          quiz_route_label: resultTierKey
            ? RESULT_TIER_LABELS[resultTierKey]
            : "",
          archetype: archetype ?? "solo-angel",
          archetype_label: archetype ? ARCHETYPE_LABEL[archetype] : "",
        }),
      });
      // /api/subscribe returns { ok: true } even for already-subscribed —
      // we always reveal the result, the gate is the capture moment, not
      // a paywall. If the endpoint hard-fails, we still reveal but flag
      // the error so we don't block the buyer.
      if (!res.ok && res.status >= 500) {
        throw new Error("Subscribe service unavailable");
      }
      setGate("ok");
    } catch (err) {
      setGateError(
        err instanceof Error ? err.message : "Subscribe failed — showing result anyway.",
      );
      // Still reveal the result — anti-friction default.
      setGate("ok");
    }
  }

  // Reveal result if user submitted email, skipped, or errored through.
  const reveal = finishedAnswers && (gate === "ok" || gate === "skip");

  if (reveal && result && resultTierKey) {
    const sequence = TIER_SEQUENCE_SUMMARY[resultTierKey];
    const archetypeId = archetype ?? "solo-angel";
    return (
      <div className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/50 rounded-xl p-6 sm:p-8 space-y-4">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          {result.eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          {result.title}
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">{result.body}</p>
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/5 p-4 space-y-2">
          <p className="text-amber-300 text-[11px] font-semibold uppercase tracking-[0.14em]">
            Archetype · {ARCHETYPE_LABEL[archetypeId]}
          </p>
          <p className="text-gray-200 text-sm leading-relaxed">
            {ARCHETYPE_BLURB[archetypeId]}
          </p>
          <a
            href={`/who-this-is-for#${archetypeId}`}
            className="text-amber-300 text-xs underline decoration-amber-400/40 decoration-dotted underline-offset-[3px] hover:text-amber-200 hover:decoration-amber-300 inline-block"
          >
            See the full {ARCHETYPE_LABEL[archetypeId]} profile →
          </a>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <a
            href={result.cta.href}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition-colors"
          >
            {result.cta.label} <span aria-hidden="true">→</span>
          </a>
          <a
            href={result.secondary.href}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
          >
            {result.secondary.label}
          </a>
        </div>
        {gate === "ok" ? (
          <div className="bg-slate-900/60 border border-slate-700/60 rounded-lg p-4 mt-4 space-y-2">
            <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider">
              ✓ Tier-matched sequence queued · first email lands in 30 minutes
            </p>
            <p className="text-gray-300 text-sm leading-relaxed">
              We&rsquo;ll send you the <strong>tier-{resultTierKey} sequence</strong> &mdash;{" "}
              <strong>{sequence.count} emails over 8 months</strong>. {sequence.pitch}
            </p>
            <p className="text-gray-500 text-xs leading-relaxed">
              Other quiz takers get different sequences. We segment because the rung-up
              from your tier is genuinely different from the rung-up from the next one over &mdash;
              there&rsquo;s no point pitching you a &euro;1,997 Sweep if you&rsquo;re a 0&ndash;1 check/year reader,
              and there&rsquo;s no point pitching a fund operator a &euro;7 tripwire.
            </p>
          </div>
        ) : null}
        <button
          type="button"
          onClick={() => {
            setAnswers([]);
            setArchetype(null);
            setEmail("");
            setGate("idle");
            setGateError(null);
          }}
          className="text-gray-400 hover:text-gray-300 text-xs underline decoration-dotted underline-offset-4 mt-3"
        >
          Retake the quiz
        </button>
      </div>
    );
  }

  // Q5 — archetype self-ID. Sits between the four tier-routing questions and
  // the email gate. Cleaner than blending into the F/T/D/I tally because this
  // is identity, not behavior — the buyer recognises themselves once in their
  // answers (cadence/thesis/rhythm/edge) and again in the archetype label.
  if (finishedTierAnswers && archetype === null) {
    return (
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
            Question 5 of 5
          </p>
          <div className="flex gap-1.5" aria-hidden="true">
            {[0, 1, 2, 3, 4].map((i) => (
              <span
                key={i}
                className="h-1.5 w-6 rounded-full bg-sky-500"
              />
            ))}
          </div>
        </div>
        <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 leading-snug">
          {ARCHETYPE_QUESTION.prompt}
        </h2>
        <p className="text-gray-400 text-sm leading-relaxed">
          The previous four questions sized your buying motion. This one names
          it. We&rsquo;ll route you to one of three reader profiles &mdash; the
          tier suggestion stays the same, the framing changes to fit the way
          you actually decide.
        </p>
        <ul className="space-y-2.5">
          {ARCHETYPE_QUESTION.options.map((opt) => (
            <li key={opt.label}>
              <button
                type="button"
                onClick={() => setArchetype(opt.route)}
                className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 rounded-lg px-5 py-4 text-gray-200 text-base leading-snug transition-colors"
              >
                {opt.label}
              </button>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={() => setAnswers((a) => a.slice(0, -1))}
          className="text-gray-400 hover:text-gray-300 text-xs underline decoration-dotted underline-offset-4"
        >
          ← Previous question
        </button>
      </div>
    );
  }

  // Email gate (after all answers captured, before reveal)
  if (finishedAnswers) {
    return (
      <div className="rounded-xl border border-amber-500/40 bg-amber-500/5 p-6 sm:p-8 space-y-4">
        <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider">
          Last step · 10 seconds
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          Where should we send your routed recommendation?
        </h2>
        <p className="text-gray-300 text-sm leading-relaxed">
          We&rsquo;ll show your result on this page <em>and</em> send a copy
          to your inbox so you can come back to it later. The email also
          starts the free Sunday Acceleration Watch digest — five ranked
          startups every Monday. Reply REFUND or unsubscribe any time.
        </p>
        <form onSubmit={captureEmail} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              maxLength={200}
              className="flex-1 px-4 py-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-sky-500 focus:outline-none text-gray-100 text-sm placeholder-gray-600"
              disabled={gate === "submitting"}
            />
            <button
              type="submit"
              disabled={gate === "submitting"}
              className="px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 disabled:bg-slate-700 disabled:cursor-wait text-slate-950 font-semibold text-sm transition-colors whitespace-nowrap"
            >
              {gate === "submitting" ? "Sending…" : "Show my result →"}
            </button>
          </div>
          {gateError ? (
            <p className="text-rose-400 text-xs" role="alert">
              {gateError}
            </p>
          ) : null}
        </form>
        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-3">
          Don&rsquo;t want to share an email?{" "}
          <button
            type="button"
            onClick={() => setGate("skip")}
            className="text-gray-400 hover:text-gray-200 underline decoration-dotted underline-offset-4"
          >
            Show the result without subscribing
          </button>
          . The full pricing grid is also at{" "}
          <a
            href="/pricing"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /pricing
          </a>
          .
        </p>
      </div>
    );
  }

  const q = QUESTIONS[step];
  // Total questions = 4 tier-routing + 1 archetype = 5. Progress bar reflects
  // the full quiz length, not just the tier-tally subset, so the buyer sees
  // honest progress.
  const TOTAL_STEPS = QUESTIONS.length + 1;
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
          Question {step + 1} of {TOTAL_STEPS}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${
                i <= step ? "bg-sky-500" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-100 leading-snug">
        {q.prompt}
      </h2>
      <ul className="space-y-2.5">
        {q.options.map((opt) => (
          <li key={opt.label}>
            <button
              type="button"
              onClick={() => setAnswers((a) => [...a, opt.route])}
              className="w-full text-left bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500 rounded-lg px-5 py-4 text-gray-200 text-base leading-snug transition-colors"
            >
              {opt.label}
            </button>
          </li>
        ))}
      </ul>
      {step > 0 && (
        <button
          type="button"
          onClick={() => setAnswers((a) => a.slice(0, -1))}
          className="text-gray-400 hover:text-gray-300 text-xs underline decoration-dotted underline-offset-4"
        >
          ← Previous question
        </button>
      )}
    </div>
  );
}
