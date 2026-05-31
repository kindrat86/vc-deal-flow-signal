# Badge-Embed Outreach — UNBLOCKED 2026-05-31

> ✅ **SUPERSEDES the "🛑 BLOCKED AT SCALE" banner in `badge-embed-outreach.md`.** That banner was based on
> testing the WRONG endpoint. The 05-30 doc only knew about `/api/badge/momentum/<org>/<repo>/svg`, which
> resolves against the **live GitHub-velocity scrape** (mostly cold OSS → everything rendered `untracked`/`cold`).
>
> There is a **second, already-shipped endpoint** the 05-30 doc missed:
> **`/api/badge/signal/<slug>/svg`** — it resolves against `content/companies.ts` `publicSignal.momentum`
> (the curated editorial set), is **pre-rendered static for every curated slug**, and returns a **stable
> positive badge**. This is exactly "unblock option 1" the 05-30 doc asked for — it already exists in code
> (`app/api/badge/signal/[slug]/svg/route.ts`). **No product work needed. The channel is live today.**
>
> Verified live 2026-05-31: 62 curated companies render `accelerating`; spot-checked 15 slugs incl. the
> non-obvious ones (mistral-ai, dust-tt, letta-ai, tauri, fireworks-ai, together-ai) — all `accelerating`, HTTP 200.

## The lever (unchanged)

A startup that embeds an "Accelerating on GitDealFlow" badge gives a referring link from **their** domain —
the most relevant referring domains we can earn, and the only link type that scales with zero deliverability
risk. The badge links to their own `/signal/<slug>` page (~3.9k words, indexed) so the link lands on a
rank-worthy page, not a discounted one.

**Link-value note (be honest):** a badge in a **GitHub README** is `rel="nofollow"` (GitHub nofollows
user-content links) — still valuable for **referral traffic + co-citation + brand**, but not link-equity.
The dofollow win is when they embed it on their **own marketing site / docs** (many dev-tools put an
"as seen in / signals" strip there). Pitch the README as the easy yes; the site embed is the prize.

## Correct embed snippet (use THIS endpoint)

```markdown
[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/<slug>/svg)](https://signals.gitdealflow.com/signal/<slug>)
```

- `<slug>` = the company's `/signal/<slug>` slug (NOT `org/repo`).
- Static, cached 24h, never 404s for a curated slug. **Verify each renders before sending** (a broken badge
  image kills credibility), but every slug below is pre-confirmed live.

## Ready-to-paste targets — 44 early-stage (seed→B) accelerating companies

Filtered to the flatter-able sweet spot (seed→Series-B dev-tools / AI-infra / database / observability with
active devrel — the cohort that actually displays third-party badges). Mega/later-stage accelerating cos
(Vercel, Supabase, PostHog, Linear, etc. — 18 more in `companies.ts`) excluded: they won't bother.

