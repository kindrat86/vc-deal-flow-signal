import type { Metadata } from "next";
import SupportForm from "./SupportForm";

export const metadata: Metadata = { title: "Customer support | GitDealFlow", description: "Help with GitDealFlow billing, login, newsletter delivery, dashboard use, or data quality.", robots: { index: false } };

export default function SupportPage() {
  return <main className="mx-auto max-w-2xl px-6 py-16 text-gray-100">
    <p className="text-sm font-semibold uppercase tracking-widest text-sky-400">Customer support</p>
    <h1 className="mt-3 text-4xl font-bold tracking-tight">Get help</h1>
    <p className="mt-4 text-lg leading-8 text-gray-300">Email <a className="text-sky-400 underline" href="mailto:signals@gitdealflow.com">signals@gitdealflow.com</a> or use the form. Human reply within 1 business day. Telegram and X are announcement channels, not support queues.</p>
    <SupportForm />
  </main>;
}
