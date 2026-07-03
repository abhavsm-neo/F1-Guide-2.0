import { useState, useMemo } from 'react';
import { MapPin, Search, X, Calendar } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import type { Race } from '../types';
import styles from './CircuitsPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

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
    <div className={styles.sessionSection}>
      <div className={styles.sessionHeader}>
        <div className={styles.sessionLabel}>Next Race Weekend</div>
        <div className={styles.sessionRaceName}>
          {nextRace.flag} {nextRace.name}
        </div>
        <div className={styles.sessionTz}>
          Times in your timezone · {tz}
        </div>
      </div>
      <div className={styles.sessionGrid}>
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
              className={isNext ? styles.sessionCardActive : isPast ? styles.sessionCardPast : styles.sessionCard}
            >
              <div className={styles.sessionType}>{s.label}</div>
              <div className={styles.sessionTime}>{fmtTime(d)}</div>
              <div className={styles.sessionDate}>{fmtDate(d)}</div>
              {isPast && (
                <div className={styles.sessionStatus} style={{ color: 'var(--success)' }}>
                  Done
                </div>
              )}
              {isNext && (
                <div className={styles.sessionStatus} style={{ color: 'var(--accent)' }}>
                  Next
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
      `SUMMARY:F1 ${c.name}`,
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
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="2026"
          accent="Circuit Guide"
          group="Race & Stats"
          icon={MapPin}
          intro="All 22 circuits on the 2026 calendar — lap records, key facts, and what makes each one unique."
        />
        <BookmarkButton sectionId="circuits" />
      </div>

      <SessionTimesSection />

      <div className={styles.searchWrap}>
        <span className={styles.searchIcon} aria-hidden="true">
          <Search size={16} />
        </span>
        <input
          className={styles.searchInput}
          placeholder="Search circuit, country or tag..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search circuits"
        />
      </div>

      {/* Detail modal */}
      {selected && (
        <div
          className={styles.modalOverlay}
          onClick={() => setSelected(null)}
          role="dialog"
          aria-modal="true"
          aria-label={`${selected.name} details`}
        >
          <div
            className={styles.modalContent}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelected(null)}
              className={styles.modalClose}
              aria-label="Close circuit details"
            >
              <X size={20} />
            </button>
            <div className={styles.modalFlag}>{selected.flag}</div>
            <div className={styles.modalName}>{selected.name}</div>
            <div className={styles.modalSubtitle}>
              Round {selected.round} · {selected.circuit}
            </div>
            <div className={styles.modalGrid}>
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
                  <div className={styles.modalGridLabel}>{String(l)}</div>
                  <div className={styles.modalGridValue}>{String(v)}</div>
                </div>
              ))}
            </div>
            <p className={styles.modalDesc}>{selected.desc}</p>
            <div className={styles.modalTags}>
              {selected.tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
            <button
              onClick={() => downloadIcs(selected)}
              className={styles.icsBtn}
              aria-label={`Download ${selected.name} calendar event`}
            >
              <Calendar size={16} /> Add to Calendar (.ICS)
            </button>
          </div>
        </div>
      )}

      <div className={styles.circuitGrid}>
        {filtered.map((c) => (
          <div
            key={c.round}
            className={styles.circuitCard}
            onClick={() => setSelected(c)}
            style={{ opacity: c.cancelled ? 0.55 : 1 }}
            role="button"
            tabIndex={0}
            aria-label={`${c.name} circuit details`}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') setSelected(c);
            }}
          >
            {c.cancelled && (
              <div className={styles.cancelledBadge}>Cancelled</div>
            )}
            <div className={styles.circuitHeader}>
              <div className={styles.circuitFlag}>{c.flag}</div>
              <div className={styles.circuitInfo}>
                <div
                  className={styles.circuitName}
                  style={{ textDecoration: c.cancelled ? 'line-through' : 'none' }}
                >
                  {c.name}
                </div>
                <div className={styles.circuitCircuit}>{c.circuit}</div>
              </div>
              <div className={styles.circuitRound}>R{c.round}</div>
            </div>
            <div
              className={`${styles.circuitVisual} ${c.cancelled ? styles.circuitVisualCancelled : styles.circuitVisualBg}`}
            >
              <div className={styles.circuitVisualRound}>{c.round}</div>
              <div>
                <div className={styles.circuitVisualLabel}>
                  {c.cancelled ? 'Cancelled' : `Round ${c.round}`}
                </div>
                <div className={styles.circuitVisualName}>
                  {c.circuit.toUpperCase()}
                </div>
              </div>
              <div className={styles.circuitVisualRight}>
                {!c.cancelled && (
                  <div className={styles.drsBadge}>
                    Aero Zones ×{c.drs}
                  </div>
                )}
                <div className={styles.circuitLength}>{c.length}</div>
              </div>
            </div>
            <div className={styles.circuitStats}>
              <div className={styles.circuitStat}>
                <span className={styles.circuitStatLabel}>Length</span>
                <span className={styles.circuitStatValue}>{c.length}</span>
              </div>
              <div className={styles.circuitStat}>
                <span className={styles.circuitStatLabel}>Laps</span>
                <span className={styles.circuitStatValue}>
                  {c.cancelled ? '—' : c.laps}
                </span>
              </div>
              <div className={styles.circuitStat}>
                <span className={styles.circuitStatLabel}>Aero Zones</span>
                <span className={styles.circuitStatValue}>
                  {c.cancelled ? '—' : c.drs}
                </span>
              </div>
              <div className={styles.circuitStat}>
                <span className={styles.circuitStatLabel}>Race Date</span>
                <span className={styles.circuitStatValue}>
                  {new Date(c.date).toLocaleDateString('en-GB', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </span>
              </div>
            </div>
            <div className={styles.circuitTags}>
              {c.tags.map((t) => (
                <span key={t} className={styles.tag}>
                  {t}
                </span>
              ))}
            </div>
            <div className={styles.circuitDesc}>{c.desc}</div>
            <div className={styles.circuitTapHint}>Tap for details →</div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <EmptyState
          icon={MapPin}
          title="NO CIRCUITS FOUND"
          sub="Try a different search term."
        />
      )}
    </PageReveal>
  );
}
