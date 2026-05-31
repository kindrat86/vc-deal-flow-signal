# GitDealFlow — live response playbook

Purpose: handle real replies fast without improvising, overexplaining, or sending too many links.

Rule:
- one reply
- one next page
- one clean sentence

If the response is high-value, respond the same day.
If the response is vague, do not force a follow-up.
If the response is hostile, do not try to convert them.

## The 15-second triage

When a reply comes in, classify it immediately:
- methodology
- proof
- workflow
- difference-vs-crunchbase
- tool-choice
- sample-output
- agent-integration
- what-is-this
- positive-signal
- neutral
- negative
- intro-offered
- mention-detected

Then do only one thing:
- send one exact page
or
- consciously do nothing

## Reply templates by response type

### asked-for-methodology
What they mean:
- “Show me how this is computed.”

Reply:
The cleanest methodology page is here: https://signals.gitdealflow.com/methodology

Send:
- `/methodology`

Do not also send:
- `/research`
- `/answers`
- homepage
unless they ask again later

### asked-for-proof
What they mean:
- “Show me that this signal actually preceded something real.”

Reply:
The proof page is here — real cases where the signal showed up before the public round: https://signals.gitdealflow.com/from-stars-to-seed

Send:
- `/from-stars-to-seed`

### asked-for-workflow
What they mean:
- “How would an investor actually use this?”

Reply:
This is the cleanest workflow page by investor persona: https://signals.gitdealflow.com/use-cases

Send:
- `/use-cases`

If they asked specifically about angels:
- `/answers/how-angel-investors-use-github-signals`

### asked-for-difference-vs-crunchbase
What they mean:
- “How is this different from the default database workflow?”

Reply:
This is the sharpest timing-vs-verification comparison: https://signals.gitdealflow.com/compare/crunchbase-alternative-for-angel-investors

Send:
- `/compare/crunchbase-alternative-for-angel-investors`

If they want the conceptual distinction next:
- `/answers/deal-flow-timing-vs-verification`

### asked-for-tool-choice
What they mean:
- “What should I actually use?”

Reply:
If the question is buyer-side choice, this is the shortest evaluation page: https://signals.gitdealflow.com/buyers-guide

Send:
- `/buyers-guide`

If they need a direct stack comparison next:
- `/compare/best-deal-flow-tools-angel-investors`

### asked-for-sample-output
What they mean:
- “Show me what this actually returns.”

Reply:
Fastest sample-output page depends on what they mean. If they want the public watchlist shape, start here: https://gitdealflow.com/report

Send:
- `https://gitdealflow.com/report`

If they need a score or self-check instead:
- `https://gitdealflow.com/report`
- `/receipts`

### asked-for-agent-integration
What they mean:
- “Can I use this in Claude / Cursor / MCP?”

Reply:
Best short integration page is here: https://signals.gitdealflow.com/integrations/best-mcp-server-for-vc-research

Send:
- `/integrations/best-mcp-server-for-vc-research`

If they ask install next:
- `/install`

If they ask tool details next:
- `/developers`

### asked-what-is-this
What they mean:
- first page did not do enough explanatory work

Reply:
If you want the shortest explanation of the claim, start here: https://signals.gitdealflow.com/answers/what-is-startup-engineering-momentum

Send:
- `/answers/what-is-startup-engineering-momentum`

### positive-signal
What they mean:
- curiosity is real, but not yet specific

Reply:
Usually send the strongest next page for the context.

Default next-page order:
- if they came from /research -> /from-stars-to-seed
- if they came from /compare -> /answers/deal-flow-timing-vs-verification
- if they came from /weekly/top-100 -> /research
- if they came from /from-stars-to-seed -> /buyers-guide

### neutral
What they mean:
- acknowledgment without real curiosity

Reply:
Do not force a follow-up.

Action:
- log it
- move on

### negative
What they mean:
- mismatch or skepticism

Reply:
Only reply if the objection is precise and useful.

If precise:
- send one proof or methodology page only

If vague / hostile:
- no follow-up

### intro-offered
What they mean:
- strongest real-world signal

Reply:
Thanks — happy to share the cleanest page for that context. This is the best starting point: [one page only]

Then choose page by introduced context.

### mention-detected
What they mean:
- the product or page surfaced without direct prompting

Action:
- respond fast if relevant
- one page only
- log immediately

## High-value target rule

If the response is from:
- Gergely Orosz
- Hunter Walk
- Peter Walker
- swyx / Latent Space
- modelcontextprotocol
- Console.dev / Devtools.fyi

Then:
- reply same day if possible
- log immediately
- use one exact page only
- do not celebrate
- do not send a menu

## What not to do

- do not send homepage in follow-up
- do not send two pages “just in case”
- do not explain the whole product again
- do not switch the context yourself
- do not answer a proof question with workflow
- do not answer a workflow question with methodology unless requested

## Logging instruction

After every real reply, update:
- `docs/distribution-scoreboard.csv`
- `docs/distribution-scoreboard-2026-05-26.csv` when using the newer active board

Fill:
- result
- follow_up_page
- next_move
- notes
- response_type

## Escalation rule

If the same response type shows up 3+ times in one week:
- patch the page that should answer it next

Example:
- 3 methodology asks -> patch `/methodology`
- 3 proof asks -> patch `/from-stars-to-seed`
- 3 sample-output asks -> patch `/receipts`
- 3 difference-vs-crunchbase asks -> patch `/compare/crunchbase-alternative-for-angel-investors`

## Default fast paths

- research -> methodology or proof
- compare -> timing-vs-verification
- weekly-top-100 -> research or receipts
- proof -> buyers-guide or compare
- answers -> buyers-guide, methodology, or receipts

## Command

Reply fast.
Reply once.
Route cleanly.
Patch only from repeated evidence.
