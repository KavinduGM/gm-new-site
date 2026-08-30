/**
 * Resend delivery webhook.
 *
 * This exists because of a failure that had no symptom. Resend answered the
 * send with 200 and a message id, the endpoint took that as success, the
 * visitor got a reference and a confirmation — and the notification was never
 * delivered, because the recipient had been added to Resend's suppression list
 * after earlier hard bounces. Suppression is not a send failure at the API
 * layer, so there was nothing for POST /api/contact to detect. Enquiries were
 * lost silently for as long as the address stayed suppressed.
 *
 * A 200 from Resend means accepted, never delivered. The outcome arrives here,
 * seconds to minutes later, and the only job of this route is to make a lost
 * lead loud.
 *
 * Subscribe at https://resend.com/webhooks to:
 *   email.bounced, email.failed, email.complained, email.delivery_delayed
 * (email.delivered is handled too, and is useful while verifying.)
 */
import { createHmac, timingSafeEqual } from 'node:crypto';
import { SITE } from '../../site.config.mjs';
import { sendEmail, describeFailure } from '../../lib/email/resend.mjs';
import { SUBMISSION_ID_RE } from '../../lib/leads.mjs';

export const prerender = false;

/** Payloads are small. Anything larger is not Resend. */
const MAX_BODY = 128 * 1024;

/** Svix's own tolerance, and the reason a replayed payload cannot be resent. */
const TOLERANCE_S = 5 * 60;

/* Subject prefixes, so the route can tell a lost lead from ordinary mail.
   ALERT is also the loop guard: an alert that itself bounces must not
   generate another alert. */
const LEAD_SUBJECT = 'New enquiry — ';
const ALERT_SUBJECT = 'Lead notification failed — ';

const FAILURES = new Set(['email.bounced', 'email.failed', 'email.complained']);

const ok = (body = 'ok') =>
  new Response(body, { status: 200, headers: { 'Cache-Control': 'no-store' } });

/**
 * Svix signature check. Resend signs webhooks with Svix, whose scheme is an
 * HMAC-SHA256 over `id.timestamp.body` keyed by the base64 body of the
 * whsec_ secret.
 *
 * Written out rather than pulling in the `svix` package: it is twenty lines,
 * and a dependency in the request path of a route that exists to be reliable
 * is a poor trade.
 */
function verify(raw, headers, secret) {
  const id = headers.get('svix-id');
  const ts = headers.get('svix-timestamp');
  const sig = headers.get('svix-signature');
  if (!id || !ts || !sig) return 'missing signature headers';

  /* Without this an attacker who captured one valid payload could replay it
     forever — the signature stays valid because the body never changes. */
  const age = Math.abs(Math.floor(Date.now() / 1000) - Number(ts));
  if (!Number.isFinite(age) || age > TOLERANCE_S) return 'timestamp outside tolerance';

  const key = Buffer.from(secret.replace(/^whsec_/, ''), 'base64');
  const expected = createHmac('sha256', key).update(`${id}.${ts}.${raw}`).digest();

  /* The header carries a space-separated list so a secret can be rotated with
     both keys live. Compare against every v1 entry, in constant time. */
  const passed = sig.split(' ').some((part) => {
    const [version, value] = part.split(',');
    if (version !== 'v1' || !value) return false;
    const given = Buffer.from(value, 'base64');
    return given.length === expected.length && timingSafeEqual(given, expected);
  });

  return passed ? null : 'signature mismatch';
}

/** Reads the body as text, aborting past `max` bytes. */
async function readCapped(request, max) {
  const reader = request.body?.getReader();
  if (!reader) return '';
  const chunks = [];
  let total = 0;
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    total += value.byteLength;
    if (total > max) {
      await reader.cancel();
      return null;
    }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map(Buffer.from)).toString('utf8');
}

/** Resend puts the reason in different places depending on the event. */
const reasonOf = (d) =>
  d?.bounce?.message ?? d?.failed?.reason ?? d?.reason ?? d?.bounce?.subType ?? 'no reason given';

