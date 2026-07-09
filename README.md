# Developer Portfolio + Admin CMS

A single-page developer portfolio built with **React**, **TypeScript**, and **Tailwind CSS**, backed by **Supabase (Postgres)** — with a password-protected `/admin` panel to edit every section: profile, about, tech stack, projects, experience, certifications, gallery, and links. No redeploy needed to update content.

Runs perfectly fine with placeholder content out of the box, even before Supabase is connected — connect it whenever you're ready for live editing.

## 1. Run it locally (placeholder content)

```bash
npm install
npm run dev
```

Open the printed local URL. At this point content comes from `src/data/portfolioData.ts` and `/admin` will tell you Supabase isn't connected yet.

## 2. Connect Supabase

1. Create a free project at [supabase.com](https://supabase.com).
2. In your project, open the **SQL Editor**, paste in the contents of `supabase/schema.sql`, and run it. This creates all the tables, row-level security policies, a storage bucket for photos, and some starter seed data.
3. Go to **Project Settings → API** and copy your **Project URL** and **anon public key**.
4. Copy `.env.example` to `.env` and fill in those two values:

   ```bash
   cp .env.example .env
   ```

   ```
   VITE_SUPABASE_URL=https://your-project-ref.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-public-key
   ```

5. Restart `npm run dev`. The public site now reads from Supabase, and falls back to the local placeholder data automatically if anything's missing (e.g. an empty table).

## 3. Create your admin login

The admin panel uses Supabase Auth (email + password) — there's no separate account system to manage.

1. In your Supabase project, go to **Authentication → Users → Add user**.
2. Create yourself a user with your email and a password.
3. Go to `/admin` on your site and sign in with those credentials.

Only signed-in users can write to the database (enforced by the row-level security policies in the schema) — the public site remains fully readable by anyone, signed in or not.

## 4. Edit your content

Once signed in, `/admin` has a section for each part of the page:

| Section | Edits |
|---|---|
| Profile | Name, title, location, email, photo, degree banner |
| About | The paragraphs in your About card |
| Tech Stack | Categories and the tags inside them |
| Projects | Title, description, link, "read the story" flag |
| Experience | Timeline entries in the sidebar |
| Certifications | Title, issuer, verification link |
| Gallery | Photo uploads (stored in Supabase Storage) |
| Links | Social links and "a member of" organizations |

Changes save immediately to Postgres and appear on the public site (it also polls every 60 seconds in case you have it open in another tab while editing).

## Project structure

```
src/
  admin/            The /admin panel: layout, auth, and one editor per section
  components/       Public-site UI building blocks
  data/
    portfolioData.ts   Placeholder/fallback content (used before Supabase is connected)
  hooks/
    usePortfolioData.ts   Loads content from Supabase, falls back to placeholder data
    useDarkMode.ts
  lib/
    supabaseClient.ts   Supabase client (no-op if env vars are missing)
    db.ts               CRUD functions for every table
    dbTypes.ts           Row types matching the schema
    auth.ts              Sign in / out / session helpers
  pages/
    PublicSite.tsx      The portfolio page itself
  types.ts             Shared TypeScript types for the public site
  App.tsx              Routes "/" and "/admin/*"
supabase/
  schema.sql          Run once in the Supabase SQL editor
```

### Colors, fonts, dark mode

The color palette and fonts are design tokens in `src/index.css` under `@theme`. Dark mode toggles a `dark` class on `<html>` via `src/hooks/useDarkMode.ts` and is remembered in `localStorage`.

## Deploying

This is a standard Vite app — it deploys to any static host. Because `/admin` is a client-side route, make sure your host rewrites all paths to `index.html` (already configured for you):

- **Vercel**: `vercel deploy` — `vercel.json` is included with the rewrite rule. Add your two `VITE_SUPABASE_*` variables in the project's Environment Variables settings.
- **Netlify**: connect the repo or drag-and-drop the `dist/` folder after `npm run build` — `public/_redirects` is included. Add the env vars in Site settings → Environment variables.

Either way, remember: the env vars are read at **build time**, so set them in your host's dashboard before deploying, not just in your local `.env`.
