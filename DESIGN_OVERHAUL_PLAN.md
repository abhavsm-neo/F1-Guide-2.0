# F1 Guide V2 — Design Overhaul & Implementation Plan

## Root Cause Analysis: Why the Site Looks Broken

The deployed site at https://f1-guide-2-0.vercel.app has a critical CSS gap. The original `App.jsx` contained a massive inline `<style>` block with **all component styles** (driver cards, navbar, mobile nav, team cards, rating bars, etc.). During the rebuild, those styles were never extracted into the global `index.css`. The components still reference classes like `.driver-card`, `.nav`, `.mobile-nav`, `.team-card`, `.rating-bar` — but these selectors **do not exist in the stylesheet**.

The result: components render as unstyled HTML blocks with no layout, spacing, borders, or visual hierarchy. The few styles that *did* make it into `index.css` (hero, generic cards, tables, quiz) work, but the rest of the UI is raw, unstyled content.

---

## New Design Direction: "Pit Lane Editorial"

Instead of fixing the old "racing dark" aesthetic (neon glows, glassmorphism, Orbitron everywhere), we do a **complete visual overhaul** that makes the site feel premium, editorial, and unique.

### What changes

| Old | New |
|-----|-----|
| Pure black `#060608` + neon red glows | Deep navy charcoal `#0F1115` + disciplined red accent |
| Orbitron font everywhere | Inter + JetBrains Mono (system-native, clean) |
| Glassmorphism cards (`backdrop-filter: blur`) | Solid surface cards with subtle borders |
| Floating orbs + grid background | Clean, no decorative noise — content is the design |
| Top navbar with dropdowns | Sidebar navigation on desktop, top bar on mobile |
| Dense, cramped layout | Generous whitespace, editorial spacing |
| Emoji icons everywhere | Minimal icons (Lucide React), color-coded badges |
| Dark-only | True dark + true light mode (not inverted noise) |

### Color Palette

```
Background:     #0F1115  (deep navy/charcoal)
Surface:        #1A1D24  (elevated cards, panels)
Surface Hover:  #22262E  (hover state)
Border:         #2A2D35  (subtle separation)
Border Active:  #3A3E47  (focused/hover borders)
Text Primary:   #F5F5F7  (off-white, easy on eyes)
Text Secondary: #8B8F98  (muted labels)
Text Tertiary:  #5A5E66  (disabled, metadata)
Accent:         #E10600  (F1 red — used sparingly)
Accent Hover:   #FF1A1A  (brighter on interaction)
Gold:           #F59E0B  (podium 1st, championships)
Silver:         #C0C5CE  (podium 2nd)
Bronze:         #B45309  (podium 3rd)
Success:        #22C55E  (correct answers, live indicators)
Info:           #3B82F6  (links, info badges)
```

Light mode inverts to a clean off-white `#F8F9FB` with charcoal text.

### Typography

```
Headings:    Inter, system-ui, sans-serif;  weight: 700-800;  tracking: -0.02em
Body:        Inter, system-ui, sans-serif;  weight: 400;      line-height: 1.6
Mono/Numbers: JetBrains Mono, monospace;   weight: 500;      (lap times, standings, stats)
Labels:      Inter, system-ui, sans-serif;  weight: 600;      size: 11px;  tracking: 0.05em;  uppercase
```

No more Orbitron. The F1 brand is in the content, not the font.

### Layout System

- **Sidebar nav** (desktop): 240px fixed left sidebar with collapsible sections, team color indicators, bookmark quick-access.
- **Top bar** (mobile): Hamburger menu + race countdown + search.
- **Content area**: Fluid max-width 1280px, 24px gutters.
- **Race countdown**: Persistent sticky banner below top bar (not inside hero).
- **Hero**: Reimagined as a full-width editorial banner with circuit photo, gradient overlay, and key stats — not just text on a dark background.
- **Footer**: Minimal — version, GitHub link, last updated.

---

## Phase 1: Foundation Reset (CSS Architecture)

**Goal:** Replace the broken global CSS with a solid, maintainable system.

### 1.1 CSS Architecture Decision
Move from a single global `index.css` to **CSS Modules per component** + a small `design-tokens.css` file.

