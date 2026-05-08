import type { Metadata } from "next";
import Link from "next/link";
import { BOOK } from "@/lib/book";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";
import { getHreflangLanguages } from "@/lib/hreflang";
import { CertificateForm } from "@/components/CertificateForm";

export const dynamic = "force-static";

const PAGE_URL = "https://signals.gitdealflow.com/book/certificate";

export const metadata: Metadata = {
  title: `Completion certificate — ${BOOK.title}`,
  description:
    "Type your name and download a personalized PNG certificate confirming you finished the eleven-chapter methodology book. Shareable on LinkedIn, Twitter, and any directory of credentialed readers.",
  alternates: { canonical: "/book/certificate" },
  openGraph: {
    title: `Reader completion certificate — ${BOOK.title}`,
    description:
      "Personalized PNG. Type your name. Share on LinkedIn or Twitter. ISBN-stamped.",
    url: PAGE_URL,
    type: "article",
  },
};

export default function CertificatePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "EducationalOccupationalCredential",
        "@id": `${PAGE_URL}#credential`,
        name: `${BOOK.title} — Reader Completion Certificate`,
        description:
          "Confirms the holder has read all eleven chapters of the SSRN-indexed methodology book — including the methodology chapter and the 90-minute replication appendix.",
        credentialCategory: "Reader credential",
        recognizedBy: {
          "@type": "Organization",
          name: "GitDealFlow",
          url: "https://gitdealflow.com",
        },
        about: {
          "@type": "Book",
          "@id": "https://signals.gitdealflow.com/book#book",
          name: BOOK.title,
          isbn: BOOK.isbn,
        },
        url: PAGE_URL,
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
            name: "Book",
            item: "https://signals.gitdealflow.com/book",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Certificate",
            item: PAGE_URL,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks
        canonical={PAGE_URL}
        languages={getHreflangLanguages("/book/certificate")}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/book/certificate" />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <header className="space-y-4 text-center">
          <p className="text-amber-300 text-xs font-semibold uppercase tracking-[0.18em]">
            🎉 Reader credential · ISBN {BOOK.isbn}
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.05] tracking-tight">
            You finished the book.
          </h1>
          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl mx-auto">
            Type your name and download the PNG. Share it wherever proof-of-work
            counts for you — LinkedIn, your fund&rsquo;s methodology page, your
            Twitter pinned reply.
          </p>
        </header>

        <CertificateForm bookTitle={BOOK.title} isbn={BOOK.isbn} />

        <section className="bg-slate-900/40 border border-slate-800 rounded-xl p-6 space-y-3">
          <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
            What this credential says
          </p>
          <p className="text-gray-300 leading-relaxed text-sm">
            The certificate is reader-typed — your name only ever lives in the
            URL parameter and the rendered PNG, never on a server. The
            credential confirms one thing:{" "}
            <em>
              the holder has read all eleven chapters of the methodology book,
              including the replication appendix
            </em>
            . That&rsquo;s it. No exam, no subscription, no gating. The
            book&rsquo;s job is to make the methodology yours; the certificate
            is the receipt.
          </p>
        </section>

        <section className="text-center space-y-3 py-4">
          <p className="text-sm text-gray-400">
            Use the methodology Monday morning →{" "}
            <Link
              href="/pricing#dashboard-beta"
              className="text-sky-400 hover:text-sky-300 underline underline-offset-2"
            >
              €9.97/mo Dashboard
            </Link>{" "}
            ·{" "}
            <Link
              href="/book/listen"
              className="text-emerald-400 hover:text-emerald-300 underline underline-offset-2"
            >
              audiobook
            </Link>{" "}
            ·{" "}
            <Link
              href="/"
              className="text-gray-300 hover:text-gray-100 underline underline-offset-2"
            >
              free Monday digest
            </Link>
          </p>
        </section>
      </div>
    </>
  );
}
