/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';

const PrivacyPolicyHero = () => {
  const t = useTranslations('PrivacyPage');

  return (
  <div
    className="text-primary-foreground pt-32 pb-16 relative overflow-hidden"
    style={{
      background:
        'radial-gradient(ellipse at top, rgba(93, 138, 122, 0.15) 0%, rgba(248, 246, 241, 0.9) 40%, #f8f6f1 100%)',
      boxShadow: '0 10px 40px -10px rgba(93, 138, 122, 0.2), inset 0 1px 0 rgba(122, 163, 150, 0.1)',
    }}
  >
    <div className="container mx-auto px-4 relative z-10">
      <motion.h1
        className="text-3xl md:text-4xl font-bold mb-4 text-center text-foreground drop-shadow-lg"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {t('title')}
      </motion.h1>
    </div>
  </div>
  );
};

const PrivacyPolicyContent = () => {
  const t = useTranslations('PrivacyPage');

  return (
  <motion.div
    className="max-w-4xl mx-auto"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: 0.2 }}
  >
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">{t('cardTitle')}</CardTitle>
        <p className="text-muted-foreground">{t('lastUpdated')}</p>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <p className="text-foreground">
            {t('intro')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">{t('section1Title')}</h3>
          <p className="text-foreground mb-3">
            {t('section1Intro')}
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>{t('section1Item1')}</li>
            <li>{t('section1Item2')}</li>
            <li>{t('section1Item3')}</li>
            <li>{t('section1Item4')}</li>
            <li>{t('section1Item5')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {t('section2Title')}
          </h3>
          <p className="text-foreground">
            {t('section2Text')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">
            {t('section3Title')}
          </h3>
          <p className="text-foreground mb-4">{t('section3Intro')}</p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>{t('section3Item1')}</li>
            <li>{t('section3Item2')}</li>
            <li>{t('section3Item3')}</li>
            <li>{t('section3Item4')}</li>
            <li>{t('section3Item5')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">{t('section4Title')}</h3>
          <p className="text-foreground mb-4">
            {t('section4Text')}
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>{t('section4Item1')}</li>
            <li>{t('section4Item2')}</li>
            <li>{t('section4Item3')}</li>
            <li>{t('section4Item4')}</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">{t('section5Title')}</h3>
          <p className="text-foreground mb-4">
            {t('section5Intro')}
          </p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>{t('section5Item1')}</li>
            <li>{t('section5Item2')}</li>
            <li>{t('section5Item3')}</li>
            <li>{t('section5Item4')}</li>
            <li>
              {t('section5Item5')}{' '}
              <a
                href="https://vercel.com/docs/analytics/privacy-policy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                vercel.com/docs/analytics/privacy-policy
              </a>
            </li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">{t('section6Title')}</h3>
          <p className="text-foreground mb-3">{t('section6Intro')}</p>
          <ul className="list-disc pl-6 text-foreground space-y-1">
            <li>{t('section6Item1')}</li>
            <li>{t('section6Item2')}</li>
            <li>{t('section6Item3')}</li>
          </ul>
          <p className="text-foreground mt-3">
            {t('section6Text')}
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-foreground mb-3">{t('section7Title')}</h3>
          <p className="text-foreground mb-3">{t('section7Line1')}</p>
          <p className="text-foreground mb-1">{t('section7Line2')}</p>
          <p className="text-foreground mb-1">{t('section7Line3')}</p>
          <p className="text-foreground">{t('section7Line4')}</p>
        </section>
      </CardContent>
    </Card>
  </motion.div>
  );
};

export default function PrivacyPolicyPageClient() {
  return (
    <div className="min-h-screen font-sans bg-background">
      <PrivacyPolicyHero />

      <div className="container mx-auto px-4 py-12">
        <PrivacyPolicyContent />
      </div>
    </div>
  );
}
