import type { Locale } from './routing';

export function localeAlternates(path: string, currentLocale: Locale) {
  const fi = path;
  const en = path === '/' ? '/en' : `/en${path}`;
  return {
    canonical: currentLocale === 'fi' ? fi : en,
    languages: {
      fi,
      en,
      'x-default': fi,
    },
  };
}
