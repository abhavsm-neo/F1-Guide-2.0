import { useNavigate } from 'react-router-dom';
import { Bookmark, X, Star, FileText } from 'lucide-react';
import { useBookmarks } from '../context/BookmarksContext';
import { NAV_GROUPS } from '../data/nav';
import { SectionHeader } from '../components/ui/SectionHeader';
import styles from './BookmarksPage.module.css';

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
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="My"
          accent="Bookmarks"
          group="Library"
          icon={Bookmark}
        />
      </div>

      {bookmarks.length === 0 ? (
        <div className={styles.emptyCard}>
          <Bookmark size={48} className={styles.emptyIcon} aria-hidden="true" />
          <div className={styles.emptyTitle}>NO BOOKMARKS YET</div>
          <p className={styles.emptySub}>
            Click the star button on any section header to save it here.
          </p>
        </div>
      ) : (
        <div className={styles.bookmarksGrid}>
          {bookmarks.map((id) => {
            const s = allSections.find((sec) => sec.id === id);
            if (!s) return null;
            return (
              <div
                key={id}
                className={styles.bookmarkCard}
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
                <FileText size={20} aria-hidden="true" />
                <div className={styles.bookmarkLabel}>{s.label}</div>
                <button
                  className={styles.removeBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(id);
                  }}
                  aria-label={`Remove ${s.label} bookmark`}
                >
                  <X size={16} />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={styles.allSections}>
        <div className={styles.allSectionsTitle}>ALL SECTIONS</div>
        <div className={styles.bookmarksGrid}>
          {allSections.map((s) => {
            const bookmarked = isBookmarked(s.id);
            return (
              <div
                key={s.id}
                className={styles.bookmarkCard}
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
                <FileText size={20} aria-hidden="true" />
                <div className={styles.bookmarkLabel}>{s.label}</div>
                <button
                  className={styles.starBtn}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(s.id);
                  }}
                  aria-label={
                    bookmarked ? `Remove ${s.label} bookmark` : `Bookmark ${s.label}`
                  }
                  aria-pressed={bookmarked}
                >
                  <Star
                    size={16}
                    fill={bookmarked ? 'currentColor' : 'none'}
                  />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
