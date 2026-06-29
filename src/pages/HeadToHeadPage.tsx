import { useState } from 'react';
import { H2H_DATA_2024 } from '../data/h2h';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';

export default function HeadToHeadPage() {
  const [metric, setMetric] = useState<'quali' | 'race'>('quali');

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="Teammate"
          accent="H2H"
          group="Stats"
          icon="⚔️"
          intro="Your teammate is your most controlled benchmark in F1 — same car, same conditions. These are the 2024 qualifying and race head-to-head records across all teams. 2025 & 2026 data will be added as the seasons complete."
        />
        <BookmarkButton sectionId="head-to-head" />
      </div>

      <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
        {[
          ['quali', 'Qualifying'] as const,
          ['race', 'Race Results'] as const,
        ].map(([k, l]) => (
          <button
            key={k}
            className={`year-btn${metric === k ? ' active' : ''}`}
            onClick={() => setMetric(k)}
            aria-pressed={metric === k}
          >
            {l}
          </button>
        ))}
      </div>

      {H2H_DATA_2024.map((row, i) => {
        const d1Count = metric === 'quali' ? row.qualiD1 : row.raceD1;
        const d2Count = metric === 'quali' ? row.qualiD2 : row.raceD2;
        const total = d1Count + d2Count;
        const p1 = ((d1Count / total) * 100).toFixed(0);
        const p2 = ((d2Count / total) * 100).toFixed(0);
        const winner = d1Count > d2Count ? row.d1 : d2Count > d1Count ? row.d2 : null;

        return (
          <div
            key={i}
            className="h2h-card"
            style={{ borderTop: `2px solid ${row.color}` }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 8,
                flexWrap: 'wrap',
                gap: 8,
              }}
            >
              <div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 10,
                  color: row.color,
                  letterSpacing: 1,
                  textShadow: `0 0 8px ${row.color}60`,
                  textTransform: 'uppercase',
                }}
              >
                {row.team}
              </div>
              {winner && (
                <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                  <span style={{ color: row.color, fontWeight: 700 }}>
                    {winner}
                  </span>{' '}
                  leads {metric === 'quali' ? 'qualifying' : 'races'}{' '}
                  {Math.max(d1Count, d2Count)}–
                  {Math.min(d1Count, d2Count)}
                </div>
              )}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 4,
                marginBottom: 6,
              }}
            >
              {[
                { name: row.d1, count: d1Count, pct: p1 },
                { name: row.d2, count: d2Count, pct: p2 },
              ].map((driver, di) => (
                <div
                  key={di}
                  style={{
                    fontSize: 13,
                    fontWeight: 700,
                    color: di === 0 ? row.color : 'var(--text2)',
                    textAlign: di === 0 ? 'left' : 'right',
                  }}
                >
                  {driver.name}{' '}
                  <span
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 16,
                      color: 'var(--text)',
                    }}
                  >
                    {driver.count}
                  </span>
                </div>
              ))}
            </div>
            <div className="h2h-bar-wrap">
              <div
                className="h2h-bar-left"
                style={{
                  width: `${p1}%`,
                  background: row.color,
                  boxShadow: `0 0 6px ${row.color}80`,
                }}
                aria-label={`${row.d1}: ${p1}%`}
              />
              <div
                className="h2h-bar-right"
                style={{ width: `${p2}%`, background: 'var(--border2)' }}
                aria-label={`${row.d2}: ${p2}%`}
              />
            </div>
            <div
              style={{
                fontSize: 11,
                color: 'var(--text4)',
                marginTop: 6,
                fontStyle: 'italic',
              }}
            >
              {row.note}
            </div>
          </div>
        );
      })}
    </div>
  );
}
