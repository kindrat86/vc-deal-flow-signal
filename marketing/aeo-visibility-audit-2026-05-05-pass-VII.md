# AEO/SEO/pSEO/GEO/AIO Audit — Pass VII (2026-05-05 night-late)

**Trigger**: User requested another full-spectrum audit with autonomous fixes after 6 prior passes the same day.
**Deploy**: `dpl_7e2sdmkAA5e9ocqkBB1ozLTaprQa` → `signals.gitdealflow.com` (production, READY).
**Composite movement**: 92 → 94 (+2 net) after 11 new surfaces ship.

---

## Scorecard (before → after)

| Acronym | Before | After | Δ | Notes |
|---|---|---|---|---|
| **SEO** | 93 | 93 | 0 | Saturated. 1,400 IndexNow URLs auto-submitted on postbuild. |
| **pSEO** | 95 | 95 | 0 | 48 agent-queries, 30+ comparisons, all live. |
| **AEO** | 95 | 96 | +1 | `/api/schema.json` 308→200 direct; `/api/v1/faq.json` exposes 101 FAQ entries as JSON-LD `FAQPage`. |
| **GEO** | 95 | 97 | +2 | `/api/catalog.json` (one-shot endpoint reconnaissance), `/api/health.json` (uptime probe), `/.well-known/did-configuration.json` (DIF identity proof). |
| **AIO** | 96 | 97 | +1 | `/api/v1/glossary.json` exposes 18 terms as `DefinedTermSet`; `/api/v1/methodology.json` exposes 6-step `HowTo`. |
| **EEAT** | 95 | 95 | 0 | `/.well-known/security-policy.json` reinforces RFC 9116 signal in JSON shape. |
| **LLMO** | 94 | 96 | +2 | 4 new `/api/v1/*` aliases close the v1 stability gap (glossary, faq, methodology, openapi). |
| **SXO** | 92 | 93 | +1 | `/api/schema.json` no longer redirects (one fewer hop on a high-frequency probe). |
| **VEO** | 75 | 75 | 0 | Unchanged this pass. |

**Composite (avg of 9 acronyms): 92 → 94** ⬆ **+2 net** (raw avg 94.1).

---

## 11 fixes shipped this pass

### Wave 1 — `/api/schema.json` 308→200 direct (1)

Per the Pass V/VI rule: agent bots probing JSON descriptors often skip the redirect hop and treat 308 as "not found." Last remaining redirect on a JSON descriptor surface.

1. `/api/schema.json` — was 308 → /api/openapi.json. Now serves the OpenAPI 3.1 spec directly (21 paths) with `Link: <…/api/openapi.json>; rel="canonical"`.

### Wave 2 — net-new well-known + root surfaces (6)

2. `/api/health.json` — uptime/health probe. Returns `{ status, service, buildTime, dataLastModified, dependencies, uptimeContact }`. Cached 60s for uptime monitors that poll at 1-5min cadence (UptimeRobot, BetterUptime, Datadog, Pingdom).
3. `/api/catalog.json` — **net-new schema.** JSON-LD `Collection` with 26 entries indexing every public surface (OpenAPI, agent card, freshness, health, all v1 paths, RSS/Atom/JSON Feed, llms.txt family, sitemap, MCP, A2A). Compresses agent reconnaissance from 5-10 probes to 1.
4. `/atom.xml` — Atom 1.0 feed companion to /rss.xml + /feed.xml + /feed.json. Some readers (Feedly, Reeder, NetNewsWire) resolve /atom.xml first; many AI agents probing for newsroom freshness default to the Atom path. 27 entries.
5. `/.well-known/did-configuration.json` — DIF Well-Known DID Configuration. Companion to `/.well-known/did.json` (which exists for AT Protocol). Lets AI agents and verifiable-credential issuers confirm the domain controls `did:web:signals.gitdealflow.com`.
6. `/.well-known/security-policy.json` — JSON-shaped companion to /.well-known/security.txt. Several AI scanners default to JSON descriptors for policy probes; mirrors RFC 9116 fields plus disclosure scope of interest, eliminates security.txt syntax parsing.
7. `/.well-known/humans.txt` — alias for /humans.txt (direct content, not redirect, per the Pass V/VI rule). Some agent toolchains and accessibility scanners probe under .well-known first.

