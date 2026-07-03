import { memo } from 'react';
import type { Driver } from '../../types';
import { Trophy, Zap, Flag, BarChart3 } from 'lucide-react';
import { FlipCard } from './FlipCard';
import { CountUp } from './CountUp';
import { RatingBar } from './RatingBar';
import { RadarChart } from '../charts/RadarChart';
import styles from './DriverCard.module.css';

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard = memo(function DriverCard({ driver }: DriverCardProps) {
  const front = (
    <div className={styles.card}>
      <div className={styles.mainRow}>
        <div
          className={styles.numberBadge}
          style={{ backgroundColor: driver.teamColor }}
        >
          <CountUp target={driver.number} />
        </div>

        <div className={styles.infoColumn}>
          <div className={styles.driverName}>{driver.name}</div>
          <div className={styles.teamName}>{driver.team}</div>
          <div className={styles.country}>
            <Flag size={12} className={styles.countryIcon} />
            {driver.country}
          </div>
        </div>

        <div className={styles.statsRow}>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>
              <Trophy size={14} className={styles.statIcon} /> Wins
            </div>
            <CountUp target={parseInt(driver.wins, 10) || 0} className={styles.statValue} />
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>
              <Zap size={14} className={styles.statIcon} /> Poles
            </div>
            <CountUp target={parseInt(driver.poles, 10) || 0} className={styles.statValue} />
          </div>
          <div className={styles.statBlock}>
            <div className={styles.statLabel}>
              <Trophy size={14} className={styles.statIcon} /> Titles
            </div>
            <CountUp target={driver.championships} className={styles.statValue} />
          </div>
        </div>
      </div>

      <div className={styles.flipHint}>
        <BarChart3 size={12} />
        <span>Click for full profile</span>
      </div>
    </div>
  );

  const back = (
    <div className={`${styles.card} ${styles.backSide}`}>
      <div className={styles.backHeader}>
        <span className={styles.backName}>{driver.name}</span>
        <span className={styles.backLabel}>CAREER PROFILE</span>
      </div>

      <div className={styles.radarWrap}>
        <RadarChart
          data={[
            { label: 'Speed', value: driver.skill },
            { label: 'Racecraft', value: driver.racecraft },
            { label: 'Consistency', value: driver.consistency },
            { label: 'Media', value: driver.media },
            { label: 'Experience', value: 85 },
          ]}
          color={driver.teamColor}
        />
      </div>

      <div className={styles.skillBreakdown}>
        <RatingBar label="Speed" value={driver.skill} />
        <RatingBar label="Racecraft" value={driver.racecraft} />
        <RatingBar label="Consistency" value={driver.consistency} />
        <RatingBar label="Media" value={driver.media} />
      </div>

      <div className={styles.backStats}>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Championships</span>
          <CountUp target={driver.championships} className={styles.backValue} />
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Wins</span>
          <CountUp target={parseInt(driver.wins, 10) || 0} className={styles.backValue} />
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Poles</span>
          <CountUp target={parseInt(driver.poles, 10) || 0} className={styles.backValue} />
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Seasons</span>
          <span className={styles.backValue}>{driver.seasons}</span>
        </div>
      </div>
    </div>
  );

  return (
    <FlipCard
      front={front}
      back={back}
      className={styles.flipCard}
    />
  );
});
