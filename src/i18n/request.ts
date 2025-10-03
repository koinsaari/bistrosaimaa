import { getRequestConfig } from 'next-intl/server';
import { cookies } from 'next/headers';

export default getRequestConfig(async () => {
  // Get locale from cookie, default to 'fi'
  const cookieStore = await cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'fi';

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default,
  };
});
