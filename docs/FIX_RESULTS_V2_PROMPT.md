# Fix: ResultsPage Not Showing Correct Last 3 Races

## The Real Problem

The API endpoint `/${year}/results.json` returns races that have results. For the current year (2026), the API only has test/demo data with 3 races (rounds 1, 2, 3). The user wants to see the **last 3 races of the most recently completed season**, not the first 3 races of a season that hasn't really started yet.

## The Fix

In `src/pages/ResultsPage.tsx`, change the logic to:
1. Try current year first
2. If fewer than 3 completed races, fall back to previous year
3. Add a year selector so the user can manually switch years
4. Show the last 3 completed races (sorted by round descending, take first 3)

## Exact Code Changes

### Step 1: Add year state and selector

Replace `const YEAR = new Date().getFullYear();` with a year state:

```tsx
// Add to state:
const [year, setYear] = useState(new Date().getFullYear());

// In the loadAll callback, replace YEAR with year:
const loadAll = useCallback(async () => {
  setLoading(true);
  setError(null);
  try {
    const [racesData, drvData, ctorData] = await Promise.all([
      fetchRaces(year),
      fetchDriverStandings(year),
      fetchConstructorStandings(year),
    ]);
    
    const now = new Date();
    const completedRaces = racesData
      .filter((r) => new Date(r.date) < now)
      .sort((a, b) => parseInt(b.round) - parseInt(a.round)); // DESCENDING
    
    const lastThree = completedRaces.slice(0, 3); // Take first 3 after descending sort
    setRaces(lastThree);
    if (lastThree.length > 0) setSelectedIdx(0); // First = most recent
    setDriverStandings(drvData);
    setConstructorStandings(ctorData);
    setLastUpdated(new Date());
  } catch (e) {
    setError(e instanceof Error ? e.message : 'Failed to load data');
  } finally {
    setLoading(false);
  }
}, [year]);
```

### Step 2: Add year selector UI

Add year buttons above the "Last 3 Completed Races" label:

```tsx
{!loading && !error && (
  <div className={styles.yearSelector}>
    <button 
      className={`${styles.yearBtn} ${year === 2025 ? styles.yearBtnActive : ''}`}
      onClick={() => setYear(2025)}
    >2025</button>
    <button 
      className={`${styles.yearBtn} ${year === 2026 ? styles.yearBtnActive : ''}`}
      onClick={() => setYear(2026)}
    >2026</button>
  </div>
)}
```

### Step 3: Update the selector label

Change "Last 3 Completed Races" to show the year:

```tsx
<div className={styles.selectorLabel}>Last 3 Completed Races · {year}</div>
```

### Step 4: Fix the sort order in buttons

Since the races are now sorted descending (most recent first), the buttons should display them in that order:

```tsx
{races.map((r, i) => (
  <button ...>
    R{r.round} {r.raceName.replace(' Grand Prix', '').replace(' Prix', '')}
  </button>
))}
```

And the first button (index 0) should be the active one by default since it's the most recent race.

### Step 5: Add CSS for year selector (in ResultsPage.module.css)

```css
.yearSelector {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-3);
}

.yearBtn {
  padding: 6px 14px;
  background: var(--bg-surface);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-mono);
  font-size: var(--text-xs);
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.yearBtn:hover {
  border-color: var(--border-active);
  color: var(--text-primary);
}

.yearBtnActive {
  background: var(--accent);
  border-color: var(--accent);
  color: #fff;
}
```

## Key Insight: Sort Descending, Not Ascending

The previous fix sorted ascending and took `slice(-3)`, which would give the last 3 elements. But if the API only returns 3 races total, that's just all 3 races. 

By sorting **descending** (`b.round - a.round`) and taking `slice(0, 3)`, we always get the 3 most recent rounds regardless of how many total races are in the API response.

## Full Expected Behavior

- User opens Results page → defaults to current year
- If current year has fewer than 3 completed races → user can click "2025" to see last year's races
- Year selector shows which year is active
- "Last 3 Completed Races · 2025" clearly indicates the year
- Races are sorted most recent first (R24, R23, R22...)
- Clicking a race button shows its results

## What NOT to Change
- Keep the race results table rendering exactly as-is
- Keep the standings tables
- Keep the HUD styling (brackets, glow, mono fonts)
- Keep the loading, error, and refresh logic
- Keep the auto-refresh hook
