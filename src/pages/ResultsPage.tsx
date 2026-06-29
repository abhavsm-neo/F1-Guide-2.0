import { useState, useEffect, useCallback } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
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

export default function ResultsPage() {
  const [races, setRaces] = useState<JolpicaRace[]>([]);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [driverStandings, setDriverStandings] = useState<DriverStanding[]>([]);
  const [constructorStandings, setConstructorStandings] = useState<ConstructorStanding[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  const YEAR = new Date().getFullYear();

  const loadAll = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [racesData, drvData, ctorData] = await Promise.all([
        fetchRaces(YEAR),
        fetchDriverStandings(YEAR),
        fetchConstructorStandings(YEAR),
      ]);
      setRaces(racesData);
      if (racesData.length > 0) setSelectedIdx(racesData.length - 1);
      setDriverStandings(drvData);
      setConstructorStandings(ctorData);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  }, [YEAR]);

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

  const thStyleDark: React.CSSProperties = {
    background: 'var(--bg3)',
    color: '#e10600',
    padding: '8px 12px',
    fontFamily: 'Orbitron',
    fontSize: 10,
    letterSpacing: 2,
    textTransform: 'uppercase',
    textAlign: 'left',
  };

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title={`${YEAR}`}
          accent="Results"
          group="Race & Stats"
          icon="🏆"
          intro="Live race results, driver championship standings and constructor standings — powered by the Jolpica F1 API."
        />
        <BookmarkButton sectionId="results" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            background: 'rgba(0,220,120,0.08)',
            border: '1px solid rgba(0,220,120,0.25)',
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: loading ? '#666' : '#00dc78',
              boxShadow: loading ? 'none' : '0 0 6px #00dc78',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: '#00dc78',
              fontFamily: 'Orbitron',
              letterSpacing: 1,
            }}
          >
            LIVE · Jolpica F1 API
          </span>
        </div>
        {lastUpdated && (
          <span style={{ fontSize: 10, color: 'var(--text4)' }}>
            Updated {lastUpdated.toLocaleTimeString()}
          </span>
        )}
        <button
          onClick={loadAll}
          disabled={loading}
          style={{
            marginLeft: 'auto',
            padding: '6px 14px',
            background: 'transparent',
            border: '1px solid var(--border2)',
            color: 'var(--text3)',
            fontFamily: 'Orbitron',
            fontSize: 9,
            letterSpacing: 2,
            cursor: loading ? 'wait' : 'pointer',
            borderRadius: 20,
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#e10600';
            e.currentTarget.style.color = 'var(--text)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '';
            e.currentTarget.style.color = 'var(--text3)';
          }}
          aria-label="Refresh results"
        >
          <span className={loading ? 'spin' : ''}>↻</span> Refresh
        </button>
      </div>

      {loading && <SkeletonCards count={4} />}

      {error && !loading && (
        <div
          className="card"
          style={{
            borderLeft: '3px solid #e10600',
            padding: 24,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📡</div>
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 11,
              color: '#e10600',
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            DATA UNAVAILABLE
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text3)',
              lineHeight: 1.7,
              marginBottom: 14,
            }}
          >
            {error} — please try again shortly.
          </p>
          <button
            onClick={loadAll}
            style={{
              padding: '8px 18px',
              background: '#e10600',
              border: 'none',
              color: '#fff',
              fontFamily: 'Orbitron',
              fontSize: 9,
              letterSpacing: 2,
              cursor: 'pointer',
              borderRadius: 20,
            }}
          >
            RETRY
          </button>
        </div>
      )}

      {!loading && !error && races.length === 0 && (
        <EmptyState
          icon="🏆"
          title={`NO RACES YET IN ${YEAR}`}
          sub="Race data will appear here once the season begins."
        />
      )}

      {!loading && races.length > 0 && (
        <>
          {/* Race selector */}
          <div style={{ marginBottom: 20 }}>
            <div
              style={{
                fontSize: 10,
                color: 'var(--text3)',
                fontFamily: 'Orbitron',
                letterSpacing: 2,
                textTransform: 'uppercase',
                marginBottom: 10,
              }}
            >
              Select Race
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
              {races.map((r, i) => (
                <button
                  key={r.round}
                  onClick={() => setSelectedIdx(i)}
                  style={{
                    padding: '5px 10px',
                    borderRadius: 2,
                    cursor: 'pointer',
                    fontFamily: 'Orbitron',
                    fontSize: 9,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                    transition: 'all 0.2s',
                    background: selectedIdx === i ? '#e10600' : 'transparent',
                    border: `1px solid ${selectedIdx === i ? '#e10600' : 'var(--border2)'}`,
                    color: selectedIdx === i ? '#fff' : '#888',
                  }}
                  aria-label={`Select race ${r.raceName}`}
                >
                  R{r.round}{' '}
                  {r.raceName.replace(' Grand Prix', '').replace(' Prix', '')}
                </button>
              ))}
            </div>
          </div>

          {/* Selected race header */}
          {selectedRace && (
            <div
              className="card"
              style={{ marginBottom: 20, borderLeft: '3px solid #e10600' }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron',
                    fontSize: 11,
                    color: '#e10600',
                    letterSpacing: 2,
                    textTransform: 'uppercase',
                  }}
                >
                  Round {selectedRace.round}
                </div>
                <div
                  style={{
                    fontFamily: 'Orbitron',
                    fontSize: 14,
                    fontWeight: 700,
                    color: 'var(--text)',
                  }}
                >
                  {selectedRace.raceName}
                </div>
                <div style={{ marginLeft: 'auto', fontSize: 11, color: 'var(--text3)' }}>
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

          {/* Results table */}
          {raceResults.length > 0 ? (
            <>
              <div style={{ overflowX: 'auto', marginBottom: 24 }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: 480,
                  }}
                >
                  <thead>
                    <tr>
                      {['Pos', 'Driver', 'Team', 'Pts', 'Laps', 'Status'].map(
                        (h) => (
                          <th
                            key={h}
                            style={{
                              background: '#e10600',
                              color: '#fff',
                              padding: '9px 12px',
                              textAlign: 'left',
                              fontFamily: 'Orbitron',
                              fontSize: 10,
                              letterSpacing: 2,
                              textTransform: 'uppercase',
                            }}
                          >
                            {h}
                          </th>
                        )
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {finishers.map((row) => {
                      const cId = row.Constructor?.constructorId || '';
                      const col = ergastColor(cId);
                      return (
                        <tr
                          key={row.number}
                          style={{ borderBottom: '1px solid var(--border)' }}
                        >
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              className={`pos-badge${
                                row.position === '1'
                                  ? ' p1'
                                  : row.position === '2'
                                    ? ' p2'
                                    : row.position === '3'
                                      ? ' p3'
                                      : ''
                              }`}
                            >
                              {row.position}
                            </span>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <div
                              style={{
                                fontWeight: 700,
                                color: 'var(--text)',
                                fontSize: 13,
                              }}
                            >
                              {row.Driver.givenName} {row.Driver.familyName}
                            </div>
                            <div
                              style={{
                                fontSize: 10,
                                color: 'var(--text3)',
                                marginTop: 1,
                                fontFamily: 'Orbitron',
                              }}
                            >
                              {row.Driver.code}
                            </div>
                          </td>
                          <td style={{ padding: '10px 12px' }}>
                            <span
                              style={{
                                background: col + '22',
                                color: col,
                                border: `1px solid ${col}44`,
                                padding: '3px 8px',
                                borderRadius: 2,
                                fontSize: 10,
                                fontWeight: 700,
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {row.Constructor?.name}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              fontFamily: 'Orbitron',
                              fontWeight: 700,
                              color: parseInt(row.position) <= 3 ? '#e10600' : '#aaa',
                              fontSize: 13,
                            }}
                          >
                            {row.points || '—'}
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              fontSize: 12,
                              color: 'var(--text3)',
                            }}
                          >
                            {row.laps}
                          </td>
                          <td
                            style={{
                              padding: '10px 12px',
                              fontSize: 11,
                              color:
                                row.status === 'Finished' ? '#00dc78' : 'var(--text3)',
                            }}
                          >
                            {row.status}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {dnfs.length > 0 && (
                <>
                  <div
                    className="section-title"
                    style={{
                      fontSize: 'clamp(13px,3vw,18px)',
                      marginBottom: 8,
                    }}
                  >
                    Did Not <span>Finish</span>
                  </div>
                  <div className="section-line" />
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns:
                        'repeat(auto-fill, minmax(min(100%,260px),1fr))',
                      gap: 10,
                      marginBottom: 32,
                    }}
                  >
                    {dnfs.map((d) => {
                      const col = ergastColor(d.Constructor?.constructorId || '');
                      return (
                        <div
                          key={d.number}
                          style={{
                            background: 'var(--card-bg)',
                            border: '1px solid var(--border)',
                            borderLeft: `3px solid ${col}`,
                            padding: '12px 14px',
                            borderRadius: 2,
                          }}
                        >
                          <div
                            style={{
                              fontWeight: 700,
                              color: 'var(--text)',
                              fontSize: 13,
                              marginBottom: 4,
                            }}
                          >
                            {d.Driver.givenName} {d.Driver.familyName}
                          </div>
                          <div
                            style={{
                              fontSize: 10,
                              color: 'var(--text3)',
                              textTransform: 'uppercase',
                              letterSpacing: 1,
                              marginBottom: 4,
                            }}
                          >
                            {d.Constructor?.name}
                          </div>
                          <div style={{ fontSize: 11, color: 'var(--text3)' }}>
                            {d.status} · {d.laps} laps
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
              <div
                className="card"
                style={{ textAlign: 'center', padding: 32, marginBottom: 24 }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron',
                    fontSize: 10,
                    color: 'var(--text3)',
                    letterSpacing: 2,
                  }}
                >
                  NO RESULTS FOR THIS RACE YET
                </div>
              </div>
            )
          )}

          {/* Driver Championship Standings */}
          {driverStandings.length > 0 && (
            <>
              <div
                className="section-title"
                style={{
                  fontSize: 'clamp(13px,3vw,18px)',
                  marginBottom: 8,
                }}
              >
                Drivers' <span>Championship</span>
              </div>
              <div className="section-line" />
              <div style={{ overflowX: 'auto', marginBottom: 24 }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: 360,
                  }}
                >
                  <thead>
                    <tr>
                      {['Pos', 'Driver', 'Team', 'Wins', 'Pts'].map((h) => (
                        <th key={h} style={thStyleDark}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {driverStandings.map((row) => {
                      const col = ergastColor(row.constructorId);
                      return (
                        <tr
                          key={row.name}
                          style={{ borderBottom: '1px solid var(--border)' }}
                        >
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              className={`pos-badge${
                                row.pos === 1
                                  ? ' p1'
                                  : row.pos === 2
                                    ? ' p2'
                                    : row.pos === 3
                                      ? ' p3'
                                      : ''
                              }`}
                            >
                              {row.pos}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <div
                              style={{
                                fontSize: 13,
                                color: row.pos <= 3 ? '#fff' : '#bbb',
                                fontWeight: row.pos <= 3 ? 700 : 400,
                              }}
                            >
                              {row.name}
                            </div>
                            <div
                              style={{
                                fontSize: 9,
                                color: 'var(--text4)',
                                fontFamily: 'Orbitron',
                                letterSpacing: 1,
                              }}
                            >
                              {row.code}
                            </div>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              style={{
                                background: col + '22',
                                color: col,
                                border: `1px solid ${col}44`,
                                padding: '2px 7px',
                                borderRadius: 2,
                                fontSize: 10,
                                fontWeight: 700,
                              }}
                            >
                              {row.team}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontFamily: 'Orbitron',
                              fontSize: 12,
                              color: 'var(--text3)',
                            }}
                          >
                            {row.wins}
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontFamily: 'Orbitron',
                              fontWeight: 700,
                              fontSize: 13,
                              color: row.pos <= 3 ? '#e10600' : '#aaa',
                            }}
                          >
                            {row.pts}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </>
          )}

          {/* Constructor Championship Standings */}
          {constructorStandings.length > 0 && (
            <>
              <div
                className="section-title"
                style={{
                  fontSize: 'clamp(13px,3vw,18px)',
                  marginBottom: 8,
                }}
              >
                Constructors' <span>Championship</span>
              </div>
              <div className="section-line" />
              <div style={{ overflowX: 'auto', marginBottom: 8 }}>
                <table
                  style={{
                    width: '100%',
                    borderCollapse: 'collapse',
                    minWidth: 300,
                  }}
                >
                  <thead>
                    <tr>
                      {['Pos', 'Constructor', 'Wins', 'Pts'].map((h) => (
                        <th key={h} style={thStyleDark}>
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {constructorStandings.map((row) => {
                      const col = ergastColor(row.constructorId);
                      return (
                        <tr
                          key={row.name}
                          style={{ borderBottom: '1px solid var(--border)' }}
                        >
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              className={`pos-badge${
                                row.pos === 1
                                  ? ' p1'
                                  : row.pos === 2
                                    ? ' p2'
                                    : row.pos === 3
                                      ? ' p3'
                                      : ''
                              }`}
                            >
                              {row.pos}
                            </span>
                          </td>
                          <td style={{ padding: '8px 12px' }}>
                            <span
                              style={{
                                background: col + '22',
                                color: col,
                                border: `1px solid ${col}44`,
                                padding: '2px 10px',
                                borderRadius: 2,
                                fontSize: 11,
                                fontWeight: 700,
                              }}
                            >
                              {row.name}
                            </span>
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontFamily: 'Orbitron',
                              fontSize: 12,
                              color: 'var(--text3)',
                            }}
                          >
                            {row.wins}
                          </td>
                          <td
                            style={{
                              padding: '8px 12px',
                              fontFamily: 'Orbitron',
                              fontWeight: 700,
                              fontSize: 13,
                              color: row.pos <= 3 ? '#e10600' : '#aaa',
                            }}
                          >
                            {row.pts}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: 'var(--text4)',
                  textAlign: 'center',
                  marginBottom: 4,
                }}
              >
                After {races.length} of 22 rounds · Data via Jolpica F1 API
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
