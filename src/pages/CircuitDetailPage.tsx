import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { RACE_CALENDAR_2026 } from '../data/circuits';

export default function CircuitDetailPage() {
  const { circuitId } = useParams<{ circuitId: string }>();
  const navigate = useNavigate();

  const race = useMemo(() => {
    if (!circuitId) return undefined;
    // Try round number first
    const byRound = RACE_CALENDAR_2026.find(
      (r) => String(r.round) === circuitId
    );
    if (byRound) return byRound;
    // Try name/circuit matching
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
      <div className="section-enter">
        <div className="section-header">
          <SectionHeader
            title="Circuit"
            accent="Not Found"
            group="Race & Stats"
            icon="🗺️"
          />
          <BookmarkButton sectionId="circuits" />
        </div>
        <EmptyState
          icon="🗺️"
          title="CIRCUIT NOT FOUND"
          sub={`No circuit matches "${circuitId}". Check the circuits list.`}
        />
      </div>
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
      `SUMMARY:🏎️ F1 ${r.name}`,
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
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title={race.name}
          accent={`Round ${race.round}`}
          group="Race & Stats"
          icon={race.flag}
        />
        <BookmarkButton sectionId="circuits" />
      </div>

      <button
        onClick={() => navigate('/circuits')}
        style={{
          padding: '6px 14px',
          background: 'transparent',
          border: '1px solid var(--border2)',
          color: 'var(--text3)',
          fontFamily: 'Orbitron',
          fontSize: 9,
          letterSpacing: 2,
          cursor: 'pointer',
          borderRadius: 20,
          marginBottom: 20,
          transition: 'all 0.2s',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = '#e10600';
          e.currentTarget.style.color = 'var(--text)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = '';
          e.currentTarget.style.color = 'var(--text3)';
        }}
        aria-label="Back to circuits"
      >
        ← BACK TO CIRCUITS
      </button>

      {race.cancelled && (
        <div
          className="card"
          style={{
            marginBottom: 20,
            borderLeft: '3px solid #e10600',
            background: 'rgba(225,6,0,0.06)',
          }}
        >
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 11,
              color: '#e10600',
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            CANCELLED
          </div>
          <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.7 }}>
            This race has been cancelled for the 2026 season.
          </p>
        </div>
      )}

      <div className="card" style={{ marginBottom: 20 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: 16,
          }}
        >
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
              <div
                style={{
                  fontSize: 9,
                  color: 'var(--text4)',
                  textTransform: 'uppercase',
                  letterSpacing: 1,
                  fontFamily: 'Orbitron',
                  marginBottom: 4,
                }}
              >
                {String(label)}
              </div>
              <div
                style={{ fontSize: 14, color: 'var(--text)', fontWeight: 600 }}
              >
                {String(value)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p
        style={{
          fontSize: 14,
          color: 'var(--text2)',
          lineHeight: 1.8,
          marginBottom: 16,
        }}
      >
        {race.desc}
      </p>

      <div style={{ marginBottom: 20 }}>
        {race.tags.map((t) => (
          <span key={t} className="circuit-tag">
            {t}
          </span>
        ))}
      </div>

      {!race.cancelled && (
        <button
          onClick={() => downloadIcs(race)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            padding: '10px 20px',
            background: 'rgba(0,220,120,0.1)',
            border: '1px solid rgba(0,220,120,0.3)',
            color: '#00dc78',
            fontFamily: 'Orbitron',
            fontSize: 10,
            letterSpacing: 2,
            cursor: 'pointer',
            borderRadius: 6,
            marginBottom: 28,
          }}
          aria-label={`Download ${race.name} calendar event`}
        >
          📅 ADD TO CALENDAR (.ICS)
        </button>
      )}

      <div
        style={{
          fontFamily: 'Orbitron',
          fontSize: 11,
          color: '#e10600',
          letterSpacing: 2,
          marginBottom: 12,
        }}
      >
        SESSION TIMES · {tz}
      </div>
      <div className="session-grid">
        {sessions.map((s) => {
          const d = new Date(raceDate.getTime() + s.offset);
          return (
            <div
              key={s.label}
              className="session-card"
              style={{ opacity: d < new Date() ? 0.5 : 1 }}
            >
              <div className="session-type">{s.label}</div>
              <div className="session-time">{fmtTime(d)}</div>
              <div className="session-date">{fmtDate(d)}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
