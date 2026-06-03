# Review instructions

## What Important means here

Reserve 🔴 Important for findings that would break behavior, cause a runtime error, expose
a security issue, or violate a core architectural invariant: broken i18n routing, missing
translation keys, XSS via dangerouslySetInnerHTML, importing from next/link or
next/navigation instead of the locale-aware wrappers, hardcoded user-facing strings, or
inaccurate structured data. Style and minor naming suggestions are 🟡 Nit at most.

## Core invariants — always check, always Important

- **Locale-aware navigation only.** `Link`, `useRouter`, `usePathname`, and `redirect`
  must always be imported from `@/i18n/navigation`, never from `next/link` or
  `next/navigation`. Flag any violation as 🔴 Important.
- **Both translation files must stay in sync.** Every key added or removed in
  `messages/en.json` must have a matching change in `messages/fi.json` and vice versa.
  Flag missing or extra keys as 🔴 Important.
- **No hardcoded user-facing strings.** Text rendered to the UI must come from translation
  keys via `useTranslations` or `getTranslations`. Flag hardcoded English or Finnish
  strings in components as 🔴 Important.
- **Server components use `setRequestLocale`.** Every page and layout that calls
  `setRequestLocale` must do so before any async work. Flag missing calls as 🔴 Important.
- **`generateMetadata` for localized SEO.** Pages must export `generateMetadata` (not the
  static `metadata` object) so titles and descriptions can be translated. Flag use of the
  static export as 🔴 Important.

## Cap the nits

Report at most five 🟡 Nits per review. If you found more, say "plus N similar items" in
the summary. If all findings are nits, lead the summary with "No blocking issues."

## Do not report

- Formatting or lint issues — ESLint and CI handle these
- Missing tests for trivial presentational changes
- Suggestions to add comments to self-explanatory code
- Hypothetical future concerns without concrete evidence in the diff

## Always check

- Imports of `Link`, `useRouter`, `usePathname`, `redirect` use `@/i18n/navigation`
- New translation keys exist in both `messages/en.json` and `messages/fi.json`
- New pages export `generateMetadata` and call `setRequestLocale`
- New pages include `localeAlternates` in their metadata for hreflang
- `dangerouslySetInnerHTML` is only used for JSON-LD script tags, never for user content
- New security headers go in `next.config.ts`, not per-route
- JSON-LD changes keep structured data accurate and consistent with real business data
