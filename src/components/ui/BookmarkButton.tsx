import { useBookmarks } from '../../context/BookmarksContext';
import { Bookmark } from 'lucide-react';
import styles from './BookmarkButton.module.css';

interface BookmarkButtonProps {
  sectionId: string;
  size?: number;
}

export function BookmarkButton({ sectionId, size = 20 }: BookmarkButtonProps) {
  const { isBookmarked, toggleBookmark } = useBookmarks();
  const bookmarked = isBookmarked(sectionId);

  return (
    <button
      className={styles.button}
      onClick={() => toggleBookmark(sectionId)}
      title={bookmarked ? 'Remove bookmark' : 'Bookmark this section'}
      aria-label={bookmarked ? 'Remove bookmark' : 'Bookmark this section'}
      aria-pressed={bookmarked}
    >
      <Bookmark
        size={size}
        className={bookmarked ? styles.bookmarked : styles.notBookmarked}
        fill={bookmarked ? 'currentColor' : 'none'}
      />
    </button>
  );
}
