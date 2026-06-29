import { useState, useEffect } from 'react';
import { RACE_CALENDAR_2026 } from '../../data/circuits';

export function RaceCountdown() {
  const [timeLeft, setTimeLeft] = useState<{ d: number; h: number; m: number; s: number } | null>(null);
  const [nextRace, setNextRace] = useState<typeof RACE_CALENDAR_2026[0] | null>(null);

  useEffect(() => {
    const upcoming = RACE_CALENDAR_2026
      .filter(r => !r.cancelled && new Date(r.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    if (!upcoming.length) return;
    setNextRace(upcoming[0]);

    function tick() {
      const diff = new Date(upcoming[0].date).getTime() - new Date().getTime();
      if (diff <= 0) { setTimeLeft({ d: 0, h: 0, m: 0, s: 0 }); return; }
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
  }, []);

  if (!nextRace || !timeLeft) return null;
  const pad = (n: number) => String(n).padStart(2, '0');

  return (
    <div className="countdown-wrap">
      <div className="countdown-label">Next Race</div>
      <div className="countdown-race">
        {nextRace.flag} {nextRace.name} · Round {nextRace.round}
      </div>
      <div className="countdown-tiles" role="timer" aria-label={`Countdown to ${nextRace.name}`}>
        {([
          ['d', 'Days'],
          ['h', 'Hours'],
          ['m', 'Mins'],
          ['s', 'Secs'],
        ] as const).map(([k, label]) => (
          <div className="countdown-tile" key={k}>
            <div className="countdown-num" aria-label={`${timeLeft[k]} ${label}`}>
              {pad(timeLeft[k])}
            </div>
            <div className="countdown-unit">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
