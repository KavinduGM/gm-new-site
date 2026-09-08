import { SITE } from '../site.config.mjs';

/**
 * Shared domain content. Pages compose from here so the story stays
 * consistent across the site and copy edits happen in one place.
 */

/* ---------------------------------------------------------------- Pipeline */
/* `duration` is MINUTES into a run, not hours. It previously ran to 01:20,
   which reads as 1h20m and contradicted the "under an hour" claim on the home
   page. These are illustrative of a typical run and worth confirming against
   real timings before launch. */
export const STAGES = [
  {
    id: 'intake',
    n: '01',
    name: 'Intake',
    verb: 'Plan in',
    duration: '00',
    summary:
      'Your content plan lands in the system the way you already write it — a sheet, a brief, a board, a calendar. No new tool for your team to learn.',
    outputs: ['Normalised brief', 'Brand + tone profile', 'Channel targets', 'Run schedule'],
    detail:
      'We map the system to your existing planning surface rather than asking your team to migrate. A row in your content calendar becomes a run. Everything downstream inherits the brand voice, claims policy and channel rules you set once.',
  },
  {
    id: 'script',
    n: '02',
    name: 'Script',
    verb: 'Write',
    duration: '04',
    summary:
      'Long-form script, short-form cutdowns, and platform-native hooks — written against your voice profile and your claims policy, not a generic prompt.',
    outputs: ['Master script', 'Short-form cutdowns', 'Hooks & titles', 'On-screen copy'],
    detail:
      'The script stage holds your positioning, banned claims, regulated-language rules and reading level. It produces one master script plus the derivative cuts each channel needs, so short-form is not an afterthought bolted on later.',
  },
  {
    id: 'voice',
    n: '03',
    name: 'Voice',
    verb: 'Narrate',
    duration: '11',
    summary:
      'Voiceover rendered in a consistent, licensed voice — with pacing, emphasis and pronunciation locked to your brand lexicon.',
    outputs: ['Master VO', 'Per-cut VO', 'Timed transcript', 'Caption file'],
    detail:
      'Pronunciation of product names, people and technical terms is pinned in a lexicon so episode 200 sounds like episode 1. Timed transcripts fall out of this stage and feed captions, chapters and subtitles without a second pass.',
  },
  {
    id: 'visual',
    n: '04',
    name: 'Visuals',
    verb: 'Compose',
    duration: '26',
    summary:
      'Scene-by-scene visuals and motion graphics built from your design system — typography, colour, lower thirds, transitions, end cards.',
    outputs: ['Scene stills', 'Motion graphics', 'Lower thirds', 'End cards'],
    detail:
      'Your brand becomes a template set the system composes against, so output is on-brand by construction rather than by review. Stock, generated and licensed footage are all first-class inputs, each tracked separately through the run.',
  },
  {
    id: 'assembly',
    n: '05',
    name: 'Assembly',
    verb: 'Cut',
    duration: '41',
    summary:
      'Final render per aspect ratio, plus thumbnail sets, chapter markers, captions and every derivative each platform wants.',
    outputs: ['16:9 · 9:16 · 1:1 renders', 'Thumbnail set', 'Chapters', 'Burned + sidecar captions'],
    detail:
      'One run produces every deliverable a channel needs, at the spec that channel enforces — not a single master a human then has to reformat four times. Thumbnails are generated as a tested set, not a single guess.',
  },
  {
    id: 'publish',
    n: '06',
    name: 'Publish',
    verb: 'Ship',
    duration: '52',
    summary:
      'Platform-native posts, captions and metadata scheduled and pushed to YouTube, Facebook, Instagram and the rest — on your calendar, under your accounts.',
    outputs: ['Scheduled uploads', 'Native copy per channel', 'AI disclosure flags', 'Provenance record'],
    detail:
      'Publishing runs under your own channel credentials, never a shared pool. Required AI-content disclosures are set on the platforms that expect them, and the publishing layer has no power to edit or delete what has gone out.',
  },
];

/* --------------------------------------------------------- Differentiators */

/* ------------------------------------------------------------- Who it's for */
export const SEGMENTS = [
  {
    id: 'agencies',
    n: '01',
    name: 'Marketing agencies',
    hook: 'Take on content volume without taking on headcount.',
    summary:
      'Run more client content through the same team — with per-client brand profiles, approval gates and white-label output.',
    pains: [
      'Content retainers priced on hours you no longer want to sell',
      'Every new client means another junior editor',
      'Clients asking what your AI policy actually is',
    ],
    gains: [
      'Per-client brand, voice and claims profiles',
      'Approval gates before anything publishes',
      'A data map short enough to hand to your own clients',
      'Margin that improves as volume rises',
    ],
    metric: { value: 'Per client', label: 'brand, voice & claims profile' },
  },
  {
    id: 'ecommerce',
    n: '02',
    name: 'E-commerce & DTC brands',
    hook: 'A video for every SKU, every variant, every season.',
    summary:
      'Turn a product catalogue into a standing content engine — launches, restocks, seasonal pushes and creative testing at catalogue scale.',
    pains: [
      'Catalogue grows faster than the content team',
      'Creative testing bottlenecked on production',
      'Seasonal pushes eat a whole quarter of capacity',
    ],
    gains: [
      'Catalogue feed drives runs automatically',
      'Variant-level creative for testing',
      'Every channel cut from one run',
      'Claims policy enforced before publish',
    ],
    metric: { value: 'Per SKU', label: 'variant-level creative' },
  },
  {
    id: 'media',
    n: '03',
    name: 'Media & publishing teams',
    hook: 'Turn the archive and the daily desk into video.',
    summary:
      'Convert articles, newsletters and research into daily video and social output without pulling journalists off the desk.',
    pains: [
      'Strong written output, thin video presence',
      'A back catalogue nobody has time to repurpose',
      'Editorial standards that a generic AI tool cannot meet',
    ],
    gains: [
      'Editorial standards encoded in the script stage',
      'Archive repurposing as a scheduled run',
      'Attribution and sourcing preserved end to end',
      'Disclosure that satisfies an editor, not just a platform',
    ],
    metric: { value: 'Archive', label: 'repurposed on a schedule' },
  },
  {
    id: 'courses',
    n: '04',
    name: 'Course & training producers',
    hook: 'Update a curriculum without reshooting it.',
    summary:
      'Produce and maintain lesson video, promos and social at course scale — and re-render a module when the material changes.',
    pains: [
      'Reshooting a module costs more than writing it',
      'Promo content always lags the curriculum',
      'Localisation is a project, not a setting',
    ],
    gains: [
      'Modules re-render when source material changes',
      'Consistent narration across a whole curriculum',
      'Promo and social cut from lesson content',
      'Localisation as a run parameter',
    ],
    metric: { value: 'Minutes', label: 'to re-render a module' },
  },
];

/* ------------------------------------------------------------- Engagements */
export const ENGAGEMENTS = [
  {
    id: 'build',
    n: '01',
    name: 'Build & hand over',
    kicker: 'You own it and run it',
    summary:
      'We design and build the system around your workflow, run it alongside your team until the ' +
      'output is consistently publishable, then hand over the running system, your credentials ' +
      'and the documentation.',
    forWho: 'Teams with in-house operators who want the asset on their own books.',
    includes: [
      'Discovery and workflow mapping',
      'Custom pipeline build, all ten steps of the run',
      'No content limit. Publish as much as you want',
      'Everything runs and stays on your own machines',
      'One system covers every brand you handle',
      'One build cost, then only what the vendors charge',
      'Team training and a supported handover window',
      'Guaranteed bug support and change requests',
    ],
    outcome: 'A production system you own, staffed by the team you already have.',
  },
  {
    id: 'managed',
    n: '02',
    name: 'Fully managed',
    kicker: 'We run it for you',
    summary:
      'We already run this system. We onboard your brand onto it, connect your ' +
      'channels and start publishing, usually inside a week. You approve the plan and finished ' +
      'content appears on your channels.',
    forWho: 'Teams who want the output now, or who want to prove the workflow before committing to a build.',
    includes: [
      'Live in under a week, with no build to wait for',
      'A monthly plan, far below the cost of a build',
      'A content allowance set by your package',
      'Day-to-day operation, monitoring and publishing',
      'Content plan development with your team',
      'Analytics you can check any time, plus a monthly report',
      'We carry the responsibility for publishing on schedule',
      'Move to your own system whenever you decide to',
    ],
    outcome: 'Published content on schedule, with no system to run and no new headcount.',
  },
];

