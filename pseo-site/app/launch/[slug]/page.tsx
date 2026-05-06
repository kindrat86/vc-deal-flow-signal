import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getLaunchBySlug,
  getAllLaunchSlugs,
  type Launch,
} from "@/content/launches";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { HreflangLinks } from "@/components/HreflangLinks";

const SITE = "https://signals.gitdealflow.com";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllLaunchSlugs().map((slug) => ({ slug }));
}

export const dynamicParams = false;
export const revalidate = 3600;

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const launch = getLaunchBySlug(slug);
  if (!launch) return {};
  return {
    title: `${launch.headline} — VC Deal Flow Signal`,
    description: launch.hook,
    alternates: { canonical: `/launch/${slug}` },
    openGraph: {
      title: launch.headline,
      description: launch.hook,
      type: "article",
      url: `${SITE}/launch/${slug}`,
    },
    twitter: {
      card: "summary_large_image",
      title: launch.headline,
      description: launch.hook,
    },
  };
}

function CountdownLine({ launch }: { launch: Launch }) {
  const closes = new Date(launch.closesAt);
  return (
    <p className="text-amber-200/90 text-xs font-mono mt-1">
      Cart closes {closes.toUTCString().replace(":00 GMT", " UTC")}
    </p>
  );
}

export default async function LaunchPage({ params }: PageProps) {
  const { slug } = await params;
  const launch = getLaunchBySlug(slug);
  if (!launch) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        "@id": `${SITE}/launch/${slug}#article`,
        headline: launch.headline,
        description: launch.hook,
        articleBody: launch.stages.map((s) => s.body.join("\n\n")).join("\n\n"),
        datePublished: "2026-05-06",
        dateModified: "2026-05-06",
        author: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        publisher: {
          "@type": "Organization",
          name: "VC Deal Flow Signal",
          url: "https://gitdealflow.com",
        },
        mainEntityOfPage: `${SITE}/launch/${slug}`,
      },
      {
        "@type": "Product",
        name: launch.headline,
        description: launch.abstract,
        offers: {
          "@type": "Offer",
          price: "19",
          priceCurrency: "EUR",
          url: launch.buyUrl,
          availability: "https://schema.org/InStock",
          priceValidUntil: launch.closesAt.slice(0, 10),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: launch.faq.map((f) => ({
          "@type": "Question",
          name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Launch",
            item: `${SITE}/launch`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: launch.headline,
            item: `${SITE}/launch/${slug}`,
          },
        ],
      },
    ],
  };

  return (
    <>
      <HreflangLinks canonical={`${SITE}/launch/${slug}`} languages={{}} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path={`/launch/${slug}`} />

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
        <header className="space-y-4">
          {launch.isOpen && (
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/40 bg-amber-950/30 px-3 py-1 text-amber-200 text-[11px] font-semibold uppercase tracking-wider">
              <span aria-hidden>★</span>
              Launch window open
            </div>
          )}
          <p className="text-sky-400 text-xs font-medium uppercase tracking-wider">
            Product Launch · 4-stage funnel · DotCom Secrets Ch 15
          </p>
          <h1 className="text-3xl sm:text-5xl font-bold text-gray-100 leading-[1.1] tracking-tight">
            {launch.headline}
          </h1>
          <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
            {launch.hook}
          </p>
          {launch.isOpen && <CountdownLine launch={launch} />}
        </header>

        <section className="rounded-xl border border-slate-800 bg-slate-900/40 p-5 space-y-2">
          <p className="text-gray-500 text-xs font-semibold uppercase tracking-wider">
            Abstract
          </p>
          <p className="text-gray-300 text-sm leading-relaxed">
            {launch.abstract}
          </p>
        </section>

        <ol className="space-y-10 list-none pl-0">
          {launch.stages.map((stage) => (
            <li key={stage.n} className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sky-500/40 bg-sky-950/40 text-sky-300 font-bold text-sm">
                  {stage.n}
                </span>
                <p className="text-sky-300 text-xs font-semibold uppercase tracking-wider">
                  {stage.caption}
                </p>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-100 leading-snug">
                {stage.headline}
              </h2>
              <div className="space-y-4 text-gray-300 text-base leading-relaxed">
                {stage.body.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <section className="rounded-xl border border-amber-700/40 bg-gradient-to-br from-amber-950/30 via-slate-900 to-slate-950 p-6 sm:p-8 space-y-5">
          <div>
            <p className="text-amber-300 text-xs font-semibold uppercase tracking-wider mb-2">
              The Stack
            </p>
            <h2 className="text-2xl font-bold text-gray-100">
              What you get when you buy in this window.
            </h2>
          </div>
          <ul className="space-y-3">
            {launch.stack.map((item) => (
              <li
                key={item.label}
                className="flex items-start gap-3 border-b border-slate-800/60 pb-3 last:border-b-0 last:pb-0"
              >
                <span className="text-amber-300 font-bold shrink-0 mt-0.5">
                  →
                </span>
                <div className="flex-1 flex flex-wrap items-baseline gap-x-4 gap-y-1 justify-between">
                  <p className="text-gray-100 font-semibold text-sm">
                    {item.label}
                  </p>
                  <p className="text-gray-500 text-xs font-mono shrink-0">
                    {item.standalone}
                  </p>
                </div>
              </li>
            ))}
          </ul>
          <div className="border-t border-slate-700 pt-4 space-y-1.5">
            <p className="text-gray-400 text-sm">
              Standalone value:{" "}
              <span className="text-gray-200 font-semibold">
                {launch.standaloneTotal}
              </span>
            </p>
            <p className="text-gray-200 text-base font-semibold">
              Launch price:{" "}
              <span className="text-amber-300">{launch.launchPrice}</span>
            </p>
            <p className="text-gray-500 text-xs">
              After window: {launch.postLaunchPrice}
            </p>
          </div>
          {launch.isOpen ? (
            <a
              href={launch.buyUrl}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-sm shadow-lg shadow-amber-500/30 transition-colors"
            >
              {launch.ctaLabel}
            </a>
          ) : (
            <p className="text-gray-500 text-sm">
              Launch window is closed. Standard pricing now applies — see{" "}
              <Link
                href="/pricing"
                className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
              >
                /pricing
              </Link>
              .
            </p>
          )}
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold text-gray-100">FAQ</h2>
          {launch.faq.map((f) => (
            <div key={f.q} className="space-y-1.5">
              <h3 className="text-gray-100 font-semibold text-base">{f.q}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.a}</p>
            </div>
          ))}
        </section>

        <p className="text-gray-500 text-sm border-t border-slate-800 pt-5">
          See every door into VC Deal Flow Signal at{" "}
          <Link
            href="/funnels"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            /funnels
          </Link>
          {" "}or read the{" "}
          <Link
            href="/perfect-webinar"
            className="text-sky-400 hover:text-sky-300 underline decoration-dotted"
          >
            12-minute Perfect Webinar
          </Link>
          .
        </p>
      </div>
    </>
  );
}
