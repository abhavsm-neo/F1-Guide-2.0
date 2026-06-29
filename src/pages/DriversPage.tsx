import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Search } from 'lucide-react';
import { DRIVERS_2025 } from '../data/drivers';
import { DriverCard } from '../components/ui/DriverCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import styles from './DriversPage.module.css';

const TEAM_FILTERS = [
  'All',
  'Red Bull',
  'Mercedes',
  'Ferrari',
  'McLaren',
  'Aston',
  'Alpine',
  'Williams',
  'Haas',
  'Racing Bulls',
  'Audi F1',
  'Cadillac',
];

export default function DriversPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showDropped, setShowDropped] = useState(false);

  const allDrivers = DRIVERS_2025;

  const active = useMemo(
    () => allDrivers.filter((d) => !d.team.toLowerCase().includes('dropped')),
    [allDrivers]
  );
  const dropped = useMemo(
    () => allDrivers.filter((d) => d.team.toLowerCase().includes('dropped')),
    [allDrivers]
  );

  const source = showDropped ? dropped : active;

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return source.filter((d) => {
      const matchSearch =
        d.name.toLowerCase().includes(q) || d.team.toLowerCase().includes(q);
      const matchFilter =
        filter === 'All' || d.team.toLowerCase().includes(filter.toLowerCase());
      return matchSearch && matchFilter;
    });
  }, [source, search, filter]);

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="2026"
          accent="Drivers"
          group="2026 Season"
          icon={Users}
          intro="All 22 drivers on the 2026 grid — their career stats, ratings, and the story behind each one. Tap any card to reveal detailed ratings and media profile."
        />
        <BookmarkButton sectionId="drivers" />
      </div>

      <div className={styles.toggleRow}>
        <button
          className={!showDropped ? styles.yearBtnActive : styles.yearBtn}
          onClick={() => setShowDropped(false)}
          aria-label={`Show active drivers (${active.length})`}
        >
          <Users size={14} /> Active ({active.length})
        </button>
        <button
          className={showDropped ? styles.yearBtnActive : styles.yearBtn}
          onClick={() => setShowDropped(true)}
          aria-label={`Show dropped drivers (${dropped.length})`}
        >
          No 2026 Seat ({dropped.length})
        </button>
      </div>

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true">
          <Search size={16} />
        </span>
        <input
          className={styles.searchInput}
          placeholder="Search drivers or teams..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search drivers or teams"
        />
      </div>

      <div className={styles.filterRow} role="group" aria-label="Team filter">
        {TEAM_FILTERS.map((f) => (
          <button
            key={f}
            className={filter === f ? styles.filterPillActive : styles.filterPill}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.cardGrid}>
        {filtered.map((d) => (
          <div
            key={d.id}
            onClick={() => navigate(`/drivers/${d.id}`)}
            style={{ cursor: 'pointer' }}
            role="link"
            aria-label={`View profile for ${d.name}`}
          >
            <DriverCard driver={d} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={Users}
          title="NO DRIVERS FOUND"
          sub={`No drivers match "${search || filter}" — try clearing your search or filter.`}
        />
      )}
    </div>
  );
}