/* ---------------------------------------------------------------- Channels */
/* `icon` keys into the brand glyph set in system.astro. Marks are used
   nominatively, to name the destination we publish to, and rendered in a single
   tone which every one of these brand guidelines permits. */
export const CHANNELS = [
  { name: 'YouTube', icon: 'youtube', formats: 'Long-form · Shorts & community posts' },
  { name: 'Instagram', icon: 'instagram', formats: 'Reels · Feed posts · Stories' },
  { name: 'Facebook', icon: 'facebook', formats: 'Video · Reels · Page posts' },
  { name: 'TikTok', icon: 'tiktok', formats: 'Short-form & carousel posts' },
  { name: 'LinkedIn', icon: 'linkedin', formats: 'Long-form · Shorts · Documents & feed posts' },
  { name: 'X', icon: 'x', formats: 'Video · Threads & feed posts' },
  { name: 'Pinterest', icon: 'pinterest', formats: 'Idea Pins · Video & feed posts' },
  { name: 'Threads', icon: 'threads', formats: 'Video · Text & feed posts' },
  { name: 'Website blogs', icon: 'web', formats: 'Articles, newsletters & documentaries' },
];


/* ------------------------------------------------------------------ Process */
/* Durations are days, not weeks: the stated build window is 7 to 21 days, and
   an eight week schedule here contradicted it on a page one click away. */
export const PROCESS = [
  {
    n: '01',
    name: 'Requirements analysis',
    duration: 'First call',
    body: 'We go through how your content gets made now and mark what is slow, what breaks, and what is worth fixing first. You leave knowing whether a system is worth building for you.',
  },
  {
    n: '02',
    name: 'Workflow design',
    body: 'We agree what the system runs on its own, what runs with a person in the loop, and what stays manual, then the same again for review. Every input and every output is named, and the whole path is joined up end to end.',
  },
  {
    n: '03',
    name: 'Pipeline build',
    body: 'Built to run where you want it: in the cloud, entirely on your own machines, or a mix of both. A dedicated host or a local machine for anything that has to run around the clock, on macOS, Windows or whatever your team already uses.',
  },
  {
    /* Not a step in the sequence: this is the standard applied while the
       pipeline above is being written, so it renders without a phase number. */
    always: true,
    name: 'Protection and rights',
    duration: 'Every phase',
    body: 'Sensitive material is encrypted and kept inside the system, credentials are stored properly, and nothing is passed to anyone beyond the one AI vendor the build runs on. Video is produced to editor standard rather than generated, so the build stays inside the AI Act and copyright rules with you.',
    /* `more` is optional and only /how-we-build renders it — engagements.astro
       has its own template for these steps and never reads the field. */
    more: { label: 'Read the rights and AI Act position in full', href: '/trust/#rights' },
  },
  {
    n: '04',
    name: 'Test run',
    body: 'We run the whole thing as a demo, from the first upload through to the finished output, and tune it until it is right. Nothing is deployed until you have watched a full run and approved it.',
  },
  {
    n: '05',
    name: 'Deploy and support',
    duration: 'Ongoing',
    body: 'You get the system and do your work through its front end. The code behind it stays with us, the way a studio keeps its working files, which is how we can stand behind the build and fix anything that breaks. When you want the pipeline changed later, you tell us and we make the change with you.',
    more: { label: 'Who owns what, and what it costs', href: '/engagements/' },
  },
];

/* ----------------------------------------------------------------- Formats */
/**
 * What a run actually hands over, as files.
 *
 * `w`/`h` are the true aspect ratio and drive the preview shape, so the picture
 * cannot drift from the label. Every format here is already claimed elsewhere on
 * the site (the Assembly stage outputs, and the home page's build sequence);
 * this states them as artefacts rather than as prose.
 */
export const FORMATS = [
  {
    kind: 'video',
    w: 16, h: 9,
    ratio: '16:9',
    name: 'Long-form video',
    d: 'Landscape, with your intro and outro attached, assembled to the brand template.',
    for: 'YouTube · blog embeds',
  },
  {
    kind: 'video',
    w: 9, h: 16,
    ratio: '9:16',
    name: 'Short-form video',
    d: 'Composed for vertical in the same run, with the same intro and outro treatment.',
    for: 'Shorts · Reels · TikTok',
  },
  {
    kind: 'thumb',
    w: 16, h: 9,
    ratio: '16:9',
    name: 'Thumbnails',
    d: 'Generated as a tested set rather than a single guess, styled to your channel.',
    for: 'YouTube',
  },
  {
    kind: 'post',
    w: 1, h: 1,
    ratio: '1:1',
    name: 'Community posts',
    d: 'Square image posts pulled from the same script, so the message stays one message.',
    for: 'YouTube community · feeds',
  },
  {
    kind: 'graphic',
    w: 4, h: 5,
    ratio: '4:5',
    name: 'Graphic posts',
    d: 'Square or portrait, sized to each platform and delivered in PNG.',
    for: 'Instagram · LinkedIn · Facebook',
  },
  {
    kind: 'article',
    w: 4, h: 5,
    ratio: 'Article',
    name: 'Blog articles',
    d: 'Written from the same brief, with a cover image and inner images placed in the body.',
    for: 'Your blog · newsletters',
  },
];

/* ---------------------------------------------------------------- Workflow */
/**
 * The ten steps of a run, as the client describes them.
 *
 * This supersedes the six-STAGE model for the reader-facing page: the two
 * described the same pipeline at different granularities and contradicted each
 * other on the page. STAGES is retained above for its per-stage output lists.
 *
 * Two claims here are the client's own and are worth confirming before launch:
 * the YouTube Shorts thumbnail support, and the rights position in EXTRAS 03.
 */
/* Grouped into four phases so the page renders blocks rather than one
   ten-item column, which ran far too long to scan. */
export const WORKFLOW_PHASES = [
  { id: 'input',   k: 'Phase 01', t: 'What you hand it' },
  { id: 'produce', k: 'Phase 02', t: 'It writes and builds' },
  { id: 'package', k: 'Phase 03', t: 'It prepares every file' },
  { id: 'publish', k: 'Phase 04', t: 'It ships, then confirms' },
];

