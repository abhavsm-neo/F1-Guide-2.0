import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { DRIVER_HISTORY } from '../data/history';

export default function HistoryPage() {

  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="Driver"
          accent="Changes"
          group="2026 Season"
          icon="📅"
          intro="F1 has only 20 seats (22 from 2026). Drivers are dropped, promoted, and shuffled constantly. Here's every major move from 2018 to 2026 — and the real reason behind each one."
        />
        <BookmarkButton sectionId="history" />
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 6,
          padding: '4px 10px',
          background: 'rgba(0,220,120,0.08)',
          border: '1px solid rgba(0,220,120,0.25)',
          borderRadius: 2,
          marginBottom: 12,
        }}
      >
        <span
          style={{
            fontSize: 10,
            color: '#00dc78',
            fontFamily: 'Orbitron',
            letterSpacing: 1,
          }}
        >
          NEW FOR 2026 — F1 now has 22 seats with the arrival of Cadillac
        </span>
      </div>

      <p
        style={{
          marginBottom: 16,
          fontSize: 13,
          color: 'var(--text3)',
          lineHeight: 1.7,
        }}
      >
        F1 has only 20 seats (22 from 2026). Drivers are dropped, promoted, and
        shuffled constantly. Here's every major move from 2018 to 2026 — and the
        real reason behind each one.
      </p>

      <div className="timeline">
        {DRIVER_HISTORY.map((era) => (
          <div className="timeline-item" key={era.year}>
            <div className="timeline-dot" aria-hidden="true" />
            <div className="timeline-year">{era.year}</div>
            <div className="timeline-content">
              <strong style={{ color: 'var(--text)', fontSize: 14 }}>
                {era.title}
              </strong>
              <p style={{ marginTop: 6 }}>{era.context}</p>
              <div style={{ marginTop: 10 }}>
                {era.changes.map((c, i) => (
                  <div className="timeline-change" key={i}>
                    <div
                      style={{
                        marginBottom: 5,
                        fontWeight: 700,
                        color: 'var(--text)',
                        fontSize: 12,
                      }}
                    >
                      {c.team}
                    </div>
                    <span className="change-tag tag-out">OUT: {c.out}</span>
                    <span className="change-tag tag-in">IN: {c.in}</span>
                    <br />
                    <span className="change-tag tag-reason">WHY</span>
                    <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                      {c.reason}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
