# Deploying groovymark.com

Hostinger VPS → Dokploy → Docker. The site is 19 prerendered pages plus two
on-demand routes (`/api/contact` and `/contact/sent/`), served by `server.mjs`
behind Dokploy's Traefik.

---

## 1. Verify the sending domain in Resend

**Resend verifies domains, not individual sender addresses.** Once
`groovymark.com` is verified you can send from any address at it, and you do not
need to "create" `hello@` anywhere.

1. https://resend.com/domains → **Add Domain** → `groovymark.com`
2. Add the DNS records it gives you (SPF, DKIM, and DMARC) at your DNS host
3. Wait for the status to read **Verified**

Two traps:

- **A subdomain is not covered by the parent.** Verifying `mail.groovymark.com`
  does *not* authorise `from: hello@groovymark.com`. The domain in `RESEND_FROM`
  must match the verified domain exactly.
- **`onboarding@resend.dev` only sends to your own account address.** Using it
  as a `from` works in a quick test and then returns 403 the moment a real
  recipient is involved.

Sending from an unverified domain returns **403** and the mail is not sent. The
form surfaces this as "We could not deliver that one" rather than pretending it
worked.

---

## 2. Environment variables

Dokploy → your app → **Environment** tab. These are runtime container variables,
which is exactly what `server.mjs` reads.

```
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM=GroovyMark <hello@groovymark.com>
```

Optional:

```
LEADS_TO=leads@groovymark.com     # defaults to SITE.leadsEmail when unset
```

Three things to get right:

- **Do not use Build Arguments for the API key.** Build args are readable in
  `docker history`. Environment-tab values are also *not* available during
  `docker build`, so it would not work anyway.
- **Never prefix any of these with `PUBLIC_`.** Astro inlines `PUBLIC_*` into the
  browser bundle, which would publish the key to every visitor.
- Dokploy stores Environment values in its own database, readable by anyone with
  dashboard access. If that matters, use its vault referencing instead:
  `${{vault.<vault>.<path>:<key>}}`.

---

## 3. Domain and port

Dokploy → your app → **Domains**

| Field | Value |
| --- | --- |
| Host | `groovymark.com` |
| Container Port | `3000` |
| HTTPS | on |
| Certificate | Let's Encrypt |

- **Point DNS at the VPS before adding the domain**, or the HTTP-01 challenge
  fails and no certificate is issued.
- Open **80 and 443 in Hostinger's own panel firewall as well as `ufw`** — they
  are separate layers and the panel one is the one that gets missed. Do not
  open 3000.
- **Leave Advanced → Ports empty.** That section publishes host ports and can
  interfere with Traefik routing; it is not needed when routing by domain.
- Traefik terminates TLS and forwards plain HTTP. `server.mjs` serves HTTP on
  purpose — it must not redirect to HTTPS or handle certificates.

---

## 4. Health check and update policy

Dokploy → **Advanced → Swarm Settings**. Durations are in **nanoseconds**;
getting this wrong by three orders of magnitude is a self-inflicted outage.

Health Check:

```json
{
  "Test": ["CMD", "node", "-e", "fetch('http://127.0.0.1:3000/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"],
  "Interval": 30000000000,
  "Timeout": 5000000000,
  "StartPeriod": 20000000000,
  "Retries": 3
}
```

Do **not** use the `curl` form from Dokploy's own example — `node:alpine` has no
`curl`, the check would fail forever, and with `FailureAction: rollback` every
deploy would roll back.

Update Config:

```json
{ "Parallelism": 1, "Delay": 10000000000, "FailureAction": "rollback", "Order": "start-first" }
```

---

## 4b. If the Docker build fails

The image was reviewed but **not built** — Docker is not installed on the machine
this was developed on, so the first real `docker build` happens on your VPS. Two
things are the likely candidates if it fails:

- **sharp.** The build rasterises the article covers with it. sharp 0.34 ships
  prebuilt musl binaries and `package-lock.json` carries the `linuxmusl` x64 and
  arm64 variants, so `npm ci` should resolve them. If it cannot load, add
  `apk add --no-cache vips` to the deps stage rather than removing the
  `build-og-images` step — without it every article shares one share card.
