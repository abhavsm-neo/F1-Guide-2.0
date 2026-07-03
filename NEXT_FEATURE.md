# Next Feature Pack — Implementation Spec for Kimi Code

> Project: `C:\F1 guide 2.0\F1 guide 2`  
> Base: React 19 + TypeScript + Vite + CSS Modules + HUD aesthetic  
> Goal: Add 3D interactions, animated counters, scroll reveals, and team theme

---

## Pre-Flight Checklist

Before implementing any feature, verify:
- [ ] `npm install` completed (dependencies exist in `node_modules/`)
- [ ] `npm run build` passes with zero TypeScript errors
- [ ] `src/styles/tokens.css` has the HUD color palette (dark garage theme)
- [ ] All CSS modules use `var(--*)` custom properties
- [ ] `lucide-react` is installed

If a build fails after changes, fix it immediately before continuing.

---

## Feature 1: 3D Card Flip System (A2)

### Goal
Every card (DriverCard, TeamCard) tilts in true 3D space toward the cursor. On click, it flips 180° to reveal a "back side" with detailed stats. No new libraries needed — pure CSS 3D transforms + mouse tracking.

### Implementation

#### 1.1 Create `src/components/ui/FlipCard.tsx`

A reusable wrapper component that handles the 3D flip logic.

```tsx
import { useState, useRef, useCallback, type ReactNode } from 'react';
import styles from './FlipCard.module.css';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!cardRef.current || flipped) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: y * 15, y: -x * 15 }); // max 15deg tilt
  }, [flipped]);

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback(() => {
    setFlipped(f => !f);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.container} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`${styles.inner} ${flipped ? styles.flipped : ''}`}
        style={{
          transform: flipped
            ? 'rotateY(180deg)'
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className={styles.front}>{front}</div>
        <div className={styles.back}>{back}</div>
      </div>
    </div>
  );
}
```

#### 1.2 Create `src/components/ui/FlipCard.module.css`

```css
.container {
  width: 100%;
  cursor: pointer;
  position: relative;
}

.inner {
  width: 100%;
  height: 100%;
  position: relative;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.22, 1, 0.36, 1);
  will-change: transform;
}

.flipped {
  /* transform is applied inline via JS */
}

.front,
.back {
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.back {
  position: absolute;
  top: 0;
  left: 0;
  transform: rotateY(180deg);
}

/* Reduce motion for accessibility */
@media (prefers-reduced-motion: reduce) {
  .inner {
    transition: none;
  }
}
```

#### 1.3 Update `DriverCard.tsx` to use FlipCard

Wrap the existing card content in FlipCard. The **front** is the current card. The **back** shows:
- Driver radar chart (reuse RadarChart component)
- Career timeline (key seasons, championships)
- Full skill breakdown (all 4 stats as bars)
- Team history

```tsx
import { FlipCard } from './FlipCard';
import { RadarChart } from '../charts/RadarChart';
// ... existing imports

export function DriverCard({ driver }: { driver: Driver }) {
  const front = (
    <div className={styles.card}>
      {/* existing card content */}
    </div>
  );

  const back = (
    <div className={`${styles.card} ${styles.backSide}`}>
      <div className={styles.backHeader}>
        <span className={styles.backName}>{driver.name}</span>
        <span className={styles.backLabel}>CAREER PROFILE</span>
      </div>
      <RadarChart
        data={[
          { label: 'Speed', value: driver.skill },
          { label: 'Racecraft', value: driver.racecraft },
          { label: 'Consistency', value: driver.consistency },
          { label: 'Media', value: driver.media },
          { label: 'Experience', value: 85 },
        ]}
        color={driver.teamColor}
      />
      <div className={styles.backStats}>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>CHAMPIONSHIPS</span>
          <span className={styles.backValue}>{driver.championships}</span>
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>WINS</span>
          <span className={styles.backValue}>{driver.wins}</span>
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>POLES</span>
          <span className={styles.backValue}>{driver.poles}</span>
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>SEASONS</span>
          <span className={styles.backValue}>{driver.seasons}</span>
        </div>
      </div>
    </div>
  );

  return <FlipCard front={front} back={back} />;
}
```

#### 1.4 Add back-side styles to `DriverCard.module.css`

