import { useMemo } from 'react';
import { RACE_CALENDAR_2026 } from '../../data/circuits';
import styles from './Hero.module.css';

export function Hero() {
  const nextRace = useMemo(() => {
    const upcoming = RACE_CALENDAR_2026
      .filter(r => !r.cancelled && new Date(r.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return upcoming[0] || null;
  }, []);

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <header className={styles.hero}>
      <div className={styles.inner}>
        <h1 className={styles.title}>FORMULA 1</h1>
        <p className={styles.subtitle}>The Complete Beginner's Guide · 2018 – 2026</p>

        {nextRace && (
          <div className={styles.pills}>
            <div className={styles.pill}>
              <span className={styles.pillLabel}>Next Race</span>
              <span className={styles.pillValue}>{nextRace.flag} {nextRace.name}</span>
            </div>
            <div className={styles.pill}>
              <span className={styles.pillLabel}>Round</span>
              <span className={styles.pillValue}>{nextRace.round}</span>
            </div>
            <div className={styles.pill}>
              <span className={styles.pillLabel}>Date</span>
              <span className={styles.pillValue}>{formatDate(nextRace.date)}</span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
