import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { TEAMS_2025, TEAMS_2026 } from '../data/teams';
import { TeamCard } from '../components/ui/TeamCard';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';

export default function TeamsPage() {
  const navigate = useNavigate();
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
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="The"
          accent="Teams"
          group="2026 Season"
          icon="🔧"
          intro="All 11 constructors — their engines, drivers, team principals, and what the 2026 regulation reset means for each one."
        />
        <BookmarkButton sectionId="teams" />
      </div>

      <div className="year-toggle">
        <button
          className={`year-btn${year === '2025' ? ' active' : ''}`}
          onClick={() => setYear('2025')}
          aria-pressed={year === '2025'}
        >
          2025 Season
        </button>
        <button
          className={`year-btn${year === '2026' ? ' active' : ''}`}
          onClick={() => setYear('2026')}
          aria-pressed={year === '2026'}
        >
          2026 Season <span className="new-badge">NEW</span>
        </button>
      </div>

      {year === '2026' && (
        <div
          className="card"
          style={{ marginBottom: 18, borderLeft: '3px solid #e10600' }}
        >
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
            <strong style={{ color: '#e10600' }}>2026 is a complete reset.</strong>{' '}
            New power unit rules require ~50% electric power. Red Bull switches from
            Honda to Ford. Alpine drops Renault for Mercedes. Sauber becomes the Audi
            works team — the first new manufacturer in F1 in over a decade.
          </p>
        </div>
      )}

      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          className="search-input"
          placeholder="Search teams, engine, TP or driver..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search teams, engine, TP or driver"
        />
      </div>

      <div className="card-grid">
        {filtered.map((t) => (
          <div
            key={t.id + year}
            onClick={() => navigate(`/teams/${t.id}`)}
            style={{ cursor: 'pointer' }}
            role="link"
            aria-label={`View profile for ${t.name}`}
          >
            <TeamCard team={t} />
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div
          style={{ color: 'var(--text4)', textAlign: 'center', padding: 40 }}
        >
          No teams found matching "{search}"
        </div>
      )}
    </div>
  );
}
