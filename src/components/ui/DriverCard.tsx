import { memo, useState } from 'react';
import type { Driver } from '../../types';
import { Trophy, Zap, Flag } from 'lucide-react';
import { RatingBar } from './RatingBar';
import styles from './DriverCard.module.css';

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard = memo(function DriverCard({ driver }: DriverCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={styles.card}
      role="article"
      aria-label={`${driver.name}, driver number ${driver.number}`}
    >
      <div className={styles.mainRow}>
        {/* Left: Driver number badge */}
        <div
          className={styles.numberBadge}
          style={{ backgroundColor: driver.teamColor }}
        >
          {driver.number}
        </div>

        {/* Middle column: name, team, country */}
        <div className={styles.infoColumn}>
          <div className={styles.driverName}>{driver.name}</div>
          <div className={styles.teamName}>{driver.team}</div>
          <div className={styles.country}>
            <Flag size={12} className={styles.countryIcon} />
            {driver.country}
          </div>
        </div>

        {/* Right: stats row */}
        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>
              <Trophy size={14} className={styles.statIcon} /> Wins
            </div>
            <div className={styles.statValue}>{driver.wins}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>
              <Zap size={14} className={styles.statIcon} /> Poles
            </div>
            <div className={styles.statValue}>{driver.poles}</div>
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>
              <Trophy size={14} className={styles.statIcon} /> Titles
            </div>
            <div className={styles.statValue}>{driver.championships}</div>
          </div>
        </div>
      </div>

      {/* Expanded ratings */}
      {expanded && (
        <div className={styles.ratingsSection}>
          <RatingBar label="Speed" value={driver.skill} />
          <RatingBar label="Racecraft" value={driver.racecraft} />
          <RatingBar label="Consistency" value={driver.consistency} />
          <RatingBar label="Media" value={driver.media} />
        </div>
      )}

      {/* Expand button */}
      <button
        className={styles.expandButton}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide Skills' : 'View Skills'}
      </button>
    </div>
  );
});
