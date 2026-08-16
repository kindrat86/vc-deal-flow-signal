/**
 * Programmatic "startup ideas" pages, one slug per niche.
 *
 * Each entry frames a buildable opportunity in the same voice as the
 * indie-builder / micro-SaaS canon (community-led, distribution-first,
 * "the idea you could build today"). The slug page renders:
 *
 *   1. The idea + why-now (static).
 *   2. The top three repos already trying it, joined live against the
 *      current-period startup dataset via `matchSignal`. This is what
 *      makes the cluster pSEO-compounding: as the dataset shifts, the
 *      page reflects the new front-runners without a content edit.
 *   3. The seed-round pattern hiding in the trendline.
 *   4. FAQ + JSON-LD (FAQPage, ItemList, Article, Speakable).
 *
 * Routes are rendered by `app/startup-ideas/[slug]/page.tsx`. Slugs are
 * stable, they go into IndexNow on `postbuild`, so renames break
 * inbound citations and the sitemap reference.
 *
 * Anonymity rule restated: we do NOT name individual founders or stealth
 * teams here. The repos surfaced are public GitHub orgs that are already
 * indexed across the rest of the site (and on GitHub itself). Categories
 *, not people, are the unit of pSEO content here.
 */

export interface StartupIdeaFAQ {
  q: string;
  a: string;
}

export interface StartupIdeaMatch {
  /** Sector slugs from data/startups.json to include in the join. */
  sectorSlugs: string[];
  /** Optional signalType filter (matches against startup.signalType). */
  signalTypes?: string[];
  /**
   * Substring keywords matched (case-insensitive) against startup `name`
   * OR `description`. If provided, ANY match wins. If omitted, the join
   * falls back to the sector filter alone.
   */
  keywords?: string[];
  /**
   * Minimum commits in the 14-day window, filters out micro-orgs whose
   * percent-change is noise. Defaults to 10 in the resolver.
   */
  minCommits14d?: number;
}

export interface StartupIdea {
  /** URL slug at /startup-ideas/[slug]. Stable. */
  slug: string;
  /** Short category label used in the hub page. */
  category:
    | "AI-Native SaaS"
    | "Agent Infrastructure"
    | "Vertical AI"
    | "Dev Tools"
    | "Data Infrastructure"
    | "Multimodal"
    | "Vibe-Coding / Micro-SaaS"
    | "Climate & Niche"
    | "Open Source / Community";
  /** Page H1 + <title>. Should sound like an indie-builder essay headline. */
  title: string;
  /** Meta description (<= 160 chars). */
  metaDescription: string;
  /** TL;DR, speakable, lifted into Speakable schema, 1-2 sentences. */
  oneLiner: string;
  /** "Why now" paragraph, the trend that makes this buildable in 2026. */
  whyNow: string;
  /** "What you'd build today" paragraph, the concrete shape of the product. */
  buildToday: string;
  /** Live-signal join, the resolver uses this to pull top-3 repos. */
  matchSignal: StartupIdeaMatch;
  /** The seed-round pattern hiding in the trendline. */
  seedPattern: string;
  /** Suggested build-stack hints (tools/frameworks). */
  buildStack: string[];
  /** FAQ entries, emitted as FAQPage JSON-LD AND rendered as accordion. */
  faqs: StartupIdeaFAQ[];
  /** Related idea slugs to link from the bottom of the page. */
  related: string[];
  /** SEO keywords. */
  keywords: string[];
}

