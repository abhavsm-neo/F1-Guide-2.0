import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Building2, MapPin, Briefcase, Wrench } from 'lucide-react';
import { TEAMS_2025, TEAMS_2026 } from '../data/teams';
import { DRIVERS_2025 } from '../data/drivers';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import styles from './TeamProfilePage.module.css';

export default function TeamProfilePage() {
  const { teamId } = useParams<{ teamId: string }>();
  const navigate = useNavigate();

  const team2025 = useMemo(() => TEAMS_2025.find((t) => t.id === teamId), [teamId]);
  const team2026 = useMemo(() => TEAMS_2026.find((t) => t.id === teamId), [teamId]);
  const team = team2026 || team2025;

  const drivers = useMemo(() => {
    if (!team) return [];
    return team.drivers
      .map((name) => DRIVERS_2025.find((d) => d.name === name))
      .filter((d): d is NonNullable<typeof d> => Boolean(d));
  }, [team]);

  if (!team) {
    return (
      <div className={styles.page}>
        <EmptyState
          icon={Building2}
          title="TEAM NOT FOUND"
          sub={`No team found with ID "${teamId}".`}
          action={{ label: '← Back to Teams', onClick: () => navigate('/teams') }}
        />
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title={team.name}
          accent="Profile"
          group="Teams"
          icon={Building2}
          intro={`${team.base} · Est. ${team.founded} · ${team.championships}`}
        />
        <BookmarkButton sectionId={`team-${team.id}`} />
      </div>

      {/* Team hero card */}
      <div className={styles.heroCard} style={{ borderTop: `3px solid ${team.color}` }}>
        <div className={styles.heroRow}>
          <div
            className={styles.heroColorStrip}
            style={{ background: team.color, boxShadow: `0 0 16px ${team.color}80` }}
          />
          <div className={styles.heroInfo}>
            <div className={styles.heroName}>{team.name}</div>
            <div className={styles.heroMeta}>
              <MapPin size={14} /> {team.base}
            </div>
            <div className={styles.heroMetaSecondary}>
              <Briefcase size={14} /> {team.tp} · <Wrench size={14} /> {team.engine}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Founded', value: String(team.founded) },
          { label: 'Championships', value: team.championships },
          { label: 'Team Principal', value: team.tp },
          { label: 'Engine', value: team.engine },
        ].map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <div className={styles.statValue} style={{ color: team.color }}>
              {stat.value}
            </div>
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Drivers */}
      <div className={styles.driversSection}>
        <div className={styles.driversTitle}>Drivers</div>
        <div className={styles.driversGrid}>
          {drivers.map((d) => (
            <div
              key={d.id}
              className={styles.driverCard}
              onClick={() => navigate(`/drivers/${d.id}`)}
              style={{ borderLeft: `3px solid ${d.teamColor}` }}
              role="link"
              aria-label={`View profile for ${d.name}`}
            >
              <div className={styles.driverName} style={{ color: d.teamColor }}>
                #{d.number} {d.name}
              </div>
              <div className={styles.driverCountry}>{d.country}</div>
            </div>
          ))}
          {team.drivers
            .filter((name) => !drivers.some((d) => d.name === name))
            .map((name) => (
              <div
                key={name}
                className={styles.driverCard}
                style={{ borderLeft: `3px solid ${team.color}`, opacity: 0.7 }}
              >
                <div className={styles.driverName} style={{ color: team.color }}>
                  {name}
                </div>
                <div className={styles.driverCountry}>2026 Driver</div>
              </div>
            ))}
        </div>
      </div>

      {/* Description */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>About</div>
        <p className={styles.cardText}>{team.desc}</p>
      </div>

      {/* Engine Notes */}
      <div className={styles.card}>
        <div className={styles.cardTitle} style={{ color: team.color }}>
          Engine Notes
        </div>
        <p className={styles.cardText}>{team.engineNote}</p>
      </div>

      {/* History / context */}
      {team2025 && team2026 && team2025 !== team2026 && (
        <div className={styles.card} style={{ borderLeft: '3px solid var(--accent)' }}>
          <div className={styles.cardTitle}>2025 vs 2026</div>
          <p className={styles.cardText}>
            Engine changed from <strong style={{ color: 'var(--text-primary)' }}>{team2025.engine}</strong> to{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{team2026.engine}</strong>. Team Principal:{' '}
            <strong style={{ color: 'var(--text-primary)' }}>{team2025.tp}</strong> → <strong style={{ color: 'var(--text-primary)' }}>{team2026.tp}</strong>. Drivers:{' '}
            {team2025.drivers.join(' & ')} → {team2026.drivers.join(' & ')}.
          </p>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate('/teams')}>
        ← Back to All Teams
      </button>
    </div>
  );
}
