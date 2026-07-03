import { useState, useRef, useCallback, type ReactNode } from 'react';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './FlipCard.module.css';

interface FlipCardProps {
  front: ReactNode;
  back: ReactNode;
  className?: string;
}

export function FlipCard({ front, back, className = '' }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!cardRef.current || flipped || reducedMotion) return;
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      setTilt({ x: y * 15, y: -x * 15 }); // max 15deg tilt
    },
    [flipped, reducedMotion]
  );

  const handleMouseLeave = useCallback(() => {
    setTilt({ x: 0, y: 0 });
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    // Allow interactive children (like links/buttons) to work without flipping
    const target = e.target as HTMLElement;
    if (target.closest('a, button')) return;
    setFlipped(f => !f);
  }, []);

  return (
    <div
      ref={cardRef}
      className={`${styles.container} ${className}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={handleClick}
      style={{ perspective: '1000px' }}
    >
      <div
        className={`${styles.inner} ${flipped ? styles.flipped : ''}`}
        style={{
          transform: flipped
            ? 'rotateY(180deg)'
            : reducedMotion
            ? 'none'
            : `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        }}
      >
        <div className={styles.front}>{front}</div>
        <div className={styles.back}>{back}</div>
      </div>
    </div>
  );
}