Why CSS Modules?
- No more missing class names (co-location = impossible to forget)
- No global namespace collisions
- Tree-shakeable dead CSS
- Easy to refactor without fear

Files to create:
```
src/styles/
  tokens.css          # CSS custom properties (colors, spacing, fonts, shadows)
  reset.css           # Minimal normalize (box-sizing, scrollbar, selection)
  global.css          # html, body, #root, a, button base styles only
  animations.css      # Keyframes (sectionIn, cardIn, shimmer, toastIn, etc.)
```

Every component gets its own `.module.css`:
```
src/components/ui/DriverCard.module.css
src/components/layout/Navbar.module.css
src/components/layout/Sidebar.module.css
src/pages/HomePage.module.css
... etc
```

### 1.2 Token System (tokens.css)

```css
:root {
  /* Backgrounds */
  --bg-base: #0F1115;
  --bg-surface: #1A1D24;
  --bg-surface-hover: #22262E;
  --bg-elevated: #252A32;

  /* Text */
  --text-primary: #F5F5F7;
  --text-secondary: #8B8F98;
  --text-tertiary: #5A5E66;

  /* Borders */
  --border-subtle: #2A2D35;
  --border-active: #3A3E47;

  /* Accent */
  --accent: #E10600;
  --accent-hover: #FF1A1A;
  --accent-muted: rgba(225, 6, 0, 0.15);

  /* Podium */
  --gold: #F59E0B;
  --silver: #C0C5CE;
  --bronze: #B45309;

  /* Status */
  --success: #22C55E;
  --info: #3B82F6;
  --warning: #EAB308;

  /* Spacing scale */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-7: 48px;
  --space-8: 64px;

  /* Typography */
  --font-body: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'SF Mono', monospace;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.3);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.4);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.5);
  --shadow-glow: 0 0 20px rgba(225, 6, 0, 0.15);

  /* Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
}

[data-theme="light"] {
  --bg-base: #F8F9FB;
  --bg-surface: #FFFFFF;
  --bg-surface-hover: #F0F1F3;
  --bg-elevated: #FFFFFF;
  --text-primary: #111317;
  --text-secondary: #5A5E66;
  --text-tertiary: #9CA3AF;
  --border-subtle: #E5E7EB;
  --border-active: #D1D5DB;
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
}
```

### 1.3 Google Fonts Update (index.html)
Replace:
```html
<!-- OLD -->
<link href="https://fonts.googleapis.com/css2?family=Exo+2:wght@300;400;600;700;900&family=Orbitron:wght@400;700;900&display=swap" rel="stylesheet">

<!-- NEW -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
```

### 1.4 Remove Old Global CSS
Delete `src/index.css` entirely. Replace with the new token + reset + animation imports in `main.tsx`.

---

## Phase 2: Component-by-Component CSS Module Migration

### 2.1 Layout Components (Priority 1 — visible on every page)

| Component | Action | Key Changes |
|-----------|--------|-------------|
| `Layout.tsx` | Add `Layout.module.css` | Sidebar layout, content grid, no more orbs/grid-bg |
| `Sidebar.tsx` (new) | Create + `Sidebar.module.css` | 240px sidebar, section groups, active indicator (red left border), team color dots, bookmark count badge |
| `Navbar.tsx` | Rewrite + `Navbar.module.css` | Mobile-only hamburger, sticky top bar with race countdown |
| `MobileNav.tsx` | Rewrite + `MobileNav.module.css` | Bottom sheet (not bottom tabs), slide-up animation, search at top |
| `Hero.tsx` | Rewrite + `Hero.module.css` | Full-width editorial banner with gradient overlay, large headline, key stat pills |
| `RaceCountdown.tsx` | Rewrite + `RaceCountdown.module.css` | Sticky banner below nav, mono font for numbers, flag + circuit name, compact |
| `GlobalSearch.tsx` | Rewrite + `GlobalSearch.module.css` | CMD+K modal (not dropdown), centered overlay, fuzzy highlighting, category icons |

### 2.2 Shared UI Components (Priority 2 — reused everywhere)

