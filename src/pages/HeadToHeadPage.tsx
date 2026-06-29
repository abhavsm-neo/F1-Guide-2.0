import { useState } from 'react';
import { Swords } from 'lucide-react';
import { H2H_DATA_2024 } from '../data/h2h';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import styles from './HeadToHeadPage.module.css';

export default function HeadToHeadPage() {
  const [metric, setMetric] = useState<'quali' | 'race'>('quali');

  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <SectionHeader
          title="Teammate"
          accent="H2H"
          group="Stats"
          icon={Swords}
          intro="Your teammate is your most controlled benchmark in F1 — same car, same conditions. These are the 2024 qualifying and race head-to-head records across all teams. 2025 & 2026 data will be added as the seasons complete."
        />
        <BookmarkButton sectionId="head-to-head" />
      </div>

      <div className={styles.filterBar}>
        {[
          ['quali', 'Qualifying'] as const,
          ['race', 'Race Results'] as const,
        ].map(([k, l]) => (
          <button
            key={k}
            className={`${styles.filterBtn} ${metric === k ? styles.filterBtnActive : ''}`}
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
            className={styles.h2hCard}
            style={{ borderTopColor: row.color }}
          >
            <div className={styles.h2hHeader}>
              <div className={styles.teamLabel} style={{ color: row.color }}>
                {row.team}
              </div>
              {winner && (
                <div className={styles.winnerText}>
                  <span style={{ color: row.color, fontWeight: 700 }}>
                    {winner}
                  </span>{' '}
                  leads {metric === 'quali' ? 'qualifying' : 'races'}{' '}
                  {Math.max(d1Count, d2Count)}–
                  {Math.min(d1Count, d2Count)}
                </div>
              )}
            </div>
            <div className={styles.driverRow}>
              {[
                { name: row.d1, count: d1Count, pct: p1 },
                { name: row.d2, count: d2Count, pct: p2 },
              ].map((driver, di) => (
                <div
                  key={di}
                  className={styles.driverCell}
                  style={{
                    color: di === 0 ? row.color : 'var(--text-secondary)',
                    textAlign: di === 0 ? 'left' : 'right',
                  }}
                >
                  {driver.name}{' '}
                  <span className={styles.driverCount}>{driver.count}</span>
                </div>
              ))}
            </div>
            <div className={styles.barTrack}>
              <div
                className={styles.barLeft}
                style={{ width: `${p1}%`, background: row.color }}
                aria-label={`${row.d1}: ${p1}%`}
              />
              <div
                className={styles.barRight}
                style={{ width: `${p2}%`, background: 'var(--border-subtle)' }}
                aria-label={`${row.d2}: ${p2}%`}
              />
            </div>
            <div className={styles.note}>{row.note}</div>
          </div>
        );
      })}
    </div>
  );
}
