import { useState, useMemo } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import type { Race } from '../types';

function SessionTimesSection() {
  const now = new Date();
  const nextRace = RACE_CALENDAR_2026.find((r) => !r.cancelled && new Date(r.date) > now);
  if (!nextRace) return null;

  const raceDate = new Date(nextRace.date);
  const isSprint = nextRace.tags?.includes('Sprint');
  const sessions = isSprint
    ? [
        { label: 'FP1', offset: -2 * 86400000 - 3 * 3600000 },
        { label: 'Sprint Qualifying', offset: -2 * 86400000 },
        { label: 'Sprint Race', offset: -86400000 - 3 * 3600000 },
        { label: 'Qualifying', offset: -86400000 },
        { label: 'Race', offset: 0 },
      ]
    : [
        { label: 'FP1', offset: -2 * 86400000 - 5 * 3600000 },
        { label: 'FP2', offset: -2 * 86400000 - 2 * 3600000 },
        { label: 'FP3', offset: -86400000 - 4 * 3600000 },
        { label: 'Qualifying', offset: -86400000 - 1 * 3600000 },
        { label: 'Race', offset: 0 },
      ];

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const fmtTime = (d: Date) =>
    d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const fmtDate = (d: Date) =>
    d.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });

  return (
    <div style={{ marginBottom: 32 }}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 16,
          flexWrap: 'wrap',
        }}
      >
        <div
          style={{
            fontFamily: 'Orbitron',
            fontSize: 11,
            color: '#e10600',
            letterSpacing: 2,
          }}
        >
          NEXT RACE WEEKEND
        </div>
        <div
          style={{
            fontFamily: 'Orbitron',
            fontSize: 14,
            fontWeight: 700,
            color: 'var(--text)',
          }}
        >
          {nextRace.flag} {nextRace.name}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text3)', marginLeft: 'auto' }}>
          Times in your timezone · {tz}
        </div>
      </div>
      <div className="session-grid">
        {sessions.map((s) => {
          const d = new Date(raceDate.getTime() + s.offset);
          const isPast = d < now;
          const isNext =
            !isPast &&
            sessions.findIndex(
              (x) => new Date(raceDate.getTime() + x.offset) > now
            ) === sessions.indexOf(s);
          return (
            <div
              key={s.label}
              className="session-card"
              style={{
                borderColor: isNext
                  ? '#e10600'
                  : isPast
                    ? 'var(--border)'
                    : 'var(--border)',
                opacity: isPast ? 0.5 : 1,
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {isNext && (
                <div
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: 2,
                    background: '#e10600',
                  }}
                />
              )}
              <div className="session-type">{s.label}</div>
              <div className="session-time">{fmtTime(d)}</div>
              <div className="session-date">{fmtDate(d)}</div>
              {isPast && (
                <div
                  style={{
                    fontSize: 9,
                    color: '#00dc78',
                    fontFamily: 'Orbitron',
                    letterSpacing: 1,
                    marginTop: 4,
                  }}
                >
                  DONE
                </div>
              )}
              {isNext && (
                <div
                  style={{
                    fontSize: 9,
                    color: '#e10600',
                    fontFamily: 'Orbitron',
                    letterSpacing: 1,
                    marginTop: 4,
                  }}
                >
                  NEXT ▲
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function CircuitsPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<Race | null>(null);

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    return RACE_CALENDAR_2026.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.circuit.toLowerCase().includes(q) ||
        c.tags.some((t) => t.toLowerCase().includes(q))
    );
  }, [search]);

  function downloadIcs(c: Race) {
    const start = new Date(c.date);
    const end = new Date(start.getTime() + 2 * 3600000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//F1Guide//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:🏎️ F1 ${c.name}`,
      `DESCRIPTION:Round ${c.round} · ${c.circuit}`,
      `LOCATION:${c.circuit}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `F1_${c.name.replace(/\s/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="2026"
          accent="Circuit Guide"
          group="Race & Stats"
          icon="🗺️"
          intro="All 22 circuits on the 2026 calendar — lap records, key facts, and what makes each one unique."
        />
        <BookmarkButton sectionId="circuits" />
      </div>

      <SessionTimesSection />

      <div className="search-wrap" style={{ marginBottom: 20 }}>
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          placeholder="Search circuit, country or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search circuits"
        />
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.85)',
            zIndex: 9999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: 20,
          }}
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} details`}
        >
          <div
            style={{
              background: 'var(--bg2)',
              border: '1px solid #e10600',
              borderRadius: 6,
              maxWidth: 520,
              width: '100%',
              padding: 28,
              position: 'relative',
              maxHeight: '90vh',
              overflowY: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              style={{
                position: 'absolute',
                top: 14,
                right: 16,
                background: 'none',
                border: 'none',
                color: 'var(--text3)',
                fontSize: 20,
                cursor: 'pointer',
                lineHeight: 1,
              }}
              aria-label="Close circuit details"
            >
              ✕
            </button>
            <div style={{ fontSize: 36, marginBottom: 8 }}>{selected.flag}</div>
            <div
              style={{
                fontFamily: 'Orbitron',
                fontSize: 14,
                fontWeight: 900,
                color: 'var(--text)',
                textTransform: 'uppercase',
                letterSpacing: 2,
                marginBottom: 2,
              }}
            >
              {selected.name}
            </div>
            <div
              style={{
                fontSize: 11,
                color: '#e10600',
                fontFamily: 'Orbitron',
                letterSpacing: 2,
                marginBottom: 16,
              }}
            >
              ROUND {selected.round} · {selected.circuit}
            </div>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: 12,
                marginBottom: 16,
              }}
            >
              {[
                ['Circuit Length', selected.length],
                ['Race Laps', selected.laps],
                ['Lap Record', selected.lapRecord],
                ['Active Aero Zones', selected.drs],
                [
                  'Race Date',
                  new Date(selected.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  }),
                ],
              ].map(([l, v]) => (
                <div key={String(l)}>
                  <div
                    style={{
                      fontSize: 9,
                      color: 'var(--text4)',
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontFamily: 'Orbitron',
                      marginBottom: 3,
                    }}
                  >
                    {String(l)}
                  </div>
                  <div
                    style={{
                      fontSize: 13,
                      color: 'var(--text)',
                      fontWeight: 600,
                    }}
                  >
                    {String(v)}
                  </div>
                </div>
              ))}
            </div>
            <p
              style={{
                fontSize: 13,
                color: 'var(--text3)',
                lineHeight: 1.8,
                marginBottom: 14,
              }}
            >
              {selected.desc}
            </p>
            <div style={{ marginBottom: 16 }}>
              {selected.tags.map((t) => (
                <span key={t} className="circuit-tag">
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => downloadIcs(selected)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '9px 16px',
                background: 'rgba(0,220,120,0.1)',
                border: '1px solid rgba(0,220,120,0.3)',
                color: '#00dc78',
                fontFamily: 'Orbitron',
                fontSize: 10,
                letterSpacing: 2,
                cursor: 'pointer',
                borderRadius: 3,
                width: '100%',
                justifyContent: 'center',
              }}
              aria-label={`Download ${selected.name} calendar event`}
            >
              📅 ADD TO CALENDAR (.ICS)
            </button>
          </div>
        </div>
      )}

      <div className="circuit-grid">
        {filtered.map((c) => (
          <div
            key={c.round}
            className="circuit-card"
            onClick={() => setSelected(c)}
            style={{ opacity: c.cancelled ? 0.55 : 1, position: 'relative' }}
            role="button"
            tabIndex={0}
            aria-label={`${c.name} circuit details`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelected(c);
            }}
          >
            {c.cancelled && (
              <div
                style={{
                  position: 'absolute',
                  top: 10,
                  right: 10,
                  zIndex: 2,
                  background: '#e10600',
                  color: '#fff',
                  fontFamily: 'Orbitron',
                  fontSize: 8,
                  letterSpacing: 2,
                  padding: '3px 8px',
                  borderRadius: 3,
                }}
              >
                CANCELLED
              </div>
            )}
            <div className="circuit-card-header">
              <div className="circuit-flag">{c.flag}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  className="circuit-name"
                  style={{
                    textDecoration: c.cancelled ? 'line-through' : 'none',
                  }}
                >
                  {c.name}
                </div>
                <div className="circuit-country">{c.circuit}</div>
              </div>
              <div className="circuit-round">R{c.round}</div>
            </div>
            <div className="circuit-body">
              <div
                style={{
                  width: '100%',
                  height: 110,
                  borderRadius: 8,
                  marginBottom: 10,
                  background: c.cancelled
                    ? 'linear-gradient(135deg, rgba(225,6,0,0.05) 0%, var(--bg3) 100%)'
                    : 'linear-gradient(135deg, var(--bg3) 0%, var(--bg2) 100%)',
                  border: c.cancelled
                    ? '1px solid rgba(225,6,0,0.2)'
                    : '1px solid var(--border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 18px',
                  overflow: 'hidden',
                  position: 'relative',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    right: -8,
                    top: -12,
                    fontFamily: 'Orbitron',
                    fontSize: 72,
                    fontWeight: 900,
                    color: 'rgba(225,6,0,0.06)',
                    lineHeight: 1,
                    pointerEvents: 'none',
                  }}
                >
                  {c.round}
                </div>
                <div>
                  <div
                    style={{
                      fontFamily: 'Orbitron',
                      fontSize: 9,
                      color: c.cancelled ? '#e10600' : '#e10600',
                      letterSpacing: 3,
                      marginBottom: 4,
                    }}
                  >
                    {c.cancelled ? 'CANCELLED' : `ROUND ${c.round}`}
                  </div>
                  <div
                    style={{
                      fontFamily: 'Orbitron',
                      fontSize: 16,
                      fontWeight: 900,
                      color: 'var(--text)',
                      lineHeight: 1.2,
                      maxWidth: 160,
                    }}
                  >
                    {c.circuit.toUpperCase()}
                  </div>
                </div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-end',
                    gap: 6,
                  }}
                >
                  {!c.cancelled && (
                    <div
                      style={{
                        background: 'rgba(39,244,210,0.1)',
                        border: '1px solid rgba(39,244,210,0.25)',
                        borderRadius: 20,
                        padding: '3px 10px',
                        fontSize: 9,
                        fontFamily: 'Orbitron',
                        color: '#27F4D2',
                        letterSpacing: 1,
                      }}
                    >
                      AERO ZONES ×{c.drs}
                    </div>
                  )}
                  <div
                    style={{
                      fontSize: 11,
                      color: 'var(--text3)',
                      fontFamily: 'Orbitron',
                    }}
                  >
                    {c.length}
                  </div>
                </div>
              </div>
              <div className="circuit-stats">
                <div className="circuit-stat-item">
                  <span className="circuit-stat-lbl">Length</span>
                  <span className="circuit-stat-val">{c.length}</span>
                </div>
                <div className="circuit-stat-item">
                  <span className="circuit-stat-lbl">Laps</span>
                  <span className="circuit-stat-val">
                    {c.cancelled ? '—' : c.laps}
                  </span>
                </div>
                <div className="circuit-stat-item">
                  <span className="circuit-stat-lbl">Active Aero Zones</span>
                  <span className="circuit-stat-val">
                    {c.cancelled ? '—' : c.drs}
                  </span>
                </div>
                <div className="circuit-stat-item">
                  <span className="circuit-stat-lbl">Race Date</span>
                  <span className="circuit-stat-val">
                    {new Date(c.date).toLocaleDateString('en-GB', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </span>
                </div>
              </div>
              <div>
                {c.tags.map((t) => (
                  <span key={t} className="circuit-tag">
                    {t}
                  </span>
                ))}
              </div>
              <div
                className="circuit-desc"
                style={{
                  marginTop: 10,
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                }}
              >
                {c.desc}
              </div>
              <div
                style={{
                  marginTop: 8,
                  fontSize: 10,
                  color: '#e10600',
                  fontFamily: 'Orbitron',
                  letterSpacing: 1,
                }}
              >
                TAP FOR DETAILS →
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <EmptyState
          icon="🗺️"
          title="NO CIRCUITS FOUND"
          sub="Try a different search term."
        />
      )}
    </div>
  );
}
