import type { Metadata } from "next";
import Link from "next/link";
import { AgentMirrorLinks } from "@/components/AgentMirrorLinks";

const SITE = "https://signals.gitdealflow.com";
const NPM = "@gitdealflow/mcp-signal";
const HTTP_RPC = `${SITE}/api/mcp/rpc`;

const TITLE =
  "Use VC Deal Flow Signal in any AI agent runtime — Cursor, Cline, Goose, OpenHands, Aider, Raycast";
const DESCRIPTION =
  "Install the VC Deal Flow Signal MCP server in seven popular agent runtimes — Cursor, Cline, Block Goose, OpenHands, Aider, AiderDesk, and Raycast. One npm package, six free read-only tools, no auth, weekly refresh. Per-runtime install snippets and marketplace links.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/integrations/agent-runtimes" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: `${SITE}/integrations/agent-runtimes`,
    type: "website",
    siteName: "VC Deal Flow Signal",
  },
  twitter: {
    card: "summary_large_image",
    site: "@data_nerd",
    title: TITLE,
    description: DESCRIPTION,
  },
};

type RuntimeStatus = "live" | "in-review" | "config";

type Runtime = {
  slug: string;
  name: string;
  tagline: string;
  status: RuntimeStatus;
  marketplace?: { url: string; label: string };
  installType: "json-paste" | "cli" | "marketplace-button" | "settings-ui";
  installSnippet: string;
  installNotes: string;
  docsUrl: string;
  tutorialAnchor: string;
};

