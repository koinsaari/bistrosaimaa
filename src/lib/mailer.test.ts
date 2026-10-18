import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const send = vi.hoisted(() => vi.fn());

vi.mock('resend', () => ({
  Resend: vi.fn(function () {
    return { emails: { send } };
  }),
}));

const { sendContactMail } = await import('@/lib/mailer');

const mail = { replyTo: 'matti@example.com', subject: 'Pitopalvelut – Matti', text: 'Hei' };

describe('sendContactMail', () => {
  beforeEach(() => {
    vi.stubEnv('CONTACT_MAIL_TRANSPORT', '');
    vi.stubEnv('RESEND_API_KEY', 're_test');
    vi.stubEnv('CONTACT_TO_EMAIL', 'staff@example.com');
    send.mockReset().mockResolvedValue({ data: { id: 'email-id' }, error: null, headers: null });
  });

  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it('sends to the restaurant inbox with the customer as reply-to', async () => {
    await sendContactMail(mail);
    expect(send).toHaveBeenCalledWith({
      from: 'Bistro Saimaa -verkkosivut <noreply@bistrosaimaa.fi>',
      to: 'staff@example.com',
      replyTo: 'matti@example.com',
      subject: 'Pitopalvelut – Matti',
      text: 'Hei',
    });
  });

  it('throws when Resend rejects the message, without the content in the error', async () => {
    send.mockResolvedValue({
      data: null,
      error: { name: 'validation_error', message: 'Invalid `to` field: matti@example.com', statusCode: 422 },
      headers: null,
    });
    await expect(sendContactMail(mail)).rejects.toThrow('resend failed: validation_error (422)');
    await expect(sendContactMail(mail)).rejects.not.toThrow(/matti/);
  });

  it.each(['RESEND_API_KEY', 'CONTACT_TO_EMAIL'])('throws, sending nothing, when %s is missing', async (name) => {
    vi.stubEnv(name, '');
    await expect(sendContactMail(mail)).rejects.toThrow('is not set');
    expect(send).not.toHaveBeenCalled();
  });

  it('sends nothing with the log transport', async () => {
    vi.stubEnv('CONTACT_MAIL_TRANSPORT', 'log');
    vi.stubEnv('RESEND_API_KEY', '');
    const info = vi.spyOn(console, 'info').mockImplementation(() => {});
    await sendContactMail(mail);
    expect(send).not.toHaveBeenCalled();
    expect(info.mock.calls.flat().join(' ')).not.toContain('Matti');
  });
});
