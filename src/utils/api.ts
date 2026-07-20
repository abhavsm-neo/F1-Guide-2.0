import type { DriverStanding, ConstructorStanding, JolpicaRace, JolpicaRaceResult } from '../types';

const PROXY = '/api/f1-proxy';

/** Build proxy URL for a given API-Sports endpoint + params */
function proxyUrl(endpoint: string, params: Record<string, string | number> = {}) {
  const sp = new URLSearchParams({ endpoint });
  for (const [k, v] of Object.entries(params)) {
    if (v !== undefined && v !== null) sp.append(k, String(v));
  }
  return `${PROXY}?${sp.toString()}`;
}

async function proxyGet<T = unknown>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
  const res = await fetch(proxyUrl(endpoint, params));
  if (!res.ok) throw new Error(`Proxy fetch failed: ${res.status}`);
  const json = await res.json() as { data?: { response?: T; errors?: Record<string, string> } };
  const data = json.data;
  if (data?.errors && Object.keys(data.errors).length > 0) {
    const errMsg = Object.values(data.errors).join('; ');
    throw new Error(errMsg || 'API-Sports error');
  }
  return data?.response as T;
}

/* ═══════════════════════════════════════════════════════════════
   API-Sports → App type mappings
   ═══════════════════════════════════════════════════════════════ */

interface ApiSportsRace {
  id: number;
  competition: { id: number; name: string; location: { country: string; city: string } };
  circuit: { id: number; name: string; image: string };
  season: number;
  type: string;
  laps: { current: number | null; total: number };
  fastest_lap: { driver: { id: number }; time: string } | null;
  distance: string;
  timezone: string;
  date: string;
  weather: unknown;
  status: string;
}

interface ApiSportsRaceResult {
  race: { id: number };
  driver: { id: number; name: string; abbr: string; number: number; image: string };
  team: { id: number; name: string; logo: string };
  position: number;
  time: string;
  laps: number;
  grid: string;
  pits: number;
  gap: string | null;
}

interface ApiSportsDriverStanding {
  position: number;
  driver: { id: number; name: string; abbr: string; number: number; image: string };
  team: { id: number; name: string; logo: string };
  points: number;
  wins: number;
  behind: number | null;
  season: number;
}

interface ApiSportsTeamStanding {
  position: number;
  team: { id: number; name: string; logo: string };
  points: number;
  season: number;
}

/* ── Helpers ─────────────────────────────────────────────────── */

function apiSportsTeamToConstructorId(name: string): string {
  const n = name.toLowerCase();
  if (n.includes('red bull')) return 'red_bull';
  if (n.includes('mclaren')) return 'mclaren';
  if (n.includes('ferrari')) return 'ferrari';
  if (n.includes('mercedes')) return 'mercedes';
  if (n.includes('aston martin')) return 'aston_martin';
  if (n.includes('alpine')) return 'alpine';
  if (n.includes('williams')) return 'williams';
  if (n.includes('haas')) return 'haas';
  if (n.includes('sauber') || n.includes('kick')) return 'kick_sauber';
  if (n.includes('rb') || n.includes('alphatauri') || n.includes('racing bulls')) return 'rb';
  return n.replace(/\s+/g, '_');
}

function splitDriverName(full: string): { givenName: string; familyName: string } {
  const parts = full.trim().split(' ');
  if (parts.length === 1) return { givenName: parts[0], familyName: '' };
  return { givenName: parts.slice(0, -1).join(' '), familyName: parts[parts.length - 1] || '' };
}

/* ── Exported functions ──────────────────────────────────────── */

export async function fetchRaces(year: number): Promise<JolpicaRace[]> {
  const races = await proxyGet<ApiSportsRace[]>('races', { season: year, type: 'race' });
  if (!races || races.length === 0) return [];

  // Fetch results for completed races in parallel (limit to last 8 to avoid quota burn)
  const completed = races.filter(r => r.status === 'Completed');
  const resultsMap = new Map<number, ApiSportsRaceResult[]>();

  // Only fetch results for the last 8 completed races to stay within API limits
  const toFetch = completed.slice(-8);
  await Promise.all(
    toFetch.map(async (r) => {
      try {
        const res = await proxyGet<ApiSportsRaceResult[]>('rankings/races', { race: r.id });
        if (res) resultsMap.set(r.id, res);
      } catch {
        // ignore missing results for individual races
      }
    })
  );

  return races.map((r, idx) => {
    const res = resultsMap.get(r.id) || [];
    const mappedResults: JolpicaRaceResult[] = res.map(row => {
      const { givenName, familyName } = splitDriverName(row.driver.name);
      return {
        number: String(row.driver.number),
        position: String(row.position),
        Driver: {
          givenName,
          familyName,
          code: row.driver.abbr || row.driver.name.split(' ').pop()?.slice(0, 3).toUpperCase() || '',
        },
        Constructor: {
          constructorId: apiSportsTeamToConstructorId(row.team.name),
          name: row.team.name,
        },
        points: '0', // API-Sports race results don't include points per result
        laps: String(row.laps),
        status: row.position === 1 ? 'Finished' : (row.time || 'Finished'),
      };
    });

    return {
      round: String(idx + 1),
      raceName: r.competition.name,
      date: r.date,
      Circuit: { circuitName: r.circuit.name },
      Results: mappedResults,
    };
  });
}

export async function fetchDriverStandings(year: number): Promise<DriverStanding[]> {
  const list = await proxyGet<ApiSportsDriverStanding[]>('rankings/drivers', { season: year });
  if (!list) return [];
  return list.map(d => ({
    pos: d.position,
    name: d.driver.name,
    code: d.driver.abbr || d.driver.name.split(' ').pop()?.slice(0, 3).toUpperCase() || '',
    team: d.team.name,
    constructorId: apiSportsTeamToConstructorId(d.team.name),
    pts: d.points,
    wins: d.wins,
  }));
}

export async function fetchConstructorStandings(year: number): Promise<ConstructorStanding[]> {
  const list = await proxyGet<ApiSportsTeamStanding[]>('rankings/teams', { season: year });
  if (!list) return [];
  return list.map(c => ({
    pos: c.position,
    name: c.team.name,
    constructorId: apiSportsTeamToConstructorId(c.team.name),
    pts: c.points,
    wins: 0, // API-Sports team rankings do not provide wins
  }));
}

export async function fetchNews(): Promise<{ items: { title: string; link: string; pubDate: string; description: string; image: string }[]; source: string }> {
  const res = await fetch('/api/news');
  if (!res.ok) throw new Error('News fetch failed');
  return res.json();
}
