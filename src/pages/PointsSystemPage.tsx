import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { POINTS_DATA, CHAMPIONSHIP_HISTORY } from '../data/records';

export default function PointsSystemPage() {
  return (
    <div>
      <div className="section-header">
        <SectionHeader
          title="Points"
          accent="System"
          group="Learn the Basics"
          icon="📊"
          intro="Points are awarded to the top 10 finishers in every race. The driver and constructor with the most points at the end of the season win the championship."
        />
        <BookmarkButton sectionId="points" />
      </div>

      <div className="points-wrap">
        <div>
          <table className="points-table">
            <thead>
              <tr>
                <th>Position</th>
                <th>Points</th>
                <th>Note</th>
              </tr>
            </thead>
            <tbody>
              {POINTS_DATA.map((row) => (
                <tr key={row.pos}>
                  <td>
                    <span
                      className={`pos-badge${
                        row.pos === 1
                          ? ' p1'
                          : row.pos === 2
                          ? ' p2'
                          : row.pos === 3
                          ? ' p3'
                          : ''
                      }`}
                    >
                      {row.pos}
                    </span>
                  </td>
                  <td
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 700,
                      color: row.pos <= 3 ? '#e10600' : '#ccc',
                    }}
                  >
                    {row.points}
                  </td>
                  <td style={{ fontSize: 10, color: 'var(--text3)' }}>
                    {row.pos === 1 ? '+1 fastest lap' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="card" style={{ marginTop: 12 }}>
            <p
              style={{
                fontSize: 12,
                color: 'var(--text2)',
                lineHeight: 1.7,
              }}
            >
              <strong style={{ color: '#e10600' }}>Sprint races</strong> award
              half points — 8 down to 1 for the top 8 finishers. Sprint
              Qualifying sets the sprint grid separately from the main race.
            </p>
          </div>
        </div>

        <div>
          <div
            className="section-title"
            style={{
              fontSize: 'clamp(13px,3vw,18px)',
              marginBottom: 8,
            }}
          >
            Championship <span>Winners</span>
          </div>
          <div className="section-line" />
          <table className="champ-table">
            <thead>
              <tr>
                <th>Year</th>
                <th>Driver</th>
                <th>Constructors'</th>
              </tr>
            </thead>
            <tbody>
              {CHAMPIONSHIP_HISTORY.map((row) => (
                <tr key={row.year}>
                  <td
                    style={{
                      fontFamily: 'Orbitron',
                      fontWeight: 700,
                      color: '#e10600',
                      fontSize: 11,
                    }}
                  >
                    {row.year}
                  </td>
                  <td
                    className={
                      row.driver.includes('Verstappen') ? 'gold' : 'silver'
                    }
                  >
                    {row.driver}
                  </td>
                  <td style={{ fontSize: 10, color: 'var(--text2)' }}>
                    {row.team2}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
