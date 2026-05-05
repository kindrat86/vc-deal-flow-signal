import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLocaleTopic,
  getAllLocaleTopicPairs,
} from "@/content/locale-topics";
import { getLocaleByCode } from "@/content/locales";
import { topicEnPath } from "@/lib/hreflang";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ locale: string; topic: string }>;
}

export async function generateStaticParams() {
  return getAllLocaleTopicPairs();
}

export const dynamicParams = false;

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale, topic } = await params;
  const lt = getLocaleTopic(locale, topic);
  const l = getLocaleByCode(locale);
  if (!lt || !l) return {};

  const description = lt.intro.length > 200 ? lt.intro.slice(0, 197) + "..." : lt.intro;
  return {
    title: lt.title,
    description,
    openGraph: {
      title: lt.title,
      description,
      type: "article",
      locale: l.code,
    },
    twitter: { card: "summary_large_image", title: lt.title, description },
    alternates: { canonical: `/${locale}/${topic}` },
  };
}

// Minimal markdown → JSX. Handles:
//   ## H2, ### H3
//   - bullet, 1. numbered (consecutive lines grouped)
//   **bold**, [label](url) inline
function renderInline(s: string) {
  // Replace **bold** and [label](url) with HTML, escape < > first.
  const escaped = s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
  const withMarks = escaped
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" class="text-sky-400 hover:text-sky-300 underline">$1</a>'
    );
  return <span dangerouslySetInnerHTML={{ __html: withMarks }} />;
}

function renderBody(body: string) {
  const blocks = body.split(/\n\n+/).map((b) => b.trim()).filter(Boolean);
  const out: React.ReactElement[] = [];
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    if (b.startsWith("## ")) {
      out.push(
        <h2 key={i} className="text-2xl font-semibold text-gray-100 mt-10 mb-4">
          {renderInline(b.slice(3).trim())}
        </h2>
      );
      continue;
    }
    if (b.startsWith("### ")) {
      out.push(
        <h3 key={i} className="text-xl font-semibold text-gray-100 mt-6 mb-2">
          {renderInline(b.slice(4).trim())}
        </h3>
      );
      continue;
    }
    const lines = b.split("\n");
    if (lines.every((l) => /^\s*-\s+/.test(l))) {
      out.push(
        <ul key={i} className="list-disc pl-6 space-y-1 text-gray-300 mb-4">
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.replace(/^\s*-\s+/, ""))}</li>
          ))}
        </ul>
      );
      continue;
    }
    if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) {
      out.push(
        <ol key={i} className="list-decimal pl-6 space-y-1 text-gray-300 mb-4">
          {lines.map((l, j) => (
            <li key={j}>{renderInline(l.replace(/^\s*\d+\.\s+/, ""))}</li>
          ))}
        </ol>
      );
      continue;
    }
    out.push(
      <p key={i} className="text-gray-300 leading-relaxed mb-4">
        {renderInline(b)}
      </p>
    );
  }
  return out;
}

export default async function LocaleTopicPage({ params }: PageProps) {
  const { locale, topic } = await params;
  const lt = getLocaleTopic(locale, topic);
  const l = getLocaleByCode(locale);
  if (!lt || !l) notFound();

  const canonical = `${SITE}/${locale}/${topic}`;
  const englishPath = topicEnPath(topic);

  // Build hreflang map: en/x-default to canonical English topic, plus every
  // other locale that has this same topic translated.
  const hreflangMap: Record<string, string> = {};
  if (englishPath) {
    hreflangMap["en-US"] = `${SITE}${englishPath}`;
    hreflangMap.en = `${SITE}${englishPath}`;
    hreflangMap["x-default"] = `${SITE}${englishPath}`;
  }
  for (const pair of getAllLocaleTopicPairs()) {
    if (pair.topic === topic) {
      hreflangMap[pair.locale] = `${SITE}/${pair.locale}/${topic}`;
    }
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: lt.title,
        description: lt.intro,
        inLanguage: l.code,
        author: { "@id": "https://gitdealflow.com/#organization" },
        publisher: { "@id": "https://gitdealflow.com/#organization" },
        url: canonical,
        ...(englishPath
          ? { isBasedOn: `${SITE}${englishPath}` }
          : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: l.nativeName,
            item: `${SITE}/${locale}`,
          },
          { "@type": "ListItem", position: 3, name: lt.title, item: canonical },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={canonical} languages={hreflangMap} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <article
        className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
        lang={l.code}
        dir={l.dir}
      >
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" hrefLang="en" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <span className="mx-2">/</span>
          <Link href={`/${locale}`} className="hover:text-gray-300 transition-colors">
            {l.nativeName}
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">{topic}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">
            {l.nativeName} · {lt.readTimeLabel}
          </p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
            {lt.title}
          </h1>
          <p className="text-gray-300 text-base leading-relaxed">{lt.intro}</p>
        </header>

        <div className="prose-invert">{renderBody(lt.body)}</div>

        {englishPath && (
          <div className="mt-12 pt-8 border-t border-slate-800">
            <Link
              href={englishPath}
              hrefLang="en"
              className="inline-flex items-center gap-2 text-sky-400 hover:text-sky-300 transition-colors"
            >
              {lt.englishLinkLabel} →
            </Link>
          </div>
        )}

        <div className="mt-8 text-xs text-gray-500">
          <Link href={`/${locale}`} className="hover:text-gray-300 transition-colors">
            ← {l.nativeName}
          </Link>
        </div>
      </article>
    </>
  );
}
