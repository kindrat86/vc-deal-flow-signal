import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";
import { DATA_NERD_AUTHOR_REF } from "@/lib/data-nerd";

const SITE = "https://signals.gitdealflow.com";

interface Integration {
  slug: string;
  name: string;
  category: string;
  title: string;
  description: string;
  h1: string;
  intro: string;
  steps: string[];
  embedSnippet: string;
  faqs: { q: string; a: string }[];
}

const INTEGRATIONS: Integration[] = [
  {
    slug: "notion",
    name: "Notion",
    category: "Knowledge Base",
    title: "VC Deal Flow Signal + Notion — Embed Startup Rankings in Your Deal Database",
    description:
      "Embed live GitHub engineering momentum data from VC Deal Flow Signal directly into your Notion deal-flow database. Free API, no auth, auto-updating.",
    h1: "VC Deal Flow Signal × Notion — Live Startup Rankings in Your Database",
    intro:
      "Notion is where investors manage deal flow. VC Deal Flow Signal is where engineering momentum data lives. Connect them to see real-time commit velocity alongside your deal notes — without a separate dashboard.",
    steps: [
      "Create a new Notion database with columns: Startup Name, Commit Velocity, Signal Type, Sector, Last Updated.",
      "Use the JSON API endpoint (https://signals.gitdealflow.com/api/signals.json) as a data source in Notion's API integration or via a Make.com/Zapier automation.",
      "Embed the live trending startups page (https://signals.gitdealflow.com/trending) as a Notion web embed block for at-a-glance weekly rankings.",
      "Schedule a weekly refresh every Monday after 09:00 UTC when the dataset updates.",
    ],
    embedSnippet: "https://signals.gitdealflow.com/api/v1/signals.json",
    faqs: [
      { q: "Does this require an API key?", a: "No. The JSON API is free and requires no authentication. Just fetch the URL." },
      { q: "How do I embed the trending list in Notion?", a: "Paste https://signals.gitdealflow.com/trending as a link in any Notion page, then select 'Create embed'. The live rankings render inline." },
      { q: "Can I automate the data sync?", a: "Yes. Use Make.com or Zapier to fetch /api/signals.json weekly and write rows to your Notion database." },
    ],
  },
  {
    slug: "slack",
    name: "Slack",
    category: "Team Chat",
    title: "VC Deal Flow Signal + Slack — Weekly Engineering Signal Alerts in Your Channel",
    description:
      "Post weekly startup engineering momentum alerts to Slack. Free, no bot required. Uses the JSON API and a scheduled Slack incoming webhook.",
    h1: "VC Deal Flow Signal × Slack — Weekly Momentum Alerts",
    intro:
      "Get the top 5 breakout startups posted to your Slack channel every Monday. No bot, no subscription — just the JSON API and a Slack incoming webhook.",
    steps: [
      "Create a Slack incoming webhook for your #deal-flow channel (Settings → Integrations → Incoming Webhooks).",
      "Set up a scheduled job (cron, GitHub Actions, or Make.com) that fetches https://signals.gitdealflow.com/api/signals.json every Monday at 09:30 UTC.",
      "Filter for startups with signalType containing 'breakout', sort by commitVelocityChange descending.",
      "Format the top 5 as a Slack message block and POST to your webhook URL.",
    ],
    embedSnippet: "curl -s https://signals.gitdealflow.com/api/signals.json | jq '.[] | select(.signalType | test(\"breakout\")) | .name' | head -5",
    faqs: [
      { q: "Is there an official Slack app?", a: "Not yet. The JSON API is designed for easy integration via webhooks and automation tools." },
      { q: "What format is the API response?", a: "Standard JSON array with fields: name, commitVelocity14d, commitVelocityChange, contributors, signalType, sector." },
      { q: "Can I filter by sector?", a: "Yes. Use the MCP server tool search_startups_by_sector(sector) or filter the JSON response client-side." },
    ],
  },
  {
    slug: "telegram",
    name: "Telegram",
    category: "Messaging",
    title: "VC Deal Flow Signal Telegram Channel — Free Weekly Breakout Startups",
    description:
      "Join the free Telegram channel for weekly engineering momentum signals. 5 breakout startups every Sunday, direct from the public GitHub dataset.",
    h1: "VC Deal Flow Signal on Telegram — Free Weekly Digest",
    intro:
      "The fastest way to get weekly breakout startup signals. Join the Telegram channel for 5 hand-picked momentum plays every Sunday, free forever.",
    steps: [
      "Join the channel at https://t.me/gitdealflow — no signup, no email.",
      "Every Sunday at 18:00 UTC, receive 5 breakout startups with their commit velocity, signal type, and sector.",
      "Click through to the full startup signal page for detailed metrics and methodology.",
      "Upgrade to Insider Circle (€197/month) for 47 fundraise-precursor names per month.",
    ],
    embedSnippet: "https://t.me/gitdealflow",
    faqs: [
      { q: "Is the Telegram channel free?", a: "Yes, completely free. The Sunday digest with 5 breakout names is free forever." },
      { q: "What's the difference between the free channel and Insider Circle?", a: "The free channel gives 5 names/week. Insider Circle gives 47 fundraise-precursor names/month with 90-day tracking windows." },
      { q: "Can I get alerts for a specific sector only?", a: "Not yet via Telegram. Use the API or MCP server to filter by sector programmatically." },
    ],
  },
  {
    slug: "linear",
    name: "Linear",
    category: "Project Management",
    title: "VC Deal Flow Signal + Linear — Track Startup Signals as Research Tasks",
    description:
      "Create Linear issues for breakout startups detected by VC Deal Flow Signal. Free API integration, webhook-based, auto-sourced deal-flow pipeline.",
    h1: "VC Deal Flow Signal × Linear — Auto-Sourced Deal Research Pipeline",
    intro:
      "Turn GitHub engineering signals into trackable Linear issues. When a startup shows a breakout signal, automatically create a research task in your Linear workspace.",
    steps: [
      "Create a Linear API token (Settings → API → Personal API keys).",
      "Set up a scheduled job that fetches https://signals.gitdealflow.com/api/signals.json every Monday at 10:00 UTC.",
      "Filter for signalType containing 'breakout' and commitVelocityChange > 100%.",
      "Create a Linear issue for each matching startup with title 'Research: {name} — {signalType}' and a link to the startup's signal page.",
    ],
    embedSnippet: "https://signals.gitdealflow.com/api/v1/signals.json",
    faqs: [
      { q: "Does this require a paid Linear plan?", a: "No. The Linear API is available on all plans including free." },
      { q: "Can I use the MCP server instead of the raw API?", a: "Yes. The MCP server has a get_trending_startups tool that returns the top 20 — perfect for a Monday automation." },
      { q: "How do I deduplicate across weeks?", a: "Check for an existing Linear issue with the startup name before creating a new one. Use Linear's search API." },
    ],
  },
  {
    slug: "discord",
    name: "Discord",
    category: "Community",
    title: "VC Deal Flow Signal + Discord — Share Engineering Momentum in Your VC Community",
    description:
      "Post weekly startup engineering signals to your Discord server. Free webhook integration, no bot required.",
    h1: "VC Deal Flow Signal × Discord — Community Deal-Flow Sharing",
    intro:
      "Running a VC or founder Discord? Share weekly breakout startup signals automatically using a Discord webhook and the free JSON API.",
    steps: [
      "Go to your Discord channel settings → Integrations → Webhooks → Create Webhook.",
      "Set up a scheduled job (GitHub Actions, cron) that fetches https://signals.gitdealflow.com/api/signals.json every Monday at 09:30 UTC.",
      "Filter for breakout signals and format as a Discord embed message.",
      "POST to your Discord webhook URL.",
    ],
    embedSnippet: "curl -s https://signals.gitdealflow.com/api/signals.json | jq '[.[] | select(.signalType | test(\"breakout\"))][:5]'",
    faqs: [
      { q: "Do I need a Discord bot?", a: "No. Discord webhooks are sufficient for posting messages. No bot token needed." },
      { q: "Can I customize the message format?", a: "Yes. Discord supports rich embeds. Use the startup name, signal type, and a link to the signal page." },
      { q: "Is this free?", a: "Yes. The JSON API, webhook, and Discord integration are all free." },
    ],
  },
];

