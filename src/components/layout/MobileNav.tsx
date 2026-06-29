import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { NAV_GROUPS } from '../../data/nav';

const MOBILE_QUICK_TABS = [
  { id: 'home', icon: '🏠', label: 'Home' },
  { id: 'drivers', icon: '🏎️', label: 'Drivers' },
  { id: 'circuits', icon: '🗺️', label: 'Circuits' },
  { id: 'preview', icon: '🔭', label: 'Preview' },
  { id: '__more__', icon: '☰', label: 'More' },
];

export function MobileNav() {
  const location = useLocation();
  const [showSheet, setShowSheet] = useState(false);
  const [sheetSearch, setSheetSearch] = useState('');

  const activePath = location.pathname.slice(1) || 'home';

  const ALL_MOBILE_SECTIONS = NAV_GROUPS.flatMap(g =>
    g.sections.map(s => ({ ...s, group: g.label }))
  ).concat([{ id: 'bookmarks', icon: '🔖', label: 'Bookmarks', group: 'Me', desc: 'Your saved sections' }]);

  const filtered = sheetSearch
    ? ALL_MOBILE_SECTIONS.filter(s =>
        s.label.toLowerCase().includes(sheetSearch.toLowerCase()) ||
        (s.desc || '').toLowerCase().includes(sheetSearch.toLowerCase())
      )
    : ALL_MOBILE_SECTIONS;

  const grouped = filtered.reduce<Record<string, typeof ALL_MOBILE_SECTIONS>>((acc, s) => {
    if (!acc[s.group]) acc[s.group] = [];
    acc[s.group].push(s);
    return acc;
  }, {});

  const go = (_id: string) => {
    setShowSheet(false);
    setSheetSearch('');
  };

  return (
    <>
      <div className="mobile-nav" role="navigation" aria-label="Mobile navigation">
        <div className="mobile-nav-inner">
          {MOBILE_QUICK_TABS.map(tab => {
            const isMore = tab.id === '__more__';
            const isActive = !isMore && activePath === tab.id;
            return (
              <button
                key={tab.id}
                className={`mobile-nav-btn${isActive ? ' active' : ''}`}
                onClick={() => isMore ? setShowSheet(s => !s) : go(tab.id)}
                aria-label={tab.label}
              >
                <span className="mobile-nav-icon" aria-hidden="true">{tab.icon}</span>
                <span className="mobile-nav-label" style={{ color: isMore && showSheet ? '#e10600' : undefined }}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {showSheet && (
        <div className="mobile-nav-more-sheet" onClick={() => setShowSheet(false)} role="dialog" aria-modal="true">
          <div className="mobile-nav-sheet-inner" onClick={e => e.stopPropagation()}>
            <div style={{ width: 36, height: 4, background: 'var(--border2)', borderRadius: 2, margin: '0 auto 16px' }} aria-hidden="true" />
            <div style={{ fontFamily: 'Orbitron', fontSize: 11, color: '#e10600', letterSpacing: 2, marginBottom: 12 }}>ALL SECTIONS</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'var(--bg3)', borderRadius: 8, padding: '8px 12px', marginBottom: 14, border: '1px solid var(--border)' }}>
              <span style={{ fontSize: 13, opacity: 0.5 }} aria-hidden="true">🔍</span>
              <input
                value={sheetSearch}
                onChange={e => setSheetSearch(e.target.value)}
                placeholder="Search sections…"
                aria-label="Search sections"
                style={{ background: 'none', border: 'none', outline: 'none', fontSize: 13, color: 'var(--text)', flex: 1, fontFamily: "'Exo 2', sans-serif" }}
              />
            </div>
            {Object.entries(grouped).map(([group, sections]) => (
              <div key={group} style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: 'var(--text4)', fontFamily: 'Orbitron', letterSpacing: 2, marginBottom: 6, paddingLeft: 14 }}>{group.toUpperCase()}</div>
                {sections.map(s => (
                  <Link
                    key={s.id}
                    to={`/${s.id}`}
                    className={`mobile-sheet-item${activePath === s.id ? ' active' : ''}`}
                    onClick={() => go(s.id)}
                  >
                    <span style={{ fontSize: 20 }} aria-hidden="true">{s.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, color: activePath === s.id ? '#e10600' : 'var(--text)' }}>{s.label}</div>
                      {s.desc && <div style={{ fontSize: 10, color: 'var(--text4)', marginTop: 1, lineHeight: 1.4 }}>{s.desc}</div>}
                    </div>
                    {activePath === s.id && <span style={{ color: '#e10600', fontSize: 14 }} aria-hidden="true">●</span>}
                  </Link>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
