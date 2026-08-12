# YouTube Recording Instructions — GitDealFlow

## What you need
- Mac with QuickTime Player (built-in)
- 15 minutes total (5 recording + 10 upload/title)
- A YouTube channel (create at youtube.com/create_channel)

## Step 1: Record (5 minutes)

1. Open **QuickTime Player** (Applications folder)
2. File → **New Screen Recording**
3. Click the options dropdown: enable **Microphone** (built-in)
4. Click **Record** — select entire screen

**Navigate this EXACT sequence:**

| Time | Action | Screen |
|------|--------|--------|
| 0:00-0:30 | Say: "I tracked GitHub commits across 219 startups and found a signal that fires 21-47 days before they raise." | Homepage gitdealflow.com |
| 0:30-1:00 | Show the live dashboard. Say: "This is the velocity board — 369 startups ranked every Monday by engineering acceleration." | signals.gitdealflow.com (dashboard) |
| 1:00-2:30 | Click any startup card. Say: "Each startup gets a signal profile: commit velocity trend, contributor count, and a plain-English note on why it's heating up." | Startup detail page |
| 2:30-3:30 | Navigate to signals.gitdealflow.com/methodology. Say: "The 3.4x finding — velocity alone is noise, but velocity combined with low contributor concentration is 3.4x predictive of Series A." | Methodology page |
| 3:30-4:30 | Navigate to signals.gitdealflow.com/receipts. Say: "The Scout Score — paste any GitHub username and see how many unicorns you starred before they hit $1B." | Receipts page |
| 4:30-5:00 | Say: "Get this Sunday's 5 names free at gitdealflow.com. No card, unsubscribe in one click." | Back to gitdealflow.com |

## Step 2: Save & Upload (5 minutes)

1. Stop recording (click stop button in menu bar, or Cmd+Ctrl+Esc)
2. Save as "gitdealflow-walkthrough.mov" to Desktop
3. Go to youtube.com/upload
4. Title: **"How to Predict Which Startups Will Raise (GitHub Commit Velocity, n=219)"**
5. Description (paste):
```
GitDealFlow reads public GitHub commit velocity across 4,200+ startups and flags the ones accelerating 21-47 days before fundraise announcements. Free Sunday email, open methodology, SSRN-published backtest of 219 fundraises.

📊 Live Dashboard: https://signals.gitdealflow.com
📐 Methodology (SSRN): https://papers.ssrn.com/sol3/papers.cfm?abstract_id=6606558
🎮 Scout Score (free game): https://signals.gitdealflow.com/receipts
📧 Free Sunday Digest: https://gitdealflow.com/#signup
📦 MCP Server: npx -y @gitdealflow/mcp-signal

00:00 — The Signal
00:30 — Live Dashboard
01:00 — Startup Profile
02:30 — The 3.4x Finding
03:30 — Scout Score Game
04:30 — Get Started Free
```

6. Thumbnail: Upload the screenshot from the dashboard at 30s mark

## Step 3: Embed on site

After the video is live on YouTube:
1. Get the YouTube video ID (from the URL: youtube.com/watch?v=VIDEO_ID)
2. Edit `/Users/sipi/signals-gitdealflow/landing/perfect-webinar.html`
3. Replace the text walkthrough section with:
```html
<iframe width="100%" height="500" src="https://www.youtube.com/embed/VIDEO_ID" 
  frameborder="0" allowfullscreen 
  style="border-radius:12px;margin:2rem 0"></iframe>
```
4. Deploy: `cd /Users/sipi/signals-gitdealflow/landing && vercel --prod --yes`