export async function POST({ request }) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;

  /* Refuse rather than trust. An unsigned webhook route is an open endpoint
     that writes attacker-chosen text into the logs an operator reads during an
     incident, and can make this server send mail on demand. */
  if (!secret) {
    console.error('resend-webhook: RESEND_WEBHOOK_SECRET is not set — refusing unverified payloads.');
    return new Response('not configured', { status: 503 });
  }

  const raw = await readCapped(request, MAX_BODY);
  if (raw === null) return new Response('payload too large', { status: 413 });

  const bad = verify(raw, request.headers, secret);
  if (bad) {
    console.error(`resend-webhook: rejected — ${bad}`);
    return new Response('invalid signature', { status: 401 });
  }

  let event;
  try {
    event = JSON.parse(raw);
  } catch {
    return new Response('bad payload', { status: 400 });
  }

  const type = event?.type ?? 'unknown';
  const data = event?.data ?? {};
  const subject = String(data.subject ?? '');
  const to = [].concat(data.to ?? []).join(', ');

  /* Everything below is best effort and must still answer 200. Svix retries a
     non-2xx for hours; a bug in the reporting path would turn one lost lead
     into a retry storm. */
  try {
    const ref = subject.match(/GM-\d{6}-[23456789ABCDEFGHJKMNPQRSTVWXYZ]{6}/)?.[0] ?? null;
    const isLead = subject.startsWith(LEAD_SUBJECT);
    const isAlert = subject.startsWith(ALERT_SUBJECT);

    if (type === 'email.delivered') {
      if (isLead) console.log(`resend-webhook: ${ref ?? '?'} delivered to ${to}`);
      return ok();
    }

    if (!FAILURES.has(type) && type !== 'email.delivery_delayed') {
      return ok();
    }

    const reason = reasonOf(data);
    const line = `resend-webhook: ${type} — to=${to} subject="${subject}" reason=${reason}`;

    if (type === 'email.delivery_delayed') {
      console.warn(`${line} (delayed, may still arrive)`);
      return ok();
    }

    /* A lead notification that did not land is the case this route was built
       for: nobody has seen the enquiry, and the sender has already been told
       we have it. */
    if (isLead) {
      console.error(`LEAD NOT DELIVERED — ${ref ?? 'unknown reference'}: ${line}`);
    } else {
      console.error(line);
    }

    /* Alert out of band. ALERT_TO should be at a different provider from
       LEADS_TO — the whole point is to work when the primary inbox is the
       thing that is broken. Never alert about an alert. */
    const alertTo = process.env.ALERT_TO;
    if (isLead && alertTo && !isAlert) {
      const apiKey = process.env.RESEND_API_KEY;
      const from = process.env.RESEND_FROM;
      if (apiKey && from) {
        const body =
          `A lead notification was not delivered. Nobody has seen this enquiry, ` +
          `and the sender has already been told we have it.\n\n` +
          `Reference:  ${ref ?? 'unknown'}\n` +
          `Event:      ${type}\n` +
          `Recipient:  ${to}\n` +
          `Reason:     ${reason}\n` +
          `Message id: ${data.email_id ?? 'unknown'}\n\n` +
          `The full enquiry is still readable in the Resend log:\n` +
          `https://resend.com/emails\n\n` +
          `If the reason is suppression, fix the mailbox first, confirm it ` +
          `receives, and only then remove the address from the suppression list.`;

        const sent = await sendEmail({
          apiKey,
          from,
          to: alertTo,
          subject: `${ALERT_SUBJECT}${ref ?? to}`,
          text: body,
          html: `<pre style="font:13px/1.6 ui-monospace,Menlo,monospace;white-space:pre-wrap">${body
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')}</pre>`,
          idempotencyKey: `alert/${data.email_id ?? ref ?? subject}`,
          retry: false,
        });
        if (!sent.ok) {
          console.error(`resend-webhook: alert to ${alertTo} failed — ${describeFailure(sent)}`);
        }
      }
    }
  } catch (err) {
    console.error(`resend-webhook: handler error — ${String(err?.message ?? err)}`);
  }

  return ok();
}

/* Svix sends only POST. Anything else is a probe. */
export const ALL = () =>
  new Response('Method not allowed', { status: 405, headers: { Allow: 'POST' } });
