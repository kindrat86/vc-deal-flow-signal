/**
 * Generate the downloadable artifacts for the Seven Signals book:
 *   public/downloads/seven-signals.md  , concatenated raw markdown
 *   public/downloads/seven-signals.txt , plain-text rendering
 *   public/downloads/seven-signals.pdf , basic PDF (zero deps, hand-written PDF 1.4)
 *   public/downloads/seven-signals.epub, EPUB 3 (hand-rolled zip via node:zlib)
 *   public/downloads/seven-signals-cover.svg, cover art for OG / EPUB
 *
 * Runs as part of `prebuild` so the artifacts ship with the deploy. No
 * runtime deps; native node only.
 */
import * as fs from "node:fs";
import * as path from "node:path";
import * as zlib from "node:zlib";
import { BOOK } from "../content/book/manifest";

const ROOT = path.resolve(__dirname, "..");
const CHAPTERS_DIR = path.join(ROOT, "content", "book", "chapters");
const OUT_DIR = path.join(ROOT, "public", "downloads");

// ---------------------------------------------------------------------------
// Utilities
// ---------------------------------------------------------------------------

function readChapter(file: string): string {
  return fs.readFileSync(path.join(CHAPTERS_DIR, file), "utf-8");
}

function ensureOutDir() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
  }
}

function stripMarkdown(md: string): string {
  return md
    .replace(/```[\s\S]*?```/g, (block) => {
      return block
        .split(/\r?\n/)
        .filter((l) => !l.startsWith("```"))
        .map((l) => "    " + l)
        .join("\n");
    })
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)");
}

// ---------------------------------------------------------------------------
// Markdown bundle
// ---------------------------------------------------------------------------

function buildMarkdown(): string {
  const parts: string[] = [];
  parts.push(`# ${BOOK.title}\n`);
  parts.push(`*${BOOK.subtitle}*\n`);
  parts.push(`By ${BOOK.authorName}, ${BOOK.authorRole}\n`);
  parts.push(
    `${BOOK.edition} · ISBN ${BOOK.isbn} · Published ${BOOK.publishedDate} · CC-BY-4.0\n`,
  );
  parts.push("---\n");
  for (const c of BOOK.chapters) {
    const md = readChapter(c.file);
    parts.push(md);
    parts.push("\n---\n");
  }
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// Plain text bundle
// ---------------------------------------------------------------------------

function buildPlainText(): string {
  const parts: string[] = [];
  parts.push(BOOK.title.toUpperCase());
  parts.push("=".repeat(BOOK.title.length));
  parts.push("");
  parts.push(BOOK.subtitle);
  parts.push("");
  parts.push(`By ${BOOK.authorName}, ${BOOK.authorRole}`);
  parts.push(`${BOOK.edition} · ISBN ${BOOK.isbn} · ${BOOK.publishedDate}`);
  parts.push("CC-BY-4.0 · https://signals.gitdealflow.com/book");
  parts.push("");
  parts.push("=".repeat(72));
  parts.push("");

  for (const c of BOOK.chapters) {
    const stripped = stripMarkdown(readChapter(c.file));
    parts.push(stripped);
    parts.push("");
    parts.push("=".repeat(72));
    parts.push("");
  }
  return parts.join("\n");
}

// ---------------------------------------------------------------------------
// PDF (hand-rolled, zero-dep), a properly typeset book
//
// A valid PDF 1.4 laid out like a real trade paperback. Real Adobe Core-14
// font metrics drive accurate line-breaking and full text justification.
// Serif body (Times) with a sans display face (Helvetica) for headings and a
// monospace (Courier) for code. Designed title page, copyright page, table of
// contents with page numbers, chapter openers, centered running heads, page
// folios, tinted code blocks, ruled tables, real typographic punctuation
// (em-dashes, curly quotes), and brand-accent rules. No runtime deps; native
// node only.
// ---------------------------------------------------------------------------

// --- Adobe Core-14 font metrics (widths per 1000 em, WinAnsi codes 32..126) -
const AFM: Record<string, string> = {
  "Times-Roman":
    "250 333 408 500 500 833 778 180 333 333 500 564 250 333 250 278 500 500 500 500 500 500 500 500 500 500 278 278 564 564 564 444 921 722 667 667 722 611 556 722 722 333 389 722 611 889 722 722 556 722 667 556 611 722 722 944 722 722 611 333 278 333 469 500 333 444 500 444 500 444 333 500 500 278 278 500 278 778 500 500 500 500 333 389 278 500 500 722 500 500 444 480 200 480 541",
  "Times-Bold":
    "250 333 555 500 500 1000 833 278 333 333 500 570 250 333 250 278 500 500 500 500 500 500 500 500 500 500 333 333 570 570 570 500 930 722 667 722 722 667 611 778 778 389 500 778 667 944 722 778 611 778 722 556 667 722 722 1000 722 722 667 333 278 333 581 500 333 500 556 444 556 444 333 500 556 278 333 556 278 833 556 500 556 556 444 389 333 556 500 722 500 500 444 394 220 394 520",
  "Times-Italic":
    "250 333 420 500 500 833 778 214 333 333 500 675 250 333 250 278 500 500 500 500 500 500 500 500 500 500 333 333 675 675 675 500 920 611 611 667 722 611 611 722 722 333 444 667 556 833 667 722 611 722 611 500 556 722 611 833 611 556 556 389 278 389 422 500 333 500 500 444 500 444 278 500 500 278 278 444 278 722 500 500 500 500 389 389 278 500 444 667 444 444 389 400 275 400 541",
  "Helvetica":
    "278 278 355 556 556 889 667 191 333 333 389 584 278 333 278 278 556 556 556 556 556 556 556 556 556 556 278 278 584 584 584 556 1015 667 667 722 722 667 611 778 722 278 500 667 556 833 722 778 667 778 722 667 611 722 667 944 667 667 611 278 278 278 469 556 333 556 556 500 556 556 278 556 556 222 222 500 222 833 556 556 556 556 333 500 278 556 500 722 500 500 500 334 260 334 584",
  "Helvetica-Bold":
    "278 333 474 556 556 889 722 238 333 333 389 584 278 333 278 278 556 556 556 556 556 556 556 556 556 556 333 333 584 584 584 611 975 722 722 722 722 667 611 778 722 278 556 722 611 833 722 778 667 778 722 667 611 722 667 944 667 667 611 333 278 333 584 556 333 556 611 556 611 556 333 611 611 278 278 556 278 889 611 611 611 611 389 556 333 611 556 778 556 556 500 389 280 389 584",
};
const WIDTHS: Record<string, number[]> = Object.fromEntries(
  Object.entries(AFM).map(([k, v]) => [k, v.split(" ").map(Number)]),
);
// Widths for the few high WinAnsi typographic glyphs we actually emit.
const HIGH: Record<string, Record<string, number>> = {
  "Times-Roman": { "-": 1000, "-": 500, "‘": 333, "’": 333, "“": 444, "”": 444, "…": 1000, "·": 250, "•": 350 },
  "Times-Bold": { "-": 1000, "-": 500, "‘": 333, "’": 333, "“": 500, "”": 500, "…": 1000, "·": 250, "•": 350 },
  "Times-Italic": { "-": 889, "-": 500, "‘": 333, "’": 333, "“": 556, "”": 556, "…": 889, "·": 250, "•": 350 },
  "Helvetica": { "-": 1000, "-": 556, "‘": 222, "’": 222, "“": 333, "”": 333, "…": 1000, "·": 278, "•": 350 },
  "Helvetica-Bold": { "-": 1000, "-": 556, "‘": 278, "’": 278, "“": 500, "”": 500, "…": 1000, "·": 278, "•": 350 },
};
const FONT_RES: Record<string, string> = {
  "Times-Roman": "F1",
  "Times-Bold": "F2",
  "Times-Italic": "F3",
  Helvetica: "F4",
  "Helvetica-Bold": "F5",
  Courier: "F6",
};

function glyphWidth(ch: string, font: string): number {
  if (font === "Courier") return 600;
  const code = ch.charCodeAt(0);
  if (code >= 32 && code <= 126) return WIDTHS[font]?.[code - 32] ?? 500;
  const h = HIGH[font]?.[ch];
  return h !== undefined ? h : 500;
}
function textWidth(s: string, font: string, size: number): number {
  let w = 0;
  for (const ch of s) w += glyphWidth(ch, font);
  return (w * size) / 1000;
}

// --- Palette (RGB 0..1). Sky-blue brand accent, slate inks. ----------------
type RGB = [number, number, number];
const C = {
  ink: [0.11, 0.13, 0.18] as RGB,
  muted: [0.42, 0.47, 0.54] as RGB,
  accent: [0.02, 0.55, 0.84] as RGB,
  faint: [0.82, 0.86, 0.9] as RGB,
  rule: [0.78, 0.82, 0.87] as RGB,
  codebg: [0.965, 0.975, 0.985] as RGB,
  codeink: [0.16, 0.19, 0.25] as RGB,
  tablehead: [0.93, 0.96, 0.99] as RGB,
};
const fill = (c: RGB) => `${c[0]} ${c[1]} ${c[2]} rg`;
const stroke = (c: RGB) => `${c[0]} ${c[1]} ${c[2]} RG`;

// --- Geometry: 6"x9" trade-paperback trim ----------------------------------
const PAGE_W = 432;
const PAGE_H = 648;
const ML = 64;
const MR = 64;
const TEXT_W = PAGE_W - ML - MR; // 304
const CENTER_X = PAGE_W / 2;
const TOP_Y = PAGE_H - 70; // first baseline
const BOTTOM_Y = 80; // do not draw text baselines below this
const HEAD_Y = PAGE_H - 44; // running-head baseline
const FOLIO_Y = 42; // page-number baseline
const LEAD = 15.4; // body leading

const f2 = (n: number) => n.toFixed(2);

// PDF string escaping. Order matters: escape backslashes/parens FIRST, then
// inject literal octal escapes for the WinAnsi typographic glyphs we keep.
function esc(s: string): string {
  return s
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)")
    .replace(/-/g, "\\227")
    .replace(/-/g, "\\226")
    .replace(/‘/g, "\\221")
    .replace(/’/g, "\\222")
    .replace(/“/g, "\\223")
    .replace(/”/g, "\\224")
    .replace(/…/g, "\\205")
    .replace(/•/g, "\\225")
    .replace(/·/g, "\\267")
    .replace(/[←-↓]/g, "->")
    .replace(/ /g, " ")
    .replace(/[¡-ÿ]/g, (ch) => `\\${ch.charCodeAt(0).toString(8).padStart(3, "0")}`)
    .replace(/[^\x20-\x7E\\]/g, "");
}

