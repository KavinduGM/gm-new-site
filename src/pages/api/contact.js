/**
 * Contact form endpoint.
 *
 * Runs on demand; every other page on the site stays prerendered. Two emails
 * go out per submission and their order is deliberate:
 *
 *   1. The lead notification to the team. If this fails the submission is
 *      effectively lost, so its failure fails the request and the visitor is
 *      told to use WhatsApp instead of being thanked for nothing.
 *   2. The auto-reply to the sender. Best effort — a bounced confirmation is
 *      not a reason to tell someone their enquiry did not arrive.
 *
 * Both carry the same submission reference so the inbox and the client can
 * name the same enquiry.
 */
import { SITE } from '../../site.config.mjs';
import { collectLead, validateLead, leadRows, newSubmissionId } from '../../lib/leads.mjs';
import { sendEmail, describeFailure } from '../../lib/email/resend.mjs';
import { autoReply, leadNotification } from '../../lib/email/templates.mjs';

export const prerender = false;

/** Refuse a body large enough to be an attack rather than an enquiry. */
const MAX_BODY = 64 * 1024;

/**
 * In-memory sliding window, per IP. Resets on deploy and is per-container,
 * which is the right trade here: the alternative is a datastore this site does
 * not otherwise need, and the goal is only to blunt a script, not to be a WAF.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

const TOO_LARGE = Symbol('too-large');

/** Reads the body, aborting the moment it exceeds `max` bytes. */
async function readCapped(request, max) {
  const reader = request.body?.getReader();
  if (!reader) return new Blob([]);
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      return TOO_LARGE;
    }
    chunks.push(value);
  }
  return new Blob(chunks);
}

function rateLimited(ip) {
  const now = Date.now();
  const seen = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  seen.push(now);
  hits.set(ip, seen);
  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (!v.some((t) => now - t < WINDOW_MS)) hits.delete(k);
  }
  return seen.length > MAX_PER_WINDOW;
}

/*
 * server.mjs sets x-groovymark-client-ip from Express's req.ip, which respects
 * `trust proxy` and is therefore the address Traefik observed rather than one
 * the caller chose. Reading x-forwarded-for directly took the FIRST entry —
 * entirely client-controlled — so anyone could get a fresh rate-limit bucket
 * per request just by varying the header. Verified: eight submissions with
 * eight spoofed values never tripped the limiter.
 *
 * The fallback is the LAST x-forwarded-for entry, which behind exactly one
 * trusted proxy is the one that proxy appended.
 */
const clientIp = (request) => {
  const trusted = request.headers.get('x-groovymark-client-ip');
  if (trusted) return trusted;
  const xff = (request.headers.get('x-forwarded-for') ?? '').split(',').map((v) => v.trim()).filter(Boolean);
  return xff.at(-1) || request.headers.get('x-real-ip') || 'unknown';
};

const wantsJson = (request) =>
  (request.headers.get('accept') ?? '').includes('application/json');

/* Same digits-only guard the contact page uses. A malformed number produces a
   wa.me link that opens a dead screen, and in an email there is no way to fix
   it after the fact — so the auto-reply drops the WhatsApp block entirely
   rather than shipping a broken button. */
const whatsappUrl = () =>
  /^\d{8,15}$/.test(String(SITE.whatsapp ?? ''))
    ? `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(SITE.whatsappMessage ?? '')}`
    : '';

const json = (body, status) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
  });

/** Every failure used to answer 502. Only `send_failed` actually is one. */
const STATUS = {
  invalid: 400,
  bad_request: 400,
  too_large: 413,
  rate_limited: 429,
  not_configured: 503,
  send_failed: 502,
};

const seeOther = (location) =>
  new Response(null, { status: 303, headers: { Location: location, 'Cache-Control': 'no-store' } });

