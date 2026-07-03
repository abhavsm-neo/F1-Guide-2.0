import { useState, useMemo } from 'react';
import { GitCompare, Trophy } from 'lucide-react';
import { DRIVERS_2025 } from '../data/drivers';
import { RadarChart } from '../components/charts/RadarChart';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import styles from './DriverComparePage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

interface AxisDef {
  label: string;
  key: 'skill' | 'racecraft' | 'consistency' | 'media';
}

const AXES: AxisDef[] = [
  { label: 'Raw Speed', key: 'skill' },
  { label: 'Racecraft', key: 'racecraft' },
  { label: 'Consistency', key: 'consistency' },
  { label: 'Media Appeal', key: 'media' },
];

export default function DriverComparePage() {
  const [id1, setId1] = useState('max');
  const [id2, setId2] = useState('norris');

  const d1 = useMemo(
    () => DRIVERS_2025.find((d) => d.id === id1) || DRIVERS_2025[0],
    [id1]
  );
  const d2 = useMemo(
    () => DRIVERS_2025.find((d) => d.id === id2) || DRIVERS_2025[1],
    [id2]
  );

  const total1 = d1.skill + d1.racecraft + d1.consistency + d1.media;
  const total2 = d2.skill + d2.racecraft + d2.consistency + d2.media;
  const winner = total1 > total2 ? d1 : total2 > total1 ? d2 : null;

  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Driver"
          accent="Compare"
          group="Tools"
          icon={GitCompare}
          intro="Pick any two drivers to compare their ratings head-to-head on the radar chart."
        />
        <BookmarkButton sectionId="driver-compare" />
      </div>

      <div className={styles.selectRow}>
        {[
          { id: id1, setId: setId1, which: 1 },
          { id: id2, setId: setId2, which: 2 },
        ].map(({ id, setId, which }) => {
          const d = DRIVERS_2025.find((dr) => dr.id === id) || DRIVERS_2025[0];
          return (
            <div key={which}>
              <div className={styles.selectLabel}>Driver {which}</div>
              <select
                className={styles.select}
                value={id}
                onChange={(e) => setId(e.target.value)}
                aria-label={`Select driver ${which}`}
              >
                {DRIVERS_2025.map((dr) => (
                  <option key={dr.id} value={dr.id}>
                    {dr.name} — {dr.team}
                  </option>
                ))}
              </select>
              {d && (
                <div
                  className={styles.driverCard}
                  style={{ borderColor: `${d.teamColor}44` }}
                >
                  <div className={styles.driverName} style={{ color: d.teamColor }}>
                    #{d.number} {d.name}
                  </div>
                  <div className={styles.driverMeta}>
                    {d.country} · {d.team}
                  </div>
                  <div className={styles.driverStats}>
                    <div className={styles.stat}>
                      <div className={styles.statValue} style={{ color: d.teamColor }}>
                        <Trophy size={12} /> {d.championships}
                      </div>
                      <div className={styles.statLabel}>Titles</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statValue} style={{ color: d.teamColor }}>
                        {d.wins}
                      </div>
                      <div className={styles.statLabel}>Wins</div>
                    </div>
                    <div className={styles.stat}>
                      <div className={styles.statValue} style={{ color: d.teamColor }}>
                        {d.poles}
                      </div>
                      <div className={styles.statLabel}>Poles</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {d1 && d2 && (
        <>
          <div className={styles.radarCard}>
            <div className={styles.legend}>
              <span className={styles.legendItem} style={{ color: d1.teamColor }}>
                <span className={styles.dot} style={{ background: d1.teamColor }} /> {d1.name}
              </span>
              <span className={styles.legendItem} style={{ color: d2.teamColor }}>
                <span className={styles.dot} style={{ background: d2.teamColor }} /> {d2.name}
              </span>
            </div>
            <div className={styles.radarWrap}>
              <RadarChart
                data={AXES.map((a) => ({ label: a.label, value: d1[a.key] }))}
                color={d1.teamColor}
                comparisonData={AXES.map((a) => ({ label: a.label, value: d2[a.key] }))}
                comparisonColor={d2.teamColor}
              />
            </div>
          </div>

          <div className={styles.barCard}>
            <div className={styles.barTitle}>Stat Breakdown</div>
            {AXES.map(({ label, key }) => {
              const total = d1[key] + d2[key];
              const pct1 = ((d1[key] / total) * 100).toFixed(0);
              const pct2 = ((d2[key] / total) * 100).toFixed(0);
              return (
                <div key={key} className={styles.barRow}>
                  <div className={styles.barLabels}>
                    <span style={{ color: d1.teamColor }}>{d1[key]}</span>
                    <span className={styles.barLabel}>{label}</span>
                    <span style={{ color: d2.teamColor }}>{d2[key]}</span>
                  </div>
                  <div className={styles.barTrack}>
                    <div
                      className={styles.barLeft}
                      style={{ width: `${pct1}%`, background: d1.teamColor }}
                      aria-label={`${d1.name} ${label}: ${pct1}%`}
                    />
                    <div
                      className={styles.barRight}
                      style={{ width: `${pct2}%`, background: d2.teamColor }}
                      aria-label={`${d2.name} ${label}: ${pct2}%`}
                    />
                  </div>
                </div>
              );
            })}

            <div
              className={styles.winnerCard}
              style={{
                background: winner ? `${winner.teamColor}12` : 'var(--bg-elevated)',
                borderColor: winner ? `${winner.teamColor}44` : 'var(--border-subtle)',
              }}
            >
              {winner ? (
                <>
                  <div className={styles.winnerLabel}>Overall Edge</div>
                  <div className={styles.winnerName} style={{ color: winner.teamColor }}>
                    {winner.name} +{Math.abs(total1 - total2)} pts
                  </div>
                </>
              ) : (
                <div className={styles.tieText}>Perfect tie — these two are identical on paper.</div>
              )}
            </div>
          </div>
        </>
      )}
    </PageReveal>
  );
}
