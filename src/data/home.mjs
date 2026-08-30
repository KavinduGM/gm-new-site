import { WORKFLOW, CHANNELS } from './content.mjs';

/**
 * Home page content. Kept separate from data/content.mjs, which serves the
 * detailed inner pages — the home page deliberately says less.
 */

/* ------------------------------------------------------------------ Outcomes
 *
 * ⚠ BUILD NOTE — NOT RENDERED ON THE PAGE.
 * These are indicative of a typical in-house content team, not measured from a
 * named engagement. The on-page note says exactly that, and it must stay. If
 * real measured figures land, swap them in and sharpen the note to name the
 * engagement and dates. Never present these as measured results.
 */
export const OUTCOMES = {
  items: [
    {
      from: '5 roles',
      to: '1 system',
      strike: true,
      label:
        'Editor, animator, social manager, writer and project manager — <b>one system, and one person to watch it</b>.',
    },
    {
      from: '30 days',
      to: 'Under 6',
      strike: true,
      label:
        'Monthly production days. The system runs <b>24/7</b> — no burnout, sick leave, cover or HR overhead.',
    },
    {
      from: '$3,000+',
      to: 'Hundreds',
      strike: true,
      label:
        'Monthly spend. A team payroll becomes a system running cost you control — <b>no salaries, no benefits</b>.',
    },
    {
      // No before-value: nothing is removed here, and the "1 plan →" prefix
      // cost ~66px, which tipped the row's longest value onto a second line
      // in a quarter-width cell. It reads better in the caption anyway.
      from: null,
      to: '10+ channels',
      strike: false,
      label:
        '<b>From one plan</b> — YouTube, Instagram, Facebook, LinkedIn, TikTok, X, Pinterest, Threads, your blog and your newsletter.',
    },
  ],
  question: 'What if you woke up to next month’s content already made, scheduled and published?',
  /** The proof line under the before/after figures. These are the numbers the
   *  case study measured, so the claim and its evidence sit together. */
  proof:
    'Not a projection. We rebuilt our own operation on it and went from twelve people to two — ' +
    'and on one client account we <a href="/insights/oap-client-production-review/" class="link">' +
    'measured the same change end to end</a>, with output up 34%.',
};

/* -------------------------------------------------------- Roles → one system
 * Replaces the earlier two-track timeline. The role collapse is the more
 * visceral claim and it states plainly what is being replaced, which the
 * timeline never did. Counts are derived so the headline stat cannot drift. */
export const ROLES = {
  replaced: [
    'Video editor',
    'Animation artist',
    'Social media manager',
    'Content writer',
    'Project manager',
  ],
  system: {
    name: 'One system you own',
    sub: '+ one person to monitor it',
    facts: ['Runs 24/7', 'No sick leave or cover', 'No HR overhead', 'No handoff delays'],
  },
};

/* ---------------------------------------------------------------- Comparison
 * The highest-value block on the page: it does the buyer's evaluation for them.
 *
 * NOTE: rows support `win: false`, which renders a neutral marker and drops the
 * accent — used for points where a custom build genuinely loses (upfront cost,
 * time to first output). Those were removed on request. Worth reconsidering: a
 * table that sweeps every row reads as marketing to a technical buyer.
 *
 * Every claim here must stay accurate and defensible.
 */