export const WORKFLOW = [
  {
    n: '01',
    phase: 'input',
    icon: 'doc',
    name: 'You upload the source',
    sum: 'Any document the system can read, plus the date you want it live.',
    d: 'A brief, a concept note, a research paper, a report, a guide, or a finished script. Most clients upload a short brief describing the service or the topic. A healthcare agency might upload a plain text file covering one treatment. You set the publish date and time at the same moment you upload.',
  },
  {
    n: '02',
    phase: 'produce',
    icon: 'brain',
    name: 'It reads and writes the script',
    sum: 'Decides the strongest angle, researches around it, then writes the full script.',
    d: 'The system works through the document, settles on the piece worth making, gathers supporting detail around that topic, and writes a complete video script built to carry real expertise rather than fill a slot.',
  },
  {
    n: '03',
    phase: 'produce',
    icon: 'film',
    name: 'It builds the video',
    sum: 'Rendered against your presets, in the ratio each destination needs.',
    d: 'Landscape or portrait is decided by where the run is going, not chosen afterwards. Your intro, outro, typography and motion presets are applied as the video is assembled.',
  },
  {
    n: '04',
    phase: 'produce',
    icon: 'check',
    name: 'It reviews the video',
    sum: 'Checked against the script it came from, before anything else happens.',
    d: 'Narration matched to the script, timings correct, on-screen text right, no dropped or duplicated segments. A run that fails this check does not move forward.',
  },
  {
    n: '05',
    phase: 'package',
    icon: 'text',
    name: 'It writes the descriptions',
    sum: 'Per platform, with high-intent keywords and any links the run needs.',
    d: 'Each channel gets copy written for that channel rather than one description pasted everywhere, including the calls to action and links you want carried.',
  },
  {
    n: '06',
    phase: 'package',
    icon: 'image',
    name: 'It makes thumbnails and graphics',
    sum: 'Thumbnails for YouTube, plus community posts and social graphics.',
    d: 'Thumbnails are produced for long-form and for Shorts, and the same run produces the community posts and the square or portrait graphics each feed expects.',
  },
  {
    n: '07',
    phase: 'package',
    icon: 'check',
    name: 'It reviews the graphics',
    sum: 'Every thumbnail and every graphic checked before anything is queued.',
    d: 'Crops, safe areas, text overflow, brand treatment and platform limits are all verified while it is still cheap to fix.',
  },
  {
    n: '08',
    phase: 'publish',
    icon: 'send',
    name: 'It schedules to your channels',
    sum: 'YouTube, Facebook, Instagram, LinkedIn, TikTok, Threads and the rest.',
    d: 'Queued to the dates and times your content plan sets, in the correct time zone. We preload content calendars during the build, so there is a plan to work against from day one.',
  },
  {
    n: '09',
    phase: 'publish',
    icon: 'shield',
    name: 'It cross-checks the queue',
    sum: 'One last pass over every asset, description and scheduled slot.',
    d: 'Assets and copy are verified once more, and every slot is confirmed as accepted by the platform rather than assumed. Scheduling runs through the official Meta, YouTube and platform APIs.',
  },
  {
    n: '10',
    phase: 'publish',
    icon: 'calendar',
    name: 'It updates your calendar',
    sum: 'Statuses written back, then watched on the day of publishing.',
    d: 'Every piece has its status updated automatically as it moves. On the publish date the system monitors each item and confirms it actually went live rather than marking it done and looking away.',
  },
];

/* Four things that sit alongside the run rather than inside it. */
/* `more` is optional: a contextual link rendered under the card. Only the two
   cards that make a claim a reader may want to verify carry one — /system had
   no link to /trust/ at all despite these two paragraphs being exactly what
   that page documents. */
export const WORKFLOW_EXTRAS = [
  {
    n: '01',
    icon: 'article',
    t: 'Blog posts and newsletters, from the same upload',
    d: 'The details pulled out of your document also become written articles and newsletter issues, created in the same run and published straight into your site through its API.',
  },
  {
    n: '02',
    icon: 'bell',
    t: 'If it needs you, you hear about it',
    d: 'Anything that needs a decision from you reaches you by email, SMS or WhatsApp, whichever you pick. Items you have asked to approve by hand notify you the same way.',
  },
  {
    n: '03',
    icon: 'shield',
    t: 'The rights stay with you',
    d: 'Background music is copyright free, and the build follows AI Act and copyright guidance. Video is not produced through third-party AI video generators, so the authority and the licence in what it makes stay yours.',
    more: { label: 'What we disclose, and to whom', href: '/trust/#rights' },
  },
  {
    n: '04',
    icon: 'lock',
    t: 'Sensitive material never leaves',
    d: 'Unreleased product detail and anything else you mark as protected is encrypted and held inside your own system. It is used to make the content and it is not sent anywhere else.',
    more: { label: 'Everything the system talks to', href: '/trust/#data' },
  },
];

/* --------------------------------------------------- FAQ, /system page only */
/**
 * Questions about the run itself. The home page keeps the generic "what is
 * this" set; this page answers what a reader asks once they have scrolled the
 * ten steps. Keeping them separate also stops three URLs emitting the same
 * FAQPage node, which is the duplication Google discounts.
 *
 * Counts are interpolated from the arrays above rather than typed out. Every
 * step count written as prose on this site has drifted at least once; this way
 * editing WORKFLOW or CHANNELS edits the answer with it.
 */
const spell = (n) =>
  ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine', 'ten'][n] ?? String(n);
/* spell() at the head of a sentence. */
const Spell = (n) => spell(n).replace(/^./, (c) => c.toUpperCase());

export const SYSTEM_FAQ = [
  {
    q: 'What happens after I upload one document to the system?',
    a:
      `The run is ${spell(WORKFLOW.length)} steps in ${spell(WORKFLOW_PHASES.length)} phases. It reads your ` +
      'document and settles on the angle worth making, writes the script, builds and renders ' +
      'the video, checks that video against the script, writes a description for each ' +
      'platform, produces the thumbnails and graphics, checks those too, schedules ' +
      'everything to your calendar, cross-checks the queue, then confirms each item went ' +
      'live. You set the publish date and time at the moment you upload. Nothing between ' +
      'those two points needs you.',
  },
  {
    q: 'Does the system review its own work, or do we have to check every file?',
    a:
      'There are three review gates in every run: the finished video against the script it ' +
      'came from, then every thumbnail and graphic before anything is queued, then the whole ' +
      'queue before it goes out. Each gate is several passes rather than one look. The script ' +
      'is reviewed, the audio is reviewed, the visuals are reviewed, the intro is reviewed and ' +
      'the questions are reviewed, each before that step is allowed to finalise. A run that ' +
      'fails a pass stops instead of publishing. ' +
      'On the publish date it watches each item and confirms it actually went live rather ' +
      'than marking it done and looking away. Anything that genuinely needs a decision from ' +
      'you arrives by email, SMS or WhatsApp. Approving by hand is a step you can keep, not ' +
      'one the system requires.',
  },
  {
    q: 'How does one upload become both a 16:9 video and a 9:16 short?',
    a:
      `Each ratio is composed for that ratio from the start, so nothing is cropped down from ` +
      `a master, which is what makes reformatted content look reformatted. ${Spell(FORMATS.length)} ` +
      'output shapes come out of a single run: long-form 16:9 video, 9:16 short-form, 16:9 ' +
      'thumbnails, 1:1 community posts, 4:5 graphic posts and a written article. Landscape or ' +
      'portrait is decided by where a piece is going, before it is built.',
  },
  {
    q: 'Which social media platforms can the system publish to automatically?',
    a:
      'Publishing runs from one content plan to ' +
      /* "Website blogs" is a card label; in a sentence it needs to read as a place. */
      `${CHANNELS.flatMap((c) => (c.icon === 'web' ? ['your own blog', 'your newsletter'] : [c.name]))
        .join(', ')
        .replace(/, ([^,]*)$/, ' and $1')}. ` +
      'Scheduling runs through the official Meta, YouTube and platform APIs rather than a ' +
      'browser script that breaks the week a page layout changes. Each asset is sized, ' +
      'captioned and timed for the platform it is going to, in the correct time zone.',
  },
  {
    q: 'What happens if a scheduled post fails to publish?',
    a:
      'The queue is cross-checked before anything goes out, and every slot is confirmed as ' +
      'accepted by the platform rather than assumed. On the day, the system watches each ' +
      'item and writes the real status back to your calendar. If something needs you, it ' +
      'reaches you by email, SMS or WhatsApp, whichever you pick, instead of leaving a gap ' +
      'in your schedule that you find a week later.',
  },
  {
    q: 'Does it write blog posts and newsletters from the same upload?',
    a:
      'Yes. The detail pulled out of your document also becomes written articles and ' +
      'newsletter issues in the same run, published straight into your site through its ' +
      'API. One upload feeds the long-form video, the short-form versions, the thumbnails, the ' +
      'graphics, the descriptions and the written work, so the blog stops being a separate ' +
      'project with a separate brief.',
  },
  {
    q: 'Who owns the copyright of the video the system produces?',
    a:
      'You do. Background music is copyright free, and video is not produced through ' +
      'third-party AI video generators, so the authorship and the licence in what it makes ' +
      'stay with you. Where AI is used, for writing, scripting, voiceover and review, that ' +
      'use is disclosed at the point of generation and recorded on the asset, which is what ' +
      'the transparency rules already in force require. This is how the build is designed ' +
      'and not legal advice, so have your own counsel read it against your obligations.',
  },
  {
    q: 'What happens to confidential material we upload?',
    a:
      'Unreleased product detail, pricing, internal research and anything else you mark as ' +
      'protected is encrypted and held inside your own system. It is used to make the ' +
      'content and it is not sent anywhere else. The pipeline runs on your accounts and ' +
      'your credentials, so unpublished work is not scattered across trial SaaS accounts ' +
      'you would later have to account for to a client.',
  },
];

