import { useState } from 'react';
import { Gauge } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { TYRE_STRATEGIES } from '../data/tyre_strategy';
import styles from './TyreStrategyPage.module.css';

export default function TyreStrategyPage() {
  const [raceIdx, setRaceIdx] = useState(0);
  const [hovered, setHovered] = useState<string | null>(null);
  const race = TYRE_STRATEGIES[raceIdx];

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Tyre"
          accent="Strategy"
          group="Race & Stats"
          icon={Gauge}
          intro="Tyre strategy is one of the most complex parts of F1. Teams choose when to pit and which compounds to use to gain time over rivals. Each horizontal bar shows a driver's stint — the length represents laps on that tyre."
        />
        <BookmarkButton sectionId="tyrestrategy" />
      </div>

      <div className={styles.raceButtons}>
        {TYRE_STRATEGIES.map((r, i) => (
          <button
            key={i}
            className={[styles.raceBtn, raceIdx === i ? styles.raceBtnActive : ''].join(' ')}
            onClick={() => setRaceIdx(i)}
            style={{ fontSize: 'var(--text-xs)' }}
            aria-label={`Select ${r.race}`}
            aria-pressed={raceIdx === i}
          >
            {r.race}
          </button>
        ))}
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoTitle}>{race.race}</div>
        <p className={styles.infoDesc}>{race.desc}</p>
      </div>

      {/* Tyre legend */}
      <div className={styles.legend}>
        {Object.entries(race.compounds).map(([key, val]) => (
          <div key={key} className={styles.legendItem}>
            <div
              className={styles.legendDot}
              style={{ background: val.color, border: key === 'H' ? '1px solid var(--border-active)' : 'none' }}
              aria-hidden="true"
            />
            {val.label}
          </div>
        ))}
      </div>

      {/* Lap numbers header */}
      <div className={styles.trackHeader}>
        <div className={styles.driverLabel}>DRIVER</div>
        <div className={styles.lapNumbers}>
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <div
              key={f}
              className={styles.lapNumber}
              style={{ left: `${f * 100}%` }}
            >
              {Math.round(f * race.laps)}
            </div>
          ))}
        </div>
      </div>

      {race.strategies.map((strat, si) => (
        <div key={si} className={styles.strategyRow}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div className={styles.driverName}>{strat.driver}</div>
            <div className={styles.strategyTrack}>
              {strat.stints.map((stint, stintIdx) => {
                const comp = race.compounds[stint.c];
                const pct = (stint.laps / race.laps) * 100;
                const isHovered = hovered === `${si}-${stintIdx}`;
                return (
                  <div
                    key={stintIdx}
                    className={styles.strategySeg}
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
                        className={styles.tooltip}
                        style={{ borderColor: comp.color }}
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

      <div className={styles.infoCard}>
        <div className={styles.conceptsTitle}>KEY CONCEPTS</div>
        <div className={styles.conceptsGrid}>
          {[
            ['Undercut', 'Pitting before your rival to gain track position with fresh tyres'],
            ['Overcut', 'Staying out longer on old tyres while rivals pit, then pitting yourself'],
            ['Tyre Cliff', 'When a tyre suddenly loses grip rapidly after extended use'],
            ['Free Stop', 'Pitting under a safety car without losing track position vs rivals'],
          ].map(([term, def]) => (
            <div key={term} className={styles.conceptCard}>
              <div className={styles.conceptTerm}>{term}</div>
              <div className={styles.conceptDef}>{def}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
