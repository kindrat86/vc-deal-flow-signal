import type { Metadata } from "next";
import FeedbackForm from "./FeedbackForm";

export const metadata: Metadata = {
  title: "Request a feature or report a problem | GitDealFlow",
  description: "Tell GitDealFlow what you were trying to do and what got in the way.",
  alternates: { canonical: "/feedback" },
  robots: { index: false, follow: false },
};

export default function FeedbackPage() {
  return (
    <main className="mx-auto max-w-2xl px-6 py-16 text-gray-100">
      <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">GitDealFlow feedback</p>
      <h1 className="mt-3 text-4xl font-bold tracking-tight">Request a feature or report a problem</h1>
      <p className="mt-4 text-lg leading-8 text-gray-300">Tell us what happened in your own words. Every answer enters one weekly review: build it, test it, explain it better, or decline it with a reason.</p>
      <FeedbackForm />
    </main>
  );
}
