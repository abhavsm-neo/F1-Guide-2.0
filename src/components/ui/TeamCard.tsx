import { memo, useState } from 'react';
import type { Team } from '../../types';
import { MapPin } from 'lucide-react';
import styles from './TeamCard.module.css';

interface TeamCardProps {
  team: Team;
}

export const TeamCard = memo(function TeamCard({ team }: TeamCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div
      className={styles.card}
      role="article"
      aria-label={team.name}
    >
      {/* Top team color strip */}
      <div
        className={styles.colorStrip}
        style={{
          backgroundColor: team.color,
          boxShadow: `0 0 10px ${team.color}80`,
        }}
      />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.name}>{team.name}</div>
        <div className={styles.base}>
          <MapPin size={12} className={styles.baseIcon} />
          {team.base}
        </div>
      </div>

      {/* Stats row */}
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
          <div className={styles.statValue}>{team.championships}</div>
        </div>
        <div className={styles.statPair}>
          <div className={styles.statLabel}>Founded</div>
          <div className={styles.statValue}>{team.founded}</div>
        </div>
      </div>

      {/* Driver chips */}
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

      {/* Description */}
      <p className={styles.description}>{team.desc}</p>

      {/* Expanded engine notes */}
      {expanded && (
        <div className={styles.engineNotes}>
          <div className={styles.engineNotesLabel}>Engine Notes</div>
          <p className={styles.description}>{team.engineNote}</p>
        </div>
      )}

      {/* Expand button */}
      <button
        className={styles.expandButton}
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
      >
        {expanded ? 'Hide Engine Details' : 'Engine Details'}
      </button>
    </div>
  );
});
