import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DRIVERS_2025 } from '../data/drivers';
import { DRIVER_HISTORY } from '../data/history';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { RatingBar } from '../components/ui/RatingBar';

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
      <div className="section-enter">
        <EmptyState
          icon="🏎️"
          title="DRIVER NOT FOUND"
          sub={`No driver found with ID "${driverId}".`}
        />
        <button
          className="expand-btn"
          onClick={() => navigate('/drivers')}
          style={{ marginTop: 20 }}
        >
          ← Back to Drivers
        </button>
      </div>
    );
  }

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title={driver.name}
          accent="Profile"
          group="Drivers"
          icon="🏎️"
          intro={`${driver.country} · ${driver.team} · #${driver.number}`}
        />
        <BookmarkButton sectionId={`driver-${driver.id}`} />
      </div>

      {/* Driver hero card */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          borderTop: `3px solid ${driver.teamColor}`,
          background: `linear-gradient(135deg, ${driver.teamColor}08, transparent)`,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
          <div
            style={{
              fontFamily: 'Orbitron, sans-serif',
              fontSize: 48,
              fontWeight: 900,
              color: driver.teamColor,
              textShadow: `0 0 20px ${driver.teamColor}66`,
              minWidth: 60,
            }}
          >
            {driver.number}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 18,
                fontWeight: 900,
                color: 'var(--text)',
                letterSpacing: 1,
                textTransform: 'uppercase',
              }}
            >
              {driver.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
              {driver.country} · {driver.team}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text4)', marginTop: 4 }}>
              Active: {driver.seasons}
            </div>
          </div>
          <div
            style={{
              padding: '6px 14px',
              background: driver.teamColor + '18',
              border: `1px solid ${driver.teamColor}44`,
              borderRadius: 20,
              fontSize: 11,
              color: driver.teamColor,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: 'uppercase',
              fontFamily: 'Orbitron, sans-serif',
            }}
          >
            {driver.team.split(' ').slice(0, 2).join(' ')}
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Championships', value: `⭐${driver.championships}` },
          { label: 'Wins', value: driver.wins },
          { label: 'Poles', value: driver.poles },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ textAlign: 'center', padding: 16 }}
          >
            <div
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 22,
                fontWeight: 900,
                color: driver.teamColor,
                textShadow: `0 0 10px ${driver.teamColor}55`,
              }}
            >
              {stat.value}
            </div>
            <div
              style={{
                fontSize: 9,
                color: 'var(--text3)',
                letterSpacing: 1,
                textTransform: 'uppercase',
                marginTop: 6,
              }}
            >
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ratings */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            color: '#e10600',
            letterSpacing: 2,
            marginBottom: 14,
            textTransform: 'uppercase',
          }}
        >
          Ratings
        </div>
        <RatingBar label="Raw Speed" value={driver.skill} />
        <RatingBar label="Racecraft" value={driver.racecraft} />
        <RatingBar label="Consistency" value={driver.consistency} />
        <RatingBar label="Media Appeal" value={driver.media} />
      </div>

      {/* Description */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            color: '#e10600',
            letterSpacing: 2,
            marginBottom: 10,
            textTransform: 'uppercase',
          }}
        >
          About
        </div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
          {driver.desc}
        </p>
        <div
          className="driver-media"
          style={{
            fontSize: 12,
            color: 'var(--text3)',
            fontStyle: 'italic',
            borderLeft: `2px solid ${driver.teamColor}`,
            paddingLeft: 10,
            marginTop: 12,
            boxShadow: `-2px 0 8px ${driver.teamColor}20`,
          }}
        >
          🎙️ {driver.mediaNote}
        </div>
      </div>

      {/* Career Timeline */}
      {timeline.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div className="section-title" style={{ fontSize: 18 }}>
            Career <span style={{ color: '#e10600' }}>Timeline</span>
          </div>
          <div className="section-line" style={{ marginBottom: 16 }} />
          <div className="timeline">
            {timeline.map((era) => (
              <div className="timeline-item" key={era.year}>
                <div className="timeline-dot" />
                <div className="timeline-year">{era.year}</div>
                <div className="timeline-content">
                  <strong style={{ color: 'var(--text)', fontSize: 14 }}>
                    {era.title}
                  </strong>
                  <p style={{ marginTop: 6 }}>{era.context}</p>
                  <div style={{ marginTop: 10 }}>
                    {era.changes
                      .filter(
                        (c) =>
                          c.in.toLowerCase().includes(driver.name.toLowerCase()) ||
                          c.out.toLowerCase().includes(driver.name.toLowerCase())
                      )
                      .map((c, i) => (
                        <div className="timeline-change" key={i}>
                          <div
                            style={{
                              marginBottom: 5,
                              fontWeight: 700,
                              color: 'var(--text)',
                              fontSize: 12,
                            }}
                          >
                            {c.team}
                          </div>
                          <span className="change-tag tag-out">OUT: {c.out}</span>
                          <span className="change-tag tag-in">IN: {c.in}</span>
                          <br />
                          <span className="change-tag tag-reason">WHY</span>
                          <span style={{ fontSize: 12, color: 'var(--text2)' }}>
                            {c.reason}
                          </span>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <button className="expand-btn" onClick={() => navigate('/drivers')}>
        ← Back to All Drivers
      </button>
    </div>
  );
}
