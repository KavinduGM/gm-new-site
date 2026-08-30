/**
 * The two transactional emails, HTML and plain text.
 *
 * Email is not the web. Everything here is deliberate:
 *
 *  - Table layout with inline styles. Classic Outlook for Windows still has no
 *    flexbox or grid, and <style> blocks are stripped by several clients.
 *  - The dark theme is baked into the base inline styles, NOT delivered through
 *    prefers-color-scheme. Gmail strips that media query, Yahoo rewrites it to
 *    a dead one, and Outlook Windows never supported it — so a "dark mode"
 *    email built on it arrives light everywhere that matters.
 *  - No #000000 and no #ffffff anywhere. Pure black and pure white are exactly
 *    what triggers Apple Mail's auto-inversion; the site's own #0d0b12 and a
 *    slightly warm #f0eef4 sit safely inside it.
 *  - Borders carry chroma (#2a2438, not a neutral grey). Neutral mid-greys are
 *    the first thing Outlook's contrast repair rewrites.
 *  - No images at all, including the logo. A transparent-background wordmark
 *    disappears if Gmail's iOS app inverts the message to a light background,
 *    and image blocking would take the branding with it. The mark is set in
 *    type instead, which is on-brand for a console-styled identity anyway.
 *
 * Two clients will still recolour this and cannot be stopped: the Gmail iOS
 * app inverts fully, and classic Outlook for Windows recolours unpredictably.
 * Both remain legible, which is the bar for a receipt. The blend-mode hacks
 * that force the issue are brittle and are not worth it here.
 */

const C = {
  bg: '#0d0b12',
  panel: '#131019',
  panel2: '#1a1622',
  line: '#2a2438',
  ink: '#f0eef4',
  ink2: '#a8a3b3',
  ink3: '#807b8e',
  accent: '#a06bff',
  accentInk: '#0d0b12',
};

const SANS =
  "-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

