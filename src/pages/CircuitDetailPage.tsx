import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, ArrowLeft, Calendar } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import { PageReveal } from '../components/ui/PageReveal';
import styles from './CircuitDetailPage.module.css';

export default function CircuitDetailPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const navigate = useNavigate();

  const race = useMemo(() => {
    if (!circuitId) return undefined;
    const byRound = RACE_CALENDAR_2026.find(
      (r) => String(r.round) === circuitId
    );
    if (byRound) return byRound;
    const q = circuitId.toLowerCase().replace(/-/g, ' ');
    return (
      RACE_CALENDAR_2026.find(
        (r) =>
          r.name.toLowerCase().includes(q) ||
          r.circuit.toLowerCase().includes(q)
      )
    );
  }, [circuitId]);

  if (!race) {
    return (
      <PageReveal className={styles.page}>
        <div className={styles.sectionHeader}>
          <SectionHeader
            title="Circuit"
            accent="Not Found"
            group="Race & Stats"
            icon={MapPin}
          />
          <BookmarkButton sectionId="circuits" />
        </div>
        <EmptyState
          icon={MapPin}
          title="CIRCUIT NOT FOUND"
          sub={`No circuit matches "${circuitId}". Check the circuits list.`}
        />
      </PageReveal>
    );
  }

  const raceDate = new Date(race.date);
  const isSprint = race.tags?.includes('Sprint');
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

  function downloadIcs(r: typeof race) {
    if (!r) return;
    const start = new Date(r.date);
    const end = new Date(start.getTime() + 2 * 3600000);
    const fmt = (d: Date) => d.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
    const ics = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//F1Guide//EN',
      'BEGIN:VEVENT',
      `DTSTART:${fmt(start)}`,
      `DTEND:${fmt(end)}`,
      `SUMMARY:F1 ${r.name}`,
      `DESCRIPTION:Round ${r.round} · ${r.circuit}`,
      `LOCATION:${r.circuit}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
    const blob = new Blob([ics], { type: 'text/calendar' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `F1_${r.name.replace(/\s/g, '_')}.ics`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title={race.name}
          accent={`Round ${race.round}`}
          group="Race & Stats"
          icon={MapPin}
        />
        <BookmarkButton sectionId="circuits" />
      </div>

      <button
        onClick={() => navigate('/circuits')}
        className={styles.backBtn}
        aria-label="Back to circuits"
      >
        <ArrowLeft size={14} /> Back to Circuits
      </button>

      {race.cancelled && (
        <div className={styles.cancelledCard}>
          <div className={styles.cancelledLabel}>Cancelled</div>
          <p className={styles.cancelledText}>
            This race has been cancelled for the 2026 season.
          </p>
        </div>
      )}

      <div className={styles.card}>
        <div className={styles.statsGrid}>
          {[
            ['Circuit Length', race.length],
            ['Race Laps', race.cancelled ? '—' : String(race.laps)],
            ['Lap Record', race.lapRecord],
            ['Active Aero Zones', race.cancelled ? '—' : String(race.drs)],
            [
              'Race Date',
              raceDate.toLocaleDateString('en-GB', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
              }),
            ],
          ].map(([label, value]) => (
            <div key={String(label)}>
              <div className={styles.statLabel}>{String(label)}</div>
              <div className={styles.statValue}>{String(value)}</div>
            </div>
          ))}
        </div>
      </div>

      <p className={styles.desc}>{race.desc}</p>

      <div className={styles.tags}>
        {race.tags.map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>

      {!race.cancelled && (
        <button
          onClick={() => downloadIcs(race)}
          className={styles.icsBtn}
          aria-label={`Download ${race.name} calendar event`}
        >
          <Calendar size={16} /> Add to Calendar (.ICS)
        </button>
      )}

      <div className={styles.sessionTitle}>
        Session Times · {tz}
      </div>
      <div className={styles.sessionGrid}>
        {sessions.map((s) => {
          const d = new Date(raceDate.getTime() + s.offset);
          return (
            <div
              key={s.label}
              className={styles.sessionCard}
              style={{ opacity: d < new Date() ? 0.5 : 1 }}
            >
              <div className={styles.sessionType}>{s.label}</div>
              <div className={styles.sessionTime}>{fmtTime(d)}</div>
              <div className={styles.sessionDate}>{fmtDate(d)}</div>
            </div>
          );
        })}
      </div>
    </PageReveal>
  );
}
