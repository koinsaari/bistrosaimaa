'use client';

import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import WaterLine from '@/components/WaterLine';

export default function NotFoundClient() {
  const t = useTranslations('NotFoundPage');

  return (
    <div className="flex min-h-svh items-center justify-center bg-background px-6">
      <div className="max-w-md space-y-6 text-center">
        <p className="flex items-center justify-center gap-3 text-[11px] font-semibold uppercase tracking-[0.2em] text-primary">
          <WaterLine variant="inline" />
          <span>404</span>
          <WaterLine variant="inline" />
        </p>
        <h1
          data-testid="not-found-heading"
          className="font-serif font-normal leading-[1.05] tracking-[-0.02em] text-[clamp(2.25rem,5vw,4rem)] text-ink"
        >
          {t('title')}
        </h1>
        <p className="text-[15px] leading-relaxed text-muted-foreground">{t('description')}</p>
        <Button asChild className="rounded-full bg-primary hover:bg-primary/90">
          <Link href="/" data-testid="not-found-back-home">
            {t('backToHome')}
          </Link>
        </Button>
      </div>
    </div>
  );
}
