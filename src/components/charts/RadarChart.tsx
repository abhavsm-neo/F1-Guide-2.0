import type { Driver } from '../../types';

interface RadarChartProps {
  d1: Driver | null;
  d2: Driver | null;
  color1?: string;
  color2?: string;
}

export function RadarChart({ d1, d2, color1 = '#e10600', color2 = '#3671C6' }: RadarChartProps) {
  const axes = [
    { label: 'Speed', key: 'skill' as const },
    { label: 'Racecraft', key: 'racecraft' as const },
    { label: 'Consistency', key: 'consistency' as const },
    { label: 'Media', key: 'media' as const },
  ];
  const cx = 130, cy = 130, r = 95;
  const n = axes.length;

  const toXY = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ratio = val / 100;
    return { x: cx + r * ratio * Math.cos(angle), y: cy + r * ratio * Math.sin(angle) };
  };

  const labelXY = (i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return { x: cx + (r + 22) * Math.cos(angle), y: cy + (r + 22) * Math.sin(angle) };
  };

  const polygon = (driver: Driver) =>
    axes.map((a, i) => {
      const pt = toXY(driver[a.key], i);
      return `${pt.x},${pt.y}`;
    }).join(' ');

  return (
    <svg width="260" height="260" style={{ overflow: 'visible' }} role="img" aria-label="Radar chart comparing driver ratings">
      {[0.25, 0.5, 0.75, 1].map(frac => (
        <polygon
          key={frac}
          points={axes.map((_, i) => { const p = toXY(100 * frac, i); return `${p.x},${p.y}`; }).join(' ')}
          fill="none"
          stroke="var(--border)"
          strokeWidth="1"
        />
      ))}
      {axes.map((_, i) => {
        const p = toXY(100, i);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--border)" strokeWidth="1" />;
      })}
      {d2 && <polygon points={polygon(d2)} fill={color2 + '30'} stroke={color2} strokeWidth="2" strokeLinejoin="round" />}
      {d1 && <polygon points={polygon(d1)} fill={color1 + '30'} stroke={color1} strokeWidth="2.5" strokeLinejoin="round" />}
      {axes.map((a, i) => {
        const lp = labelXY(i);
        return (
          <text key={i} x={lp.x} y={lp.y} textAnchor="middle" dominantBaseline="middle"
            style={{ fontSize: 10, fontFamily: 'Orbitron, sans-serif', fill: 'var(--text3)', letterSpacing: 1 }}>
            {a.label.toUpperCase()}
          </text>
        );
      })}
    </svg>
  );
}
