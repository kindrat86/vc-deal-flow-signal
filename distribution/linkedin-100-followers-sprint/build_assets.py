from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import csv, textwrap, subprocess

ROOT = Path(__file__).parent
DRAFTS = ROOT / 'drafts'
ASSETS = ROOT / 'assets'
DRAFTS.mkdir(parents=True, exist_ok=True)
ASSETS.mkdir(parents=True, exist_ok=True)

NAVY = '#071B2D'
INK = '#EAF2F8'
MUTED = '#A9BDD0'
CYAN = '#48BDE8'
LINE = '#27445E'
W, H = 1080, 1350
FONT_BOLD = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
FONT_REG = '/System/Library/Fonts/Supplemental/Arial.ttf'

def write_once(path, content, **kwargs):
    """Keep measured ledgers and live verification logs intact on asset regeneration."""
    if not path.exists():
        path.write_text(content, **kwargs)

queue = {
 '01': {
  'format':'Document carousel, 6 slides',
  'headline':'A 3,275% GitHub spike can mean almost nothing.',
  'body':'A percentage spike is only a starting point. First ask what the baseline was, whether contributors changed, and whether the work reached a release.\n\nPublic GitHub activity can make a diligence list sharper. It does not prove a fundraise, revenue, or product-market fit.\n\nFollow GitDealFlow for the weekly public-data diligence note.',
  'comment':'', 'source':'https://signals.gitdealflow.com/api/signals.json',
  'slides':['A 3,275% GitHub spike can mean almost nothing.','Percentages hide the denominator.\nA move from 1 to 34 commits is real activity, not a verdict.','Cross-check contributor count.\nOne person pushing harder is different from a growing engineering surface.','Check new repositories and releases.\nWork that reaches a release is easier to investigate than a raw commit burst.','Add external context.\nPublic engineering activity is one research input, alongside your own diligence.','Use the spike to choose what to investigate.\nNot what to predict.\n\nFollow GitDealFlow for weekly method notes.']},
 '03': {
  'format':'Single image plus text',
  'headline':'Before you call a GitHub spike a signal, ask these five questions.',
  'body':'1. What was the baseline?\n2. Did contributor count change?\n3. Are new repositories appearing?\n4. Did release cadence change?\n5. What does external context say?\n\nA public GitHub pattern can help decide where to look next. It does not replace diligence.\n\nSave this checklist.',
  'comment':'', 'source':'https://signals.gitdealflow.com/api/signals.json',
  'slides':['Before you call a GitHub spike a signal, ask these five questions.','1  What was the baseline?\n\n2  Did contributor count change?\n\n3  Are new repositories appearing?\n\n4  Did release cadence change?\n\n5  What does external context say?\n\nUse public signals to choose what to investigate.']},
 '04': {
  'format':'Document carousel, 7 slides',
  'headline':'What GitHub can tell an investor, and what it cannot.',
  'body':'GitHub can show changes in public engineering activity: commit velocity, contributor growth, repository expansion, and release cadence.\n\nIt cannot tell you fundraise timing, revenue, founder quality, market fit, or whether a company will succeed.\n\nTreat it as a research input. Then do the rest of the work.\n\nFollow GitDealFlow for the next method note.',
  'comment':'', 'source':'https://signals.gitdealflow.com/methodology',
  'slides':['What GitHub can tell an investor, and what it cannot.','GitHub can show public engineering activity.\nCommit velocity, contributor growth, repository expansion, release cadence.','It can help form a research question.\nWhy did the public surface change? What should I investigate?','It cannot reveal fundraise timing.\nA spike is not a funding forecast.','It cannot prove revenue, founder quality, market fit, or customer demand.','It cannot replace a conversation, references, financial diligence, or judgment.','Use public GitHub activity as one research input.\n\nFollow GitDealFlow for the next method note.']},
 '06': {
  'format':'Short native screen recording',
  'headline':'A 30-second public-data diligence pass.',
  'body':'A short public-data pass starts with a question, not a prediction.\n\nCheck the public GitHub surface. Compare the baseline, contributors, repositories, and releases. Then write down what needs external verification.\n\nThe supporting source is in the first company comment.','comment':'https://gitdealflow.com/report?utm_source=linkedin&utm_medium=organic&utm_campaign=linkedin_100_followers&utm_content=day-06&utm_id=linkedin-company-day-06-202608','source':'https://signals.gitdealflow.com/api/signals.json',
  'slides':['A 30-second public-data diligence pass.','Start with a question.\nWhat changed in the public engineering surface?','Compare the baseline.\nA percentage alone can hide a small denominator.','Check contributors, repositories, and releases.\nThen list what needs external verification.','Public GitHub activity is a research input.\nNot a funding forecast.']},
 '08': {
  'format':'Document carousel, 6 slides',
  'headline':'Why hiring pages are weaker than filled roles.',
  'body':'A job page can be old, duplicated, or never filled. It is a prompt for a question, not proof of momentum.\n\nPublic engineering activity can add a separate view. Still, neither source replaces diligence.\n\nFollow GitDealFlow for the engineering-side checklist.',
  'comment':'', 'source':'https://signals.gitdealflow.com/methodology',
  'slides':['Why hiring pages are weaker than filled roles.','A job page can be stale.\nIt may outlive the role, the hiring plan, or the team.','A job page can be duplicated.\nOne role can appear in several places without a filled seat.','A job page can be unfilled.\nAn open listing is not a headcount change.','Use hiring pages as a prompt for a question.\nThen look for other public evidence.','Public data helps form a diligence list.\n\nFollow GitDealFlow for the engineering-side checklist.']},
 '10': {
  'format':'Single image plus text',
  'headline':'The useful question is not: is this startup raising?',
  'body':'The useful question is: what would I want to investigate next?\n\nPublic engineering activity can help prioritise research. It cannot tell you that a startup is raising, or whether it is investable.\n\nWhat public signal has changed a diligence question for you?',
  'comment':'', 'source':'https://signals.gitdealflow.com/methodology',
  'slides':['The useful question is not: is this startup raising?','The useful question is: what would I want to investigate next?\n\nPublic GitHub activity can help prioritise research. It cannot predict a fundraise.']},
 '12': {
  'format':'Document carousel, 7 slides',
  'headline':'PitchBook, Crunchbase and GitHub answer different diligence questions.',
  'body':'Company databases, funding databases, and public engineering activity answer different questions.\n\nUse them together. Do not treat GitHub as a replacement for company research, financing data, references, or judgment.\n\nFollow GitDealFlow for one applied example next week.',
  'comment':'', 'source':'https://signals.gitdealflow.com/methodology',
  'slides':['PitchBook, Crunchbase and GitHub answer different diligence questions.','Company databases can help with company identity, people, and market context.','Funding databases can help with disclosed financing and investor context.','Public GitHub activity can help with public engineering-surface questions.','No one source is a diligence system.\nEach has blind spots and lag.','The useful workflow is comparison.\nWhat changed, what is public, and what still needs verification?','Use tools together.\n\nFollow GitDealFlow for one applied example next week.']},
 '14': {
  'format':'Text post plus single source card',
  'headline':'What changed in the public GitHub surface this week?',
  'body':'This week, the public GitHub surface is updated across 350+ startup orgs in 15 sectors.\n\nThe dataset records public engineering activity for research and diligence. It is not a funding forecast or investment recommendation.\n\nSource date: Q3 2026 data.\n\nFollow GitDealFlow for the next weekly source note.',
  'comment':'', 'source':'https://signals.gitdealflow.com/api/signals.json',
  'slides':['What changed in the public GitHub surface this week?','Updated public GitHub activity across 350+ startup orgs in 15 sectors.\n\nResearch input, not a funding forecast.\n\nSource: Q3 2026 data.']}
}

