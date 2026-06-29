import { Award } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { POINTS_DATA, CHAMPIONSHIP_HISTORY } from '../data/records';
import styles from './PointsSystemPage.module.css';

export default function PointsSystemPage() {
  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Points"
          accent="System"
          group="Learn the Basics"
          icon={Award}
          intro="Points are awarded to the top 10 finishers in every race. The driver and constructor with the most points at the end of the season win the championship."
        />
        <BookmarkButton sectionId="points" />
      </div>

      <div className={styles.pointsWrap}>
        <div>
          <table className={styles.pointsTable}>
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
                      className={[
                        styles.posBadge,
                        row.pos === 1
                          ? styles.posBadgeP1
                          : row.pos === 2
                          ? styles.posBadgeP2
                          : row.pos === 3
                          ? styles.posBadgeP3
                          : '',
                      ].join(' ')}
                    >
                      {row.pos}
                    </span>
                  </td>
                  <td
                    className={styles.pointsValue}
                    data-top={row.pos <= 3}
                  >
                    {row.points}
                  </td>
                  <td className={styles.pointsNote}>
                    {row.pos === 1 ? '+1 fastest lap' : '—'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className={styles.infoCard}>
            <p className={styles.infoText}>
              <strong>Sprint races</strong> award half points — 8 down to 1
              for the top 8 finishers. Sprint Qualifying sets the sprint grid
              separately from the main race.
            </p>
          </div>
        </div>

        <div>
          <div className={styles.sectionTitle}>
            Championship <span>Winners</span>
          </div>
          <div className={styles.sectionLine} />
          <table className={styles.champTable}>
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
                  <td className={styles.champYear}>{row.year}</td>
                  <td
                    className={[
                      styles.champDriver,
                      row.driver.includes('Verstappen')
                        ? styles.gold
                        : styles.silver,
                    ].join(' ')}
                  >
                    {row.driver}
                  </td>
                  <td className={styles.champTeam}>{row.team2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
