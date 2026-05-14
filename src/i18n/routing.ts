import { defineRouting } from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['fi', 'en'],
  defaultLocale: 'fi',
  localePrefix: 'as-needed',
  localeDetection: false,
});

export type Locale = (typeof routing.locales)[number];