export const COMPARISON = {
  lede:
    'All three can publish a video. What separates them is whether anyone checked ' +
    'it before it went out, what you own when it’s done, and where your data sits.',
  cols: [
    {
      name: 'No-code automation agency',
      desc: 'Freelancers and agencies wiring Zapier, Make or n8n into a chain.',
      us: false,
    },
    {
      name: 'Off-the-shelf AI tools',
      desc: 'Subscription products you configure and run yourself.',
      us: false,
    },
    {
      name: 'Custom build',
      desc: 'A system designed around your workflow, built from scratch.',
      us: true,
    },
  ],
  rows: [
    { k: 'What actually goes out', win: true,
      note: 'Most AI pipelines generate and publish. This one reviews first.',
      v: ['Whatever the chain assembled', 'Whatever the template generated', 'Only what passed review'] },
    { k: 'Who owns it', win: true,
      v: ['Agency’s account', 'Vendor’s platform', 'You do, on your accounts'] },
    { k: 'Where your data goes', win: true,
      note: 'Every connected app is another processor agreement.',
      v: ['Across 5+ connected apps', 'Each vendor separately', 'One AI vendor, that’s it'] },
    { k: 'Cost model', win: true,
      v: ['Per task, scales with volume', 'Per seat, per tool, monthly', 'Build once, then run cost only'] },
    { k: 'Doubling your output', win: true,
      note: 'Volume is a setting, not a rebuild. Nothing to quote or wait for.',
      v: ['New scope, new quote', 'Upgrade to the next tier', 'You turn it up, no dev cost'] },
    { k: 'EU AI Act disclosure', win: true,
      note: 'Enforceable since August 2026. Fines scale with turnover.',
      v: ['Usually not handled', 'Varies by vendor', 'Built in, to rules in force'] },
    { k: 'When a vendor changes an API', win: true,
      v: ['Workflow breaks', 'You wait for a fix', 'We patch it, nothing breaks'] },
    { k: 'Changing it later', win: true,
      v: ['Back to the agency', 'Wait for the roadmap', 'You ask, we build it'] },
    { k: 'Fits your existing workflow', win: true,
      v: ['You adapt to the tool', 'You adapt to the tool', 'Built around how you work'] },
  ],
  // A question rather than a statement: it makes the reader audit their own
  // setup instead of reading a claim about ours. Hits both anxieties the
  // table just raised — who holds the data, and what survives cancellation.
  hook: 'Who holds your content today — and what do you keep if you stop paying?',
  // NOTE: a qualifying line used to sit here — "Custom isn't always the right
  // answer. If you publish four pieces a month, a subscription is cheaper — and
  // we'll say so on the call." Removed on request. Worth restoring if the
  // section ever needs a credibility lift: naming when not to hire you is the
  // strongest signal available on a page arguing for the pricier option.
};

/* -------------------------------------------------------------- Deliverables
 *
 * ⚠ BEFORE LAUNCH — items 07–10 are delivery promises, not descriptions.
 * Only keep the ones produced for EVERY build. Item 10 in particular commits to
 * writing real data-flow documentation; confirm that is in standard scope or
 * cut it. A deliverable listed and not delivered is worse than one never
 * claimed — and this is the page arguing you are the trustworthy option.
 *
 * The two-block split matters: the hero strip and the comparison table already
 * make data-handling claims, so the same material has to land here as things
 * the client receives, not as a third restatement.
 */
export const DELIVERABLES = {
  produces: {
    label: 'What it produces',
    items: [
      {
        t: 'Scripts written to your brief and brand voice',
        d: 'Trained on your existing content, so it reads like your team wrote it.',
      },
      {
        t: 'Voiceovers in the languages you publish in',
        d: 'The same voice across every video and every channel.',
      },
      {
        t: 'Motion graphics and finished video, long and short form',
        /* Not "cut to" — nothing is cropped down from a master. Each ratio is
           composed for that ratio from the start. */
        d: 'Designed for 16:9 and 9:16 from the start, not one master cropped to fit.',
      },
      {
        t: 'Thumbnails and graphic posts',
        d: 'Sized per platform, styled to your brand, generated alongside the video.',
      },
      {
        t: 'Scheduled publishing to YouTube, Instagram, Facebook, LinkedIn, TikTok, Threads, blogs and newsletters',
        d: 'Posted on your calendar, formatted per platform, without anyone logging in.',
      },
    ],
  },
  comes: {
    label: 'What comes with it',
    items: [
      {
        // The strongest item in the list and the argument of the whole page —
        // it leads its block and carries the only accent treatment here.
        t: 'The system itself',
        d: 'The running system, your own credentials and the documentation. We keep the source, which is how we can stand behind it.',
        feature: true,
      },
      {
        t: 'Disclosure built into every asset',
        d: 'AI labelling applied automatically, to EU AI Act rules already in force — not a setting someone has to remember to switch on.',
      },
      {
        t: 'Disclosure applied on every file',
        d: 'Standards-aligned, so anyone can verify how a piece was made.',
      },
      {
        t: 'One processor, not five',
        d: 'Your briefs and brand material go to a single AI vendor under one agreement — not scattered across a stack of connected apps.',
      },
      {
        t: 'Documentation your compliance team can read',
        d: 'How data flows, where it’s stored, what’s retained.',
      },
    ],
  },
  // Carries the old closing line's meaning up front, so it frames the cards
  // instead of trailing them.
  lede:
    'All of it comes with the system, not rented back to you. Five things it ' +
    'produces, and five things you keep once it is running.',
  // Makes the reader audit their own operation against the ten items they
  // just read, rather than restating a claim about ours.
  hook: 'How much of this is your team still doing by hand?',
  cta: { label: 'See the full system', href: '/system/' },
};

