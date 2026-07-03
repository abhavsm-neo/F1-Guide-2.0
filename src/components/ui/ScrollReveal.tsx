import { type ReactNode } from 'react';
import { useScrollReveal } from '../../hooks/useScrollReveal';
import { useReducedMotion } from '../../hooks/useReducedMotion';
import styles from './ScrollReveal.module.css';

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number; // ms
  direction?: 'up' | 'down' | 'left' | 'right';
  distance?: number; // px
  duration?: number; // ms
}

export function ScrollReveal({
  children,
  className = '',
  delay = 0,
  direction = 'up',
  distance = 20,
  duration = 600,
}: ScrollRevealProps) {
  const { ref, isVisible } = useScrollReveal();
  const reducedMotion = useReducedMotion();

  const translate = {
    up: `translateY(${distance}px)`,
    down: `translateY(-${distance}px)`,
    left: `translateX(${distance}px)`,
    right: `translateX(-${distance}px)`,
  };

  return (
    <div
      ref={ref}
      className={`${styles.reveal} ${isVisible ? styles.visible : ''} ${className}`}
      style={{
        transitionDuration: reducedMotion ? '0ms' : `${duration}ms`,
        transitionDelay: reducedMotion ? '0ms' : `${delay}ms`,
        transform: reducedMotion || isVisible ? 'translate(0)' : translate[direction],
        opacity: reducedMotion || isVisible ? 1 : 0,
      }}
    >
      {children}
    </div>
  );
}
