import type { Metadata } from "next";
import Link from "next/link";
import SupportForm from "./SupportForm";

export const metadata: Metadata = {
  title: { absolute: "GitDealFlow Support: Billing, Login, API Keys, and Cancellations" },
  description:
    "Get help with GitDealFlow billing, invoices, magic-link login, API keys, cancellations, pauses, and refunds.",
  alternates: { canonical: "/support" },
};

const helpTopics = [
  {
    title: "Magic-link login",
    body: (
      <>
        Open <Link href="/login" className="text-sky-400 underline">/login</Link> and use the same email address used at checkout. Check Spam and Promotions, then request one fresh link. Older links can expire after a newer request. If it still fails, email us from the checkout address.
      </>
    ),
  },
  {
    title: "Cancel or pause",
    body: (
      <>
        Sign in and open <Link href="/cancel" className="text-sky-400 underline">/cancel</Link>. You can continue to Stripe to cancel at the end of the current billing period. Eligible monthly Dashboard accounts can also choose the 30-day pause or the one-month save offer shown in the flow. Cancellation stays visible and self-serve.
      </>
    ),
  },
  {
    title: "Invoices and receipts",
    body: "Stripe emails a receipt after payment. The Stripe customer portal opened from the cancellation flow also provides billing history and downloadable invoices. If the company name or billing address needs correction, email us from the checkout address before requesting the updated invoice.",
  },
  {
    title: "30-day refund",
    body: "Paid subscriptions include a full refund within 30 days of purchase under the Terms. Email signals@gitdealflow.com from the checkout address with the subject 'Refund request'. Custom deliveries may carry a more specific written guarantee in their purchase confirmation; that written offer controls where it is more generous.",
  },
  {
    title: "API keys",
    body: (
      <>
        Agent Credits buyers receive a key in the purchase confirmation email and can check it at <Link href="/account" className="text-sky-400 underline">/account</Link>. Dashboard API keys appear after sign-in at <Link href="/dashboard/api-keys" className="text-sky-400 underline">/dashboard/api-keys</Link>. Never send a full key by email. Send the first eight characters only, and we will verify or rotate it.
      </>
    ),
  },
  {
    title: "Data or methodology question",
    body: (
      <>
        Start with <Link href="/search" className="text-sky-400 underline">search</Link>, the <Link href="/methodology" className="text-sky-400 underline">methodology</Link>, and the <Link href="/glossary" className="text-sky-400 underline">glossary</Link>. If an answer still looks wrong, include the page URL, startup name, expected result, and what you saw.
      </>
    ),
  },
] as const;

export default function SupportPage() {
  // Static, developer-authored JSON-LD only. No request or user data enters this object.
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "GitDealFlow Support",
    url: "https://signals.gitdealflow.com/support",
    mainEntity: {
      "@type": "Organization",
      "@id": "https://gitdealflow.com/#organization",
      email: "signals@gitdealflow.com",
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "customer support",
        email: "signals@gitdealflow.com",
        availableLanguage: ["English"],
        hoursAvailable: "Replies within one business day, Monday through Friday.",
      },
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <nav className="text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-200">All Sectors</Link>
          <span className="mx-2">/</span>
          <span>Support</span>
        </nav>

        <header className="space-y-4">
          <p className="text-sky-400 text-xs font-semibold uppercase tracking-[0.16em]">Customer support</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 tracking-tight">Get unstuck without entering a ticket maze.</h1>
          <p className="text-gray-300 text-lg leading-relaxed">
            Email <a href="mailto:signals@gitdealflow.com?subject=GitDealFlow%20support" className="text-sky-400 underline">signals@gitdealflow.com</a>. Human reply within 1 business day, Monday through Friday. Paying customers and access-blocking issues are reviewed first.
          </p>
        </header>

        <section className="rounded-xl border border-sky-700/40 bg-sky-950/20 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-100">What to include</h2>
          <ul className="list-disc pl-5 space-y-2 text-gray-300 leading-relaxed">
            <li>The email address used at checkout, or the last four characters replaced with asterisks if posting publicly.</li>
            <li>The exact page URL and what you expected to happen.</li>
            <li>The error text and approximate time, with your timezone.</li>
            <li>For API keys, only the first eight characters. Never email the full secret.</li>
          </ul>
        </section>

        <section aria-labelledby="support-form-title">
          <h2 id="support-form-title" className="text-2xl font-semibold text-gray-100">Send a private support request</h2>
          <p className="mt-2 text-gray-300 leading-relaxed">
            Use the form for account-specific details. It enters the same monitored queue as email and records a customer-health support event when the address belongs to a paid account.
          </p>
          <SupportForm />
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-100">Common questions</h2>
          <div className="grid gap-4">
            {helpTopics.map((topic) => (
              <article key={topic.title} className="rounded-xl border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-lg font-semibold text-gray-100 mb-2">{topic.title}</h3>
                <p className="text-gray-300 leading-relaxed">{topic.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-slate-800 bg-slate-900 p-6 space-y-3">
          <h2 className="text-xl font-semibold text-gray-100">Support channels</h2>
          <p className="text-gray-300 leading-relaxed">
            Email is the support channel and the only place with a response-time commitment. Telegram, X, LinkedIn, Flipboard, GitHub, and RSS are publishing or community channels; replies there can be missed. For account, billing, or private data questions, use email.
          </p>
          <a href="mailto:signals@gitdealflow.com?subject=GitDealFlow%20support" className="inline-flex rounded-md bg-sky-500 px-4 py-2 font-semibold text-slate-950 hover:bg-sky-400">
            Email support
          </a>
        </section>
      </main>
    </>
  );
}
