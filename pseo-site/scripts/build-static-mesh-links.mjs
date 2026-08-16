import { readFileSync, writeFileSync, existsSync, mkdirSync, copyFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const manifest = JSON.parse(
  readFileSync(join(ROOT, "data", "static-mesh-links.json"), "utf8"),
);

const M_START = "<!--MESH:v2:START-->";
const M_END = "<!--MESH:v2:END-->";
const BLOCK_RE = new RegExp(M_START + "[\\s\\S]*?" + M_END + "\\s*", "g");

function decode(s) {
  return s
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

// Serving file for a path: dir/index.html wins, else the flat .html. Flat-only
// pages (legacy sectors, guide) get their dir created from the flat so the
// clean URL serves.
function servingFile(path) {
  const rel = path.replace(/^\//, "");
  const dirFile = join(ROOT, "public", rel, "index.html");
  if (existsSync(dirFile)) return { file: dirFile, created: false };
  const flat = join(ROOT, "public", rel + ".html");
  if (existsSync(flat)) {
    const dir = join(ROOT, "public", rel);
    mkdirSync(dir, { recursive: true });
    const target = join(dir, "index.html");
    copyFileSync(flat, target);
    return { file: target, created: true };
  }
  return null;
}

function labelFor(href) {
  const found = servingFile(href);
  if (found) {
    const src = readFileSync(found.file, "utf8");
    const m = src.match(/<title>([\s\S]*?)<\/title>/i);
    if (m) {
      const label = decode(m[1].replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim());
      if (label) return label;
    }
  }
  const slug = href.replace(/\/+$/, "").split("/").pop() || href;
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function buildBlock(hrefs) {
  const items = hrefs
    .map((h) => `<li><a href="${h}">${labelFor(h)}</a></li>`)
    .join("");
  const block = `${M_START}
<section class="mesh-links" data-mesh="v2" style="background:#f9fafb;padding:1.25rem;border-radius:.5rem;margin-top:2rem">
<style>@media(max-width:640px){.mesh-links ul{grid-template-columns:1fr}}</style>
<h2 style="margin-top:0;font-size:1.1rem">Related resources</h2>
<ul style="list-style:none;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:.4rem 1rem;font-size:.95rem">${items}</ul>
</section>
${M_END}`;
  if (/[—–]/.test(block)) {
    throw new Error(`em/en dash inside mesh block (target hrefs: ${hrefs.join(", ")})`);
  }
  return block;
}

let injected = 0, changed = 0, created = 0, skipped = 0;
for (const [path, hrefs] of Object.entries(manifest)) {
  const target = servingFile(path);
  if (!target) {
    console.error(`SKIP: no file for ${path}`);
    skipped += 1;
    continue;
  }
  if (target.created) created += 1;
  let src = readFileSync(target.file, "utf8");
  const original = src;
  if (src.includes(M_START)) src = src.replace(BLOCK_RE, "");
  if (!src.includes("</body>")) {
    console.error(`SKIP: no </body> in ${target.file}`);
    skipped += 1;
    continue;
  }
  const block = buildBlock(hrefs);
  const next = src.replace("</body>", block + "</body>");
  if (next !== original) {
    writeFileSync(target.file, next);
    changed += 1;
  }
  injected += 1;
}
console.log(
  `mesh injector: ${injected} targets | ${changed} changed | ${created} dirs created | ${skipped} skipped`,
);
