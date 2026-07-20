import { useState, useEffect, useCallback } from 'react';
import { Trophy, RotateCcw, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { SkeletonCards } from '../components/ui/SkeletonCards';
import { EmptyState } from '../components/ui/EmptyState';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import {
  fetchRaces,
  fetchDriverStandings,
  fetchConstructorStandings,
} from '../utils/api';
import { ergastColor } from '../utils/colors';
import type { JolpicaRace, DriverStanding, ConstructorStanding } from '../types';
import { CountUp } from '../components/ui/CountUp';
import styles from './ResultsPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

export default function ResultsPage() {
  const [races, setRaces] = useState<JolpicaRace[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const [year, setYear] = useState(2024);

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [racesData, drvData, ctorData] = await Promise.all([
        fetchRaces(year),
        fetchDriverStandings(year),
        fetchConstructorStandings(year),
      ]);
      // Filter to completed races (date is in the past), sort by round
      // descending, then take the first 3 = the most recently completed races.
      const now = new Date();
      const completedRaces = racesData
        .filter((r) => new Date(r.date) < now)
        .sort((a, b) => parseInt(b.round) - parseInt(a.round));
      const lastThree = completedRaces.slice(0, 3);
      setRaces(lastThree);
      if (lastThree.length > 0) setSelectedIdx(0);
      setDriverStandings(drvData);
      setConstructorStandings(ctorData);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [year]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);
  useAutoRefresh(loadAll, 90_000);

  const selectedRace = races[selectedIdx];
  const raceResults = selectedRace?.Results || [];
  const finishers = raceResults.filter(
    (r) => r.status === 'Finished' || r.status?.startsWith('+')
  );
  const dnfs = raceResults.filter(
    (r) => r.status !== 'Finished' && !r.status?.startsWith('+')
  );

  return (
    <PageReveal className={styles.page}>
      <SectionHeader
        title={`${year}`}
        accent="Results"
        group="Race & Stats"
        icon={Trophy}
        intro="Live race results, driver championship standings and constructor standings — powered by the API-Sports F1 API."
        sectionId="results"
      />

      <div className={styles.liveBar}>
        <div className={styles.liveBadge}>
          <div className={styles.liveDot} data-loading={loading} />
          <span className={styles.liveText}>LIVE · API-Sports F1 API</span>
        </div>
        {lastUpdated && (
          <span className={styles.lastUpdated}>
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
        <button
          className={styles.refreshBtn}
          onClick={loadAll}
          disabled={loading}
          aria-label="Refresh results"
        >
          <RotateCcw size={14} className={loading ? styles.spin : ''} /> Refresh
        </button>
      </div>

      {loading && <SkeletonCards count={4} />}

      {error && !loading && (
        <div className={styles.errorCard}>
          <AlertCircle size={32} className={styles.errorIcon} />
          <div className={styles.errorTitle}>DATA UNAVAILABLE</div>
          <p className={styles.errorMessage}>
            {error} — please try again shortly.
          </p>
          <button className={styles.retryBtn} onClick={loadAll}>
            RETRY
          </button>
        </div>
      )}

      {!loading && !error && races.length === 0 && (
        <EmptyState
          icon={Trophy}
          title={`NO COMPLETED RACES IN ${year}`}
          sub="Race results will appear here once races are completed. The API may be temporarily unavailable."
        />
      )}

      {!loading && !error && (
        <div className={styles.yearSelector}>
          {[2022, 2023, 2024, 2025, 2026].map((y) => (
            <button
              key={y}
              className={`${styles.yearBtn} ${year === y ? styles.yearBtnActive : ''}`}
              onClick={() => setYear(y)}
              aria-pressed={year === y}
            >
              {y}
            </button>
          ))}
        </div>
      )}

      {!loading && races.length > 0 && (
        <>
          <div className={styles.raceSelector}>
            <div className={styles.selectorLabel}>Last 3 Completed Races · {year}</div>
            <div className={styles.raceButtons}>
              {races.map((r, i) => (
                <button
                  key={r.round}
                  className={`${styles.raceBtn} ${selectedIdx === i ? styles.raceBtnActive : ''}`}
                  onClick={() => setSelectedIdx(i)}
                  aria-label={`Select race ${r.raceName}`}
                >
                  R<CountUp target={Number(r.round)} startOnMount />{' '}
                  {r.raceName.replace(' Grand Prix', '').replace(' Prix', '')}
                </button>
              ))}
            </div>
          </div>

          {selectedRace && (
            <div className={styles.raceCard}>
              <div className={styles.raceHeader}>
                <div className={styles.roundLabel}>Round <CountUp target={Number(selectedRace.round)} startOnMount /></div>
                <div className={styles.raceName}>{selectedRace.raceName}</div>
                <div className={styles.raceMeta}>
                  {selectedRace.Circuit?.circuitName} ·{' '}
                  {new Date(selectedRace.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
              </div>
            </div>
          )}

          {raceResults.length > 0 ? (
            <>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {['Pos', 'Driver', 'Team', 'Pts', 'Laps', 'Status'].map((h) => (
                        <th key={h} className={styles.th}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {finishers.map((row) => {
                      const cId = row.Constructor?.constructorId || '';
                      const col = ergastColor(cId);
                      const pos = parseInt(row.position, 10);
                      return (
                        <tr key={row.number} className={styles.tr}>
                          <td className={styles.td}>
                            <span
                              className={`${styles.posBadge} ${
                                pos === 1 ? styles.gold : pos === 2 ? styles.silver : pos === 3 ? styles.bronze : ''
                              }`}
                            >
                              <CountUp target={pos} />
                            </span>
                          </td>
                          <td className={styles.td}>
                            <div className={styles.driverName}>
                              {row.Driver.givenName} {row.Driver.familyName}
                            </div>
                            <div className={styles.driverCode}>
                              {row.Driver.code}
                            </div>
                          </td>
                          <td className={styles.td}>
                            <span
                              className={styles.teamBadge}
                              style={{
                                background: `${col}22`,
                                color: col,
                                borderColor: `${col}44`,
                              }}
                            >
                              {row.Constructor?.name}
                            </span>
                          </td>
                          <td className={`${styles.td} ${styles.pointsCell}`}>
                            <span className={pos <= 3 ? styles.topPoints : ''}>
                              {row.points ? <CountUp target={Number(row.points)} /> : '—'}
                            </span>
                          </td>
                          <td className={styles.td}><CountUp target={Number(row.laps) || 0} /></td>
                          <td className={styles.td}>
                            <span className={row.status === 'Finished' ? styles.finished : styles.statusText}>
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {dnfs.length > 0 && (
                <>
                  <div className={styles.sectionTitle}>Did Not <span>Finish</span></div>
                  <div className={styles.dnfGrid}>
                    {dnfs.map((d) => {
                      const col = ergastColor(d.Constructor?.constructorId || '');
                      return (
                        <div key={d.number} className={styles.dnfCard} style={{ borderLeftColor: col }}>
                          <div className={styles.dnfDriver}>
                            {d.Driver.givenName} {d.Driver.familyName}
                          </div>
                          <div className={styles.dnfTeam}>{d.Constructor?.name}</div>
                          <div className={styles.dnfMeta}>
                            {d.status} · <CountUp target={Number(d.laps) || 0} /> laps
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}
            </>
          ) : (
            !loading && (
              <div className={styles.noResults}>
                NO RESULTS FOR THIS RACE YET
              </div>
            )
          )}

          {driverStandings.length > 0 && (
            <>
              <div className={styles.sectionTitle}>Drivers' <span>Championship</span></div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {['Pos', 'Driver', 'Team', 'Wins', 'Pts'].map((h) => (
                        <th key={h} className={styles.thDark}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((row) => {
                      const col = ergastColor(row.constructorId);
                      const isTop3 = row.pos <= 3;
                      return (
                        <tr key={row.name} className={styles.tr}>
                          <td className={styles.td}>
                            <span
                              className={`${styles.posBadge} ${
                                row.pos === 1 ? styles.gold : row.pos === 2 ? styles.silver : row.pos === 3 ? styles.bronze : ''
                              }`}
                            >
                              <CountUp target={row.pos} />
                            </span>
                          </td>
                          <td className={styles.td}>
                            <div className={isTop3 ? styles.driverNameTop : styles.driverName}>
                              {row.name}
                            </div>
                            <div className={styles.driverCode}>{row.code}</div>
                          </td>
                          <td className={styles.td}>
                            <span
                              className={styles.teamBadge}
                              style={{
                                background: `${col}22`,
                                color: col,
                                borderColor: `${col}44`,
                              }}
                            >
                              {row.team}
                            </span>
                          </td>
                          <td className={`${styles.td} ${styles.monoCell}`}><CountUp target={row.wins} /></td>
                          <td className={`${styles.td} ${styles.pointsCell}`}>
                            <span className={isTop3 ? styles.topPoints : ''}><CountUp target={row.pts} /></span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {constructorStandings.length > 0 && (
            <>
              <div className={styles.sectionTitle}>Constructors' <span>Championship</span></div>
              <div className={styles.tableWrap}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      {['Pos', 'Constructor', 'Wins', 'Pts'].map((h) => (
                        <th key={h} className={styles.thDark}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {constructorStandings.map((row) => {
                      const col = ergastColor(row.constructorId);
                      const isTop3 = row.pos <= 3;
                      return (
                        <tr key={row.name} className={styles.tr}>
                          <td className={styles.td}>
                            <span
                              className={`${styles.posBadge} ${
                                row.pos === 1 ? styles.gold : row.pos === 2 ? styles.silver : row.pos === 3 ? styles.bronze : ''
                              }`}
                            >
                              <CountUp target={row.pos} />
                            </span>
                          </td>
                          <td className={styles.td}>
                            <span
                              className={styles.teamBadge}
                              style={{
                                background: `${col}22`,
                                color: col,
                                borderColor: `${col}44`,
                              }}
                            >
                              {row.name}
                            </span>
                          </td>
                          <td className={`${styles.td} ${styles.monoCell}`}><CountUp target={row.wins} /></td>
                          <td className={`${styles.td} ${styles.pointsCell}`}>
                            <span className={isTop3 ? styles.topPoints : ''}><CountUp target={row.pts} /></span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div className={styles.footerNote}>
                After {races.length} of 22 rounds · Data via API-Sports F1 API
              </div>
            </>
          )}
        </>
      )}
    </PageReveal>
  );
}
