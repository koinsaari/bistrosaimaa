import { Resend } from 'resend';

const FROM = 'Bistro Saimaa -verkkosivut <noreply@bistrosaimaa.fi>';

export type ContactMail = { replyTo: string; subject: string; text: string };

let resend: Resend | undefined;

/**
 * Sends a contact message to the restaurant inbox. `CONTACT_MAIL_TRANSPORT=log` (dev, E2E) sends nothing. Otherwise a
 * missing key or recipient throws instead of silently dropping the message. Logs never include message content.
 */
export async function sendContactMail(mail: ContactMail): Promise<void> {
  if (process.env.CONTACT_MAIL_TRANSPORT === 'log') {
    console.info(`contact mail not sent (log transport), ${mail.text.length} chars`);
    return;
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.CONTACT_TO_EMAIL;
  if (!apiKey || !to) throw new Error('RESEND_API_KEY or CONTACT_TO_EMAIL is not set');

  resend ??= new Resend(apiKey);
  const { error } = await resend.emails.send({ from: FROM, to, replyTo: mail.replyTo, subject: mail.subject, text: mail.text });
  if (error) throw new Error(`resend failed: ${error.name} (${error.statusCode ?? 'no status'})`);
}
