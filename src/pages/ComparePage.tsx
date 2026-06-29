import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { CAR_COMPARE } from '../data/car_compare';

export default function ComparePage() {
  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="2025 vs"
          accent="2026 Cars"
          group="2026 Season"
          icon="⚡"
          intro="2026 is the biggest regulation reset since 2014. Here's exactly what's changed between the two eras, side by side."
        />
        <BookmarkButton sectionId="compare" />
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table className="compare-table" style={{ minWidth: 600 }}>
          <thead>
            <tr>
              <th
                style={{
                  background: 'var(--card-bg)',
                  color: 'var(--text3)',
                  width: 120,
                }}
              >
                Aspect
              </th>
              <th
                style={{
                  background: 'var(--bg3)',
                  color: 'var(--text2)',
                  width: '38%',
                }}
              >
                2025 Car
              </th>
              <th
                style={{
                  background: '#1a0505',
                  color: '#e10600',
                  width: '38%',
                }}
              >
                2026 Car
              </th>
            </tr>
          </thead>
          <tbody>
            {CAR_COMPARE.map((row) => (
              <tr key={row.aspect}>
                <td>
                  <div style={{ fontSize: 16, marginBottom: 3 }}>
                    {row.icon}
                  </div>
                  <div className="compare-aspect">{row.aspect}</div>
                </td>
                <td
                  style={{
                    borderLeft: '1px solid var(--border)',
                    background:
                      row.winner === 2025
                        ? 'rgba(0,220,120,0.04)'
                        : 'transparent',
                  }}
                >
                  {row.winner === 2025 && (
                    <span
                      className="compare-badge"
                      style={{
                        background: 'rgba(0,220,120,0.15)',
                        color: '#00dc78',
                        border: '1px solid rgba(0,220,120,0.3)',
                      }}
                    >
                      BETTER
                    </span>
                  )}
                  <div
                    style={{
                      whiteSpace: 'pre-line',
                      color: 'var(--text2)',
                      fontSize: 12,
                      lineHeight: 1.7,
                    }}
                  >
                    {row.col2025}
                  </div>
                </td>
                <td
                  style={{
                    borderLeft: '1px solid var(--border)',
                    background:
                      row.winner === 2026
                        ? 'rgba(225,6,0,0.04)'
                        : 'transparent',
                  }}
                >
                  {row.winner === 2026 && (
                    <span
                      className="compare-badge"
                      style={{
                        background: 'rgba(225,6,0,0.12)',
                        color: '#e10600',
                        border: '1px solid rgba(225,6,0,0.3)',
                      }}
                    >
                      NEW ERA
                    </span>
                  )}
                  <div
                    style={{
                      whiteSpace: 'pre-line',
                      color: row.winner === 2026 ? '#fff' : '#aaa',
                      fontSize: 12,
                      lineHeight: 1.7,
                    }}
                  >
                    {row.col2026}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div
        className="card"
        style={{ marginTop: 20, borderLeft: '3px solid #e10600' }}
      >
        <div
          style={{
            fontFamily: 'Orbitron',
            fontSize: 10,
            color: '#e10600',
            letterSpacing: 2,
            marginBottom: 8,
          }}
        >
          THE BIG PICTURE
        </div>
        <p
          style={{
            fontSize: 13,
            color: 'var(--text2)',
            lineHeight: 1.8,
          }}
        >
          The 2026 regulations represent the most ambitious overhaul in F1
          history. The shift to 50/50 electric/combustion power, the removal of
          DRS, active aerodynamics, and the arrival of Audi and Ford all happen
          simultaneously. Every team starts from scratch. History shows that
          regulation resets create new winners — 2026 could change everything.
        </p>
      </div>
    </div>
  );
}
