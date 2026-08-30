/**
 * Generates dist/_headers after every build.
 *
 * Runs post-build on purpose: the CSP hashes are computed from the *built*
 * HTML, so they can never drift from what actually ships. Edit a script or a
 * component's styles and the next build re-hashes it automatically.
 *
 * Format is Netlify / Cloudflare Pages `_headers`. For Vercel, translate the
 * same list into vercel.json "headers"; for nginx, into add_header lines.
 */
import { createHash } from 'node:crypto';
import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';

const walk = (dir) =>
  readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : p.endsWith('.html') ? [p] : [];
  });

const sha = (s) => `'sha256-${createHash('sha256').update(s, 'utf8').digest('base64')}'`;

const scripts = new Set();
const styles = new Set();

for (const file of walk(DIST)) {
  const html = readFileSync(file, 'utf8');
  // Inline <script> only: skip src= (covered by 'self') and JSON-LD, which is
  // data rather than an executable script and is not hashed by browsers.
  for (const [, body] of html.matchAll(
    /<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  )) scripts.add(sha(body));
  for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) styles.add(sha(body));
}

/*
 * On-demand routes never exist as .html, so walk() cannot see them and their
 * inline CSS was never hashed. Because style-src-elem is present it takes
 * precedence over the style-src 'unsafe-inline' fallback in every browser that
 * supports it — so /contact/sent/ was serving a <style> block the browser
 * refused to apply, and the page every no-JS submitter lands on rendered as
 * raw unstyled HTML.
 *
 * Render them through the built handler so their assets are hashed like any
 * other page. Port 0 picks a free one, so this cannot collide with a dev
 * server someone has running.
 */
const ON_DEMAND = ['/contact/sent/'];

const express = (await import('express')).default;
const { handler } = await import('../dist/server/entry.mjs');
const probe = express().use(handler).listen(0, '127.0.0.1');
await new Promise((resolve) => probe.once('listening', resolve));
const base = `http://127.0.0.1:${probe.address().port}`;

for (const route of ON_DEMAND) {
  const html = await (await fetch(base + route)).text();
  for (const [, body] of html.matchAll(
    /<script(?![^>]*\bsrc=)(?![^>]*ld\+json)[^>]*>([\s\S]*?)<\/script>/g,
  )) scripts.add(sha(body));
  for (const [, body] of html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)) styles.add(sha(body));
}
probe.close();

const csp = [
  "default-src 'self'",
  // No 'unsafe-inline': every inline script on the site is hashed above, so an
  // injected one would not run even if the host were compromised.
  // The analytics tracker is an external script on the CRM host. Everything else
  // is 'self' plus per-build hashes; this is the only third-party origin allowed
  // to execute, and it only ever loads after the visitor allows analytics.
  `script-src 'self' https://crm.groovymark.com ${[...scripts].join(' ')}`,
  // style-src-elem is hash-locked. style-src-attr must stay 'unsafe-inline'
  // because the page uses style="--i:N" custom properties for stagger delays,
  // and attributes cannot be hashed. Removing those three attributes in favour
  // of :nth-child() rules would let this tighten to 'none'.
  `style-src-elem 'self' ${[...styles].join(' ')}`,
  "style-src-attr 'unsafe-inline'",
  // Legacy fallback for browsers without the -elem/-attr split.
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self'",
  "media-src 'self'",
  "font-src 'self'",
  // The cookie consent banner posts choices to the CRM and reads the banner
  // config from it. Without this the fetch is blocked by CSP and the banner
  // silently never renders — no error the visitor or we would ever see.
  "connect-src 'self' https://crm.groovymark.com",
  // The contact form posts off-origin; nothing else may.
  // The enquiry form posts to /api/contact on this origin; Formspree is gone.
  "form-action 'self'",
  "frame-ancestors 'none'",
  "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  'upgrade-insecure-requests',
].join('; ');

/**
 * One definition of the security header set, consumed twice below.
 *
 * server.mjs reads the JSON copy and applies these to EVERY response —
 * static and on-demand alike. That indirection exists because the CSP
 * carries per-build sha256 hashes: any header set maintained by hand
 * (a Traefik file, an nginx conf, a Dokploy field) drifts the moment a
 * component's inline script changes, and the failure is a blank page.
 */
const SECURITY = {
  'Content-Security-Policy': csp,
  'X-Content-Type-Options': 'nosniff',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy':
    'accelerometer=(), autoplay=(), camera=(), display-capture=(), encrypted-media=(), fullscreen=(self), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), midi=(), payment=(), usb=(), interest-cohort=()',
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
  'X-Frame-Options': 'DENY',
  'Cross-Origin-Opener-Policy': 'same-origin',
  'Cross-Origin-Resource-Policy': 'same-origin',
};

/** Path prefix -> Cache-Control. Order matters: first match wins. */
const CACHE = [
  // Fingerprinted by Astro — safe to cache forever.
  ['/_astro/', 'public, max-age=31536000, immutable'],
  // These keep their names across deploys, so revalidate rather than pin.
  ['/case/', 'public, max-age=86400, must-revalidate'],
  ['/compare/', 'public, max-age=86400, must-revalidate'],
  ['/logos/', 'public, max-age=86400, must-revalidate'],
  // These three had no rule and fell through to max-age=0, so 287KB — most of
  // it /about/'s story and team images — revalidated on every single page view.
  // Their names are as stable across deploys as /case/ and /logos/.
  ['/story/', 'public, max-age=86400, must-revalidate'],
  ['/team/', 'public, max-age=86400, must-revalidate'],
  ['/insights/covers/', 'public, max-age=86400, must-revalidate'],
  ['/insights/og/', 'public, max-age=86400, must-revalidate'],
];

/** Exact paths that keep their name across deploys. */
const CACHE_EXACT = [
  '/logo.png',
  '/og-default.png',
  '/icon.svg',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/icon-192.png',
  '/icon-512.png',
  '/site.webmanifest',
];
const CACHE_EXACT_VALUE = 'public, max-age=86400, must-revalidate';

/* ---- 1. dist/headers.json — what server.mjs actually serves ---- */
writeFileSync(
  join(DIST, 'headers.json'),
  JSON.stringify({ security: SECURITY, cache: CACHE, cacheExact: CACHE_EXACT, cacheExactValue: CACHE_EXACT_VALUE }, null, 2),
);

/* ---- 2. dist/_headers — Netlify/Cloudflare format ----
   Inert on the current VPS host, which serves headers from server.mjs. Kept
   so that moving to Netlify or Cloudflare Pages needs no new work, and so the
   two can be diffed against each other. */
const block = (path, pairs) =>
  `${path}\n${pairs.map(([k, v]) => `  ${k}: ${v}`).join('\n')}\n`;

const headers =
  `# Generated by scripts/build-headers.mjs — do not edit by hand.\n` +
  `# NOTE: only read by Netlify / Cloudflare Pages. The production host runs\n` +
  `# server.mjs, which reads headers.json instead.\n` +
  block('/*', Object.entries(SECURITY)) +
  '\n' +
  CACHE.map(([p, v]) => block(`${p}*`, [['Cache-Control', v]])).join('') +
  CACHE_EXACT.map((p) => block(p, [['Cache-Control', CACHE_EXACT_VALUE]])).join('');

writeFileSync(join(DIST, '_headers'), headers);
console.log(
  `  _headers written — ${scripts.size} script hashes, ${styles.size} style hashes`,
);
