'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
import WaterLine from '@/components/WaterLine';

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
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="max-w-md space-y-6 text-center">
        <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          <WaterLine variant="inline" />
          <span>{t('subtitle')}</span>
          <WaterLine variant="inline" />
        </p>
        <h1 className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,5vw,4rem)] text-ink">
          {t('title')}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{t('description')}</p>

        <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Button onClick={() => reset()} className="rounded-full bg-primary hover:bg-primary/90">
            {t('tryAgain')}
          </Button>
          <Button
            onClick={() => (window.location.href = '/')}
            variant="outline"
            className="rounded-full"
          >
            {t('backToHome')}
          </Button>
        </div>

        {process.env.NODE_ENV === 'development' && error.message && (
          <details className="mt-8 text-left">
            <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
              {t('technicalError')}
            </summary>
            <pre className="mt-2 overflow-auto rounded bg-muted p-4 text-xs">{error.message}</pre>
          </details>
        )}
      </div>
    </div>
  );
}
