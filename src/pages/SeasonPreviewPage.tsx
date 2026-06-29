import { useState } from 'react';
import { Telescope, Zap, Flag, Users, Trophy, Eye } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import {
  POWER_RANKINGS_2026,
  RACE_PREVIEWS_2026,
  ROOKIES_2026,
} from '../data/season_preview';
import styles from './SeasonPreviewPage.module.css';

export default function SeasonPreviewPage() {
  const [tab, setTab] = useState<'power' | 'races' | 'rookies'>('power');

  const tabs = [
    { key: 'power' as const, label: 'Power Rankings', icon: Zap },
    { key: 'races' as const, label: 'Race Picks', icon: Flag },
    { key: 'rookies' as const, label: 'Rookies to Watch', icon: Users },
  ];

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="2026"
          accent="Season Preview"
          group="2026 Season"
          icon={Telescope}
          intro="The 2026 season is the biggest regulation reset in F1 history. Three races in, Mercedes are dominant, Antonelli is the youngest championship leader ever, and Aston Martin haven't scored a point. Here's the full picture after 3 of 22 rounds."
        />
        <BookmarkButton sectionId="season-preview" />
      </div>

      <div className={styles.tabs}>
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            className={[styles.tab, tab === key ? styles.tabActive : ''].join(' ')}
            onClick={() => setTab(key)}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'power' && (
        <div>
          <div className={styles.infoCard}>
            <p className={styles.infoText}>
              <strong>Updated after 3 rounds (Japan):</strong>{' '}
              Rankings now reflect actual 2026 race results. Standings: Mercedes
              135pts, Ferrari 90, McLaren 56, Red Bull 16. Antonelli leads the
              Drivers' Championship on 72pts — the youngest leader in F1
              history.
            </p>
          </div>
          {POWER_RANKINGS_2026.map((r) => (
            <div
              key={r.team}
              className={styles.powerCard}
              style={{ borderLeftColor: r.color }}
            >
              <div
                className={styles.powerBarAccent}
                style={{ background: r.color, boxShadow: `0 0 10px ${r.color}60` }}
              />
              <div className={styles.powerContent}>
                <div className={styles.powerPos} style={{ color: r.color }}>
                  {r.pos <= 3
                    ? ['1st', '2nd', '3rd'][r.pos - 1]
                    : `P${r.pos}`}
                </div>
                <div className={styles.powerInfo}>
                  <div className={styles.powerHeader}>
                    <span className={styles.powerTeam}>{r.team}</span>
                    <span
                      className={styles.powerTag}
                      style={{
                        background: r.color + '18',
                        color: r.color,
                        border: `1px solid ${r.color}30`,
                      }}
                    >
                      {r.tag}
                    </span>
                  </div>
                  <div className={styles.powerDrivers}>{r.drivers}</div>
                  <p className={styles.powerVerdict}>{r.verdict}</p>
                  <div className={styles.powerBarWrap}>
                    <div className={styles.powerBar}>
                      <div
                        className={styles.powerBarFill}
                        style={{
                          width: `${r.power}%`,
                          background: `linear-gradient(to right, ${r.color}80, ${r.color})`,
                          boxShadow: `0 0 8px ${r.color}60`,
                        }}
                      />
                    </div>
                    <span className={styles.powerScore}>{r.power}/100</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'races' && (
        <div>
          <div className={styles.infoCard}>
            <p className={styles.infoText}>
              <strong>Disclaimer:</strong> These are analyst-style picks, not
              predictions. F1 is inherently unpredictable — the fun is seeing how
              wrong (or right) these calls turn out to be. Updated after each race.
            </p>
          </div>
          {RACE_PREVIEWS_2026.map((r) => (
            <div
              key={r.round}
              className={styles.raceCard}
              style={{
                borderLeft: r.result ? '3px solid #27F4D2' : undefined,
              }}
            >
              <div className={styles.raceHeader}>
                <span className={styles.raceFlag}>{r.flag}</span>
                <div className={styles.raceInfo}>
                  <div className={styles.raceName}>{r.name}</div>
                  <div className={styles.raceMeta}>
                    R{r.round} · {r.circuit} · {r.date}
                  </div>
                </div>
                <div className={styles.raceResultWrap}>
                  {r.result && (
                    <span className={styles.raceResultBadge}>
                      RACE RESULT
                    </span>
                  )}
                  <div className={styles.raceRating}>{r.rating}</div>
                </div>
              </div>
              <div className={styles.racePickRow}>
                <span className={styles.racePickLabel}>
                  {r.result ? 'WINNER:' : 'OUR PICK:'}
                </span>
                <span
                  className={styles.racePick}
                  style={{
                    color: r.pickColor,
                    textShadow: `0 0 10px ${r.pickColor}60`,
                  }}
                >
                  {r.pick}
                </span>
              </div>
              <p className={styles.racePrediction}>{r.prediction}</p>
              <div
                className={styles.raceWatch}
                style={{
                  color: r.result ? '#27F4D2' : '#00dc78',
                  background: r.result
                    ? 'rgba(39,244,210,0.08)'
                    : 'rgba(0,220,120,0.08)',
                  border: `1px solid ${r.result ? 'rgba(39,244,210,0.2)' : 'rgba(0,220,120,0.2)'}`,
                }}
              >
                {r.result ? (
                  <Trophy size={12} />
                ) : (
                  <Eye size={12} />
                )}
                {r.watchFor}
              </div>
            </div>
          ))}
          <div className={styles.moreCard}>
            <div className={styles.moreTitle}>MORE RACE PREVIEWS</div>
            <p className={styles.moreSub}>
              Full-season previews will update as the 2026 calendar progresses.
            </p>
          </div>
        </div>
      )}

      {tab === 'rookies' && (
        <div>
          <div className={styles.infoCard} style={{ borderLeft: '3px solid var(--success)' }}>
            <p className={styles.infoText}>
              <strong style={{ color: '#00dc78' }}>
                5 rookies or near-rookies
              </strong>{' '}
              on the 2026 grid — the highest number in a decade. All of them have
              genuine speed. Several of them might be future world champions.
            </p>
          </div>
          <div className={styles.rookieGrid}>
            {ROOKIES_2026.map((r) => (
              <div
                key={r.name}
                className={styles.rookieCard}
                style={{ borderTop: `2px solid ${r.color}` }}
              >
                <div className={styles.rookieHeader}>
                  <span className={styles.rookieFlag}>{r.flag}</span>
                  <span className={styles.rookieNumber}>#{r.number}</span>
                </div>
                <div className={styles.rookieName}>{r.name}</div>
                <div className={styles.rookieTeam}>
                  {r.team} · Age {r.age}
                </div>
                <p className={styles.rookieBackground}>{r.background}</p>
                <div className={styles.rookieCeiling}>
                  <div className={styles.rookieCeilingLabel}>CEILING</div>
                  <div className={styles.rookieBar}>
                    <div
                      className={styles.rookieBarFill}
                      style={{
                        width: `${r.potential}%`,
                        background: r.color,
                        boxShadow: `0 0 6px ${r.color}60`,
                      }}
                    />
                  </div>
                  <div className={styles.rookieWatch}>
                    <Eye size={12} />
                    {r.watchFor}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
