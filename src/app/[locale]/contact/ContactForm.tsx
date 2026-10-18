'use client';

import { useState, type BaseSyntheticEvent } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useWatch, type FieldErrors, type Resolver } from 'react-hook-form';
import { Send, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { BUSINESS } from '@/lib/business';
import {
  CONTACT_SUBJECTS,
  HONEYPOT_FIELD,
  MESSAGE_MAX_LENGTH,
  NAME_MAX_LENGTH,
  PHONE_MAX_LENGTH,
  contactSchema,
  type ContactField,
  type ContactInput,
  type ContactMessage,
  type ContactSubject,
} from '@/lib/contact';
import { sendContactMessage } from './actions';

const SUBJECT_LABEL_KEYS: Record<ContactSubject, string> = {
  general: 'subjectGeneral',
  eventRoom: 'subjectCabinetReservation',
  catering: 'subjectCatering',
};

const EMPTY_FORM: ContactInput = {
  name: '',
  email: '',
  phone: '',
  subject: 'general',
  message: '',
  privacy: false,
};

const baseResolver = zodResolver(contactSchema);

type Status = { kind: 'idle' } | { kind: 'success' } | { kind: 'error'; messageKey: 'formError' | 'formInvalid' };

export default function ContactForm({ className = 'lg:w-3/5' }: { className?: string }) {
  const t = useTranslations('ContactPage');
  const [status, setStatus] = useState<Status>({ kind: 'idle' });

  const translateError = (key: string) => t(`validation.${key}`);

  // The schema's messages are keys, so translate them before react-hook-form shows them.
  const resolver: Resolver<ContactInput, unknown, ContactMessage> = async (values, context, options) => {
    const result = await baseResolver(values, context, options);
    const errors = result.errors as FieldErrors<ContactInput>;
    for (const error of Object.values(errors)) {
      if (error?.message) error.message = translateError(error.message);
    }
    return result;
  };

  const form = useForm<ContactInput, unknown, ContactMessage>({ resolver, defaultValues: EMPTY_FORM });

  const handleSubmit = async (values: ContactMessage, event?: BaseSyntheticEvent) => {
    setStatus({ kind: 'idle' });
    const formElement = event?.target instanceof HTMLFormElement ? event.target : null;
    const trap = formElement?.elements.namedItem(HONEYPOT_FIELD);
    const trapInput = trap instanceof HTMLInputElement ? trap : null;

    let result;
    try {
      result = await sendContactMessage({ ...values, [HONEYPOT_FIELD]: trapInput?.value ?? '' });
    } catch {
      setStatus({ kind: 'error', messageKey: 'formError' });
      return;
    }

    if (result.ok) {
      setStatus({ kind: 'success' });
      form.reset(EMPTY_FORM);
      if (trapInput) trapInput.value = '';
      return;
    }
    if (result.error === 'invalid') {
      for (const [field, key] of Object.entries(result.fieldErrors)) {
        form.setError(field as ContactField, { message: translateError(key) });
      }
      setStatus({ kind: 'error', messageKey: 'formInvalid' });
      return;
    }
    setStatus({ kind: 'error', messageKey: 'formError' });
  };

  const messageLength = useWatch({ control: form.control, name: 'message' })?.length ?? 0;
  const isSubmitting = form.formState.isSubmitting;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.5 }}
    >
      <Card
        className="border-primary/20"
        style={{
          background: 'linear-gradient(135deg, #ffffff 0%, #f8f6f1 100%)',
          boxShadow:
            '0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 0 20px rgba(93, 138, 122, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.8)',
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">{t('formTitle')}</CardTitle>
          <CardDescription>{t('formDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formName')} *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t('formName')}
                          autoComplete="name"
                          {...field}
                          maxLength={NAME_MAX_LENGTH}
                          className="border-border/60 bg-background/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('formEmail')} *</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder={t('formEmail')}
                          autoComplete="email"
                          {...field}
                          className="border-border/60 bg-background/30"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formPhone')}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+358 50 123 4567"
                        autoComplete="tel"
                        {...field}
                        maxLength={PHONE_MAX_LENGTH}
                        className="border-border/60 bg-background/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('formSubject')} *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className="border-border/60 bg-background/30 min-w-[150px]">
                          <SelectValue placeholder={`${t('formSubject')}...`} className="text-foreground" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CONTACT_SUBJECTS.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {t(SUBJECT_LABEL_KEYS[subject])}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{t('formMessage')} *</FormLabel>
                      <span className="text-xs text-muted-foreground">
                        {messageLength}/{MESSAGE_MAX_LENGTH}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={t('formMessage')}
                        rows={5}
                        {...field}
                        maxLength={MESSAGE_MAX_LENGTH}
                        className="border-border/60 bg-background/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                <Input name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
              </div>

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-start space-x-2">
                      <FormControl>
                        <Checkbox checked={field.value} onCheckedChange={field.onChange} className="mt-0.5" />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer !text-foreground">
                        {t('privacyAccept')}{' '}
                        <Button variant="link" asChild className="h-auto p-0 text-sm">
                          <Link href="/privacy" target="_blank" rel="noopener noreferrer">
                            {t('privacyPolicy')}
                          </Link>
                        </Button>
                      </FormLabel>
                    </div>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {status.kind === 'success' && !form.formState.isDirty && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="status"
                  data-testid="form-success"
                  className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-3"
                >
                  <CheckCircle className="h-5 w-5 flex-shrink-0" />
                  <span>{t('formSuccess')}</span>
                </motion.div>
              )}

              {status.kind === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  role="alert"
                  data-testid="form-error"
                  className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3"
                >
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <span>
                    {t(status.messageKey, { phone: BUSINESS.phone.international, email: BUSINESS.email })}
                  </span>
                </motion.div>
              )}

              <Button data-testid="form-submit" type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    {t('formSending')}
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    {t('formSubmit')}
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">{t('requiredFields')}</p>
              <p className="text-sm text-muted-foreground text-center">{t('urgentMatters')}</p>
              <p className="text-sm text-muted-foreground text-center">{t('tableReservations')}</p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
