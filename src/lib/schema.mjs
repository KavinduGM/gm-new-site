import { SITE } from '../site.config.mjs';

const abs = (path = '/') => new URL(path, SITE.url).href;

export const organizationSchema = () => ({
  '@type': 'Organization',
  '@id': abs('/#organization'),
  name: SITE.name,
  url: abs('/'),
  description: SITE.description,
  email: SITE.email,
  logo: { '@type': 'ImageObject', url: abs('/icon-512.png'), width: 512, height: 512 },
  sameAs: SITE.social.filter((s) => s.href).map((s) => s.href),
  areaServed: [
    { '@type': 'Place', name: 'United States' },
    { '@type': 'Place', name: 'United Kingdom' },
    { '@type': 'Place', name: 'Western Europe' },
    { '@type': 'Place', name: 'Gulf Cooperation Council' },
  ],
  knowsAbout: [
    'AI content production',
    'Automated video publishing',
    'AI content disclosure',
    'EU AI Act compliance',
    'Marketing automation systems',
  ],
});

export const websiteSchema = () => ({
  '@type': 'WebSite',
  '@id': abs('/#website'),
  url: abs('/'),
  name: SITE.name,
  description: SITE.description,
  inLanguage: SITE.locale,
  publisher: { '@id': abs('/#organization') },
});

export const serviceSchema = () => ({
  '@type': 'Service',
  '@id': abs('/#service'),
  name: 'Custom AI content production & publishing systems',
  serviceType: 'AI content production system design and build',
  provider: { '@id': abs('/#organization') },
  description:
    'Custom-built AI systems that turn a single content plan into scripts, voiceovers, motion graphics, finished video, thumbnails and social posts — then publish on schedule across YouTube, Facebook, Instagram and more.',
  audience: {
    '@type': 'BusinessAudience',
    name: 'Marketing agencies, e-commerce and DTC brands, media and publishing teams, course and training producers',
  },
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceSpecification: {
      '@type': 'PriceSpecification',
      priceCurrency: 'USD',
      description: 'Scoped per engagement following a discovery call.',
    },
  },
});

/* Trailing slash is forced here rather than trusted from the caller. Every page
   is emitted as <route>/index.html, so the slashed form is the canonical URL —
   but [slug].astro passed article hrefs without one, which put the breadcrumb's
   item URL and @id at a different address from the page's own canonical tag.
   Normalising in one place makes that impossible to get wrong at a call site. */
const slashed = (href) => (href.endsWith('/') ? href : `${href}/`);

export const breadcrumbSchema = (trail = []) => ({
  '@type': 'BreadcrumbList',
  /* Page-scoped. This was a constant '/#breadcrumb', so all 15 documents
     published different trails under one global node identifier. */
  '@id': abs(`${slashed(trail.at(-1)?.href ?? '/')}#breadcrumb`),
  itemListElement: [{ name: 'Home', href: '/' }, ...trail].map((item, i) => ({
    '@type': 'ListItem',
    position: i + 1,
    name: item.name,
    item: abs(slashed(item.href)),
  })),
});

export const faqSchema = (faqs = []) => ({
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({
    '@type': 'Question',
    name: f.q,
    acceptedAnswer: { '@type': 'Answer', text: f.a },
  })),
});

export const articleSchema = ({ title, description, slug, date, updated, author, tags, image }) => ({
  '@type': 'BlogPosting',
  '@id': abs(`/insights/${slug}/#article`),
  headline: title,
  description,
  ...(image ? { image: abs(image) } : {}),
  url: abs(slashed(`/insights/${slug}`)),
  datePublished: new Date(date).toISOString(),
  dateModified: new Date(updated ?? date).toISOString(),
  author: { '@type': 'Organization', name: author ?? SITE.name, url: abs('/') },
  publisher: { '@id': abs('/#organization') },
  keywords: tags?.join(', '),
  isPartOf: { '@id': abs('/#website') },
  mainEntityOfPage: { '@type': 'WebPage', '@id': abs(slashed(`/insights/${slug}`)) },
});

/** Wraps any set of schema nodes into a single @graph document. */
export const graph = (...nodes) => ({
  '@context': 'https://schema.org',
  '@graph': nodes.flat().filter(Boolean),
});
