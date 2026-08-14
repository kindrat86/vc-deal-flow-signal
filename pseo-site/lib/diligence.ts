/**
 * lib/diligence.ts, agent-facing diligence grounding layer.
 *
 * Reverse-indexes the three public-source corpora we already publish as
 * canonical entity pages, acquirers (M&A), fund→portfolio (who backed
 * whom), and companies (engineering signal), into a single "dossier"
 * keyed by company/entity name. This is the grounding source an AI agent
 * queries mid-diligence: "who acquired X", "which funds backed Y",
 * "what's the signal on Z".
 *
 * Honesty posture (load-bearing, this is meant to be LLM-verifiable):
 *   - Every fact carries a source URL and a one-line provenance note.
 *   - M&A + investor facts inherit the strict public-source threshold
 *     already documented in content/acquirers.ts and content/fund-portfolio.ts
 *     (press release / SEC filing / both-sides-disclosed only).
 *   - Engineering-signal facts are the *published* summary from
 *     content/companies.ts (static v1 placeholders, clearly framed as
 *     "as published" with a link to /predict for a live recompute), NOT a
 *     fabricated live number.
 *   - When a fact is simply unknown (e.g. a company we track was never
 *     acquired), the dossier says so explicitly rather than inventing one.
 *
 * Consumed by:
 *   - app/api/diligence.json/route.ts  (machine-readable endpoint)
 *   - app/api/agent/tools + agent/call (get_diligence_dossier tool)
 *   - app/diligence/page.tsx           (one consolidated cited hub)
 */

import { ACQUIRERS, type Acquirer } from "@/content/acquirers";
import { companies, getCompany, type Company } from "@/content/companies";
import { getFund } from "@/content/funds";
import {
  getInvestorsForCompany,
  FUND_PORTFOLIO,
} from "@/content/fund-portfolio";
import { slugify } from "@/lib/slugify";

export const SITE = "https://signals.gitdealflow.com";

/** Normalize a name/slug for tolerant matching ("Palo Alto Networks" → "paloaltonetworks"). */
function norm(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]/g, "");
}

export interface DiligenceFact {
  claim: string;
  sourceUrl: string;
  sourceLabel: string;
}

export interface AcquiredByFact {
  acquirer: string;
  acquirerSlug: string;
  acquirerUrl: string;
  year: number;
  announcedAmount?: string;
  note: string;
}

export interface AcquisitionMade {
  target: string;
  year: number;
  announcedAmount?: string;
  note: string;
}

export interface InvestorFact {
  fund: string;
  fundSlug: string;
  fundUrl: string;
}

export interface SignalFact {
  momentum: Company["publicSignal"]["momentum"];
  summary: string;
  sector: string;
  stage: Company["stage"];
  signalUrl: string;
  liveVerifyUrl: string;
}

export interface DiligenceDossier {
  /** The resolved canonical entity name (or the raw query if unresolved). */
  entity: string;
  /** Slug we resolved the entity to, when it maps to one of our pages. */
  entitySlug: string | null;
  /** True if we found ANY grounded fact for this entity. */
  found: boolean;
  /** Who acquired this entity (public M&A), if anything. */
  acquiredBy: AcquiredByFact[];
  /** If the entity is itself a known acquirer: what it has bought. */
  acquisitionsMade: AcquisitionMade[];
  /** Funds that publicly backed this entity (our tracked corpus only). */
  backedBy: InvestorFact[];
  /** Published engineering-acceleration signal, if we track the entity. */
  signal: SignalFact | null;
  /** Canonical links for an agent to follow for verification. */
  links: { label: string; url: string }[];
  /** Flat, citable fact list (mirrors the AgentSummary fact block). */
  facts: DiligenceFact[];
  /** Plain-language notes about what is and isn't known. */
  notes: string[];
}

// ---- Reverse indexes (built once at module load, all from static data) ----

interface AcquiredByIndexEntry extends AcquiredByFact {
  targetNorm: string;
}

const ACQUIRED_BY_INDEX: AcquiredByIndexEntry[] = ACQUIRERS.flatMap((a: Acquirer) =>
  a.notableAcquisitions.map((acq) => ({
    targetNorm: norm(acq.name),
    acquirer: a.name,
    acquirerSlug: a.slug,
    acquirerUrl: `${SITE}/acquirer/${a.slug}`,
    year: acq.year,
    announcedAmount: acq.announcedAmount,
    note: acq.note,
  })),
);

