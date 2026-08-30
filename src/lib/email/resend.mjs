/**
 * Minimal Resend transport over fetch.
 *
 * Deliberately not the `resend` npm package. The wire format and the SDK
 * disagree on field names in a way that fails silently — the REST API takes
 * `reply_to` and ignores `replyTo`; the SDK takes `replyTo` and drops
 * `reply_to` with no error. One HTTP call is not worth carrying a dependency
 * that inverts the spelling of the field most likely to be wrong.
 *
 * Contract verified against the live API:
 *   POST https://api.resend.com/emails
 *   success -> 200 { "id": "<uuid>" }          (bare, not wrapped in data)
 *   failure -> { "statusCode": n, "name": "<code>", "message": "..." }
 *
 * Branch on `name`, never on `message` — the live message strings do not match
 * the documented ones.
 */

/**
 * Overridable so the send path can be exercised against a local capture during
 * verification. Unset in production, where it must stay the real API.
 */
const ENDPOINT = process.env.RESEND_ENDPOINT || 'https://api.resend.com/emails';

/** Resend rejects requests with no User-Agent (403, code 1010). Node's fetch
 *  does not always set one, and the failure looks like an auth problem. */
const UA = 'groovymark-site/1.0';

/**
 * Budget per attempt. Two emails go out per submission, so this bounds how long
 * someone can be left staring at a spinner: worst case is the lead email
 * (8s + 0.6s backoff + 8s) plus the auto-reply (8s, no retry) — about 25s
 * rather than the 40s a 10s budget with retries on both would allow. Typical
 * Resend latency is well under a second.
 */
const TIMEOUT_MS = 8_000;

/**
 * Retryable only where retrying can help. Note the two 429s that must NOT be
 * retried: a daily or monthly quota error returns the same status as a rate
 * limit, and retrying it just burns the request budget against a wall.
 */
const RETRYABLE = new Set(['rate_limit_exceeded', 'application_error', 'service_unavailable']);

/**
 * @returns {Promise<{ok: true, id: string} | {ok: false, code: string, status: number|null, message: string}>}
 */
export async function sendEmail({
  apiKey,
  from,
  to,
  replyTo,
  subject,
  html,
  text,
  idempotencyKey,
  /* The auto-reply passes false: it is best effort, and a second attempt
     only lengthens the wait for a message the sender is not blocked on. */
  retry = true,
  attempt = 0,
}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const headers = {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'User-Agent': UA,
    };
    // Guards against a duplicate send when a retry crosses with a slow success.
    // Resend holds the key for 24h and replays the original response.
    if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey.slice(0, 256);

    const res = await fetch(ENDPOINT, {
      method: 'POST',
      headers,
      signal: controller.signal,
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        text,
        // snake_case. `replyTo` here is silently ignored by the REST API.
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    });

    const payload = await res.json().catch(() => null);

    if (res.ok && payload?.id) return { ok: true, id: payload.id };

    const code = payload?.name ?? 'unknown_error';
    const message = payload?.message ?? `HTTP ${res.status}`;

    if (retry && attempt === 0 && (res.status >= 500 || RETRYABLE.has(code))) {
      clearTimeout(timer);
      await new Promise((r) => setTimeout(r, 600));
      return sendEmail({
        apiKey, from, to, replyTo, subject, html, text, idempotencyKey, retry, attempt: 1,
      });
    }

    return { ok: false, code, status: res.status, message };
  } catch (err) {
    const aborted = err?.name === 'AbortError';
    if (retry && attempt === 0 && !aborted) {
      await new Promise((r) => setTimeout(r, 600));
      return sendEmail({
        apiKey, from, to, replyTo, subject, html, text, idempotencyKey, retry, attempt: 1,
      });
    }
    return {
      ok: false,
      code: aborted ? 'timeout' : 'network_error',
      status: null,
      message: aborted ? `No response in ${TIMEOUT_MS}ms` : String(err?.message ?? err),
    };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Turns a failure into something safe to log. The API key must never appear in
 * a log line, and neither should the enquiry body.
 */
export const describeFailure = (r) =>
  `resend ${r.code}${r.status ? ` (${r.status})` : ''}: ${r.message}`;
