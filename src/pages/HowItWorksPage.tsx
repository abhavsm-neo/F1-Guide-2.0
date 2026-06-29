import { useState, useEffect, useMemo } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import { pad } from '../utils/format';

const HOW_CARDS = [
  { title: 'What is F1?', text: 'Formula 1 is the pinnacle of motorsport — the fastest, most technologically advanced racing series on Earth. 11 teams, 22 drivers, 22 races in 2026 across the globe. Each team builds their own car around a common set of rules.' },
  { title: 'The Race Weekend', text: 'Thursday: Media day. Friday: Two practice sessions (FP1 & FP2). Saturday: FP3 then Qualifying (Q1→Q2→Q3). Sunday: The Race. Sprint weekends add a mini-race on Saturday.' },
  { title: 'Qualifying', text: 'Three knockout rounds. Q1 eliminates the 5 slowest. Q2 eliminates 5 more. Q3 (top 10) fights for pole position — the front of the grid. Single flying laps under enormous pressure.' },
  { title: 'The Race', text: 'Typically 305km (190 miles). Cars must use at least 2 different tyre compounds. Strategy — when to pit, which tyres — is often as important as outright speed.' },
  { title: 'Tyres', text: 'Pirelli supply all teams. Soft (red) = fastest but least durable. Medium (yellow). Hard (white) = lasts longest. Intermediate (green) and Full Wet (blue) for rain. Tyre strategy can completely change a race outcome.' },
  { title: 'DRS', text: 'Drag Reduction System — opens the rear wing on straights for extra speed. Only usable within 1 second of the car ahead in designated zones. Replaced by active aerodynamics in 2026.' },
  { title: 'Two Championships', text: "The Drivers' Championship rewards the fastest individual. The Constructors' Championship rewards the team (both drivers' points combined). Teams fight for both simultaneously all season." },
  { title: 'Safety Car & Red Flag', text: 'Virtual Safety Car (VSC) slows everyone. Full Safety Car bunches the pack. Red Flag stops the race entirely. All three create drama and can completely flip race outcomes.' },
  { title: '2026 New Rules', text: 'The biggest regulation reset since 2014. New power units with ~50% electric power. Active aerodynamics replaces DRS. Audi joins as a works manufacturer. Red Bull switches to Ford. A brand new chapter.' },
];

interface TimeLeft {
  d: number;
  h: number;
  m: number;
  s: number;
}

function FeaturedRaceCard() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ d: 0, h: 0, m: 0, s: 0 });
  const nextRace = useMemo(() => {
    return (
      RACE_CALENDAR_2026.find((r) => !r.cancelled && new Date(r.date) > new Date()) ||
      RACE_CALENDAR_2026[RACE_CALENDAR_2026.length - 1]
    );
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
    weekday: 'short',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="featured-race-card">
      <div className="featured-race-flag" aria-hidden="true">
        {nextRace.flag}
      </div>
      <div className="featured-race-info">
        <div className="featured-race-label">
          Round {nextRace.round} · Next Race
        </div>
        <div className="featured-race-name">{nextRace.name}</div>
        <div className="featured-race-sub">
          {nextRace.circuit} · {raceDate}
        </div>
      </div>
      <div className="featured-race-countdown" aria-label="Race countdown">
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
  );
}

export default function HowItWorksPage() {
  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="How"
          accent="F1 Works"
          group="Learn the Basics"
          icon="🏁"
          intro="New to Formula 1? Start here. This covers everything that happens across a race weekend — from practice to the podium — plus the rules, tyres, and tactics that make every race unpredictable."
        />
        <BookmarkButton sectionId="how" />
      </div>

      <FeaturedRaceCard />

      <div className="how-grid">
        {HOW_CARDS.map((item) => (
          <div className="how-card" key={item.title}>
            <h3>{item.title}</h3>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
