import type { DriverStanding, ConstructorStanding, JolpicaRace } from '../types';

const JOLPICA = 'https://api.jolpi.ca/ergast/f1';

export async function jolpicaGet(path: string): Promise<unknown> {
  const res = await fetch(`${JOLPICA}${path}`);
  if (!res.ok) throw new Error(`Jolpica fetch failed: ${res.status}`);
  return res.json();
}

export async function fetchRaces(year: number): Promise<JolpicaRace[]> {
  const data = await jolpicaGet(`/${year}/results.json?limit=50`) as {
    MRData?: { RaceTable?: { Races?: JolpicaRace[] } };
  };
  const races = data?.MRData?.RaceTable?.Races || [];
  return races.filter((r: JolpicaRace) => r.Results && r.Results.length > 0);
}

export async function fetchDriverStandings(year: number): Promise<DriverStanding[]> {
  const data = await jolpicaGet(`/${year}/driverStandings.json`) as {
    MRData?: { StandingsTable?: { StandingsLists?: { DriverStandings?: {
      Driver: { givenName: string; familyName: string; code?: string };
      Constructors?: { name: string; constructorId: string }[];
      points: string;
      wins: string;
    }[] }[] } };
  };
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.DriverStandings || [];
  return list.map((d, i) => ({
    pos: i + 1,
    name: `${d.Driver.givenName} ${d.Driver.familyName}`,
    code: d.Driver.code || d.Driver.familyName.slice(0, 3).toUpperCase(),
    team: d.Constructors?.[0]?.name || '—',
    constructorId: d.Constructors?.[0]?.constructorId || '',
    pts: parseFloat(d.points),
    wins: parseInt(d.wins),
  }));
}

export async function fetchConstructorStandings(year: number): Promise<ConstructorStanding[]> {
  const data = await jolpicaGet(`/${year}/constructorStandings.json`) as {
    MRData?: { StandingsTable?: { StandingsLists?: { ConstructorStandings?: {
      Constructor: { name: string; constructorId: string };
      points: string;
      wins: string;
    }[] }[] } };
  };
  const list = data?.MRData?.StandingsTable?.StandingsLists?.[0]?.ConstructorStandings || [];
  return list.map((c, i) => ({
    pos: i + 1,
    name: c.Constructor.name,
    constructorId: c.Constructor.constructorId,
    pts: parseFloat(c.points),
    wins: parseInt(c.wins),
  }));
}

export async function fetchNews(): Promise<{ items: { title: string; link: string; pubDate: string; description: string; image: string }[]; source: string }> {
  const res = await fetch('/api/news');
  if (!res.ok) throw new Error('News fetch failed');
  return res.json();
}
