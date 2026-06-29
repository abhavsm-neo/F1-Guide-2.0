import { useState, useEffect, useMemo, useCallback } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { SkeletonCards } from '../components/ui/SkeletonCards';
import { EmptyState } from '../components/ui/EmptyState';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import {
  fetchDriverStandings,
  fetchConstructorStandings,
} from '../utils/api';
import { ergastColor, PODIUM_COLORS } from '../utils/colors';
import type { DriverStanding, ConstructorStanding } from '../types';

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

  const maxDriverPts = useMemo(
    () => driverStandings[0]?.pts || 1,
    [driverStandings]
  );
  const maxCtorPts = useMemo(
    () => constructorStandings[0]?.pts || 1,
    [constructorStandings]
  );

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title={`${YEAR}`}
          accent="Live Standings"
          group="Race & Stats"
          icon="📊"
          intro={`Current ${YEAR} World Drivers' and Constructors' Championship standings — always up to date.`}
        />
        <BookmarkButton sectionId="standings" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
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
              animation: loading ? 'none' : 'pulse 2s infinite',
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
          onClick={loadStandings}
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
          }}
          aria-label="Refresh standings"
        >
          <span className={loading ? 'spin' : ''}>↻</span> Refresh
        </button>
      </div>

      {loading && (
        <div
          style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}
        >
          <SkeletonCards count={4} />
          <SkeletonCards count={4} />
        </div>
      )}

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
            STANDINGS UNAVAILABLE
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text3)',
              marginBottom: 14,
            }}
          >
            {error}
          </p>
          <button
            onClick={loadStandings}
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

      {!loading && !error && driverStandings.length === 0 && (
        <EmptyState
          icon="📊"
          title={`NO STANDINGS YET FOR ${YEAR}`}
          sub="Standings will appear after the first race of the season."
        />
      )}

      {!loading && driverStandings.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns:
              'repeat(auto-fill, minmax(min(100%, 520px), 1fr))',
            gap: 24,
          }}
        >
          {/* Drivers' Championship */}
          <div>
            <div
              className="section-title"
              style={{
                fontSize: 'clamp(13px,3vw,20px)',
                marginBottom: 8,
              }}
            >
              Drivers' <span>Championship</span>
            </div>
            <div className="section-line" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {driverStandings.map((row) => {
                const col = ergastColor(row.constructorId);
                const pct = ((row.pts / maxDriverPts) * 100).toFixed(1);
                const isTop3 = row.pos <= 3;
                return (
                  <div
                    key={row.name}
                    className="card"
                    style={{
                      padding: '12px 16px',
                      borderLeft: `3px solid ${isTop3 ? PODIUM_COLORS[row.pos - 1] : col}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 900,
                          fontSize: 18,
                          color: isTop3
                            ? PODIUM_COLORS[row.pos - 1]
                            : 'var(--text3)',
                          minWidth: 28,
                          textAlign: 'center',
                        }}
                      >
                        {row.pos}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 14,
                            color: 'var(--text)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.name}
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 6,
                            marginTop: 2,
                          }}
                        >
                          <span
                            style={{
                              background: col + '22',
                              color: col,
                              border: `1px solid ${col}44`,
                              padding: '1px 6px',
                              borderRadius: 2,
                              fontSize: 9,
                              fontWeight: 700,
                              fontFamily: 'Orbitron',
                            }}
                          >
                            {row.team}
                          </span>
                          {row.wins > 0 && (
                            <span
                              style={{
                                fontSize: 9,
                                color: '#FFD700',
                                fontFamily: 'Orbitron',
                              }}
                            >
                              🏆 {row.wins}W
                            </span>
                          )}
                        </div>
                      </div>
                      <div
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 900,
                          fontSize: 22,
                          color: isTop3 ? '#e10600' : 'var(--text2)',
                          minWidth: 48,
                          textAlign: 'right',
                        }}
                      >
                        {row.pts}
                      </div>
                    </div>
                    <div
                      style={{
                        height: 4,
                        background: 'var(--border)',
                        borderRadius: 2,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: isTop3
                            ? `linear-gradient(90deg, ${PODIUM_COLORS[row.pos - 1]}, ${col})`
                            : col,
                          borderRadius: 2,
                          transition: 'width 0.8s ease',
                          boxShadow: isTop3
                            ? `0 0 8px ${col}`
                            : 'none',
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Constructors' Championship */}
          <div>
            <div
              className="section-title"
              style={{
                fontSize: 'clamp(13px,3vw,20px)',
                marginBottom: 8,
              }}
            >
              Constructors' <span>Championship</span>
            </div>
            <div className="section-line" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {constructorStandings.map((row) => {
                const col = ergastColor(row.constructorId);
                const pct = ((row.pts / maxCtorPts) * 100).toFixed(1);
                const isTop3 = row.pos <= 3;
                return (
                  <div
                    key={row.name}
                    className="card"
                    style={{
                      padding: '14px 16px',
                      borderLeft: `3px solid ${isTop3 ? PODIUM_COLORS[row.pos - 1] : col}`,
                      transition: 'all 0.2s',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                        marginBottom: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 900,
                          fontSize: 20,
                          color: isTop3
                            ? PODIUM_COLORS[row.pos - 1]
                            : 'var(--text3)',
                          minWidth: 28,
                          textAlign: 'center',
                        }}
                      >
                        {row.pos}
                      </span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div
                          style={{
                            fontWeight: 700,
                            fontSize: 15,
                            color: col,
                            fontFamily: 'Orbitron',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}
                        >
                          {row.name}
                        </div>
                        {row.wins > 0 && (
                          <div
                            style={{
                              fontSize: 9,
                              color: '#FFD700',
                              fontFamily: 'Orbitron',
                              marginTop: 2,
                            }}
                          >
                            🏆 {row.wins} win{row.wins !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                      <div
                        style={{
                          fontFamily: 'Orbitron',
                          fontWeight: 900,
                          fontSize: 24,
                          color: isTop3 ? '#e10600' : 'var(--text2)',
                          minWidth: 52,
                          textAlign: 'right',
                        }}
                      >
                        {row.pts}
                      </div>
                    </div>
                    <div
                      style={{
                        height: 5,
                        background: 'var(--border)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${pct}%`,
                          background: `linear-gradient(90deg, ${col}, ${col}bb)`,
                          borderRadius: 3,
                          transition: 'width 0.8s ease',
                          boxShadow: `0 0 8px ${col}44`,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
            <div
              style={{
                fontSize: 10,
                color: 'var(--text4)',
                textAlign: 'center',
                marginTop: 16,
              }}
            >
              Data via Jolpica F1 API ·{' '}
              {lastUpdated
                ? `Updated ${lastUpdated.toLocaleTimeString()}`
                : ''}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
