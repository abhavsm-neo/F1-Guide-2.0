export function SkeletonCards({ count = 6, hasImage = false }: { count?: number; hasImage?: boolean }) {
  return (
    <div className="card-grid">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.05}s` }}>
          {hasImage && <div className="skeleton skel" style={{ height: 140, width: '100%', marginBottom: 12, borderRadius: 8 }} />}
          <div className="skeleton skel" style={{ height: 14, width: '60%', marginBottom: 10 }} />
          <div className="skeleton skel" style={{ height: 10, width: '80%', marginBottom: 7 }} />
          <div className="skeleton skel" style={{ height: 10, width: '60%', marginBottom: 7 }} />
          <div className="skeleton skel" style={{ height: 10, width: '40%' }} />
        </div>
      ))}
    </div>
  );
}
