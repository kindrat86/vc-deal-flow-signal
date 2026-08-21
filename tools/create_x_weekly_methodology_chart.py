from PIL import Image, ImageDraw, ImageFont
from pathlib import Path

OUT = Path('/Users/sipi/signals-gitdealflow/assets/x-weekly-methodology-chart-2026-08-21.png')
OUT.parent.mkdir(parents=True, exist_ok=True)
W, H = 1200, 675
BG = '#0B1020'
PANEL = '#121A31'
MUTED = '#9BA8C7'
TEXT = '#F6F8FF'
ACCENT = '#69E2C4'
LINE = '#2A3658'

img = Image.new('RGB', (W, H), BG)
d = ImageDraw.Draw(img)
regular = '/System/Library/Fonts/Supplemental/Arial.ttf'
bold = '/System/Library/Fonts/Supplemental/Arial Bold.ttf'
font = lambda p, s: ImageFont.truetype(p, s)
title = font(bold, 48)
subtitle = font(regular, 23)
card_title = font(bold, 25)
card_body = font(regular, 19)
footer = font(regular, 16)
small_bold = font(bold, 16)

# Header
d.text((64, 52), 'HOW TO READ THIS WEEK\'S GITHUB MOMENTUM REPORT', font=title, fill=TEXT)
d.text((64, 116), 'Four labels. Four screening prompts. Not investment advice.', font=subtitle, fill=MUTED)
d.rounded_rectangle((64, 162, 316, 194), 16, fill='#163C42')
d.text((82, 169), 'LIVE REPORT: 21 AUG 2026', font=small_bold, fill=ACCENT)

cards = [
    ('01', 'Engineering hiring burst', '>50% contributor growth', 'Possible team expansion.\nVerify the company context.'),
    ('02', 'Infrastructure buildout', '3+ new public repos / 30d', 'Possible platform build.\nNot proof of traction.'),
    ('03', 'Deploy frequency spike', '≥150% commit-velocity change', 'Compared with the team\'s own baseline.'),
    ('04', 'Framework migration', 'General acceleration', 'Does not meet another\nsignal threshold.'),
]
start_x, start_y = 64, 235
cw, ch, gap = 520, 150, 28
for i, (num, name, threshold, note) in enumerate(cards):
    col, row = i % 2, i // 2
    x = start_x + col * (cw + gap)
    y = start_y + row * (ch + gap)
    d.rounded_rectangle((x, y, x+cw, y+ch), 18, fill=PANEL, outline=LINE, width=2)
    d.rounded_rectangle((x+22, y+24, x+72, y+74), 12, fill='#1B3D49')
    d.text((x+34, y+39), num, font=small_bold, fill=ACCENT)
    d.text((x+94, y+22), name, font=card_title, fill=TEXT)
    d.text((x+94, y+57), threshold, font=card_body, fill=ACCENT)
    d.multiline_text((x+94, y+88), note, font=card_body, fill=MUTED, spacing=5)

# Footer
line_y = 593
d.line((64, line_y, 1136, line_y), fill=LINE, width=2)
d.text((64, 616), '350+ startups  ·  15 sectors  ·  Public GitHub activity  ·  Updated weekly', font=footer, fill=MUTED)
d.text((885, 616), 'signals.gitdealflow.com', font=footer, fill=ACCENT)

img.save(OUT, optimize=True)
print(f'{OUT} {img.size[0]}x{img.size[1]} {OUT.stat().st_size} bytes')
