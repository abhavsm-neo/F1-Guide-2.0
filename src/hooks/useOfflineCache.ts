import { useState, useEffect } from 'react';

export function useOfflineCache<T>(key: string, fetcher: () => Promise<T>, refreshIntervalMs = 60000): { data: T | null; loading: boolean; error: string | null; refetch: () => void } {
  const [data, setData] = useState<T | null>(() => {
    try {
      const cached = localStorage.getItem(`f1guide_cache_${key}`);
      if (cached) return JSON.parse(cached) as T;
    } catch { /* ignore */ }
    return null;
  });
  const [loading, setLoading] = useState(!data);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fetcher();
      setData(result);
      try {
        localStorage.setItem(`f1guide_cache_${key}`, JSON.stringify(result));
      } catch { /* ignore */ }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    const id = setInterval(load, refreshIntervalMs);
    return () => clearInterval(id);
  }, [key]);

  return { data, loading, error, refetch: load };
}
