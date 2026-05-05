"use client";

import { useState } from "react";

type AnswerKey = "F" | "T" | "D" | "I"; // Free / Tripwire / Dashboard / Insider

interface Question {
  id: string;
  prompt: string;
  options: { label: string; route: AnswerKey }[];
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
    body: "You write enough checks and have a sharp enough thesis that the full ranked dashboard pays for itself the first time it surfaces a name you didn't already see. €9.97/mo is the founding-member rate — it stays €9.97 even after the public hike to €49/mo. Read the 12-minute Perfect Webinar before you click if you want the full case.",
    cta: { label: "Lock €9.97/mo founder price", href: "https://buy.stripe.com/28E7sK48H04U8ou07u0x200", external: true },
    secondary: { label: "Read the 12-minute case first", href: "/perfect-webinar" },
  },
  I: {
    title: "Insider Circle — or the €1,997 Sector Sweep, depending on what you need first.",
    eyebrow: "Insider Circle · €97/mo  ·  or  ·  Sector Sweep · €1,997 once",
    body: "You're operating at the volume where the API, custom watchlists, and Slack/Telegram alerts start to matter. If you want a one-time deep-dive built around your specific thesis before subscribing, the €1,997 Custom Sector Sweep is the right entry — €1,997 of it credits to Insider if you upgrade within 60 days.",
    cta: { label: "Apply for Insider Circle", href: "https://buy.stripe.com/4gM00ifRpcRG2069I40x202", external: true },
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

export default function QuizForm() {
  const [answers, setAnswers] = useState<AnswerKey[]>([]);
  const step = answers.length;

  if (step >= QUESTIONS.length) {
    const result = RESULTS[tally(answers)];
    return (
      <div className="bg-gradient-to-br from-sky-950/40 via-slate-900 to-slate-950 border border-sky-700/50 rounded-xl p-6 sm:p-8 space-y-4">
        <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
          {result.eyebrow}
        </p>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
          {result.title}
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">{result.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {result.cta.external ? (
            <a
              href={result.cta.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition-colors"
            >
              {result.cta.label} <span aria-hidden="true">→</span>
            </a>
          ) : (
            <a
              href={result.cta.href}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-semibold text-sm shadow-lg shadow-sky-500/30 transition-colors"
            >
              {result.cta.label} <span aria-hidden="true">→</span>
            </a>
          )}
          <a
            href={result.secondary.href}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg border border-slate-700 bg-slate-800 hover:bg-slate-700 text-gray-100 font-semibold text-sm transition-colors"
          >
            {result.secondary.label}
          </a>
        </div>
        <button
          type="button"
          onClick={() => setAnswers([])}
          className="text-gray-500 hover:text-gray-300 text-xs underline decoration-dotted underline-offset-4 mt-3"
        >
          Retake the quiz
        </button>
      </div>
    );
  }

  const q = QUESTIONS[step];
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <p className="text-gray-500 text-xs font-medium uppercase tracking-wider">
          Question {step + 1} of {QUESTIONS.length}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {QUESTIONS.map((_, i) => (
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
          className="text-gray-500 hover:text-gray-300 text-xs underline decoration-dotted underline-offset-4"
        >
          ← Previous question
        </button>
      )}
    </div>
  );
}
