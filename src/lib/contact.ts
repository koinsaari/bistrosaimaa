import { isValidPhoneNumber } from 'libphonenumber-js/max';
import { z } from 'zod';

export const CONTACT_SUBJECTS = ['general', 'eventRoom', 'catering'] as const;
export type ContactSubject = (typeof CONTACT_SUBJECTS)[number];

// browsers autofill fields named like website or url, which would drop real messages
export const HONEYPOT_FIELD = 'field_x7q';

export const NAME_MAX_LENGTH = 100;
export const PHONE_MAX_LENGTH = 25;
export const MESSAGE_MAX_LENGTH = 2000;

// Messages are keys under ContactPage.validation, translated by the form
export const contactSchema = z.object({
  name: z.string('nameRequired').trim().min(1, 'nameRequired').max(NAME_MAX_LENGTH, 'nameTooLong'),
  email: z.string('emailRequired').trim().min(1, 'emailRequired').pipe(z.email('emailInvalid')),
  phone: z
    .string('phoneInvalid')
    .trim()
    .max(PHONE_MAX_LENGTH, 'phoneTooLong')
    .refine((value) => !value || isValidPhoneNumber(value, 'FI'), 'phoneInvalid')
    .default(''),
  subject: z.enum(CONTACT_SUBJECTS, 'subjectRequired'),
  message: z.string('messageRequired').trim().min(1, 'messageRequired').max(MESSAGE_MAX_LENGTH, 'messageTooLong'),
  privacy: z.boolean('privacyRequired').refine((value) => value, 'privacyRequired'),
});

export type ContactInput = z.input<typeof contactSchema>;
export type ContactMessage = z.output<typeof contactSchema>;
export type ContactField = keyof ContactMessage;
export type ContactFieldErrors = Partial<Record<ContactField, string>>;

export type ParseResult = { ok: true; data: ContactMessage } | { ok: false; fieldErrors: ContactFieldErrors };

export function parseContact(input: unknown): ParseResult {
  const result = contactSchema.safeParse(input);
  if (result.success) return { ok: true, data: result.data };

  const fieldErrors: ContactFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === 'string' && field in contactSchema.shape) fieldErrors[field as ContactField] ??= issue.message;
  }
  return { ok: false, fieldErrors };
}

const SUBJECT_LABELS: Record<ContactSubject, string> = {
  general: 'Yleinen kysely',
  eventRoom: 'Kabinettivaraus',
  catering: 'Pitopalvelut',
};

const sentAtFormat = new Intl.DateTimeFormat('fi-FI', {
  timeZone: 'Europe/Helsinki',
  dateStyle: 'short',
  timeStyle: 'short',
});

const oneLine = (value: string) => value.replace(/\s+/g, ' ');

export function buildContactEmail(message: ContactMessage, sentAt: Date) {
  const subjectLabel = SUBJECT_LABELS[message.subject];
  return {
    subject: `${subjectLabel} – ${oneLine(message.name)}`,
    text: [
      'Uusi yhteydenotto verkkosivuilta',
      '',
      `Aihe: ${subjectLabel}`,
      `Nimi: ${message.name}`,
      `Sähköposti: ${message.email}`,
      `Puhelin: ${message.phone || 'Ei annettu'}`,
      `Lähetetty: ${sentAtFormat.format(sentAt)}`,
      '',
      'Viesti:',
      message.message,
      '',
      '—',
      'Vastaa tähän viestiin, niin vastaus menee suoraan asiakkaalle.',
    ].join('\n'),
  };
}
