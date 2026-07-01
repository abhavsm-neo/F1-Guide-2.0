import { useState } from 'react';
import { TrendingUp } from 'lucide-react';
import { CHAMPIONSHIP_SEASONS } from '../../data/championship';
import styles from './ChampionshipTracker.module.css';

interface TooltipState {
  round: string;
  points: number;
  driver: string;
  x: number;
  y: number;
}

export function ChampionshipTracker() {
  const [year, setYear] = useState<keyof typeof CHAMPIONSHIP_SEASONS>(2024);
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const season = CHAMPIONSHIP_SEASONS[year];

  const maxPts = Math.max(...season.rounds.flatMap((r) => r.points));
  const svgW = 800;
  const svgH = 320;
  const padL = 56;
  const padR = 24;
  const padT = 24;
  const padB = 36;
  const chartW = svgW - padL - padR;
  const chartH = svgH - padT - padB;
  const rounds = season.rounds;
  const nRounds = rounds.length;

  const ptToX = (i: number) => padL + (i / (nRounds - 1)) * chartW;
  const ptToY = (v: number) => padT + chartH - (v / (maxPts * 1.05)) * chartH;

  const top3 = [...season.drivers]
    .map((d, i) => ({
      ...d,
      finalPoints: season.rounds[season.rounds.length - 1].points[i],
      index: i,
    }))
    .sort((a, b) => b.finalPoints - a.finalPoints)
    .slice(0, 3);

  const handlePointEnter = (
    e: React.MouseEvent<SVGCircleElement>,
    round: string,
    points: number,
    driver: string
  ) => {
    const rect = (e.target as SVGCircleElement).getBoundingClientRect();
    setTooltip({
      round,
      points,
      driver,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handlePointLeave = () => setTooltip(null);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <TrendingUp size={20} strokeWidth={2} className={styles.headerIcon} />
        <h2 className={styles.title}>
          Championship <span className={styles.titleAccent}>Battle</span>
        </h2>
      </div>
      <div className={styles.divider} />
      <p className={styles.intro}>
        See how the World Drivers' Championship unfolded round by round. Select a season to relive the battle.
      </p>

      <div className={styles.yearToggle}>
        {([2021, 2022, 2023, 2024] as const).map((y) => (
          <button
            key={y}
            className={`${styles.yearBtn} ${year === y ? styles.yearBtnActive : ''}`}
            onClick={() => setYear(y)}
            aria-pressed={year === y}
          >
            {y}
          </button>
        ))}
      </div>

      <div className={styles.infoCard}>
        <div className={styles.infoHeader}>
          <span className={styles.infoYear}>
            {year}: {season.title}
          </span>
          <span className={styles.dramaBadge}>{season.drama}</span>
        </div>
        <p className={styles.infoNote}>{season.note}</p>
      </div>

      <div className={styles.legend}>
        {top3.map((d) => (
          <div key={d.short} className={styles.legendItem}>
            <div
              className={styles.legendDot}
              style={{ backgroundColor: d.color }}
            />
            <span className={styles.legendName}>{d.name}</span>
            <span className={styles.legendMeta}>({d.team})</span>
          </div>
        ))}
      </div>

      <div className={styles.chartWrapper}>
        <svg
          viewBox={`0 0 ${svgW} ${svgH}`}
          className={styles.chartSvg}
          role="img"
          aria-label={`Championship battle chart for ${year}`}
        >
          {/* Horizontal grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((frac) => {
            const y = ptToY(maxPts * 1.05 * frac);
            const val = Math.round(maxPts * 1.05 * frac);
            return (
              <g key={frac}>
                <line
                  x1={padL}
                  y1={y}
                  x2={svgW - padR}
                  y2={y}
                  className={styles.gridLine}
                />
                <text
                  x={padL - 8}
                  y={y}
                  textAnchor="end"
                  dominantBaseline="middle"
                  className={styles.axisText}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {rounds.map((r, i) => (
            <text
              key={i}
              x={ptToX(i)}
              y={svgH - 10}
              textAnchor="middle"
              className={styles.axisText}
            >
              {r.label}
            </text>
          ))}

          {/* Area fills (bottom layer) */}
          {season.drivers.map((d, di) => {
            const pts = rounds.map((r, i) => ({
              x: ptToX(i),
              y: ptToY(r.points[di]),
            }));
            const areaD =
              pts
                .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
                .join(' ') +
              ` L${pts[pts.length - 1].x},${padT + chartH} L${pts[0].x},${padT + chartH} Z`;
            return (
              <path
                key={`area-${d.short}`}
                d={areaD}
                className={styles.areaFill}
                style={{ fill: `${d.color}20` }}
              />
            );
          })}

          {/* Driver lines */}
          {season.drivers.map((d, di) => {
            const pts = rounds.map((r, i) => ({
              x: ptToX(i),
              y: ptToY(r.points[di]),
            }));
            const pathD = pts
              .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x},${p.y}`)
              .join(' ');
            return (
              <g key={d.short}>
                <path
                  d={pathD}
                  className={styles.lineStroke}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="2.5"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
                {pts.map((p, i) => (
                  <circle
                    key={i}
                    cx={p.x}
                    cy={p.y}
                    r="4"
                    className={styles.dataPoint}
                    stroke={d.color}
                    onMouseEnter={(e) =>
                      handlePointEnter(
                        e,
                        rounds[i].label,
                        rounds[i].points[di],
                        d.name
                      )
                    }
                    onMouseLeave={handlePointLeave}
                  />
                ))}
                <text
                  x={pts[pts.length - 1].x + 8}
                  y={pts[pts.length - 1].y + 1}
                  dominantBaseline="middle"
                  className={styles.driverLabel}
                  style={{ fill: d.color }}
                >
                  {d.short}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className={styles.tooltipRound}>{tooltip.round}</div>
          <div className={styles.tooltipPoints}>{tooltip.points} pts</div>
          <div className={styles.tooltipDriver}>{tooltip.driver}</div>
        </div>
      )}

      <div className={styles.resultsGrid}>
        {season.drivers.map((d, di) => (
          <div
            key={d.short}
            className={styles.resultCard}
            style={{ borderTopColor: d.color }}
          >
            <div className={styles.resultName} style={{ color: d.color }}>
              {d.name}
            </div>
            <div className={styles.resultPoints}>
              {season.rounds[season.rounds.length - 1].points[di]}
            </div>
            <div className={styles.resultLabel}>POINTS</div>
          </div>
        ))}
      </div>
    </div>
  );
}
