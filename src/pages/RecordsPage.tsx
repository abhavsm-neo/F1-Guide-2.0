import { Trophy, Medal } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ALL_TIME_RECORDS } from '../data/records';
import { PODIUM_COLORS } from '../utils/colors';
import { CountUp } from '../components/ui/CountUp';
import styles from './RecordsPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

function RecordStat({ value, className }: { value: string; className?: string }) {
  const match = value.match(/^(\d+(?:\.\d+)?)(.*)$/);
  if (!match) {
    return <span className={className}>{value}</span>;
  }
  const [, num, suffix] = match;
  return <CountUp target={Number(num)} suffix={suffix} className={className} />;
}

export default function RecordsPage() {
  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="All-Time"
          accent="Records"
          group="Race & Stats"
          icon={Trophy}
          intro="F1 spans 75+ years and hundreds of drivers. Here are the records that define greatness."
        />
        <BookmarkButton sectionId="records" />
      </div>

      <div className={styles.recordsGrid}>
        {ALL_TIME_RECORDS.map((cat) => (
          <div key={cat.title} className={styles.recordCard}>
            <div className={styles.recordHeader}>
              <span className={styles.recordIcon} aria-hidden="true">
                <Medal size={18} />
              </span>
              <span className={styles.recordTitle}>{cat.title}</span>
            </div>
            <div className={styles.recordBody}>
              {cat.rows.map((row, i) => (
                <div key={i} className={styles.recordRow}>
                  <span
                    className={styles.recordRank}
                    style={{
                      color:
                        row.rank === 1
                          ? PODIUM_COLORS[0]
                          : row.rank === 2
                          ? PODIUM_COLORS[1]
                          : row.rank === 3
                          ? PODIUM_COLORS[2]
                          : 'var(--text-tertiary)',
                    }}
                    aria-hidden="true"
                  >
                    {row.rank === 1
                      ? '1st'
                      : row.rank === 2
                      ? '2nd'
                      : row.rank === 3
                      ? '3rd'
                      : `#${row.rank}`}
                  </span>
                  <div className={styles.recordInfo}>
                    <div className={styles.recordDriverName}>{row.name}</div>
                    <div className={styles.recordNote}>{row.note}</div>
                  </div>
                  <RecordStat value={row.value} className={styles.recordValue} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.footer}>
        <div className={styles.footerText}>
          Records current as of 2026 season start · Active drivers' stats
          marked with +
        </div>
      </div>
    </PageReveal>
  );
}
