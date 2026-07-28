import type { Metadata } from "next";
export const dynamic = "force-static";

export const metadata: Metadata = {
  title: "Live VC Deal Flow Ticker — Embeddable Startup Signal Widget",
  description:
    "Add a live VC deal-flow ticker to your website with one line of code. Shows trending startups, commit velocity, and breakout signals — auto-updating, free, no API key required.",
  openGraph: {
    title: "Live VC Deal Flow Ticker — Embeddable Startup Widget",
    description:
      "One line of code → live deal-flow ticker on your site. Trending startups, commit velocity, breakout signals. Free, auto-updating.",
    type: "website",
    url: "/ticker",
  },
  twitter: {
    card: "summary_large_image",
    title: "Live VC Deal Flow Ticker — Embeddable Widget",
    description:
      "Embed a live VC deal-flow ticker on your site with one line. Free, auto-updating.",
  },
  alternates: {
    canonical: "/ticker",
  },
};

const BASE = "https://signals.gitdealflow.com";

const embedCodeTicker = `<script
  src="${BASE}/ticker.js"
  data-mode="ticker"
  data-height="64">
</script>`;

const embedCodeCard = `<script
  src="${BASE}/ticker.js"
  data-mode="card"
  data-height="520">
</script>`;

const embedCodeMini = `<script
  src="${BASE}/ticker.js"
  data-mode="mini"
  data-height="40">
</script>`;

const iframeCode = `<iframe
  src="${BASE}/ticker/embed/"
  style="width:100%;height:68px;border:0;border-radius:10px;background:#0f172a;"
  title="VC Deal Flow Ticker"
  loading="lazy">
</iframe>`;

export default function TickerPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12">
      {/* Hero */}
      <section className="mb-12">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-100 mb-4">
          Live VC Deal Flow Ticker
        </h1>
        <p className="text-lg text-slate-400 max-w-2xl">
          Add a live, auto-updating startup deal-flow ticker to your website
          with <strong className="text-sky-400">one line of code</strong>.
          Free. No API key. No sign-up. Just trending engineering signals
          from 269+ startups across 15 sectors.
        </p>
      </section>

      {/* Live Demo */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">Live Demo</h2>
        <div className="rounded-xl overflow-hidden border border-slate-700/50 shadow-xl shadow-black/20">
          <iframe
            src={`${BASE}/ticker/embed/`}
            style={{
              width: "100%",
              height: "68px",
              border: "0",
              display: "block",
            }}
            title="Live VC Deal Flow Ticker Demo"
            loading="lazy"
          />
        </div>
        <p className="text-sm text-slate-500 mt-2">
          ↑ This is the live ticker. It auto-updates every 2 minutes with real
          deal-flow data.
        </p>
      </section>

      {/* Installation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Add to Your Site
        </h2>
        <p className="text-slate-400 mb-6">
          Copy one of these snippets and paste it anywhere in your HTML. The
          widget auto-sizes to fit.
        </p>

        {/* Ticker mode */}
        <div className="mb-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            📈 Ticker Mode
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Horizontal scrolling ticker — best for headers, sidebars, and tight
            spaces.
          </p>
          <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            <code>{embedCodeTicker}</code>
          </pre>
        </div>

        {/* Card mode */}
        <div className="mb-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            🃏 Card Mode
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Vertical stack of cards — best for blog sidebars, resource pages,
            and dashboards.
          </p>
          <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            <code>{embedCodeCard}</code>
          </pre>
        </div>

        {/* Mini mode */}
        <div className="mb-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            🔹 Mini Mode
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            Compact horizontal ticker — best for footers, dashboards, and
            data-dense pages.
          </p>
          <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            <code>{embedCodeMini}</code>
          </pre>
        </div>

        {/* Iframe mode */}
        <div className="mb-8 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
          <h3 className="text-lg font-semibold text-slate-100 mb-2">
            🖼️ Direct Iframe
          </h3>
          <p className="text-sm text-slate-400 mb-4">
            For sites that block third-party scripts (Notion, Substack,
            Webflow).
          </p>
          <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto font-mono">
            <code>{iframeCode}</code>
          </pre>
        </div>
      </section>

      {/* Data */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          What Data Powers This
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-3xl mb-2">269+</div>
            <div className="text-sm text-slate-400">Startups tracked across 15 sectors</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-3xl mb-2">Weekly</div>
            <div className="text-sm text-slate-400">Refreshed every Monday from public GitHub data</div>
          </div>
          <div className="p-5 rounded-xl bg-slate-800/50 border border-slate-700/50">
            <div className="text-3xl mb-2">Free</div>
            <div className="text-sm text-slate-400">CC BY 4.0 license. No API key. No sign-up.</div>
          </div>
        </div>
      </section>

      {/* API */}
      <section className="mb-12 p-6 rounded-xl bg-slate-800/50 border border-slate-700/50">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          🔌 JSON API
        </h2>
        <p className="text-sm text-slate-400 mb-4">
          Build your own widget or integration. The feed endpoint returns the
          top N trending startups as JSON with CORS headers.
        </p>
        <pre className="bg-slate-950 text-slate-300 p-4 rounded-lg text-sm overflow-x-auto font-mono mb-2">
          <code>
{`curl ${BASE}/api/v1/signals/feed.json?limit=10`}
          </code>
        </pre>
        <a
          href={`${BASE}/api/v1/signals/feed.json`}
          target="_blank"
          rel="noopener"
          className="text-sm text-sky-400 hover:text-sky-300 transition-colors"
        >
          View live JSON response →
        </a>
      </section>

      {/* Who uses this */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-100 mb-4">
          Where to Embed
        </h2>
        <ul className="space-y-2 text-slate-400">
          <li className="flex items-start gap-2">
            <span className="text-sky-400 mt-0.5">▸</span>
            <span><strong className="text-slate-200">Startup blogs & newsletters</strong> — add a live market pulse to every article</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-400 mt-0.5">▸</span>
            <span><strong className="text-slate-200">VC & accelerator websites</strong> — show portfolio companies alongside market activity</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-400 mt-0.5">▸</span>
            <span><strong className="text-slate-200">Founder communities & forums</strong> — keep members informed about trending startups</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-400 mt-0.5">▸</span>
            <span><strong className="text-slate-200">Data dashboards & Notion pages</strong> — embed via iframe for instant market context</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="text-sky-400 mt-0.5">▸</span>
            <span><strong className="text-slate-200">University & research sites</strong> — cite live deal-flow data alongside papers</span>
          </li>
        </ul>
      </section>
    </main>
  );
}