def font(path, size):
    return ImageFont.truetype(path, size)

def wrap(draw, text, fnt, width):
    parts=[]
    for p in text.split('\n'):
        if not p:
            parts.append('')
            continue
        words=p.split(); line=''
        for word in words:
            trial=(line+' '+word).strip()
            if draw.textbbox((0,0), trial, font=fnt)[2] <= width: line=trial
            else: parts.append(line); line=word
        if line: parts.append(line)
    return parts

def slide(text, out, index, total):
    im=Image.new('RGB',(W,H),NAVY); d=ImageDraw.Draw(im)
    d.rectangle((60,60,1020,64), fill=CYAN)
    d.text((60,98),'GITDEALFLOW  /  VC DEAL FLOW SIGNAL',font=font(FONT_BOLD,26),fill=CYAN)
    d.text((60,154),f'{index:02d} / {total:02d}',font=font(FONT_BOLD,22),fill=MUTED)
    lines=wrap(d,text,font(FONT_BOLD,66),900)
    y=340
    for line in lines:
        d.text((70,y),line,font=font(FONT_BOLD,66),fill=INK)
        y+=88
    d.line((70,1180,1010,1180),fill=LINE,width=2)
    d.text((70,1215),'Public GitHub activity for research and diligence.',font=font(FONT_REG,28),fill=MUTED)
    d.text((70,1260),'gitdealflow.com',font=font(FONT_BOLD,28),fill=CYAN)
    im.save(out)

