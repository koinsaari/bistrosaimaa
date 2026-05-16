'use client';

import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useTranslations } from 'next-intl';
import WaterLine from '@/components/WaterLine';

const PrivacyPolicyHero = () => {
  const t = useTranslations('PrivacyPage');

  return (
    <div className="container mx-auto px-6 pt-32 pb-10 md:pt-40">
      <p className="mb-4 flex items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
        <WaterLine variant="inline" />
        <span>{t('lastUpdated')}</span>
      </p>
      <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,4.5vw,3.5rem)] text-ink">
        {t('title')}
      </h1>
      <div className="mt-10">
        <WaterLine variant="divider" />
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
        <CardTitle className="font-serif text-2xl font-medium text-ink">{t('cardTitle')}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        <section>
          <p className="text-foreground">
            {t('intro')}
          </p>
        </section>

        <section>
          <h3 data-testid="privacy-section-1" className="font-serif text-xl font-medium text-ink mb-3">{t('section1Title')}</h3>
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
          <h3 data-testid="privacy-section-2" className="font-serif text-xl font-medium text-ink mb-3">
            {t('section2Title')}
          </h3>
          <p className="text-foreground">
            {t('section2Text')}
          </p>
        </section>

        <section>
          <h3 data-testid="privacy-section-3" className="font-serif text-xl font-medium text-ink mb-3">
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
          <h3 data-testid="privacy-section-4" className="font-serif text-xl font-medium text-ink mb-3">{t('section4Title')}</h3>
          <p className="text-foreground mb-4">
            {t('section4Text')}
          </p>
        </section>

        <section>
          <h3 data-testid="privacy-section-5" className="font-serif text-xl font-medium text-ink mb-3">{t('section5Title')}</h3>
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
          <h3 data-testid="privacy-section-6" className="font-serif text-xl font-medium text-ink mb-3">{t('section6Title')}</h3>
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
          <h3 data-testid="privacy-section-7" className="font-serif text-xl font-medium text-ink mb-3">{t('section7Title')}</h3>
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