/* ---------------------------------------------- FAQ, /how-we-build page only */
/**
 * Build-intent questions. The home page keeps the generic "what is this" set
 * and /system answers what a run does; this answers what buying and running a
 * build involves. Three separate sets also stop three URLs emitting the same
 * FAQPage node, which is the duplication search engines discount.
 *
 * Every figure here is the client's own operating commitment: 7 to 21 days,
 * three meetings, thirty days of daily monitoring, 24/7 portal support, and the
 * bug-free guarantee. None of it is derived from the code.
 */
export const BUILD_FAQ = [
  {
    q: 'How long does it take to build a custom AI content system?',
    a:
      'Seven to twenty one days from the first call to handover, depending on scope. A single ' +
      'channel with one format sits at the short end; a multi-brand build with approval gates ' +
      'and several destinations sits at the long end. It needs at least three meetings from you: one to ' +
      'agree the requirements, one to watch the system demo, and one to sign off the changes ' +
      'that came out of the demo.',
  },
  {
    q: 'What do we need to provide before the build starts?',
    a:
      'Your brand colours, fonts, logo files and website, plus any videos or graphics you have ' +
      'run before or want the output matched to. The first stage of the build is trained on ' +
      'those, which is what makes the output look like you rather than like a template. We also ' +
      'need four decisions: who monitors the system, who else needs access and their own login, ' +
      'where it runs, and how many pieces a month across which platforms.',
  },
  {
    q: 'Do you need access to our social media accounts?',
    a:
      'The system publishes to your accounts, so those connections have to be made once. You ' +
      'have two options. Either you give us access and we connect and configure everything, ' +
      'which is faster, and once setup is finished you reset your own passwords so our access ' +
      'ends there. Or your own team sets each connection up and we walk you through it, in ' +
      'which case nothing leaves your side at all. Either way the accounts stay yours.',
  },
  {
    q: 'Does the system run on our own machines or in the cloud?',
    a:
      'Either, or a mix. We recommend local. Tell us the machine and its specification, a ' +
      'Windows PC or which Mac, and we build around it. Anything that has to run around the ' +
      'clock wants a UPS and a stable connection, so a power cut or a dropout does not stop a ' +
      'run halfway through production. If you would rather it ran in the cloud, it can.',
  },
  {
    q: 'What happens if the system breaks after it goes live?',
    a:
      'A monitoring agent watches the system continuously and repairs most faults on its own, ' +
      'without anyone being called. On top of that we monitor every new system by hand, daily, ' +
      'for the first thirty days. Support is 24/7 by ticket from day one and stays that way. ' +
      'The full run is tested end to end on our own demo channels several times before it ' +
      'touches yours, which is why most of what we launch never produces a bug in ' +
      'production. Bug fixes are covered by the guarantee. Changes and updates are quoted ' +
      'separately.',
  },
  {
    q: 'Why do Instagram and TikTok reject posts, and how do you stop it happening?',
    a:
      'The usual cause is a description carrying too many website links, which the platforms ' +
      'read as spam. The system checks every link, hashtag and description before a piece is ' +
      'queued, and no asset reaches a channel without its copy having been reviewed first. ' +
      'Publishing runs through the official Meta, YouTube, X and platform APIs rather than ' +
      'around them, so a post is confirmed as accepted rather than assumed.',
  },
  {
    q: 'Do we get the source code with the system?',
    a:
      'The system is yours. It runs where you chose to put it, on your accounts and your data, ' +
      'and your ' +
      'team works through its front end. The code behind it stays with us, the way a studio ' +
      'keeps its working files rather than handing over the project source. That is what lets ' +
      'us guarantee the build, fix anything that breaks and keep improving it for you. And if ' +
      'we ever stopped trading, every credential you need to keep the system running is handed ' +
      'straight to you.',
  },
  {
    q: 'How much does a custom AI content system cost?',
    a:
      'It is scoped, not priced from a tier. Cost follows what has to be built: how many ' +
      'channels, how many brand profiles, how many runs a month, how much approval workflow, ' +
      'and how deep the integrations go. There is no package to pick and no per seat licence. ' +
      'Builds start at $2,000 and move with scope from there. Once it is live you pay the ' +
      'platform and AI usage for the runs you actually make, which starts around $100 a month ' +
      'and rises with volume; you can hold those accounts yourself or have us run them. There ' +
      'is no monthly fee to us for the system itself. We scope the rest on the call rather ' +
      'than quoting a range that would be right for exactly one buyer.',
  },
];

/* ------------------------------------------------------- Who it is for */
/**
 * The two kinds of team this is built for, and the evidence for the pain.
 *
 * EVERY figure below was taken from a named source that was opened and read,
 * and each carries its publisher and year in `src` so the claim can be checked.
 * Nothing here is estimated, rounded from memory, or inferred. If a figure
 * cannot be attributed it does not belong on this page.
 *
 * Source URLs, kept here rather than as outbound links so the page does not
 * send a reader away mid-argument:
 *   BLS OEWS (May 2025) ....... https://www.bls.gov/oes/current/oes274032.htm
 *   BLS ECEC (Mar 2026) ....... https://www.bls.gov/news.release/ecec.nr0.htm
 *   ONS ASHE (2025) ........... https://www.ons.gov.uk/employmentandlabourmarket/peopleinwork/earningsandworkinghours
 *   Moore Kingston Smith ...... 2025 Annual Survey of marketing services companies
 *   IPA ....................... Agency Census, 12 months to 1 September 2025
 *   Link in Bio ............... 2025 social media professionals survey
 *   Metricool ................. 2026 social media professionals survey
 *   HMRC ...................... Employer Class 1 NI, 2025-26 rates
 *   CMI / MarketingProfs ...... B2B Content Marketing Benchmarks, fielded Jun-Aug 2024
 *   Sprout Social ............. Content Benchmarks Report, 2024 data
 *   Panko, R. ................. EuSpRIG proceedings 2007, human error rates
 *   WFA / Observatory Intl .... In-housing survey 2023 (n=45)
 *   YunoJuno .................. 2025 Freelancer Rates Report
 */
