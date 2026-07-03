import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Trophy,
  BarChart3,
  Users,
  MapPin,
  Brain,
  HelpCircle,
  Zap,
  Newspaper,
  BookOpen,
  Target,
  Sliders,
  Gauge,
  ChevronRight,
} from 'lucide-react';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import { POWER_RANKINGS_2026 } from '../data/season_preview';
import { pad } from '../utils/format';
import { CountUp } from '../components/ui/CountUp';
import styles from './HomePage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

const QUICK_LINKS = [
  { id: '/drivers', icon: Users, label: 'Drivers', sub: 'All 22 on the 2026 grid' },
  { id: '/circuits', icon: MapPin, label: 'Circuits', sub: '22 races, maps & times' },
  { id: '/results', icon: Trophy, label: 'Live Results', sub: 'Powered by Jolpica F1 API' },
  { id: '/preview', icon: BarChart3, label: 'Season Preview', sub: 'Power rankings & picks' },
  { id: '/drivercompare', icon: Sliders, label: 'Driver Compare', sub: 'Head-to-head radar chart' },
  { id: '/championship', icon: Target, label: 'Battle Tracker', sub: 'WDC drama round by round' },
  { id: '/teamquiz', icon: Brain, label: 'Which team are you?', sub: 'Find your F1 personality' },
  { id: '/tyrestrategy', icon: Gauge, label: 'Tyre Strategy', sub: 'Iconic pit stop visualised' },
  { id: '/news', icon: Newspaper, label: 'F1 News', sub: 'Live from Motorsport.com' },
  { id: '/quiz', icon: HelpCircle, label: 'F1 Quiz', sub: 'Test your knowledge' },
  { id: '/glossary', icon: BookOpen, label: 'Glossary', sub: 'Every term explained' },
  { id: '/h2h', icon: Zap, label: 'Teammate H2H', sub: '2024 qualifying battles' },
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
    <PageReveal className={styles.page}>
      {/* Skip link target for accessibility */}
      <div id="main-content" tabIndex={-1} />

      {/* Welcome hero */}
      <section className={styles.hero} aria-label="Welcome">
        <div className={styles.heroLabel}>Welcome to</div>
        <h1 className={styles.heroTitle}>
          The F1 <span className={styles.heroAccent}>Beginner's</span> Guide
        </h1>
        <p className={styles.heroDesc}>
          Everything you need to understand Formula 1 — from your first race
          weekend to tyre strategy, driver politics, and the full 2026 season.
          Start anywhere, go deep everywhere.
        </p>
        <div className={styles.heroButtons}>
          <button
            onClick={() => navigate('/how')}
            className={styles.btnPrimary}
            aria-label="Start here"
          >
            Start here <ChevronRight size={14} />
          </button>
          <button
            onClick={() => navigate('/preview')}
            className={styles.btnSecondary}
            aria-label="2026 season preview"
          >
            2026 Season <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* Next race */}
      {nextRace && (
        <section aria-label="Next race countdown">
          <div className={styles.sectionTitle}>Next Race</div>
          <div
            className={styles.featuredRace}
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
            <div className={styles.featuredRaceFlag} aria-hidden="true">
              {nextRace.flag}
            </div>
            <div className={styles.featuredRaceInfo}>
              <div className={styles.featuredRaceLabel}>
                Round {nextRace.round} &middot; {nextRace.circuit}
              </div>
              <div className={styles.featuredRaceName}>{nextRace.name}</div>
              <div className={styles.featuredRaceSub}>{raceDate}</div>
              {upcomingRaces.length > 1 && (
                <div className={styles.upcomingBadges}>
                  {upcomingRaces.slice(1, 3).map((r) => (
                    <span key={r.round} className={styles.upcomingBadge}>
                      {r.flag} R{r.round} &middot;{' '}
                      {new Date(r.date).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                      })}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div className={styles.countdown} aria-label="Countdown">
              {[
                ['d', 'Days'],
                ['h', 'Hrs'],
                ['m', 'Min'],
                ['s', 'Sec'],
              ].map(([k, l]) => (
                <div key={k} className={styles.countdownTile}>
                  <div className={styles.countdownNum}>
                    {pad(timeLeft[k as keyof TimeLeft])}
                  </div>
                  <div className={styles.countdownLabel}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Quick access grid */}
      <section aria-label="Explore">
        <div className={styles.sectionTitle}>Explore</div>
        <div className={styles.quickLinks}>
          {QUICK_LINKS.map((q) => {
            const Icon = q.icon;
            return (
              <div
                key={q.id}
                className={styles.quickCard}
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
                <div className={styles.quickIcon} aria-hidden="true">
                  <Icon size={20} />
                </div>
                <div className={styles.quickLabel}>{q.label}</div>
                <div className={styles.quickSub}>{q.sub}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Power rankings teaser */}
      <section aria-label="2026 power rankings">
        <div className={styles.powerRankings}>
          <div className={styles.sectionTitle}>2026 Power Rankings</div>
          {POWER_RANKINGS_2026.slice(0, 5).map((r) => (
            <div
              key={r.team}
              className={styles.powerRow}
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
                className={styles.powerNum}
                style={{
                  color: r.pos <= 3 ? r.color : 'var(--text-tertiary)',
                }}
              >
                <CountUp target={r.pos} />
              </div>
              <div
                className={styles.powerColorDot}
                style={{ background: r.color }}
                aria-hidden="true"
              />
              <div className={styles.powerInfo}>
                <div className={styles.powerTeamName}>{r.team}</div>
                <div className={styles.powerDrivers}>{r.drivers}</div>
              </div>
              <div className={styles.powerBar}>
                <div
                  className={styles.powerFill}
                  style={{
                    width: `${r.power}%`,
                    background: r.color,
                  }}
                  aria-hidden="true"
                />
              </div>
              <div
                className={styles.powerScore}
                style={{ color: r.color }}
              >
                <CountUp target={r.power} />
              </div>
            </div>
          ))}
          <button
            onClick={() => navigate('/preview')}
            className={styles.expandBtn}
          >
            View all 11 teams <ChevronRight size={14} />
          </button>
        </div>
      </section>

      {/* What's new */}
      <section aria-label="What's new">
        <div className={styles.sectionTitle}>What's New</div>
        <div className={styles.changelogCard}>
          {CHANGELOG.map((item, i) => (
            <div key={i} className={styles.changelogItem}>
              <div
                className={styles.changelogDot}
                style={{
                  background: item.color,
                  boxShadow: `0 0 6px ${item.color}60`,
                }}
                aria-hidden="true"
              />
              <div className={styles.changelogText}>{item.text}</div>
            </div>
          ))}
        </div>
      </section>
    </PageReveal>
  );
}
