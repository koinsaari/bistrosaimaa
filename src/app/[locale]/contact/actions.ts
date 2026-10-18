'use server';

import { HONEYPOT_FIELD, buildContactEmail, parseContact, type ContactFieldErrors } from '@/lib/contact';
import { sendContactMail } from '@/lib/mailer';

export type ContactResult =
  | { ok: true }
  | { ok: false; error: 'invalid'; fieldErrors: ContactFieldErrors }
  | { ok: false; error: 'sendFailed' };

export async function sendContactMessage(input: unknown): Promise<ContactResult> {
  if (typeof input === 'object' && input !== null && (input as Record<string, unknown>)[HONEYPOT_FIELD]) {
    console.warn('contact message dropped: honeypot field filled');
    return { ok: true };
  }

  const parsed = parseContact(input);
  if (!parsed.ok) return { ok: false, error: 'invalid', fieldErrors: parsed.fieldErrors };

  try {
    await sendContactMail({ replyTo: parsed.data.email, ...buildContactEmail(parsed.data, new Date()) });
  } catch (err) {
    console.error('sending contact message failed:', err instanceof Error ? err.message : 'unknown error');
    return { ok: false, error: 'sendFailed' };
  }
  return { ok: true };
}
