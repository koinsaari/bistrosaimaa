import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Analytics } from '@vercel/analytics/next';
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import { hasLocale, NextIntlClientProvider } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import NavigationBar from '@/components/NavigationBar';
import Footer from '@/components/Footer';
import { routing, type Locale } from '@/i18n/routing';
import { localeAlternates } from '@/i18n/metadata';
import '@fontsource-variable/fraunces/index.css';
import '../globals.css';

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) return {};
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  return {
    metadataBase: new URL('https://bistrosaimaa.fi'),
    title: t('home.title'),
    description: t('home.description'),
    keywords: t('home.keywords'),
    authors: [{ name: 'Aaro Koinsaari' }],
    creator: 'Aaro Koinsaari',
    publisher: t('site.name'),
    openGraph: {
      title: t('home.title'),
      description: t('home.description'),
      url: locale === 'fi' ? '/' : '/en',
      siteName: t('site.name'),
      locale: t('site.ogLocale'),
      type: 'website',
    },
    robots: { index: true, follow: true },
    alternates: localeAlternates('/', locale as Locale),
  };
}

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }
  setRequestLocale(locale);

  const messages = await getMessages();

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Restaurant',
    name: 'Bistro Saimaa',
    image: 'https://bistrosaimaa.fi/logo-saimaa.png',
    '@id': 'https://bistrosaimaa.fi',
    url: 'https://bistrosaimaa.fi',
    telephone: '+358504499322',
    priceRange: '€€',
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Brahentie 42',
      addressLocality: 'Ristiina',
      postalCode: '52300',
      addressCountry: 'FI',
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 61.5066667,
      longitude: 27.258611,
    },
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
        opens: '07:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Saturday',
        opens: '09:00',
        closes: '20:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: 'Sunday',
        opens: '11:00',
        closes: '20:00',
      },
    ],
    servesCuisine: 'Finnish',
    acceptsReservations: 'True',
    menu: 'https://bistrosaimaa.fi/menu',
    sameAs: ['https://www.facebook.com/bistrosaimaaoy'],
  };

  return (
    <html lang={locale} className="font-fraunces-host">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
        <NextIntlClientProvider messages={messages}>
          <NavigationBar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Analytics />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
