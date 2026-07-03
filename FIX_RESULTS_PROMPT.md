# Fix: ResultsPage Showing Wrong Races

## Problem
The ResultsPage shows "LAST 3 COMPLETED RACES" but displays **Rounds 1, 2, 3** (the first races of the season) instead of the **most recent completed races**. This happens because the API might return races in an unexpected order, or the filtering/slicing logic is wrong.

## Goal
Fix the ResultsPage to correctly show the **last 3 most recently completed races** (e.g., if rounds 1-10 are done and 11 is upcoming, show rounds 8, 9, 10).

## File to Fix
`src/pages/ResultsPage.tsx`

## Current Logic (likely broken)
```tsx
const completedRaces = racesData.filter((r) => {
  const raceDate = new Date(r.date);
  return raceDate < now;
});
const lastThree = completedRaces.slice(-3);
```

## What to Do

1. **First, add debug logging** to understand what the API returns:
   ```tsx
   console.log('All races:', racesData.map(r => ({ round: r.round, name: r.raceName, date: r.date })));
   console.log('Completed:', completedRaces.map(r => ({ round: r.round, name: r.raceName })));
   console.log('Last 3:', lastThree.map(r => ({ round: r.round, name: r.raceName })));
   ```

2. **Fix the sorting logic** — The API might return races in ascending round order (1, 2, 3...) or descending. If the API returns in ascending order, `slice(-3)` should give the last 3. If it's showing rounds 1, 2, 3, the API might return in **descending** order (newest first). In that case, use `slice(0, 3)` instead of `slice(-3)`.

   **Better approach**: Explicitly sort by round number, then take the last 3:
   ```tsx
   const completedRaces = racesData
     .filter((r) => new Date(r.date) < now)
     .sort((a, b) => parseInt(a.round) - parseInt(b.round)); // ascending by round
   
   const lastThree = completedRaces.slice(-3); // last 3 = most recent
   ```

3. **Handle edge cases**:
   - If `completedRaces.length === 0`, show empty state
   - If `completedRaces.length < 3`, show however many are available
   - Add a fallback: if API fails, show a friendly message or use cached data

4. **Better empty state** when API fails or returns no data:
   ```tsx
   {!loading && !error && completedRaces.length === 0 && (
     <EmptyState
       icon={Trophy}
       title="NO COMPLETED RACES"
       sub="Race data will appear here once races are completed. The API may be temporarily unavailable."
     />
   )}
   ```

5. **After fixing, remove the debug console.logs** before committing.

## What NOT to change
- Keep the `fetchRaces`, `fetchDriverStandings`, `fetchConstructorStandings` API calls as-is
- Keep the loading, error, and refresh logic
- Keep the race results table rendering
- Keep the standings tables
- Keep the HUD styling

## Steps
1. Read the current `src/pages/ResultsPage.tsx`
2. Add debug logging to understand the API response shape
3. Fix the sorting/filtering to show the correct last 3 races
4. Improve the empty state message
5. Remove debug logs
6. Verify TypeScript compiles (`npm run build`)
7. Report what the fix was