const RUNTIMES: Runtime[] = [
  {
    slug: "cursor",
    name: "Cursor",
    tagline:
      "AI-first code editor with native MCP support since v0.45. Adds servers via Settings → MCP → +Add new MCP server.",
    status: "in-review",
    marketplace: {
      url: "https://cursor.directory/plugins/vc-deal-flow-signal-mcp-1",
      label: "cursor.directory listing (Under review)",
    },
    installType: "json-paste",
    installSnippet: `{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "${NPM}"]
    }
  }
}`,
    installNotes:
      "Open Settings → MCP → +Add new MCP server, paste the snippet, and the six tools appear in the next chat. The streamable-HTTP variant works too — use \"url\": \"" +
      HTTP_RPC +
      '" instead of command/args.',
    docsUrl: "https://docs.cursor.com/context/model-context-protocol",
    tutorialAnchor: "cursor",
  },
  {
    slug: "cline",
    name: "Cline (VS Code)",
    tagline:
      "Open-source autonomous coding agent for VS Code with a curated MCP marketplace. Install in one click once the marketplace entry merges.",
    status: "in-review",
    marketplace: {
      url: "https://github.com/cline/mcp-marketplace/issues/1491",
      label: "cline/mcp-marketplace#1491 (Submitted)",
    },
    installType: "settings-ui",
    installSnippet: `// Cline → MCP Servers → Edit Config
{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "${NPM}"],
      "disabled": false,
      "autoApprove": []
    }
  }
}`,
    installNotes:
      "Until the marketplace entry merges, paste the JSON above into Cline's MCP config (Cline panel → ⚙ → Edit Config). Restart Cline; the server appears in the MCP Servers list and tools become available immediately.",
    docsUrl: "https://docs.cline.bot/mcp/configuring-mcp-servers",
    tutorialAnchor: "cline",
  },
  {
    slug: "goose",
    name: "Block Goose",
    tagline:
      "Open-source extensible AI agent (43k+ stars) from Block — runs MCP servers as extensions across CLI and Desktop.",
    status: "in-review",
    marketplace: {
      url: "https://github.com/aaif-goose/goose/pull/8974",
      label: "aaif-goose/goose#8974 (PR open)",
    },
    installType: "cli",
    installSnippet: `goose session --with-extension "npx -y ${NPM}"`,
    installNotes:
      "Works today via the --with-extension flag against any npx-installable MCP. Once PR #8974 merges, the server also appears in goose-docs.ai/extensions and installs via the directory's one-click button.",
    docsUrl: "https://block.github.io/goose/docs/guides/custom-extensions/",
    tutorialAnchor: "goose",
  },
  {
    slug: "openhands",
    name: "OpenHands",
    tagline:
      "Autonomous coding agent (formerly OpenDevin) from All-Hands-AI. MCP servers via per-user JSON config — no marketplace, all servers are self-served.",
    status: "config",
    installType: "json-paste",
    installSnippet: `// ~/.openhands/mcp.json
{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "${NPM}"]
    }
  }
}`,
    installNotes:
      "OpenHands has no marketplace — every MCP server is added per-user. Drop the JSON above at ~/.openhands/mcp.json or use the GUI: Settings → MCP → Add Server. CLI shortcut: openhands mcp add vc-deal-flow-signal --transport stdio npx -- -y " +
      NPM +
      ".",
    docsUrl: "https://docs.openhands.dev/openhands/usage/settings/mcp-settings",
    tutorialAnchor: "openhands",
  },
  {
    slug: "aider",
    name: "Aider (via mcpm-aider)",
    tagline:
      "Aider doesn't natively run MCP servers (issue #2525 still open), but the community bridge mcpm-aider wires them in via shell-out.",
    status: "config",
    installType: "cli",
    installSnippet: `npx -y mcpm-aider add vc-deal-flow-signal \\
  --command "npx -y ${NPM}"`,
    installNotes:
      "Until Aider ships native MCP, the lutzleonhardt/mcpm-aider bridge is the practical path. AiderDesk users get the same tools by pasting the JSON snippet into Settings → Agent → MCP Servers → Add.",
    docsUrl: "https://github.com/lutzleonhardt/mcpm-aider",
    tutorialAnchor: "aider",
  },
  {
    slug: "aider-desk",
    name: "AiderDesk",
    tagline:
      "Electron wrapper around Aider with first-class MCP support in Agent Mode. Configure via Settings → Agent → MCP Servers.",
    status: "config",
    installType: "json-paste",
    installSnippet: `{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "${NPM}"]
    }
  }
}`,
    installNotes:
      "Open AiderDesk → Settings → Agent → MCP Servers → +Add. Paste the JSON. The six VC Deal Flow Signal tools become available in any Agent Mode task.",
    docsUrl:
      "https://github.com/hotovo/aider-desk/blob/main/docs-site/docs/agent-mode/mcp-servers.md",
    tutorialAnchor: "aider-desk",
  },
  {
    slug: "raycast",
    name: "Raycast",
    tagline:
      "Mac launcher with native MCP runtime since v1.98 (May 2025). Install via the Manage MCP Servers command or the MCP Registry browser extension.",
    status: "in-review",
    marketplace: {
      url: "https://github.com/raycast/extensions/pull/27618",
      label: "raycast/extensions#27618 (PR open)",
    },
    installType: "json-paste",
    installSnippet: `{
  "mcpServers": {
    "vc-deal-flow-signal": {
      "command": "npx",
      "args": ["-y", "${NPM}"]
    }
  }
}`,
    installNotes:
      "Open Raycast → Manage MCP Servers → +Add Server, paste the snippet. Once PR #27618 merges into the MCP Registry extension, the server also installs via the in-Raycast registry browser.",
    docsUrl:
      "https://manual.raycast.com/model-context-protocol",
    tutorialAnchor: "raycast",
  },
];