// --- Inline runs: parse **bold**, *italic*, `code` into styled runs ---------
interface Run {
  text: string;
  font: string;
  size: number;
  color: string; // fill() string
}
interface Cell {
  ch: string;
  font: string;
  size: number;
  color: string;
}
interface Word {
  cells: Cell[];
  w: number;
}

function transformLinks(md: string): string {
  return md.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, t, u) => (t === u ? t : `${t} (${u})`));
}

function parseInline(text: string, baseFont: string, size: number, color: string): Run[] {
  const boldFont = baseFont === "Helvetica" || baseFont === "Helvetica-Bold" ? "Helvetica-Bold" : "Times-Bold";
  const italFont = baseFont === "Helvetica" || baseFont === "Helvetica-Bold" ? "Helvetica" : "Times-Italic";
  const src = transformLinks(text);
  const runs: Run[] = [];
  const re = /\*\*([^*]+)\*\*|\*([^*\n]+)\*|`([^`]+)`/g;
  let last = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(src))) {
    if (m.index > last) runs.push({ text: src.slice(last, m.index), font: baseFont, size, color });
    if (m[1] != null) runs.push({ text: m[1], font: boldFont, size, color });
    else if (m[2] != null) runs.push({ text: m[2], font: italFont, size, color });
    else runs.push({ text: m[3], font: "Courier", size: size * 0.92, color: fill(C.codeink) });
    last = m.index + m[0].length;
  }
  if (last < src.length) runs.push({ text: src.slice(last), font: baseFont, size, color });
  return runs;
}

function runsToWords(runs: Run[]): Word[] {
  const words: Word[] = [];
  let cur: Word | null = null;
  for (const r of runs) {
    const parts = r.text.split(/(\s+)/);
    for (const p of parts) {
      if (p === "") continue;
      if (/^\s+$/.test(p)) {
        if (cur) {
          words.push(cur);
          cur = null;
        }
        continue;
      }
      if (!cur) cur = { cells: [], w: 0 };
      for (const ch of p) {
        cur.cells.push({ ch, font: r.font, size: r.size, color: r.color });
        cur.w += (glyphWidth(ch, r.font) * r.size) / 1000;
      }
    }
  }
  if (cur) words.push(cur);
  return words;
}

// ---------------------------------------------------------------------------
// Page model
// ---------------------------------------------------------------------------

const pages: string[][] = [];
const heads: (string | null)[] = [];
let ops: string[] = [];
let y = TOP_Y;
let chapterHead = "";
let afterHeading = true; // suppress first-line indent after a heading/opener

function beginPage(head: string | null): void {
  ops = [];
  pages.push(ops);
  heads.push(head);
  y = TOP_Y;
}
function carryPage(): void {
  beginPage(chapterHead);
}
function needs(): void {
  if (y < BOTTOM_Y) carryPage();
}

function hline(x1: number, x2: number, yy: number, thick: number, c: RGB): void {
  ops.push(`${stroke(c)} ${f2(thick)} w ${f2(x1)} ${f2(yy)} m ${f2(x2)} ${f2(yy)} l S`);
}
function vline(xx: number, y1: number, y2: number, thick: number, c: RGB): void {
  ops.push(`${stroke(c)} ${f2(thick)} w ${f2(xx)} ${f2(y1)} m ${f2(xx)} ${f2(y2)} l S`);
}
function rect(x: number, yy: number, w: number, h: number, c: RGB): void {
  ops.push(`${fill(c)} ${f2(x)} ${f2(yy)} ${f2(w)} ${f2(h)} re f`);
}

// Draw one already-wrapped line of words at a baseline, with a fixed gap
// between words (gap already includes any justification slack).
function emitLine(words: Word[], startX: number, baseline: number, gap: number): void {
  ops.push("BT");
  let curFont = "";
  let curSize = -1;
  let curColor = "";
  let x = startX;
  for (const word of words) {
    let cellX = x;
    let i = 0;
    while (i < word.cells.length) {
      const st = word.cells[i];
      let str = st.ch;
      let j = i + 1;
      while (
        j < word.cells.length &&
        word.cells[j].font === st.font &&
        word.cells[j].size === st.size &&
        word.cells[j].color === st.color
      ) {
        str += word.cells[j].ch;
        j++;
      }
      const fontRes = FONT_RES[st.font];
      if (fontRes !== curFont || st.size !== curSize) {
        ops.push(`/${fontRes} ${f2(st.size)} Tf`);
        curFont = fontRes;
        curSize = st.size;
      }
      if (st.color !== curColor) {
        ops.push(st.color);
        curColor = st.color;
      }
      ops.push(`1 0 0 1 ${f2(cellX)} ${f2(baseline)} Tm (${esc(str)}) Tj`);
      let sw = 0;
      for (const ch of str) sw += (glyphWidth(ch, st.font) * st.size) / 1000;
      cellX += sw;
      i = j;
    }
    x = cellX + gap;
  }
  ops.push("ET");
}

interface ParaOpts {
  font?: string;
  size?: number;
  leading?: number;
  color?: RGB;
  align?: "left" | "justify" | "center" | "right";
  firstIndent?: number;
  x?: number;
  width?: number;
  spaceBefore?: number;
  spaceAfter?: number;
}

function paragraph(md: string, opts: ParaOpts = {}): void {
  const font = opts.font ?? "Times-Roman";
  const size = opts.size ?? 10.8;
  const leading = opts.leading ?? LEAD;
  const color = fill(opts.color ?? C.ink);
  const align = opts.align ?? "justify";
  const x = opts.x ?? ML;
  const width = opts.width ?? TEXT_W;
  const firstIndent = opts.firstIndent ?? 0;
  if (opts.spaceBefore) y -= opts.spaceBefore;

  const words = runsToWords(parseInline(md, font, size, color));
  const spaceW = (glyphWidth(" ", font) * size) / 1000;

  // Split a word that is wider than maxW into a head that fits and a tail.
  const breakWord = (word: Word, maxW: number): [Word, Word] => {
    let acc = 0;
    let k = 0;
    while (k < word.cells.length) {
      const cw = (glyphWidth(word.cells[k].ch, word.cells[k].font) * word.cells[k].size) / 1000;
      if (k > 0 && acc + cw > maxW) break;
      acc += cw;
      k++;
    }
    const head = word.cells.slice(0, k);
    const tail = word.cells.slice(k);
    const wOf = (cs: Cell[]) => cs.reduce((a, c) => a + (glyphWidth(c.ch, c.font) * c.size) / 1000, 0);
    return [{ cells: head, w: wOf(head) }, { cells: tail, w: wOf(tail) }];
  };

  // Greedy wrap by measured width.
  const lines: { words: Word[]; w: number; indent: number }[] = [];
  let line: Word[] = [];
  let lineW = 0;
  let avail = width - firstIndent;
  let indent = firstIndent;
  for (const w0 of words) {
    let w = w0;
    // Hard-break words too wide for the column (e.g. long URLs) so they never
    // bleed past the right margin.
    while (w.w > width) {
      if (line.length) {
        lines.push({ words: line, w: lineW, indent });
        line = [];
        lineW = 0;
        indent = 0;
      }
      const [head, tail] = breakWord(w, width);
      lines.push({ words: [head], w: head.w, indent: 0 });
      avail = width;
      w = tail;
    }
    const add = (line.length ? spaceW : 0) + w.w;
    if (line.length && lineW + add > avail) {
      lines.push({ words: line, w: lineW, indent });
      line = [w];
      lineW = w.w;
      avail = width;
      indent = 0;
    } else {
      line.push(w);
      lineW += add;
    }
  }
  if (line.length) lines.push({ words: line, w: lineW, indent });

  for (let li = 0; li < lines.length; li++) {
    const L = lines[li];
    const isLast = li === lines.length - 1;
    needs();
    let startX = x + L.indent;
    let gap = spaceW;
    if (align === "justify" && !isLast && L.words.length > 1) {
      gap = spaceW + (width - L.indent - L.w) / (L.words.length - 1);
    } else if (align === "center") {
      startX = x + (width - L.w) / 2;
    } else if (align === "right") {
      startX = x + (width - L.w);
    }
    emitLine(L.words, startX, y, gap);
    y -= leading;
  }
  if (opts.spaceAfter) y -= opts.spaceAfter;
}

// Letter-spaced (tracked) single line - for kickers, running heads, folios.
function trackedWidth(text: string, font: string, size: number, tracking: number): number {
  let w = 0;
  for (const ch of text) w += (glyphWidth(ch, font) * size) / 1000 + tracking;
  return w - tracking;
}
function drawTracked(
  text: string,
  font: string,
  size: number,
  color: RGB,
  cx: number,
  baseline: number,
  tracking: number,
  align: "center" | "left" | "right" = "center",
): void {
  const w = trackedWidth(text, font, size, tracking);
  let x = align === "center" ? cx - w / 2 : align === "right" ? cx - w : cx;
  ops.push("BT", `/${FONT_RES[font]} ${f2(size)} Tf`, fill(color));
  for (const ch of text) {
    ops.push(`1 0 0 1 ${f2(x)} ${f2(baseline)} Tm (${esc(ch)}) Tj`);
    x += (glyphWidth(ch, font) * size) / 1000 + tracking;
  }
  ops.push("ET");
}

// ---------------------------------------------------------------------------
// Block-level markdown renderer (chapter body)
// ---------------------------------------------------------------------------

function renderCodeBlock(codeLines: string[]): void {
  const size = 8.6;
  const lead = 12;
  const pad = 5;
  // Wrap long code lines on character boundaries to the text width.
  const maxChars = Math.floor((TEXT_W - 16) / ((600 * size) / 1000));
  const wrapped: string[] = [];
  for (const raw of codeLines) {
    const lineText = raw.replace(/\t/g, "  ");
    if (lineText.length <= maxChars) wrapped.push(lineText);
    else for (let k = 0; k < lineText.length; k += maxChars) wrapped.push(lineText.slice(k, k + maxChars));
  }
  y -= 6;
  // top padding band
  needs();
  rect(ML, y + size - pad, TEXT_W, pad, C.codebg);
  for (const cl of wrapped) {
    needs();
    rect(ML, y - (lead - size) + 1, TEXT_W, lead, C.codebg);
    ops.push("BT", `/F6 ${f2(size)} Tf`, fill(C.codeink), `1 0 0 1 ${f2(ML + 8)} ${f2(y)} Tm (${esc(cl)}) Tj`, "ET");
    y -= lead;
  }
  // bottom padding band, sit it just below the last baseline so it never
  // paints over the final code line.
  rect(ML, y + size + 1 - pad, TEXT_W, pad, C.codebg);
  y -= 8;
  afterHeading = true;
}

function splitRow(l: string): string[] {
  let s = l.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function truncateToWidth(text: string, font: string, size: number, max: number): string {
  if (textWidth(text, font, size) <= max) return text;
  let out = "";
  for (const ch of text) {
    if (textWidth(out + ch + "…", font, size) > max) break;
    out += ch;
  }
  return out + "…";
}

function renderTable(header: string[], rows: string[][]): void {
  const cols = header.length;
  // Column widths proportional to max content, clamped to the text width.
  const raw = header.map((h, i) => {
    let mx = textWidth(stripMarkdown(h), "Helvetica-Bold", 8.6);
    for (const r of rows) mx = Math.max(mx, textWidth(stripMarkdown(r[i] ?? ""), "Times-Roman", 8.6));
    return mx + 10;
  });
  const sum = raw.reduce((a, b) => a + b, 0);
  const colW = raw.map((w) => (w / sum) * TEXT_W);
  const rowH = 15;
  const drawRow = (cellsTxt: string[], headerRow: boolean) => {
    needs();
    if (y - rowH < BOTTOM_Y) carryPage();
    if (headerRow) rect(ML, y - 3.5, TEXT_W, rowH, C.tablehead);
    let cx = ML;
    for (let i = 0; i < cols; i++) {
      const font = headerRow ? "Helvetica-Bold" : "Times-Roman";
      const color = headerRow ? C.ink : C.codeink;
      const txt = truncateToWidth(stripMarkdown(cellsTxt[i] ?? ""), font, 8.6, colW[i] - 8);
      ops.push("BT", `/${FONT_RES[font]} 8.6 Tf`, fill(color), `1 0 0 1 ${f2(cx + 4)} ${f2(y)} Tm (${esc(txt)}) Tj`, "ET");
      cx += colW[i];
    }
    hline(ML, ML + TEXT_W, y - 4, headerRow ? 0.8 : 0.4, headerRow ? C.rule : C.faint);
    y -= rowH;
  };
  y -= 6;
  needs();
  hline(ML, ML + TEXT_W, y + 11, 0.8, C.rule);
  drawRow(header, true);
  for (const r of rows) drawRow(r, false);
  y -= 6;
  afterHeading = true;
}

function renderMarkdown(md: string): void {
  const src = md.split(/\r?\n/);
  let i = 0;
  while (i < src.length) {
    const line = src[i];
    if (/^# /.test(line)) {
      i++;
      continue; // chapter title comes from the opener
    }
    if (/^## /.test(line)) {
      paragraph(stripMarkdown(line.replace(/^## /, "")), {
        font: "Helvetica-Bold",
        size: 13,
        leading: 16,
        color: C.ink,
        align: "left",
        spaceBefore: 16,
        spaceAfter: 6,
      });
      afterHeading = true;
      i++;
      continue;
    }
    if (/^### /.test(line)) {
      paragraph(stripMarkdown(line.replace(/^### /, "")), {
        font: "Helvetica-Bold",
        size: 10.8,
        leading: 14,
        color: C.accent,
        align: "left",
        spaceBefore: 11,
        spaceAfter: 3,
      });
      afterHeading = true;
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      i++;
      const buf: string[] = [];
      while (i < src.length && !src[i].startsWith("```")) {
        buf.push(src[i]);
        i++;
      }
      i++;
      renderCodeBlock(buf);
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (/^[-*] /.test(line)) {
      while (i < src.length && /^[-*] /.test(src[i])) {
        const txt = src[i].replace(/^[-*] /, "");
        y -= 2;
        needs();
        const baseline = y;
        drawTracked("•", "Helvetica-Bold", 10.8, C.accent, ML + 8, baseline, 0, "left");
        paragraph(txt, { x: ML + 22, width: TEXT_W - 22, align: "left" });
        i++;
      }
      afterHeading = false;
      continue;
    }
    if (/^\d+\. /.test(line)) {
      while (i < src.length && /^\d+\. /.test(src[i])) {
        const num = src[i].match(/^(\d+)\. /)![1];
        const txt = src[i].replace(/^\d+\. /, "");
        y -= 2;
        needs();
        const baseline = y;
        drawTracked(`${num}.`, "Helvetica-Bold", 10.4, C.accent, ML + 4, baseline, 0, "left");
        paragraph(txt, { x: ML + 24, width: TEXT_W - 24, align: "left" });
        i++;
      }
      afterHeading = false;
      continue;
    }
    if (line.includes("|") && i + 1 < src.length && /^\s*\|?[-: ]+\|/.test(src[i + 1])) {
      const header = splitRow(line);
      i += 2;
      const rows: string[][] = [];
      while (i < src.length && src[i].includes("|")) {
        rows.push(splitRow(src[i]));
        i++;
      }
      renderTable(header, rows);
      continue;
    }
    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < src.length && src[i].startsWith("> ")) {
        buf.push(src[i].slice(2));
        i++;
      }
      y -= 6;
      needs();
      const yStart = y + 9;
      paragraph(buf.join(" "), {
        font: "Times-Italic",
        color: C.muted,
        x: ML + 18,
        width: TEXT_W - 26,
        align: "left",
      });
      vline(ML + 6, yStart, y + 9, 2, C.accent);
      y -= 6;
      afterHeading = true;
      continue;
    }

    // Paragraph: gather continuation lines.
    const buf: string[] = [line];
    i++;
    while (
      i < src.length &&
      src[i].trim() !== "" &&
      !/^#{1,6} /.test(src[i]) &&
      !src[i].startsWith("```") &&
      !/^[-*] /.test(src[i]) &&
      !/^\d+\. /.test(src[i]) &&
      !src[i].startsWith("> ")
    ) {
      buf.push(src[i]);
      i++;
    }
    paragraph(buf.join(" "), { firstIndent: afterHeading ? 0 : 16, align: "justify" });
    afterHeading = false;
  }
}

