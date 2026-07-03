import { Children, isValidElement, type ReactNode } from 'react';
import { ScrollReveal } from './ScrollReveal';

interface PageRevealProps {
  children: ReactNode;
  className?: string;
  stagger?: number; // ms between each child
}

export function PageReveal({ children, className, stagger = 80 }: PageRevealProps) {
  return (
    <div className={className}>
      {Children.map(children, (child, i) =>
        isValidElement(child) ? (
          <ScrollReveal key={child.key ?? `reveal-${i}`} delay={i * stagger}>
            {child}
          </ScrollReveal>
        ) : (
          child
        )
      )}
    </div>
  );
}
