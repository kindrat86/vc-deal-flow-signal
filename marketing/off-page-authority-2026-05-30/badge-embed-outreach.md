# Badge-Embed Outreach — 2026-05-30

> 🛑 **BLOCKED AT SCALE — verified 2026-05-30. Do not mass-pitch the 24 below yet.** Live-testing every target
> against `/api/badge/momentum/<org>/<repo>/svg` revealed a product/data gap: the badge resolves against the
> **live sector signal scrape** (`getAllSectors()`), **not** `companies.ts`. Result:
> - **All 24 editorial picks below render `momentum: untracked`** — they're not in the live signal set.
> - The live tracked set is **mostly OSS** (KDE, Nextcloud, Monero, MDN…). Of the ~dozen venture-backed orgs in
>   it, **most are currently `cold` (negative)** — Airbyte −89%, ClickHouse −60%, langchain −5%. Pitching a
>   company a negative badge is actively harmful.
> - Tiers: `cold <−30 · warming −30..+49 · hot +50..+199 · breakout ≥200`. **No venture-backed org is currently
>   `hot`/`breakout`.** Data is volatile (Airbyte was +866% in the w19 snapshot, −89% live).
>
> **Only 6 orgs currently render a positive badge** (all merely "warming", all could flip cold next week):
> goAuthentik +28% · ProjectDiscovery +17% · Dagster +13% · PostHog +12% · Saleor +6% · Infisical +5%.
>
> **Two ways to unlock the real play (product work, your call):**
> 1. Make `/api/badge/momentum` (or a new `/api/badge/signal/<slug>`) resolve against `companies.ts`
>    `publicSignal.momentum` so the 66 curated "accelerating" companies get a real badge. Then this list works.
> 2. Until then, **only** offer badges to orgs live-verified `hot`/`breakout` that day — a tiny, volatile set.
>
> **Recommendation:** don't run badge outreach this week. Redirect effort to the genuinely-open levers —
> resource-page curators (confirmed fresh) + dataset distribution. Revisit badges after fix (1). The original
> 24-company plan below is retained for when the data binding is fixed.

---

**The lever:** every startup that embeds an "Accelerating on GitDealFlow" badge in their README / site gives a
**dofollow backlink from *their* domain** — the highest-quality, most-relevant referring domains we can earn,
and the only link type that scales without deliverability risk. README badges are native culture for dev-tools/
AI-infra companies (they already display Discord, npm, build-status badges).

**Source:** ranked from the 66 `publicSignal.momentum === "accelerating"` companies in
`pseo-site/content/companies.ts`. Filtered to the **flatter-able sweet spot**: seed → Series B dev-tools / AI-infra
/ database / observability with active devrel. Excluded mega/public/late-stage (Cloudflare, Anthropic, CoreWeave,
Vercel, Hugging Face, Sourcegraph, Grafana, Runway) — they won't bother displaying a third-party badge.

**No contact emails in `companies.ts`** — route is, in priority order: (1) a friendly GitHub issue/PR offering the
badge, (2) devrel/community email if public (`devrel@`, `hello@`, `community@`), (3) a polite DM to their devrel
lead. Keep it a *gift*, not an ask: "you're flagged as accelerating — here's a badge if you want it."

## Embed snippet to give them

**Verified live route** (2026-05-30): `/api/badge/momentum/<org>/<repo>/svg` — needs **org AND the flagship
repo**, returns `image/svg+xml` 200. (The bare `/api/badge/<org>` form does **not** exist — 404.)

```markdown
[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/momentum/<org>/<repo>/svg)](https://signals.gitdealflow.com/signal/<slug>)
```

Confirmed-working examples:
- Drizzle → `/api/badge/momentum/drizzle-team/drizzle-orm/svg` → `/signal/drizzle`
- Ollama → `/api/badge/momentum/ollama/ollama/svg` → `/signal/ollama`

The badge links back to their own `/signal/<slug>` page (unique, ~3.9k words, indexed) → the backlink lands on a
page that can rank, not a discounted one. Fill `<repo>` with each company's flagship public repo (verify each
renders before sending — a broken badge image kills credibility instantly). There's also a self-serve
**Badge Builder** at `/badge-builder` and a generic **"Built with"** badge at `/api/badge/built-with/svg`.

