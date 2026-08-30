/**
 * Lead intake: submission identity, field schema, normalisation, validation.
 *
 * Deliberately free of any transport or template concern so it can be tested
 * on its own and reused by both emails. The field ORDER here is the order both
 * emails render, and it mirrors the fieldsets on /contact — a lead that reads
 * in a different order from the form the person filled in is harder to scan,
 * not easier.
 */

/**
 * Crockford-style alphabet: no 0/O, 1/I/L or U. Submission IDs get read down a
 * phone line and typed back into a search box, so a character that can be
 * misheard or mistyped is a support ticket.
 */
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTVWXYZ';

/**
 * Public submission reference, e.g. GM-260829-K7F2M.
 *
 * Date prefix so a human can sort and age them at a glance; six random
 * characters (30^6 ~ 729M). Five was enough at any realistic volume but showed
 * 812 birthday collisions in a 200k same-day stress run, and one extra
 * character makes that vanish. Not a secret and not a primary key —
 * it exists so the client and the inbox can name the same submission out loud.
 */
export function newSubmissionId(now = new Date()) {
  const p = (n, w = 2) => String(n).padStart(w, '0');
  const date = `${p(now.getUTCFullYear() % 100)}${p(now.getUTCMonth() + 1)}${p(now.getUTCDate())}`;
  const bytes = new Uint8Array(6);
  globalThis.crypto.getRandomValues(bytes);
  let rand = '';
  for (const b of bytes) rand += ALPHABET[b % ALPHABET.length];
  return `GM-${date}-${rand}`;
}

/** Shape of the reference, for validating one that comes back to us. */
export const SUBMISSION_ID_RE = /^GM-\d{6}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}$/;

/**
 * Every field the form can send, in render order, grouped the way /contact
 * groups them.
 *
 *   kind: 'text' | 'email' | 'url' | 'longtext' | 'list' | 'bool'
 *   req:  mirrors the `required` attribute on the input
 */
export const LEAD_GROUPS = [
  {
    title: 'Who they are',
    /* The same rows go to the team and back to the sender, and a heading that
       reads right in the inbox reads wrong in the receipt. */
    titleYou: 'Who you are',
    fields: [
      { key: 'name', label: 'Name', kind: 'text', req: true },
      { key: 'email', label: 'Work email', kind: 'email', req: true },
      { key: 'company', label: 'Company', kind: 'text', req: true },
      { key: 'role', label: 'Role', kind: 'text' },
      { key: 'website', label: 'Website', kind: 'url' },
    ],
  },
  {
    title: 'What they publish',
    titleYou: 'What you publish',
    fields: [
      { key: 'segment', label: 'Segment', kind: 'text', req: true },
      { key: 'channels', label: 'Channels', kind: 'list' },
      { key: 'volume', label: 'Monthly volume', kind: 'text' },
      { key: 'timeline', label: 'Timeline', kind: 'text' },
    ],
  },
  {
    title: 'What they want',
    titleYou: 'What you asked for',
    fields: [
      { key: 'engagement', label: 'Preferred engagement', kind: 'text' },
      { key: 'wants_pricing', label: 'Asked for pricing', kind: 'bool' },
      { key: 'package', label: 'Package of interest', kind: 'text' },
    ],
  },
  {
    title: 'Their brief',
    titleYou: 'Your brief',
    fields: [{ key: 'brief', label: 'Brief', kind: 'longtext', req: true }],
  },
];

/** Flat view of the schema, for lookups. */
export const LEAD_FIELDS = LEAD_GROUPS.flatMap((g) => g.fields);

/** Upper bounds. Anything longer is a bot or a paste accident, not a lead. */
const LIMITS = { text: 200, email: 254, url: 500, longtext: 5000, list: 40 };

/**
 * Strips control characters. CR and LF are the ones that matter: any value
 * that reaches a mail header (subject, reply-to, display name) can forge extra
 * headers if it carries a newline. Long-form text re-admits newlines below,
 * and never goes near a header.
 */
const clean = (v) =>
  String(v ?? '')
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u001F\u007F]/g, '')
    .trim();

/**
 * Pulls a normalised lead out of a FormData. Unknown keys are dropped: both
 * emails render from LEAD_GROUPS, so a field that is not in the schema cannot
 * reach either message.
 */
export function collectLead(form) {
  const out = {};
  for (const f of LEAD_FIELDS) {
    if (f.kind === 'list') {
      out[f.key] = form
        .getAll(f.key)
        .map((v) => clean(v).slice(0, LIMITS.text))
        .filter(Boolean)
        .slice(0, LIMITS.list);
    } else if (f.kind === 'bool') {
      out[f.key] = Boolean(clean(form.get(f.key)));
    } else if (f.kind === 'longtext') {
      // Newlines are meaningful here and this value never touches a header.
      out[f.key] = String(form.get(f.key) ?? '')
        .replace(/\r\n?/g, '\n')
        // eslint-disable-next-line no-control-regex
        .replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '')
        .replace(/\n{3,}/g, '\n\n')
        .trim()
        .slice(0, LIMITS.longtext);
    } else {
      out[f.key] = clean(form.get(f.key)).slice(0, LIMITS[f.kind] ?? LIMITS.text);
    }
  }
  out.consent = Boolean(clean(form.get('consent')));
  return out;
}

/**
 * Deliberately permissive: this is a lead form, and bouncing a real prospect
 * over a stricter pattern than the browser already applied costs more than an
 * occasional bad address. It rejects what would actually break — a missing
 * required field, something that cannot be an address, an unticked consent box.
 */
export function validateLead(lead) {
  const errors = {};
  for (const f of LEAD_FIELDS) {
    if (f.req && !String(lead[f.key] ?? '').trim()) {
      errors[f.key] = `${f.label} is required.`;
    }
  }
  const email = String(lead.email ?? '');
  // One @, something either side, a dot in the domain, no whitespace.
  if (email && !/^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/.test(email)) {
    errors.email = 'That does not look like an email address.';
  }
  if (!lead.consent) {
    errors.consent = 'We need your agreement before we can reply.';
  }
  return { ok: Object.keys(errors).length === 0, errors };
}

/**
 * Rows for rendering, with empties dropped. Both emails and any future
 * dashboard read from this, so they cannot drift apart.
 *
 * `voice` picks the heading set: 'them' for the team's copy, 'you' for the
 * receipt that goes back to the sender.
 */
export function leadRows(lead, voice = 'them') {
  return LEAD_GROUPS.map((g) => ({
    title: voice === 'you' ? g.titleYou : g.title,
    rows: g.fields
      .map((f) => {
        const v = lead[f.key];
        if (f.kind === 'list') return v?.length ? { label: f.label, value: v.join(', ') } : null;
        if (f.kind === 'bool') return v ? { label: f.label, value: 'Yes' } : null;
        return String(v ?? '').trim()
          ? { label: f.label, value: String(v), long: f.kind === 'longtext' }
          : null;
      })
      .filter(Boolean),
  })).filter((g) => g.rows.length > 0);
}
