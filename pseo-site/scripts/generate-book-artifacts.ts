/**
 * Generate the downloadable artifacts for the Seven Signals book:
 *   public/downloads/seven-signals.md   — concatenated raw markdown
 *   public/downloads/seven-signals.txt  — plain-text rendering
 *   public/downloads/seven-signals.pdf  — basic PDF (zero deps, hand-written PDF 1.4)
 *   public/downloads/seven-signals.epub — EPUB 3 (hand-rolled zip via node:zlib)
 *   public/downloads/seven-signals-cover.svg — cover art for OG / EPUB
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
// PDF (hand-rolled, zero-dep)
//
// We generate a minimal valid PDF 1.4 with one font (Helvetica core) and
// laid-out paragraphs. This is intentionally simple: word-wrap to 80 chars,
// 60-line pages, headings rendered larger. It is not a beautiful book, but
// it is a real PDF you can download, open in any reader, and print.
// ---------------------------------------------------------------------------

interface PdfTextLine {
  text: string;
  size: number; // font size in points
  bold: boolean;
  isCode: boolean;
  isHeading: boolean;
}

// 6"x9" trim — standard trade-paperback proportion. Tighter than US Letter,
// which is the right shape for a book. Tuned to land near a 100-page count.
const PAGE_WIDTH = 504; // 7"
const PAGE_HEIGHT = 720; // 10"
const MARGIN_X = 60;
const MARGIN_Y = 60;
const LINE_HEIGHT = 15;
const LINES_PER_PAGE = Math.floor((PAGE_HEIGHT - 2 * MARGIN_Y) / LINE_HEIGHT);
const BODY_WIDTH = PAGE_WIDTH - 2 * MARGIN_X;

function wrapText(text: string, charWidth: number): string[] {
  const maxChars = Math.floor(BODY_WIDTH / charWidth);
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) {
      cur = w;
      continue;
    }
    if (cur.length + 1 + w.length <= maxChars) {
      cur = cur + " " + w;
    } else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines.length ? lines : [""];
}

function chapterToPdfLines(md: string, chapterTitle: string, chapterSubtitle: string): PdfTextLine[] {
  const lines: PdfTextLine[] = [];

  // Chapter title
  lines.push({ text: chapterTitle, size: 20, bold: true, isCode: false, isHeading: true });
  lines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
  lines.push({ text: chapterSubtitle, size: 12, bold: false, isCode: false, isHeading: false });
  lines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });

  const src = md.split(/\r?\n/);
  let i = 0;
  while (i < src.length) {
    const line = src[i];
    if (line.startsWith("# ")) {
      // Skip — we use the manifest titles instead, to keep formatting consistent
      i++;
      continue;
    }
    if (line.startsWith("## ")) {
      const text = stripMarkdown(line.replace(/^## /, ""));
      lines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
      lines.push({ text, size: 14, bold: true, isCode: false, isHeading: false });
      lines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
      i++;
      continue;
    }
    if (line.startsWith("### ")) {
      const text = stripMarkdown(line.replace(/^### /, ""));
      lines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
      lines.push({ text, size: 12, bold: true, isCode: false, isHeading: false });
      i++;
      continue;
    }
    if (line.startsWith("```")) {
      i++;
      while (i < src.length && !src[i].startsWith("```")) {
        // Code lines: render as-is, monospace approximation via small font, no wrap
        const codeLine = src[i];
        // Truncate long code lines
        const truncated = codeLine.length > 90 ? codeLine.slice(0, 87) + "..." : codeLine;
        lines.push({ text: "  " + truncated, size: 9, bold: false, isCode: true, isHeading: false });
        i++;
      }
      i++;
      continue;
    }
    if (line.trim() === "") {
      lines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
      i++;
      continue;
    }
    if (/^[-*] /.test(line)) {
      const text = "  • " + stripMarkdown(line.replace(/^[-*] /, ""));
      const wrapped = wrapText(text, 6.0);
      for (const w of wrapped) {
        lines.push({ text: w, size: 11, bold: false, isCode: false, isHeading: false });
      }
      i++;
      continue;
    }
    if (/^\d+\. /.test(line)) {
      const num = line.match(/^(\d+)\. /)![1];
      const text = `  ${num}. ` + stripMarkdown(line.replace(/^\d+\. /, ""));
      const wrapped = wrapText(text, 6.0);
      for (const w of wrapped) {
        lines.push({ text: w, size: 11, bold: false, isCode: false, isHeading: false });
      }
      i++;
      continue;
    }
    if (line.includes("|") && i + 1 < src.length && /^\s*\|?[-: ]+\|/.test(src[i + 1])) {
      // Tables — render as plain pipe text, will look basic but readable
      lines.push({ text: line, size: 9, bold: false, isCode: true, isHeading: false });
      i++;
      while (i < src.length && src[i].includes("|")) {
        lines.push({ text: src[i], size: 9, bold: false, isCode: true, isHeading: false });
        i++;
      }
      continue;
    }
    if (line.startsWith("> ")) {
      const text = "    " + stripMarkdown(line.replace(/^> /, ""));
      const wrapped = wrapText(text, 6.0);
      for (const w of wrapped) {
        lines.push({ text: w, size: 11, bold: false, isCode: false, isHeading: false });
      }
      i++;
      continue;
    }

    // Paragraph
    const buf: string[] = [line];
    i++;
    while (
      i < src.length &&
      src[i].trim() !== "" &&
      !src[i].startsWith("#") &&
      !src[i].startsWith("```") &&
      !/^[-*] /.test(src[i]) &&
      !/^\d+\. /.test(src[i]) &&
      !src[i].startsWith("> ")
    ) {
      buf.push(src[i]);
      i++;
    }
    const text = stripMarkdown(buf.join(" "));
    const wrapped = wrapText(text, 6.0);
    for (const w of wrapped) {
      lines.push({ text: w, size: 11, bold: false, isCode: false, isHeading: false });
    }
    lines.push({ text: "", size: 11, bold: false, isCode: false, isHeading: false });
  }

  return lines;
}

function escapePdfString(s: string): string {
  // PDF strings escape (, ), and \. We also need to handle non-ASCII by
  // dropping or transliterating; the core 14 fonts are WinAnsiEncoding which
  // doesn't support em-dashes etc. natively. We transliterate a few common
  // ones and fall back to ASCII.
  return s
    .replace(/—/g, "--")
    .replace(/–/g, "-")
    .replace(/‘/g, "'")
    .replace(/’/g, "'")
    .replace(/“/g, '"')
    .replace(/”/g, '"')
    .replace(/…/g, "...")
    .replace(/ /g, " ")
    .replace(/[→←↑↓]/g, "->")
    .replace(/[¡-ÿ]/g, (ch) => {
      // WinAnsi 0x80-0xFF largely overlaps with Unicode 0xA0-0xFF; keep as-is via octal escape
      const code = ch.charCodeAt(0);
      return `\\${code.toString(8).padStart(3, "0")}`;
    })
    .replace(/[^\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function buildPdf(): Buffer {
  // Step 1: collect all formatted lines
  const allLines: PdfTextLine[] = [];

  // Title page
  allLines.push({ text: BOOK.title, size: 24, bold: true, isCode: false, isHeading: true });
  allLines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: BOOK.subtitle, size: 14, bold: false, isCode: false, isHeading: false });
  for (let k = 0; k < 10; k++) allLines.push({ text: "", size: 12, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: `By ${BOOK.authorName}`, size: 12, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: BOOK.authorRole, size: 11, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: "", size: 11, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: `${BOOK.edition} · ${BOOK.publishedDate}`, size: 10, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: `ISBN ${BOOK.isbn} · CC-BY-4.0`, size: 10, bold: false, isCode: false, isHeading: false });
  allLines.push({ text: `signals.gitdealflow.com/book`, size: 10, bold: false, isCode: false, isHeading: false });

  // Pad title page
  while (allLines.length < LINES_PER_PAGE) {
    allLines.push({ text: "", size: 11, bold: false, isCode: false, isHeading: false });
  }

  // Chapters
  for (const c of BOOK.chapters) {
    const md = readChapter(c.file);
    const cLines = chapterToPdfLines(md, c.title, c.subtitle);
    // Pad to start each chapter on a new page
    const remainder = allLines.length % LINES_PER_PAGE;
    if (remainder !== 0) {
      const padCount = LINES_PER_PAGE - remainder;
      for (let k = 0; k < padCount; k++) {
        allLines.push({ text: "", size: 11, bold: false, isCode: false, isHeading: false });
      }
    }
    allLines.push(...cLines);
  }

  // Step 2: paginate
  const pages: PdfTextLine[][] = [];
  for (let i = 0; i < allLines.length; i += LINES_PER_PAGE) {
    pages.push(allLines.slice(i, i + LINES_PER_PAGE));
  }

  // Step 3: emit PDF
  const objects: string[] = [];
  // Object 1: Catalog
  objects.push("<< /Type /Catalog /Pages 2 0 R >>");
  // Object 2: Pages (placeholder; fill in after we know page count)
  // We'll use object IDs starting 4 for pages (3 = font)
  const pageObjStart = 4;
  const pageObjIds: number[] = pages.map((_, idx) => pageObjStart + idx * 2);
  const contentObjIds: number[] = pages.map((_, idx) => pageObjStart + idx * 2 + 1);
  const kids = pageObjIds.map((id) => `${id} 0 R`).join(" ");
  objects.push(
    `<< /Type /Pages /Count ${pages.length} /Kids [ ${kids} ] /MediaBox [ 0 0 ${PAGE_WIDTH} ${PAGE_HEIGHT} ] /Resources << /Font << /F1 3 0 R /F2 ${pageObjStart + pages.length * 2} 0 R /F3 ${pageObjStart + pages.length * 2 + 1} 0 R >> >> >>`,
  );
  // Object 3: Helvetica
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica /Encoding /WinAnsiEncoding >>");
  // Pages and content streams
  for (let p = 0; p < pages.length; p++) {
    const pageLines = pages[p];
    const pageId = pageObjIds[p];
    const contentId = contentObjIds[p];
    objects.push(
      `<< /Type /Page /Parent 2 0 R /Contents ${contentId} 0 R >>`,
    );

    // Content stream
    const ops: string[] = [];
    ops.push("BT");
    let y = PAGE_HEIGHT - MARGIN_Y;
    let lastSize = 11;
    let lastFont = "F1";
    ops.push(`/F1 11 Tf`);
    ops.push(`${MARGIN_X} ${y} Td`);
    let firstLine = true;
    for (const ln of pageLines) {
      if (!firstLine) {
        ops.push(`0 -${LINE_HEIGHT} Td`);
      }
      firstLine = false;
      const desiredFont = ln.isCode ? "F3" : ln.bold ? "F2" : "F1";
      if (desiredFont !== lastFont || ln.size !== lastSize) {
        ops.push(`/${desiredFont} ${ln.size} Tf`);
        lastFont = desiredFont;
        lastSize = ln.size;
      }
      const safe = escapePdfString(ln.text);
      ops.push(`(${safe}) Tj`);
    }
    ops.push("ET");
    const stream = ops.join("\n");
    objects.push(
      `<< /Length ${Buffer.byteLength(stream, "binary")} >>\nstream\n${stream}\nendstream`,
    );
  }
  // Bold + monospace fonts (after all pages so IDs match)
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold /Encoding /WinAnsiEncoding >>");
  objects.push("<< /Type /Font /Subtype /Type1 /BaseFont /Courier /Encoding /WinAnsiEncoding >>");

  // Step 4: serialize
  const buffers: Buffer[] = [];
  let offset = 0;
  const pushBuf = (s: string) => {
    const buf = Buffer.from(s, "binary");
    buffers.push(buf);
    offset += buf.length;
  };
  const offsets: number[] = [0]; // object 0 is the free object

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
  pushBuf(
    `trailer\n<< /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  );

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
  // importing the lib — this is build-only.
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
