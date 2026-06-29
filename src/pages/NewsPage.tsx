import { useState, useEffect, useCallback } from 'react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { EmptyState } from '../components/ui/EmptyState';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import { fetchNews } from '../utils/api';
import { timeAgo } from '../utils/format';
import type { NewsItem } from '../types';

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
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="F1"
          accent="News"
          group="Race & Stats"
          icon="📰"
          intro="The latest F1 headlines pulled live from Motorsport.com. Updated automatically."
        />
        <BookmarkButton sectionId="news" />
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          marginBottom: 20,
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            background: 'rgba(0,220,120,0.08)',
            border: '1px solid rgba(0,220,120,0.25)',
            borderRadius: 20,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: '#00dc78',
              boxShadow: '0 0 6px #00dc78',
              animation: 'pulse 2s infinite',
            }}
          />
          <span
            style={{
              fontSize: 10,
              color: '#00dc78',
              fontFamily: 'Orbitron',
              letterSpacing: 1,
            }}
          >
            LIVE · Motorsport.com
          </span>
        </div>
      </div>

      {loading && (
        <div className="news-grid">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="skeleton-card">
              <div
                className="skeleton skel"
                style={{ height: 140, width: '100%', marginBottom: 12, borderRadius: 8 }}
              />
              <div
                className="skeleton skel"
                style={{ height: 14, width: '60%', marginBottom: 10 }}
              />
              <div
                className="skeleton skel"
                style={{ height: 10, width: '80%', marginBottom: 7 }}
              />
              <div
                className="skeleton skel"
                style={{ height: 10, width: '40%' }}
              />
            </div>
          ))}
        </div>
      )}

      {error && !loading && (
        <div
          className="card"
          style={{
            borderColor: '#e10600',
            padding: 28,
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: 32, marginBottom: 10 }}>📡</div>
          <div
            style={{
              fontFamily: 'Orbitron',
              fontSize: 11,
              color: '#e10600',
              letterSpacing: 2,
              marginBottom: 6,
            }}
          >
            CONNECTION ERROR
          </div>
          <p style={{ color: 'var(--text3)', fontSize: 13 }}>{error}</p>
        </div>
      )}

      {!loading && !error && news.length === 0 && (
        <EmptyState
          icon="📰"
          title="NO NEWS FOUND"
          sub="Could not load articles. Check back later."
        />
      )}

      {!loading && !error && news.length > 0 && (
        <div className="news-grid">
          {news.map((item, i) => (
            <a
              key={i}
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className="news-card"
              style={{ textDecoration: 'none' }}
              aria-label={item.title}
            >
              {item.image && (
                <img
                  src={item.image}
                  alt=""
                  className="news-img"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div className="news-source">Motorsport.com</div>
              <div className="news-title">{item.title}</div>
              <div className="news-date">{timeAgo(item.pubDate)}</div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
