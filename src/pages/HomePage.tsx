import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import { POWER_RANKINGS_2026 } from '../data/season_preview';
import { pad } from '../utils/format';

const QUICK_LINKS = [
  { id: '/drivers', icon: '🏎️', label: 'Drivers', sub: 'All 22 on the 2026 grid' },
  { id: '/circuits', icon: '🗺️', label: 'Circuits', sub: '22 races, maps & times' },
  { id: '/results', icon: '🏆', label: 'Live Results', sub: 'Powered by Jolpica F1 API' },
  { id: '/preview', icon: '🔭', label: 'Season Preview', sub: 'Power rankings & picks' },
  { id: '/drivercompare', icon: '🆚', label: 'Driver Compare', sub: 'Head-to-head radar chart' },
  { id: '/championship', icon: '📈', label: 'Battle Tracker', sub: 'WDC drama round by round' },
  { id: '/teamquiz', icon: '🎯', label: 'Which team are you?', sub: 'Find your F1 personality' },
  { id: '/tyrestrategy', icon: '🏎', label: 'Tyre Strategy', sub: 'Iconic pit stop visualised' },
  { id: '/news', icon: '📰', label: 'F1 News', sub: 'Live from Motorsport.com' },
  { id: '/quiz', icon: '🧠', label: 'F1 Quiz', sub: 'Test your knowledge' },
  { id: '/glossary', icon: '📖', label: 'Glossary', sub: 'Every term explained' },
  { id: '/h2h', icon: '⚔️', label: 'Teammate H2H', sub: '2024 qualifying battles' },
];

const CHANGELOG = [
  { color: '#e10600', text: '2026 Season Preview added — power rankings, race picks & rookie spotlights' },
  { color: '#FF8000', text: 'Circuit maps now show styled circuit cards on every page' },
  { color: '#27F4D2', text: 'Search now covers glossary definitions, rules text & circuit descriptions' },
  { color: '#00dc78', text: 'Driver Compare radar chart, Championship Tracker & Team Quiz added' },
  { color: '#9966FF', text: 'Mobile bottom tab bar, bookmarks, onboarding flow & share card added' },
];

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