// ---------------------------------------------------------------------------
// Front matter + chapter openers
// ---------------------------------------------------------------------------

function kickerFor(c: (typeof BOOK.chapters)[number]): string {
  if (c.number >= 1 && c.number <= 7) return `SIGNAL ${c.number}`;
  if (c.number === 0) return "INTRODUCTION";
  if (c.number === 8) return "METHODOLOGY";
  if (c.number === 9) return "APPENDIX";
  if (c.number === 10) return "CONCLUSION";
  return "CHAPTER";
}
function displayTitle(c: (typeof BOOK.chapters)[number]): string {
  return c.title.replace(/^Signal \d+\s*-\s*/, "").replace(/^Appendix\s*-\s*/, "");
}

function titlePage(): void {
  beginPage(null);
  y = PAGE_H - 168;
  hline(CENTER_X - 26, CENTER_X + 26, y + 14, 1, C.accent);
  drawTracked("A FIELD MANUAL", "Helvetica-Bold", 10, C.accent, CENTER_X, y - 12, 3.6);
  y -= 64;
  paragraph(BOOK.title, { font: "Helvetica-Bold", size: 25, leading: 31, align: "center", color: C.ink });
  y -= 6;
  hline(CENTER_X - 48, CENTER_X + 48, y + 6, 2.4, C.accent);
  y -= 26;
  paragraph(BOOK.subtitle, { font: "Times-Italic", size: 12.5, leading: 17, align: "center", color: C.muted });

  y = 246;
  drawTracked(`BY ${BOOK.authorName.toUpperCase()}`, "Helvetica-Bold", 11.5, C.ink, CENTER_X, y, 2);
  y -= 19;
  paragraph(BOOK.authorRole, { font: "Times-Italic", size: 10.8, align: "center", color: C.muted });

  y = 132;
  paragraph(`${BOOK.edition}  ·  Published ${BOOK.publishedDate}`, { size: 9.6, align: "center", color: C.muted });
  paragraph(`ISBN ${BOOK.isbn}  ·  CC BY 4.0`, { size: 9.6, align: "center", color: C.muted });
  y -= 6;
  drawTracked("SIGNALS.GITDEALFLOW.COM/BOOK", "Helvetica-Bold", 9, C.accent, CENTER_X, y, 2);
}