const FAQS: { q: string; a: string }[] = [
  {
    q: "Is the same npm package used everywhere?",
    a: `Yes — every runtime above runs the exact same package: ${NPM} (current v1.5.2 on the npm registry, mirrored on the official MCP Registry as io.github.kindrat86/vc-deal-flow-signal). The classifications, methodology, and weekly refresh are identical across Cursor, Cline, Goose, OpenHands, Aider, AiderDesk, and Raycast. The streamable-HTTP variant at ${HTTP_RPC} also exposes the identical tools for runtimes that prefer hosted-MCP over local stdio.`,
  },
  {
    q: "Do I need an API key for any of these runtimes?",
    a: "No. The MCP server is read-only and unauthenticated. Every tool — get_trending_startups, search_startups_by_sector, get_startup_signal, get_signals_summary, get_scout_receipts, get_methodology — works anonymously across all seven runtimes. The HTTP variant supports OAuth 2.1 for runtimes that require it (Anthropic Connectors Directory, future enterprise gating), but anonymous calls remain supported indefinitely.",
  },
  {
    q: "Which runtimes have one-click install?",
    a: "Cursor (cursor.directory listing — under review), Block Goose (PR #8974 open), Raycast (PR #27618 open), and Cline (issue #1491 submitted) all have marketplace submissions in flight that will give one-click install once accepted. OpenHands, Aider, and AiderDesk have no marketplace surface at all — installation is per-user JSON config, which the snippets above paste verbatim into the right file.",
  },
  {
    q: "What about Continue.dev?",
    a: "Skipped. The Continue Hub registry was deprecated in May 2026 — hub.continue.dev/hub returns HTTP 500 after the project's pivot to Continuous AI. We'll re-evaluate once a public registry comes back online.",
  },
  {
    q: "What about Claude Desktop, Claude.ai, and Mistral Le Chat?",
    a: "Already covered on dedicated pages. Claude Desktop installs via the .mcpb extension at github.com/kindrat86/mcp-deal-flow-signal/releases or via npm (Glama A-Tier 4.9/5.0). Claude.ai uses the Anthropic Connectors Directory (HTTP MCP at " +
      HTTP_RPC +
      "). Mistral Le Chat: see /integrations/mistral. ChatGPT GPTs: see /integrations/chatgpt.",
  },
  {
    q: "Where do I report a runtime that broke?",
    a: "Open an issue at github.com/kindrat86/mcp-deal-flow-signal/issues with the runtime name, version, and the verbatim error. The MCP server itself runs the same Node.js code in every host, so runtime-specific failures are usually transport/config issues we can resolve in a release within 24 hours.",
  },
  {
    q: "How do I cite this in a memo?",
    a: "VC Deal Flow Signal (signals.gitdealflow.com), <period name> data. Methodology: SSRN preprint 6606558. Refreshed weekly from public GitHub activity. Runtime-agnostic — the data does not depend on which agent runtime made the call.",
  },
];

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebPage",
      name: TITLE,
      url: `${SITE}/integrations/agent-runtimes`,
      description: DESCRIPTION,
      isPartOf: { "@type": "WebSite", name: "VC Deal Flow Signal", url: SITE },
      speakable: {
        "@type": "SpeakableSpecification",
        cssSelector: ["h1", "h2", ".speakable", "[data-agent-summary]"],
      },
      breadcrumb: {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "All Sectors", item: SITE },
          {
            "@type": "ListItem",
            position: 2,
            name: "Integrations",
            item: `${SITE}/integrations`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: "Agent runtimes",
            item: `${SITE}/integrations/agent-runtimes`,
          },
        ],
      },
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@type": "ItemList",
      name: "Supported AI agent runtimes",
      itemListElement: RUNTIMES.map((r, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        name: r.name,
        url: r.docsUrl,
      })),
    },
  ],
};

function statusBadge(status: RuntimeStatus) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-950/50 border border-emerald-900/50 px-2.5 py-0.5 text-xs font-medium text-emerald-400">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
        Marketplace live
      </span>
    );
  }
  if (status === "in-review") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-950/50 border border-sky-900/50 px-2.5 py-0.5 text-xs font-medium text-sky-400">
        <span className="w-1.5 h-1.5 rounded-full bg-sky-400" />
        Marketplace pending
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-900/70 border border-slate-700/50 px-2.5 py-0.5 text-xs font-medium text-slate-300">
      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
      Config-only
    </span>
  );
}