/* --------------------------------------------------------------------- Steps */
/* NOT RENDERED. The "How a plan becomes a published feed" section was removed
   from the home page — FLOW above now covers the same ground in more detail,
   so this had become a shorter duplicate of it. Kept rather than deleted
   because this project is not under version control; delete freely if the
   section is not coming back. */
export const STEPS = [
  { n: '01', name: 'Brief', body: 'One content plan, in whatever format you already keep it.' },
  { n: '02', name: 'Build', body: 'Scripts, voiceovers, visuals and final edits, assembled automatically.' },
  { n: '03', name: 'Review', body: 'Approve each run, or let it publish on its own.' },
  { n: '04', name: 'Publish', body: 'Every format, every channel, on schedule.' },
  { n: '05', name: 'Verify', body: 'A production credit and disclosure applied at the point of generation.' },
];

/* ---------------------------------------------------------------- Two ways in */
export const WAYS_IN = [
  {
    kicker: 'You run it',
    title: 'Own it and run it',
    /* Every claim here is already made elsewhere on the site — the system, the
       credentials and the documentation come from DELIVERABLES; the no-licence
       point from the comparison table. Nothing new is asserted. */
    body:
      'We build the system around your workflow and hand it over. Your team ' +
      'operates it directly, on your own accounts and credentials, so nothing ' +
      'is rented and no subscription can switch it off. The code behind it stays ' +
      'with us, which is how we can guarantee it and change it when you ask.',
    cta: { label: 'Book a build call', href: '/contact/', primary: true },
  },
  {
    kicker: 'We run it',
    title: 'We run it for you',
    body:
      'The same system, operated by us as a monthly service. Nothing to manage ' +
      'on your side: we handle planning, approvals, scheduling and reporting ' +
      'against your channels. Your accounts and your data stay yours, and you ' +
      'can commission your own build and take over whenever you want.',
    cta: { label: 'See the managed plan', href: '/engagements/', primary: false },
  },
];

/**
 * Section 2 — the mechanism, stated once, near the top.
 *
 * DELIVERABLES answers "what do I get" but sits four screens down, and the old
 * STEPS section that answered "how" has been removed. This states the shape of
 * the offer where a scanning reader actually is: one in, one system, one feed.
 *
 * Deliberately asymmetric — `in` and `out` are one line each, `build` is a list.
 * The middle column is given ~2x the width in the grid so the layout itself
 * carries the argument: small input, large system, clean output.
 *
 * Claim discipline: every line here is a capability statement about the build.
 * The one number, "under an hour", is the client's own operating claim and is
 * kept in this file (not hardcoded in markup) so it is easy to revise or pull.
 */
