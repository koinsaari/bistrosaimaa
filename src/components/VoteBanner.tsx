import { ExternalLink } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function VoteBanner() {
  const t = await getTranslations('VoteBanner');

  return (
    <a
      href="https://paraslounas.edenred.fi/fi/aanesta"
      target="_blank"
      rel="noopener noreferrer"
      data-testid="vote-banner"
      className="fixed inset-x-0 top-0 z-[60] flex h-[var(--banner-h)] items-center justify-center gap-2 overflow-hidden whitespace-nowrap bg-red-600 px-4 text-sm font-semibold text-white transition-colors hover:bg-red-700"
    >
      <span className="truncate sm:hidden">{t('short')}</span>
      <span className="hidden truncate sm:inline">{t('full')}</span>
      <ExternalLink className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
    </a>
  );
}
