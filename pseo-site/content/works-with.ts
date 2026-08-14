/**
 * /works-with/[slug] entity pages, CRM and workflow tool integration pages.
 *
 * Each entry is a CRM, automation, or workflow tool that the Marcus 100
 * audience (Corp Dev, PE Operating Partners, non-engineer tech VPs)
 * already uses daily. The page describes how VC Deal Flow Signal
 * data flows into that tool, current paths (CSV import, API,
 * webhooks, MCP, Zapier) plus aspirational native integrations.
 *
 * Disambiguation: distinct from /integrations/[slug] (the existing
 * route for AI-tool integrations: Cursor, ChatGPT, Mistral, Replit,
 * etc.). /works-with/[slug] covers CRM and workflow tools where
 * Marcus already lives. Different audience, different URL.
 *
 * Honesty principle: the page makes clear what's already shipped
 * (CSV export, public API, MCP, RSS, Zapier) versus what would
 * require a custom integration. We capture demand via demo-request
 * CTA rather than promising features that don't exist.
 */

export interface WorksWithFAQ {
  question: string;
  answer: string;
}

export type IntegrationPath =
  | "csv-import"
  | "api-rest"
  | "mcp-server"
  | "zapier"
  | "webhook"
  | "rss"
  | "custom";

export type ToolCategory =
  | "vc-crm"
  | "general-crm"
  | "knowledge"
  | "automation"
  | "spreadsheet"
  | "messaging"
  | "project-management";

export interface WorksWithTool {
  slug: string;
  name: string;
  homepageUrl: string;
  category: ToolCategory;
  // SEO surfaces
  title: string;
  metaDescription: string;
  h1: string;
  tagline: string;
  intro: string;
  /** Available integration paths today (no aspirational promises here). */
  availablePaths: IntegrationPath[];
  /** Concrete workflows the Marcus 100 audience uses with this tool. */
  workflows: { name: string; description: string }[];
  /** How the data actually flows into the tool. */
  howItWorks: string;
  /** Honest caveat about what's NOT available. */
  whatsMissing: string;
  faqs: WorksWithFAQ[];
}

const PATH_LABELS: Record<IntegrationPath, string> = {
  "csv-import": "CSV import",
  "api-rest": "Public REST API",
  "mcp-server": "MCP server (Claude, ChatGPT, Cursor)",
  zapier: "Zapier",
  webhook: "Webhook (Resend)",
  rss: "RSS / Atom feed",
  custom: "Custom integration (demo request)",
};

export function pathLabel(path: IntegrationPath): string {
  return PATH_LABELS[path];
}

const CATEGORY_LABELS: Record<ToolCategory, string> = {
  "vc-crm": "VC-focused CRM",
  "general-crm": "General-purpose CRM",
  knowledge: "Knowledge base / docs",
  automation: "Automation platform",
  spreadsheet: "Spreadsheet",
  messaging: "Team messaging",
  "project-management": "Project management",
};

export function categoryLabel(c: ToolCategory): string {
  return CATEGORY_LABELS[c];
}

function build(t: {
  slug: string;
  name: string;
  homepage: string;
  category: ToolCategory;
  short: string;
  howWorks: string;
  missing: string;
  paths: IntegrationPath[];
  workflows: { name: string; description: string }[];
}): WorksWithTool {
  return {
    slug: t.slug,
    name: t.name,
    homepageUrl: t.homepage,
    category: t.category,
    title: `${t.name} + VC Deal Flow Signal, Integration & Workflows (2026)`,
    metaDescription: `How VC Deal Flow Signal engineering-acceleration signals flow into ${t.name}. ${t.paths.length} integration paths available today, ${t.paths.map(pathLabel).join(", ")}.`,
    h1: `VC Deal Flow Signal + ${t.name}`,
    tagline: `${t.short} ${t.paths.length} integration paths available today.`,
    intro: `${t.name} is one of the tools Corp Dev, PE Operating Partners, and emerging-manager funds rely on for deal flow management. This page describes how VC Deal Flow Signal engineering-acceleration data flows into ${t.name}, the integration paths we already ship plus the custom paths available on request.`,
    availablePaths: t.paths,
    workflows: t.workflows,
    howItWorks: t.howWorks,
    whatsMissing: t.missing,
    faqs: [
      {
        question: `What integration paths are available for ${t.name}?`,
        answer: `${t.paths.length} paths today: ${t.paths.map(pathLabel).join(", ")}. The most common workflow for ${t.name} users is ${pathLabel(t.paths[0])}, see the workflows section above for concrete examples.`,
      },
      {
        question: `Is there a native ${t.name} integration?`,
        answer: t.missing,
      },
      {
        question: `How does the data flow into ${t.name}?`,
        answer: t.howWorks,
      },
      {
        question: `Can you build a custom ${t.name} integration?`,
        answer: `Yes. For paid plans, custom integrations into ${t.name} are scoped during onboarding. Submit a demo request via /firstlook with your ${t.name} workflow needs and we will design the integration path together. Most custom paths take 2-4 weeks from scoping to production.`,
      },
      {
        question: `What's the cost?`,
        answer: `Standard integration paths (CSV, API, MCP, Zapier, RSS, webhook) are included in every paid plan, see /pricing. Custom ${t.name}-native integrations are scoped per engagement and quoted separately.`,
      },
    ],
  };
}

