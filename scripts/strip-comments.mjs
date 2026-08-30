/**
 * Removes HTML comments from the built pages.
 *
 * Astro strips `{/* JSX comments *\/}` but ships `<!-- HTML comments -->`
 * verbatim, and this codebase comments heavily — including measurements and
 * design rationale that explain internal decisions to anyone who views source.
 * That was ~13.6 KB across the site.
 *
 * Runs before scripts/build-headers.mjs so the CSP hashes are computed from the
 * final bytes. It only touches comments OUTSIDE <script> and <style>: comments
 * inside those are JS/CSS syntax, and rewriting them would change the very
 * content the hashes cover.
 *
 * Conditional comments (`<!--[if ...]>`) are preserved, and so is anything
 * marked `<!--!` — the conventional "keep this" escape, used for licence
 * banners.
 */
import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative } from 'node:path';

const DIST = 'dist';
const CLIENT = join(DIST, 'client');
const PUBLIC = 'public';

/**
 * Files copied verbatim from public/ are left alone.
 *
 * This exists because a vendor verification file lives there — LeadIQ's
 * leadiq-verify-*.html — and stripping its comment rewrote a file a third party
 * checks byte for byte. The tokens happened to survive, but a verifier doing an
 * exact match would have failed on a file we had quietly edited. Nothing in
 * public/ is ours to rewrite; only Astro's own output is.
 */
const fromPublic = (file) =>
  file.startsWith(CLIENT) && existsSync(join(PUBLIC, relative(CLIENT, file)));

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

/** Split into alternating [markup, verbatim, markup, verbatim, ...] so script
 *  and style bodies pass through untouched. */
const SPLIT = /(<(?:script|style)\b[\s\S]*?<\/(?:script|style)>)/gi;
const COMMENT = /<!--(?!\[if)(?!!)[\s\S]*?-->/g;

let before = 0;
let after = 0;
let files = 0;

for (const file of walk(DIST)) {
  if (fromPublic(file)) continue;
  const html = readFileSync(file, 'utf8');
  const out = html
    .split(SPLIT)
    .map((part, i) => (i % 2 === 1 ? part : part.replace(COMMENT, '')))
    .join('');
  before += Buffer.byteLength(html);
  after += Buffer.byteLength(out);
  if (out !== html) files++;
  writeFileSync(file, out);
}

console.log(
  `  comments stripped from ${files} page(s) — ${(before - after).toLocaleString()} B removed`,
);
