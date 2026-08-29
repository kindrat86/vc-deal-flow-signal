import type { Metadata } from "next";
import PulseForm from "./PulseForm";

export const metadata: Metadata = { title: "GitDealFlow satisfaction pulse", description: "Score GitDealFlow and explain what would make it more useful in a real deal decision.", robots: { index: false } };

export default function PulsePage() {
  return <main className="mx-auto max-w-2xl px-6 py-16 text-gray-100">
    <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">Two-minute satisfaction pulse</p>
    <h1 className="mt-3 text-4xl font-bold tracking-tight">Score the signal, then tell us why</h1>
    <p className="mt-4 text-lg leading-8 text-gray-300">The number is not the insight. The written reason decides what we build, test, explain, or stop.</p>
    <PulseForm />
  </main>;
}