/** HTML-escape. Every value below is attacker-influenced until proven otherwise. */
export const esc = (v) =>
  String(v ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

/** Newlines to <br>, after escaping. For the brief field only. */
const nl2br = (v) => esc(v).replace(/\n/g, '<br>');

/**
 * Outer chrome. `preheader` is the grey snippet an inbox shows next to the
 * subject; without one, clients pull the first visible text, which here would
 * be the wordmark.
 */
function layout({ title, preheader, body }) {
  return `<!doctype html>
<html lang="en" style="margin:0;padding:0;">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="x-apple-disable-message-reformatting">
<meta name="color-scheme" content="dark">
<meta name="supported-color-schemes" content="dark">
<title>${esc(title)}</title>
</head>
<body style="margin:0;padding:0;width:100%;background-color:${C.bg};color:${C.ink};font-family:${SANS};-webkit-font-smoothing:antialiased;">
<div style="display:none;font-size:1px;color:${C.bg};line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${esc(preheader)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.bg};">
  <tr>
    <td align="center" style="padding:24px 12px;">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:600px;">
        <tr>
          <td style="padding:0 0 20px 0;font-family:${MONO};font-size:15px;letter-spacing:2px;text-transform:uppercase;color:${C.ink};font-weight:700;">
            groovymark
          </td>
        </tr>
        ${body}
        <tr>
          <td style="padding:24px 4px 0 4px;border-top:1px solid ${C.line};font-family:${MONO};font-size:11px;line-height:18px;color:${C.ink3};">
            GroovyMark · Custom AI content production and publishing systems<br>
            <a href="https://groovymark.com/" style="color:${C.ink3};text-decoration:underline;">groovymark.com</a>
            &nbsp;·&nbsp;
            <a href="https://groovymark.com/legal/privacy/" style="color:${C.ink3};text-decoration:underline;">Privacy notice</a>
          </td>
        </tr>
      </table>
    </td>
  </tr>
</table>
</body>
</html>`;
}

/** A labelled row. `long` renders the value as a block under its label. */
function row({ label, value, long }) {
  if (long) {
    /* No label of its own. Long fields sit alone in their group, so the group
       heading above already says "Their brief" — repeating "Brief" under it
       reads like a mistake. */
    return `<tr>
      <td style="padding:8px 0 0 0;font-size:15px;line-height:24px;color:${C.ink};">${nl2br(value)}</td>
    </tr>`;
  }
  return `<tr>
    <td style="padding:10px 0;border-bottom:1px solid ${C.line};">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td width="38%" style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.ink3};vertical-align:top;padding-right:12px;">${esc(label)}</td>
          <td style="font-size:15px;line-height:22px;color:${C.ink};vertical-align:top;">${esc(value)}</td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/** Groups of labelled rows, rendered inside a panel. */
function groups(gs) {
  return gs
    .map(
      (g) => `<tr><td style="padding:22px 0 6px 0;font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.accent};">${esc(g.title)}</td></tr>
    <tr><td><table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${g.rows.map(row).join('')}</table></td></tr>`,
    )
    .join('');
}

/** The submission reference, set apart because it is the thing people quote. */
function refBlock(id, label) {
  return `<tr>
    <td style="padding:0 0 20px 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.panel2};border:1px solid ${C.line};">
        <tr>
          <td style="padding:16px 18px;">
            <div style="font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.ink3};padding-bottom:6px;">${esc(label)}</div>
            <div style="font-family:${MONO};font-size:20px;letter-spacing:1px;color:${C.accent};font-weight:700;">${esc(id)}</div>
          </td>
        </tr>
      </table>
    </td>
  </tr>`;
}

/**
 * Button. bgcolor on the <td> plus a block-padded <a> is the pattern that
 * survives Outlook; a CSS-only button loses its background there.
 */
function button(href, label) {
  return `<table role="presentation" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td bgcolor="${C.accent}" style="background-color:${C.accent};">
        <a href="${esc(href)}" style="display:block;padding:13px 26px;font-family:${MONO};font-size:13px;letter-spacing:1px;text-transform:uppercase;font-weight:700;color:${C.accentInk};text-decoration:none;">${esc(label)}</a>
      </td>
    </tr>
  </table>`;
}

const panelOpen = `<tr><td style="background-color:${C.panel};border:1px solid ${C.line};padding:26px 24px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">`;
const panelClose = `</table></td></tr>`;

/* ------------------------------------------------------------------ */
/* 1. Auto-reply to the person who submitted                           */
/* ------------------------------------------------------------------ */

export function autoReply({ lead, id, rows, whatsappUrl }) {
  const first = String(lead.name || '').trim().split(/\s+/)[0] || 'there';

  const body = `
  ${panelOpen}
    <tr>
      <td style="padding:0 0 8px 0;font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.accent};">Enquiry received</td>
    </tr>
    <tr>
      <td style="padding:0 0 14px 0;font-size:24px;line-height:32px;font-weight:700;color:${C.ink};">Thanks, ${esc(first)} — we have it.</td>
    </tr>
    <tr>
      <td style="padding:0 0 20px 0;font-size:15px;line-height:24px;color:${C.ink2};">
        Your enquiry is in front of our team. One of our agents will come back to you
        personally — usually within a few hours, and always within one business day.
        Not a form letter: we go through what you sent and reply with content ideas
        and the shape of a system for it.
      </td>
    </tr>
    ${refBlock(id, 'Your reference')}
    <tr>
      <td style="padding:0 0 18px 0;font-size:14px;line-height:22px;color:${C.ink2};">
        Quote that reference in any reply and we will pull up your enquiry straight away.
      </td>
    </tr>
    ${
      whatsappUrl
        ? `<tr>
      <td style="padding:0 0 6px 0;font-size:15px;line-height:24px;color:${C.ink};font-weight:700;">Need an answer faster?</td>
    </tr>
    <tr>
      <td style="padding:0 0 16px 0;font-size:14px;line-height:22px;color:${C.ink2};">
        Message us on WhatsApp Business and quote your reference — it is the quickest
        way to reach a person.
      </td>
    </tr>
    <tr><td style="padding:0 0 4px 0;">${button(whatsappUrl, 'Message us on WhatsApp')}</td></tr>`
        : ''
    }
  ${panelClose}

  <tr>
    <td style="padding:26px 0 0 0;font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.ink3};">What you sent us</td>
  </tr>
  <tr><td style="padding:4px 0 0 0;font-size:13px;line-height:20px;color:${C.ink3};">A copy for your records.</td></tr>
  <tr>
    <td style="padding:10px 0 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.panel};border:1px solid ${C.line};">
        <tr><td style="padding:4px 22px 24px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${groups(rows)}</table>
        </td></tr>
      </table>
    </td>
  </tr>
  <tr>
    <td style="padding:20px 4px 24px 4px;font-size:12px;line-height:19px;color:${C.ink3};">
      This confirmation was sent automatically. Replies to it do reach the team, so
      if anything above is wrong, just reply. For a faster answer, message us on
      WhatsApp Business and quote your reference.
    </td>
  </tr>`;

  return {
    subject: `We have your enquiry — ${id}`,
    html: layout({
      title: 'Enquiry received',
      preheader: `Reference ${id}. An agent will come back to you shortly.`,
      body,
    }),
    text: autoReplyText({ lead, id, rows, whatsappUrl, first }),
  };
}

function autoReplyText({ id, rows, whatsappUrl, first }) {
  const lines = [
    'GROOVYMARK',
    '',
    `Thanks, ${first} — we have it.`,
    '',
    'Your enquiry is in front of our team. One of our agents will come back to',
    'you personally — usually within a few hours, and always within one business',
    'day. Not a form letter: we go through what you sent and reply with content',
    'ideas and the shape of a system for it.',
    '',
    `YOUR REFERENCE: ${id}`,
    '',
    'Quote that reference in any reply and we will pull up your enquiry straight away.',
    '',
    ...(whatsappUrl
      ? [
          'NEED AN ANSWER FASTER?',
          'Message us on WhatsApp Business and quote your reference:',
          whatsappUrl,
          '',
        ]
      : []),
    '--------------------------------------------------',
    'WHAT YOU SENT US',
    '',
  ];
  for (const g of rows) {
    lines.push(g.title.toUpperCase());
    for (const r of g.rows) {
      lines.push(r.long ? r.value : `${r.label}: ${r.value}`);
    }
    lines.push('');
  }
  lines.push(
    '--------------------------------------------------',
    'This confirmation was sent automatically. Replies to it do reach the team,',
    'so if anything above is wrong, just reply. For a faster answer, message us',
    'on WhatsApp Business and quote your reference.',
    '',
    'GroovyMark · https://groovymark.com/',
    'Privacy notice: https://groovymark.com/legal/privacy/',
  );
  return lines.join('\n');
}

/* ------------------------------------------------------------------ */
/* 2. Notification to the leads inbox                                  */
/* ------------------------------------------------------------------ */

export function leadNotification({ lead, id, rows, receivedAt }) {
  const body = `
  ${panelOpen}
    <tr>
      <td style="padding:0 0 8px 0;font-family:${MONO};font-size:11px;letter-spacing:1px;text-transform:uppercase;color:${C.accent};">New enquiry</td>
    </tr>
    <tr>
      <td style="padding:0 0 6px 0;font-size:24px;line-height:32px;font-weight:700;color:${C.ink};">${esc(lead.company || lead.name)}</td>
    </tr>
    <tr>
      <td style="padding:0 0 18px 0;font-size:14px;line-height:22px;color:${C.ink2};">
        ${esc(lead.name)} &lt;<a href="mailto:${esc(lead.email)}" style="color:${C.accent};text-decoration:underline;">${esc(lead.email)}</a>&gt;
        ${lead.role ? ` · ${esc(lead.role)}` : ''}
      </td>
    </tr>
    ${refBlock(id, 'Reference')}
    <tr>
      <td style="padding:0 0 4px 0;font-family:${MONO};font-size:11px;line-height:18px;color:${C.ink3};">
        Received ${esc(receivedAt)}<br>
        Reply directly to this email and it goes to ${esc(lead.name)}.
      </td>
    </tr>
  ${panelClose}

  <tr>
    <td style="padding:16px 0 0 0;">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:${C.panel};border:1px solid ${C.line};">
        <tr><td style="padding:4px 22px 24px 22px;">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">${groups(rows)}</table>
        </td></tr>
      </table>
    </td>
  </tr>`;

  const who = [lead.company, lead.name].filter(Boolean).join(' · ');
  return {
    subject: `New enquiry — ${who} — ${id}`,
    html: layout({
      title: 'New enquiry',
      preheader: `${who}. Reference ${id}.`,
      body,
    }),
    text: leadNotificationText({ lead, id, rows, receivedAt }),
  };
}

function leadNotificationText({ lead, id, rows, receivedAt }) {
  const lines = [
    'NEW ENQUIRY',
    '',
    `Reference : ${id}`,
    `Received  : ${receivedAt}`,
    `From      : ${lead.name} <${lead.email}>`,
    '',
    'Reply directly to this email and it goes to the sender.',
    '',
    '--------------------------------------------------',
    '',
  ];
  for (const g of rows) {
    lines.push(g.title.toUpperCase());
    for (const r of g.rows) {
      lines.push(r.long ? r.value : `${r.label}: ${r.value}`);
    }
    lines.push('');
  }
  return lines.join('\n');
}