| Component | Action | Key Changes |
|-----------|--------|-------------|
| `DriverCard.tsx` | Add `DriverCard.module.css` | Horizontal card (not vertical), driver photo placeholder, number badge, team color strip, stats row with mono font, expandable skill bars |
| `TeamCard.tsx` | Add `TeamCard.module.css` | Large team color header strip, logo placeholder, driver chips, stats grid, expandable engine notes |
| `SectionHeader.tsx` | Rewrite + `SectionHeader.module.css` | Breadcrumb above, large heading, description text, accent line below (not gradient), bookmark button aligned right |
| `BookmarkButton.tsx` | Rewrite + `BookmarkButton.module.css` | Star icon (Lucide), filled/unfilled state, subtle animation on toggle |
| `EmptyState.tsx` | Rewrite + `EmptyState.module.css` | Large icon, centered, clear CTA button |
| `SkeletonCards.tsx` | Rewrite + `SkeletonCards.module.css` | Shimmer with new surface color |
| `ErrorBoundary.tsx` | Add `ErrorBoundary.module.css` | Clean error card, red accent, "Try Again" button |
| `RatingBar.tsx` | Rewrite + `RatingBar.module.css` | Thin bar with team color fill, label + score inline |
| `RadarChart.tsx` | Add `RadarChart.module.css` | SVG styling with CSS vars |
| `ChampionshipTracker.tsx` | Add `ChampionshipTracker.module.css` | SVG styling with CSS vars |

### 2.3 Page Components (Priority 3 — content-specific)

Every page gets its own `.module.css`:
```
src/pages/
  HomePage.tsx
  HomePage.module.css
  DriversPage.tsx
  DriversPage.module.css
  ... etc for all 26 pages
```

Page-specific styles include: grid layouts, filter rows, table overrides, card grids, etc.

---

## Phase 3: New Components & Features

### 3.1 Live Race Banner (New Component)
A persistent sticky banner showing:
- Current/Next race flag + name
- Session timer (Practice / Qualifying / Race)
- Live indicator dot (pulsing green when session is active)
- Link to results page

### 3.2 Driver Grid Redesign (New Layout)
Instead of vertical cards, use a **grid of horizontal cards**:
```
[Photo] [Number] [Name] [Team] [Country] [Wins] [Poles] [Titles]
```
More scannable, more data-dense, feels like a real sports app.

### 3.3 Standings Table Redesign
- Full-width table with sticky header
- Position with podium color badges (gold/silver/bronze circles)
- Driver name with team color dot
- Points in mono font, bold for top 3
- Gap to leader column
- Interactive: click row → driver profile

### 3.4 Circuit Cards Redesign
- Large card with circuit outline (SVG placeholder)
- Circuit stats in a row: length, laps, lap record, DRS zones
- Flag + country prominently displayed
- "Add to Calendar" button inline
- Cancelled races have a subtle strikethrough, not all-red

### 3.5 News Feed Redesign
- Card list with thumbnail placeholder, headline, source, time ago
- "Read more" link to external source
- Filter by source
- Infinite scroll (or load more)

### 3.6 Quiz Redesign
- Full-screen takeover (not inline)
- Progress bar at top
- Large question text
- Option cards (not buttons)
- Correct/wrong animation with color flash
- Score summary at end with share button

### 3.7 Predictor Redesign
- Drag-and-drop grid (not buttons)
- Visual grid slots with driver photos
- Lock-in animation
- Share URL with copy-to-clipboard
- Compare with friend's picks

---

## Phase 4: Interaction & Polish

### 4.1 Micro-interactions
- **Card hover**: Subtle lift (`translateY(-2px)`) + shadow increase (no 3D tilt)
- **Button hover**: Background color shift, not scale
- **Active states**: Red left border or red dot indicator (not glow)
- **Skeleton loading**: Shimmer with surface colors
- **Page transitions**: Fade-in + slight translateY (0.3s, ease-out)
- **Toast**: Slide up from bottom-center, auto-dismiss

### 4.2 Accessibility
- Skip link (already there, keep)
- Focus visible ring with `--accent` color
- `aria-current="page"` on active nav items
- `aria-expanded` on dropdowns
- `aria-live="polite"` on toast container
- Respect `prefers-reduced-motion` (already there, keep)
- Color contrast: all text passes WCAG AA

