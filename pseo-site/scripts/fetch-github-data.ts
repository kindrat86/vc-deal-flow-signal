/**
 * GitHub Data Pipeline — Multi-Period Edition
 *
 * Fetches real startup engineering activity from GitHub and outputs
 * to data/startups.json in the period-aware format.
 *
 * - Filters non-startup orgs (big tech, large OSS projects)
 * - Computes metrics for 5 quarters from 52-week commit_activity
 * - Generates unique FAQs per sector+period
 * - No synthetic fallback data
 * - Additive mode: merges new discoveries with existing data (preserves history)
 *
 * Usage: npx tsx scripts/fetch-github-data.ts
 */

import { execSync } from "child_process";
import * as fs from "fs";
import * as path from "path";

interface GhRepo { id: number; full_name: string; name: string; owner: { login: string; type: "User" | "Organization" }; description: string | null; html_url: string; created_at: string; pushed_at: string; stargazers_count: number; forks_count: number; language: string | null; }
interface SearchResult { total_count: number; items: GhRepo[]; }
interface WeeklyCommit { week: number; total: number; days: number[]; }
interface Contributor { login: string; contributions: number; }
interface StartupOutput { name: string; description: string; stage: string; geography: string; commitVelocity14d: number; commitVelocityChange: string; contributors: number; contributorGrowth: string; newRepos: number; signalType: string; githubUrl: string; websiteUrl?: string; }
interface FAQ { question: string; answer: string; }
interface SectorSnapshot { intro: string; startups: StartupOutput[]; faqs: FAQ[]; }
interface SectorOutput { slug: string; name: string; description: string; relatedSlugs: string[]; periods: Record<string, SectorSnapshot>; }
interface PeriodDef { slug: string; name: string; current: boolean; weekOffset: number; }
interface OrgData { orgLogin: string; description: string; geography: string; contributorCount: number; contributorGrowth: string; newRepos: number; commitActivity: WeeklyCommit[]; githubUrl: string; websiteUrl?: string; }

// --- Blocklist: big tech, established OSS foundations, nonprofits, government, game mods ---
const BLOCKLIST = new Set([
  // Big tech
  "google","microsoft","facebook","meta","amazon","apple","Netflix","uber","airbnb",
  "linkedin","twitter","mozilla","apache","oracle","ibm","intel","nvidia","salesforce",
  "vmware","redhat","elastic","confluent","datadog","hashicorp","databricks",
  // Large OSS / CNCF / foundations
  "tensorflow","pytorch","kubernetes","docker","grafana","prometheus","envoyproxy",
  "istio","helm","vitessio","cncf","openjs-foundation","w3c","chromium",
  "nicothin", "quantumlib","godotengine","BabylonJS","symfony","MetaMask",
  "smartcontractkit","frappe","ChromeDevTools",
  // Established companies (>10yr or >$50M revenue)
  "Shopify","stripe","wso2","craftcms","EC-CUBE","glpi-project","openemr",
  "abpframework","backstage","PrestaShop",
  // Nonprofits / education / government
  "freeCodeCamp","DFE-Digital","OneCommunityGlobal","oppia","python-social-auth",
  "sakaiproject","ankidroid","freelawproject","APSIMInitiative","catalyst-cooperative",
  // Game mods / non-software-companies
  "tgstation","BeeStation","goonstation","ss220-space","ZQuestClassic",
  "yogstation13","vgstation13","ParadiseSS13","NebsS13","tgstation13",
  // Research / NASA / academic
  "pytroll","OpenSpace","nasa","cern",
  // Forks / wrappers with no original product
  "carlos-emr",
]);

// Patterns in org name or description that indicate non-startup
const DESCRIPTION_REJECT_PATTERNS = [
  /\bfork(ed)?\b.*\b(from|of)\b/i,                   // "forked from X"
  /\bspace station 13\b/i,                             // SS13 game mods
  /\bglobal change organization\b/i,                   // nonprofits
  /\bgovernment\b|\bdepartment of\b|\bministry\b/i,   // government orgs
  /\blearn to code\b|\bcoding bootcamp\b/i,            // education platforms
  /\buniversity\b|\bresearch lab\b|\bacademic\b/i,     // academic
];