export default function HomePage() {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ d: 0, h: 0, m: 0, s: 0 });

  const nextRace = useMemo(() => {
    return (
      RACE_CALENDAR_2026.find((r) => !r.cancelled && new Date(r.date) > new Date()) ||
      RACE_CALENDAR_2026[RACE_CALENDAR_2026.length - 1]
    );
  }, []);

  const upcomingRaces = useMemo(() => {
    return RACE_CALENDAR_2026.filter((r) => !r.cancelled && new Date(r.date) > new Date()).slice(0, 3);
  }, []);

  useEffect(() => {
    const target = new Date(nextRace.date);
    function tick() {
      const diff = target.getTime() - Date.now();
      if (diff <= 0) {
        setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
        return;
      }
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [nextRace]);

  const raceDate = new Date(nextRace.date).toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div>
      {/* Skip link target for accessibility */}
      <div id="main-content" tabIndex={-1} />

      {/* Welcome hero */}
      <section className="home-hero" aria-label="Welcome">
        <div
          style={{
            fontFamily: 'Orbitron',
            fontSize: 10,
            color: '#e10600',
            letterSpacing: 4,
            marginBottom: 8,
            textTransform: 'uppercase',
          }}
        >
          Welcome to
        </div>
        <h1
          style={{
            fontFamily: 'Orbitron',
            fontSize: 'clamp(22px, 5vw, 36px)',
            fontWeight: 900,
            color: 'var(--text)',
            lineHeight: 1.1,
            marginBottom: 8,
          }}
        >
          The F1{' '}
          <span
            style={{
              color: '#e10600',
              textShadow: '0 0 30px rgba(225,6,0,0.4)',
            }}
          >
            Beginner's
          </span>{' '}
          Guide
        </h1>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text3)',
            lineHeight: 1.75,
            maxWidth: 520,
            marginBottom: 20,
          }}
        >
          Everything you need to understand Formula 1 — from your first race
          weekend to tyre strategy, driver politics, and the full 2026 season.
          Start anywhere, go deep everywhere.
        </p>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => navigate('/how')}
            className="nav-btn active"
            style={{
              padding: '10px 20px',
              fontFamily: 'Orbitron',
              fontSize: 10,
              letterSpacing: 2,
              borderRadius: 8,
            }}
          >
            START HERE →
          </button>
          <button
            onClick={() => navigate('/preview')}
            className="nav-btn"
            style={{
              padding: '10px 20px',
              fontFamily: 'Orbitron',
              fontSize: 10,
              letterSpacing: 2,
              borderRadius: 8,
            }}
          >
            2026 SEASON →
          </button>
        </div>
      </section>

      {/* Next race */}
      {nextRace && (
        <section style={{ marginBottom: 28 }} aria-label="Next race countdown">
          <div className="home-section-title">NEXT RACE</div>
          <div
            className="featured-race-card"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/circuits')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                navigate('/circuits');
              }
            }}
          >
            <div className="featured-race-flag" aria-hidden="true">
              {nextRace.flag}
            </div>
            <div className="featured-race-info">
              <div className="featured-race-label">
                Round {nextRace.round} · {nextRace.circuit}
              </div>
              <div className="featured-race-name">{nextRace.name}</div>
              <div className="featured-race-sub">{raceDate}</div>
              {upcomingRaces.length > 1 && (
                <div
                  style={{
                    marginTop: 8,
                    display: 'flex',
                    gap: 8,
                    flexWrap: 'wrap',
                  }}
                >
                  {upcomingRaces.slice(1, 3).map((r) => (
                    <span
                      key={r.round}
                      style={{
                        fontSize: 10,
                        color: 'var(--text4)',
                        background: 'var(--bg3)',
                        padding: '2px 8px',
                        borderRadius: 20,
                      }}
                    >
                      {r.flag} R{r.round} ·{' '}
                      {new Date(r.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className="featured-race-countdown" aria-label="Countdown">
              {[
                ['d', 'Days'],
                ['h', 'Hrs'],
                ['m', 'Min'],
                ['s', 'Sec'],
              ].map(([k, l]) => (
                <div key={k} className="featured-tile">
                  <div className="featured-tile-num">
                    {pad(timeLeft[k as keyof TimeLeft])}
                  </div>
                  <div className="featured-tile-label">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick access grid */}
      <section aria-label="Explore">
        <div className="home-section-title">EXPLORE</div>
        <div className="home-quick-grid">
          {QUICK_LINKS.map((q) => (
            <div
              key={q.id}
              className="home-quick-card"
              onClick={() => navigate(q.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate(q.id);
                }
              }}
              aria-label={q.label}
            >
              <div className="home-quick-icon" aria-hidden="true">
                {q.icon}
              </div>
              <div className="home-quick-label">{q.label}</div>
              <div className="home-quick-sub">{q.sub}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Power rankings teaser */}
      <section aria-label="2026 power rankings">
        <div style={{ marginBottom: 28 }}>
          <div className="home-section-title">2026 POWER RANKINGS</div>
          {POWER_RANKINGS_2026.slice(0, 5).map((r) => (
            <div
              key={r.team}
              className="power-rank-row"
              onClick={() => navigate('/preview')}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  navigate('/preview');
                }
              }}
              aria-label={`${r.team} — power ${r.power}`}
            >
              <div
                className="power-rank-num"
                style={{
                  color: r.pos <= 3 ? r.color : 'var(--text4)',
                }}
              >
                {r.pos <= 3 ? ['🥇', '🥈', '🥉'][r.pos - 1] : r.pos}
              </div>
              <div
                style={{
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  background: r.color,
                  flexShrink: 0,
                }}
                aria-hidden="true"
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)' }}>
                  {r.team}
                </div>
                <div style={{ fontSize: 10, color: 'var(--text4)' }}>
                  {r.drivers}
                </div>
              </div>
              <div
                className="power-rank-bar"
                style={{ maxWidth: 120 }}
              >
                <div
                  className="power-rank-fill"
                  style={{
                    width: `${r.power}%`,
                    background: r.color,
                    boxShadow: `0 0 6px ${r.color}60`,
                  }}
                  aria-hidden="true"
                />
              </div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: 'Orbitron',
                  color: r.color,
                  minWidth: 28,
                  textAlign: 'right',
                }}
              >
                {r.power}
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/preview')}
            className="expand-btn"
            style={{ width: '100%', marginTop: 8 }}
          >
            VIEW ALL 11 TEAMS →
          </button>
        </div>
      </section>

      {/* What's new */}
      <section aria-label="What's new">
        <div style={{ marginBottom: 16 }}>
          <div className="home-section-title">WHAT'S NEW</div>
          <div className="card" style={{ padding: '14px 18px' }}>
            {CHANGELOG.map((item, i) => (
              <div key={i} className="changelog-item">
                <div
                  className="changelog-dot"
                  style={{
                    background: item.color,
                    boxShadow: `0 0 6px ${item.color}60`,
                  }}
                  aria-hidden="true"
                />
                <div
                  style={{
                    fontSize: 12,
                    color: 'var(--text2)',
                    lineHeight: 1.6,
                  }}
                >
                  {item.text}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
