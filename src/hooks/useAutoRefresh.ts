import { useRef, useEffect } from 'react';

export function useAutoRefresh(fn: () => void, intervalMs: number, enabled = true) {
  const fnRef = useRef(fn);
  useEffect(() => { fnRef.current = fn; }, [fn]);

  useEffect(() => {
    if (!enabled) return;
    let id: number | null = null;
    const start = () => {
      if (id == null) id = window.setInterval(() => fnRef.current?.(), intervalMs);
    };
    const stop = () => {
      if (id != null) { clearInterval(id); id = null; }
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else start();
    };
    if (!document.hidden) start();
    document.addEventListener('visibilitychange', onVisibility);
    return () => { stop(); document.removeEventListener('visibilitychange', onVisibility); };
  }, [intervalMs, enabled]);
}
