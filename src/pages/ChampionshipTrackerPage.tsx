import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { ChampionshipTracker } from '../components/charts/ChampionshipTracker';

export default function ChampionshipTrackerPage() {
  return (
    <div className="section-enter">
      <div className="section-header">
        <SectionHeader
          title="Championship"
          accent="Tracker"
          group="Race & Stats"
          icon="📈"
          intro="See how the World Drivers' Championship unfolded round by round. Select a season to relive the battle."
        />
        <BookmarkButton sectionId="championship-tracker" />
      </div>
      <ChampionshipTracker />
    </div>
  );
}
