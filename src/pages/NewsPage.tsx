import { useState, useEffect, useCallback } from 'react';
import { Newspaper, AlertCircle } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { EmptyState } from '../components/ui/EmptyState';
import { SkeletonCards } from '../components/ui/SkeletonCards';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { fetchNews } from '../utils/api';
import { timeAgo } from '../utils/format';
import type { NewsItem } from '../types';
import styles from './NewsPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

export default function NewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadNews = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchNews();
      setNews(data.items || []);
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'Could not load news — please try again later.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews();
  }, [loadNews]);
  useAutoRefresh(loadNews, 5 * 60_000);

  return (
    <PageReveal className={styles.page}>
      <SectionHeader
        title="F1"
        accent="News"
        group="Race & Stats"
        icon={Newspaper}
        intro="The latest F1 headlines pulled live from Motorsport.com. Updated automatically."
        sectionId="news"
      />

      <div className={styles.liveBar}>
        <div className={styles.liveBadge}>
          <div className={styles.liveDot} />
          <span className={styles.liveText}>LIVE · Motorsport.com</span>
        </div>
      </div>

      {loading && <SkeletonCards count={6} hasImage />}

      {error && !loading && (
        <div className={styles.errorCard}>
          <AlertCircle size={32} className={styles.errorIcon} />
          <div className={styles.errorTitle}>CONNECTION ERROR</div>
          <p className={styles.errorMessage}>{error}</p>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <EmptyState
          icon={Newspaper}
          title="NO NEWS FOUND"
          sub="Could not load articles. Check back later."
        />
      )}

      {!loading && !error && news.length > 0 && (
        <div className={styles.newsGrid}>
          {news.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.newsCard}
              aria-label={item.title}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className={styles.newsImg}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className={styles.newsSource}>Motorsport.com</div>
              <div className={styles.newsTitle}>{item.title}</div>
              <div className={styles.newsDate}>{timeAgo(item.pubDate)}</div>
            </a>
          ))}
        </div>
      )}
    </PageReveal>
  );
}
