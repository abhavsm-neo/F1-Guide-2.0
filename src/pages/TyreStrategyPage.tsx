import { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { TYRE_STRATEGIES } from '../data/tyre_strategy';

export default function TyreStrategyPage() {
  const [raceIdx, setRaceIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const race = TYRE_STRATEGIES[raceIdx];

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <SectionHeader
          title="Tyre"
          accent="Strategy"
          group="Race & Stats"
          icon="🏎"
          intro="Tyre strategy is one of the most complex parts of F1. Teams choose when to pit and which compounds to use to gain time over rivals. Each horizontal bar shows a driver's stint — the length represents laps on that tyre."
        />
        <BookmarkButton sectionId="tyrestrategy" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {TYRE_STRATEGIES.map((r, i) => (
          <button
            key={i}
            className={`year-btn${raceIdx === i ? ' active' : ''}`}
            onClick={() => setRaceIdx(i)}
            style={{ fontSize: 10 }}
            aria-label={`Select ${r.race}`}
            aria-pressed={raceIdx === i}
          >
            {r.race}
          </button>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: 13, fontWeight: 900, color: 'var(--text)', marginBottom: 6 }}>
          {race.race}
        </div>
        <p style={{ fontSize: 12, color: 'var(--text3)', lineHeight: 1.7 }}>{race.desc}</p>
      </div>

      {/* Tyre legend */}
      <div className="tyre-legend">
        {Object.entries(race.compounds).map(([key, val]) => (
          <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text2)' }}>
            <div
              className="tyre-dot"
              style={{ background: val.color, border: key === 'H' ? '1px solid #aaa' : 'none' }}
              aria-hidden="true"
            />
            {val.label}
          </div>
        ))}
      </div>

      {/* Lap numbers header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <div
          style={{
            width: 140,
            fontSize: 9,
            color: 'var(--text4)',
            fontFamily: 'Orbitron',
            letterSpacing: 1,
            textAlign: 'right',
          }}
        >
          DRIVER
        </div>
        <div style={{ flex: 1, position: 'relative', height: 14 }}>
          {[0, 0.25, 0.5, 0.75, 1].map(f => (
            <div
              key={f}
              style={{
                position: 'absolute',
                left: `${f * 100}%`,
                fontSize: 9,
                color: 'var(--text4)',
                fontFamily: 'Orbitron',
                transform: 'translateX(-50%)',
              }}
            >
              {Math.round(f * race.laps)}
            </div>
          ))}
        </div>
      </div>

      {race.strategies.map((strat, si) => (
        <div key={si} className="strategy-row">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: 140,
                fontSize: 11,
                color: 'var(--text2)',
                textAlign: 'right',
                flexShrink: 0,
                paddingRight: 8,
              }}
            >
              {strat.driver}
            </div>
            <div className="strategy-track" style={{ flex: 1 }}>
              {strat.stints.map((stint, stintIdx) => {
                const comp = race.compounds[stint.c];
                const pct = (stint.laps / race.laps) * 100;
                const isHovered = hovered === `${si}-${stintIdx}`;
                return (
                  <div
                    key={stintIdx}
                    className="strategy-seg"
                    style={{
                      width: `${pct}%`,
                      background: comp.color,
                      minWidth: 24,
                      color: comp.color === '#f0f0f0' ? '#333' : '#000',
                      boxShadow: isHovered ? `0 0 12px ${comp.color}` : 'none',
                      position: 'relative',
                    }}
                    onMouseEnter={() => setHovered(`${si}-${stintIdx}`)}
                    onMouseLeave={() => setHovered(null)}
                    title={`${comp.label} — ${stint.laps} laps`}
                    aria-label={`${comp.label} — ${stint.laps} laps`}
                  >
                    {stint.laps >= 8 ? stint.c : ''}
                    {isHovered && (
                      <div
                        style={{
                          position: 'absolute',
                          bottom: '110%',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'var(--bg2)',
                          border: `1px solid ${comp.color}`,
                          borderRadius: 4,
                          padding: '4px 8px',
                          zIndex: 10,
                          whiteSpace: 'nowrap',
                          fontSize: 10,
                          color: 'var(--text)',
                          pointerEvents: 'none',
                        }}
                      >
                        {comp.label} · {stint.laps} laps
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}

      <div className="card" style={{ marginTop: 20 }}>
        <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: '#e10600', letterSpacing: 2, marginBottom: 10 }}>
          KEY CONCEPTS
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
          {[
            ['Undercut', 'Pitting before your rival to gain track position with fresh tyres'],
            ['Overcut', 'Staying out longer on old tyres while rivals pit, then pitting yourself'],
            ['Tyre Cliff', 'When a tyre suddenly loses grip rapidly after extended use'],
            ['Free Stop', 'Pitting under a safety car without losing track position vs rivals'],
          ].map(([term, def]) => (
            <div key={term} style={{ borderLeft: '2px solid #e10600', paddingLeft: 10 }}>
              <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: '#e10600', marginBottom: 3 }}>{term}</div>
              <div style={{ fontSize: 11, color: 'var(--text3)', lineHeight: 1.6 }}>{def}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
