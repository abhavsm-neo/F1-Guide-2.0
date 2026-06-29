import { useState, useMemo } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { GLOSSARY } from '../data/glossary';

export default function GlossaryPage() {
  const [search, setSearch] = useState('');
  const [cat, setCat] = useState('All');
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const categories = useMemo(() => {
    const cats = new Set(GLOSSARY.map((g) => g.cat));
    return ['All', ...Array.from(cats).sort()];
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return GLOSSARY.filter((g) => {
      const matchSearch =
        g.term.toLowerCase().includes(q) || g.def.toLowerCase().includes(q);
      const matchCat = cat === 'All' || g.cat === cat;
      return matchSearch && matchCat;
    });
  }, [search, cat]);

  const toggleTerm = (term: string) => {
    setExpanded((prev) => ({ ...prev, [term]: !prev[term] }));
  };

  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="F1"
          accent="Glossary"
          group="Learn the Basics"
          icon="📖"
          intro="Every piece of jargon you'll hear during a race weekend — explained clearly. Tap any term to expand the full definition."
        />
        <BookmarkButton sectionId="glossary" />
      </div>

      <div className="search-wrap">
        <span className="search-icon" aria-hidden="true">
          🔍
        </span>
        <input
          className="search-input"
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search glossary terms"
        />
      </div>

      <div className="filter-row" role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            className={`filter-pill${cat === c ? ' active' : ''}`}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="glossary-grid">
        {filtered.map((g) => (
          <div
            key={g.term}
            className="glossary-card"
            onClick={() => toggleTerm(g.term)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleTerm(g.term);
              }
            }}
            aria-expanded={!!expanded[g.term]}
            aria-label={`${g.term} — ${g.cat}`}
          >
            <div className="glossary-term">
              <span>{g.term}</span>
              <span>
                <span
                  className="glossary-cat"
                  style={{
                    background: `${g.catColor}22`,
                    color: g.catColor,
                    border: `1px solid ${g.catColor}44`,
                  }}
                >
                  {g.cat}
                </span>
                <span
                  style={{
                    color: 'var(--text3)',
                    marginLeft: 8,
                    fontSize: 10,
                    transition: 'transform 0.2s',
                    display: 'inline-block',
                    transform: expanded[g.term] ? 'rotate(180deg)' : 'none',
                  }}
                  aria-hidden="true"
                >
                  ▼
                </span>
              </span>
            </div>
            {expanded[g.term] && (
              <div className="glossary-def">{g.def}</div>
            )}
            {!expanded[g.term] && (
              <div
                className="glossary-def"
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {g.def}
              </div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon="📖"
          title="NO TERMS FOUND"
          sub={`Nothing matches "${search}" — try a different search.`}
        />
      )}
    </div>
  );
}