export const AUDIENCES = [
  {
    id: 'agencies',
    n: '01',
    short: 'Agencies',
    kicker: 'For agencies',
    name: 'You run content for other people’s brands',
    who: 'Marketing, media, social, creative and production agencies',
    lede:
      'You already deliver. The problem is that the next client costs you another hire, and the ' +
      'team you have is at its limit.',
    pains: [
      {
        stat: '61.8%',
        src: 'Moore Kingston Smith, 2025',
        t: 'Of gross income already goes on staff',
        d: 'Across UK marketing services firms, roughly six pounds in every ten earned is paid straight back out in wages. Growth bought with headcount barely moves the margin.',
      },
      {
        stat: '77%',
        src: 'Link in Bio, 2025',
        t: 'Of social professionals report burnout',
        d: 'Forty five percent are considering leaving the field altogether, and 73 percent regularly work outside their contracted hours (Metricool, 2026). The capacity you are counting on is already borrowed.',
      },
      {
        stat: '68.6%',
        src: 'IPA, year to Sept 2025',
        t: 'Agency staff retention, down from 74.9%',
        d: 'Roughly one person in three leaves within the year. Every departure takes the client knowledge, the brand rules and the half-finished calendar with it.',
      },
      {
        stat: '1 in 200',
        src: 'Panko, EuSpRIG 2007',
        href: 'https://arxiv.org/abs/0801.3114',
        t: 'Human error rate on simple tasks',
        d: 'Two to five percent on complex ones. Across hundreds of scheduled posts a month, a client’s asset going to the wrong channel is not bad luck. It is arithmetic.',
      },
    ],
    gains: [
      'One upload becomes every asset that client needs, per brand profile',
      'Every piece reviewed against its own brand before it is queued',
      'Runs continuously, with no leave, handover or ramp-up',
      'Take on the next client without taking on the next hire',
    ],
    close: 'The volume stops being a staffing question.',
  },
  {
    id: 'brands',
    n: '02',
    short: 'Brands',
    kicker: 'For brands',
    name: 'You run your own channels',
    who: 'Companies keeping an in-house team, freelancers, or an outside agency',
    lede:
      'You need short video, long video and graphics going out consistently. Every way of ' +
      'staffing that has a cost you have already felt.',
    pains: [
      {
        stat: '$75,420',
        src: 'US BLS, May 2025',
        t: 'US median wage, film and video editors',
        d: 'And the wage is not the cost. Across US private industry, wages are only 69.9 percent of what an employer actually pays for a person; benefits are the other 30.1 percent (BLS, March 2026). In the UK, employer National Insurance adds 15 percent above the secondary threshold on top of that (HMRC, 2025-26).',
      },
      {
        stat: '£390',
        src: 'YunoJuno, 2025',
        t: 'Average UK freelancer day rate',
        d: 'Freelancers solve a month and leave a gap. The brand knowledge goes with them, and the next one starts from your brand guidelines again.',
      },
      {
        stat: '56%',
        src: 'WFA / Observatory, 2023',
        t: 'Of large brands are moving production in-house',
        d: 'Their stated reasons are cost efficiency (83 percent) and speed (76 percent). Outsourcing trades one problem for agreements, scope arguments and work you cannot see being done.',
      },
      {
        stat: '54%',
        src: 'CMI / MarketingProfs, 2024',
        t: 'Name lack of resources as their biggest obstacle',
        d: 'It is the most cited obstacle in the survey, and it has stayed at the top year after year. Not ideas and not budget: people, and the hours they have. One person on leave is all it takes for a quarter of planned content to quietly not happen.',
      },
    ],
    gains: [
      'No team to manage and no agency to brief',
      'One person monitors it, from anywhere',
      'Runs on your own machines, so nothing sensitive leaves your side',
      'Raise the volume without raising the headcount to match',
    ],
    close: 'Your presence stops depending on who is available.',
  },
];

/* The threshold, stated once and read by both the hero and the disqualifiers
   so the two can never disagree about who this is for. */
export const FIT = { pieces: 10, accounts: 3 };

/* ------------------------------------------------- Why a system, not people */
/**
 * The case for building, placed between "who this is for" and "who it is not".
 *
 * Every figure was opened and read at source, and each carries its publisher,
 * year and geography. Deliberately weighted to GLOBAL and multi-market data
 * rather than US-only: the audience spans the US, UK, Germany and Western
 * Europe, Australia and New Zealand, the Gulf and South Africa, and a page of
 * American statistics reads as a page written for Americans.
 *
 * Where a figure is NOT global it says so in `geo`, and the page prints that.
 *
 * Sources, kept here rather than as outbound links:
 *   GWI / DataReportal ..... Digital 2026 Global Overview Report (GWI Q2 2025)
 *   Ericsson ............... Mobility Report, mobile traffic update, 2025
 *   Metricool .............. 2026 Instagram Study, 375,118 accounts worldwide
 *   WFA .................... Global Content Production 2025 (50 multinationals)
 *   Meta ................... Q4 and Full Year 2025 results
 *   WFA Outlook ............ biannual media inflation poll, 2026 forecast
 *   Wernerfelt et al. ...... Marketing Science 2025, 44(2) — NBER WP 32765
 *   Edelman ................ 2026 Trust Barometer, Brand Growth special report
 *   Knak ................... Marketing Production in the Age of AI, 2026
 */
/* Source URLs are attached only where the page was fetched and the exact claim
   confirmed on it. Everything else keeps its text attribution and no link: an
   outbound 404 costs more than a missing hyperlink, and a citation nobody can
   open is worse than one nobody clicked. Hub pages are preferred over deep PDF
   links because they survive a site restructure. */
export const DEMAND = [
  {
    stat: '91.1%',
    geo: 'Global',
    src: 'GWI / DataReportal, 2025',
    href: 'https://datareportal.com/reports/digital-2026-global-overview-report',
    t: 'Watch online video every week',
    d: 'Of adult internet users worldwide, in the past seven days. Video is not a format you add to the plan. It is the plan.',
  },
  {
    stat: '75%',
    geo: 'Global',
    src: 'Ericsson, 2025',
    href: 'https://www.ericsson.com/en/reports-and-papers/mobility-report',
    t: 'Of mobile data traffic is video',
    d: 'Measured across worldwide operator networks at the end of 2025. Most of what a phone downloads all day is somebody’s video.',
  },
  {
    stat: '4x',
    geo: 'Worldwide, 375,118 accounts',
    src: 'Metricool, 2026',
    t: 'More interaction than a still image',
    d: 'Instagram Reels against single-image posts. The same reach costs you a video, not a graphic, and the gap is widening.',
  },
  {
    stat: '19%',
    geo: 'Global, 50 multinationals',
    src: 'WFA, 2025',
    t: 'Of budget is left for production, down from 24%',
    d: 'And nearly two thirds of the world’s largest advertisers expect to increase social content production anyway. More output, smaller budget, same team.',
  },
];

export const PAID = [
  {
    stat: '+9%',
    geo: 'Global',
    src: 'Meta, FY2025',
    href: 'https://investor.atmeta.com/investor-news/press-release-details/2026/Meta-Reports-Fourth-Quarter-and-Full-Year-2025-Results/default.aspx',
    t: 'Rise in average price per ad',
    d: 'Meta’s own reported figure for full-year 2025, across every market it sells in. Impressions grew faster than price, and the price still went up.',
  },
  {
    stat: '+4.4%',
    geo: 'Global, incl. UK and Germany',
    src: 'WFA Outlook, 2026',
    t: 'Forecast media price inflation',
    d: 'The rise in the cost of buying the same media, pooled across markets, up from 4.0 percent in 2025. Standing still gets more expensive every year.',
  },
  {
    stat: '+31%',
    geo: 'Advertisers in 160+ countries',
    src: 'Marketing Science, 2025',
    t: 'Higher cost per customer without tracking',
    d: 'Median cost of acquiring one incremental customer rose from $38.16 to $49.93 across 70,909 randomised experiments once offsite tracking data was removed.',
  },
  {
    stat: '5x',
    geo: 'Global, 15 countries',
    src: 'Edelman, 2026',
    t: 'Unpaid voices beat paid ones on trust',
    d: 'And 88 percent say trusting the brand is an important or critical purchase criterion, level with quality and value. Attention you rent is worth less than attention you earn.',
  },
];

/* The pain, and the answer to it, side by side. Kept to things the system
   actually does — nothing here is aspirational. */
export const FIXES = [
  {
    problem: 'Launches slip, and creative production is why.',
    note: '85% of teams missed at least one planned launch; 38% named design and production as the cause. Knak, 2026, US, UK and Canada.',
    fix: 'One upload becomes every asset inside a day, already scheduled.',
  },
  {
    problem: 'Under load, review is the first thing to get skipped.',
    fix: 'Three review gates run on every piece, and a run that fails one stops instead of publishing.',
  },
  {
    problem: 'A client’s asset goes out on another client’s channel.',
    fix: 'Every run is bound to one brand profile, so the wrong destination is not reachable.',
  },
  {
    problem: 'Publishing goes quiet whenever someone is away.',
    fix: 'The system runs continuously. No leave, no handover, no ramp-up after a holiday.',
  },
  {
    problem: 'More volume means more people, and more people to manage.',
    fix: 'Volume rises without the headcount rising with it. One person monitors the whole operation.',
  },
  {
    problem: 'Costs climb every year while output stays flat.',
    fix: 'The build is paid once. After that you pay for what you actually run.',
  },
];

