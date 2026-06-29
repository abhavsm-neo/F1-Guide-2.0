import { useState } from 'react';
import { CHAMPIONSHIP_SEASONS } from '../../data/championship';

export function ChampionshipTracker() {
  const [year, setYear] = useState<keyof typeof CHAMPIONSHIP_SEASONS>(2024);
  const season = CHAMPIONSHIP_SEASONS[year];

  const maxPts = Math.max(...season.rounds.flatMap(r => r.points));
  const svgW = 560, svgH = 280, padL = 46, padR = 20, padT = 20, padB = 30;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const rounds = season.rounds;
  const nRounds = rounds.length;

  const ptToX = (i: number) => padL + (i / (nRounds - 1)) * chartW;
  const ptToY = (v: number) => padT + chartH - (v / (maxPts * 1.05)) * chartH;

  return (
    <div>
      <div className="section-title">Championship <span>Battle</span></div>
      <div className="section-line" />
      <p className="section-intro" style={{ marginBottom: 16 }}>
        See how the World Drivers' Championship unfolded round by round. Select a season to relive the battle.
      </p>

      <div className="year-toggle">
        {([2021, 2022, 2023, 2024] as const).map(y => (
          <button key={y} className={`year-btn${year === y ? ' active' : ''}`} onClick={() => setYear(y)}>
            {y}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
          <span style={{ fontFamily: 'Orbitron', fontSize: 13, fontWeight: 900, color: 'var(--text)' }}>
            {year}: {season.title}
          </span>
          <span className="drama-badge">{season.drama}</span>
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.7 }}>{season.note}</p>
      </div>

      <div className="tracker-legend">
        {season.drivers.map(d => (
          <div key={d.short} className="tracker-legend-item">
            <div className="tracker-dot" style={{ background: d.color, boxShadow: `0 0 6px ${d.color}` }} />
            <span>{d.name}</span>
            <span style={{ fontSize: 10, color: 'var(--text4)' }}>({d.team})</span>
          </div>
        ))}
      </div>

      <div className="tracker-chart">
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', maxWidth: svgW }} role="img" aria-label={`Championship battle chart for ${year}`}>
          {[0, 0.25, 0.5, 0.75, 1].map(frac => {
            const y = ptToY(maxPts * 1.05 * frac);
            const val = Math.round(maxPts * 1.05 * frac);
            return (
              <g key={frac}>
                <line x1={padL} y1={y} x2={svgW - padR} y2={y} stroke="var(--border)" strokeWidth="1" strokeDasharray="4,4" />
                <text x={padL - 6} y={y} textAnchor="end" dominantBaseline="middle" style={{ fontSize: 9, fill: 'var(--text4)', fontFamily: 'Orbitron' }}>{val}</text>
              </g>
            );
          })}
          {rounds.map((r, i) => (
            <text key={i} x={ptToX(i)} y={svgH - 8} textAnchor="middle" style={{ fontSize: 9, fill: 'var(--text4)', fontFamily: 'Orbitron' }}>{r.label}</text>
          ))}
          {season.drivers.map((d, di) => {
            const pts = rounds.map((r, i) => ({ x: ptToX(i), y: ptToY(r.points[di]) }));
            const pathD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`).join(' ');
            return (
              <g key={d.short}>
                <path d={pathD} fill="none" stroke={d.color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"
                  style={{ filter: `drop-shadow(0 0 4px ${d.color})` }} />
                {pts.map((p, i) => (
                  <circle key={i} cx={p.x} cy={p.y} r="4" fill={d.color} stroke="var(--bg2)" strokeWidth="2" />
                ))}
                <text x={pts[pts.length - 1].x + 6} y={pts[pts.length - 1].y + 1} dominantBaseline="middle"
                  style={{ fontSize: 10, fontWeight: 700, fill: d.color, fontFamily: 'Orbitron' }}>{d.short}</text>
              </g>
            );
          })}
        </svg>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginTop: 16 }}>
        {season.drivers.map((d, di) => (
          <div key={d.short} className="card" style={{ textAlign: 'center', borderTop: `2px solid ${d.color}`, padding: '12px 8px' }}>
            <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: d.color, fontWeight: 700, marginBottom: 4 }}>{d.name}</div>
            <div style={{ fontFamily: 'Orbitron', fontSize: 20, fontWeight: 900, color: 'var(--text)' }}>{season.rounds[season.rounds.length - 1].points[di]}</div>
            <div style={{ fontSize: 9, color: 'var(--text4)', letterSpacing: 1 }}>POINTS</div>
          </div>
        ))}
      </div>
    </div>
  );
}
