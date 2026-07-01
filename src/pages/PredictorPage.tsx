import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Target, Flag, RotateCcw, X, Check, Camera } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ACTIVE_DRIVERS_2026 } from '../data/drivers';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import type { ActiveDriver } from '../types';
import styles from './PredictorPage.module.css';

const DRIVER_BY_SHORT: Record<string, ActiveDriver> = Object.fromEntries(
  ACTIVE_DRIVERS_2026.map(d => [d.short.toLowerCase(), d])
);

const DRIVER_BY_NAME: Record<string, ActiveDriver> = Object.fromEntries(
  ACTIVE_DRIVERS_2026.map(d => [d.name, d])
);

export default function PredictorPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [submitted, setSubmitted] = useState(false);

  const nextRace = useMemo(() => {
    const now = new Date();
    return RACE_CALENDAR_2026.find(r => !r.cancelled && new Date(r.date) > now) || RACE_CALENDAR_2026[RACE_CALENDAR_2026.length - 1];
  }, []);

  const initialPicks = useMemo(() => {
    const picks: (ActiveDriver | null)[] = Array(10).fill(null);
    for (let i = 1; i <= 10; i++) {
      const key = `p${i}`;
      const val = searchParams.get(key);
      if (val) {
        const driver = DRIVER_BY_SHORT[val.toLowerCase()] || DRIVER_BY_NAME[val] || null;
        if (driver) picks[i - 1] = driver;
      }
    }
    return picks;
  }, [searchParams]);

  const [picks, setPicks] = useState<(ActiveDriver | null)[]>(initialPicks);

  useEffect(() => {
    const params = new URLSearchParams();
    picks.forEach((d, i) => {
      if (d) params.set(`p${i + 1}`, d.short.toLowerCase());
    });
    setSearchParams(params, { replace: true });
  }, [picks, setSearchParams]);

  const selectedIds = useMemo(() => picks.filter(Boolean).map(d => d!.name), [picks]);
  const complete = picks.every(Boolean);

  const pick = useCallback((driver: ActiveDriver) => {
    if (selectedIds.includes(driver.name)) return;
    const firstEmpty = picks.findIndex(p => p === null);
    if (firstEmpty === -1) return;
    const newPicks = [...picks];
    newPicks[firstEmpty] = driver;
    setPicks(newPicks);
  }, [picks, selectedIds]);

  const removeSlot = useCallback((i: number) => {
    const newPicks = [...picks];
    newPicks[i] = null;
    const compacted: (ActiveDriver | null)[] = newPicks.filter((p): p is ActiveDriver => p !== null);
    while (compacted.length < 10) compacted.push(null);
    setPicks(compacted);
  }, [picks]);

  const reset = useCallback(() => {
    setPicks(Array(10).fill(null));
    setSubmitted(false);
  }, []);

  const downloadShareCard = useCallback(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, 600, 640);

    ctx.fillStyle = '#e10600';
    ctx.fillRect(0, 0, 600, 5);

    ctx.strokeStyle = 'rgba(225,6,0,0.05)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 600; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, 640);
      ctx.stroke();
    }
    for (let y = 0; y < 640; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(600, y);
      ctx.stroke();
    }

    ctx.fillStyle = '#e10600';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('MY RACE PREDICTION', 24, 42);
    ctx.fillStyle = '#f0f0fa';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${nextRace?.flag || ''} ${nextRace?.name || 'F1 Race'}`, 24, 72);
    ctx.fillStyle = '#606080';
    ctx.font = '11px monospace';
    ctx.fillText(`Round ${nextRace?.round || '—'} · Built with f1guide.vercel.app`, 24, 92);

    ctx.strokeStyle = 'rgba(225,6,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 104);
    ctx.lineTo(576, 104);
    ctx.stroke();

    picks.forEach((d, i) => {
      const y = 120 + i * 50;
      const posColors = ['#e10600', '#c0c0c0', '#cd7f32'];
      const posColor = posColors[i] || '#404060';

      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(20, y - 14, 560, 40, 6);
        ctx.fill();
      } else {
        ctx.fillRect(20, y - 14, 560, 40);
      }

      ctx.fillStyle = posColor;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`P${i + 1}`, 30, y + 8);

      ctx.fillStyle = d?.color || '#e10600';
      ctx.fillRect(60, y - 14, 3, 40);

      ctx.fillStyle = d?.color || '#e10600';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(d?.short || '---', 72, y + 8);

      ctx.fillStyle = '#f0f0fa';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(d?.name || '---', 120, y + 8);

      ctx.fillStyle = '#606080';
      ctx.font = '10px monospace';
      ctx.fillText(d?.team || '', 400, y + 8);
    });

    ctx.fillStyle = 'rgba(225,6,0,0.4)';
    ctx.fillRect(0, 615, 600, 1);
    ctx.fillStyle = '#404060';
    ctx.font = '10px monospace';
    ctx.fillText("f1guide.vercel.app · The Complete F1 Beginner's Guide", 24, 632);

    const link = document.createElement('a');
    link.download = `F1_Prediction_${(nextRace?.name || 'Race').replace(/\s/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [picks, nextRace]);

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Race"
          accent="Predictor"
          group="Race & Stats"
          icon={Target}
          intro="Pick your predicted top 10 finishers in order. Tap a driver to add them — tap a slot to remove. Then share your grid as a shareable image!"
        />
        <BookmarkButton sectionId="predictor" />
      </div>

      <div className={styles.raceBadge}>
        <span style={{ fontSize: 14 }}>{nextRace.flag}</span>
        <span className={styles.raceBadgeText}>
          NEXT RACE: {nextRace.name} · Round {nextRace.round}
        </span>
      </div>

      {submitted ? (
        <div>
          <div className={styles.successCard}>
            <Flag size={32} className={styles.successIcon} />
            <div className={styles.successTitle}>PREDICTION LOCKED IN!</div>
            <p className={styles.successMessage}>
              Come back after the race to see how you did.
            </p>
            <button className={styles.shareBtn} onClick={downloadShareCard}>
              <Camera size={16} /> DOWNLOAD SHARE CARD
            </button>
          </div>
          <div className={styles.slotList}>
            {picks.map((d, i) => (
              <div
                key={i}
                className={styles.slot}
                style={{ borderLeftColor: d ? d.color : 'var(--border-subtle)' }}
              >
                <span className={styles.slotNum}>P{i + 1}</span>
                <span className={styles.slotShort} style={{ color: d?.color || 'var(--text-tertiary)' }}>
                  {d?.short || '---'}
                </span>
                <span className={styles.slotName}>{d?.name || '---'}</span>
                <span className={styles.slotTeam}>{d?.team || ''}</span>
              </div>
            ))}
          </div>
          <button className={styles.resetBtn} onClick={reset}>
            <RotateCcw size={14} /> RESET
          </button>
        </div>
      ) : (
        <div className={styles.predictorGrid}>
          <div>
            <div className={styles.panelLabel}>YOUR TOP 10</div>
            {picks.map((d, i) => (
              <div
                key={i}
                className={styles.slot}
                style={{
                  borderLeftColor: d ? d.color : 'var(--border-subtle)',
                  cursor: d ? 'pointer' : 'default',
                }}
                onClick={() => d && removeSlot(i)}
                role="button"
                aria-label={d ? `Remove ${d.name} from position ${i + 1}` : `Empty slot ${i + 1}`}
              >
                <span className={styles.slotNum}>P{i + 1}</span>
                {d ? (
                  <>
                    <span className={styles.slotShort} style={{ color: d.color }}>
                      {d.short}
                    </span>
                    <span className={styles.slotName}>{d.name}</span>
                    <span className={styles.slotRemove}><X size={14} /></span>
                  </>
                ) : (
                  <span className={styles.slotEmpty}>— tap a driver —</span>
                )}
              </div>
            ))}
            {complete && (
              <button
                className={styles.lockBtn}
                onClick={() => setSubmitted(true)}
                aria-label="Lock in prediction"
              >
                LOCK IN PREDICTION <Flag size={14} />
              </button>
            )}
          </div>
          <div>
            <div className={styles.panelLabel}>SELECT DRIVERS</div>
            <div className={styles.driverList}>
              {ACTIVE_DRIVERS_2026.map(d => {
                const isSelected = selectedIds.includes(d.name);
                return (
                  <button
                    key={d.name}
                    className={`${styles.driverBtn} ${isSelected ? styles.driverBtnSelected : ''}`}
                    onClick={() => pick(d)}
                    disabled={isSelected}
                    style={{ borderLeftColor: d.color }}
                    aria-label={isSelected ? `${d.name} already selected` : `Add ${d.name} to prediction`}
                  >
                    <span className={styles.driverShort} style={{ color: d.color }}>
                      {d.short}
                    </span>
                    <span className={styles.driverName}>{d.name}</span>
                    <span className={styles.driverTeam}>{d.team}</span>
                    {isSelected && <Check size={14} className={styles.checkIcon} />}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