def single_card(title, detail, out):
    im=Image.new('RGB',(W,H),NAVY); d=ImageDraw.Draw(im)
    d.rectangle((60,60,1020,64), fill=CYAN)
    d.text((60,98),'GITDEALFLOW  /  VC DEAL FLOW SIGNAL',font=font(FONT_BOLD,26),fill=CYAN)
    y=250
    for line in wrap(d,title,font(FONT_BOLD,58),900):
        d.text((70,y),line,font=font(FONT_BOLD,58),fill=INK); y+=76
    y+=60
    for line in wrap(d,detail,font(FONT_REG,34),880):
        d.text((70,y),line,font=font(FONT_REG,34),fill=INK if line else MUTED); y+=51
    d.line((70,1180,1010,1180),fill=LINE,width=2)
    d.text((70,1215),'Public GitHub activity for research and diligence.',font=font(FONT_REG,28),fill=MUTED)
    d.text((70,1260),'gitdealflow.com',font=font(FONT_BOLD,28),fill=CYAN)
    im.save(out)

def make_pdf(prefix, slides):
    if len(slides) <= 2:
        single_card(slides[0], slides[1], ASSETS/f'{prefix}.png')
        return
    pages=[]
    for i, text in enumerate(slides,1):
        out=ASSETS/f'{prefix}-slide-{i:02d}.png'; slide(text,out,i,len(slides)); pages.append(Image.open(out).convert('RGB'))
    pages[0].save(ASSETS/f'{prefix}.pdf',save_all=True,append_images=pages[1:],resolution=150.0)

for day, data in queue.items():
    asset_prefix=f'day-{day}'
    if day == '06':
        # The native video needs individual frames, not a document-upload PDF.
        for i, text in enumerate(data['slides'],1):
            slide(text, ASSETS/f'{asset_prefix}-slide-{i:02d}.png', i, len(data['slides']))
        (ASSETS/f'{asset_prefix}.pdf').unlink(missing_ok=True)
    else:
        make_pdf(asset_prefix, data['slides'])
    path=DRAFTS/f'day-{day}.md'
    utm=data['comment'] or ''
    asset_file = f'{asset_prefix}-public-data-diligence-pass.mp4' if day == '06' else f"{asset_prefix}.{'pdf' if len(data['slides'])>2 else 'png'}"
    path.write_text(f'''# Day {day}: {data['headline']}\n\n## Format\n{data['format']}\n\n## Company post text\n{data['body']}\n\n## Asset\nassets/{asset_file}\n\n## Slide copy\n'''+ '\n\n'.join(f'{i}. {s}' for i,s in enumerate(data['slides'],1)) + f'''\n\n## First company-page comment\n{utm or 'No supporting link needed.'}\n\n## Source URL\n{data['source']}\n\n## 10-word verification snippet\n{data['headline'].split('.')[0]}.\n''',encoding='utf-8')

# A 25-second silent walkthrough for the Day 06 native video concept.
frames=[str(ASSETS/f'day-06-slide-{i:02d}.png') for i in range(1,6)]
concat=ASSETS/'day-06-frames.txt'
concat.write_text(''.join(f"file '{f}'\nduration 5\n" for f in frames)+f"file '{frames[-1]}'\n",encoding='utf-8')
subprocess.run(['ffmpeg','-y','-f','concat','-safe','0','-i',str(concat),'-vf','fps=30,format=yuv420p','-c:v','libx264','-preset','medium','-crf','22','-movflags','+faststart','-an',str(ASSETS/'day-06-public-data-diligence-pass.mp4')],check=True,stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)

# UTM table. No post body contains a URL.
with (ROOT/'utm-map.csv').open('w',newline='',encoding='utf-8') as f:
    w=csv.writer(f); w.writerow(['day','utm_url','source_url','needs_first_comment'])
    for day,d in queue.items():
        utm=f'https://gitdealflow.com/report?utm_source=linkedin&utm_medium=organic&utm_campaign=linkedin_100_followers&utm_content=day-{day}&utm_id=linkedin-company-day-{day}-202608'
        w.writerow([day,utm,d['source'],'yes' if d['comment'] else 'no'])

write_once(ROOT/'daily-metrics.csv','date,followers,net_new_followers,search_appearances,page_views,unique_visitors,custom_button_clicks,content_impressions,reactions,comments,reposts,post_clicks,post_follows,utm_sessions,utm_signup_starts,utm_verified_signups,qualified_actions,spend,note\n2026-08-21,12,0,12,9,7,0,300,4,2,0,29,0,0,0,0,0,0,"Baseline from LinkedIn dashboard. Aug 19 post contains banned 411 claim and had 29 impressions. LinkedIn overflow menu rendered empty during remediation attempt."\n',encoding='utf-8')

