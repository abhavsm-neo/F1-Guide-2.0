// ═══════════════════════════════════════════════════════════════
// F1 Guide V2 — Type Definitions
// ═══════════════════════════════════════════════════════════════

export interface Team {
  id: string;
  name: string;
  base: string;
  color: string;
  engine: string;
  tp: string;
  founded: number;
  championships: string;
  drivers: string[];
  desc: string;
  engineNote: string;
}

export interface Driver {
  id: string;
  number: number;
  name: string;
  country: string;
  team: string;
  teamColor: string;
  championships: number;
  wins: string;
  poles: string;
  skill: number;
  racecraft: number;
  consistency: number;
  media: number;
  desc: string;
  mediaNote: string;
  seasons: string;
}

export interface DriverHistoryEra {
  year: string;
  title: string;
  context: string;
  changes: {
    team: string;
    out: string;
    in: string;
    reason: string;
  }[];
}

export interface ChampionshipRecord {
  year: number;
  driver: string;
  team2: string;
}

export interface PointsRow {
  pos: number;
  points: number;
}

export interface Race {
  round: number;
  flag: string;
  name: string;
  circuit: string;
  date: string;
  laps: number;
  length: string;
  lapRecord: string;
  drs: number;
  tags: string[];
  desc: string;
  cancelled?: boolean;
}

export interface GlossaryTerm {
  term: string;
  cat: string;
  catColor: string;
  def: string;
}

export interface F1Rule {
  icon: string;
  title: string;
  plain: string;
  example: string;
}

export interface CarCompareRow {
  aspect: string;
  icon: string;
  col2025: string;
  col2026: string;
  winner: number | null;
  note: string;
}

export interface RecordCategory {
  icon: string;
  title: string;
  rows: {
    rank: number;
    name: string;
    value: string;
    note: string;
  }[];
}

export interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  exp: string;
}

export interface ActiveDriver {
  name: string;
  team: string;
  color: string;
  short: string;
}

export interface ChampionshipSeason {
  title: string;
  drama: string;
  note: string;
  drivers: {
    name: string;
    short: string;
    color: string;
    team: string;
  }[];
  rounds: {
    label: string;
    points: number[];
  }[];
}

export interface H2HRow {
  team: string;
  color: string;
  d1: string;
  d2: string;
  qualiD1: number;
  qualiD2: number;
  raceD1: number;
  raceD2: number;
  note: string;
}

export interface TyreCompound {
  color: string;
  label: string;
}

export interface TyreStrategy {
  race: string;
  laps: number;
  desc: string;
  compounds: Record<string, TyreCompound>;
  strategies: {
    driver: string;
    stints: { c: string; laps: number }[];
  }[];
}

export interface TeamQuizOption {
  text: string;
  scores: Record<string, number>;
}

export interface TeamQuizQuestion {
  q: string;
  options: TeamQuizOption[];
}

export interface TeamQuizResult {
  name: string;
  emoji: string;
  color: string;
  desc: string;
}

export interface PowerRanking {
  pos: number;
  team: string;
  color: string;
  drivers: string;
  power: number;
  verdict: string;
  tag: string;
}

export interface RacePreview {
  round: number;
  flag: string;
  name: string;
  circuit: string;
  date: string;
  pick: string;
  pickColor: string;
  prediction: string;
  rating: string;
  watchFor: string;
  result?: boolean;
}

export interface Rookie {
  name: string;
  flag: string;
  team: string;
  color: string;
  number: number;
  age: number;
  background: string;
  potential: number;
  watchFor: string;
}

export interface NavSection {
  id: string;
  icon: string;
  label: string;
  desc: string;
}

export interface NavGroup {
  label: string;
  sections: NavSection[];
}

export interface SearchResult {
  type: string;
  title: string;
  sub: string;
  section: string;
  icon: string;
  color: string;
  extra?: string;
  keywords?: string;
}

export interface JolpicaRaceResult {
  number: string;
  position: string;
  Driver: {
    givenName: string;
    familyName: string;
    code?: string;
  };
  Constructor: {
    constructorId: string;
    name: string;
  };
  points: string;
  laps: string;
  status: string;
}

export interface JolpicaRace {
  round: string;
  raceName: string;
  date: string;
  Circuit: {
    circuitName: string;
  };
  Results: JolpicaRaceResult[];
}

export interface DriverStanding {
  pos: number;
  name: string;
  code: string;
  team: string;
  constructorId: string;
  pts: number;
  wins: number;
}

export interface ConstructorStanding {
  pos: number;
  name: string;
  constructorId: string;
  pts: number;
  wins: number;
}

export interface NewsItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  image: string;
}
