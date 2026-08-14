# GitDealFlow, follow-up routing map

Purpose: define the exact next page after a first-touch page lands.

Core rule:
- first touch earns curiosity
- follow-up earns trust or decision
- one follow-up page only

## First-touch -> second-step routes

### `/compare/crunchbase-alternative-for-angel-investors`
If they ask:
- what do you mean by timing vs verification? -> `/answers/deal-flow-timing-vs-verification`
- can this replace Crunchbase? -> `/answers/can-gitdealflow-replace-crunchbase`
- what should I actually buy first? -> `/buyers-guide`
- show me proof -> `/from-stars-to-seed`
- show me the data -> `/research`

### `/answers/deal-flow-timing-vs-verification`
If they ask:
- what tool does this better? -> `/compare/crunchbase-alternative-for-angel-investors`
- is there proof? -> `/from-stars-to-seed`
- is there methodology? -> `/methodology`
- what should I buy first? -> `/buyers-guide`

### `/research`
If they ask:
- do you have examples? -> `/from-stars-to-seed`
- how do I use this in practice? -> `/use-cases`
- what should I buy first? -> `/buyers-guide`
- how is this different from Crunchbase? -> `/compare/crunchbase-alternative-for-angel-investors`

### `/from-stars-to-seed`
If they ask:
- where is the data? -> `/research`
- how do I use this signal in workflow? -> `/use-cases`
- what should I buy first? -> `/buyers-guide`
- is this different from a database? -> `/compare/crunchbase-alternative-for-angel-investors`

### `/answers/how-angel-investors-use-github-signals`
If they ask:
- is this too noisy? -> `/answers/deal-flow-timing-vs-verification`
- do I need to know how to code? -> `/answers/do-i-need-to-know-how-to-code-to-use-gitdealflow`
- what should I buy first? -> `/buyers-guide`
- show me proof -> `/from-stars-to-seed`

### `/use-cases`
If they ask:
- okay, but is the proof real? -> `/research`
- which tool/job does this replace? -> `/compare/crunchbase-alternative-for-angel-investors`
- what paid step fits me? -> `/buyers-guide`

### `/buyers-guide`
If they ask:
- which paid step fits? -> `/answers/when-should-i-use-first-look-vs-dashboard`
- I need recurring visibility, not one-off depth -> `/answers/what-do-i-actually-get-from-dashboard-each-week`
- I need higher-touch support -> `/answers/when-should-i-use-dashboard-vs-insider`
- I only want proof before buying -> `/research` or `/from-stars-to-seed`

### `/answers/when-should-i-use-first-look-vs-dashboard`
If they ask:
- tell me about First Look -> `/firstlook`
- tell me about Dashboard -> `/dashboard`
- I still need buyer-side context -> `/buyers-guide`

### `/answers/when-should-i-use-dashboard-vs-insider`
If they ask:
- tell me about Dashboard -> `/dashboard`
- tell me about Insider -> `/insider`
- I still need buyer-side context -> `/buyers-guide`

### `/answers/is-first-look-worth-it-for-angels`
If they ask:
- what do I get? -> `/firstlook`
- maybe I need recurring coverage instead -> `/answers/when-should-i-use-first-look-vs-dashboard`
- I want to compare all steps first -> `/buyers-guide`

### `/answers/what-do-i-actually-get-from-dashboard-each-week`
If they ask:
- is Dashboard enough? -> `/answers/when-should-i-use-dashboard-vs-insider`
- show me the actual offer -> `/dashboard`
- I still need buyer-side guidance -> `/buyers-guide`

### `/answers/what-do-i-actually-get-from-insider`
If they ask:
- should I really buy Insider over Dashboard? -> `/answers/when-should-i-use-dashboard-vs-insider`
- show me the actual offer -> `/insider`
- I still need buyer-side guidance -> `/buyers-guide`

### `/integrations/best-mcp-server-for-vc-research`
If they ask:
- is there technical documentation? -> `/developers`
- is there evidence behind the signal? -> `/research`
- how does this help a buyer? -> `/buyers-guide`

### `/developers`
If they ask:
- where is the MCP workflow explanation? -> `/integrations/best-mcp-server-for-vc-research`
- where is the evidence? -> `/research`
- how should a buyer evaluate this? -> `/buyers-guide`

### `/weekly/top-100`
If they ask:
- what do I do with the shortlist? -> `/answers/how-to-turn-a-signal-into-a-watchlist`
- is this backed by real evidence? -> `/research`
- what should I buy first? -> `/buyers-guide`

## Default fallback routes

If you are unsure:
- skeptical / technical reader -> `/research`
- proof-seeking reader -> `/from-stars-to-seed`
- buyer / evaluator -> `/buyers-guide`
- practical operator -> `/use-cases`
- incumbent comparison -> `/compare/crunchbase-alternative-for-angel-investors`

## Command

The follow-up page should reduce uncertainty, not reopen the whole site.