export async function generateStaticParams() {
  return INTEGRATIONS.map((i) => ({ tool: i.slug }));
}

export const dynamicParams = false;

interface PageProps {
  params: Promise<{ tool: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { tool } = await params;
  const i = INTEGRATIONS.find((x) => x.slug === tool);
  if (!i) return {};
  return {
    title: i.title,
    description: i.description,
    alternates: { canonical: `/integrations/${tool}` },
    openGraph: { title: i.title, description: i.description, type: "article", url: `${SITE}/integrations/${tool}` },
  };
}

export default async function IntegrationPage({ params }: PageProps) {
  const { tool } = await params;
  const integ = INTEGRATIONS.find((x) => x.slug === tool);
  if (!integ) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Article",
        headline: integ.h1,
        description: integ.description,
        author: DATA_NERD_AUTHOR_REF,
        datePublished: "2026-07-01",
        dateModified: "2026-07-09",
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          { "@type": "ListItem", position: 2, name: `Integration: ${integ.name}`, item: `${SITE}/integrations/${tool}` },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: integ.faqs.map((f) => ({
          "@type": "Question", name: f.q,
          acceptedAnswer: { "@type": "Answer", text: f.a },
        })),
      },
    ],
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <AgentMirrorLinks path={`/integrations/${tool}`} qaCategory="integration" />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-400" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">All Sectors</Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Integrations · {integ.name}</span>
        </nav>

        <header className="mb-8">
          <p className="text-sky-400 text-sm font-medium mb-2 uppercase tracking-wider">Integration · {integ.category}</p>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">{integ.h1}</h1>
          <p className="text-gray-300 text-base leading-relaxed">{integ.intro}</p>
        </header>

        <section aria-label="TL;DR" className="mb-8 rounded-lg border border-slate-800 bg-slate-900/60 p-4">
          <p className="text-xs font-semibold text-sky-400 uppercase tracking-wider mb-2">TL;DR</p>
          <p className="text-gray-300 text-sm leading-relaxed">
            Free, no-auth integration via JSON API. Auto-refreshes weekly. Works with {integ.name} on any plan.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-lg font-semibold text-gray-100 mb-4">How to set it up</h2>
          <div className="space-y-3">
            {integ.steps.map((step, i) => (
              <div key={i} className="rounded-lg border border-slate-800 bg-slate-900 p-4 flex gap-3">
                <span className="text-sky-400 font-bold text-lg shrink-0">{i + 1}.</span>
                <p className="text-gray-300 text-sm leading-relaxed">{step}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="mb-10 rounded-lg border border-slate-800 bg-slate-950 p-5">
          <p className="text-sm text-gray-400 mb-2 font-medium">API endpoint / snippet:</p>
          <pre className="text-sm text-gray-300 overflow-x-auto"><code>{integ.embedSnippet}</code></pre>
        </section>

        <section className="mb-10 max-w-2xl">
          <h2 className="text-lg font-semibold text-gray-100 mb-6">FAQ</h2>
          <div className="space-y-4">
            {integ.faqs.map((faq) => (
              <div key={faq.q} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
                <h3 className="text-gray-200 font-medium mb-1">{faq.q}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="text-center border-t border-slate-800 pt-8">
          <p className="text-gray-500 text-xs">Free forever · No auth · CC BY 4.0 · {SITE}</p>
        </div>
      </div>
    </>
  );
}