### 4.3 Responsive Breakpoints
```
Mobile:   0 - 639px     (single column, sidebar hidden, hamburger nav)
Tablet:   640 - 1023px  (2-column grids, sidebar hidden, hamburger nav)
Desktop:  1024px+       (full sidebar, 3-4 column grids, full nav)
```

---

## Phase 5: Content & Data Improvements

### 5.1 Add Circuit SVG Outlines
Replace emoji flags with proper SVG circuit maps (or simplified outlines). This is a huge visual upgrade.

Sources: F1's official circuit maps can be traced as simple SVG paths.

### 5.2 Add Driver Photos (Placeholders)
Use placeholder silhouettes or initials with team color backgrounds. When images are available, swap in.

### 5.3 Team Logos (SVG)
Replace text team names with SVG logo placeholders where possible.

### 5.4 Live Data Integration
- Wire up the Jolpica API for live standings, results, schedule
- Cache with `stale-while-revalidate` (already in proxy)
- Show "Last updated: X minutes ago" on data-heavy pages
- Offline indicator when fetch fails

### 5.5 Meta & SEO
- Add `react-helmet-async` for per-page `<title>` and `<meta>` tags
- Add Open Graph tags for sharing
- Add structured data (JSON-LD) for race events

---

## Phase 6: Performance & Build

### 6.1 Image Optimization
- Use Vite's built-in asset handling for images
- Add `loading="lazy"` to all images
- Use `srcset` for responsive images
- Consider adding `@vercel/image` for deployment

### 6.2 Bundle Optimization
- CSS Modules are already tree-shakeable
- Keep lazy loading for pages (already there)
- Consider preloading critical chunks (Home, Layout)
- Add `vite-plugin-compression` for gzip/brotli

### 6.3 Lighthouse Targets
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 100

---

## Implementation Order (Recommended)

### Week 1: Foundation
1. Delete `index.css`, create `tokens.css`, `reset.css`, `animations.css`
2. Update `index.html` fonts
3. Update `main.tsx` to import new styles
4. Rewrite `Layout.tsx` + `Sidebar.tsx` (new) + `Navbar.tsx` + `MobileNav.tsx`
5. Rewrite `Hero.tsx` + `RaceCountdown.tsx` + `GlobalSearch.tsx`

### Week 2: UI Components
6. Rewrite `DriverCard.tsx` + `TeamCard.tsx` + `SectionHeader.tsx`
7. Rewrite `BookmarkButton.tsx` + `EmptyState.tsx` + `SkeletonCards.tsx`
8. Rewrite `RatingBar.tsx` + `RadarChart.tsx` + `ChampionshipTracker.tsx`

### Week 3: Pages
9. Rewrite `HomePage.tsx` — the landing experience
10. Rewrite `DriversPage.tsx`, `TeamsPage.tsx`, `CircuitsPage.tsx`
11. Rewrite `ResultsPage.tsx`, `StandingsPage.tsx`, `NewsPage.tsx`
12. Rewrite remaining pages

### Week 4: Polish & Features
13. Add micro-interactions and page transitions
14. Add circuit SVG outlines
15. Add SEO meta tags
16. Performance audit + Lighthouse optimization
17. Deploy

---

## Key Principles (Don't Break These)

1. **CSS Modules only** — no more global CSS for component styles
2. **Tokens only** — never hardcode a color or spacing value
3. **Content-first** — the design should showcase F1 content, not decorative effects
4. **Red is an accent** — use `#E10600` sparingly (badges, active states, CTAs)
5. **Typography is the design** — let good type hierarchy do the work
6. **Mobile is not an afterthought** — design mobile first, enhance for desktop
7. **No copies** — every visual decision should feel distinct from the original

---

## Deliverables

- `src/styles/` folder with token system
- Every component gets a `.module.css` file
- Updated `index.html` with new fonts
- New `Sidebar.tsx` component
- Rewritten `Hero.tsx` with editorial layout
- Updated `ThemeContext` to use `data-theme` attribute (not class toggle)
- `react-helmet-async` integration for SEO
- Lighthouse 90+ score

---

*This plan makes the site look like a premium motorsport editorial app — not a generic "dark mode racing website."*