/* ------------------------------------------------------------ Who it fits */
/**
 * The buyer list, grouped. This exists to let a reader find themselves on the
 * page, and to give the page the long-tail terms people actually search for
 * ("social media agency", "franchise marketing", "exam prep content").
 *
 * The grouping is not arbitrary. It follows where published benchmarks say the
 * content volume actually is:
 *   Media 64 posts/day, leisure and sport 31/day, against an all-industry
 *   average of 9.5 ......................... Sprout Social, 2024 data, global
 *   Higher education and sport lead engagement ... Quid (Rival IQ), 2026, global
 *   US social budget share: retail 22.98%, CPG 20.34%, healthcare 14.71%,
 *   tech 14.37%, professional services 12.67% ..... The CMO Survey, 2026, US
 *   99% of multi-location brands invest in social; high performers are 25%
 *   more likely to use video locally .... BrightLocal, 2024, US, UK and Canada
 *   200k+ agencies worldwide, 87% under 50 staff ... Promethean Research, 2026
 */
export const FITS = [
  {
    k: 'Agencies and studios',
    note: 'Running content for other people’s brands, several at a time.',
    items: [
      'Marketing agencies',
      'Digital marketing agencies',
      'Social media agencies',
      'Creative and design studios',
      'Media and advertising agencies',
      'PR and communications',
      'Content and SEO agencies',
      'Influencer marketing agencies',
      'Video production companies',
      'Performance and growth agencies',
    ],
  },
  {
    k: 'Media, sport and education',
    note: 'The heaviest publishers measured, and the ones audiences engage with most.',
    items: [
      'Publishers and media companies',
      'Sports clubs, leagues and teams',
      'Universities and higher education',
      'Schools and training providers',
      'Course creators and e-learning',
      'Exam preparation and certification',
      'Membership and community brands',
    ],
  },
  {
    k: 'Retail, consumer and hospitality',
    note: 'Where the biggest share of marketing budget already goes to social.',
    items: [
      'E-commerce and DTC brands',
      'Retail and wholesale groups',
      'Consumer packaged goods',
      'Food and beverage brands',
      'Restaurants and hospitality',
      'Travel and tourism',
      'Beauty and cosmetics',
      'Fitness, gyms and wellness',
    ],
  },
  {
    k: 'Services, property and multi-location',
    note: 'One brand, many branches, and a calendar per location.',
    items: [
      'Franchises and multi-location groups',
      'Real estate and property',
      'Healthcare clinics and practices',
      'Financial services and insurance',
      'Professional and legal services',
      'Recruitment and staffing',
      'Automotive groups and dealerships',
      'SaaS and technology companies',
    ],
  },
];

/* Stated once so the page and any future page cannot disagree about where we
   work. Supersedes the older primary/secondary/later coverage table. */
export const MARKETS =
  'the United States, the United Kingdom, Germany and Western Europe, ' +
  'Australia and New Zealand, the Gulf and South Africa';

/* ------------------------------------------------ Trust: the real posture */
/**
 * What the system actually does about privacy, data and rights.
 *
 * Vendors are described by ROLE, never by name. The client asked specifically
 * that the AI provider not be named on the site, and naming the publishing
 * layer invites "so I could wire that up myself" — which is exactly the
 * conversation this page exists to avoid. Names are shared with clients
 * directly, on the call, along with each vendor's own privacy terms.
 *
 * Everything below is a described property of the build. Nothing here is a
 * certification: GroovyMark holds no SOC 2 or ISO 27001 and the page says so.
 */
export const SURFACE = [
  {
    n: '01',
    k: 'One AI model provider',
    d: 'Writing, scripting, structuring and review. A single provider under a single agreement, not a different model for every task.',
    limit: 'Cannot delete. Cannot edit anything without your say-so.',
  },
  {
    n: '02',
    k: 'One voice provider',
    d: 'Voiceover generation, and nothing else. It receives the script line it has to speak.',
    limit: 'Receives the script, not the source material behind it.',
  },
  {
    n: '03',
    k: 'One publishing layer',
    d: 'Scheduling and publishing to the channels you connect, under your own accounts.',
    limit: 'Has no power to edit or delete a published post.',
  },
  {
    n: '04',
    k: 'Your own site',
    d: 'A custom integration we build for your blog and newsletter, and for reading content back off your site.',
    limit: 'Runs against your site, on your infrastructure.',
  },
];

export const POSTURE = [
  {
    t: 'The model is briefed, not handed the file',
    d: 'The system reads your document locally and sends only the brief it needs to write from. Your full document does not leave the machine it sits on. That is the single biggest difference between this and pasting a report into a chat window.',
  },
  {
    t: 'Nothing is deleted, and nothing is changed without you',
    d: 'The integrations are constrained at the point they are wired in. No destructive action is available to the system, and no edit lands without your approval.',
  },
  {
    t: 'Published work cannot be quietly altered',
    d: 'The publishing layer can queue and post. It cannot edit or delete what has gone out. Everything is reviewed before it is queued, so the review is the control, not a rollback afterwards.',
  },
  {
    t: 'Protected material stays on your side',
    d: 'Unreleased product detail, pricing, internal research and anything else you mark as protected is encrypted and held inside your own system. It is used to make the content and it is not sent anywhere else.',
  },
  {
    t: 'The logs stay on your machine',
    d: 'Run logs are written into the same folder you nominated for finished videos and posts, on your own device. They are mostly the scripts the system wrote. Nothing is copied off to us, and you can delete any of it whenever you like.',
  },
  {
    t: 'No account passwords are stored, anywhere',
    d: 'The system holds no login details for your channels or your accounts. The only secret it keeps is the API keys it needs to run, in a single encrypted file that you hold the password to. If you give us access to connect a channel during setup, you reset that password yourself once setup is finished.',
  },
  {
    t: 'Four integrations is the whole data map',
    d: 'Not fifteen SaaS trials, each with its own retention policy and breach surface. A data map this short is one you can hand to a client without a paragraph of caveats.',
  },
  {
    t: 'Your keys or ours',
    d: 'You can hold the provider accounts yourself and we build against them, or we provide ours and run them for you. Either way it stays one provider per job, and we tell you exactly who they are.',
  },
];

export const RIGHTS = [
  {
    k: 'Music',
    d: 'Background music comes from a licensed library we hold the licence for. Nothing is lifted from a track you would have to argue about later.',
  },
  {
    k: 'Video',
    d: 'Not produced through third-party AI video generators, so the copyright and the licence in what it makes stay with you.',
  },
  {
    k: 'Disclosure',
    d: 'Where AI is used, for writing, scripting, voiceover and review, that use is disclosed at the point of generation rather than labelled afterwards, which is what the EU AI Act transparency rules in force require.',
  },
  {
    k: 'Footage and inputs',
    d: 'Licensed, generated and supplied material are tracked separately through the run, so a rights question has an answer rather than a guess.',
  },
];

/* Live counts. Update these two numbers and every page that states them
   follows; they are the only proof on the site that this is running software
   rather than a proposal. */
export const RUNNING = { live: 4, building: 6 };

/* ------------------------------------------- FAQ, /who-its-for page only */
/**
 * Fit questions: the ones asked before anyone cares how the pipeline works.
 * Home keeps the generic set, /system answers what a run does, /how-we-build
 * answers what buying one involves, and this answers "is it for us".
 *
 * Four separate sets also stop four URLs emitting the same FAQPage node.
 *
 * Counts are interpolated from FIT and RUNNING so the answers cannot drift
 * from the thresholds and proof points stated elsewhere on the page.
 */
