import { describe, expect, it } from 'vitest';
import { MESSAGE_MAX_LENGTH, NAME_MAX_LENGTH, buildContactEmail, parseContact, type ContactMessage } from '@/lib/contact';

const valid = {
  name: 'Matti Meikäläinen',
  email: 'matti@example.com',
  phone: '',
  subject: 'catering',
  message: 'Pitopalvelua 40 hengelle lauantaina.',
  privacy: true,
};

const errorsFor = (overrides: Record<string, unknown>) => {
  const result = parseContact({ ...valid, ...overrides });
  return result.ok ? {} : result.fieldErrors;
};

describe('parseContact', () => {
  it('accepts a valid message and trims it', () => {
    const result = parseContact({ ...valid, name: '  Matti  ', message: ' Hei ' });
    expect(result).toEqual({ ok: true, data: { ...valid, name: 'Matti', message: 'Hei' } });
  });

  it('accepts company names, digits and punctuation in the name', () => {
    expect(errorsFor({ name: 'Yritys Oy 2.0 / St. John' })).toEqual({});
  });

  it('returns one error key per field', () => {
    expect(parseContact({})).toEqual({
      ok: false,
      fieldErrors: {
        name: 'nameRequired',
        email: 'emailRequired',
        subject: 'subjectRequired',
        message: 'messageRequired',
        privacy: 'privacyRequired',
      },
    });
  });

  it.each([null, 'name=Matti', 42])('reports no field errors for a non-object body (%s)', (input) => {
    expect(parseContact(input)).toEqual({ ok: false, fieldErrors: {} });
  });

  it('treats whitespace-only fields as empty', () => {
    expect(errorsFor({ name: '   ', message: '\n ' })).toEqual({ name: 'nameRequired', message: 'messageRequired' });
  });

  it.each(['missing-dot@nodomain', 'no-at.example.com', 'two@@example.com'])('rejects the email %s', (email) => {
    expect(errorsFor({ email })).toEqual({ email: 'emailInvalid' });
  });

  it.each(['040 123 4567', '+358 40 123 4567', '+46 70 123 45 67'])('accepts the phone number %s', (phone) => {
    expect(errorsFor({ phone })).toEqual({});
  });

  it.each(['abc-invalid', '123', '+358', '123 456 7890'])('rejects the phone number %s', (phone) => {
    expect(errorsFor({ phone })).toEqual({ phone: 'phoneInvalid' });
  });

  it('enforces the length limits', () => {
    expect(errorsFor({ name: 'a'.repeat(NAME_MAX_LENGTH + 1) })).toEqual({ name: 'nameTooLong' });
    expect(errorsFor({ message: 'a'.repeat(MESSAGE_MAX_LENGTH + 1) })).toEqual({ message: 'messageTooLong' });
    expect(errorsFor({ phone: '0'.repeat(26) })).toEqual({ phone: 'phoneTooLong' });
  });

  it('only accepts the known subjects', () => {
    expect(errorsFor({ subject: 'Catering' })).toEqual({ subject: 'subjectRequired' });
  });

  it('requires the privacy policy to be accepted', () => {
    expect(errorsFor({ privacy: false })).toEqual({ privacy: 'privacyRequired' });
    expect(errorsFor({ privacy: 'on' })).toEqual({ privacy: 'privacyRequired' });
  });
});

describe('buildContactEmail', () => {
  const message: ContactMessage = { ...valid, subject: 'catering', phone: '' };
  const sentAt = new Date('2026-10-12T19:31:00Z');

  it('puts the Finnish subject label and the sender in the subject line', () => {
    expect(buildContactEmail(message, sentAt).subject).toBe('Pitopalvelut – Matti Meikäläinen');
  });

  it('keeps the subject line on one line', () => {
    expect(buildContactEmail({ ...message, name: 'Matti\r\nBcc: x@example.com' }, sentAt).subject).toBe(
      'Pitopalvelut – Matti Bcc: x@example.com',
    );
  });

  it('lists every field and the Helsinki time in the body', () => {
    const { text } = buildContactEmail({ ...message, phone: '040 123 4567' }, sentAt);
    expect(text).toContain('Aihe: Pitopalvelut');
    expect(text).toContain('Nimi: Matti Meikäläinen');
    expect(text).toContain('Sähköposti: matti@example.com');
    expect(text).toContain('Puhelin: 040 123 4567');
    expect(text).toMatch(/Lähetetty: 12\.10\.2026 (klo )?22\.31/);
    expect(text).toContain('Pitopalvelua 40 hengelle lauantaina.');
  });

  it('says when no phone number was given', () => {
    expect(buildContactEmail(message, sentAt).text).toContain('Puhelin: Ei annettu');
  });
});
