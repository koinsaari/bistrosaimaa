'use client';

import { useTransition } from 'react';
import { useLocale } from 'next-intl';
import { Button } from '@/components/ui/button';
import { usePathname, useRouter } from '@/i18n/navigation';
import type { Locale } from '@/i18n/routing';

interface LanguageSelectorProps {
  variant?: 'default' | 'mobile';
  onLanguageChange?: () => void;
}

export default function LanguageSelector({
  variant = 'default',
  onLanguageChange,
}: LanguageSelectorProps) {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (lang: Locale) => {
    if (lang === locale) return;
    startTransition(() => {
      router.replace(pathname, { locale: lang });
    });
    onLanguageChange?.();
  };

  const isMobile = variant === 'mobile';

  return (
    <div
      className={`flex items-center bg-muted/50 backdrop-blur-sm rounded-full p-1 ${isMobile ? '' : 'ml-2'}`}
    >
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange('fi')}
        disabled={isPending}
        className={`rounded-full ${isMobile ? 'px-4' : 'px-3'} py-1 text-xs transition-all duration-200 ${
          locale === 'fi'
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-background hover:text-primary'
        }`}
      >
        FI
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => handleLanguageChange('en')}
        disabled={isPending}
        className={`rounded-full ${isMobile ? 'px-4' : 'px-3'} py-1 text-xs transition-all duration-200 ${
          locale === 'en'
            ? 'bg-primary text-primary-foreground'
            : 'text-foreground hover:bg-background hover:text-primary'
        }`}
      >
        EN
      </Button>
    </div>
  );
}