- **Build order.** `npm run build` runs `build-og-images.mjs` *before*
  `astro build`, because Astro copies `public/` into `dist/client` during the
  build. Reordering silently ships a site with no article share cards.

What *was* verified locally: the production dependency tree installs cleanly with
`--omit=dev`, and `server.mjs` running against it serves every page type, the
on-demand routes, correct 404s and all eight security headers with zero startup
errors.

---

## 5. Security headers — read this before changing the server

All eight security headers, **including the CSP**, are applied by `server.mjs`
from `dist/headers.json`, which `scripts/build-headers.mjs` generates during the
build.

This is not where you would expect them, and the reason matters:

- The CSP carries a **per-build `sha256` hash for every inline script and style**
  on the site. Any copy of it maintained by hand — a Traefik file, an nginx
  conf, a dashboard field — drifts the moment a component changes, and the
  failure mode is a blank page.
- `@astrojs/node` is deliberately in **`middleware` mode**, not `standalone`. In
  standalone mode the adapter serves prerendered pages from its own static
  handler, which never enters the Astro app, so Astro middleware **cannot** put
  headers on them — 18 of the 19 pages would ship with none while the one
  dynamic route tested fine.

If you ever add Traefik-level headers as belt-and-braces, add the static ones
(HSTS, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`,
`X-Content-Type-Options`) and **leave the CSP to the app**.

`dist/_headers` is still generated in Netlify/Cloudflare format. It is inert on
this host and exists only so moving to either needs no new work.

---

## 5b. HSTS is withheld over plain HTTP, on purpose

`server.mjs` sends `Strict-Transport-Security` and the CSP's
`upgrade-insecure-requests` **only when the request arrived over HTTPS**
(`req.secure`, or `X-Forwarded-Proto: https` from Traefik). Production is
unaffected.

Do not "fix" this by sending them unconditionally. Browsers treat `localhost`
as a secure context, so they honour an HSTS header received there, pin it for
the full `max-age` (a year), and then refuse to load `http://localhost` at
all — and because the header carries `includeSubDomains`, that breaks **every**
local dev server on the machine, not just this one.

If a browser has already pinned it, clear it:

- **Chrome / Edge / Brave** — open `chrome://net-internals/#hsts`, put
  `localhost` into *Delete domain security policies*, press Delete.
- **Firefox** — History → clear, or right-click the site in History →
  *Forget About This Site*.
- **Safari** — Develop → Empty Caches, then remove the site under
  Settings → Privacy → Manage Website Data.

---

## 6. Why `security.allowedDomains` is in astro.config.mjs

Do not remove it. Without it **every production form POST returns 403**
"Cross-site POST form submissions are forbidden", and it cannot be reproduced on
localhost.

Astro's `checkOrigin` compares the `Origin` header against `url.origin`. Since
Astro 5.14.2, `validateHost()` discards the `Host` header when `allowedDomains`
is empty and falls back to the literal string `localhost` — so `url.origin`
becomes `http://localhost` and never matches `https://groovymark.com`.

This also depends on Traefik sending `X-Forwarded-Proto: https`, which it does by
default. If the form starts returning 403 after a proxy change, check that header
first.

Adding a new hostname (a staging domain, say) means adding it to that list.

---

## 7. Local verification

```bash
npm run build
PORT=4501 HOST=127.0.0.1 RESEND_API_KEY=... RESEND_FROM='GroovyMark <hello@groovymark.com>' npm start
```

A plain `curl` POST will 403 unless you send the headers a browser would:

```bash
curl -X POST http://127.0.0.1:4501/api/contact \
  -H 'Host: groovymark.com' -H 'Origin: https://groovymark.com' \
  -H 'X-Forwarded-Proto: https' -H 'Accept: application/json' \
  --data-urlencode 'name=Test' --data-urlencode 'email=t@example.com' \
  --data-urlencode 'company=ACME' --data-urlencode 'segment=Marketing agencies' \
  --data-urlencode 'brief=hello' --data-urlencode 'consent=Yes'
```

To exercise the send path without spending real email, point it at a local
capture with `RESEND_ENDPOINT=http://127.0.0.1:4599/emails`. Leave that variable
**unset in production**.