function copyrightPage(): void {
  beginPage(null);
  // Start in the upper third so the notice always fits on a single page
  // (it must not overflow onto the reserved table-of-contents page).
  y = 432;
  const meta = [
    BOOK.title,
    `${BOOK.subtitle}`,
    "",
    `By ${BOOK.authorName}, ${BOOK.authorRole}`,
    "",
    `${BOOK.edition}. Published ${BOOK.publishedDate}.`,
    `ISBN ${BOOK.isbn}.`,
    "",
    "This work is licensed under a Creative Commons Attribution 4.0",
    "International License (CC BY 4.0). You are free to share and adapt this",
    "material for any purpose, with appropriate attribution.",
    "",
    "Every claim in this book is reproducible from public GitHub data and the",
    "SSRN-indexed methodology preprint. Where the book and the preprint differ,",
    "the preprint governs.",
    "",
    "GitDealFlow · signals.gitdealflow.com/book",
    "",
    "Typeset from public Markdown source. Set in Times and Helvetica.",
  ];
  for (const m of meta) {
    if (m === "") {
      y -= 7;
      continue;
    }
    paragraph(m, { size: 9.4, leading: 13.5, align: "left", color: C.muted });
  }
}

function chapterOpener(c: (typeof BOOK.chapters)[number]): void {
  beginPage(null);
  chapterHead = displayTitle(c);
  y = PAGE_H - 168;
  drawTracked(kickerFor(c), "Helvetica-Bold", 9.5, C.accent, ML, y, 2.4, "left");
  y -= 30;
  paragraph(displayTitle(c), { font: "Helvetica-Bold", size: 22, leading: 26, align: "left", color: C.ink });
  y -= 2;
  hline(ML, ML + 42, y + 4, 2.4, C.accent);
  y -= 22;
  paragraph(c.subtitle, { font: "Times-Italic", size: 12, leading: 16, align: "left", color: C.muted });
  y -= 24;
  afterHeading = true;
}

