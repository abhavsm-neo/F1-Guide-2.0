import { useState, useMemo } from 'react';
import { DRIVERS_2025 } from '../data/drivers';
import { RadarChart } from '../components/charts/RadarChart';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';

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
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="Driver"
          accent="Compare"
          group="Tools"
          icon="🆚"
          intro="Pick any two drivers to compare their ratings head-to-head on the radar chart."
        />
        <BookmarkButton sectionId="driver-compare" />
      </div>

      <div className="compare-select-row">
        {[
          { id: id1, setId: setId1, which: 1 },
          { id: id2, setId: setId2, which: 2 },
        ].map(({ id, setId, which }) => {
          const d = DRIVERS_2025.find((dr) => dr.id === id) || DRIVERS_2025[0];
          return (
            <div key={which}>
              <div
                style={{
                  fontSize: 9,
                  color: '#e10600',
                  fontFamily: 'Orbitron, sans-serif',
                  letterSpacing: 2,
                  marginBottom: 6,
                  textTransform: 'uppercase',
                }}
              >
                Driver {which}
              </div>
              <select
                className="compare-driver-select"
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
                  style={{
                    marginTop: 10,
                    background: 'var(--card-bg)',
                    border: `1px solid ${d.teamColor}44`,
                    borderRadius: 8,
                    padding: '12px 14px',
                    backdropFilter: 'blur(8px)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'Orbitron, sans-serif',
                      fontSize: 12,
                      color: d.teamColor,
                      fontWeight: 900,
                    }}
                  >
                    #{d.number} {d.name}
                  </div>
                  <div
                    style={{ fontSize: 11, color: 'var(--text3)', marginTop: 2 }}
                  >
                    {d.country} · {d.team}
                  </div>
                  <div
                    style={{ display: 'flex', gap: 12, marginTop: 8 }}
                  >
                    {[
                      ['⭐', d.championships, 'Titles'],
                      [d.wins, null, 'Wins'],
                      [d.poles, null, 'Poles'],
                    ].map(([v, v2, l]) => (
                      <div key={String(l)} style={{ textAlign: 'center' }}>
                        <div
                          style={{
                            fontFamily: 'Orbitron, sans-serif',
                            fontSize: 14,
                            fontWeight: 900,
                            color: d.teamColor,
                          }}
                        >
                          {v2 !== null ? `${v}${v2}` : v}
                        </div>
                        <div
                          style={{
                            fontSize: 9,
                            color: 'var(--text4)',
                            letterSpacing: 1,
                            textTransform: 'uppercase',
                          }}
                        >
                          {String(l)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {d1 && d2 && (
        <>
          {/* Radar */}
          <div className="card" style={{ marginBottom: 20 }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                gap: 20,
                marginBottom: 14,
                flexWrap: 'wrap',
              }}
            >
              <span
                style={{ fontSize: 12, color: d1.teamColor, fontWeight: 700 }}
              aria-label={`Driver 1: ${d1.name}`}
              role="img"
              aria-roledescription="marker"
              >
                ● {d1.name}
              </span>
              <span
                style={{ fontSize: 12, color: d2.teamColor, fontWeight: 700 }}
                aria-label={`Driver 2: ${d2.name}`}
                role="img"
                aria-roledescription="marker"
                >
                ● {d2.name}
              </span>
            </div>
            <div className="radar-wrap">
              <RadarChart
                d1={d1}
                d2={d2}
                color1={d1.teamColor}
                color2={d2.teamColor}
              />
            </div>
          </div>

          {/* Bar comparison */}
          <div className="card">
            <div
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 10,
                color: '#e10600',
                letterSpacing: 2,
                marginBottom: 14,
                textTransform: 'uppercase',
              }}
            >
              Stat Breakdown
            </div>
            {AXES.map(({ label, key }) => {
              const total = d1[key] + d2[key];
              const pct1 = ((d1[key] / total) * 100).toFixed(0);
              const pct2 = ((d2[key] / total) * 100).toFixed(0);
              return (
                <div key={key} style={{ marginBottom: 14 }}>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: d1.teamColor,
                      }}
                    >
                      {d1[key]}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        color: 'var(--text3)',
                        fontFamily: 'Orbitron, sans-serif',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      {label}
                    </span>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: 700,
                        color: d2.teamColor,
                      }}
                    >
                      {d2[key]}
                    </span>
                  </div>
                  <div
                    style={{
                      height: 8,
                      background: 'var(--bg3)',
                      borderRadius: 4,
                      overflow: 'hidden',
                      display: 'flex',
                    }}
                  >
                    <div
                      style={{
                        width: `${pct1}%`,
                        background: d1.teamColor,
                        boxShadow: `0 0 6px ${d1.teamColor}80`,
                        transition: 'width 0.7s',
                      }}
                      aria-label={`${d1.name} ${label}: ${pct1}%`}
                    />
                    <div
                      style={{
                        width: `${pct2}%`,
                        background: d2.teamColor,
                        boxShadow: `0 0 6px ${d2.teamColor}80`,
                        transition: 'width 0.7s',
                      }}
                      aria-label={`${d2.name} ${label}: ${pct2}%`}
                    />
                  </div>
                </div>
              );
            })}

            {/* Overall winner */}
            <div
              style={{
                marginTop: 14,
                padding: '12px 16px',
                background: winner
                  ? `${winner.teamColor}12`
                  : 'var(--bg3)',
                border: `1px solid ${winner ? winner.teamColor + '44' : 'var(--border)'}`,
                borderRadius: 8,
                textAlign: 'center',
              }}
            >
              {winner ? (
                <>
                  <div
                    style={{
                      fontSize: 10,
                      color: 'var(--text3)',
                      fontFamily: 'Orbitron, sans-serif',
                      letterSpacing: 2,
                      marginBottom: 4,
                      textTransform: 'uppercase',
                    }}
                  >
                    Overall Edge
                  </div>
                  <div
                    style={{
                      fontSize: 14,
                      fontWeight: 900,
                      color: winner.teamColor,
                      fontFamily: 'Orbitron, sans-serif',
                    }}
                  >
                    {winner.name} +{Math.abs(total1 - total2)} pts
                  </div>
                </>
              ) : (
                <div style={{ fontSize: 12, color: 'var(--text3)' }}>
                  Perfect tie — these two are identical on paper.
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
