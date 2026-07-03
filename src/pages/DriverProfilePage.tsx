import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { User, Mic } from 'lucide-react';
import { DRIVERS_2025 } from '../data/drivers';
import { DRIVER_HISTORY } from '../data/history';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { RatingBar } from '../components/ui/RatingBar';
import { CountUp } from '../components/ui/CountUp';
import { PageReveal } from '../components/ui/PageReveal';
import styles from './DriverProfilePage.module.css';

export default function DriverProfilePage() {
  const { driverId } = useParams<{ driverId: string }>();
  const navigate = useNavigate();

  const driver = useMemo(
    () => DRIVERS_2025.find((d) => d.id === driverId),
    [driverId]
  );

  const timeline = useMemo(() => {
    if (!driver) return [];
    return DRIVER_HISTORY.filter((era) =>
      era.changes.some(
        (c) =>
          c.in.toLowerCase().includes(driver.name.toLowerCase()) ||
          c.out.toLowerCase().includes(driver.name.toLowerCase())
      )
    );
  }, [driver]);

  if (!driver) {
    return (
      <PageReveal className={styles.page}>
        <EmptyState
          icon={User}
          title="DRIVER NOT FOUND"
          sub={`No driver found with ID "${driverId}".`}
          action={{ label: '← Back to Drivers', onClick: () => navigate('/drivers') }}
        />
      </PageReveal>
    );
  }

  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title={driver.name}
          accent="Profile"
          group="Drivers"
          icon={User}
          intro={`${driver.country} · ${driver.team} · #${driver.number}`}
        />
        <BookmarkButton sectionId={`driver-${driver.id}`} />
      </div>

      {/* Driver hero card */}
      <div
        className={styles.heroCard}
        style={{
          borderTop: `3px solid ${driver.teamColor}`,
        }}
      >
        <div className={styles.heroRow}>
          <div
            className={styles.heroNumber}
            style={{ color: driver.teamColor }}
          >
            <CountUp target={driver.number} />
          </div>
          <div className={styles.heroInfo}>
            <div className={styles.heroName}>{driver.name}</div>
            <div className={styles.heroMeta}>
              {driver.country} · {driver.team}
            </div>
            <div className={styles.heroSeasons}>
              Active: {driver.seasons}
            </div>
          </div>
          <div
            className={styles.heroTeamBadge}
            style={{
              background: driver.teamColor + '18',
              borderColor: driver.teamColor + '44',
              color: driver.teamColor,
            }}
          >
            {driver.team.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div className={styles.statsGrid}>
        {[
          { label: 'Championships', value: driver.championships },
          { label: 'Wins', value: parseInt(driver.wins, 10) || 0 },
          { label: 'Poles', value: parseInt(driver.poles, 10) || 0 },
        ].map((stat) => (
          <div key={stat.label} className={styles.statCard}>
            <CountUp
              target={typeof stat.value === 'number' ? stat.value : Number(stat.value)}
              className={styles.statValue}
              style={{ color: driver.teamColor }}
            />
            <div className={styles.statLabel}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Ratings */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>Ratings</div>
        <RatingBar label="Raw Speed" value={driver.skill} />
        <RatingBar label="Racecraft" value={driver.racecraft} />
        <RatingBar label="Consistency" value={driver.consistency} />
        <RatingBar label="Media Appeal" value={driver.media} />
      </div>

      {/* Description */}
      <div className={styles.card}>
        <div className={styles.cardTitle}>About</div>
        <p className={styles.aboutText}>{driver.desc}</p>
        <div className={styles.mediaNote} style={{ borderLeftColor: driver.teamColor }}>
          <Mic size={16} style={{ color: driver.teamColor, flexShrink: 0, marginTop: 2 }} />
          {driver.mediaNote}
        </div>
      </div>

      {/* Career Timeline */}
      {timeline.length > 0 && (
        <div className={styles.timelineSection}>
          <div className={styles.timelineTitle}>
            Career <span className={styles.timelineAccent}>Timeline</span>
          </div>
          <div className={styles.timelineAccentLine} />
          <div className={styles.timeline}>
            {timeline.map((era) => (
              <div className={styles.timelineItem} key={era.year}>
                <div className={styles.timelineDot} />
                <div className={styles.timelineYear}>{era.year}</div>
                <div className={styles.timelineContent}>
                  <div className={styles.timelineContentTitle}>{era.title}</div>
                  <p className={styles.timelineContext}>{era.context}</p>
                  <div className={styles.timelineChanges}>
                    {era.changes
                      .filter(
                        (c) =>
                          c.in.toLowerCase().includes(driver.name.toLowerCase()) ||
                          c.out.toLowerCase().includes(driver.name.toLowerCase())
                      )
                      .map((c, i) => (
                        <div className={styles.timelineChange} key={i}>
                          <div className={styles.changeTeam}>{c.team}</div>
                          <div className={styles.changeTags}>
                            <span className={styles.tagOut}>OUT: {c.out}</span>
                            <span className={styles.tagIn}>IN: {c.in}</span>
                            <span className={styles.tagReason}>WHY</span>
                          </div>
                          <div className={styles.changeReason}>{c.reason}</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className={styles.backBtn} onClick={() => navigate('/drivers')}>
        ← Back to All Drivers
      </button>
    </PageReveal>
  );
}
