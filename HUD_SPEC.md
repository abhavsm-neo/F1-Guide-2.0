# HUD Foundation — Design Spec for Garage Aesthetic

## Philosophy: The Digital Pit Wall

Everything reads like a Formula 1 engineer's dashboard. No more "website cards" — these are **panels**, **readouts**, **telemetry displays**. The user is in the garage, not browsing a site.

## Color Palette (Garage Mode)

```css
:root {
  --bg-base: #0B0C10;              /* Darkest — carbon fiber dark */
  --bg-surface: #111318;           /* Panel background */
  --bg-surface-hover: #181A20;     /* Hover state */
  --bg-elevated: #1E2028;          /* Elevated panels */
  --bg-overlay: rgba(0, 0, 0, 0.7);

  --text-primary: #F0F0F2;         /* Cool white */
  --text-secondary: #6B6E75;       /* Telemetry grey */
  --text-tertiary: #4A4D55;        /* Disabled readout */
  --text-inverse: #0B0C10;

  --border-subtle: #1E2028;        /* Thin panel lines */
  --border-active: #2A2D36;        /* Hover/active lines */
  --border-glow: #E10600;          /* Red glow edge */
  --border-glow-dim: rgba(225, 6, 0, 0.3);

  --accent: #E10600;               /* F1 red — heartbeat */
  --accent-hover: #FF1A1A;
  --accent-muted: rgba(225, 6, 0, 0.08);
  --accent-glow: rgba(225, 6, 0, 0.25);

  --hud-cyan: #00CCFF;             /* HUD cyan */
  --hud-green: #00FF88;            /* Telemetry green */
  --hud-amber: #FFAA00;            /* Warning amber */
  --hud-blue: #4488FF;             /* Info blue */

  --gold: #FFD700;
  --silver: #C0C5CE;
  --bronze: #B87333;

  --success: #00FF88;
  --success-muted: rgba(0, 255, 136, 0.08);
  --info: #00CCFF;
  --info-muted: rgba(0, 204, 255, 0.08);
  --warning: #FFAA00;
  --warning-muted: rgba(255, 170, 0, 0.08);
}

[data-theme="light"] {
  --bg-base: #E8E9EC;
  --bg-surface: #F0F1F3;
  --bg-surface-hover: #E5E6E8;
  --bg-elevated: #FFFFFF;
  --bg-overlay: rgba(255, 255, 255, 0.8);
  --text-primary: #0B0C10;
  --text-secondary: #5A5E66;
  --text-tertiary: #9CA3AF;
  --border-subtle: #D1D5DB;
  --border-active: #B0B3B8;
  --border-glow: #E10600;
  --border-glow-dim: rgba(225, 6, 0, 0.2);
  --accent-muted: rgba(225, 6, 0, 0.06);
  --accent-glow: rgba(225, 6, 0, 0.1);
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
  --shadow-lg: 0 12px 40px rgba(0,0,0,0.12);
}
```

## HUD Pattern System

### 1. Corner Brackets `[ ]`

Every panel has corner brackets instead of rounded borders.

```css
/* The base panel style */
.hud-panel {
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  position: relative;
  padding: var(--space-4);
}

/* Corner brackets via pseudo-elements */
.hud-panel::before,
.hud-panel::after {
  content: '';
  position: absolute;
  width: 12px;
  height: 12px;
  border: 2px solid var(--border-glow-dim);
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
  pointer-events: none;
}

/* Top-left corner */
.hud-panel::before {
  top: -1px;
  left: -1px;
  border-right: none;
  border-bottom: none;
}

/* Bottom-right corner */
.hud-panel::after {
  bottom: -1px;
  right: -1px;
  border-left: none;
  border-top: none;
}

/* Hover: corners glow */
.hud-panel:hover::before,
.hud-panel:hover::after {
  border-color: var(--border-glow);
  box-shadow: 0 0 8px var(--accent-glow);
}

/* Active state: full glow */
.hud-panel-active::before,
.hud-panel-active::after {
  border-color: var(--border-glow);
  box-shadow: 0 0 12px var(--accent-glow), 0 0 4px var(--accent-glow);
}
```

### 2. Header Bar (Pit Board Style)

Each section has a thin header bar with a left accent line and label.

```css
.hud-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-subtle);
  margin-bottom: var(--space-4);
}

.hud-header-accent {
  width: 3px;
  height: 20px;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent-glow);
}

.hud-header-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--text-secondary);
}

.hud-header-value {
  font-family: var(--font-mono);
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--text-primary);
  margin-left: auto;
}
```

### 3. Counter Readout

```css
.hud-counter {
  font-family: var(--font-mono);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--text-primary);
  letter-spacing: 0.02em;
}

.hud-counter-accent {
  color: var(--accent);
  text-shadow: 0 0 8px var(--accent-glow);
}

.hud-counter-cyan {
  color: var(--hud-cyan);
  text-shadow: 0 0 8px rgba(0, 204, 255, 0.3);
}

.hud-counter-green {
  color: var(--hud-green);
  text-shadow: 0 0 8px rgba(0, 255, 136, 0.3);
}
```

### 4. Data Row (Telemetry Style)