write_once(ROOT/'content-inventory.md','''# Company Post Inventory\n\n## Aug 21 remediation log\n\n- Target: Aug 19 weekly signal report, first sentence: `Weekly signal report: 411 startups across 15 sectors.`\n- Recorded performance before remediation: 29 impressions, 0 clicks, 0 reactions, 0 comments, 0 reposts, 0 follows shown.\n- Risk: banned exact panel count `411`.\n- Attempt: opened the exact post overflow menu using the LinkedIn company-page admin surface and trusted CDP pointer input. LinkedIn set the menu to expanded, but rendered an empty menu with no edit or delete action. A capture of the page's own Voyager requests during a second trusted open recorded zero requests, so no hidden edit/delete action loaded.\n- Result: no undocumented API or destructive workaround used. Post remains a live claim-drift blocker pending a working LinkedIn UI action.\n\n## Known table rows captured in plan baseline\n\n| Post | Date | Format | Impressions | Clicks | Reactions | Comments | Reposts | Follows | Claim status |\n|---|---|---:|---:|---:|---:|---:|---:|---:|---|\n| Best PitchBook Alternatives for Startup Signals | Aug 17 | Article | 80 | 3 | 2 | 2 | 0 | not exposed | requires destination and claim recheck before featuring |\n| AI & Machine Learning Startups Heating Up | Aug 19 | Article | 36 | 2 | 0 | 0 | 0 | not exposed | review needed |\n| Weekly signal report | Aug 19 | Article | 29 | 0 | 0 | 0 | 0 | not exposed | BLOCKED: banned `411` remains live |\n| Commit cadence tells you more than a pitch deck | Aug 18 | Document | 13 | 1 | 0 | 0 | 0 | not exposed | review needed |\n| GitHub activity is not a funding oracle | Aug 20 | Document | 11 | 12 | 1 | 0 | 0 | not exposed | review needed |\n| Hiring pages are the most gamed signal | Aug 11 | Document | 8 | 3 | 0 | 0 | 0 | not exposed | review needed |\n| Best Crunchbase Alternatives for VC Deal Flow | Aug 10 | Article | 8 | 3 | 0 | 0 | 0 | not exposed | review needed |\n| GitHub Momentum Checker | Aug 13 | Article | 7 | 1 | 0 | 0 | 0 | not exposed | review needed |\n| Velocity Verdict Cheat Sheet | Aug 12 | Article | 7 | 1 | 0 | 0 | 0 | not exposed | review needed |\n| Free Open Datasets | Aug 20 | Article | 3 | 0 | 0 | 0 | 0 | not exposed | review needed |\n| Free Open Datasets | Aug 21 | Article | 3 | 0 | 0 | 0 | 0 | not exposed | review needed |\n| Backtest your last three angel checks | Aug 21 | Article | 3 | 0 | 0 | 0 | 0 | not exposed | unsafe testimonials and em dash, review needed |\n''',encoding='utf-8')

(ROOT/'page-copy.md').write_text('''# Verified page copy\n\nThe LinkedIn company-page tagline and About copy had already been repaired and publicly verified in View as member before this run.\n\n## Approved tagline\nGitDealFlow, the VC Deal Flow Signal: public GitHub momentum for angels, scouts and seed investors.\n\n## Approved About copy\nGitDealFlow, the VC Deal Flow Signal, is a public research and data product for angels, scouts and seed investors.\n\nWe track public GitHub engineering activity across 350+ startup orgs in 15 sectors: commit velocity, contributor growth and repository expansion.\n\nOur research release covers 219 startup-period observations across 55 venture-backed startups over five quarters. It is a research input, not a funding forecast or investment recommendation.\n\nUse the public data, methodology and weekly report to investigate engineering momentum alongside your own diligence.\n''',encoding='utf-8')

(ROOT/'company-engagement-log.md').write_text('# Company Page Engagement Log\n\nNo comments published in this run. Company-only identity is required for each future comment.\n',encoding='utf-8')
(ROOT/'owned-distribution-log.md').write_text('# Owned Distribution Log\n\nNo digest or website edit made in this run. The existing digest must be checked before adding the approved follow line, and any website placement must be deployed and live-verified in the same session.\n',encoding='utf-8')
(ROOT/'day-07-review.md').write_text('# Day 7 Review\n\nTarget track: 56 followers.\n\nDecision: if below 56, state that the 100-follower target is off pace. Do not use ads, invitations, personal LinkedIn, DMs, vendors, or spam.\n',encoding='utf-8')
(ROOT/'final-review.md').write_text('# Day 14 Review\n\nReport actual followers, follower quality, top posts, UTM sessions, qualified actions, cost, and whether LinkedIn remains an active organic channel. Separate raw followers from qualified investor interest.\n',encoding='utf-8')
print('generated', len(queue), 'drafts and assets')
