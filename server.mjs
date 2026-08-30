/**
 * Production server.
 *
 * The site is 19 prerendered pages plus two on-demand routes (the contact
 * endpoint and its receipt page). This file exists for one reason that is easy
 * to miss: with `@astrojs/node` in standalone mode, prerendered pages are
 * served by the adapter's own static handler and never enter the Astro app —
 * so Astro middleware cannot put security headers on them, and 18 of 19 pages
 * would ship with none. Owning the static layer here means one header block
 * covers every response, static and on-demand alike.
 *
 * The header set is not written here. It is generated into dist/headers.json
 * by scripts/build-headers.mjs, because the CSP carries per-build sha256
 * hashes for every inline script and style. Any copy maintained by hand — a
 * Traefik file, an nginx conf, a field in a dashboard — drifts the moment a
 * component changes, and the failure mode is a blank page with a console
 * error most people never look at.
 *
 * TLS is terminated by the reverse proxy in front of this (Traefik, under
 * Dokploy). This server speaks plain HTTP on purpose; it must not redirect to
 * HTTPS or handle certificates itself.
 */
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import compression from 'compression';
import { handler as astro } from './dist/server/entry.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const CLIENT = join(here, 'dist', 'client');

const HOST = process.env.HOST || '0.0.0.0';
const PORT = Number(process.env.PORT || 3000);

/** Generated at build time. A missing file means the build was incomplete. */
let headers;
try {
  headers = JSON.parse(readFileSync(join(here, 'dist', 'headers.json'), 'utf8'));
} catch (err) {
  console.error(
    'FATAL: dist/headers.json is missing. Run `npm run build` — the site must ' +
      'not serve without its security headers.',
  );
  throw err;
}

const app = express();

/* Behind Traefik. Without this, req.protocol reports http for every request
   and rate limiting would see the proxy's address rather than the client's. */
app.set('trust proxy', 1);
app.disable('x-powered-by');

/* Security headers first, so they land on static files too. Applied to every
   response including 404s and the on-demand routes.
 *
 * Two of them are withheld when the request did not arrive over HTTPS, and
 * this is not a nicety:
 *
 *   - Strict-Transport-Security over plain HTTP is meaningless by spec, and on
 *     localhost it is actively harmful. Browsers treat localhost as a secure
 *     context, so they honour the header, pin it for the full max-age, and then
 *     refuse to load http://localhost at all — for every project on the
 *     machine, not just this one, because of includeSubDomains.
 *   - upgrade-insecure-requests rewrites subresource URLs to https://, which
 *     nothing is listening for locally.
 *
 * In production Traefik terminates TLS and forwards X-Forwarded-Proto: https,
 * so both are sent exactly as before. */
const isSecure = (req) =>
  req.secure || (req.headers['x-forwarded-proto'] ?? '').split(',')[0].trim() === 'https';

app.use((req, res, next) => {
  const secure = isSecure(req);
  for (const [k, v] of Object.entries(headers.security)) {
    if (k === 'Strict-Transport-Security' && !secure) continue;
    if (k === 'Content-Security-Policy' && !secure) {
      res.setHeader(k, v.replace(/;\s*upgrade-insecure-requests/, ''));
      continue;
    }
    res.setHeader(k, v);
  }
  next();
});

/*
 * Compress everything compressible. Nothing was compressed at any layer: the
 * home page shipped 220KB of raw HTML, and across the site 2.0MB of HTML went
 * out where 440KB would do. prefetchAll multiplies it — one sweep along the
 * nav pulls ~840KB.
 *
 * This sits above the static layer so it covers prerendered files and the
 * on-demand routes alike, and it leaves already-compressed types (webp, mp4,
 * png) alone. Traefik's `compress` middleware would add brotli on top, which is
 * a further ~17%; this does not depend on it being configured.
 */
app.use(compression());

/*
 * Hand the on-demand routes an IP they can trust. Express computes req.ip from
 * X-Forwarded-For under `trust proxy`, so it is the address the proxy observed;
 * the raw header's first entry is whatever the caller wrote. The endpoint's
 * rate limiter keys on this. Overwritten, never merged, so a caller cannot
 * supply it themselves.
 */
app.use((req, _res, next) => {
  req.headers['x-groovymark-client-ip'] = req.ip ?? '';
  next();
});

/* Liveness probe for the orchestrator. Deliberately above the static layer so
   it stays cheap and never touches disk. */
app.get('/health', (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(200).type('text/plain').send('ok');
});

const cacheFor = (urlPath) => {
  if (headers.cacheExact.includes(urlPath)) return headers.cacheExactValue;
  for (const [prefix, value] of headers.cache) {
    if (urlPath.startsWith(prefix)) return value;
  }
  return null;
};

/* Static files. `redirect` is left on so /about becomes /about/ — the whole
   site's canonicals, sitemap and internal links assume the trailing slash, and
   turning this off would make every one of them a redirect. */
app.use(
  express.static(CLIENT, {
    index: 'index.html',
    redirect: true,
    dotfiles: 'ignore',
    // Astro fingerprints /_astro/, so a long TTL there is safe; everything
    // else revalidates. Values come from the same generated file.
    setHeaders: (res, filePath) => {
      const rel = '/' + filePath.slice(CLIENT.length + 1).split('\\').join('/');
      const cc = cacheFor(rel);
      if (cc) res.setHeader('Cache-Control', cc);
      else if (rel.endsWith('.html')) res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
    },
  }),
);

const notFound = join(CLIENT, '404.html');

/* The 404 page is prerendered only as dist/client/404.html, so express.static
   never matches a request for /404 or /404/. Those fell through to Astro,
   whose router matched the route, found a prerendered module with no page
   function, and threw — Express then answered 500 with an empty body and the
   server logged a stack trace on every hit. Answer them the way any other
   unknown path is answered. */
app.use(['/404', '/404/'], (_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(404).type('text/html').sendFile(notFound);
});

/* On-demand routes. Anything the static layer did not match falls through to
   Astro, which owns /api/contact and /contact/sent. */
app.use(astro);

/* Astro calls next() for a genuinely unknown path. Serve the prerendered 404
   rather than Express's default text, so a wrong URL still looks like the site. */
app.use((_req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  res.status(404).type('text/html').sendFile(notFound);
});

const server = app.listen(PORT, HOST, () => {
  console.log(`groovymark listening on http://${HOST}:${PORT}`);
});

/* Docker sends SIGTERM on stop and SIGKILLs after a grace period. Closing the
   server lets in-flight requests — including a Resend call mid-send — finish. */
for (const signal of ['SIGTERM', 'SIGINT']) {
  process.on(signal, () => {
    console.log(`${signal} received, closing`);
    server.close(() => process.exit(0));
    setTimeout(() => process.exit(1), 10_000).unref();
  });
}