```css
.hud-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-2) 0;
  border-bottom: 1px solid var(--border-subtle);
  font-size: var(--text-sm);
}

.hud-row-label {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
}

.hud-row-value {
  font-family: var(--font-mono);
  font-weight: 600;
  color: var(--text-primary);
}
```

### 5. Status Indicator Dot

```css
.hud-status {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--text-tertiary);
  box-shadow: 0 0 4px var(--text-tertiary);
}

.hud-status-live {
  background: var(--hud-green);
  box-shadow: 0 0 6px var(--hud-green), 0 0 12px rgba(0, 255, 136, 0.3);
  animation: pulse 2s infinite;
}

.hud-status-warn {
  background: var(--hud-amber);
  box-shadow: 0 0 6px var(--hud-amber);
}

.hud-status-error {
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
}
```

### 6. Button (Tactile)

```css
.hud-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: 8px 16px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-active);
  color: var(--text-primary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  cursor: pointer;
  position: relative;
  transition: all 0.2s ease;
}

.hud-button:hover {
  border-color: var(--border-glow);
  box-shadow: 0 0 12px var(--accent-glow);
  background: var(--bg-surface-hover);
}

.hud-button-primary {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}

.hud-button-primary:hover {
  background: var(--accent-hover);
  box-shadow: 0 0 16px var(--accent-glow);
}
```

### 7. Separator (Glowing Line)

```css
.hud-separator {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--border-active), transparent);
  margin: var(--space-4) 0;
}

.hud-separator-accent {
  background: linear-gradient(90deg, transparent, var(--accent), transparent);
  height: 2px;
  box-shadow: 0 0 8px var(--accent-glow);
}
```

### 8. Badge (Pit Board)

```css
.hud-badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  background: var(--bg-elevated);
  border: 1px solid var(--border-active);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--text-secondary);
  letter-spacing: 0.05em;
}

.hud-badge-accent {
  border-color: var(--accent);
  color: var(--accent);
  background: var(--accent-muted);
  box-shadow: 0 0 6px var(--accent-glow);
}
```

### 9. Table (Telemetry Grid)

```css
.hud-table {
  width: 100%;
  border-collapse: collapse;
  font-size: var(--text-sm);
}

.hud-table thead {
  border-bottom: 2px solid var(--border-active);
}

.hud-table th {
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--text-secondary);
  padding: var(--space-2) var(--space-3);
  text-align: left;
}

.hud-table td {
  padding: var(--space-2) var(--space-3);
  border-bottom: 1px solid var(--border-subtle);
  font-family: var(--font-mono);
  color: var(--text-primary);
}

.hud-table tbody tr:hover {
  background: var(--bg-surface-hover);
}
```

## Component Mapping

| Component | HUD Treatment |
|-----------|--------------|
| `Layout` | Darker background, sidebar with bracket edges, glowing active indicators |
| `Sidebar` | Pit board panel style, team color dots as status indicators, bracket corners |
| `Navbar` | Thin glowing bottom border, telemetry-style readout |
| `Hero` | Large bracketed panel, giant counter numbers for countdown, cyan/green glow |
| `RaceCountdown` | HUD-style panel, mono counter, pulsing live indicator |
| `DriverCard` | Bracketed panel, data rows for stats, driver number as large counter |
| `TeamCard` | Bracketed panel, team color strip as glowing line, data rows |
| `SectionHeader` | Thin header bar with accent line, mono label, bracketed container |
| `RatingBar` | Thin bar with glow fill, label in mono, value as counter |
| `RadarChart` | Bracketed container, chart lines with glow, axis labels in mono |
| `ChampionshipTracker` | Same as above |
| All pages | Apply bracketed panels to all content cards, data rows for stats, mono counters |

## Typography Updates

Replace `Inter` with a display font for headings. Add `Space Grotesk` as a strong option.

```html
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
```

```css
--font-display: 'Space Grotesk', system-ui, sans-serif;
--font-body: 'Inter', system-ui, sans-serif;
--font-mono: 'JetBrains Mono', monospace;

/* Headings: Space Grotesk */
/* Body: Inter */
/* Numbers/Labels/Readouts: JetBrains Mono */
```

Headings should be `font-family: var(--font-display); font-weight: 700; letter-spacing: -0.02em;`

## What to Do in Each Component

For every `.module.css` file:
1. Update card backgrounds to `var(--bg-surface)`
2. Add `position: relative` and corner bracket pseudo-elements
3. Replace standard borders with `var(--border-subtle)` thin lines
4. Convert stat numbers to `var(--font-mono)` with appropriate glow colors
5. Convert labels to uppercase mono with `letter-spacing: 0.08em`
6. Add glowing accent lines for active states
7. Replace rounded buttons with square-cornered tactical buttons
8. Ensure hover states add glow, not just color change

## No-Go List for This Phase

- ❌ No Three.js (next phase)
- ❌ No GSAP transitions (next phase)
- ❌ No particles (next phase)
- ❌ No 3D card flips (next phase)
- ❌ No custom cursor (next phase)
- ✅ Only CSS changes, no new JS libraries
- ✅ Pure visual refactor, no new components
