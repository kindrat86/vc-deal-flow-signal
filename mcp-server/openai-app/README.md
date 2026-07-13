# ChatGPT App — VC Deal Flow Signal

This directory packages the GitDealFlow MCP server as a ChatGPT App for the OpenAI Apps SDK (GA Oct 2025).

## How it works

ChatGPT Apps run inside ChatGPT and use MCP under the hood. We expose two MCP transports:

- **stdio** — `npx -y @gitdealflow/mcp-signal` for Claude Desktop, Claude Code, Cursor, etc.
- **Streamable HTTP** — `POST https://signals.gitdealflow.com/api/mcp/rpc` for ChatGPT Apps and any HTTP MCP host.

The ChatGPT App points at the HTTP transport. Both transports speak the same JSON-RPC contract and expose the same five tools, three resources, two resource templates, and five prompts.

## Files

- [`manifest.json`](./manifest.json) — App metadata for the Apps Console (publisher, connector URL, tool descriptors, example prompts, privacy/ToS URLs).

## Submission walkthrough

The Apps Console is UI-driven. The maintainer (anonymity-safe — submit under the `GitDealFlow` company name, not a personal account) does the submission once. Future updates are versioned in this directory and re-submitted.

1. Sign in at https://platform.openai.com/apps with the GitDealFlow account (`signals@gitdealflow.com`).
2. **Create app** → choose **MCP connector**.
3. Paste the connector URL: `https://signals.gitdealflow.com/api/mcp/rpc`.
   - Console will fetch `/api/mcp/rpc` (GET) and `/.well-known/mcp.json` to validate the manifest.
4. Copy the metadata fields from `manifest.json`:
   - **Name**: VC Deal Flow Signal
   - **Short description**: Track startup engineering acceleration from public GitHub data.
   - **Description**: (long-form, copy from `manifest.json:5`)
   - **Category**: Research
   - **Tags**: venture-capital, deal-flow, startup-signals, github-analytics, engineering-acceleration
   - **Logo**: upload `signals.gitdealflow.com/icon.png`
   - **Privacy**: https://gitdealflow.com/privacy
   - **ToS**: https://gitdealflow.com/terms
   - **Support**: https://signals.gitdealflow.com/developers
   - **Documentation**: https://signals.gitdealflow.com/agents.md
   - **Auth**: None
5. Add the **example prompts** from `manifest.json:example_prompts` (six prompts).
6. Submit for review. OpenAI's review window is typically 5–10 business days for first submission, faster for updates.

## Verification before submitting

Run end-to-end checks against the live HTTP transport:

```bash
# 1. Initialize handshake
curl -s -X POST https://signals.gitdealflow.com/api/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":1,"method":"initialize","params":{"protocolVersion":"2025-06-18","capabilities":{},"clientInfo":{"name":"test","version":"1"}}}' | jq .

# 2. List tools, resources, prompts
for m in tools/list resources/list resources/templates/list prompts/list; do
  echo "=== $m ==="
  curl -s -X POST https://signals.gitdealflow.com/api/mcp/rpc \
    -H "Content-Type: application/json" \
    -d "{\"jsonrpc\":\"2.0\",\"id\":2,\"method\":\"$m\"}" | jq .
done

# 3. Invoke a tool
curl -s -X POST https://signals.gitdealflow.com/api/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":3,"method":"tools/call","params":{"name":"get_trending_startups","arguments":{}}}' | jq '.result.structuredContent.startups[0]'

# 4. Read a resource
curl -s -X POST https://signals.gitdealflow.com/api/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":4,"method":"resources/read","params":{"uri":"signal://summary"}}' | jq .

# 5. Get a prompt
curl -s -X POST https://signals.gitdealflow.com/api/mcp/rpc \
  -H "Content-Type: application/json" \
  -d '{"jsonrpc":"2.0","id":5,"method":"prompts/get","params":{"name":"acceleration_memo","arguments":{"name":"Roboflow"}}}' | jq .
```

All five should return valid responses with no `error` field.

## Anonymity

- Publisher = `GitDealFlow` (company), never a person.
- Contact email = `signals@gitdealflow.com`.
- All discoverability URLs use the `gitdealflow.com` domain.
- Apps Console listing must not expose maintainer real name in any field — the `manifest.json:publisher.name` is the canonical surface.

## Updates

When the MCP server bumps to a new minor version (1.4.x → 1.5.x), update:
1. `mcp-server/package.json:version`
2. `mcp-server/server.json` (both `version` fields)
3. `pseo-site/public/.well-known/mcp.json:version`
4. `pseo-site/app/api/mcp/rpc/route.ts:SERVER_VERSION`
5. This directory if any tool/resource/prompt names changed.

Then re-submit the manifest in the Apps Console (changes are versioned, no full re-review needed for additive changes).
