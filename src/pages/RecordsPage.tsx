import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ALL_TIME_RECORDS } from '../data/records';
import { PODIUM_COLORS } from '../utils/colors';

export default function RecordsPage() {
  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="All-Time"
          accent="Records"
          group="Race & Stats"
          icon="🎖️"
          intro="F1 spans 75+ years and hundreds of drivers. Here are the records that define greatness."
        />
        <BookmarkButton sectionId="records" />
      </div>

      <div className="records-grid">
        {ALL_TIME_RECORDS.map((cat) => (
          <div key={cat.title} className="record-card">
            <div className="record-header">
              <span className="record-icon" aria-hidden="true">
                {cat.icon}
              </span>
              <span className="record-title">{cat.title}</span>
            </div>
            <div className="record-body">
              {cat.rows.map((row, i) => (
                <div key={i} className="record-row">
                  <span
                    className="record-rank"
                    style={{
                      color:
                        row.rank === 1
                          ? PODIUM_COLORS[0]
                          : row.rank === 2
                          ? PODIUM_COLORS[1]
                          : row.rank === 3
                          ? PODIUM_COLORS[2]
                          : '#444',
                    }}
                    aria-hidden="true"
                  >
                    {row.rank === 1
                      ? '🥇'
                      : row.rank === 2
                      ? '🥈'
                      : row.rank === 3
                      ? '🥉'
                      : `#${row.rank}`}
                  </span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="record-driver-name">{row.name}</div>
                    <div
                      style={{ fontSize: 10, color: 'var(--text4)', marginTop: 1 }}
                    >
                      {row.note}
                    </div>
                  </div>
                  <span className="record-value">{row.value}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: 20,
          padding: 14,
          background: 'var(--card-bg)',
          border: '1px solid var(--border)',
          borderRadius: 2,
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 11, color: 'var(--text4)' }}>
          Records current as of 2026 season start · Active drivers' stats
          marked with +
        </div>
      </div>
    </div>
  );
}
