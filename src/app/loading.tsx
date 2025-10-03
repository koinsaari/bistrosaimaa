/*
 * Copyright (c) 2025 Aaro Koinsaari
 */

import { useTranslations } from 'next-intl';

export default function Loading() {
  const t = useTranslations('LoadingPage');

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="flex flex-col items-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
        <p className="text-muted-foreground text-sm">{t('loading')}</p>
      </div>
    </div>
  );
}
