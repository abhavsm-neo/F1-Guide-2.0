import { useState, useEffect } from 'react';
import { RACE_CALENDAR_2026 } from '../../data/circuits';
import styles from './RaceCountdown.module.css';

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
    <div className={styles.bar} role="timer" aria-label={`Countdown to ${nextRace.name}`}>
      <div className={styles.inner}>
        <div className={styles.info}>
          <span className={styles.flag} aria-hidden="true">{nextRace.flag}</span>
          <span className={styles.name}>{nextRace.name}</span>
          <span className={styles.meta}>Round {nextRace.round}</span>
        </div>
        <div className={styles.timer}>
          <span className={styles.num}>{pad(timeLeft.d)}</span>
          <span className={styles.sep}>:</span>
          <span className={styles.num}>{pad(timeLeft.h)}</span>
          <span className={styles.sep}>:</span>
          <span className={styles.num}>{pad(timeLeft.m)}</span>
          <span className={styles.sep}>:</span>
          <span className={styles.num}>{pad(timeLeft.s)}</span>
        </div>
      </div>
    </div>
  );
}
