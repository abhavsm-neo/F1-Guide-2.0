import { useState } from 'react';
import { Scale, Info, Pin, ChevronDown } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { F1_RULES } from '../data/rules';
import styles from './RulesPage.module.css';

export default function RulesPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Explain"
          accent="The Rules"
          group="Learn the Basics"
          icon={Scale}
          intro="F1's rulebook is enormous. Here are the most confusing rules explained the way a knowledgeable friend would — with real examples from actual races."
        />
        <BookmarkButton sectionId="rules" />
      </div>

      {F1_RULES.map((rule, i) => (
        <div key={i} className={styles.ruleCard}>
          <div
            className={styles.ruleHeader}
            onClick={() => setOpen(open === i ? null : i)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setOpen(open === i ? null : i);
              }
            }}
            aria-expanded={open === i}
            aria-label={rule.title}
          >
            <span className={styles.ruleIcon} aria-hidden="true">
              <Info size={16} />
            </span>
            <span className={styles.ruleTitle}>{rule.title}</span>
            <span
              className={[styles.ruleChevron, open === i ? styles.ruleChevronOpen : ''].join(' ')}
              aria-hidden="true"
            >
              <ChevronDown size={16} />
            </span>
          </div>
          {open === i && (
            <div className={styles.ruleBody}>
              <p className={styles.rulePlain}>{rule.plain}</p>
              <div className={styles.ruleExample}>
                <Pin size={14} />
                {rule.example}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