/** Same outcome, shaped for whichever client asked. */
function respond(request, { ok, id, errors, reason }) {
  if (wantsJson(request)) {
    if (ok) return json({ ok: true, id }, 200);
    const res = json({ ok: false, errors, reason }, STATUS[reason] ?? 400);
    // Without this a rate-limited caller sees 502, which clients, CDNs and bots
    // treat as a transient gateway fault and retry — so the response to abuse
    // invited more of it.
    if (reason === 'rate_limited') res.headers.set('Retry-After', String(WINDOW_MS / 1000));
    return res;
  }
  const q = ok ? `?ref=${encodeURIComponent(id)}` : `?error=${encodeURIComponent(reason ?? 'invalid')}`;
  return seeOther(`/contact/sent/${q}`);
}

export async function POST({ request }) {
  const ip = clientIp(request);

  if (rateLimited(ip)) {
    return respond(request, { ok: false, reason: 'rate_limited' });
  }

  /*
   * Count the bytes as they arrive rather than trusting Content-Length. A
   * chunked request omits that header entirely, so the old check silently
   * passed and a 200KB body reached the send path — an unauthenticated way to
   * make the process buffer whatever the caller felt like sending.
   */
  let form;
  try {
    const body = await readCapped(request, MAX_BODY);
    if (body === TOO_LARGE) return respond(request, { ok: false, reason: 'too_large' });
    form = await new Response(body, { headers: request.headers }).formData();
  } catch {
    return respond(request, { ok: false, reason: 'bad_request' });
  }

  /* Honeypot. The field is off-screen with tabindex="-1", so a human cannot
     fill it. Answer 200 rather than an error: telling a bot it was detected
     invites it to adapt. */
  if (String(form.get('company_website') ?? '').trim()) {
    return respond(request, { ok: true, id: newSubmissionId() });
  }

  const lead = collectLead(form);
  const { ok: valid, errors } = validateLead(lead);
  if (!valid) return respond(request, { ok: false, errors, reason: 'invalid' });

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM;
  const to = process.env.LEADS_TO || SITE.leadsEmail;

  if (!apiKey || !from) {
    // Loud, and without ever printing the key itself.
    console.error(
      'contact: RESEND_API_KEY and/or RESEND_FROM are not set — enquiry NOT delivered.',
    );
    return respond(request, { ok: false, reason: 'not_configured' });
  }

  const id = newSubmissionId();
  const rowsForTeam = leadRows(lead, 'them');
  const rowsForSender = leadRows(lead, 'you');
  const receivedAt = new Date().toISOString().replace('T', ' ').slice(0, 16) + ' UTC';

  /* 1. The one that must land. Reply-to is the bare validated address with no
        display name: a display name is a header, and user input in a header is
        how header injection starts. */
  const notify = leadNotification({ lead, id, rows: rowsForTeam, receivedAt });
  const sent = await sendEmail({
    apiKey,
    from,
    to,
    replyTo: lead.email,
    subject: notify.subject,
    html: notify.html,
    text: notify.text,
    idempotencyKey: `lead/${id}`,
  });

  if (!sent.ok) {
    console.error(`contact: lead notification failed for ${id} — ${describeFailure(sent)}`);
    return respond(request, { ok: false, reason: 'send_failed' });
  }

  /* 2. Best effort. A failure here is logged and swallowed: the enquiry is
        already safely in the inbox, and telling the sender it failed would be
        both wrong and alarming. */
  const reply = autoReply({ lead, id, rows: rowsForSender, whatsappUrl: whatsappUrl() });
  const acked = await sendEmail({
    apiKey,
    from,
    to: lead.email,
    replyTo: to,
    subject: reply.subject,
    html: reply.html,
    text: reply.text,
    idempotencyKey: `ack/${id}`,
    retry: false,
  });
  if (!acked.ok) {
    console.error(`contact: auto-reply failed for ${id} — ${describeFailure(acked)}`);
  }

  /* Reference only. The privacy notice enumerates what our logs hold and a
     company or person name is not on that list. */
  console.log(`contact: ${id} — delivered`);
  return respond(request, { ok: true, id });
}

/** Anything but POST. Keeps a stray GET out of the logs as a 500. */
export const ALL = () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
