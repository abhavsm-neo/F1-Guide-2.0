import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useToast } from '../hooks/useToast';

interface BookmarksContextType {
  bookmarks: string[];
  toggleBookmark: (id: string) => void;
  isBookmarked: (id: string) => boolean;
}

const BookmarksContext = createContext<BookmarksContextType>({
  bookmarks: [],
  toggleBookmark: () => {},
  isBookmarked: () => false,
});

export function BookmarksProvider({ children }: { children: ReactNode }) {
  const [bookmarks, setBookmarks] = useLocalStorage<string[]>('f1guide_bookmarks', []);
  const [, showToast] = useToast();

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks(prev => {
      const isAdding = !prev.includes(id);
      showToast(isAdding ? '⭐ Bookmarked!' : 'Removed bookmark');
      return isAdding ? [...prev, id] : prev.filter(b => b !== id);
    });
  }, [setBookmarks, showToast]);

  const isBookmarked = useCallback((id: string) => bookmarks.includes(id), [bookmarks]);

  return (
    <BookmarksContext.Provider value={{ bookmarks, toggleBookmark, isBookmarked }}>
      {children}
    </BookmarksContext.Provider>
  );
}

export function useBookmarks() {
  return useContext(BookmarksContext);
}
