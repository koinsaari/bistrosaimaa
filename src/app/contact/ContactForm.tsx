/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useState } from 'react';
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

interface ContactFormProps {
  initialSubject?: string;
  className?: string;
  onSubmitSuccess?: () => void;
}

const MESSAGE_MAX_LENGTH = 1000;
const NAME_MAX_LENGTH = 50;
const PHONE_MAX_LENGTH = 25;

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Nimi on pakollinen')
    .max(NAME_MAX_LENGTH, `Nimi on liian pitkä (max ${NAME_MAX_LENGTH} merkkiä)`)
    .refine((value) => !/^\d+$/.test(value), 'Nimi ei voi koostua pelkistä numeroista')
    .refine((value) => /^[\p{L}\p{M}\s\-']+$/u.test(value), 'Nimi sisältää kiellettyjä merkkejä'),

  email: z
    .string()
    .min(1, 'Sähköposti on pakollinen')
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Virheellinen sähköpostiosoite'),

  phone: z
    .string()
    .optional()
    .refine(
      (value) => !value || value.length <= PHONE_MAX_LENGTH,
      `Puhelinnumero on liian pitkä (max ${PHONE_MAX_LENGTH} merkkiä)`
    )
    .refine(
      (value) => !value || /^[0-9+\-() .]+$/.test(value),
      'Puhelinnumero sisältää kiellettyjä merkkejä'
    )
    .refine((value) => !value || /[0-9]/.test(value), 'Puhelinnumero täytyy sisältää numeroita'),

  subject: z.string().min(1, 'Aihe on pakollinen'),

  message: z
    .string()
    .min(1, 'Viesti on pakollinen')
    .max(MESSAGE_MAX_LENGTH, `Viesti on liian pitkä (max ${MESSAGE_MAX_LENGTH} merkkiä)`),

  privacy: z.boolean().refine((value) => value === true, 'Tietosuojakäytäntö on hyväksyttävä'),
});

type FormData = z.infer<typeof formSchema>;

export default function ContactForm({
  initialSubject = 'Kabinettivaraus',
  className = 'lg:w-3/5',
  onSubmitSuccess,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [submitMessage, setSubmitMessage] = useState('');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: initialSubject,
      message: '',
      privacy: false,
    },
  });

  const handleSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    setSubmitStatus('idle');

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
          subject: `Yhteydenotto: ${values.subject}`,
          message: values.message,
          from_name: values.email,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSubmitStatus('success');
        setSubmitMessage('Kiitos yhteydenotostasi! Palaamme asiaan mahdollisimman pian.');

        form.reset({
          name: '',
          email: '',
          phone: '',
          subject: initialSubject,
          message: '',
          privacy: false,
        });

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error(data.message || 'Lomakkeen lähetyksessä tapahtui virhe');
      }
    } catch (error) {
      console.error('Form submission error:', error);
      setSubmitStatus('error');
      setSubmitMessage(
        error instanceof Error
          ? error.message
          : 'Lomakkeen lähetyksessä tapahtui virhe. Yritä uudelleen.'
      );
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
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Lähetä viesti</CardTitle>
          <CardDescription>
            Täytä alla oleva lomake, niin otamme yhteyttä mahdollisimman pian.
          </CardDescription>
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
                      <FormLabel>Nimi *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nimesi" {...field} maxLength={NAME_MAX_LENGTH} />
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
                      <FormLabel>Sähköposti *</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="sahkoposti@esimerkki.fi" {...field} />
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
                    <FormLabel>Puhelinnumero</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        placeholder="+358 50 123 4567"
                        {...field}
                        maxLength={PHONE_MAX_LENGTH}
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
                    <FormLabel>Aihe *</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Valitse aihe" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Kabinettivaraus">Kabinettivaraus</SelectItem>
                        <SelectItem value="Pitopalvelu">Pitopalvelu</SelectItem>
                        <SelectItem value="Tapahtumatiedustelu">Tapahtumatiedustelu</SelectItem>
                        <SelectItem value="Palaute">Palaute</SelectItem>
                        <SelectItem value="Muu">Muu</SelectItem>
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
                      <FormLabel>Viesti *</FormLabel>
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
                      <Textarea placeholder="Kerro lisää..." rows={5} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="privacy"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                    <FormControl>
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-primary border-input rounded focus:ring-ring focus:ring-2 accent-primary mt-0.5"
                        checked={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <div className="leading-none">
                      <FormLabel className="text-sm font-normal">
                        Hyväksyn{' '}
                        <a href="/privacy" className="text-primary hover:underline">
                          tietosuojakäytännön
                        </a>
                      </FormLabel>
                      <FormMessage />
                    </div>
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
                    Lähetetään...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Lähetä viesti
                  </>
                )}
              </Button>

              <p className="text-sm text-muted-foreground text-center">* Pakolliset kentät</p>
              <p className="text-sm text-muted-foreground text-center">
                Kiireellisissä asioissa suosittelemme soittamaan suoraan ravintolaamme.
              </p>
              <p className="text-sm text-muted-foreground text-center">
                Pöytävaraukset hoidetaan puhelimitse.
              </p>
            </form>
          </Form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
