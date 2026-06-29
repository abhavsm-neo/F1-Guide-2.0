import { useState } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { F1_RULES } from '../data/rules';

export default function RulesPage() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="Explain"
          accent="The Rules"
          group="Learn the Basics"
          icon="📋"
          intro="F1's rulebook is enormous. Here are the most confusing rules explained the way a knowledgeable friend would — with real examples from actual races."
        />
        <BookmarkButton sectionId="rules" />
      </div>

      {F1_RULES.map((rule, i) => (
        <div key={i} className="rule-card">
          <div
            className="rule-header"
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
            <span className="rule-icon" aria-hidden="true">
              {rule.icon}
            </span>
            <span className="rule-title">{rule.title}</span>
            <span
              className={`rule-chevron${open === i ? ' open' : ''}`}
              aria-hidden="true"
            >
              ▼
            </span>
          </div>
          {open === i && (
            <div className="rule-body">
              <p className="rule-plain">{rule.plain}</p>
              <div className="rule-example">📌 {rule.example}</div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
