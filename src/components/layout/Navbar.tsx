import { useState, useEffect } from 'react';
import { Menu, Search, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { RACE_CALENDAR_2026 } from '../../data/circuits';
import styles from './Navbar.module.css';

export function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
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

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        window.dispatchEvent(new CustomEvent('open-search'));
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  const pad = (n: number) => String(n).padStart(2, '0');

  const openMobileNav = () => {
    window.dispatchEvent(new CustomEvent('open-mobile-nav'));
  };

  const openSearch = () => {
    window.dispatchEvent(new CustomEvent('open-search'));
  };

  return (
    <header className={styles.navbar}>
      <div className={styles.inner}>
        <button
          className={styles.iconBtn}
          onClick={openMobileNav}
          aria-label="Open menu"
          aria-controls="mobile-nav-sheet"
        >
          <Menu size={20} strokeWidth={2} />
        </button>

        <div className={styles.countdown}>
          {nextRace && timeLeft && (
            <>
              <span className={styles.flag} aria-hidden="true">{nextRace.flag}</span>
              <span className={styles.raceName}>{nextRace.name}</span>
              <span className={styles.timer} aria-label="Countdown timer">
                <span className={styles.timerNum}>{pad(timeLeft.d)}</span>
                <span className={styles.timerSep}>:</span>
                <span className={styles.timerNum}>{pad(timeLeft.h)}</span>
                <span className={styles.timerSep}>:</span>
                <span className={styles.timerNum}>{pad(timeLeft.m)}</span>
                <span className={styles.timerSep}>:</span>
                <span className={styles.timerNum}>{pad(timeLeft.s)}</span>
              </span>
            </>
          )}
        </div>

        <div className={styles.actions}>
          <button
            className={styles.iconBtn}
            onClick={openSearch}
            aria-label="Search"
          >
            <Search size={20} strokeWidth={2} />
          </button>
          <button
            className={styles.iconBtn}
            onClick={toggleTheme}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? <Sun size={20} strokeWidth={2} /> : <Moon size={20} strokeWidth={2} />}
          </button>
        </div>
      </div>
    </header>
  );
}
