# SEO / GEO / AIO / AEO Registration Checklist

Status key: [ ] todo, [x] done (automated), [~] done (manual)

---

## Automated (deployed with this commit)

- [x] **robots.txt** — AI crawler allow rules for GPTBot, OAI-SearchBot, ChatGPT-User, ClaudeBot, PerplexityBot, Google-Extended, CCBot, Amazonbot, Applebot-Extended
- [x] **llms.txt** — Structured markdown at /llms.txt for AI crawlers
- [x] **JSON-LD: SoftwareApplication** — applicationCategory, featureList, offers with availability
- [x] **JSON-LD: SpeakableSpecification** — Marks hero content for voice assistants
- [x] **JSON-LD: FAQPage expanded** — 6 Q&As (was 3) covering "what is", "how does", "sectors", "pricing"
- [x] **IndexNow key** — `22dfd6f8f816469b8c216bc7eaf8b936` deployed at root
- [x] **Sitemap updated** — llms.txt added to sitemap-pages.xml

---

## Manual — High Priority (do this week)

### 1. IndexNow: Ping to index all pages instantly
After deploying, run this curl to submit all URLs at once:
```bash
curl -X POST "https://api.indexnow.org/indexnow" \
  -H "Content-Type: application/json" \
  -d '{
    "host": "gitdealflow.com",
    "key": "22dfd6f8f816469b8c216bc7eaf8b936",
    "keyLocation": "https://gitdealflow.com/22dfd6f8f816469b8c216bc7eaf8b936.txt",
    "urlList": [
      "https://gitdealflow.com/",
      "https://gitdealflow.com/insider",
      "https://gitdealflow.com/llms.txt",
      "https://gitdealflow.com/privacy",
      "https://gitdealflow.com/terms"
    ]
  }'
```
This pings Bing, Yandex, Perplexity, Seznam, Naver, and Yep simultaneously.

### 2. Wikidata Entity (highest leverage across GEO/AIO/AEO)
- [ ] Go to https://www.wikidata.org/wiki/Special:NewItem
- [ ] Create entity: "VC Deal Flow Signal"
- [ ] Set properties:
  - instance of (P31) = web application (Q189210)
  - official website (P856) = https://gitdealflow.com
  - developer (P178) = [your entity or leave blank]
  - inception (P571) = 2026
  - programming language (P277) = JavaScript (Q2005)
  - platform (P400) = World Wide Web (Q466)
- [ ] Once created, add the Wikidata URL to sameAs in index.html JSON-LD

### 3. Crunchbase Profile
- [ ] Go to https://www.crunchbase.com/
- [ ] Create free company profile for "VC Deal Flow Signal"
- [ ] Fill: website, description, founding date, category (Financial Services > Alternative Data)
- [ ] Once live, add URL to sameAs in index.html JSON-LD

### 4. Yandex Webmaster
- [ ] Go to https://webmaster.yandex.com/
- [ ] Add and verify gitdealflow.com
- [ ] Submit sitemap

### 5. Perplexity Publishers Program
- [ ] Email publishers@perplexity.ai
- [ ] Subject: "Publisher enrollment — gitdealflow.com"
- [ ] Brief description of the site and what content you publish

### 6. LinkedIn Company Page (already planned)
- [ ] Create page if not done
- [ ] Add URL to sameAs in index.html JSON-LD

### 7. GitHub org (if applicable)
- [ ] Add org URL to sameAs in index.html JSON-LD

---

## Manual — Medium Priority (this month)

### B2B SaaS Review Directories (free listings)
- [ ] **G2** — https://www.g2.com/ (dominant B2B SaaS discovery)
- [ ] **Capterra** — https://www.capterra.com/ (Gartner-owned, also populates GetApp + Software Advice)
- [ ] **TrustRadius** — https://www.trustradius.com/
- [ ] **SaaSworthy** — https://www.saasworthy.com/
- [ ] **SoftwareSuggest** — https://www.softwaresuggest.com/

### Alternatives Sites (dofollow backlinks, competitor positioning)
- [ ] **AlternativeTo** — https://alternativeto.net/ (list as alternative to Harmonic.ai, Dealroom, Forager.ai)
- [ ] **SaaSHub** — https://www.saashub.com/ (dofollow backlinks)
- [ ] **StackShare** — https://stackshare.io/

### Startup / Product Directories
- [ ] **BetaList** — https://betalist.com/
- [ ] **Uneed** — https://www.uneed.best/ (dofollow backlinks)
- [ ] **Microlaunch** — https://microlaunch.net/
- [ ] **Launching Next** — https://www.launchingnext.com/
- [ ] **Startup Stash** — https://startupstash.com/
- [ ] **BetaPage** — https://betapage.co/
- [ ] **OpenHunts** — https://openhunts.com/
- [ ] **Peerlist Launchpad** — https://peerlist.io/

### VC-Adjacent Directories
- [ ] **Wellfound** (ex-AngelList) — https://wellfound.com/
- [ ] **F6S** — https://www.f6s.com/ (dofollow backlinks)
- [ ] **OpenVC** — https://www.openvc.app/

### AI Tool Directories
- [ ] **Futurepedia** — https://www.futurepedia.io/submit-tool
- [ ] **There's An AI For That** — https://theresanaiforthat.com/
- [ ] **ListMyAI** — https://listmyai.net/
- [ ] **ToolFinder** — https://toolfinder.co/

---

## Manual — Lower Priority (next month)

### Answer Engine Presence (AEO)
- [ ] **Quora** — Answer questions about VC deal flow, alternative data, startup intelligence
- [ ] **Medium** — Publish authoritative articles, cross-link to gitdealflow.com
- [ ] **LinkedIn Articles** — Publish via company page

### General Directories
- [ ] **Curlie** — https://curlie.org/ (DMOZ successor)
- [ ] **Apple Business Connect** — https://businessconnect.apple.com/

### Monitoring
- [ ] **Otterly.AI** — https://otterly.ai/ (track AI citation performance — you may already have this)

---

## After sameAs URLs are collected

Once you have Wikidata, Crunchbase, LinkedIn, and optionally GitHub URLs, update the Organization sameAs in index.html:
```json
"sameAs": [
  "https://t.me/gitdealflow",
  "https://x.com/data_nerd",
  "https://www.wikidata.org/wiki/Q_______",
  "https://www.crunchbase.com/organization/vc-deal-flow-signal",
  "https://www.linkedin.com/company/______",
  "https://github.com/______"
]
```
