import styles from './RatingBar.module.css';

interface RatingBarProps {
  label: string;
  value: number;
}

export function RatingBar({ label, value }: RatingBarProps) {
  return (
    <div className={styles.row}>
      <div className={styles.header}>
        <span className={styles.label}>{label}</span>
        <span className={styles.score}>{value}/100</span>
      </div>
      <div className={styles.bar}>
        <div
          className={styles.fill}
          style={
            {
              '--bar-width': `${value}%`,
              width: `${value}%`,
            } as React.CSSProperties
          }
        />
      </div>
    </div>
  );
}
