import { GitCompare, Zap, Battery, Wind, Scale, Fuel, Trophy, Factory, Rocket, Gauge, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { CAR_COMPARE } from '../data/car_compare';
import type { CarCompareRow } from '../types';
import styles from './ComparePage.module.css';

const ICON_MAP: Record<string, React.ReactNode> = {
  '⚡': <Zap size={18} />,
  '🔋': <Battery size={18} />,
  '💨': <Wind size={18} />,
  '⚖️': <Scale size={18} />,
  '⛽': <Fuel size={18} />,
  '🏁': <Trophy size={18} />,
  '💰': <AlertCircle size={18} />,
  '🔴': <Gauge size={18} />,
  '🏭': <Factory size={18} />,
  '🚀': <Rocket size={18} />,
};

export default function ComparePage() {
  return (
    <div className={styles.page}>
      <div className={styles.headerRow}>
        <SectionHeader
          title="2025 vs"
          accent="2026 Cars"
          group="2026 Season"
          icon={GitCompare}
          intro="2026 is the biggest regulation reset since 2014. Here's exactly what's changed between the two eras, side by side."
        />
        <BookmarkButton sectionId="compare" />
      </div>

      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thAspect}>Aspect</th>
              <th className={styles.th2025}>2025 Car</th>
              <th className={styles.th2026}>2026 Car</th>
            </tr>
          </thead>
          <tbody>
            {CAR_COMPARE.map((row: CarCompareRow) => (
              <tr key={row.aspect}>
                <td className={styles.tdAspect}>
                  <div className={styles.aspectIcon}>{ICON_MAP[row.icon] || <Gauge size={18} />}</div>
                  <div className={styles.aspectName}>{row.aspect}</div>
                </td>
                <td
                  className={styles.td2025}
                  style={{
                    background: row.winner === 2025 ? 'rgba(34,197,94,0.04)' : 'transparent',
                  }}
                >
                  {row.winner === 2025 && (
                    <span className={styles.badgeBetter}>BETTER</span>
                  )}
                  <div className={styles.cellText}>{row.col2025}</div>
                </td>
                <td
                  className={styles.td2026}
                  style={{
                    background: row.winner === 2026 ? 'var(--accent-muted)' : 'transparent',
                  }}
                >
                  {row.winner === 2026 && (
                    <span className={styles.badgeNew}>NEW ERA</span>
                  )}
                  <div className={styles.cellText}>{row.col2026}</div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.summaryCard}>
        <div className={styles.summaryLabel}>THE BIG PICTURE</div>
        <p className={styles.summaryText}>
          The 2026 regulations represent the most ambitious overhaul in F1
          history. The shift to 50/50 electric/combustion power, the removal of
          DRS, active aerodynamics, and the arrival of Audi and Ford all happen
          simultaneously. Every team starts from scratch. History shows that
          regulation resets create new winners — 2026 could change everything.
        </p>
      </div>
    </div>
  );
}
