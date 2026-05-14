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

i18n is the central architectural concern. The site uses **`next-intl` without a locale URL segment** — locale is stored in the `NEXT_LOCALE` cookie, defaulting to `fi`.

- `src/i18n/request.ts` reads the cookie server-side and loads `messages/{locale}.json`.
- `next.config.ts` wires next-intl via `createNextIntlPlugin()`.
- `src/app/layout.tsx` resolves locale on the server, sets `<html lang>`, and wraps the tree in `NextIntlClientProvider` + `LanguageProvider`.
- `src/context/LanguageContext.tsx` (client) is the switcher: writes the cookie and calls `router.refresh()` inside a `startTransition` so server components re-render with the new messages. Use `useLanguage()` from this context — not next-intl's locale directly — when toggling languages in the UI.

When adding user-facing strings, add keys to both `messages/en.json` and `messages/fi.json`.

### Page structure pattern

Each route under `src/app/<route>/` follows: `page.tsx` (server component, exports route `metadata`) → renders a `*PageClient.tsx` (client component) that uses translations and interactive hooks. Follow this split when adding pages so per-page SEO metadata stays server-rendered.

The root `layout.tsx` injects a `Restaurant` JSON-LD blob with address, hours, and contact info — keep it in sync with real business data. `sitemap.ts` and `robots.ts` live alongside the app routes.

### Components & styling

- `src/components/ui/*` are shadcn-generated primitives — regenerate via shadcn CLI rather than hand-editing where possible.
- Feature components (`NavigationBar`, `Footer`, `GalleryPreviewSection`, `HomePageClient`, `LanguageSelector`) live in `src/components/`.
- Path alias: `@/*` → `src/*`. Utility helper `cn()` in `src/lib/utils.ts`.
- Tailwind v4 (CSS-based config) — theme lives in `src/app/globals.css`, not a `tailwind.config`.

### Security headers

`next.config.ts` sets `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` for all routes. Add new headers there rather than per-route.
