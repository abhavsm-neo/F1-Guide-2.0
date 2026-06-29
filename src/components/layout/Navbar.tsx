import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { NAV_GROUPS } from '../../data/nav';
import { useTheme } from '../../context/ThemeContext';
import { GlobalSearch } from './GlobalSearch';

export function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { darkMode, toggleTheme } = useTheme();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  const activePath = location.pathname.slice(1) || 'home';

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (!navRef.current?.contains(e.target as Node)) setOpenGroup(null);
    }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  const toggleGroup = (label: string) => {
    setOpenGroup(g => g === label ? null : label);
  };

  return (
    <>
      <nav className="nav" ref={navRef} aria-label="Main navigation">
        <div className="nav-inner">
          <Link
            to="/"
            className="nav-dropdown-item"
            style={{
              display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px',
              borderRadius: 8, border: 'none', background: activePath === 'home' ? 'rgba(225,6,0,0.08)' : 'transparent',
              cursor: 'pointer', color: activePath === 'home' ? '#e10600' : 'var(--text2)',
              fontFamily: 'Exo 2, sans-serif', fontSize: 13, fontWeight: activePath === 'home' ? 700 : 500,
              textDecoration: 'none',
            }}
          >
            🏠 Home
          </Link>
          {NAV_GROUPS.map(group => {
            const isOpen = openGroup === group.label;
            const hasActive = group.sections.some(s => s.id === activePath);
            return (
              <div key={group.label} className={`nav-group${isOpen ? ' open' : ''}${hasActive ? ' has-active' : ''}`}>
                <div
                  className="nav-group-label"
                  onClick={() => toggleGroup(group.label)}
                  role="button"
                  aria-expanded={isOpen}
                  tabIndex={0}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleGroup(group.label); } }}
                >
                  {group.label}
                  <span className="nav-chevron" aria-hidden="true">▼</span>
                </div>
                <div className="nav-dropdown" role="menu">
                  {group.sections.map(s => (
                    <Link
                      key={s.id}
                      to={`/${s.id}`}
                      className={`nav-dropdown-item${activePath === s.id ? ' active' : ''}`}
                      onClick={() => setOpenGroup(null)}
                      role="menuitem"
                    >
                      <span className="nav-dropdown-icon" aria-hidden="true">{s.icon}</span>
                      <span>
                        <div className="nav-dropdown-title">{s.label}</div>
                        <div className="nav-dropdown-desc">{s.desc}</div>
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <button
            className="theme-toggle"
            onClick={() => navigate('/bookmarks')}
            title="My Bookmarks"
            aria-label="My Bookmarks"
            style={{ fontSize: 16 }}
          >
            🔖
          </button>
          <button
            className="theme-toggle"
            onClick={toggleTheme}
            title={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      <div className="global-search-bar">
        <GlobalSearch />
      </div>
    </>
  );
}