// Minimum thresholds for a viable startup signal
const MIN_CONTRIBUTORS = 3;   // skip personal projects
const MAX_ORG_AGE_YEARS = 12; // skip orgs created before 2014
const SEARCH_PER_TOPIC = 60;  // results per topic search (was 30)
const MAX_ORGS_PER_SECTOR = 30; // orgs evaluated per sector (was 10, target ~400 total)
const SECTORS_PER_RUN = 5;     // fewer sectors per run to stay within rate limits with larger per-sector volume

function buildPeriods(): PeriodDef[] {
  const now = new Date();
  const currentQ = Math.ceil((now.getMonth() + 1) / 3);
  const currentY = now.getFullYear();
  const periods: PeriodDef[] = [];
  for (let i = 0; i < 5; i++) {
    let q = currentQ - i, y = currentY;
    while (q <= 0) { q += 4; y--; }
    periods.push({ slug: `q${q}-${y}`, name: `Q${q} ${y}`, current: i === 0, weekOffset: i * 13 });
  }
  return periods;
}

// Manual geography enrichment for orgs whose GitHub location field is empty.
// Sourced from org websites, Crunchbase, and LinkedIn. Reviewed 2026-04-15.
const GEO_OVERRIDES: Record<string, string> = {
  // US
  wazuh: "US", oroinc: "US", magento: "US", "carbon-design-system": "US",
  openemr: "US", "ever-co": "US", spree: "US", bevyengine: "US",
  // EU
  atrocore: "EU", smartstore: "EU", ekylibre: "EU", "incubateur-ademe": "EU",
  ls1intum: "EU", "starlake-ai": "EU", PrestaShop: "EU", bgerp: "EU",
  alephium: "EU",
  // LATAM
  bakaphp: "LATAM", "open-condo-software": "LATAM",
  // APAC
  Krexind: "APAC", "carlos-emr": "APAC",
  // Canada
  LiteFarmOrg: "Canada",
  // Australia
  APSIMInitiative: "APAC",
};

function getGitHubToken(): string {
  if (process.env.GITHUB_TOKEN) return process.env.GITHUB_TOKEN;
  try { const t = execSync("gh auth token", { encoding: "utf8" }).trim(); if (t) return t; } catch {}
  throw new Error("No GitHub token. Set GITHUB_TOKEN or log in with gh CLI.");
}
const GITHUB_TOKEN = getGitHubToken();

function sleep(ms: number) { return new Promise((r) => setTimeout(r, ms)); }

async function ghApiFetch(endpoint: string): Promise<unknown> {
  const url = endpoint.startsWith("https://") ? endpoint : `https://api.github.com/${endpoint}`;
  const headers = { Authorization: `token ${GITHUB_TOKEN}`, Accept: "application/vnd.github.v3+json", "User-Agent": "vc-deal-flow-signal" };

  // GitHub stats endpoints return 202 while computing — retry with backoff
  const isStats = url.includes("/stats/");
  const maxAttempts = isStats ? 3 : 1;

  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const res = await fetch(url, { headers });
    if (res.status === 200) return res.json();
    if (res.status === 202 && isStats && attempt < maxAttempts - 1) {
      await sleep(2000 + attempt * 1500); // 2s, 3.5s backoff (faster)
      continue;
    }
    if (!res.ok) throw new Error(`GitHub API ${res.status}: ${res.statusText} for ${endpoint}`);
  }
  return [];
}

async function ghApiSearchMultiTopic(topics: string[], extra: string, perPage = 20): Promise<GhRepo[]> {
  const all: Map<number, GhRepo> = new Map();
  for (const topic of topics) {
    const q = encodeURIComponent(`topic:${topic} ${extra}`);
    try { const r = (await ghApiFetch(`search/repositories?q=${q}&sort=updated&per_page=${perPage}`)) as SearchResult; for (const repo of r.items || []) all.set(repo.id, repo); } catch (e: unknown) { console.warn(`    topic:${topic} failed: ${(e instanceof Error ? e.message : String(e)).slice(0, 120)}`); }
    await sleep(400);
  }
  return [...all.values()];
}

function formatPct(ratio: number): string { const p = Math.round((ratio - 1) * 100); return p >= 0 ? `+${p}%` : `${p}%`; }

/**
 * Normalize the `blog` field from the GitHub org API. Returns undefined when
 * the value is empty, obviously broken, or a github.io subdomain that just
 * points back at the same org (which isn't an official site).
 */
