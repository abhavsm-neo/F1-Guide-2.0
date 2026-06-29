import { useNavigate } from 'react-router-dom';
import { useBookmarks } from '../context/BookmarksContext';
import { NAV_GROUPS } from '../data/nav';

interface BookmarkSection {
  id: string;
  icon: string;
  label: string;
}

export default function BookmarksPage() {
  const navigate = useNavigate();
  const { bookmarks, toggleBookmark, isBookmarked } = useBookmarks();

  const allSections: BookmarkSection[] = NAV_GROUPS.flatMap((g) =>
    g.sections.map((s) => ({ id: s.id, icon: s.icon, label: s.label }))
  );

  return (
    <div>
      <div className="section-header">
        <div className="section-title">
          My <span>Bookmarks</span>
        </div>
        <div className="section-line" />
      </div>

      {bookmarks.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '48px 20px' }}>
          <div style={{ fontSize: 40, marginBottom: 12 }} aria-hidden="true">
            🔖
          </div>
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 12,
              color: 'var(--text3)',
              letterSpacing: 2,
            }}
          >
            NO BOOKMARKS YET
          </div>
          <p
            style={{
              fontSize: 12,
              color: 'var(--text4)',
              marginTop: 8,
            }}
          >
            Click the ☆ button on any section header to save it here.
          </p>
        </div>
      ) : (
        <div className="bookmarks-grid">
          {bookmarks.map((id) => {
            const s = allSections.find((sec) => sec.id === id);
            if (!s) return null;
            return (
              <div
                key={id}
                className="bookmark-card"
                onClick={() => navigate(`/${id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/${id}`);
                  }
                }}
                aria-label={s.label}
              >
                <span style={{ fontSize: 20 }} aria-hidden="true">
                  {s.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
                <button
                  className="bookmark-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(id);
                  }}
                  style={{ color: '#e10600', fontSize: 14 }}
                  aria-label={`Remove ${s.label} bookmark`}
                >
                  ✕
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ marginTop: 28 }}>
        <div
          style={{
            fontFamily: 'Orbitron',
            fontSize: 10,
            color: '#e10600',
            letterSpacing: 2,
            marginBottom: 14,
          }}
        >
          ALL SECTIONS
        </div>
        <div className="bookmarks-grid">
          {allSections.map((s) => {
            const bookmarked = isBookmarked(s.id);
            return (
              <div
                key={s.id}
                className="bookmark-card"
                onClick={() => navigate(`/${s.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    navigate(`/${s.id}`);
                  }
                }}
                aria-label={s.label}
              >
                <span style={{ fontSize: 20 }} aria-hidden="true">
                  {s.icon}
                </span>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: 'var(--text)',
                    }}
                  >
                    {s.label}
                  </div>
                </div>
                <button
                  className="bookmark-btn"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(s.id);
                  }}
                  style={{
                    color: bookmarked ? '#FFD700' : 'var(--text4)',
                    cursor: 'pointer',
                  }}
                  aria-label={
                    bookmarked ? `Remove ${s.label} bookmark` : `Bookmark ${s.label}`
                  }
                  aria-pressed={bookmarked}
                >
                  {bookmarked ? '★' : '☆'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
