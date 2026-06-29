import { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import {
  POWER_RANKINGS_2026,
  RACE_PREVIEWS_2026,
  ROOKIES_2026,
} from '../data/season_preview';

export default function SeasonPreviewPage() {
  const [tab, setTab] = useState<'power' | 'races' | 'rookies'>('power');

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="2026"
          accent="Season Preview"
          group="2026 Season"
          icon="🔭"
          intro="The 2026 season is the biggest regulation reset in F1 history. Three races in, Mercedes are dominant, Antonelli is the youngest championship leader ever, and Aston Martin haven't scored a point. Here's the full picture after 3 of 22 rounds."
        />
        <BookmarkButton sectionId="season-preview" />
      </div>

      <div
        style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}
      >
        {(
          [
            ['power', '⚡ Power Rankings'],
            ['races', '🏁 Race Picks'],
            ['rookies', '🌱 Rookies to Watch'],
          ] as const
        ).map(([k, l]) => (
          <button
            key={k}
            className={`year-btn${tab === k ? ' active' : ''}`}
            onClick={() => setTab(k)}
          >
            {l}
          </button>
        ))}
      </div>

      {tab === 'power' && (
        <div>
          <div
            className="card"
            style={{ marginBottom: 20, borderLeft: '3px solid #e10600' }}
          >
            <p
              style={{
                fontSize: 12,
                color: 'var(--text2)',
                lineHeight: 1.75,
              }}
            >
              <strong style={{ color: '#e10600' }}>
                Updated after 3 rounds (Japan):
              </strong>{' '}
              Rankings now reflect actual 2026 race results. Standings: Mercedes
              135pts, Ferrari 90, McLaren 56, Red Bull 16. Antonelli leads the
              Drivers' Championship on 72pts — the youngest leader in F1
              history.
            </p>
          </div>
          {POWER_RANKINGS_2026.map((r) => (
            <div
              key={r.team}
              className="preview-team-card"
              style={{ borderLeftColor: r.color, paddingLeft: 22 }}
            >
              <div
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  bottom: 0,
                  width: 4,
                  background: r.color,
                  borderRadius: '14px 0 0 14px',
                  boxShadow: `0 0 10px ${r.color}60`,
                }}
              />
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  flexWrap: 'wrap',
                }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron',
                    fontSize: 28,
                    fontWeight: 900,
                    color: r.color,
                    minWidth: 36,
                    lineHeight: 1,
                  }}
                >
                  {r.pos <= 3
                    ? ['🥇', '🥈', '🥉'][r.pos - 1]
                    : `P${r.pos}`}
                </div>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      flexWrap: 'wrap',
                      marginBottom: 4,
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'Orbitron',
                        fontSize: 14,
                        fontWeight: 900,
                        color: 'var(--text)',
                      }}
                    >
                      {r.team}
                    </span>
                    <span
                      className="prediction-badge"
                      style={{
                        background: r.color + '18',
                        color: r.color,
                        border: `1px solid ${r.color}30`,
                      }}
                    >
                      {r.tag}
                    </span>
                  </div>
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text3)',
                      marginBottom: 8,
                    }}
                  >
                    {r.drivers}
                  </div>
                  <p
                    style={{
                      fontSize: 12,
                      color: 'var(--text2)',
                      lineHeight: 1.75,
                    }}
                  >
                    {r.verdict}
                  </p>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      marginTop: 10,
                    }}
                  >
                    <div
                      style={{
                        flex: 1,
                        height: 6,
                        background: 'var(--bg3)',
                        borderRadius: 3,
                        overflow: 'hidden',
                      }}
                    >
                      <div
                        style={{
                          height: '100%',
                          width: `${r.power}%`,
                          background: `linear-gradient(to right, ${r.color}80, ${r.color})`,
                          borderRadius: 3,
                          transition: 'width 0.8s',
                          boxShadow: `0 0 8px ${r.color}60`,
                        }}
                      />
                    </div>
                    <span
                      style={{
                        fontFamily: 'Orbitron',
                        fontSize: 12,
                        color: r.color,
                        fontWeight: 700,
                      }}
                    >
                      {r.power}/100
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'races' && (
        <div>
          <div
            className="card"
            style={{ marginBottom: 20, borderLeft: '3px solid #e10600' }}
          >
            <p
              style={{
                fontSize: 12,
                color: 'var(--text2)',
                lineHeight: 1.75,
              }}
            >
              <strong style={{ color: '#e10600' }}>Disclaimer:</strong> These
              are analyst-style picks, not predictions. F1 is inherently
              unpredictable — the fun is seeing how wrong (or right) these calls
              turn out to be. Updated after each race.
            </p>
          </div>
          {RACE_PREVIEWS_2026.map((r) => (
            <div
              key={r.round}
              className="preview-race-card"
              style={{
                borderLeft: r.result ? '3px solid #27F4D2' : undefined,
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 10,
                }}
              >
                <span style={{ fontSize: 28 }}>{r.flag}</span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: 'Orbitron',
                      fontSize: 12,
                      fontWeight: 900,
                      color: 'var(--text)',
                    }}
                  >
                    {r.name}
                  </div>
                  <div style={{ fontSize: 10, color: 'var(--text3)' }}>
                    R{r.round} · {r.circuit} · {r.date}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 4,
                  }}
                >
                  {r.result && (
                    <span
                      style={{
                        fontSize: 9,
                        color: '#27F4D2',
                        fontFamily: 'Orbitron',
                        letterSpacing: 1,
                        background: 'rgba(39,244,210,0.1)',
                        border: '1px solid rgba(39,244,210,0.3)',
                        borderRadius: 4,
                        padding: '2px 6px',
                      }}
                    >
                      RACE RESULT
                    </span>
                  )}
                  <div style={{ fontSize: 10, color: 'var(--text4)' }}>
                    {r.rating}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontSize: 9,
                    color: 'var(--text4)',
                    fontFamily: 'Orbitron',
                    letterSpacing: 1,
                  }}
                >
                  {r.result ? 'WINNER:' : 'OUR PICK:'}
                </span>
                <span
                  style={{
                    fontFamily: 'Orbitron',
                    fontSize: 11,
                    fontWeight: 900,
                    color: r.pickColor,
                    textShadow: `0 0 10px ${r.pickColor}60`,
                  }}
                >
                  {r.pick}
                </span>
              </div>
              <p
                style={{
                  fontSize: 12,
                  color: 'var(--text3)',
                  lineHeight: 1.75,
                  marginBottom: 8,
                }}
              >
                {r.prediction}
              </p>
              <div
                style={{
                  fontSize: 10,
                  color: r.result ? '#27F4D2' : '#00dc78',
                  background: r.result
                    ? 'rgba(39,244,210,0.08)'
                    : 'rgba(0,220,120,0.08)',
                  border: `1px solid ${r.result ? 'rgba(39,244,210,0.2)' : 'rgba(0,220,120,0.2)'}`,
                  borderRadius: 6,
                  padding: '4px 10px',
                  display: 'inline-block',
                }}
              >
                {r.result ? '🏁' : '👀'} {r.watchFor}
              </div>
            </div>
          ))}
          <div
            className="card"
            style={{ marginTop: 16, textAlign: 'center', padding: 20 }}
          >
            <div
              style={{
                fontFamily: 'Orbitron',
                fontSize: 10,
                color: 'var(--text3)',
                letterSpacing: 2,
              }}
            >
              MORE RACE PREVIEWS
            </div>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text4)',
                marginTop: 6,
              }}
            >
              Full-season previews will update as the 2026 calendar progresses.
            </p>
          </div>
        </div>
      )}

      {tab === 'rookies' && (
        <div>
          <div
            className="card"
            style={{ marginBottom: 20, borderLeft: '3px solid #00dc78' }}
          >
            <p
              style={{
                fontSize: 12,
                color: 'var(--text2)',
                lineHeight: 1.75,
              }}
            >
              <strong style={{ color: '#00dc78' }}>
                5 rookies or near-rookies
              </strong>{' '}
              on the 2026 grid — the highest number in a decade. All of them have
              genuine speed. Several of them might be future world champions.
            </p>
          </div>
          <div className="rookie-grid">
            {ROOKIES_2026.map((r) => (
              <div
                key={r.name}
                className="rookie-card"
                style={{ borderTop: `2px solid ${r.color}` }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: 8,
                  }}
                >
                  <span style={{ fontSize: 18 }}>{r.flag}</span>
                  <span
                    style={{
                      fontFamily: 'Orbitron',
                      fontSize: 20,
                      fontWeight: 900,
                      color: r.color + '40',
                    }}
                  >
                    #{r.number}
                  </span>
                </div>
                <div
                  style={{
                    fontFamily: 'Orbitron',
                    fontSize: 13,
                    fontWeight: 900,
                    color: 'var(--text)',
                    marginBottom: 2,
                  }}
                >
                  {r.name}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: r.color,
                    marginBottom: 8,
                    fontFamily: 'Orbitron',
                    letterSpacing: 1,
                  }}
                >
                  {r.team} · Age {r.age}
                </div>
                <p
                  style={{
                    fontSize: 11,
                    color: 'var(--text3)',
                    lineHeight: 1.7,
                    marginBottom: 10,
                  }}
                >
                  {r.background}
                </p>
                <div
                  style={{
                    borderTop: '1px solid var(--border)',
                    paddingTop: 8,
                  }}
                >
                  <div
                    style={{
                      fontSize: 9,
                      color: 'var(--text4)',
                      fontFamily: 'Orbitron',
                      letterSpacing: 1,
                      marginBottom: 4,
                    }}
                  >
                    CEILING
                  </div>
                  <div
                    style={{
                      height: 6,
                      background: 'var(--bg3)',
                      borderRadius: 3,
                      overflow: 'hidden',
                      marginBottom: 6,
                    }}
                  >
                    <div
                      style={{
                        height: '100%',
                        width: `${r.potential}%`,
                        background: r.color,
                        boxShadow: `0 0 6px ${r.color}60`,
                        borderRadius: 3,
                      }}
                    />
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: '#00dc78',
                      lineHeight: 1.5,
                    }}
                  >
                    👀 {r.watchFor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
