import { useState, useEffect, useRef } from 'react';
import { useReducedMotion } from './useReducedMotion';

interface UseCountUpOptions {
  target: number;
  duration?: number; // ms, default 1500
  decimals?: number; // default 0
  startOnMount?: boolean; // default false (use IntersectionObserver)
}

export function useCountUp({
  target,
  duration = 1500,
  decimals = 0,
  startOnMount = false,
}: UseCountUpOptions) {
  const [value, setValue] = useState(startOnMount ? target : 0);
  const [started, setStarted] = useState(startOnMount);
  const ref = useRef<HTMLSpanElement>(null);
  const rafRef = useRef<number | undefined>(undefined);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    if (reducedMotion) {
      setValue(Number(target.toFixed(decimals)));
      return;
    }

    if (startOnMount) return;

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setStarted(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [startOnMount, reducedMotion, target, decimals]);

  useEffect(() => {
    if (reducedMotion) {
      setValue(Number(target.toFixed(decimals)));
      return;
    }

    if (!started) return;

    const startTime = performance.now();
    const startValue = 0;

    const tick = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = startValue + (target - startValue) * eased;
      setValue(Number(current.toFixed(decimals)));

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(tick);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [started, target, duration, decimals, reducedMotion]);

  return { value, ref };
}
