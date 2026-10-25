# AGENTS.md

Marketing website for Bistro Saimaa, a restaurant in Ristiina, Mikkeli. Built with Next.js App Router (React 19, Next 16), TypeScript, Tailwind v4, and shadcn/ui (new-york style, stone base, lucide icons). Deployed to Vercel.

## Commands

- `npm run dev` — Next dev server with Turbopack on `http://localhost:3000`
- `npm run build` / `npm start` — production build / serve
- `npm run lint` — ESLint (`next/core-web-vitals` + `next/typescript`)
- `npm run test` — Vitest unit tests (`src/**/*.test.ts`)
- `npm run test:e2e` — Playwright tests. `playwright.config.ts` auto-starts its own server on port 3100 (`npm start` in CI, `npm run dev` locally), so it never reuses your `npm run dev` on :3000. Locally it loads `DATABASE_URL` from the gitignored `.env.e2e` (the Neon `ci` branch); DB-backed specs skip without it.
- `npm run db:generate` / `db:migrate` — create / apply Drizzle migrations (`drizzle/`, committed). Both read `.env.local` when `DATABASE_URL` is unset.
- `npm run db:seed:e2e` — **truncates every table** and loads the E2E fixture; refuses to run unless `CI=true` or `ALLOW_DB_TRUNCATE=1`.
- `npm run test:e2e:ui` / `:headed` — Playwright UI / headed modes
- Run a single spec: `npx playwright test e2e/menu.spec.ts`
- Run a single project: `npx playwright test --project=desktop` (or `mobile`)

Playwright has two parallel projects: `desktop` (Chrome) ignores `navigation-mobile.spec.ts`; `mobile` (Pixel 5) ignores `navigation.spec.ts`. Keep this split in mind when adding navigation tests. A third project, `bot` (`**/bot*.spec.ts`), runs alone after both because the bot specs edit the shown lunch week that the public specs read; each spec puts the fixture week back (`TelegramBot.restoreFixtureWeek()`). `desktop`/`mobile` ignore `bot*.spec.ts`.

## UI components & styling

Prefer shadcn/ui components from `src/components/ui/*` over raw HTML form elements — `Button`, `Input`, `Label`, `Select`, `Checkbox`, `Card`, `Dialog`, `Sheet`, `Tabs`, `Separator`, `Textarea`, `Badge` all exist there already. Run the shadcn CLI to add missing ones rather than hand-rolling a styled `<button>`/`<input>`; hand-editing generated files only for project-specific tweaks. `Label` pairs with an input via `htmlFor`/`id`, not by wrapping it.

Tailwind v4 is CSS-based config — the theme lives in `src/app/globals.css`, not a `tailwind.config`. Use the `cn()` helper from `src/lib/utils.ts` to merge conditional/override classes; don't concatenate class strings by hand.

## Internationalization (Finnish / English)

i18n is the central architectural concern. The site uses **`next-intl` with URL-segment routing**, `localePrefix: 'as-needed'` — FI (default) stays at `/`, `/menu`, etc., and EN gets `/en/`, `/en/menu`, etc. No cookie. Locale comes from the URL.

- `src/i18n/routing.ts` defines `locales`, `defaultLocale`, and `localePrefix`. Import the `Locale` type from here.
- `src/i18n/navigation.ts` exports the locale-aware `Link`, `useRouter`, `usePathname`, `redirect`. **Always import these from `@/i18n/navigation`, never `next/link` / `next/navigation`**, otherwise locale prefixing breaks.
- `src/proxy.ts` (Next 16 file convention — replaces `middleware.ts`) runs `createMiddleware(routing)` and handles locale detection/rewriting. Its matcher excludes `api`/`_next`/`_vercel`/static files.
- `src/i18n/request.ts` reads `requestLocale` (set by the proxy) and loads `messages/{locale}.json`.
- `src/i18n/metadata.ts` exports `localeAlternates(path, currentLocale)` to build `canonical` + `languages` (fi/en/x-default) hreflang for `generateMetadata`.

