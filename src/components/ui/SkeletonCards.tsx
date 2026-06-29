import styles from './SkeletonCards.module.css';

interface SkeletonCardsProps {
  count?: number;
  hasImage?: boolean;
}

export function SkeletonCards({ count = 6, hasImage = false }: SkeletonCardsProps) {
  return (
    <div className={styles.grid} role="status" aria-label="Loading">
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={styles.card}
          style={{ animationDelay: `${i * 0.05}s` }}
        >
          {hasImage && (
            <div className={styles.skeleton} style={{ height: 140, width: '100%', marginBottom: 12, borderRadius: 'var(--radius-sm)' }} />
          )}
          <div className={styles.skeleton} style={{ height: 14, width: '60%', marginBottom: 10 }} />
          <div className={styles.skeleton} style={{ height: 10, width: '80%', marginBottom: 7 }} />
          <div className={styles.skeleton} style={{ height: 10, width: '60%', marginBottom: 7 }} />
          <div className={styles.skeleton} style={{ height: 10, width: '40%' }} />
        </div>
      ))}
    </div>
  );
}
