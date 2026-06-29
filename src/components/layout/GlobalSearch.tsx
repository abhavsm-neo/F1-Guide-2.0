import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { SEARCH_INDEX } from '../../data/nav';
import type { SearchResult } from '../../types';

const TYPE_COLORS: Record<string, string> = {
  Driver: '#e10600',
  Term: '#9966FF',
  Circuit: '#00dc78',
  Section: '#606080',
  Team: '#3671C6',
  Rule: '#FFD700',
};

export function GlobalSearch() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
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
        inputRef.current?.focus();
        setOpen(true);
      }
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, []);

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
        <mark style={{ background: 'rgba(225,6,0,0.25)', color: 'var(--text)', borderRadius: 2, padding: '0 1px' }}>
          {text.slice(idx, idx + q.length)}
        </mark>
        {text.slice(idx + q.length)}
      </>
    );
  }

  return (
    <div ref={ref} style={{ position: 'relative', width: '100%', maxWidth: 480 }}>
      <div
        style={{
          display: 'flex', alignItems: 'center', gap: 10, padding: '9px 14px',
          background: 'var(--card-bg)', border: `1px solid ${open ? 'rgba(225,6,0,0.4)' : 'var(--glass-border)'}`,
          borderRadius: 10, transition: 'border-color 0.2s, box-shadow 0.2s',
          boxShadow: open ? '0 0 0 3px rgba(225,6,0,0.08)' : 'var(--shadow)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <span style={{ fontSize: 14, color: 'var(--text3)', flexShrink: 0 }} aria-hidden="true">🔍</span>
        <input
          ref={inputRef}
          value={query}
          onChange={e => { setQuery(e.target.value); setOpen(true); setFocused(-1); }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          placeholder="Search drivers, circuits, features..."
          aria-label="Search"
          aria-autocomplete="list"
          aria-controls={open ? 'search-results' : undefined}
          aria-activedescendant={focused >= 0 ? `search-result-${focused}` : undefined}
          style={{ flex: 1, background: 'none', border: 'none', outline: 'none', color: 'var(--text)', fontSize: 13, fontFamily: 'Exo 2, sans-serif' }}
        />
        {query && (
          <button
            onClick={() => { setQuery(''); setOpen(false); inputRef.current?.focus(); }}
            aria-label="Clear search"
            style={{ background: 'none', border: 'none', color: 'var(--text4)', cursor: 'pointer', fontSize: 13, lineHeight: 1, padding: '2px 4px', borderRadius: 4 }}
          >
            ✕
          </button>
        )}
        {!query && <span style={{ fontSize: 10, color: 'var(--text4)', fontFamily: 'Orbitron', letterSpacing: 1, flexShrink: 0 }}>⌘K</span>}
      </div>

      {open && query.length > 1 && (
        <div
          id="search-results"
          role="listbox"
          style={{
            position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
            background: 'rgba(10,10,20,0.95)', backdropFilter: 'blur(24px)',
            border: '1px solid var(--glass-border)', borderTop: '2px solid #e10600',
            borderRadius: '0 0 12px 12px', zIndex: 500,
            boxShadow: '0 20px 60px rgba(0,0,0,0.6)',
            overflow: 'hidden',
          }}
        >
          {results.length > 0 ? (
            <>
              {results.map((r, i) => (
                <button
                  key={i}
                  id={`search-result-${i}`}
                  role="option"
                  aria-selected={focused === i}
                  onClick={() => { navigate(`/${r.section}`); setQuery(''); setOpen(false); setFocused(-1); }}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12, width: '100%',
                    padding: '11px 16px', background: focused === i ? 'rgba(225,6,0,0.08)' : 'none',
                    border: 'none', borderBottom: '1px solid var(--border)', cursor: 'pointer',
                    textAlign: 'left', transition: 'background 0.1s',
                  }}
                  onMouseEnter={() => setFocused(i)}
                  onMouseLeave={() => setFocused(-1)}
                >
                  <div style={{
                    width: 36, height: 36, borderRadius: 8, flexShrink: 0,
                    background: `${r.color || '#e10600'}18`,
                    border: `1px solid ${r.color || '#e10600'}33`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 16,
                  }} aria-hidden="true">
                    {r.extra || r.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--text)', marginBottom: 2 }}>
                      {highlight(r.title, query)}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--text3)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {r.sub}
                    </div>
                  </div>
                  <div style={{
                    fontSize: 8, fontFamily: 'Orbitron', letterSpacing: 1,
                    padding: '2px 7px', borderRadius: 20, flexShrink: 0,
                    background: `${TYPE_COLORS[r.type] || '#606080'}18`,
                    color: TYPE_COLORS[r.type] || '#606080',
                    border: `1px solid ${TYPE_COLORS[r.type] || '#606080'}33`,
                    textTransform: 'uppercase',
                  }}>
                    {r.type}
                  </div>
                </button>
              ))}
              <div style={{ padding: '8px 16px', fontSize: 10, color: 'var(--text4)', fontFamily: 'Orbitron', letterSpacing: 1 }}>
                {results.length} RESULT{results.length !== 1 ? 'S' : ''} · ↑↓ NAVIGATE · ↵ SELECT
              </div>
            </>
          ) : (
            <div style={{ padding: '24px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }} aria-hidden="true">🔎</div>
              <div style={{ fontFamily: 'Orbitron', fontSize: 10, color: 'var(--text3)', letterSpacing: 2 }}>
                NO RESULTS FOR "{query.toUpperCase()}"
              </div>
              <div style={{ fontSize: 11, color: 'var(--text4)', marginTop: 4 }}>Try a driver name, circuit, or F1 term</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
