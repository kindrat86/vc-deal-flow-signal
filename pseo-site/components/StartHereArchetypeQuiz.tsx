"use client";

// Three-question identity quiz for /start-here. Routes cold visitors by
// identity (not by price tier — that's the job of /quiz).
//
// Three archetypes:
//   BUYER       — angel/fund/family-office, ready to pay for names
//   SUBSCRIBER  — curious reader, wants the free weekly digest
//   ENGINEER    — builder/agent dev, wants the MCP server / API
//
// Q3 is weighted 2x so the most concrete-intent answer breaks ties cleanly.

import { useState } from "react";
import Link from "next/link";

type Archetype = "BUYER" | "SUBSCRIBER" | "ENGINEER";

interface Option {
  label: string;
  archetype: Archetype;
}

interface Question {
  id: string;
  prompt: string;
  options: Option[];
}

const QUESTIONS: Question[] = [
  {
    id: "identity",
    prompt: "Which one fits you best right now?",
    options: [
      {
        label: "I write checks — angel, fund, family office, or syndicate.",
        archetype: "BUYER",
      },
      {
        label:
          "I read newsletters and watch the market. I'm here to learn what's moving.",
        archetype: "SUBSCRIBER",
      },
      {
        label:
          "I build software. Agents, automations, internal tooling — that's my week.",
        archetype: "ENGINEER",
      },
    ],
  },
  {
    id: "win",
    prompt: "What's the smallest thing that would make this worth your time?",
    options: [
      {
        label: "One pre-Crunchbase name I would have otherwise missed.",
        archetype: "BUYER",
      },
      {
        label: "A weekly email that's actually worth opening.",
        archetype: "SUBSCRIBER",
      },
      {
        label: "An MCP server or API endpoint I can wire into my stack.",
        archetype: "ENGINEER",
      },
    ],
  },
  {
    id: "next-90-seconds",
    prompt: "If you had 90 seconds right now, where would you spend them?",
    options: [
      {
        label:
          "Looking at three named startups whose code accelerated this week.",
        archetype: "BUYER",
      },
      {
        label:
          "Reading what GitHub says about the AI infra sector this month.",
        archetype: "SUBSCRIBER",
      },
      {
        label:
          "Running `npx @gitdealflow/mcp-signal` to see the available tools.",
        archetype: "ENGINEER",
      },
    ],
  },
];

interface Result {
  archetype: Archetype;
  eyebrow: string;
  title: string;
  body: string;
  primary: { label: string; href: string; external?: boolean };
  secondary: { label: string; href: string; external?: boolean };
  tertiary?: { label: string; href: string };
  color: "amber" | "emerald" | "indigo";
}

const RESULTS: Record<Archetype, Result> = {
  BUYER: {
    archetype: "BUYER",
    eyebrow: "Cold Buyer · ready to find names",
    title: "Start with the €7 First Look Pass.",
    body: "You write checks, you have a sector you're circling, and the smallest useful win is one name you'd have otherwise missed. Pay €7 once, pick any of 19 tracked sectors, and within 24 hours you get the written deep-dive PDF, the raw CSV, and a walkthrough. If you upgrade to the Dashboard within 14 days, the €7 is credited.",
    primary: { label: "Get the €7 First Look Pass →", href: "/firstlook" },
    secondary: { label: "Or compare every tier", href: "/pricing" },
    tertiary: {
      label: "Read the 12-minute walkthrough first",
      href: "/walkthrough",
    },
    color: "amber",
  },
  SUBSCRIBER: {
    archetype: "SUBSCRIBER",
    eyebrow: "Cold Subscriber · here to read",
    title: "Subscribe to the free Acceleration Watch.",
    body: "You're not buying anything today — and that's exactly right. The Monday digest gives you the top 5 ranked startups every week, sector-tagged, with 6-week historical context. Free forever. The fastest way to test whether the signal matches your taste before you commit to a paid tool.",
    primary: {
      label: "Subscribe to the Acceleration Watch — Free →",
      href: "https://gitdealflow.com/#signup",
      external: true,
    },
    secondary: {
      label: "Or read this week's digest first",
      href: "/predicted",
    },
    tertiary: {
      label: "Skim the methodology",
      href: "/methodology",
    },
    color: "emerald",
  },
  ENGINEER: {
    archetype: "ENGINEER",
    eyebrow: "Cold Engineer-Curious · here to build",
    title: "Install the MCP server — six tools, free forever.",
    body: "You think in code. The fastest way for you to evaluate this is to call it from Claude or Cursor and see the data shape for yourself. Six read-only tools, zero gating, npx-installable in 30 seconds. We add new paid tools alongside the free ones — never gate the existing ones.",
    primary: { label: "Install the MCP server →", href: "/install" },
    secondary: { label: "Or browse the agent surfaces", href: "/agents" },
    tertiary: {
      label: "Read the OpenAPI + agent-card",
      href: "/openapi.json",
    },
    color: "indigo",
  },
};

