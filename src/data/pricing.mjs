/**
 * Managed-service packages, for /pricing.
 *
 * This page prices ONE of the two engagements: "Fully managed", where we run
 * the system and publish on the client's channels. The other engagement
 * ("Build & hand over") is quoted per scope and is not priced here — see
 * ENGAGEMENTS in content.mjs and the note in engagements.astro.
 *
 * Every figure below came from the owner. Nothing is derived, averaged or
 * inferred: if a number is not in this file it does not go on the page.

/** Monthly package price, in USD. */
export const PACKAGES = [
  {
    id: 'starter',
    n: '01',
    name: 'Starter',
    price: 880,
    summary:
      'A steady publishing rhythm on four channels, produced, reviewed and ' +
      'scheduled for you.',
    accounts: 4,
    accountsNote: 'Four social accounts',
    produces: [
      ['6', 'long-form videos'],
      ['20', 'short-form videos'],
      ['20', 'community posts'],
    ],
  },
  {
    id: 'growth',
    n: '02',
    name: 'Growth',
    /* Marked "Recommended", not "Most popular". The old pricing page used the
       latter; it is a claim about what other clients chose, which we cannot
       show, and this site does not publish figures it cannot show. */
    rec: true,
    price: 1880,
    summary:
      'Double the long-form output, across any six social accounts you pick.',
    accounts: 6,
    accountsNote: 'Six social accounts, your choice',
    produces: [
      ['12', 'long-form videos'],
      ['30', 'short-form videos'],
      ['30', 'community posts'],
    ],
  },
  {
    id: 'scale',
    n: '03',
    name: 'Scale',
    price: 2580,
    summary:
      'The full production load, for teams whose channels are the main ' +
      'marketing surface.',
    accounts: 6,
    accountsNote: 'Six social accounts, your choice',
    produces: [
      ['20', 'long-form videos'],
      ['60', 'short-form videos'],
      ['60', 'community posts'],
    ],
  },
];

/** Included on every package, at every price. */
export const INCLUDED = [
  'Monthly performance reports',
  '24/7 support by ticket, plus client portal access',
  'A monthly strategy call',
];

/** Optional. Not in any package price, added only if asked for. */
export const ADDON = {
  k: 'Add-on',
  name: 'CRM and lead management',
  summary:
    'For teams who want the pipeline automated as well as the publishing. ' +
    'Priced separately on the call, and added to any package.',
  items: [
    'Lead capture forms',
    'Lead dashboard access',
    'Full spam filtration',
    'Fully automatic lead scoring',
    'Priority lead monitoring',
    'Auto lead management with customised auto replies',
    'Custom analytics and growth recommendations',
    'Customised contact forms',
    'Customised auto reply templates',
  ],
};

/**
 * Questions the price list itself raises. Deliberately narrow: every answer is
 * supportable from the packages above or from something already published on
 * the site. Nothing here states a contract term, a notice period or a refund
 * policy, because none of those has been decided.
 */
export const PRICING_FAQ = [
  {
    q: 'Which social accounts can I use the package on?',
    a:
      'Starter covers four social accounts. Growth and Scale cover six, and on both you choose ' +
      'which six. Every destination the system publishes to is listed on the system page. Blog ' +
      'articles and newsletters are a separate add-on rather than part of a plan.',
  },
  {
    q: 'What happens if I need more than my package produces?',
    a:
      'You move up a package. The allowance is monthly, so the change applies from the next ' +
      'month rather than being settled as an overage.',
  },
  {
    q: 'Is the CRM and lead management add-on required?',
    a:
      'No. Every package publishes without it. It exists for teams who want the lead pipeline ' +
      'automated as well as the content, and it is priced separately on the call.',
  },
  {
    q: 'Who owns the content, and the channels it goes out on?',
    a:
      'You do. Publishing happens under channels in your own name, the copyright and the licence ' +
      'in what the system makes stay with you, and the rights position is set out in full on the ' +
      'trust page.',
  },
  {
    q: 'Can I move to a system of my own later?',
    a:
      'Yes. A build is quoted separately by scope, and the monthly plan is the way to prove ' +
      'the workflow on real output before committing to one.',
  },
];
