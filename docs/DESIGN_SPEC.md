# F1 Guide V2 — Design Spec for Workers

## CSS Token System

All styles MUST use CSS custom properties from `src/styles/tokens.css`. NEVER hardcode colors, spacing, or fonts.

### Colors
```css
var(--bg-base)           /* #0F1115 - page background */
var(--bg-surface)        /* #1A1D24 - card/panel background */
var(--bg-surface-hover)  /* #22262E - hover state */
var(--bg-elevated)       /* #252A32 - elevated panels */
var(--text-primary)      /* #F5F5F7 - headings, body */
var(--text-secondary)    /* #8B8F98 - labels, descriptions */
var(--text-tertiary)     /* #5A5E66 - metadata, disabled */
var(--border-subtle)     /* #2A2D35 - card borders */
var(--border-active)     /* #3A3E47 - hover borders */
var(--accent)            /* #E10600 - F1 red, badges, CTAs */
var(--accent-hover)      /* #FF1A1A - hover state */
var(--accent-muted)      /* rgba(225,6,0,0.12) - backgrounds */
var(--gold)              /* #F59E0B - 1st place */
var(--silver)            /* #C0C5CE - 2nd place */
var(--bronze)            /* #B45309 - 3rd place */
var(--success)           /* #22C55E - correct, live */
var(--info)              /* #3B82F6 - links, info */
```

Light mode uses `[data-theme="light"]` — same vars, different values.

### Spacing
```css
var(--space-1)  /* 4px */
var(--space-2)  /* 8px */
var(--space-3)  /* 12px */
var(--space-4)  /* 16px */
var(--space-5)  /* 24px */
var(--space-6)  /* 32px */
var(--space-7)  /* 48px */
```

### Typography
```css
var(--font-body)   /* Inter, system-ui */
var(--font-mono)   /* JetBrains Mono */
var(--text-xs)     /* 11px */
var(--text-sm)     /* 13px */
var(--text-md)     /* 15px */
var(--text-lg)     /* 18px */
var(--text-xl)     /* 24px */
var(--text-2xl)    /* 32px */
var(--text-3xl)    /* 40px */
```

### Shadows
```css
var(--shadow-sm)  /* 0 1px 2px */
var(--shadow-md)  /* 0 4px 12px */
var(--shadow-lg)  /* 0 12px 40px */
var(--shadow-glow) /* red glow */
```

### Radii
```css
var(--radius-sm)   /* 6px */
var(--radius-md)   /* 10px */
var(--radius-lg)   /* 14px */
var(--radius-full) /* 999px */
```

### Layout vars
```css
var(--sidebar-width)      /* 240px */
var(--max-content-width) /* 1280px */
var(--header-height)     /* 56px */
```

## CSS Modules

Every component gets its own `.module.css` file in the same folder.

Example:
```tsx
// DriverCard.tsx
import styles from './DriverCard.module.css';

export function DriverCard() {
  return <div className={styles.card}>...</div>;
}
```

```css
/* DriverCard.module.css */
.card {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  padding: var(--space-4);
  transition: border-color 0.2s ease, box-shadow 0.2s ease;
}
.card:hover {
  border-color: var(--border-active);
  box-shadow: var(--shadow-md);
}
```

## Icons

Use **Lucide React** icons only. NO emojis.

```tsx
import { Star, Search, ChevronDown, Menu, X, Trophy, Flag, Calendar, Clock, Zap, Settings, ChevronRight, BookOpen, BarChart3, Users, MapPin, Newspaper, Brain, HelpCircle, Share2, Bookmark, Sun, Moon, ChevronLeft, LayoutGrid, List, Filter, ArrowUpRight, Download, RotateCcw, Check, AlertCircle, Info, TrendingUp, Gauge, ChevronUp, Copy, ExternalLink } from 'lucide-react';
```

Icon size defaults: 16px for inline, 20px for buttons, 24px for empty states.
Icon stroke width: 2px.

## Typography Rules

- Headings: `font-family: var(--font-body); font-weight: 700; letter-spacing: -0.02em;`
- Labels: `font-size: var(--text-xs); font-weight: 600; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-secondary);`
- Numbers/stats: `font-family: var(--font-mono); font-weight: 500;`
- Body: `font-size: var(--text-md); line-height: 1.6; color: var(--text-primary);`
- NO Orbitron font. NO Exo 2 font.

## Component Patterns

### Cards
```css
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-md);
padding: var(--space-4);
```
Hover: border-color shifts to `--border-active`, shadow increases to `--shadow-md`.
NO glassmorphism. NO backdrop-filter. NO 3D transforms.

### Buttons
Primary: `background: var(--accent); color: #fff; border-radius: var(--radius-sm); padding: 10px 16px; font-weight: 600;`
Secondary: `background: var(--bg-surface); border: 1px solid var(--border-subtle); color: var(--text-primary);`
Ghost: `background: transparent; color: var(--text-secondary);`

### Badges
```css
padding: 2px 8px;
border-radius: var(--radius-full);
font-size: var(--text-xs);
font-weight: 600;
```
Red badge: `background: var(--accent-muted); color: var(--accent);`
Green badge: `background: var(--success-muted); color: var(--success);`
Blue badge: `background: var(--info-muted); color: var(--info);`

### Tables
- Full width, border-collapse
- Header: `background: var(--bg-elevated); color: var(--text-secondary); font-size: var(--text-xs); text-transform: uppercase;`
- Rows: `border-bottom: 1px solid var(--border-subtle);`
- Hover: `background: var(--bg-surface-hover);`
- Sticky header on scroll

### Form inputs
```css
background: var(--bg-surface);
border: 1px solid var(--border-subtle);
border-radius: var(--radius-sm);
padding: 10px 14px;
color: var(--text-primary);
font-size: var(--text-md);
```
Focus: `border-color: var(--border-focus); outline: none; box-shadow: var(--shadow-glow);`

## Animation Classes

Import from `src/styles/animations.css`:
- `.anim-fade-in` — fade in
- `.anim-fade-in-up` — fade in + slide up
- `.anim-scale-in` — scale in
- `.anim-slide-in-left` — slide from left
- `.stagger-children` — staggered fade-in-up for children

## Layout Rules

- Desktop (1024px+): Sidebar (240px) + Content area
- Tablet (640-1023px): Hidden sidebar, hamburger menu, full-width content
- Mobile (<640px): Same as tablet, bottom padding for mobile nav
- Content max-width: 1280px
- Content padding: 24px desktop, 16px mobile

## Accessibility

- Skip link: keep existing
- Focus visible: `outline: 2px solid var(--border-focus); outline-offset: 2px;`
- `aria-label` on icon-only buttons
- `aria-expanded` on dropdowns
- `aria-current="page"` on active nav
- Respect `prefers-reduced-motion`

## Dark/Light Mode

Theme is controlled by `data-theme` attribute on `<html>`.
Set via `document.documentElement.setAttribute('data-theme', 'dark' | 'light')`.
All colors are CSS vars that swap automatically.