export const startupIdeas: StartupIdea[] = [
  // ----------------------------------------------------------------------
  // AI-Native SaaS, the "rebuild every category against GPT" cluster.
  // ----------------------------------------------------------------------
  {
    slug: "ai-native-crm",
    category: "AI-Native SaaS",
    title: "AI-native CRM: the idea you could build today, the repos already trying",
    metaDescription:
      "An AI-native CRM that drafts follow-ups, enriches contacts, and remembers context, the buildable opportunity in 2026, with three repos already accelerating against it.",
    oneLiner:
      "An AI-native CRM doesn't replace Salesforce, it replaces the salesperson's spreadsheet. The opportunity is the long tail of one-to-twenty-rep teams who never wanted Salesforce in the first place.",
    whyNow:
      "Two things changed in 2025-2026. First, the model layer (Claude, GPT-class, Gemini, Llama) got cheap enough to draft every outbound email at $0.001 each. Second, MCP made it feasible to give an agent read/write access to a contact graph without a custom integration per ICP. That kills the gap between \"CRM\" and \"sales copilot\", they're the same product now.",
    buildToday:
      "A single-table contact graph plus an agent that does three jobs well: (1) summarize every email and call into one row of context, (2) draft the next-step message in the operator's voice, (3) chase replies on a cadence the operator can pause from a chat command. Skip pipelines, dashboards, forecasting, those are sequels, not the wedge.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "ai-ml"],
      keywords: ["crm", "sales", "contact", "pipeline", "outreach", "lead"],
      minCommits14d: 20,
    },
    seedPattern:
      "Watch for repos that hit ~250 contributors and 1.5x commit acceleration over a quarter while still describing themselves as \"open-source CRM\", that's the dual-loop OSS-to-seed pattern Highrise / EspoCRM / Mautic ran before. The repos that flip the README to mention \"AI\" or \"agent\" in the same period are the ones raising in the next 6 weeks.",
    buildStack: [
      "Next.js + Postgres (Neon) for the contact graph",
      "MCP server exposing read/write tools to any host",
      "Embedding store (pgvector or Turbopuffer) for context recall",
      "Inngest or Vercel Queues for the chase cadence",
      "Stripe for billing, €19/seat is the indie ceiling",
    ],
    faqs: [
      {
        q: "Why not just build on top of Salesforce / HubSpot?",
        a: "Because the customer who wants an AI-native CRM is the one who never signed up for Salesforce. The market is the founder, the recruiter, the agent, the consultant, single-operator pipelines that today live in Notion and Apple Notes. They don't want a CRM with an AI bolt-on; they want a chat window that remembers context.",
      },
      {
        q: "How is this different from Attio or Folk?",
        a: "Attio and Folk are still pipeline-first, agent-second. The bet here is that the next-generation product is agent-first, the table view is a side effect of the conversation, not the surface area.",
      },
      {
        q: "Is the market big enough?",
        a: "There are roughly 30M solopreneurs, agencies, and one-to-twenty-rep teams worldwide who run sales out of an inbox today. €19/seat at 1% penetration is a €70M ARR business, and that's before vertical add-ons.",
      },
    ],
    related: ["ai-native-support", "ai-native-recruiting", "vertical-ai-real-estate", "voice-agents-for-sales"],
    keywords: ["ai crm", "ai-native crm", "ai sales copilot", "mcp crm", "startup ideas 2026"],
  },
  {
    slug: "ai-native-erp",
    category: "AI-Native SaaS",
    title: "AI-native ERP: the buildable opportunity hiding under NetSuite",
    metaDescription:
      "An AI-native ERP for the businesses NetSuite priced out, the buildable opportunity in 2026, with the three repos showing the pattern.",
    oneLiner:
      "ERP is the most-hated category in B2B software, and the smallest companies still need most of what it does. The wedge: one chat window that knows your invoices, your inventory, and your cash position.",
    whyNow:
      "NetSuite, SAP, and Oracle Fusion sell at price points that exclude every business under 50 people. Below that line, the operator runs the business in seven SaaS tools and a spreadsheet. Agents make it possible to unify that view without a six-figure implementation, the integration layer is now \"ask the model.\"",
    buildToday:
      "Start with one chat window that reads from QuickBooks / Xero, Stripe, Shopify, and a freight provider. Answer three questions well: how much cash do I have, what's my burn this month, what do I owe and to whom. The ERP comes later, the wedge is being the cockpit, not the database.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "supply-chain", "ai-ml"],
      keywords: ["erp", "accounting", "inventory", "finance", "ledger", "invoice"],
      minCommits14d: 15,
    },
    seedPattern:
      "Open-source ERP repos (ERPNext, Odoo-class) that suddenly add an \"AI assistant\" sub-module are the ones who get acqui-hired or raise a B-round on the AI-native re-positioning. Velocity spike around the AI sub-module is the lead indicator.",
    buildStack: [
      "Next.js + Postgres",
      "Plaid / Stripe / Xero APIs for live financial state",
      "MCP tools so the operator's CFO can hand off to an external accountant",
      "Vercel AI SDK for the chat surface",
    ],
    faqs: [
      {
        q: "Won't this just be another QuickBooks?",
        a: "QuickBooks is bookkeeping, it tells you what happened. The AI-native ERP tells you what to do next, with a draft of the action attached. That's a different product, not a feature.",
      },
      {
        q: "What's the moat?",
        a: "The chat-state graph. Once the agent has eight months of context, your vendors, your seasonality, your customers' payment patterns, switching costs are real. The chat thread is the moat.",
      },
    ],
    related: ["ai-native-accounting", "ai-native-billing", "ai-native-bi", "agent-payment-rails"],
    keywords: ["ai erp", "ai accounting", "small business erp", "ai cfo", "ai bookkeeping"],
  },
  {
    slug: "ai-native-support",
    category: "AI-Native SaaS",
    title: "AI-native customer support: the platform the chatbots can't beat",
    metaDescription:
      "The next Intercom is a chat window that ships with an agent runtime, not a ticket queue. The buildable opportunity with three repos already moving.",
    oneLiner:
      "Customer-support tools are the easiest place to deploy agents, they have structured inputs, clear outcomes, and the customer is asking to be helped. The opportunity is the platform that ships agent-first, not bolted-on.",
    whyNow:
      "Every support tool launched a \"GPT macro\" in 2024 and a \"copilot\" in 2025. None re-built the product around agents. The greenfield is the workflow where the AI takes the first ten messages, hands off only when stuck, and the human surface area is just the escalation queue.",
    buildToday:
      "A two-pane product: the customer's chat window on the left, the human's escalation view on the right. The agent has tools for refunds, order lookups, doc retrieval. The human only sees tickets the agent flagged as out-of-scope. Charge per resolved conversation, not per seat.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "ai-ml"],
      keywords: ["support", "helpdesk", "chatbot", "customer", "ticket", "chatwoot", "papercups"],
      minCommits14d: 15,
    },
    seedPattern:
      "Watch the open-source helpdesk repos (Chatwoot-class). The ones that ship a usable agent runtime in 2026 will follow the Vapi / Sierra pricing flip, per-conversation, not per-seat, and the velocity tells you when the flip is imminent.",
    buildStack: [
      "Vercel AI SDK for the agent loop",
      "Inngest for the escalation timer",
      "Postgres + pgvector for FAQ recall",
      "Stripe usage-based billing on \"resolved\"",
    ],
    faqs: [
      {
        q: "What about Intercom Fin / Zendesk AI?",
        a: "They sold to the existing buyer with the existing pricing model. The opportunity is the buyer who never wanted Intercom, Shopify stores, indie SaaS, agency-managed clients, who'll pay €0.50 per resolution instead of €99 per seat.",
      },
      {
        q: "How do you measure \"resolved\"?",
        a: "Customer doesn't reply within 24h after the agent's last message OR clicks a thumbs-up. Self-service definition the operator can audit. Don't overthink it.",
      },
    ],
    related: ["voice-agents-for-sales", "ai-native-crm", "agent-eval-platforms"],
    keywords: ["ai support", "ai helpdesk", "ai customer service", "intercom alternative", "sierra alternative"],
  },
  {
    slug: "ai-native-billing",
    category: "AI-Native SaaS",
    title: "AI-native billing: the agent that ships invoices and chases dunning",
    metaDescription:
      "The accounts-receivable workflow is begging for an agent. Buildable opportunity in 2026 with three repos already accelerating.",
    oneLiner:
      "Every B2B founder loses 4-8 hours a week to chasing invoices. The AI-native billing tool sends, follows up, and reconciles, with one chat input from the operator.",
    whyNow:
      "Stripe Billing solved subscriptions; nothing solved one-off B2B invoices for service businesses. The buyer is the agency, the freelance fleet, the consulting partner, all the businesses where billing is a chore the founder hates.",
    buildToday:
      "An inbox-shaped product: the operator drops a meeting transcript or a Slack DM, the agent drafts the invoice, schedules the send, follows up at +7 / +14 / +21 days with escalating tone. Stripe + a small ledger of \"paid / chasing / written off.\"",
    matchSignal: {
      sectorSlugs: ["fintech", "enterprise-saas"],
      keywords: ["invoice", "billing", "stripe", "dunning", "payment", "subscription"],
      minCommits14d: 10,
    },
    seedPattern:
      "Open-source billing repos that pivot from \"Stripe alternative\" to \"AI-billing assistant\" while keeping the same GitHub URL hit a 2-3x velocity bump in the quarter before the rename. That's the round-incoming tell.",
    buildStack: [
      "Stripe + Stripe Connect",
      "Resend for invoice emails",
      "Vercel AI SDK + tool calls for invoice draft",
      "Postgres for the AR ledger",
    ],
    faqs: [
      {
        q: "Doesn't Stripe already do this?",
        a: "Stripe sends invoices. It doesn't draft them from context, doesn't escalate tone on overdue, doesn't reconcile against the bank feed. The agent layer is the product.",
      },
    ],
    related: ["ai-native-accounting", "ai-native-erp", "agent-payment-rails"],
    keywords: ["ai billing", "ai invoice", "ai accounts receivable", "ai dunning", "stripe ai"],
  },
  {
    slug: "ai-native-accounting",
    category: "AI-Native SaaS",
    title: "AI-native accounting: the bookkeeper that doesn't sleep",
    metaDescription:
      "An AI-native bookkeeper for SMBs that categorizes, reconciles, and files, buildable today, with three open-source signals already moving.",
    oneLiner:
      "Bookkeeping is mostly pattern-matching and the patterns are public. The agent that does month-end close from a bank feed wins the small-business market.",
    whyNow:
      "Pilot and Bench proved SMBs will pay for managed bookkeeping. The agent layer turns the managed service into a per-account margin instead of a per-bookkeeper cost. That's the wedge for a vertical platform.",
    buildToday:
      "Connect to Plaid. Pull the bank feed. Auto-categorize every transaction with the model. Surface only the ones below a confidence threshold to the operator. Generate the month-end P&L and balance sheet. Ship to QuickBooks or stand alone.",
    matchSignal: {
      sectorSlugs: ["fintech", "enterprise-saas"],
      keywords: ["accounting", "bookkeeping", "ledger", "reconciliation", "tax", "quickbooks"],
      minCommits14d: 10,
    },
    seedPattern:
      "Open-source accounting repos (Akaunting, Manager-class) that suddenly start shipping ML-classification PRs are the seed-round candidates. The velocity bump in the classification module is the lead indicator.",
    buildStack: [
      "Plaid for the bank feed",
      "Postgres for the ledger",
      "Embedding-based classification, fine-tune the matcher monthly",
      "QuickBooks API for the export",
    ],
    faqs: [
      {
        q: "What about Pilot / Bench?",
        a: "They're managed services, humans in the loop. The AI-native bookkeeper is the same product without the humans, at 10% of the cost and twice the speed.",
      },
    ],
    related: ["ai-native-erp", "ai-native-billing", "vertical-ai-tax-prep"],
    keywords: ["ai accounting", "ai bookkeeping", "automated bookkeeping", "pilot alternative", "ai cfo"],
  },
  {
    slug: "ai-native-recruiting",
    category: "AI-Native SaaS",
    title: "AI-native recruiting: the sourcer who works at 4am",
    metaDescription:
      "The agent that sources, screens, and schedules candidates, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Recruiting is the second-most-automatable office job after sales, structured inputs, structured outputs, and the human only matters at the end. The buildable agent does the top of the funnel.",
    whyNow:
      "LinkedIn rate-limited the sourcing market. ATS tools (Greenhouse, Lever) refuse to ship real AI. The greenfield is a tool that does sourcing across LinkedIn, GitHub, and a custom signal set, then runs a structured screening conversation before a human sees the candidate.",
    buildToday:
      "Define the role in a chat input. Agent generates a search query, scrapes public profiles, scores against the criteria, drafts the outreach. When a candidate replies, agent runs a 5-question screen. Human reviews the screened pile, not the raw funnel.",
    matchSignal: {
      sectorSlugs: ["hr-tech", "enterprise-saas", "ai-ml"],
      keywords: ["recruit", "hiring", "ats", "sourcing", "candidate", "talent"],
      minCommits14d: 10,
    },
    seedPattern:
      "ATS repos and OSS \"recruiter copilot\" projects that add LinkedIn/GitHub graph traversal to their core in a 60-day window are the seed-stage tells. The contributor growth around the scrape layer is the leading indicator.",
    buildStack: [
      "Apollo / SignalHire / Clay for enrichment",
      "Vercel AI SDK for the screening agent",
      "Inngest for the multi-day follow-up cadence",
      "Postgres for the candidate graph",
    ],
    faqs: [
      {
        q: "Won't the platforms shut you down?",
        a: "LinkedIn already has, which is the wedge, the next-generation tool sources without LinkedIn. GitHub, conference attendee lists, Substack subscribers, open-source contributor graphs are the new sourcing surfaces.",
      },
    ],
    related: ["ai-native-crm", "ai-native-support", "vertical-ai-real-estate"],
    keywords: ["ai recruiting", "ai sourcing", "ai ats", "linkedin alternative", "talent agent"],
  },
  {
    slug: "ai-native-payroll",
    category: "AI-Native SaaS",
    title: "AI-native payroll: the agent that pays your contractors before you wake up",
    metaDescription:
      "AI-native payroll for the global contractor economy, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Gusto and Deel solved payroll for W-2s and full-time international hires. The next wave is the agent that runs payroll for a fleet of contractors across 30 countries with one chat input.",
    whyNow:
      "60M+ people worldwide work as cross-border contractors in 2026. The tooling is still spreadsheet-plus-Wise. The agent layer compresses tax form lookup, currency conversion, and payment timing into one approve-pay button.",
    buildToday:
      "Operator drops a list of contractors and amounts. Agent computes the local-currency equivalent, generates the right invoice / 1099 / IR3 form per jurisdiction, schedules the SEPA / Wise / Stripe Connect payout. Reconciles when the payment confirms.",
    matchSignal: {
      sectorSlugs: ["hr-tech", "fintech"],
      keywords: ["payroll", "payment", "contractor", "gusto", "deel"],
      minCommits14d: 10,
    },
    seedPattern:
      "Open-source payroll repos with cross-jurisdiction tax tables that add an LLM-classification layer hit the same velocity-bump pattern: 1.5-2x commit acceleration in the quarter before the AI-native re-positioning.",
    buildStack: [
      "Stripe Connect for the global rails",
      "Wise API for low-cost FX",
      "Postgres for the contractor graph",
      "Vercel AI SDK for the tax-form classifier",
    ],
    faqs: [
      {
        q: "What about Deel / Remote?",
        a: "They sell to companies with $1M+ in HR budget. The AI-native payroll tool sells to the operator who runs the show out of a Notion table and 20 Wise transfers a month.",
      },
    ],
    related: ["ai-native-billing", "ai-native-accounting", "agent-payment-rails"],
    keywords: ["ai payroll", "global payroll", "contractor payroll", "deel alternative", "gusto alternative"],
  },
  {
    slug: "ai-native-bi",
    category: "AI-Native SaaS",
    title: "AI-native BI: the dashboard that talks back",
    metaDescription:
      "Looker is dead. The next BI is a chat that reads your data warehouse and answers in three sentences. Buildable, with three signals already moving.",
    oneLiner:
      "Dashboards are a UI bug. The product is a chat window over the data warehouse that answers questions in plain English and draws the chart only when asked.",
    whyNow:
      "Snowflake, BigQuery, and Postgres now expose enough metadata for an agent to write correct SQL against them. Text-to-SQL crossed the 90% accuracy bar on real schemas in 2025. The remaining work is the operator-facing surface, chat, with a chart as a side effect.",
    buildToday:
      "Connect to one warehouse. Ingest schema + foreign keys + a 100-row sample. Operator asks a question. Agent generates SQL, runs it, returns three sentences of interpretation plus an optional chart. Save the chat thread, that's the new dashboard.",
    matchSignal: {
      sectorSlugs: ["data-infrastructure", "enterprise-saas", "ai-ml"],
      keywords: ["sql", "warehouse", "metabase", "superset", "dashboard", "bi", "analytics"],
      minCommits14d: 15,
    },
    seedPattern:
      "Metabase / Superset forks that ship a text-to-SQL module hit the velocity pattern. The fork itself isn't the bet, the wholly new repo that beats them to the agent-first product is.",
    buildStack: [
      "DuckDB or pg for the in-memory query layer",
      "Anthropic Claude or GPT-class for SQL gen",
      "Embedding store for schema retrieval",
      "Next.js + Vercel AI SDK for the chat surface",
    ],
    faqs: [
      {
        q: "Doesn't every BI tool ship an AI now?",
        a: "They ship AI as a sidebar. The product here is AI-first, the dashboard is a generated artifact, not the primary surface.",
      },
    ],
    related: ["ai-native-bi", "data-quality-monitors", "vector-databases"],
    keywords: ["ai bi", "ai analytics", "text to sql", "looker alternative", "metabase alternative"],
  },
  {
    slug: "ai-native-cms",
    category: "AI-Native SaaS",
    title: "AI-native CMS: the content engine that owns the brief",
    metaDescription:
      "Headless CMS plus an agent that writes, edits, and publishes, buildable in 2026 with three repos accelerating.",
    oneLiner:
      "The CMS market is mature. The next layer is the same product where the AI owns the brief, the draft, and the SEO pass, the human only approves.",
    whyNow:
      "Contentful and Sanity are infrastructure. They're not solving the actual content problem, which is producing the content. The greenfield is the CMS that ships a writer + editor + SEO agent in the same box.",
    buildToday:
      "Headless CMS data model, plus a chat surface where the operator drops a brief or topic. Agent drafts, links internally, picks images, generates schema. Operator approves with one click. The model is per-published-piece, not per-seat.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "ai-ml"],
      keywords: ["cms", "content", "headless", "publish", "blog", "directus", "strapi"],
      minCommits14d: 10,
    },
    seedPattern:
      "Open-source headless CMS repos (Directus, Strapi, Payload) that add an AI module hit the velocity pattern. The contributor growth on the AI module is the lead indicator, it shows the maintainer commits to the new product surface.",
    buildStack: [
      "Payload or Directus as the headless engine",
      "Vercel AI SDK for the agent loop",
      "Resend / Buttondown for the published-piece distribution",
      "Postgres + pgvector for internal-link retrieval",
    ],
    faqs: [
      {
        q: "What about Notion / Substack?",
        a: "Notion is a doc tool, Substack is a newsletter. The AI-native CMS is the editorial-pipeline tool for brands that publish 10+ pieces a month.",
      },
    ],
    related: ["ai-native-support", "voice-cloning-tools", "open-source-funding-platforms"],
    keywords: ["ai cms", "ai content", "ai blog", "headless cms ai", "ai writer"],
  },

  // ----------------------------------------------------------------------
  // Agent Infrastructure, the picks-and-shovels for the agent economy.
  // ----------------------------------------------------------------------
  {
    slug: "browser-use-agents",
    category: "Agent Infrastructure",
    title: "Browser-use agents: the buildable opportunity behind the headless wave",
    metaDescription:
      "Browser-use agents are the unsexy infrastructure of the agent economy. Three repos already showing the velocity pattern, buildable in 2026.",
    oneLiner:
      "Browser-use is to agents what Stripe was to payments, invisible plumbing, but the only way the agent gets work done. The buildable opportunity is the managed runtime, not the framework.",
    whyNow:
      "Anthropic shipped computer-use in 2024. Browser-use frameworks (Playwright-wrapping, DOM-aware) exploded in 2025. Every agent product needs a way to run a real browser session, capture state, recover from crashes. Nobody's ahead on the managed-runtime side.",
    buildToday:
      "A Firecracker-or-equivalent microVM that boots a real Chrome instance in <500ms, exposes WebDriver + screenshot streaming over HTTP, charges per session-minute. Throw in a recording / replay layer so the operator can audit what the agent saw.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "developer-tools"],
      keywords: ["browser", "playwright", "puppeteer", "automation", "scraping", "selenium"],
      minCommits14d: 20,
    },
    seedPattern:
      "Browser-automation OSS repos (Playwright-fork, Stagehand-class) with sudden 3x-5x velocity bumps inside a 6-week window are the seed-round candidates. Watch the contributor count on the agent-loop module.",
    buildStack: [
      "Vercel Sandbox (microVM) or Firecracker direct",
      "Playwright + a DOM-snapshot layer",
      "WebRTC for the live-view streaming",
      "Stripe usage-based billing on session-minutes",
    ],
    faqs: [
      {
        q: "What about Browserbase / Steel?",
        a: "They're the leaders. The wedge is the workload they can't price for, the long-running, multi-session agents where per-minute billing eats the operator's margin. A flat-rate plan for the indie tier is the underserved market.",
      },
    ],
    related: ["computer-use-agents", "headless-browser-fleets", "agent-observability"],
    keywords: ["browser-use", "browser agent", "browserbase alternative", "ai automation", "agent runtime"],
  },
  {
    slug: "computer-use-agents",
    category: "Agent Infrastructure",
    title: "Computer-use agents: the runtime for full-desktop automation",
    metaDescription:
      "Computer-use agents need a sandboxed desktop, not just a browser. Three repos showing the pattern, buildable in 2026.",
    oneLiner:
      "Browser-use solves 60% of agent work. The remaining 40%, anything that touches a native app, needs a sandboxed desktop. That's a separate product, and it's still greenfield.",
    whyNow:
      "Claude's computer-use API and the equivalent in OpenAI's stack made desktop-grounded agents practical in late 2024. By 2026 every AI-native legal / accounting / clinical product needs a runtime. The infrastructure layer is still wide open.",
    buildToday:
      "Linux desktop in a VM (Firecracker or Kata Containers), pre-installed with Chrome + LibreOffice + a screen-capture loop. Expose mouse, keyboard, screenshot, OCR as MCP tools. Bill per session-minute. Record sessions for audit.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "developer-tools"],
      keywords: ["desktop", "automation", "rpa", "computer-use", "agent", "sandbox"],
      minCommits14d: 15,
    },
    seedPattern:
      "RPA-class repos pivoting to LLM-grounded automation in a 60-day window are the seed-round tells. Watch for repos that flip from \"Selenium for desktop\" framing to \"computer-use runtime\" framing in their README.",
    buildStack: [
      "Vercel Sandbox or self-hosted Firecracker",
      "noVNC / WebRTC for live view",
      "Tesseract / Claude vision for OCR",
      "Postgres + S3 for the session recording",
    ],
    faqs: [
      {
        q: "Why not just give the agent SSH?",
        a: "Most of the AI-native vertical products run against apps that have no SSH or API, desktop legal software, clinical record systems, in-house tools. The desktop is the API.",
      },
    ],
    related: ["browser-use-agents", "agent-observability", "vertical-ai-legal"],
    keywords: ["computer-use", "computer-use agent", "rpa alternative", "ai desktop", "claude computer-use"],
  },
  {
    slug: "multi-agent-orchestration",
    category: "Agent Infrastructure",
    title: "Multi-agent orchestration: the LangGraph alternative people will actually use",
    metaDescription:
      "Multi-agent orchestration is the next durable-execution market. Three repos showing the velocity pattern.",
    oneLiner:
      "LangGraph won the developer mindshare, not the production market. The orchestrator that ships with durable execution and a single readable trace per agent run is the next category leader.",
    whyNow:
      "Every team that put an agent in production hit the same wall: long-running runs crash, retries are non-trivial, the trace is impossible to read. Workflow DevKit, Inngest, Temporal, and Restate are all racing for the durable-execution layer.",
    buildToday:
      "A TypeScript library that exposes one `step.run` primitive plus a `step.agent.invoke` for tool-calling loops. Crash-safe, retry-safe, single-trace-per-run. Ship it as an SDK on top of Vercel Workflow DevKit or Inngest, don't rebuild the durability layer.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["agent", "workflow", "orchestrat", "langchain", "langgraph", "crewai"],
      minCommits14d: 20,
    },
    seedPattern:
      "Repos that pivot from \"prompt framework\" to \"durable execution for agents\" hit the velocity-bump pattern. Watch for renames in commit messages around \"step.run\" or \"checkpoint\" semantics.",
    buildStack: [
      "Vercel Workflow DevKit OR Inngest",
      "TypeScript SDK with strict types",
      "OpenTelemetry for the trace",
      "Anthropic / OpenAI tool-calling under the hood",
    ],
    faqs: [
      {
        q: "What about LangGraph?",
        a: "LangGraph is the developer-experience leader for Python. The market gap is TypeScript-first with durable execution baked in. The build is opinionated, not framework-y.",
      },
    ],
    related: ["agent-memory-stores", "agent-observability", "agent-eval-platforms"],
    keywords: ["multi-agent", "agent orchestration", "langgraph alternative", "durable execution", "agent workflow"],
  },
  {
    slug: "agent-memory-stores",
    category: "Agent Infrastructure",
    title: "Agent memory stores: the database the LLM remembers",
    metaDescription:
      "Agent memory is the bottleneck for production agents. Three repos showing the pattern, buildable in 2026.",
    oneLiner:
      "Vector databases solved retrieval. Nobody solved memory, the layer above retrieval that knows what the agent already learned, forgot, and should re-check. That's the next category.",
    whyNow:
      "Every agent in production runs into the same problem: the context window fills up, the agent loses track, the user repeats themselves. The fix is a separate memory tier, write-on-significant-events, decay-by-recency, query-on-need.",
    buildToday:
      "A managed service that exposes three tools: `memory.write(event, importance)`, `memory.recall(query)`, `memory.forget(predicate)`. Backed by a graph + embedding store. MCP-first so any agent host can plug in.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "data-infrastructure"],
      keywords: ["memory", "rag", "retrieval", "vector", "embedding", "mem0"],
      minCommits14d: 15,
    },
    seedPattern:
      "Memory-layer OSS projects (Mem0-class, MemGPT-class) with sudden contributor surges around the \"importance scoring\" or \"decay\" modules are the seed-round leads.",
    buildStack: [
      "Postgres + pgvector OR Turbopuffer",
      "Embedding generation via OpenAI or Voyage",
      "MCP server for the read/write surface",
      "Inngest for the background re-indexing",
    ],
    faqs: [
      {
        q: "Isn't this just RAG with extra steps?",
        a: "RAG is read-only. Memory is read-write with importance scoring and decay. Different write path, different query semantics, different product.",
      },
    ],
    related: ["multi-agent-orchestration", "vector-databases", "embedding-as-a-service"],
    keywords: ["agent memory", "ai memory", "mem0 alternative", "memgpt alternative", "rag memory"],
  },
  {
    slug: "agent-observability",
    category: "Agent Infrastructure",
    title: "Agent observability: Datadog for the LLM stack",
    metaDescription:
      "Every team running agents in production needs observability. Three repos showing the velocity pattern.",
    oneLiner:
      "Agents are non-deterministic and expensive. Datadog doesn't know what to do with a tool-call trace. The dedicated observability tool wins because the data shape is different.",
    whyNow:
      "Langsmith, Helicone, and Weave are racing for the category. None of them is the obvious winner, the market is too early, and the buyer is the engineering manager who already pays for Datadog. The wedge is per-feature pricing on top of an existing trace pipeline.",
    buildToday:
      "OpenTelemetry-compatible span format for LLM calls. Capture prompt, response, tools, cost, latency. Drop into Grafana / Datadog as a layer on top, or self-host. Free for the first 10K spans/month, that's the indie tier.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["observability", "tracing", "telemetry", "monitoring", "langsmith", "helicone"],
      minCommits14d: 15,
    },
    seedPattern:
      "OSS observability repos that ship an LLM-span exporter in the same quarter their core observability product gets a velocity bump are the seed-stage tells.",
    buildStack: [
      "OpenTelemetry SDK",
      "ClickHouse for the trace storage",
      "Next.js dashboard",
      "Vercel for the ingest endpoint",
    ],
    faqs: [
      {
        q: "Won't Datadog just add LLM tracing?",
        a: "They already did, and it's an afterthought. The agent-observability winner is the product that's LLM-native from day one and integrates with everything else as an export.",
      },
    ],
    related: ["agent-eval-platforms", "multi-agent-orchestration", "open-source-observability"],
    keywords: ["agent observability", "llm observability", "langsmith alternative", "ai monitoring", "llm tracing"],
  },
  {
    slug: "agent-eval-platforms",
    category: "Agent Infrastructure",
    title: "Agent eval platforms: the regression test suite for non-deterministic code",
    metaDescription:
      "Eval is the unsolved part of shipping agents. Three repos accelerating in 2026.",
    oneLiner:
      "Unit tests don't work for agents. The eval platform that lets a team define a regression suite over real conversations, with model-graded scoring, is the next category leader.",
    whyNow:
      "Every team shipping agents has homegrown eval scripts. The pattern is the same: capture real traffic, label outcomes, replay against new prompts, compare scores. Nobody productized it well enough.",
    buildToday:
      "Two surfaces: (1) an SDK that captures any agent run as a recordable trace, (2) a web app where the operator labels traces, defines a model-graded rubric, and re-runs them against any prompt/model change. Pricing per evaluated trace, not per seat.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "developer-tools"],
      keywords: ["eval", "benchmark", "test", "regression", "rubric", "ai-test"],
      minCommits14d: 10,
    },
    seedPattern:
      "Eval-suite OSS repos with sudden contributor surges around \"LLM-as-judge\" modules are the seed-round tells. The repos that ship a CI integration in the same window are the strong leads.",
    buildStack: [
      "Postgres for the trace + label store",
      "Vercel AI SDK for the model-graded judging",
      "GitHub Actions integration for CI",
      "Stripe usage-based billing on evaluated traces",
    ],
    faqs: [
      {
        q: "What about Braintrust / LangFuse?",
        a: "They're the leaders. The opportunity is the long tail, the team that doesn't want a $500/mo SaaS and would happily self-host a smaller product. The OSS-first wedge.",
      },
    ],
    related: ["agent-observability", "multi-agent-orchestration", "open-source-observability"],
    keywords: ["agent eval", "llm eval", "braintrust alternative", "langfuse alternative", "ai testing"],
  },
  {
    slug: "agent-payment-rails",
    category: "Agent Infrastructure",
    title: "Agent payment rails: x402, USDC, and the buildable layer above them",
    metaDescription:
      "Agents need to pay other agents. Three repos showing the pattern, buildable in 2026.",
    oneLiner:
      "The agent economy needs sub-cent, on-demand payment between machines. x402 + USDC on Base is the protocol. The buildable layer is the wallet + invoicing + reconciliation on top.",
    whyNow:
      "x402 is HTTP 402 finally working. CDP Server Wallets and circle's USDC make agent-to-agent payments trivial. The remaining work is the operator-facing surface: per-agent budgets, spend caps, reconciliation against the books.",
    buildToday:
      "A managed CDP wallet per agent. Set spend caps in a chat input. Auto-tag every payment with the calling agent. Export to QuickBooks at month-end. Charge a per-transaction fee, not a SaaS subscription.",
    matchSignal: {
      sectorSlugs: ["fintech", "web3", "ai-ml"],
      keywords: ["x402", "usdc", "wallet", "payment", "stripe", "crypto"],
      minCommits14d: 10,
    },
    seedPattern:
      "Repos that integrate x402 / USDC / CDP in their READMEs while also describing themselves as \"agent-first\" hit the velocity pattern. The contributor growth in the payment-adapter module is the lead.",
    buildStack: [
      "Coinbase CDP Server Wallets",
      "x402 middleware",
      "USDC on Base",
      "QuickBooks API for reconciliation",
    ],
    faqs: [
      {
        q: "Why not just use Stripe?",
        a: "Stripe doesn't settle in <1s and doesn't work for sub-cent amounts. The agent economy needs both. Stripe is the rail for the human checkout, x402+USDC is the rail for machine-to-machine.",
      },
    ],
    related: ["ai-native-billing", "ai-native-erp", "browser-use-agents"],
    keywords: ["x402", "agent payment", "usdc payment", "ai wallet", "agent-to-agent payment"],
  },
  {
    slug: "headless-browser-fleets",
    category: "Agent Infrastructure",
    title: "Headless browser fleets: the per-minute compute primitive",
    metaDescription:
      "Headless browser fleets are the new compute. Three repos showing the pattern.",
    oneLiner:
      "A managed pool of headless Chrome instances, autoscaling on demand, billed per minute. The compute primitive every agent product needs.",
    whyNow:
      "Browser-use, web scrapers, AI testing tools, screenshot generators, all of them need the same primitive. Nobody's built the equivalent of Cloudflare Workers for headless Chrome.",
    buildToday:
      "Pool of pre-warmed Chrome instances on Vercel Sandbox or self-hosted Firecracker. WebSocket-based session API. Per-minute billing. Free 1-hour tier for builders. Ship MCP tools so any agent host can grab a browser without a custom integration.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["browser", "chrome", "headless", "puppeteer", "playwright", "fleet"],
      minCommits14d: 15,
    },
    seedPattern:
      "Browser-pool OSS projects that add per-tenant isolation in a 60-day window are the seed-round candidates. Watch the contributor count on the isolation module.",
    buildStack: [
      "Vercel Sandbox or Firecracker for isolation",
      "Playwright runtime",
      "Postgres for session metadata",
      "Stripe for per-minute billing",
    ],
    faqs: [
      {
        q: "Browserbase already does this?",
        a: "Yes, and so does Steel, and Bright Data, and ScrapingBee. The market's bigger than any one of them, and the indie / OSS-first slot is open.",
      },
    ],
    related: ["browser-use-agents", "computer-use-agents", "agent-observability"],
    keywords: ["headless browser", "browser fleet", "browserbase alternative", "puppeteer cloud", "playwright cloud"],
  },

  // ----------------------------------------------------------------------
  // Vertical AI, the "AI for X" cluster.
  // ----------------------------------------------------------------------
  {
    slug: "vertical-ai-legal",
    category: "Vertical AI",
    title: "Vertical AI for legal: the buildable opportunity behind Harvey",
    metaDescription:
      "Vertical AI for legal, buildable in 2026 below the AmLaw 200 tier, with three repos showing the pattern.",
    oneLiner:
      "Harvey solved AI for the BigLaw partner. Nobody solved it for the 90% of lawyers who work in firms under 50 attorneys, where billables matter more than research depth.",
    whyNow:
      "Solo practitioners and small firms still bill by the hour. The AI tool that drafts a contract, redlines a brief, and outputs a billable-hours export to Clio wins the long tail. The buyer is the small-firm partner who already pays $200/mo for LawPay.",
    buildToday:
      "A Clio / MyCase / PracticePanther integration that ingests case files, generates first drafts of motions / contracts / discovery responses. Tracks AI-assisted time as a separate billable. Ships with a redline review surface.",
    matchSignal: {
      sectorSlugs: ["legal-tech", "ai-ml"],
      keywords: ["legal", "law", "contract", "redline", "compliance"],
      minCommits14d: 5,
    },
    seedPattern:
      "Legal-tech OSS repos that ship an LLM contract-review module hit the seed-stage tell. The velocity bump in the redline / diff layer is the lead indicator.",
    buildStack: [
      "Anthropic Claude for the long-context reasoning",
      "Clio / Practice Panther APIs for billable-hours sync",
      "Postgres + pgvector for the firm's knowledge base",
      "PDF parsing, Unstructured.io or LlamaParse",
    ],
    faqs: [
      {
        q: "What about Harvey, Spellbook, Robin?",
        a: "Harvey is AmLaw 200. Spellbook is contracts only. Robin is litigation-flavored. The wedge is the solo / small-firm operator who doesn't fit any of them.",
      },
    ],
    related: ["vertical-ai-medical", "vertical-ai-tax-prep", "ai-native-accounting"],
    keywords: ["ai legal", "legal ai", "harvey alternative", "spellbook alternative", "ai law"],
  },
  {
    slug: "vertical-ai-medical",
    category: "Vertical AI",
    title: "Vertical AI for medical: the scribe that finishes the note",
    metaDescription:
      "AI medical scribes are a $2B market. The next layer is the platform, buildable, with three repos accelerating.",
    oneLiner:
      "AI medical scribes won the wedge. The next product is the platform, coding, billing, prior-auth, and patient follow-up in one agent layer above the EMR.",
    whyNow:
      "Abridge and Suki proved providers will pay for the scribe. The market is now ready for the layer above, the agent that also files the claim, drafts the prior-auth, and follows up with the patient.",
    buildToday:
      "Connect to Epic or Athena via the FHIR API. Listen to the visit, write the note, generate the ICD-10 / CPT codes, draft the prior-auth letter, schedule the patient follow-up. Ship as a chat surface for the physician on the iPad.",
    matchSignal: {
      sectorSlugs: ["healthcare", "ai-ml"],
      keywords: ["medical", "health", "ehr", "fhir", "clinical", "patient"],
      minCommits14d: 5,
    },
    seedPattern:
      "Healthcare OSS repos that integrate FHIR + an LLM in the same release cycle hit the seed-stage tell. The contributor growth around the FHIR adapter is the lead.",
    buildStack: [
      "FHIR APIs (Epic, Athena, Cerner)",
      "Whisper or Deepgram for transcription",
      "Anthropic Claude for the clinical reasoning",
      "Stripe for per-provider seat billing",
    ],
    faqs: [
      {
        q: "What about Abridge, Suki, Nuance DAX?",
        a: "Scribes only. The opportunity is the workflow above, claim filing, prior-auth, follow-up, which still runs on Excel and faxes at most practices.",
      },
    ],
    related: ["vertical-ai-veterinary", "vertical-ai-dentistry", "ai-native-recruiting"],
    keywords: ["ai medical", "ai scribe", "abridge alternative", "suki alternative", "fhir ai"],
  },
  {
    slug: "vertical-ai-real-estate",
    category: "Vertical AI",
    title: "Vertical AI for real estate: the agent that handles the buyer's first 10 conversations",
    metaDescription:
      "Vertical AI for real estate brokers, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Real estate agents lose deals to slow follow-up. The AI that texts every Zillow lead within 60 seconds, qualifies them, and books a showing wins the broker market.",
    whyNow:
      "The lead-conversion gap in residential real estate is 6x. Brokers know it. The tools that exist (Lofty, Top Producer) are CRMs, not agents. The greenfield is the agent that runs the front-of-funnel.",
    buildToday:
      "Twilio number per agent, text/voice routing. New lead comes in, agent texts immediately, asks 5 qualifying questions, books the showing on the agent's Google Calendar. Fall back to a human at any escalation. Bill per-booking, not per-seat.",
    matchSignal: {
      sectorSlugs: ["proptech", "enterprise-saas", "ai-ml"],
      keywords: ["real-estate", "broker", "property", "mls", "zillow"],
      minCommits14d: 5,
    },
    seedPattern:
      "Real-estate-CRM OSS repos that ship an SMS / voice-agent layer in a 90-day window are the seed-round tells. The velocity in the voice-routing module is the lead indicator.",
    buildStack: [
      "Twilio Voice + SMS",
      "Vapi or Cartesia for voice agents",
      "Postgres for the lead graph",
      "Stripe for per-booking pricing",
    ],
    faqs: [
      {
        q: "What about Lofty / Top Producer?",
        a: "Both are CRMs with an AI sidebar. The product here is agent-first, the lead conversion is the wedge, and the CRM is a side effect.",
      },
    ],
    related: ["voice-agents-for-sales", "ai-native-crm", "vertical-ai-construction"],
    keywords: ["ai real estate", "real estate ai", "ai broker", "lofty alternative", "zillow lead"],
  },
  {
    slug: "vertical-ai-construction",
    category: "Vertical AI",
    title: "Vertical AI for construction: blueprint agent",
    metaDescription:
      "Vertical AI for construction PMs reads PDF blueprints, extracts quantity takeoffs, flags spec discrepancies, and drafts RFIs, a buildable 2026 wedge targeting 50,000 mid-market GCs underserved by Procore, with three repos already showing the pattern.",
    oneLiner:
      "Construction PMs spend half their day on takeoffs, RFIs, and submittal review. The AI that does all three from a PDF blueprint wins the small-and-mid-market GC.",
    whyNow:
      "PDF parsing and computer-vision matured to the point where reading a blueprint is a solved problem. Procore and PlanGrid sell to the top 200 GCs. The 50,000 mid-market GCs run on Bluebeam + Excel.",
    buildToday:
      "Upload a blueprint set. Agent extracts a quantity takeoff, lists discrepancies, drafts RFIs against ambiguous spec callouts. Bill per blueprint set processed.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "ai-ml"],
      keywords: ["construction", "blueprint", "cad", "bim", "estimating"],
      minCommits14d: 5,
    },
    seedPattern:
      "Construction-tech OSS with PDF+vision pipelines that hit a 2x velocity bump are the seed-stage tells.",
    buildStack: [
      "PDF + OCR (Unstructured / LlamaParse)",
      "Anthropic Claude for the spec reasoning",
      "Postgres for the project graph",
      "S3 for the blueprint storage",
    ],
    faqs: [
      {
        q: "What about Procore?",
        a: "Procore's $1.2B revenue is all top-200 GCs. The mid-market is where the AI-native product wins because they can't afford a Procore seat anyway.",
      },
    ],
    related: ["vertical-ai-real-estate", "vertical-ai-logistics", "ai-native-erp"],
    keywords: ["ai construction", "construction ai", "ai takeoff", "procore alternative", "blueprint ai"],
  },
  {
    slug: "vertical-ai-insurance",
    category: "Vertical AI",
    title: "Vertical AI for insurance: the underwriter that doesn't sleep",
    metaDescription:
      "Vertical AI for insurance brokers and small-commercial underwriters, buildable in 2026.",
    oneLiner:
      "Insurance underwriting is structured-text classification at scale, and small-commercial is still done in Excel. The AI that quotes a policy from a loss-run PDF in under 2 minutes wins.",
    whyNow:
      "Reinsurance and large-commercial have AI vendors. Small-commercial, the agency that quotes a restaurant or a contractor's GL policy, still does it by hand. The market is fragmented, the buyer is the broker, and the AI is buildable from public underwriting guides.",
    buildToday:
      "Loss-run PDF in, structured risk profile out. Match to 3-5 carrier appetites. Generate the quote letter. Ship as a Chrome extension on top of the broker's existing AMS.",
    matchSignal: {
      sectorSlugs: ["fintech", "enterprise-saas", "ai-ml"],
      keywords: ["insurance", "underwriting", "policy", "claims", "broker"],
      minCommits14d: 5,
    },
    seedPattern:
      "InsurTech OSS repos that ship a PDF-classification pipeline hit the seed-stage tell. Watch the velocity around the loss-run parser.",
    buildStack: [
      "PDF parsing via Unstructured / LlamaParse",
      "Anthropic Claude for the underwriting reasoning",
      "Postgres for the carrier-appetite graph",
      "Chrome extension for the broker UI",
    ],
    faqs: [
      {
        q: "Is the regulatory burden too high?",
        a: "For carriers, yes. For brokers, no, they sell the policy, the carrier underwrites it. The agent assists the broker; the carrier still signs.",
      },
    ],
    related: ["vertical-ai-tax-prep", "vertical-ai-legal", "ai-native-accounting"],
    keywords: ["ai insurance", "insurance ai", "ai underwriting", "broker ai", "small commercial insurance"],
  },
  {
    slug: "vertical-ai-tax-prep",
    category: "Vertical AI",
    title: "Vertical AI for tax prep: the buildable opportunity behind Intuit's moat",
    metaDescription:
      "Vertical AI for tax preparation, buildable in 2026 in the prosumer / SMB segment.",
    oneLiner:
      "TurboTax owns the consumer. Nobody owns the small accountant who files for 200 clients a year, and the agent that does 30% of the data-entry work wins them.",
    whyNow:
      "1099 + W-2 + state form OCR is solved. The remaining work is the workflow on top, collecting docs, asking the right questions, drafting the return. Intuit ProConnect is mediocre; the indie tax preparer is hungry.",
    buildToday:
      "A doc-collection chat for the client (texts, emails, uploads), an OCR + classification pipeline on the prep side, and a generated draft of the federal + state return. Preparer reviews + files. Bill per filed return.",
    matchSignal: {
      sectorSlugs: ["fintech", "ai-ml"],
      keywords: ["tax", "irs", "1099", "filing", "accounting"],
      minCommits14d: 5,
    },
    seedPattern:
      "Tax-OSS repos that integrate IRS form parsing with an LLM-classification layer hit the seed-stage tell.",
    buildStack: [
      "Unstructured / LlamaParse for form extraction",
      "Postgres for the client graph",
      "Anthropic Claude for the prep reasoning",
      "Twilio for the doc-collection texts",
    ],
    faqs: [
      {
        q: "What about TurboTax / FreeTaxUSA?",
        a: "Consumer-direct. The buyer here is the small CPA / EA who files 200 returns a year. Different motion, different pricing, different product.",
      },
    ],
    related: ["ai-native-accounting", "vertical-ai-insurance", "ai-native-erp"],
    keywords: ["ai tax", "tax ai", "ai cpa", "turbotax alternative", "proconnect alternative"],
  },
  {
    slug: "vertical-ai-veterinary",
    category: "Vertical AI",
    title: "Vertical AI for veterinary: the medical-scribe play, with fur",
    metaDescription:
      "Vertical AI for veterinary practices, buildable in 2026 as the medical-scribe play applied to a 30,000-clinic market.",
    oneLiner:
      "Vet clinics have the same scribe problem as human medicine, they just don't have the AI vendors yet. Same product, smaller addressable market, much less competition.",
    whyNow:
      "30,000+ vet clinics in the US alone. The PIMS (practice information management system) market is dominated by 3 legacy vendors. AI-scribe penetration is essentially zero in 2026.",
    buildToday:
      "Audio capture during the visit, structured note in the PIMS format. Ship as a Chrome extension on top of Avimark, ezyVet, or DaySmart. Per-vet seat pricing under $100/mo.",
    matchSignal: {
      sectorSlugs: ["healthcare", "ai-ml"],
      keywords: ["veterinary", "vet", "animal", "clinical", "medical"],
      minCommits14d: 3,
    },
    seedPattern:
      "Healthcare AI OSS that ships a vet-specific fine-tune hit the seed-stage tell.",
    buildStack: [
      "Whisper / Deepgram for audio",
      "Chrome extension for the PIMS injection",
      "Anthropic Claude for note structure",
      "Stripe for per-vet billing",
    ],
    faqs: [
      {
        q: "Is the market too small?",
        a: "$3B in PIMS revenue, with 30K clinics. At $100/mo per vet (avg 2.5 vets/clinic), that's a $90M ARR market on penetration alone, and the AI add-on prices above the PIMS, not under it.",
      },
    ],
    related: ["vertical-ai-medical", "vertical-ai-dentistry", "ai-native-recruiting"],
    keywords: ["ai vet", "veterinary ai", "vet scribe", "ezyvet ai", "avimark ai"],
  },
  {
    slug: "vertical-ai-dentistry",
    category: "Vertical AI",
    title: "Vertical AI for dentistry: the scribe + the claims agent in one",
    metaDescription:
      "Vertical AI for dental practices, buildable in 2026 as the scribe + claims combo.",
    oneLiner:
      "Dental practices need the medical-scribe + the insurance-claims-agent in one product. Neither exists. The market is 200,000+ practices in the US alone.",
    whyNow:
      "DSO consolidation is accelerating. The independent dentist is under pressure on margin. The AI that runs the scribe + the claims workflow is a direct cost saver, not a productivity boost. That's a stronger sell.",
    buildToday:
      "Same scribe model as vet/medical, plus a claims-filing agent on top. Connect to Dentrix or Open Dental. Ship as a Chrome extension or PIMS plugin. Per-practice pricing.",
    matchSignal: {
      sectorSlugs: ["healthcare", "ai-ml"],
      keywords: ["dental", "dentist", "claims", "insurance", "ehr"],
      minCommits14d: 3,
    },
    seedPattern:
      "DSO-class OSS or dental-PMS plugins that ship claims-AI features hit the velocity pattern. Watch the contributor growth around CDT coding.",
    buildStack: [
      "Whisper / Deepgram for audio",
      "Anthropic Claude for note structure + claims drafting",
      "Postgres for the patient + claims ledger",
      "Stripe for per-practice billing",
    ],
    faqs: [
      {
        q: "What about Dentrix Ascend / Open Dental?",
        a: "PMS only. The AI workflow ships as a plugin on top, same go-to-market as the medical-scribe play.",
      },
    ],
    related: ["vertical-ai-medical", "vertical-ai-veterinary", "ai-native-billing"],
    keywords: ["ai dental", "dental ai", "ai dentist", "dentrix ai", "open dental ai"],
  },
  {
    slug: "vertical-ai-logistics",
    category: "Vertical AI",
    title: "Vertical AI for logistics: the dispatcher that doesn't sleep",
    metaDescription:
      "Vertical AI for freight brokers and 3PLs, buildable in 2026 as the dispatcher-agent play.",
    oneLiner:
      "Freight brokerage is 95% phone calls and emails. The AI dispatcher that handles load matching, driver scheduling, and rate-confirmation paperwork wins the small-broker market.",
    whyNow:
      "Convoy went down. Uber Freight stalled. The independent freight broker is back in business, and the tooling is still TMS + DAT + phone. The AI dispatcher is a direct-to-broker product.",
    buildToday:
      "Connect to DAT / Truckstop for the load board. Agent matches loads to drivers based on the broker's historical preferences. Drafts rate-confirmation paperwork. Handles the back-and-forth via SMS / voice on a Twilio number.",
    matchSignal: {
      sectorSlugs: ["supply-chain", "enterprise-saas", "ai-ml"],
      keywords: ["logistics", "freight", "dispatch", "shipping", "tms"],
      minCommits14d: 5,
    },
    seedPattern:
      "OSS TMS / freight tools that add LLM dispatcher modules hit the velocity pattern. Watch the contributor count around the rate-conf draft module.",
    buildStack: [
      "DAT / Truckstop API",
      "Twilio Voice + SMS",
      "Vapi or Cartesia for the voice agent",
      "Postgres for the carrier graph",
    ],
    faqs: [
      {
        q: "Is freight brokerage too old-school for AI?",
        a: "Yes, which is exactly why the AI savings are 4-5x larger than they would be in a digital-native vertical. The TAM is also enormous: $90B+ in US freight brokerage gross revenue.",
      },
    ],
    related: ["vertical-ai-construction", "vertical-ai-real-estate", "ai-native-erp"],
    keywords: ["ai logistics", "ai freight", "ai dispatch", "freight broker ai", "tms ai"],
  },

  // ----------------------------------------------------------------------
  // Dev Tools, the cluster engineers buy on a credit card.
  // ----------------------------------------------------------------------
  {
    slug: "ai-code-review",
    category: "Dev Tools",
    title: "AI code review: the GitHub Action that doesn't ship junk PRs",
    metaDescription:
      "AI code review tools are crowded. The buildable opportunity is the model-graded review that ships only useful comments.",
    oneLiner:
      "Every AI code-review tool currently spams the PR with low-signal comments. The product that wins is the one that ships <3 comments per PR and is right >85% of the time.",
    whyNow:
      "GitHub Copilot Review, CodeRabbit, Cursor's reviewer, and a dozen others are racing. None of them solved the signal-to-noise problem. The team that fine-tunes a small reviewer model on a per-repo basis beats the generic ones.",
    buildToday:
      "GitHub App that listens to PRs. On open, run the diff through a 2-stage review: cheap model proposes, expensive model filters. Comment only what passes the filter. Train a per-repo classifier on which comments the team accepted vs. dismissed.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["code-review", "github-action", "linter", "ci", "review"],
      minCommits14d: 10,
    },
    seedPattern:
      "OSS code-review repos with sudden contributor surges around \"per-repo training\" or \"comment classifier\" modules are the seed-round leads.",
    buildStack: [
      "GitHub App (Probot)",
      "Anthropic Claude or GPT-class for the diff review",
      "Small classifier model fine-tuned on accept/dismiss",
      "Postgres for the per-repo feedback graph",
    ],
    faqs: [
      {
        q: "What about CodeRabbit?",
        a: "Leader of the current generation. The bet is the next generation, per-repo fine-tuning beats generic-prompt fanfic on signal quality.",
      },
    ],
    related: ["ai-test-generation", "ai-debugging-assistants", "dev-environment-as-a-service"],
    keywords: ["ai code review", "coderabbit alternative", "github action ai", "ai pr review", "code review automation"],
  },
  {
    slug: "ai-test-generation",
    category: "Dev Tools",
    title: "AI test generation: the agent that writes the regression suite you avoid",
    metaDescription:
      "AI test generation is buildable. The wedge is the per-PR \"close the coverage gap\" workflow.",
    oneLiner:
      "Nobody writes tests for the legacy module. The agent that opens a PR with passing tests against an uncovered file is the developer-tool wedge.",
    whyNow:
      "AST parsing + LLMs cleared the test-generation bar in 2025. The remaining work is the developer-experience layer, running the tests in CI, opening the PR, handling the flake.",
    buildToday:
      "GitHub App that detects uncovered files on every PR. Generates tests for the diff. Opens a separate PR with the new tests. CI runs both; failing tests get the LLM-iteration treatment. Per-repo billing.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["test", "testing", "coverage", "qa", "ci"],
      minCommits14d: 10,
    },
    seedPattern:
      "Test-gen OSS repos with sudden velocity in the \"flake-handling\" or \"CI integration\" modules are the seed-stage tells.",
    buildStack: [
      "AST parsing via Babel / TypeScript compiler API",
      "Anthropic Claude for the test logic",
      "GitHub Actions for the CI integration",
      "Postgres for the per-repo coverage history",
    ],
    faqs: [
      {
        q: "What about Codium / Qodo?",
        a: "They're the leaders. The wedge is the agent-first, no-IDE-plugin version that lives entirely in GitHub Actions and doesn't ask the developer to change tools.",
      },
    ],
    related: ["ai-code-review", "ai-debugging-assistants", "agent-eval-platforms"],
    keywords: ["ai test", "ai test generation", "codium alternative", "qodo alternative", "ai qa"],
  },
  {
    slug: "ai-debugging-assistants",
    category: "Dev Tools",
    title: "AI debugging assistants: the rubber duck that reads the stack trace",
    metaDescription:
      "AI debugging assistants, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "The most-shared moment in any engineering team is a stack trace pasted into Slack. The AI that reads the trace, finds the cause, and proposes the fix is the rubber-duck assistant for the team.",
    whyNow:
      "Sentry and Rollbar collect the traces. Cursor and Copilot live in the IDE. Nobody owns the middle layer, the chat-shaped debugging assistant that takes the trace and ships a draft fix.",
    buildToday:
      "Slack bot that picks up pasted stack traces. Reads the linked repo, finds the relevant code, proposes the fix as a chat reply. If the team accepts, opens a PR. Bill per-fix-accepted.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["debug", "error", "sentry", "stack-trace", "monitor"],
      minCommits14d: 10,
    },
    seedPattern:
      "OSS Slack-bot + LLM debugger repos with velocity bumps in the \"stack-trace classification\" module are the seed-stage tells.",
    buildStack: [
      "Slack bot framework",
      "GitHub API for the repo read",
      "Anthropic Claude with extended thinking for the diagnosis",
      "Stripe per-fix billing",
    ],
    faqs: [
      {
        q: "What about Sentry's Autofix?",
        a: "It's a sidebar in Sentry. The bet here is that the debugging chat is a chat, not a feature inside an error-tracking tool.",
      },
    ],
    related: ["ai-code-review", "ai-test-generation", "agent-observability"],
    keywords: ["ai debugging", "ai stack trace", "sentry autofix alternative", "ai bug fix", "ai slack bot"],
  },
  {
    slug: "dev-environment-as-a-service",
    category: "Dev Tools",
    title: "Dev environment as a service: the post-Codespaces opportunity",
    metaDescription:
      "Cloud dev environments, buildable in 2026 with three repos showing the pattern.",
    oneLiner:
      "Codespaces is too generic. Devbox is too DIY. The opportunity is the team-tier product that ships a per-repo cloud dev env with prebuilt agents inside.",
    whyNow:
      "AI agents need a real dev environment to do real work, not a sandbox, not a notebook. The remote-dev-env market is consolidating, and the agent-friendly variant is wide open.",
    buildToday:
      "Per-repo Nix or Docker config. Boot a remote env in <30s. Pre-warm with the project's deps. Ship an MCP server inside the env so any agent host can execute commands. Per-active-minute pricing.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["devcontainer", "codespaces", "nix", "dev-env", "remote"],
      minCommits14d: 10,
    },
    seedPattern:
      "Dev-env OSS repos that add an MCP server module hit the velocity pattern.",
    buildStack: [
      "Vercel Sandbox or Firecracker for the VM",
      "Nix or Docker for the env config",
      "MCP server pre-installed in the env",
      "Stripe per-minute billing",
    ],
    faqs: [
      {
        q: "What about Codespaces / Gitpod / Coder?",
        a: "All three sell the env to humans. The agent-first version sells the same primitive to AI hosts, and the pricing per-session is different than per-seat.",
      },
    ],
    related: ["browser-use-agents", "computer-use-agents", "ai-code-review"],
    keywords: ["dev environment", "devcontainer", "codespaces alternative", "gitpod alternative", "agent dev env"],
  },
  {
    slug: "open-source-observability",
    category: "Dev Tools",
    title: "Open-source observability: the Datadog alternative that doesn't bankrupt you",
    metaDescription:
      "Open-source observability, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Datadog made a $40B business out of observability. The OSS alternatives (SigNoz, OpenObserve, Highlight) are 18 months behind on features but 100x cheaper. The next leader fills the gap.",
    whyNow:
      "OpenTelemetry standardized the data shape. ClickHouse made the backend tractable. Anyone can build a Datadog clone in 2026, the bet is which OSS team has the best DX wins the market.",
    buildToday:
      "OpenTelemetry-native ingest. ClickHouse or Apache Druid for the trace + log store. Grafana-style frontend. Charge for the hosted version, ship the OSS version under Apache 2.0. Per-GB ingest pricing under $0.20.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "data-infrastructure"],
      keywords: ["observability", "tracing", "logs", "metrics", "monitoring"],
      minCommits14d: 15,
    },
    seedPattern:
      "OSS observability repos with sudden contributor surges around the \"hosted backend\" or \"single-binary\" milestone are the seed-round leads.",
    buildStack: [
      "OpenTelemetry collector",
      "ClickHouse or Druid",
      "Grafana for the dashboards",
      "Vercel for the hosted SaaS frontend",
    ],
    faqs: [
      {
        q: "What about SigNoz / OpenObserve?",
        a: "They're the current leaders. The next wave is the OTel-first project with first-class agent / LLM trace support and a managed SaaS that prices under SigNoz Cloud.",
      },
    ],
    related: ["agent-observability", "infra-cost-optimizers", "real-time-etl"],
    keywords: ["open source observability", "datadog alternative", "signoz alternative", "opentelemetry", "self-hosted apm"],
  },
  {
    slug: "infra-cost-optimizers",
    category: "Dev Tools",
    title: "Infra cost optimizers: agent in AWS bill",
    metaDescription:
      "Infra cost optimizers read AWS, GCP, and Azure bills, find idle instances and oversized RDS, and open a Terraform fix PR, a buildable 2026 FinOps wedge for series-B teams, with three OSS repos already showing the pattern.",
    oneLiner:
      "Every engineering team overspends on cloud by 30%+. The agent that reads the bill, identifies the waste, and ships a PR to fix it wins the FinOps long tail.",
    whyNow:
      "Cloud bills are public-facing structured data. FinOps tools (Vantage, CloudHealth) sell to enterprise. The mid-market, series-B and below, gets nothing actionable. That's the wedge.",
    buildToday:
      "Connect to AWS / GCP / Azure cost explorer APIs. Identify the top 5 waste vectors (idle instances, oversized RDS, unattached EBS, unused EIPs). Generate a fix PR (Terraform or Pulumi). Bill 10% of savings, first year.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "enterprise-saas"],
      keywords: ["cost", "finops", "aws", "cloud", "infrastructure", "terraform"],
      minCommits14d: 5,
    },
    seedPattern:
      "FinOps OSS repos with sudden velocity around the \"savings recommendations\" module are the seed-stage tells.",
    buildStack: [
      "AWS / GCP / Azure billing APIs",
      "Anthropic Claude for the recommendation reasoning",
      "Terraform / Pulumi for the PR generation",
      "GitHub App for the PR open",
    ],
    faqs: [
      {
        q: "What about Vantage / CloudHealth?",
        a: "Dashboard tools. The agent here writes the PR, it's a different surface and a different buyer.",
      },
    ],
    related: ["open-source-observability", "database-modernization-tools", "ai-code-review"],
    keywords: ["finops ai", "ai cost optimization", "aws cost", "vantage alternative", "cloud cost optimizer"],
  },
  {
    slug: "database-modernization-tools",
    category: "Dev Tools",
    title: "Database modernization tools: the agent that ports your schema",
    metaDescription:
      "Database modernization is buildable, three repos showing the velocity pattern.",
    oneLiner:
      "Migrating from MySQL to Postgres, or any legacy DB to a modern one, is a quarter of work for a senior. The agent that ships the migration PR with passing tests does it in a day.",
    whyNow:
      "Every team that picked MySQL in 2015 wants Postgres in 2026. Schema-translation tools exist; nobody made them agent-first.",
    buildToday:
      "Read the source DB schema + sample data. Generate the target schema. Generate the data migration script. Generate the application-code diff for the new driver. Ship as a single PR with a test suite that validates the round-trip.",
    matchSignal: {
      sectorSlugs: ["data-infrastructure", "developer-tools"],
      keywords: ["migration", "schema", "database", "postgres", "mysql"],
      minCommits14d: 10,
    },
    seedPattern:
      "DB-migration OSS repos with sudden velocity around the \"sample-data validation\" module are the seed-round tells.",
    buildStack: [
      "Schema introspection libraries per source DB",
      "Anthropic Claude for the migration script gen",
      "GitHub App for the PR open",
      "Postgres for the migration registry",
    ],
    faqs: [
      {
        q: "What about AWS DMS / Striim?",
        a: "Enterprise tools. The agent here ships the application-code change too, it's a different surface.",
      },
    ],
    related: ["ai-code-review", "data-quality-monitors", "real-time-etl"],
    keywords: ["database migration", "schema migration", "mysql to postgres", "ai database migration", "aws dms alternative"],
  },

  // ----------------------------------------------------------------------
  // Data Infrastructure, the picks-and-shovels for the data stack.
  // ----------------------------------------------------------------------
  {
    slug: "vector-databases",
    category: "Data Infrastructure",
    title: "Vector databases: the crowded market with one remaining seat",
    metaDescription:
      "Vector databases, buildable in 2026 in the embedded / edge tier where the market is still open.",
    oneLiner:
      "Pinecone, Weaviate, Qdrant, Chroma, Turbopuffer, pgvector, the SaaS market is full. The remaining opportunity is the embedded / edge tier, a vector DB that runs inside the agent.",
    whyNow:
      "Agents are moving on-device. The standalone vector DB becomes a per-agent dependency. SQLite-class embedded vector stores (LanceDB, vectorlite) are the new opportunity.",
    buildToday:
      "An embedded vector store with a sub-100kb runtime. Optimize for read latency under 5ms on commodity hardware. Ship as a Rust crate + WASM bundle. OSS-first, hosted variant for the indexing pipeline.",
    matchSignal: {
      sectorSlugs: ["data-infrastructure", "ai-ml"],
      keywords: ["vector", "embedding", "pgvector", "weaviate", "qdrant", "chroma"],
      minCommits14d: 20,
    },
    seedPattern:
      "Vector-store OSS with sudden velocity around the \"embedded / WASM\" milestone are the seed-stage tells.",
    buildStack: [
      "Rust + WASM",
      "SIMD-accelerated cosine similarity",
      "Apache Arrow for the storage format",
      "Vercel for the docs site",
    ],
    faqs: [
      {
        q: "Isn't the market over?",
        a: "Cloud-hosted, yes. Embedded / edge, no. The next agent stack ships with a local vector DB the same way the web stack ships with SQLite.",
      },
    ],
    related: ["embedding-as-a-service", "agent-memory-stores", "rag-evaluation-tools"],
    keywords: ["vector database", "embedded vector db", "pgvector alternative", "lancedb", "edge vector db"],
  },
  {
    slug: "embedding-as-a-service",
    category: "Data Infrastructure",
    title: "Embedding as a service: the API every agent depends on",
    metaDescription:
      "Embedding as a service, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Every agent calls an embedding model. The product that delivers low-latency, cheap embeddings with multi-model fallback is the OpenAI-batch wedge.",
    whyNow:
      "Voyage AI, Cohere, OpenAI, and the open-source side (BGE, GTE, E5) all converged on quality. The buyer wants reliability and price, pick a winner, ship a router, charge per token.",
    buildToday:
      "OpenAI-compatible HTTP API. Route to the cheapest provider that meets the latency SLA. Cache embedded chunks. Bill per token, undercut OpenAI by 40%.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "data-infrastructure"],
      keywords: ["embedding", "vector", "openai", "voyage", "cohere", "bge"],
      minCommits14d: 10,
    },
    seedPattern:
      "Embedding-routing OSS repos with velocity in the \"latency-SLA fallback\" module are the seed-round tells.",
    buildStack: [
      "Provider routing (OpenAI, Voyage, Cohere, self-hosted)",
      "Redis for the embedding cache",
      "Vercel AI Gateway as a model-fallback layer",
      "Stripe per-token billing",
    ],
    faqs: [
      {
        q: "Is this just Vercel AI Gateway?",
        a: "AI Gateway is the right primitive. The product is the embedding-specific routing, different latency targets, different caching strategy, different pricing model.",
      },
    ],
    related: ["vector-databases", "rag-evaluation-tools", "agent-memory-stores"],
    keywords: ["embedding api", "openai embeddings alternative", "voyage embeddings", "embedding cache", "embedding router"],
  },
  {
    slug: "rag-evaluation-tools",
    category: "Data Infrastructure",
    title: "RAG evaluation tools: the missing test suite for retrieval",
    metaDescription:
      "RAG evaluation tools, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Every RAG stack ships without an eval suite. The product that makes RAG testable, retrieval precision, answer faithfulness, context relevance, wins the team that's already burning $5K/mo on the wrong embeddings.",
    whyNow:
      "Ragas, TruLens, and DeepEval exist but the DX is rough. The next generation makes eval a 5-minute setup, not a 5-day science project.",
    buildToday:
      "SDK in TypeScript + Python that wraps any RAG pipeline. Capture retrieved chunks + final answer. Score against an LLM-graded rubric (retrieval precision, faithfulness, context relevance). Show the drift dashboard.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "developer-tools"],
      keywords: ["rag", "retrieval", "eval", "ragas", "trulens"],
      minCommits14d: 10,
    },
    seedPattern:
      "RAG-eval OSS repos with velocity in the \"LLM-as-judge\" module + a TypeScript SDK in the same release are the seed-stage tells.",
    buildStack: [
      "TypeScript + Python SDKs",
      "Anthropic Claude / GPT-class for the judge",
      "Postgres for the trace + label store",
      "Grafana for the drift dashboard",
    ],
    faqs: [
      {
        q: "What about Ragas / TruLens / DeepEval?",
        a: "They're the leaders, all Python-only. The TypeScript-first wedge is open, most agent stacks are TS now.",
      },
    ],
    related: ["agent-eval-platforms", "agent-memory-stores", "vector-databases"],
    keywords: ["rag eval", "rag testing", "ragas alternative", "trulens alternative", "ai eval"],
  },
  {
    slug: "data-quality-monitors",
    category: "Data Infrastructure",
    title: "Data quality monitors: the dbt-test layer everyone needs and nobody bought",
    metaDescription:
      "Data quality monitors, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "dbt tests are reactive. The product that proactively monitors data freshness, schema drift, and row-count anomalies, without a giant SaaS bill, wins the dbt-on-Snowflake long tail.",
    whyNow:
      "Monte Carlo and Bigeye sell to enterprise. The mid-market, anyone running dbt on Snowflake or BigQuery for under $50K/yr, has no good tool. The OSS-first product wins by being self-hostable.",
    buildToday:
      "Connect to the warehouse. Sample tables on a schedule. Detect freshness lapses, schema changes, row-count anomalies, null spikes. Alert to Slack. Free OSS, hosted SaaS for the alert + history.",
    matchSignal: {
      sectorSlugs: ["data-infrastructure", "developer-tools"],
      keywords: ["data-quality", "dbt", "monitoring", "freshness", "snowflake"],
      minCommits14d: 10,
    },
    seedPattern:
      "Data-quality OSS repos with velocity in the \"anomaly-detection\" module + dbt integration are the seed-stage tells.",
    buildStack: [
      "Python core + TypeScript dashboard",
      "Connector library per warehouse",
      "Anthropic Claude for the anomaly classification",
      "Slack + email alerting",
    ],
    faqs: [
      {
        q: "What about Monte Carlo / Bigeye?",
        a: "Enterprise. The OSS-first, self-hostable, dbt-native version wins the long tail.",
      },
    ],
    related: ["open-source-observability", "database-modernization-tools", "real-time-etl"],
    keywords: ["data quality", "dbt monitoring", "monte carlo alternative", "data observability", "data freshness"],
  },
  {
    slug: "real-time-etl",
    category: "Data Infrastructure",
    title: "Real-time ETL: the streaming pipeline you don't hate to operate",
    metaDescription:
      "Real-time ETL, buildable in 2026 with three repos showing the pattern.",
    oneLiner:
      "Fivetran is for batch. The product that does streaming CDC from Postgres / MySQL to a warehouse with sub-minute latency, without a PhD to operate, wins the operational analytics market.",
    whyNow:
      "Debezium + Kafka is technically correct and operationally painful. ClickHouse + Materialize made streaming queryable. The remaining work is the operator-facing UI that turns the whole stack into a five-minute setup.",
    buildToday:
      "One-command install. Connect to source DB via CDC. Stream to ClickHouse / BigQuery / Snowflake. Transforms in SQL. UI that shows lag, throughput, and per-table state. Per-GB pricing under Fivetran.",
    matchSignal: {
      sectorSlugs: ["data-infrastructure", "developer-tools"],
      keywords: ["etl", "cdc", "streaming", "kafka", "debezium", "fivetran"],
      minCommits14d: 10,
    },
    seedPattern:
      "Streaming-ETL OSS repos with velocity in the \"single-binary\" or \"managed-control-plane\" milestones are the seed-stage tells.",
    buildStack: [
      "Debezium or homegrown CDC",
      "ClickHouse or Snowpipe for the sink",
      "Rust or Go for the streaming engine",
      "Next.js for the operator UI",
    ],
    faqs: [
      {
        q: "What about Fivetran / Airbyte?",
        a: "Batch-shaped, expensive. The CDC-streaming, ops-friendly version is the wedge.",
      },
    ],
    related: ["data-quality-monitors", "database-modernization-tools", "small-data-warehouses"],
    keywords: ["real-time etl", "streaming etl", "fivetran alternative", "airbyte alternative", "cdc pipeline"],
  },
  {
    slug: "small-data-warehouses",
    category: "Data Infrastructure",
    title: "Small data warehouses: DuckDB-class infrastructure for teams under 50",
    metaDescription:
      "Small data warehouses, buildable in 2026 with three repos showing the pattern.",
    oneLiner:
      "Snowflake and BigQuery overserved everyone under 100GB of data. The DuckDB-on-S3 stack is the right architecture; the product layer is what's missing.",
    whyNow:
      "MotherDuck, DuckLake, and the broader DuckDB ecosystem proved the architecture works. The next layer is the operator-friendly UI, query in a notebook, materialize to S3, no Snowflake bill.",
    buildToday:
      "Hosted DuckDB on top of S3 / R2. Notebook UI for ad-hoc queries. CDC ingest from Postgres / MySQL. Per-GB-stored pricing under $0.01.",
    matchSignal: {
      sectorSlugs: ["data-infrastructure", "developer-tools"],
      keywords: ["duckdb", "warehouse", "olap", "snowflake", "bigquery"],
      minCommits14d: 10,
    },
    seedPattern:
      "DuckDB-class repos with velocity in the \"hosted control plane\" or \"S3 sink\" modules are the seed-stage tells.",
    buildStack: [
      "DuckDB core",
      "S3 / R2 for the storage layer",
      "Apache Arrow + Parquet for the file format",
      "Next.js notebook UI",
    ],
    faqs: [
      {
        q: "MotherDuck already exists?",
        a: "Yes, and they're the leader. The opportunity is the OSS-first, self-hostable, MotherDuck alternative for the long tail.",
      },
    ],
    related: ["real-time-etl", "data-quality-monitors", "ai-native-bi"],
    keywords: ["duckdb", "small warehouse", "motherduck alternative", "snowflake alternative", "olap small"],
  },

  // ----------------------------------------------------------------------
  // Multimodal, voice, video, image.
  // ----------------------------------------------------------------------
  {
    slug: "voice-agents-for-sales",
    category: "Multimodal",
    title: "Voice agents for sales: the BDR that doesn't sleep",
    metaDescription:
      "Voice agents for sales, buildable in 2026 with three repos accelerating.",
    oneLiner:
      "Vapi, Retell, and Bland.ai built the voice infrastructure. The product layer, voice-first SDR for the long tail of small teams, is open.",
    whyNow:
      "Voice TTS / STT crossed the human-grade bar in 2025. The remaining work is the workflow: who to call, what to say, how to follow up. That's a CRM-shaped problem on top of a voice runtime.",
    buildToday:
      "Twilio number per rep. Pull leads from a CRM. Call list, talk script, escalation rules, follow-up cadence. Connect via Vapi / Cartesia for the voice itself. Per-conversation pricing.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "ai-ml"],
      keywords: ["voice", "agent", "sales", "vapi", "retell", "bland", "phone"],
      minCommits14d: 10,
    },
    seedPattern:
      "Voice-agent OSS with velocity in the \"workflow + voice\" combined module are the seed-stage tells.",
    buildStack: [
      "Vapi or Cartesia for the voice runtime",
      "Twilio for the phone rails",
      "Anthropic Claude or GPT-class for the script",
      "Postgres for the call ledger",
    ],
    faqs: [
      {
        q: "What about Vapi / Retell / Bland?",
        a: "They're the infrastructure layer. The product layer, the workflow that picks who to call and what to say, is where the next category leaders ship.",
      },
    ],
    related: ["voice-cloning-tools", "ai-native-crm", "ai-native-recruiting"],
    keywords: ["voice agent", "ai sdr", "vapi alternative", "retell alternative", "ai sales call"],
  },
  {
    slug: "voice-cloning-tools",
    category: "Multimodal",
    title: "Voice cloning tools: the buildable layer above ElevenLabs",
    metaDescription:
      "Voice cloning tools, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "ElevenLabs and Cartesia own the model layer. The product layer, voice IP management, multi-voice projects, brand-voice library, is open.",
    whyNow:
      "Voice IP is the new likeness IP. The product that manages who owns which voice, who can use it, and how it gets paid for is the rights-management layer the voice economy needs.",
    buildToday:
      "Library of voices the operator owns. Royalty tracking when an agent uses the voice. Approval workflows for new usages. Direct integration with ElevenLabs / Cartesia / OpenAI TTS.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "social-community"],
      keywords: ["voice", "cloning", "tts", "elevenlabs", "cartesia"],
      minCommits14d: 5,
    },
    seedPattern:
      "Voice OSS repos with velocity in the \"royalty / IP\" module are the seed-stage tells.",
    buildStack: [
      "ElevenLabs / Cartesia / OpenAI TTS APIs",
      "Postgres for the rights ledger",
      "Stripe Connect for royalty payouts",
      "Next.js for the management UI",
    ],
    faqs: [
      {
        q: "Is voice rights a real problem?",
        a: "Yes, and getting bigger. The first lawsuits already filed against unauthorized voice clones. The rights-management tool is closer to a category necessity than a category nice-to-have.",
      },
    ],
    related: ["voice-agents-for-sales", "ai-video-editing", "ai-image-batch-tools"],
    keywords: ["voice cloning", "elevenlabs alternative", "voice ip", "voice rights", "ai tts"],
  },
  {
    slug: "ai-video-editing",
    category: "Multimodal",
    title: "AI video editing: the agent that ships the cut",
    metaDescription:
      "AI video editing tools, buildable in 2026 with three repos accelerating.",
    oneLiner:
      "Descript and Opus Clip own the consumer wedge. The product layer above them, agent-driven editing for the operator who ships 4 videos a week, is open.",
    whyNow:
      "Whisper, Cartesia, Stable Video, Runway, and a dozen open-source models converged to make video editing programmable. The next-generation product is the chat surface where the operator says \"cut every silence over 0.4s, add b-roll at every claim, ship\" and gets a finished cut.",
    buildToday:
      "Upload raw footage. Agent transcribes, drafts the script edit, picks b-roll from a library, generates captions, exports the cut. Operator reviews and ships. Per-finished-video pricing.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "social-community"],
      keywords: ["video", "editing", "ffmpeg", "descript", "opus-clip"],
      minCommits14d: 10,
    },
    seedPattern:
      "Video-editing OSS with velocity in the \"script-edit\" or \"b-roll matcher\" modules are the seed-stage tells.",
    buildStack: [
      "FFmpeg + Remotion for the render",
      "Whisper for transcription",
      "Anthropic Claude for the script edit",
      "Stripe per-video billing",
    ],
    faqs: [
      {
        q: "What about Descript / Opus Clip?",
        a: "Consumer-shaped tools. The agent-first version sells to the operator who ships 4x weekly, the marketer, the agency, the content producer.",
      },
    ],
    related: ["voice-cloning-tools", "ai-image-batch-tools", "ai-native-cms"],
    keywords: ["ai video", "ai video editor", "descript alternative", "opus clip alternative", "ai video cut"],
  },
  {
    slug: "ai-image-batch-tools",
    category: "Multimodal",
    title: "AI image batch tools: the agent that generates 500 OG cards before lunch",
    metaDescription:
      "AI image batch tools, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Midjourney owns single-image creative. The product layer for batch image generation, OG cards, product photos, banner sets, A/B variants, is wide open.",
    whyNow:
      "Marketing, e-commerce, and agency operators need to ship 100s of images per project. Midjourney's UI fights you on volume. The batch-first product wins by being optimized for the operator who ships, not the artist who explores.",
    buildToday:
      "CSV in, image folder out. Operator drops a template, a CSV of variables, an image style. Agent generates the full batch, named correctly, ready to drop into the CDN. Per-image pricing.",
    matchSignal: {
      sectorSlugs: ["ai-ml", "ecommerce-infrastructure"],
      keywords: ["image", "generation", "midjourney", "dalle", "stable-diffusion", "batch"],
      minCommits14d: 10,
    },
    seedPattern:
      "Image-batch OSS with velocity in the \"template engine\" or \"naming convention\" modules are the seed-stage tells.",
    buildStack: [
      "Replicate / Fal for the model serving",
      "Sharp or canvas for the post-processing",
      "S3 / R2 for the output storage",
      "Stripe per-image billing",
    ],
    faqs: [
      {
        q: "What about Midjourney's API?",
        a: "Single-image-shaped. The batch-first product is a different surface and a different buyer (marketers and e-commerce, not artists).",
      },
    ],
    related: ["ai-video-editing", "voice-cloning-tools", "ai-native-cms"],
    keywords: ["ai image batch", "ai og cards", "midjourney alternative", "ai marketing images", "batch image generation"],
  },

  // ----------------------------------------------------------------------
  // Vibe-Coding / Micro-SaaS, the one-person-unicorn cluster.
  // ----------------------------------------------------------------------
  {
    slug: "one-person-saas-stacks",
    category: "Vibe-Coding / Micro-SaaS",
    title: "One-person SaaS stacks: the buildable wedge for the solo operator",
    metaDescription:
      "One-person SaaS stacks, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "The solo founder runs auth + billing + email + analytics + DB. The product that ships all five in one $29/mo bundle is the indie-hacker wedge.",
    whyNow:
      "Levels.io, Tony Dinh, and the indie-hackers cohort proved the solo-founder market is real and growing. The tooling is fragmented, Clerk + Stripe + Resend + PostHog + Neon. The integrated stack is the next category.",
    buildToday:
      "Bundle Clerk-class auth + Stripe billing + Resend email + PostHog analytics + Neon DB into one provisioned bundle with one dashboard. Charge $29-49/mo for the whole thing. Ship a Next.js starter that wires it all up.",
    matchSignal: {
      sectorSlugs: ["enterprise-saas", "developer-tools"],
      keywords: ["saas", "starter", "boilerplate", "indie", "solo"],
      minCommits14d: 5,
    },
    seedPattern:
      "Starter / boilerplate OSS repos with sudden contributor surges around the \"integrated billing + auth\" combo are the seed-stage tells.",
    buildStack: [
      "Next.js + TypeScript",
      "Clerk-class auth provider",
      "Stripe + Stripe Connect for billing",
      "Neon Postgres + Resend + PostHog",
    ],
    faqs: [
      {
        q: "Isn't this just a starter?",
        a: "Starters fragment over time. The product is the provisioned bundle, one signup, one bill, one upgrade path. That's a category, not a template.",
      },
    ],
    related: ["ai-app-generators", "no-code-saas-templates", "solo-founder-finance-tools"],
    keywords: ["solo saas", "indie saas", "saas starter", "one person saas", "saas bundle"],
  },
  {
    slug: "ai-app-generators",
    category: "Vibe-Coding / Micro-SaaS",
    title: "AI app generators: the post-v0 opportunity",
    metaDescription:
      "AI app generators, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "v0, Bolt, Lovable, Replit Agent, the AI app generator market exploded in 2024-2025. The remaining wedge is the vertical / template-specific generator for a specific buyer.",
    whyNow:
      "Generic app generators reached a quality plateau. The next leaders specialize: AI dashboard generator for analysts, AI landing-page generator for marketers, AI internal-tool generator for ops. Vertical depth beats horizontal breadth.",
    buildToday:
      "Pick a vertical (e.g., \"internal tool for ops team\"). Build a template library, a chat surface, and a deploy target. Generate functional apps, not just code. Per-app or per-deploy pricing.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "ai-ml"],
      keywords: ["generator", "v0", "bolt", "lovable", "replit-agent"],
      minCommits14d: 15,
    },
    seedPattern:
      "App-gen OSS with velocity in the \"vertical templates\" or \"per-buyer specialization\" modules are the seed-stage tells.",
    buildStack: [
      "Anthropic Claude with tool calling",
      "Vercel for the deploy target",
      "Postgres for the template store",
      "Stripe per-deploy billing",
    ],
    faqs: [
      {
        q: "Why not just use v0?",
        a: "v0 is horizontal. The vertical app generator wins a specific buyer with deep template quality on a narrow use case.",
      },
    ],
    related: ["one-person-saas-stacks", "no-code-saas-templates", "vibe-coding-tools"],
    keywords: ["ai app generator", "v0 alternative", "bolt alternative", "lovable alternative", "ai code gen"],
  },
  {
    slug: "no-code-saas-templates",
    category: "Vibe-Coding / Micro-SaaS",
    title: "No-code SaaS templates: the marketplace the indie ops will pay for",
    metaDescription:
      "No-code SaaS templates, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Bubble and Webflow templates exist but the SaaS-specific tier is underbuilt. The marketplace where indie ops buys a $200 SaaS template and ships in a weekend is the wedge.",
    whyNow:
      "ThemeForest sold the WordPress economy. Webflow templates sold the marketing-site economy. The SaaS-template economy is still fragmented across Gumroad, indie shops, and direct sales.",
    buildToday:
      "A marketplace where SaaS templates (auth + billing + dashboard) are sold as buildable, deployable units. Take 20% of every sale. Curate quality, not breadth.",
    matchSignal: {
      sectorSlugs: ["ecommerce-infrastructure", "developer-tools"],
      keywords: ["template", "marketplace", "starter", "indie", "boilerplate"],
      minCommits14d: 5,
    },
    seedPattern:
      "OSS marketplaces with velocity in the \"template publish + sales\" combined module are the seed-stage tells.",
    buildStack: [
      "Next.js + Stripe Connect",
      "Postgres for the template + sales graph",
      "Vercel for the per-template preview deploys",
      "Resend for the seller / buyer comms",
    ],
    faqs: [
      {
        q: "ThemeForest exists?",
        a: "And it's stuck in 2014. The SaaS-specific, AI-era marketplace is the wedge.",
      },
    ],
    related: ["one-person-saas-stacks", "ai-app-generators", "open-source-funding-platforms"],
    keywords: ["saas template", "saas marketplace", "themeforest alternative", "indie hacker", "saas starter"],
  },
  {
    slug: "solo-founder-finance-tools",
    category: "Vibe-Coding / Micro-SaaS",
    title: "Solo-founder finance tools: the integrated CFO for the one-person company",
    metaDescription:
      "Solo-founder finance tools, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "The solo founder has a Stripe account, a business checking, a quarterly tax bill, and a panic attack at month-end. The integrated CFO-in-a-chat is the wedge.",
    whyNow:
      "The solo founder cohort doubled in 2024-2026 (per indie-hacker telemetry). The financial tooling is still fragmented, Mercury, Stripe, QuickBooks, calendar reminders for taxes. The integrated product wins by closing the loop.",
    buildToday:
      "Connect Stripe + a business bank (Plaid) + QuickBooks. Daily Slack-style digest: revenue, burn, runway, upcoming tax dates, next action. Chat surface for \"how am I doing this month\". Per-founder pricing.",
    matchSignal: {
      sectorSlugs: ["fintech", "enterprise-saas"],
      keywords: ["finance", "founder", "indie", "stripe", "mercury", "accounting"],
      minCommits14d: 5,
    },
    seedPattern:
      "Indie-finance OSS with velocity in the \"multi-account aggregation\" module are the seed-stage tells.",
    buildStack: [
      "Plaid for the bank feed",
      "Stripe API for the revenue feed",
      "Anthropic Claude for the digest",
      "Slack / email for the daily push",
    ],
    faqs: [
      {
        q: "What about Mercury?",
        a: "Mercury is a bank. The product here is the layer that aggregates Mercury + Stripe + QuickBooks into one Slack message, the operator dashboard, not the bank account.",
      },
    ],
    related: ["one-person-saas-stacks", "ai-native-accounting", "ai-native-billing"],
    keywords: ["solo founder finance", "indie cfo", "founder dashboard", "mercury alternative", "indie hacker finance"],
  },
  {
    slug: "micro-influencer-tools",
    category: "Vibe-Coding / Micro-SaaS",
    title: "Micro-influencer tools: the creator-economy long tail",
    metaDescription:
      "Micro-influencer tools, buildable in 2026 with three repos showing the pattern.",
    oneLiner:
      "Macro influencers have Beacons and Linktree. The 100M+ micro-influencers (1K-50K followers) get nothing useful. The tool that helps them book brand deals, track revenue, and ship content wins the long tail.",
    whyNow:
      "Creator-economy infra is mature on the top end and barren in the middle. The micro-influencer tier is too small for Beacons to care and too big to ignore. That's a market shape that wins on volume.",
    buildToday:
      "Link-in-bio + brand-deal marketplace + revenue tracker. Auto-pitch from a template when a brand reaches out. Track delivery, payment, and ROI per deal. Per-creator subscription at $9-19/mo.",
    matchSignal: {
      sectorSlugs: ["social-community", "ecommerce-infrastructure"],
      keywords: ["creator", "influencer", "social", "instagram", "tiktok", "linktree"],
      minCommits14d: 5,
    },
    seedPattern:
      "Creator-tool OSS with velocity in the \"brand-deal marketplace\" or \"revenue per deal\" modules are the seed-stage tells.",
    buildStack: [
      "Next.js link-in-bio",
      "Stripe Connect for brand payouts",
      "Postgres for the deal ledger",
      "Email + Resend for the auto-pitch",
    ],
    faqs: [
      {
        q: "What about Beacons / Linktree?",
        a: "Top-of-market. The micro-influencer tier needs both the link-in-bio AND the brand-deal workflow, and Beacons charges too much for the latter.",
      },
    ],
    related: ["voice-cloning-tools", "ai-video-editing", "ai-native-cms"],
    keywords: ["micro influencer", "creator economy", "linktree alternative", "beacons alternative", "creator tools"],
  },

  // ----------------------------------------------------------------------
  // Climate & Niche, the underserved verticals.
  // ----------------------------------------------------------------------
  {
    slug: "carbon-accounting-saas",
    category: "Climate & Niche",
    title: "Carbon accounting SaaS: the compliance-driven category",
    metaDescription:
      "Carbon accounting SaaS, buildable in 2026 as the SEC + CSRD compliance forces SMBs into the market.",
    oneLiner:
      "SEC Scope 1-2 disclosure and EU CSRD are now compliance triggers for the long-tail SMB market. The carbon-accounting tool priced for that buyer is the wedge.",
    whyNow:
      "The enterprise market (Persefoni, Watershed) is mature. The SMB market, companies under 500 employees who suddenly need a disclosure, has no good tool priced under $5K/yr.",
    buildToday:
      "Connect to QuickBooks / Xero for spend data. Apply emission factors (EPA, EEIO) to map spend → emissions. Generate the disclosure PDF in the required format (SEC, CSRD). Per-company-disclosure pricing.",
    matchSignal: {
      sectorSlugs: ["climate-tech", "fintech"],
      keywords: ["carbon", "emission", "esg", "climate", "scope"],
      minCommits14d: 5,
    },
    seedPattern:
      "Climate-tech OSS with velocity in the \"spend → emission\" classification module are the seed-stage tells.",
    buildStack: [
      "Plaid / Xero for the spend data",
      "EPA / EEIO emission-factor database",
      "Anthropic Claude for the disclosure narrative",
      "PDF generation for the disclosure output",
    ],
    faqs: [
      {
        q: "What about Watershed / Persefoni?",
        a: "Enterprise. The SMB-priced version is the wedge, same disclosure problem, different buyer.",
      },
    ],
    related: ["esg-data-platforms", "ai-native-accounting", "vertical-ai-construction"],
    keywords: ["carbon accounting", "esg software", "watershed alternative", "persefoni alternative", "scope 1 2 emissions"],
  },
  {
    slug: "esg-data-platforms",
    category: "Climate & Niche",
    title: "ESG data platforms: the underwriting layer for the climate transition",
    metaDescription:
      "ESG data platforms, buildable in 2026 as climate-risk underwriting becomes mainstream.",
    oneLiner:
      "Insurers, lenders, and asset managers need ESG data to underwrite. The platform that aggregates climate, social, and governance signals into a single API is the underwriting wedge.",
    whyNow:
      "Climate risk became a real underwriting variable in 2024-2026. Sustainalytics and MSCI ESG are expensive and slow. The API-first, real-time, lower-priced alternative is open.",
    buildToday:
      "Aggregate public data: SEC filings, EPA emissions, OSHA incidents, news mentions. Normalize into a single per-company score. Ship as an API. Per-query pricing.",
    matchSignal: {
      sectorSlugs: ["climate-tech", "fintech", "data-infrastructure"],
      keywords: ["esg", "climate", "underwriting", "risk", "compliance"],
      minCommits14d: 5,
    },
    seedPattern:
      "ESG OSS with velocity in the \"source aggregation\" or \"per-company score\" modules are the seed-stage tells.",
    buildStack: [
      "Public-source ingestion (SEC EDGAR, EPA, OSHA)",
      "Postgres + Elasticsearch for the search graph",
      "Anthropic Claude for the entity resolution",
      "REST API for the per-company queries",
    ],
    faqs: [
      {
        q: "What about Sustainalytics / MSCI?",
        a: "Both are enterprise SaaS with multi-week onboarding. The API-first, per-query version wins the long tail.",
      },
    ],
    related: ["carbon-accounting-saas", "ai-native-bi", "data-quality-monitors"],
    keywords: ["esg data", "esg api", "sustainalytics alternative", "msci alternative", "climate risk"],
  },

  // ----------------------------------------------------------------------
  // Open Source / Community, the distribution-led plays.
  // ----------------------------------------------------------------------
  {
    slug: "open-source-funding-platforms",
    category: "Open Source / Community",
    title: "Open-source funding platforms: B2B OSS wedge",
    metaDescription:
      "Open-source funding platforms turn 'we use this library' into a one-click B2B subscription with invoice and impact reporting, a buildable 2026 wedge with three OSS repos already showing the velocity pattern.",
    oneLiner:
      "GitHub Sponsors solved the consumer wedge. The B2B wedge, companies paying for the OSS they depend on, with attribution and impact reporting, is open.",
    whyNow:
      "Companies want to fund OSS. The accounting and procurement workflow makes it hard. The platform that turns \"we use this library\" into a one-click subscription with invoice + impact report wins.",
    buildToday:
      "Detect which OSS a company depends on (parse package.json / requirements.txt / Gemfile). Recommend top-3 to fund. Aggregate funding into a single monthly invoice. Distribute via Stripe Connect. Per-funded-project margin.",
    matchSignal: {
      sectorSlugs: ["developer-tools", "fintech"],
      keywords: ["funding", "open-source", "sponsor", "license", "donation"],
      minCommits14d: 5,
    },
    seedPattern:
      "OSS-funding-platform repos with velocity in the \"dependency parsing\" or \"impact reporting\" modules are the seed-stage tells.",
    buildStack: [
      "Dependency-graph parsers per language",
      "Stripe Connect for the funding distribution",
      "GitHub API for the maintainer mapping",
      "Postgres for the funding ledger",
    ],
    faqs: [
      {
        q: "What about GitHub Sponsors / Open Collective?",
        a: "Both work, both are individual-buyer-shaped. The B2B-procurement-friendly version is the wedge.",
      },
    ],
    related: ["dev-community-platforms", "open-source-observability", "no-code-saas-templates"],
    keywords: ["open source funding", "github sponsors alternative", "open collective alternative", "oss funding", "b2b oss"],
  },
  {
    slug: "dev-community-platforms",
    category: "Open Source / Community",
    title: "Dev community platforms: the Discord+forum+wiki bundle",
    metaDescription:
      "Dev community platforms, buildable in 2026 with three repos showing the velocity pattern.",
    oneLiner:
      "Dev communities live on Discord, Slack, GitHub Discussions, and Discourse, usually all four. The integrated platform that ships chat + forum + wiki + onboarding in one bundle is the wedge.",
    whyNow:
      "Community-led growth is the dominant GTM for dev tools. Discord is mature; the community-management layer on top is fragmented. The integrated platform priced under $99/mo wins the indie + early-stage tier.",
    buildToday:
      "Bundle Discord-style chat + Discourse-style threads + wiki + onboarding flow. Add agent-assisted answers from the wiki when a user posts a question. Per-community subscription.",
    matchSignal: {
      sectorSlugs: ["social-community", "developer-tools"],
      keywords: ["community", "forum", "discord", "discourse", "chat"],
      minCommits14d: 10,
    },
    seedPattern:
      "Community-platform OSS with velocity in the \"integrated chat + forum\" combo module are the seed-stage tells.",
    buildStack: [
      "Next.js + Postgres",
      "WebSockets for real-time chat",
      "Anthropic Claude for the agent answers",
      "Stripe for per-community billing",
    ],
    faqs: [
      {
        q: "What about Circle / Discord / Discourse?",
        a: "Each solves one piece. The integrated, dev-shaped version is the wedge for the OSS / SaaS community use case.",
      },
    ],
    related: ["open-source-funding-platforms", "ai-native-support", "micro-influencer-tools"],
    keywords: ["dev community", "discord alternative", "discourse alternative", "circle alternative", "developer community"],
  },
];

// ---------------------------------------------------------------------------
// Lookup helpers
// ---------------------------------------------------------------------------

export function getStartupIdeaBySlug(slug: string): StartupIdea | undefined {
  return startupIdeas.find((i) => i.slug === slug);
}

export function getAllStartupIdeaSlugs(): string[] {
  return startupIdeas.map((i) => i.slug);
}

export function getStartupIdeasByCategory(): Record<string, StartupIdea[]> {
  const out: Record<string, StartupIdea[]> = {};
  for (const idea of startupIdeas) {
    if (!out[idea.category]) out[idea.category] = [];
    out[idea.category].push(idea);
  }
  return out;
}

export function getRelatedStartupIdeas(slug: string, limit = 4): StartupIdea[] {
  const idea = getStartupIdeaBySlug(slug);
  if (!idea) return [];
  return idea.related
    .map((relSlug) => getStartupIdeaBySlug(relSlug))
    .filter((x): x is StartupIdea => Boolean(x))
    .slice(0, limit);
}
