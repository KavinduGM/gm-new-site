/**
 * Single source of truth for brand + site-wide constants.
 * Renaming the product is a one-line change here — it propagates to every
 * page title, meta tag, JSON-LD block, nav, and footer.
 */
export const SITE = {
  /** The company. One name, one brand — change here to rename everywhere.
   *  Was 'GroovyMark WebX' with a separate 'parent' company behind the managed
   *  service; that split is gone. GroovyMark sells two services, and the site
   *  speaks as one company throughout. */
  name: 'GroovyMark',
  /** Canonical origin. Update before deploying to production. */
  url: 'https://groovymark.com',
  /** Used as the default <title> suffix and in JSON-LD. */
  tagline: 'Custom AI content production & publishing systems',
  description:
    'GroovyMark builds custom AI content production systems, and runs them for the teams who would rather not. One content plan in — script, voiceover, motion graphics, video, thumbnails and social posts out, published on schedule across YouTube, Facebook, Instagram and more.',
  locale: 'en',
  localeTag: 'en_US',
  /** Default social share image. Must be PNG/JPG — Facebook, X and LinkedIn
   *  all reject SVG for share cards. Regenerate from public/og-default.svg. */
  ogImage: '/og-default.png',
  themeColor: '#08070C',
  email: 'hello@groovymark.com',
  /** WhatsApp business number in international format, digits only, no '+' or
   *  spaces — e.g. '94771234567'. The contact page builds a wa.me link from it.
   *  The button renders only when this is set, because a wa.me link to a number
   *  that does not exist opens a dead WhatsApp screen, which is worse than no
   *  button at all. */
  whatsapp: '94712345222',
  /** Pre-filled first message, so the agent knows where the person came from. */
  whatsappMessage: 'Hi GroovyMark — I came from your site and would like to talk about a content system.',
  /** No scheduler by design — the contact form is the only intake route.
   *  contact.astro and engagements.astro gate on this being an absolute URL, so
   *  leaving it empty keeps the booking panel hidden and points the engagement
   *  CTAs at the form instead. Set it to a real https:// scheduler to turn the
   *  panel on; anything else leaves it off. */
  bookingUrl: '',
  /** Footer social links. Each one is a live outbound link on all 17 pages, so
   *  a dead handle here is a sitewide broken link — verify before adding.
   *  Checked 2026-08-28: LinkedIn 200, YouTube 200 (a nonexistent YouTube handle
   *  correctly 404s, so that 200 is meaningful). */
  /**
   * Social profiles, rendered as icons in the footer.
   *
   * `icon` keys into BRAND in src/lib/brand-icons.mjs. An empty `href` means
   * the account does not exist yet: the footer skips those entirely rather than
   * rendering an icon that goes nowhere, so creating an account is a one-string
   * change here and nothing else.
   *
   * All four verified live before shipping, each against a nonsense handle as a
   * control. HTTP status only works for two of them:
   *   LinkedIn, YouTube — 200 where a made-up handle 404s.
   *   Instagram, Facebook — status is useless. Instagram serves an identical
   *     620KB login wall for real and fake handles alike, and Facebook rejects
   *     scripted requests with 400 either way. Both were confirmed in a real
   *     browser by page title: "GroovyMark (@_groovymark_)" and
   *     "GroovyMark | Facebook", against controls that title as bare
   *     "Instagram" and "Facebook".
   * Check the same way before changing any of these — x.com serves a page for
   * almost any handle, so a dead profile link looks alive until someone clicks.
   */
  social: [
    { label: 'LinkedIn', icon: 'linkedin', href: 'https://www.linkedin.com/company/groovymark/' },
    { label: 'YouTube', icon: 'youtube', href: 'https://www.youtube.com/@GroovyMark' },
    { label: 'Instagram', icon: 'instagram', href: 'https://www.instagram.com/_groovymark_/' },
    { label: 'Facebook', icon: 'facebook', href: 'https://www.facebook.com/groovymarkk/' },
    // No X account yet. Left in place so adding one is a single string.
    { label: 'X', icon: 'x', href: '' },
  ],
  /**
   * LeadIQ analytics, self-hosted on the CRM. Set analyticsId to '' to remove
   * it entirely.
   *
   * The script writes liq_vid (a persistent cross-session visitor id), liq_sid,
   * liq_utm and liq_sts, and carries no consent handling of its own.
   *
   * analyticsRequiresConsent is the single switch that decides how it loads,
   * and THREE things follow from it — do not flip it without reading them:
   *
   *   false (today) — loads in <head> on every page for every visitor. Chosen
   *     deliberately while the product is early and the data is needed for our
   *     own decisions. The legal pages say so plainly, and the banner does NOT
   *     offer an analytics toggle, because a toggle that is ignored when
   *     someone refuses is worse than no toggle at all.
   *
   *   true — loads only after a visitor allows the analytics category, the
   *     toggle comes back, and the legal copy switches to the consent wording.
   *     This is the position to move to before running paid campaigns or
   *     marketing into the UK and EEA.
   */
  analyticsId: '740d3bc2-f5b4-4892-904e-80cb799e9086',
  analyticsSrc: 'https://crm.groovymark.com/t.js',
  analyticsRequiresConsent: false,

  /** Privacy, data-rights and cookie-record requests. Kept separate from the
   *  general address so a rights request is not lost in the sales inbox —
   *  GDPR gives us one month to answer one. */
  privacyEmail: 'privacy@groovymark.com',
  /** The operating company, as it appears on the legal pages. One source of
   *  truth: the privacy notice, the terms and any future contract text all
   *  read from here rather than repeating it. */
  legal: {
    entity: 'GroovyMark PVT Ltd',
    number: 'PV 00299314',
    address: 'GM HQ, Trace City, Colombo 10, Sri Lanka',
    /* No landline. The only voice/message route is WhatsApp, which lives in
       SITE.whatsapp — do not add a `tel:` link anywhere from this block. */
  },
  /** Where contact-form submissions are delivered. Separate from the general
   *  address so enquiries land in one place a person actually works. */
  leadsEmail: 'leads@groovymark.com',
};

export const NAV = [
  { label: 'The System', href: '/system/', meta: '01' },
  { label: 'How We Build', href: '/how-we-build/', meta: '02' },
  { label: 'Who It’s For', href: '/who-its-for/', meta: '03' },
  { label: 'Trust', href: '/trust/', meta: '04' },
  { label: 'Engagements', href: '/engagements/', meta: '05' },
  { label: 'Insights', href: '/insights/', meta: '06' },
];

export const FOOTER_NAV = [
  {
    title: 'System',
    links: [
      { label: 'How it works', href: '/system/' },
      { label: 'Pipeline stages', href: '/system/#stages' },
      { label: 'Channels', href: '/system/#channels' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About', href: '/about/' },
      { label: 'Engagements', href: '/engagements/' },
      { label: 'Pricing', href: '/pricing/' },
      { label: 'Insights', href: '/insights/' },
      { label: 'Contact', href: '/contact/' },
    ],
  },
  {
    title: 'Trust',
    links: [
      { label: 'What it talks to', href: '/trust/#data' },
      { label: 'What it will not do', href: '/trust/#posture' },
      { label: 'Rights & disclosure', href: '/trust/#rights' },
      { label: 'Privacy', href: '/legal/privacy/' },
    ],
  },
];
