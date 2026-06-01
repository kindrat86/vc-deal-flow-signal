import type { Metadata } from "next";
import Link from "next/link";
import { buildUptimeManifest, type ComponentStatus } from "@/lib/uptime";
import { TrustConversionBlock } from "@/components/TrustConversionBlock";

// Server-rendered each request so the timestamps + active-incident array
// are always live. The underlying data is computed by lib/uptime.ts and
// shared with /api/v1/uptime.json.
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const SITE = "https://signals.gitdealflow.com";

export const metadata: Metadata = {
  title: "Status — VC Deal Flow Signal",
  description:
    "Live status of every public surface — the marketing site, programmatic SEO, JSON APIs, MCP server, OAuth token issuer, RSS/Atom feeds, and agent-facing well-known files.",
  alternates: { canonical: "/uptime" },
  openGraph: {
    title: "Status — VC Deal Flow Signal",
    description:
      "Live status across site, APIs, MCP, and agent surfaces. Honest uptime, not a dashboard art project.",
    url: `${SITE}/uptime`,
    type: "website",
  },
  twitter: {
    card: "summary",
    site: "@data_nerd",
    title: "Status — VC Deal Flow Signal",
    description:
      "Live status across site, APIs, MCP, and agent surfaces. Honest uptime, not a dashboard art project.",
  },
};

const STATUS_PILL: Record<ComponentStatus, { label: string; cls: string }> = {
  operational: {
    label: "Operational",
    cls: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300",
  },
  degraded_performance: {
    label: "Degraded",
    cls: "border-amber-500/40 bg-amber-500/10 text-amber-300",
  },
  partial_outage: {
    label: "Partial outage",
    cls: "border-orange-500/40 bg-orange-500/10 text-orange-300",
  },
  major_outage: {
    label: "Major outage",
    cls: "border-rose-500/40 bg-rose-500/10 text-rose-300",
  },
};

const INDICATOR_TONE: Record<string, string> = {
  none: "border-emerald-500/40 bg-emerald-500/10 text-emerald-200",
  minor: "border-amber-500/40 bg-amber-500/10 text-amber-200",
  major: "border-orange-500/40 bg-orange-500/10 text-orange-200",
  critical: "border-rose-500/40 bg-rose-500/10 text-rose-200",
};

