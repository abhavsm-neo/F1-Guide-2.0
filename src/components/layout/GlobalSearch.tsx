import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, User, BookOpen, MapPin, FileText, Settings, HelpCircle } from 'lucide-react';
import { SEARCH_INDEX } from '../../data/nav';
import type { SearchResult } from '../../types';
import styles from './GlobalSearch.module.css';

const TYPE_COLORS: Record<string, string> = {
  Driver: '#e10600',
  Term: '#9966FF',
  Circuit: '#00dc78',
  Section: '#606080',
  Team: '#3671C6',
  Rule: '#FFD700',
};

const TYPE_ICONS: Record<string, React.ElementType> = {
  Driver: User,
  Term: BookOpen,
  Circuit: MapPin,
  Section: FileText,
  Team: Settings,
  Rule: HelpCircle,
};

export function GlobalSearch() {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [focused, setFocused] = useState(-1);
  const ref = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const searchIndex = useCallback((q: string): SearchResult[] => {
    const lower = q.toLowerCase();
    return SEARCH_INDEX.filter(
      item =>
        item.title.toLowerCase().includes(lower) ||
        (item.sub || '').toLowerCase().includes(lower) ||
        (item.keywords || '').includes(lower)
    ).slice(0, 8);
  }, []);

  const results = query.length > 1 ? searchIndex(query) : [];

  useEffect(() => {
    function handle(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener('mousedown', handle);
    return () => document.removeEventListener('mousedown', handle);
  }, []);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(true);
        inputRef.current?.focus();
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

  useEffect(() => {
    function handle() {
      setOpen(true);
      inputRef.current?.focus();
    }
    window.addEventListener('open-search', handle);
    return () => window.removeEventListener('open-search', handle);
  }, []);

  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
      inputRef.current?.focus();
    } else {
      document.body.style.overflow = '';
      setQuery('');
      setFocused(-1);
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  function handleKey(e: React.KeyboardEvent) {
    if (!open) return;
    if (e.key === 'ArrowDown') { e.preventDefault(); setFocused(f => Math.min(f + 1, results.length - 1)); }
    if (e.key === 'ArrowUp') { e.preventDefault(); setFocused(f => Math.max(f - 1, 0)); }
    if (e.key === 'Enter' && focused >= 0 && results[focused]) {
      navigate(`/${results[focused].section}`); setQuery(''); setOpen(false); setFocused(-1);
    }
    if (e.key === 'Escape') { setOpen(false); setFocused(-1); }
  }

  function highlight(text: string, q: string) {
    if (!q || q.length < 2) return text;
    const idx = text.toLowerCase().indexOf(q.toLowerCase());
    if (idx === -1) return text;
    return (
      <>
        {text.slice(0, idx)}
        <mark className={styles.highlight}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  const goToResult = (section: string) => {
    navigate(`/${section}`);
    setQuery('');
    setOpen(false);
    setFocused(-1);
  };

  return (
    <>
      {open && (
        <div className={styles.overlay} onClick={() => setOpen(false)} aria-hidden="true" />
      )}
      <div
        ref={ref}
        className={`${styles.modal}${open ? ` ${styles.open}` : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Search"
      >
        <div className={styles.inputWrap}>
          <Search size={18} strokeWidth={2} aria-hidden="true" className={styles.inputIcon} />
          <input
            ref={inputRef}
            value={query}
            onChange={e => { setQuery(e.target.value); setFocused(-1); }}
            onKeyDown={handleKey}
            placeholder="Search drivers, circuits, features..."
            aria-label="Search"
            aria-autocomplete="list"
            aria-controls={open ? 'search-results' : undefined}
            aria-activedescendant={focused >= 0 ? `search-result-${focused}` : undefined}
            className={styles.input}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); inputRef.current?.focus(); }}
              aria-label="Clear search"
              className={styles.clearBtn}
            >
              <X size={16} strokeWidth={2} />
            </button>
          )}
          {!query && <kbd className={styles.kbd}>⌘K</kbd>}
        </div>

        {open && query.length > 1 && (
          <div
            id="search-results"
            role="listbox"
            className={styles.results}
          >
            {results.length > 0 ? (
              <>
                {results.map((r, i) => {
                  const Icon = TYPE_ICONS[r.type] || HelpCircle;
                  return (
                    <button
                      type="button"
                      key={i}
                      id={`search-result-${i}`}
                      role="option"
                      aria-selected={focused === i}
                      onClick={() => goToResult(r.section)}
                      className={`${styles.result}${focused === i ? ` ${styles.resultFocused}` : ''}`}
                      onMouseEnter={() => setFocused(i)}
                      onMouseLeave={() => setFocused(-1)}
                    >
                      <div
                        className={styles.resultIcon}
                        style={{
                          background: `${r.color || '#e10600'}18`,
                          borderColor: `${r.color || '#e10600'}33`,
                        }}
                        aria-hidden="true"
                      >
                        <Icon size={18} strokeWidth={2} style={{ color: r.color || '#e10600' }} />
                      </div>
                      <div className={styles.resultBody}>
                        <div className={styles.resultTitle}>
                          {highlight(r.title, query)}
                        </div>
                        <div className={styles.resultSub}>
                          {r.sub}
                        </div>
                      </div>
                      <div
                        className={styles.resultBadge}
                        style={{
                          background: `${TYPE_COLORS[r.type] || '#606080'}18`,
                          color: TYPE_COLORS[r.type] || '#606080',
                          borderColor: `${TYPE_COLORS[r.type] || '#606080'}33`,
                        }}
                      >
                        {r.type}
                      </div>
                    </button>
                  );
                })}
                <div className={styles.footer}>
                  {results.length} RESULT{results.length !== 1 ? 'S' : ''} · ↑↓ NAVIGATE · ↵ SELECT
                </div>
              </>
            ) : (
              <div className={styles.empty}>
                <Search size={24} strokeWidth={2} aria-hidden="true" className={styles.emptyIcon} />
                <div className={styles.emptyTitle}>No results for "{query}"</div>
                <div className={styles.emptyHint}>Try a driver name, circuit, or F1 term</div>
              </div>
            )}
          </div>
        )}
      </div>
    </>
  );
}
