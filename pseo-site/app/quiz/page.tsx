import type { Metadata } from "next";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import QuizForm from "./QuizForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Which Tier Fits You? — 90-Second Avatar Quiz",
  description:
    "Five questions, ninety seconds, and a routed recommendation. Tells you whether you're a Solo Angel, Fund GP, or Family Office Analyst — and whether the Free Acceleration Watch, the €7 First Look Pass, the €9.97/mo Dashboard, the €97/mo Insider Circle, or the €1,997 Sector Sweep is the right starting point.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Which VC Deal Flow Signal tier fits you?",
    description:
      "5 questions, 90 seconds, routed archetype + tier. Solo Angel / Fund GP / Family Office.",
    url: "https://signals.gitdealflow.com/quiz",
    type: "article",
  },
};

export default function QuizPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Quiz",
        "@id": "https://signals.gitdealflow.com/quiz#quiz",
        name: "VC Deal Flow Signal — Which Tier Fits You?",
        about: "Avatar qualifier that routes the visitor to the right pricing tier",
        educationalUse: "self-assessment",
        inLanguage: "en-US",
        url: "https://signals.gitdealflow.com/quiz",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://signals.gitdealflow.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Quiz",
            item: "https://signals.gitdealflow.com/quiz",
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical="https://signals.gitdealflow.com/quiz"
        languages={getHreflangLanguages("/quiz")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/quiz" />

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <header className="space-y-3">
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            90 seconds · 5 questions · No email required to see the result
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Which tier and which archetype actually fit you?
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Most people overpay for tools they barely use, or skip the one that
            would have paid for itself the first month. Four questions to size
            the buying motion, one to name the archetype &mdash; Solo Angel,
            Fund GP, or Family Office Analyst.
          </p>
        </header>

        <div className="rounded-xl border border-sky-700/40 bg-sky-950/15 p-4 sm:p-5">
          <p className="text-sky-300 text-[10px] font-semibold uppercase tracking-wider mb-1.5">
            What you&rsquo;ll get
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            5 questions, about 90 seconds, no email needed to see the result.
            At the end you get the tier and the archetype that fit your check
            size and cadence — one named recommendation with a one-line reason,
            not a sales page. No code required to read any of it.
          </p>
        </div>

        <QuizForm />

        <p className="text-gray-400 text-xs leading-relaxed border-t border-slate-800 pt-4">
          The answers stay in your browser — nothing is sent anywhere unless
          you click through to a checkout. No analytics events fire on the
          question screens.
        </p>
      </div>
    </>
  );
}
