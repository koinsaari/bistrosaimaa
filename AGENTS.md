# AGENTS.md

Marketing website for Bistro Saimaa, a restaurant in Ristiina, Mikkeli. Built with Next.js App Router (React 19, Next 16), TypeScript, Tailwind v4, and shadcn/ui (new-york style, stone base, lucide icons). Deployed to Vercel.

## Commands

- `npm run dev` — Next dev server with Turbopack on `http://localhost:3000`
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `npm run test` — Vitest unit tests (`src/**/*.test.ts`)
- `npm run test:e2e` — Playwright tests. `playwright.config.ts` auto-starts a dev server (`npm start` in CI, `npm run dev` locally; reuses an already-running server in local mode).
- `npm run test:e2e:ui` / `:headed` — Playwright UI / headed modes
- Run a single spec: `npx playwright test e2e/menu.spec.ts`
- Run a single project: `npx playwright test --project=desktop` (or `mobile`)

Playwright has two projects: `desktop` (Chrome) ignores `navigation-mobile.spec.ts`; `mobile` (Pixel 5) ignores `navigation.spec.ts`. Keep this split in mind when adding navigation tests.

## UI components & styling

Prefer shadcn/ui components from `src/components/ui/*` over raw HTML form elements — `Button`, `Input`, `Label`, `Select`, `Checkbox`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Separator`, `Textarea`, `Badge` all exist there already. Run the shadcn CLI to add missing ones rather than hand-rolling a styled `<button>`/`<input>`; hand-editing generated files only for project-specific tweaks. `Label` pairs with an input via `htmlFor`/`id`, not by wrapping it.

Tailwind v4 is CSS-based config — the theme lives in `src/app/globals.css`, not a `tailwind.config`. Use the `cn()` helper from `src/lib/utils.ts` to merge conditional/override classes; don't concatenate class strings by hand.

## Internationalization (Finnish / English)

i18n is the central architectural concern. The site uses **`next-intl` with URL-segment routing**, `localePrefix: 'as-needed'` — FI (default) stays at `/`, `/menu`, etc., and EN gets `/en/`, `/en/menu`, etc. No cookie. Locale comes from the URL.

- `src/i18n/routing.ts` defines `locales`, `defaultLocale`, and `localePrefix`. Import the `Locale` type from here.
- `src/i18n/navigation.ts` exports the locale-aware `Link`, `useRouter`, `usePathname`, `redirect`. **Always import these from `@/i18n/navigation`, never `next/link` / `next/navigation`**, otherwise locale prefixing breaks.
- `src/proxy.ts` (Next 16 file convention — replaces `middleware.ts`) runs `createMiddleware(routing)` and handles locale detection/rewriting. Its matcher excludes `/admin` (see below) alongside `api`/`_next`/`_vercel`/static files.
- `src/i18n/request.ts` reads `requestLocale` (set by the proxy) and loads `messages/{locale}.json`.
- `src/i18n/metadata.ts` exports `localeAlternates(path, currentLocale)` to build `canonical` + `languages` (fi/en/x-default) hreflang for `generateMetadata`.

When adding user-facing strings, add keys to both `messages/en.json` and `messages/fi.json` — unless a string is genuinely FI-only content with a separate static EN fallback message (e.g. the lunch menu: staff type Finnish only, EN always shows one fallback sentence instead of translated items). Don't add per-item EN keys that nothing will ever render. The `Metadata` namespace holds per-page SEO copy (title, description, keywords).

## Page structure pattern

Each localized route lives under `src/app/[locale]/<route>/`:
- `page.tsx` is a server component. Use `generateMetadata` (not the static `metadata` export) so per-page SEO copy can be localized via `getTranslations({ locale, namespace: 'Metadata.X' })`. Call `setRequestLocale(locale)` in the page function so server-rendered client components have the right locale.
- `*PageClient.tsx` is a client component that uses translations and interactive hooks.

The root layout (`src/app/[locale]/layout.tsx`) validates the locale via `hasLocale(routing.locales, locale)` and `notFound()`s on invalid values, calls `setRequestLocale`, and exposes a single locale-aware `generateMetadata` block. `globals.css`, `robots.ts`, and `sitemap.ts` stay at `src/app/` root.

The sitemap emits both `/...` and `/en/...` URLs with `alternates.languages`.

**Exception**: `src/app/admin/*` sits outside `[locale]` — unlocalized on purpose (single shared admin password, no bilingual authoring). It has its own root `layout.tsx` with `<html>`/`<body>`, disallowed in `robots.ts`, and excluded from `proxy.ts`'s middleware matcher. If you add another route that shouldn't be locale-prefixed, follow this pattern rather than nesting it under `[locale]`.

## Fonts

Use the `geist` npm package (`GeistSans`, `GeistMono` from `geist/font/sans` and `geist/font/mono`), not `next/font/google`. The npm package ships the woff2 files locally so builds don't depend on fetching `fonts.googleapis.com` — important for CI reliability.

The root `layout.tsx` injects a `Restaurant` JSON-LD blob with address, hours, and contact info — keep it in sync with real business data. `sitemap.ts` and `robots.ts` live alongside the app routes.

## Components

- `src/components/ui/*` are shadcn-generated primitives — regenerate via shadcn CLI rather than hand-editing where possible.
- Feature components (`NavigationBar`, `Footer`, `GalleryPreviewSection`, `HomePageClient`, `LanguageSelector`) live in `src/components/`.
- Path alias: `@/*` → `src/*`.

## Security headers

`next.config.ts` sets `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` for all routes. Add new headers there rather than per-route.

## Testing

Vitest covers pure logic and testable seams (`src/lib/*.test.ts`) — password/session crypto in `lib/auth.ts`, lunch-menu display/fallback logic in `lib/lunch.ts`. Mock external SDKs (`@vercel/edge-config`) at the module boundary with `vi.mock`, not by mocking internal collaborators. Thin adapters that just forward to an external API (`lib/lunch-write.ts`) don't need unit tests of their own — cover the logic around them instead.

Playwright (`e2e/`) covers user-facing flows end to end.

## Deployment

Production deploys are not driven by Vercel's git integration (`vercel.json` has `git.deploymentEnabled: false`). All deploys go through GitHub Actions in `.github/workflows/`:

- **`preview.yml`** runs on PR open/sync. Builds, deploys a preview, comments the URL on the PR (updates in place via the `<!-- preview-deploy-comment -->` marker).
- **`ci.yml`** runs lint/type-check and E2E tests on PR and push to `main`. Its `test` job does **not** run `vercel pull` — it's a plain `npm run build` + `npx playwright test` on the GitHub Actions runner, so app env vars (`ADMIN_PASSWORD`, `SESSION_SECRET`, `EDGE_CONFIG*`) are not available there unless added separately as GitHub Actions repo secrets. After a main push passes lint/type-check/E2E, the `deploy` job runs `vercel pull --environment=production` + `vercel build --prod` + `vercel deploy --prebuilt --prod` — no staging step, no release gate.

`main` is branch-protected: PR + passing `E2E Tests` check required, but admin can bypass for direct pushes. Vercel CLI is pinned to `vercel@54` in workflows (note: `vercel` CLI installed locally may be a newer major version); bump the pinned version deliberately when needed.

### Env vars & secrets

This is a **public repo** — anything that reaches a GitHub Actions log or an uploaded build artifact (e.g. a Playwright trace/report) on a `pull_request`-triggered run is effectively public, except secrets are withheld entirely from fork-originated PR runs.

- Never reuse a `production`-target secret value for `preview`/`development` — set each target separately (`vercel env add <NAME> <target>`), not one `vercel env add <NAME>` call selecting all three.
- `EDGE_CONFIG_WRITE_TOKEN` is a full Vercel personal access token (Hobby plan can't scope a token to one project/store), not an app-level secret — treat a leak of it as an account compromise, not just a "lunch menu got vandalized" incident.
- Edge Config is capped at 1 store per team on Hobby. Non-production writes are isolated by **key**, not by store: `LUNCH_MENU_KEY` (unset in production → defaults to `'lunchMenu'`; set to `'lunchMenu_dev'` for preview/development) picks which key `lib/lunch.ts`/`lib/lunch-write.ts` read/write. Follow this key-namespacing pattern for any future Edge Config data rather than requesting a second store.