function tableOfContents(tocIdx: number, starts: Record<number, number>): void {
  // Render into the reserved page array (heads[tocIdx] is already null).
  const saved = ops;
  const savedY = y;
  ops = pages[tocIdx];
  y = PAGE_H - 150;
  drawTracked("CONTENTS", "Helvetica-Bold", 13, C.ink, ML, y, 3, "left");
  hline(ML, ML + TEXT_W, y - 12, 1, C.faint);
  y -= 40;
  for (const c of BOOK.chapters) {
    const folio = String(starts[c.number]);
    const baseline = y;
    // kicker number tab on the left
    drawTracked(kickerFor(c), "Helvetica-Bold", 7.4, C.accent, ML, baseline + 11, 1.4, "left");
    const title = displayTitle(c);
    const titleW = textWidth(title, "Times-Roman", 10.6);
    ops.push(
      "BT",
      "/F1 10.6 Tf",
      fill(C.ink),
      `1 0 0 1 ${f2(ML)} ${f2(baseline)} Tm (${esc(title)}) Tj`,
      "ET",
    );
    const folioW = trackedWidth(folio, "Helvetica", 10, 0.5);
    drawTracked(folio, "Helvetica", 10, C.muted, ML + TEXT_W, baseline, 0.5, "right");
    // dotted leader between title and folio
    const leadStart = ML + titleW + 6;
    const leadEnd = ML + TEXT_W - folioW - 6;
    if (leadEnd > leadStart) {
      const dotW = (glyphWidth(".", "Times-Roman") * 10) / 1000 + 2.2;
      const dots = Math.max(0, Math.floor((leadEnd - leadStart) / dotW));
      drawTracked(".".repeat(dots), "Times-Roman", 10, C.faint, leadStart, baseline, 2.2, "left");
    }
    y -= 26;
  }
  ops = saved;
  y = savedY;
}

