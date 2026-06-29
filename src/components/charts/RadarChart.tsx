import { useState } from 'react';
import styles from './RadarChart.module.css';

interface RadarDataPoint {
  label: string;
  value: number;
}

interface RadarChartProps {
  data: RadarDataPoint[];
  color?: string;
  comparisonData?: RadarDataPoint[];
  comparisonColor?: string;
}

interface TooltipState {
  label: string;
  value: number;
  x: number;
  y: number;
}

export function RadarChart({ data, color, comparisonData, comparisonColor }: RadarChartProps) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);

  const size = 400;
  const cx = size / 2;
  const cy = size / 2;
  const r = 150;
  const n = data.length;

  const toXY = (val: number, i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const ratio = val / 100;
    return {
      x: cx + r * ratio * Math.cos(angle),
      y: cy + r * ratio * Math.sin(angle),
    };
  };

  const labelXY = (i: number) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    return {
      x: cx + (r + 28) * Math.cos(angle),
      y: cy + (r + 28) * Math.sin(angle),
    };
  };

  const polygonPoints = data
    .map((d, i) => {
      const pt = toXY(d.value, i);
      return `${pt.x},${pt.y}`;
    })
    .join(' ');

  const handlePointEnter = (
    e: React.MouseEvent<SVGCircleElement>,
    label: string,
    value: number
  ) => {
    const rect = (e.target as SVGCircleElement).getBoundingClientRect();
    setTooltip({
      label,
      value,
      x: rect.left + rect.width / 2,
      y: rect.top - 8,
    });
  };

  const handlePointLeave = () => setTooltip(null);

  const fillColor = color || 'var(--accent)';
  const fillAreaColor = color ? `${color}26` : 'var(--accent-muted)';

  return (
    <div className={styles.wrapper}>
      <svg
        viewBox={`0 0 ${size} ${size}`}
        className={styles.chartSvg}
        role="img"
        aria-label="Radar chart showing driver attributes"
      >
        {/* Grid hexagons / webs */}
        {[0.25, 0.5, 0.75, 1].map((frac) => (
          <polygon
            key={frac}
            points={data
              .map((_, i) => {
                const p = toXY(100 * frac, i);
                return `${p.x},${p.y}`;
              })
              .join(' ')}
            className={styles.gridPolygon}
          />
        ))}

        {/* Axis spokes */}
        {data.map((_, i) => {
          const p = toXY(100, i);
          return (
            <line
              key={i}
              x1={cx}
              y1={cy}
              x2={p.x}
              y2={p.y}
              className={styles.axisLine}
            />
          );
        })}

        {/* Data fill area */}
        <polygon
          points={polygonPoints}
          className={styles.dataArea}
          style={{ fill: fillAreaColor }}
        />

        {/* Data stroke line */}
        <polygon
          points={polygonPoints}
          fill="none"
          stroke={fillColor}
          strokeWidth="2"
          strokeLinejoin="round"
        />

        {/* Comparison series (rendered behind primary) */}
        {comparisonData && comparisonData.length === n && (
          <>
            <polygon
              points={comparisonData
                .map((d, i) => {
                  const pt = toXY(d.value, i);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ')}
              className={styles.dataArea}
              style={{ fill: comparisonColor ? `${comparisonColor}26` : 'var(--accent-muted)' }}
            />
            <polygon
              points={comparisonData
                .map((d, i) => {
                  const pt = toXY(d.value, i);
                  return `${pt.x},${pt.y}`;
                })
                .join(' ')}
              fill="none"
              stroke={comparisonColor || 'var(--accent)'}
              strokeWidth="2"
              strokeLinejoin="round"
            />
            {comparisonData.map((d, i) => {
              const pt = toXY(d.value, i);
              return (
                <circle
                  key={`comp-${i}`}
                  cx={pt.x}
                  cy={pt.y}
                  r="4"
                  className={styles.dataPoint}
                  fill={comparisonColor || 'var(--accent)'}
                  onMouseEnter={(e) => handlePointEnter(e, d.label, d.value)}
                  onMouseLeave={handlePointLeave}
                />
              );
            })}
          </>
        )}

        {/* Data points */}
        {data.map((d, i) => {
          const pt = toXY(d.value, i);
          return (
            <circle
              key={i}
              cx={pt.x}
              cy={pt.y}
              r="4"
              className={styles.dataPoint}
              fill={fillColor}
              onMouseEnter={(e) => handlePointEnter(e, d.label, d.value)}
              onMouseLeave={handlePointLeave}
            />
          );
        })}

        {/* Axis labels */}
        {data.map((d, i) => {
          const lp = labelXY(i);
          return (
            <text
              key={i}
              x={lp.x}
              y={lp.y}
              textAnchor="middle"
              dominantBaseline="middle"
              className={styles.axisLabel}
            >
              {d.label.toUpperCase()}
            </text>
          );
        })}
      </svg>

      {tooltip && (
        <div
          className={styles.tooltip}
          style={{
            left: tooltip.x,
            top: tooltip.y,
          }}
        >
          <div className={styles.tooltipLabel}>{tooltip.label}</div>
          <div className={styles.tooltipValue}>{tooltip.value}</div>
        </div>
      )}
    </div>
  );
}
