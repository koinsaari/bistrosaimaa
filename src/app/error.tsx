/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const t = useTranslations('ErrorPage');

  useEffect(() => {
    console.error('Error boundary caught:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="max-w-md text-center space-y-6 px-4">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-foreground">{t('title')}</h1>
          <h2 className="text-xl font-semibold text-muted-foreground">{t('subtitle')}</h2>
        </div>

        <p className="text-muted-foreground">{t('description')}</p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={() => reset()} variant="default">
            {t('tryAgain')}
          </Button>
          <Button onClick={() => (window.location.href = '/')} variant="outline">
            {t('backToHome')}
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {t('technicalError')}
            </summary>
            <pre className="mt-2 p-4 bg-muted rounded text-xs overflow-auto">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
