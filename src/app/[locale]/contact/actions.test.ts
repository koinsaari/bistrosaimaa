import { beforeEach, describe, expect, it, vi } from 'vitest';

const sendContactMail = vi.hoisted(() => vi.fn<(mail: unknown) => Promise<void>>());
vi.mock('@/lib/mailer', () => ({ sendContactMail }));

const { sendContactMessage } = await import('@/app/[locale]/contact/actions');
const { HONEYPOT_FIELD } = await import('@/lib/contact');

const valid = {
  name: 'Matti Meikäläinen',
  email: 'matti@example.com',
  phone: '',
  subject: 'eventRoom',
  message: 'Kabinetti perjantaiksi 12 hengelle.',
  privacy: true,
};

describe('sendContactMessage', () => {
  beforeEach(() => {
    sendContactMail.mockReset().mockResolvedValue();
    vi.spyOn(console, 'error').mockImplementation(() => {});
    vi.spyOn(console, 'warn').mockImplementation(() => {});
  });

  it('sends a valid message to staff with the customer as reply-to', async () => {
    expect(await sendContactMessage(valid)).toEqual({ ok: true });
    expect(sendContactMail).toHaveBeenCalledWith(
      expect.objectContaining({ replyTo: 'matti@example.com', subject: 'Kabinettivaraus – Matti Meikäläinen' }),
    );
  });

  it('rejects invalid input on the server, sending nothing', async () => {
    expect(await sendContactMessage({ ...valid, email: 'nope', privacy: false })).toEqual({
      ok: false,
      error: 'invalid',
      fieldErrors: { email: 'emailInvalid', privacy: 'privacyRequired' },
    });
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it('pretends a honeypot submission worked, sending nothing', async () => {
    expect(await sendContactMessage({ ...valid, [HONEYPOT_FIELD]: 'https://spam.example' })).toEqual({ ok: true });
    expect(sendContactMail).not.toHaveBeenCalled();
  });

  it('reports sendFailed when the mail cannot be sent, logging no content', async () => {
    sendContactMail.mockRejectedValue(new Error('resend failed: application_error (500)'));
    expect(await sendContactMessage(valid)).toEqual({ ok: false, error: 'sendFailed' });
    expect(vi.mocked(console.error).mock.calls.flat().join(' ')).not.toMatch(/Matti|matti@example\.com|Kabinetti/);
  });
});
