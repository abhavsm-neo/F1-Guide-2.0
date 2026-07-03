import { Clock } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { DRIVER_HISTORY } from '../data/history';
import styles from './HistoryPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

export default function HistoryPage() {
  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Driver"
          accent="Changes"
          group="2026 Season"
          icon={Clock}
          intro="F1 has only 20 seats (22 from 2026). Drivers are dropped, promoted, and shuffled constantly. Here's every major move from 2018 to 2026 — and the real reason behind each one."
        />
        <BookmarkButton sectionId="history" />
      </div>

      <div className={styles.badgeNew}>
        <span className={styles.badgeText}>
          NEW FOR 2026 — F1 now has 22 seats with the arrival of Cadillac
        </span>
      </div>

      <p className={styles.intro}>
        F1 has only 20 seats (22 from 2026). Drivers are dropped, promoted, and
        shuffled constantly. Here's every major move from 2018 to 2026 — and the
        real reason behind each one.
      </p>

      <div className={styles.timeline}>
        {DRIVER_HISTORY.map((era) => (
          <div className={styles.timelineItem} key={era.year}>
            <div className={styles.timelineDot} aria-hidden="true" />
            <div className={styles.timelineYear}>{era.year}</div>
            <div className={styles.timelineContent}>
              <strong className={styles.timelineTitle}>{era.title}</strong>
              <p>{era.context}</p>
              <div>
                {era.changes.map((c, i) => (
                  <div className={styles.timelineChange} key={i}>
                    <div className={styles.changeTeam}>{c.team}</div>
                    <span className={[styles.changeTag, styles.tagOut].join(' ')}>OUT: {c.out}</span>
                    <span className={[styles.changeTag, styles.tagIn].join(' ')}>IN: {c.in}</span>
                    <br />
                    <span className={[styles.changeTag, styles.tagReason].join(' ')}>WHY</span>
                    <span className={styles.changeReason}>{c.reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </PageReveal>
  );
}