## Ranked targets (Tier 1 — highest embed-likelihood)

| # | Company | Sector | Stage | GitHub org | Why likely to embed |
|---|---|---|---|---|---|
| 1 | Drizzle | developer-tools | seed | drizzle-team | badge-heavy README culture, scrappy, loves social proof |
| 2 | shadcn/ui | developer-tools | seed | shadcn-ui | community-first, viral, displays everything |
| 3 | Trigger.dev | developer-tools | series-a | triggerdotdev | active devrel, OSS-forward |
| 4 | Inngest | developer-tools | series-a | inngest | devrel-led growth, README badges |
| 5 | E2B | ai-infra | seed | e2b-dev | early, hungry for credibility signals |
| 6 | Browserbase | ai-infra | series-a | browserbase | agent-infra, our exact AEO audience |
| 7 | Turso | database | series-a | tursodatabase | OSS DB, badge culture |
| 8 | Continue | developer-tools | seed | continuedev | OSS dev-tool, community-driven |
| 9 | Ollama | developer-tools | seed | ollama | huge OSS community, loves badges |
| 10 | Langfuse | observability | seed | langfuse | LLM-observability, our content cluster |
| 11 | Helicone | observability | seed | Helicone | OSS-first, early |
| 12 | SigNoz | observability | series-a | SigNoz | OSS observability, badge-heavy |
| 13 | Mastra | ai-ml | seed | mastra-ai | new agent framework, needs proof |
| 14 | Letta | ai-ml | seed | letta-ai | agent-memory, early, citation-hungry |
| 15 | CrewAI | ai-ml | seed | crewAIInc | viral OSS agent framework |
| 16 | Typesense | database | seed | typesense | OSS search, badge culture |
| 17 | DuckDB | database | seed | duckdb | beloved OSS, displays adoption proof |
| 18 | Convex | database | series-b | get-convex | devrel-active, reactive-DB |
| 19 | Resend | developer-tools | series-a | resend | DX-obsessed, displays proof (and we send via them!) |
| 20 | Qdrant | database | series-a | qdrant | OSS vector DB, badge-heavy |
| 21 | Weaviate | database | series-b | weaviate | OSS vector DB, devrel-led |
| 22 | Pulumi | developer-tools | series-c | pulumi | OSS IaC, README badges |
| 23 | Bun | developer-tools | series-b | oven-sh | massive OSS community |
| 24 | Deno | developer-tools | series-b | denoland | OSS runtime, badge culture |

## Outreach template (GitHub issue / devrel email)

> **Subject / issue title:** [Company] is flagged "accelerating" on GitDealFlow — optional badge if you want it
>
> Hi [team],
>
> Quick, no-ask note: GitDealFlow tracks public GitHub engineering activity as an early signal for investors, and
> [Company] is currently flagged **accelerating** in [sector] on our open dataset (methodology: SSRN 6606558). We
> don't charge for placement and you're not affiliated — it's a read of your public activity.
>
> If it's useful as social proof, here's a badge you're welcome to drop in your README or site (it links to your
> own signal page):
>
> ```markdown
> [![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/momentum/[org]/[repo]/svg)](https://signals.gitdealflow.com/signal/[slug])
> ```
>
> Totally optional — just thought you'd want to know you're on it. Either way, congrats on the trajectory.
>
> — The Data Nerd, signals.gitdealflow.com

## Mechanics

- **Gift framing, never an ask** — this is what keeps it anonymity-safe and non-spammy.
- **One touch per company.** A badge offer is a one-shot; don't follow up more than once.
- **Track embeds:** monthly, `site:github.com "signals.gitdealflow.com/api/badge"` + GSC referring-domains to
  count which ones stuck.
- **Verify each badge renders** (`curl -I https://signals.gitdealflow.com/api/badge/momentum/<org>/<repo>/svg`
  → expect `200 image/svg+xml`) before sending — a broken badge image kills credibility instantly.
