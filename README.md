# Bistro Saimaa

Slightly overengineered restaurant site for [Bistro Saimaa](https://bistrosaimaa.fi) in Ristiina, Mikkeli.

## Running the admin locally

1. Install and set up env vars. `.env.local` needs:

   ```
   DATABASE_URL=...      # any Postgres database (Neon works), use a throwaway one
   ADMIN_PASSWORD=...    # any password you like locally
   SESSION_SECRET=...    # any long random string, e.g. `openssl rand -hex 32`
   ```

2. Prepare the database (first time only):

   ```bash
   npm install
   npm run db:migrate
   npm run db:seed      # starter dishes and categories
   ```

3. Start the dev server and open <http://localhost:3000/admin>:

   ```bash
   npm run dev
   ```

   Sign in with `ADMIN_PASSWORD`.

### Weekly lunch menu (`/admin/lunch`)

1. Pick the week at the top.
2. Tap a day to open its editor. Add dishes from the list, reorder with ▲ ▼, remove with ✕, and add an optional note (for example allergens). Tap **Valmis** to close.
3. Press **Tallenna**. Nothing is stored until you do.
4. Press **Julkaise** to show the week on the public site. **Piilota** hides it again. A week must be saved before it can be published, and edits must be saved before publishing.

The public site shows the current week (Europe/Helsinki) only when it is published and has at least one dish. Otherwise visitors see a fallback sentence.

### Dishes (`/admin/dishes`)

Create, edit and copy dishes, and manage categories. Fixing a dish name fixes it in every week that uses it. Dishes are retired, not deleted: a retired dish can't be added to new days but stays in weeks that already use it.

## Commands

```bash
npm run dev           # dev server
npm run lint
npm run test          # unit tests
npm run test:e2e      # Playwright; needs a throwaway database in .env.e2e, it truncates every table
```
