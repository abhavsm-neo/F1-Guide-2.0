import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Search, X, BookOpen, Trophy, BarChart3, Users, MapPin, Newspaper,
  Brain, HelpCircle, Bookmark, Gauge, Calendar, Zap, TrendingUp, Home, ChevronRight
} from 'lucide-react';
import { NAV_GROUPS } from '../../data/nav';
import styles from './MobileNav.module.css';

const SECTION_META: Record<string, { icon: React.ElementType; label: string }> = {
  'Learn the Basics': { icon: BookOpen, label: 'Learn' },
  '2026 Season': { icon: Trophy, label: 'Season' },
  'Race & Stats': { icon: BarChart3, label: 'Race & Stats' },
};

const LINK_ICONS: Record<string, React.ElementType> = {
  'how': BookOpen,
  'points': BarChart3,
  'rules': BookOpen,
  'glossary': BookOpen,
  'tyrestrategy': Gauge,
  'quiz': Brain,
  'teamquiz': Brain,
  'preview': TrendingUp,
  'drivers': Users,
  'teams': Users,
  'history': Calendar,
  'compare': Zap,
  'drivercompare': Zap,
  'predictor': TrendingUp,
  'circuits': MapPin,
  'results': Trophy,
  'standings': BarChart3,
  'championship': TrendingUp,
  'h2h': Zap,
  'records': Trophy,
  'news': Newspaper,
  'bookmarks': Bookmark,
};

export function MobileNav() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [sheetSearch, setSheetSearch] = useState('');

  const activePath = location.pathname.slice(1) || 'home';
  const activeTop = activePath.split('/')[0];

  const isActive = (id: string) => {
    if (id === 'home') return location.pathname === '/';
    return activeTop === id;
  };

  useEffect(() => {
    function handle() { setOpen(true); }
    window.addEventListener('open-mobile-nav', handle);
    return () => window.removeEventListener('open-mobile-nav', handle);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  const ALL_SECTIONS = [
    { id: 'home', label: 'Home', icon: Home, group: 'Home' },
    ...NAV_GROUPS.flatMap(g =>
      g.sections.map(s => ({ ...s, group: g.label, icon: LINK_ICONS[s.id] || HelpCircle }))
    ),
    { id: 'bookmarks', label: 'Bookmarks', group: 'More', icon: Bookmark },
  ];

  const filtered = sheetSearch
    ? ALL_SECTIONS.filter(s =>
        s.label.toLowerCase().includes(sheetSearch.toLowerCase())
      )
    : ALL_SECTIONS;

  const grouped = filtered.reduce<Record<string, typeof ALL_SECTIONS>>((acc, s) => {
    const group = SECTION_META[s.group]?.label || s.group;
    if (!acc[group]) acc[group] = [];
    acc[group].push(s);
    return acc;
  }, {});

  const handleClose = () => {
    setOpen(false);
    setSheetSearch('');
  };

  return (
    <div className={styles.mobileNav}>
      {/* Overlay */}
      <div
        className={`${styles.overlay}${open ? ` ${styles.overlayOpen}` : ''}`}
        onClick={handleClose}
        aria-hidden={!open}
      />

      {/* Sheet */}
      <div
        id="mobile-nav-sheet"
        className={`${styles.sheet}${open ? ` ${styles.sheetOpen}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation"
      >
        {/* Handle */}
        <div className={styles.handle} aria-hidden="true" />

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.searchBar}>
            <Search size={16} strokeWidth={2} aria-hidden="true" />
            <input
              value={sheetSearch}
              onChange={e => setSheetSearch(e.target.value)}
              placeholder="Search sections…"
              aria-label="Search sections"
              className={styles.searchInput}
            />
          </div>
          <button
            type="button"
            className={styles.closeBtn}
            onClick={handleClose}
            aria-label="Close navigation"
          >
            <X size={20} strokeWidth={2} />
          </button>
        </div>

        {/* Sections */}
        <div className={styles.body}>
          {Object.entries(grouped).map(([group, sections]) => (
            <div key={group} className={styles.group}>
              <div className={styles.groupLabel}>{group}</div>
              <div className={styles.groupLinks}>
                {sections.map(s => {
                  const Icon = s.icon || HelpCircle;
                  const active = isActive(s.id);
                  return (
                    <Link
                      key={s.id}
                      to={`/${s.id}`}
                      className={`${styles.link}${active ? ` ${styles.active}` : ''}`}
                      onClick={handleClose}
                      aria-current={active ? 'page' : undefined}
                    >
                      <span className={styles.linkIcon}>
                        <Icon size={18} strokeWidth={2} aria-hidden="true" />
                      </span>
                      <span className={styles.linkText}>{s.label}</span>
                      {active && (
                        <ChevronRight size={14} strokeWidth={2} aria-hidden="true" className={styles.activeArrow} />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
