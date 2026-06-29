import type { LucideIcon } from 'lucide-react';
import { ChevronRight } from 'lucide-react';
import { BookmarkButton } from './BookmarkButton';
import styles from './SectionHeader.module.css';

interface SectionHeaderProps {
  title: string;
  accent: string;
  group: string;
  intro?: string;
  icon?: LucideIcon;
  sectionId?: string;
}

export function SectionHeader({ title, accent, group, intro, icon: Icon, sectionId }: SectionHeaderProps) {
  return (
    <div className={styles.container}>
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}>
        <span className={styles.breadcrumbItem}>Home</span>
        <ChevronRight size={12} className={styles.breadcrumbSep} aria-hidden="true" />
        <span className={styles.breadcrumbCurrent}>{group}</span>
      </nav>

      {/* Heading row */}
      <div className={styles.headingRow}>
        <h2 className={styles.title}>
          {title}{' '}
          <span className={styles.accent}>{accent}</span>
        </h2>
        {sectionId && <BookmarkButton sectionId={sectionId} />}
      </div>

      {/* Accent line */}
      <div className={styles.accentLine} aria-hidden="true" />

      {/* Description */}
      {intro && (
        <p className={styles.description}>
          {Icon && <Icon size={20} className={styles.descriptionIcon} />}
          {intro}
        </p>
      )}
    </div>
  );
}