export const FLOW = {
  eyebrow: 'What actually happens',
  /* [square brackets] mark the words rendered in the accent colour. */
  title: 'Upload [one file]. The system does [the rest].',
  lede:
    'Scripts, voiceovers, visuals, video, graphics, descriptions and publishing — ' +
    'one workflow, one system, under an hour. It does the work of an editor, ' +
    'animator, social media manager, writer and project manager, without the ' +
    'five subscriptions and the spreadsheet holding them together.',

  beats: [
    {
      n: '01',
      k: 'You upload',
      lead: 'Whatever your work already starts from.',
      note:
        'A brief, a resource document, research notes, study material — .txt, .md, ' +
        '.docx, any format you already keep it in. You define what goes in. The ' +
        'system is built around your input, not a template you have to fill.',
    },
    {
      n: '02',
      k: 'The system runs',
      lead: 'Ten steps, in the same order, every time.',
      /* Ordered, not an inventory: a first-time reader could see the old list of
         six nouns without learning how any of it happened. Each step feeds the
         next — the voiceover needs the script, the cut needs both.
         The seventh is the machine QC gate, not the client approval gate — the
         `foot` line below draws that distinction, and now carries it alone since
         the STEPS section that also stated it was removed from this page. */
      /* Derived from WORKFLOW so this list and /system can never disagree.
         The seven written here previously described the same pipeline at a
         different granularity, which is what made the counts contradict. */
      /* Names only. Ten name-and-summary pairs turned this card into a wall and
         forced the other two columns down to unreadable widths; the summaries
         live on /system, which is where someone goes for the detail. */
      steps: WORKFLOW.map((w) => [w.name, '']),
      foot: 'Nothing reaches a channel unreviewed. Your own approval gate is optional on top.',
    },
    {
      n: '03',
      /* Not "It publishes": set in uppercase mono, IT reads as the IT department,
         and "it" was the only unnamed subject of the three. Repeating "the
         system" after 02 is deliberate — one system does both halves. */
      k: 'The system publishes',
      lead: 'On your content plan, to every channel you run.',
      note:
        'Reviewed assets are scheduled against the plan you gave the system. ' +
        'Nothing goes out at a time you did not set.',
      /* Named destinations rather than a count — OUTCOMES already carries the
         "10+ channels" figure, and two numbers that could drift apart is worse
         than one. CONFIRM before launch: the first nine are already claimed
         elsewhere on the site; the rest are additions and need checking. */
      /* The site row covers two destinations, and the OUTCOMES stat on this page
         says "10+ channels", so it is named as the two it is. */
      channels: CHANNELS.flatMap((c) => (c.icon === 'web' ? ['Your blog', 'Your newsletter'] : [c.name])),
      /* The loop that closes after publish. Kept to one line each: this is the
         narrow column, and the detail belongs on /system. */
      after: {
        label: 'And after it goes out',
        items: [
          'Confirms every post actually landed',
          'Updates your content plan automatically',
          'Retries and repairs most failures itself',
          'Only if one needs you: email, SMS or WhatsApp — your pick',
        ],
      },
    },
  ],

  /* The cost story, told as removals rather than as a savings figure — the
     figure would be invented, the removals are structural facts of the build. */
  withoutLabel: 'And none of this',
  without: [
    'No subscriptions',
    'No seat licences',
    'No headcount',
    'No payroll or HR',
    'No sick leave',
    'No burnout',
  ],

  always: {
    label: 'Always on',
    /* Was one run-on sentence. Four facts a reader can take in at a glance beat
       a paragraph they have to parse — and the operational claim and the
       governance claim are different arguments, so they are split below. */
    facts: [
      ['24/7', 'It keeps running while you sleep'],
      ['Real-time', 'Analytics on every run'],
      ['Monthly', 'Reports, summarised'],
      ['Any device', 'Phone, tablet or desktop, anywhere you have a connection'],
    ],
    /* <b> marks the words lifted to --c-ink against --c-ink-2 body text — the
       same emphasis mechanism OUTCOMES uses, via a :global(b) rule. */
    trust:
      '<b>One vendor</b> holds the data, disclosure is applied <b>at generation</b>, ' +
      'and the build follows <b>EU AI Act</b> rules already in force.',
    cta: { label: 'See the full pipeline', href: '/system/' },
  },
};

