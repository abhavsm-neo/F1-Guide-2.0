import { memo, useState, useRef } from 'react';
import type { Team } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface TeamCardProps {
  team: Team;
}

export const TeamCard = memo(function TeamCard({ team }: TeamCardProps) {
  const [expanded, setExpanded] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.boxShadow = `0 20px 60px rgba(0,0,0,0.8), 0 0 30px ${team.color}20`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = '';
    card.style.boxShadow = '';
  };

  return (
    <div
      className="team-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={team.name}
      style={{ borderTop: `2px solid ${team.color}`, boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 0 ${team.color}` }}
    >
      <div className="team-header" style={{ background: `linear-gradient(135deg, ${team.color}08, transparent)` }}>
        <div className="team-color-block" style={{ background: team.color, boxShadow: `0 0 16px ${team.color}80` }} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="team-name">{team.name}</div>
          <div className="team-base">📍 {team.base}</div>
        </div>
      </div>
      <div className="team-body">
        <div className="team-row">
          <span className="team-pill">🔧 <strong>Engine:</strong> {team.engine}</span>
          <span className="team-pill">👔 <strong>TP:</strong> {team.tp}</span>
        </div>
        <div className="team-row">
          <span className="team-pill">🏆 {team.championships}</span>
          <span className="team-pill">Est. {team.founded}</span>
        </div>
        <div className="team-row" style={{ marginTop: 4 }}>
          {team.drivers.map((d: string) => (
            <span key={d} className="team-pill" style={{ background: team.color + '18', borderColor: team.color + '44', color: 'var(--text2)' }}>
              🏎 {d}
            </span>
          ))}
        </div>
        <p className="team-detail" style={{ marginTop: 10 }}>{team.desc}</p>
        {expanded && (
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, color: team.color, letterSpacing: 2, textTransform: 'uppercase', marginBottom: 5, fontFamily: 'Orbitron', textShadow: `0 0 8px ${team.color}60` }}>
              Engine Notes
            </div>
            <p className="team-detail">{team.engineNote}</p>
          </div>
        )}
        <button className="expand-btn" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          <span className={`expand-btn-arrow${expanded ? ' open' : ''}`}>▼</span>
          {expanded ? 'Show Less' : 'Engine Details'}
        </button>
      </div>
    </div>
  );
});
