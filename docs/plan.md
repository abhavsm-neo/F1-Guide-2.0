# F1 Guide 2.0 — Rebuild Plan

## Goal
Rebuild the existing 5,400-line single-file F1 Guide React app into a maintainable, type-safe, feature-rich platform with React Router, TypeScript, component architecture, backend API proxy, accessibility, and shareable URLs.

## Architecture

### Stack
- React 19 + TypeScript + Vite
- React Router v7 (with `future.v7_relativeSplatPath`)
- CSS Variables + custom dark/light theme (no Tailwind — preserve existing visual identity)
- Error Boundaries + React.lazy code splitting per page

### Folder Structure
```
src/
  types/         # All TypeScript interfaces
  data/          # Static data modules (teams, drivers, circuits, etc.)
  hooks/         # Reusable hooks (useAutoRefresh, useToast, useLocalStorage, useOfflineCache, useReducedMotion)
  utils/         # Helpers (API, colors, format, search)
  components/
    layout/      # Layout, Navbar, MobileNav, Hero, GlobalSearch, Footer
    ui/          # Reusable UI (DriverCard, TeamCard, CircuitCard, Skeleton, EmptyState, etc.)
    charts/      # RadarChart, ChampionshipTracker
  pages/         # One component per route (lazy loaded)
  context/       # ThemeContext, BookmarksContext
  App.tsx        # Router + layout
  main.tsx       # Entry point
api/
  f1-proxy.js    # Vercel serverless: Jolpica proxy + caching + OpenF1
```

### Routes (Shareable URLs)
| Route | Page |
|-------|------|
| `/` | Home |
| `/how-it-works` | How F1 Works |
| `/points-system` | Points System |
| `/drivers` | Drivers Grid |
| `/drivers/:driverId` | Driver Profile (deep linkable) |
| `/teams` | Teams Grid |
| `/teams/:teamId` | Team Profile (deep linkable) |
| `/circuits` | Circuit Guide |
| `/circuits/:circuitId` | Circuit Detail (deep linkable) |
| `/results` | Live Results |
| `/standings` | Live Standings |
| `/glossary` | Glossary |
| `/rules` | Rules Explained |
| `/compare` | 2025 vs 2026 Car Compare |
| `/records` | All-Time Records |
| `/quiz` | F1 Quiz |
| `/predictor` | Race Predictor |
| `/predictor?p1=...&p2=...` | Shareable prediction links |
| `/news` | F1 News |
| `/driver-compare` | Driver Compare (Radar) |
| `/championship-tracker` | Championship Battle Tracker |
| `/team-quiz` | Which Team Are You? |
| `/tyre-strategy` | Tyre Strategy Visualiser |
| `/head-to-head` | Teammate H2H |
| `/season-preview` | 2026 Season Preview |
| `/bookmarks` | My Bookmarks |
| `/history` | Driver Changes 2018–2026 |

### Backend API (`api/f1-proxy.js`)
- Vercel serverless function
- Proxies Jolpica API with 60s caching via `Cache-Control: s-maxage=60, stale-while-revalidate`
- Normalizes responses to clean JSON
- Offline fallback: returns cached data from previous request
- News proxy still via `/api/news.js`

### Accessibility & UX Polish
- `prefers-reduced-motion` disables 3D tilts, shimmer, orb animations
- Keyboard navigation: Tab through predictor, Enter to pick, arrow keys for search dropdown
- ARIA labels on all interactive elements
- Error Boundaries: per-page isolation so API failures don't crash the whole app
- Breadcrumbs with actual `<Link>` elements (browser back button works)
- Better empty states with "next race scheduled" info
- Offline mode: cache last-known standings in `localStorage` + `useOfflineCache` hook

### State Management
- `BookmarksContext`: cloud-ready with localStorage persistence (Supabase/Firebase ready)
- `ThemeContext`: dark/light mode with system preference detection
- `Predictor` state: serializable to URL query params for shareable links
- Global search: keyboard shortcut (⌘K / Ctrl+K) with arrow-key navigation

## Phase 1: Scaffold + Data Layer (Main Agent)
1. Create directory structure
2. Write `package.json`, `vite.config.ts`, `tsconfig.json`, `index.html`
3. Write all `src/types/index.ts`
4. Write all `src/data/*.ts` files (extract from App.jsx)
5. Write `src/utils/*.ts` and `src/hooks/*.ts`
6. Write layout components (Layout, Navbar, MobileNav, Hero, GlobalSearch, Footer, SectionHeader)
7. Write shared UI components (DriverCard, TeamCard, CircuitCard, Skeleton, EmptyState, ErrorBoundary, BookmarkButton, RatingBar, PointsBar, RadarChart, ChampionshipTracker)

## Phase 2: Page Implementation (Parallel Workers)
Delegate to 4 parallel sub-agents:
- **Worker A**: Home, HowItWorks, PointsSystem, Glossary, Rules, Compare, Records, Quiz, Bookmarks, History
- **Worker B**: Drivers, DriverProfile, Teams, TeamProfile, DriverCompare, HeadToHead, TeamQuiz
- **Worker C**: Circuits, CircuitDetail, Results, Standings, News, ChampionshipTracker, SeasonPreview
- **Worker D**: Predictor (with URL serialization), TyreStrategy, SessionTimes, backend API proxy

## Phase 3: Integration (Main Agent)
1. Wire all routes in `App.tsx` with React.lazy + Suspense
2. Wire up contexts (Theme, Bookmarks)
3. Add `vercel.json` rewrites
4. Add `api/f1-proxy.js`
5. Final build verification
6. Fix any type errors or integration issues

## Key Design Decisions
- Preserve existing dark F1 aesthetic (red accent `#e10600`, Exo 2 + Orbitron fonts, glass cards, orbs)
- Add `prefers-reduced-motion` support without changing default experience
- All data modules use explicit TypeScript interfaces (no `any`)
- React Router for shareable URLs; `useSearchParams` for predictor sharing
- No external chart library for now — keep SVG radar and championship tracker (fast, no extra deps)
- Error boundaries wrap every lazy page so a single API failure doesn't crash the app
