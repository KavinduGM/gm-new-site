/**
 * Per-article Open Graph images.
 *
 * Each insight has a bespoke cover, but the covers are SVG and every social
 * platform rejects SVG for og:image — so all five articles were sharing the
 * generic og-default.png and their share cards were indistinguishable from each
 * other and from the home page. Google's structured-data image property rejects
 * SVG too, which is why BlogPosting had no `image` at all.
 *
 * This rasterises each cover to a 1200x630 PNG. Runs as part of `npm run build`
 * so the PNGs cannot go stale when a cover is edited — the whole point of doing
 * it here rather than by hand.
 *
 * Covers are 1600x800 (2:1) and OG is 1200x630 (1.905:1), so `cover` crops
 * ~15px from each side rather than letterboxing. The covers have generous
 * margins; nothing meaningful sits that close to the edge.
 */
import { readdirSync, mkdirSync, writeFileSync, statSync } from 'node:fs';
import { join } from 'node:path';

import sharp from 'sharp';

const SRC = 'public/insights/covers';
const OUT = 'public/insights/og';

const W = 1200;
const H = 630;

mkdirSync(OUT, { recursive: true });

const covers = readdirSync(SRC).filter((f) => f.endsWith('.svg'));
let written = 0;
let bytes = 0;

for (const file of covers) {
  const slug = file.replace(/\.svg$/, '');
  const out = join(OUT, `${slug}.png`);

  // density lifts the rasterisation resolution before the downscale, so the
  // gradients and hairlines in the covers do not band.
  const buf = await sharp(join(SRC, file), { density: 200 })
    .resize(W, H, { fit: 'cover', position: 'centre' })
    .png({ palette: true, quality: 90, effort: 8 })
    .toBuffer();

  writeFileSync(out, buf);
  written += 1;
  bytes += buf.length;
}

console.log(
  `  og images written — ${written} article cards at ${W}x${H}, ${(bytes / 1024).toFixed(0)} KB total`,
);

// Fail loudly rather than silently shipping stale cards.
for (const file of covers) {
  const slug = file.replace(/\.svg$/, '');
  const png = join(OUT, `${slug}.png`);
  if (statSync(png).mtimeMs < statSync(join(SRC, file)).mtimeMs) {
    throw new Error(`${png} is older than its source cover — rasterisation failed`);
  }
}
