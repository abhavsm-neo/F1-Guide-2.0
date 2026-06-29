import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ACTIVE_DRIVERS_2026 } from '../data/drivers';
import { RACE_CALENDAR_2026 } from '../data/circuits';
import type { ActiveDriver } from '../types';

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

  // Sync picks to URL
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

    // Background
    ctx.fillStyle = '#0a0a12';
    ctx.fillRect(0, 0, 600, 640);

    // Red top bar
    ctx.fillStyle = '#e10600';
    ctx.fillRect(0, 0, 600, 5);

    // Grid lines
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

    // Header
    ctx.fillStyle = '#e10600';
    ctx.font = 'bold 13px monospace';
    ctx.fillText('MY RACE PREDICTION', 24, 42);
    ctx.fillStyle = '#f0f0fa';
    ctx.font = 'bold 22px monospace';
    ctx.fillText(`${nextRace?.flag || '🏁'} ${nextRace?.name || 'F1 Race'}`, 24, 72);
    ctx.fillStyle = '#606080';
    ctx.font = '11px monospace';
    ctx.fillText(`Round ${nextRace?.round || '—'} · Built with f1guide.vercel.app`, 24, 92);

    // Divider
    ctx.strokeStyle = 'rgba(225,6,0,0.3)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(24, 104);
    ctx.lineTo(576, 104);
    ctx.stroke();

    // Picks
    picks.forEach((d, i) => {
      const y = 120 + i * 50;
      const posColors = ['#e10600', '#c0c0c0', '#cd7f32'];
      const posColor = posColors[i] || '#404060';

      // Row background
      ctx.fillStyle = 'rgba(255,255,255,0.02)';
      if (ctx.roundRect) {
        ctx.beginPath();
        ctx.roundRect(20, y - 14, 560, 40, 6);
        ctx.fill();
      } else {
        ctx.fillRect(20, y - 14, 560, 40);
      }

      // Position
      ctx.fillStyle = posColor;
      ctx.font = 'bold 11px monospace';
      ctx.fillText(`P${i + 1}`, 30, y + 8);

      // Team color strip
      ctx.fillStyle = d?.color || '#e10600';
      ctx.fillRect(60, y - 14, 3, 40);

      // Driver number
      ctx.fillStyle = d?.color || '#e10600';
      ctx.font = 'bold 16px monospace';
      ctx.fillText(d?.short || '---', 72, y + 8);

      // Driver name
      ctx.fillStyle = '#f0f0fa';
      ctx.font = 'bold 13px monospace';
      ctx.fillText(d?.name || '---', 120, y + 8);

      // Team
      ctx.fillStyle = '#606080';
      ctx.font = '10px monospace';
      ctx.fillText(d?.team || '', 400, y + 8);
    });

    // Footer
    ctx.fillStyle = 'rgba(225,6,0,0.4)';
    ctx.fillRect(0, 615, 600, 1);
    ctx.fillStyle = '#404060';
    ctx.font = '10px monospace';
    ctx.fillText('f1guide.vercel.app · The Complete F1 Beginner\'s Guide', 24, 632);

    const link = document.createElement('a');
    link.download = `F1_Prediction_${(nextRace?.name || 'Race').replace(/\s/g, '_')}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }, [picks, nextRace]);

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <SectionHeader
          title="Race"
          accent="Predictor"
          group="Race & Stats"
          icon="🔮"
          intro="Pick your predicted top 10 finishers in order. Tap a driver to add them — tap a slot to remove. Then share your grid as a shareable image!"
        />
        <BookmarkButton sectionId="predictor" />
      </div>

      <div
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          padding: '6px 14px',
          background: 'rgba(225,6,0,0.08)',
          border: '1px solid rgba(225,6,0,0.2)',
          borderRadius: 20,
          marginBottom: 20,
        }}
      >
        <span style={{ fontSize: 14 }}>{nextRace.flag}</span>
        <span style={{ fontFamily: 'Orbitron', fontSize: 11, color: '#e10600', letterSpacing: 1 }}>
          NEXT RACE: {nextRace.name} · Round {nextRace.round}
        </span>
      </div>

      {submitted ? (
        <div>
          <div
            className="card"
            style={{
              textAlign: 'center',
              padding: '32px 20px',
              marginBottom: 20,
              borderColor: '#00dc78',
            }}
          >
            <div style={{ fontSize: 32, marginBottom: 8 }}>🏁</div>
            <div
              style={{
                fontFamily: 'Orbitron',
                fontSize: 14,
                color: '#00dc78',
                letterSpacing: 2,
                marginBottom: 8,
              }}
            >
              PREDICTION LOCKED IN!
            </div>
            <p style={{ fontSize: 12, color: 'var(--text3)', marginBottom: 16 }}>
              Come back after the race to see how you did.
            </p>
            <button className="share-btn" onClick={downloadShareCard} style={{ margin: '0 auto' }}>
              📸 DOWNLOAD SHARE CARD
            </button>
          </div>
          <div style={{ marginBottom: 20 }}>
            {picks.map((d, i) => (
              <div
                key={i}
                className="predictor-slot"
                style={{ borderLeft: `3px solid ${d ? d.color : 'var(--border)'}` }}
              >
                <span className="predictor-slot-num">P{i + 1}</span>
                <span style={{ fontSize: 12, color: d?.color || 'var(--text3)', fontWeight: 700, fontFamily: 'Orbitron' }}>
                  {d?.short || '---'}
                </span>
                <span style={{ fontSize: 13, color: 'var(--text)' }}>{d?.name || '---'}</span>
                <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 'auto' }}>{d?.team || ''}</span>
              </div>
            ))}
          </div>
          <button
            onClick={reset}
            style={{
              padding: '8px 20px',
              background: 'transparent',
              border: '1px solid var(--border2)',
              color: 'var(--text2)',
              fontFamily: 'Orbitron',
              fontSize: 10,
              letterSpacing: 2,
              cursor: 'pointer',
              borderRadius: 6,
            }}
          >
            RESET
          </button>
        </div>
      ) : (
        <div className="predictor-grid">
          <div>
            <div
              style={{
                fontFamily: 'Orbitron',
                fontSize: 9,
                color: '#e10600',
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              YOUR TOP 10
            </div>
            {picks.map((d, i) => (
              <div
                key={i}
                className="predictor-slot"
                style={{
                  borderLeft: `3px solid ${d ? d.color : 'var(--border)'}`,
                  cursor: d ? 'pointer' : 'default',
                }}
                onClick={() => d && removeSlot(i)}
                role="button"
                aria-label={d ? `Remove ${d.name} from position ${i + 1}` : `Empty slot ${i + 1}`}
              >
                <span className="predictor-slot-num">P{i + 1}</span>
                {d ? (
                  <>
                    <span
                      style={{
                        fontSize: 11,
                        color: d.color,
                        fontWeight: 700,
                        fontFamily: 'Orbitron',
                      }}
                    >
                      {d.short}
                    </span>
                    <span style={{ fontSize: 12, color: 'var(--text)' }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)', marginLeft: 'auto' }}>✕</span>
                  </>
                ) : (
                  <span style={{ fontSize: 11, color: 'var(--text4)' }}>— tap a driver —</span>
                )}
              </div>
            ))}
            {complete && (
              <button
                onClick={() => setSubmitted(true)}
                style={{
                  marginTop: 12,
                  width: '100%',
                  padding: '12px',
                  background: 'linear-gradient(135deg, #e10600, #ff4020)',
                  border: 'none',
                  color: '#fff',
                  fontFamily: 'Orbitron',
                  fontSize: 11,
                  letterSpacing: 2,
                  cursor: 'pointer',
                  borderRadius: 8,
                  boxShadow: '0 4px 20px rgba(225,6,0,0.3)',
                }}
                aria-label="Lock in prediction"
              >
                LOCK IN PREDICTION 🏁
              </button>
            )}
          </div>
          <div>
            <div
              style={{
                fontFamily: 'Orbitron',
                fontSize: 9,
                color: '#e10600',
                letterSpacing: 2,
                marginBottom: 12,
              }}
            >
              SELECT DRIVERS
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 4,
                maxHeight: 440,
                overflowY: 'auto',
              }}
            >
              {ACTIVE_DRIVERS_2026.map(d => {
                const isSelected = selectedIds.includes(d.name);
                return (
                  <button
                    key={d.name}
                    className={`predictor-driver-btn${isSelected ? ' selected' : ''}`}
                    onClick={() => pick(d)}
                    disabled={isSelected}
                    style={{ borderLeft: `3px solid ${d.color}` }}
                    aria-label={isSelected ? `${d.name} already selected` : `Add ${d.name} to prediction`}
                  >
                    <span style={{ fontFamily: 'Orbitron', fontSize: 10, color: d.color, minWidth: 28 }}>
                      {d.short}
                    </span>
                    <span style={{ flex: 1 }}>{d.name}</span>
                    <span style={{ fontSize: 10, color: 'var(--text3)' }}>{d.team}</span>
                    {isSelected && <span style={{ fontSize: 10, color: '#00dc78' }}>✓</span>}
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
