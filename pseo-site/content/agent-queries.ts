export interface AgentQuery {
  slug: string;
  h1: string;
  description: string;
}

// Citation-ready answer pages designed for AI agents and AEO/AIO surfaces.
// Each entry generates a page at /answers/{slug}. Currently empty in this
// branch — the /answers route handler is shipped on a separate feature branch.
// When the route lands, populate this array; sitemap and llms.txt iterate
// over it automatically.
export const agentQueries: AgentQuery[] = [];