/** Every distinct entity name we can answer *something* about. */
export function getAllDiligenceEntities(): string[] {
  const names = new Set<string>();
  for (const c of companies) names.add(c.name);
  for (const a of ACQUIRERS) {
    names.add(a.name);
    for (const acq of a.notableAcquisitions) names.add(acq.name);
  }
  return [...names].sort((x, y) => x.localeCompare(y));
}

export function getDiligenceEntityCount(): {
  companies: number;
  acquirers: number;
  acquisitions: number;
  funds: number;
  total: number;
} {
  return {
    companies: companies.length,
    acquirers: ACQUIRERS.length,
    acquisitions: ACQUIRED_BY_INDEX.length,
    funds: Object.keys(FUND_PORTFOLIO).filter(
      (f) => (FUND_PORTFOLIO[f] ?? []).length > 0,
    ).length,
    total: getAllDiligenceEntities().length,
  };
}

/** Resolve a free-text query to a Company in our /signal corpus, if any. */
function resolveCompany(query: string): Company | undefined {
  const q = norm(query);
  // exact slug first (companies.ts slugs are stable)
  const bySlug = getCompany(slugify(query));
  if (bySlug) return bySlug;
  return companies.find(
    (c) => norm(c.name) === q || norm(c.slug) === q || norm(c.githubOrg) === q,
  );
}

/** Resolve a free-text query to a known Acquirer, if any. */
function resolveAcquirer(query: string): Acquirer | undefined {
  const q = norm(query);
  return ACQUIRERS.find((a) => norm(a.name) === q || norm(a.slug) === q);
}

/**
 * Build a full diligence dossier for an entity query. Always returns an
 * object; `found` is false when no grounded fact exists (callers should
 * surface the honest "not in our corpus" answer rather than guessing).
 */
