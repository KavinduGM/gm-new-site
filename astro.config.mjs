// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import node from '@astrojs/node';
import { SITE } from './src/site.config.mjs';
import { readdirSync, readFileSync } from 'node:fs';

/* Publication dates, read straight from the insight frontmatter.
 *
 * `lastmod: new Date()` used to stamp every URL with the build time, so all 16
 * entries claimed to change on every deploy while the content had not. It also
 * contradicted each article's own JSON-LD dateModified. Google discards a
 * lastmod that moves like that, which makes a wrong one worse than none. */
const ARTICLE_LASTMOD = Object.fromEntries(
  readdirSync('./src/content/insights')
    .filter((f) => f.endsWith('.md'))
    .map((f) => {
      const src = readFileSync(`./src/content/insights/${f}`, 'utf8');
      const updated = src.match(/^updated:\s*(\S+)/m)?.[1];
      const date = src.match(/^date:\s*(\S+)/m)?.[1];
      return [f.replace(/\.md$/, ''), updated ?? date];
    })
    .filter(([, d]) => d),
);

export default defineConfig({
  site: SITE.url,
  /* Stays 'static': all 19 pages are still prerendered at build time. The
     adapter exists so the handful of routes that opt out with
     `export const prerender = false` — the contact endpoint and its receipt
     page — can run on demand. Nothing else becomes server-rendered. */
  output: 'static',
  /* 'middleware', not 'standalone'. Standalone serves prerendered pages from
     its own static handler, which never enters the Astro app — so middleware
     cannot put security headers on them, and 18 of 19 pages would ship with
     none. server.mjs owns static serving instead, so one header block covers
     every response. See the header note in scripts/build-headers.mjs. */
  adapter: node({ mode: 'middleware' }),

  /* Without this every production form POST returns 403 "Cross-site POST form
     submissions are forbidden", and it cannot be reproduced on localhost.
     Astro's checkOrigin compares the Origin header against `url.origin`; since
     5.14.2 `validateHost()` DISCARDS the Host header when allowedDomains is
     empty and falls back to the literal "localhost", so url.origin becomes
     http://localhost and never matches https://groovymark.com. Behaviour
     changed between 5.13 and 5.18, and @astrojs/node@9.5.5 requires ^5.17.3,
     so there is no version to retreat to. This also stops Astro.url resolving
     to http://localhost on every on-demand route. */
  security: {
    allowedDomains: [
      { hostname: 'groovymark.com', protocol: 'https' },
      { hostname: 'www.groovymark.com', protocol: 'https' },
      // Local build verification only; harmless in production.
      { hostname: 'localhost', protocol: 'http' },
      { hostname: '127.0.0.1', protocol: 'http' },
    ],
  },
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      /* Both are noindex. A noindex page inside a submitted sitemap is a
         Search Console coverage error, not a neutral no-op. */
      filter: (page) => !page.includes('/legal/') && !page.includes('/contact/sent'),
      changefreq: 'weekly',
      /* Per-article, from frontmatter. Anything without a real content date
         gets no lastmod, which is honest — an invented one is discarded. */
      serialize: (item) => {
        const slug = item.url.match(/\/insights\/([^/]+)\/$/)?.[1];
        const d = slug && ARTICLE_LASTMOD[slug];
        if (d) item.lastmod = new Date(d).toISOString();
        return item;
      },
    }),
  ],
  build: {
    inlineStylesheets: 'always',
    format: 'directory',
  },
  compressHTML: true,
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },
  vite: {
    build: {
      cssMinify: 'lightningcss',
      assetsInlineLimit: 4096,
    },
  },
});