const COLOR_CLASSES = {
  amber: {
    border: "border-amber-700/50",
    bg: "bg-amber-950/20",
    text: "text-amber-300",
    primaryBtn:
      "bg-amber-500 hover:bg-amber-400 text-slate-950 focus-visible:ring-amber-400",
  },
  emerald: {
    border: "border-emerald-700/50",
    bg: "bg-emerald-950/20",
    text: "text-emerald-300",
    primaryBtn:
      "bg-emerald-500 hover:bg-emerald-400 text-slate-950 focus-visible:ring-emerald-400",
  },
  indigo: {
    border: "border-indigo-700/50",
    bg: "bg-indigo-950/20",
    text: "text-indigo-300",
    primaryBtn:
      "bg-indigo-500 hover:bg-indigo-400 text-slate-950 focus-visible:ring-indigo-400",
  },
} as const;

function tally(answers: Archetype[]): Archetype {
  // Q3 (index 2) is weighted 2x so concrete intent breaks any ties.
  const score: Record<Archetype, number> = {
    BUYER: 0,
    SUBSCRIBER: 0,
    ENGINEER: 0,
  };
  answers.forEach((a, i) => {
    score[a] += i === 2 ? 2 : 1;
  });
  // Sort by score desc; ties resolve to the latest-answered archetype, which
  // is what the user's most concrete intent actually was.
  const ordered = (Object.keys(score) as Archetype[]).sort(
    (a, b) => score[b] - score[a],
  );
  return ordered[0];
}

