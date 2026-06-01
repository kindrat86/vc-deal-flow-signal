# Telegram Bot — Setup

Ships the GitDealFlow Telegram bot: `/safe`, `/runway`, `/define <term>`, and 8 other commands plus inline glossary search.

Webhook handler lives at `pseo-site/app/api/telegram/route.ts`, dispatch logic at `pseo-site/lib/telegram/*`, and a one-shot setup script at `pseo-site/scripts/telegram-set-webhook.ts`.

## One-time setup (user-only steps)

### 1. Create the bot via @BotFather

1. Open Telegram → DM **@BotFather**.
2. Send `/newbot` → pick a display name (e.g. `VC Deal Flow Signal`) and a username ending in `bot` (e.g. `gitdealflow_bot`).
3. Copy the `HTTP API` token BotFather replies with — that's `TELEGRAM_BOT_TOKEN`.
4. **Enable inline mode** (powers `@yourbot <query>` in any chat):
   - Send `/setinline` to BotFather → pick the bot → set placeholder text e.g. `Search VC terms…`.
5. Optional polish:
   - `/setdescription` → "Free VC + founder calculators and a full VC glossary."
   - `/setabouttext` → "Built by gitdealflow.com — code-side sourcing signals."
   - `/setuserpic` → upload a 512×512 logo.

### 2. Generate the webhook secret

```sh
node -e "console.log(require('crypto').randomBytes(24).toString('hex'))"
```

Copy that string — that's `TELEGRAM_WEBHOOK_SECRET`. Anything 16+ chars works.

### 3. Add env vars to Vercel

Project: `pseo-site`. From the repo root:

```sh
cd pseo-site
echo "<token>" | vercel env add TELEGRAM_BOT_TOKEN production
echo "<secret>" | vercel env add TELEGRAM_WEBHOOK_SECRET production
# also add to preview if you want to test on PRs
echo "<token>"  | vercel env add TELEGRAM_BOT_TOKEN preview
echo "<secret>" | vercel env add TELEGRAM_WEBHOOK_SECRET preview
```

Trigger a redeploy so the new env vars take effect.

### 4. Register the webhook with Telegram

After the redeploy is live:

```sh
cd pseo-site
vercel env pull .env.local            # pull TELEGRAM_BOT_TOKEN + secret
npx tsx scripts/telegram-set-webhook.ts
```

The script POSTs `setWebhook` and `setMyCommands` to Telegram. Output should end with `✔ Done.`

To inspect the current webhook:

```sh
npx tsx scripts/telegram-set-webhook.ts --info
```

To re-target a preview deployment:

```sh
npx tsx scripts/telegram-set-webhook.ts --url https://pseo-site-<hash>.vercel.app/api/telegram
```

### 5. Verify

- DM the bot → `/start` → should reply with the command list.
- DM `/safe 50k 5m 20 15m 3m` → should reply with the SAFE conversion math.
- In any other chat (or the bot DM), type `@yourbot safe note` → should show a dropdown with the SAFE definition.

If something is off, hit `GET https://signals.gitdealflow.com/api/telegram` — it returns a JSON status with whether the env vars are present.

## Commands

| Command | What it does |
|---|---|
| `/start`, `/help` | Welcome + command list |
| `/tools` | Lists the 8 calculators with deep links |
| `/glossary` | Link to the full VC glossary |
| `/define <term>` | Inline glossary lookup |
| `/safe <amount> <cap> [discount%] [next_pre] [next_invest]` | SAFE conversion + dilution |
| `/runway <cash> <monthly_burn>` | Months of runway + cash-out month |
| `/burn <net_burn> <new_arr>` | Burn multiple + Sacca/Sammut grade |
| `/magic <new_arr_q> <sm_spend>` | Magic number + verdict |
| `/cac <cac> <gm%> <arpa>` | CAC payback months |
| `/ltv <arpa> <gm%> <churn%>` | Customer LTV |
| `/quick <gained_mrr> <lost_mrr>` | Quick ratio |
| `/dilution` | Deep-link to dilution-stack calculator (too many args for chat) |

All numeric args accept `5m`, `500k`, `1.5B`, `1,500,000` etc.

## Channel broadcasting — Signal of the Week (cron)

The bot posts the weekly **Signal of the Week** to the existing public
channel **`@gitdealflow`** (`https://t.me/gitdealflow`). This is a Vercel
Cron job — server-side, no laptop required:

- **Route:** `pseo-site/app/api/cron/telegram-signal/route.ts`
- **Builder:** `pseo-site/lib/telegram/signal-of-the-week.ts` (renders the
  post from `getTopMoversThisWeek(1)` — the current #1 mover)
- **Schedule:** Mondays 13:00 UTC (`vercel.json` → `crons`)
- **Target:** `TELEGRAM_CHANNEL_ID` = `@gitdealflow`

> Historical note: earlier autonomous posts to `@gitdealflow` were sent by
> driving the **native Telegram desktop app** as the channel owner's account
> (see `marketing/daily-briefing-2026-04-19.md`). That path needed the desktop
> app running + physical clicks and was duplicate-prone. This cron replaces it
> with the bot token server-side — which is why the bot must be a channel
> admin (a bot can only post to a channel it administers).

### One-time setup

1. **Add the bot as a channel admin.** In Telegram, open `@gitdealflow` →
   *Manage Channel* → *Administrators* → *Add Admin* → search
   `@gitdealflow_bot` → enable **Post Messages** → save. (One-time, ~30s.)
2. **Set the env var** (project `pseo-site`):

   ```sh
   cd pseo-site
   echo "@gitdealflow" | vercel env add TELEGRAM_CHANNEL_ID production
   ```

   `CRON_SECRET` and `TELEGRAM_BOT_TOKEN` are already set (the other crons and
   the webhook use them). Redeploy so the new env var takes effect — Vercel
   registers the cron from `vercel.json` automatically on deploy.

### Test surfaces

```sh
# 1. Render only — no auth, no send. Returns the post JSON.
curl "https://signals.gitdealflow.com/api/cron/telegram-signal?dry=1"

# 2. Live send to YOURSELF (DM the bot once first so it can message you),
#    overriding the channel. Requires the cron secret.
curl -H "Authorization: Bearer $CRON_SECRET" \
  "https://signals.gitdealflow.com/api/cron/telegram-signal?chat=<your_chat_id>"
```

The Monday cron posts to `TELEGRAM_CHANNEL_ID` automatically. If no startup
clears the 30-commit floor that week, the route returns
`{ mode: "skipped", reason: "no-mover" }` instead of posting an empty signal.

## Architecture notes

- **No external deps.** Raw `fetch` against `api.telegram.org`. `@modelcontextprotocol/sdk`-style minimalism.
- **`waitUntil` ack pattern.** The webhook returns 200 in ~10ms; the Telegram API call to `sendMessage`/`answerInlineQuery` completes after the response closes. Avoids Telegram's retry-on-slow-response duplicate sends.
- **Secret verification.** Every POST must include `X-Telegram-Bot-Api-Secret-Token` matching `TELEGRAM_WEBHOOK_SECRET`. Open relay closed.
- **Inline mode caches results 5 min.** Glossary is static, so non-personal cache is safe.
- **Calc math mirrors `pseo-site/components/*Calculator.tsx`.** When the web calcs change formulas, update `pseo-site/lib/telegram/calcs.ts` in the same PR.
