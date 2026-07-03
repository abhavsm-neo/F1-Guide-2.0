import { memo } from 'react';
import type { Team } from '../../types';
import { MapPin, Wrench, BarChart3 } from 'lucide-react';
import { FlipCard } from './FlipCard';
import { CountUp } from './CountUp';
import styles from './TeamCard.module.css';

interface TeamCardProps {
  team: Team;
}

export const TeamCard = memo(function TeamCard({ team }: TeamCardProps) {
  const front = (
    <div className={styles.card}>
      <div
        className={styles.colorStrip}
        style={{
          backgroundColor: team.color,
          boxShadow: `0 0 10px ${team.color}80`,
        }}
      />

      <div className={styles.header}>
        <div className={styles.name}>{team.name}</div>
        <div className={styles.base}>
          <MapPin size={12} className={styles.baseIcon} />
          {team.base}
        </div>
      </div>

      <div className={styles.statsRow}>
        <div className={styles.statPair}>
          <div className={styles.statLabel}>Engine</div>
          <div className={styles.statValue}>{team.engine}</div>
        </div>
        <div className={styles.statPair}>
          <div className={styles.statLabel}>Team Principal</div>
          <div className={styles.statValue}>{team.tp}</div>
        </div>
        <div className={styles.statPair}>
          <div className={styles.statLabel}>Championships</div>
          <CountUp target={parseInt(team.championships, 10) || 0} className={styles.statValue} />
        </div>
        <div className={styles.statPair}>
          <div className={styles.statLabel}>Founded</div>
          <CountUp target={team.founded} className={styles.statValue} />
        </div>
      </div>

      <div className={styles.driverChips}>
        {team.drivers.map((d: string) => (
          <span
            key={d}
            className={styles.driverChip}
            style={{
              borderColor: team.color,
              backgroundColor: `${team.color}1A`,
            }}
          >
            {d}
          </span>
        ))}
      </div>

      <p className={styles.description}>{team.desc}</p>

      <div className={styles.flipHint}>
        <BarChart3 size={12} />
        <span>Click for engine details</span>
      </div>
    </div>
  );

  const back = (
    <div className={`${styles.card} ${styles.backSide}`}>
      <div className={styles.backHeader}>
        <span className={styles.backName}>{team.name}</span>
        <span className={styles.backLabel}>TEAM PROFILE</span>
      </div>

      <div className={styles.backStats}>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Base</span>
          <span className={styles.backValue}>{team.base}</span>
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Founded</span>
          <CountUp target={team.founded} className={styles.backValue} />
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Championships</span>
          <CountUp target={parseInt(team.championships, 10) || 0} className={styles.backValue} />
        </div>
        <div className={styles.backRow}>
          <span className={styles.backLabel}>Team Principal</span>
          <span className={styles.backValue}>{team.tp}</span>
        </div>
      </div>

      <div className={styles.engineNotes}>
        <div className={styles.engineNotesLabel}>
          <Wrench size={12} />
          Engine Notes
        </div>
        <p className={styles.description}>{team.engineNote}</p>
      </div>

      <div className={styles.driverCompare}>
        <div className={styles.driverCompareLabel}>2026 DRIVERS</div>
        <div className={styles.driverCompareRow}>
          {team.drivers.map((d, i) => (
            <span
              key={d}
              className={styles.driverCompareName}
              style={{
                borderColor: team.color,
                backgroundColor: `${team.color}1A`,
              }}
            >
              {i + 1}. {d}
            </span>
          ))}
        </div>
      </div>
    </div>
  );

  return <FlipCard front={front} back={back} className={styles.flipCard} />;
});