```css
.backSide {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  position: relative;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: 280px;
}

.backSide::before,
.backSide::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--border-glow-dim);
  pointer-events: none;
}

.backSide::before {
  top: -1px; left: -1px;
  border-right: none; border-bottom: none;
}

.backSide::after {
  bottom: -1px; right: -1px;
  border-left: none; border-top: none;
}

.backHeader {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: var(--space-2);
}

.backName {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: var(--text-lg);
  color: var(--text-primary);
}

.backLabel {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.backValue {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}

.backRow {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-1) 0;
  border-bottom: 1px solid var(--border-subtle);
}
```

#### 1.5 Do the same for TeamCard

Same pattern: wrap in FlipCard, front = existing card, back = detailed stats (engine notes, driver comparison, team history timeline).

### Acceptance Criteria
- [ ] Card tilts up to 15° toward cursor on hover (3D perspective)
- [ ] Card flips 180° smoothly on click (0.5s cubic-bezier)
- [ ] Back side shows radar chart + career stats
- [ ] `prefers-reduced-motion` disables 3D tilt and flip animation
- [ ] Works in both dark and light mode
- [ ] TypeScript compiles, build passes

---

## Feature 2: Animated Counters (B3)

### Goal
Every number on the site (wins, poles, points, championships, countdown timer) animates from 0 to its actual value when it enters the viewport. Like a lap counter or race timer.

### Implementation

#### 2.1 Create `src/hooks/useCountUp.ts`

```tsx
import { useState, useEffect, useRef } from 'react';

interface UseCountUpOptions {
  target: number;
  duration?: number; // ms, default 1500
  decimals?: number; // default 0
  startOnMount?: boolean; // default false (use IntersectionObserver)
}

export function useCountUp({ target, duration = 1500, decimals = 0, startOnMount = false }: UseCountUpOptions) {
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(startOnMount);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number>();

  useEffect(() => {
    if (startOnMount) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnMount]);

  useEffect(() => {
    if (!started) return;

    const startTime = performance.now();
    const startValue = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;
      setValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration, decimals]);

  return { value, ref };
}
```

#### 2.2 Create `src/components/ui/CountUp.tsx`

```tsx
import { useCountUp } from '../../hooks/useCountUp';

interface CountUpProps {
  target: number;
  duration?: number;
  decimals?: number;
  className?: string;
  prefix?: string;
  suffix?: string;
}

export function CountUp({ target, duration, decimals, className = '', prefix = '', suffix = '' }: CountUpProps) {
  const { value, ref } = useCountUp({ target, duration, decimals });
  return (
    <span ref={ref} className={className}>
      {prefix}{value.toLocaleString()}{suffix}
    </span>
  );
}
```

#### 2.3 Apply CountUp to all stats

In `DriverCard.tsx`:
```tsx
import { CountUp } from './CountUp';

// Replace static numbers with:
<CountUp target={driver.number} className={styles.numberBadge} />
<CountUp target={parseInt(driver.wins) || 0} className={styles.readout} />
<CountUp target={parseInt(driver.poles) || 0} className={styles.readout} />
<CountUp target={driver.championships} className={styles.readout} />
```

In `TeamCard.tsx`:
```tsx
<CountUp target={parseInt(team.championships) || 0} className={styles.readout} />
```

In `RaceCountdown.tsx`:
```tsx
// Each timer segment uses CountUp when the countdown changes
<CountUp target={days} duration={800} className={styles.timerSegment} />
```

In `StandingsPage.tsx`, `ResultsPage.tsx`, `RecordsPage.tsx` — all points, wins, podiums numbers.

### Acceptance Criteria
- [ ] Numbers animate from 0 to target on viewport entry
- [ ] Animation duration: 1.5s with ease-out cubic
- [ ] `requestAnimationFrame` for smooth 60fps
- [ ] IntersectionObserver triggers animation only when visible
- [ ] `prefers-reduced-motion` instantly shows final value
- [ ] Works with decimal values (e.g., 1.5s lap times)
- [ ] TypeScript compiles, build passes

---

## Feature 3: Scroll-Triggered Reveals (C2)

### Goal
Every section on a page starts hidden, then fades in + slides up as the user scrolls to it. Staggered children animate sequentially. Pages feel like a story unfolding.

### Implementation

#### 3.1 Create `src/hooks/useScrollReveal.ts`

```tsx
import { useEffect, useRef, useState } from 'react';

interface UseScrollRevealOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

export function useScrollReveal({ threshold = 0.15, rootMargin = '0px', triggerOnce = true }: UseScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
}
```

