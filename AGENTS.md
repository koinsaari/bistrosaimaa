# AGENTS.md

Marketing website for Bistro Saimaa, a restaurant in Ristiina, Mikkeli. Built with Next.js App Router (React 19, Next 16), TypeScript, Tailwind v4, and shadcn/ui (new-york style, stone base, lucide icons). Deployed to Vercel.

## Commands

- `npm run dev` — Next dev server with Turbopack on `http://localhost:3000`
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `npm run test` — Vitest unit tests (`src/**/*.test.ts`)
- `npm run test:e2e` — Playwright tests. `playwright.config.ts` auto-starts its own server on port 3100 (`npm start` in CI, `npm run dev` locally), so it never reuses your `npm run dev` on :3000, and sets throwaway `ADMIN_PASSWORD`/`SESSION_SECRET` for that server (they override the shell and `.env.local`), so admin specs need no real credentials or GH secrets. Locally it loads `DATABASE_URL` from the gitignored `.env.e2e` (the Neon `ci` branch); DB-backed specs skip without it.
- `npm run db:generate` / `db:migrate` — create / apply Drizzle migrations (`drizzle/`, committed). Both read `.env.local` when `DATABASE_URL` is unset.
- `npm run db:seed` — idempotent starter catalog. `npm run db:seed:e2e` — **truncates every table** and loads the E2E fixture; refuses to run unless `CI=true` or `ALLOW_DB_TRUNCATE=1`.
- `npm run test:e2e:ui` / `:headed` — Playwright UI / headed modes
- Run a single spec: `npx playwright test e2e/menu.spec.ts`
- Run a single project: `npx playwright test --project=desktop` (or `mobile`)

Playwright has two parallel projects: `desktop` (Chrome) ignores `navigation-mobile.spec.ts`; `mobile` (Pixel 5) ignores `navigation.spec.ts`. Keep this split in mind when adding navigation tests. Two more projects run alone after both, because their specs change global state: `admin-public` (`admin-lunch-public.spec.ts`, edits the shared current week the public specs read) and `admin-session` (`admin-session.spec.ts`, logout ends every admin session). A new spec that logs out or edits the fixture weeks belongs in one of them and must put state back; everything else stays in `desktop`/`mobile`. To run one of those locally use `--no-deps` (file filters still run dependency projects).

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

When adding user-facing strings, add keys to both `messages/en.json` and `messages/fi.json`. Content typed by staff is the exception: lunch dish names and notes are Finnish only and render as-is on EN pages too, under translated headings. The `Metadata` namespace holds per-page SEO copy (title, description, keywords).

## Page structure pattern

Each localized route lives under `src/app/[locale]/<route>/`:
- `page.tsx` is a server component. Use `generateMetadata` (not the static `metadata` export) so per-page SEO copy can be localized via `getTranslations({ locale, namespace: 'Metadata.X' })`. Call `setRequestLocale(locale)` in the page function so server-rendered client components have the right locale.
- `*PageClient.tsx` is a client component that uses translations and interactive hooks.

The root layout (`src/app/[locale]/layout.tsx`) validates the locale via `hasLocale(routing.locales, locale)` and `notFound()`s on invalid values, calls `setRequestLocale`, and exposes a single locale-aware `generateMetadata` block. `globals.css`, `robots.ts`, and `sitemap.ts` stay at `src/app/` root.

The sitemap emits both `/...` and `/en/...` URLs with `alternates.languages`.

**Exception**: `src/app/admin/*` sits outside `[locale]` — unlocalized on purpose (single shared admin password, no bilingual authoring). It has its own root `layout.tsx` with `<html>`/`<body>`, disallowed in `robots.ts`, and excluded from `proxy.ts`'s middleware matcher. If you add another route that shouldn't be locale-prefixed, follow this pattern rather than nesting it under `[locale]`.

## Admin (`/admin`)

Two pages behind one shared password: `/admin/lunch` (week composer: pick an ISO week, ordered dishes per day, a note per day, **Tallenna**, **Julkaise/Piilota**) and `/admin/dishes` ("Ruoat": dish table with search/filters, create/edit dialog, **Kopioi**, retire/restore, plus the category list). There is no separate categories page. Admin copy is Finnish only.

- **Call `requireAdmin()` first in every admin page and server action.** Layouts don't guard (they don't re-run on client navigations and server actions don't pass through them), and server actions are public HTTP endpoints.
- **Layers:** `src/lib/<thing>.ts` (Zod parse + DB functions, input typed `unknown`: it comes from `FormData`) → server actions in the route folder (return `{ ok: false, error }` for `useActionState`) → thin client component. See `lib/categories.ts`, `lib/dishes.ts`, `lib/lunchWeek.ts`.
- **Forms with Radix `Select`/dialogs submit via `onSubmit` + `startTransition`, not `action={...}`:** React 19 resets the form after an action and Radix `Select` restores its mount value on reset, dropping what the user picked.
- **Sessions:** the cookie token carries a version compared with `admin_state.session_version` (missing row = version 1). Logout bumps it, so one logout ends **every** session; there is only one shared login. Deploying code that changes the token shape logs the admin out once.
- **Login protection is layered:** a DB throttle (5 failed attempts / 5 min per HMAC-hashed client IP, `lib/loginThrottle.ts`) plus a Vercel WAF rule that lives in the Vercel project settings, **not in git**: "Admin login rate limit", `POST /admin/login`, 20 req/60 s per IP, action `rate_limit`. Recreate it if the project is moved. `vercel firewall rules edit --rate-limit-action` is ignored; remove and re-add instead.
- **Dishes:** unique name is case-insensitive (`dishes_name_lower_idx`); category names are case-sensitively unique. Retire with `is_active`, never delete. The composer's picker only offers active dishes, but a week that already uses a since-retired dish keeps rendering it. Deleting a category leaves its dishes uncategorized.
- **Weeks:** `saveWeek` replaces a week's days and dishes in one `db.batch` and sets `updated_at` explicitly (`$onUpdate` doesn't fire for child-only changes), which drives the public "Päivitetty" date. Publish only flips the saved week. A published week with no content on any day shows the fallback sentence. ISO-week maths uses `luxon` (`lib/isoWeek.ts`); don't hand-roll it.

