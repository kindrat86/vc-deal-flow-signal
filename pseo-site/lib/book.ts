import "server-only";
import * as fs from "fs";
import * as path from "path";
import { BOOK, type BookChapter, type BookManifest } from "@/content/book/manifest";

export { BOOK };
export type { BookChapter, BookManifest };

const CHAPTER_DIR = path.join(process.cwd(), "content", "book", "chapters");

const _cache = new Map<string, string>();

/**
 * Read raw markdown for a chapter from disk. Cached in-process for build
 * performance; chapters are static so the cache never invalidates.
 */
export function getChapterMarkdown(chapter: BookChapter): string {
  if (_cache.has(chapter.file)) return _cache.get(chapter.file)!;
  const full = path.join(CHAPTER_DIR, chapter.file);
  const md = fs.readFileSync(full, "utf-8");
  _cache.set(chapter.file, md);
  return md;
}

export function getChapterBySlug(slug: string): BookChapter | undefined {
  return BOOK.chapters.find((c) => c.slug === slug);
}

export function nextChapter(slug: string): BookChapter | undefined {
  const i = BOOK.chapters.findIndex((c) => c.slug === slug);
  if (i < 0 || i >= BOOK.chapters.length - 1) return undefined;
  return BOOK.chapters[i + 1];
}

export function prevChapter(slug: string): BookChapter | undefined {
  const i = BOOK.chapters.findIndex((c) => c.slug === slug);
  if (i <= 0) return undefined;
  return BOOK.chapters[i - 1];
}

/**
 * Convert one of our markdown chapters to safe HTML. We deliberately do NOT
 * use a heavy markdown library, our chapters are written in a constrained
 * dialect (paragraphs, headings 1-3, ordered + unordered lists, fenced code,
 * inline code, bold, italic, blockquote). Hand-rolling the renderer keeps the
 * runtime dep surface zero and makes the print/PDF generators trivially
 * compatible.
 */
export function renderChapterHtml(md: string): string {
  const lines = md.split(/\r?\n/);

  // Every chapter md starts with `# <Title>`, and BOTH call sites
  // (/book/read/[chapter] and /book/print) render chapter.title from the
  // manifest as the page/section heading. Rendering the md H1 too produced
  // two H1s per chapter page (heading-hierarchy audit 2026-08-15), so the
  // leading H1 line is dropped here. H2/H3 in the md are kept as-is.
  let first = 0;
  while (first < lines.length && lines[first].trim() === "") first++;
  if (first < lines.length && /^# /.test(lines[first])) {
    lines.splice(first, 1);
  }

  const out: string[] = [];
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];

    // Fenced code block
    if (line.startsWith("```")) {
      const lang = line.slice(3).trim();
      const buf: string[] = [];
      i++;
      while (i < lines.length && !lines[i].startsWith("```")) {
        buf.push(lines[i]);
        i++;
      }
      i++; // skip closing fence
      out.push(
        `<pre class="book-code"><code data-lang="${escapeAttr(lang)}">${escapeHtml(
          buf.join("\n"),
        )}</code></pre>`,
      );
      continue;
    }

    // Heading
    if (/^#{1,3} /.test(line)) {
      const level = line.match(/^(#{1,3}) /)![1].length;
      const text = inlineFormat(line.replace(/^#{1,3} /, ""));
      out.push(`<h${level} class="book-h${level}">${text}</h${level}>`);
      i++;
      continue;
    }

    // Blank line
    if (line.trim() === "") {
      i++;
      continue;
    }

    // Unordered list
    if (/^[-*] /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*] /.test(lines[i])) {
        items.push(`<li>${inlineFormat(lines[i].replace(/^[-*] /, ""))}</li>`);
        i++;
      }
      out.push(`<ul class="book-ul">${items.join("")}</ul>`);
      continue;
    }

    // Ordered list
    if (/^\d+\. /.test(line)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\. /.test(lines[i])) {
        items.push(`<li>${inlineFormat(lines[i].replace(/^\d+\. /, ""))}</li>`);
        i++;
      }
      out.push(`<ol class="book-ol">${items.join("")}</ol>`);
      continue;
    }

    // Markdown table (very simple: header row | sep row | body rows)
    if (line.includes("|") && i + 1 < lines.length && /^\s*\|?[-: ]+\|/.test(lines[i + 1])) {
      const headerCells = splitRow(line);
      i += 2; // skip header + separator
      const bodyRows: string[][] = [];
      while (i < lines.length && lines[i].includes("|")) {
        bodyRows.push(splitRow(lines[i]));
        i++;
      }
      const thead = `<thead><tr>${headerCells.map((c) => `<th>${inlineFormat(c)}</th>`).join("")}</tr></thead>`;
      const tbody = `<tbody>${bodyRows
        .map((r) => `<tr>${r.map((c) => `<td>${inlineFormat(c)}</td>`).join("")}</tr>`)
        .join("")}</tbody>`;
      out.push(`<table class="book-table">${thead}${tbody}</table>`);
      continue;
    }

    // Blockquote
    if (line.startsWith("> ")) {
      const buf: string[] = [];
      while (i < lines.length && lines[i].startsWith("> ")) {
        buf.push(lines[i].slice(2));
        i++;
      }
      out.push(`<blockquote class="book-quote">${inlineFormat(buf.join(" "))}</blockquote>`);
      continue;
    }

    // Paragraph: collect contiguous non-blank, non-special lines
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
    out.push(`<p class="book-p">${inlineFormat(buf.join(" "))}</p>`);
  }
  return out.join("\n");
}

function splitRow(line: string): string[] {
  let s = line.trim();
  if (s.startsWith("|")) s = s.slice(1);
  if (s.endsWith("|")) s = s.slice(0, -1);
  return s.split("|").map((c) => c.trim());
}

function inlineFormat(text: string): string {
  let s = escapeHtml(text);
  // Inline code
  s = s.replace(/`([^`]+)`/g, '<code class="book-inline-code">$1</code>');
  // Bold
  s = s.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
  // Italic (single asterisk or underscore around text without spaces leading)
  s = s.replace(/(^|[^*])\*([^*\n]+)\*/g, "$1<em>$2</em>");
  // Links [text](href)
  s = s.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    (_m, label: string, href: string) =>
      `<a href="${escapeAttr(href)}" class="book-link">${label}</a>`,
  );
  return s;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function escapeAttr(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}

/**
 * Strip HTML to plain-text for the .txt download artifact. Preserves block
 * structure (paragraphs separated by blank lines) but drops all tags.
 */
export function chapterToPlainText(chapter: BookChapter): string {
  const md = getChapterMarkdown(chapter);
  // Markdown is already mostly plain, strip just the inline code/bold/italic
  // tokens, keep headings prefixed with # so a reader can still see structure.
  return md
    .replace(/`([^`]+)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/(^|[^*])\*([^*\n]+)\*/g, "$1$2")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1 ($2)")
    .replace(/```[\s\S]*?```/g, (block) => {
      // Indent code blocks for readability in plain text
      return block
        .split(/\r?\n/)
        .filter((l) => !l.startsWith("```"))
        .map((l) => "    " + l)
        .join("\n");
    });
}