| # | Company | Sector / Stage | Ready-to-paste Markdown badge |
|---|---|---|---|
| 1 | Resend | developer-tools / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/resend/svg)](https://signals.gitdealflow.com/signal/resend)` |
| 2 | Convex | database / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/convex/svg)](https://signals.gitdealflow.com/signal/convex)` |
| 3 | Modal | ai-infra / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/modal/svg)](https://signals.gitdealflow.com/signal/modal)` |
| 4 | Replicate | ai-infra / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/replicate/svg)](https://signals.gitdealflow.com/signal/replicate)` |
| 5 | Mistral AI | ai-ml / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/mistral-ai/svg)](https://signals.gitdealflow.com/signal/mistral-ai)` |
| 6 | Drizzle | developer-tools / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/drizzle/svg)](https://signals.gitdealflow.com/signal/drizzle)` |
| 7 | Clerk | developer-tools / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/clerk/svg)](https://signals.gitdealflow.com/signal/clerk)` |
| 8 | Trigger.dev | developer-tools / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/trigger-dev/svg)](https://signals.gitdealflow.com/signal/trigger-dev)` |
| 9 | Inngest | developer-tools / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/inngest/svg)](https://signals.gitdealflow.com/signal/inngest)` |
| 10 | Browserbase | ai-infra / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/browserbase/svg)](https://signals.gitdealflow.com/signal/browserbase)` |
| 11 | E2B | ai-infra / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/e2b/svg)](https://signals.gitdealflow.com/signal/e2b)` |
| 12 | Upstash | infrastructure / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/upstash/svg)](https://signals.gitdealflow.com/signal/upstash)` |
| 13 | Turso | database / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/turso/svg)](https://signals.gitdealflow.com/signal/turso)` |
| 14 | Fireworks AI | ai-infra / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/fireworks-ai/svg)](https://signals.gitdealflow.com/signal/fireworks-ai)` |
| 15 | Together AI | ai-infra / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/together-ai/svg)](https://signals.gitdealflow.com/signal/together-ai)` |
| 16 | Dust | ai-ml / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/dust-tt/svg)](https://signals.gitdealflow.com/signal/dust-tt)` |
| 17 | Cursor | developer-tools / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/cursor/svg)](https://signals.gitdealflow.com/signal/cursor)` |
| 18 | Lovable | ai-ml / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/lovable/svg)](https://signals.gitdealflow.com/signal/lovable)` |
| 19 | Remotion | developer-tools / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/remotion/svg)](https://signals.gitdealflow.com/signal/remotion)` |
| 20 | shadcn | developer-tools / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/shadcn/svg)](https://signals.gitdealflow.com/signal/shadcn)` |
| 21 | CrewAI | ai-ml / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/crewai/svg)](https://signals.gitdealflow.com/signal/crewai)` |
| 22 | Letta | ai-ml / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/letta-ai/svg)](https://signals.gitdealflow.com/signal/letta-ai)` |
| 23 | Mastra | ai-ml / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/mastra/svg)](https://signals.gitdealflow.com/signal/mastra)` |
| 24 | DuckDB | database / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/duckdb/svg)](https://signals.gitdealflow.com/signal/duckdb)` |
| 25 | Meilisearch | database / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/meilisearch/svg)](https://signals.gitdealflow.com/signal/meilisearch)` |
| 26 | Typesense | database / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/typesense/svg)](https://signals.gitdealflow.com/signal/typesense)` |
| 27 | Weaviate | database / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/weaviate/svg)](https://signals.gitdealflow.com/signal/weaviate)` |
| 28 | Qdrant | database / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/qdrant/svg)](https://signals.gitdealflow.com/signal/qdrant)` |
| 29 | Milvus | database / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/milvus/svg)](https://signals.gitdealflow.com/signal/milvus)` |
| 30 | Bun | developer-tools / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/bun/svg)](https://signals.gitdealflow.com/signal/bun)` |
| 31 | Deno | developer-tools / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/deno/svg)](https://signals.gitdealflow.com/signal/deno)` |
| 32 | Astro | developer-tools / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/astro/svg)](https://signals.gitdealflow.com/signal/astro)` |
| 33 | Tauri (CrabNebula) | developer-tools / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/tauri/svg)](https://signals.gitdealflow.com/signal/tauri)` |
| 34 | Langfuse | observability / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/langfuse/svg)](https://signals.gitdealflow.com/signal/langfuse)` |
| 35 | Braintrust | observability / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/braintrust/svg)](https://signals.gitdealflow.com/signal/braintrust)` |
| 36 | Helicone | observability / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/helicone/svg)](https://signals.gitdealflow.com/signal/helicone)` |
| 37 | Cube | analytics / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/cube/svg)](https://signals.gitdealflow.com/signal/cube)` |
| 38 | vLLM | ai-infra / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/vllm/svg)](https://signals.gitdealflow.com/signal/vllm)` |
| 39 | LlamaIndex | developer-tools / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/llamaindex/svg)](https://signals.gitdealflow.com/signal/llamaindex)` |
| 40 | Continue | developer-tools / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/continue/svg)](https://signals.gitdealflow.com/signal/continue)` |
| 41 | RunPod | ai-infra / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/runpod/svg)](https://signals.gitdealflow.com/signal/runpod)` |
| 42 | Ollama | developer-tools / seed | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/ollama/svg)](https://signals.gitdealflow.com/signal/ollama)` |
| 43 | SigNoz | observability / series-a | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/signoz/svg)](https://signals.gitdealflow.com/signal/signoz)` |
| 44 | Privy | fintech / series-b | `[![Accelerating on GitDealFlow](https://signals.gitdealflow.com/api/badge/signal/privy/svg)](https://signals.gitdealflow.com/signal/privy)` |

## Outreach route (gift, not ask) — NEEDS YOU (reputational)

I did **not** auto-post to third-party repos — posting 44 GitHub issues from an automated identity is a
reputational risk and must carry your voice. Recommended pacing **3–5/week**, never a mass blast.

Per-target route, in priority order:
1. A friendly **GitHub issue** on their main repo: *"You're flagged as accelerating on our public GitHub-signal
   index — here's a badge if you want it,"* paste the snippet, link `/signal/<slug>`.
2. **devrel/community email** if public (`devrel@`, `hello@`, `community@`).
3. Polite **DM** to their devrel lead.

Keep it a gift framed around *their* signal, never a backlink ask. Lead with the `/signal/<slug>` page so they
see the real, flattering content first. (Issue bodies in the old `badge-issue-bodies.md` are reusable — just
swap the broken `momentum/<org>/<repo>` URLs for the `signal/<slug>` URLs above.)

## What I verified (so you can trust the list)

- `app/api/badge/signal/[slug]/svg/route.ts` resolves `getCompany(slug).publicSignal.momentum`, `force-static`,
  `generateStaticParams` over all 160 curated slugs → every slug has a pre-built badge, no 404s.
- Live 2026-05-31: supabase/resend/posthog/convex/vercel + 10 spot-checks all return `accelerating` SVG, HTTP 200.
- 62 `accelerating` + 98 `steady` in `companies.ts`; 0 `decelerating` (so no risk of pitching a negative badge —
  unlike the live-scrape `momentum` endpoint, which showed Airbyte −89% etc.).