export default function UptimePage() {
  const m = buildUptimeManifest();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/uptime#webpage`,
        url: `${SITE}/uptime`,
        name: m.page.name,
        description: m.page.description,
        isAccessibleForFree: true,
        dateModified: m.generatedAt,
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["[data-speakable]", "h1", "h2"],
        },
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: SITE },
          { "@type": "ListItem", position: 2, name: "Status", item: `${SITE}/uptime` },
        ],
      },
      // Each component as a Service. status is encoded as additionalProperty
      // because Schema.org has no first-class "status" property on Service.
      ...m.components.map((c) => ({
        "@type": "Service",
        "@id": `${SITE}/uptime#${c.id}`,
        name: c.name,
        description: c.description,
        url: c.url,
        serviceType: c.group,
        additionalProperty: {
          "@type": "PropertyValue",
          name: "status",
          value: c.status,
        },
      })),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="mx-auto max-w-4xl px-6 py-12 text-slate-100">
        <p className="text-xs uppercase tracking-widest text-slate-400">
          VC Deal Flow Signal · Status
        </p>
        <h1 className="mt-2 text-3xl font-semibold leading-tight" data-speakable>
          {m.page.name}
        </h1>

        <div
          className={`mt-5 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-medium ${
            INDICATOR_TONE[m.status.indicator] ?? INDICATOR_TONE.none
          }`}
          aria-live="polite"
        >
          <span className="inline-block h-2 w-2 rounded-full bg-current" aria-hidden="true" />
          {m.status.description}
        </div>

        <p className="mt-6 max-w-prose text-slate-300">{m.page.description}</p>

        <section className="mt-8 rounded-xl border border-emerald-700/30 bg-emerald-950/20 p-5 sm:p-6 space-y-3">
          <p className="text-emerald-300 text-xs font-semibold uppercase tracking-[0.14em]">
            Start with the most-requested trust routes
          </p>
          <p className="text-sm text-slate-300 leading-relaxed">
            Reliability checks rarely stand alone. Most people who come here also want the main security summary, the processor list, and the full trust hub.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link href="/security" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-500 transition-colors">
              Read security overview →
            </Link>
            <Link href="/subprocessors" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Review subprocessors →
            </Link>
            <Link href="/trust" className="inline-flex items-center justify-center px-5 py-2.5 rounded-lg border border-slate-700 text-slate-200 hover:border-slate-500 transition-colors text-sm font-medium">
              Open trust center →
            </Link>
          </div>
        </section>

        <section className="mt-8 grid grid-cols-2 gap-4 rounded-lg border border-slate-800 bg-slate-900/40 p-5 sm:grid-cols-4">
          <Metric label="Uptime, last 30 days" value={`${m.metrics.uptimePercent30d.toFixed(2)}%`} />
          <Metric
            label="Data last refreshed"
            value={new Date(m.metrics.dataLastModified).toUTCString().replace(" GMT", " UTC")}
          />
          <Metric label="Refresh cadence" value={m.metrics.refreshCadence} />
          <Metric label="Next refresh" value={m.metrics.nextRefresh} />
        </section>

        {m.incidents.length === 0 ? (
          <p className="mt-8 rounded-md border border-slate-800 bg-slate-900/40 p-4 text-sm text-slate-300">
            No active incidents. Past incidents are not indexed here yet — when
            we have a real one we&apos;ll start an incident timeline below this
            line. Honest uptime, not a dashboard art project.
          </p>
        ) : (
          <section className="mt-8 space-y-4">
            <h2 className="text-xl font-semibold">Active incidents</h2>
            {m.incidents.map((i) => (
              <article
                key={i.id}
                className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm"
              >
                <header className="flex items-center justify-between">
                  <span className="font-semibold text-amber-200">{i.name}</span>
                  <span className="text-xs uppercase tracking-wide text-amber-300/80">
                    {i.status}
                  </span>
                </header>
                <p className="mt-2 text-amber-100/90">{i.summary}</p>
                <footer className="mt-2 text-xs text-amber-300/80">
                  Started {new Date(i.startedAt).toUTCString()}
                  {i.resolvedAt
                    ? ` · resolved ${new Date(i.resolvedAt).toUTCString()}`
                    : ""}
                </footer>
              </article>
            ))}
          </section>
        )}

        <section className="mt-10 space-y-8">
          {Object.entries(m.componentsByGroup).map(([group, items]) => (
            <div key={group}>
              <h2 className="text-lg font-semibold text-slate-100">{group}</h2>
              <ul className="mt-3 space-y-2">
                {items.map((c) => {
                  const pill = STATUS_PILL[c.status];
                  return (
                    <li
                      key={c.id}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-slate-800 bg-slate-900/40 px-4 py-3"
                    >
                      <div className="min-w-0 flex-1">
                        <a
                          href={c.url}
                          className="font-mono text-sm text-slate-100 underline-offset-2 hover:underline"
                          rel="noopener"
                        >
                          {c.name}
                        </a>
                        <p className="mt-1 text-xs text-slate-400">{c.description}</p>
                      </div>
                      <span
                        className={`inline-flex shrink-0 items-center rounded-full border px-2.5 py-1 text-xs font-medium ${pill.cls}`}
                      >
                        {pill.label}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </section>

        <section className="mt-12 border-t border-slate-800 pt-6 text-sm text-slate-400">
          <p className="font-semibold text-slate-200">Machine-readable</p>
          <p className="mt-2">
            <Link href="/api/v1/uptime.json" className="underline">
              /api/v1/uptime.json
            </Link>{" "}
            — same data with Schema.org Service blocks; cached 60s at the
            edge.
          </p>
          <p className="mt-2">
            <Link href="/.well-known/freshness.json" className="underline">
              /.well-known/freshness.json
            </Link>{" "}
            — DataFeed manifest for retrieval pipelines (per-surface refresh
            cadence + lastModified).
          </p>
          <p className="mt-4 text-xs">
            Last generated: {new Date(m.generatedAt).toUTCString()}
          </p>
        </section>

        <TrustConversionBlock
          className="mt-12"
          dominant="digest"
          context="The engine's been up. Here's what it produces."
        />
      </main>
    </>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-400">{label}</p>
      <p className="mt-1 font-mono text-sm text-slate-100">{value}</p>
    </div>
  );
}
