import { useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TEAMS_2025, TEAMS_2026 } from '../data/teams';
import { DRIVERS_2025 } from '../data/drivers';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';

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
      <div className="section-enter">
        <EmptyState
          icon="🔧"
          title="TEAM NOT FOUND"
          sub={`No team found with ID "${teamId}".`}
        />
        <button
          className="expand-btn"
          onClick={() => navigate('/teams')}
          style={{ marginTop: 20 }}
        >
          ← Back to Teams
        </button>
      </div>
    );
  }

  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title={team.name}
          accent="Profile"
          group="Teams"
          icon="🔧"
          intro={`${team.base} · Est. ${team.founded} · ${team.championships}`}
        />
        <BookmarkButton sectionId={`team-${team.id}`} />
      </div>

      {/* Team hero card */}
      <div
        className="card"
        style={{
          marginBottom: 24,
          borderTop: `3px solid ${team.color}`,
          background: `linear-gradient(135deg, ${team.color}08, transparent)`,
        }}
      >
        <div
          style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}
        >
          <div
            style={{
              width: 8,
              height: 64,
              borderRadius: 4,
              background: team.color,
              boxShadow: `0 0 16px ${team.color}80`,
              flexShrink: 0,
            }}
          />
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
              {team.name}
            </div>
            <div style={{ fontSize: 13, color: 'var(--text3)', marginTop: 4 }}>
              📍 {team.base}
            </div>
            <div style={{ fontSize: 12, color: 'var(--text4)', marginTop: 4 }}>
              👔 {team.tp} · 🔧 {team.engine}
            </div>
          </div>
        </div>
      </div>

      {/* Stats grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
          gap: 12,
          marginBottom: 24,
        }}
      >
        {[
          { label: 'Founded', value: String(team.founded) },
          { label: 'Championships', value: team.championships },
          { label: 'Team Principal', value: team.tp },
          { label: 'Engine', value: team.engine },
        ].map((stat) => (
          <div
            key={stat.label}
            className="card"
            style={{ textAlign: 'center', padding: 16 }}
          >
            <div
              style={{
                fontFamily: 'Orbitron, sans-serif',
                fontSize: 14,
                fontWeight: 900,
                color: team.color,
                textShadow: `0 0 10px ${team.color}55`,
                lineHeight: 1.3,
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

      {/* Drivers */}
      <div style={{ marginBottom: 24 }}>
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
          Drivers
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: 12,
          }}
        >
          {drivers.map((d) => (
            <div
              key={d.id}
              className="card"
              onClick={() => navigate(`/drivers/${d.id}`)}
              style={{
                cursor: 'pointer',
                borderLeft: `3px solid ${d.teamColor}`,
                padding: 14,
              }}
              role="link"
              aria-label={`View profile for ${d.name}`}
            >
              <div
                style={{
                  fontFamily: 'Orbitron, sans-serif',
                  fontSize: 14,
                  fontWeight: 900,
                  color: d.teamColor,
                }}
              >
                #{d.number} {d.name}
              </div>
              <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                {d.country}
              </div>
            </div>
          ))}
          {team.drivers
            .filter((name) => !drivers.some((d) => d.name === name))
            .map((name) => (
              <div
                key={name}
                className="card"
                style={{
                  borderLeft: `3px solid ${team.color}`,
                  padding: 14,
                  opacity: 0.7,
                }}
              >
                <div
                  style={{
                    fontFamily: 'Orbitron, sans-serif',
                    fontSize: 14,
                    fontWeight: 900,
                    color: team.color,
                  }}
                >
                  {name}
                </div>
                <div style={{ fontSize: 11, color: 'var(--text3)', marginTop: 4 }}>
                  2026 Driver
                </div>
              </div>
            ))}
        </div>
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
          {team.desc}
        </p>
      </div>

      {/* Engine Notes */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div
          style={{
            fontFamily: 'Orbitron, sans-serif',
            fontSize: 10,
            color: team.color,
            letterSpacing: 2,
            marginBottom: 10,
            textTransform: 'uppercase',
            textShadow: `0 0 8px ${team.color}60`,
          }}
        >
          Engine Notes
        </div>
        <p style={{ fontSize: 13, color: 'var(--text2)', lineHeight: 1.8 }}>
          {team.engineNote}
        </p>
      </div>

      {/* History / context */}
      {team2025 && team2026 && team2025 !== team2026 && (
        <div className="card" style={{ marginBottom: 24, borderLeft: '3px solid #e10600' }}>
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
            2025 vs 2026
          </div>
          <p style={{ fontSize: 12, color: 'var(--text2)', lineHeight: 1.7 }}>
            Engine changed from <strong>{team2025.engine}</strong> to{' '}
            <strong>{team2026.engine}</strong>. Team Principal:{' '}
            <strong>{team2025.tp}</strong> → <strong>{team2026.tp}</strong>. Drivers:{' '}
            {team2025.drivers.join(' & ')} → {team2026.drivers.join(' & ')}.
          </p>
        </div>
      )}

      <button className="expand-btn" onClick={() => navigate('/teams')}>
        ← Back to All Teams
      </button>
    </div>
  );
}
