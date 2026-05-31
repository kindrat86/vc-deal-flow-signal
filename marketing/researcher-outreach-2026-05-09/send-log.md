# Send log — researcher outreach 2026-05-09

All sends via Resend API from `signal@gitdealflow.com` (Mailreach score 98).
Cap: ≤2/day per warmup discipline.

## Sent — Day 0 (2026-05-09)

| # | Recipient | Email | Resend ID | Sent at | Status |
|---|---|---|---|---|---|
| 1 | Frank Nagle (HBS) | frank@hbs.edu | `1da27659-8884-4e9c-a71e-42a2725b1aba` | 2026-05-09 ~14:33 UTC | sent |
| 2 | Annamaria Conti (IE) | annamaria.conti@ie.edu | `7e58fc41-f5fb-4042-a89d-8858612d2060` | 2026-05-09 ~14:34 UTC | sent |

## Scheduled

| # | Recipient | Email | Resend ID | Scheduled for | Status |
|---|---|---|---|---|---|
| 3 | Johannes Wachs (Corvinus) | johannes.wachs@uni-corvinus.hu | `68c4adde-6a18-4bb3-9556-7040ff6940d9` | 2026-05-10 14:34 UTC | scheduled |
| 4 | Jermain Kaminski (Maastricht) | j.kaminski@maastrichtuniversity.nl | `47fd9263-984f-4db9-9675-93bcbf1cc410` | 2026-05-11 14:34 UTC | scheduled |

## How to cancel a scheduled send (Resend API)

```bash
set -a && source email-api/.env && set +a
curl -X DELETE "https://api.resend.com/emails/<RESEND_ID>" \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

## How to check delivery status

```bash
curl "https://api.resend.com/emails/<RESEND_ID>" \
  -H "Authorization: Bearer $RESEND_API_KEY"
```

Status values: `delivered`, `delivered_late`, `bounced`, `complained`, `failed`, `scheduled`, `queued`.

## Halt protocol

If any of the first 2 sends produces a hostile reply, hard bounce, or spam complaint:

1. Cancel both scheduled sends (IDs above).
2. Pause campaign for review.
3. Reply to the complainer with apology, do not re-engage.
4. Update `memory/feedback_*` with the incident.

## Reply triage

Replies will land at `signal@gitdealflow.com` (the From + Reply-To). Monitor Resend inbox / Zoho mail for that address for the next 2 weeks.

| Reply type | Response |
|---|---|
| Generic positive ("thanks, will take a look") | Acknowledge briefly. Don't push for more. |
| Methodological question | Answer factually. Link to relevant section of the SSRN paper. |
| Citation interest | Share BibTeX from `signals.gitdealflow.com/research/citations.bib` (the only project URL appropriate to share). |
| Hostile / spam complaint | Apologize once. Cancel remaining scheduled sends. Log incident. |
| No reply within 30 days | No follow-up. Move on. |

## Calendar

- **2026-05-09 PM** — Sends 1 + 2 fired.
- **2026-05-10 14:34 UTC** — Send 3 fires.
- **2026-05-11 14:34 UTC** — Send 4 fires.
- **2026-05-23** — 2-week reply window check. Note who responded, who didn't.
- **2026-06-09** — 1-month check. Per `corroborating-sources-accumulation-plan.md`.
- **2026-08-07** — 90-day cool-down on Wikipedia account complete (gate 3).
- **2026-08-01 → 2027-Q1** — re-evaluation horizon for the Wikipedia bundle.
