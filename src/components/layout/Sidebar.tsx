import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BookOpen, Trophy, BarChart3, Users, MapPin, Newspaper, Brain,
  HelpCircle, Bookmark, Search, ChevronDown, Gauge, Calendar, Zap,
  TrendingUp, Home, ChevronRight
} from 'lucide-react';
import { NAV_GROUPS } from '../../data/nav';
import { TEAMS } from '../../data/teams';
import { useBookmarks } from '../../context/BookmarksContext';
import { useTheme } from '../../context/ThemeContext';
import styles from './Sidebar.module.css';

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

const TEAM_COLOR_IDS = ['drivers', 'teams'];

export function Sidebar() {
  const location = useLocation();
  const { bookmarks } = useBookmarks();
  const { favoriteTeam, setFavoriteTeam } = useTheme();
  const [openSections, setOpenSections] = useState<Set<string>>(() => {
    const all = new Set<string>();
    NAV_GROUPS.forEach(g => all.add(g.label));
    return all;
  });

  const activePath = location.pathname.slice(1) || 'home';
  const activeTop = activePath.split('/')[0];

  const toggleSection = (label: string) => {
    setOpenSections(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  const isOpen = (label: string) => openSections.has(label);

  const isActive = (id: string) => {
    if (id === 'home') return location.pathname === '/';
    return activeTop === id;
  };

  return (
    <aside className={styles.sidebar} aria-label="Main navigation">
      <div className={styles.inner}>
        {/* Search shortcut */}
        <button
          type="button"
          className={styles.searchShortcut}
          onClick={() => window.dispatchEvent(new CustomEvent('open-search'))}
          aria-label="Open search"
        >
          <Search size={16} strokeWidth={2} aria-hidden="true" />
          <span className={styles.searchLabel}>Search</span>
          <kbd className={styles.kbd}>⌘K</kbd>
        </button>

        {/* Nav sections */}
        <nav className={styles.nav}>
          {/* Home link */}
          <Link
            to="/"
            className={`${styles.link}${isActive('home') ? ` ${styles.active}` : ''}`}
            aria-current={isActive('home') ? 'page' : undefined}
          >
            <Home size={16} strokeWidth={2} aria-hidden="true" />
            <span className={styles.linkText}>Home</span>
          </Link>

          {NAV_GROUPS.map(group => {
            const meta = SECTION_META[group.label];
            const Icon = meta?.icon || BookOpen;
            const sectionOpen = isOpen(group.label);
            const isSectionActive = group.sections.some(s => isActive(s.id));

            return (
              <div key={group.label} className={`${styles.section}${isSectionActive ? ' ' + styles.sectionActive : ''}`}>
                <button
                  type="button"
                  className={styles.sectionHeader}
                  onClick={() => toggleSection(group.label)}
                  aria-expanded={sectionOpen}
                >
                  <span className={styles.sectionTitle}>
                    <Icon size={16} strokeWidth={2} aria-hidden="true" />
                    {meta?.label || group.label}
                  </span>
                  <ChevronDown
                    size={14}
                    strokeWidth={2}
                    aria-hidden="true"
                    className={sectionOpen ? styles.chevronOpen : styles.chevron}
                  />
                </button>

                {sectionOpen && (
                  <div className={styles.sectionLinks}>
                    {group.sections.map(section => {
                      const LinkIcon = LINK_ICONS[section.id] || HelpCircle;
                      const active = isActive(section.id);
                      const showDot = TEAM_COLOR_IDS.includes(section.id);

                      return (
                        <Link
                          key={section.id}
                          to={`/${section.id}`}
                          className={`${styles.link}${active ? ` ${styles.active}` : ''}`}
                          aria-current={active ? 'page' : undefined}
                          title={section.desc}
                        >
                          <span className={styles.linkIconWrapper}>
                            <LinkIcon size={16} strokeWidth={2} aria-hidden="true" />
                            {showDot && <span className={styles.teamDot} />}
                          </span>
                          <span className={styles.linkText}>{section.label}</span>
                          {active && <ChevronRight size={14} strokeWidth={2} aria-hidden="true" className={styles.activeArrow} />}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}

          {/* More section */}
          <div className={styles.section}>
            <button
              type="button"
              className={styles.sectionHeader}
              onClick={() => toggleSection('More')}
              aria-expanded={isOpen('More')}
            >
              <span className={styles.sectionTitle}>
                <HelpCircle size={16} strokeWidth={2} aria-hidden="true" />
                More
              </span>
              <ChevronDown
                size={14}
                strokeWidth={2}
                aria-hidden="true"
                className={isOpen('More') ? styles.chevronOpen : styles.chevron}
              />
            </button>
            {isOpen('More') && (
              <div className={styles.sectionLinks}>
                <Link
                  to="/bookmarks"
                  className={`${styles.link}${isActive('bookmarks') ? ` ${styles.active}` : ''}`}
                  aria-current={isActive('bookmarks') ? 'page' : undefined}
                >
                  <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
                  <span className={styles.linkText}>Bookmarks</span>
                  {bookmarks.length > 0 && (
                    <span className={styles.badge}>{bookmarks.length}</span>
                  )}
                </Link>
              </div>
            )}
          </div>
        </nav>

        {/* Favorite team picker */}
        <div className={styles.teamPicker}>
          <span className={styles.teamPickerLabel}>Favorite Team</span>
          <div className={styles.teamGrid}>
            {TEAMS.map(team => (
              <button
                key={team.id}
                type="button"
                className={`${styles.teamPickerDot} ${favoriteTeam === team.id ? styles.teamPickerDotActive : ''}`}
                style={{ background: team.color }}
                onClick={() => setFavoriteTeam(favoriteTeam === team.id ? null : team.id)}
                aria-label={team.name}
                title={team.name}
              />
            ))}
          </div>
          {favoriteTeam && (
            <button
              type="button"
              className={styles.clearTeam}
              onClick={() => setFavoriteTeam(null)}
            >
              Clear Selection
            </button>
          )}
        </div>

        {/* Bookmark quick-access at bottom */}
        <div className={styles.bookmarkBar}>
          <Link to="/bookmarks" className={styles.bookmarkLink}>
            <Bookmark size={16} strokeWidth={2} aria-hidden="true" />
            <span className={styles.bookmarkLabel}>Bookmarks</span>
            {bookmarks.length > 0 && (
              <span className={styles.bookmarkCount}>{bookmarks.length}</span>
            )}
          </Link>
        </div>
      </div>
    </aside>
  );
}
