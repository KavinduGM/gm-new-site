import { SITE } from '../site.config.mjs';

/* Generated rather than a static public/robots.txt, which had drifted: it still
   named webx.groovymark.com after the rebrand and pointed crawlers at a sitemap
   on a host that no longer serves this site. Deriving the origin from SITE.url
   means it can only ever be wrong in one place.

   /legal/ is crawlable on purpose. The previous file disallowed it; privacy and
   terms pages are ordinary trust signals and blocking them buys nothing.

   AI crawlers are named explicitly even though `User-agent: *` already allows
   them. Three reasons: a bare Allow is silent about intent, several of these
   agents are opt-OUT tokens that only exist to be disallowed (so naming them
   with Allow documents a deliberate decision), and if a blanket rule is ever
   tightened these lines keep the AI permission intact.

   The trade-off is real and deliberate: this content can be used for model
   training and reproduced in AI answers, potentially without a link back. */

/** Crawlers that index for search results. */
const SEARCH = ['Googlebot', 'Googlebot-Image', 'Bingbot', 'Slurp', 'DuckDuckBot', 'Baiduspider', 'YandexBot', 'Applebot'];

/** Agents used for model training and for answering user questions live.
 *  Google-Extended and Applebot-Extended are training-only opt-out tokens:
 *  they do not affect search ranking in either direction. */
const AI = [
  'Google-Extended',
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-Web',
  'Claude-SearchBot',
  'anthropic-ai',
  'PerplexityBot',
  'Perplexity-User',
  'Applebot-Extended',
  'CCBot',
  'Meta-ExternalAgent',
  'Amazonbot',
  'Bytespider',
  'cohere-ai',
  'Diffbot',
  'omgili',
  'Timpibot',
  'YouBot',
];

export function GET() {
  const origin = SITE.url.replace(/\/+$/, '');
  const block = (agents, note) => [
    `# ${note}`,
    ...agents.map((a) => `User-agent: ${a}`),
    'Allow: /',
    '',
  ];

  return new Response(
    [
      '# Everything on this site is open to crawlers.',
      'User-agent: *',
      'Allow: /',
      '',
      ...block(SEARCH, 'Search indexing — explicitly allowed.'),
      ...block(AI, 'AI training and answer engines — explicitly allowed.'),
      `Sitemap: ${origin}/sitemap-index.xml`,
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
  );
}