#### 3.2 Create `src/components/ui/ScrollReveal.tsx`

```tsx
import { type ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number; // px
  duration?: number; // ms
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
  duration = 600,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();

  const translate = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${isVisible ? styles.visible : ''} ${className}`}
      style={{
        transitionDuration: `${duration}ms`,
        transitionDelay: `${delay}ms`,
        transform: isVisible ? 'translate(0)' : translate[direction],
        opacity: isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
```

#### 3.3 Create `src/components/ui/ScrollReveal.module.css`

```css
.reveal {
  transition-property: opacity, transform;
  transition-timing-function: cubic-bezier(0.22, 1, 0.36, 1);
  will-change: opacity, transform;
}

.visible {
  /* handled inline via JS */
}

@media (prefers-reduced-motion: reduce) {
  .reveal {
    transition: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
```

#### 3.4 Apply to all pages

Wrap each major section in every page with `ScrollReveal`:

```tsx
// In HomePage.tsx:
<ScrollReveal>
  <SectionHeader ... />
</ScrollReveal>

<ScrollReveal delay={100}>
  <div className={styles.quickLinks}>
    {/* cards */}
  </div>
</ScrollReveal>

<ScrollReveal delay={200}>
  <div className={styles.featuredRace}>
    {/* content */}
  </div>
</ScrollReveal>
```

For lists/grids, add staggered delays to children:
```tsx
<div className={styles.grid}>
  {drivers.map((d, i) => (
    <ScrollReveal key={d.id} delay={i * 80}>
      <DriverCard driver={d} />
    </ScrollReveal>
  ))}
</div>
```

### Acceptance Criteria
- [ ] Sections start invisible, fade in + slide up on scroll
- [ ] Staggered children: each item delays 80ms after the previous
- [ ] IntersectionObserver with 15% threshold
- [ ] Trigger once (don't re-hide when scrolling away)
- [ ] `prefers-reduced-motion` shows everything instantly
- [ ] Works on all 26 pages
- [ ] TypeScript compiles, build passes

---

## Feature 4: Team-Themed UI (F1)

### Goal
User picks a favorite team → the entire UI accent color shifts to that team's color. Red Bull = red/blue, Ferrari = red, Mercedes = teal, McLaren = orange, etc. Stored in localStorage.

### Implementation

#### 4.1 Update `src/context/ThemeContext.tsx`

Add `favoriteTeam` state with a team color override for the accent.

```tsx
import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { TEAMS } from '../data/teams';

interface ThemeContextType {
  darkMode: boolean;
  toggleTheme: () => void;
  favoriteTeam: string | null;
  setFavoriteTeam: (teamId: string | null) => void;
  accentColor: string;
}

const ThemeContext = createContext<ThemeContextType>({
  darkMode: true,
  toggleTheme: () => {},
  favoriteTeam: null,
  setFavoriteTeam: () => {},
  accentColor: '#E10600',
});

export const useTheme = () => useContext(ThemeContext);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('f1guide_theme');
    if (saved) return saved === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [favoriteTeam, setFavoriteTeam] = useState<string | null>(() => {
    return localStorage.getItem('f1guide_favorite_team');
  });

  const accentColor = favoriteTeam
    ? TEAMS.find(t => t.id === favoriteTeam)?.color || '#E10600'
    : '#E10600';

  useEffect(() => {
    localStorage.setItem('f1guide_theme', darkMode ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    if (favoriteTeam) {
      localStorage.setItem('f1guide_favorite_team', favoriteTeam);
    } else {
      localStorage.removeItem('f1guide_favorite_team');
    }
    // Set CSS custom property for accent color
    document.documentElement.style.setProperty('--accent', accentColor);
    document.documentElement.style.setProperty('--accent-hover', lightenColor(accentColor, 20));
    document.documentElement.style.setProperty('--accent-muted', `${accentColor}20`);
    document.documentElement.style.setProperty('--accent-glow', `${accentColor}40`);
  }, [favoriteTeam, accentColor]);

  const toggleTheme = () => setDarkMode(d => !d);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, favoriteTeam, setFavoriteTeam, accentColor }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Helper to lighten a hex color
function lightenColor(hex: string, percent: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.min(255, (num >> 16) + percent);
  const g = Math.min(255, ((num >> 8) & 0x00FF) + percent);
  const b = Math.min(255, (num & 0x0000FF) + percent);
  return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, '0')}`;
}
```

#### 4.2 Add Team Picker UI

Add a team picker to the sidebar or settings. Use the team color dots from `TEAMS` data.

```tsx
// In Sidebar.tsx or a new Settings page:
const { favoriteTeam, setFavoriteTeam, accentColor } = useTheme();

<div className={styles.teamPicker}>
  <span className={styles.teamPickerLabel}>FAVORITE TEAM</span>
  <div className={styles.teamGrid}>
    {TEAMS.map(team => (
      <button
        key={team.id}
        className={`${styles.teamDot} ${favoriteTeam === team.id ? styles.teamDotActive : ''}`}
        style={{ background: team.color }}
        onClick={() => setFavoriteTeam(favoriteTeam === team.id ? null : team.id)}
        aria-label={team.name}
        title={team.name}
      />
    ))}
  </div>
  {favoriteTeam && (
    <button className={styles.clearTeam} onClick={() => setFavoriteTeam(null)}>
      Clear Selection
    </button>
  )}
</div>
```

```css
.teamPicker {
  padding: var(--space-4);
  border-top: 1px solid var(--border-subtle);
}

.teamPickerLabel {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  display: block;
  margin-bottom: var(--space-3);
}

.teamGrid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: var(--space-2);
}

.teamDot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.teamDot:hover {
  transform: scale(1.15);
}

.teamDotActive {
  border-color: var(--text-primary);
  box-shadow: 0 0 8px var(--accent-glow);
}

.clearTeam {
  margin-top: var(--space-3);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  color: var(--text-secondary);
  background: none;
  border: none;
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.clearTeam:hover {
  color: var(--accent);
}
```

#### 4.3 Update team color references

Replace any hardcoded `#E10600` references in CSS with `var(--accent)`. The CSS custom property is already dynamically updated by the ThemeContext.

In `tokens.css`, ensure `--accent` is set to the default F1 red but can be overridden:
```css
:root {
  --accent: #E10600; /* default, overridden by JS */
  /* ... */
}
```

### Acceptance Criteria
- [ ] Team picker shows all 10 teams as colored dots in the sidebar
- [ ] Clicking a team dot sets the UI accent to that team's color
- [ ] Active team dot has a white border + glow
- [ ] Clear button removes team preference
- [ ] Preference persists across page reloads (localStorage)
- [ ] All glowing elements (buttons, borders, hover states) use the team color
- [ ] TypeScript compiles, build passes

---

## Implementation Order (Recommended)

1. **Feature 4 (Team Theme)** — 1 hour  
   → Fastest win, establishes the accent color system that other features use

2. **Feature 2 (Animated Counters)** — 1 hour  
   → Add the hook, then apply to DriverCard, TeamCard, Standings, Results

3. **Feature 3 (Scroll Reveals)** — 1 hour  
   → Add the hook + component, then wrap all sections on every page

4. **Feature 1 (3D Card Flip)** — 1.5 hours  
   → Most complex, create FlipCard component, then integrate into DriverCard and TeamCard

**Total: ~4.5 hours of focused work**

---

## Common Gotchas

1. **CSS Modules with pseudo-elements** — Corner brackets in `::before/::after` need `position: absolute` on the parent. Make sure the card has `position: relative`.

2. **3D transforms need `transform-style: preserve-3d`** — This must be set on the parent of the element being transformed. If the card is inside a flex container, the perspective might need to be set higher up.

3. **IntersectionObserver is async** — If you need to test scroll reveals in a unit test, mock the IntersectionObserver.

4. **CountUp with `requestAnimationFrame`** — Always clean up the rAF in the useEffect return. Otherwise, you get memory leaks when the component unmounts mid-animation.

5. **Team color CSS injection** — Setting CSS custom properties via `document.documentElement.style.setProperty` is the cleanest way. Don't try to swap entire stylesheets.

6. **Build after EVERY feature** — Don't implement all 4 features then build. Build after each feature. If the build fails, fix it before moving on.

---

## Testing Checklist

- [ ] `npm run build` passes after each feature
- [ ] `npm run dev` works, all pages load
- [ ] 3D card tilt works on hover (Desktop Chrome/Firefox/Edge)
- [ ] Card flip works on click/tap
- [ ] Numbers animate on scroll into view
- [ ] Sections fade in on scroll
- [ ] Team color changes apply to all glowing elements
- [ ] Light mode still works correctly
- [ ] `prefers-reduced-motion` disables all animations
- [ ] No console errors or warnings
