# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Marketing website for Bistro Saimaa, a restaurant in Ristiina, Mikkeli. Built with Next.js App Router (React 19, Next 16), TypeScript, Tailwind v4, and shadcn/ui (new-york style, stone base, lucide icons). Deployed to Vercel.

## Commands

- `npm run dev` — Next dev server with Turbopack on `http://localhost:3000`
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `npm run test:e2e` — Playwright tests (expects dev server already running at `localhost:3000`; config does not auto-start it)
- `npm run test:e2e:ui` / `:headed` — Playwright UI / headed modes
- Run a single spec: `npx playwright test e2e/menu.spec.ts`
- Run a single project: `npx playwright test --project=desktop` (or `mobile`)

Playwright has two projects: `desktop` (Chrome) ignores `navigation-mobile.spec.ts`; `mobile` (Pixel 5) ignores `navigation.spec.ts`. Keep this split in mind when adding navigation tests.

## Architecture

### Internationalization (Finnish / English)

i18n is the central architectural concern. The site uses **`next-intl` with URL-segment routing**, `localePrefix: 'as-needed'` — FI (default) stays at `/`, `/menu`, etc., and EN gets `/en/`, `/en/menu`, etc. No cookie. Locale comes from the URL.

- `src/i18n/routing.ts` defines `locales`, `defaultLocale`, and `localePrefix`. Import the `Locale` type from here.
- `src/i18n/navigation.ts` exports the locale-aware `Link`, `useRouter`, `usePathname`, `redirect`. **Always import these from `@/i18n/navigation`, never `next/link` / `next/navigation`**, otherwise locale prefixing breaks.
- `src/proxy.ts` (Next 16 file convention — replaces `middleware.ts`) runs `createMiddleware(routing)` and handles locale detection/rewriting.
- `src/i18n/request.ts` reads `requestLocale` (set by the proxy) and loads `messages/{locale}.json`.
- `src/i18n/metadata.ts` exports `localeAlternates(path, currentLocale)` to build `canonical` + `languages` (fi/en/x-default) hreflang for `generateMetadata`.

When adding user-facing strings, add keys to both `messages/en.json` and `messages/fi.json`. The `Metadata` namespace holds per-page SEO copy (title, description, keywords).

### Page structure pattern

Each route lives under `src/app/[locale]/<route>/`:
- `page.tsx` is a server component. Use `generateMetadata` (not the static `metadata` export) so per-page SEO copy can be localized via `getTranslations({ locale, namespace: 'Metadata.X' })`. Call `setRequestLocale(locale)` in the page function so server-rendered client components have the right locale.
- `*PageClient.tsx` is a client component that uses translations and interactive hooks.

The root layout (`src/app/[locale]/layout.tsx`) validates the locale via `hasLocale(routing.locales, locale)` and `notFound()`s on invalid values, calls `setRequestLocale`, and exposes a single locale-aware `generateMetadata` block. `globals.css`, `robots.ts`, and `sitemap.ts` stay at `src/app/` root.

The sitemap emits both `/...` and `/en/...` URLs with `alternates.languages`.

### Fonts

Use the `geist` npm package (`GeistSans`, `GeistMono` from `geist/font/sans` and `geist/font/mono`), not `next/font/google`. The npm package ships the woff2 files locally so builds don't depend on fetching `fonts.googleapis.com` — important for CI reliability.

The root `layout.tsx` injects a `Restaurant` JSON-LD blob with address, hours, and contact info — keep it in sync with real business data. `sitemap.ts` and `robots.ts` live alongside the app routes.

### Components & styling

- `src/components/ui/*` are shadcn-generated primitives — regenerate via shadcn CLI rather than hand-editing where possible.
- Feature components (`NavigationBar`, `Footer`, `GalleryPreviewSection`, `HomePageClient`, `LanguageSelector`) live in `src/components/`.
- Path alias: `@/*` → `src/*`. Utility helper `cn()` in `src/lib/utils.ts`.
- Tailwind v4 (CSS-based config) — theme lives in `src/app/globals.css`, not a `tailwind.config`.

### Security headers

`next.config.ts` sets `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` for all routes. Add new headers there rather than per-route.
