import { TrendingUp } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ChampionshipTracker } from '../components/charts/ChampionshipTracker';
import styles from './ChampionshipTrackerPage.module.css';
import { PageReveal } from '../components/ui/PageReveal';

export default function ChampionshipTrackerPage() {
  return (
    <PageReveal className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="Championship"
          accent="Tracker"
          group="Race & Stats"
          icon={TrendingUp}
          intro="See how the World Drivers' Championship unfolded round by round. Select a season to relive the battle."
        />
        <BookmarkButton sectionId="championship-tracker" />
      </div>
      <ChampionshipTracker />
    </PageReveal>
  );
}
