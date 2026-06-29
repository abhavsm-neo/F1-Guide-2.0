import { useBookmarks } from '../../context/BookmarksContext';

interface BookmarkButtonProps {
  sectionId: string;
  size?: number;
}

export function BookmarkButton({ sectionId, size = 18 }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(sectionId);

  return (
    <button
      className="bookmark-btn"
      onClick={() => toggleBookmark(sectionId)}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this section'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this section'}
      aria-pressed={bookmarked}
      style={{ fontSize: size, color: bookmarked ? '#FFD700' : 'var(--text4)' }}
    >
      {bookmarked ? '★' : '☆'}
    </button>
  );
}