export const WHO_FAQ = [
  {
    q: 'How much content do we need to be publishing for this to be worth it?',
    a:
      `More than ${FIT.pieces} pieces a month, across ${FIT.accounts} or more social accounts, with a ` +
      'person still touching every one of them. Below that a custom build does not pay for ' +
      'itself and a good freelance editor is cheaper and faster, which is something we will ' +
      'tell you on the call rather than after you have signed. The threshold is about ' +
      'repetition, not size: a small team publishing daily is a better fit than a large one ' +
      'publishing monthly.',
  },
  {
    q: 'Can one system handle several client brands at once?',
    a:
      'Yes, and that is the common case for agencies. Each client gets its own brand profile: ' +
      'its own colours, fonts, voice, templates and channel set. Every run is bound to one ' +
      'profile, so the wrong client’s asset cannot reach the wrong client’s channel. ' +
      'Adding a client means adding a profile rather than adding an editor.',
  },
  {
    q: 'We are an in-house team, not an agency. Does this still fit?',
    a:
      'It does, and it is the second of the two builds we do. An agency runs many brands ' +
      'through one system; a company runs one brand across many channels. The pipeline is the ' +
      'same underneath. What changes is the number of brand profiles and where the approvals ' +
      'sit. In-house teams usually end up with one person monitoring the system instead of ' +
      'managing a production team or briefing an outside agency.',
  },
  {
    q: 'What if we still want our own editors making the videos?',
    a:
      'That works. Talking heads, podcasts and anything that genuinely needs a person in the ' +
      'edit stay with your editors, and the system runs the operation around them: files in, ' +
      'review, approval, scheduling, publishing and the status write-back. The system does not ' +
      'have to make the video to take the coordination off your team. We design the build ' +
      'around how you actually make things.',
  },
  {
    q: 'Which industries is this actually being used in?',
    a:
      `There are ${RUNNING.live} systems live with clients today and ${RUNNING.building} more in build. ` +
      'The pattern that predicts fit is not the industry, it is the shape of the work: ' +
      'repetitive video and graphics, several channels, and a calendar that has to be met every ' +
      'week. That shows up in agencies, media and sport, education and exam preparation, ' +
      'e-commerce and retail, hospitality and travel, property, healthcare and any group ' +
      'running a separate account per branch.',
  },
  {
    q: 'Do you work with companies outside the US and UK?',
    a:
      `Yes. We build and deliver remotely, on hours that overlap yours, for teams across ${MARKETS}. ` +
      'Output language is a run parameter rather than a function of where we sit, so a build ' +
      'scoped in one country can publish in German, Spanish or Arabic. Your channel and vendor ' +
      'accounts stay in your name wherever you are.',
  },
  {
    q: 'What if we mostly publish graphics rather than video?',
    a:
      'That is a normal build. The same run produces community posts, social graphics, ' +
      'thumbnails and written articles, and it can produce those without producing video at ' +
      'all. Video is where most of the manual hours go, so teams tend to want it eventually, ' +
      'but a graphics-and-written build is a smaller, faster one and there is nothing wrong ' +
      'with starting there.',
  },
];

/* ------------------------------------------------ FAQ, /trust page only */
/**
 * The data and rights questions, which are the ones a reviewer opens the page
 * to find. Kept separate from the other three sets so no two URLs emit the
 * same FAQPage node, and so this page answers what it is actually about.
 *
 * Vendors stay unnamed here for the same reason as the rest of the page.
 */
export const TRUST_FAQ = [
  {
    q: 'What data actually leaves our machine?',
    a:
      'The brief the system writes from, and the script the voice provider has to speak. Not ' +
      'your source document. The system reads the file locally, works out what the piece needs ' +
      'to say, and sends only that. Anything you mark as protected, unreleased product detail, ' +
      'pricing or internal research, is encrypted and stays inside your own system.',
  },
  {
    q: 'Do you hold our API keys, or do we?',
    a:
      'Either, and it is your choice. You can hold the provider accounts yourself and we build ' +
      'against them, or we provide ours and run them for you, which is the simpler option and ' +
      'the simpler one. Your social channels stay in your name in both cases. If you ' +
      'give us access to connect them, you reset your own passwords once setup is finished.',
  },
  {
    q: 'Can the system delete or change something we have already published?',
    a:
      'No. The publishing layer can queue and post, and it has no power to edit or delete what ' +
      'has gone out. That is a deliberate constraint at the integration rather than a rule ' +
      'someone has to remember. Every piece is reviewed before it is queued, so the review is ' +
      'the control rather than a rollback afterwards.',
  },
  {
    q: 'How many third parties end up holding our content?',
    a:
      'Four integrations in total: one AI model provider, one voice provider, one publishing ' +
      'layer and a custom integration with your own site. That is the complete list. The point ' +
      'is the length of it, because a data map this short is one you can hand to your own ' +
      'client without a paragraph of caveats. We name every vendor on the call ' +
      'and give you their own privacy terms with them.',
  },
  {
    q: 'How long do you keep our content, and where is it kept?',
    a:
      'We do not keep it. Run logs and the finished files are written into the folder you ' +
      'nominated on your own machine, and they stay there. They are mostly the scripts the ' +
      'system wrote, and you can delete any of it whenever you want without asking us. There ' +
      'is no copy sitting on our side waiting to be requested back.',
  },
  {
    q: 'Are you SOC 2 or ISO 27001 certified?',
    a:
      'No, and we will not imply otherwise. What we can show you is how the build is ' +
      'constructed: which four services it talks to, what each one receives, what each one is ' +
      'prevented from doing, and where your material is held. If a certification is a hard ' +
      'requirement for your procurement process, say so on the first call and we will tell you ' +
      'plainly whether we can meet it.',
  },
  {
    q: 'What happens to our data if we stop working with you?',
    a:
      'The system runs on your machines and publishes under channels in your own name, so your content and your channels ' +
      'are already on your side of the line. If we ever stopped trading, every credential you ' +
      'need to keep it running is handed straight to you. The code behind it stays with us the ' +
      'way a studio keeps its working files, which is what lets us guarantee the build while it ' +
      'is in service.',
  },
  {
    q: 'Can we see it working before we commit to anything?',
    a:
      'Yes, and we would rather you did. We run a real document end to end in front of you: ' +
      'script, voiceover, video, thumbnails, descriptions and the scheduled queue, including ' +
      'where it stops when something is wrong. If you want to go further before committing to a ' +
      'build, have GroovyMark run the work as a managed service on your own brand first and ' +
      'commission your own system later.',
  },
];

/* ------------------------------------------ FAQ, /engagements page only */
/**
 * Choosing between the two models. Every other set answers what the thing is,
 * how it runs, who it suits or how data is handled; this one answers "which of
 * the two do we take", which is the only question this page exists to settle.
 *
 * Deliberately silent on minimum terms, notice periods and whether managed
 * fees offset a later build. Those are commercial terms nobody has confirmed,
 * and inventing them here is how a website starts writing cheques.
 */
export const ENGAGEMENT_FAQ = [
  {
    q: 'Which of the two should we start with?',
    a:
      'If you publish at volume, run several brands, or want the cost to stop climbing, build ' +
      'your own. If you want output this month, or you want to prove the workflow before ' +
      'committing to a build, start on the managed plan. The honest test is whether the ' +
      'content limit in a monthly package would constrain you. If it would, a build pays for ' +
      'itself; if it would not, the plan is the cheaper answer.',
  },
  {
    q: 'Can we start on the managed plan and build our own later?',
    a:
      'Yes. You get published content while you decide, ' +
      'and you already know what the output looks like on your own brand before you commit to ' +
      'a build. When you are ready, tell us and we build your system. Your channels are in your ' +
      'name throughout, so nothing has to be untangled.',
  },
  {
    q: 'We run several client brands. Which one works out better?',
    a:
      'A build, in almost every case. One system covers every brand you handle, because it is ' +
      'built around your workflow, and each client gets its own profile inside it. On the ' +
      'monthly plan it is one package per brand, so the cost scales with the number of clients ' +
      'rather than staying flat. That is the single biggest difference for an agency.',
  },
  {
    q: 'What does the monthly plan include, and what does it not?',
    a:
      'It includes the production, the publishing, the monitoring and the reporting: we ' +
      'runs the system and carries the responsibility for getting content out on schedule. It ' +
      'does not include owning the system. The files and credentials sit on our side, and the ' +
      'amount you can publish is set by your package rather than being open-ended.',
  },
  {
    q: 'How quickly can we actually be publishing?',
    a:
      'Under a week on the monthly plan, because there is nothing to build: we onboard your ' +
      'brand onto the system already running and connect your channels. A build takes seven to ' +
      'twenty one days depending on scope, and you watch a full run and approve it before ' +
      'anything is deployed.',
  },
  {
    q: 'Do we need someone in-house to run it?',
    a:
      'For a build, yes: one person to monitor it, and someone who can sign off a script or a ' +
      'render. For the monthly plan, no. That is the point of it — we operate it and ' +
      'you approve the plan. Neither model needs you to hire a production team.',
  },
  {
    q: 'What happens to our channels if we stop?',
    a:
      'They stay yours. Your social accounts are connected in your own name under both models, ' +
      'not held in a shared pool, so stopping does not cost you the audience you built. With a ' +
      'build, the system and everything on it is already on your machines.',
  },
];

