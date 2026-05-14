import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { hasLocale } from 'next-intl';
import NotFoundClient from './NotFoundClient';
import { routing } from '@/i18n/routing';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadata.notFound' });
  return {
    title: t('title'),
    robots: { index: false, follow: false },
  };
}

export default function NotFound() {
  return <NotFoundClient />;
}