export default function AgentRuntimesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AgentMirrorLinks path="/integrations/agent-runtimes" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <nav className="mb-6 text-sm text-gray-500" aria-label="Breadcrumb">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            All Sectors
          </Link>
          <span className="mx-2">/</span>
          <Link
            href="/integrations"
            className="hover:text-gray-300 transition-colors"
          >
            Integrations
          </Link>
          <span className="mx-2">/</span>
          <span className="text-gray-400">Agent runtimes</span>
        </nav>

        <h1 className="text-3xl sm:text-4xl font-bold text-gray-100 mb-4 leading-tight">
          Use VC Deal Flow Signal in any AI agent runtime
        </h1>
        <p
          className="text-gray-400 text-base leading-relaxed mb-6 max-w-2xl speakable"
          data-agent-summary
        >
          One npm package — <code className="font-mono text-gray-300">{NPM}</code>
          {" "}— installs in seven popular agent runtimes: Cursor, Cline, Block
          Goose, OpenHands, Aider (via mcpm-aider), AiderDesk, and Raycast. Each
          runtime gets the same six read-only tools — trending startups, sector
          lookup, single-startup signal, dataset summary, scout receipts,
          methodology — running against the identical weekly-refreshed dataset.
          No auth required.
        </p>

        <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/30 p-4 mb-10 text-sm">
          <div className="flex items-center gap-2 text-emerald-400 font-medium mb-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            One install everywhere
          </div>
          <code className="text-emerald-300 font-mono text-xs break-all">
            npx -y {NPM}
          </code>
        </div>

        <section className="mb-12" aria-labelledby="runtimes">
          <h2
            id="runtimes"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            Supported runtimes
          </h2>
          <div className="space-y-4">
            {RUNTIMES.map((r) => (
              <article
                key={r.slug}
                id={r.tutorialAnchor}
                className="rounded-lg border border-slate-800 bg-slate-900 p-5 sm:p-6"
              >
                <header className="flex flex-wrap items-start justify-between gap-3 mb-3">
                  <div>
                    <h3 className="text-gray-100 font-semibold text-lg">
                      {r.name}
                    </h3>
                    <p className="text-gray-400 text-sm mt-1.5 leading-relaxed max-w-xl">
                      {r.tagline}
                    </p>
                  </div>
                  {statusBadge(r.status)}
                </header>

                <div className="rounded-md border border-slate-800 bg-slate-950 p-3 sm:p-4 mb-3">
                  <pre className="text-emerald-300 font-mono text-xs leading-relaxed whitespace-pre-wrap break-words">
                    {r.installSnippet}
                  </pre>
                </div>

                <p className="text-gray-400 text-sm leading-relaxed mb-3">
                  {r.installNotes}
                </p>

                <div className="flex flex-wrap items-center gap-3 text-xs">
                  <Link
                    href={r.docsUrl}
                    rel="noopener noreferrer"
                    target="_blank"
                    className="inline-flex items-center gap-1 rounded-md border border-slate-700 bg-slate-950 px-2.5 py-1 text-gray-300 hover:text-gray-100 hover:border-slate-600 transition-colors"
                  >
                    {r.name} docs →
                  </Link>
                  {r.marketplace ? (
                    <Link
                      href={r.marketplace.url}
                      rel="noopener noreferrer"
                      target="_blank"
                      className="inline-flex items-center gap-1 rounded-md border border-sky-900 bg-sky-950/50 px-2.5 py-1 text-sky-300 hover:text-sky-200 hover:border-sky-800 transition-colors"
                    >
                      {r.marketplace.label} →
                    </Link>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mb-12" aria-labelledby="faqs">
          <h2
            id="faqs"
            className="text-xs font-medium text-sky-500 uppercase tracking-wider mb-4"
          >
            FAQ
          </h2>
          <div className="space-y-3">
            {FAQS.map((f) => (
              <details
                key={f.q}
                className="rounded-lg border border-slate-800 bg-slate-900 p-4 group"
              >
                <summary className="text-gray-100 font-medium cursor-pointer list-none flex items-start justify-between gap-3">
                  <span>{f.q}</span>
                  <span className="text-gray-500 text-xs flex-shrink-0 mt-1 group-open:rotate-180 transition-transform">
                    ▼
                  </span>
                </summary>
                <p className="text-gray-400 text-sm mt-3 leading-relaxed">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </section>

        <section className="mb-4 rounded-xl border border-slate-800 bg-slate-950/50 p-5 text-sm text-gray-400">
          <h2 className="text-gray-200 font-medium mb-2">
            Other surfaces
          </h2>
          <p className="leading-relaxed">
            Looking for ChatGPT? See{" "}
            <Link
              href="/integrations/chatgpt"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              /integrations/chatgpt
            </Link>
            . Mistral Le Chat:{" "}
            <Link
              href="/integrations/mistral"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              /integrations/mistral
            </Link>
            . Claude.ai (Anthropic Connectors Directory): pending review at
            claude.com/settings/connectors. Full integration list:{" "}
            <Link
              href="/integrations"
              className="text-sky-400 hover:text-sky-300 underline"
            >
              /integrations
            </Link>
            .
          </p>
        </section>
      </div>
    </>
  );
}
