export const TEAM_COLORS: Record<string, string> = {
  mercedes: '#27F4D2',
  ferrari: '#E8002D',
  'red bull racing': '#3671C6',
  mclaren: '#FF8000',
  'aston martin': '#229971',
  alpine: '#0093CC',
  williams: '#64C4FF',
  haas: '#B6BABD',
  rb: '#6692FF',
  'racing bulls': '#6692FF',
  kick: '#52E252',
  sauber: '#52E252',
  cadillac: '#CC0000',
  audi: '#BB0A21',
};

export function teamColor(name = ''): string {
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(TEAM_COLORS)) {
    if (k.includes(key)) return val;
  }
  return '#888';
}

export function ergastColor(constructorId: string): string {
  const MAP: Record<string, string> = {
    red_bull: '#3671C6',
    ferrari: '#E8002D',
    mercedes: '#27F4D2',
    mclaren: '#FF8000',
    aston_martin: '#229971',
    alpine: '#0093CC',
    williams: '#64C4FF',
    haas: '#B6BABD',
    kick_sauber: '#52E252',
    rb: '#6692FF',
    alphatauri: '#6692FF',
  };
  return MAP[constructorId] || '#aaa';
}

export const PODIUM_COLORS = ['#FFD700', '#C0C0C0', '#CD7F32'];