## Database

Lunch data lives in **Neon Postgres** (Vercel Marketplace) via **Drizzle ORM**. Tables in `src/db/schema.ts`: `categories`, `dishes`, `lunch_weeks`, `lunch_days`, `lunch_dishes`. A week references dishes by id, so fixing a dish name fixes every week. Dishes in use can't be deleted (`on delete restrict`); retire them with `is_active`.

- `src/db/index.ts` exports a lazy `getDb()` — keep it lazy (so `next build` works without `DATABASE_URL`) and never wrap it in a `Proxy`.
- The `neon-http` driver has no interactive transactions; use `db.batch([...])` for atomic multi-statement writes.
- `src/lib/lunch.ts` reads the current ISO week in `Europe/Helsinki` (`src/lib/isoWeek.ts`), published weeks only. Any error, no published week, or a week with nothing on any day logs/falls back to the static `lunchFallback` sentence. `LunchThisWeek` renders per request (`connection()`) behind a `Suspense` boundary.
- Schema change: edit `schema.ts`, `npm run db:generate`, commit the SQL. Migrations must stay compatible with the code that's still live until the deploy finishes.

Three Neon branches: **production** (real data), **dev** (local `npm run dev` + preview deployments), **ci** (E2E fixture, truncated every run). Never point E2E or `db:seed:e2e` at dev or production.

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

Vitest covers pure logic and testable seams (`src/lib/*.test.ts`) — password/session crypto in `lib/auth.ts`, ISO weeks in `lib/isoWeek.ts`, lunch-menu display/fallback logic in `lib/lunch.ts`. Mock external boundaries (`@/db`) at the module boundary with `vi.mock`, not by mocking internal collaborators. Thin adapters that just forward to an external API don't need unit tests of their own — cover the logic around them instead.

Admin specs: `test.skip(!process.env.DATABASE_URL, 'no DB')`, a random `x-forwarded-for` per test (own throttle bucket), sign in with `AdminLoginPage.loginAsAdmin()`, unique data names (the composer specs use a random far-future ISO week so the fixture weeks stay untouched).

Playwright (`e2e/`) covers user-facing flows end to end, using page objects in `e2e/pages/` with `data-testid` locators. DB-backed specs read their expected data from `e2e/fixtures/lunch.ts`, the same fixture `db:seed:e2e` writes.

## Deployment

Production deploys are not driven by Vercel's git integration (`vercel.json` has `git.deploymentEnabled: { "main": false }`), so they wait for CI. Every other branch gets a native Vercel preview deployment; Vercel's bot comments the URL on the PR.

- **`ci.yml`** runs lint, type-check and Vitest, then E2E, on PR and push to `main`. Its `test` job does **not** run `vercel pull` — it's a plain `npm run build` + `npx playwright test` on the GitHub Actions runner, against the Neon `ci` branch (`DATABASE_URL_CI`), migrated and reseeded first. Other app env vars aren't available there; `ADMIN_PASSWORD`/`SESSION_SECRET` are supplied by `playwright.config.ts`, so no repo secrets are needed for them. The job is in a `ci-db` concurrency group so runs don't clobber each other's fixture. After a main push passes, the `deploy` job runs `vercel pull --environment=production` + `vercel build --prod`, migrates production (`DATABASE_URL_PRODUCTION`), then `vercel deploy --prebuilt --prod` — no staging step, no release gate.
- **Previews** build with `npm run vercel-build` (`vercel.json` `buildCommand`), which runs `db:migrate` against the dev branch first when `VERCEL_ENV=preview`.

`main` is protected by a ruleset: PR + passing `Lint & Type Check` and `E2E Tests` required, but admin can bypass for direct pushes. Vercel CLI is pinned to `vercel@54` in workflows (note: `vercel` CLI installed locally may be a newer major version); bump the pinned version deliberately when needed.

### Env vars & secrets

This is a **public repo** — anything that reaches a GitHub Actions log or an uploaded build artifact (e.g. a Playwright trace/report) on a `pull_request`-triggered run is effectively public, except secrets are withheld entirely from fork-originated PR runs.

- Never reuse a `production`-target secret value for `preview`/`development` — set each target separately (`vercel env add <NAME> <target>`), not one `vercel env add <NAME>` call selecting all three.
- `DATABASE_URL` is a Vercel **Secret** in production and preview, so `vercel pull` doesn't fetch it — that's why the deploy job uses the `DATABASE_URL_PRODUCTION` GH secret, and why previews migrate inside the Vercel build. Development is a plain value so `vercel env pull` writes the dev branch URL to `.env.local`.
- GH Actions secrets: `DATABASE_URL_CI` (Neon ci branch), `DATABASE_URL_PRODUCTION` (deploy-job migrations only). Never reuse production values in CI.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
