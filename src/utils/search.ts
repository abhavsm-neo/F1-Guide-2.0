import type { SearchResult } from '../types';

export function searchIndex(query: string, index: SearchResult[]): SearchResult[] {
  const q = query.toLowerCase();
  return index.filter(
    item =>
      item.title.toLowerCase().includes(q) ||
      (item.sub || '').toLowerCase().includes(q) ||
      (item.keywords || '').includes(q)
  ).slice(0, 8);
}
