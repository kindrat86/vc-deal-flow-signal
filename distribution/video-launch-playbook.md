# MCP Demo Video — Launch-Everywhere Playbook

**Source:** `mcp-server/assets/mcp-demo-source.mov` (72s, 1044×914, 4.6MB)
**Social MP4:** `mcp-server/assets/mcp-demo.mp4` (72s, 1280-wide, 933KB, no audio, faststart)
**README GIF:** `mcp-server/assets/mcp-demo.gif` (36s @ 12fps, 720-wide, 1.9MB)

**Public URLs (served from landing site, Vercel):**
- MP4: `https://gitdealflow.com/mcp-demo.mp4`
- GIF: `https://gitdealflow.com/mcp-demo.gif`

(Repo is private, so raw.githubusercontent.com URLs 404. Always use the gitdealflow.com URLs in external embeds.)

---

## Order of operations (Day 1)

### 1. Commit & push to GitHub (T+0)
```
cd /Users/sipi/launch-projects/vc-deal-flow-signal
git add mcp-server/assets mcp-server/README.md distribution/*.md
git commit -m "mcp: add demo video assets, embed in README and distribution drafts"
git push
```
This makes the raw URLs live so every other surface can link to them.

### 2. npm republish with new README (T+5min)
```
cd mcp-server && npm version patch && npm publish
```
Bumps to 1.1.1 so the npm page shows the GIF. (Current: 1.1.0)

### 3. Standalone Twitter/X video tweet (T+10min)
Post from @data_nerd. Attach `mcp-demo.mp4` directly (Twitter transcodes).

> I built this so I could ask Claude about VC deal flow.
>
> No dashboard. No API key. Just:
> "Which cybersecurity startups are accelerating?"
>
> MCP server, free.
> npx @gitdealflow/mcp-signal

(208 chars. Pin this tweet. It becomes the reusable demo asset for every future reply.)

### 4. Twitter thread (T+30min)
Post the full 6-tweet thread from `twitter-mcp-thread.md`. **Attach `mcp-demo.mp4` to Tweet 1.** Quote-RT the standalone from step 3 as Tweet 7 to funnel reach.

### 5. LinkedIn company page (T+1h)
Post from `linkedin-post.md`. Upload `mcp-demo.mp4` as **native video** (LinkedIn suppresses external video links). First 3s of the video should contain the hook — confirm before publishing.

### 6. Discord — Cursor #showcase (T+1h, Sat Apr 18 per schedule)
Post from `discord-mcp-posts.md` Section 3. Attach `mcp-demo.mp4`.

### 7. dev.to article (T+2h)
If not yet published: publish from `devto-mcp-article.md` with GIF as cover image + MP4 embedded after first paragraph. If already live: edit to add the embed.

### 8. Hashnode cross-post (T+3h)
Same content, canonical URL → dev.to. GIF as cover.

---

## Day 2 (Apr 18)

### 9. Reddit r/ClaudeAI (best fit — accepts video natively)
Post from `reddit-mcp-posts.md` Section 1. Attach `mcp-demo.mp4` as a Reddit-hosted video post (not link). Use kindrat86 account.

### 10. Update Product Hunt launch draft
Add `mcp-demo.mp4` to the PH gallery slot (PH accepts MP4 up to 3 min). Replace any screenshot placeholder.

### 11. Update awesome-mcp-servers PR description (if still open)
Comment on PR #4933 with the GIF URL so maintainer sees the demo before merging. Template:
> Quick update for reviewers — added a 36s demo GIF showing the server in action inside Claude, in case it helps with review:
> https://raw.githubusercontent.com/kindrat86/vc-deal-flow-signal/main/mcp-server/assets/mcp-demo.gif

(This doubles as a polite bump without being a "please merge" ping.)

---

## Day 3 (Apr 19)

### 12. Discord — MCP Community
Post from `discord-mcp-posts.md` Section 2. Attach MP4.

### 13. Reddit r/SideProject
Post from `reddit-mcp-posts.md` Section 4. Attach MP4.

### 14. IndieHackers launch post
Embed GIF URL in the post body (IH supports markdown images).

---

## Channels that get the video indirectly

- **GitHub README** — already wired via this commit
- **npm page** — picks up from README on next publish
- **Glama listing** — auto-regenerates from README
- **MCP Registry** — pulls npm description; no action needed
- **G2, SaaSHub, AlternativeTo** — add GIF to product gallery when profile is editable

---

## What NOT to do

- Don't post the video to Threads (wrong ICP per marketing plan).
- Don't email the video — use a link; inline video in email is a deliverability hit.
- Don't post the same video in #self-promotion on servers that ban advertising (TypeScript Community per discord_status).
- Don't speed the MP4 up further for Twitter — the 72s original is under the 140s limit and has room to breathe.

---

## Success metrics (48h after post)

- Twitter standalone video views > 2,000 (current 0 followers, so this is Dream 100 amplification)
- GitHub stars on `kindrat86/vc-deal-flow-signal` +5
- npm weekly downloads on `@gitdealflow/mcp-signal` > 20
- Reddit r/ClaudeAI post > 50 upvotes
- awesome-mcp-servers PR merged

If we miss 3/5, the problem is distribution reach, not creative. Rotate to Dream 100 DMs with the video attached.