/* ---------------------------------------------------------------------------
   EVIDENCE — the dataset the insights section is built on.

   One account, four months, recorded at the time. Every figure published under
   /insights traces back to these records; nothing here is a projection or a
   modelled scenario. Kept in one place so the index cannot drift away from the
   entries, and so adding a second account is a change here rather than a
   rewrite of every page that cites one.
   --------------------------------------------------------------------------- */
export const EVIDENCE = {
  /** Accounts with a full before-and-after on the record. Honest, and small. */
  accounts: 1,
  from: '2026-05',
  to: '2026-08',
  months: 4,
  /** Pieces produced across the period, of which `usable` cleared review. */
  produced: 2008,
  usable: 1618,
};

/* ---------------------------------------------------------------------------
   CONTACT_FAQ — questions about the call itself.

   The other six FAQ sets answer questions about the system, the build, the
   data and the commercials. None of them answer the ones a person has with
   their cursor in the form: what the next half hour actually involves, who is
   on it, and what happens if the answer is no. Every claim here is one the
   page already makes above it — nothing new is promised.
   --------------------------------------------------------------------------- */
export const CONTACT_FAQ = [
  {
    q: 'What actually happens on the 30-minute call?',
    a:
      'Three things. We map how content moves through your team today, we run the system on ' +
      'real material so you can watch it work rather than watch slides about it, and we tell ' +
      'you whether a build pays for itself at your volume. No deck, and no retainer pitch.',
  },
  {
    q: 'Is the demo really free?',
    a:
      'Yes, and it is a live run rather than a recording: a document goes in and you watch the ' +
      'script, voiceover, video, thumbnails and the scheduled queue come out. You see how it ' +
      'is working at each stage, not just the output. Nothing is invoiced for it and nothing ' +
      'has to be ' +
      'signed to get it.',
  },
  {
    q: 'What should we have ready for the call?',
    a:
      'Three numbers and one link: roughly how many pieces you publish a month, how many people ' +
      'touch them, and how often work goes back for rework — plus somewhere we can see what you ' +
      'are publishing now. If you do not have the rework figure, an estimate is fine; most teams ' +
      'do not measure it.',
  },
  {
    q: 'Who will we be speaking to?',
    a:
      'The people who would build the system. Not an account manager who hands you over ' +
      'afterwards, and not a qualification call before the real call.',
  },
  {
    q: 'What if you decide we are not a fit?',
    a:
      'We say so on the call, and we say why. Below roughly ten pieces a month the arithmetic ' +
      'does not work, and if your rejections come from unclear briefs rather than from the ' +
      'process, no pipeline will fix that. Where the managed route is the cheaper answer we will ' +
      'point you at it instead of quoting you for a build.',
  },
  {
    q: 'Do we have to decide anything on the call?',
    a:
      'No. Nothing is quoted on the spot and there is no follow-up sequence. If it is worth ' +
      'taking further we agree the next step there and then; if it is not, that is the end of it.',
  },
];

/* ---------------------------------------------------------------------------
   The studio behind the product.

   Every fact below is taken from GroovyMark's own published about page and
   its source, not invented here. It matters because /about currently reads as
   if the company began with this product; it did not. The studio has been
   shipping since 2021, and the content system is its newest line.

   Scope is stated explicitly wherever a number appears. STUDIO counts cover all
   web, platform and AI work since 2021. The content system's own figures — four
   systems live, one account measured — live in RUNNING and EVIDENCE and are
   deliberately much smaller. A reader who visits /about and then /trust should
   find those two facts sitting comfortably together, not contradicting.
   --------------------------------------------------------------------------- */
export const STUDIO = {
  founded: 2021,
  hq: 'Colombo, Sri Lanka',
  branch: 'Perth, Australia',
  /* Company headcount, not the headcount on any one client account. The OAP
     review counts 9 people because that is who worked that account; the company
     around them was larger. Both numbers are on the site and the copy says
     which is which, because a reader who spots the gap unaided stops trusting
     the rest. */
  peakStaff: 12,
  staff: 2,
  /* Glassdoor. Read off the live page on 2026-09-08: 5.0 overall across 3
     reviews, 100% would recommend, 100% CEO approval. Category scores are
     lower than the headline — work/life balance and career opportunities both
     sit at 4.6 — which is why the page quotes the overall and shows the count
     beside it. A rating with no n is the kind of number this site does not
     publish, and three is a number a reader can check in one click.

     A rating moves. If it drops, change the figure here rather than pulling
     the link: an honest 4.7 next to a real review count is worth more than a
     silence a reader can find on their own. */
  glassdoor: {
    url: 'https://www.glassdoor.com/Reviews/GroovyMark-Reviews-E10436404.htm',
    rating: '5.0',
    reviews: 3,
    verified: '2026-09-08',
  },
};

export const TIMELINE = [
  {
    year: '2021',
    t: 'Founded as a web studio',
    d: 'Trust-driven business websites for medium-sized companies.',
  },
  {
    year: '2023',
    t: 'Expanded into platforms',
    d: 'Booking, billing and portals for Australia and the UK. The first work that had to survive handover.',
  },
  {
    year: '2024',
    t: 'AI practice launched',
    d: 'A dedicated engineering team, after the agentic experiments stopped being experiments.',
  },
  {
    year: '2025',
    t: 'Twelve people, one bottleneck',
    d: 'Content was the largest team in the company and the hardest to scale. Every new client meant another hire.',
  },
  {
    year: '2026',
    t: 'We ran it on ourselves',
    d: 'Built the system, moved our own accounts onto it, and stopped hiring.',
  },
];

/** Two people, and that is the whole company. It was STUDIO.peakStaff; the
 *  system took the rest, which is the same thing we sell and the reason the
 *  count is on the page rather than hidden. Portraits are cropped from their
 *  own cards.
 *
 *  linkedin is optional: about.astro renders the icon only for entries that
 *  have one, so a third person without a profile is a missing icon rather
 *  than a dead link. */
export const TEAM = [
  {
    name: 'Kavindu',
    role: 'Founder & CEO',
    img: '/team/kavindu.webp',
    linkedin: 'https://www.linkedin.com/in/kavindu-gamlath/',
    does: 'Scopes your build, runs the pipeline, and is on the call',
    bio:
      'Meta Certified Social Media Manager, entrepreneur and researcher. Has worked with clients ' +
      'across the UK, USA, Australia, Dubai, New Zealand and Canada, helping companies scale ' +
      'through sustainable organic growth rather than bought reach.',
  },
  {
    name: 'Rangaa',
    role: 'CTO & Senior Software Engineer',
    img: '/team/rangaa.webp',
    linkedin: 'https://www.linkedin.com/in/ranga-cooray-393652206/',
    does: 'Architects and builds the system that gets handed to you',
    bio:
      'Experienced software engineer with over six years in industry. Leads the technical ' +
      'vision and architecture behind everything shipped — full-stack platforms, cloud-native ' +
      'systems and infrastructure built to scale. Bridges the technology and what the ' +
      'business actually needs it to do.',
  },
];