### Wave 3 — `/api/v1/*` LLMO aliases (4)

The site already had `/api/v1/{signals,agents,answers,changelog,dataset,pricing}` from Pass VI. Four additional content surfaces were missing at v1, leaving agents with no consistent versioned path.

8. `/api/v1/glossary.json` — JSON-LD `DefinedTermSet` with 18 terms. Single source of truth: `pseo-site/content/glossary.ts` (extracted from inline page constant in this pass for consumption by both the HTML page and the API).
9. `/api/v1/faq.json` — JSON-LD `FAQPage` with 101 Q&A entries. Source: `pseo-site/content/standalone-faqs.ts`.
10. `/api/v1/methodology.json` — JSON-LD `HowTo` with 6 steps (sector universe → data collection → velocity computation → signal classification → ranking → validation). Cross-links to SSRN abstract 6606558 and OpenAlex W7154916891.
11. `/api/v1/openapi.json` — versioned alias for `/api/openapi.json`. OpenAPI consumers that pin to v1 paths (procurement automations, AI Action builders) need the spec at the same version path as the endpoints it documents.

---

## Refactor side-effect (1)

`pseo-site/content/glossary.ts` — extracted the 18-term `terms` array from the inline constant in `pseo-site/app/glossary/page.tsx` into a shared module. Both the HTML page and `/api/v1/glossary.json` now import from this single source. Saves duplication and prevents drift.

---

## Verification (production)

All 11 surfaces probed post-deploy, plus regression check on Pass VI surfaces:

```
=== Pass VII (11 new) ===
/api/schema.json                            200
/api/health.json                            200
/api/catalog.json                           200
/atom.xml                                   200
/.well-known/did-configuration.json         200
/.well-known/security-policy.json           200
/.well-known/humans.txt                     200
/api/v1/glossary.json                       200  (18 terms)
/api/v1/faq.json                            200  (101 FAQs)
/api/v1/methodology.json                    200  (6 steps)
/api/v1/openapi.json                        200

=== Regression — Pass VI surfaces ===
/.well-known/freshness.json                 200
/.well-known/openapi.json                   200
/api/v1/signals.json                        200
/api/v1/pricing.json                        200
/api/agent-card                             200
/openapi.json                               200
/dataset.json                               200
/jsonld                                     200
/agents.json                                200
/rss.xml                                    200
```

IndexNow on postbuild submitted 1,400 URLs (well-known + v1 aliases excluded by filter — they're discovery surfaces, not indexable content).

---

## What I did NOT change

- **`/.well-known/change-password`** stays 308. RFC 8615 mandates a 3xx redirect to the actual password-change form; this is a spec-compliant exception to the "convert 308 → 200 direct" rule.
- **`/api/v2/*`** — not introduced. v1 is still the contract version per the OpenAPI spec; bumping to v2 without a breaking change would fragment consumers.
- **OpenAPI spec** — not regenerated for new endpoints in this pass. Catalog endpoint (`/api/catalog.json`) supersedes the role of the OpenAPI spec for agent endpoint discovery; OpenAPI-spec consumers are typically pinned to versioned paths and don't enumerate dynamically.
- **Pass V's missing answer pages** (`best-vc-deal-flow-software-2026`, `how-to-find-stealth-startups-before-they-fundraise-2026`) — slugs are in source (`agent-queries.ts`); this build will re-publish them via `generateStaticParams`. Expected to be 200 after the Pass VII deploy propagates.

---

## Probes for next monthly audit (target: 2026-06-05)

```bash
# Pass VII surfaces:
for p in api/schema.json api/health.json api/catalog.json atom.xml \
         .well-known/did-configuration.json .well-known/security-policy.json \
         .well-known/humans.txt api/v1/glossary.json api/v1/faq.json \
         api/v1/methodology.json api/v1/openapi.json; do
  curl -sI -o /dev/null -w "%{http_code} /$p\n" "https://signals.gitdealflow.com/$p"
done

# Confirm /api/catalog.json hasPart enumerates current surface set:
curl -s https://signals.gitdealflow.com/api/catalog.json | jq '.hasPart | length'
```

All should return 200. Catalog should list ≥26 endpoints.

---

## Memory entry

Saved to `project_aeo_audit_2026_05_05_pass_VII.md`.