When adding user-facing strings, add keys to both `messages/en.json` and `messages/fi.json`. Content typed by staff is the exception: lunch dish names and notes are Finnish only and render as-is on EN pages too, under translated headings. The `Metadata` namespace holds per-page SEO copy (title, description, keywords).

## Page structure pattern

Each localized route lives under `src/app/[locale]/<route>/`:
- `page.tsx` is a server component. Use `generateMetadata` (not the static `metadata` export) so per-page SEO copy can be localized via `getTranslations({ locale, namespace: 'Metadata.X' })`. Call `setRequestLocale(locale)` in the page function so server-rendered client components have the right locale.
- `*PageClient.tsx` is a client component that uses translations and interactive hooks.

The root layout (`src/app/[locale]/layout.tsx`) validates the locale via `hasLocale(routing.locales, locale)` and `notFound()`s on invalid values, calls `setRequestLocale`, and exposes a single locale-aware `generateMetadata` block. `globals.css`, `robots.ts`, and `sitemap.ts` stay at `src/app/` root.

The sitemap emits both `/...` and `/en/...` URLs with `alternates.languages`.

## Contact form (`/contact`)

`ContactForm.tsx` validates with the shared Zod schema in `src/lib/contact.ts` (messages are keys under `ContactPage.validation`, translated in the form's resolver), then calls the `sendContactMessage` server action (`contact/actions.ts`), which validates again and sends through `src/lib/mailer.ts` (Resend). Subjects are the enum `general | eventRoom | catering`; the staff email is plain text and always Finnish. No database, no stored messages.

- **Mail:** from `noreply@bistrosaimaa.fi` (domain verified in Resend, DNS at Zoner) to `CONTACT_TO_EMAIL`, `replyTo` = the customer. `CONTACT_MAIL_TRANSPORT=log` sends nothing (development, and `playwright.config.ts` sets it for E2E). Otherwise a missing `RESEND_API_KEY`/`CONTACT_TO_EMAIL` throws and the user sees the error banner. Never log message content.
- **Spam:** only a honeypot (`HONEYPOT_FIELD`, deliberately not autofill-like); a hit returns fake success. There is no rate limit yet.
- **Business details** (phone, email, address, maps link) come from `src/lib/business.ts`; don't hard-code them in components or messages (pass them as ICU parameters).

## Database

Lunch data lives in **Neon Postgres** (Vercel Marketplace) via **Drizzle ORM**. One table in `src/db/schema.ts`, `lunch_weeks`: one row per ISO week (primary key `iso_year, iso_week`) with `published`, `days` (jsonb, `Partial<Record<DayKey, { dishes: { name, allergens[] }[]; note }>>`), `prices` (jsonb `{ weekdayCents, weekendCents }` or null) and `updated_at`. There is no dish catalogue: dishes are inline, so a name fix means saving the week again.

- `src/lib/lunchWeek.ts` is the only write/read API for weeks: `weekDocumentSchema`/`parseWeekDocument` (input `unknown`; trims, orders allergens as `ALLERGENS`, drops empty days), `getWeek`, `saveWeek` (upsert of the whole document; sets `updated_at = now()`, which drives the public "Päivitetty" date; leaves `published` alone unless `opts.published` is given; copies the latest earlier week's prices when none are given), `setWeekPublished`, `isPastWeek`. ISO-week maths uses `luxon` (`lib/isoWeek.ts`); don't hand-roll it.
- Prices live on the week, in cents. The public hours note shows them when the shown week is available and has prices, otherwise only the hours (`lunchHoursNote`). Opening hours stay in `BUSINESS.lunch`.

- `src/db/index.ts` exports a lazy `getDb()` — keep it lazy (so `next build` works without `DATABASE_URL`) and never wrap it in a `Proxy`.
- The `neon-http` driver has no interactive transactions; use `db.batch([...])` for atomic multi-statement writes.
- `src/lib/lunch.ts` reads the current ISO week in `Europe/Helsinki` (`src/lib/isoWeek.ts`), published weeks only. Any error, no published week, or a week with nothing on any day logs/falls back to the static `lunchFallback` sentence. `LunchThisWeek` renders per request (`connection()`) behind a `Suspense` boundary.
- Schema change: edit `schema.ts`, `npm run db:generate`, commit the SQL. Migrations must stay compatible with the code that's still live until the deploy finishes.

Three Neon branches: **production** (real data), **dev** (local `npm run dev` + preview deployments), **ci** (E2E fixture, truncated every run). Never point E2E or `db:seed:e2e` at dev or production.

## Telegram bot (`/api/telegram`)

Staff edit the lunch week by chatting with a Telegram bot in Finnish: free-text edits, plus import of the weekly list from a photo or PDF. Production only: the route answers 404 when `TELEGRAM_BOT_TOKEN` is unset, so previews and local dev have no bot. Code is in `src/lib/bot/`, the route is `src/app/api/telegram/route.ts` (`src/proxy.ts` already skips `api`).

- **Webhook:** check `X-Telegram-Bot-Api-Secret-Token` against `TELEGRAM_WEBHOOK_SECRET` (constant time, 401), insert the update into `bot_updates` (`update_id` primary key; duplicate = 200 no-op; DB failure = 500 so Telegram retries), answer 200, then `after()` drains the chat. Every handled error still ends in 200.
- **Ordering:** `drainChat` takes a per-chat lock row (`bot_chat_locks`, one atomic upsert-with-condition, 5 min expiry), processes the chat's unprocessed updates in `update_id` order, marks each processed, releases, then looks again for updates that arrived meanwhile (lost wake-up).
- **Who:** `TELEGRAM_ALLOWED_USER_IDS` (comma-separated numeric ids, parsed strictly); everyone on it may do everything, anyone else is ignored silently.
- **Text path = agent:** `generateText` (AI SDK v7, max 8 steps) with `lunch_get_week`, `lunch_update_week`, `lunch_undo` over `lib/lunchWeek.ts`. Model `anthropic/claude-sonnet-5-5` through the Vercel AI Gateway (OIDC on Vercel, `AI_GATEWAY_API_KEY` locally). A new week made by text is published at once; an existing week keeps its flag unless `published` is given. Past weeks are refused (`checks.ts`).
- **Image import = fixed workflow, not an agent** (`importMenu.ts`): a photo (largest size) or a document (PDF/JPG/PNG, at most 20 MB, `attachment.ts`) gets "Luen listaa…" at once, then one `generateText` call with `Output.object` (the file goes in as a file part, PDFs too) returns `isLunchMenu`, `isoWeek`, `dateRange`, `prices | null`, `days`. Checks, all before anything is saved: schema (`checkDocument`), week number matches the date range and the range is Monday to Sunday (`checkWeekRange`, ISO year from the range), week not past. A passing week is saved **and published**, overwriting an existing week ("Vko 44 korvattu"); the reply lists every day, names price changes ("Hinta muuttui 13,20 → 13,50 € (ma–pe)") and has the Kumoa button. Not a lunch menu: says so, changes nothing. Dish names stay as printed (the prompt repairs Canva letter-spacing artefacts); with no printed prices the latest earlier week's are copied. Each album image is its own update.
- **Memory:** `bot_messages` keeps the user texts and final replies; the model sees the last 20 within 72 h, older rows are deleted on write. The DB week is read fresh every message.
- **Undo:** a `bot_changes` row (before/after) is written before every change. **Kumoa** (`undo:<changeId>`) and `lunch_undo` restore `before` only while that change is the latest non-undone change of its week.
- **Logs never contain message content** (`describeError` prints error names and status codes only). Keep it that way.
- **Dependencies:** the route reads the environment once (`botEnv()`) and `createBotDeps` (`deps.ts`) builds the Telegram client, both models and the allowlist; everything below takes them as a `deps` argument. Nothing below the route reads `process.env`. The database stays `getDb()`.
- **Test seams** (set only in `playwright.config.ts`, with `TELEGRAM_BOT_TOKEN=e2e-token`, `TELEGRAM_WEBHOOK_SECRET=e2e-secret`, `TELEGRAM_ALLOWED_USER_IDS=1001`): `BOT_MODEL=fixture` replaces the model with a scripted mock (`fixtureModel.ts`): the user message is JSON `{"calls":[{"tool":"lunch_update_week","input":{...}}],"reply":"Valmis"}`, emitted one tool call per step, then the reply; any other text gets the out-of-scope sentence. `TELEGRAM_TRANSPORT=log` logs the Telegram method name only and returns a stub. Image path: under `BOT_MODEL=fixture` the **caption** of the image message is the structured output as JSON (`TelegramBot.extraction(week)` builds one relative to now), and `downloadFile` reads `e2e/fixtures/menus/<file_id>` (`stub.png`). Specs post updates to the route and read replies from `bot_messages` (`e2e/pages/TelegramBot.ts`). The `bot` project has `workers: 1`: `bot.spec.ts` and `bot-import.spec.ts` both overwrite the shown week.

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

Prefer Playwright: use e2e whenever the real UI and DB can show the behaviour. Add Vitest only for pure logic or what e2e can't reach (DB failure paths and fallbacks). Don't unit-test DB queries through a fake query builder. Mock `@/db` at the module boundary with `vi.mock` when a boundary must be mocked.

Playwright (`e2e/`) covers user-facing flows end to end, using page objects in `e2e/pages/` with `data-testid` locators. DB-backed specs read their expected data from `e2e/fixtures/lunch.ts`, the same fixture `db:seed:e2e` writes.

## Deployment

Production deploys are not driven by Vercel's git integration (`vercel.json` has `git.deploymentEnabled: { "main": false }`), so they wait for CI. Every other branch gets a native Vercel preview deployment; Vercel's bot comments the URL on the PR.

- **`ci.yml`** runs lint, type-check and Vitest, then E2E, on PR and push to `main`. Its `test` job does **not** run `vercel pull` — it's a plain `npm run build` + `npx playwright test` on the GitHub Actions runner, against the Neon `ci` branch (`DATABASE_URL_CI`), migrated and reseeded first. Other app env vars aren't available there. The job is in a `ci-db` concurrency group so runs don't clobber each other's fixture. After a main push passes, the `deploy` job runs `vercel pull --environment=production` + `vercel build --prod`, migrates production (`DATABASE_URL_PRODUCTION`), then `vercel deploy --prebuilt --prod` — no staging step, no release gate.
- **Previews** build with `npm run vercel-build` (`vercel.json` `buildCommand`), which runs `db:migrate` against the dev branch first when `VERCEL_ENV=preview`.

`main` is protected by a ruleset: PR + passing `Lint & Type Check` and `E2E Tests` required, but admin can bypass for direct pushes. Vercel CLI is pinned to `vercel@54` in workflows (note: `vercel` CLI installed locally may be a newer major version); bump the pinned version deliberately when needed.

### Env vars & secrets

This is a **public repo** — anything that reaches a GitHub Actions log or an uploaded build artifact (e.g. a Playwright trace/report) on a `pull_request`-triggered run is effectively public, except secrets are withheld entirely from fork-originated PR runs.

- Never reuse a `production`-target secret value for `preview`/`development` — set each target separately (`vercel env add <NAME> <target>`), not one `vercel env add <NAME>` call selecting all three.
- `DATABASE_URL` is a Vercel **Secret** in production and preview, so `vercel pull` doesn't fetch it — that's why the deploy job uses the `DATABASE_URL_PRODUCTION` GH secret, and why previews migrate inside the Vercel build. Development is a plain value so `vercel env pull` writes the dev branch URL to `.env.local`.
- Contact mail: `RESEND_API_KEY` (Secret, a separate sending-only key per target), `CONTACT_TO_EMAIL` (production `bistrosaimaa@gmail.com`, preview a developer inbox), `CONTACT_MAIL_TRANSPORT=log` in development. CI needs none of them.
- GH Actions secrets: `DATABASE_URL_CI` (Neon ci branch), `DATABASE_URL_PRODUCTION` (deploy-job migrations only). Never reuse production values in CI.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
