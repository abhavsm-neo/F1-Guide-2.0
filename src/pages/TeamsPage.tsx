import { useState, useMemo } from 'react';
import { Users, Search } from 'lucide-react';
import { TEAMS_2025, TEAMS_2026 } from '../data/teams';
import { TeamCard } from '../components/ui/TeamCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ScrollReveal } from '../components/ui/ScrollReveal';
import styles from './TeamsPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

export default function TeamsPage() {
  const [year, setYear] = useState<'2025' | '2026'>('2026');
  const [search, setSearch] = useState('');

  const source = useMemo(() => (year === '2026' ? TEAMS_2026 : TEAMS_2025), [year]);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return source.filter(
      (t) =>
        t.name.toLowerCase().includes(q) ||
        t.engine.toLowerCase().includes(q) ||
        t.tp.toLowerCase().includes(q) ||
        t.drivers.some((d) => d.toLowerCase().includes(q))
    );
  }, [source, search]);

  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="The"
          accent="Teams"
          group="2026 Season"
          icon={Users}
          intro="All 11 constructors — their engines, drivers, team principals, and what the 2026 regulation reset means for each one."
        />
        <BookmarkButton sectionId="teams" />
      </div>

      <div className={styles.yearToggle}>
        <button
          className={year === '2025' ? styles.yearBtnActive : styles.yearBtn}
          onClick={() => setYear('2025')}
          aria-pressed={year === '2025'}
        >
          2025 Season
        </button>
        <button
          className={year === '2026' ? styles.yearBtnActive : styles.yearBtn}
          onClick={() => setYear('2026')}
          aria-pressed={year === '2026'}
        >
          2026 Season <span className={styles.newBadge}>NEW</span>
        </button>
      </div>

      {year === '2026' && (
        <div className={styles.infoCard} style={{ borderLeft: '3px solid var(--accent)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--text-secondary)', lineHeight: 1.7, margin: 0 }}>
            <strong style={{ color: 'var(--accent)' }}>2026 is a complete reset.</strong>{' '}
            New power unit rules require ~50% electric power. Red Bull switches from
            Honda to Ford. Alpine drops Renault for Mercedes. Sauber becomes the Audi
            works team — the first new manufacturer in F1 in over a decade.
          </p>
        </div>
      )}

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true">
          <Search size={16} />
        </span>
        <input
          className={styles.searchInput}
          placeholder="Search teams, engine, TP or driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search teams, engine, TP or driver"
        />
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((t, i) => (
          <ScrollReveal key={t.id + year} delay={i * 80}>
            <TeamCard team={t} />
          </ScrollReveal>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className={styles.emptyStateWrap}>
          No teams found matching "{search}"
        </div>
      )}
    </PageReveal>
  );
}