export default function StartHereArchetypeQuiz() {
  const [answers, setAnswers] = useState<(Archetype | null)[]>([null, null, null]);
  const [done, setDone] = useState(false);

  function pickAnswer(qIndex: number, archetype: Archetype) {
    const next = [...answers];
    next[qIndex] = archetype;
    setAnswers(next);
    if (next.every((a) => a !== null)) {
      setDone(true);
      // soft scroll to result block on next paint
      requestAnimationFrame(() => {
        const el = document.getElementById("start-here-quiz-result");
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }

  function reset() {
    setAnswers([null, null, null]);
    setDone(false);
    requestAnimationFrame(() => {
      const el = document.getElementById("start-here-quiz");
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  }

  const completedCount = answers.filter((a) => a !== null).length;

  if (done) {
    const winner = tally(answers as Archetype[]);
    const r = RESULTS[winner];
    const c = COLOR_CLASSES[r.color];

    return (
      <section
        id="start-here-quiz-result"
        aria-labelledby="quiz-result-title"
        className={`rounded-xl border ${c.border} ${c.bg} p-6 sm:p-8 space-y-5`}
      >
        <p className={`${c.text} text-xs font-semibold uppercase tracking-wider`}>
          {r.eyebrow}
        </p>
        <h2
          id="quiz-result-title"
          className="text-2xl sm:text-3xl font-bold text-gray-100 leading-tight"
        >
          {r.title}
        </h2>
        <p className="text-gray-300 text-base leading-relaxed">{r.body}</p>
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          {r.primary.external ? (
            <a
              href={r.primary.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${c.primaryBtn} text-sm font-bold px-5 py-3 rounded transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
            >
              {r.primary.label}
            </a>
          ) : (
            <Link
              href={r.primary.href}
              className={`${c.primaryBtn} text-sm font-bold px-5 py-3 rounded transition-colors text-center focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950`}
            >
              {r.primary.label}
            </Link>
          )}
          {r.secondary.external ? (
            <a
              href={r.secondary.href}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-semibold px-5 py-3 rounded transition-colors text-center"
            >
              {r.secondary.label}
            </a>
          ) : (
            <Link
              href={r.secondary.href}
              className="border border-slate-700 hover:border-slate-500 text-gray-200 text-sm font-semibold px-5 py-3 rounded transition-colors text-center"
            >
              {r.secondary.label}
            </Link>
          )}
        </div>
        {r.tertiary ? (
          <p className="text-xs text-gray-500 pt-1">
            <Link
              href={r.tertiary.href}
              className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
            >
              {r.tertiary.label} →
            </Link>
          </p>
        ) : null}
        <div className="border-t border-slate-800 pt-4 flex items-center justify-between gap-3 flex-wrap">
          <p className="text-[11px] text-gray-500 leading-relaxed">
            Routed answer based on identity, not price. The price-tier quiz
            lives at{" "}
            <Link
              href="/quiz"
              className="text-gray-400 hover:text-gray-300 underline decoration-dotted"
            >
              /quiz
            </Link>
            .
          </p>
          <button
            type="button"
            onClick={reset}
            className="text-xs text-gray-400 hover:text-gray-200 underline decoration-dotted"
          >
            ← Retake the quiz
          </button>
        </div>
      </section>
    );
  }

  return (
    <section
      id="start-here-quiz"
      aria-labelledby="quiz-title"
      className="rounded-xl border border-slate-800 bg-slate-900/40 p-6 sm:p-7 space-y-6"
    >
      <div className="flex items-baseline justify-between gap-3 flex-wrap">
        <div>
          <p className="text-emerald-400 text-xs font-semibold uppercase tracking-wider mb-1">
            90-second identity routing
          </p>
          <h2 id="quiz-title" className="text-2xl font-bold text-gray-100">
            Three questions, then we point you at the right door.
          </h2>
        </div>
        <p className="text-xs text-gray-500 font-mono">
          {completedCount} / {QUESTIONS.length}
        </p>
      </div>

      <p className="text-gray-400 text-sm leading-relaxed">
        Cold buyer, cold subscriber, cold engineer-curious — three different
        people land on this site, and the next move is different for each.
        Pick the answer closest to the truth, even if none fits perfectly.
        Nothing leaves your browser.
      </p>

      <ol className="space-y-6">
        {QUESTIONS.map((q, qIdx) => {
          const answered = answers[qIdx];
          return (
            <li key={q.id} className="space-y-3">
              <p className="text-gray-200 text-base font-semibold">
                <span className="text-gray-500 font-mono text-xs mr-2">
                  Q{qIdx + 1}.
                </span>
                {q.prompt}
              </p>
              <div className="grid grid-cols-1 gap-2">
                {q.options.map((opt, oIdx) => {
                  const isPicked = answered === opt.archetype;
                  return (
                    <button
                      key={`${q.id}-${oIdx}`}
                      type="button"
                      onClick={() => pickAnswer(qIdx, opt.archetype)}
                      aria-pressed={isPicked}
                      className={`text-left rounded-lg border p-3 sm:p-4 text-sm leading-relaxed transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950 ${
                        isPicked
                          ? "border-emerald-500 bg-emerald-950/30 text-gray-100"
                          : "border-slate-800 bg-slate-950/40 text-gray-300 hover:border-slate-600 hover:bg-slate-900/60"
                      }`}
                    >
                      <span
                        className={`inline-block w-5 h-5 rounded-full border mr-2 align-middle ${
                          isPicked
                            ? "border-emerald-400 bg-emerald-400"
                            : "border-slate-600"
                        }`}
                        aria-hidden="true"
                      />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ol>

      <p className="text-[11px] text-gray-500 leading-relaxed border-t border-slate-800 pt-4">
        Answers stay in your browser — nothing is sent anywhere unless you
        click through to the routed page. No analytics events fire on the
        question screens.
      </p>
    </section>
  );
}
