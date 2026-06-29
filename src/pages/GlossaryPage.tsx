import { useState, useMemo } from 'react';
import { BookOpen, Search, ChevronDown } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { GLOSSARY } from '../data/glossary';
import styles from './GlossaryPage.module.css';

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
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="F1"
          accent="Glossary"
          group="Learn the Basics"
          icon={BookOpen}
          intro="Every piece of jargon you'll hear during a race weekend — explained clearly. Tap any term to expand the full definition."
        />
        <BookmarkButton sectionId="glossary" />
      </div>

      <div className={styles.searchWrap}>
        <Search size={16} className={styles.searchIcon} aria-hidden="true" />
        <input
          className={styles.searchInput}
          placeholder="Search terms..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search glossary terms"
        />
      </div>

      <div className={styles.filterRow} role="group" aria-label="Filter by category">
        {categories.map((c) => (
          <button
            key={c}
            className={[styles.filterPill, cat === c ? styles.filterPillActive : ''].join(' ')}
            onClick={() => setCat(c)}
            aria-pressed={cat === c}
          >
            {c}
          </button>
        ))}
      </div>

      <div className={styles.glossaryGrid}>
        {filtered.map((g) => (
          <div
            key={g.term}
            className={styles.glossaryCard}
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
            <div className={styles.glossaryTerm}>
              <span>{g.term}</span>
              <span className={styles.glossaryMeta}>
                <span
                  className={styles.glossaryCat}
                  style={{
                    background: `${g.catColor}22`,
                    color: g.catColor,
                    border: `1px solid ${g.catColor}44`,
                  }}
                >
                  {g.cat}
                </span>
                <ChevronDown
                  size={14}
                  className={styles.chevron}
                  style={{
                    transform: expanded[g.term] ? 'rotate(180deg)' : 'rotate(0deg)',
                  }}
                  aria-hidden="true"
                />
              </span>
            </div>
            {expanded[g.term] ? (
              <div className={styles.glossaryDef}>{g.def}</div>
            ) : (
              <div className={styles.glossaryDefPreview}>{g.def}</div>
            )}
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="NO TERMS FOUND"
          sub={`Nothing matches "${search}" — try a different search.`}
        />
      )}
    </div>
  );
}
