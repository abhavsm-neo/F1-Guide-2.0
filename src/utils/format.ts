const CIRCUIT_FLAGS: Record<string, string> = {
  'albert park': '🇦🇺', 'shanghai': '🇨🇳', 'bahrain': '🇧🇭', 'jeddah': '🇸🇦',
  'miami': '🇺🇸', 'imola': '🇮🇹', 'monaco': '🇲🇨', 'barcelona': '🇪🇸',
  'montreal': '🇨🇦', 'spielberg': '🇦🇹', 'silverstone': '🇬🇧', 'budapest': '🇭🇺',
  'spa': '🇧🇪', 'zandvoort': '🇳🇱', 'monza': '🇮🇹', 'baku': '🇦🇿',
  'singapore': '🇸🇬', 'suzuka': '🇯🇵', 'austin': '🇺🇸', 'mexico': '🇲🇽',
  'são paulo': '🇧🇷', 'las vegas': '🇺🇸', 'lusail': '🇶🇦', 'yas marina': '🇦🇪',
  'japanese': '🇯🇵', 'bahrain international': '🇧🇭', 'jeddah corniche': '🇸🇦',
  'miami international': '🇺🇸', 'gilles villeneuve': '🇨🇦', 'circuit de monaco': '🇲🇨',
  'circuit de barcelona-catalunya': '🇪🇸', 'red bull ring': '🇦🇹',
  'spa-francorchamps': '🇧🇪', 'hungaroring': '🇭🇺',
  'baku city circuit': '🇦🇿', 'marina bay': '🇸🇬', 'circuit of the americas': '🇺🇸',
  'hermanos rodríguez': '🇲🇽', 'interlagos': '🇧🇷', 'las vegas strip': '🇺🇸',
  'madrid street circuit': '🇪🇸', 'saudi': '🇸🇦', 'qatar': '🇶🇦',
};

export function circuitFlag(name = ''): string {
  const k = name.toLowerCase();
  for (const [key, val] of Object.entries(CIRCUIT_FLAGS)) {
    if (k.includes(key)) return val;
  }
  return '🏁';
}

export function formatGap(ms: number | null | undefined): string {
  if (!ms || ms === 0) return 'Winner';
  const s = Math.abs(ms / 1000);
  if (s < 60) return `+${s.toFixed(3)}s`;
  const m = Math.floor(s / 60);
  return `+${m}:${(s % 60).toFixed(3).padStart(6, '0')}`;
}

export function timeAgo(dateStr: string): string {
  const diff = (Date.now() - new Date(dateStr).getTime()) / 1000;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

export function pad(n: number): string {
  return String(n).padStart(2, '0');
}
