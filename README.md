# F1 Guide 2.0

An F1 guide/companion for beginners and enthusiasts — 26 pages covering drivers, teams, circuits, live results & standings, quizzes, a race predictor, tyre strategy visualiser, and more.

**Live:** https://f1-guide-2-0.vercel.app

## Tech Stack

- React 19 + TypeScript + Vite
- React Router v7 (lazy-loaded routes, per-page error boundaries)
- CSS Modules + design tokens (HUD "garage" aesthetic)
- Vercel serverless API proxy (API-Sports F1 API + RSS news)

## Getting Started

```bash
npm install
npm run dev
```

### Environment Variables

The API proxy (`api/f1-proxy.js`) reads the API-Sports key server-side:

```
APISPORTS_KEY=your_api_sports_key
```

Set it in `.env.local` for local dev and in Vercel project settings for production. Never commit the key — the proxy must fail loudly if it's missing.

Note: the free API-Sports plan only serves seasons 2022–2024, which is why the Results/Standings pages default to 2024.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Vite dev server |
| `npm run build` | `tsc` typecheck + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | ESLint — needs a flat `eslint.config.js` for ESLint 9 (not yet configured) |

## Deployment

Deploys on Vercel. `vercel.json` handles SPA rewrites and routes `/api/*` to the serverless functions. Set `APISPORTS_KEY` in the Vercel dashboard.

## Project Structure

```
api/              Vercel serverless functions (f1-proxy.js, news.js)
src/
  components/     layout/ · ui/ · charts/
  context/        Theme, Bookmarks
  data/           static data modules (drivers, teams, circuits, ...)
  hooks/          useAutoRefresh, useCountUp, useLocalStorage, ...
  pages/          one component + CSS module per route
  styles/         design tokens, reset, animations
  utils/          api client, colors, format, search
docs/             design specs & planning documents
```

## Docs

Design specs and feature plans live in [`docs/`](docs/) — HUD spec, design token system, reinvention plan, and feature option packs.