function buildPdf(): Buffer {
  pages.length = 0;
  heads.length = 0;

  titlePage(); // physical page 1
  copyrightPage(); // physical page 2
  const tocIdx = pages.length;
  beginPage(null); // physical page 3 (TOC, filled after layout)

  const starts: Record<number, number> = {};
  for (const c of BOOK.chapters) {
    starts[c.number] = pages.length + 1; // folio of the opener page
    chapterOpener(c);
    renderMarkdown(readChapter(c.file));
  }

  tableOfContents(tocIdx, starts);

  // Running heads + folios (folio = physical page index; hidden on pp. 1-2).
  for (let p = 0; p < pages.length; p++) {
    ops = pages[p];
    const folio = p + 1;
    if (folio > 2) drawTracked(String(folio), "Helvetica", 9, C.muted, CENTER_X, FOLIO_Y, 1);
    const head = heads[p];
    if (head) {
      drawTracked(head.toUpperCase(), "Helvetica", 7.6, C.muted, CENTER_X, HEAD_Y, 1.8);
      hline(CENTER_X - 70, CENTER_X + 70, HEAD_Y - 6, 0.5, C.faint);
    }
  }

  // ----- Serialize to PDF objects -----
  const fontNames = ["Times-Roman", "Times-Bold", "Times-Italic", "Helvetica", "Helvetica-Bold", "Courier"];
  const objects: string[] = [];
  // 1: Catalog, 2: Pages, 3..8: fonts, then page/content pairs from id 9.
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  const pageObjStart = 9;
  const pageObjIds = pages.map((_, idx) => pageObjStart + idx * 2);
  const kids = pageObjIds.map((id) => `${id} 0 R`).join(" ");
  const fontRefs = fontNames.map((_, idx) => `/F${idx + 1} ${idx + 3} 0 R`).join(" ");
  objects.push(
    `<< /Type /Pages /Count ${pages.length} /Kids [ ${kids} ] /MediaBox [ 0 0 ${PAGE_W} ${PAGE_H} ] /Resources << /Font << ${fontRefs} >> >> >>`,
  );
  for (const name of fontNames) {
    objects.push(`<< /Type /Font /Subtype /Type1 /BaseFont /${name} /Encoding /WinAnsiEncoding >>`);
  }
  for (let p = 0; p < pages.length; p++) {
    const contentId = pageObjStart + p * 2 + 1;
    objects.push(`<< /Type /Page /Parent 2 0 R /Contents ${contentId} 0 R >>`);
    const stream = pages[p].join("\n");
    objects.push(`<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`);
  }

  const buffers: Buffer[] = [];
  let offset = 0;
  const pushBuf = (s: string) => {
    const buf = Buffer.from(s, "binary");
    buffers.push(buf);
    offset += buf.length;
  };
  const offsets: number[] = [0];
  pushBuf("%PDF-1.4\n%\xE2\xE3\xCF\xD3\n");
  for (let i = 0; i < objects.length; i++) {
    offsets.push(offset);
    pushBuf(`${i + 1} 0 obj\n${objects[i]}\nendobj\n`);
  }
  const xrefOffset = offset;
  pushBuf(`xref\n0 ${objects.length + 1}\n`);
  pushBuf("0000000000 65535 f \n");
  for (let i = 1; i <= objects.length; i++) {
    pushBuf(`${offsets[i].toString().padStart(10, "0")} 00000 n \n`);
  }
  pushBuf(`trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`);
  return Buffer.concat(buffers);
}

// ---------------------------------------------------------------------------
// EPUB (hand-rolled zip via node:zlib)
//
// EPUB is a zip with a specific structure. We build a minimum-viable valid
// EPUB 3.0 with one XHTML file per chapter, a nav.xhtml table of contents,
// content.opf manifest, and the META-INF/container.xml pointer. Stored
// uncompressed for the mimetype file (EPUB requirement) and DEFLATE for
// everything else.
// ---------------------------------------------------------------------------

interface ZipEntry {
  name: string;
  data: Buffer;
  store: boolean; // true = stored uncompressed (for mimetype), false = DEFLATE
}

