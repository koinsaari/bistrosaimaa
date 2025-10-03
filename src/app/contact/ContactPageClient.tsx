/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { motion } from 'framer-motion';
import { Facebook, MapPin, Phone, Mail, Clock, ExternalLink } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import ContactForm from './ContactForm';
import { useTranslations } from 'next-intl';

const ContactHero = () => {
  const t = useTranslations('ContactPage');

  return (
    <div
      id="contact-hero"
      className="pt-32 pb-16"
      style={{
        background:
          'radial-gradient(ellipse at top, rgba(223, 81, 35, 0.2) 0%, rgba(42, 42, 42, 0.9) 40%, #1c1c1c 100%)',
        boxShadow:
          '0 10px 40px -10px rgba(223, 81, 35, 0.3), inset 0 1px 0 rgba(255, 107, 61, 0.1)',
      }}
    >
      <div className="container mx-auto px-4">
        <motion.h1
          className="text-4xl md:text-6xl font-bold mb-6 text-center text-foreground drop-shadow-lg"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
        >
          {t('title')}
        </motion.h1>

        <motion.p
          className="text-center text-lg md:text-xl max-w-2xl mx-auto text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
        >
          {t('subtitle')}
        </motion.p>
      </div>
    </div>
  );
};

const ContactInfoCard = () => {
  const t = useTranslations('ContactPage');

  return (
    <motion.div
      className="lg:w-2/5"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.3 }}
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
          <CardTitle className="text-2xl">{t('bistroSaimaa')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 flex flex-col items-center lg:items-start">
          {/* Address */}
          <div className="flex items-start space-x-4 w-full max-w-sm lg:max-w-none">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <MapPin className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-foreground">{t('address')}</h3>
              <p className="text-muted-foreground">
                {t('addressLine1')}
                <br />
                {t('addressLine2')}
              </p>
              <Button variant="link" asChild className="h-auto p-0 text-sm mt-1">
                <a
                  href="https://maps.google.com/?q=Bistro+Saimaa+Ristiina"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-1"
                >
                  <span>{t('showOnMap')}</span>
                  <ExternalLink className="h-3 w-3" />
                </a>
              </Button>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-start space-x-4 w-full max-w-sm lg:max-w-none">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Phone className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-foreground">{t('phone')}</h3>
              <p className="text-muted-foreground">
                <Button variant="link" asChild className="h-auto p-0 text-muted-foreground">
                  <a href="tel:+358504499322">
                    +358 50 4499 322
                  </a>
                </Button>
              </p>
            </div>
          </div>

          {/* Email with tooltip */}
          <div className="flex items-start space-x-4 w-full max-w-sm lg:max-w-none">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Mail className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-foreground">{t('email')}</h3>
              <div className="relative group">
                <p className="text-muted-foreground">
                  <Button variant="link" asChild className="h-auto p-0 text-muted-foreground">
                    <a href="mailto:bistrosaimaa@gmail.com">
                      bistrosaimaa@gmail.com
                    </a>
                  </Button>
                </p>

                <div className="absolute left-0 bottom-full mb-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 transform group-hover:translate-y-0 translate-y-1 z-10">
                  <div className="bg-popover text-popover-foreground text-xs rounded-md py-2 px-3 max-w-xs shadow-lg border border-border">
                    <p>{t('emailTooltip')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Opening Hours */}
          <div className="flex items-start space-x-4 w-full max-w-sm lg:max-w-none">
            <div className="flex-shrink-0 h-10 w-10 flex items-center justify-center rounded-full bg-primary/10 text-primary">
              <Clock className="h-5 w-5" />
            </div>
            <div className="text-left">
              <h3 className="font-medium text-foreground">{t('openingHours')}</h3>
              <div className="grid grid-cols-[100px_auto] gap-y-1 text-muted-foreground">
                <span>{t('monFri')}</span> <span>{t('monFriHours')}</span>
                <span>{t('saturday')}</span> <span>{t('saturdayHours')}</span>
                <span>{t('sunday')}</span> <span>{t('sundayHours')}</span>
              </div>
            </div>
          </div>

          {/* Social media */}
          <div className="pt-4 border-t border-border text-center w-full">
            <h3 className="font-medium text-foreground mb-3">{t('socialMedia')}</h3>
            <div className="flex justify-center space-x-6 mt-3">
              <Button variant="ghost" size="icon" asChild className="rounded-full h-12 w-12">
                <a
                  href="https://www.facebook.com/bistrosaimaaoy"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                >
                  <Facebook className="h-5 w-5" />
                </a>
              </Button>
              {/* <a
              href=""
              target="_blank"
              rel="noopener noreferrer"
              className="bg-muted hover:bg-primary/10 text-muted-foreground hover:text-primary h-12 w-12 rounded-full flex items-center justify-center transition-colors"
              aria-label="Instagram"
            >
              <Instagram className="h-5 w-5" />
            </a> */}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const MapSection = () => {
  const t = useTranslations('ContactPage');

  return (
    <motion.div
      className="mt-16"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.7 }}
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
          <CardTitle className="text-2xl text-center">{t('location')}</CardTitle>
        </CardHeader>
        <div className="h-[400px] w-full">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1903.368771025145!2d27.256036077234!3d61.50666667574106!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x469073801b964d6d%3A0xa50b1dbd31d8cb94!2sBistro%20Saimaa!5e0!3m2!1sfi!2sfi!4v1746872264794!5m2!1sfi!2sfi"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Bistro Saimaa sijainti"
            className="w-full h-full"
          ></iframe>
        </div>

        <CardContent className="p-6">
          <p className="text-muted-foreground">{t('locationDescription')}</p>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default function ContactPageContent() {
  return (
    <div className="font-sans bg-background">
      <ContactHero />

      <div className="container mx-auto px-4 py-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            <ContactInfoCard />
            <ContactForm className="lg:w-3/5" />
          </div>
          <MapSection />
        </div>
      </div>
    </div>
  );
}
