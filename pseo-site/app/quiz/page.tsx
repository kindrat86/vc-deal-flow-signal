import type { Metadata } from "next";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import QuizForm from "./QuizForm";

export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Which Tier Fits You? — 90-Second Avatar Quiz",
  description:
    "Four questions, ninety seconds, and a routed recommendation. Tells you whether the Free Acceleration Watch, the €7 First Look Pass, or the €9.97/mo Dashboard is the right starting point for the way you write checks.",
  alternates: { canonical: "/quiz" },
  openGraph: {
    title: "Which VC Deal Flow Signal tier fits you?",
    description:
      "4 questions, 90 seconds, routed recommendation. Free / €7 / €9.97 / €97.",
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
            90 seconds · 4 questions · No email required
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            Which tier actually fits the way you write checks?
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">
            Most people overpay for tools they barely use, or skip the one
            that would have paid for itself the first month. Four questions
            to find out which side you&rsquo;re on.
          </p>
        </header>

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