// CRC-32 implementation (standard polynomial 0xEDB88320)
const CRC_TABLE: number[] = (() => {
  const t: number[] = new Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf: Buffer): number {
  let c = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    c = CRC_TABLE[(c ^ buf[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function buildZip(entries: ZipEntry[]): Buffer {
  const localChunks: Buffer[] = [];
  const centralChunks: Buffer[] = [];
  let offset = 0;

  for (const entry of entries) {
    const nameBuf = Buffer.from(entry.name, "utf-8");
    const crc = crc32(entry.data);
    const uncompressedSize = entry.data.length;
    let compressedData: Buffer;
    let method: number;
    if (entry.store) {
      compressedData = entry.data;
      method = 0;
    } else {
      compressedData = zlib.deflateRawSync(entry.data);
      method = 8;
    }
    const compressedSize = compressedData.length;

    // Local file header
    const local = Buffer.alloc(30);
    local.writeUInt32LE(0x04034b50, 0); // signature
    local.writeUInt16LE(20, 4); // version needed
    local.writeUInt16LE(0, 6); // flags
    local.writeUInt16LE(method, 8);
    local.writeUInt16LE(0, 10); // mod time
    local.writeUInt16LE(0, 12); // mod date
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(compressedSize, 18);
    local.writeUInt32LE(uncompressedSize, 22);
    local.writeUInt16LE(nameBuf.length, 26);
    local.writeUInt16LE(0, 28); // extra field length
    localChunks.push(local, nameBuf, compressedData);

    // Central directory header
    const central = Buffer.alloc(46);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4); // version made by
    central.writeUInt16LE(20, 6); // version needed
    central.writeUInt16LE(0, 8); // flags
    central.writeUInt16LE(method, 10);
    central.writeUInt16LE(0, 12); // mod time
    central.writeUInt16LE(0, 14); // mod date
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(compressedSize, 20);
    central.writeUInt32LE(uncompressedSize, 24);
    central.writeUInt16LE(nameBuf.length, 28);
    central.writeUInt16LE(0, 30); // extra
    central.writeUInt16LE(0, 32); // comment
    central.writeUInt16LE(0, 34); // disk
    central.writeUInt16LE(0, 36); // internal attrs
    central.writeUInt32LE(0, 38); // external attrs
    central.writeUInt32LE(offset, 42);
    centralChunks.push(central, nameBuf);

    offset += local.length + nameBuf.length + compressedData.length;
  }

  const localBuf = Buffer.concat(localChunks);
  const centralBuf = Buffer.concat(centralChunks);

  const eocd = Buffer.alloc(22);
  eocd.writeUInt32LE(0x06054b50, 0);
  eocd.writeUInt16LE(0, 4); // disk number
  eocd.writeUInt16LE(0, 6); // disk with central
  eocd.writeUInt16LE(entries.length, 8);
  eocd.writeUInt16LE(entries.length, 10);
  eocd.writeUInt32LE(centralBuf.length, 12);
  eocd.writeUInt32LE(localBuf.length, 16);
  eocd.writeUInt16LE(0, 20); // comment length

  return Buffer.concat([localBuf, centralBuf, eocd]);
}

function escapeXml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function mdToXhtml(md: string): string {
  // Reuse the same renderer logic but emit XHTML-clean tags. Simpler than
  // importing the lib, this is build-only.
  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (line.startsWith("```")) {
      i++;
      const buf: string[] = [];
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++;
      out.push(`<pre><code>${escapeXml(buf.join("\n"))}</code></pre>`);
      continue;
    }
    if (/^# /.test(line)) {
      // Skip top-level (we emit chapter title separately)
      i++;
      continue;
    }
    if (/^## /.test(line)) {
      out.push(`<h2>${escapeXml(stripMarkdown(line.replace(/^## /, "")))}</h2>`);
      i++;
      continue;
    }
    if (/^### /.test(line)) {
      out.push(`<h3>${escapeXml(stripMarkdown(line.replace(/^### /, "")))}</h3>`);
      i++;
      continue;
    }
    if (line.trim() === "") {
      i++;
      continue;
    }
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${escapeXml(stripMarkdown(lines[i].replace(/^[-*] /, "")))}</li>`);
        i++;
      }
      out.push(`<ul>${items.join("")}</ul>`);
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${escapeXml(stripMarkdown(lines[i].replace(/^\d+\. /, "")))}</li>`);
        i++;
      }
      out.push(`<ol>${items.join("")}</ol>`);
      continue;
    }
    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(`<blockquote>${escapeXml(stripMarkdown(buf.join(" ")))}</blockquote>`);
      continue;
    }
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[-: ]+\|/.test(lines[i + 1])) {
      const splitRow = (l: string): string[] => {
        let s = l.trim();
        if (s.startsWith("|")) s = s.slice(1);
        if (s.endsWith("|")) s = s.slice(0, -1);
        return s.split("|").map((c) => c.trim());
      };
      const headerCells = splitRow(line);
      i += 2;
      const bodyRows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${headerCells.map((c) => `<th>${escapeXml(stripMarkdown(c))}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map((r) => `<tr>${r.map((c) => `<td>${escapeXml(stripMarkdown(c))}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      out.push(`<table>${thead}${tbody}</table>`);
      continue;
    }
    const buf: string[] = [line];
    i++;
    while (
      i < lines.length &&
      lines[i].trim() !== "" &&
      !/^#{1,3} /.test(lines[i]) &&
      !lines[i].startsWith("```") &&
      !/^[-*] /.test(lines[i]) &&
      !/^\d+\. /.test(lines[i]) &&
      !lines[i].startsWith("> ")
    ) {
      buf.push(lines[i]);
      i++;
    }
    out.push(`<p>${escapeXml(stripMarkdown(buf.join(" ")))}</p>`);
  }
  return out.join("\n");
}

function buildEpub(): Buffer {
  const entries: ZipEntry[] = [];

  // mimetype must be first and stored uncompressed
  entries.push({
    name: "mimetype",
    data: Buffer.from("application/epub+zip", "utf-8"),
    store: true,
  });

  // META-INF/container.xml
  const container = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  entries.push({ name: "META-INF/container.xml", data: Buffer.from(container, "utf-8"), store: false });

  // CSS
  const css = `body { font-family: Georgia, serif; line-height: 1.65; max-width: 38em; margin: 1em auto; padding: 0 1em; color: #1a202c; }
h1, h2, h3 { font-family: -apple-system, sans-serif; line-height: 1.25; }
h1 { font-size: 1.8em; margin-top: 1.5em; }
h2 { font-size: 1.35em; margin-top: 1.5em; border-bottom: 1px solid #ccc; padding-bottom: 0.2em; }
h3 { font-size: 1.1em; margin-top: 1.4em; }
p { margin: 0.7em 0; }
pre { background: #f5f5f5; padding: 0.8em; overflow-x: auto; font-size: 0.85em; }
code { font-family: Menlo, monospace; font-size: 0.9em; }
blockquote { border-left: 3px solid #ddd; padding-left: 1em; color: #555; }
ul, ol { padding-left: 1.6em; }
table { border-collapse: collapse; margin: 1em 0; }
th, td { border: 1px solid #ccc; padding: 0.4em 0.7em; text-align: left; }
.subtitle { color: #666; font-style: italic; margin-top: -0.4em; }
.chapter-num { color: #0284c7; font-size: 0.8em; letter-spacing: 0.1em; text-transform: uppercase; }`;
  entries.push({ name: "OEBPS/style.css", data: Buffer.from(css, "utf-8"), store: false });

  // Title page
  const titlePage = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="UTF-8"/>
<title>${escapeXml(BOOK.title)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
<div style="text-align:center;margin-top:6em">
<h1 style="font-size:2.4em">${escapeXml(BOOK.title)}</h1>
<p class="subtitle" style="font-size:1.15em">${escapeXml(BOOK.subtitle)}</p>
<p style="margin-top:6em">By ${escapeXml(BOOK.authorName)}</p>
<p>${escapeXml(BOOK.authorRole)}</p>
<p style="margin-top:4em;color:#666;font-size:0.85em">${escapeXml(BOOK.edition)} · ${escapeXml(BOOK.publishedDate)}</p>
<p style="color:#666;font-size:0.85em">ISBN ${escapeXml(BOOK.isbn)} · CC-BY-4.0</p>
<p style="margin-top:2em;font-size:0.85em"><a href="https://signals.gitdealflow.com/book">signals.gitdealflow.com/book</a></p>
</div>
</body>
</html>`;
  entries.push({ name: "OEBPS/title.xhtml", data: Buffer.from(titlePage, "utf-8"), store: false });

  // Chapter files
  const chapterFiles: { id: string; href: string; title: string }[] = [];
  for (const c of BOOK.chapters) {
    const md = readChapter(c.file);
    const body = mdToXhtml(md);
    const xhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
<meta charset="UTF-8"/>
<title>${escapeXml(c.title)}</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
<p class="chapter-num">Chapter ${c.number}</p>
<h1>${escapeXml(c.title)}</h1>
<p class="subtitle">${escapeXml(c.subtitle)}</p>
${body}
</body>
</html>`;
    const fileName = `ch${String(c.number).padStart(2, "0")}-${c.slug}.xhtml`;
    entries.push({ name: `OEBPS/${fileName}`, data: Buffer.from(xhtml, "utf-8"), store: false });
    chapterFiles.push({ id: `ch${c.number}`, href: fileName, title: c.title });
  }

  // Nav
  const navItems = chapterFiles
    .map((c) => `<li><a href="${c.href}">${escapeXml(c.title)}</a></li>`)
    .join("\n");
  const nav = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="en">
<head>
<meta charset="UTF-8"/>
<title>Contents</title>
<link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
<nav epub:type="toc" id="toc">
<h1>Contents</h1>
<ol>${navItems}</ol>
</nav>
</body>
</html>`;
  entries.push({ name: "OEBPS/nav.xhtml", data: Buffer.from(nav, "utf-8"), store: false });

  // OPF manifest
  const manifestItems = [
    `<item id="title" href="title.xhtml" media-type="application/xhtml+xml"/>`,
    `<item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>`,
    `<item id="css" href="style.css" media-type="text/css"/>`,
    ...chapterFiles.map((c) => `<item id="${c.id}" href="${c.href}" media-type="application/xhtml+xml"/>`),
  ].join("\n");
  const spineItems = [
    `<itemref idref="title"/>`,
    `<itemref idref="nav"/>`,
    ...chapterFiles.map((c) => `<itemref idref="${c.id}"/>`),
  ].join("\n");

  const opf = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" version="3.0" unique-identifier="bookid">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="bookid">urn:isbn:${escapeXml(BOOK.isbn)}</dc:identifier>
    <dc:title>${escapeXml(BOOK.title)}</dc:title>
    <dc:creator>${escapeXml(BOOK.authorName)}</dc:creator>
    <dc:language>${escapeXml(BOOK.language)}</dc:language>
    <dc:date>${escapeXml(BOOK.publishedDate)}</dc:date>
    <dc:publisher>GitDealFlow</dc:publisher>
    <dc:description>${escapeXml(BOOK.description)}</dc:description>
    <dc:rights>CC-BY-4.0</dc:rights>
    <meta property="dcterms:modified">${new Date().toISOString().slice(0, 19) + "Z"}</meta>
  </metadata>
  <manifest>
${manifestItems}
  </manifest>
  <spine>
${spineItems}
  </spine>
</package>`;
  entries.push({ name: "OEBPS/content.opf", data: Buffer.from(opf, "utf-8"), store: false });

  return buildZip(entries);
}

// ---------------------------------------------------------------------------
// Cover SVG
// ---------------------------------------------------------------------------

function buildCoverSvg(): string {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 1600" width="1200" height="1600">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#020617"/>
      <stop offset="1" stop-color="#0c1525"/>
    </linearGradient>
    <linearGradient id="accent" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0ea5e9"/>
      <stop offset="1" stop-color="#6366f1"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="1600" fill="url(#bg)"/>
  <rect x="60" y="60" width="1080" height="1480" fill="none" stroke="#1e293b" stroke-width="2"/>
  <text x="600" y="180" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" fill="#0ea5e9" font-size="28" letter-spacing="6">A FIELD MANUAL</text>
  <text x="600" y="600" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" fill="#f1f5f9" font-size="92">THE 7 GITHUB</text>
  <text x="600" y="710" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-weight="bold" fill="#f1f5f9" font-size="92">SIGNALS</text>
  <line x1="300" y1="780" x2="900" y2="780" stroke="url(#accent)" stroke-width="6"/>
  <text x="600" y="900" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" fill="#cbd5e1" font-size="46">that predict</text>
  <text x="600" y="980" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" fill="#cbd5e1" font-size="46">Series A rounds</text>
  <text x="600" y="1380" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" fill="#94a3b8" font-size="34" letter-spacing="3">${BOOK.authorName.toUpperCase()}</text>
  <text x="600" y="1430" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" fill="#64748b" font-size="22">${BOOK.authorRole}</text>
  <text x="600" y="1500" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" fill="#0ea5e9" font-size="20" letter-spacing="2">SIGNALS.GITDEALFLOW.COM/BOOK</text>
</svg>`;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  ensureOutDir();

  const md = buildMarkdown();
  fs.writeFileSync(path.join(OUT_DIR, "seven-signals.md"), md);
  console.log(`✓ wrote seven-signals.md (${(Buffer.byteLength(md) / 1024).toFixed(1)} KB)`);

  const txt = buildPlainText();
  fs.writeFileSync(path.join(OUT_DIR, "seven-signals.txt"), txt);
  console.log(`✓ wrote seven-signals.txt (${(Buffer.byteLength(txt) / 1024).toFixed(1)} KB)`);

  const pdf = buildPdf();
  fs.writeFileSync(path.join(OUT_DIR, "seven-signals.pdf"), pdf);
  console.log(`✓ wrote seven-signals.pdf (${(pdf.length / 1024).toFixed(1)} KB)`);

  const epub = buildEpub();
  fs.writeFileSync(path.join(OUT_DIR, "seven-signals.epub"), epub);
  console.log(`✓ wrote seven-signals.epub (${(epub.length / 1024).toFixed(1)} KB)`);

  const cover = buildCoverSvg();
  fs.writeFileSync(path.join(OUT_DIR, "seven-signals-cover.svg"), cover);
  console.log(`✓ wrote seven-signals-cover.svg`);

  console.log("Book artifacts generated.");
}

main();
