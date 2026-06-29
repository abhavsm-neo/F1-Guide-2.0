import type { LucideIcon } from 'lucide-react';
import styles from './EmptyState.module.css';

interface EmptyStateProps {
  icon?: LucideIcon;
  title?: string;
  sub?: string;
  action?: { label: string; onClick: () => void };
}

export function EmptyState({
  icon: Icon,
  title = 'NOTHING FOUND',
  sub = 'Try a different search or filter.',
  action,
}: EmptyStateProps) {
  return (
    <div className={styles.container} role="status" aria-live="polite">
      {Icon && <Icon size={48} className={styles.icon} aria-hidden="true" />}
      <div className={styles.title}>{title}</div>
      <div className={styles.subtitle}>{sub}</div>
      {action && (
        <button className={styles.actionButton} onClick={action.onClick}>
          {action.label}
        </button>
      )}
    </div>
  );
}
