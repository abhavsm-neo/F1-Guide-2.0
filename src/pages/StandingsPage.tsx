import { useState, useEffect, useMemo, useCallback } from 'react';
import { BarChart3, RotateCcw, Trophy, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SkeletonCards } from '../components/ui/SkeletonCards';
import { EmptyState } from '../components/ui/EmptyState';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import {
  fetchDriverStandings,
  fetchConstructorStandings,
} from '../utils/api';
import { ergastColor, PODIUM_COLORS } from '../utils/colors';
import type { DriverStanding, ConstructorStanding } from '../types';
import styles from './StandingsPage.module.css';

export default function StandingsPage() {
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const YEAR = new Date().getFullYear();

  const loadStandings = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [drvData, ctorData] = await Promise.all([
        fetchDriverStandings(YEAR),
        fetchConstructorStandings(YEAR),
      ]);
      setDriverStandings(drvData);
      setConstructorStandings(ctorData);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load standings');
    } finally {
      setLoading(false);
    }
  }, [YEAR]);

  useEffect(() => {
    loadStandings();
  }, [loadStandings]);
  useAutoRefresh(loadStandings, 60_000);

  const maxDriverPts = useMemo(() => driverStandings[0]?.pts || 1, [driverStandings]);
  const maxCtorPts = useMemo(() => constructorStandings[0]?.pts || 1, [constructorStandings]);

  return (
    <div className={styles.page}>
      <SectionHeader
        title={`${YEAR}`}
        accent="Live Standings"
        group="Race & Stats"
        icon={BarChart3}
        intro={`Current ${YEAR} World Drivers' and Constructors' Championship standings — always up to date.`}
        sectionId="standings"
      />

      <div className={styles.liveBar}>
        <div className={styles.liveBadge}>
          <div className={styles.liveDot} data-loading={loading} />
          <span className={styles.liveText}>LIVE · Jolpica F1 API</span>
        </div>
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
        <button
          className={styles.refreshBtn}
          onClick={loadStandings}
          disabled={loading}
          aria-label="Refresh standings"
        >
          <RotateCcw size={14} className={loading ? styles.spin : ''} /> Refresh
        </button>
      </div>

      {loading && (
        <div className={styles.skeletonGrid}>
          <SkeletonCards count={4} />
          <SkeletonCards count={4} />
        </div>
      )}

      {error && !loading && (
        <div className={styles.errorCard}>
          <AlertCircle size={32} className={styles.errorIcon} />
          <div className={styles.errorTitle}>STANDINGS UNAVAILABLE</div>
          <p className={styles.errorMessage}>{error}</p>
          <button className={styles.retryBtn} onClick={loadStandings}>
            RETRY
          </button>
        </div>
      )}

      {!loading && !error && driverStandings.length === 0 && (
        <EmptyState
          icon={BarChart3}
          title={`NO STANDINGS YET FOR ${YEAR}`}
          sub="Standings will appear after the first race of the season."
        />
      )}

      {!loading && driverStandings.length > 0 && (
        <div className={styles.grid}>
          <div>
            <div className={styles.sectionTitle}>
              Drivers' <span>Championship</span>
            </div>
            <div className={styles.list}>
              {driverStandings.map((row) => {
                const col = ergastColor(row.constructorId);
                const pct = ((row.pts / maxDriverPts) * 100).toFixed(1);
                const isTop3 = row.pos <= 3;
                return (
                  <div
                    key={row.name}
                    className={styles.card}
                    style={{ borderLeftColor: isTop3 ? PODIUM_COLORS[row.pos - 1] : col }}
                  >
                    <div className={styles.cardHeader}>
                      <span
                        className={styles.position}
                        style={{ color: isTop3 ? PODIUM_COLORS[row.pos - 1] : 'var(--text-tertiary)' }}
                      >
                        {row.pos}
                      </span>
                      <div className={styles.driverInfo}>
                        <div className={styles.driverName}>{row.name}</div>
                        <div className={styles.driverMeta}>
                          <span
                            className={styles.teamBadge}
                            style={{ background: `${col}22`, color: col, borderColor: `${col}44` }}
                          >
                            {row.team}
                          </span>
                          {row.wins > 0 && (
                            <span className={styles.winBadge}>
                              <Trophy size={10} /> {row.wins}W
                            </span>
                          )}
                        </div>
                      </div>
                      <div className={styles.points}>
                        <span className={isTop3 ? styles.topPoints : ''}>{row.pts}</span>
                      </div>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${pct}%`,
                          background: isTop3
                            ? `linear-gradient(90deg, ${PODIUM_COLORS[row.pos - 1]}, ${col})`
                            : col,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <div className={styles.sectionTitle}>
              Constructors' <span>Championship</span>
            </div>
            <div className={styles.list}>
              {constructorStandings.map((row) => {
                const col = ergastColor(row.constructorId);
                const pct = ((row.pts / maxCtorPts) * 100).toFixed(1);
                const isTop3 = row.pos <= 3;
                return (
                  <div
                    key={row.name}
                    className={styles.card}
                    style={{ borderLeftColor: isTop3 ? PODIUM_COLORS[row.pos - 1] : col }}
                  >
                    <div className={styles.cardHeader}>
                      <span
                        className={styles.position}
                        style={{ color: isTop3 ? PODIUM_COLORS[row.pos - 1] : 'var(--text-tertiary)' }}
                      >
                        {row.pos}
                      </span>
                      <div className={styles.driverInfo}>
                        <div className={styles.ctorName} style={{ color: col }}>
                          {row.name}
                        </div>
                        {row.wins > 0 && (
                          <div className={styles.winBadge}>
                            <Trophy size={10} /> {row.wins} win{row.wins !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div className={styles.points}>
                        <span className={isTop3 ? styles.topPoints : ''}>{row.pts}</span>
                      </div>
                    </div>
                    <div className={styles.barTrack}>
                      <div
                        className={styles.barFill}
                        style={{
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${col}, ${col}bb)`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={styles.footerNote}>
              Data via Jolpica F1 API ·{' '}
              {lastUpdated ? `Updated ${lastUpdated.toLocaleTimeString()}` : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