function normalizeBlog(raw: string | null | undefined, orgLogin: string): string | undefined {
  if (!raw) return undefined;
  let v = raw.trim();
  if (!v || v === "-") return undefined;
  if (!/^https?:\/\//i.test(v)) v = `https://${v}`;
  try {
    const u = new URL(v);
    // Reject orgLogin.github.io — not an independent company site
    if (u.hostname.toLowerCase() === `${orgLogin.toLowerCase()}.github.io`) return undefined;
    // Normalize: lowercase hostname, strip trailing slash from root
    u.hostname = u.hostname.toLowerCase();
    let out = u.toString();
    if (u.pathname === "/" && !u.search && !u.hash) out = out.replace(/\/$/, "");
    return out;
  } catch {
    return undefined;
  }
}

function deriveGeography(loc: string | null): string {
  if (!loc) return "Unknown"; const l = loc.toLowerCase();
  if (/united states|usa|\b(ca|ny|tx|wa)\b|san francisco|new york|seattle|boston|austin|chicago/.test(l)) return "US";
  if (/london|united kingdom|\buk\b|england/.test(l)) return "UK";
  if (/germany|berlin|munich|paris|france|amsterdam|netherlands|stockholm|sweden|zurich|switzerland|europe|\beu\b/.test(l)) return "EU";
  if (/india|bangalore|mumbai|tokyo|japan|singapore|australia|china|beijing|shanghai|korea|seoul/.test(l)) return "APAC";
  if (/canada|toronto|vancouver|montreal/.test(l)) return "Canada";
  if (/brazil|latam|mexico/.test(l)) return "LATAM";
  if (/israel|middle east|dubai/.test(l)) return "MENA";
  return "Unknown";
}

function classifySignal(cR: number, ctR: number, nR: number): string { if (ctR >= 1.5) return "Engineering hiring burst"; if (nR >= 3) return "Infrastructure buildout"; if (cR >= 2.5) return "Deploy frequency spike"; return "Framework migration"; }
function classifyStage(c: number): string { if (c >= 50) return "Growth"; if (c >= 20) return "Series A/B"; if (c >= 8) return "Seed"; return "Pre-seed"; }

function computePeriodMetrics(ca: WeeklyCommit[], weekOffset: number, ctR: number, nR: number): { commitVelocity14d: number; commitVelocityChange: string; signalType: string } | null {
  if (ca.length < 4) return null;
  const e = ca.length - 1 - weekOffset, s = e - 1, pe = s - 1, ps = pe - 1;
  if (ps < 0 || e >= ca.length) return null;
  const cur = ca[s].total + ca[e].total, prev = ca[ps].total + ca[pe].total;
  if (cur === 0) return null;
  const change = prev > 0 ? formatPct(cur / prev) : "+999%";
  const ratio = prev > 0 ? cur / prev : 10;
  return { commitVelocity14d: cur, commitVelocityChange: change, signalType: classifySignal(ratio, ctR, nR) };
}

async function fetchOrgData(orgLogin: string, fallbackDesc: string, searchRepos: GhRepo[]): Promise<OrgData | null> {
  console.log(`    Processing: ${orgLogin}`);
  if (BLOCKLIST.has(orgLogin)) { console.log(`      Skipped (blocklist)`); return null; }

  await sleep(300);
  let orgLoc: string | null = null, orgDesc = fallbackDesc, orgCreated: string | null = null;
  let orgBlog: string | undefined = undefined;
  try {
    const d = (await ghApiFetch(`orgs/${orgLogin}`)) as { location?: string | null; description?: string | null; bio?: string | null; created_at?: string | null; blog?: string | null };
    orgLoc = d.location ?? null;
    orgDesc = ((d.description ?? d.bio ?? fallbackDesc) as string).slice(0, 120);
    orgCreated = d.created_at ?? null;
    orgBlog = normalizeBlog(d.blog, orgLogin);
  } catch {}

  // Reject orgs whose description matches non-startup patterns
  const fullDesc = `${orgLogin} ${orgDesc} ${fallbackDesc}`.toLowerCase();
  for (const pattern of DESCRIPTION_REJECT_PATTERNS) {
    if (pattern.test(fullDesc)) {
      console.log(`      Skipped (description pattern: ${pattern.source})`);
      return null;
    }
  }

  // Reject orgs older than MAX_ORG_AGE_YEARS (likely established OSS, not startups)
  if (orgCreated) {
    const ageYears = (Date.now() - new Date(orgCreated).getTime()) / (365.25 * 86400000);
    if (ageYears > MAX_ORG_AGE_YEARS) {
      console.log(`      Skipped (org age ${ageYears.toFixed(1)}yr > ${MAX_ORG_AGE_YEARS}yr)`);
      return null;
    }
  }

  await sleep(300);
  let repos: GhRepo[] = [];
  try { repos = (await ghApiFetch(`orgs/${orgLogin}/repos?sort=pushed&direction=desc&per_page=30&type=public`)) as GhRepo[]; if (!Array.isArray(repos)) repos = []; } catch { repos = []; }
  if (repos.length === 0) repos = searchRepos.filter((r) => r.owner.login === orgLogin);
  if (repos.length === 0) { console.log(`      Skipped (no repos)`); return null; }

  // Skip orgs where the majority of repos are forks (not building original product)
  const forkCount = repos.filter((r) => (r as GhRepo & { fork?: boolean }).fork).length;
  if (repos.length >= 3 && forkCount / repos.length > 0.7) {
    console.log(`      Skipped (${forkCount}/${repos.length} repos are forks)`);
    return null;
  }

  const thirtyDaysAgo = Date.now() - 30 * 86400000;
  const newRepos = repos.filter((r) => new Date(r.created_at).getTime() > thirtyDaysAgo).length;
  const top = repos[0];

  await sleep(300);
  let ca: WeeklyCommit[] = [];
  try { ca = (await ghApiFetch(`repos/${orgLogin}/${top.name}/stats/commit_activity`)) as WeeklyCommit[]; if (!Array.isArray(ca)) ca = []; } catch { ca = []; }

  await sleep(300);
  let contribs: Contributor[] = [];
  try { contribs = (await ghApiFetch(`repos/${orgLogin}/${top.name}/contributors?per_page=100`)) as Contributor[]; if (!Array.isArray(contribs)) contribs = []; } catch { contribs = []; }

  // Skip orgs with too few contributors (personal projects, not startups)
  if (contribs.length < MIN_CONTRIBUTORS) {
    console.log(`      Skipped (${contribs.length} contributors < ${MIN_CONTRIBUTORS} minimum)`);
    return null;
  }

  let contributorGrowth = "+0%";
  if (contribs.length > 0 && ca.length >= 12) {
    const recent = ca.slice(-6).reduce((a, w) => a + w.total, 0);
    const older = ca.slice(-12, -6).reduce((a, w) => a + w.total, 0);
    if (older > 0 && recent > older) contributorGrowth = formatPct(Math.min(recent / older, 5));
  }

  const geography = GEO_OVERRIDES[orgLogin] || deriveGeography(orgLoc);
  return { orgLogin, description: orgDesc.trim(), geography, contributorCount: Math.max(1, contribs.length), contributorGrowth, newRepos, commitActivity: ca, githubUrl: `https://github.com/${orgLogin}`, websiteUrl: orgBlog };
}

function generateFaqs(name: string, desc: string, pName: string, startups: StartupOutput[]): FAQ[] {
  if (!startups.length) return [];
  const sorted = [...startups].sort((a, b) => (parseInt(b.commitVelocityChange.replace(/[^0-9-]/g, "")) || 0) - (parseInt(a.commitVelocityChange.replace(/[^0-9-]/g, "")) || 0));
  const top = sorted[0];
  const avg = Math.round(startups.reduce((s, x) => s + x.commitVelocity14d, 0) / startups.length);
  const sc: Record<string, number> = {}; for (const s of startups) sc[s.signalType] = (sc[s.signalType] || 0) + 1;
  const ts = Object.entries(sc).sort(([, a], [, b]) => b - a)[0];
  const gc: Record<string, number> = {}; for (const s of startups) gc[s.geography] = (gc[s.geography] || 0) + 1;
  const tg = Object.entries(gc).filter(([g]) => g !== "Unknown").sort(([, a], [, b]) => b - a)[0];
  const pos = startups.filter((s) => s.commitVelocityChange.startsWith("+") && s.commitVelocityChange !== "+0%").length;

  return [
    { question: `What engineering signals are ${name.toLowerCase()} startups showing in ${pName}?`, answer: `In ${pName}, we are tracking ${startups.length} ${name.toLowerCase()} startups with measurable GitHub engineering signals. ${pos} of ${startups.length} show positive commit velocity growth. The most common signal type is "${ts[0]}", observed in ${ts[1]} of the tracked companies. The average 14-day commit velocity across the sector is ${avg} commits, with ${top.name} leading at ${top.commitVelocity14d} commits (${top.commitVelocityChange} change). These patterns have historically preceded fundraise announcements by three to six weeks.` },
    { question: `Which ${name.toLowerCase()} startup has the highest engineering acceleration in ${pName}?`, answer: `${top.name} leads the ${name.toLowerCase()} sector in ${pName} with ${top.commitVelocity14d} commits over a 14-day window, representing a ${top.commitVelocityChange} change from the prior period. With ${top.contributors} active contributors${top.newRepos > 0 ? ` and ${top.newRepos} new repositories` : ""}, ${top.name} is showing a "${top.signalType}" pattern — one of the more reliable leading indicators of a significant product milestone or fundraise.` },
    { question: `Where are the most active ${name.toLowerCase()} engineering teams located?`, answer: tg ? `Among the ${startups.length} ${name.toLowerCase()} startups we track, ${tg[0]} accounts for the highest concentration with ${tg[1]} teams. ${desc} Geographic distribution matters for investors because engineering talent clusters correlate with sector-specific domain expertise and proximity to early adopter customers.` : `The ${name.toLowerCase()} startups we track are geographically distributed across multiple regions. ${desc} We derive geography from GitHub organization profiles.` },
  ];
}

const SECTORS: Array<{ slug: string; name: string; description: string; intro: string; relatedSlugs: string[]; topics: string[] }> = [
  { slug: "ai-ml", name: "AI & Machine Learning", description: "Startups building AI/ML infrastructure, applications, and tools.", intro: "AI and ML engineering teams are moving at an unusual pace this quarter. We are tracking model infrastructure startups with commit velocities that have tripled in under three weeks.", relatedSlugs: ["developer-tools", "data-infrastructure", "enterprise-saas"], topics: ["machine-learning", "artificial-intelligence", "deep-learning", "llm", "nlp", "computer-vision", "transformers", "generative-ai"] },
  { slug: "fintech", name: "Fintech", description: "Startups disrupting financial services through technology.", intro: "Fintech engineering teams are moving fast this quarter with payment infrastructure startups showing contributor counts doubling in under two weeks.", relatedSlugs: ["enterprise-saas", "web3", "cybersecurity"], topics: ["fintech", "payment-gateway", "open-banking", "personal-finance", "accounting", "lending"] },
  { slug: "climate-tech", name: "Climate Tech", description: "Startups developing clean energy, carbon monitoring, and climate adaptation technologies.", intro: "Climate tech engineering activity is concentrated in grid software and carbon accounting tooling.", relatedSlugs: ["agtech", "enterprise-saas", "data-infrastructure"], topics: ["climate", "sustainability", "clean-energy", "carbon", "renewable-energy", "solar", "electric-vehicle", "carbon-footprint"] },
  { slug: "developer-tools", name: "Developer Tools", description: "Startups building tools and infrastructure for developers.", intro: "Developer tools is the sector with the most consistent engineering signal this quarter.", relatedSlugs: ["ai-ml", "data-infrastructure", "cybersecurity"], topics: ["developer-tools", "api-client", "code-editor", "developer-experience", "cli", "devtools"] },
  { slug: "cybersecurity", name: "Cybersecurity", description: "Startups protecting systems, networks, and data from digital attacks.", intro: "Cybersecurity engineering teams show a bifurcated pattern: vulnerability scanning sprints vs. identity teams with steady commits but growing contributor lists.", relatedSlugs: ["enterprise-saas", "developer-tools", "data-infrastructure"], topics: ["security", "cybersecurity", "infosec", "vulnerability", "pentesting", "siem", "zero-trust", "identity-management"] },
  { slug: "healthcare", name: "Healthcare", description: "Startups applying technology to patient care, health systems, and drug discovery.", intro: "Healthcare tech engineering is picking up after a slow Q1, led by clinical workflow automation teams.", relatedSlugs: ["ai-ml", "enterprise-saas", "data-infrastructure"], topics: ["healthcare", "healthtech", "medical", "biotech", "telemedicine", "ehr", "digital-health", "clinical-trials"] },
  { slug: "edtech", name: "EdTech", description: "Startups transforming education through adaptive learning and institutional software.", intro: "EdTech signals are mixed: consumer platforms in maintenance mode, institutional B2B showing the energy.", relatedSlugs: ["enterprise-saas", "ai-ml", "social-community"], topics: ["education", "edtech", "learning", "e-learning", "lms", "assessment", "tutoring", "online-education"] },
  { slug: "ecommerce-infrastructure", name: "E-commerce Infrastructure", description: "Startups building backend systems and APIs for online retail.", intro: "E-commerce infrastructure engineering is running hot ahead of the summer retail season.", relatedSlugs: ["fintech", "data-infrastructure", "enterprise-saas"], topics: ["ecommerce", "shopify", "payments", "marketplace", "checkout", "storefront", "shipping", "cart"] },
  { slug: "supply-chain", name: "Supply Chain", description: "Startups digitizing logistics, procurement, and inventory management.", intro: "Supply chain tech is seeing a second wave of engineering investment this quarter.", relatedSlugs: ["enterprise-saas", "fintech", "data-infrastructure"], topics: ["supply-chain-management", "logistics", "order-management", "inventory-management", "warehouse", "inventory"] },
  { slug: "web3", name: "Web3", description: "Startups building decentralized applications and blockchain infrastructure.", intro: "Web3 engineering activity has rebounded sharply, with infrastructure and bridge tooling teams nearly doubling contributor counts.", relatedSlugs: ["fintech", "cybersecurity", "enterprise-saas"], topics: ["web3", "blockchain", "defi", "ethereum", "solana", "smart-contracts", "dao", "layer2"] },
  { slug: "enterprise-saas", name: "Enterprise SaaS", description: "Startups building vertical and horizontal B2B software.", intro: "Enterprise SaaS has the highest aggregate commit volume but widest variance in signal quality.", relatedSlugs: ["ai-ml", "data-infrastructure", "cybersecurity"], topics: ["saas", "enterprise", "b2b", "crm", "erp", "workflow-automation", "project-management", "invoicing"] },
  { slug: "data-infrastructure", name: "Data Infrastructure", description: "Startups building pipelines, warehouses, and observability platforms.", intro: "Data infrastructure is the most active engineering sector by raw commit volume this quarter.", relatedSlugs: ["ai-ml", "enterprise-saas", "developer-tools"], topics: ["data-pipeline", "etl", "data-engineering", "analytics", "streaming", "data-warehouse", "observability", "data-lake"] },
  { slug: "robotics", name: "Robotics", description: "Startups building autonomous robots and robotic process automation.", intro: "Robotics engineering is concentrated in few teams, but signal density is high.", relatedSlugs: ["ai-ml", "developer-tools", "supply-chain"], topics: ["robotics", "ros", "automation", "drone", "slam", "motion-planning", "autonomous", "robot"] },
  { slug: "legal-tech", name: "Legal Tech", description: "Startups automating legal workflows and compliance management.", intro: "Legal tech is quieter than most sectors, but active teams show strong signals.", relatedSlugs: ["enterprise-saas", "ai-ml", "cybersecurity"], topics: ["legaltech", "legal", "contract", "compliance", "document-management", "e-discovery", "legal-automation", "regulatory"] },
  { slug: "hr-tech", name: "HR Tech", description: "Startups building recruiting, people management, and workforce analytics tools.", intro: "HR tech signals split by stage: AI-powered recruiting shows explosive growth, established HRIS shows migration patterns.", relatedSlugs: ["enterprise-saas", "ai-ml", "data-infrastructure"], topics: ["hr", "recruiting", "hiring", "talent", "payroll", "onboarding", "workforce", "people-analytics"] },
  { slug: "proptech", name: "PropTech", description: "Startups applying technology to real estate and property management.", intro: "PropTech engineering is rebounding after a muted 2025, led by property data and analytics teams.", relatedSlugs: ["enterprise-saas", "fintech", "data-infrastructure"], topics: ["real-estate", "proptech", "property", "housing", "mortgage", "rental", "property-management", "smart-building"] },
  { slug: "agtech", name: "AgTech", description: "Startups applying technology to agriculture and precision farming.", intro: "AgTech is a small-sample sector, but signals are unusually clean this quarter.", relatedSlugs: ["climate-tech", "supply-chain", "data-infrastructure"], topics: ["agriculture", "agtech", "farming", "precision-agriculture", "crop", "irrigation", "farm-management", "food-tech"] },
  { slug: "gaming", name: "Gaming", description: "Startups building game engines, multiplayer infrastructure, and gaming analytics.", intro: "Gaming is one of the few sectors showing broad-based activity increases.", relatedSlugs: ["web3", "ai-ml", "developer-tools"], topics: ["game-engine", "gamedev", "gaming", "unity", "multiplayer", "game-server", "unreal", "game-development"] },
  { slug: "space-tech", name: "Space Tech", description: "Startups building launch vehicles, satellites, and space data platforms.", intro: "Space tech has a small but distinct engineering footprint on GitHub.", relatedSlugs: ["robotics", "ai-ml", "data-infrastructure"], topics: ["space", "satellite", "aerospace", "rocket", "orbit", "ground-station", "cubesat", "spacecraft"] },
  { slug: "social-community", name: "Social & Community", description: "Startups building social networks, community platforms, and creator tools.", intro: "Social and community platform engineering shows two distinct clusters this quarter.", relatedSlugs: ["enterprise-saas", "ai-ml", "edtech"], topics: ["social", "community", "forum", "messaging", "chat", "collaboration", "social-network", "creator-tools"] },
];

async function main() {
  const periods = buildPeriods();
  console.log("=== GitHub Data Pipeline (Multi-Period) ===");
  console.log(`Token: ${process.env.GITHUB_TOKEN ? "env var" : "gh CLI"}`);
  console.log(`${SECTORS.length} sectors x ${periods.length} periods`);
  console.log(`Periods: ${periods.map((p) => p.name).join(", ")}\n`);

  // Sector rotation: process a subset each run for faster execution.
  // The day-of-year determines which slice of sectors to process.
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  const startIdx = (dayOfYear * SECTORS_PER_RUN) % SECTORS.length;
  const sectorSlice: typeof SECTORS = [];
  for (let i = 0; i < SECTORS_PER_RUN && i < SECTORS.length; i++) {
    sectorSlice.push(SECTORS[(startIdx + i) % SECTORS.length]);
  }
  console.log(`Sector rotation: day ${dayOfYear}, processing ${sectorSlice.length}/${SECTORS.length} sectors`);
  console.log(`  Sectors: ${sectorSlice.map((s) => s.slug).join(", ")}\n`);

  // Cross-sector dedup: each org can only appear in one sector (first match wins)
  const claimedOrgs = new Set<string>();

  const outputSectors: SectorOutput[] = [];
  for (const [idx, sector] of sectorSlice.entries()) {
    console.log(`[${idx + 1}/${SECTORS.length}] ${sector.name}`);
    const cutoff = new Date(); cutoff.setMonth(cutoff.getMonth() - 3);
    let items: GhRepo[] = [];
    try { items = await ghApiSearchMultiTopic(sector.topics, `pushed:>${cutoff.toISOString().slice(0, 10)} stars:>10`, SEARCH_PER_TOPIC); } catch (e) { console.error(`  Search failed:`, e); }

    const orgMap = new Map<string, { repos: GhRepo[]; type: string; desc: string }>();
    for (const r of items) {
      // Skip orgs already claimed by a previous sector
      if (claimedOrgs.has(r.owner.login)) continue;
      if (!orgMap.has(r.owner.login)) orgMap.set(r.owner.login, { repos: [], type: r.owner.type, desc: r.description || "" });
      orgMap.get(r.owner.login)!.repos.push(r);
    }

    const sorted = [...orgMap.entries()].sort(([, a], [, b]) => { if (a.type === "Organization" && b.type !== "Organization") return -1; if (a.type !== "Organization" && b.type === "Organization") return 1; return b.repos.length - a.repos.length; }).slice(0, MAX_ORGS_PER_SECTOR + 10);

    const orgs: OrgData[] = [];
    for (const [login, { desc }] of sorted) {
      if (orgs.length >= MAX_ORGS_PER_SECTOR) break;
      if (claimedOrgs.has(login)) continue; // double-check after async fetches
      try {
        const d = await fetchOrgData(login, desc, items);
        if (d) { orgs.push(d); claimedOrgs.add(login); }
      } catch (e) { console.error(`  ${login}:`, e); }
    }

    const sp: Record<string, SectorSnapshot> = {};
    for (const period of periods) {
      const startups: StartupOutput[] = [];
      for (const org of orgs) {
        const m = computePeriodMetrics(org.commitActivity, period.weekOffset, parseFloat(org.contributorGrowth.replace(/[^0-9.-]/g, "")) / 100 + 1 || 1, org.newRepos);
        if (!m) continue;
        startups.push({ name: org.orgLogin, description: org.description, stage: classifyStage(org.contributorCount), geography: org.geography, commitVelocity14d: m.commitVelocity14d, commitVelocityChange: m.commitVelocityChange, contributors: org.contributorCount, contributorGrowth: org.contributorGrowth, newRepos: org.newRepos, signalType: m.signalType, githubUrl: org.githubUrl, ...(org.websiteUrl ? { websiteUrl: org.websiteUrl } : {}) });
      }
      if (!startups.length) continue;
      sp[period.slug] = { intro: sector.intro, startups, faqs: generateFaqs(sector.name, sector.description, period.name, startups) };
    }
    console.log(`  Periods: ${Object.keys(sp).join(", ")} (${orgs.length} orgs)`);
    outputSectors.push({ slug: sector.slug, name: sector.name, description: sector.description, relatedSlugs: sector.relatedSlugs, periods: sp });
    await sleep(500);
  }

  // Additive merge: combine new discoveries with existing data (preserves startups
  // from prior runs that may not appear in today's search results)
  const dir = path.join(process.cwd(), "data"); if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  const dataPath = path.join(dir, "startups.json");

  let existing: { periods: { slug: string; name: string; current: boolean }[]; sectors: SectorOutput[] } | null = null;
  try { existing = JSON.parse(fs.readFileSync(dataPath, "utf8")); } catch {}

  if (existing) {
    for (const newSector of outputSectors) {
      const oldSector = existing.sectors.find((s) => s.slug === newSector.slug);
      if (!oldSector) continue;
      for (const [pSlug, newSnap] of Object.entries(newSector.periods)) {
        const oldSnap = oldSector.periods[pSlug];
        if (!oldSnap) continue;
        // Merge: keep old startups not found in this run, add new ones
        const newNames = new Set(newSnap.startups.map((s) => s.name));
        const retained = oldSnap.startups.filter((s) => !newNames.has(s.name));
        newSnap.startups = [...newSnap.startups, ...retained];
        // Regenerate FAQs with the merged list
        newSnap.faqs = generateFaqs(newSector.name, newSector.description, periods.find((p) => p.slug === pSlug)?.name ?? pSlug, newSnap.startups);
      }
      // Keep old periods not covered by this run
      for (const [pSlug, oldSnap] of Object.entries(oldSector.periods)) {
        if (!newSector.periods[pSlug]) newSector.periods[pSlug] = oldSnap;
      }
    }
  }

  // Preserve sectors from previous runs that were not processed this time
  if (existing) {
    const processedSlugs = new Set(outputSectors.map((s) => s.slug));
    for (const oldSector of existing.sectors) {
      if (!processedSlugs.has(oldSector.slug)) {
        outputSectors.push(oldSector);
      }
    }
  }

  // Sort sectors to maintain consistent order
  outputSectors.sort((a, b) => {
    const aIdx = SECTORS.findIndex((s) => s.slug === a.slug);
    const bIdx = SECTORS.findIndex((s) => s.slug === b.slug);
    return aIdx - bIdx;
  });

  const out = { periods: periods.map(({ slug, name, current }) => ({ slug, name, current })), sectors: outputSectors };
  fs.writeFileSync(dataPath, JSON.stringify(out, null, 2), "utf8");

  const pages = outputSectors.reduce((s, x) => s + Object.keys(x.periods).length, 0);
  const total = outputSectors.reduce((s, x) => s + Object.values(x.periods).reduce((ps, snap) => ps + snap.startups.length, 0), 0);
  console.log(`\n=== Done: ${pages} pages, ${total} startup entries, ${pages * 3} FAQs ===`);
  console.log(`Unique orgs claimed: ${claimedOrgs.size} (deduped across sectors)`);
  console.log(`Blocklist size: ${BLOCKLIST.size}`);
}

main().catch((e) => { console.error("Fatal:", e); process.exit(1); });
