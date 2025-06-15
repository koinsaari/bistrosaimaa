/*
 * Copyright (c) 2025 Aaro Koinsaari
 * Licensed under the MIT License.
 */

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { object, string } from 'yup';

export default function ContactForm({
  onSubmitSuccess,
  initialSubject = 'Kabinettivaraus',
  motionProps = {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    transition: { delay: 0.5 },
  },
  className = 'lg:w-3/5',
}) {
  const [formStatus, setFormStatus] = useState({
    submitted: false,
    error: false,
    message: '',
  });
  const [privacyAccepted, setPrivacyAccepted] = useState(false);

  const MESSAGE_MAX_LENGTH = 1000;
  const NAME_MAX_LENGTH = 50;
  const PHONE_MAX_LENGTH = 25;

  const validationSchema = object({
    name: string()
      .required('Nimi on pakollinen')
      .max(NAME_MAX_LENGTH, `Nimi on liian pitkä (max ${NAME_MAX_LENGTH} merkkiä)`)
      .test(
        'not-only-numbers',
        'Nimi ei voi koostua pelkistä numeroista',
        (value) => !/^\d+$/.test(value)
      )
      .matches(/^[\p{L}\p{M}\s\-']+$/u, 'Nimi sisältää kiellettyjä merkkejä'),

    email: string().required('Sähköposti on pakollinen').email('Virheellinen sähköpostiosoite'),

    phone: string()
      .max(PHONE_MAX_LENGTH, `Puhelinnumero on liian pitkä (max ${PHONE_MAX_LENGTH} merkkiä)`)
      .test(
        'valid-phone-chars',
        'Puhelinnumero sisältää kiellettyjä merkkejä',
        (value) => !value || /^[0-9+\-() .]+$/.test(value)
      )
      .test(
        'has-digits',
        'Puhelinnumero täytyy sisältää numeroita',
        (value) => !value || /[0-9]/.test(value)
      ),

    message: string()
      .required('Viesti on pakollinen')
      .max(MESSAGE_MAX_LENGTH, `Viesti on liian pitkä (max ${MESSAGE_MAX_LENGTH} merkkiä)`),

    subject: string().required('Aihe on pakollinen'),
  });

  const handleSubmit = async (values, { resetForm }) => {
    if (!privacyAccepted) {
      setFormStatus({
        submitted: true,
        error: true,
        message: 'Hyväksy tietosuojakäytäntö jatkaaksesi.',
      });
      return;
    }

    try {
      setFormStatus({
        submitted: true,
        error: false,
        message: 'Lähetetään...',
      });

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
        setFormStatus({
          submitted: true,
          error: false,
          message: 'Kiitos yhteydenotostasi! Palaamme asiaan mahdollisimman pian.',
        });

        // Reset form after successful submission
        resetForm();
        setPrivacyAccepted(false);

        if (onSubmitSuccess) {
          onSubmitSuccess();
        }
      } else {
        throw new Error(data.message || 'Lomakkeen lähetyksessä tapahtui virhe');
      }
    } catch (error) {
      console.error('Form submission error:', error);

      setFormStatus({
        submitted: true,
        error: true,
        message: error.message || 'Lomakkeen lähetyksessä tapahtui virhe. Yritä uudelleen.',
      });
    }
  };

  return (
    <motion.div className={className} {...motionProps}>
      <div className="bg-white rounded-xl shadow-md p-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Yhteydenottolomake</h2>

        {formStatus.submitted && (
          <div
            className={`p-4 mb-6 rounded-lg ${
              formStatus.error ? 'bg-red-50 text-red-700' : 'bg-emerald-50 text-emerald-700'
            }`}
          >
            {formStatus.message}
          </div>
        )}

        <Formik
          initialValues={{
            name: '',
            email: '',
            phone: '',
            message: '',
            subject: initialSubject,
          }}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ errors, touched, values, isValid, dirty }) => (
            <Form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Nimi *
                  </label>
                  <Field
                    type="text"
                    id="name"
                    name="name"
                    maxLength={NAME_MAX_LENGTH}
                    className={`w-full px-4 py-2 border ${
                      errors.name && touched.name ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800`}
                  />
                  <ErrorMessage name="name" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Sähköposti *
                  </label>
                  <Field
                    type="email"
                    id="email"
                    name="email"
                    className={`w-full px-4 py-2 border ${
                      errors.email && touched.email ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800`}
                  />
                  <ErrorMessage name="email" component="p" className="mt-1 text-sm text-red-600" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Phone */}
                <div>
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Puhelinnumero
                  </label>
                  <Field
                    type="tel"
                    id="phone"
                    name="phone"
                    maxLength={PHONE_MAX_LENGTH}
                    className={`w-full px-4 py-2 border ${
                      errors.phone && touched.phone ? 'border-red-300' : 'border-gray-300'
                    } rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800`}
                  />
                  <ErrorMessage name="phone" component="p" className="mt-1 text-sm text-red-600" />
                </div>

                {/* Subject */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Aihe
                  </label>
                  <Field
                    as="select"
                    id="subject"
                    name="subject"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white text-gray-800"
                  >
                    <option value="Kabinettivaraus">Kabinettivaraus</option>
                    <option value="Pitopalvelu">Pitopalvelu</option>
                    <option value="Tapahtumatiedustelu">Tapahtumatiedustelu</option>
                    <option value="Pöytävaraus">Pöytävaraus</option>
                    <option value="Palaute">Palaute</option>
                    <option value="Muu yhteydenotto">Muu yhteydenotto</option>
                  </Field>
                </div>
              </div>

              {/* Message */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                    Viesti *
                  </label>
                  <span
                    className={`text-xs ${
                      values.message.length > MESSAGE_MAX_LENGTH
                        ? 'text-red-600 font-medium'
                        : 'text-gray-500'
                    }`}
                  >
                    {values.message.length}/{MESSAGE_MAX_LENGTH}
                  </span>
                </div>
                <Field
                  as="textarea"
                  id="message"
                  name="message"
                  rows="5"
                  className={`w-full px-4 py-2 border ${
                    errors.message && touched.message ? 'border-red-300' : 'border-gray-300'
                  } rounded-md focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-gray-800`}
                />
                <ErrorMessage name="message" component="p" className="mt-1 text-sm text-red-600" />
              </div>

              {/* Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="privacy"
                  name="privacy"
                  className="h-4 w-4 text-emerald-600 border-gray-300 rounded focus:ring-emerald-500 accent-emerald-600"
                  checked={privacyAccepted}
                  onChange={(e) => setPrivacyAccepted(e.target.checked)}
                  required
                />
                <label htmlFor="privacy" className="ml-2 block text-sm text-gray-700">
                  Hyväksyn{' '}
                  <a href="/privacy-policy" className="text-emerald-600 hover:underline">
                    tietosuojakäytännön
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={!isValid || !dirty || !privacyAccepted}
                  className={`px-6 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${
                    isValid && dirty && privacyAccepted
                      ? '!bg-emerald-600 !hover:bg-emerald-700 text-white focus:ring-emerald-500 cursor-pointer'
                      : '!bg-gray-300 !text-gray-500 !cursor-not-allowed'
                  }`}
                >
                  Lähetä viesti
                </button>
              </div>
            </Form>
          )}
        </Formik>

        <p className="mt-6 text-sm text-gray-500">
          {/* Käsittelemme viestit yleensä 1-2 arkipäivän kuluessa. Kiireellisissä asioissa
          suosittelemme soittamaan suoraan ravintolaamme. */}
          Kiireellisissä asioissa suosittelemme soittamaan suoraan ravintolaamme.
        </p>
        <p className="mt-6 text-sm text-gray-500">Pöytävaraukset hoidetaan puhelimitse.</p>
      </div>
    </motion.div>
  );
}
