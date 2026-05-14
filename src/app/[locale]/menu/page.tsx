import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import MenuPageClient from './MenuPageClient';
import { routing, type Locale } from '@/i18n/routing';
import { localeAlternates } from '@/i18n/metadata';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadata.menu' });
  return {
    title: t('title'),
    description: t('description'),
    keywords: t('keywords'),
    robots: { index: true, follow: true },
    alternates: localeAlternates('/menu', locale as Locale),
  };
}

export default async function MenuPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <MenuPageClient />;
}