export const WORKS_WITH: WorksWithTool[] = [
  build({
    slug: "affinity",
    name: "Affinity",
    homepage: "https://www.affinity.co",
    category: "vc-crm",
    short:
      "Affinity is the dominant VC-focused CRM for relationship intelligence and deal-flow management.",
    paths: ["csv-import", "api-rest", "zapier", "webhook", "custom"],
    workflows: [
      {
        name: "Weekly engineering-acceleration push",
        description:
          "Every Monday, top-N momentum signals push into a saved Affinity list via Zapier. The list becomes the partner-meeting agenda.",
      },
      {
        name: "Pipeline auto-enrichment",
        description:
          "When an Affinity company record is created, a webhook triggers a /api/v1 lookup and writes the engineering signal score back as a custom field.",
      },
      {
        name: "Sourcing-batch CSV",
        description:
          "Monthly CSV export of sector-filtered acceleration leaders, imported into Affinity as a new entity batch for the partner-team to triage.",
      },
    ],
    howWorks: `Affinity exposes a REST API and supports both inbound webhook events and Zapier triggers. We do not yet ship a one-click Affinity Marketplace app, the typical setup is Zapier-mediated (signal acceleration → Affinity custom field write) which most VC ops teams already have configured for other data sources. For higher-volume teams, direct API integration scoped during onboarding gives sub-minute signal latency into Affinity entity records.`,
    missing:
      "Not yet, there is no first-party Affinity Marketplace app today. The Zapier and direct-API paths cover most VC ops workflows; a native Marketplace listing is on the roadmap once we hit a customer threshold that justifies the listing process.",
  }),
  build({
    slug: "hubspot",
    name: "HubSpot",
    homepage: "https://www.hubspot.com",
    category: "general-crm",
    short:
      "HubSpot is the dominant CRM for B2B SaaS and emerging-manager funds running their pipeline like a sales funnel.",
    paths: ["csv-import", "api-rest", "zapier", "webhook", "custom"],
    workflows: [
      {
        name: "Lead enrichment",
        description:
          "When a HubSpot contact's company shows up in the GitDealFlow signal panel, a workflow auto-tags the contact with the current engineering momentum tier (accelerating / steady / decelerating).",
      },
      {
        name: "Deal-stage progression triggers",
        description:
          "A HubSpot workflow watches for engineering acceleration breaks on companies in active deals, when a portfolio company crosses the +50% commit-velocity threshold, the deal stage advances automatically.",
      },
      {
        name: "Sequence personalization",
        description:
          "HubSpot Sequences pull in the latest signal snippet for each prospect ('your engineering org shipped 87 commits this week, up 41% from prior month') as a personalization token.",
      },
    ],
    howWorks: `HubSpot exposes a comprehensive REST API plus a robust webhook system. We support both direct API integration and Zapier-mediated flows. The most common deployment: a Zapier watch on /api/v1 signal updates writes engineering-momentum custom properties to HubSpot company records, which feed standard HubSpot workflows. For Pro+ accounts, direct webhook integration removes the Zapier middleman.`,
    missing:
      "There is no first-party HubSpot Marketplace app yet. The Zapier path covers most B2B SaaS use cases; the App Marketplace listing is roadmapped once we accumulate enough HubSpot-paying customers to justify the certification effort.",
  }),
  build({
    slug: "salesforce",
    name: "Salesforce",
    homepage: "https://www.salesforce.com",
    category: "general-crm",
    short:
      "Salesforce is the dominant enterprise CRM and the standard at most Fortune 500 Corp Dev teams.",
    paths: ["csv-import", "api-rest", "zapier", "webhook", "custom"],
    workflows: [
      {
        name: "Account-tier engineering signals",
        description:
          "Enterprise accounts in Salesforce automatically get an engineering-momentum custom field populated nightly via a Salesforce REST API push, visible alongside ACV and renewal-date.",
      },
      {
        name: "Opportunity-stage signal anchoring",
        description:
          "Salesforce Opportunities can be filtered by 'engineering acceleration in trailing 90 days', useful for Corp Dev teams running quarterly acquisition shortlists.",
      },
      {
        name: "Apex-based custom integration",
        description:
          "For full-Salesforce shops, an Apex class pulls /api/v1 signal data on a daily schedule and updates Account records via standard Salesforce DML.",
      },
    ],
    howWorks: `Salesforce supports REST, SOAP, and Bulk APIs plus Apex code execution. The most common deployment is a scheduled Apex class hitting our /api/v1 endpoints and updating Account custom fields. For lighter-touch deployments, Zapier or Workato can mediate the integration without code. Direct Salesforce AppExchange listing is roadmapped but not shipped, custom integration is the path today.`,
    missing:
      "No first-party AppExchange listing yet. AppExchange certification is a significant lift (security review, scalability tests, customer adoption thresholds), we are pre-AppExchange-stage and ship custom integrations on demand for paying Salesforce customers.",
  }),
  build({
    slug: "notion",
    name: "Notion",
    homepage: "https://www.notion.so",
    category: "knowledge",
    short:
      "Notion is the default knowledge base for modern teams, including VC firms running their pipeline as a Notion database.",
    paths: ["csv-import", "api-rest", "zapier", "custom"],
    workflows: [
      {
        name: "Notion database sync",
        description:
          "GitDealFlow signal snapshots write directly into a Notion database via the official Notion API, each company becomes a database row with current engineering momentum, last signal timestamp, and a link to the per-company /signal page.",
      },
      {
        name: "Weekly digest in a Notion doc",
        description:
          "A Zapier flow grabs the Sunday digest and appends it to a shared Notion doc the partner-team reads on Monday morning.",
      },
      {
        name: "Notion AI grounding",
        description:
          "Once the signal data lives in a Notion database, Notion AI Q&A can answer 'which portfolio companies showed acceleration last week' directly inside the workspace.",
      },
    ],
    howWorks: `Notion exposes a clean REST API with database read/write support. The typical integration is a scheduled Zapier flow or a custom script that pushes /api/v1 signal data into a Notion database every 6-24 hours. Notion's database-as-CRM pattern is increasingly popular for emerging-manager funds; signal data fits naturally as additional database columns.`,
    missing:
      "There is no first-party Notion Connector yet. The Notion connector ecosystem is in early flux (the Notion App Marketplace launched 2024), once the marketplace economics stabilize, a first-party connector is on the roadmap.",
  }),
  build({
    slug: "airtable",
    name: "Airtable",
    homepage: "https://www.airtable.com",
    category: "spreadsheet",
    short:
      "Airtable sits between spreadsheet and database, popular with emerging-manager funds running structured deal-flow tracking without a full CRM.",
    paths: ["csv-import", "api-rest", "zapier", "webhook"],
    workflows: [
      {
        name: "Airtable Base sync",
        description:
          "GitDealFlow signal data writes into an Airtable Base via the REST API. Each tracked company becomes a row; signal updates rewrite the engineering-momentum field nightly.",
      },
      {
        name: "Automation triggers",
        description:
          "Airtable Automations watch for engineering-acceleration field changes and trigger downstream actions: Slack notifications, email digests to partners, or follow-up tasks in Asana.",
      },
      {
        name: "Bulk import + sort",
        description:
          "Monthly bulk CSV import of sector-filtered momentum leaders into a fresh Airtable Base, then sorted and grouped by sector for the partner-team review.",
      },
    ],
    howWorks: `Airtable has a mature REST API with field-level read/write and a Webhook-as-a-Trigger system in Automations. We push signal data via the REST API on a configurable cadence (typically hourly or daily). Airtable Automations then handle downstream routing to Slack, email, or other Airtable Bases.`,
    missing:
      "Airtable does not currently expose a Marketplace for first-party app installs, so the integration is configured per-account by the user (one-time API key + base ID setup). Most Airtable users find this acceptable.",
  }),
  build({
    slug: "slack",
    name: "Slack",
    homepage: "https://slack.com",
    category: "messaging",
    short:
      "Slack is the dominant team messaging platform, where partner teams discuss deal flow in real time.",
    paths: ["zapier", "webhook", "custom"],
    workflows: [
      {
        name: "Weekly digest channel",
        description:
          "Every Monday, the GitDealFlow Sunday digest posts into a #deal-flow Slack channel with formatted message blocks for each accelerating company.",
      },
      {
        name: "Threshold-alert notifications",
        description:
          "When a tracked company crosses the +50% commit-velocity threshold, an Incoming Webhook fires into a dedicated #signals channel with the company name and a link to the /signal page.",
      },
      {
        name: "Slash command lookups",
        description:
          "A custom Slack bot exposes /gitdealflow {company} that returns the current engineering signal snapshot inline, useful for ad-hoc lookups during partner conversations.",
      },
    ],
    howWorks: `Slack Incoming Webhooks are the standard path, paying customers configure a webhook URL during onboarding and we push formatted message blocks on the relevant cadence (weekly digest, threshold alerts, or both). For higher-touch deployments, a custom Slack bot with slash-command support is scoped during onboarding.`,
    missing:
      "There is no first-party Slack App Directory listing yet. Slack's App Directory submission requires OAuth flow, security review, and proven customer adoption, we are pre-listing-stage. Webhook-based integration covers ~95% of use cases.",
  }),
  build({
    slug: "linear",
    name: "Linear",
    homepage: "https://linear.app",
    category: "project-management",
    short:
      "Linear is the default project tool for modern engineering teams and a growing portfolio-tracking tool for VC firms with engineering-led ops.",
    paths: ["api-rest", "zapier", "webhook"],
    workflows: [
      {
        name: "Issue auto-creation on signal alerts",
        description:
          "When a portfolio company crosses the engineering-acceleration threshold, a Linear issue is auto-created in the partner team's project with the company name, sector, and signal context.",
      },
      {
        name: "Weekly digest as Linear comments",
        description:
          "The Sunday digest writes one Linear comment per accelerating company onto a recurring 'Deal Flow Review' issue, ready for Monday partner-meeting prep.",
      },
      {
        name: "Triage workflow integration",
        description:
          "Linear's triage queue can receive incoming signal alerts as new issues, with sector and stage as labels, partners review the triage queue weekly.",
      },
    ],
    howWorks: `Linear exposes a clean GraphQL API and a webhook system. We push signal events as issues or comments via the API on the configured cadence. Most Linear-using VC firms also use Slack, the combination (Linear for tracking + Slack for discussion) is the typical setup.`,
    missing:
      "Linear's App Marketplace is in early stages (launched 2024). A first-party Linear App listing is roadmapped once the marketplace economics support the certification effort.",
  }),
  build({
    slug: "attio",
    name: "Attio",
    homepage: "https://attio.com",
    category: "general-crm",
    short:
      "Attio is a modern, developer-friendly CRM gaining adoption with technically-focused emerging-manager funds.",
    paths: ["api-rest", "zapier", "webhook"],
    workflows: [
      {
        name: "Company record enrichment",
        description:
          "Attio's flexible schema lets us push GitDealFlow signal data as native company attributes, commit velocity, contributor count, momentum tier, visible on every company page.",
      },
      {
        name: "List automation",
        description:
          "Attio Lists can be auto-populated based on signal criteria via the REST API: 'companies with >50% acceleration in trailing 30 days' becomes a live, self-updating list.",
      },
      {
        name: "Real-time webhook updates",
        description:
          "Attio's webhook system lets us push signal updates as soon as they fire (rather than nightly batch), giving sub-minute latency from signal break to CRM visibility.",
      },
    ],
    howWorks: `Attio has one of the most developer-friendly REST APIs in the CRM space, comprehensive object/attribute model, robust webhooks, no schema-rigidity issues. The typical integration is direct API push from /api/v1 signal updates into Attio company records, with no Zapier middleman needed.`,
    missing:
      "Attio's developer ecosystem is young (CRM launched publicly in 2023), no Attio Marketplace yet exists for first-party listings. Direct API integration is the standard for all Attio integrations today.",
  }),
  build({
    slug: "pipedrive",
    name: "Pipedrive",
    homepage: "https://www.pipedrive.com",
    category: "general-crm",
    short:
      "Pipedrive is the pipeline-focused CRM used by smaller B2B SaaS sales teams and some emerging-manager funds.",
    paths: ["csv-import", "api-rest", "zapier", "webhook"],
    workflows: [
      {
        name: "Deal pipeline auto-progression",
        description:
          "A Zapier flow watches for engineering-acceleration signals on companies in active Pipedrive deals, when the signal fires, the deal advances to the next pipeline stage automatically.",
      },
      {
        name: "Custom field enrichment",
        description:
          "GitDealFlow signal data writes to Pipedrive custom fields (engineering momentum, last signal date, sector) via the REST API on a daily schedule.",
      },
    ],
    howWorks: `Pipedrive has a comprehensive REST API and a mature Marketplace, plus broad Zapier coverage. Most integrations are Zapier-mediated today; direct API integration is available for higher-volume teams during onboarding.`,
    missing:
      "There is no first-party Pipedrive Marketplace app yet. Zapier coverage handles the most common workflows.",
  }),
  build({
    slug: "copper",
    name: "Copper",
    homepage: "https://www.copper.com",
    category: "general-crm",
    short:
      "Copper is the Google Workspace-native CRM, popular with Google-anchored teams running deal flow inside Gmail.",
    paths: ["csv-import", "api-rest", "zapier"],
    workflows: [
      {
        name: "Gmail-native signal lookups",
        description:
          "When opening an email from a tracked company in Gmail, the Copper sidebar shows the current GitDealFlow engineering signal alongside the standard Copper company context.",
      },
      {
        name: "Workspace-scoped pipeline",
        description:
          "Copper's Google Workspace integration means signal data lives next to Drive docs and Calendar events, useful for funds running their entire workflow inside Google.",
      },
    ],
    howWorks: `Copper has a REST API plus deep Google Workspace integration. We push signal data via the REST API; Copper's Gmail sidebar surfaces it inline. Most Copper users are Google-anchored teams who value the Workspace integration over Marketplace listing volume.`,
    missing:
      "No first-party Copper Marketplace listing yet. The Zapier and direct API paths cover most workflows.",
  }),
  build({
    slug: "microsoft-dynamics",
    name: "Microsoft Dynamics",
    homepage: "https://dynamics.microsoft.com",
    category: "general-crm",
    short:
      "Microsoft Dynamics is the dominant enterprise CRM at Microsoft-anchored Fortune 500 teams and major Corp Dev shops.",
    paths: ["api-rest", "custom"],
    workflows: [
      {
        name: "Dataverse table sync",
        description:
          "GitDealFlow signal data writes to a Dataverse custom table via the Web API, joined to standard Account records for visibility across Dynamics, Power BI, and Power Automate.",
      },
      {
        name: "Power Automate flows",
        description:
          "Power Automate flows pull signal updates and trigger downstream Dynamics workflows, useful for Microsoft-stack Corp Dev teams orchestrating M&A pipelines.",
      },
    ],
    howWorks: `Microsoft Dynamics integrates via the Dataverse Web API and Power Automate. Typical deployment is a Power Automate flow scheduled hourly or daily, pulling /api/v1 data and writing to a Dataverse custom table joined to Accounts. For full enterprise deployments, a Dynamics 365 custom plugin scoped during onboarding gives sub-minute latency.`,
    missing:
      "No first-party Dynamics AppSource listing yet. AppSource certification is a multi-quarter lift; we ship custom Dynamics integrations on demand for paying enterprise customers.",
  }),
  build({
    slug: "zapier",
    name: "Zapier",
    homepage: "https://zapier.com",
    category: "automation",
    short:
      "Zapier is the no-code automation platform that bridges thousands of tools, the easiest path to integrate GitDealFlow with any niche CRM or workflow.",
    paths: ["zapier"],
    workflows: [
      {
        name: "Multi-step automation",
        description:
          "Zapier triggers on new GitDealFlow signals and routes them through transformation, filtering, and delivery steps, to Slack, email, Notion, Airtable, or any of Zapier's 7,000+ supported apps.",
      },
      {
        name: "Filter by sector or stage",
        description:
          "A Zapier filter step lets users subscribe to acceleration alerts only for specific sectors (e.g., 'ai-infra at series-a stage'), routed to the CRM or messaging tool of their choice.",
      },
      {
        name: "Backfill historical signals",
        description:
          "Zapier's batch import mode pulls historical signal data into the destination tool, useful for new customers wanting context before subscribing to live alerts.",
      },
    ],
    howWorks: `Zapier is the universal middleman, our /api/v1 endpoints work with any Zapier custom integration, and we are exploring a published Zapier App for direct one-click integration. For now, paying customers can configure Zaps using HTTP triggers pointed at /api/v1 endpoints with our authentication scheme.`,
    missing:
      "A published Zapier App with first-party triggers and actions is roadmapped. Today, integration uses Zapier's generic HTTP/Webhook steps which require slightly more setup than a published app but offer full flexibility.",
  }),
  build({
    slug: "make",
    name: "Make.com",
    homepage: "https://www.make.com",
    category: "automation",
    short:
      "Make.com (formerly Integromat) is the visual-flow automation platform popular with technically-adept ops teams.",
    paths: ["webhook", "api-rest"],
    workflows: [
      {
        name: "Visual integration flows",
        description:
          "Make.com's visual builder lets users construct multi-branch flows pulling GitDealFlow signal data and routing to CRMs, Slack, email, or any of Make's connected apps.",
      },
      {
        name: "Conditional logic & filtering",
        description:
          "Make's branching logic handles complex filtering (e.g., 'accelerating + sector=fintech + stage=series-a → route to Pipeline A, else discard') better than most automation platforms.",
      },
    ],
    howWorks: `Make.com supports our /api/v1 endpoints through its HTTP module. The typical deployment uses scheduled HTTP requests pulling signal data, then visual-flow logic to route to destinations. No first-party Make App yet, direct HTTP integration covers all workflows.`,
    missing:
      "No first-party Make.com App listing yet. The HTTP module + visual-flow integration is the standard path.",
  }),
  build({
    slug: "google-sheets",
    name: "Google Sheets",
    homepage: "https://sheets.google.com",
    category: "spreadsheet",
    short:
      "Google Sheets remains the lowest-friction analytics surface for small VC firms and emerging-manager funds.",
    paths: ["csv-import", "api-rest", "zapier"],
    workflows: [
      {
        name: "Live data pull via Apps Script",
        description:
          "A Google Apps Script triggers daily, pulls /api/v1 signal data, and writes it to a designated sheet, auto-refreshed without manual import.",
      },
      {
        name: "IMPORTDATA from CSV endpoint",
        description:
          "Our /dataset.json and /dataset.csv endpoints work with Google Sheets' IMPORTDATA function, a one-cell formula pulls live data into any sheet without scripting.",
      },
      {
        name: "Zapier-mediated batch updates",
        description:
          "Zapier writes new signal events to a Google Sheets row, building an append-only log of acceleration events for downstream analysis or charting.",
      },
    ],
    howWorks: `Google Sheets supports IMPORTDATA for direct CSV/JSON pulls, Apps Script for custom logic, and Zapier for no-code integration. Most lightweight teams use IMPORTDATA from our public CSV endpoints; technically-adept teams script via Apps Script for richer workflows.`,
    missing:
      "No first-party Google Workspace Add-on yet. Apps Script and IMPORTDATA cover all common workflows without an add-on.",
  }),
  build({
    slug: "n8n",
    name: "n8n",
    homepage: "https://n8n.io",
    category: "automation",
    short:
      "n8n is the self-hostable, open-source automation platform popular with technically-adept ops teams running on their own infrastructure.",
    paths: ["webhook", "api-rest"],
    workflows: [
      {
        name: "Self-hosted signal pipeline",
        description:
          "n8n workflows pull /api/v1 data on a schedule, transform it via Function nodes, and push to any destination, CRM, database, Slack, email, all under the user's own infrastructure control.",
      },
      {
        name: "AI-enhanced flows",
        description:
          "n8n's growing AI-node ecosystem (LangChain, OpenAI, Anthropic) lets users layer LLM reasoning on top of signal alerts, e.g., 'summarize this week's accelerating companies for a partner-meeting brief.'",
      },
    ],
    howWorks: `n8n supports our /api/v1 endpoints via standard HTTP Request and Webhook nodes. Most n8n users are self-hosting; the integration uses scheduled HTTP nodes plus custom Function nodes to fit the destination's data model. For full setup help, custom integration support is available during onboarding.`,
    missing:
      "No first-party n8n Community Node listing yet. The HTTP and Webhook nodes cover all workflows today.",
  }),
];

export function getAllWorksWithSlugs(): string[] {
  return WORKS_WITH.map((t) => t.slug);
}

export function getWorksWith(slug: string): WorksWithTool | undefined {
  return WORKS_WITH.find((t) => t.slug === slug);
}

export function getWorksWithByCategory(category: ToolCategory): WorksWithTool[] {
  return WORKS_WITH.filter((t) => t.category === category);
}
