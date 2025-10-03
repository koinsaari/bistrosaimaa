/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useTranslations } from 'next-intl';

interface ContactFormProps {
  initialSubject?: string;
  className?: string;
  onSubmitSuccess?: () => void;
}

const MESSAGE_MAX_LENGTH = 1000;
const NAME_MAX_LENGTH = 50;
const PHONE_MAX_LENGTH = 25;

const createFormSchema = (t: (key: string) => string) =>
  z.object({
    name: z
      .string()
      .min(1, t('validation.nameRequired'))
      .max(NAME_MAX_LENGTH, t('validation.nameTooLong'))
      .refine((value) => !/^\d+$/.test(value), t('validation.nameOnlyNumbers'))
      .refine(
        (value) => /^[\p{L}\p{M}\s\-']+$/u.test(value),
        t('validation.nameInvalidCharacters')
      ),

    email: z
      .string()
      .min(1, t('validation.emailRequired'))
      .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, t('validation.emailInvalid')),

    phone: z
      .string()
      .optional()
      .refine((value) => !value || value.length <= PHONE_MAX_LENGTH, t('validation.phoneTooLong'))
      .refine(
        (value) => !value || /^[0-9+\-() .]+$/.test(value),
        t('validation.phoneInvalidCharacters')
      )
      .refine((value) => !value || /[0-9]/.test(value), t('validation.phoneNeedsNumbers')),

    subject: z.string().min(1, t('validation.subjectRequired')),

    message: z
      .string()
      .min(1, t('validation.messageRequired'))
      .max(MESSAGE_MAX_LENGTH, t('validation.messageTooLong')),

    privacy: z.boolean().refine((value) => value === true, t('validation.privacyRequired')),
  });

type FormData = z.infer<ReturnType<typeof createFormSchema>>;

export default function ContactForm({
  initialSubject,
  className = 'lg:w-3/5',
  onSubmitSuccess,
}: ContactFormProps) {
  const t = useTranslations('ContactPage');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const formSchema = createFormSchema(t);
  const defaultSubject = initialSubject || t('subjectGeneral');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: defaultSubject,
      message: '',
      privacy: false,
    },
  });

  // Update form when language changes
  useEffect(() => {
    if (!initialSubject) {
      form.setValue('subject', t('subjectGeneral'));
    }
  }, [t, form, initialSubject]);

  const handleSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

    let finnishSubject = values.subject;
    if (values.subject === 'Event Room Reservation') {
      finnishSubject = 'Kabinettivaraus';
    } else if (values.subject === 'Catering') {
      finnishSubject = 'Pitopalvelut';
    } else if (values.subject === 'General Inquiry') {
      finnishSubject = 'Yleinen kysely';
    }

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          access_key: 'ba8420e9-f50a-4313-97c9-b38988041269',
          name: values.name,
          email: values.email,
          phone: values.phone || 'Ei annettu',
          subject: `Yhteydenotto: ${finnishSubject}`,
          message: values.message,
          from_name: values.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage(t('formSuccess'));

        form.reset({
          name: '',
          email: '',
          phone: '',
          subject: defaultSubject,
          message: '',
          privacy: false,
        });

        // Force re-render
        setTimeout(() => {
          form.setValue('subject', defaultSubject);
        }, 0);

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error(data.message || t('formError'));
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(error instanceof Error ? error.message : t('formError'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const messageLength = form.watch('message')?.length || 0;

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
          background: 'linear-gradient(135deg, #2a2a2a 0%, #232323 100%)',
          boxShadow:
            '0 10px 30px -5px rgba(0, 0, 0, 0.5), 0 0 20px rgba(223, 81, 35, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.05)',
        }}
      >
        <CardHeader>
          <CardTitle className="text-2xl">{t('formTitle')}</CardTitle>
          <CardDescription>{t('formDescription')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
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
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-border/60 bg-background/30 min-w-[150px]">
                          <SelectValue
                            placeholder={`${t('formSubject')}...`}
                            className="text-foreground"
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={t('subjectGeneral')}>{t('subjectGeneral')}</SelectItem>
                        <SelectItem value={t('subjectCabinetReservation')}>
                          {t('subjectCabinetReservation')}
                        </SelectItem>
                        <SelectItem value={t('subjectCatering')}>{t('subjectCatering')}</SelectItem>
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
                      <span
                        className={`text-xs ${
                          messageLength > MESSAGE_MAX_LENGTH
                            ? 'text-destructive font-medium'
                            : 'text-muted-foreground'
                        }`}
                      >
                        {messageLength}/{MESSAGE_MAX_LENGTH}
                      </span>
                    </div>
                    <FormControl>
                      <Textarea
                        placeholder={t('formMessage')}
                        rows={5}
                        {...field}
                        className="border-border/60 bg-background/30"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex flex-row items-start space-x-2">
                      <FormControl>
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-primary border-input rounded focus:ring-ring focus:ring-2 accent-primary mt-0.5"
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm font-normal cursor-pointer !text-foreground">
                        {t('privacyAccept')}{' '}
                        <Button variant="link" asChild className="h-auto p-0 text-sm">
                          <a href="/privacy" target="_blank" rel="noopener noreferrer">
                            {t('privacyPolicy')}
                          </a>
                        </Button>
                      </FormLabel>
                    </div>
                    <FormMessage className="ml-6" />
                  </FormItem>
                )}
              />

              {submitStatus === 'success' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-green-600 bg-green-50 border border-green-200 rounded-md p-3"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>{submitMessage}</span>
                </motion.div>
              )}

              {submitStatus === 'error' && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center space-x-2 text-red-600 bg-red-50 border border-red-200 rounded-md p-3"
                >
                  <AlertCircle className="h-5 w-5" />
                  <span>{submitMessage}</span>
                </motion.div>
              )}

              <Button type="submit" disabled={isSubmitting} className="w-full" size="lg">
                {isSubmitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
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
