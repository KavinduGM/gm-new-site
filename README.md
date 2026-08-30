# groovymark.com

Marketing site for GroovyMark — custom AI content production and publishing
systems, built to hand over or run as a managed service.

Astro 5, hand-written CSS, no UI framework and no webfonts. Nineteen pages are
prerendered at build time; three routes render on demand (the enquiry endpoint,
its receipt page, and the Resend delivery webhook), served by a small Express
wrapper.

---

## Quick start

```bash
npm install
npm run dev      # http://localhost:4321 — Astro dev server
npm run build    # → dist/client (pages) + dist/server (on-demand routes)
npm start        # → http://localhost:3000 — production server, serves dist/
```

`npm run dev` will not exercise the enquiry form or the security headers. For
anything involving either, build and run `npm start`.

Two environment variables are needed for the form to deliver — see
[`.env.example`](.env.example) and [`DEPLOY.md`](DEPLOY.md).

---

## How it is put together

| Path | What it is |
| --- | --- |
| `src/pages/` | Routes. `api/contact.js`, `api/resend-webhook.js` and `contact/sent.astro` set `prerender = false`; everything else is static. |
| `src/data/` | All site copy and figures. Nothing is hard-coded in a template. |
| `src/site.config.mjs` | Brand, contact addresses, social profiles, company registration. One source of truth. |
| `src/lib/` | Structured data, lead schema and validation, the Resend transport, the two email templates. |
| `src/styles/` | Tokens, base, primitives. Everything else is component-scoped. |
| `scripts/` | Build steps and asset generation — see below. |
| `server.mjs` | Production server: security headers, static serving, then the Astro handler. |
| `brand-source/` | Master artwork. Never served; `public/` is generated from it. |

### Build pipeline

`npm run build` runs four steps in order, and the order matters:

1. **`scripts/build-og-images.mjs`** — rasterises the five article covers to
   1200x630 PNGs. Runs *first*, because `astro build` copies `public/` into
   `dist/client`; produced after, the cards would never reach the output.
2. **`astro build`** — pages into `dist/client`, on-demand routes into `dist/server`.
3. **`scripts/strip-comments.mjs`** — removes HTML comments from the output.
   Astro strips `{/* JSX */}` comments but ships `<!-- HTML -->` ones verbatim,
   and this codebase comments heavily with measurements and rationale.
4. **`scripts/build-headers.mjs`** — writes `dist/headers.json` (what
   `server.mjs` serves) and `dist/_headers` (Netlify/Cloudflare format, inert on
   the current host). The CSP carries a per-build sha256 for every inline script
   and style, which is why it must run *after* the comment stripper.

### Asset generation

Run by hand, not part of `npm run build`:

```bash
python3 scripts/build-brand-assets.py   # logo, favicon, icons, OG image, from brand-source/
python3 scripts/build-covers.py         # the five article cover SVGs
python3 scripts/optimise-images.py      # re-encodes from brand-source/raster-sources/
```

Never re-encode a file in `public/` — always regenerate from `brand-source/`.

---

## Things worth knowing before you change something

Each of these looks wrong until you know why, and each has broken before:

- **`@astrojs/node` is in `middleware` mode, not `standalone`.** Standalone
  serves prerendered pages from its own static handler, which never enters the
  Astro app — so Astro middleware cannot set headers on them, and 18 of 19 pages
  would ship with no CSP at all. `server.mjs` owns static serving for this
  reason.
- **`security.allowedDomains` in `astro.config.mjs` is load-bearing.** Without
  it every production form POST returns 403, and it cannot be reproduced on
  localhost. See §6 of `DEPLOY.md`.
- **A `200` from Resend means accepted, not delivered.** A suppressed recipient
  returns the same `200` and message id for a message that is never sent, so
  `api/contact.js` cannot tell the difference and the visitor is thanked for an
  enquiry nobody will see. `api/resend-webhook.js` exists solely to make that
  loud. It needs `RESEND_WEBHOOK_SECRET`; without it, it refuses everything.
- **Resend sends as `email.groovymark.com`; Titan receives for
  `groovymark.com`.** `RESEND_FROM` must be at the first — the apex is not a
  verified sending domain and returns 403. See §1 of `DEPLOY.md`.
- **HSTS is withheld over plain HTTP on purpose.** Browsers treat `localhost` as
  a secure context, so sending it there pins HTTPS for a year and breaks every
  local dev server on the machine. See §5b of `DEPLOY.md`.
- **URLs carry a trailing slash everywhere.** `build.format: 'directory'`, so
  `/about/` is what the host serves without a redirect. Canonicals, the sitemap
  and internal links must all agree.
- **Design tokens are `--font-mono` / `--font-sans`,** not `--ff-*`. CSS
  variables fail silently, so a typo just renders as inherited type.
- **`/legal/*` is excluded from the sitemap but is crawlable.** Deliberate.
- **`robots.txt` allows ~20 AI crawlers.** Also deliberate.

---

## Content rules

The site does not publish a number it cannot show the working for.

- No invented statistics, client names, testimonials, logos or case studies.
- No SOC 2 or ISO 27001 claims — neither has been done.
- The AI vendor is not named publicly.
- Clients receive the running system and its credentials, never the source.
- Figures come from `src/data/`, and each carries a comment saying where it came
  from. If a number cannot be sourced, it does not go on the page.

---

## Deploying

Hostinger VPS → Dokploy → Docker. Full instructions, including the Resend domain
verification and the Dokploy health check, are in **[`DEPLOY.md`](DEPLOY.md)**.

```bash
docker compose up --build     # reproduces production locally
```

---

## Still outstanding

- `src/pages/legal/terms.astro` has no governing-law clause — removed
  deliberately, pending a decision. Without one, jurisdiction falls to default
  conflict-of-law rules, which usually favours the customer's country.
- The legal pages carry a "not reviewed by a lawyer" callout. It should stay
  until one has read them.
- Nothing else outstanding on the build. `scripts/build-og-images.mjs` now
  rasterises each cover to a 1200x630 PNG at build time, so every article has its
  own share card and `BlogPosting.image`.