export function buildDossier(query: string): DiligenceDossier {
  const cleaned = query.trim();
  const company = resolveCompany(cleaned);
  const acquirer = resolveAcquirer(cleaned);
  const entityName = company?.name ?? acquirer?.name ?? cleaned;
  const entitySlug = company?.slug ?? acquirer?.slug ?? null;
  const qNorm = norm(cleaned);

  // 1. Who acquired this entity (target side).
  const acquiredBy: AcquiredByFact[] = ACQUIRED_BY_INDEX.filter(
    (e) => e.targetNorm === qNorm || (company && e.targetNorm === norm(company.name)),
  ).map(({ targetNorm: _t, ...rest }) => rest);

  // 2. If the entity is itself an acquirer: what it has bought.
  const acquisitionsMade: AcquisitionMade[] = acquirer
    ? acquirer.notableAcquisitions.map((acq) => ({
        target: acq.name,
        year: acq.year,
        announcedAmount: acq.announcedAmount,
        note: acq.note,
      }))
    : [];

  // 3. Funds that publicly backed this entity (tracked corpus only).
  const backedBy: InvestorFact[] = company
    ? getInvestorsForCompany(company.slug)
        .map((fundSlug) => {
          const fund = getFund(fundSlug);
          return {
            fund: fund?.name ?? fundSlug,
            fundSlug,
            fundUrl: `${SITE}/fund/${fundSlug}`,
          };
        })
        // stable, human-friendly order
        .sort((a, b) => a.fund.localeCompare(b.fund))
    : [];

  // 4. Published engineering signal.
  const signal: SignalFact | null = company
    ? {
        momentum: company.publicSignal.momentum,
        summary: company.signalSummary,
        sector: company.sector,
        stage: company.stage,
        signalUrl: `${SITE}/signal/${company.slug}`,
        liveVerifyUrl: `${SITE}/predict?org=${encodeURIComponent(company.name)}`,
      }
    : null;

  // ---- Assemble citable facts + verification links ----
  const facts: DiligenceFact[] = [];
  const links: { label: string; url: string }[] = [];
  const notes: string[] = [];

  for (const a of acquiredBy) {
    facts.push({
      claim: `${entityName} was acquired by ${a.acquirer} in ${a.year}${
        a.announcedAmount ? ` for ${a.announcedAmount}` : ""
      }, ${a.note}.`,
      sourceUrl: a.acquirerUrl,
      sourceLabel: `${a.acquirer} M&A history (public press release / SEC filing threshold)`,
    });
    links.push({ label: `${a.acquirer} acquisitions →`, url: a.acquirerUrl });
  }

  if (acquisitionsMade.length > 0 && acquirer) {
    facts.push({
      claim: `${entityName} has ${acquisitionsMade.length} notable public acquisitions documented, including ${acquisitionsMade
        .slice(0, 3)
        .map((x) => x.target)
        .join(", ")}.`,
      sourceUrl: `${SITE}/acquirer/${acquirer.slug}`,
      sourceLabel: `${entityName} acquisition pattern`,
    });
    links.push({
      label: `${entityName} acquisition pattern →`,
      url: `${SITE}/acquirer/${acquirer.slug}`,
    });
  }

  if (backedBy.length > 0) {
    facts.push({
      claim: `${entityName} has been publicly backed by ${backedBy
        .map((b) => b.fund)
        .join(", ")} (funds in our tracked corpus that disclosed this investment).`,
      sourceUrl: company ? `${SITE}/signal/${company.slug}` : SITE,
      sourceLabel: "Public funding announcements (both-sides-disclosed threshold)",
    });
    for (const b of backedBy) links.push({ label: `${b.fund} deal-flow context →`, url: b.fundUrl });
  } else if (company) {
    notes.push(
      `No fund in our tracked corpus is documented as a public backer of ${entityName}. This means "not in our corpus," not "unfunded", see the company's own funding page for the full cap table.`,
    );
  }

  if (signal) {
    facts.push({
      claim: `${entityName}'s published engineering-acceleration momentum is "${signal.momentum}" in the ${signal.sector} sector (${signal.stage} stage). ${signal.summary}`,
      sourceUrl: signal.signalUrl,
      sourceLabel: "VC Deal Flow Signal, published signal summary",
    });
    links.push({ label: `${entityName} signal report →`, url: signal.signalUrl });
    links.push({ label: `Recompute ${entityName} live →`, url: signal.liveVerifyUrl });
    notes.push(
      `The momentum label above is the published v1 summary, not a live recompute. Use the "recompute live" link to run ${entityName} through the signal model against current public GitHub data.`,
    );
  }

  if (acquiredBy.length === 0 && !company && !acquirer) {
    notes.push(
      `"${cleaned}" is not in our tracked corpus (companies we publish a /signal page for, acquirers we map M&A patterns for, or companies named in a documented public acquisition). We do not have a grounded answer and will not guess one.`,
    );
  }

  const found = acquiredBy.length > 0 || acquisitionsMade.length > 0 || backedBy.length > 0 || Boolean(signal);

  return {
    entity: entityName,
    entitySlug,
    found,
    acquiredBy,
    acquisitionsMade,
    backedBy,
    signal,
    links,
    facts,
    notes,
  };
}

/** Schema.org-flavored, citation-ready envelope for the JSON endpoint. */
export function dossierEnvelope(d: DiligenceDossier, query: string, asOf: string) {
  return {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `Diligence dossier, ${d.entity}`,
    description: `Public-source diligence facts for ${d.entity}: M&A history, disclosed investors, and published engineering-acceleration signal.`,
    url: d.entitySlug ? `${SITE}/diligence#${d.entitySlug}` : `${SITE}/diligence`,
    license: "https://creativecommons.org/licenses/by/4.0/",
    isPartOf: { "@type": "WebSite", "@id": `${SITE}/#website`, url: SITE },
    dossier: {
      entity: d.entity,
      found: d.found,
      acquiredBy: d.acquiredBy,
      acquisitionsMade: d.acquisitionsMade,
      backedBy: d.backedBy,
      signal: d.signal,
      links: d.links,
      notes: d.notes,
    },
    citation: d.facts.map((f) => ({
      "@type": "CreativeWork",
      text: f.claim,
      url: f.sourceUrl,
      name: f.sourceLabel,
    })),
    _meta: {
      query,
      asOf,
      matched: d.found,
      attribution:
        "VC Deal Flow Signal (GitDealFlow), https://signals.gitdealflow.com",
      methodology: "https://ssrn.com/abstract=6606558",
      sourceThreshold:
        "M&A and investor facts: public press release / SEC filing / both-sides-disclosed only. Signal: published v1 summary, recompute live via /predict.",
      relatedEndpoints: {
        humanPage: `${SITE}/diligence`,
        directAnswer: `${SITE}/api/answer?q={question}`,
        mcp: `${SITE}/api/mcp/rpc`,
        agentTool: `${SITE}/api/agent/tools`,
      },
    },
  };
}