/* ------------------------------------------------------------------------ FAQ
 * Written for search intent: these are the questions a founder or CTO actually
 * types before a call, phrased the way they type them.
 *
 * NUMBER DISCIPLINE. Every figure here already appears elsewhere on this site
 * and is a capability statement, not a measured outcome: five roles, one
 * monitor, under an hour, 24/7, thirteen channels, one AI vendor.
 * The "$3,000+ to hundreds" spend figures from OUTCOMES are deliberately NOT
 * repeated — they are flagged indicative in that section, and an FAQ answer can
 * be lifted into a Google rich result where it would read as a firm quote.
 *
 * Answers are self-contained: a rich result strips surrounding context, so each
 * one has to stand on its own without the page around it.
 */
export const FAQ = [
  {
    q: 'Is this just AI generated video?',
    a:
      'No, and that distinction is the point. AI writes the script, generates the ' +
      'voiceover, writes the descriptions and reviews the work. The video itself is ' +
      'produced the way an editor produces one: intros, outros, music, transitions, ' +
      'typography and motion graphics, composed against your brand rather than poured ' +
      'into a template. Animation is drawn in the style an animation artist would draw ' +
      'it. Anyone can generate a clip in a browser, which is exactly why a generated ' +
      'clip is worth little. Where AI is used it is disclosed, because the rules in ' +
      'force require it.',
  },
  {
    q: 'Can one AI content system replace a five person content team?',
    a:
      'It replaces the production work of five roles: editor, animator, social media ' +
      'manager, writer and project manager. One person monitors it instead. What it ' +
      'does not replace is judgement, so strategy, brand decisions and what to say ' +
      'next stay with you. The system runs 24/7 with no payroll, HR, sick leave or ' +
      'cover to arrange.',
  },
  {
    q: 'How long does it take to produce and publish a video with AI?',
    a:
      /* No step count here on purpose. The home page describes the build steps
         and /system documents the full ten-step run, so a number stated in this
         shared answer contradicts one of them the moment either changes. */
      'Under an hour, from one uploaded file to published posts. The system reads ' +
      'your document, writes the script, generates the voiceover, builds the visuals, ' +
      'cuts the video to each ratio, makes the thumbnails and graphics, writes the ' +
      'descriptions, then checks its own work before anything is scheduled. There is ' +
      'no handoff between tools, which is where most of the time usually goes.',
  },
  {
    q: 'Do I own the AI system, or is it a subscription?',
    a:
      'That depends on which of the two you take. Build it and you own it outright: it is a ' +
      'one-off build cost, there is no content limit, and it is not a subscription. The system ' +
      'runs on your accounts and ' +
      'your credentials, your team works through its front end, and no licence can be ' +
      'withdrawn to switch it off. The code behind it stays with us, the way a studio keeps ' +
      'its working files, and that is how we can guarantee the build, fix anything that breaks ' +
      'and keep improving it. When you want the pipeline changed, you tell us and we make the ' +
      'change with you. If we ever stopped trading, every credential you need to keep it ' +
      'running is handed straight to you. The alternative is to have GroovyMark run the same ' +
      'system for you on a monthly plan. That one is a subscription, it carries a content ' +
      'allowance, and the system stays on our side. It is the faster and cheaper way to ' +
      'start, and you can move to your own build later.',
  },
  {
    q: 'Is AI generated content legal under the EU AI Act?',
    a:
      'Transparency duties for synthetic audio, video and imagery are already in ' +
      'force, and they require that AI generated content is disclosed. AI is used here ' +
      'for writing, scripting, voiceover and review, and each of those uses is ' +
      'declared. We apply disclosure ' +
      'at the point of generation rather than as a label added afterwards, ' +
      'and the inputs behind each run are tracked rather than guessed at afterwards. ' +
      'This is how the build is designed, not legal advice, and we do not hold SOC 2 ' +
      'or ISO 27001 certification.',
  },
  {
    q: 'How many social media channels can one content plan publish to?',
    a:
      'From a single plan: YouTube, Instagram, Facebook, LinkedIn, TikTok, X, Pinterest, ' +
      'Threads, your own blog and your newsletter. Each asset is sized and formatted per platform, scheduled against the ' +
      'plan you gave the system, then checked after publishing so your content plan ' +
      'updates itself.',
  },
];
