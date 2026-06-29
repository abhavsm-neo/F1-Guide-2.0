import { memo, useState, useRef } from 'react';
import type { Driver } from '../../types';
import { useReducedMotion } from '../../hooks/useReducedMotion';

interface DriverCardProps {
  driver: Driver;
}

export const DriverCard = memo(function DriverCard({ driver }: DriverCardProps) {
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
    const rotX = ((y - cy) / cy) * -6;
    const rotY = ((x - cx) / cx) * 6;
    card.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-4px)`;
    card.style.boxShadow = `0 20px 60px rgba(0,0,0,0.8), ${rotY * -1}px ${rotX}px 30px rgba(225,6,0,0.1)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
    card.style.boxShadow = '';
  };

  return (
    <div
      className="driver-card"
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="article"
      aria-label={`${driver.name}, driver number ${driver.number}`}
    >
      <div className="driver-header" style={{ borderBottom: `1px solid ${driver.teamColor}22` }}>
        <div className="driver-number" style={{ color: driver.teamColor, textShadow: `0 0 20px ${driver.teamColor}66` }}>
          {driver.number}
        </div>
        <div className="driver-info">
          <div className="driver-name">{driver.name}</div>
          <div className="driver-country">{driver.country}</div>
        </div>
        <div
          className="driver-team-badge"
          style={{ background: driver.teamColor + '22', color: driver.teamColor, border: `1px solid ${driver.teamColor}55` }}
        >
          {driver.team.split(' ').slice(0, 2).join(' ')}
        </div>
      </div>
      <div className="driver-body">
        <div className="driver-stat-row">
          <div className="driver-stat">
            <div className="driver-stat-val" style={{ color: driver.teamColor, textShadow: `0 0 10px ${driver.teamColor}55` }}>
              ⭐{driver.championships}
            </div>
            <div className="driver-stat-lbl">Titles</div>
          </div>
          <div className="driver-stat">
            <div className="driver-stat-val">{driver.wins}</div>
            <div className="driver-stat-lbl">Wins</div>
          </div>
          <div className="driver-stat">
            <div className="driver-stat-val">{driver.poles}</div>
            <div className="driver-stat-lbl">Poles</div>
          </div>
        </div>
        <p
          className="driver-desc"
          style={{
            display: expanded ? undefined : '-webkit-box',
            WebkitLineClamp: expanded ? undefined : 3,
            WebkitBoxOrient: 'vertical',
            overflow: expanded ? undefined : 'hidden',
          }}
        >
          {driver.desc}
        </p>
        {expanded && (
          <>
            <RatingBar label="Raw Speed" value={driver.skill} />
            <RatingBar label="Racecraft" value={driver.racecraft} />
            <RatingBar label="Consistency" value={driver.consistency} />
            <RatingBar label="Media Appeal" value={driver.media} />
            <div className="driver-media">🎙️ {driver.mediaNote}</div>
            <div style={{ fontSize: 10, color: 'var(--text3)', marginTop: 8 }}>Active: {driver.seasons}</div>
          </>
        )}
        <button className="expand-btn" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
          <span className={`expand-btn-arrow${expanded ? ' open' : ''}`}>▼</span>
          {expanded ? 'Show Less' : 'Ratings & Media'}
        </button>
      </div>
    </div>
  );
});

function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="rating-bar-wrap">
      <div className="rating-label">
        <span>{label}</span>
        <span style={{ color: '#e10600' }}>{value}/100</span>
      </div>
      <div className="rating-bar">
        <div
          className="rating-fill"
          style={{ '--bar-w': `${value}%`, width: `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
