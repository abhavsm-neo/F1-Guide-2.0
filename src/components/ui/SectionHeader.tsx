interface SectionHeaderProps {
  title: string;
  accent: string;
  group: string;
  intro?: string;
  icon?: string;
}

export function SectionHeader({ title, accent, group, intro, icon }: SectionHeaderProps) {
  return (
    <div>
      <nav aria-label="Breadcrumb" className="breadcrumb">
        <span>{group}</span>
        <span className="breadcrumb-sep" aria-hidden="true">›</span>
        <span className="breadcrumb-current">
          {icon} {title.replace(/<[^>]+>/g, '')} {accent}
        </span>
      </nav>
      <h2 className="section-title">{title} <span>{accent}</span></h2>
      <div className="section-line" aria-hidden="true" />
      {intro && <p className="section-intro">{intro}</p>}
    </div>
  );
}
