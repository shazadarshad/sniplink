# Sniplink 🔗

A small URL shortener with click analytics. Paste a long URL, get a short link,
and see how many times each link has been clicked from a simple dashboard.

Built with **Next.js 15**, **TypeScript**, **Tailwind CSS**, and **SQLite**.

## Features

- Shorten any valid URL into a short, shareable code
- Automatic redirect from the short link to the original URL
- **Click tracking** — every visit to a short link is recorded
- **Dashboard** listing all links with their click counts and created dates
- URL validation (bare domains like `example.com` get `https://` added; non-http URLs are rejected)
- Copy-to-clipboard, plus loading / empty / error states
- Friendly 404 for unknown short codes
- Unit tests for the core logic (Vitest)

## Tech Stack

- **Next.js 15** (App Router) + **React 19**
- **TypeScript**
- **Tailwind CSS**
- **SQLite** via `better-sqlite3`
- **Vitest** for tests

## How it works

```
Browser → Next.js App Router
  • Home page  → POST /api/shorten  → data layer → SQLite
  • /<code>    → Server Component   → records a click, then redirects
  • /dashboard → Server Component   → reads links + click counts
```

All database access lives in `lib/` (the only place that touches SQLite):

```
app/
  page.tsx            Home page (shorten form)
  dashboard/page.tsx  Links + click stats
  [code]/page.tsx     Redirect + click tracking
  api/shorten/route.ts  Create-link API
  not-found.tsx       404 for unknown codes
components/
  ShortenForm.tsx     Client form with states
lib/
  db.ts               SQLite connection + schema
  links.ts            Typed queries (create/list/get/recordClick)
  shortcode.ts        URL validation + short-code generation (pure)
types/                Shared types
tests/                Vitest unit tests
```

## Database

Two tables (created automatically on first run):

- **links** — `id`, `code` (unique), `url`, `created_at`
- **clicks** — `id`, `link_id` (FK → links), `clicked_at`

A link's click count is the number of `clicks` rows referencing it.

## Running locally

```bash
npm install
npm run dev
```

Open http://localhost:3000. The SQLite database is created automatically at
`data/sniplink.db` on first use (gitignored).

## Available scripts

| Script              | Description |
| ------------------- | ----------- |
| `npm run dev`       | Start the dev server |
| `npm run build`     | Production build |
| `npm run start`     | Run the production build |
| `npm run lint`      | Run ESLint |
| `npm run typecheck` | TypeScript type check |
| `npm run test`      | Run the Vitest suite |

## Notes & limitations

- **Storage:** uses a local SQLite file, which is perfect for local use and
  simple hosts. On serverless platforms with an ephemeral/read-only filesystem
  (e.g. Vercel), the data wouldn't persist — you'd swap the `lib/db.ts` layer
  for a hosted database (Postgres, Turso, etc.). The rest of the app is unchanged.
- **Analytics** are intentionally simple (total click counts). Per-day charts,
  referrers, and unique visitors would be natural next steps.
- No authentication — anyone can create links and view the dashboard, which is
  fine for a demo.
