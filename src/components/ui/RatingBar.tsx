interface RatingBarProps {
  label: string;
  value: number;
}

export function RatingBar({ label, value }: RatingBarProps) {
  return (
    <div className="rating-bar-wrap">
      <div className="rating-label">
        <span>{label}</span>
        <span style={{ color: '#e10600' }}>{value}/100</span>
      </div>
      <div className="rating-bar">
        <div
          className="rating-fill"
          style={{ '--bar-w': `${value}%`, width: `${value}%` } as React.CSSProperties}
        />
      </div>
    </div>
  );
}
